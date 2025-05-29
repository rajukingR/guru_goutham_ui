import React, { useState } from "react";

const RolesAddPageLayout = () => {
  const [roleData, setRoleData] = useState({
    roleName: '',
    location: '',
    department: ''
  });

  const handleInputChange = (field, value) => {
    setRoleData(prev => ({ ...prev, [field]: value }));
  };

  const permissions = [
    "can edit",
    "can deactivate",
    "can print",
    "can search",
    "can generate pdf",
    "can delete",
    "can import",
    "can logout",
    "can activate",
    "can export"
  ];

  const modules = [
    "Users",
    "Roles",
    "Inventory",
    "Product",
    "Stock Location",
    "Grade",
    "Item Variant",
    "Item Master",
    "Product Category",
    "Brands",
    "Product Template",
    "CRM",
    "Application",
    "Purchase_order",
    "Purchase",
    "Supplier",
    "Procurement",
    "Operations",
    "Client",
    "UserPerformance",
    "Supplier"
  ];

  const handleSubmit = () => {
    console.log("Role Created:", roleData);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <h3 style={cardHeaderStyle}>Create New Role</h3>
          <div style={fieldsGridStyle}>
            <Field label="Role Name" value={roleData.roleName} onChange={val => handleInputChange('roleName', val)} required />
            <Field label="Location" value={roleData.location} onChange={val => handleInputChange('location', val)} />
            <Field label="Department" value={roleData.department} onChange={val => handleInputChange('department', val)} />
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={cardHeaderStyle}>Module Access Permissions</h3>
          {modules.map((module, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{module}</h4>
              <div style={permissionGridStyle}>
                {permissions.map((permission, i) => (
                  <label key={i} style={checkboxLabelStyle}>
                    <input type="checkbox" style={checkboxStyle} />
                    <span style={{ fontSize: '0.875rem' }}>{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle}>Cancel</button>
        <button style={createBtnStyle} onClick={handleSubmit}>Create Role</button>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, required = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label}`}
      style={inputStyle}
    />
  </div>
);

const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", sans-serif',
  minHeight: '100vh',
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  border: '1px solid #e2e8f0',
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '1rem',
};

const fieldsGridStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
};

const permissionGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '0.5rem',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const checkboxStyle = {
  width: '16px',
  height: '16px',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
};

const requiredStyle = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#fff',
  outline: 'none',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  maxWidth: '1200px',
  margin: '2rem auto 0',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#fff',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
};

export default RolesAddPageLayout;
