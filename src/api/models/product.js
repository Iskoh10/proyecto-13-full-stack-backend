const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nameProduct: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    productImage: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'users' },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    available: { type: Boolean, default: true },
    typeProduct: {
      type: String,
      required: true,
      enum: ['panaderia', 'bolleria', 'pasteleria']
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        value: { type: Number, min: 1, max: 5 }
      }
    ]
  },
  {
    timestamps: true
  }
);

productSchema.index({ nameProduct: 'text' });
productSchema.index({ price: 1 });

const Product = new mongoose.model('products', productSchema, 'products');

module.exports = Product;
