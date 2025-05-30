import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const GrmEditPageLayoutOpe = () => {
  const [formData, setFormData] = useState({
    grnId: 'GRN001',
    grnTitle: 'Goods Return Note for Customer ABC',
    selectedCustomer: 'Customer 1',
    customerId: 'CUS001',
    email: 'customer@example.com',
    phoneNo: '1234567890',
    grnDate: new Date('2023-03-15'),
    gstNumber: 'GST123456789',
    pan: 'PAN123456',
    grnCreatedBy: 'rounder',
    industry: 'Manufacturing',
    companyName: 'ABC Corporation',
    pincode: '123456',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    street: '123, Street Name',
    landmark: 'Near Landmark',
    informedPersonName: 'John Doe',
    informedPersonPhoneNo: '9876543210',
    returnerName: 'Jane Doe',
    returnerPhoneNo: '9876543211',
    receiverName: 'Richard Roe',
    receiverPhoneNo: '9876543212',
    description: 'This is a sample goods return note.',
    vehicleNumber: 'MH01AB1234',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Edit Goods Return Note</h1>
        <p style={subtitleStyle}>Update the details below to edit a GRN</p>
      </div>

      <div style={formContainerStyle}>
        {/* Basic Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Basic Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="GRN ID" 
              placeholder="Enter GRN ID" 
              value={formData.grnId}
              onChange={(value) => handleInputChange('grnId', value)}
              disabled
            />
            <Field 
              label="GRN Title" 
              placeholder="Enter GRN Title" 
              value={formData.grnTitle}
              onChange={(value) => handleInputChange('grnTitle', value)}
            />
            <Field 
              label="Select Customer" 
              type="select" 
              placeholder="Select Customer" 
              value={formData.selectedCustomer}
              onChange={(value) => handleInputChange('selectedCustomer', value)}
              options={['Customer 1', 'Customer 2']}
            />
            <Field 
              label="Customer ID" 
              placeholder="Enter Customer ID" 
              value={formData.customerId}
              onChange={(value) => handleInputChange('customerId', value)}
            />
            <Field 
              label="Email ID" 
              placeholder="Enter Email ID" 
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
            />
            <Field 
              label="Phone No" 
              placeholder="Enter Phone No" 
              value={formData.phoneNo}
              onChange={(value) => handleInputChange('phoneNo', value)}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>GRN Date</label>
                  <DatePicker 
                    value={formData.grnDate} 
                    onChange={(date) => handleInputChange('grnDate', date)} 
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div style={dateInputWrapper}>
                        <input ref={inputRef} {...inputProps} style={dateInputStyle} />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />
                </div>
              </LocalizationProvider>
            </div>
            <Field 
              label="GST Number" 
              placeholder="Enter GST Number" 
              value={formData.gstNumber}
              onChange={(value) => handleInputChange('gstNumber', value)}
            />
            <Field 
              label="PAN" 
              placeholder="Enter PAN" 
              value={formData.pan}
              onChange={(value) => handleInputChange('pan', value)}
            />
            <Field 
              label="GRN Created By" 
              placeholder="GRN Created By" 
              value={formData.grnCreatedBy}
              onChange={(value) => handleInputChange('grnCreatedBy', value)}
              disabled
            />
            <Field 
              label="Industry" 
              placeholder="Enter Industry" 
              value={formData.industry}
              onChange={(value) => handleInputChange('industry', value)}
            />
          </div>
        </div>

        {/* To Address Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏠</div>
            <h3 style={cardHeaderStyle}>To Address</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Company Name" 
              placeholder="Enter Company Name" 
              value={formData.companyName}
              onChange={(value) => handleInputChange('companyName', value)}
            />
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
          </div>
        </div>

        {/* Person Info Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Person Info</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Informed Person Name" 
              placeholder="Enter Informed Person Name" 
              value={formData.informedPersonName}
              onChange={(value) => handleInputChange('informedPersonName', value)}
            />
            <Field 
              label="Informed Person Phone No" 
              placeholder="Enter Informed Person Phone No" 
              value={formData.informedPersonPhoneNo}
              onChange={(value) => handleInputChange('informedPersonPhoneNo', value)}
            />
            <Field 
              label="Returner Name" 
              placeholder="Enter Returner Name" 
              value={formData.returnerName}
              onChange={(value) => handleInputChange('returnerName', value)}
            />
            <Field 
              label="Returner Phone No" 
              placeholder="Enter Returner Phone No" 
              value={formData.returnerPhoneNo}
              onChange={(value) => handleInputChange('returnerPhoneNo', value)}
            />
            <Field 
              label="Receiver Name" 
              placeholder="Enter Receiver Name" 
              value={formData.receiverName}
              onChange={(value) => handleInputChange('receiverName', value)}
            />
            <Field 
              label="Receiver Phone No" 
              placeholder="Enter Receiver Phone No" 
              value={formData.receiverPhoneNo}
              onChange={(value) => handleInputChange('receiverPhoneNo', value)}
            />
            <Field 
              label="Description" 
              placeholder="Enter Description" 
              type="textarea"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
            />
            <Field 
              label="Vehicle Number" 
              placeholder="Enter Vehicle Number" 
              value={formData.vehicleNumber}
              onChange={(value) => handleInputChange('vehicleNumber', value)}
            />
          </div>
        </div>
      </div>

      {/* Selected Products Section */}
      <div style={productsSectionStyle}>
        <h3 style={sectionTitleStyle}>Selected Products</h3>
        <button style={selectProductBtnStyle}>
          Select Product
        </button>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'} onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
          Cancel
        </button>
        <button style={createBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}>
          Update
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: '2rem',
  maxWidth: '1400px',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 0.5rem 0',
  letterSpacing: '-0.025em',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: '#64748b',
marginBottom: '1rem',
}

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

const dateFieldContainer = {
  width: '100%',
  marginBottom: '1rem',
};

const dateInputWrapper = {
  position: 'relative',
  width: '100%',
};

const dateInputStyle = {
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

const productsSectionStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const sectionTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '1rem',
};

const selectProductBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ffffff',
  color: '#2563eb',
  border: '1px solid #2563eb',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
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

const Field = ({ label, placeholder, type = 'text', value, onChange, options = [], disabled = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
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
        disabled={disabled}
      />
    ) : type === 'date' ? (
      <input
        type="date"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
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

export default GrmEditPageLayoutOpe;