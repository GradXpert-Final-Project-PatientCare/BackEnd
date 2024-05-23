const express = require('express');
const cors = require('cors')
const app = express();
const router = require('./routers');
const port = 3000;

app.use(cors())
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(router);

module.exports = app
