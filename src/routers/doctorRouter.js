const express = require('express');
const authentication = require('../middlewares/authentication');
const DoctorController = require('../controllers/doctorController');
const doctorRouter = express.Router();

doctorRouter.use(authentication)
doctorRouter.get('/', DoctorController.GetAllDoctors);
doctorRouter.get('/:id', DoctorController.GetDoctorByID);

module.exports = doctorRouter;