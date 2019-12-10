const mongoose = require('mongoose');
const Event = require('./Event');

describe('event model', () => {
  it('has a required recipeId', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

  it('has a recipeId field and Date', () => {
    const date = new Date;
    const event = new Event({
      recipeId: '1234',
      date: date
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: '1234',
      date: date
    });
  });

  it.skip('has an ingredients field', () => {
    const event = new Event({
      name: 'Banana',
      directions: [
        'peel'
      ],
      ingredients: [{
        amount: 1,
        measurements: '1 cup',
        name: `Banana, that's it. That's the whole thing`
      }]
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      name: 'Banana',
      directions: [
        'peel'
      ],
      ingredients: [{
        _id: event.ingredients[0]._id,
        amount: 1,
        measurements: '1 cup',
        name: `Banana, that's it. That's the whole thing`
      }]
    });
  });

});
