import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL, POSTAL_API } from "../../../api/Api_url";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

const validateGST = (gst) => {
  if (!gst) return true; // Optional field
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gst.toUpperCase());
};

const validatePAN = (pan) => {
  if (!pan) return true; // Optional field
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan.toUpperCase());
};

const validatePincode = (pincode) => {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode);
};

const ContactsEditLayoutPage = () => {
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const LoginUserName = user.full_name;
  const [postOffices, setPostOffices] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    customer_id: "",
    date: new Date(),
    industry: "",
    payment_type: "Prepaid",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    gst: "",
    pan_no: "",
    owner: "",
    remarks: "",
    contact_generated_by: "",
    is_active: false,
    status: "Inactive",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    industry: "",
    "address.street": "",
    "address.pincode": "",
    gst: "",
    pan_no: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/contacts/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setFormData(data);
        } else {
          throw new Error(data.message || "Failed to fetch contact");
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        setSnackbar({
          open: true,
          message: error.message || "Error loading contact",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id]);

  const handleStatusChange = (e) => {
    handleInputChange("status", e.target.checked ? "Active" : "Inactive");
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "first_name":
        if (!value.trim()) error = "First name is required";
        else if (value.length > 50) error = "First name too long";
        break;
      case "last_name":
        if (!value.trim()) error = "Last name is required";
        else if (value.length > 50) error = "Last name too long";
        break;
      case "email":
        if (value && !validateEmail(value)) error = "Invalid email format";
        break;
      case "phone_number":
        if (!value) error = "Phone number is required";
        else if (!validatePhone(value))
          error = "Invalid phone number (10 digits required)";
        break;
      case "company_name":
        if (!value.trim()) error = "Company name is required";
        break;
      case "industry":
        if (!value.trim()) error = "Industry is required";
        break;
      case "address.street":
      case "address.city":
      case "address.state":
      case "address.country":
      case "owner":
      case "remarks":
        // No validation needed for these fields
        break;
      case "address.pincode":
        if (!value) error = "Pincode is required";
        else if (!validatePincode(value))
          error = "Invalid pincode (6 digits required)";
        break;
      case "gst":
        if (!validateGST(value)) error = "Invalid GST format";
        break;
      case "pan_no":
        if (!value) error = "PAN number is required";
        else if (!validatePAN(value)) error = "Invalid PAN format";
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        Object.keys(formData.address).forEach((addrKey) => {
          const fullKey = `address.${addrKey}`;
          const error = validateField(fullKey, formData.address[addrKey]);
          if (error) {
            newErrors[fullKey] = error;
            isValid = false;
          }
        });
      } else {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationData = async () => {
      const pincode = formData.address.pincode;

      if (pincode.length === 6 && validatePincode(pincode)) {
        try {
          const response = await fetch(`${API_URL}/pincode/${pincode}`);
          const result = await response.json();

          if (Array.isArray(result) && result.length > 0 && result[0]?.PostOffice) {
            const postOffices = result[0].PostOffice;
            setPostOffices(postOffices);

            // Only set default street if current street is empty or not in postOffices
            setFormData((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                country: postOffices[0].Country || "India",
                state: postOffices[0].State,
                city: postOffices[0].District,
                street: postOffices.find(po => po.Name === prev.address.street)?.Name || postOffices[0].Name,
              },
            }));
          } else {
            setPostOffices([]);
          }
        } catch (error) {
          console.error(error);
          setPostOffices([]);
        }
      }
    };

    fetchLocationData();
  }, [formData.address.pincode]);




  const handleInputChange = (field, value) => {
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Handle nested address fields
    if (field.includes("address.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Contact updated successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/dashboard/crm/client-list");
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error updating contact",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading contact data...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div style={headerContainerStyle}>
        <h1 style={titleStyle}>Edit Contact</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Personal Details Card */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>👤</div>
              <h3 style={cardHeaderStyle}>Personal Details</h3>
            </div>

            <div style={fieldsGridStyle}>
              <Field
                label="Customer ID"
                name="customer_id"
                placeholder="Enter Customer ID"
                value={formData.customer_id}
                onChange={handleInputChange}
                disabled
              />
              <Field
                label="First Name"
                name="first_name"
                placeholder="Enter First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                errors={errors}
                required
              />

              <Field
                label="Last Name"
                name="last_name"
                placeholder="Enter Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                errors={errors}
                required
              />
              <Field
                label="Email ID"
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Field
                label="Phone Number"
                type="tel"
                name="phone_number"
                placeholder="Enter Phone Number"
                value={formData.phone_number}
                onChange={handleInputChange}
                errors={errors}
                required
              />
              <Field
                label="Company Name"
                name="company_name"
                placeholder="Enter Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                errors={errors}
                required
              />

              <Field
                label="Industry"
                name="industry"
                placeholder="Enter Industry"
                value={formData.industry}
                onChange={handleInputChange}
                errors={errors}
                required
              />
            </div>
          </div>

          {/* Address Card */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏠</div>
              <h3 style={cardHeaderStyle}>Personal Address</h3>
            </div>

            <div style={fieldsGridStyle}>


              <Field
                label="Pincode"
                name="address.pincode"
                placeholder="Enter Pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                errors={errors}
                required
              />
              <Field
                label="Street"
                name="address.street"
                value={formData.address.street || ""} // make sure it has a default
                onChange={handleInputChange}
                type="select" // dropdown
                options={[
                  { value: "", label: "Select a street" },
                  ...postOffices.map((po) => ({
                    value: po.Name,
                    label: po.Name
                  }))
                ]}
                disabled={postOffices.length === 0}
              />


              <Field
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                disabled
              />

              <Field
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                disabled
              />

              <Field
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                disabled
              />
            </div>
          </div>

          {/* Bank Details Card */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏦</div>
              <h3 style={cardHeaderStyle}>Other Details</h3>
            </div>

            <div style={fieldsGridStyle}>
              <Field
                label="GST"
                name="gst"
                placeholder="Enter GST (22AAAAA0000A1Z5)"
                value={formData.gst}
                onChange={handleInputChange}
                errors={errors}
              />

              <Field
                label="PAN No"
                name="pan_no"
                placeholder="Enter PAN No (AAAAA0000A)"
                value={formData.pan_no}
                onChange={handleInputChange}
                required
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={formContainerStyle}>
          {/* Other Information */}
          {/* <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>ℹ️</div>
              <h3 style={cardHeaderStyle}>Other Information</h3>
            </div>

            <div style={fieldsGridStyle}>
              <Field
                label="Owner"
                name="owner"
                placeholder="Enter Owner Name"
                value={formData.owner}
                onChange={handleInputChange}
              />

              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Remarks"
                  name="remarks"
                  placeholder="Enter Remarks"
                  type="textarea"
                  value={formData.remarks}
                  onChange={handleInputChange}
                />
              </div>

              <Field
                label="Contact Generated By"
                name="contact_generated_by"
                value={formData.contact_generated_by}
                disabled
              />
            </div>
          </div> */}

          {/* Control */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>⚙️</div>
              <h3 style={cardHeaderStyle}>Control</h3>
            </div>

            <div style={checkboxContainerStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                />

                <div
                  style={{
                    ...checkboxCustomStyle,
                    backgroundColor: formData.is_active ? "#3b82f6" : "#ffffff",
                    borderColor: formData.is_active ? "#3b82f6" : "#d1d5db",
                  }}
                >
                  {formData.is_active && <span style={checkmarkStyle}>✓</span>}
                </div>


                <div>
                  <span style={checkboxTextStyle}>Active Status</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={cancelBtnStyle}
            onClick={() => navigate("/dashboard/crm/client-list")}
          >
            Cancel
          </button>
          <button type="submit" style={updateBtnStyle}>
            Update
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
  required = false,
  value,
  onChange,
  disabled = false,
  options = [],
  errors = {},
}) => {
  const error = errors[name];

  const handleFieldChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          style={{
            ...textareaStyle,
            borderColor: error ? "#ef4444" : "#d1d5db",
          }}
          value={value}
          onChange={handleFieldChange}
          rows={3}
          disabled={disabled}
        />
      ) : type === "select" ? (
        <div style={selectWrapperStyle}>
          <select
            style={{
              ...selectStyle,
              borderColor: error ? "#ef4444" : "#d1d5db",
            }}
            name={name}
            value={value}
            onChange={handleFieldChange}
            disabled={disabled}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={selectArrowStyle}>▼</div>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: error ? "#ef4444" : "#d1d5db",
          }}
          value={value}
          onChange={handleFieldChange}
          disabled={disabled}
        />
      )}
      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: "0.75rem",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

// Styles (same as your add page)
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "1.125rem",
  color: "#6b7280",
};

