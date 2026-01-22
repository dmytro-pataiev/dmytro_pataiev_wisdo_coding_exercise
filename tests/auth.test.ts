import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/index';
import { UserModel } from '../src/models/user.model';

describe('Auth API', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /api/v1/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'password123',
        country: 'US',
        libraries: [],
        role: 'user',
      };

      const findOneStub = sinon
        .stub(UserModel, 'findOne')
        .resolves(mockUser as any);

      const response = await request(app).post('/api/v1/login').send({
        username: 'testuser',
        password: 'password123',
      });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(findOneStub.calledOnce).to.be.true;
    });

    it('should return 401 for invalid password', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'password123',
        country: 'US',
        libraries: [],
        role: 'user',
      };

      sinon.stub(UserModel, 'findOne').resolves(mockUser as any);

      const response = await request(app).post('/api/v1/login').send({
        username: 'testuser',
        password: 'wrongpassword',
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message', 'Invalid credentials');
    });

    it('should return 401 if user does not exist', async () => {
      sinon.stub(UserModel, 'findOne').resolves(null);

      const response = await request(app).post('/api/v1/login').send({
        username: 'nonexistent',
        password: 'password123',
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message', 'Invalid credentials');
    });
  });
});
