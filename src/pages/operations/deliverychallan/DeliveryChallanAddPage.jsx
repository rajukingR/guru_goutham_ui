import React from "react";

const DeliveryChallanAddPage = () => {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Create Delivery Challan</h1>
        <p style={subtitleStyle}>Fill in the details below to create a new delivery challan</p>
      </div>

      <div style={formContainerStyle}>
        {/* Delivery Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Delivery Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="DC ID" placeholder="Enter DC ID" />
            <Field label="DC Title" placeholder="Enter DC Title" />
            <Checkbox 
              label="Demo DC" 
              description="Check if this is a demo delivery challan"
            />
            <Field 
              label="Order Details" 
              type="select" 
              placeholder="Select Order" 
              options={['Order 1', 'Order 2']}
            />
            <Field label="Customer Code" placeholder="Enter Customer Code" />
            <Field label="Order Number" placeholder="Enter Order Number" required />
            <Field 
              label="DC Status" 
              type="select" 
              placeholder="Select Status" 
              options={['Pending', 'In Progress', 'Completed']}
              required
            />
            <Field 
              label="DC Date" 
              type="date" 
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            <Field label="Other Reference" placeholder="Enter Reference" />
            <Field label="Email" type="email" placeholder="Enter Email" required />
            <Field label="GST Number" placeholder="Enter GST Number" required />
            <Field label="PAN" placeholder="Enter PAN" required />
            <Field label="Remarks" placeholder="Enter Remarks" type="textarea" />
            <div style={fileUploadContainer}>
              <label style={fileUploadLabel}>
                <input type="file" style={{ display: 'none' }} />
                <span style={fileUploadButton}>Choose File</span>
              </label>
            </div>
            <Field 
              label="DC Type" 
              type="select" 
              placeholder="Select DC Type" 
              options={['Regular DC', 'Special DC']}
            />
            <Field 
              label="Transaction Type" 
              type="select" 
              placeholder="Select Type" 
              options={['Rent', 'Sale', 'Lease']}
            />
            <Field label="Industry" placeholder="Enter Industry" />
            <div style={{ gridColumn: '1 / -1' }}>
              <button style={selectProductBtnStyle}>Select Product</button>
            </div>
          </div>
        </div>

        {/* Shipping Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🚚</div>
            <h3 style={cardHeaderStyle}>Shipping Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Order Placed by" 
              placeholder="undefined undefined" 
              readOnly
            />
            <Field 
              label="Phone Number" 
              placeholder="Enter Phone Number" 
              type="tel"
            />
            <Field 
              label="Shipping Name" 
              placeholder="Enter Shipping Name" 
            />
            <Field 
              label="Street" 
              placeholder="Enter Street" 
            />
            <Field 
              label="Landmark" 
              placeholder="Enter Landmark" 
            />
            <Field 
              label="Pincode" 
              placeholder="Enter Pincode" 
              type="number"
            />
            <Field 
              label="City" 
              placeholder="Bangalore" 
              readOnly
            />
            <Field 
              label="State" 
              placeholder="Karnataka" 
              readOnly
            />
            <Field 
              label="Country" 
              placeholder="India" 
              readOnly
            />
          </div>
        </div>

        {/* Other Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📝</div>
            <h3 style={cardHeaderStyle}>Other Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Vehicle Number" 
              placeholder="Enter Vehicle Number" 
              required
            />
            <Field 
              label="Delivery Person Name" 
              placeholder="Enter Name" 
            />
            <Field 
              label="Delivery Person Phone" 
              placeholder="Enter Phone" 
              type="tel"
            />
            <Field 
              label="Receiver Name" 
              placeholder="Enter Name" 
            />
            <Field 
              label="Receiver Phone Number" 
              placeholder="Enter Phone" 
              type="tel"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'} onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
          Cancel
        </button>
        <button style={createBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}>
          Save Delivery Challan
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text', options = [], required = false, readOnly = false, defaultValue }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
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
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        rows={3}
        readOnly={readOnly}
      />
    ) : type === 'date' ? (
      <input
        type="date"
        placeholder={placeholder}
        style={inputStyle}
        defaultValue={defaultValue}
        readOnly={readOnly}
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

const Checkbox = ({ label, description }) => (
  <div style={checkboxContainerStyle}>
    <label style={checkboxLabelStyle}>
      <input 
        type="checkbox" 
        style={checkboxStyle}
      />
      <div style={checkboxCustomStyle}>
        <span style={checkmarkStyle}>✓</span>
      </div>
      <div>
        <span style={checkboxTextStyle}>{label}</span>
        <span style={checkboxDescStyle}>{description}</span>
      </div>
    </label>
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
  fontSize: '2rem',
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

const checkboxContainerStyle = {
  marginTop: '0.5rem',
  gridColumn: '1 / -1',
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

const checkboxDescStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  display: 'block',
  marginTop: '0.25rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
  maxWidth: '1200px',
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
  width: '100%',
};

const fileUploadContainer = {
  gridColumn: '1 / -1',
};

const fileUploadLabel = {
  display: 'block',
  cursor: 'pointer',
};

const fileUploadButton = {
  display: 'inline-block',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ffffff',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
};

export default DeliveryChallanAddPage;