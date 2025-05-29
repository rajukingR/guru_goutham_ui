import React, { useState } from 'react';

const DepartmentEditPageLayoutDept = () => {
  const [departmentName, setDepartmentName] = useState('Finance');
  const [description, setDescription] = useState('Handles all financial operations.');
  const [isActive, setIsActive] = useState(true);

  const handleCancel = () => {
    setDepartmentName('Finance');
    setDescription('Handles all financial operations.');
    setIsActive(true);
  };

  const handleUpdate = () => {
    const data = {
      departmentName,
      description,
      status: isActive,
    };
    console.log('Updated Department Data:', data);
    // API logic here
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Edit Department</h2>

        <div style={stackedFieldsStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Department Name<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter Department Name"
              style={inputStyle}
            />
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              style={textareaStyle}
            />
          </div>
        </div>

        <div style={sectionSpacingStyle}>
          <h3 style={sectionTitleStyle}>Control</h3>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              style={checkboxStyle}
            />
            <span style={checkboxTextStyle}>Active Status</span>
          </label>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={handleCancel} style={cancelBtnStyle}>Cancel</button>
          <button onClick={handleUpdate} style={createBtnStyle}>Update</button>
        </div>
      </div>
    </div>
  );
};


// Reuse the same styles
const containerStyle = {
  padding: '2rem',
  minHeight: '100vh',
  fontFamily: '"Inter", sans-serif',
};

const formContainerStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  maxWidth: '1400px',
  margin: '0 auto',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #e2e8f0',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  marginBottom: '1.5rem',
  color: '#1f2937',
};

const stackedFieldsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginBottom: '2rem',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  marginBottom: '0.5rem',
  color: '#374151',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  fontSize: '0.875rem',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '100px',
};

const sectionSpacingStyle = {
  marginTop: '1.5rem',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '1rem',
  color: '#1e293b',
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

const checkboxTextStyle = {
  fontSize: '0.875rem',
  color: '#374151',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '2rem',
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
export default DepartmentEditPageLayoutDept;
