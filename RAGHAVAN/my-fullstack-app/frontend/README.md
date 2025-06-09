# My Fullstack App

This is a fullstack application built with React.js for the frontend and Node.js with Express.js for the backend. MongoDB is used as the database to store tax-related data.

## Frontend

The frontend is built using React.js and styled with Tailwind CSS. It includes components for managing tax records, including creating, updating, and viewing tax information.

### Getting Started

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-fullstack-app/frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

### Folder Structure

- `public/`: Contains the main HTML file and static assets.
- `src/`: Contains the React components, pages, and styles.
- `components/`: Reusable components for the application.
- `pages/`: Page components that represent different views.
- `styles/`: Global styles and Tailwind CSS configuration.

## Backend

The backend is built with Node.js and Express.js, providing a RESTful API for managing tax records.

### Getting Started

1. **Navigate to the backend directory:**
   ```
   cd my-fullstack-app/backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the server:**
   ```
   npm start
   ```

4. **API Documentation:**
   The backend API is available at `http://localhost:5000/api/tax-list`.

### Folder Structure

- `src/controllers/`: Contains the controller functions for handling API requests.
- `src/models/`: Contains the Mongoose models for the database.
- `src/routes/`: Contains the route definitions for the API endpoints.
- `src/config/`: Contains the database configuration.

## License

This project is licensed under the MIT License.