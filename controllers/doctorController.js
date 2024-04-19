const { Doctor } = require("../models");

class MovieController {
  static GetAllDoctors(req, res) {
    Doctor.findAll()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static GetDoctorByID(req, res) {
    let id = +req.params.id;
    Doctor.findByPk(id)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
}

module.exports = MovieController;
