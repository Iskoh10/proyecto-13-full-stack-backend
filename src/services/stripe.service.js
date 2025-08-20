const Product = require('../api/models/product');
const stripe = require('../config/stripe');

const calculateOrderAmount = async (cart) => {
  let total = 0;
  const productIds = cart.map((item) => item._id);
  const products = await Product.find({ _id: { $in: productIds } });

  for (const item of cart) {
    const product = products.find((p) => p._id.toString() === item._id);
    if (product) {
      const unit = product.price;
      total += unit * (item.qty ?? 1);
    }
  }

  return total;
};

const createCheckoutSession = async ({
  cart,
  customerEmail,
  successUrl,
  cancelUrl
}) => {
  const lineItems = [];

  for (const item of cart ?? []) {
    const product = await Product.findById(item._id);
    if (!product) continue;

    const unitAmount = Math.round(product.price * 100);

    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: product.nameProduct },
        unit_amount: unitAmount
      },
      quantity: item.qty ?? 1
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail
    });

    return session;
  } catch (error) {
    throw error;
  }
};

module.exports = { calculateOrderAmount, createCheckoutSession };
