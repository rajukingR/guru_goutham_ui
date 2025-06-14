import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const generateServiceNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CL-${randomPart}`;
};

const generateProductNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PD-${randomPart}`;
};

const ServiceAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    type: '',
    priority: '',
    orderNo: '',
    clientId: '',
    serviceStaff: '',
    startDateTime: '',
    endDateTime: '',
    taskDuration: '',
    activeStatus: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      clientId: generateServiceNumber(),
      productId: generateProductNumber(),
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      product_id: formData.productId,
      product_name: formData.productName,
  type: formData.type, // FIXED HERE
      priority: formData.priority,
      order_no: formData.orderNo,
      client_id: formData.clientId,
      service_staff: formData.serviceStaff,
      start_datetime: formData.startDateTime,
      end_datetime: formData.endDateTime,
      task_duration: formData.taskDuration,
      active_status: formData.activeStatus,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/product-services/create', payload);
      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: 'Service created successfully!',
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/dashboard/operations/service');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create service. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div style={containerStyle}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📝</div>
            <h3 style={cardHeaderStyle}>Basic Information</h3>
          </div>

          <div style={uploadContainerStyle}>
            <label style={uploadButtonStyle}>
              <input
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <span style={uploadIconStyle}>☁️</span>
              Upload Image
            </label>
            <span style={uploadHintStyle}>
              Supported formats: JPG, PNG (max size: 2MB)
            </span>
          </div>

          <div style={fieldsContainerStyle}>
            <Field
              label="Product ID"
              placeholder="Auto-generated Product ID"
              value={formData.productId}
              readOnly={true}
            />
            <Field
              label="Product Name"
              placeholder="Enter Product Name"
              value={formData.productName}
              onChange={(value) => handleInputChange('productName', value)}
            />
          </div>
        </div>

        <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Additional Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Type"
              placeholder="Enter Type"
              value={formData.type}
              onChange={(value) => handleInputChange('type', value)}
            />
            <Field
              label="Priority"
              placeholder="Enter Priority"
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
            />
            <Field
              label="Order No"
              placeholder="Enter Order No"
              value={formData.orderNo}
              onChange={(value) => handleInputChange('orderNo', value)}
            />
            <Field
              label="Client ID"
              placeholder="Auto-generated Client ID"
              value={formData.clientId}
              readOnly={true}
            />
            <Field
              label="Service Staff"
              placeholder="Enter Service Staff"
              value={formData.serviceStaff}
              onChange={(value) => handleInputChange('serviceStaff', value)}
            />
            <Field
              label="Start Date & Time"
              placeholder="Select Start Date & Time"
              type="datetime-local"
              value={formData.startDateTime}
              onChange={(value) => handleInputChange('startDateTime', value)}
            />
            <Field
              label="End Date & Time"
              placeholder="Select End Date & Time"
              type="datetime-local"
              value={formData.endDateTime}
              onChange={(value) => handleInputChange('endDateTime', value)}
            />
            <Field
              label="Task Duration"
              placeholder="Enter Task Duration"
              value={formData.taskDuration}
              onChange={(value) => handleInputChange('taskDuration', value)}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🎛️</div>
            <h3 style={cardHeaderStyle}>Control</h3>
          </div>
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.activeStatus}
                onChange={(e) => handleInputChange('activeStatus', e.target.checked)}
              />
              <div style={{
                ...checkboxCustomStyle,
                backgroundColor: formData.activeStatus ? '#2563eb' : '#ffffff',
                borderColor: formData.activeStatus ? '#2563eb' : '#d1d5db',
              }}>
                {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
                <span style={checkboxDescStyle}>Enable this service for use in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={() => navigate(-1)}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value, onChange, readOnly = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
    />
  </div>
);

// Style constants here (same as you already have)
const containerStyle = { padding: '2rem', fontFamily: 'Inter, sans-serif', minHeight: '100vh', lineHeight: 1.6 };
const formContainerStyle = { display: 'grid', gap: '1.5rem', maxWidth: '1600px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' };
const cardStyle = { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', height: 'fit-content' };
const cardHeaderContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' };
const iconStyle = { fontSize: '1.25rem', marginRight: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' };
const cardHeaderStyle = { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 };
const uploadContainerStyle = { marginBottom: '1.5rem' };
const uploadButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', transition: 'background-color 0.2s' };
const uploadIconStyle = { fontSize: '1rem' };
const uploadHintStyle = { display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' };
const fieldsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#ffffff', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' };
const checkboxContainerStyle = { marginTop: '0.5rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.75rem' };
const checkboxStyle = { display: 'none' };
const checkboxCustomStyle = { width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #d1d5db', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' };
const checkmarkStyle = { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' };
const checkboxTextStyle = { fontSize: '0.875rem', fontWeight: '500', color: '#374151' };
const checkboxDescStyle = { fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' };
const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', maxWidth: '1400px', margin: '2rem auto 0', padding: '0 1.5rem' };
const cancelBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' };
const createBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' };

export default ServiceAdd;
