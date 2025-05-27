import React, { useState } from 'react';

const AssetPageLayoutAdd = () => {
  const [formData, setFormData] = useState({
    assetTagId: '',
    parentAssetId: '',
    productName: '',
    poId: '',
    supplier: '',
    stockLocation: '',
    assetStatus: 'Available',
    client: '',
    date: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    warrantyTime: '',
    remarks: '',
    activeStatus: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Asset Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Asset Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Asset Tag ID" 
              placeholder="Enter Asset Tag ID" 
              value={formData.assetTagId}
              onChange={(value) => handleInputChange('assetTagId', value)}
              required
            />
            <Field 
              label="Parent Asset ID" 
              type="select" 
              placeholder="Select Parent Asset ID" 
              value={formData.parentAssetId}
              onChange={(value) => handleInputChange('parentAssetId', value)}
            />
            <Field 
              label="Product Name" 
              type="select" 
              placeholder="Select Product Name" 
              value={formData.productName}
              onChange={(value) => handleInputChange('productName', value)}
              required
            />
            <Field 
              label="Purchase Order ID" 
              type="select" 
              placeholder="Select Purchase Order" 
              value={formData.poId}
              onChange={(value) => handleInputChange('poId', value)}
            />
            <Field 
              label="Supplier" 
              type="select" 
              placeholder="Select Supplier" 
              value={formData.supplier}
              onChange={(value) => handleInputChange('supplier', value)}
            />
            <Field 
              label="Stock Location" 
              type="select" 
              placeholder="Select Stock Location" 
              value={formData.stockLocation}
              onChange={(value) => handleInputChange('stockLocation', value)}
            />
            <Field 
              label="Asset Status" 
              type="select" 
              placeholder="Available" 
              value={formData.assetStatus}
              onChange={(value) => handleInputChange('assetStatus', value)}
            />
            <Field 
              label="Client" 
              type="select" 
              placeholder="Select Client" 
              value={formData.client}
              onChange={(value) => handleInputChange('client', value)}
            />
          </div>
        </div>

        {/* Additional Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📅</div>
            <h3 style={cardHeaderStyle}>Additional Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Purchase Date" 
              type="date" 
              placeholder="dd-mm-yyyy" 
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
            />
            <Field 
              label="Warranty Start Date" 
              type="date" 
              placeholder="dd-mm-yyyy" 
              value={formData.warrantyStartDate}
              onChange={(value) => handleInputChange('warrantyStartDate', value)}
            />
            <Field 
              label="Warranty End Date" 
              type="date" 
              placeholder="dd-mm-yyyy" 
              value={formData.warrantyEndDate}
              onChange={(value) => handleInputChange('warrantyEndDate', value)}
            />
            <Field 
              label="Warranty Period" 
              placeholder="e.g., 12 months, 2 years" 
              value={formData.warrantyTime}
              onChange={(value) => handleInputChange('warrantyTime', value)}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field 
                label="Remarks" 
                placeholder="Enter additional notes or comments" 
                type="textarea"
                value={formData.remarks}
                onChange={(value) => handleInputChange('remarks', value)}
              />
            </div>
          </div>
        </div>

        {/* Control Section */}
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
                <span style={checkboxDescStyle}>Enable this asset for use in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'} onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
          Cancel
        </button>
        <button style={createBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}>
          Create Asset
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', required = false, value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

// Enhanced Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 0.5rem 0',
  letterSpacing: '-0.025em',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: 0,
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1200px',
  margin: '0 auto',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  transition: 'box-shadow 0.2s ease',
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
  letterSpacing: '0.025em',
};

const requiredStyle = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectWrapperStyle = {
  position: 'relative',
  width: '100%',
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  paddingRight: '2.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

const selectArrowStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  fontSize: '0.75rem',
  color: '#6b7280',
};

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const checkboxContainerStyle = {
  marginTop: '0.5rem',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  cursor: 'pointer',
  gap: '0.75rem',
};

const checkboxStyle = {
  display: 'none',
};

const checkboxCustomStyle = {
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  border: '2px solid #d1d5db',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  marginTop: '2px',
};

const checkmarkStyle = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
};

const checkboxTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  display: 'block',
};

const checkboxDescStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  display: 'block',
  marginTop: '0.25rem',
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
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
};

export default AssetPageLayoutAdd;