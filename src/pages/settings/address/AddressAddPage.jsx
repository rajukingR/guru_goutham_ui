import React, { useState } from 'react';
import { ChevronDown, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddressAddPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Import Countries fields
    countryName: '',
    countryFile: null,
    
    // Import States fields
    selectedCountryForState: '',
    stateName: '',
    stateFile: null,
    
    // Import City fields
    selectedCountryForCity: '',
    selectedStateForCity: '',
    cityName: '',
    cityFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (error) setError(null);
  };

  const handleAddCountry = async () => {
    if (!formData.countryName.trim()) {
      setError('Country name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/countries/create', {
        country_name: formData.countryName
      });
      setShowSuccessSnackbar(true);
      setFormData(prev => ({ ...prev, countryName: '' }));
      setTimeout(() => setShowSuccessSnackbar(false), 2000);
    } catch (err) {
      setError('Failed to add country');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddState = async () => {
    if (!formData.selectedCountryForState || !formData.stateName.trim()) {
      setError('Please select country and enter state name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/states/create', {
        country_id: formData.selectedCountryForState,
        state_name: formData.stateName
      });
      setShowSuccessSnackbar(true);
      setFormData(prev => ({ ...prev, stateName: '' }));
      setTimeout(() => setShowSuccessSnackbar(false), 2000);
    } catch (err) {
      setError('Failed to add state');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCity = async () => {
    if (!formData.selectedCountryForCity || !formData.selectedStateForCity || !formData.cityName.trim()) {
      setError('Please select country, state and enter city name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/cities/create', {
        country_id: formData.selectedCountryForCity,
        state_id: formData.selectedStateForCity,
        city_name: formData.cityName
      });
      setShowSuccessSnackbar(true);
      setFormData(prev => ({ ...prev, cityName: '' }));
      setTimeout(() => setShowSuccessSnackbar(false), 2000);
    } catch (err) {
      setError('Failed to add city');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    setShowSuccessSnackbar(true);
    setTimeout(() => {
      setShowSuccessSnackbar(false);
      navigate('/dashboard/masters/address');
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  return (
    <div style={containerStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        Masters / Address
      </div>

      {/* Main Form Container */}
      <div style={formContainerStyle}>
        
        {/* Import Countries Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Import Countries:</h3>
          </div>
          <div style={fieldsContainerStyle}>
            <Field
              label="Country"
              placeholder="Enter Country Name"
              value={formData.countryName}
              onChange={(value) => handleInputChange('countryName', value)}
            />
            <button
              style={addBtnStyle}
              onClick={handleAddCountry}
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
          
          <div style={orDividerStyle}>OR</div>
          
          <div style={browseContainerStyle}>
            <Field
              label="Country*"
              placeholder="Country Name"
              value=""
              onChange={() => {}}
              disabled
            />
            <button style={browseBtnStyle}>Browse</button>
          </div>
        </div>

        {/* Import States Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Import States:</h3>
          </div>
          <div style={fieldsContainerStyle}>
            <SelectField
              label="Select Country"
              placeholder="Enter New Password"
              value={formData.selectedCountryForState}
              onChange={(value) => handleInputChange('selectedCountryForState', value)}
              options={[]}
            />
          </div>
          
          <div style={fieldsContainerStyle}>
            <Field
              label="State*"
              placeholder="Enter Country Name"
              value={formData.stateName}
              onChange={(value) => handleInputChange('stateName', value)}
            />
            <button
              style={addBtnStyle}
              onClick={handleAddState}
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
          
          <div style={orDividerStyle}>OR</div>
          
          <div style={browseContainerStyle}>
            <Field
              label="State*"
              placeholder="Country Name"
              value=""
              onChange={() => {}}
              disabled
            />
            <button style={browseBtnStyle}>Browse</button>
          </div>
        </div>

        {/* Import City Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Import City:</h3>
          </div>
          <div style={fieldsContainerStyle}>
            <SelectField
              label="Select Country"
              placeholder="Enter New Password"
              value={formData.selectedCountryForCity}
              onChange={(value) => handleInputChange('selectedCountryForCity', value)}
              options={[]}
            />
          </div>
          
          <div style={fieldsContainerStyle}>
            <SelectField
              label="Select State"
              placeholder="Enter New Password"
              value={formData.selectedStateForCity}
              onChange={(value) => handleInputChange('selectedStateForCity', value)}
              options={[]}
            />
          </div>
          
          <div style={fieldsContainerStyle}>
            <Field
              label="City*"
              placeholder="Enter Country Name"
              value={formData.cityName}
              onChange={(value) => handleInputChange('cityName', value)}
            />
            <button
              style={addBtnStyle}
              onClick={handleAddCity}
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
          
          <div style={orDividerStyle}>OR</div>
          
          <div style={browseContainerStyle}>
            <Field
              label="City*"
              placeholder="Country Name"
              value=""
              onChange={() => {}}
              disabled
            />
            <button style={browseBtnStyle}>Browse</button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={saveButtonContainerStyle}>
        <button
          style={saveBtnStyle}
          onClick={handleSave}
          disabled={isSubmitting}
        >
          Save
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
            <span style={snackbarTextStyle}>Address data saved successfully!</span>
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
const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, disabled = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      style={{
        ...inputStyle,
        backgroundColor: disabled ? '#f9fafb' : '#ffffff',
        cursor: disabled ? 'not-allowed' : 'text'
      }}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      required={required}
      disabled={disabled}
    />
  </div>
);

// Select Field Component
const SelectField = ({ label, placeholder, value, onChange, options = [], required = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    <div style={selectWrapperStyle}>
      <select
        style={selectStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown style={selectIconStyle} />
    </div>
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
  marginBottom: '2rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
};

const cardHeaderContainerStyle = {
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0',
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const fieldsContainerStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'end',
  marginBottom: '1rem',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
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
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  paddingRight: '2.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  appearance: 'none',
  cursor: 'pointer',
};

const selectIconStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '16px',
  height: '16px',
  color: '#6b7280',
  pointerEvents: 'none',
};

const addBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#60a5fa',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  height: 'fit-content',
  whiteSpace: 'nowrap',
};

const browseBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#60a5fa',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  height: 'fit-content',
  whiteSpace: 'nowrap',
};

const orDividerStyle = {
  textAlign: 'center',
  margin: '1rem 0',
  fontSize: '0.875rem',
  color: '#6b7280',
  fontWeight: '500',
};

const browseContainerStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'end',
};

const saveButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const saveBtnStyle = {
  padding: '0.75rem 3rem',
  backgroundColor: '#60a5fa',
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

export default AddressAddPage;