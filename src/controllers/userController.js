const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");
const { defineRulesFor } = require("../helpers/abilities");

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class UserController {
  static async Register(req, res, next) {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      const error = new Error(`Fields cannot be empty`);
      error.status = 400;
      return next(error);
    }

    let o = await User.findOne({ where: { email: email } });
    if (o) {
      // Record Found
      const error = new Error(`email already taken`);
      error.status = 409;
      return next(error);
    }

    if (!emailRegexp.test(email)) {
      const error = new Error(`invalid email format`);
      error.status = 409;
      return next(error);
    }

    await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({ message: "Register account success" });
  }

  static async Login(req, res, next) {
    const { email, password } = req.body;
    if (!password || !email) {
      const error = new Error(`Fields cannot be empty`);
      error.status = 400;
      return next(error);
    }

    let user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const error = new Error(`Invalid email or password`);
      error.status = 401;
      return next(error);
    }

    const isCorrect = comparePassword(password, user.password);
    if (!isCorrect) {
      const error = new Error(`Invalid email or password`);
      error.status = 401;
      return next(error);
    }

    const token = generateToken({
      id: user.id,
      email: user.email
    });

    res.status(200).json({
      accessToken: token,
      email: email,
      username: user.username,
      rules: defineRulesFor(user),
    });
  }

  static async Profile (req, res, next) {
    if (!req.ability.can('read', 'User')) {
      const error = new Error(`Forbidden resource`);
      error.status = 403;
      return next(error);
    }
    try {
      let authenticatedUser = req.user;
      let user = await User.findOne({
        where: {
          id: authenticatedUser.id,
        },
      });

      if (!user) {
        const error = new Error(`User requested not found`);
        error.status = 404;
        return next(error);
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieve user profile",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserController;
