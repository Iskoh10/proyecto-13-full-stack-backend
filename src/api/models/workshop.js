const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    eventDate: { type: Date, required: true },
    image: { type: String, required: true },
    fileUrl: { type: String, required: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    available: { type: Boolean, default: true },
    capacity: { type: Number, required: true },
    attendees: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
  },
  {
    timestamps: true
  }
);

workshopSchema.index({ title: 'text' });

const Workshop = mongoose.model('workshops', workshopSchema, 'workshops');

module.exports = Workshop;
