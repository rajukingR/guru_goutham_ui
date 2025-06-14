import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AssetModificationTrackerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [formData, setFormData] = useState({
    asset_image_url: '',
    asset_id: '',
    asset_name: '',
    modification_type: '',
    reason_for_modification: '',
    requested_by: '',
    approved_by: '',
    request_date: '',
    approval_date: '',
    estimated_cost: '',
    status: '',
    remarks: '',
    active_status: false,
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/asset-modifications/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error('Fetch failed:', err));
  }, [id]);

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    axios.put(`http://localhost:5000/api/asset-modifications/${id}`, formData)
      .then(() => {
        setSnackbarOpen(true); // Show success Snackbar
        setTimeout(() => {
          navigate('/dashboard/operations/asset_modification_tracker');
        }, 3000);
      })
      .catch(err => console.error('Update failed:', err));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Asset Information */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Asset Information</h3>
          </div>
          <div style={fieldsContainerStyle}>
            <Field label="Asset ID" placeholder="Enter Asset ID" value={formData.asset_id} onChange={v => handleChange('asset_id', v)} />
            <Field label="Asset Name" placeholder="Enter Asset Name" value={formData.asset_name} onChange={v => handleChange('asset_name', v)} />
            <Field label="Modification Type" placeholder="Enter Modification Type" value={formData.modification_type} onChange={v => handleChange('modification_type', v)} />
          </div>
        </div>

        {/* Request & Approval */}
        <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Request & Approval Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Reason" placeholder="Enter Reason" value={formData.reason_for_modification} onChange={v => handleChange('reason_for_modification', v)} />
            <Field label="Requested By" placeholder="Enter Requested By" value={formData.requested_by} onChange={v => handleChange('requested_by', v)} />
            <Field label="Request Date" type="date" value={formData.request_date} onChange={v => handleChange('request_date', v)} />
            <Field label="Approved By" placeholder="Enter Approved By" value={formData.approved_by} onChange={v => handleChange('approved_by', v)} />
            <Field label="Approval Date" type="date" value={formData.approval_date} onChange={v => handleChange('approval_date', v)} />
            <Field label="Estimated Cost" placeholder="Enter Estimated Cost" type="number" value={formData.estimated_cost} onChange={v => handleChange('estimated_cost', v)} />
            <Field label="Status" placeholder="Enter Status" value={formData.status} onChange={v => handleChange('status', v)} />
            <Field label="Remarks" placeholder="Enter Remarks" value={formData.remarks} onChange={v => handleChange('remarks', v)} />
          </div>
        </div>

        {/* Control */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🎛️</div>
            <h3 style={cardHeaderStyle}>Control</h3>
          </div>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" checked={formData.active_status} onChange={e => handleChange('active_status', e.target.checked)} style={checkboxStyle} />
            <div style={{ ...checkboxCustomStyle, backgroundColor: formData.active_status ? '#2563eb' : '#fff', borderColor: formData.active_status ? '#2563eb' : '#d1d5db' }}>
              {formData.active_status && <span style={checkmarkStyle}>✓</span>}
            </div>
            <div>
              <span style={checkboxTextStyle}>Active Status</span>
              <span style={checkboxDescStyle}>Enable this asset modification tracker for use in the system</span>
            </div>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={() => navigate(-1)}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Update</button>
      </div>

      {/* Success Snackbar */}
    <Snackbar
  open={snackbarOpen}
  autoHideDuration={2000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
    Updated successfully!
  </Alert>
</Snackbar>

    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value, onChange }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input type={type} placeholder={placeholder} style={inputStyle} value={value || ''} onChange={e => onChange(e.target.value)} />
  </div>
);

// Style constants
const containerStyle = { padding: '2rem', fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif', minHeight: '100vh', lineHeight: 1.6 };
const formContainerStyle = { display: 'grid', gap: '1.5rem', maxWidth: '1600px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' };
const cardStyle = { backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0', height: 'fit-content' };
const cardHeaderContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' };
const iconStyle = { fontSize: '1.25rem', marginRight: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' };
const cardHeaderStyle = { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 };
const uploadContainerStyle = { marginBottom: '1.5rem' };
const uploadButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', transition: 'background-color 0.2s' };
const uploadIconStyle = { fontSize: '1rem' };
const uploadHintStyle = { display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' };
const fieldsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#ffffff', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' };
const checkboxContainerStyle = { marginTop: '0.5rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.75rem' };
const checkboxStyle = { display: 'none' };
const checkboxCustomStyle = { width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #d1d5db', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' };
const checkmarkStyle = { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' };
const checkboxTextStyle = { fontSize: '0.875rem', fontWeight: '500', color: '#374151', display: 'block' };
const checkboxDescStyle = { fontSize: '0.75rem', color: '#6b7280', display: 'block', marginTop: '0.25rem' };
const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', maxWidth: '1400px', margin: '2rem auto 0', padding: '0 1.5rem' };
const cancelBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' };
const createBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' };

export default AssetModificationTrackerEdit;