import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BranchEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get branch ID from URL
  const [formData, setFormData] = useState({
    branchCode: '',
    branchName: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    address: '',
    activeStatus: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch branch data on component mount
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/branches/${id}`);
        const branch = response.data;

        setFormData({
          branchCode: branch.branch_code || '',
          branchName: branch.branch_name || '',
          pincode: branch.pincode || '',
          country: branch.country || '',
          state: branch.state || '',
          city: branch.city || '',
          address: branch.address || '',
          activeStatus: branch.is_active ?? true
        });
      } catch (err) {
        console.error('Error fetching branch data:', err);
        setError(err.response?.data?.error || 'Failed to load branch data');
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [id]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (formData.pincode.length === 6) {
        try {
          const response = await axios.get(`http://localhost:5000/api/branches${formData.pincode}`);
          const data = response.data;

          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              country: 'India',
              state: postOffice.State || '',
              city: postOffice.District || ''
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              country: '',
              state: '',
              city: ''
            }));
          }
        } catch (error) {
          console.error("Error fetching location from pincode:", error);
          setFormData(prev => ({
            ...prev,
            country: '',
            state: '',
            city: ''
          }));
        }
      }
    };

    fetchLocation();
  }, [formData.pincode]);

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
    if (!formData.branchCode.trim()) {
      setError('Branch code is required');
      return;
    }
    if (!formData.branchName.trim()) {
      setError('Branch name is required');
      return;
    }
    if (!formData.pincode.trim()) {
      setError('Pincode is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.put(`http://localhost:5000/api/branches/${id}`, {
        branch_code: formData.branchCode,
        branch_name: formData.branchName,
        pincode: formData.pincode,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        is_active: formData.activeStatus
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Show success snackbar
      setShowSuccessSnackbar(true);

      // Hide snackbar and navigate after delay
      setTimeout(() => {
        setShowSuccessSnackbar(false);
        navigate('/dashboard/settings/branches');
      }, 2000);
    } catch (err) {
      console.error('Error updating branch:', err);
      setError(err.response?.data?.error || 'Failed to update branch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  if (loading) {
    return <div style={containerStyle}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        Masters / Branches / Edit Branch
      </div>

      {/* Main Form Container */}
      <div style={formContainerStyle}>
        {/* Edit Branch Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Edit Branch:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Branch Code"
              placeholder="Enter Branch Code"
              value={formData.branchCode}
              onChange={(value) => handleInputChange('branchCode', value)}
              required
            />
            <Field
              label="Branch Name"
              placeholder="Enter Branch Name"
              value={formData.branchName}
              onChange={(value) => handleInputChange('branchName', value)}
              required
            />
            <Field
              label="Pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
              required
            />
            <Field
              label="Country"
              placeholder="Auto Detected"
              value={formData.country}
              onChange={() => {}}
              readOnly
            />
            <Field
              label="State"
              placeholder="Auto Detected"
              value={formData.state}
              onChange={() => {}}
              readOnly
            />
            <Field
              label="City"
              placeholder="Auto Detected"
              value={formData.city}
              onChange={() => {}}
              readOnly
            />
            <Field
              label="Address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
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

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onClick={() => navigate('/dashboard/settings/branches')}
        >
          Cancel
        </button>
        <button
          style={{
            ...updateBtnStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = '#2563eb')}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Branch'}
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
            <span style={snackbarTextStyle}>Branch updated successfully!</span>
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

const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, readOnly = false }) => (
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
        readOnly={readOnly}
      />
    )}
  </div>
);

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

const updateBtnStyle = {
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

export default BranchEditPage;