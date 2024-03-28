const jwt = require('jsonwebtoken')
const PRIVATE_KEY = 'inirahasia'

function generateToken(data) {
    return jwt.sign(data, PRIVATE_KEY)
}

function verifyToken(token) {
    return jwt.verify(token, PRIVATE_KEY)
}

module.exports = {
    generateToken,
    verifyToken
}