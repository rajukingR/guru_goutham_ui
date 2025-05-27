import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
} from "@mui/material";

const BrandsPageAddLayout = () => {
  const [form, setForm] = useState({
    brandNumber: "",
    brandName: "",
    description: "",
    active: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    console.log("Brand form:", form);
  };

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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    border: form.active ? '2px solid #2563eb' : '2px solid #d1d5db',
    backgroundColor: form.active ? '#2563eb' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const checkmarkStyle = {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    display: form.active ? 'block' : 'none',
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

  const createBtnStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
       <div style={cardHeaderContainerStyle}>
  <div style={iconStyle}>📝</div>
  <h3 style={cardHeaderStyle}>Add New Brand</h3>
</div>
        <div style={fieldsGridStyle}>
          <Field
            label="Brand Number"
            type="text"
            name="brandNumber"
            value={form.brandNumber}
            onChange={handleChange}
            fieldContainerStyle={fieldContainerStyle}
            labelStyle={labelStyle}
            inputStyle={inputStyle}
          />
          <Field
            label="Brand Name"
            type="text"
            name="brandName"
            value={form.brandName}
            onChange={handleChange}
            fieldContainerStyle={fieldContainerStyle}
            labelStyle={labelStyle}
            inputStyle={inputStyle}
          />
          <Field
            label="Brand Description"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            fieldContainerStyle={fieldContainerStyle}
            labelStyle={labelStyle}
            inputStyle={inputStyle}
          />
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <Checkbox
                name="active"
                checked={form.active}
                onChange={handleChange}
                style={checkboxStyle}
              />
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
          <button style={createBtnStyle} onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, type = 'text', value = '', name, onChange, fieldContainerStyle, labelStyle, inputStyle }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      style={inputStyle}
    />
  </div>
);

export default BrandsPageAddLayout;