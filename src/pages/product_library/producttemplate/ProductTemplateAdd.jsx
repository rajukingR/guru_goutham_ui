import React, { useState } from 'react';

const ProductTemplateAdd = () => {
  const [formData, setFormData] = useState({
    category: '',
    image: null,
    productName: '',
    brand: '',
    model: '',
    description: '',
    gst: '',
    hsn: '',
    activeStatus: false,
    // Assembled Desktop specific fields
    cores: '',
    display: '',
    hdd: '',
    maxSpeed: '',
    motherBoard: '',
    office: '',
    ram: '',
    smps: '',
    speed: '',
    type: '',
    // Other category fields can be added here
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file) => {
    handleChange('image', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const categoryOptions = [
    "Branded Desktops",
    "Assembled Desktops",
    "Monitors",
    "Laptops",
    "SSD",
    "Processor",
    "RAM",
    "Mother Board",
    "GPU",
    "SMPS",
    "Cabinet",
    "Printer",
    "Projector",
    "CPU",
    "Mouse",
    "Converter",
  ];

  const brandOptions = ["HP", "Dell", "Lenovo", "Asus", "Other"];
  const coreOptions = ["2 Core", "4 Core", "6 Core", "8 Core", "10 Core", "12 Core"];
  const ramOptions = ["2GB", "4GB", "8GB", "16GB", "32GB", "64GB"];
  const motherBoardOptions = ["ASUS", "Gigabyte", "MSI", "ASRock", "Biostar", "Other"];
  const smpsOptions = ["300W", "400W", "500W", "600W", "700W", "800W"];

  const renderSpecifications = () => {
    switch (formData.category) {
      case 'Assembled Desktops':
        return (
          <>
            <Field
              label="Cores"
              type="select"
              placeholder="Select Cores"
              options={coreOptions}
              value={formData.cores}
              onChange={(val) => handleChange('cores', val)}
            />
            <Field
              label="Display"
              type="text"
              placeholder="Enter Display Details"
              value={formData.display}
              onChange={(val) => handleChange('display', val)}
            />
            <Field
              label="HDD"
              type="text"
              placeholder="Enter HDD Details"
              value={formData.hdd}
              onChange={(val) => handleChange('hdd', val)}
            />
            <Field
              label="Max Speed"
              type="text"
              placeholder="Enter Max Speed"
              value={formData.maxSpeed}
              onChange={(val) => handleChange('maxSpeed', val)}
            />
            <Field
              label="Mother Board"
              type="select"
              placeholder="Select Mother Board"
              options={motherBoardOptions}
              value={formData.motherBoard}
              onChange={(val) => handleChange('motherBoard', val)}
            />
            <Field
              label="Office"
              type="text"
              placeholder="Enter Office Details"
              value={formData.office}
              onChange={(val) => handleChange('office', val)}
            />
            <Field
              label="RAM"
              type="select"
              placeholder="Select RAM"
              options={ramOptions}
              value={formData.ram}
              onChange={(val) => handleChange('ram', val)}
            />
            <Field
              label="SMPS"
              type="select"
              placeholder="Select SMPS"
              options={smpsOptions}
              value={formData.smps}
              onChange={(val) => handleChange('smps', val)}
            />
            <Field
              label="Speed"
              type="text"
              placeholder="Enter Speed"
              value={formData.speed}
              onChange={(val) => handleChange('speed', val)}
            />
            <Field
              label="Type"
              type="text"
              placeholder="Enter Type"
              value={formData.type}
              onChange={(val) => handleChange('type', val)}
            />
          </>
        );
      case 'Laptops':
        return (
          <>
            <Field
              label="Processor"
              type="text"
              placeholder="Enter Processor Details"
              value={formData.processor}
              onChange={(val) => handleChange('processor', val)}
            />
            <Field
              label="RAM"
              type="select"
              placeholder="Select RAM"
              options={ramOptions}
              value={formData.ram}
              onChange={(val) => handleChange('ram', val)}
            />
            <Field
              label="Storage"
              type="text"
              placeholder="Enter Storage Details"
              value={formData.storage}
              onChange={(val) => handleChange('storage', val)}
            />
            <Field
              label="Display"
              type="text"
              placeholder="Enter Display Details"
              value={formData.display}
              onChange={(val) => handleChange('display', val)}
            />
            <Field
              label="Graphics"
              type="text"
              placeholder="Enter Graphics Details"
              value={formData.graphics}
              onChange={(val) => handleChange('graphics', val)}
            />
          </>
        );
      // Add cases for other categories as needed
      default:
        return formData.category ? (
          <div style={noSpecsStyle}>
            <p>No specific specifications defined for this category.</p>
            <p>Add general specifications in the description field.</p>
          </div>
        ) : (
          <div style={selectCategoryPromptStyle}>
            <p>Select a product category to see specific specifications.</p>
          </div>
        );
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <span style={iconStyle}>📦</span>
          </div>
          <div>
            <h3 style={titleStyle}>Add Product Template</h3>
            <p style={subtitleStyle}>Fill in the details to create a new product template</p>
          </div>
        </div>
        
        <div style={gridStyle}>
          {/* Left Column - Basic Information */}
          <div style={{ ...columnStyle, ...sectionBoxStyle }}>
            <h4 style={sectionTitleStyle}>Basic Information</h4>
            <Field
              label="Product Category"
              type="select"
              placeholder="Select Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(val) => handleChange('category', val)}
              required
            />
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Product Image</label>
              <div style={imageUploadContainer}>
                {previewImage ? (
                  <div style={imagePreviewStyle}>
                    <img src={previewImage} alt="Preview" style={previewImageStyle} />
                    <button 
                      onClick={() => {
                        handleImageChange(null);
                        handleChange('image', null);
                      }} 
                      style={removeImageButtonStyle}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <ImageUpload
                    onChange={handleImageChange}
                  />
                )}
              </div>
              <small style={helperTextStyle}>
                Supported formats: JPG, PNG (max size: 2MB)
              </small>
            </div>
            
            <Field
              label="Product Name"
              type="text"
              placeholder="Enter Product Name"
              value={formData.productName}
              onChange={(val) => handleChange('productName', val)}
              required
            />
            <Field
              label="Brand"
              type="select"
              placeholder="Select Brand"
              options={brandOptions}
              value={formData.brand}
              onChange={(val) => handleChange('brand', val)}
            />
            <Field
              label="Model"
              type="text"
              placeholder="Enter Model"
              value={formData.model}
              onChange={(val) => handleChange('model', val)}
            />
            <Field
              label="Description"
              type="textarea"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(val) => handleChange('description', val)}
            />
          </div>

          {/* Middle Column - Specifications */}
          <div style={{ ...columnStyle, ...sectionBoxStyle }}>
            <h4 style={sectionTitleStyle}>Specifications</h4>
            {renderSpecifications()}
          </div>

          {/* Right Column - Tax & Control */}
          <div style={{ ...columnStyle, ...sectionBoxStyle }}>
            <h4 style={sectionTitleStyle}>Tax Information</h4>
            <Field
              label="GST Percentage"
              type="number"
              placeholder="Enter GST %"
              value={formData.gst}
              onChange={(val) => handleChange('gst', val)}
              suffix="%"
            />
            <Field
              label="HSN Code"
              type="text"
              placeholder="Enter HSN Code"
              value={formData.hsn}
              onChange={(val) => handleChange('hsn', val)}
            />
            
            <div style={dividerStyle}></div>
            
            <h4 style={sectionTitleStyle}>Control</h4>
            <div style={checkboxContainerStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={formData.activeStatus}
                  onChange={(e) => handleChange('activeStatus', e.target.checked)}
                />
                <div
                  style={{
                    ...customCheckboxStyle,
                    backgroundColor: formData.activeStatus ? '#2563eb' : '#ffffff',
                    boxShadow: formData.activeStatus ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
                  }}
                >
                  {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
                </div>
                <div>
                  <span style={checkboxTextStyle}>Active Status</span>
                  <p style={checkboxHelperText}>Toggle to activate/deactivate this product</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div style={buttonContainerStyle}>
          <button style={cancelBtnStyle}>Cancel</button>
          <button style={createBtnStyle}>Create Product</button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  options = [], 
  required = false,
  suffix = null
}) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={labelContainerStyle}>
      <label style={labelStyle}>{label}</label>
      {required && <span style={requiredIndicatorStyle}>*</span>}
    </div>
    {type === 'select' ? (
      <select 
        style={{ ...inputStyle, appearance: 'none' }} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <div style={inputWrapperStyle}>
        <input
          type={type}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: suffix ? '2.5rem' : '0.75rem' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span style={suffixStyle}>{suffix}</span>}
      </div>
    )}
  </div>
);

const ImageUpload = ({ onChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      style={{
        ...imageUploadAreaStyle,
        borderColor: isDragging ? '#2563eb' : '#d1d5db',
        backgroundColor: isDragging ? '#f0f7ff' : '#f9fafb',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
        style={hiddenFileInputStyle}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={fileUploadLabelStyle}>
        <div style={uploadIconStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={uploadTextStyle}>Click to upload or drag and drop</p>
          <p style={uploadSubtextStyle}>PNG or JPG (max. 2MB)</p>
        </div>
      </label>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: 'Inter, sans-serif',
  backgroundColor: '#f9fafb',
  minHeight: '100vh',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e5e7eb',
  maxWidth: '1350px',
  margin: '0 auto',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '2rem',
  paddingBottom: '1.5rem',
  borderBottom: '1px solid #e5e7eb',
};

const iconContainerStyle = {
  backgroundColor: '#eff6ff',
  borderRadius: '50%',
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '1rem',
};

const iconStyle = {
  fontSize: '1.5rem',
  color: '#2563eb',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
  marginBottom: '0.25rem',
};

const subtitleStyle = {
  fontSize: '0.875rem',
  color: '#6b7280',
  margin: 0,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const sectionBoxStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e5e7eb',
};

const sectionTitleStyle = {
  fontWeight: '600',
  fontSize: '1rem',
  marginBottom: '1.5rem',
  color: '#111827',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid #e5e7eb',
};

const labelContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

const labelStyle = {
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
};

const requiredIndicatorStyle = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const inputWrapperStyle = {
  position: 'relative',
};

const suffixStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#6b7280',
  fontSize: '0.875rem',
};

const helperTextStyle = {
  color: '#6b7280',
  fontSize: '0.75rem',
  marginTop: '0.25rem',
  display: 'block',
};

const imageUploadContainer = {
  marginBottom: '0.5rem',
};

const imageUploadAreaStyle = {
  border: '1px dashed rgb(10, 72, 163)',
  borderRadius: '6px',
  padding: '1.5rem',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const hiddenFileInputStyle = {
  display: 'none',
};

const fileUploadLabelStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const uploadIconStyle = {
  marginBottom: '0.5rem',
};

const uploadTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#111827',
  margin: '0.25rem 0',
};

const uploadSubtextStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  margin: 0,
};

const imagePreviewStyle = {
  position: 'relative',
  width: '100%',
  height: '160px',
  borderRadius: '6px',
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
};

const previewImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const removeImageButtonStyle = {
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1rem',
};

const checkboxContainerStyle = {
  marginTop: '0.5rem',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  cursor: 'pointer',
};

const checkboxStyle = {
  display: 'none',
};

const customCheckboxStyle = {
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  border: '2px solid #d1d5db',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: '2px',
  transition: 'all 0.2s',
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

const checkboxHelperText = {
  fontSize: '0.75rem',
  color: '#6b7280',
  margin: '0.25rem 0 0 0',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: '#e5e7eb',
  margin: '1.5rem 0',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
  paddingTop: '1.5rem',
  borderTop: '1px solid #e5e7eb',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ffffff',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'background-color 0.2s',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
};

const noSpecsStyle = {
  padding: '1rem',
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  border: '1px dashed #d1d5db',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '0.875rem',
};

const selectCategoryPromptStyle = {
  padding: '1rem',
  backgroundColor: '#f0f7ff',
  borderRadius: '6px',
  border: '1px dashed #2563eb',
  textAlign: 'center',
  color: '#2563eb',
  fontSize: '0.875rem',
};

export default ProductTemplateAdd;