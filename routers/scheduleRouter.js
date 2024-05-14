const express = require('express');
const authentication = require('../middlewares/authentication');
const ScheduleController = require('../controllers/scheduleController');
const scheduleRouter = express.Router();

scheduleRouter.use(authentication)
scheduleRouter.get('/:id', ScheduleController.GetScheduleByDoctorId);
scheduleRouter.post('/create', ScheduleController.CreateSchedule);

module.exports = scheduleRouter;