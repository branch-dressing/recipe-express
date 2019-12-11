const mongoose = require('mongoose');
const Event = require('./Event');

describe('event model', () => {

  it('has a required recipeId', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

  it.skip('has a recipeId field and Date', () => {
    const date = new Date;
    const event = new Event({
      recipeId: '1234',
      date: date
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: expect.any(String),
      date: date
    });
  });

  it.skip('has a notes field', () => {
    const date = new Date;
    const event = new Event({
      recipeId: '0987',
      date: date,
      notes: 'It was yummy'
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: '0987',
      date: date,
      notes: 'It was yummy'
    });

  });

  it.skip('has a ratings field', () => {
    const date = new Date;
    const event = new Event({
      recipeId: '0987',
      date: date,
      notes: 'It was yummy',
      rating: '⭐️⭐️⭐️⭐️⭐️'
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: '0987',
      date: date,
      notes: 'It was yummy',
      rating: '⭐️⭐️⭐️⭐️⭐️'
    });
  });
});
