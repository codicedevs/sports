# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy yarn.lock and package.json to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Compile the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Set the default command to start the application
CMD ["yarn", "start:prod"]