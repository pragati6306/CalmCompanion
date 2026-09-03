const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ['medicine', 'task'], default: 'task' },
    enabled: { type: Boolean, default: true },
    createdAt: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

reminderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Reminder', reminderSchema);
