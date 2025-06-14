import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Snackbar,
  Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom"; // Add this at the top

const ClientDataAddTable = () => {
const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    clientId: "",
    industry: "",
    clientName: "",
    phone: "",
    companyName: "",
    rentalCost: "",
    productCost: "",
    clientStatus: "",
    rentalStart: null,
    rentalEnd: null,
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    active: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        client_id: formData.clientId,
        customer_industry: formData.industry,
        client_name: formData.clientName,
        phone_number: formData.phone,
        company_name: formData.companyName,
        rental_cost: parseFloat(formData.rentalCost),
        product_cost: parseFloat(formData.productCost),
        client_status: formData.clientStatus,
        rental_start_date: formData.rentalStart,
        rental_return_date: formData.rentalEnd,
        email: formData.email,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        active_status: formData.active
      };

      const response = await fetch("http://localhost:5000/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Client data saved successfully!",
          severity: "success",
        });

    setTimeout(() => {
      navigate("/dashboard/client/client");
    }, 2000);
    
        setFormData({
          clientId: "",
          industry: "",
          clientName: "",
          phone: "",
          companyName: "",
          rentalCost: "",
          productCost: "",
          clientStatus: "",
          rentalStart: null,
          rentalEnd: null,
          email: "",
          address: "",
          country: "",
          state: "",
          city: "",
          active: false,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to save client data.");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Something went wrong.",
        severity: "error",
      });
    }
  };

  // Styles
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
    maxWidth: '1000px',
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
    boxSizing: 'border-box',
  };

  const datePickerStyle = {
    width: '100%',
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '0.875rem',
      backgroundColor: '#ffffff',
    },
    '& .MuiInputBase-input': {
      padding: '0.75rem',
    },
  };

  const checkboxContainerStyle = {
    marginTop: '1rem',
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
    border: formData.active ? '2px solid #2563eb' : '2px solid #d1d5db',
    backgroundColor: formData.active ? '#2563eb' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const checkmarkStyle = {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    display: formData.active ? 'block' : 'none',
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
    fontSize: '0.875rem',
  };

  const createBtnStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={containerStyle}>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Client Details</h3>
          </div>

          <div style={fieldsGridStyle}>
            <Field label="Client ID" value={formData.clientId} onChange={handleChange("clientId")} placeholder="Enter Client ID" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Customer Industry" value={formData.industry} onChange={handleChange("industry")} placeholder="Enter Customer Industry" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Client Name" value={formData.clientName} onChange={handleChange("clientName")} placeholder="Enter Client Name" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Phone Number" value={formData.phone} onChange={handleChange("phone")} placeholder="Enter Phone Number" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Company Name" value={formData.companyName} onChange={handleChange("companyName")} placeholder="Enter Company Name" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Rental Cost" value={formData.rentalCost} onChange={handleChange("rentalCost")} placeholder="Enter Rental Cost" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Product Cost" value={formData.productCost} onChange={handleChange("productCost")} placeholder="Enter Product Cost" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Client Status" value={formData.clientStatus} onChange={handleChange("clientStatus")} placeholder="Enter Client Status" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <DateField label="Rental Start Date" value={formData.rentalStart} onChange={handleChange("rentalStart")} fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} datePickerStyle={datePickerStyle} />
            <DateField label="Rental Return Date" value={formData.rentalEnd} onChange={handleChange("rentalEnd")} fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} datePickerStyle={datePickerStyle} />
            <Field label="Email" type="email" value={formData.email} onChange={handleChange("email")} placeholder="Enter Email" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Address" value={formData.address} onChange={handleChange("address")} placeholder="Enter Address" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="Country" value={formData.country} onChange={handleChange("country")} placeholder="Enter Country" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="State" value={formData.state} onChange={handleChange("state")} placeholder="Enter State" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
            <Field label="City" value={formData.city} onChange={handleChange("city")} placeholder="Enter City" fieldContainerStyle={fieldContainerStyle} labelStyle={labelStyle} inputStyle={inputStyle} />
          </div>

          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <Checkbox
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
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

          <div style={buttonContainerStyle}>
            <button style={cancelBtnStyle}>Cancel</button>
            <button style={createBtnStyle} onClick={handleSubmit}>Create</button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

const Field = ({ label, type = 'text', value = '', onChange, placeholder = '', fieldContainerStyle, labelStyle, inputStyle }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
  </div>
);

const DateField = ({ label, value, onChange, fieldContainerStyle, labelStyle, datePickerStyle }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <DatePicker
      value={value}
      onChange={onChange}
      sx={datePickerStyle}
      slotProps={{ textField: { placeholder: "dd-mm-yyyy", fullWidth: true } }}
    />
  </div>
);

export default ClientDataAddTable;
