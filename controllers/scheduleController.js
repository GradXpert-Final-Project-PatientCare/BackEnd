const { Schedule, Doctor } = require("../models");

class ScheduleController {
  static async GetScheduleByDoctorId(req, res, next) {
    if (!req.ability.can("read", "Schedule")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let id = +req.params.id;
      let schedules = await Schedule.findAll({
        where: {
          DoctorId: id,
        },
        include: [Doctor],
      });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve schedule for requested doctor",
        data: schedules,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async CreateSchedule(req, res, next) {
    if (!req.ability.can("create", "Schedule")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      const { DoctorId, kuota, hari, waktu } = req.body;

      let doctor = await Doctor.findByPk(DoctorId);

      if (!doctor) {
        const error = new Error(`Doctor requested not found`);
        error.status = 404;
        return next(error);
      }

      await Schedule.create({
        DoctorId,
        kuota,
        hari,
        waktu,
      });

      res.status(200).json({
        status: 200,
        message: "Successfully create schedule",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

module.exports = ScheduleController;
