# My Fullstack App

This project is a fullstack application built with React.js for the frontend and Node.js with Express.js for the backend. It uses MongoDB as the database to store tax-related information.

## Project Structure

```
my-fullstack-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── app.js
│   │   └── config
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── index.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database connection in `src/config/db.js`.

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm start
   ```

## Features

- Create, update, and retrieve tax records.
- User-friendly interface for managing tax information.
- Responsive design using Tailwind CSS.

## License

This project is licensed under the MIT License.