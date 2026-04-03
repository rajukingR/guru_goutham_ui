import React, { useState, useEffect, memo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Typography, CircularProgress, IconButton } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import API_URL, {POSTAL_API} from "../../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Field = memo(
  ({
    label,
    name,
    placeholder,
    type = "text",
    options = [],
    required = false,
    readOnly = false,
    disabled = false,
    value,
    onChange,
    error,
    children,
    ...props
  }) => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>

      {type === "select" ? (
        <div style={selectWrapperStyle}>
          <select
            style={{
              ...selectStyle,
              borderColor: error ? "#ef4444" : "#d1d5db",
              backgroundColor: disabled || readOnly ? "#f3f4f6" : "#ffffff",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled || readOnly}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.length > 0
              ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
              : children}
          </select>
          <div style={selectArrowStyle}>▼</div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          style={{
            ...textareaStyle,
            borderColor: error ? "#ef4444" : "#d1d5db",
            backgroundColor: disabled || readOnly ? "#f3f4f6" : "#ffffff",
            cursor: disabled ? "not-allowed" : "text",
          }}
          rows={3}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          onChange={onChange}
          {...props}
        />
      ) : type === "date" ? (
        <input
          type="date"
          name="service_date" // Fixed: Changed from "name" to "service_date"
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: error ? "#ef4444" : "#d1d5db",
            backgroundColor: disabled || readOnly ? "#f3f4f6" : "#ffffff",
            cursor: disabled ? "not-allowed" : "text",
          }}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={onChange}
          style={{
            ...checkboxStyle,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          disabled={disabled}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            backgroundColor: disabled || readOnly ? "#f3f4f6" : "#ffffff",
            borderColor: error ? "#ef4444" : "#d1d5db",
            cursor: disabled ? "not-allowed" : "text",
          }}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}

      {error && (
        <Typography
          variant="caption"
          color="error"
          style={{ marginTop: "4px" }}
        >
          {error}
        </Typography>
      )}
    </div>
  )
);

