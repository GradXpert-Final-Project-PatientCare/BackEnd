const { Timeslot, Doctor, User, Appointment, sequelize } = require("../models");
const { Op } = require("sequelize");

class AppointmentController {
  static async GetUserAppointment(req, res, next) {
    if (!req.ability.can("read", "Doctor")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let authenticatedUser = req.user;
      let appointments = await Appointment.findAll({
        where: {
          UserId: authenticatedUser.id,
          status: 'dipesan'
        },
        include: { all: true, nested: true },
      });

      const dataResponse = appointments.map((x) => {
        const response = {
          id: x.id,
          status: x.status,
          keterangan: x.keterangan,
          tanggal: x.Timeslot.tanggal,
          hari: x.Timeslot.Schedule.hari,
          waktu: x.Timeslot.Schedule.waktu,
          dokter: x.Doctor.nama
        };
        return response;
      });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve appointment list",
        data: dataResponse,
      });
    } catch (error) {
      console.log(error)
      return next(error);
    }
  }

  static async GetUserAppointmentHistory(req, res, next) {
    if (!req.ability.can("read", "Doctor")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let authenticatedUser = req.user;
      let appointments = await Appointment.findAll({
        where: {
          UserId: authenticatedUser.id,
          status: {
            [Op.or]: ['dibatalkan', 'selesai'],
          }
        },
        include: { all: true, nested: true },
      });

      const dataResponse = appointments.map((x) => {
        const response = {
          id: x.id,
          status: x.status,
          keterangan: x.keterangan,
          tanggal: x.Timeslot.tanggal,
          hari: x.Timeslot.Schedule.hari,
          waktu: x.Timeslot.Schedule.waktu,
          dokter: x.Doctor.nama
        };
        return response;
      });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve appointment list",
        data: dataResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async CreateAppointment(req, res, next) {
    try {
      let UserId = req.user.id;
      const { TimeslotId, keterangan } = req.body;

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

      try {
        slot.set({
          slotTersedia: sisaKuota,
        });

        await slot.save({ transaction: t });

        await Appointment.create(
          {
            UserId,
            DoctorId: slot.Schedule.Doctor.id,
            TimeslotId,
            status: "dipesan",
            keterangan,
          },
          { transaction: t }
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
        message: "Successfully create appointment",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async UpdateAppointmentById(req, res, next) {
    let AppointmentId = +req.params.id;
    const { TimeslotId, keterangan } = req.body;

    try {
      let appointment = await Appointment.findOne({
        where: {
          id: AppointmentId,
        },
      });

      if (!appointment) {
        const error = new Error(`Appointment requested not found`);
        error.status = 404;
        return next(error);
      }

      let prevSlot = await Timeslot.findOne({
        where: {
          id: appointment.TimeslotId,
        },
        include: { all: true, nested: true },
      });

      if (!prevSlot) {
        const error = new Error(`Previous timeslot not found`);
        error.status = 404;
        return next(error);
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

      const t = await sequelize.transaction();

      try {
        prevSlot.set({
          slotTersedia: prevSlot.slotTersedia + 1,
        });

        slot.set({
          slotTersedia: slot.slotTersedia - 1,
        });

        appointment.TimeslotId = slot.id;
        if (keterangan) {
          appointment.keterangan = keterangan;
        }

        await prevSlot.save({ transaction: t });
        await slot.save({ transaction: t });
        await appointment.save({ transaction: t });

        await t.commit();
      } catch (error) {
        await t.rollback();
        const err = new Error(`Transaction Failed`);
        err.status = 422;
        return next(err);
      }

      res.status(201).json({
        status: 200,
        message: "Successfully update appointment",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async CancelAppointmentByID(req, res, next) {
    let AppointmentId = +req.params.id;

    try {
      let appointment = await Appointment.findOne({
        where: {
          id: AppointmentId,
        },
      });

      if (!appointment) {
        const error = new Error(`Appointment requested not found`);
        error.status = 404;
        return next(error);
      }

      appointment.status = 'dibatalkan';
      await appointment.save();

      res.status(201).json({
        status: 200,
        message: "Successfully cancel appointment",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async CompleteAppointmentByID(req, res, next) {
    let AppointmentId = +req.params.id;

    try {
      let appointment = await Appointment.findOne({
        where: {
          id: AppointmentId,
        },
      });

      if (!appointment) {
        const error = new Error(`Appointment requested not found`);
        error.status = 404;
        return next(error);
      }

      appointment.status = 'selesai';
      await appointment.save();

      res.status(201).json({
        status: 200,
        message: "Successfully complete appointment",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AppointmentController;
