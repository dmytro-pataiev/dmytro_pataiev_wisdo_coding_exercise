import { Response } from 'express';
import { BookModel, IBook } from '../models/book.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { validateInputEntities } from '../helpers/book.helper';

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
  publishedDate: z.string().transform((str) => new Date(str)),
  pages: z.number().positive(),
  library: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
});

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = bookSchema.parse(req.body);
    const validationResult = await validateInputEntities({
      validatedData,
      userLibraries: req.user?.libraries || [],
    });

    if (!validationResult.isValid) {
      res
        .status(validationResult.httpCode)
        .json({ error: validationResult.message });

      return;
    }

    const book = new BookModel({
      ...validatedData,
      authorName: validationResult.author.name,
      authorCountry: validationResult.author.country,
    });
    await book.save();

    res.status(201).json(book);
  } catch (error: any) {
    logger.error('Error creating book', error);
    res.status(400).json({ error: error.message || error });
  }
};

export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const userLibraries = req.user?.libraries || [];
    const books = await BookModel.find({ library: { $in: userLibraries } });

    res.json(books);
  } catch (error: any) {
    logger.error('Error getting books', error);

    res.status(500).json({ error: error.message });
  }
};

export const getBookById = async (req: AuthRequest, res: Response) => {
  try {
    const book = await BookModel.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!req.user?.libraries.includes(book.library._id.toString())) {
      return res.status(403).json({ message: 'Access denied to this library' });
    }

    res.json(book);
  } catch (error: any) {
    logger.error(`Error getting book by id: ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = bookSchema.partial().parse(req.body);
    const book = await BookModel.findById(req.params.id);

    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const validationResult = await validateInputEntities({
      validatedData,
      userLibraries: req.user?.libraries || [],
    });

    if (!validationResult.isValid) {
      res
        .status(validationResult.httpCode)
        .json({ error: validationResult.message });

      return;
    }

    const authorDataToUpdate: Pick<IBook, 'authorName' | 'authorCountry'> = {
      authorName: book.authorName,
      authorCountry: book.authorCountry
    };

    if (book.author.toString() !== validationResult.author._id.toString()) {
      authorDataToUpdate.authorName = validationResult.author.name;
      authorDataToUpdate.authorCountry = validationResult.author.country;
    }

    Object.assign(book, { ...validatedData, ...authorDataToUpdate });
    await book.save();

    res.json(book);
  } catch (error: any) {
    logger.error(`Error updating book: ${req.params.id}`, error);

    res.status(400).json({ error: error.message || error });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = await BookModel.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!req.user?.libraries.includes(book.library.toString())) {
      return res.status(403).json({ message: 'Access denied to this library' });
    }

    await BookModel.deleteOne({ _id: req.params.id });

    res.status(204).send();
  } catch (error: any) {
    logger.error(`Error deleting book: ${req.params.id}`, error);

    res.status(500).json({ error: error.message });
  }
};
