const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');
const router = Router;

module.exports = router()
  .post('/api/v1/recipes', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })
  .get('/api/v1/recipes', (req, res) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })
  .get('/api/v1/recipes/:id', (req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Event.find({ recipeId: req.params.id })
    ])
      .then(([recipe, events]) => {
        res.send({ ...recipe.toJSON(), events })});
  })
  .patch('/api/v1/recipes/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })
  .delete('/api/v1/recipes/:id', (req, res) => {
    Recipe
      .findByIdAndDelete(req.params.id)
      .then(recipe => res.send(recipe));
  });