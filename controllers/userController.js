const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const { User } = require('../models');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class UserController {
    static async Register(req, res, next) {
        try {
            const { username, email, password, role, address, phoneNumber } = req.body;
            if (!username || !password || !email) throw ({ name: `${!email ? 'email' : !password  ? 'password': 'username'} is null` })

            let o = await User.findOne({where : {email: email}});
            if (o) {
                // Record Found
                throw ({ name: "email must be unique" });
            }
            
            if (!emailRegexp.test(email)){
                throw ({ name: "invalid email format" });
            }

            await User.create({
                username, email, password, role, address, phoneNumber
            })

            res.status(201).json({ message: "Register account success" })
        } catch (error) {
            res.status(500).json({ code: 500, message: [error.name] })
        }
    }

    static async Login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!password || !email) throw ({ name: `${!email ? 'email' : 'password'} is null` });

            if (!emailRegexp.test(email)){
                throw ({ name: "invalid email format" });
            }

            let user = await User.findOne({
                where: {
                    email
                }
            }
            )
            if (!user) throw ({ name: "invalid email" });

            const isCorrect = comparePassword(password, user.password);
            if (!isCorrect) throw ({ name: "invalid password" });

            const token = generateToken({ id: user.id, email: email })
            
            res.status(200).json({ accessToken: token, username: user.username, role: user.role, id: user.id});
        } catch (error) {
            res.status(500).json({ code: 500, message: [error.name] })
        }
    }

}

module.exports = UserController