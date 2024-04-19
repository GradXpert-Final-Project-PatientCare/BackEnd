const router = require('express').Router();
const UserController = require('../controllers/userController');
const DoctorController = require('../controllers/doctorController');
const AppointmentController = require('../controllers/appointmentController');
const authentication = require('../middlewares/authentication');

router.get('/', (req,res) => {
    res.send('Hello World');
});

router.post('/users/register', UserController.Register);

router.post('/users/login', UserController.Login);

router.get('/doctors', DoctorController.GetAllDoctors);

router.get('/doctors/:id', DoctorController.GetDoctorByID);

router.use(authentication);

router.get('/myappointment', AppointmentController.GetUserAppointment);

router.post('/appointments', AppointmentController.CreateAppointment);

router.patch('/appointments/:id', AppointmentController.UpdateAppointmentById);

router.delete('/appointments/:id', AppointmentController.DeleteAppointmentByID);

module.exports = router;