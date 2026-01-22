import { Response } from 'express';
import { BookModel } from '../models/book.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const DEFAULT_LIMIT = 50;

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userLibraries = req.user?.libraries || [];
    const userCountry = req.user?.country || '';
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : DEFAULT_LIMIT;

    if (userLibraries.length === 0) {
      return res.json([]);
    }

    const skip = (page - 1) * limit;

    const now = new Date();

    const pipeline: any[] = [
      {
        $match: {
          library: {
            $in: userLibraries.map(
              (id) => new (require('mongoose').Types.ObjectId)(id),
            ),
          },
        },
      },
      // country priority and age
      {
        $addFields: {
          isSameCountry: {
            $cond: [{ $eq: ['$authorCountry', userCountry] }, 1, 0],
          },
          ageYears: {
            $divide: [
              { $subtract: [now, '$publishedDate'] },
              1000 * 60 * 60 * 24 * 365,
            ],
          },
        },
      },
      {
        // normalizing pages and age to [0, 1] range
        $addFields: {
          pagesNorm: { $divide: ['$pages', 1000] },
          ageNorm: { $divide: ['$ageYears', 100] },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ['$pagesNorm', 0.8] },
              { $multiply: ['$ageNorm', 0.2] },
            ],
          },
        },
      },

      { $sort: { isSameCountry: -1, score: -1, _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          title: 1,
          author: 1,
          publishedDate: 1,
          pages: 1,
          library: 1,
          authorName: 1,
          authorCountry: 1,
          isSameCountry: 1,
          ageYears: 1,
          // pagesNorm: 1,
          // ageNorm: 1,
          score: 1,
        },
      },
    ];

    const items = await BookModel.aggregate(pipeline);

    res.json(items);
  } catch (error: any) {
    logger.error('Error generating feed', error);
    res.status(500).json({ error: error.message });
  }
};
