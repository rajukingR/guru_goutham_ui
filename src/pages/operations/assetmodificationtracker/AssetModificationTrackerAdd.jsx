import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const generateAssetId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AST-${randomPart}`;
};

const AssetModificationTrackerAdd = () => {
  const navigate = useNavigate();
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

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const newId = generateAssetId();
    setFormData((prev) => ({ ...prev, assetId: newId }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Asset image uploaded:', file.name);
    }
  };

  const handleSubmit = async () => {
  try {
    const payload = {
      asset_image_url: '', 
      asset_id: formData.assetId,
      asset_name: formData.assetName,
      modification_type: formData.modificationType,
      reason_for_modification: formData.reason,
      requested_by: formData.requestedBy,
      approved_by: formData.approvedBy,
      request_date: formData.requestDate,
      approval_date: formData.approvalDate,
      estimated_cost: parseFloat(formData.estimatedCost || 0),
      status: formData.status,
      remarks: formData.remarks,
      active_status: formData.activeStatus
    };

    const response = await fetch('http://localhost:5000/api/asset-modifications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setSnackbarOpen(true);
      setTimeout(() => navigate('/dashboard/operations/asset_modification_tracker'), 1500);
    } else {
      const errText = await response.text();
      console.error('Submission failed:', errText);
    }
  } catch (err) {
    console.error('Submission error:', err);
  }
};

  return (
    <div style={containerStyle}>
      <Snackbar open={snackbarOpen} autoHideDuration={3000}>
        <Alert severity="success" variant="filled">Asset Modification Created Successfully!</Alert>
      </Snackbar>

      <div style={formContainerStyle}>
        {/* Asset Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Asset Information</h3>
          </div>
          
          <div style={uploadContainerStyle}>
            <label style={uploadButtonStyle}>
              <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleFileUpload} />
              <span style={uploadIconStyle}>☁️</span>
              Upload Asset Image
            </label>
            <span style={uploadHintStyle}>Supported formats: JPG, PNG (max size: 2MB)</span>
          </div>

          <div style={fieldsContainerStyle}>
            <Field label="Asset ID" placeholder="Auto-generated Asset ID" value={formData.assetId} onChange={(v) => handleInputChange('assetId', v)} />
            <Field label="Asset Name" placeholder="Enter Asset Name" value={formData.assetName} onChange={(v) => handleInputChange('assetName', v)} />
            <Field label="Modification Type" placeholder="Enter Modification Type" value={formData.modificationType} onChange={(v) => handleInputChange('modificationType', v)} />
          </div>
        </div>

        {/* Request & Approval Details Section */}
        <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Request & Approval Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Reason for Modification" placeholder="Enter Reason for Modification" value={formData.reason} onChange={(v) => handleInputChange('reason', v)} />
            <Field label="Requested By" placeholder="Enter Requested By" value={formData.requestedBy} onChange={(v) => handleInputChange('requestedBy', v)} />
            <Field label="Request Date" placeholder="" type="date" value={formData.requestDate} onChange={(v) => handleInputChange('requestDate', v)} />
            <Field label="Approved By" placeholder="Enter Approved By" value={formData.approvedBy} onChange={(v) => handleInputChange('approvedBy', v)} />
            <Field label="Approval Date" placeholder="" type="date" value={formData.approvalDate} onChange={(v) => handleInputChange('approvalDate', v)} />
            <Field label="Estimated Cost" placeholder="Enter Estimated Cost" type="number" value={formData.estimatedCost} onChange={(v) => handleInputChange('estimatedCost', v)} />
            <Field label="Status" placeholder="Enter Status" value={formData.status} onChange={(v) => handleInputChange('status', v)} />
            <Field label="Remarks" placeholder="Enter Remarks" value={formData.remarks} onChange={(v) => handleInputChange('remarks', v)} />
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
              <input type="checkbox" style={checkboxStyle} checked={formData.activeStatus} onChange={(e) => handleInputChange('activeStatus', e.target.checked)} />
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

// Reusable Field Component
const Field = ({ label, placeholder, type = 'text', value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input type={type} placeholder={placeholder} style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

// Styles (same as before – preserved)
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

const uploadIconStyle = { fontSize: '1rem' };
const uploadHintStyle = { fontSize: '0.75rem', color: '#6b7280' };
const fieldsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: '8px',
  border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#ffffff'
};

const checkboxContainerStyle = { marginTop: '0.5rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.75rem' };
const checkboxStyle = { display: 'none' };
const checkboxCustomStyle = {
  width: '20px', height: '20px', borderRadius: '4px',
  border: '2px solid #d1d5db', backgroundColor: '#ffffff',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const checkmarkStyle = { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' };
const checkboxTextStyle = { fontSize: '0.875rem', fontWeight: '500', color: '#374151' };
const checkboxDescStyle = { fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' };

const buttonContainerStyle = {
  display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
  marginTop: '2rem', maxWidth: '1400px', margin: '2rem auto 0', padding: '0 1.5rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151',
  border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.875rem', fontWeight: '500'
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white',
  border: 'none', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.875rem', fontWeight: '500'
};

export default AssetModificationTrackerAdd;
