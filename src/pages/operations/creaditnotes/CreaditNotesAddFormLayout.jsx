import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreaditNotesAddFormLayout = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    creditNoteNumber: '',
    creditNoteTitle: '',
    industry: '',
    transactionType: '',
    paymentType: '',
    dcId: '',
    customerId: '',
    invoiceDate: '',
    invoiceStartDate: '',
    invoiceEndDate: '',
    customerName: '',
    createdBy: '',
    amount: '',
    reference: '',
    tin: '',
    pan: '',
    email: '',
    shippingName: '',
    pincode: '',
    status: '',
    printCreditNote: false, // Boolean
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleInputChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleToggleChange = () =>
    setFormData((p) => ({ ...p, printCreditNote: !p.printCreditNote }));

  const handleSubmit = async () => {
    const payload = {
      credit_note_number: formData.creditNoteNumber,
      credit_note_title: formData.creditNoteTitle,
      industry: formData.industry,
      transaction_type: formData.transactionType,
      payment_type: formData.paymentType,
      dc_id: formData.dcId,
      customer_id: formData.customerId,
      invoice_date: formData.invoiceDate,
      invoice_start_date: formData.invoiceStartDate,
      invoice_end_date: formData.invoiceEndDate,
      customer_name: formData.customerName,
      created_by: formData.createdBy,
      amount: parseFloat(formData.amount) || 0,
      reference: formData.reference,
      tin: formData.tin,
      pan: formData.pan,
      email: formData.email,
      shipping_name: formData.shippingName,
      pincode: formData.pincode,
      status: formData.status,
      print_credit_note: formData.printCreditNote,
    };

    try {
      await axios.post('http://localhost:5000/api/credit-notes/create', payload);
      setSnackbarMessage('Credit Note created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/dashboard/operations/credit_notes'), 3000);
    } catch (error) {
      setSnackbarMessage('Failed to create credit note.');
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
        Operations / Credit Notes / Add Credit Note
      </div>

      <div style={formContainerStyle}>
        {/* Credit Note Details Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📄</div>
            <h3 style={cardHeaderStyle}>Credit Note Details:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Credit Note No." 
              placeholder="e.g. CN-2025-001" 
              value={formData.creditNoteNumber} 
              onChange={(v) => handleInputChange('creditNoteNumber', v)} 
              required 
            />
            <Field 
              label="Title" 
              placeholder="Enter title" 
              value={formData.creditNoteTitle} 
              onChange={(v) => handleInputChange('creditNoteTitle', v)} 
            />
            <Field 
              label="Industry" 
              placeholder="e.g. IT Services" 
              value={formData.industry} 
              onChange={(v) => handleInputChange('industry', v)} 
            />
            <Field 
              label="Transaction Type" 
              placeholder="e.g. Refund" 
              value={formData.transactionType} 
              onChange={(v) => handleInputChange('transactionType', v)} 
            />
            <Field 
              label="Payment Type" 
              placeholder="e.g. Bank Transfer" 
              value={formData.paymentType} 
              onChange={(v) => handleInputChange('paymentType', v)} 
            />
            <Field 
              label="DC ID" 
              placeholder="e.g. DC102" 
              value={formData.dcId} 
              onChange={(v) => handleInputChange('dcId', v)} 
            />
          </div>
        </div>

        {/* Invoice / Customer Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Invoice / Customer:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Customer ID" 
              placeholder="e.g. CUST2001" 
              value={formData.customerId} 
              onChange={(v) => handleInputChange('customerId', v)} 
            />
            <Field 
              label="Invoice Date" 
              type="date" 
              value={formData.invoiceDate} 
              onChange={(v) => handleInputChange('invoiceDate', v)} 
            />
            <Field 
              label="Start Date" 
              type="date" 
              value={formData.invoiceStartDate} 
              onChange={(v) => handleInputChange('invoiceStartDate', v)} 
            />
            <Field 
              label="End Date" 
              type="date" 
              value={formData.invoiceEndDate} 
              onChange={(v) => handleInputChange('invoiceEndDate', v)} 
            />
            <Field 
              label="Customer Name" 
              placeholder="Enter customer name" 
              value={formData.customerName} 
              onChange={(v) => handleInputChange('customerName', v)} 
            />
            <Field 
              label="Created By" 
              placeholder="Enter creator" 
              value={formData.createdBy} 
              onChange={(v) => handleInputChange('createdBy', v)} 
            />
          </div>
        </div>

        {/* Control Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Amount"
              placeholder="Enter amount"
              type="number"
              value={formData.amount}
              onChange={(v) => handleInputChange('amount', v)}
            />
            <Field
              label="Reference"
              placeholder="Enter reference"
              value={formData.reference}
              onChange={(v) => handleInputChange('reference', v)}
            />
            <Field
              label="TIN"
              placeholder="Enter TIN"
              value={formData.tin}
              onChange={(v) => handleInputChange('tin', v)}
            />
            <Field
              label="PAN"
              placeholder="Enter PAN"
              value={formData.pan}
              onChange={(v) => handleInputChange('pan', v)}
            />
            <Field
              label="Email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={(v) => handleInputChange('email', v)}
            />
            <Field
              label="Shipping Name"
              placeholder="Enter shipping name"
              value={formData.shippingName}
              onChange={(v) => handleInputChange('shippingName', v)}
            />
            <Field
              label="Pincode"
              placeholder="Enter pincode"
              value={formData.pincode}
              onChange={(v) => handleInputChange('pincode', v)}
            />
            <Field
              label="Status"
              placeholder="Enter status"
              value={formData.status}
              onChange={(v) => handleInputChange('status', v)}
            />
          </div>
          <div style={controlSectionStyle}>
            <div style={toggleFieldStyle}>
              <label style={labelStyle}>
                Print Credit Note
              </label>
              <div style={toggleContainerStyle}>
                <div
                  onClick={handleToggleChange}
                  style={{
                    ...toggleStyle,
                    backgroundColor: formData.printCreditNote ? '#10b981' : '#d1d5db'
                  }}
                >
                  <div
                    style={{
                      ...toggleCircleStyle,
                      transform: formData.printCreditNote ? 'translateX(24px)' : 'translateX(2px)'
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
          onClick={() => navigate('/dashboard/operations/credit_notes')}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          onClick={handleSubmit}
        >
          Create Credit Note
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

const Field = ({ label, placeholder, type = 'text', required = false, value, onChange }) => (
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
    />
  </div>
);

// Modern Styles (applied from BranchAddPageLayout)
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

const controlSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1rem',
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

export default CreaditNotesAddFormLayout;