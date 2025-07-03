import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import API_URL from '../../../api/Api_url';

// Alert Component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RamEditPageLayout = () => {
  const { id } = useParams(); // from route param
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ramType: '',
    sizeGb: '',
    frequencyMhz: '',
    manufacturer: '',
    activeStatus: true,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const ramTypes = ['DDR3', 'DDR4', 'DDR5', 'LPDDR4', 'LPDDR5'];
  const sizes = ['4', '8', '16', '32', '64'];

  // Fetch existing RAM data
  useEffect(() => {
    const fetchRamSpec = async () => {
      try {
        const response = await axios.get(`${API_URL}/ram-specs/${id}`);
        const ram = response.data.data;

        setFormData({
          ramType: ram.ram_type || '',
          sizeGb: ram.size_gb || '',
          frequencyMhz: ram.frequency_mhz || '',
          manufacturer: ram.manufacturer || '',
          activeStatus: ram.is_active ?? true
        });
      } catch (error) {
        console.error('Error loading RAM spec:', error);
        setSnackbarMessage('Failed to load RAM data.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchRamSpec();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const payload = {
      ram_type: formData.ramType,
      size_gb: formData.sizeGb,
      frequency_mhz: formData.frequencyMhz,
      manufacturer: formData.manufacturer,
      is_active: formData.activeStatus
    };

    try {
      await axios.put(`${API_URL}/ram-specs/${id}`, payload);
      setSnackbarMessage('RAM updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/dashboard/settings/ram");
      }, 3000);
    } catch (error) {
      console.error('Error updating RAM:', error);
      setSnackbarMessage('Failed to update RAM.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <div style={containerStyle}>
      <div style={breadcrumbStyle}>
        Inventory / RAM / Edit RAM
      </div>

      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💾</div>
            <h3 style={cardHeaderStyle}>RAM Specifications:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <SelectField
              label="RAM Type"
              value={formData.ramType}
              onChange={(val) => handleInputChange('ramType', val)}
              options={ramTypes}
              required
            />
            <SelectField
              label="Size (GB)"
              value={formData.sizeGb}
              onChange={(val) => handleInputChange('sizeGb', val)}
              options={sizes}
              required
            />
            <Field
              label="Frequency (MHz)"
              type="number"
              placeholder="Enter Frequency"
              value={formData.frequencyMhz}
              onChange={(val) => handleInputChange('frequencyMhz', val)}
              required
            />
            <Field
              label="Manufacturer"
              type="text"
              placeholder="Enter Manufacturer"
              value={formData.manufacturer}
              onChange={(val) => handleInputChange('manufacturer', val)}
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
              <label style={labelStyle}>Active Status</label>
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
          onClick={() => navigate("/dashboard/inventory/rams")}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onClick={handleSubmit}
        >
          Update RAM
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

// Reuse same Field and SelectField from your Add form (or import if shared)
const SelectField = ({ label, value, onChange, options, required }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}{required && <span style={requiredStyle}>*</span>}</label>
    <select
      style={selectStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Field = ({ label, placeholder, type, required, value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}{required && <span style={requiredStyle}>*</span>}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);


// Styles (same as in your Branch form)
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

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M5 8l5 5 5-5z\' fill=\'%23374151\'/></svg>")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1.5em',
  paddingRight: '2.5rem',
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

export default RamEditPageLayout;
