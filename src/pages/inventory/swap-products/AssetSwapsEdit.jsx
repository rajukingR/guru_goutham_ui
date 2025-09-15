import React, { useState, useEffect, memo, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Custom Searchable Select Component
const SearchableSelect = memo(
  ({
    label,
    options,
    value,
    onChange,
    error,
    required,
    placeholder = "Search or select asset...",
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = React.useRef(null);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
      if (!searchTerm) return options;
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
      onChange({ target: { name: "asset_id", value: option.value } });
      setIsOpen(false);
      setSearchTerm("");
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div style={fieldContainerStyle} ref={dropdownRef}>
        <label style={labelStyle}>
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </label>

        <div style={selectWrapperStyle}>
          {/* Custom select input with search */}
          <div
            style={{
              ...selectStyle,
              borderColor: error ? "#ef4444" : isOpen ? "#3b82f6" : "#d1d5db",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "0.75rem",
              backgroundColor: "#ffffff",
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span style={{ flex: 1, color: value ? "#1f2937" : "#9ca3af" }}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div style={selectArrowStyle}>▼</div>
          </div>

          {/* Dropdown menu */}
          {isOpen && (
            <div style={dropdownMenuStyle}>
              {/* Search input */}
              <div style={searchContainerStyle}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  style={searchInputStyle}
                  autoFocus
                />
              </div>

              {/* Options list */}
              <div style={optionsListStyle}>
                {filteredOptions.length === 0 ? (
                  <div style={noOptionsStyle}>No assets found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      style={{
                        ...optionStyle,
                        backgroundColor:
                          value === option.value ? "#e0f2fe" : "transparent",
                      }}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f3f4f6")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor =
                          value === option.value ? "#e0f2fe" : "transparent")
                      }
                    >
                      {option.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
    );
  }
);

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
          name={name}
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

const AssetSwapsEdit = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [showWarehouseAssets, setShowWarehouseAssets] = useState(false);
  const [showClientAssets, setShowClientAssets] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    asset_id: "",
    reason: "",
    swapped_on: new Date().toISOString().split("T")[0],
    purchase_price: "",
    rent_price_per_month: "",
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAssetData, setCurrentAssetData] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchAssetSwap(id);
    } else {
      fetchAvailableAssets();
    }
  }, [id]);

  // API: Fetch asset swap by ID for editing
  const fetchAssetSwap = async (swapId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // 🔥 Get token

      // First fetch the specific asset swap
      const response = await axios.get(`${API_URL}/asset-swaps/${swapId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const swapData = response.data;

      // Store current asset data for fallback option
      setCurrentAssetData({
        value: swapData.asset_id,
        label: swapData.asset_id,
        product_id: swapData.product_id,
        product_name: swapData.product_name,
        purchase_price: swapData.purchase_price,
        rent_price_per_month: swapData.rent_price_per_month,
      });

      setFormData({
        product_id: swapData.product_id || "",
        product_name: swapData.product_name || "",
        asset_id: swapData.asset_id || "",
        reason: swapData.reason || "",
        swapped_on: swapData.swapped_on
          ? swapData.swapped_on.split("T")[0]
          : new Date().toISOString().split("T")[0],
        purchase_price: swapData.purchase_price || "",
        rent_price_per_month: swapData.rent_price_per_month || "",
      });

      // Set checkbox states from API response
      setShowWarehouseAssets(swapData.show_warehouse_assets || false);
      setShowClientAssets(swapData.show_client_assets || false);

      // Also fetch available assets for the dropdown
      await fetchAvailableAssets();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching asset swap:", error);
      showSnackbar("Failed to load asset swap data", "error");
      setLoading(false);
    }
  };

  // API: Fetch available assets
  const fetchAvailableAssets = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔥 Get token

      const response = await axios.get(
        `${API_URL}/goods-receipts/approved-receipt-products`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setProductsData(response.data.products);
      if (!id) setLoading(false);
    } catch (error) {
      console.error("Error fetching assets:", error);
      showSnackbar("Failed to load available assets", "error");
      if (!id) setLoading(false);
    }
  };

  // Prepare asset options based on checkbox selections
  const assetOptions = useMemo(() => {
    const assets = [];

    productsData.forEach((product) => {
      let assetIdsToInclude = [];

      // Determine which asset IDs to include based on checkbox selections
      if (!showWarehouseAssets && !showClientAssets) {
        // Show all assets (total_asset_ids)
        assetIdsToInclude = product.total_asset_ids || [];
      } else {
        // Show assets based on checkbox selections
        if (showWarehouseAssets) {
          assetIdsToInclude = [
            ...assetIdsToInclude,
            ...(product.available_asset_ids || []),
          ];
        }
        if (showClientAssets) {
          assetIdsToInclude = [
            ...assetIdsToInclude,
            ...(product.client_side_asset_ids || []),
          ];
        }
      }

      // Add assets to the options array
      assetIdsToInclude.forEach((assetId) => {
        assets.push({
          value: assetId,
          label: `${assetId}`,
          product_id: product.product_id,
          product_name: product.product.product_name,
          brand: product.product.brand,
          model: product.product.model,
          purchase_price: product.product.purchase_price,
          rent_price_per_month: product.product.rent_price_per_month,
        });
      });
    });

    // If we're in edit mode and the current asset_id is not in the options,
    // add it as a special option (this handles cases where the asset might not be available anymore)
    if (
      isEditMode &&
      currentAssetData &&
      !assets.some((asset) => asset.value === currentAssetData.value)
    ) {
      assets.unshift({
        value: currentAssetData.value,
        label: `${currentAssetData.value} (Current Asset)`,
        product_id: currentAssetData.product_id,
        product_name: currentAssetData.product_name,
        purchase_price: currentAssetData.purchase_price,
        rent_price_per_month: currentAssetData.rent_price_per_month,
      });
    }

    return assets;
  }, [
    productsData,
    showWarehouseAssets,
    showClientAssets,
    isEditMode,
    currentAssetData,
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "showWarehouseAssets") {
        setShowWarehouseAssets(checked);
      } else if (name === "showClientAssets") {
        setShowClientAssets(checked);
      }
      return;
    }

    if (name === "asset_id") {
      const selectedAsset = assetOptions.find((asset) => asset.value === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        product_id: selectedAsset ? selectedAsset.product_id : "",
        product_name: selectedAsset ? selectedAsset.product_name : "",
        purchase_price: selectedAsset ? selectedAsset.purchase_price : "",
        rent_price_per_month: selectedAsset
          ? selectedAsset.rent_price_per_month
          : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.asset_id) newErrors.asset_id = "Asset ID is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    if (!formData.swapped_on) newErrors.swapped_on = "Scrap date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API: Create or update asset swap
  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    try {
      const payload = {
        product_id: parseInt(formData.product_id),
        product_name: formData.product_name,
        asset_id: formData.asset_id,
        reason: formData.reason,
        swapped_on: formData.swapped_on,
        show_warehouse_assets: showWarehouseAssets,
        show_client_assets: showClientAssets,
        purchase_price: formData.purchase_price,
        rent_price_per_month: formData.rent_price_per_month,
      };

      let response;

      if (isEditMode) {
        // Update existing asset swap
        response = await axios.put(`${API_URL}/asset-swaps/${id}`, payload, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        showSnackbar("Asset swap updated successfully", "success");
      } else {
        // Create new asset swap
        response = await axios.post(`${API_URL}/asset-swaps/create`, payload, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        showSnackbar("Asset swap created successfully", "success");
      }

      setTimeout(() => {
        navigate("/dashboard/inventory/swap");
      }, 1500);
    } catch (err) {
      console.error(err);
      showSnackbar(
        err.response?.data?.message || "Failed to save asset swap",
        "error"
      );
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

  if (loading) {
    return (
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
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          {isEditMode ? "Edit Asset Scrap" : "Create Asset Scrap"}
        </h1>
      </div>

      <div style={formContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🔄</div>
            <h2 style={cardHeaderStyle}>Scrap Details</h2>
          </div>

          <div style={fieldsGridStyle}>
            {/* Checkbox filters */}
            <Box sx={{ gridColumn: "1 / -1", display: "flex", gap: 2, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showWarehouseAssets}
                    onChange={(e) => setShowWarehouseAssets(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Warehouse Assets"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showClientAssets}
                    onChange={(e) => setShowClientAssets(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Client Assets"
              />
            </Box>

            <SearchableSelect
              label="Select Asset ID"
              options={assetOptions}
              value={formData.asset_id}
              onChange={handleInputChange}
              error={errors.asset_id}
              required={true}
              placeholder="Search or select asset..."
            />

            <Field
              label="Product Name"
              name="product_name"
              type="text"
              value={formData.product_name}
              onChange={handleInputChange}
              error={errors.product_name}
              required
              readOnly
            />

            {/* <Field
              label="Purchase Price"
              name="purchase_price"
              type="text"
              value={formData.purchase_price}
              onChange={handleInputChange}
              error={errors.purchase_price}
              required
              readOnly
            />

            <Field
              label="Monthly Rent Price"
              name="rent_price_per_month"
              type="text"
              value={formData.rent_price_per_month}
              onChange={handleInputChange}
              error={errors.rent_price_per_month}
              required
              readOnly
            /> */}

            <Field
              label="Reason"
              name="reason"
              type="text"
              value={formData.reason}
              onChange={handleInputChange}
              error={errors.reason}
              required
            />

            <Field
              label="Scrap Date"
              name="swapped_on"
              type="date"
              value={formData.swapped_on}
              onChange={handleInputChange}
              error={errors.swapped_on}
              required
            />
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          onClick={() => navigate("/dashboard/inventory/swap")}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onClick={handleSubmit}
        >
          {isEditMode ? "Update Asset Scrap" : "Create Asset Scrap"}
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

// Styles
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
  color: "#1e293b",
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
  position: "relative",
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

// New Styles for Searchable Select
const dropdownMenuStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  zIndex: 1000,
  marginTop: "4px",
  maxHeight: "300px",
  overflow: "hidden",
};

const searchContainerStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
};

const searchInputStyle = {
  backgroundColor: "#ffffff",
};

const optionsListStyle = {
  maxHeight: "200px",
  overflowY: "auto",
};

const optionStyle = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #f3f4f6",
  fontSize: "0.875rem",
  transition: "background-color 0.2s ease",
};

const noOptionsStyle = {
  padding: "16px",
  textAlign: "center",
  color: "#6b7280",
  fontSize: "0.875rem",
};

export default AssetSwapsEdit;
