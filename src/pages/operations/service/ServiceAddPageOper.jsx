import React, { useState } from 'react';

const ServiceAddPageOper = () => {
  const [formData, setFormData] = useState({
    productImage: null,
    productId: '',
    productName: '',
    type: '',
    priority: '',
    orderNo: '',
    clientId: '',
    serviceStaff: '',
    startDate: '',
    endDate: '',
    taskDuration: '',
    activeStatus: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    setFormData({
      productImage: null,
      productId: '',
      productName: '',
      type: '',
      priority: '',
      orderNo: '',
      clientId: '',
      serviceStaff: '',
      startDate: '',
      endDate: '',
      taskDuration: '',
      activeStatus: false
    });
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Add New Service</h2>

      <div style={formSectionStyle}>
        {/* Column 1: Basic Information */}
        <div style={{ ...cardStyle, borderLeft: '5px solid #3b82f6' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Basic Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Upload Product Image" 
              type="file" 
              onChange={handleChange}
              name="productImage"
              style={{ gridColumn: '1 / -1' }}
            />
            <Field 
              label="Product ID" 
              placeholder="Enter Product ID"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
            />
            <Field 
              label="Product Name" 
              placeholder="Enter Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Column 2: Additional Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>ℹ️</div>
            <h3 style={cardHeaderStyle}>Additional Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Type" 
              placeholder="Enter Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            />
            <Field 
              label="Priority" 
              placeholder="Enter Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            />
            <Field 
              label="Order No" 
              placeholder="Enter Order No"
              name="orderNo"
              value={formData.orderNo}
              onChange={handleChange}
            />
            <Field 
              label="Client ID" 
              placeholder="Enter Client ID"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
            />
            <Field 
              label="Service Staff" 
              placeholder="Enter Service Staff"
              name="serviceStaff"
              value={formData.serviceStaff}
              onChange={handleChange}
            />
            <Field 
              label="Start Date & Time" 
              placeholder="dd-mm-yyyy"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Field 
              label="End Date & Time" 
              placeholder="dd-mm-yyyy"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            <Field 
              label="Task Duration" 
              placeholder="Enter Task Duration"
              name="taskDuration"
              value={formData.taskDuration}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <div style={checkboxContainerStyle}>
          <input 
            type="checkbox" 
            id="activeStatus"
            name="activeStatus"
            checked={formData.activeStatus}
            onChange={handleChange}
            style={checkboxStyle}
          />
          <label htmlFor="activeStatus" style={checkboxLabelStyle}>Active Status</label>
        </div>
        <div>
          <button style={cancelBtnStyle} onClick={handleCancel}>Cancel</button>
          <button style={createBtnStyle} onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, type = 'text', placeholder, value, onChange, name, disabled = false, style }) => (
  <div style={{ ...fieldContainerStyle, ...style }}>
    <label style={labelStyle}>{label}</label>
    {type === 'file' ? (
      <div style={fileUploadStyle}>
        <input
          type="file"
          onChange={onChange}
          name={name}
          style={fileInputStyle}
          accept=".jpg,.jpeg,.png"
        />
        <div style={fileUploadPlaceholderStyle}>
          <span style={fileUploadTextStyle}>📁</span>
          <p style={fileHintStyle}>Supported formats: JPG, PNG (max size: 2MB)</p>
        </div>
      </div>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        name={name}
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
  maxWidth: '1400px',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '1.5rem',
};

const formSectionStyle = {
  display: 'flex',
  gap: '1.5rem',
  marginBottom: '1.5rem',
};

const cardStyle = {
  flex: 1,
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
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
  backgroundColor: '#e0f2fe',
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
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

const fileUploadStyle = {
  position: 'relative',
  width: '100%',
};

const fileInputStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  opacity: 0,
  cursor: 'pointer',
};

const fileUploadPlaceholderStyle = {
  border: '1px dashed #d1d5db',
  borderRadius: '8px',
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#f9fafb',
};

const fileUploadTextStyle = {
  fontSize: '1.5rem',
  color: '#9ca3af',
};

const fileHintStyle = {
  fontSize: '0.75rem',
  color: '#9ca3af',
  marginTop: '0.5rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '2rem',
  padding: '0 1.5rem',
};

const checkboxContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const checkboxStyle = {
  marginRight: '0.5rem',
  width: '1rem',
  height: '1rem',
};

const checkboxLabelStyle = {
  fontSize: '0.875rem',
  color: '#374151',
  fontWeight: '500',
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
  marginLeft: '0.75rem',
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
  marginLeft: '0.75rem',
};

export default ServiceAddPageOper;
