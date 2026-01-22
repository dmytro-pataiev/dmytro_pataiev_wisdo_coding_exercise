.PHONY: up down build seed test logs

# Start the application and database
up:
	docker-compose up -d --build

# Stop and remove containers
down:
	docker-compose down

# Build the application
build:
	npm run build

# Run the seed script inside the running app container
seed:
	docker-compose exec app node dist/seed.js

# Run tests locally
test:
	npm test

# Show logs
logs:
	docker-compose logs -f
