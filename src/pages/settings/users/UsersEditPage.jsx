import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const UsersEditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    loginId: '',
    password: '',
    roleId: '',
    branch: '',
    emailId: '',
    phoneNumber: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    landmark: '',
    street: '',
    activeStatus: true,
    userAccess: false
  });
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles and branches
        const [rolesRes, branchesRes] = await Promise.all([
          fetch('http://localhost:5000/api/roles'),
          fetch('http://localhost:5000/api/branches')
        ]);

        if (rolesRes.ok && branchesRes.ok) {
          const [rolesData, branchesData] = await Promise.all([
            rolesRes.json(),
            branchesRes.json()
          ]);
          setRoles(rolesData);
          setBranches(branchesData);
        } else {
          console.error('Failed to fetch initial data');
        }

        // Fetch user data
        const userRes = await fetch(`http://localhost:5000/api/users/${id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          
          // Map API response to form data structure
          setFormData({
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            loginId: userData.login_id || '',
            password: '', // Don't pre-fill password for security
            roleId: userData.role_id || '',
            branch: userData.branch || '',
            emailId: userData.email || '',
            phoneNumber: userData.phone_number || '',
            pincode: userData.pincode || '',
            country: userData.country || '',
            state: userData.state || '',
            city: userData.city || '',
            landmark: userData.landmark || '',
            street: userData.street || '',
            activeStatus: userData.is_active !== undefined ? userData.is_active : true,
            userAccess: false // You might need to get this from API if it exists
          });
        } else {
          console.error('Failed to fetch user data');
          showSnackbar('Failed to load user data', 'error');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        showSnackbar('Error loading data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If pincode field is changed and has 6 digits, fetch address details
    if (field === 'pincode' && value.length === 6) {
      fetchAddressFromPincode(value);
    }
  };

  const fetchAddressFromPincode = async (pincode) => {
    setIsFetchingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          country: 'India', // Assuming all pincodes are from India
          state: postOffice.State,
          city: postOffice.District,
          street: postOffice.Name
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const handleToggleChange = (field) =>
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));

  const showSnackbar = (message, type) => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.emailId,
        password: formData.password || undefined, // Only send password if it was changed
        role_id: parseInt(formData.roleId),
        role_name: '',
        login_id: formData.loginId,
        branch: formData.branch,
        phone_number: formData.phoneNumber,
        pincode: formData.pincode,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        landmark: formData.landmark,
        street: formData.street,
        is_active: formData.activeStatus
      };

      const roleObj = roles.find(r => r.id === payload.role_id);
      payload.role_name = roleObj ? roleObj.role_name : '';

      // Remove password from payload if it wasn't changed (empty)
      if (!formData.password) {
        delete payload.password;
      }

      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await response.json();
        showSnackbar('User updated successfully', 'success');
        setTimeout(() => navigate('/dashboard/settings/users'), 2000);
      } else {
        const err = await response.json();
        showSnackbar(err.message || 'Failed to update user', 'error');
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Error updating user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading user data...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={breadcrumbStyle}>Masters / Users / Edit User</div>
      <form style={formContainerStyle} onSubmit={handleSubmit}>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Personal Details:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="First Name" placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(v) => handleInputChange('firstName', v)}
              required
            />
            <Field label="Last Name" placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(v) => handleInputChange('lastName', v)}
              required
            />
            <Field label="Login ID" placeholder="Enter Login ID"
              value={formData.loginId}
              onChange={(v) => handleInputChange('loginId', v)}
              required
            />
            <Field label="Password" type="password" placeholder="Enter new password (leave blank to keep current)"
              value={formData.password}
              onChange={(v) => handleInputChange('password', v)}
            />

            <Field label="Role Name" type="select" placeholder="Select User Role"
              value={formData.roleId}
              onChange={(v) => handleInputChange('roleId', v)}
              required
              options={roles.map(r => ({ value: r.id, label: r.role_name }))}
            />

            <Field label="Branch" type="select" placeholder="Select Branch"
              value={formData.branch}
              onChange={(v) => handleInputChange('branch', v)}
              required
              options={branches.map(b => ({ value: b.id, label: b.branch_name }))}
            />
            <Field label="Email ID" type="email" placeholder="Enter Email ID"
              value={formData.emailId}
              onChange={(v) => handleInputChange('emailId', v)}
              required
            />
            <Field label="Phone Number" type="tel" placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={(v) => handleInputChange('phoneNumber', v)}
              required
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>Address:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Pincode" placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(v) => handleInputChange('pincode', v)}
              required
              loading={isFetchingPincode}
              maxLength={6}
            />
            <Field label="Country" type="select" placeholder="Select Country"
              value={formData.country}
              onChange={(v) => handleInputChange('country', v)}
              required
              options={[
                { value: 'India', label: 'India' },
                { value: 'USA', label: 'USA' },
                { value: 'UK', label: 'UK' },
                { value: 'Canada', label: 'Canada' }
              ]}
            />
            <Field label="State" placeholder="Enter State"
              value={formData.state}
              onChange={(v) => handleInputChange('state', v)}
              required
            />
            <Field label="City" placeholder="Enter City"
              value={formData.city}
              onChange={(v) => handleInputChange('city', v)}
              required
            />
            <Field label="Landmark" placeholder="Enter Landmark"
              value={formData.landmark}
              onChange={(v) => handleInputChange('landmark', v)}
            />
            <Field label="Street" placeholder="Enter Address"
              value={formData.street}
              onChange={(v) => handleInputChange('street', v)}
              required
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control:</h3>
          </div>
          <div style={controlSectionStyle}>
            <div style={toggleFieldStyle}>
              <label style={labelStyle}>Active Status<span style={requiredStyle}>*</span></label>
              <div style={toggleContainerStyle}>
                <div onClick={() => handleToggleChange('activeStatus')}
                  style={{
                    ...toggleStyle,
                    backgroundColor: formData.activeStatus ? '#10b981' : '#d1d5db'
                  }}>
                  <div style={{
                    ...toggleCircleStyle,
                    transform: formData.activeStatus ? 'translateX(24px)' : 'translateX(2px)'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={userAccessCardStyle}>
          <div style={userAccessHeaderStyle}>
            <div style={userAccessLabelStyle}>
              <span style={userAccessTextStyle}>User Access</span>
              <ChevronDown style={chevronStyle} />
            </div>
            <div style={toggleContainerStyle}>
              <div onClick={() => handleToggleChange('userAccess')}
                style={{
                  ...toggleStyle,
                  backgroundColor: formData.userAccess ? '#2563eb' : '#d1d5db'
                }}>
                <div style={{
                  ...toggleCircleStyle,
                  transform: formData.userAccess ? 'translateX(24px)' : 'translateX(2px)'
                }} />
              </div>
            </div>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button type="button" style={cancelBtnStyle}
            onClick={() => navigate('/dashboard/settings/users')}>
            Cancel
          </button>
          <button type="submit" style={createBtnStyle} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>

      {snackbar.open && (
        <div style={{
          ...snackbarStyle,
          backgroundColor: snackbar.type === 'success' ? '#10b981' : '#ef4444'
        }}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

// Field component and styles remain the same as in UsersAddPage
const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, options = [], loading = false, maxLength }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}{required && <span style={requiredStyle}>*</span>}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select style={selectStyle} value={value} onChange={(e) => onChange(e.target.value)} required={required}>
          <option value="">{placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : (
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={maxLength}
        />
        {loading && (
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        )}
      </div>
    )}
  </div>
);

// All styles remain the same as in UsersAddPage
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
  position: 'relative',
};

const breadcrumbStyle = {
  marginBottom: '1.5rem',
  fontSize: '0.875rem',
  color: '#6b7280',
  fontWeight: '400',
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  marginBottom: '1.5rem',
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

const controlSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const toggleFieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const toggleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const toggleStyle = {
  width: '48px',
  height: '24px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  position: 'relative',
  outline: 'none',
};

const toggleCircleStyle = {
  width: '20px',
  height: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.2s ease',
  position: 'absolute',
  top: '2px',
};

const userAccessCardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  maxWidth: '1400px',
  margin: '0 auto 1.5rem',
  borderTop: '1px solid #e2e8f0',
};

const userAccessHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const userAccessLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const userAccessTextStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
};

const chevronStyle = {
  width: '16px',
  height: '16px',
  color: '#6b7280',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  maxWidth: '1400px',
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

const snackbarStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '12px 24px',
  borderRadius: '8px',
  color: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  animation: 'fadeIn 0.3s ease-in-out',
};

export default UsersEditPage;