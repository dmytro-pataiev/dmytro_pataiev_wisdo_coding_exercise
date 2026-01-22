import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LibraryModel } from './models/library.model';
import { UserModel } from './models/user.model';
import { BookModel } from './models/book.model';
import { AuthorModel } from './models/author.model';
import { logger } from './utils/logger';

dotenv.config();

export const seedData = async () => {
  // Truncate all collections before seeding
  await LibraryModel.deleteMany({});
  await UserModel.deleteMany({});
  await AuthorModel.deleteMany({});
  await BookModel.deleteMany({});

  const lib1 = await LibraryModel.create({
    name: 'Central Library',
    location: 'New York',
  });
  const lib2 = await LibraryModel.create({
    name: 'Westside Library',
    location: 'Los Angeles',
  });

  await UserModel.create({
    username: 'admin',
    password: 'password',
    country: 'US',
    libraries: [lib1._id, lib2._id],
    role: 'admin',
  });

  await UserModel.create({
    username: 'user1',
    password: 'password',
    country: 'UK',
    libraries: [lib1._id],
    role: 'user',
  });

  // Seed Authors
  const auth1 = await AuthorModel.create({
    name: 'F. Scott Fitzgerald',
    country: 'US',
  });
  const auth2 = await AuthorModel.create({
    name: 'George Orwell',
    country: 'UK',
  });
  const auth3 = await AuthorModel.create({
    name: 'Aldous Huxley',
    country: 'UK',
  });
  const auth4 = await AuthorModel.create({
    name: 'J.D. Salinger',
    country: 'US',
  });
  const auth5 = await AuthorModel.create({
    name: 'Stephen Hawking',
    country: 'UK',
  });
  const auth6 = await AuthorModel.create({ name: 'Harper Lee', country: 'US' });
  const auth7 = await AuthorModel.create({
    name: 'Jane Austen',
    country: 'UK',
  });
  const auth8 = await AuthorModel.create({
    name: 'Ernest Hemingway',
    country: 'US',
  });
  const auth9 = await AuthorModel.create({ name: 'Mark Twain', country: 'US' });
  const auth10 = await AuthorModel.create({
    name: 'Virginia Woolf',
    country: 'UK',
  });

  // Seed Books
  await BookModel.create([
    {
      title: 'The Great Gatsby',
      author: auth1._id,
      authorName: auth1.name,
      authorCountry: auth1.country,
      publishedDate: new Date('1925-04-10'),
      pages: 180,
      library: lib1._id,
    },
    {
      title: '1984',
      author: auth2._id,
      authorName: auth2.name,
      authorCountry: auth2.country,
      publishedDate: new Date('1949-06-08'),
      pages: 328,
      library: lib1._id,
    },
    {
      title: 'Brave New World',
      author: auth3._id,
      authorName: auth3.name,
      authorCountry: auth3.country,
      publishedDate: new Date('1932-01-01'),
      pages: 311,
      library: lib2._id,
    },
    {
      title: 'The Catcher in the Rye',
      author: auth4._id,
      authorName: auth4.name,
      authorCountry: auth4.country,
      publishedDate: new Date('1951-07-16'),
      pages: 234,
      library: lib2._id,
    },
    {
      title: 'A Brief History of Time',
      author: auth5._id,
      authorName: auth5.name,
      authorCountry: auth5.country,
      publishedDate: new Date('1988-04-01'),
      pages: 256,
      library: lib1._id,
    },
    {
      title: 'To Kill a Mockingbird',
      author: auth6._id,
      authorName: auth6.name,
      authorCountry: auth6.country,
      publishedDate: new Date('1960-07-11'),
      pages: 281,
      library: lib1._id,
    },
    {
      title: 'Pride and Prejudice',
      author: auth7._id,
      authorName: auth7.name,
      authorCountry: auth7.country,
      publishedDate: new Date('1813-01-28'),
      pages: 432,
      library: lib2._id,
    },
    {
      title: 'The Old Man and the Sea',
      author: auth8._id,
      authorName: auth8.name,
      authorCountry: auth8.country,
      publishedDate: new Date('1952-09-01'),
      pages: 127,
      library: lib1._id,
    },
    {
      title: 'Adventures of Huckleberry Finn',
      author: auth9._id,
      authorName: auth9.name,
      authorCountry: auth9.country,
      publishedDate: new Date('1884-12-10'),
      pages: 366,
      library: lib2._id,
    },
    {
      title: 'Mrs Dalloway',
      author: auth10._id,
      authorName: auth10.name,
      authorCountry: auth10.country,
      publishedDate: new Date('1925-05-14'),
      pages: 194,
      library: lib1._id,
    },
    {
      title: 'For Whom the Bell Tolls',
      author: auth8._id,
      authorName: auth8.name,
      authorCountry: auth8.country,
      publishedDate: new Date('1940-10-21'),
      pages: 471,
      library: lib2._id,
    },
    {
      title: 'Emma',
      author: auth7._id,
      authorName: auth7.name,
      authorCountry: auth7.country,
      publishedDate: new Date('1815-12-23'),
      pages: 474,
      library: lib1._id,
    },
    {
      title: 'The Adventures of Tom Sawyer',
      author: auth9._id,
      authorName: auth9.name,
      authorCountry: auth9.country,
      publishedDate: new Date('1876-06-01'),
      pages: 274,
      library: lib2._id,
    },
    {
      title: 'To the Lighthouse',
      author: auth10._id,
      authorName: auth10.name,
      authorCountry: auth10.country,
      publishedDate: new Date('1927-05-05'),
      pages: 209,
      library: lib1._id,
    },
    {
      title: 'Animal Farm',
      author: auth2._id,
      authorName: auth2.name,
      authorCountry: auth2.country,
      publishedDate: new Date('1945-08-17'),
      pages: 112,
      library: lib2._id,
    },
  ]);

  logger.info('Sample data seeded');
};

// this script can be run only directly with `node seed.js`
if (require.main === module) {
  const MONGODB_URI =
    process.env.NODE_ENV === 'local'
      ? 'mongodb://localhost:27017/book_management'
      : (process.env.MONGODB_URI || 'mongodb://mongo:27017/book_management');
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      logger.info('Connected to MongoDB for seeding');

      try {
        await seedData();
      } catch (error) {
        logger.error('Failed to seed data', error);
      }

      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Failed to connect to MongoDB for seeding', err);
      process.exit(1);
    });
}
