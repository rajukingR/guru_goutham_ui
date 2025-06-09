import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  tax_code: {
    type: String,
    required: true,
    unique: true
  },
  tax_name: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Tax = mongoose.model('Tax', taxSchema);

export default Tax;