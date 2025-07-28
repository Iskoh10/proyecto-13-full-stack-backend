const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('users', userSchema, 'users');

module.exports = User;
