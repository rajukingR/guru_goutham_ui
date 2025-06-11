import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BranchAddPageLayout = () => {
  const navigate = useNavigate();
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (formData.pincode.length === 6) {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${formData.pincode}`);
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

  const handleSubmit = async () => {
    const payload = {
      branch_code: formData.branchCode,
      branch_name: formData.branchName,
      pincode: formData.pincode,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      is_active: formData.activeStatus
    };

    try {
      const response = await axios.post('http://localhost:5000/api/branches/create', payload);
      setSnackbarMessage('Branch created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setFormData({
        branchCode: '',
        branchName: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
        address: '',
        activeStatus: true
      });

      setTimeout(() => {
      navigate("/dashboard/settings/Branch");
      }, 3000);
    } catch (error) {
      console.error('Error creating branch:', error);
      setSnackbarMessage('Failed to create branch.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div style={containerStyle}>
      <div style={breadcrumbStyle}>
        Masters / Branches / Add Branches
      </div>

      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Branch Details:</h3>
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
          </div>
        </div>

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
          </div>
          <div style={fullWidthFieldStyle}>
            <Field
              label="Address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              required
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control:</h3>
          </div>
          <div style={controlSectionStyle}>
            <div style={toggleFieldStyle}>
              <label style={labelStyle}>
                Active Status<span style={requiredStyle}>*</span>
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
          onClick={handleSubmit}
        >
          Create Branch
        </button>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, readOnly = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      readOnly={readOnly}
    />
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

const fullWidthFieldStyle = {
  marginTop: '1rem',
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

export default BranchAddPageLayout;
