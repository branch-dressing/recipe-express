const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true
  },
  date: Date,
  notes: String
});

module.exports = mongoose.model('Event', schema);