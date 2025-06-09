import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import taxRoutes from './routes/taxRoutes.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/tax-list', taxRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});