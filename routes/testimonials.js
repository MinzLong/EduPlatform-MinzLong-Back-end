const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('user', 'email');
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new testimonial
router.post('/', async (req, res) => {
  const testimonial = new Testimonial({
    user: req.body.user,
    userEmail: req.body.userEmail,
    message: req.body.message
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a testimonial
router.patch('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });

    if (req.body.message != null) {
      testimonial.message = req.body.message;
    }

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a testimonial
router.delete('/:id', async (req, res) => {
  try {
    const result = await Testimonial.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
