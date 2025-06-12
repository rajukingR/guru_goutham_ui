import React, { useState } from 'react';

const AssetModificationTrackerAdd = () => {
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    modificationType: '',
    reason: '',
    requestedBy: '',
    approvedBy: '',
    requestDate: '',
    approvalDate: '',
    estimatedCost: '',
    status: '',
    remarks: '',
    activeStatus: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Asset image uploaded:', file.name);
    }
  };

  const handleSubmit = () => {
    console.log('Submitted Form', formData);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Asset Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Asset Information</h3>
          </div>
          
          <div style={uploadContainerStyle}>
            <label style={uploadButtonStyle}>
              <input
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <span style={uploadIconStyle}>☁️</span>
              Upload Asset Image
            </label>
            <span style={uploadHintStyle}>
              Supported formats: JPG, PNG (max size: 2MB)
            </span>
          </div>

          <div style={fieldsContainerStyle}>
            <Field
              label="Asset ID"
              placeholder="Enter Asset ID"
              value={formData.assetId}
              onChange={(value) => handleInputChange('assetId', value)}
            />
            <Field
              label="Asset Name"
              placeholder="Enter Asset Name"
              value={formData.assetName}
              onChange={(value) => handleInputChange('assetName', value)}
            />
            <Field
              label="Modification Type"
              placeholder="Enter Modification Type"
              value={formData.modificationType}
              onChange={(value) => handleInputChange('modificationType', value)}
            />
          </div>
        </div>

        {/* Request & Approval Details Section */}
        <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Request & Approval Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Reason for Modification"
              placeholder="Enter Reason for Modification"
              value={formData.reason}
              onChange={(value) => handleInputChange('reason', value)}
            />
            <Field
              label="Requested By"
              placeholder="Enter Requested By"
              value={formData.requestedBy}
              onChange={(value) => handleInputChange('requestedBy', value)}
            />
            <Field
              label="Request Date"
              placeholder="Select Request Date"
              type="date"
              value={formData.requestDate}
              onChange={(value) => handleInputChange('requestDate', value)}
            />
            <Field
              label="Approved By"
              placeholder="Enter Approved By"
              value={formData.approvedBy}
              onChange={(value) => handleInputChange('approvedBy', value)}
            />
            <Field
              label="Approval Date"
              placeholder="Select Approval Date"
              type="date"
              value={formData.approvalDate}
              onChange={(value) => handleInputChange('approvalDate', value)}
            />
            <Field
              label="Estimated Cost"
              placeholder="Enter Estimated Cost"
              type="number"
              value={formData.estimatedCost}
              onChange={(value) => handleInputChange('estimatedCost', value)}
            />
            <Field
              label="Status"
              placeholder="Enter Status"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
            />
            <Field
              label="Remarks"
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={(value) => handleInputChange('remarks', value)}
            />
          </div>
        </div>

        {/* Control Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🎛️</div>
            <h3 style={cardHeaderStyle}>Control</h3>
          </div>
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.activeStatus}
                onChange={(e) => handleInputChange('activeStatus', e.target.checked)}
              />
              <div style={{
                ...checkboxCustomStyle,
                backgroundColor: formData.activeStatus ? '#2563eb' : '#ffffff',
                borderColor: formData.activeStatus ? '#2563eb' : '#d1d5db',
              }}>
                {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
                <span style={checkboxDescStyle}>Enable this asset modification tracker for use in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1600px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  height: 'fit-content',
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

const uploadContainerStyle = {
  marginBottom: '1.5rem',
};

const uploadButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: '#2563eb',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  marginBottom: '0.5rem',
  transition: 'background-color 0.2s',
};

const uploadIconStyle = {
  fontSize: '1rem',
};

const uploadHintStyle = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#6b7280',
  marginTop: '0.5rem',
};

const fieldsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
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
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const checkboxContainerStyle = {
  marginTop: '0.5rem',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  cursor: 'pointer',
  gap: '0.75rem',
};

const checkboxStyle = {
  display: 'none',
};

const checkboxCustomStyle = {
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  border: '2px solid #d1d5db',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.2s',
};

const checkmarkStyle = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
};

const checkboxTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  display: 'block',
};

const checkboxDescStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  display: 'block',
  marginTop: '0.25rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
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
  transition: 'all 0.2s',
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
  transition: 'all 0.2s',
};

export default AssetModificationTrackerAdd;