const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const Expense = require('../models/Expense'); 
const User = require('../models/User'); 

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Expense Routes', () => {
  let user1, user2;

  beforeEach(async () => {
    await Expense.deleteMany({}); // Clean up before each test
    await User.deleteMany({}); // Clean up user data

    // Create dummy users
    user1 = await User.create({
      name: 'User One',
      email: 'user1@example.com',
      mobile: '1234567890',
      password: 'password1'
    });

    user2 = await User.create({
      name: 'User Two',
      email: 'user2@example.com',
      mobile: '0987654321',
      password: 'password2'
    });
  });

  it('should create an expense with equal splits', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({
        description: 'Dinner',
        amount: 100,
        splitMethod: 'Equal',
        participants: [user1._id.toString(), user2._id.toString()],
        createdBy: user1._id.toString() // Use the ID of one of the created users
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toMatchObject({
      description: 'Dinner',
      amount: 100,
      splitMethod: 'Equal',
    });
  });

  it('should not allow exact splits to exceed the total amount', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({
        description: 'Invalid Expense',
        amount: 100,
        splitMethod: 'Exact',
        participants: [user1._id.toString(), user2._id.toString()],
        createdBy: user1._id.toString(),
        exactSplits: {
          [user1._id.toString()]: 70,
          [user2._id.toString()]: 50
        },
        percentSplits: {}
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'The total of exact amounts cannot exceed the total expense amount.');
  });

  it('should create an expense with percentage splits', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({
        description: 'Event',
        amount: 200,
        splitMethod: 'Percentage',
        participants: [user1._id.toString(), user2._id.toString()],
        createdBy: user1._id.toString(),
        exactSplits: {}, 
        percentSplits: {
          [user1._id.toString()]: 50,
          [user2._id.toString()]: 50
        }
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('description', 'Event');
    expect(response.body).toHaveProperty('amount', 200);
  });

  it('should not allow percentage splits to exceed 100%', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({
        description: 'Invalid Percentage Expense',
        amount: 100,
        splitMethod: 'Percentage',
        participants: [user1._id.toString(), user2._id.toString()],
        createdBy: user1._id.toString(),
        exactSplits: {},
        percentSplits: {
          [user1._id.toString()]: 70,
          [user2._id.toString()]: 50
        }
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'The total of percentages cannot exceed 100%.');
  });
});
