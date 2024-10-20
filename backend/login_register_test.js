const request = require('supertest');
const app = require('./server'); // Import the app instance
const mongoose = require('mongoose');
const User = require('./models/User'); // Import your User model

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clean up user data before each test
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        mobile: '1234567890',
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should not register a user with an existing email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'existinguser@example.com',
      mobile: '0987654321',
      password: 'password123'
    });

    const response = await request(app)
      .post('/register')
      .send({
        name: 'New User',
        email: 'existinguser@example.com',
        mobile: '1234567890',
        password: 'password456'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email already exists.');
  });

  it('should log in a user', async () => {
    await User.create({
      name: 'Login User',
      email: 'loginuser@example.com',
      mobile: '1234567890',
      password: 'password123'
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    
  });

  it('should not log in with incorrect credentials', async () => {
    await User.create({
      name: 'Invalid User',
      email: 'invaliduser@example.com',
      mobile: '1234567890',
      password: 'password123'
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'invaliduser@example.com',
        password: 'wrongpassword'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid password');
  });

  it('should not log in a non-existent user', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'somepassword'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
