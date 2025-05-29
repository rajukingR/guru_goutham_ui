import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const LeadsLayoutAddPage = () => {
  const [formData, setFormData] = useState({
    leadId: '',
    leadTitle: '',
    transactionType: '',
    leadStatus: '',
    sourceOfEnquiry: '',
    rentalDuration: '',
    rentalStartDate: new Date(),
    rentalEndDate: new Date(),
    leadDate: new Date(),
    owner: '',
    remarks: '',
    leadGeneratedBy: '',
    activeStatus: true,
    customerId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    industry: '',
    street: '',
    landmark: '',
    pincode: '',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Create a new Lead</h1>
        <p style={subtitleStyle}>Fill in the details below to create a new lead</p>
      </div>

      <div style={formContainerStyle}>
        {/* Lead Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Lead Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Lead ID" 
              placeholder="Enter Lead ID" 
              value={formData.leadId}
              onChange={(value) => handleInputChange('leadId', value)}
            />
            <Field 
              label="Lead Title" 
              placeholder="Enter Lead Title" 
              value={formData.leadTitle}
              onChange={(value) => handleInputChange('leadTitle', value)}
            />
            <Field 
              label="Transaction Type" 
              type="select" 
              placeholder="Select Transaction Type" 
              value={formData.transactionType}
              onChange={(value) => handleInputChange('transactionType', value)}
              options={['Rent', 'Buy']}
            />
            <Field 
              label="Lead Status" 
              type="select" 
              placeholder="Select Lead Status" 
              value={formData.leadStatus}
              onChange={(value) => handleInputChange('leadStatus', value)}
              options={['New', 'Contacted']}
            />
            <Field 
              label="Source of Enquiry" 
              type="select" 
              placeholder="Select Source of Enquiry" 
              value={formData.sourceOfEnquiry}
              onChange={(value) => handleInputChange('sourceOfEnquiry', value)}
              options={['Search Engine', 'Referral']}
            />
            <Field 
              label="Rental Duration (Months)" 
              placeholder="Enter Rental Duration" 
              value={formData.rentalDuration}
              onChange={(value) => handleInputChange('rentalDuration', value)}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Rental Start Date</label>
                  <DatePicker 
                    value={formData.rentalStartDate} 
                    onChange={(date) => handleInputChange('rentalStartDate', date)} 
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
            <div style={{ gridColumn: '1 / -1' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Rental End Date</label>
                  <DatePicker 
                    value={formData.rentalEndDate} 
                    onChange={(date) => handleInputChange('rentalEndDate', date)} 
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
            <div style={{ gridColumn: '1 / -1' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Lead Date</label>
                  <DatePicker 
                    value={formData.leadDate} 
                    onChange={(date) => handleInputChange('leadDate', date)} 
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
              label="Owner" 
              placeholder="Enter Owner Name" 
              value={formData.owner}
              onChange={(value) => handleInputChange('owner', value)}
            />
            <Field 
              label="Remarks" 
              placeholder="Enter Remarks" 
              type="textarea"
              value={formData.remarks}
              onChange={(value) => handleInputChange('remarks', value)}
            />
            <Field 
              label="Lead Generated By" 
              placeholder="Enter Lead Generated By" 
              value={formData.leadGeneratedBy}
              onChange={(value) => handleInputChange('leadGeneratedBy', value)}
            />
          </div>
        </div>

        {/* Personal Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Personal Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Customer" 
              type="select" 
              placeholder="Select Customer" 
              value={formData.selectedCustomer}
              onChange={(value) => handleInputChange('selectedCustomer', value)}
              options={['Customer1', 'Customer2']}
            />
            <Field 
              label="Customer ID" 
              placeholder="Enter Customer ID" 
              value={formData.customerId}
              onChange={(value) => handleInputChange('customerId', value)}
            />
            <Field 
              label="First Name" 
              placeholder="Enter First Name" 
              value={formData.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
            />
            <Field 
              label="Last Name" 
              placeholder="Enter Last Name" 
              value={formData.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
            />
            <Field 
              label="Email" 
              placeholder="Enter Email" 
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
            />
            <Field 
              label="Phone Number" 
              placeholder="Enter Phone Number" 
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange('phoneNumber', value)}
            />
            <Field 
              label="Company Name" 
              placeholder="Enter Company Name" 
              value={formData.companyName}
              onChange={(value) => handleInputChange('companyName', value)}
            />
            <Field 
              label="Industry" 
              placeholder="Enter Industry" 
              value={formData.industry}
              onChange={(value) => handleInputChange('industry', value)}
            />
          </div>
        </div>

        {/* Address Section */}
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
              placeholder="Enter City" 
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
            />
            <Field 
              label="State" 
              placeholder="Enter State" 
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
            />
            <Field 
              label="Country" 
              placeholder="Enter Country" 
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
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
                <span style={checkboxDescStyle}>Enable this lead in the system</span>
              </div>
            </label>
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
          Create Lead
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value, onChange, options = [] }) => (
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
      />
    ) : type === 'date' ? (
      <input
        type="date"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

// Styles (same as in the AssetPageLayoutAdd component)
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

export default LeadsLayoutAddPage;