import React, { useState } from "react";

const DeliveryChallanEditPage = () => {
  // Dummy data for the edit form
  const [formData, setFormData] = useState({
    dcId: 'DC-2023-00145',
    dcTitle: 'Office Furniture Delivery',
    isDemoDC: false,
    orderDetails: 'ORD-2023-00123 - Office Chairs (Qty: 10)',
    customerCode: 'CUST-10023',
    orderNumber: 'ORD-2023-00123',
    dcStatus: 'In Progress',
    dcDate: '2023-05-15',
    otherReference: 'REF-789456',
    email: 'logistics@techsolutions.com',
    gstNumber: '22ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    remarks: 'Handle with care - fragile items',
    dcType: 'Regular DC',
    transactionType: 'Sale',
    industry: 'Office Supplies',
    orderPlacedBy: 'Michael Brown',
    phoneNumber: '+1 (555) 123-4567',
    shippingName: 'Tech Solutions Inc.',
    street: '123 Business Avenue',
    landmark: 'Near Central Park',
    pincode: '560001',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    vehicleNumber: 'KA01AB1234',
    deliveryPersonName: 'Rajesh Kumar',
    deliveryPersonPhone: '+91 9876543210',
    receiverName: 'Sarah Johnson',
    receiverPhoneNumber: '+91 8765432109',
    selectedProducts: [
      {
        id: 'PROD-001',
        name: 'Ergonomic Office Chair',
        quantity: 5,
        unitPrice: 199.99,
        total: 999.95
      },
      {
        id: 'PROD-002',
        name: 'Executive Desk',
        quantity: 2,
        unitPrice: 499.99,
        total: 999.98
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(product => product.id !== productId)
    }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Edit Delivery Challan</h1>
        <p style={subtitleStyle}>Update the details below for delivery challan {formData.dcId}</p>
      </div>

      <div style={formContainerStyle}>
        {/* Delivery Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Delivery Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="DC ID" 
              value={formData.dcId}
              disabled
            />
            <Field 
              label="DC Title" 
              value={formData.dcTitle}
              onChange={(value) => handleInputChange('dcTitle', value)}
            />
            <Checkbox 
              label="Demo DC" 
              description="Check if this is a demo delivery challan"
              checked={formData.isDemoDC}
              onChange={(checked) => handleInputChange('isDemoDC', checked)}
            />
            <Field 
              label="Order Details" 
              type="select" 
              value={formData.orderDetails}
              onChange={(value) => handleInputChange('orderDetails', value)}
              options={[
                'ORD-2023-00123 - Office Chairs (Qty: 10)',
                'ORD-2023-00124 - Desks (Qty: 5)',
                'ORD-2023-00125 - Cabinets (Qty: 3)'
              ]}
            />
            <Field 
              label="Customer Code" 
              value={formData.customerCode}
              onChange={(value) => handleInputChange('customerCode', value)}
            />
            <Field 
              label="Order Number" 
              value={formData.orderNumber}
              onChange={(value) => handleInputChange('orderNumber', value)}
              required 
            />
            <Field 
              label="DC Status" 
              type="select" 
              value={formData.dcStatus}
              onChange={(value) => handleInputChange('dcStatus', value)}
              options={['Pending', 'In Progress', 'Completed', 'Cancelled']}
              required
            />
            <Field 
              label="DC Date" 
              type="date" 
              value={formData.dcDate}
              onChange={(value) => handleInputChange('dcDate', value)}
            />
            <Field 
              label="Other Reference" 
              value={formData.otherReference}
              onChange={(value) => handleInputChange('otherReference', value)}
            />
            <Field 
              label="Email" 
              type="email" 
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required 
            />
            <Field 
              label="GST Number" 
              value={formData.gstNumber}
              onChange={(value) => handleInputChange('gstNumber', value)}
              required 
            />
            <Field 
              label="PAN" 
              value={formData.pan}
              onChange={(value) => handleInputChange('pan', value)}
              required 
            />
            <Field 
              label="Remarks" 
              value={formData.remarks}
              onChange={(value) => handleInputChange('remarks', value)}
              type="textarea" 
            />
            <div style={fileUploadContainer}>
              <label style={fileUploadLabel}>
                <input type="file" style={{ display: 'none' }} />
                <span style={fileUploadButton}>Upload Updated Document</span>
              </label>
            </div>
            <Field 
              label="DC Type" 
              type="select" 
              value={formData.dcType}
              onChange={(value) => handleInputChange('dcType', value)}
              options={['Regular DC', 'Special DC', 'Express DC']}
            />
            <Field 
              label="Transaction Type" 
              type="select" 
              value={formData.transactionType}
              onChange={(value) => handleInputChange('transactionType', value)}
              options={['Rent', 'Sale', 'Lease', 'Exchange']}
            />
            <Field 
              label="Industry" 
              value={formData.industry}
              onChange={(value) => handleInputChange('industry', value)}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <button style={selectProductBtnStyle}>Edit Products</button>
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
              value={formData.orderPlacedBy}
              onChange={(value) => handleInputChange('orderPlacedBy', value)}
              readOnly
            />
            <Field 
              label="Phone Number" 
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange('phoneNumber', value)}
              type="tel"
            />
            <Field 
              label="Shipping Name" 
              value={formData.shippingName}
              onChange={(value) => handleInputChange('shippingName', value)}
            />
            <Field 
              label="Street" 
              value={formData.street}
              onChange={(value) => handleInputChange('street', value)}
            />
            <Field 
              label="Landmark" 
              value={formData.landmark}
              onChange={(value) => handleInputChange('landmark', value)}
            />
            <Field 
              label="Pincode" 
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
              type="number"
            />
            <Field 
              label="City" 
              value={formData.city}
              readOnly
            />
            <Field 
              label="State" 
              value={formData.state}
              readOnly
            />
            <Field 
              label="Country" 
              value={formData.country}
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
              value={formData.vehicleNumber}
              onChange={(value) => handleInputChange('vehicleNumber', value)}
              required
            />
            <Field 
              label="Delivery Person Name" 
              value={formData.deliveryPersonName}
              onChange={(value) => handleInputChange('deliveryPersonName', value)}
            />
            <Field 
              label="Delivery Person Phone" 
              value={formData.deliveryPersonPhone}
              onChange={(value) => handleInputChange('deliveryPersonPhone', value)}
              type="tel"
            />
            <Field 
              label="Receiver Name" 
              value={formData.receiverName}
              onChange={(value) => handleInputChange('receiverName', value)}
            />
            <Field 
              label="Receiver Phone Number" 
              value={formData.receiverPhoneNumber}
              onChange={(value) => handleInputChange('receiverPhoneNumber', value)}
              type="tel"
            />
          </div>
        </div>
      </div>

      {/* Selected Products Section */}
      <div style={productsSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Selected Products</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={printBtnStyle}>
              Print DC
            </button>
            <button style={selectProductBtnStyle}>
              Add Products
            </button>
          </div>
        </div>
        
        {formData.selectedProducts.length > 0 ? (
          <div style={productsTableContainer}>
            <table style={productsTableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={tableHeaderCellStyle}>Product ID</th>
                  <th style={tableHeaderCellStyle}>Product Name</th>
                  <th style={tableHeaderCellStyle}>Quantity</th>
                  <th style={tableHeaderCellStyle}>Unit Price</th>
                  <th style={tableHeaderCellStyle}>Total</th>
                  <th style={tableHeaderCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.selectedProducts.map(product => (
                  <tr key={product.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{product.id}</td>
                    <td style={tableCellStyle}>{product.name}</td>
                    <td style={tableCellStyle}>{product.quantity}</td>
                    <td style={tableCellStyle}>${product.unitPrice.toFixed(2)}</td>
                    <td style={tableCellStyle}>${product.total.toFixed(2)}</td>
                    <td style={tableCellStyle}>
                      <button 
                        style={actionBtnStyle}
                        onClick={() => {/* Edit functionality would go here */}}
                      >
                        Edit
                      </button>
                      <button 
                        style={{...actionBtnStyle, ...removeBtnStyle}}
                        onClick={() => removeProduct(product.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={tableFooterRowStyle}>
                  <td style={tableCellStyle} colSpan="4">Subtotal</td>
                  <td style={tableCellStyle}>
                    ${formData.selectedProducts.reduce((sum, product) => sum + product.total, 0).toFixed(2)}
                  </td>
                  <td style={tableCellStyle}></td>
                </tr>
                <tr style={tableFooterRowStyle}>
                  <td style={tableCellStyle} colSpan="4">Tax (18%)</td>
                  <td style={tableCellStyle}>
                    ${(formData.selectedProducts.reduce((sum, product) => sum + product.total, 0) * 0.18).toFixed(2)}
                  </td>
                  <td style={tableCellStyle}></td>
                </tr>
                <tr style={tableFooterRowStyle}>
                  <td style={{...tableCellStyle, fontWeight: '600'}} colSpan="4">Grand Total</td>
                  <td style={{...tableCellStyle, fontWeight: '600'}}>
                    ${(formData.selectedProducts.reduce((sum, product) => sum + product.total, 0) * 1.18).toFixed(2)}
                  </td>
                  <td style={tableCellStyle}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div style={noProductsStyle}>
            No products selected for this delivery challan
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>
          Cancel
        </button>
        <button style={saveBtnStyle}>
          Save Changes
        </button>
        <button style={updateStatusBtnStyle}>
          Update Status
        </button>
      </div>
    </div>
  );
};

// Field component
const Field = ({ label, value, placeholder, type = 'text', onChange, options = [], required = false, readOnly = false, disabled = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled || readOnly}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={{...textareaStyle, backgroundColor: readOnly ? '#f3f4f6' : '#ffffff'}}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        rows={3}
        readOnly={readOnly}
      />
    ) : type === 'date' ? (
      <input
        type="date"
        placeholder={placeholder}
        style={{...inputStyle, backgroundColor: readOnly ? '#f3f4f6' : '#ffffff'}}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={{...inputStyle, backgroundColor: readOnly ? '#f3f4f6' : '#ffffff'}}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
      />
    )}
  </div>
);

// Checkbox component
const Checkbox = ({ label, description, checked, onChange }) => (
  <div style={checkboxContainerStyle}>
    <label style={checkboxLabelStyle}>
      <input 
        type="checkbox" 
        style={checkboxStyle}
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <div style={checkboxCustomStyle}>
        {checked && <span style={checkmarkStyle}>✓</span>}
      </div>
      <div>
        <span style={checkboxTextStyle}>{label}</span>
        <span style={checkboxDescStyle}>{description}</span>
      </div>
    </label>
  </div>
);

// Styles
const containerStyle = {
  minHeight: '100vh',
  paddingBottom: '2rem',
};

const headerStyle = {
  maxWidth: '1400px',
  padding: '1.5rem',
  paddingBottom: '0',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '0.5rem',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: '#6b7280',
  paddingBottom: '1rem',
};

const formContainerStyle = {
  maxWidth: '1400px',
  padding: '0 1.5rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '1.5rem',
  marginTop: '1.5rem',
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  padding: '1.5rem',
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
};

const fieldsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1rem',
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

const requiredStyle = {
  color: '#ef4444',
  marginLeft: '0.25rem',
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

const textareaStyle = {
  ...inputStyle,
  minHeight: '80px',
  resize: 'vertical',
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

const checkboxContainerStyle = {
  marginBottom: '0.75rem',
  gridColumn: '1 / -1',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  cursor: 'pointer',
};

const checkboxStyle = {
  opacity: 0,
  position: 'absolute',
};

const checkboxCustomStyle = {
  width: '1rem',
  height: '1rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.25rem',
  marginRight: '0.75rem',
  marginTop: '0.125rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
};

const checkmarkStyle = {
  color: '#3b82f6',
  fontSize: '0.75rem',
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
  marginTop: '0.125rem',
};

const fileUploadContainer = {
  gridColumn: '1 / -1',
  marginTop: '0.5rem',
};

const fileUploadLabel = {
  display: 'inline-block',
  cursor: 'pointer',
};

const fileUploadButton = {
  display: 'inline-block',
  padding: '0.5rem 1rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px dashed #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#e5e7eb',
  },
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

const printBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ffffff',
  color: '#6b7280',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  ':hover': {
    backgroundColor: '#f3f4f6',
  },
};

const updateStatusBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#7c3aed',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  ':hover': {
    backgroundColor: '#6d28d9',
  },
};

const actionBtnStyle = {
  padding: '0.375rem 0.75rem',
  backgroundColor: '#eff6ff',
  color: '#2563eb',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#dbeafe',
  },
};

const removeBtnStyle = {
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  marginLeft: '0.5rem',
  ':hover': {
    backgroundColor: '#fecaca',
  },
};

const productsSectionStyle = {
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#111827',
};

const productsTableContainer = {
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
};

const productsTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderRowStyle = {
  backgroundColor: '#f3f4f6',
};

const tableHeaderCellStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  borderBottom: '1px solid #e2e8f0',
};

const tableRowStyle = {
  borderBottom: '1px solid #e2e8f0',
  ':hover': {
    backgroundColor: '#f9fafb',
  },
};

const tableCellStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
  borderBottom: '1px solid #e2e8f0',
};

const tableFooterRowStyle = {
  backgroundColor: '#f9fafb',
  borderTop: '1px solid #e2e8f0',
};

const noProductsStyle = {
  padding: '1.5rem',
  textAlign: 'center',
  color: '#6b7280',
  border: '1px dashed #d1d5db',
  borderRadius: '8px',
  backgroundColor: '#f9fafb',
};

const buttonContainerStyle = {
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ffffff',
  color: '#6b7280',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
  ':hover': {
    backgroundColor: '#f3f4f6',
  },
};

const saveBtnStyle = {
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

export default DeliveryChallanEditPage;