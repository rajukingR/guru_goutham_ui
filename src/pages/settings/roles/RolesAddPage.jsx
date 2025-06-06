import React, { useState } from 'react';
import { ChevronDown, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RolesAddPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    activeStatus: true,
    userDefaultAccess: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleToggleChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.roleName.trim()) {
      setError('Role name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/roles/create', {
        role_name: formData.roleName,
        description: formData.description,
        is_active: formData.activeStatus,
        user_default_access: formData.userDefaultAccess
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Show success snackbar
      setShowSuccessSnackbar(true);

      // Reset form on success
      setFormData({
        roleName: '',
        description: '',
        activeStatus: true,
        userDefaultAccess: false
      });
      
      // Hide snackbar and navigate after delay
      setTimeout(() => {
        setShowSuccessSnackbar(false);
        navigate('/dashboard/settings/roles');
      }, 2000);
    } catch (err) {
      console.error('Error creating role:', err);
      setError(err.response?.data?.error || 'Failed to create role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  return (
    <div style={containerStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        Masters / Role / Add Role
      </div>

      {/* Main Form Container */}
      <div style={formContainerStyle}>
        
        {/* Create Role Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Create Role:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Role Name"
              placeholder="Enter Role Name"
              value={formData.roleName}
              onChange={(value) => handleInputChange('roleName', value)}
              required
            />
            <Field
              label="Description"
              type="textarea"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
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
                <span style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
                  {formData.activeStatus ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Default Access Section */}
      <div style={userAccessCardStyle}>
        <div style={userAccessHeaderStyle}>
          <div style={userAccessLabelStyle}>
            <span style={userAccessTextStyle}>User Default Access</span>
            <ChevronDown style={chevronStyle} />
          </div>
          <div style={toggleContainerStyle}>
            <div
              onClick={() => handleToggleChange('userDefaultAccess')}
              style={{
                ...toggleStyle,
                backgroundColor: formData.userDefaultAccess ? '#2563eb' : '#d1d5db'
              }}
            >
              <div
                style={{
                  ...toggleCircleStyle,
                  transform: formData.userDefaultAccess ? 'translateX(24px)' : 'translateX(2px)'
                }}
              />
            </div>
            <span style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
              {formData.userDefaultAccess ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button 
          style={cancelBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onClick={() => navigate('/roles')}
        >
          Cancel
        </button>
        <button
          style={{
            ...createBtnStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = '#2563eb')}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Role'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={errorMessageStyle}>
          {error}
        </div>
      )}

      {/* Success Snackbar */}
      {showSuccessSnackbar && (
        <div style={snackbarStyle}>
          <div style={snackbarContentStyle}>
            <CheckCircle style={snackbarIconStyle} />
            <span style={snackbarTextStyle}>Role created successfully!</span>
            <button
              onClick={handleCloseSnackbar}
              style={snackbarCloseButtonStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <X style={snackbarCloseIconStyle} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Field Component
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
        required={required}
        rows={4}
      />
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

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit',
  minHeight: '100px',
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

const errorMessageStyle = {
  color: '#ef4444',
  marginTop: '1rem',
  textAlign: 'center',
  maxWidth: '1400px',
  margin: '1rem auto 0',
  padding: '0 1.5rem',
  fontSize: '0.875rem'
};

// Snackbar Styles
const snackbarStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
  animation: 'slideInUp 0.3s ease-out',
};

const snackbarContentStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '12px 16px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  minWidth: '280px',
  maxWidth: '400px',
};

const snackbarIconStyle = {
  width: '20px',
  height: '20px',
  marginRight: '8px',
  flexShrink: 0,
};

const snackbarTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  flex: 1,
};

const snackbarCloseButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  marginLeft: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',
};

const snackbarCloseIconStyle = {
  width: '16px',
  height: '16px',
};

export default RolesAddPage;