import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreaditNotesEditFormLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    credit_note_number: '',
    credit_note_title: '',
    industry: '',
    transaction_type: '',
    payment_type: '',
    dc_id: '',
    customer_id: '',
    invoice_date: '',
    invoice_start_date: '',
    invoice_end_date: '',
    email: '',
    shipping_name: '',
    pincode: '',
    status: '',
    print_credit_note: '',
    active_status: true,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/credit-notes/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          credit_note_number: data.credit_note_number || '',
          credit_note_title: data.credit_note_title || '',
          industry: data.industry || '',
          transaction_type: data.transaction_type || '',
          payment_type: data.payment_type || '',
          dc_id: data.dc_id || '',
          customer_id: data.customer_id || '',
          invoice_date: data.invoice_date?.substring(0, 10) || '',
          invoice_start_date: data.invoice_start_date?.substring(0, 10) || '',
          invoice_end_date: data.invoice_end_date?.substring(0, 10) || '',
          email: data.email || '',
          shipping_name: data.shipping_name || '',
          pincode: data.pincode || '',
          status: data.status || '',
          print_credit_note: data.print_credit_note || '',
          active_status: data.active_status,
        });
      })
      .catch(() => {
        setSnackbarMessage('Failed to fetch credit note details.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };

      // Convert date fields to proper ISO format if needed
      ['invoice_date', 'invoice_start_date', 'invoice_end_date'].forEach(key => {
        if (payload[key]) payload[key] = new Date(payload[key]).toISOString();
      });

      const response = await axios.put(`http://localhost:5000/api/credit-notes/update/${id}`, payload);

      if (response.status === 200 || response.status === 204) {
        setSnackbarMessage('Credit Note updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/dashboard/operations/credit_notes'), 3000);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      setSnackbarMessage('Failed to update credit note.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const renderField = (label, field, type = 'text', placeholder = '') => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>{label}<span style={requiredStyle}>*</span></label>
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        required
      />
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={breadcrumbStyle}>Operations / Credit Notes / Edit Credit Note</div>
      <div style={threeColumnFormContainerStyle}>
        <div style={columnStyle}>
          <div style={cardStyle}>
            <h3 style={cardHeaderStyle}>Basic Details</h3>
            {renderField('Credit Note Number', 'credit_note_number', 'text', 'Enter Credit Note Number')}
            {renderField('Credit Note Title', 'credit_note_title', 'text', 'Enter Title')}
            {renderField('Industry', 'industry', 'text', 'Enter Industry')}
            {renderField('Transaction Type', 'transaction_type', 'text', 'Enter Transaction Type')}
            {renderField('Payment Type', 'payment_type', 'text', 'Enter Payment Type')}
            {renderField('DC ID', 'dc_id', 'text', 'Enter DC ID')}
          </div>
        </div>

        <div style={columnStyle}>
          <div style={cardStyle}>
            <h3 style={cardHeaderStyle}>Customer & Invoice</h3>
            {renderField('Customer ID', 'customer_id', 'text', 'Enter Customer ID')}
            {renderField('Invoice Date', 'invoice_date', 'date')}
            {renderField('Invoice Start Date', 'invoice_start_date', 'date')}
            {renderField('Invoice End Date', 'invoice_end_date', 'date')}
            {renderField('Email', 'email', 'email', 'Enter Email')}
            {renderField('Shipping Name', 'shipping_name', 'text', 'Enter Shipping Name')}
            {renderField('Pincode', 'pincode', 'text', 'Enter Pincode')}
          </div>
        </div>

        <div style={columnStyle}>
          <div style={cardStyle}>
            <h3 style={cardHeaderStyle}>Control</h3>
            {renderField('Status', 'status', 'text', 'Enter Status')}
            {renderField('Print Credit Note', 'print_credit_note', 'text', 'Enter Yes/No')}
            <div style={toggleFieldStyle}>
              <label style={labelStyle}>Active Status</label>
              <div style={toggleStyle} onClick={() => handleToggleChange('active_status')}>
                <div
                  style={{
                    ...toggleCircleStyle,
                    transform: formData.active_status ? 'translateX(24px)' : 'translateX(2px)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={() => navigate('/dashboard/operations/credit_notes')}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Update Credit Note</button>
      </div>

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const containerStyle = { padding: '20px' };
const breadcrumbStyle = { fontSize: '14px', marginBottom: '10px', color: '#6b7280' };
const threeColumnFormContainerStyle = { display: 'flex', gap: '20px' };
const columnStyle = { flex: 1 };
const cardStyle = { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' };
const cardHeaderStyle = { fontSize: '18px', fontWeight: 600, marginBottom: '16px' };
const fieldContainerStyle = { marginBottom: '16px' };
const labelStyle = { fontSize: '14px', fontWeight: 500, marginBottom: '4px' };
const requiredStyle = { color: 'red', marginLeft: '4px' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', width: '100%' };
const toggleFieldStyle = { marginTop: '16px' };
const toggleStyle = { width: '50px', height: '26px', borderRadius: '9999px', backgroundColor: '#d1d5db', position: 'relative', cursor: 'pointer' };
const toggleCircleStyle = { width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', transition: 'transform 0.3s' };
const buttonContainerStyle = { marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' };
const cancelBtnStyle = { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#e5e7eb', border: 'none', cursor: 'pointer' };
const createBtnStyle = { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' };

export default CreaditNotesEditFormLayout;
