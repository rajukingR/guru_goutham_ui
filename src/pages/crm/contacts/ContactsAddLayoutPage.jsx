import React, { useState } from 'react';

const ContactsAddLayoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    customerId: '',
    date: '2025-05-28',
    industry: '',
    paymentType: 'Prepaid',
    street: '',
    landmark: '',
    pincode: '',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    gst: '',
    pan: '',
    owner: '',
    remarks: '',
    contactGeneratedBy: 'remote',
    activeStatus: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <h1 style={titleStyle}>Create a new Contact</h1>
      </div>
      
      <div style={formContainerStyle}>
        {/* Personal Details Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Personal Details</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <Field 
              label="First Name"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              required
            />
            
            <Field 
              label="Last Name"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
            />
            
            <Field 
              label="Email ID"
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
            />
            
            <Field 
              label="Phone Number"
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
            />
            
            <Field 
              label="Company/Institute Name"
              placeholder="Enter Company Name"
              value={formData.company}
              onChange={(value) => handleInputChange('company', value)}
            />
            
            <Field 
              label="Customer ID"
              placeholder="Enter Customer ID"
              value={formData.customerId}
              onChange={(value) => handleInputChange('customerId', value)}
            />
            
            <Field 
              label="Date"
              type="date"
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
            />
            
            <Field 
              label="Industry"
              placeholder="Enter Industry"
              value={formData.industry}
              onChange={(value) => handleInputChange('industry', value)}
            />
            
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Payment Type
              </label>
              <div style={selectWrapperStyle}>
                <select
                  style={selectStyle}
                  value={formData.paymentType}
                  onChange={(e) => handleInputChange('paymentType', e.target.value)}
                >
                  <option value="Prepaid">Prepaid</option>
                  <option value="Postpaid">Postpaid</option>
                  <option value="Credit">Credit</option>
                </select>
                <div style={selectArrowStyle}>▼</div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏠</div>
            <h3 style={cardHeaderStyle}>Address</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <Field 
              label="Street"
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
            
            <Field 
              label="Pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
            />
            
            <Field 
              label="City"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
            />
            
            <Field 
              label="State"
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
            />
            
            <Field 
              label="Country"
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
            />
          </div>
        </div>

        {/* Bank Details Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏦</div>
            <h3 style={cardHeaderStyle}>Bank Details</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <Field 
              label="GST"
              placeholder="Enter GST"
              value={formData.gst}
              onChange={(value) => handleInputChange('gst', value)}
            />
            
            <Field 
              label="PAN No"
              placeholder="Enter PAN No"
              value={formData.pan}
              onChange={(value) => handleInputChange('pan', value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={formContainerStyle}>
        {/* Other Information */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>ℹ️</div>
            <h3 style={cardHeaderStyle}>Other Information</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <Field 
              label="Owner"
              placeholder="Enter Owner Name"
              value={formData.owner}
              onChange={(value) => handleInputChange('owner', value)}
            />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Field 
                label="Remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(value) => handleInputChange('remarks', value)}
              />
            </div>
            
            <Field 
              label="Contact Generated By"
              value={formData.contactGeneratedBy}
              onChange={(value) => handleInputChange('contactGeneratedBy', value)}
            />
          </div>
        </div>

        {/* Control */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
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
              <div style={checkboxCustomStyle}>
                {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
                <span style={checkboxDescStyle}>Enable this contact in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button 
          style={cancelBtnStyle} 
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'} 
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          Cancel
        </button>
        <button 
          style={createBtnStyle} 
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'} 
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Create
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
    {type === 'textarea' ? (
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

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const headerContainerStyle = {
  maxWidth: '1400px',
  padding: '0 1.5rem',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 0.25rem 0',
  letterSpacing: '-0.025em',
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  padding: '0 1.5rem',
  marginTop: '1.5rem',
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
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  minHeight: '100px',
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

export default ContactsAddLayoutPage;