import express from 'express';
import {
  createTax,
  getTaxById,
  updateTax,
  deleteTax,
  getAllTaxes
} from '../controllers/taxController.js';

const router = express.Router();

// Route to create a new tax
router.post('/', createTax);

// Route to get all taxes
router.get('/', getAllTaxes);

// Route to get a tax by ID
router.get('/:id', getTaxById);

// Route to update a tax by ID
router.put('/:id', updateTax);

// Route to delete a tax by ID
router.delete('/:id', deleteTax);

export default router;