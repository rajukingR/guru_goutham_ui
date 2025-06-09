# Fullstack Application

This is a fullstack application built with React.js for the frontend and Node.js with Express.js and MongoDB for the backend. 

## Project Structure

```
fullstack-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   └── userController.js
│   │   ├── models
│   │   │   └── user.js
│   │   ├── routes
│   │   │   └── userRoutes.js
│   │   ├── config
│   │   │   └── db.js
│   │   └── app.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   └── UserForm.jsx
│   │   ├── pages
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your MongoDB connection in `src/config/db.js`.

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React application:
   ```
   npm start
   ```

## API Endpoints

- **POST /api/users**: Create a new user.
- **GET /api/users**: Retrieve all users.

## License

This project is licensed under the MIT License.