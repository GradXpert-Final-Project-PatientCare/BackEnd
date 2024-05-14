const express = require('express');
const authentication = require('../middlewares/authentication');
const UserController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.post('/register', UserController.Register);
userRouter.post('/login', UserController.Login);

userRouter.use(authentication)
userRouter.get('/profile', UserController.Profile);

module.exports = userRouter;