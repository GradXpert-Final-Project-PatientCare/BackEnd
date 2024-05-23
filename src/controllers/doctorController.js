const { Doctor } = require("../models");
const { Op } = require("sequelize");

class DoctorController {
  static async GetAllDoctors(req, res, next) {
    if (!req.ability.can("read", "Doctor")) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      const { page, search } = req.query;
      const paramQuerySQL = {};

      const size = 5;
      const skip = ((page ?? 1) - 1) * size;

      // pagination
      paramQuerySQL.limit = size;
      paramQuerySQL.offset = skip;

      //search
      if (search) {
        paramQuerySQL.where = { nama: { [Op.iLike]: `%${search}%` } };
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
    if (!req.ability.can("read", "Doctor")) {
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

      res.status(200).json({
        status: 200,
        message: `Successfully retrieve doctor with id ${id}`,
        data: doctor,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = DoctorController;
