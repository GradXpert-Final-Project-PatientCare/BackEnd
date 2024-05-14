const express = require('express');
const authentication = require('../middlewares/authentication');
const AppointmentController = require('../controllers/appointmentController');
const appointmentRouter = express.Router();

appointmentRouter.use(authentication)
appointmentRouter.get('/list', AppointmentController.GetUserAppointment);
appointmentRouter.post('/', AppointmentController.CreateAppointment);
appointmentRouter.patch('/:id', AppointmentController.UpdateAppointmentById);
appointmentRouter.delete('/:id', AppointmentController.DeleteAppointmentByID);

module.exports = appointmentRouter;