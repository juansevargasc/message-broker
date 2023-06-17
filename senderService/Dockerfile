# Base image
FROM node:lts-alpine

# Create app directory
RUN mkdir -p /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to know which dependencies to install
COPY package*.json ./

# Install
RUN npm install

# Copy remaining code
COPY . .

EXPOSE 3000

CMD [ "node", "fetchLogs.js"]