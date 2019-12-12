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

schema.virtual('weekDay')
  .get(function() {
    const dayNumber = this.date.getUTCDay();
    if (dayNumber === 0) return 'Sunday';
    if (dayNumber === 1) return 'Monday';
    if (dayNumber === 2) return 'Tuesday';
    if (dayNumber === 3) return 'Wednesday';
    if (dayNumber === 4) return 'Thursday';
    if (dayNumber === 5) return 'Friday';
    if (dayNumber === 6) return 'Saturday';
  });

schema.virtual('day')
  .get(function() {
    return this.date.getUTCDate();
  });

module.exports = mongoose.model('Event', schema);