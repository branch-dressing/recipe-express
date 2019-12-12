const mongoose = require('mongoose');
const router = require('../routes/events');
const request = require('supertest');
const app = require('../app');

const ingredientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  measurements: {
    type: String,
    required: true,
  }
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  directions: [String],
  ingredients: [ingredientsSchema]
});

schema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'recipeId'
});

module.exports = mongoose.model('Recipe', schema);
