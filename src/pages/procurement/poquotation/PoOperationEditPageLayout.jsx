import React from 'react';

const PoOperationEditPageLayout = () => {
  // Dummy data for the edit form
  const quotationData = {
    id: "PQ-2023-00145",
    purchaseRequestDetails: "PR-2023-00123 - Office Supplies",
    purchaseRequestId: "PR-2023-00123",
    purchaseRequestStatus: "Approved",
    quotationDate: "2023-05-15",
    purchaseType: "Buy",
    quotationStatus: "Draft",
    owner: "John Smith",
    supplier: "Office Supply Co.",
    description: "Quarterly office supplies including stationery, printer ink, and cleaning products."
  };

  const selectedProducts = [
    { id: "P001", name: "Ballpoint Pens (Box of 12)", quantity: 5, unitPrice: 12.99, total: 64.95 },
    { id: "P002", name: "A4 Printer Paper (500 sheets)", quantity: 10, unitPrice: 8.50, total: 85.00 },
    { id: "P003", name: "Sticky Notes (Pack of 10)", quantity: 3, unitPrice: 5.99, total: 17.97 }
  ];

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Edit Quotation</h2>

      <div style={formSectionStyle}>
        {/* Column 1: Quotation Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Quotation Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Purchase Quotation ID" 
              value={quotationData.id} 
              disabled 
            />
            <Field 
              label="Purchase Request Details" 
              type="select" 
              value={quotationData.purchaseRequestDetails}
            />
            <Field 
              label="Purchase Request ID" 
              value={quotationData.purchaseRequestId} 
            />
            <Field 
              label="Purchase Request Status" 
              value={quotationData.purchaseRequestStatus} 
              disabled 
            />
            <Field 
              label="Purchase Quotation Date" 
              type="date" 
              value={quotationData.quotationDate} 
            />
            <Field 
              label="Purchase Type" 
              value={quotationData.purchaseType} 
              disabled 
            />
            <Field 
              label="PO Quotation Status*" 
              type="select" 
              value={quotationData.quotationStatus}
            />
            <Field 
              label="Owner" 
              value={quotationData.owner} 
            />
          </div>
        </div>

        {/* Column 2: Supplier Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Supplier Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Supplier" 
              type="select" 
              value={quotationData.supplier}
            />
          </div>
        </div>

        {/* Column 3: Additional Info */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>ℹ️</div>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Description" 
              value={quotationData.description}
              type="textarea"
              style={{ gridColumn: '1 / -1' }}
            />
          </div>
        </div>
      </div>

      {/* Selected Products Section */}
      <div style={selectedProductSectionStyle}>
        <p style={selectedProductTextStyle}>Selected Products:</p>
        <button style={productButtonStyle}>Edit Products</button>
      </div>

      {/* Products Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              <th style={tableHeaderStyle}>Product ID</th>
              <th style={tableHeaderStyle}>Product Name</th>
              <th style={tableHeaderStyle}>Quantity</th>
              <th style={tableHeaderStyle}>Unit Price</th>
              <th style={tableHeaderStyle}>Total</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map(product => (
              <tr key={product.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{product.id}</td>
                <td style={tableCellStyle}>{product.name}</td>
                <td style={tableCellStyle}>{product.quantity}</td>
                <td style={tableCellStyle}>${product.unitPrice.toFixed(2)}</td>
                <td style={tableCellStyle}>${product.total.toFixed(2)}</td>
                <td style={tableCellStyle}>
                  <button style={actionButtonStyle}>Edit</button>
                  <button style={{...actionButtonStyle, marginLeft: '0.5rem', backgroundColor: '#fef2f2', color: '#b91c1c'}}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={tableFooterRowStyle}>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={tableFooterLabelStyle}>Subtotal:</td>
              <td style={tableFooterValueStyle}>$167.92</td>
              <td style={tableCellStyle}></td>
            </tr>
            <tr style={tableFooterRowStyle}>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={tableFooterLabelStyle}>Tax (10%):</td>
              <td style={tableFooterValueStyle}>$16.79</td>
              <td style={tableCellStyle}></td>
            </tr>
            <tr style={tableFooterRowStyle}>
              <td style={tableCellStyle} colSpan="3"></td>
              <td style={{...tableFooterLabelStyle, fontWeight: '600'}}>Total:</td>
              <td style={{...tableFooterValueStyle, fontWeight: '600'}}>$184.71</td>
              <td style={tableCellStyle}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={saveBtnStyle}>Save Changes</button>
        <button style={submitBtnStyle}>Submit for Approval</button>
      </div>
    </div>
  );
};

const Field = ({ label, value, placeholder, type = 'text', disabled = false, style }) => (
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
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
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

const formSectionStyle = {
  display: 'flex',
  gap: '1.5rem',
};

const cardStyle = {
  flex: 1,
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
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

const selectedProductSectionStyle = {
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0 1.5rem',
};

const selectedProductTextStyle = {
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
};

const productButtonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#111827',
  color: '#fff',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

// Table styles
const tableContainerStyle = {
  marginTop: '1rem',
  padding: '0 1.5rem',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

const tableHeaderRowStyle = {
  backgroundColor: '#f3f4f6',
};

const tableHeaderStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb',
};

const tableRowStyle = {
  borderBottom: '1px solid #e5e7eb',
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
};

const tableCellStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
};

const tableFooterRowStyle = {
  borderTop: '1px solid #e5e7eb',
};

const tableFooterLabelStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
  textAlign: 'right',
};

const tableFooterValueStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
};

const actionButtonStyle = {
  padding: '0.375rem 0.75rem',
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: '500',
};

// Button styles
const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
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

const submitBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#059669',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

export default PoOperationEditPageLayout;