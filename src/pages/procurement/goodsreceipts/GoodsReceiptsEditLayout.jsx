import React from "react";

const GoodsReceiptsEditLayout = () => {
  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Goods Receipt Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Goods Receipt Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Goods Receipt ID" value="GR-1001" />
            <Field label="Vendor Invoice Number" value="INV-2005" />
            <Field label="Purchase Order Details" type="select" placeholder="Select Purchase Order" options={["PO-101", "PO-102"]} />
            <Field label="Purchase Order ID" value="PO-101" />
            <Field label="Purchase Order Status" value="Confirmed" disabled />
            <Field label="Goods Receipt Date" type="date" value="2025-05-28" />
            <Field label="Purchase Type" value="Buy" disabled />
            <Field label="Goods Receipt Status*" type="select" placeholder="Select Status" options={["Delivered", "Pending", "In Transit"]} />
            <Field label="Owner" value="John Doe" />
          </div>
        </div>

        {/* Supplier Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Supplier Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Supplier" type="select" placeholder="Select Supplier" options={["Acme Corp", "Global Traders", "Vendor X"]} />
          </div>
        </div>

        {/* Additional Information */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📝</div>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Description" value="Delivery of electronic components" />
          </div>
        </div>
      </div>

      {/* Product Selection */}
      <div style={{ marginTop: "2rem" }}>
        <p style={{ fontWeight: "600", marginBottom: "10px" }}>Selected Products:</p>
        <button style={primaryBtnStyle}>Select Product</button>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle}>Update</button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value = '', disabled = false, options = [] }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select style={selectStyle} disabled={disabled} defaultValue={value || ''}>
          <option value="" disabled>{placeholder}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        style={inputStyle}
        onChange={() => {}} // dummy onChange to suppress React warning for read-only input
      />
    )}
  </div>
);

// Reuse the same styles as in AddLayout
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", sans-serif',
};

const formContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
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
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
};

const fieldsGridStyle = {
  display: 'grid',
  gap: '1rem',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '500',
};

const inputStyle = {
  padding: '0.625rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '0.875rem',
};

const selectWrapperStyle = {
  position: 'relative',
};

const selectStyle = {
  width: '100%',
  padding: '0.625rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  appearance: 'none',
  fontSize: '0.875rem',
};

const selectArrowStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#4b5563',
};

const buttonContainerStyle = {
  marginTop: '2.5rem',
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#1f2937',
  color: '#ffffff',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
};

const primaryBtnStyle = {
  padding: '0.625rem 1.25rem',
  backgroundColor: '#000000',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default GoodsReceiptsEditLayout;
