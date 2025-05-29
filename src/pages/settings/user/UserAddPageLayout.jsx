import React, { useState } from 'react';

const UserAddPageLayout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    loginId: '',
    email: '',
    joiningDate: '',
    password: '',
    phoneNumber: '',
    userCode: '',
    address: '',
    pincode: '',
    state: '',
    landmark: '',
    country: '',
    city: '',
    street: '',
    role: '',
    department: '',
    branch: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roleOptions = ['SuperAdmin', 'UsersModule', 'Manager', 'Product Library', 'Admin'];
  const departmentOptions = ['HR', 'IT AdminStrat', 'Management', 'Owner', 'Reco'];
  const branchOptions = ['Guru Gowtam BTM', 'Admin', 'EEE', 'Testing Raghavaa'];

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <FormCard title="Personal Information" icon="👤">
          <Field label="First Name" value={formData.firstName} onChange={val => handleInputChange('firstName', val)} required />
          <Field label="Last Name" value={formData.lastName} onChange={val => handleInputChange('lastName', val)} required />
          <Field label="Login ID" value={formData.loginId} onChange={val => handleInputChange('loginId', val)} required />
          <Field label="Email" type="email" value={formData.email} onChange={val => handleInputChange('email', val)} required />
          <Field label="Joining Date" type="date" value={formData.joiningDate} onChange={val => handleInputChange('joiningDate', val)} />
          <Field label="Password" type="password" value={formData.password} onChange={val => handleInputChange('password', val)} required />
          <Field label="Phone Number" type="tel" value={formData.phoneNumber} onChange={val => handleInputChange('phoneNumber', val)} />
          <Field label="User Code" value={formData.userCode} onChange={val => handleInputChange('userCode', val)} />
        </FormCard>

        <FormCard title="Location Information" icon="📍">
          <Field label="Address" value={formData.address} onChange={val => handleInputChange('address', val)} />
          <Field label="Pincode" value={formData.pincode} onChange={val => handleInputChange('pincode', val)} />
          <Field label="State" value={formData.state} onChange={val => handleInputChange('state', val)} />
          <Field label="Landmark" value={formData.landmark} onChange={val => handleInputChange('landmark', val)} />
          <Field label="Country" value={formData.country} onChange={val => handleInputChange('country', val)} />
          <Field label="City" value={formData.city} onChange={val => handleInputChange('city', val)} />
          <Field label="Street" value={formData.street} onChange={val => handleInputChange('street', val)} />
        </FormCard>

        <FormCard title="Organization Information" icon="🏢">
          <Field label="Role" type="select" options={roleOptions} value={formData.role} onChange={val => handleInputChange('role', val)} />
          <Field label="Department" type="select" options={departmentOptions} value={formData.department} onChange={val => handleInputChange('department', val)} />
          <Field label="Branch" type="select" options={branchOptions} value={formData.branch} onChange={val => handleInputChange('branch', val)} />
        </FormCard>
      </div>

      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Create User</button>
      </div>
    </div>
  );
};

const FormCard = ({ title, icon, children }) => (
  <div style={cardStyle}>
    <div style={cardHeaderContainerStyle}>
      <div style={iconStyle}>{icon}</div>
      <h3 style={cardHeaderStyle}>{title}</h3>
    </div>
    <div style={fieldsGridStyle}>{children}</div>
  </div>
);

const Field = ({ label, value, onChange, type = 'text', required = false, options = [] }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select style={selectStyle} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select {label}</option>
          {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} placeholder={`Enter ${label}`} />
    )}
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
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  border: '1px solid #e2e8f0',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e5e7eb',
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
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#fff',
  outline: 'none',
};

const selectWrapperStyle = {
  position: 'relative',
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  paddingRight: '2.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#fff',
  appearance: 'none',
  outline: 'none',
  cursor: 'pointer',
};

const selectArrowStyle = {
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  transform: 'translateY(-50%)',
  fontSize: '0.75rem',
  color: '#6b7280',
  pointerEvents: 'none',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  maxWidth: '1200px',
  margin: '2rem auto 0',
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

export default UserAddPageLayout;