const ServiceMaintenanceEdit = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const { id } = useParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    invoice_number: "",
    service_number: "",
    customer_id: "",
    service_date: "",
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        // Fetch contacts
        const contactsResponse = await axios.get(`${API_URL}/contacts/list`, {
          headers: { "Authorization": `Bearer ${userToken}` },
        });

        if (contactsResponse.status === 200) {
          setContacts(contactsResponse.data);
        }

        // Fetch service charge details
        const serviceResponse = await axios.get(
          `${API_URL}/service-charges/${id}`,
          {
            headers: { "Authorization": `Bearer ${userToken}` },
          }
        );

        if (serviceResponse.status === 200) {
          const data = serviceResponse.data;
          setFormData({
            invoice_number: data.invoice_number,
            service_number: data.service_number,
            customer_id: data.customer_id,
            service_date: data.service_date,
          });

          // Set addresses
          if (data.addresses && data.addresses.length > 0) {
            setAddresses(data.addresses);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Failed to fetch data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Validate Indian pincode (6 digits)
  const validatePincode = (pincode) => {
    return /^\d{6}$/.test(pincode);
  };

  // Fetch location data when pincode changes for a specific address
const [addressesPostOffices, setAddressesPostOffices] = useState([]); // Holds post offices for each address

const fetchLocationData = useCallback(async (pincode, index) => {
  if (pincode.length === 6 && validatePincode(pincode)) {
    setLoadingIndex(index);
    try {
      const response = await fetch(`${POSTAL_API}/${pincode}`);
      const result = await response.json();

      if (Array.isArray(result) && result.length > 0 && result[0]?.PostOffice?.length > 0) {
        const firstOffice = result[0].PostOffice[0];

        // Update addresses array
        setAddresses((prevAddresses) => {
          const updatedAddresses = [...prevAddresses];
          updatedAddresses[index] = {
            ...updatedAddresses[index],
            district: firstOffice.District,
            state: firstOffice.State,
          };
          return updatedAddresses;
        });

        // Safely set post offices for this address index
        setAddressesPostOffices((prev) => {
          const updatedPostOffices = Array.from({ length: Math.max(prev.length, index + 1) }, (_, i) => prev[i] || []);
          updatedPostOffices[index] = result[0].PostOffice;
          return updatedPostOffices;
        });

        showSnackbar("Location details auto-filled successfully", "success");
      } else {
        showSnackbar("Invalid Pincode. Please enter a valid one.", "error");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      showSnackbar("Error fetching location. Try again.", "error");
    } finally {
      setLoadingIndex(-1);
    }
  }
}, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;

    setAddresses((prevAddresses) => {
      const updatedAddresses = [...prevAddresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [name]: value,
      };
      return updatedAddresses;
    });

    // If pincode changed and is valid, fetch location data
    if (name === "pincode") {
      // Clear district and state when pincode changes
      if (value.length < 6) {
        setAddresses((prevAddresses) => {
          const updatedAddresses = [...prevAddresses];
          updatedAddresses[index] = {
            ...updatedAddresses[index],
            district: "",
            state: "",
            city: "",
          };
          return updatedAddresses;
        });
      }

      // Fetch location data only when pincode is exactly 6 digits
      if (value.length === 6) {
        fetchLocationData(value, index);
      }
    }

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        pincode: "",
        city: "",
        district: "",
        state: "",
        courier_charges_price: "",
        courier_description: "",
      },
    ]);
  };

  const removeAddress = (index) => {
    if (addresses.length > 1) {
      const updatedAddresses = [...addresses];
      updatedAddresses.splice(index, 1);
      setAddresses(updatedAddresses);
    } else {
      showSnackbar("At least one address is required", "error");
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Basic validation
      const newErrors = {};
      if (!formData.customer_id) newErrors.customer_id = "Customer is required";

      if (!formData.service_date) {
        newErrors.service_date = "Service date is required";
      }

      addresses.forEach((address, index) => {
        if (!address.pincode || !validatePincode(address.pincode)) {
          newErrors[`pincode_${index}`] = "Valid pincode is required";
        }
        if (!address.city) newErrors[`city_${index}`] = "City is required";
        if (!address.district)
          newErrors[`district_${index}`] = "District is required";
        if (!address.state) newErrors[`state_${index}`] = "State is required";
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showSnackbar("Please fill in all required fields", "error");
        return;
      }

      // 2. Prepare payload
      const payload = {
        invoice_number: formData.invoice_number,
        service_number: formData.service_number,
        customer_id: formData.customer_id,
        service_date: formData.service_date,
        addresses: addresses.map((address) => ({
          pincode: address.pincode,
          city: address.city,
          district: address.district,
          state: address.state,
          courier_charges_price: address.courier_charges_price,
          courier_description: address.courier_description,
        })),
      };

      // 3. Send PUT request
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/service-charges/${id}`,
        payload,
        {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 4. Success
        showSnackbar("Service Maintenance updated successfully", "success");
        setTimeout(() => {
          navigate("/dashboard/operations/service_maintenance");
        }, 1500);
      } else {
        throw new Error("Failed to update record");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Edit Service Maintenance</h1>
      </div>
      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={fieldsGridStyle}>
            {/* <Field
              label="Invoice Number"
              name="invoice_number"
              type="text"
              value={formData.invoice_number}
              readOnly
            />

            <Field
              label="Service Number"
              name="service_number"
              type="text"
              value={formData.service_number}
              readOnly
            /> */}

            <Field
              label="Select Customer"
              name="customer_id"
              type="select"
              placeholder="Select Customer"
              value={formData.customer_id}
              onChange={handleInputChange}
              error={errors.customer_id}
              options={contacts.map((contact) => ({
                value: contact.id,
                label: `${contact.first_name} ${contact.last_name} - ${contact.company_name || ""
                  }`,
              }))}
            />

            <Field
              label="Service Date"
              name="service_date"
              type="date"
              value={formData.service_date || ""}
              onChange={handleInputChange}
              error={errors.service_date}
            />
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      {addresses.map((address, index) => (
        <div key={index} style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Address {index + 1}</h3>
            {addresses.length > 1 && (
              <IconButton
                onClick={() => removeAddress(index)}
                style={{ color: "#ef4444" }}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            {/* LEFT SIDE → Address Details */}
            <div style={{ flex: 1, ...cardStyle }}>
              <div style={cardHeaderContainerStyle}>
                <div style={iconStyle}>📍</div>
                <h3 style={cardHeaderStyle}>Address Details:</h3>
              </div>

              {/* Grid inside card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  position: "relative",
                }}
              >
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Pincode</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    style={inputStyle}
                    name="pincode"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange(index, e)}
                    maxLength="6"
                  />
                  {errors[`pincode_${index}`] && (
                    <Typography variant="caption" color="error">
                      {errors[`pincode_${index}`]}
                    </Typography>
                  )}
                  <Typography variant="caption" color="textSecondary">
                    Enter Indian pincode to auto-fill location
                  </Typography>
                </div>

                <Field
                  label="Enter City"
                  name="city"
                  type="text"
                  placeholder="Enter City"
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, e)}
                  error={errors[`city_${index}`]}
                />
                <Field
                  label="Enter District"
                  name="district"
                  type="text"
                  placeholder="District will auto-fill from pincode"
                  value={address.district}
                  onChange={(e) => handleAddressChange(index, e)}
                  error={errors[`district_${index}`]}
                  disabled
                />
                <Field
                  label="Enter State"
                  name="state"
                  type="text"
                  placeholder="State will auto-fill from pincode"
                  value={address.state}
                  onChange={(e) => handleAddressChange(index, e)}
                  error={errors[`state_${index}`]}
                  disabled
                />
              </div>
            </div>

            {/* RIGHT SIDE → Service Charges */}
            <div style={{ flex: 1, ...cardStyle }}>
              <div style={cardHeaderContainerStyle}>
                <div style={iconStyle}>🛠</div>
                <h3 style={cardHeaderStyle}>Service Charges:</h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <Field
                  label="Service Price"
                  name="courier_charges_price"
                  type="number"
                  placeholder="Enter service price"
                  value={address.courier_charges_price}
                  onChange={(e) => handleAddressChange(index, e)}
                />
                <Field
                  label="Description"
                  name="courier_description"
                  type="text"
                  placeholder="Enter description"
                  value={address.courier_description}
                  onChange={(e) => handleAddressChange(index, e)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Another Address Button */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <button style={addAddressBtnStyle} onClick={addAddress}>
          <AddIcon style={{ fontSize: "16px", marginRight: "8px" }} />
          Add Another Address
        </button>
      </div>

      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          onClick={() => navigate("/dashboard/operations/service_maintenance")}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onClick={handleSubmit}
        >
          Update Service Maintenance
        </button>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Modern Styles (same as in ServiceMaintenanceAdd)
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: "2rem",
  maxWidth: "1400px",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "##1e293b",
  margin: "0 0 0.5rem 0",
  letterSpacing: "-0.025em",
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1400px",
  margin: "0 auto",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  marginBottom: "1.5rem",
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
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
};

const selectArrowStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "#6b7280",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

const checkboxStyle = {
  width: "18px",
  height: "18px",
  marginRight: "8px",
};

const addAddressBtnStyle = {
  display: "flex",
  alignItems: "center",
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

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  maxWidth: "1400px",
  margin: "2rem auto 0",
  padding: "0 1.5rem",
};

const cancelBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "1px solid ",
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

export default ServiceMaintenanceEdit;
