const { Doctor, User, Appointment } = require("../models");

class AppointmentController {
  static GetUserAppointment(req, res) {
    let authenticatedUser = res.locals.user;

    Appointment.findAll({
      where: {
        UserId: authenticatedUser.id,
      },
      include: [Doctor, User],
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static async CreateAppointment(req, res) {
    try {
      let UserId = res.locals.user.id;
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
    let authenticatedUser = res.locals.user;
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
    let authenticatedUser = res.locals.user;

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
