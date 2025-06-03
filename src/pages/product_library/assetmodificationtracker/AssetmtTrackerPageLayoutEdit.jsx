import React, { useState } from 'react';

const AssetmtTrackerPageLayoutEdit = () => {
  const [formData, setFormData] = useState({
    assetId: 'AST-2023-1056',
    assetName: 'Dell Latitude 5420',
    category: 'Laptop',
    serialNumber: 'DL5420XK2039',
    model: 'Latitude 5420',
    manufacturer: 'Dell',
    assignedTo: 'John Doe (EMP1024)',
    department: 'IT',
    purchaseDate: '2023-05-15',
    warrantyActive: true,
    purchaseCost: '1250.00',
    supplier: 'Dell Technologies',
    notes: 'Includes 3-year premium support. Battery replaced Jan 2024.',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Asset Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📝</div>
            <h3 style={cardHeaderStyle}>Asset Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Asset ID"
              value={formData.assetId}
              onChange={(value) => handleInputChange('assetId', value)}
              disabled
            />
            <Field
              label="Asset Name"
              value={formData.assetName}
              onChange={(value) => handleInputChange('assetName', value)}
            />
            <Field
              label="Category"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
            />
            <Field
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(value) => handleInputChange('serialNumber', value)}
            />
            <Field
              label="Model"
              value={formData.model}
              onChange={(value) => handleInputChange('model', value)}
            />
            <Field
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(value) => handleInputChange('manufacturer', value)}
            />
          </div>
        </div>

        {/* Assignment & Status Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📅</div>
            <h3 style={cardHeaderStyle}>Assignment Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(value) => handleInputChange('assignedTo', value)}
            />
            <Field
              label="Department"
              value={formData.department}
              onChange={(value) => handleInputChange('department', value)}
            />
            <Field
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(value) => handleInputChange('purchaseDate', value)}
            />
          </div>
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.warrantyActive}
                onChange={(e) => handleInputChange('warrantyActive', e.target.checked)}
              />
              <div style={checkboxCustomStyle}>
                {formData.warrantyActive && <span style={checkmarkStyle}>✓</span>}
              </div>
              <div>
                <span style={checkboxTextStyle}>Warranty Active</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div style={{ ...cardStyle, maxWidth: '1200px', margin: '1.5rem auto' }}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>ℹ️</div>
          <h3 style={cardHeaderStyle}>Additional Information</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field
            label="Purchase Cost"
            type="number"
            value={formData.purchaseCost}
            onChange={(value) => handleInputChange('purchaseCost', value)}
          />
          <Field
            label="Supplier"
            value={formData.supplier}
            onChange={(value) => handleInputChange('supplier', value)}
          />
        </div>
        <div style={textareaContainerStyle}>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={textareaStyle}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle}>Update Asset</button>
      </div>
    </div>
  );
};

const Field = ({ label, value, type = 'text', disabled = false, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      style={{ ...inputStyle, backgroundColor: disabled ? '#f3f4f6' : 'white' }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

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
};

const textareaContainerStyle = {
  marginTop: '1rem',
};

const textareaStyle = {
  width: '100%',
  minHeight: '80px',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  resize: 'vertical',
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

export default AssetmtTrackerPageLayoutEdit;