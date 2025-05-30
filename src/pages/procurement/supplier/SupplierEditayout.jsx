import React from "react";

const SupplierEditLayout = () => {
  // Dummy data for the edit form
  const supplierData = {
    supplierId: "SUP-2023-00145",
    date: "2023-05-15",
    supplierName: "Global Office Supplies Inc.",
    supplierOwner: "Robert Johnson",
    gstNumber: "22ABCDE1234F1Z5",
    introducedBy: "James Wilson",
    description: "Leading supplier of office furniture and stationery with 15+ years in the industry.",
    addressLine1: "123 Business Park",
    addressLine2: "Sector 45",
    pincode: "110045",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    telephone1: "011-23456789",
    telephone2: "011-23456780",
    website: "www.globalofficesupplies.com",
    fax: "011-23456781",
    email: "info@globalofficesupplies.com",
    bankName: "Global Business Bank",
    bankAddress: "456 Financial District, New Delhi",
    accountNumber: "123456789012",
    panNumber: "ABCDE1234F",
    contactName: "Sarah Miller",
    designation: "Sales Manager",
    contactLandline: "011-23456782",
    landlineExtension: "112",
    contactEmail: "sarah.miller@globalofficesupplies.com",
    contactNumber: "+91 9876543210"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Edit Supplier</h2>

      {/* Supplier Information */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>🏢</div>
          <h3 style={cardHeaderStyle}>Supplier Information</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Supplier ID" value={supplierData.supplierId} disabled />
          <Field type="date" value={supplierData.date} label="Date" />
          <Field label="Supplier Name" value={supplierData.supplierName} />
          <Field label="Supplier Owner" value={supplierData.supplierOwner} />
          <Field label="GST Number" value={supplierData.gstNumber} />
          <Field label="Introduced By" value={supplierData.introducedBy} />
          <Field 
            label="Description" 
            value={supplierData.description}
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
          <Field label="Address Line 1" value={supplierData.addressLine1} />
          <Field label="Address Line 2" value={supplierData.addressLine2} />
          <Field label="Pincode" value={supplierData.pincode} />
          <Field 
            label="Select Country" 
            type="select" 
            value={supplierData.country}
            options={["India", "USA", "UK", "Germany", "Japan"]}
          />
          <Field 
            label="Select State" 
            type="select" 
            value={supplierData.state}
            options={["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh"]}
          />
          <Field 
            label="Select City" 
            type="select" 
            value={supplierData.city}
            options={["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"]}
          />
          <Field label="Telephone 1" value={supplierData.telephone1} />
          <Field label="Telephone 2" value={supplierData.telephone2} />
          <Field label="Website" value={supplierData.website} />
          <Field label="Fax" value={supplierData.fax} />
          <Field label="Email id" value={supplierData.email} />
        </div>
      </div>

      {/* Bank Details */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>🏦</div>
          <h3 style={cardHeaderStyle}>Bank Details</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Bank Name" value={supplierData.bankName} />
          <Field label="Bank Address" value={supplierData.bankAddress} />
          <Field label="Account Number" value={supplierData.accountNumber} />
          <Field label="PAN Number" value={supplierData.panNumber} />
        </div>
      </div>

      {/* Supplier Contact Details */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>👤</div>
          <h3 style={cardHeaderStyle}>Supplier Contact Details</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field label="Contact Name" value={supplierData.contactName} />
          <Field label="Designation" value={supplierData.designation} />
          <Field label="Contact Landline" value={supplierData.contactLandline} />
          <Field label="Landline Extension" value={supplierData.landlineExtension} />
          <Field label="Contact Email" value={supplierData.contactEmail} />
          <Field label="Contact Number" value={supplierData.contactNumber} />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={saveBtnStyle}>Save Changes</button>
        <button style={deactivateBtnStyle}>Deactivate Supplier</button>
      </div>
    </div>
  );
};

const Field = ({ label, value, placeholder, type = 'text', options, disabled = false, style }) => (
  <div style={{...fieldContainerStyle, ...style}}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          defaultValue={value}
          disabled={disabled}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options && options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        defaultValue={value}
        placeholder={placeholder}
        style={{...inputStyle, height: '80px'}}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        style={inputStyle}
        disabled={disabled}
      />
    )}
  </div>
);

// Styles (reused from the original component with additions)
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

const saveBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

const deactivateBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#dc2626',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

export default SupplierEditLayout;