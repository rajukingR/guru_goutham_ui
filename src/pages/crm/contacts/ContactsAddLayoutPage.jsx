import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_URL from "../../../api/Api_url"
const ContactsAddLayoutPage = () => {
  const { user } = useSelector((state) => state.auth);
  const LoginUserName = user.full_name;

  const navigate = useNavigate();
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
      zip: "",
      country: "India",
    },
    gst: "",
    pan_no: "",
    owner: "",
    remarks: "",
    contact_generated_by: "",
    status: "Inactive",
  });

  useEffect(() => {
    if (LoginUserName) {
      setFormData((prev) => ({
        ...prev,
        contact_generated_by: LoginUserName,
      }));
    }
  }, [LoginUserName]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationData = async () => {
      if (formData.address.zip.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${formData.address.zip}`
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
  }, [formData.address.zip]);

  const handleInputChange = (field, value) => {
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

    try {
      const response = await fetch(
        `${API_URL}/contacts/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Contact created successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/dashboard/crm/client-list");
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to create contact");
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error creating contact",
        severity: "error",
      });
    }
  };

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
        <h1 style={titleStyle}>Create a new Contact</h1>
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
                label="First Name"
                name="first_name"
                placeholder="Enter First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />

              <Field
                label="Last Name"
                name="last_name"
                placeholder="Enter Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
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
              />

              <Field
                label="Company Name"
                name="company_name"
                placeholder="Enter Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
              />

              <Field
                label="Customer ID"
                name="customer_id"
                placeholder="Enter Customer ID"
                value={formData.customer_id}
                onChange={handleInputChange}
              />

              <Field
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />

              <Field
                label="Industry"
                name="industry"
                placeholder="Enter Industry"
                value={formData.industry}
                onChange={handleInputChange}
              />

              <Field
                label="Payment Type"
                name="payment_type"
                type="select"
                value={formData.payment_type}
                onChange={handleInputChange}
                options={[
                  { value: "Prepaid", label: "Prepaid" },
                  { value: "Postpaid", label: "Postpaid" },
                ]}
              />
            </div>
          </div>

          {/* Address Card */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏠</div>
              <h3 style={cardHeaderStyle}>Address</h3>
            </div>

            <div style={fieldsGridStyle}>
              <Field
                label="Street"
                name="address.street"
                placeholder="Enter Street"
                value={formData.address.street}
                onChange={handleInputChange}
              />

              <Field
                label="Pincode"
                name="address.zip"
                placeholder="Enter Pincode"
                value={formData.address.zip}
                onChange={handleInputChange}
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
              <h3 style={cardHeaderStyle}>Bank Details</h3>
            </div>

            <div style={fieldsGridStyle}>
              <Field
                label="GST"
                name="gst"
                placeholder="Enter GST"
                value={formData.gst}
                onChange={handleInputChange}
              />

              <Field
                label="PAN No"
                name="pan_no"
                placeholder="Enter PAN No"
                value={formData.pan_no}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={formContainerStyle}>
          {/* Other Information */}
          <div style={cardStyle}>
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
          </div>

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
                  checked={formData.status === "Active"}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.checked ? "Active" : "Inactive"
                    )
                  }
                />
                <div
                  style={{
                    ...checkboxCustomStyle,
                    backgroundColor:
                      formData.status === "Active" ? "#3b82f6" : "#ffffff",
                    borderColor:
                      formData.status === "Active" ? "#3b82f6" : "#d1d5db",
                  }}
                  onClick={() =>
                    handleInputChange(
                      "status",
                      formData.status === "Active" ? "Inactive" : "Active"
                    )
                  }
                >
                  {formData.status === "Active" && (
                    <span style={checkmarkStyle}>✓</span>
                  )}
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
            onClick={() => navigate("/contacts")}
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
  required = false,
  value,
  onChange,
  disabled = false,
  options = [],
}) => {
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
          style={textareaStyle}
          value={value}
          onChange={handleFieldChange}
          rows={3}
          disabled={disabled}
        />
      ) : type === "select" ? (
        <div style={selectWrapperStyle}>
          <select
            style={selectStyle}
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
          style={inputStyle}
          value={value}
          onChange={handleFieldChange}
          disabled={disabled}
        />
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
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

const checkboxDescStyle = {
  fontSize: "0.75rem",
  color: "#6b7280",
  display: "block",
  marginTop: "0.25rem",
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

const createBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
  transition: "all 0.2s ease",
  outline: "none",
};

export default ContactsAddLayoutPage;
