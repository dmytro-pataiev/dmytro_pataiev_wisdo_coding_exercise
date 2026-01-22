import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/index';
import { BookModel } from '../src/models/book.model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Feed API', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockLibraryId = new mongoose.Types.ObjectId().toString();

  const mockToken = jwt.sign(
    {
      userId: mockUserId,
      username: 'testuser',
      country: 'US',
      libraries: [mockLibraryId],
    },
    JWT_SECRET
  );

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/v1/feed', () => {
    it('should return a ranked list of books', async () => {
      const mockFeed = [
        {
          _id: 'book1',
          title: 'Prioritized Book',
          authorCountry: 'US',
          score: 0.9,
          isSameCountry: 1,
        },
        {
          _id: 'book2',
          title: 'Other Book',
          authorCountry: 'UK',
          score: 0.8,
          isSameCountry: 0,
        },
      ];

      const aggregateStub = sinon.stub(BookModel, 'aggregate').resolves(mockFeed);

      const response = await request(app)
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(response.body[0]).to.have.property('title', 'Prioritized Book');
      expect(aggregateStub.calledOnce).to.be.true;
    });

    it('should return an empty array if user has no libraries', async () => {
      const emptyToken = jwt.sign(
        {
          userId: mockUserId,
          username: 'testuser',
          country: 'US',
          libraries: [],
        },
        JWT_SECRET
      );

      const response = await request(app)
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${emptyToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(0);
    });

    it('should handle pagination parameters', async () => {
      const aggregateStub = sinon.stub(BookModel, 'aggregate').resolves([]);

      await request(app)
        .get('/api/v1/feed?page=2&limit=10')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(aggregateStub.calledOnce).to.be.true;
      const pipeline = aggregateStub.firstCall.args[0];
      
      // Check if $skip and $limit are correctly calculated in the pipeline
      const skipStage = pipeline.find((stage: any) => (stage as any).$skip !== undefined);
      const limitStage = pipeline.find((stage: any) => (stage as any).$limit !== undefined);
      
      expect(skipStage).to.not.be.undefined;
      expect(limitStage).to.not.be.undefined;
      expect((skipStage as any).$skip).to.equal(10);
      expect((limitStage as any).$limit).to.equal(10);
    });
  });
});
