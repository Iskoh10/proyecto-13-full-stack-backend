const { postCheckoutSession } = require('../controllers/payments.controller');

const paymentRouter = require('express').Router();

paymentRouter.post('/checkout-session', postCheckoutSession);

module.exports = paymentRouter;
