const { createCheckoutSession } = require('../../services/stripe.service');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

const postCheckoutSession = async (req, res, next) => {
  try {
    const { cart, email, notes } = req.body;

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * (item.qty ?? 1),
      0
    );

    const user = await User.findOne({ email });

    const order = await Order.create({
      customer: user._id,
      deliveryDate: new Date(),
      items: cart.map((item) => ({
        product: item._id,
        quantity: item.qty ?? 1
      })),
      totalPrice,
      status: 'pending',
      notes: notes
    });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const session = await createCheckoutSession({
      cart,
      customerEmail: email,
      successUrl: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
      cancelUrl: `${process.env.FRONTEND_URL}/products`
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.status(200).json({ id: session.id, orderId: order._id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'No se pudo crear la sesión de pago.' });
  }
};

module.exports = { postCheckoutSession };
