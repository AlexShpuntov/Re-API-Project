// authController.test.js

const request = require('supertest');
const app = require('../app'); // Путь к вашему Express приложению
const { mockgoose } = require("mongoose");
const User = require('../models/User');

beforeAll(async () => {
  await mockgoose.prepareDB();
});

afterAll(async () => {
  await mockgoose.mongodHelper.mongoBinCleanup();
});

describe('Authentication endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
        surname: 'User',
        phone: '1234567890'
      });
    expect(res.statusCode).toEqual(201);
    // Add more expectations here
  });

  it('should not register a user with existing email', async () => {
    // Mock existing user
    await User.create({
      email: 'existing@example.com',
      password: 'password',
      name: 'Existing',
      surname: 'User',
      phone: '1234567890'
    });

    const res = await request(app)
      .post('/signup')
      .send({
        email: 'existing@example.com',
        password: 'password',
        name: 'Existing',
        surname: 'User',
        phone: '1234567890'
      });
    expect(res.statusCode).toEqual(400);
    // Add more expectations here
  });

  // Add more test cases for other endpoints
});
