import Tax from '../models/taxModel.js';

// Get all tax records
export const getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find();
    res.status(200).json(taxes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax records', error });
  }
};

// Get a single tax record by ID
export const getTaxById = async (req, res) => {
  const { id } = req.params;
  try {
    const tax = await Tax.findById(id);
    if (!tax) {
      return res.status(404).json({ message: 'Tax record not found' });
    }
    res.status(200).json(tax);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax record', error });
  }
};

// Create a new tax record
export const createTax = async (req, res) => {
  const { tax_code, tax_name, percentage, is_active } = req.body;
  try {
    const newTax = new Tax({ tax_code, tax_name, percentage, is_active });
    await newTax.save();
    res.status(201).json(newTax);
  } catch (error) {
    res.status(400).json({ message: 'Error creating tax record', error });
  }
};

// Update an existing tax record
export const updateTax = async (req, res) => {
  const { id } = req.params;
  const { tax_code, tax_name, percentage, is_active } = req.body;
  try {
    const updatedTax = await Tax.findByIdAndUpdate(id, { tax_code, tax_name, percentage, is_active }, { new: true });
    if (!updatedTax) {
      return res.status(404).json({ message: 'Tax record not found' });
    }
    res.status(200).json(updatedTax);
  } catch (error) {
    res.status(400).json({ message: 'Error updating tax record', error });
  }
};

// Delete a tax record
export const deleteTax = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTax = await Tax.findByIdAndDelete(id);
    if (!deletedTax) {
      return res.status(404).json({ message: 'Tax record not found' });
    }
    res.status(200).json({ message: 'Tax record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tax record', error });
  }
};