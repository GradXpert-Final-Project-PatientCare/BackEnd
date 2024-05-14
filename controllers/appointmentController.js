const { Doctor, User, Appointment } = require("../models");

class AppointmentController {
  static async GetUserAppointment(req, res) {
    if (!req.ability.can('read', 'Doctor')) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let authenticatedUser = req.user;
      let appointments = await Appointment.findAll({
        where: {
          UserId: authenticatedUser.id,
        },
        include: [Doctor, User],
      })

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve appointment list",
        data: appointments,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async CreateAppointment(req, res) {
    try {
      let UserId = req.user.id;
      const { DoctorId, waktu, keterangan } = req.body;

      let result = await Appointment.create({
        DoctorId,
        UserId,
        waktu,
        keterangan,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ code: 500, message: [error.name] });
    }
  }

  static async UpdateAppointmentById(req, res) {
    let id = +req.params.id;
    let authenticatedUser = req.user;
    const { waktu, keterangan } = req.body;

    try {
      let getAppointment = await Appointment.findByPk(id);

      if (!getAppointment) {
        throw { name: "appointment not found" };
      }

      if (getAppointment.UserId !== authenticatedUser.id) {
        throw { name: "unauthorized" };
      }

      getAppointment.set({
        waktu,
        keterangan,
      });

      let result = await getAppointment.save();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ code: 500, message: [error.name] });
    }
  }

  static async DeleteAppointmentByID(req, res) {
    let id = +req.params.id;
    let authenticatedUser = req.user;

    try {
      let getAppointment = await Appointment.findByPk(id);

      if (!getAppointment) {
        throw { name: "appointment not found" };
      }

      if (getAppointment.UserId !== authenticatedUser.id) {
        throw { name: "unauthorized" };
      }

      let result = await getAppointment.destroy();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ code: 500, message: [error.name] });
    }
  }
}

module.exports = AppointmentController;
