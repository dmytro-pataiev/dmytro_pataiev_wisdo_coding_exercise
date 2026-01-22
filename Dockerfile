# Stage 1: Build
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:24-alpine

WORKDIR /app

# Copy compiled code from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./dist/node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"]
