# Book Management API

A RESTful API for managing books and libraries, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Full CRUD operations for Books.
- JWT-based authentication.
- Automated Feed generation with ranking algorithm.
- [Swagger API Documentation](http://localhost:3000/api-docs/).
- Dockerized environment.
- Comprehensive test suite.

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

The easiest way to run the project is using the provided `Makefile`.

### Makefile Commands

The project includes a `Makefile` to simplify common development and deployment tasks.

| Command | Description |
|---------|-------------|
| `make up` | Build and start the application and MongoDB containers in detached mode. |
| `make down` | Stop and remove the Docker containers. |
| `make seed` | Run the data seeding script inside the running application container. This populates the database with initial users, authors, and books. |
| `make build` | Run the local TypeScript build (`npm run build`). |
| `make test` | Run the automated test suite locally (`npm test`). |
| `make logs` | Follow the logs of the running Docker containers. |

### Quick Start Guide

1.  **Clone the repository.**
2.  **Start the environment:**
    ```bash
    make up
    ```
3.  **Seed the database:**
    ```bash
    make seed
    ```
4.  **Access the API Documentation:**
    Open [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) in your browser to view the Swagger UI and explore the available endpoints.

## API Endpoints

- **Auth:** `POST /api/v1/login` - Login to get a JWT.
- **Books:** `GET`, `POST`, `GET /:id`, `PUT`, `DELETE /api/v1/books` - CRUD for books.
- **Feed:** `GET /api/v1/feed` - Get personalized book recommendations.

## Testing

You can run the tests locally using:
```bash
npm install
make test
```
The tests use Mocha, Chai, and Sinon for unit and integration testing.

## Environment Variables

The application uses the following environment variables (defined in `.env` or `docker-compose.yml`):

- `PORT`: The port the server listens on (default: 3000).
- `MONGODB_URI`: Connection string for MongoDB.
- `JWT_SECRET`: Secret key for signing JWT tokens.
