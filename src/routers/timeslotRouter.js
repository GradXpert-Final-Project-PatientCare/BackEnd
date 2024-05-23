const express = require('express');
const authentication = require('../middlewares/authentication');
const TimeslotController = require('../controllers/timeslotController');
const timeslotRouter = express.Router();

timeslotRouter.use(authentication)
timeslotRouter.get('/:id', TimeslotController.GetTimeslotByDoctorId);
timeslotRouter.post('/generate', TimeslotController.GenerateTimeslot);

module.exports = timeslotRouter;