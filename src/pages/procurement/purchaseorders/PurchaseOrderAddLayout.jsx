import React, { useState } from 'react';

const PurchaseOrderAddLayout = () => {
  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    purchaseQuotationDetails: '',
    purchaseQuotationId: '',
    purchaseQuotationStatus: 'Pending',
    purchaseOrderDate: '28-05-2025',
    purchaseType: 'Buy',
    poStatus: 'Pending',
    owner: '',
    supplier: '',
    description: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Purchase Order Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Purchase Order Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Purchase Order ID" 
              placeholder="Enter Purchase Order ID" 
              value={formData.purchaseOrderId}
              onChange={(value) => handleInputChange('purchaseOrderId', value)}
            />
            <Field 
              label="Purchase Quotation Details" 
              type="select" 
              placeholder="Select Purchase Quotation" 
              value={formData.purchaseQuotationDetails}
              onChange={(value) => handleInputChange('purchaseQuotationDetails', value)}
            />
            <Field 
              label="Purchase Quotation ID" 
              placeholder="Enter Purchase Quotation ID" 
              value={formData.purchaseQuotationId}
              onChange={(value) => handleInputChange('purchaseQuotationId', value)}
            />
            <Field 
              label="Purchase Quotation Status" 
              placeholder="Pending" 
              value={formData.purchaseQuotationStatus}
              disabled
            />
            <Field 
              label="Purchase Order Date" 
              type="date" 
              placeholder="dd-mm-yyyy" 
              value={formData.purchaseOrderDate}
              onChange={(value) => handleInputChange('purchaseOrderDate', value)}
            />
            <Field 
              label="Purchase Type" 
              placeholder="Buy" 
              value={formData.purchaseType}
              disabled
            />
            <Field 
              label="PO Status" 
              type="select" 
              placeholder="Pending" 
              value={formData.poStatus}
              onChange={(value) => handleInputChange('poStatus', value)}
            />
            <Field 
              label="Owner" 
              placeholder="Enter Owner" 
              value={formData.owner}
              onChange={(value) => handleInputChange('owner', value)}
            />
          </div>
        </div>

        {/* Supplier Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📞</div>
            <h3 style={cardHeaderStyle}>Supplier Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Supplier" 
              type="select" 
              placeholder="Select Supplier" 
              value={formData.supplier}
              onChange={(value) => handleInputChange('supplier', value)}
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>ℹ️</div>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Description" 
              placeholder="Enter Description" 
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle}>Create</button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value, onChange, disabled = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    )}
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
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem',
  maxWidth: '1400px',
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
};

export default PurchaseOrderAddLayout;