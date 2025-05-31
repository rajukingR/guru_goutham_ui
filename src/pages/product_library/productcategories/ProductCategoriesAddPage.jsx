import React, { useState } from 'react';
import axios from 'axios';

const AddProductCategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryCode: '',
    categoryName: '',
    hsnCode: '',
    categoryType: 'Standalone',
    description: '',
    activeStatus: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        category_code: formData.categoryCode,
        category_name: formData.categoryName,
        hsn_code: formData.hsnCode,
        category_type: formData.categoryType,
        description: formData.description,
        is_active: formData.activeStatus,
      };

      const response = await axios.post('http://localhost:5000/api/product-categories/create', payload);

      setSuccess('Category created successfully!');
      setError(null);
      setFormData({
        categoryCode: '',
        categoryName: '',
        hsnCode: '',
        categoryType: 'Standalone',
        description: '',
        activeStatus: false,
      });
    } catch (error) {
      setError('Failed to create category. Please try again.');
      setSuccess(null);
    }
  };

  const hsnOptions = ['1001', '2002', '3003', '4004', '5005'];
  const categoryTypeOptions = ['Standalone', 'Peripheral', 'Assembled'];

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Product Category Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Category Code"
              placeholder="Enter Category Code"
              value={formData.categoryCode}
              onChange={(value) => handleInputChange('categoryCode', value)}
              required
            />
            <Field 
              label="Category Name"
              placeholder="Enter Category Name"
              value={formData.categoryName}
              onChange={(value) => handleInputChange('categoryName', value)}
              required
            />
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>HSN Code</label>
              <select
                style={inputStyle}
                value={formData.hsnCode}
                onChange={(e) => handleInputChange('hsnCode', e.target.value)}
              >
                <option value="">Select HSN Code</option>
                {hsnOptions.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Category Type</label>
              <select
                style={inputStyle}
                value={formData.categoryType}
                onChange={(e) => handleInputChange('categoryType', e.target.value)}
              >
                {categoryTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div style={{ ...fieldContainerStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                rows={3}
                placeholder="Enter Description"
                style={{ ...inputStyle, resize: 'vertical' }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>

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
                                <span style={checkboxDescStyle}>Enable this category for use in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button
          type="button"
          style={cancelBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          Cancel
        </button>
        <button
          type="button"
          style={createBtnStyle}
          onClick={handleSubmit}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Create Category
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', required = false, value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", sans-serif',
  minHeight: '100vh',
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
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '1rem',
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
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
};

const requiredStyle = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const inputStyle = {
  padding: '0.6rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  outline: 'none',
};

const checkboxContainerStyle = {
  marginTop: '1rem',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  cursor: 'pointer',
};

const checkboxStyle = {
  display: 'none',
};

const checkboxCustomStyle = {
  width: '20px',
  height: '20px',
  backgroundColor: '#f9fafb',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const checkmarkStyle = {
  fontSize: '0.875rem',
  color: '#2563eb',
};

const checkboxTextStyle = {
  fontWeight: '600',
  color: '#1f2937',
};

const checkboxDescStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '2rem',
};

const cancelBtnStyle = {
  backgroundColor: '#f3f4f6',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontWeight: '500',
  color: '#111827',
  cursor: 'pointer',
};

const createBtnStyle = {
  backgroundColor: '#2563eb',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: '500',
  color: '#ffffff',
  cursor: 'pointer',
};

export default AddProductCategoryForm;