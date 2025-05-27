import React, { useState } from 'react';

const StockLoAddPage = () => {
  const [formData, setFormData] = useState({
    stockLocationId: '',
    stockName: '',
    mailId: '',
    phoneNo: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    landmark: '',
    street: '',
    activeStatus: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Stock Location Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>Stock Location Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Stock Location ID" 
              placeholder="Enter Stock Location ID" 
              value={formData.stockLocationId}
              onChange={(value) => handleInputChange('stockLocationId', value)}
              required
            />
            <Field 
              label="Stock Name" 
              placeholder="Enter Stock Name" 
              value={formData.stockName}
              onChange={(value) => handleInputChange('stockName', value)}
              required
            />
            <Field 
              label="Mail ID" 
              type="email"
              placeholder="Email id" 
              value={formData.mailId}
              onChange={(value) => handleInputChange('mailId', value)}
            />
            <Field 
              label="Phone No" 
              type="tel"
              placeholder="Contact number" 
              value={formData.phoneNo}
              onChange={(value) => handleInputChange('phoneNo', value)}
            />
          </div>
        </div>

        {/* Address Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏠</div>
            <h3 style={cardHeaderStyle}>Address Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Pincode" 
              placeholder="Enter Pincode" 
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
            />
            <Field 
              label="Country" 
              placeholder="Enter Country" 
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
            />
            <Field 
              label="State" 
              placeholder="Enter State" 
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
            />
            <Field 
              label="City" 
              placeholder="Enter City" 
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
            />
            <Field 
              label="Landmark" 
              placeholder="Enter Landmark" 
              value={formData.landmark}
              onChange={(value) => handleInputChange('landmark', value)}
            />
            <Field 
              label="Street" 
              placeholder="Enter Street" 
              value={formData.street}
              onChange={(value) => handleInputChange('street', value)}
            />
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
                <span style={checkboxDescStyle}>Enable this stock location for use in the system</span>
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
          Create Location
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
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Enhanced Styles (Identical to Asset component)
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const titleContainerStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
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

export default StockLoAddPage;