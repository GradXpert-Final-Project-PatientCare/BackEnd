const express = require('express');
const DoctorController = require('../controllers/doctorController');
const doctorRouter = express.Router();

doctorRouter.get('/', DoctorController.GetAllDoctors);
doctorRouter.get('/:id', DoctorController.GetDoctorByID);

module.exports = doctorRouter;