# Use the official Node.js 20.17.0 image as the base image
FROM node:20.17.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY src ./src
COPY tsconfig*.json ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm","run", "start-prod"]