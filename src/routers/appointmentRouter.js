const express = require('express');
const authentication = require('../middlewares/authentication');
const AppointmentController = require('../controllers/appointmentController');
const appointmentRouter = express.Router();

appointmentRouter.use(authentication)
appointmentRouter.get('/list', AppointmentController.GetUserAppointment);
appointmentRouter.get('/history', AppointmentController.GetUserAppointmentHistory);
appointmentRouter.patch('/update/:id', AppointmentController.UpdateAppointmentById);
appointmentRouter.patch('/cancel/:id', AppointmentController.CancelAppointmentByID);
appointmentRouter.patch('/complete/:id', AppointmentController.CompleteAppointmentByID);

module.exports = appointmentRouter;