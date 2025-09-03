import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const generateRandomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PR-${code}`;
};

const PurchaseRequestAdd = () => {
  const [showProductTable, setShowProductTable] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    suppliers: true,
    products: true,
  });
  const [error, setError] = useState({
    suppliers: null,
    products: null,
  });

  const [formData, setFormData] = useState({
    purchaseRequestId: "",
    purchaseRequestDate: new Date().toISOString().split("T")[0],
    purchaseType: "Buy",
    purchaseRequestStatus: "Pending",
    owner: "",
    supplier: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({
    purchaseType: "",
    purchaseRequestStatus: "",
    supplier: "",
    products: "",
    quantities: {},
  });
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchaseRequestId: generateRandomId(),
    }));

    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${API_URL}/supplier`);
        if (!response.ok) throw new Error("Failed to fetch suppliers");
        const data = await response.json();
        setSuppliers(data);
        setLoading((prev) => ({ ...prev, suppliers: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, suppliers: err.message }));
        setLoading((prev) => ({ ...prev, suppliers: false }));
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product-templete`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // Filter out Assembled PC category
        const filteredProducts = data.filter(
          (product) => product.product_category !== "Assembled PC"
        );

        setProducts(filteredProducts);
        setLoading((prev) => ({ ...prev, products: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, products: err.message }));
        setLoading((prev) => ({ ...prev, products: false }));
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "purchaseType":
        if (!value) error = "Purchase type is required";
        break;
      case "purchaseRequestStatus":
        if (!value) error = "Status is required";
        break;
      case "supplier":
        if (!value) error = "Supplier is required";
        break;
      case "products":
        if (selectedProductIds.length === 0)
          error = "At least one product must be selected";
        break;
      default:
        break;
    }

    return error;
  };

  const validateQuantity = (productId, quantity) => {
    if (
      selectedProductIds.includes(productId) &&
      (!quantity || quantity <= 0)
    ) {
      return "Quantity must be greater than 0";
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQtyChange = (id, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    const quantityError = validateQuantity(id, qty);

    setQuantities((prev) => ({ ...prev, [id]: qty }));
    setErrors((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [id]: quantityError,
      },
    }));
  };

  const incrementQty = (id) => {
    const newQty = (quantities[id] || 0) + 1;
    handleQtyChange(id, newQty);
  };

  const decrementQty = (id) => {
    const newQty = Math.max(0, (quantities[id] || 0) - 1);
    handleQtyChange(id, newQty);
  };

  const handleProductSelection = (productId) => {
    const newSelected = selectedProductIds.includes(productId)
      ? selectedProductIds.filter((id) => id !== productId)
      : [...selectedProductIds, productId];

    setSelectedProductIds(newSelected);

    // Validate products selection
    const productsError = validateField("products", newSelected);
    setErrors((prev) => ({ ...prev, products: productsError }));

    // Validate quantity for this product
    if (newSelected.includes(productId)) {
      const quantityError = validateQuantity(
        productId,
        quantities[productId] || 0
      );
      setErrors((prev) => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [productId]: quantityError,
        },
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate required fields
    const fieldsToValidate = [
      "purchaseType",
      "purchaseRequestStatus",
      "supplier",
    ];
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    // Validate at least one product is selected
    const productsError = validateField("products", selectedProductIds);
    newErrors.products = productsError;
    if (productsError) isValid = false;

    // Validate quantities for selected products
    const quantityErrors = {};
    selectedProductIds.forEach((id) => {
      const error = validateQuantity(id, quantities[id] || 0);
      quantityErrors[id] = error;
      if (error) isValid = false;
    });
    newErrors.quantities = quantityErrors;

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix all validation errors before submitting",
        severity: "error",
      });
      return;
    }

    const selectedProducts = products
      .filter((p) => selectedProductIds.includes(p.id))
      .map((p) => ({
        product_id: p.id,
        product_name: p.name,
        quantity: quantities[p.id] || 1,
        unit_price: 0,
      }));

    const payload = {
      purchase_request_id: formData.purchaseRequestId,
      purchase_request_date: formData.purchaseRequestDate,
      purchase_type: formData.purchaseType,
      purchase_request_status: formData.purchaseRequestStatus,
      owner: formData.owner,
      supplier_id: formData.supplier,
      description: formData.description,
      selected_products: selectedProducts,
    };

    try {
      const response = await fetch(`${API_URL}/purchase-requests/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Purchase request created successfully!",
          severity: "success",
        });
        setTimeout(
          () => navigate("/dashboard/procurement/purchase-requests"),
          1500
        );
      } else {
        const error = await response.json();
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to create purchase request.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error occurred during submission.",
        severity: "error",
      });
    }
  };

  if (loading.suppliers || loading.products) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (error.suppliers || error.products) {
    return (
      <div style={{ padding: 20 }}>
        {error.suppliers && <p>Error loading suppliers: {error.suppliers}</p>}
        {error.products && <p>Error loading products: {error.products}</p>}
      </div>
    );
  }

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

      <div style={formContainerStyle}>
        {/* Purchase Request Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Purchase Request Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Purchase Request ID"
              placeholder="Enter Purchase Request ID"
              value={formData.purchaseRequestId}
              onChange={(value) =>
                handleInputChange("purchaseRequestId", value)
              }
              disabled
            />
            <Field
              label="Purchase Request Date"
              type="date"
              placeholder="yyyy-mm-dd"
              value={formData.purchaseRequestDate}
              onChange={(value) =>
                handleInputChange("purchaseRequestDate", value)
              }
            />
            <Field
              label="Purchase Type"
              type="select"
              placeholder="Select Purchase Type"
              value={formData.purchaseType}
              onChange={(value) => handleInputChange("purchaseType", value)}
              error={errors.purchaseType}
              required
            />
            <Field
              label="Purchase Request Status"
              type="select"
              placeholder="Select Status"
              value={formData.purchaseRequestStatus}
              onChange={(value) =>
                handleInputChange("purchaseRequestStatus", value)
              }
              error={errors.purchaseRequestStatus}
              required
            />
            <Field
              label="Owner"
              placeholder="Enter Owner"
              value={formData.owner}
              onChange={(value) => handleInputChange("owner", value)}
            />
          </div>
        </div>

        {/* Select Supplier Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Select Supplier</h3>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <Field
              label="Select Supplier"
              type="select"
              placeholder="Select Supplier"
              value={formData.supplier}
              onChange={(value) => handleInputChange("supplier", value)}
              options={suppliers.map((supplier) => ({
                value: supplier.id,
                label: supplier.supplier_name,
              }))}
              error={errors.supplier}
              required
            />
          </div>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field
              label="Description"
              placeholder="Enter Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
            />
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>Select Products</h3>
          {errors.products && (
            <span
              style={{
                color: "#ef4444",
                marginLeft: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {errors.products}
            </span>
          )}
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={() => setShowProductTable(!showProductTable)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: showProductTable ? "#f3f4f6" : "#2563eb",
              color: showProductTable ? "#374151" : "white",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
              outline: "none",
              marginBottom: "1rem",
            }}
          >
            {showProductTable ? "Hide Product List" : "Select Products"}
          </button>

          {showProductTable && (
            <Box p={2}>
              <Box display="flex" gap={2} mb={2} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: "400px", // or whatever height you prefer
                  overflow: "auto",
                  position: "relative",
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                      <TableCell
                        padding="checkbox"
                        sx={{ backgroundColor: "#0d47a1" }}
                      >
                        <Checkbox
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Product ID
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Product Name
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Brand
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Model
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Processor
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        RAM
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Storage
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Graphics
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Quantity
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => handleProductSelection(product.id)}
                          />
                        </TableCell>
                        <TableCell>{product.product_id}</TableCell>
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.model}</TableCell>
                        <TableCell>{product.processor}</TableCell>
                        <TableCell>{product.ram}</TableCell>
                        <TableCell>{product.storage}</TableCell>
                        <TableCell>{product.graphics}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => decrementQty(product.id)}
                              disabled={
                                !selectedProductIds.includes(product.id)
                              }
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <TextField
                              type="number"
                              size="small"
                              value={
                                selectedProductIds.includes(product.id)
                                  ? quantities[product.id] || ""
                                  : ""
                              }
                              onChange={(e) =>
                                handleQtyChange(product.id, e.target.value)
                              }
                              inputProps={{
                                min: 1,
                                style: { width: 50, textAlign: "center" },
                              }}
                              disabled={
                                !selectedProductIds.includes(product.id)
                              }
                              error={!!errors.quantities[product.id]}
                              helperText={errors.quantities[product.id]}
                            />
                            <IconButton
                              size="small"
                              onClick={() => incrementQty(product.id)}
                              disabled={
                                !selectedProductIds.includes(product.id)
                              }
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onClick={() => navigate("/dashboard/procurement/purchase-requests")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onClick={handleSubmit}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Create Purchase Request
        </button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  options,
  error = "",
  disabled = false,
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
            ...(error ? errorInputStyle : {}),
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {label === "Purchase Type" && (
            <>
              <option value="Buy">Buy</option>
              <option value="Lease">Lease</option>
              <option value="Rent">Rent</option>
            </>
          )}
          {label === "Purchase Request Status" && (
            <>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </>
          )}
          {label === "Select Supplier" &&
            options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        style={{
          ...textareaStyle,
          ...(error ? errorInputStyle : {}),
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        required={required}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          ...(error ? errorInputStyle : {}),
          ...(disabled ? disabledInputStyle : {}),
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      />
    )}
    {error && <div style={errorTextStyle}>{error}</div>}
  </div>
);

// Styles
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1200px",
  margin: "0 auto",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
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

const errorInputStyle = {
  borderColor: "#ef4444",
  backgroundColor: "#fef2f2",
};

const disabledInputStyle = {
  backgroundColor: "#f3f4f6",
  cursor: "not-allowed",
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
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "2rem",
  maxWidth: "1200px",
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

export default PurchaseRequestAdd;