const headerContainerStyle = {
  maxWidth: "1400px",
  padding: "0 1.5rem",
  margin: "0 auto",
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 0.25rem 0",
  letterSpacing: "-0.025em",
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1400px",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  padding: "0 1.5rem",
  margin: "1.5rem auto 0",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
  transition: "box-shadow 0.2s ease",
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
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
  letterSpacing: "0.025em",
};

const requiredStyle = {
  color: "#ef4444",
  marginLeft: "0.25rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
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
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
  cursor: "pointer",
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

const textareaStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
  minHeight: "100px",
};

const checkboxContainerStyle = {
  marginTop: "0.5rem",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "flex-start",
  cursor: "pointer",
  gap: "0.75rem",
};

const checkboxStyle = {
  display: "none",
};

const checkboxCustomStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  border: "2px solid #d1d5db",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  flexShrink: 0,
  marginTop: "2px",
};

const checkmarkStyle = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
};

const checkboxTextStyle = {
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  display: "block",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "2rem",
  maxWidth: "1400px",
  margin: "2rem auto 0",
  padding: "0 1.5rem",
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
  transition: "all 0.2s ease",
  outline: "none",
};

const updateBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
  transition: "all 0.2s ease",
  outline: "none",
};

export default ContactsEditLayoutPage;
