const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  date: Date,
  notes: String,
  rating: String
});

module.exports = mongoose.model('Event', schema);