const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    deliveryDate: { type: Date, required: true },
    items: [
      {
        product: { type: mongoose.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true }
      }
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'cancelled'],
      default: 'pending',
      required: true
    },
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ status: 'text' });

const Order = mongoose.model('orders', orderSchema, 'orders');

module.exports = Order;
