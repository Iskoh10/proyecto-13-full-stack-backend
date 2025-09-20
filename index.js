require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mainRouter = require('./src/api/routes/main');
const { connectDB } = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');
const cookieParser = require('cookie-parser');
const { stripeWebhookHandler } = require('./src/webhooks/stripe.webhook');
const paymentRouter = require('./src/api/routes/payments.routes');

const app = express();

connectCloudinary();
connectDB();

app.post(
  '/api/v1/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use('/api/v1', mainRouter);
app.use('/api/payments', paymentRouter);

app.use('/', (req, res, next) => {
  return res.status(404).json('Route not found');
});

app.listen(3000, () => {
  console.log('Levantado en http://localhost:3000');
});
