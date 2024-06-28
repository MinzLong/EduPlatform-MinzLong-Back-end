const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
