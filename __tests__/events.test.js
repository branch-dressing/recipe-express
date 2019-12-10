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

  it.skip('gets all events', async() => {
    const events = await Event.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual({
            _id: event._id.toString(),
            name: event.name
          });
        });
      });
  });

  it.skip('updates a event by id', async() => {
    const event = await Event.create({
    });

    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it.skip('can get a single event', async() => {
    const event = await Event.create({
    });

    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it.skip('can delete a event', async() => {
    const event = await Event.create({
    });
    return request(app)
      .del(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          __v: 0
        });
      });
  });
});
