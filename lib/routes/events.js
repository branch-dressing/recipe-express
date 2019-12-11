const { Router } = require('express');
const Event = require('../models/Event');
const router = Router;

module.exports = router()
  .post('/api/v1/events', (req, res) => {
    Event
      .create(req.body)
      .then(event => res.send(event));
  })
  .get('/api/v1/events', (req, res) => {
    Event
      .find()
      .select({ recipeId: true })
      .then(events => res.send(events));
  })
  .get('/api/v1/events/:id', (req, res) => {
    Event
      .findById(req.params.id)
      .then(event => res.send(event));
  })
  .patch('/api/v1/events/:id', (req, res) => {
    Event
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(event => res.send(event));
  })
  .delete('/api/v1/events/:id', (req, res) => {
    Event
      .findByIdAndDelete(req.params.id)
      .then(event => res.send(event));
  });