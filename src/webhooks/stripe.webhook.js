const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../api/models/order');
const Product = require('../api/models/product');

const stripeWebhookHandler = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).json({
      message: `Error en la verificación de la firma ${error.message}`
    });
  }

  let session;

  if (event.type === 'checkout.session.completed') {
    session = event.data.object;
  } else {
    return res.status(200).json({ received: true });
  }

  try {
    const order = await Order.findOne({ stripeSessionId: session.id });

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { stock: -item.quantity }
        },
        { new: true }
      );
    }
  } catch (error) {
    console.error('Error procesando la sesión de pago:', error);
  }
  res.status(200).json({ received: true });
};

module.exports = { stripeWebhookHandler };
