import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/index';
import { BookModel } from '../src/models/book.model';
import { AuthorModel } from '../src/models/author.model';
import { LibraryModel } from '../src/models/library.model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Books API', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockLibraryId = new mongoose.Types.ObjectId().toString();
  const mockAuthorId = new mongoose.Types.ObjectId().toString();

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

  describe('POST /api/v1/books', () => {
    it('should create a book successfully', async () => {
      const bookData = {
        title: 'New Book',
        author: mockAuthorId,
        publishedDate: '2023-01-01',
        pages: 200,
        library: mockLibraryId,
      };

      sinon.stub(AuthorModel, 'findById').resolves({
        _id: mockAuthorId,
        name: 'John Doe',
        country: 'US',
      } as any);
      sinon.stub(LibraryModel, 'findById').resolves({
        _id: mockLibraryId,
        name: 'Central Library',
      } as any);
      
      const saveStub = sinon.stub(BookModel.prototype, 'save').resolves({
        _id: 'book123',
        ...bookData,
        authorName: 'John Doe',
        authorCountry: 'US',
      } as any);

      const response = await request(app)
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(bookData);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('title', 'New Book');
      expect(saveStub.calledOnce).to.be.true;
    });

    it('should return 403 if user is not member of library', async () => {
      const otherLibraryId = new mongoose.Types.ObjectId().toString();
      const bookData = {
        title: 'New Book',
        author: mockAuthorId,
        publishedDate: '2023-01-01',
        pages: 200,
        library: otherLibraryId,
      };

      const response = await request(app)
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(bookData);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error', 'You are not a member of the target library');
    });

    it('should return 400 for invalid input', async () => {
      const bookData = {
        title: '', // Empty title
        author: mockAuthorId,
        publishedDate: 'invalid-date',
        pages: -10,
        library: mockLibraryId,
      };

      const response = await request(app)
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(bookData);

      expect(response.status).to.equal(400);
    });
  });

  describe('GET /api/v1/books', () => {
    it('should return books for user libraries', async () => {
      const mockBooks = [
        { title: 'Book 1', library: mockLibraryId },
        { title: 'Book 2', library: mockLibraryId },
      ];

      const findStub = sinon.stub(BookModel, 'find').resolves(mockBooks as any);

      const response = await request(app)
        .get('/api/v1/books')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(findStub.calledOnce).to.be.true;
    });
  });

  describe('GET /api/v1/books/:id', () => {
    it('should return a book by id', async () => {
      const mockBook = {
        _id: 'book123',
        title: 'Book 1',
        library: { _id: mockLibraryId },
      };

      sinon.stub(BookModel, 'findById').resolves(mockBook as any);

      const response = await request(app)
        .get('/api/v1/books/book123')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('title', 'Book 1');
    });

    it('should return 403 if book is in library user is not member of', async () => {
      const otherLibraryId = new mongoose.Types.ObjectId().toString();
      const mockBook = {
        _id: 'book123',
        title: 'Book 1',
        library: { _id: otherLibraryId },
      };

      sinon.stub(BookModel, 'findById').resolves(mockBook as any);

      const response = await request(app)
        .get('/api/v1/books/book123')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).to.equal(403);
    });
  });

  describe('DELETE /api/v1/books/:id', () => {
    it('should delete a book successfully', async () => {
      const mockBook = {
        _id: 'book123',
        library: mockLibraryId,
      };

      sinon.stub(BookModel, 'findById').resolves(mockBook as any);
      const deleteStub = sinon.stub(BookModel, 'deleteOne').resolves({ deletedCount: 1 } as any);

      const response = await request(app)
        .delete('/api/v1/books/book123')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).to.equal(204);
      expect(deleteStub.calledOnce).to.be.true;
    });
  });
});
