import request from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import sinon from 'sinon';
import { UserModel } from '../src/models/user.model';

describe('Global Error Handler', () => {
  it('should handle unhandled errors and return 500', async () => {
    // Force an error in one of the controllers
    const findOneStub = sinon.stub(UserModel, 'findOne').throws(new Error('Test Error'));

    const response = await request(app)
      .post('/api/v1/login')
      .send({ username: 'test', password: 'password' });

    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Test Error');

    findOneStub.restore();
  });

  it('should handle unhandled errors, return 500 and return default error message', async () => {
    // Force an error in one of the controllers
    const findOneStub = sinon
      .stub(UserModel, 'findOne')
      .throws(new Error());

    const response = await request(app)
      .post('/api/v1/login')
      .send({ username: 'test', password: 'password' });

    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Internal Server Error');

    findOneStub.restore();
  });
});
