const {
  Timeslot,
  Doctor,
  User,
  Appointment,
  Transaction,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const midtransClient = require("midtrans-client");
require('dotenv').config()

class TransactionController {
  static async CreateTransaction(req, res, next) {
    if (!req.ability.can("create", "Transaction")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let UserId = req.user.id;
      const { TimeslotId, keterangan } = req.body;

      let trx = await Transaction.findOne({
        where: {
          TimeslotId,
          UserId,
          status: "pending",
        },
      });

      if (trx) {
        res.status(201).json({
          status: 200,
          message: "Successfully create transaction",
          data: trx.token,
        });
        return;
      }

      let slot = await Timeslot.findOne({
        where: {
          id: TimeslotId,
        },
        include: { all: true, nested: true },
      });

      if (!slot) {
        const error = new Error(`Timeslot requested not found`);
        error.status = 404;
        return next(error);
      }

      if (slot.slotTersedia <= 0) {
        const error = new Error(`Timeslot quota already full`);
        error.status = 409;
        return next(error);
      }

      const sisaKuota = slot.slotTersedia - 1;
      const t = await sequelize.transaction();
      let transactionToken;

      try {
        slot.set({
          slotTersedia: sisaKuota,
        });

        await slot.save({ transaction: t });

        const transact = await Transaction.create(
          {
            UserId,
            DoctorId: slot.Schedule.Doctor.id,
            TimeslotId,
            keterangan,
            status: "pending",
          },
          { transaction: t }
        );

        let snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_KEY,
        });

        let parameter = {
          transaction_details: {
            order_id: transact.id,
            gross_amount: 50000,
          },
          credit_card: {
            secure: true,
          },
        };

        const transaction = await snap.createTransaction(parameter);
        transactionToken = transaction.token;

        await Transaction.update(
          { token: transactionToken },
          {
            where: { id: transact.id },
            transaction: t,
          }
        );

        await t.commit();
      } catch (error) {
        await t.rollback();
        const err = new Error(`Transaction Failed`);
        err.status = 422;
        return next(err);
      }

      res.status(201).json({
        status: 200,
        message: "Successfully create transaction",
        data: transactionToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async MidtransWebhook(req, res, next) {
    const statusResponse = req.body;

    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );

    try {
      if (!orderId) {
        const error = new Error(`Order Id invalid`);
        error.status = 404;
        throw error;
      }

      let trx = await Transaction.findOne({
        where: {
          id: orderId,
        },
      });

      if (!trx) {
        const error = new Error(`Transaction requested not found`);
        error.status = 404;
        throw error;
      }

      if (transactionStatus == "settlement" && fraudStatus == "accept") {
        await Appointment.create({
          UserId: trx.UserId,
          DoctorId: trx.DoctorId,
          TimeslotId: trx.TimeslotId,
          status: "dipesan",
          keterangan: trx.keterangan,
        });
        trx.status = "success"
        await trx.save()
        return res.status(200).json({ message: "Payment Success" });
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire" ||
        transactionStatus == "failure" ||
        fraudStatus == "deny"
      ) {
        let slot = await Timeslot.findOne({
          where: {
            id: trx.TimeslotId,
          },
        });
        const sisaKuota = slot.slotTersedia + 1;
        slot.set({
          slotTersedia: sisaKuota,
        });
        await slot.save();
        trx.status = "failed"
        await trx.save()
        return res.status(200).json({ message: "Payment Failed" });
      }

      return res.status(200).json({ message: "do nothing" });
    } catch (error) {
      return res.status(200).json({ message: error.message });
    }
  }
}

module.exports = TransactionController;
