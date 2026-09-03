const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    caption: { type: String, default: '' },
    photoBase64: { type: String, default: null },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

memorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Memory', memorySchema);
