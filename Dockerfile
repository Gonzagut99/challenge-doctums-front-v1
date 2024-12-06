# Use the official Node.js image with an Alpine base for a lightweight setup
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Install necessary tools for development (bash, etc.)
RUN apk add --no-cache bash git

# Copy the package.json and package-lock.json files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Remix development server port (default is 3000)
EXPOSE 8085

# Command to run Remix in dev mode
CMD ["npm", "run", "dev"]
