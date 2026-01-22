import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const apis =
  process.env.NODE_ENV === 'local'
    ? ['./src/routes/*.ts', './src/controllers/*.ts']
    : [
        path.join(__dirname, 'routes', '*.js'),
        path.join(__dirname, 'controllers', '*.js'),
      ];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Management API',
      version: '1.0.0',
      description: 'A simple RESTful API for managing books and libraries',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Author: {
          type: 'object',
          required: ['name', 'country'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            country: { type: 'string' },
          },
        },
        Book: {
          type: 'object',
          required: ['title', 'author', 'publishedDate', 'pages', 'library'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the book',
            },
            title: { type: 'string' },
            author: { type: 'string', description: 'Author ID' },
            authorName: { type: 'string', description: 'Author name' },
            authorCountry: { type: 'string', description: 'Author country' },
            publishedDate: { type: 'string', format: 'date' },
            pages: { type: 'number', minimum: 1 },
            library: { type: 'string', description: 'Library ID' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            country: { type: 'string' },
            libraries: { type: 'array', items: { type: 'string' } },
            role: { type: 'string' },
          },
        },
      },
    },
  },
  apis: apis, // Path to the API docs
};

export const specs = swaggerJsdoc(options);
