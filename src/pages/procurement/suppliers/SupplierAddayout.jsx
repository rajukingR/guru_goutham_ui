import React, { useState, useEffect } from "react";
import API_URL from "../../../api/Api_url";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';

const SupplierAddLayout = () => {
  const navigate = useNavigate();
    
  const [formData, setFormData] = useState({
    supplier_code: "",
    registration_date: "",
    supplier_name: "",
    supplier_owner: "",
    gst_number: "",
    introduced_by: "",
    description: "",
    address: {
      address_line1: "",
      address_line2: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
      telephone1: "",
      telephone2: "",
      website: "",
      fax: "",
      email: "",
    },
    bank: {
      bank_name: "",
      bank_address: "",
      account_number: "",
      pan_number: "",
    },
    contacts: [
      {
        contact_name: "",
        designation: "",
        contact_landline: "",
        landline_extension: "",
        contact_email: "",
        contact_number: "",
      },
    ],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the field is in the main formData object
    if (formData.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } 
    // Check if the field is in the address object
    else if (formData.address.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    }
    // Check if the field is in the bank object
    else if (formData.bank.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        bank: {
          ...formData.bank,
          [name]: value,
        },
      });
    }
  };

  // Handle contact input changes
  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...formData.contacts];
    updatedContacts[index][name] = value;
    
    setFormData({
      ...formData,
      contacts: updatedContacts,
    });
  };

  // Add new contact field
  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [
        ...formData.contacts,
        {
          contact_name: "",
          designation: "",
          contact_landline: "",
          landline_extension: "",
          contact_email: "",
          contact_number: "",
        },
      ],
    });
  };

  // Remove contact field
  const removeContact = (index) => {
    if (formData.contacts.length > 1) {
      const updatedContacts = [...formData.contacts];
      updatedContacts.splice(index, 1);
      
      setFormData({
        ...formData,
        contacts: updatedContacts,
      });
    }
  };

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationData = async () => {
      if (formData.address.pincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${formData.address.pincode}`
          );
          const data = await response.json();

          if (data && data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];

            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                country: "India",
                state: postOffice.State,
                city: postOffice.District,
              },
            }));
          } else {
            setSnackbar({
              open: true,
              message: "Invalid Pincode. Please enter a valid one.",
              severity: "error",
            });
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setSnackbar({
            open: true,
            message: "Error fetching location. Try again.",
            severity: "error",
          });
        }
      }
    };

    fetchLocationData();
  }, [formData.address.pincode]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/supplier/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Supplier created successfully!",
          severity: "success",
        });

        setTimeout(() => {
        navigate('/dashboard/procurement/supplier');
      }, 1500);
        // Reset form or redirect as needed
      } else {
        throw new Error(data.message || "Failed to create supplier");
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error creating supplier",
        severity: "error",
      });
    }
  };

  return (
    <div style={containerStyle}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <h2 style={headingStyle}>Create Suppliers</h2>

      <form onSubmit={handleSubmit}>
        {/* Supplier Information */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Supplier Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Supplier ID" 
              name="supplier_code"
              placeholder="Enter Supplier ID" 
              value={formData.supplier_code}
              onChange={handleChange}
            />
            <Field 
              type="date" 
              name="registration_date"
              placeholder="dd-mm-yyyy" 
              label="Date" 
              value={formData.registration_date}
              onChange={handleChange}
            />
            <Field 
              label="Supplier Name" 
              name="supplier_name"
              placeholder="Enter Supplier Name" 
              value={formData.supplier_name}
              onChange={handleChange}
            />
            <Field 
              label="Supplier Owner" 
              name="supplier_owner"
              placeholder="Enter Supplier Owner" 
              value={formData.supplier_owner}
              onChange={handleChange}
            />
            <Field 
              label="GST Number" 
              name="gst_number"
              placeholder="Enter GST Number" 
              value={formData.gst_number}
              onChange={handleChange}
            />
            <Field 
              label="Introduced By" 
              name="introduced_by"
              placeholder="Enter Introduced By" 
              value={formData.introduced_by}
              onChange={handleChange}
            />
            <Field 
              label="Description" 
              name="description"
              placeholder="Enter Description" 
              type="textarea" 
              value={formData.description}
              onChange={handleChange}
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
            <Field 
              label="Address Line 1" 
              name="address_line1"
              placeholder="Enter Address Line 1" 
              value={formData.address.address_line1}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Address Line 2" 
              name="address_line2"
              placeholder="Enter Address Line 2" 
              value={formData.address.address_line2}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Pincode" 
              name="pincode"
              placeholder="Enter Pincode" 
              value={formData.address.pincode}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Country" 
              name="country"
              placeholder="Country" 
              value={formData.address.country}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
              disabled
            />
            <Field 
              label="State" 
              name="state"
              placeholder="State" 
              value={formData.address.state}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
              disabled
            />
            <Field 
              label="City" 
              name="city"
              placeholder="City" 
              value={formData.address.city}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
              disabled
            />
            <Field 
              label="Telephone 1" 
              name="telephone1"
              placeholder="Enter Telephone 1" 
              value={formData.address.telephone1}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Telephone 2" 
              name="telephone2"
              placeholder="Enter Telephone 2" 
              value={formData.address.telephone2}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Website" 
              name="website"
              placeholder="Enter Website" 
              value={formData.address.website}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Fax" 
              name="fax"
              placeholder="Enter Fax" 
              value={formData.address.fax}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Email id" 
              name="email"
              placeholder="Enter Email" 
              value={formData.address.email}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
          </div>
        </div>

        {/* Bank Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏦</div>
            <h3 style={cardHeaderStyle}>Bank Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field 
              label="Bank Name" 
              name="bank_name"
              placeholder="Enter Bank Name" 
              value={formData.bank.bank_name}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Bank Address" 
              name="bank_address"
              placeholder="Enter Bank Address" 
              value={formData.bank.bank_address}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="Account Number" 
              name="account_number"
              placeholder="Enter Account Number" 
              value={formData.bank.account_number}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
            <Field 
              label="PAN Number" 
              name="pan_number"
              placeholder="Enter PAN Number" 
              value={formData.bank.pan_number}
              onChange={(e) => handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value
                }
              })}
            />
          </div>
        </div>

        {/* Supplier Contact Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Supplier Contact Details</h3>
          </div>
          {formData.contacts.map((contact, index) => (
            <div key={index} style={{ ...fieldsGridStyle, marginBottom: "1rem" }}>
              <Field 
                label="Contact Name" 
                name="contact_name"
                placeholder="Enter Contact Name" 
                value={contact.contact_name}
                onChange={(e) => handleContactChange(index, e)}
              />
              <Field 
                label="Designation" 
                name="designation"
                placeholder="Enter Designation" 
                value={contact.designation}
                onChange={(e) => handleContactChange(index, e)}
              />
              <Field 
                label="Contact Landline" 
                name="contact_landline"
                placeholder="Enter Landline" 
                value={contact.contact_landline}
                onChange={(e) => handleContactChange(index, e)}
              />
              <Field 
                label="Landline Extension" 
                name="landline_extension"
                placeholder="Enter Extension" 
                value={contact.landline_extension}
                onChange={(e) => handleContactChange(index, e)}
              />
              <Field 
                label="Contact Email" 
                name="contact_email"
                placeholder="Enter Contact Email" 
                value={contact.contact_email}
                onChange={(e) => handleContactChange(index, e)}
              />
              <Field 
                label="Contact Number" 
                name="contact_number"
                placeholder="Enter Contact Number" 
                value={contact.contact_number}
                onChange={(e) => handleContactChange(index, e)}
              />
              <div style={{ display: "flex", gap: "0.5rem", gridColumn: "1 / -1" }}>
                {index > 0 && (
                  <button 
                    type="button" 
                    style={removeBtnStyle}
                    onClick={() => removeContact(index)}
                  >
                    Remove Contact
                  </button>
                )}
                {index === formData.contacts.length - 1 && (
                  <button 
                    type="button" 
                    style={addBtnStyle}
                    onClick={addContact}
                  >
                    Add Another Contact
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button type="button" style={cancelBtnStyle}>
            Cancel
          </button>
          <button type="submit" style={createBtnStyle}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, name, placeholder, type = 'text', value, onChange, disabled = false, style }) => (
  <div style={{...fieldContainerStyle, ...style}}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        name={name}
        placeholder={placeholder}
        style={{...inputStyle, height: '80px'}}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )}
  </div>
);

// Styles (same as before)
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

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

const addBtnStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: '500',
};

const removeBtnStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: '500',
};

export default SupplierAddLayout;