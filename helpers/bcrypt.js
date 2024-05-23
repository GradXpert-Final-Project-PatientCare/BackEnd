const bcrypt = require('bcrypt')
require('dotenv').config()
const salt = parseInt(process.env.SALT)
const salt_bcrypt = bcrypt.genSaltSync(salt)

function hashPassword(password) {
    return bcrypt.hashSync(password, salt_bcrypt)
}

function comparePassword(passInput, dbPass) {
    return bcrypt.compareSync(passInput, dbPass)
}

module.exports = {
    hashPassword, 
    comparePassword
}