import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Field component defined outside to prevent re-rendering issues
const Field = ({ label, placeholder, value, onChange, type = 'text', readOnly = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
    />
  </div>
);

// SelectField component defined outside to prevent re-rendering issues
const SelectField = ({ label, value, onChange, options }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <select style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const GrnAddForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    grnId: '',
    grnTitle: '',
    customer: '',
    customerId: '',
    email: '',
    phone: '',
    grnDate: '',
    gstNumber: '',
    pan: '',
    industry: '',
    companyName: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    street: '',
    landmark: '',
    informedPersonName: '',
    informedPersonPhone: '',
    returnerName: '',
    returnerPhone: '',
    receiverName: '',
    receiverPhone: '',
    description: '',
    vehicleNumber: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/goods-return-notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create GRN');
      }

      const data = await response.json();
      
      setSnackbar({
        open: true,
        message: 'GRN created successfully!',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/dashboard/operations/grn');
      }, 1500);

    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error creating GRN',
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/operations/grn');
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Basic Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Basic Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="GRN ID"
              placeholder="Enter GRN ID"
              value={formData.grnId}
              onChange={(value) => handleInputChange('grnId', value)}
            />
            <Field
              label="GRN Title"
              placeholder="Enter GRN Title"
              value={formData.grnTitle}
              onChange={(value) => handleInputChange('grnTitle', value)}
            />
            <SelectField
  label="Select Customer"
  value={formData.customer}
  onChange={(value) => handleInputChange('customer', value)}
  options={[
    { value: '', label: 'Select a customer' },
    { value: 'cust001', label: 'Customer A' },
    { value: 'cust002', label: 'Customer B' },
    { value: 'cust003', label: 'Customer C' },
    { value: 'cust004', label: 'Customer D' },
    { value: 'cust005', label: 'Customer E' }
  ]}
/> <Field
     label="Customer ID*"
     placeholder="Enter Customer ID"
                                                                                 value={formData.customerId}
         onChange={(value) => handleInputChange('customerId', value)}
            />
            <Field
              label="Email ID*"
              type="email"
              placeholder="Enter Email ID"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
            />
            <Field
              label="Phone No*"
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
            />
            <Field
              label="GRN Date"
              type="date"
              value={formData.grnDate}
              onChange={(value) => handleInputChange('grnDate', value)}
            />
            <Field
              label="GST Number"
              placeholder="Enter GST Number"
              value={formData.gstNumber}
              onChange={(value) => handleInputChange('gstNumber', value)}
            />
            <Field
              label="PAN"
              placeholder="Enter PAN"
              value={formData.pan}
              onChange={(value) => handleInputChange('pan', value)}
            />
            <Field
              label="GRN Created By"
              value=""
              readOnly={true}
            />
            <Field
              label="Industry"
              placeholder="Enter Industry"
              value={formData.industry}
              onChange={(value) => handleInputChange('industry', value)}
            />
          </div>
          <div style={{...fieldContainerStyle, marginTop: '1rem'}}>
            <button style={selectProductBtnStyle}>Select Product</button>
          </div>
        </div>

        {/* To Address */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>To Address</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Company Name*"
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={(value) => handleInputChange('companyName', value)}
            />
            <Field
              label="Pincode*"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
            />
            <Field
              label="Country*"
              placeholder="Enter Country"
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
            />
            <Field
              label="State*"
              placeholder="Enter State"
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
            />
            <Field
              label="City*"
              placeholder="Enter City"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
            />
            <Field
              label="Street*"
              placeholder="Enter Street"
              value={formData.street}
              onChange={(value) => handleInputChange('street', value)}
            />
            <Field
              label="Landmark"
              placeholder="Enter Landmark"
              value={formData.landmark}
              onChange={(value) => handleInputChange('landmark', value)}
            />
          </div>
        </div>

        {/* Person Info */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Person Info</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Informed Person Name*"
              placeholder="Enter Informed Person Name"
              value={formData.informedPersonName}
              onChange={(value) => handleInputChange('informedPersonName', value)}
            />
            <Field
              label="Informed Person Phone No*"
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.informedPersonPhone}
              onChange={(value) => handleInputChange('informedPersonPhone', value)}
            />
            <Field
              label="Returner Name"
              placeholder="Enter Returner Name"
              value={formData.returnerName}
              onChange={(value) => handleInputChange('returnerName', value)}
            />
            <Field
              label="Returner Phone No"
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.returnerPhone}
              onChange={(value) => handleInputChange('returnerPhone', value)}
            />
            <Field
              label="Receiver Name*"
              placeholder="Enter Receiver Name"
              value={formData.receiverName}
              onChange={(value) => handleInputChange('receiverName', value)}
            />
            <Field
              label="Receiver Phone No*"
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.receiverPhone}
              onChange={(value) => handleInputChange('receiverPhone', value)}
            />
            <Field
              label="Vehicle Number"
              placeholder="Enter Vehicle Number"
              value={formData.vehicleNumber}
              onChange={(value) => handleInputChange('vehicleNumber', value)}
            />
          </div>
          <div style={textareaContainerStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Enter Description"
              style={textareaStyle}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={handleCancel}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Submit</button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0',
};

const iconStyle = {
  fontSize: '1.25rem',
  marginRight: '0.75rem',
  backgroundColor: '#f1f5f9',
  padding: '0.5rem',
  borderRadius: '8px',
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const fieldsGridStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
};

const textareaContainerStyle = {
  marginTop: '1rem',
};

const textareaStyle = {
  width: '100%',
  minHeight: '100px',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  resize: 'vertical',
};

const selectProductBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '0.875rem',
  fontWeight: '500',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  cursor: 'pointer',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default GrnAddForm;