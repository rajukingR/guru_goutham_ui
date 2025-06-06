import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaxListEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // get id from URL param

  const [formData, setFormData] = useState({
    taxCode: '',
    taxName: '',
    percentage: '',
    activeStatus: true
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tax-list/${id}`);
        const data = response.data;

        setFormData({
          taxCode: data.tax_code || '',
          taxName: data.tax_name || '',
          percentage: data.percentage ? data.percentage.toString() : '',
          activeStatus: data.is_active ?? true,
        });
      } catch (error) {
        console.error('Error fetching tax data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.taxCode || !formData.taxName || !formData.percentage) {
        setSnackbarOpen(true);
        return;
      }

      await axios.put(`http://localhost:5000/api/tax-list/update/${id}`, {
        tax_code: formData.taxCode,
        tax_name: formData.taxName,
        percentage: parseFloat(formData.percentage),
        is_active: formData.activeStatus
      });

      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/dashboard/settings/tax_list');
      }, 3000);
    } catch (error) {
      console.error('Error updating tax:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Tax updated successfully!
        </Alert>
      </Snackbar>

      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        Masters / Tax list / Edit Tax list
      </div>

      {/* Main Form Container */}
      <div style={formContainerStyle}>
        {/* Tax List Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Tax list:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Tax Code"
              placeholder="OS"
              value={formData.taxCode}
              onChange={(value) => handleInputChange('taxCode', value)}
              required
            />
            <Field
              label="Tax Name"
              placeholder="Enter Tax Name"
              value={formData.taxName}
              onChange={(value) => handleInputChange('taxName', value)}
              required
            />
          </div>
        </div>

        {/* Percentage Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>%</div>
            <h3 style={cardHeaderStyle}>Percentage:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Percentage"
              placeholder="18.00"
              value={formData.percentage}
              onChange={(value) => handleInputChange('percentage', value)}
              type="number"
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

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onClick={() => navigate('/dashboard/settings/tax_list')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          Cancel
        </button>
        <button
          style={saveBtnStyle}
          onClick={handleSubmit}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3b82f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Update
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, isTextarea = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {isTextarea ? (
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

// === Styles ===
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
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'vertical',
  fontFamily: 'inherit',
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

const saveBtnStyle = {
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

export default TaxListEdit;