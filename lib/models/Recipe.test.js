const mongoose = require('mongoose');
const Recipe = require('./Recipe');

describe('Recipe model', () => {
  it('has a required name', () => {
    const recipe = new Recipe();
    const { errors } = recipe.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name and directions field', () => {
    const recipe = new Recipe({
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    expect(recipe.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });

  it('has an ingredients field', () => {
    const recipe = new Recipe({
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

    expect(recipe.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
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
  });

});
