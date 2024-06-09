const express = require('express');
const authentication = require('../middlewares/authentication');
const TransactionController = require('../controllers/transactionController');
const transactionRouter = express.Router();

transactionRouter.post('/midtrans-webhook', TransactionController.MidtransWebhook);
transactionRouter.use(authentication)
transactionRouter.post('/create', TransactionController.CreateTransaction);

module.exports = transactionRouter;