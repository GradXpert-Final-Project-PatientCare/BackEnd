const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");
const { defineAbilityFor } = require("../helpers/abilities");

async function authentication(req, res, next) {
  try {
    const bearerHeader = req.headers["authorization"];

    //split the space at the bearer
    const bearer = bearerHeader.split(" ");
    //Get token from string
    const bearerToken = bearer[1];

    if (!bearerToken) {
      const error = new Error(`Authentication Error`);
      error.status = 401;
      return next(error);
    }

    
    const userDecoded = verifyToken(bearerToken);
    const user = await User.findOne({
      where: {
        id: userDecoded.id,
        email: userDecoded.email,
      },
    });

    if (!user) {
      const error = new Error(`Authentication Error`);
      error.status = 401;
      return next(error);
    }
    
    req.user = user;
    req.ability = defineAbilityFor(user);
    next();
  } catch (err) {
    const error = new Error(`Authentication Error`);
    error.status = 401;
    return next(error);
  }
}

module.exports = authentication;
