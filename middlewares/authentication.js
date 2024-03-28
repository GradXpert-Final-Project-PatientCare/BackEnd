const { User } = require('../models')
const { verifyToken } = require("../helpers/jwt")

async function authentication(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) throw ({ name: 'Authentication Error' });

        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];

        if (!bearerToken) throw ({ name: "AuthenticationError" })

        const userDecoded = verifyToken(bearerToken);
        
        const user = await User.findOne({
            where:{
                id: userDecoded.id,
                email: userDecoded.email
            }
        })
        // console.log('user>>',user)
        if (!user) throw ({ name: "AuthenticationError" })
        res.locals.user = user;
        next()
    } catch (error) {
        res.status(401).json({ code: 401, message: [error.name] })
    }
}

module.exports = authentication