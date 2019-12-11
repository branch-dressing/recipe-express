require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');
const Recipe = require('../lib/models/Recipe');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });
  
  let testsRecipe;
  beforeEach(async() => {
    testsRecipe = await Recipe.create({
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    mongoose.connection.collections['events'].drop(function() {
      // eslint-disable-next-line no-console
      console.log('collection dropped');
    });
    return mongoose.connection.close();
  });

  it('creates a event', async() => {
    const date = new Date;
    return request(app)
      .post('/api/v1/events')
      .send({
        recipeId: testsRecipe._id,
        date: date,
        notes: 'This is a note',
        rating: 'not good'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: testsRecipe._id.toString(),
          date: date.toISOString(),
          notes: 'This is a note',
          rating: 'not good',
          __v: 0
        });
      });
  });

  it('gets all events', async() => {
    const events = await Event.create([
      { recipeId: testsRecipe._id },
      { recipeId: testsRecipe._id },
      { recipeId: testsRecipe._id }
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(() => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            recipeId: testsRecipe._id.toString(),
          });
        });
      });
  });

  it('updates a event by id', async() => {
    const event = await Event.create({
      recipeId: testsRecipe._id,
      notes: 'This is a good note',
      rating: 'bad'
    });
    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ notes: 'This is a bad note' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: testsRecipe._id.toString(),
          notes: 'This is a bad note',
          rating: 'bad',
          __v: 0
        });
      });
  });

  it.skip('can get a single event', async() => {
    const event = await Event.create({
      recipeId: 'Poop',
      notes: 'Notes',
      rating: 'Yep'
    });

    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: 'Poop',
          notes: 'Notes',
          rating: 'Yep',
          __v: 0
        });
      });
  });

  it.skip('can delete a event', async() => {
    const event = await Event.create({
      recipeId: '31',
      notes: 'ugh',
      rating: '5'
    });
    return request(app)
      .del(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          recipeId: '31',
          notes: 'ugh',
          rating: '5',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
});
