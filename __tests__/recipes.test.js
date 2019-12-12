require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Event = require('../lib/models/Event');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: []
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: []
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [],
          __v: 0
        });
      });
  });

  it('can get a single recipe', async() => {
    const date = new Date;
    const recipe = await Recipe.create({
      name: 'food',
      directions: [
        'open the fidge',
        'pick something',
        'if its in a package, unwrap',
        'eat'
      ],
      ingredients: []
    });
    const event = await Event.create({
      recipeId: recipe._id,
      date: date,
      notes: 'diff every time I make',
      rating: 'hard to say'
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'food',
          directions: [
            'open the fidge',
            'pick something',
            'if its in a package, unwrap',
            'eat'
          ],
          ingredients: [],
          events: [{
            _id: event._id.toString(),
            __v: 0,
            recipeId: recipe._id.toString(),
            date: date.toISOString(),
            notes: 'diff every time I make',
            rating: 'hard to say'
          }],
          __v: 0,
        });
      });
  });

  it('can get recipes based on ingredients serached', async() => {
    const recipes = JSON.parse(JSON.stringify(
      await Recipe.create([{
        name: 'Pizza',
        directions: 'make it good',
        ingredients: [{
          amount: 3,
          measurements: '3 handfuls',
          name: 'cheese'
        },
        {
          amount: 5,
          measurements: '5 handfuls',
          name: 'sauce'
        },
        {
          amount: 2,
          measurements: '2 slices',
          name: 'crust'
        }]
        },
        {
        name: 'PB&J',
        directions: 'you got this',
        ingredients: [{
          amount: 1,
          measurements: '1 scoop',
          name: 'peanut butter'
        },
        {
          amount: 1,
          measurements: '1 scoop',
          name: 'jelly'
        },
        {
          amount: 2,
          measurements: '2 slices',
          name: 'crust'
        }]
      }])
    ));

    return request(app)
      .get('/?ingredients=crust')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name,
            directions: recipe.directions,
            ingredients: [
              { name: recipe.ingredients[0].name, measurements: recipe.ingredients[0].measurements, amount: recipe.ingredients[0].amount, _id: recipe.ingredients[0]._id.toString() },
              { name: recipe.ingredients[1].name, measurements: recipe.ingredients[1].measurements, amount: recipe.ingredients[1].amount, _id: recipe.ingredients[1]._id.toString() },
              { name: recipe.ingredients[2].name, measurements: recipe.ingredients[2].measurements, amount: recipe.ingredients[2].amount, _id: recipe.ingredients[2]._id.toString() }
            ],
            __v: 0
          });
        });
      });
  });

  it('can delete a recipe', async() => {
    const date = new Date;
    const recipe = await Recipe.create({
      name: 'rotten food',
      directions: [
        'ewww who left this out?',
        'should i eat it?',
        'na throw it away'
      ],
      ingredients: []
    });
    await Event.create({
      recipeId: recipe._id,
      date: date,
      notes: 'garbage',
      rating: 'I wanna say 2?'
    });
    return request(app)
      .del(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: recipe._id.toString(),
          name: 'rotten food',
          directions: [
            'ewww who left this out?',
            'should i eat it?',
            'na throw it away'
          ],
          ingredients: [],
          __v: 0
        }, { deletedCount: 1, n: 1, ok: 1 }]);
      });
  });
});
