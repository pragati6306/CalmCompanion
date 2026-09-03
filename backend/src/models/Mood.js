const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    note: { type: String, default: '' },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

moodSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Mood', moodSchema);
