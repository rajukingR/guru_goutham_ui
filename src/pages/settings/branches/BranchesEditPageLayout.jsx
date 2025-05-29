import React, { useState, useEffect } from 'react';

const BranchesEditPageLayout = () => {
  const [branchId, setBranchId] = useState('');
  const [branchName, setBranchName] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Simulating fetch of existing branch data
    const dummyData = {
      branchId: 'BR123',
      branchName: 'Main Branch',
      addressDetails: {
        pincode: '400001',
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        address: '123 Marine Drive',
      },
      isActive: false,
    };

    setBranchId(dummyData.branchId);
    setBranchName(dummyData.branchName);
    setPincode(dummyData.addressDetails.pincode);
    setCountry(dummyData.addressDetails.country);
    setState(dummyData.addressDetails.state);
    setCity(dummyData.addressDetails.city);
    setAddress(dummyData.addressDetails.address);
    setIsActive(dummyData.isActive);
  }, []);

  const handleCancel = () => {
    // You can navigate away or reset form
    console.log('Edit canceled');
  };

  const handleUpdate = () => {
    const updatedData = {
      branchId,
      branchName,
      addressDetails: {
        pincode,
        country,
        state,
        city,
        address,
      },
      isActive,
    };
    console.log('Branch Updated:', updatedData);
    // Add API update logic here
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Edit Branch</h2>

      <div style={formGridStyle}>
        {/* Branch Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Branch Details</h3>
          </div>
          <label style={labelStyle}>Branch ID</label>
          <input
            type="text"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            style={inputStyle}
          />
          <label style={labelStyle}>Branch Name</label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Address */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>Address</h3>
          </div>
          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
              </select>
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="California">California</option>
              </select>
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
            </div>
          </div>

          <label style={labelStyle}>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Control */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control</h3>
          </div>
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
      </div>

      <div style={buttonContainerStyle}>
        <button onClick={handleCancel} style={cancelBtnStyle}>Cancel</button>
        <button onClick={handleUpdate} style={createBtnStyle}>Update</button>
      </div>
    </div>
  );
};

export default BranchesEditPageLayout;

// Reuse the same inline styles
const containerStyle = {
  padding: '2rem',
  fontFamily: 'Inter, sans-serif',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '1.5rem',
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem',
  backgroundColor: '#e5e7eb',
  padding: '2rem',
  borderRadius: '0.5rem',
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '0.5rem',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
};

const iconStyle = {
  fontSize: '1.25rem',
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
};

const inputStyle = {
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  width: '100%',
};

const rowStyle = {
  display: 'flex',
  gap: '1rem',
};

const colStyle = {
  flex: 1,
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
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 2rem',
  backgroundColor: '#f9fafb',
  border: '1px solid #d1d5db',
  color: '#374151',
  borderRadius: '8px',
  cursor: 'pointer',
};

const createBtnStyle = {
  padding: '0.75rem 2rem',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};
