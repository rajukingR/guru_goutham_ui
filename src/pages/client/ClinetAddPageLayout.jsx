import React, { useState } from 'react';

const ClinetAddPageLayout = () => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    companyName: '',
    productCost: '',
    rentalStartDate: '',
    rentalReturnDate: '',
    email: '',
    country: '',                                                                              
    city: '',
    customerIndustry: '',
    phoneNumber: '',
    rentalCost: '',
    clientStatus: '',
    address: '',
    state: '',
    activeStatus: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
  };

  const handleCancel = () => {
    setFormData({
      clientId: '',
      clientName: '',
      companyName: '',
      productCost: '',
      rentalStartDate: '',
      rentalReturnDate: '',
      email: '',
      country: '',
      city: '',
      customerIndustry: '',
      phoneNumber: '',
      rentalCost: '',
      clientStatus: '',
      address: '',
      state: '',
      activeStatus: false
    });
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Client Details</h2>

      <div style={formSectionStyle}>
        {/* Left Column */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Personal Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Client ID" 
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              placeholder="Enter Client ID" 
            />
            <Field 
              label="Client Name" 
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Enter Client Name" 
            />
            <Field 
              label="Company Name" 
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter Company Name" 
            />
            <Field 
              label="Customer Industry" 
              name="customerIndustry"
              value={formData.customerIndustry}
              onChange={handleInputChange}
              placeholder="Enter Customer Industry" 
            />
            <Field 
              label="Phone Number" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
              type="tel"
            />
            <Field 
              label="Email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              type="email"
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💰</div>
            <h3 style={cardHeaderStyle}>Financial & Location Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Product Cost" 
              name="productCost"
              value={formData.productCost}
              onChange={handleInputChange}
              placeholder="Enter Product Cost"
              type="number"
            />
            <Field 
              label="Rental Cost" 
              name="rentalCost"
              value={formData.rentalCost}
              onChange={handleInputChange}
              placeholder="Enter Rental Cost"
              type="number"
            />
            <Field 
              label="Client Status" 
              name="clientStatus"
              value={formData.clientStatus}
              onChange={handleInputChange}
              placeholder="Enter Client Status" 
            />
            <Field 
              label="Country" 
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter Country" 
            />
            <Field 
              label="State" 
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter State" 
            />
            <Field 
              label="City" 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter City" 
            />
          </div>
        </div>
      </div>

      {/* Dates & Address Section */}
      <div style={fullWidthSectionStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📅</div>
            <h3 style={cardHeaderStyle}>Rental Dates & Address</h3>
          </div>
          <div style={dateAddressGridStyle}>
            <Field 
              label="Rental Start Date" 
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={handleInputChange}
              type="date"
            />
            <Field 
              label="Rental Return Date" 
              name="rentalReturnDate"
              value={formData.rentalReturnDate}
              onChange={handleInputChange}
              type="date"
            />
            <Field 
              label="Address" 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter Address"
              type="textarea"
              style={{ gridColumn: '1 / -1' }}
            />
          </div>
        </div>
      </div>

      {/* Active Status Section */}
      <div style={statusSectionStyle}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            name="activeStatus"
            checked={formData.activeStatus}
            onChange={handleInputChange}
            style={checkboxStyle}
          />
          <span style={checkboxTextStyle}>Active Status</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={handleCancel}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', name, value, onChange, style }) => (
  <div style={{...fieldContainerStyle, ...style}}>
    <label style={labelStyle}>{label}</label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{...inputStyle, height: '80px', resize: 'vertical'}}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
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
  maxWidth: '1400px',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '1.5rem',
  textAlign: 'Start',
};

const formSectionStyle = {
  display: 'flex',
  gap: '1.5rem',
  marginBottom: '1.5rem',
};

const fullWidthSectionStyle = {
  marginBottom: '1.5rem',
};

const cardStyle = {
  flex: 1,
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '2px solid #e2e8f0',
};

const iconStyle = {
  fontSize: '1.25rem',
  marginRight: '0.75rem',
  backgroundColor: '#f1f5f9',
  padding: '0.5rem',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
};

const dateAddressGridStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
  transition: 'border-color 0.2s, box-shadow 0.2s',
  outline: 'none',
  boxSizing: 'border-box',
  ':focus': {
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  }
};

const statusSectionStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem 1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  marginBottom: '1.5rem',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};

const checkboxStyle = {
  width: '16px',
  height: '16px',
  marginRight: '0.75rem',
  accentColor: '#2563eb',
};

const checkboxTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
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
  transition: 'background-color 0.2s',
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
  transition: 'background-color 0.2s',
};

export default ClinetAddPageLayout;