import React from 'react';

const ProductsAddLayout = () => {
  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Left Column - Product Category & Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Product Information</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <Field label="Product Category" type="select" required>
              <option>Laptop</option>
            </Field>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Add Images" type="button" required />
            </div>

            <Field label="Product ID" placeholder="Enter Product ID" required />
            <Field label="Product Name" placeholder="Enter Product Name" required />

            <Field label="Brand" type="select" required>
              <option>Select Brand</option>
            </Field>
            
            <Field label="Grade" type="select" required>
              <option>Select Grade</option>
            </Field>

            <Field label="Model" placeholder="Enter Model" required />
            
            <Field label="Stock Location" type="select" required>
              <option>Select Stock Location</option>
            </Field>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Description" type="textarea" placeholder="Enter Description" />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Add Ons" placeholder="Enter Add Ons" />
            </div>
          </div>
        </div>

        {/* Middle Column - Specifications */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Specifications</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <Field label="RAM" placeholder="Enter RAM" required />
            
            <Field label="Disk type" type="select" required>
              <option>Select Disk Type</option>
            </Field>

            <Field label="Processor" placeholder="Enter Processor" required />
            
            <Field label="Storage" type="select" required>
              <option>Select Storage</option>
            </Field>

            <Field label="Graphics" placeholder="Enter Graphics" required />
            
            <Field label="OS" placeholder="Enter OS" required />

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={checkboxGroupStyle}>
                {['Mouse', 'Keyboard', 'DVD', 'Speaker', 'Webcam'].map(label => (
                  <CheckboxField key={label} label={label} defaultChecked={label === 'Webcam'} required={label === 'Webcam'} />
                ))}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Add Custom field" type="button" />
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button style={saveBtnStyle}>Save</button>
          </div>
        </div>

        {/* Right Column - Price Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💰</div>
            <h3 style={cardHeaderStyle}>Price Details</h3>
          </div>
          
          <div style={fieldsGridStyle}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Purchase Price" placeholder="Enter Purchase Price" />
            </div>

            {["Per Date", "1/month", "6/month", "1 year"].map(label => (
              <div key={label} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label={`Rent Price ${label}`} type="select" required>
                  <option>0%</option>
                </Field>
                <Field label=" " placeholder="₹0/-" />
              </div>
            ))}

            <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
              <div style={cardHeaderContainerStyle}>
                <div style={iconStyle}>🎛️</div>
                <h3 style={cardHeaderStyle}>Control</h3>
              </div>
              <CheckboxField label="Active Status" defaultChecked required />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', required = false, children }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select style={selectStyle}>
          {children}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        rows={3}
      />
    ) : type === 'button' ? (
      <button style={buttonFieldStyle}>+</button>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
      />
    )}
  </div>
);

const CheckboxField = ({ label, defaultChecked = false, required = false }) => (
  <div style={checkboxContainerStyle}>
    <label style={checkboxLabelStyle}>
      <input 
        type="checkbox" 
        style={checkboxStyle}
        defaultChecked={defaultChecked}
      />
      <div style={checkboxCustomStyle}>
        {defaultChecked && <span style={checkmarkStyle}>✓</span>}
      </div>
      <div>
        <span style={checkboxTextStyle}>
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </span>
      </div>
    </label>
  </div>
);

// Enhanced Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
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

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const buttonFieldStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '2px dashed #d1d5db',
  fontSize: '1.25rem',
  backgroundColor: '#f9fafb',
  color: '#6b7280',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
  fontWeight: '500',
};

const checkboxGroupStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '0.75rem',
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
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  marginTop: '2px',
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
  display: 'block',
};

const buttonContainerStyle = {
  marginTop: '1.5rem',
  paddingTop: '1rem',
  borderTop: '1px solid #e2e8f0',
};

const saveBtnStyle = {
  width: '100%',
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

export default ProductsAddLayout;