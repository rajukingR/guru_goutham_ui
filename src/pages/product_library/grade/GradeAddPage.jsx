import React, { useState } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // at the top

const GradeAddPage = () => {
  const navigate = useNavigate(); // inside your component

  const [formData, setFormData] = useState({
    gradeId: '',
    gradeName: '',
    description: '',
    activeStatus: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        grade_id: formData.gradeId,
        grade_name: formData.gradeName,
        description: formData.description,
        is_active: formData.activeStatus,
      };

      const response = await axios.post('http://localhost:5000/api/grades/create', payload);
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
        setTimeout(() => {
        navigate('/dashboard/product_library/grade');
      }, 1000);
    } catch (error) {
      console.error('Error creating grade:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create grade. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Grade Information */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📝</div>
            <h3 style={cardHeaderStyle}>Grade Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Grade ID"
              placeholder="Enter Grade ID"
              value={formData.gradeId}
              onChange={(value) => handleInputChange('gradeId', value)}
            />
            <Field
              label="Grade Name"
              placeholder="Enter Grade Name"
              value={formData.gradeName}
              onChange={(value) => handleInputChange('gradeName', value)}
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

        {/* Configuration */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Configuration</h3>
          </div>
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.activeStatus}
                onChange={(e) => handleInputChange('activeStatus', e.target.checked)}
              />
              <div style={checkboxCustomStyle}>
                {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
                <span style={checkboxDescStyle}>Enable this grade for use in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Create</button>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const Field = ({ label, placeholder, value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Styling constants (same as before)
const containerStyle = { padding: '2rem', fontFamily: 'Inter, sans-serif', minHeight: '100vh', lineHeight: 1.6 };
const formContainerStyle = { display: 'grid', gap: '1.5rem', maxWidth: '800px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' };
const cardStyle = { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const cardHeaderContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' };
const iconStyle = { fontSize: '1.25rem', marginRight: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' };
const cardHeaderStyle = { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 };
const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#fff' };
const textareaContainerStyle = { marginTop: '1rem' };
const textareaStyle = { width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#fff', resize: 'vertical' };
const checkboxContainerStyle = { marginTop: '0.5rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.75rem' };
const checkboxStyle = { display: 'none' };
const checkboxCustomStyle = { width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #d1d5db', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const checkmarkStyle = { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' };
const checkboxTextStyle = { fontSize: '0.875rem', fontWeight: '500', color: '#374151' };
const checkboxDescStyle = { fontSize: '0.75rem', color: '#6b7280' };
const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', marginTop: '2rem', maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' };
const cancelBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' };
const createBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default GradeAddPage;
