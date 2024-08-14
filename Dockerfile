# Step 1: Use an official Node.js runtime as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or pnpm-lock.yaml if using pnpm)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application's source code to the container
COPY . .

# Step 6: Expose the port the app will run on
EXPOSE 3002

# Step 7: Start the Node.js application
CMD ["npm", "start"]
