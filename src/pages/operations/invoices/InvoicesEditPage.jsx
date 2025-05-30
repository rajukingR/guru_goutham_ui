import React, { useState } from "react";

const InvoicesEditPage = () => {
  // Dummy data for the invoice
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-2023-001",
    invoiceTitle: "Office Space Rent - May 2023",
    customer: "Customer 1",
    startDate: "2023-05-01",
    endDate: "2023-05-31",
    previousEndDate: "2023-04-30",
    creditNoteStartDate: "",
    creditNoteEndDate: "",
    customerId: "CUST-001",
    email: "contact@customer1.com",
    phone: "+919876543210",
    paymentType: "Postpaid",
    invoiceStatus: "Approved",
    invoiceDate: "2023-05-25",
    amount: "15000",
    gstNumber: "22ABCDE1234F1Z5",
    pan: "ABCDE1234F",
    invoiceCreatedBy: "rounder",
    transactionType: "Rent",
    industry: "Real Estate",
    companyName: "Customer 1 Pvt. Ltd.",
    pincode: "400001",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    street: "123 Business Street",
    landmark: "Near Central Park"
  });

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Invoice data submitted:", invoiceData);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Edit Invoice</h1>
        <p style={subtitleStyle}>Edit the details below for invoice {invoiceData.invoiceNumber}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Basic Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📄</div>
              <h3 style={cardHeaderStyle}>Basic Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field 
                label="Invoice Number" 
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              />
              <Field 
                label="Invoice Title" 
                value={invoiceData.invoiceTitle}
                onChange={(e) => handleInputChange('invoiceTitle', e.target.value)}
              />
              <Field 
                label="Select Customer"
                type="select"
                value={invoiceData.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                options={['Customer 1', 'Customer 2']}
              />

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
                <button type="button" style={monthButtonStyle}>Previous Month</button>
                <button type="button" style={monthButtonStyle}>Current Month</button>
                <button type="button" style={monthButtonStyle}>Next Month</button>
              </div>

              <Field 
                label="Invoice Start Date" 
                type="date" 
                value={invoiceData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
              <Field 
                label="Invoice End Date" 
                type="date" 
                value={invoiceData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
              <Field 
                label="Previous End Date" 
                type="date" 
                value={invoiceData.previousEndDate}
                onChange={(e) => handleInputChange('previousEndDate', e.target.value)}
              />
              <Field 
                label="Credit Note Start Date" 
                type="date" 
                value={invoiceData.creditNoteStartDate}
                onChange={(e) => handleInputChange('creditNoteStartDate', e.target.value)}
              />
              <Field 
                label="Credit Note End Date" 
                type="date" 
                value={invoiceData.creditNoteEndDate}
                onChange={(e) => handleInputChange('creditNoteEndDate', e.target.value)}
              />
              <Field 
                label="Customer ID" 
                value={invoiceData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
              />
              <Field 
                label="Email ID" 
                type="email" 
                value={invoiceData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <Field 
                label="Phone No" 
                type="tel" 
                value={invoiceData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              <Field 
                label="Payment Type" 
                type="select" 
                value={invoiceData.paymentType}
                onChange={(e) => handleInputChange('paymentType', e.target.value)}
                options={['Prepaid', 'Postpaid']}
              />
              <Field 
                label="Invoice Status" 
                type="select" 
                value={invoiceData.invoiceStatus}
                onChange={(e) => handleInputChange('invoiceStatus', e.target.value)}
                options={['Approved', 'Pending']}
              />
              <Field 
                label="Invoice Date" 
                type="date" 
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
              />
              <Field 
                label="Amount" 
                type="number" 
                value={invoiceData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
              <Field 
                label="GST Number" 
                value={invoiceData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              />
              <Field 
                label="PAN" 
                value={invoiceData.pan}
                onChange={(e) => handleInputChange('pan', e.target.value)}
              />
              <Field 
                label="Invoice Created By" 
                value={invoiceData.invoiceCreatedBy}
                readOnly
              />
              <Field 
                label="Transaction Type" 
                value={invoiceData.transactionType}
                readOnly
              />
              <Field 
                label="Industry" 
                value={invoiceData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
          </div>

          {/* To Address Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏢</div>
              <h3 style={cardHeaderStyle}>To Address</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field 
                label="Company Name" 
                value={invoiceData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
              <Field 
                label="Pincode" 
                type="number" 
                value={invoiceData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
              />
              <Field 
                label="Country" 
                value={invoiceData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
              <Field 
                label="State" 
                value={invoiceData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
              <Field 
                label="City" 
                value={invoiceData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              <Field 
                label="Street" 
                value={invoiceData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />
              <Field 
                label="Landmark" 
                value={invoiceData.landmark}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Selected Products Section */}
        <div style={productsSectionStyle}>
          <h3 style={sectionTitleStyle}>Selected Products</h3>
          <button type="button" style={selectProductBtnStyle}>Select Product</button>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button 
            type="button"
            style={fetchButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            Fetch/Refresh Invoice Items
          </button>
          <button 
            type="button"
            style={cancelBtnStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          >
            Cancel
          </button>
          <button 
            type="submit"
            style={submitBtnStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Update Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

// Field component
const Field = ({ 
  label, 
  value = '', 
  type = 'text', 
  options = [], 
  readOnly = false, 
  onChange = () => {} 
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          value={value}
          onChange={onChange}
          disabled={readOnly}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'date' ? (
      <input
        type="date"
        style={inputStyle}
        value={value}
        onChange={onChange}
        disabled={readOnly}
      />
    ) : (
      <input
        type={type}
        value={value}
        style={{ ...inputStyle, backgroundColor: readOnly ? '#f3f4f6' : '#ffffff' }}
        onChange={onChange}
        readOnly={readOnly}
      />
    )}
  </div>
);

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const headerStyle = {
  maxWidth: '1400px',
  padding: '0 1.5rem',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#111827',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: '#6b7280',
    marginBottom: '2rem',

};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  padding: '0 1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const iconStyle = {
  fontSize: '1.5rem',
  marginRight: '0.75rem',
};

const cardHeaderStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#111827',
  margin: 0,
};

const fieldsGridStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
};

const fieldContainerStyle = {
  marginBottom: '0.75rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '0.25rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  ':focus': {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
};

const selectWrapperStyle = {
  position: 'relative',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  paddingRight: '2rem',
};

const selectArrowStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#6b7280',
};

const monthButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ffffff',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  flex: 1,
  ':hover': {
    backgroundColor: '#f3f4f6',
  },
};

const productsSectionStyle = {
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '1rem',
};

const selectProductBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  ':hover': {
    backgroundColor: '#2563eb',
  },
};

const buttonContainerStyle = {
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
};

const fetchButtonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  ':hover': {
    backgroundColor: '#059669',
  },
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
  ':hover': {
    backgroundColor: '#e5e7eb',
  },
};

const submitBtnStyle = {
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
  ':hover': {
    backgroundColor: '#1d4ed8',
  },
};

export default InvoicesEditPage;