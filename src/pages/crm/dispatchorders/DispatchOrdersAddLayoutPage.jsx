import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DispatchOrdersAddLayoutPage = () => {
  const [formData, setFormData] = useState({
    dispatchId: '',
    orderId: '',
    customerId: '',
    customerName: '',
    dispatchDate: new Date(),
    expectedDeliveryDate: new Date(),
    dispatchStatus: '',
    shippingMethod: '',
    trackingNumber: '',
    carrierDetails: '',
    shippingAddress: '',
    billingAddress: '',
    contactPerson: '',
    contactNumber: '',
    specialInstructions: '',
    items: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Create New Dispatch Order</h1>
        <p style={subtitleStyle}>Fill in the details below to create a new dispatch order</p>
      </div>

      <div style={formContainerStyle}>
        {/* Order Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Order Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Dispatch ID" 
              placeholder="Auto-generated" 
              value={formData.dispatchId}
              disabled
            />
            <Field 
              label="Order ID" 
              placeholder="Enter Order ID" 
              value={formData.orderId}
              onChange={(value) => handleInputChange('orderId', value)}
            />
            <Field 
              label="Customer ID" 
              placeholder="Enter Customer ID" 
              value={formData.customerId}
              onChange={(value) => handleInputChange('customerId', value)}
            />
            <Field 
              label="Customer Name" 
              placeholder="Enter Customer Name" 
              value={formData.customerName}
              onChange={(value) => handleInputChange('customerName', value)}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Dispatch Date</label>
                  <DatePicker 
                    value={formData.dispatchDate} 
                    onChange={(date) => handleInputChange('dispatchDate', date)} 
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div style={dateInputWrapper}>
                        <input ref={inputRef} {...inputProps} style={dateInputStyle} />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />
                </div>
              </LocalizationProvider>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Expected Delivery Date</label>
                  <DatePicker 
                    value={formData.expectedDeliveryDate} 
                    onChange={(date) => handleInputChange('expectedDeliveryDate', date)} 
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div style={dateInputWrapper}>
                        <input ref={inputRef} {...inputProps} style={dateInputStyle} />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />
                </div>
              </LocalizationProvider>
            </div>
            <Field 
              label="Dispatch Status" 
              type="select" 
              value={formData.dispatchStatus}
              onChange={(value) => handleInputChange('dispatchStatus', value)}
              options={['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']}
            />
            <Field 
              label="Shipping Method" 
              type="select" 
              value={formData.shippingMethod}
              onChange={(value) => handleInputChange('shippingMethod', value)}
              options={['Standard', 'Express', 'Overnight', 'International']}
            />
            <Field 
              label="Tracking Number" 
              placeholder="Enter Tracking Number" 
              value={formData.trackingNumber}
              onChange={(value) => handleInputChange('trackingNumber', value)}
            />
            <Field 
              label="Carrier Details" 
              placeholder="Enter Carrier Details" 
              value={formData.carrierDetails}
              onChange={(value) => handleInputChange('carrierDetails', value)}
            />
          </div>
        </div>

        {/* Address & Contact Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>Address & Contact</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Shipping Address" 
              type="textarea"
              placeholder="Enter Shipping Address" 
              value={formData.shippingAddress}
              onChange={(value) => handleInputChange('shippingAddress', value)}
              style={{ gridColumn: '1 / -1' }}
            />
            <Field 
              label="Billing Address" 
              type="textarea"
              placeholder="Enter Billing Address" 
              value={formData.billingAddress}
              onChange={(value) => handleInputChange('billingAddress', value)}
              style={{ gridColumn: '1 / -1' }}
            />
            <Field 
              label="Contact Person" 
              placeholder="Enter Contact Person" 
              value={formData.contactPerson}
              onChange={(value) => handleInputChange('contactPerson', value)}
            />
            <Field 
              label="Contact Number" 
              placeholder="Enter Contact Number" 
              value={formData.contactNumber}
              onChange={(value) => handleInputChange('contactNumber', value)}
            />
            <Field 
              label="Special Instructions" 
              type="textarea"
              placeholder="Enter any special instructions" 
              value={formData.specialInstructions}
              onChange={(value) => handleInputChange('specialInstructions', value)}
              style={{ gridColumn: '1 / -1' }}
            />
          </div>
        </div>
      </div>

      {/* Items to Dispatch Section */}
      <div style={productsSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Items to Dispatch</h3>
          <button style={selectProductBtnStyle}>
            Add Items
          </button>
        </div>
        
        {formData.items.length > 0 ? (
          <div style={productsTableContainer}>
            <table style={productsTableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={tableHeaderCellStyle}>Item ID</th>
                  <th style={tableHeaderCellStyle}>Description</th>
                  <th style={tableHeaderCellStyle}>Quantity</th>
                  <th style={tableHeaderCellStyle}>Unit Price</th>
                  <th style={tableHeaderCellStyle}>Total</th>
                  <th style={tableHeaderCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} style={tableRowStyle}>
                    <td style={tableCellStyle}>{item.id || 'N/A'}</td>
                    <td style={tableCellStyle}>{item.description || 'N/A'}</td>
                    <td style={tableCellStyle}>{item.quantity || '0'}</td>
                    <td style={tableCellStyle}>{item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}</td>
                    <td style={tableCellStyle}>{item.total ? `$${item.total.toFixed(2)}` : 'N/A'}</td>
                    <td style={tableCellStyle}>
                      <button 
                        style={actionBtnStyle}
                        onClick={() => {/* Edit functionality would go here */}}
                      >
                        Edit
                      </button>
                      <button 
                        style={{...actionBtnStyle, ...removeBtnStyle}}
                        onClick={() => {/* Remove functionality would go here */}}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={noProductsStyle}>
            No items added to this dispatch order
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>
          Cancel
        </button>
        <button style={saveBtnStyle}>
          Save Draft
        </button>
        <button style={dispatchBtnStyle}>
          Dispatch Order
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, value, placeholder, type = 'text', onChange, options = [], disabled = false, style }) => (
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
        style={textareaStyle}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        rows={3}
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

const saveBtnStyle = {
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

const dispatchBtnStyle = {
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

const productsSectionStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const sectionTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#374151',
  margin: 0,
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

const productsTableContainer = {
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  overflow: 'hidden',
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
};

const tableRowStyle = {
  borderBottom: '1px solid #e2e8f0',
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
};

const tableCellStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
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
};

const removeBtnStyle = {
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  marginLeft: '0.5rem'
};

const noProductsStyle = {
  padding: '1.5rem',
  textAlign: 'center',
  color: '#6b7280',
  border: '1px dashed #d1d5db',
  borderRadius: '8px',
};

const dateFieldContainer = {
  width: '100%',
  marginBottom: '1rem',
};

const dateInputWrapper = {
  position: 'relative',
  width: '100%',
};

const dateInputStyle = {
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

export default DispatchOrdersAddLayoutPage;