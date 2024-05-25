const { Timeslot, Schedule, Doctor } = require("../models");
const { Op } = require("sequelize");

class TimeslotController {
  static async GetTimeslotByDoctorId(req, res, next) {
    if (!req.ability.can("read", "Timeslot")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let id = +req.params.id;
      let doctor = await Doctor.findByPk(id);

      if (!doctor) {
        const error = new Error(`Doctor requested not found`);
        error.status = 404;
        return next(error);
      }

      const TODAY_START = new Date().setHours(0, 0, 0, 0);

      let timeslots = await Timeslot.findAll({
        where: {
          "$Schedule.DoctorId$": { [Op.eq]: id },
          tanggal: {
            [Op.gt]: TODAY_START,
          },
        },
        include: [Schedule],
      });

      const dataResponse = timeslots.map((x) => {
        const response = {
          id: x.id,
          kuota: x.slotTersedia,
          tanggal: x.tanggal,
          hari: x.Schedule.hari,
          waktu: x.Schedule.waktu,
        };
        return response;
      });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve schedule for requested doctor",
        data: dataResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async GenerateTimeslot(req, res, next) {
    if (!req.ability.can("create", "Timeslot")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      const { DoctorId, month, year } = req.body;
      let firstDay = new Date(year, month - 1, 1);
      let lastDay = new Date(year, month, 0);
      let id = DoctorId;
      let doctor = await Doctor.findByPk(id);

      if (!doctor) {
        const error = new Error(`Doctor requested not found`);
        error.status = 404;
        return next(error);
      }

      let timeslots = await Timeslot.findAll({
        where: {
          "$Schedule.DoctorId$": { [Op.eq]: id },
          tanggal: {
            [Op.between]: [firstDay, lastDay],
          },
        },
        include: [Schedule],
      });

      if (timeslots.length > 0) {
        const error = new Error(`Timeslot for this month already generated`);
        error.status = 409;
        return next(error);
      }

      let schedules = await Schedule.findAll({
        where: {
          DoctorId: id,
        },
        include: [Doctor],
      });

      const dayList = schedules.map((x) => x.hari);
      const uniqueDayList = dayList.filter(
        (value, index, array) => array.indexOf(value) === index
      );

      const weekday = [
        "minggu",
        "senin",
        "selasa",
        "rabu",
        "kamis",
        "jumat",
        "sabtu",
      ];
      const listDates = [];

      for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        // your day is here
        const dayName = weekday[day.getDay()];
        if (uniqueDayList.includes(dayName))
          listDates.push({
            tanggal: new Date(day),
            hari: dayName,
          });
      }

      const listTimeslot = [];

      for (const date of listDates) {
        const listSchedule = schedules.filter((x) => x.hari === date.hari);
        for (const schedule of listSchedule) {
          listTimeslot.push({
            scheduleId: schedule.id,
            tanggal: date.tanggal,
            slotTersedia: schedule.kuota,
          });
        }
      }

      for (const slot of listTimeslot) {
        await Timeslot.create({
          ScheduleId: slot.scheduleId,
          tanggal: slot.tanggal,
          slotTersedia: slot.slotTersedia,
        });
      }

      res.status(200).json({
        status: 200,
        message: "Successfully generate timeslots",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = TimeslotController;
