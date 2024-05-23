const jwt = require('jsonwebtoken')
require('dotenv').config()
const PRIVATE_KEY = process.env.SECRET_KEY

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