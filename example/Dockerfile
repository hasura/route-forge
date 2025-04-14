# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json (if available) into the image
COPY package*.json ./

# Install packages in the image
RUN npm install

# Copy the rest of your app's source code into the image
COPY .. .

# Build the TypeScript application
RUN npm run build_c

# Set the command that will be run when the Docker container starts
CMD [ "npm", "start" ]