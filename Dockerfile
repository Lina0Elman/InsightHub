FROM node:20.17.0 AS build-fe
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY insighthub-frontend/package*.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code to the working directory
COPY insighthub-frontend .
# Copy the .env file to the working directory
COPY insighthub-frontend/.env.prod .env
# Build the application
RUN npm run build


FROM node:20.17.0
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY insighthub-backend/package.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code to the working directory
COPY insighthub-backend/src ./src
COPY insighthub-backend/tsconfig*.json ./
COPY --from=build-fe /usr/src/app/dist /dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm","run", "start-prod"]