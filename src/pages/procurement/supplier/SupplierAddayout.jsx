import React from "react";

const SupplierAddLayout = () => {
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Suppliers</h2>

      {/* Supplier Information */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>🏢</div>
          <h3 style={cardHeaderStyle}>Supplier Information</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Supplier ID" placeholder="Enter Supplier ID" />
          <Field type="date" placeholder="dd-mm-yyyy" label="Date" />
          <Field label="Supplier Name" placeholder="Enter Supplier Name" />
          <Field label="Supplier Owner" placeholder="Enter Supplier Owner" />
          <Field label="GST Number" placeholder="Enter GST Number" />
          <Field label="Introduced By" placeholder="Enter Introduced By" />
          <Field 
            label="Description" 
            placeholder="Enter Description" 
            type="textarea" 
            style={{ gridColumn: '1 / -1' }}
          />
        </div>
      </div>

      {/* Supplier Address */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>📍</div>
          <h3 style={cardHeaderStyle}>Supplier Address</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Address Line 1" placeholder="Enter Address Line 1" />
          <Field label="Address Line 2" placeholder="Enter Address Line 2" />
          <Field label="Pincode" placeholder="Enter Pincode" />
          <Field label="Select Country" type="select" placeholder="Select Country" />
          <Field label="Select State" type="select" placeholder="Select State" />
          <Field label="Select City" type="select" placeholder="Select City" />
          <Field label="Telephone 1" placeholder="Enter Telephone 1" />
          <Field label="Telephone 2" placeholder="Enter Telephone 2" />
          <Field label="Website" placeholder="Enter Website" />
          <Field label="Fax" placeholder="Enter Fax" />
          <Field label="Email id" placeholder="Enter Email" />
        </div>
      </div>

      {/* Bank Details */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>🏦</div>
          <h3 style={cardHeaderStyle}>Bank Details</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Bank Name" placeholder="Enter Bank Name" />
          <Field label="Bank Address" placeholder="Enter Bank Address" />
          <Field label="Account Number" placeholder="Enter Account Number" />
          <Field label="PAN Number" placeholder="Enter PAN Number" />
        </div>
      </div>

      {/* Supplier Contact Details */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>👤</div>
          <h3 style={cardHeaderStyle}>Supplier Contact Details</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Contact Name" placeholder="Enter Contact Name" />
          <Field label="Designation" placeholder="Enter Designation" />
          <Field label="Contact Landline" placeholder="Enter Landline" />
          <Field label="Landline Extension" placeholder="Enter Extension" />
          <Field label="Contact Email" placeholder="Enter Contact Email" />
          <Field label="Contact Number" placeholder="Enter Contact Number" />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle}>Create</button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', value, onChange, disabled = false, style }) => (
  <div style={{...fieldContainerStyle, ...style}}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={{...inputStyle, height: '80px'}}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
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
  maxWidth: '1400px',
};

const headingStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '1.5rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  marginBottom: '1.5rem',
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '1rem',
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
};

export default SupplierAddLayout;