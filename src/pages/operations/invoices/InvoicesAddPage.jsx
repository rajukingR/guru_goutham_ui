import React from "react";

const InvoicesAddPage = () => {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Create Invoice</h1>
        <p style={subtitleStyle}>Fill in the details below to create a new invoice</p>
      </div>

      <div style={formContainerStyle}>
        {/* Basic Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📄</div>
            <h3 style={cardHeaderStyle}>Basic Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Invoice Number" placeholder="Enter Invoice Number" />
            <Field label="Invoice Title" placeholder="Enter Invoice Title" />
            <Field 
              label="Select Customer" 
              type="select" 
              placeholder="Select Customer" 
              options={['Customer 1', 'Customer 2']}
            />

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
              <button style={monthButtonStyle}>Previous Month</button>
              <button style={monthButtonStyle}>Current Month</button>
              <button style={monthButtonStyle}>Next Month</button>
            </div>

            <Field label="Invoice Start Date" type="date" />
            <Field label="Invoice End Date" type="date" />
            <Field label="Previous End Date" type="date" />
            <Field label="Credit Note Start Date" type="date" />
            <Field label="Credit Note End Date" type="date" />
            <Field label="Customer ID" placeholder="Enter Customer ID" />
            <Field label="Email ID" placeholder="Enter Email" type="email" />
            <Field label="Phone No" placeholder="Enter Phone Number" type="tel" />
            <Field 
              label="Payment Type" 
              type="select" 
              placeholder="Select Type" 
              options={['Prepaid', 'Postpaid']}
            />
            <Field 
              label="Invoice Status" 
              type="select" 
              placeholder="Select Status" 
              options={['Approved', 'Pending']}
            />
            <Field label="Invoice Date" type="date" />
            <Field label="Amount" placeholder="Enter Amount" type="number" />
            <Field label="GST Number" placeholder="Enter GST Number" />
            <Field label="PAN" placeholder="Enter PAN" />
            <Field 
              label="Invoice Created By" 
              placeholder="rounder" 
              readOnly
            />
            <Field 
              label="Transaction Type" 
              placeholder="Rent" 
              readOnly
            />
            <Field label="Industry" placeholder="Enter Industry" />
          </div>
        </div>

        {/* To Address Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>To Address</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Company Name" placeholder="Enter Company Name" />
            <Field label="Pincode" placeholder="Enter Pincode" type="number" />
            <Field label="Country" placeholder="Enter Country" />
            <Field label="State" placeholder="Enter State" />
            <Field label="City" placeholder="Enter City" />
            <Field label="Street" placeholder="Enter Street" />
            <Field label="Landmark" placeholder="Enter Landmark" />
          </div>
        </div>
      </div>

      {/* Selected Products Section */}
      <div style={productsSectionStyle}>
        <h3 style={sectionTitleStyle}>Selected Products</h3>
        <button style={selectProductBtnStyle}>Select Product</button>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button 
          style={fetchButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          Fetch/Refresh Invoice Items
        </button>
        <button 
          style={cancelBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          Cancel
        </button>
        <button 
          style={submitBtnStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Submit Invoice
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', options = [], readOnly = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          defaultValue=""
          disabled={readOnly}
        >
          <option value="" disabled>{placeholder}</option>
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
        disabled={readOnly}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={{ ...inputStyle, backgroundColor: readOnly ? '#f3f4f6' : '#ffffff' }}
        readOnly={readOnly}
      />
    )}
  </div>
);

// Styles (consistent with previous examples)
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: '2rem',
  maxWidth: '1400px',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 0.5rem 0',
  letterSpacing: '-0.025em',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: 0,
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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
  width: '100%',
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  paddingRight: '2.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

const selectArrowStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  fontSize: '0.75rem',
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
};

const productsSectionStyle = {
  maxWidth: '1200px',
  margin: '1.5rem auto 0',
  padding: '0 1.5rem',
};

const sectionTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '1rem',
};

const selectProductBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ffffff',
  color: '#2563eb',
  border: '1px solid #2563eb',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2rem',
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
  flexWrap: 'wrap',
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
};

export default InvoicesAddPage;