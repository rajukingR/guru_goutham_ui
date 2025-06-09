import React, { useState, useEffect } from 'react';
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

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles");
        const result = await response.json();
        setRoles(result);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/branches");
        const result = await response.json();
        setBranches(result);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchRoles();
    fetchBranches();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePincodeChange = async (value) => {
    handleInputChange('pincode', value);
    
    // Clear address fields when pincode is cleared or invalid
    if (value.length !== 6) {
      handleInputChange('country', '');
      handleInputChange('state', '');
      handleInputChange('city', '');
      return;
    }

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result[0].Status === "Success") {
        const postOffice = result[0].PostOffice[0];
        handleInputChange('country', 'India');
        handleInputChange('state', postOffice.State);
        handleInputChange('city', postOffice.District);
      } else {
        console.error("Invalid pincode or no data found");
        // Clear fields if pincode is invalid
        handleInputChange('country', '');
        handleInputChange('state', '');
        handleInputChange('city', '');
      }
    } catch (error) {
      console.error("Failed to fetch location data:", error);
      // Clear fields on error
      handleInputChange('country', '');
      handleInputChange('state', '');
      handleInputChange('city', '');
    }
  };

  const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, options = [], disabled = false }) => (
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
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div style={selectArrowStyle}></div>
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={breadcrumbStyle}>
        Masters / Users / Add Users
      </div>

      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}></div>
            <h3 style={cardHeaderStyle}>Personal Details:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="First Name" placeholder="Enter First Name" value={formData.firstName} onChange={(value) => handleInputChange('firstName', value)} required />
            <Field label="Last Name" placeholder="Enter Last Name" value={formData.lastName} onChange={(value) => handleInputChange('lastName', value)} required />
            <Field label="Login ID" placeholder="Enter Login ID" value={formData.loginId} onChange={(value) => handleInputChange('loginId', value)} required />
            <Field label="Password" type="password" placeholder="Enter Password" value={formData.password} onChange={(value) => handleInputChange('password', value)} required />
            <Field
              label="Role Name"
              type="select"
              placeholder="Select User Role"
              value={formData.roleId}
              onChange={(value) => handleInputChange('roleId', value)}
              required
              options={roles.map(role => ({
                label: role.role_name || role.name,
                value: role.id
              }))}
            />
            <Field
              label="Branch"
              type="select"
              placeholder="Select Branch"
              value={formData.branch}
              onChange={(value) => handleInputChange('branch', value)}
              required
              options={branches.map(branch => ({
                label: branch.branch_name || branch.name,
                value: branch.id
              }))}
            />
            <Field label="Email ID" type="email" placeholder="Enter Email ID" value={formData.emailId} onChange={(value) => handleInputChange('emailId', value)} required />
            <Field label="Phone Number" type="tel" placeholder="Enter Phone Number" value={formData.phoneNumber} onChange={(value) => handleInputChange('phoneNumber', value)} required />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}></div>
            <h3 style={cardHeaderStyle}>Address:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Pincode" placeholder="Enter Pincode" value={formData.pincode} onChange={(value) => handlePincodeChange(value)} required />
            <Field 
              label="Country" 
              placeholder="Country will auto-fill" 
              value={formData.country} 
              onChange={(value) => handleInputChange('country', value)} 
              required 
              disabled
            />
            <Field 
              label="State" 
              placeholder="State will auto-fill" 
              value={formData.state} 
              onChange={(value) => handleInputChange('state', value)} 
              required 
              disabled
            />
            <Field 
              label="City" 
              placeholder="City will auto-fill" 
              value={formData.city} 
              onChange={(value) => handleInputChange('city', value)} 
              required 
              disabled
            />
            <Field label="Landmark" placeholder="Enter Landmark" value={formData.landmark} onChange={(value) => handleInputChange('landmark', value)} />
            <Field label="Street" placeholder="Enter Address" value={formData.street} onChange={(value) => handleInputChange('street', value)} required />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}></div>
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

// Styles (same as before)
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
  color: '#6b728d0',
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