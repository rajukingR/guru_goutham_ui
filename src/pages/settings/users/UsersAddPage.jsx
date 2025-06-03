import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const UsersAddPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    loginId: '',
    password: '',
    roleId: '',
    branch: '',
    emailId: '',
    phoneNumber: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    landmark: '',
    street: '',
    activeStatus: true,
    userAccess: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div style={containerStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        Masters / Users / Add Users
      </div>

      {/* Main Form Container */}
      <div style={formContainerStyle}>
        
        {/* Personal Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Personal Details:</h3>
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
              required
            />
            <Field
              label="Login ID"
              placeholder="Enter Login ID"
              value={formData.loginId}
              onChange={(value) => handleInputChange('loginId', value)}
              required
            />
            <Field
              label="Password"
              type="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              required
            />
            <Field
              label="Role Name"
              type="select"
              placeholder="Select User Role"
              value={formData.roleId}
              onChange={(value) => handleInputChange('roleId', value)}
              required
            />
            <Field
              label="Branch"
              type="select"
              placeholder="Select Branch"
              value={formData.branch}
              onChange={(value) => handleInputChange('branch', value)}
              required
            />
            <Field
              label="Email ID"
              type="email"
              placeholder="Enter Email ID"
              value={formData.emailId}
              onChange={(value) => handleInputChange('emailId', value)}
              required
            />
            <Field
              label="Phone Number"
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange('phoneNumber', value)}
              required
            />
          </div>
        </div>

        {/* Address Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>Address:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
              required
            />
            <Field
              label="Country"
              type="select"
              placeholder="Select Country"
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
              required
            />
            <Field
              label="State"
              type="select"
              placeholder="Select State"
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
              required
            />
            <Field
              label="City"
              type="select"
              placeholder="Select City"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              required
            />
            <Field
              label="Landmark"
              placeholder="Enter Landmark"
              value={formData.landmark}
              onChange={(value) => handleInputChange('landmark', value)}
            />
            <Field
              label="Street"
              placeholder="Enter Address"
              value={formData.street}
              onChange={(value) => handleInputChange('street', value)}
              required
            />
          </div>
        </div>

        {/* Control Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control:</h3>
          </div>
          <div style={controlSectionStyle}>
            <div style={toggleFieldStyle}>
              <label style={labelStyle}>
                Active Status
                <span style={requiredStyle}>*</span>
              </label>
              <div style={toggleContainerStyle}>
                <div
                  onClick={() => handleToggleChange('activeStatus')}
                  style={{
                    ...toggleStyle,
                    backgroundColor: formData.activeStatus ? '#10b981' : '#d1d5db'
                  }}
                >
                  <div
                    style={{
                      ...toggleCircleStyle,
                      transform: formData.activeStatus ? 'translateX(24px)' : 'translateX(2px)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Access Section */}
      <div style={userAccessCardStyle}>
        <div style={userAccessHeaderStyle}>
          <div style={userAccessLabelStyle}>
            <span style={userAccessTextStyle}>User Access</span>
            <ChevronDown style={chevronStyle} />
          </div>
          <div style={toggleContainerStyle}>
            <div
              onClick={() => handleToggleChange('userAccess')}
              style={{
                ...toggleStyle,
                backgroundColor: formData.userAccess ? '#2563eb' : '#d1d5db'
              }}
            >
              <div
                style={{
                  ...toggleCircleStyle,
                  transform: formData.userAccess ? 'translateX(24px)' : 'translateX(2px)'
                }}
              />
            </div>
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
          Create User
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
          required={required}
        >
          <option value="">{placeholder}</option>
          {label === "Role Name" && (
            <>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
            </>
          )}
          {label === "Branch" && (
            <>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="chennai">Chennai</option>
              <option value="pune">Pune</option>
            </>
          )}
          {label === "Country" && (
            <>
              <option value="india">India</option>
              <option value="usa">USA</option>
              <option value="uk">UK</option>
              <option value="canada">Canada</option>
            </>
          )}
          {label === "State" && (
            <>
              <option value="maharashtra">Maharashtra</option>
              <option value="karnataka">Karnataka</option>
              <option value="delhi">Delhi</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="gujarat">Gujarat</option>
            </>
          )}
          {label === "City" && (
            <>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="delhi">Delhi</option>
              <option value="chennai">Chennai</option>
              <option value="pune">Pune</option>
            </>
          )}
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
        required={required}
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

const breadcrumbStyle = {
  marginBottom: '1.5rem',
  fontSize: '0.875rem',
  color: '#6b7280',
  fontWeight: '400',
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  marginBottom: '1.5rem',
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

const controlSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const toggleFieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const toggleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const toggleStyle = {
  width: '48px',
  height: '24px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  position: 'relative',
  outline: 'none',
};

const toggleCircleStyle = {
  width: '20px',
  height: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.2s ease',
  position: 'absolute',
  top: '2px',
};

const userAccessCardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  maxWidth: '1400px',
  margin: '0 auto 1.5rem',
  borderTop: '1px solid #e2e8f0',
};

const userAccessHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const userAccessLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const userAccessTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
};

const chevronStyle = {
  width: '16px',
  height: '16px',
  color: '#6b7280',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  maxWidth: '1400px',
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

export default UsersAddPage;