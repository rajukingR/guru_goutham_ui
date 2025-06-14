import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';

// === Utility Functions ===
const generateGrnId = () => {
  const prefix = 'GRN-';
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}${timestamp}${randomNum}`;
};

const generateCustomerId = () => {
  const prefix = 'CUST-';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNum}`;
};

// === Reusable Components ===
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

const SelectField = ({ label, value, onChange, options }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <select style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

// === Main Component ===
const GrnAddForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    grnId: generateGrnId(),
    customerId: generateCustomerId(),
    grnTitle: '',
    customer: '',
    email: '',
    phone: '',
    grnDate: '',
    gstNumber: '',
    pan: '',
    grnCreatedBy: '',
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCancel = () => {
    navigate('/dashboard/operations/grn');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      grn_id: formData.grnId,
      grn_title: formData.grnTitle,
      customer_id: Number(formData.customerId.replace(/\D/g, '')) || 123,
      customer_select: formData.customer,
      email_id: formData.email,
      phone_no: formData.phone,
      grn_date: formData.grnDate,
      gst_number: formData.gstNumber,
      pan: formData.pan,
      grn_created_by: formData.grnCreatedBy,
      industry: formData.industry,
      company_name: formData.companyName,
      pincode: formData.pincode,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      street: formData.street,
      landmark: formData.landmark,
      informed_person_name: formData.informedPersonName,
      informed_person_phone_no: formData.informedPersonPhone,
      returner_name: formData.returnerName,
      returner_phone_no: formData.returnerPhone,
      receiver_name: formData.receiverName,
      receiver_phone_no: formData.receiverPhone,
      vehicle_number: formData.vehicleNumber,
      description: formData.description
    };

    try {
      const response = await axios.post('http://localhost:5000/api/goods-return-notes/create', payload);
      setSnackbar({
        open: true,
        message: 'GRN created successfully!',
        severity: 'success'
      });

      setTimeout(() => {
            navigate('/dashboard/operations/grn');
      }, 2000);
  
      console.log('API Success:', response.data);
    } catch (error) {
      console.error('API Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create GRN. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* === Basic Details === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Basic Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="GRN ID" value={formData.grnId} onChange={v => handleInputChange('grnId', v)} readOnly />
            <Field label="GRN Title" placeholder="Enter GRN Title" value={formData.grnTitle} onChange={v => handleInputChange('grnTitle', v)} />
            <SelectField label="Select Customer" value={formData.customer} onChange={v => handleInputChange('customer', v)} options={[
              { value: '', label: 'Select a customer' },
              { value: 'cust001', label: 'Customer A' },
              { value: 'cust002', label: 'Customer B' },
              { value: 'cust003', label: 'Customer C' }
            ]} />
            <Field label="Customer ID*" value={formData.customerId} onChange={v => handleInputChange('customerId', v)} readOnly />
            <Field label="Email ID*" type="email" placeholder="Enter Email" value={formData.email} onChange={v => handleInputChange('email', v)} />
            <Field label="Phone No*" type="tel" placeholder="Enter Phone" value={formData.phone} onChange={v => handleInputChange('phone', v)} />
            <Field label="GRN Date" type="date" value={formData.grnDate} onChange={v => handleInputChange('grnDate', v)} />
            <Field label="GST Number" value={formData.gstNumber} onChange={v => handleInputChange('gstNumber', v)} />
            <Field label="PAN" value={formData.pan} onChange={v => handleInputChange('pan', v)} />
            <Field label="GRN Created By" value={formData.grnCreatedBy} onChange={v => handleInputChange('grnCreatedBy', v)} />
            <Field label="Industry" value={formData.industry} onChange={v => handleInputChange('industry', v)} />
          </div>
        </div>

        {/* === To Address === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>To Address</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Company Name" value={formData.companyName} onChange={v => handleInputChange('companyName', v)} />
            <Field label="Pincode" value={formData.pincode} onChange={v => handleInputChange('pincode', v)} />
            <Field label="Country" value={formData.country} onChange={v => handleInputChange('country', v)} />
            <Field label="State" value={formData.state} onChange={v => handleInputChange('state', v)} />
            <Field label="City" value={formData.city} onChange={v => handleInputChange('city', v)} />
            <Field label="Street" value={formData.street} onChange={v => handleInputChange('street', v)} />
            <Field label="Landmark" value={formData.landmark} onChange={v => handleInputChange('landmark', v)} />
          </div>
        </div>

        {/* === Person Info === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Person Info</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Informed Person Name" value={formData.informedPersonName} onChange={v => handleInputChange('informedPersonName', v)} />
            <Field label="Informed Person Phone" value={formData.informedPersonPhone} onChange={v => handleInputChange('informedPersonPhone', v)} />
            <Field label="Returner Name" value={formData.returnerName} onChange={v => handleInputChange('returnerName', v)} />
            <Field label="Returner Phone" value={formData.returnerPhone} onChange={v => handleInputChange('returnerPhone', v)} />
            <Field label="Receiver Name" value={formData.receiverName} onChange={v => handleInputChange('receiverName', v)} />
            <Field label="Receiver Phone" value={formData.receiverPhone} onChange={v => handleInputChange('receiverPhone', v)} />
            <Field label="Vehicle Number" value={formData.vehicleNumber} onChange={v => handleInputChange('vehicleNumber', v)} />
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// === Styles ===
const containerStyle = { padding: '2rem', fontFamily: '"Inter", sans-serif', minHeight: '100vh', lineHeight: 1.6 };
const formContainerStyle = { display: 'grid', gap: '1.5rem', maxWidth: '1400px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' };
const cardStyle = { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const cardHeaderContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' };
const iconStyle = { fontSize: '1.25rem', marginRight: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' };
const cardHeaderStyle = { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 };
const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#fff' };
const textareaContainerStyle = { marginTop: '1rem' };
const textareaStyle = { width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#fff', resize: 'vertical' };
const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' };
const cancelBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' };
const createBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default GrnAddForm;
