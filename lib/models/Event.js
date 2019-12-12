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

schema.virtual('month')
  .get(function() {
    const monthNumber = this.date.getUTCMonth();
    if (monthNumber === 0) return 'Jan';
    if (monthNumber === 1) return 'Feb';
    if (monthNumber === 2) return 'March';
    if (monthNumber === 3) return 'April';
    if (monthNumber === 4) return 'May';
    if (monthNumber === 5) return 'June';
    if (monthNumber === 6) return 'July';
    if (monthNumber === 7) return 'Aug';
    if (monthNumber === 8) return 'Sept';
    if (monthNumber === 9) return 'Oct';
    if (monthNumber === 10) return 'Nov';
    if (monthNumber === 11) return 'Dec';
  });

schema.virtual('year')
  .get(function() {
    return this.date.getUTCFullYear();
  });

module.exports = mongoose.model('Event', schema);