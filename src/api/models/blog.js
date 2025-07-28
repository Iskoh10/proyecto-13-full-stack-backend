const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    image: [{ type: String, required: true }],
    summary: { type: String, required: true },
    available: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

blogSchema.index({ summary: 'text' });

const Blog = mongoose.model('blogs', blogSchema, 'blogs');

module.exports = Blog;
