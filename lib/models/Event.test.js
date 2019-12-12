const Event = require('./Event');
const Recipe = require('./Recipe');

describe('event model', () => {
  const testRecipe = new Recipe({
    name: 'Cookies',
    directions: [
      'preheat oven to 375',
      'mix ingredients',
      'put dough on cookie sheet',
      'bake for 10 minutes'
    ]
  }); 

  it('has a required recipeId', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

  it('has a recipeId field and Date', () => {
    const date = new Date;
    const event = new Event({
      recipeId: testRecipe._id,
      date: date
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: testRecipe._id,
      date: date
    });
  });

  it('has a notes field', () => {
    const date = new Date;
    const event = new Event({
      recipeId: testRecipe._id,
      date: date,
      notes: 'It was yummy'
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: testRecipe._id,
      date: date,
      notes: 'It was yummy'
    });

  });

  it('has a ratings field', () => {
    const date = new Date;
    const event = new Event({
      recipeId: testRecipe._id,
      date: date,
      notes: 'It was yummy',
      rating: '⭐️⭐️⭐️⭐️⭐️'
    });

    expect(event.toJSON()).toEqual({
      _id: event._id,
      recipeId: testRecipe._id,
      date: date,
      notes: 'It was yummy',
      rating: '⭐️⭐️⭐️⭐️⭐️'
    });
  });
});
