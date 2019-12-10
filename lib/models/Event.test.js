const mongoose = require('mongoose');
const Event = require('./Event');

describe('event model', () => {
  it('has a required name', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it.skip('has a name and directions field', () => {
    const event = new Event({
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: []
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
