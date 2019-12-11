require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    mongoose.connection.collections['events'].drop(function() {
      // eslint-disable-next-line no-console
      console.log('collection dropped');
    });
    return mongoose.connection.close();
  });

  it('creates a event', () => {
    const date = new Date;
    return request(app)
      .post('/api/v1/events')
      .send({
        recipeId: '1234',
        date: date,
        notes: 'This is a note',
        rating: 'not good'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: '1234',
          date: date.toISOString(),
          notes: 'This is a note',
          rating: 'not good',
          __v: 0
        });
      });
  });

  it('gets all events', async() => {
    const events = await Event.create([
      { recipeId: '1' },
      { recipeId: '2' },
      { recipeId: '3' }
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual({
            _id: expect.any(String),
            recipeId: event.recipeId,
          });
        });
      });
  });

  it('updates a event by id', async() => {
    const event = await Event.create({
      recipeId: '8888',
      notes: 'This is a good note',
      rating: 'bad'
    });
    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ notes: 'This is a bad note' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: '8888',
          notes: 'This is a bad note',
          rating: 'bad',
          __v: 0
        });
      });
  });

  it('can get a single event', async() => {
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

  it('can delete a event', async() => {
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
