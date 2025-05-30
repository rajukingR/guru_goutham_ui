import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";

const BrandsPageEditLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brand_number: "",
    brand_name: "",
    brand_description: "",
    active_status: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch brand data on component mount
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/brand/${id}`);
        setForm({
          brand_number: response.data.brand_number,
          brand_name: response.data.brand_name,
          brand_description: response.data.brand_description,
          active_status: response.data.active_status,
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load brand");
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/brand/${id}`, form);
      setSuccess(true);
      setTimeout(() => navigate("/brands"), 1500); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/brands");
  };

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
    maxWidth: '800px',
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

  const checkboxContainerStyle = {
    marginTop: '0.5rem',
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    cursor: 'pointer',
    gap: '0.75rem',
  };

  const checkboxCustomStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: form.active_status ? '2px solid #2563eb' : '2px solid #d1d5db',
    backgroundColor: form.active_status ? '#2563eb' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const checkmarkStyle = {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    display: form.active_status ? 'block' : 'none',
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

  if (loading && !form.brand_number) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate("/brands")} sx={{ mt: 2 }}>
          Back to Brands
        </Button>
      </Box>
    );
  }

  return (
    <div style={containerStyle}>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Brand updated successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={iconStyle}>📝</div>
          <h3 style={cardHeaderStyle}>Edit Brand - {form.brand_number}</h3>
        </div>
        <div style={fieldsGridStyle}>
          <Field
            label="Brand Number"
            type="text"
            name="brand_number"
            value={form.brand_number}
            onChange={handleChange}
            disabled
          />
          <Field
            label="Brand Name"
            type="text"
            name="brand_name"
            value={form.brand_name}
            onChange={handleChange}
          />
          <Field
            label="Brand Description"
            type="text"
            name="brand_description"
            value={form.brand_description}
            onChange={handleChange}
          />
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <Checkbox
                name="active_status"
                checked={form.active_status}
                onChange={handleChange}
                sx={{ display: 'none' }}
              />
              <div style={checkboxCustomStyle}>
                <span style={checkmarkStyle}>✓</span>
              </div>
              <div>
                <span style={checkboxTextStyle}>Active Status</span>
              </div>
            </label>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Updating...' : 'Update Brand'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, type = 'text', value = '', name, onChange, disabled = false }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      color: '#374151',
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '0.875rem',
        backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
      }}
    />
  </Box>
);

export default BrandsPageEditLayout;