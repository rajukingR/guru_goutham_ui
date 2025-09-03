import React, { useState, useEffect } from "react";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const supplier_code = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SUP-${randomPart}`;
};

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

  const [errors, setErrors] = useState({
    supplier_name: "",
    registration_date: "",
    supplier_owner: "",
    gst_number: "",
    address: {
      address_line1: "",
      pincode: "",
      telephone1: "",
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
        contact_number: "",
        contact_email: "",
      },
    ],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      supplier_code: supplier_code(),
    }));
  }, []);

  // Validation functions
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "supplier_name":
        if (!value.trim()) error = "Supplier name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;

      case "gst_number":
        if (!value.trim()) error = "GST number is required";
        else if (
          value &&
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            value
          )
        ) {
          error = "Invalid GST number format";
        }
        break;
      case "address_line1":
        if (!value.trim()) error = "Address line is required";
        break;
      case "pincode":
        if (!value) error = "Pincode is required";
        else if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      case "telephone1":
        if (!value) error = "Telephone is required";
        else if (!/^[0-9]{10,12}$/.test(value))
          error = "Invalid telephone number";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "bank_name":
        if (!value.trim()) error = "Bank name is required";
        break;
        case "bank_address":
        if (!value.trim()) error = "Bank address is required";
        break;
      case "account_number":
        if (!value.trim()) error = "Account number is required";
        else if (!/^\d{9,18}$/.test(value))
          error = "Account number must be 9-18 digits";
        break;
      case "pan_number":
        if (!value.trim()) error = "PAN number is required";
        else if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          error = "Invalid PAN format (e.g., ABCDE1234F)";
        }
        break;
      case "contact_name":
        if (!value.trim()) error = "Contact name is required";
        break;
      case "contact_number":
        if (!value) error = "Contact number is required";
        else if (!/^[0-9]{10}$/.test(value))
          error = "Invalid mobile number (10 digits)";
        break;
      case "contact_email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate the field
    let error = validateField(name, value);

    // Update errors state
    if (formData.hasOwnProperty(name)) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else if (formData.address.hasOwnProperty(name)) {
      setErrors((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: error,
        },
      }));
    } else if (formData.bank.hasOwnProperty(name)) {
      setErrors((prev) => ({
        ...prev,
        bank: {
          ...prev.bank,
          [name]: error,
        },
      }));
    }

    // Update form data
    if (formData.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (formData.address.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else if (formData.bank.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        bank: {
          ...formData.bank,
          [name]: value,
        },
      });
    }
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...formData.contacts];
    updatedContacts[index][name] = value;

    // Validate contact field
    let error = validateField(name, value);

    setErrors((prev) => {
      const updatedContactErrors = [...prev.contacts];
      updatedContactErrors[index] = {
        ...updatedContactErrors[index],
        [name]: error,
      };
      return {
        ...prev,
        contacts: updatedContactErrors,
      };
    });

    setFormData({
      ...formData,
      contacts: updatedContacts,
    });
  };

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

    setErrors((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          contact_name: "",
          contact_number: "",
          contact_email: "",
        },
      ],
    }));
  };

  const removeContact = (index) => {
    if (formData.contacts.length > 1) {
      const updatedContacts = [...formData.contacts];
      updatedContacts.splice(index, 1);

      const updatedErrors = [...errors.contacts];
      updatedErrors.splice(index, 1);

      setFormData({
        ...formData,
        contacts: updatedContacts,
      });

      setErrors((prev) => ({
        ...prev,
        contacts: updatedErrors,
      }));
    }
  };

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

            setFormData((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                country: "India",
                state: postOffice.State,
                city: postOffice.District,
              },
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                pincode: "Invalid Pincode",
              },
            }));
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
    };

    fetchLocationData();
  }, [formData.address.pincode]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = JSON.parse(JSON.stringify(errors)); // Deep clone

    // Validate main fields
    const mainFields = ["supplier_name", "registration_date", "supplier_owner", "gst_number"];
    mainFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    // Validate GST if provided
    if (formData.gst_number) {
      const gstError = validateField("gst_number", formData.gst_number);
      newErrors.gst_number = gstError;
      if (gstError) isValid = false;
    }

    // Validate address fields
    const addressFields = ["address_line1", "pincode", "telephone1", "email"];
    addressFields.forEach((field) => {
      const error = validateField(field, formData.address[field]);
      newErrors.address[field] = error;
      if (error) isValid = false;
    });

    // Validate bank fields
    const bankFields = ["bank_name","bank_address", "account_number", "pan_number"];
    bankFields.forEach((field) => {
      const error = validateField(field, formData.bank[field]);
      newErrors.bank[field] = error;
      if (error) isValid = false;
    });

    // Validate PAN if provided
    if (formData.bank.pan_number) {
      const panError = validateField("pan_number", formData.bank.pan_number);
      newErrors.bank.pan_number = panError;
      if (panError) isValid = false;
    }

    // Validate contacts
    formData.contacts.forEach((contact, index) => {
      const contactFields = ["contact_name", "contact_number"];
      contactFields.forEach((field) => {
        const error = validateField(field, contact[field]);
        newErrors.contacts[index][field] = error;
        if (error) isValid = false;
      });

      if (contact.contact_email) {
        const emailError = validateField(
          "contact_email",
          contact.contact_email
        );
        newErrors.contacts[index].contact_email = emailError;
        if (emailError) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix all validation errors before submitting",
        severity: "error",
      });
      return;
    }

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
          navigate("/dashboard/procurement/supplier");
        }, 1500);
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

  // Helper function to check if a field has error
  const hasError = (fieldPath) => {
    const parts = fieldPath.split(".");
    let value = errors;

    for (const part of parts) {
      if (value[part] === undefined) return false;
      value = value[part];
    }

    return !!value;
  };

  // Helper function to get error message
  const getError = (fieldPath) => {
    const parts = fieldPath.split(".");
    let value = errors;

    for (const part of parts) {
      if (value[part] === undefined) return "";
      value = value[part];
    }

    return value;
  };

  return (
    <div style={containerStyle}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
            {/* <Field
              label="Supplier ID"
              name="supplier_code"
              placeholder="Enter Supplier ID"
              value={formData.supplier_code}
              onChange={handleChange}
              disabled
            /> */}

            <Field
              label="Supplier Name"
              name="supplier_name"
              placeholder="Enter Supplier Name"
              value={formData.supplier_name}
              onChange={handleChange}
              error={hasError("supplier_name")}
              helperText={getError("supplier_name")}
              required
            />
            <Field
              label="Supplier Owner"
              name="supplier_owner"
              placeholder="Enter Supplier Owner"
              value={formData.supplier_owner}
              onChange={handleChange}
              error={hasError("supplier_owner")}
              helperText={getError("supplier_owner")}
            />
            <Field
              label="GST Number"
              name="gst_number"
              placeholder="Enter GST Number (22AAAAA0000A1Z5)"
              value={formData.gst_number}
              onChange={handleChange}
              error={hasError("gst_number")}
              helperText={getError("gst_number")}
              required
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
              style={{ gridColumn: "1 / -1" }}
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
              placeholder="Enter Address Line"
              value={formData.address.address_line1}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("address.address_line1")}
              helperText={getError("address.address_line1")}
              required
            />

            <Field
              label="Pincode"
              name="pincode"
              placeholder="Enter Pincode"
              value={formData.address.pincode}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("address.pincode")}
              helperText={getError("address.pincode")}
              required
            />
            <Field
              label="Country"
              name="country"
              placeholder="Country"
              value={formData.address.country}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              disabled
            />
            <Field
              label="State"
              name="state"
              placeholder="State"
              value={formData.address.state}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              disabled
            />
            <Field
              label="City"
              name="city"
              placeholder="City"
              value={formData.address.city}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              disabled
            />
            <Field
              label="Mobile Number"
              name="telephone1"
              placeholder="Enter Mobile Number"
              value={formData.address.telephone1}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("address.telephone1")}
              helperText={getError("address.telephone1")}
              required
            />

            <Field
              label="Website"
              name="website"
              placeholder="Enter Website (https://example.com)"
              value={formData.address.website}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
            />
            <Field
              label="Fax"
              name="fax"
              placeholder="Enter Fax"
              value={formData.address.fax}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
            />
            <Field
              label="Email id"
              name="email"
              placeholder="Enter Email"
              value={formData.address.email}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("address.email")}
              helperText={getError("address.email")}
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
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("bank.bank_name")}
              helperText={getError("bank.bank_name")}
              required
            />
            <Field
              label="Bank Address"
              name="bank_address"
              placeholder="Enter Bank Address"
              value={formData.bank.bank_address}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("bank.bank_address")}
              helperText={getError("bank.bank_address")}
              required
            />
            <Field
              label="Account Number"
              name="account_number"
              placeholder="Enter Account Number"
              value={formData.bank.account_number}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("bank.account_number")}
              helperText={getError("bank.account_number")}
              required
            />
            <Field
              label="PAN Number"
              name="pan_number"
              placeholder="Enter PAN Number (ABCDE1234F)"
              value={formData.bank.pan_number}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              error={hasError("bank.pan_number")}
              helperText={getError("bank.pan_number")}
              required
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
            <div
              key={index}
              style={{ ...fieldsGridStyle, marginBottom: "1rem" }}
            >
              <Field
                label="Contact Name"
                name="contact_name"
                placeholder="Enter Contact Name"
                value={contact.contact_name}
                onChange={(e) => handleContactChange(index, e)}
                error={hasError(`contacts.${index}.contact_name`)}
                helperText={getError(`contacts.${index}.contact_name`)}
                required
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
                error={hasError(`contacts.${index}.contact_email`)}
                helperText={getError(`contacts.${index}.contact_email`)}
              />
              <Field
                label="Contact Number"
                name="contact_number"
                placeholder="Enter Contact Number"
                value={contact.contact_number}
                onChange={(e) => handleContactChange(index, e)}
                error={hasError(`contacts.${index}.contact_number`)}
                helperText={getError(`contacts.${index}.contact_number`)}
                required
              />
              <div
                style={{ display: "flex", gap: "0.5rem", gridColumn: "1 / -1" }}
              >
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
          <button
            type="button"
            style={cancelBtnStyle}
            onClick={() => navigate("/dashboard/procurement/supplier")}
          >
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

const Field = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
  style,
  error = false,
  helperText = "",
  required = false,
}) => (
  <div style={{ ...fieldContainerStyle, ...style }}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={{
            ...inputStyle,
            ...(error ? errorInputStyle : {}),
          }}
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
    ) : type === "textarea" ? (
      <textarea
        name={name}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          height: "80px",
          ...(error ? errorInputStyle : {}),
        }}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          ...(error ? errorInputStyle : {}),
        }}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )}
    {helperText && <div style={errorTextStyle}>{helperText}</div>}
  </div>
);

// Styles
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
  maxWidth: "1400px",
};

const headingStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "1.5rem",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
  marginBottom: "1.5rem",
};

const cardHeaderContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #e2e8f0",
};

const iconStyle = {
  fontSize: "1.25rem",
  marginRight: "0.75rem",
  backgroundColor: "#f1f5f9",
  padding: "0.5rem",
  borderRadius: "8px",
};

const cardHeaderStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  color: "#1e293b",
  margin: 0,
};

const fieldsGridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
};

const fieldContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "500",
  fontSize: "0.875rem",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
};

const errorInputStyle = {
  borderColor: "#ef4444",
  backgroundColor: "#fef2f2",
};

const errorTextStyle = {
  color: "#ef4444",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
};

const selectWrapperStyle = {
  position: "relative",
  width: "100%",
};

const selectStyle = {
  width: "100%",
  padding: "0.75rem",
  paddingRight: "2.5rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  appearance: "none",
};

const selectArrowStyle = {
  position: "absolute",
  right: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  fontSize: "0.75rem",
  color: "#6b7280",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "1rem",
};

const cancelBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
};

const createBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
};

const addBtnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "500",
};

const removeBtnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "500",
};

export default SupplierAddLayout;
