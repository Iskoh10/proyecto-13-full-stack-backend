const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    target: {
      type: String,
      enum: ['Product', 'Workshop', 'Blog', 'Comment'],
      required: true
    },
    eventId: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: 'target'
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }]
  },
  {
    timestamps: true
  }
);

commentSchema.index({ text: 'text' });

const Comment = mongoose.model('comments', commentSchema, 'comments');

module.exports = Comment;
