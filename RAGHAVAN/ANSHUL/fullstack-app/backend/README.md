# Backend Application

This is the backend of the fullstack application built using Node.js, Express.js, and MongoDB.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Connection](#database-connection)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd fullstack-app/backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the MongoDB server (if not already running).

2. Run the backend application:
   ```
   npm start
   ```

3. The server will run on `http://localhost:5000`.

## API Endpoints

- **POST /api/users**: Create a new user.
- **GET /api/users**: Retrieve all users.
- **GET /api/users/:id**: Retrieve a user by ID.
- **PUT /api/users/:id**: Update a user by ID.
- **DELETE /api/users/:id**: Delete a user by ID.

## Database Connection

The backend connects to a MongoDB database using Mongoose. Ensure that your MongoDB server is running and the connection string is correctly set in the `config/db.js` file.