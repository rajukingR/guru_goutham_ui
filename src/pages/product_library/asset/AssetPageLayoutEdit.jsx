import React from 'react';

const AssetPageLayoutEdit = () => {
  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Asset Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Asset Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Asset Tag Id" value="AST-2025-0001" />
            <Field label="Parent Asset Id" type="select" value="Parent-001" />
            <Field label="Product Name" type="select" value="Dell Latitude 5540" />
            <Field label="Po Id" type="select" value="PO-12834" />
            <Field label="Supplier" type="select" value="ABC Supplies Pvt Ltd" />
            <Field label="Stock Location" type="select" value="Warehouse A" />
            <Field label="Asset Status" type="select" value="In Use" />
            <Field label="Client" type="select" value="Infosys Technologies" />
          </div>
        </div>

        {/* Additional Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📅</div>
            <h3 style={cardHeaderStyle}>Additional Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Date" type="date" value="2024-05-10" />
            <Field label="Warranty Start Date" type="date" value="2024-05-15" />
            <Field label="Warranty End Date" type="date" value="2026-05-15" />
            <Field label="Warranty Time" value="2 Years" />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Remarks" value="Assigned to HR Department" />
            </div>
          </div>
        </div>

        {/* Control Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control</h3>
          </div>
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" style={checkboxStyle} checked readOnly />
              <div style={checkboxCustomStyle}>
                <span style={checkmarkStyle}>✓</span>
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
                <span style={checkboxDescStyle}>Enable this asset for use in the system</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={updateBtnStyle}>Update</button>
      </div>
    </div>
  );
};

const Field = ({ label, value = '', type = 'text' }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select style={selectStyle} value={value} disabled>
          <option>{value}</option>
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'date' ? (
      <input type="date" style={inputStyle} value={value} readOnly />
    ) : (
      <input type={type} style={inputStyle} value={value} readOnly />
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

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1200px',
  margin: '0',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
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
  backgroundColor: '#2563eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
};

const checkboxDescStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  cursor: 'pointer',
};

const updateBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default AssetPageLayoutEdit;