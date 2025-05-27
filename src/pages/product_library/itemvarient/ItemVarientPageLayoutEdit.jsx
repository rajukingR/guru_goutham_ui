import React from 'react';

const ItemVariantPageLayoutEdit = () => {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>📝</div>
          <h3 style={cardHeaderStyle}>Edit Item Variant</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Product Category" type="select" value="Laptop" />
          <Field label="Item/Specification Name" type="select" value="Dell Latitude 5540" />
          <Field label="Type" type="text" value="Business Series" />
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" style={checkboxStyle} defaultChecked />
              <div style={checkboxCustomStyle}>
                <span style={checkmarkStyle}>✓</span>
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
              </div>
            </label>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <button style={cancelBtnStyle}>Cancel</button>
          <button style={updateBtnStyle}>Update</button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, type = 'text', value = '', placeholder = '' }) => (
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
    ) : (
      <input type={type} defaultValue={value} style={inputStyle} />
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

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  maxWidth: '800px',
  margin: '0',
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

export default ItemVariantPageLayoutEdit;