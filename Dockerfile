# Stage 1: Build the application
FROM node:21-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Create the production image
FROM node:21-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/build/ ./build
COPY --from=build /app/public/ ./public
COPY --from=build /app/app/data/ ./app/data/
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules/ ./node_modules

# Expose the port the app runs on
EXPOSE 8080

# Command to run the production server
CMD [ "npm", "run", "start"] 