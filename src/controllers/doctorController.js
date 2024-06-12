const { Doctor, Schedule } = require("../models");
const { Op } = require("sequelize");

class DoctorController {
  static async GetAllDoctors(req, res, next) {
    try {
      const { page, search, category, sort } = req.query;
      const paramQuerySQL = {};

      const size = 5;
      const skip = ((page ?? 1) - 1) * size;

      // pagination
      paramQuerySQL.limit = size;
      paramQuerySQL.offset = skip;

      // Initialize where clause
      paramQuerySQL.where = {};

      // Add search condition if present
      if (search) {
        paramQuerySQL.where.nama = { [Op.iLike]: `%${search}%` };
      }

      // Add category condition if present
      if (category) {
        paramQuerySQL.where.spesialis = { [Op.eq]: category };
      }

      if (sort && sort === "experience") {
        paramQuerySQL.order = [["experience", "DESC"]];
      } else {
        paramQuerySQL.order = [["nama", "ASC"]];
      }

      let doctors = await Doctor.findAndCountAll(paramQuerySQL);

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve doctors",
        data: doctors,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async GetDoctorByID(req, res, next) {
    try {
      let id = +req.params.id;
      let doctor = await Doctor.findOne({ where: { id }, include: [Schedule] });

      if (!doctor) {
        const error = new Error(`Doctor requested not found`);
        error.status = 404;
        return next(error);
      }

      const dataResponse = {
        id: doctor.id,
        nama: doctor.nama,
        spesialis: doctor.spesialis,
        alamatPraktek: doctor.alamatPraktek,
        telepon: doctor.telepon,
        email: doctor.email,
        image_url: doctor.image_url,
        experience: doctor.experience,
        schedule: doctor.Schedules.map((x) => {
          const schedule = {
            id: x.id,
            hari: x.hari,
            waktu: x.waktu,
          };
          return schedule;
        }),
      };

      res.status(200).json({
        status: 200,
        message: `Successfully retrieve doctor with id ${id}`,
        data: dataResponse,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = DoctorController;
