import React, { useState, useEffect } from "react";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import {
  Box,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const generateRandomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PO-${randomPart}`;
};

const PurchaseOrderAddLayout = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const [purchaseQuotations, setPurchaseQuotations] = useState([]);
  const [selectedPurchaseQuotation, setSelectedPurchaseQuotation] =
    useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseOrderId: "",
    purchaseQuotationDetails: "",
    purchaseQuotationId: "",
    purchaseQuotationStatus: "Pending",
    purchaseOrderDate: new Date().toISOString().split("T")[0],
    purchaseType: "",
    poStatus: "Pending",
    owner: "",
    supplierId: "",
    supplierName: "",
    description: "",
    isSupplierLocked: false,
  });

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [loading, setLoading] = useState({
    purchaseQuotations: true,
    suppliers: true,
    products: true,
  });
  const [error, setError] = useState({
    purchaseQuotations: "",
    suppliers: "",
    products: "",
  });
  const [errors, setErrors] = useState({
    purchaseQuotation: "",
    poStatus: "",
    owner: "",
    products: "",
    quantities: {},
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchaseOrderId: generateRandomId(),
    }));

    const fetchData = async () => {
      try {
        // Fetch approved purchase quotations
        const pqResponse = await fetch(
          `${API_URL}/purchase-quotation/approved`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!pqResponse.ok)
          throw new Error("Failed to fetch purchase quotations");
        const pqData = await pqResponse.json();
        setPurchaseQuotations(pqData);

        // Fetch suppliers
        const supResponse = await fetch(`${API_URL}/supplier`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!supResponse.ok) throw new Error("Failed to fetch suppliers");
        const supData = await supResponse.json();
        setSuppliers(supData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();

        // Filter out products with category 'Assembled PC'
        const filteredProducts = prodData.filter(
          (product) => product.product_category !== "Assembled PC"
        );

        setProducts(filteredProducts);

        setLoading({
          purchaseQuotations: false,
          suppliers: false,
          products: false,
        });
      } catch (err) {
        setError({
          purchaseQuotations: err.message,
          suppliers: err.message,
          products: err.message,
        });
        setLoading({
          purchaseQuotations: false,
          suppliers: false,
          products: false,
        });
      }
    };

    fetchData();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "poStatus":
        if (!value) error = "PO status is required";
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

  const handlePurchaseQuotationChange = (e) => {
    const selectedId = e.target.value;
    const error = validateField("purchaseQuotation", selectedId);
    setErrors((prev) => ({ ...prev, purchaseQuotation: error }));

    if (!selectedId) {
      setSelectedPurchaseQuotation(null);
      setFormData((prev) => ({
        ...prev,
        purchaseQuotationId: "",
        supplierId: "",
        supplierName: "",
        description: "",
        owner: "",
        purchaseType: "Buy",
        isSupplierLocked: false,
      }));
      setSelectedProductIds([]);
      return;
    }

    const selectedQuotation = purchaseQuotations.find(
      (req) => req.id.toString() === selectedId
    );
    setSelectedPurchaseQuotation(selectedQuotation);

    // Auto-fill the form fields
    setFormData((prev) => ({
      ...prev,
      purchaseQuotationId: selectedQuotation.purchase_quotation_id,
      purchaseQuotationDetails: selectedQuotation.description,
      purchaseType: selectedQuotation.purchase_type,
      owner: selectedQuotation.owner,
      supplierId: selectedQuotation.supplier_id,
      supplierName: selectedQuotation.supplier?.supplier_name || "No Supplier",
      description: selectedQuotation.description,
      isSupplierLocked: true,
    }));

    // Set selected products and quantities from the purchase quotation
    const productIds = selectedQuotation.selected_products.map(
      (item) => item.product_id
    );
    setSelectedProductIds(productIds);

    const newQuantities = {};
    selectedQuotation.selected_products.forEach((item) => {
      newQuantities[item.product_id] = item.quantity;
    });
    setQuantities(newQuantities);
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

    setQuantities({ ...quantities, [id]: qty });
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
    const fieldsToValidate = ["purchaseQuotation", "poStatus", "owner"];
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

    try {
      const selectedProducts = selectedPurchaseQuotation.selected_products.map(
        (item) => ({
          product_id: item.product_id,
          quantity: quantities[item.product_id] || item.quantity,
          price_per_unit: item.price_per_unit,
          gst_percentage: item.gst_percentage,
          total_price:
            (quantities[item.product_id] || item.quantity) *
            (item.price_per_unit || 0),
        })
      );

      const payload = {
        purchase_order_id: formData.purchaseOrderId,
        purchase_quotation_id: selectedPurchaseQuotation.purchase_quotation_id,
        supplier_id: formData.supplierId,
        purchase_order_date: formData.purchaseOrderDate,
        purchase_type: formData.purchaseType,
        po_status: formData.poStatus,
        owner: formData.owner,
        description: formData.description,
        selected_products: selectedProducts,
      };

      const response = await fetch(`${API_URL}/purchase-orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create purchase order");
      }

      setSnackbar({
        open: true,
        message: "Purchase Order created successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard/procurement/purchase-orders");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
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
        {/* Purchase Order Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Purchase Order Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Purchase Order ID"
              placeholder="Enter Purchase Order ID"
              value={formData.purchaseOrderId}
              onChange={(value) => handleInputChange("purchaseOrderId", value)}
              disabled
            />
            <Field
              label="Purchase Quotation"
              type="select"
              placeholder="Select Purchase Quotation"
              value={selectedPurchaseQuotation?.id || ""}
              onChange={(value) =>
                handlePurchaseQuotationChange({ target: { value } })
              }
              options={purchaseQuotations.map((q) => {
                const supplier = suppliers.find((s) => s.id === q.supplier_id);
                const supplierName =
                  supplier?.supplier_name || "Unknown Supplier";

                return {
                  value: q.id,
                  label: `${q.purchase_quotation_id} - ${supplierName}`,
                };
              })}
              error={errors.purchaseQuotation}
              required
            />
            <Field
              label="Purchase Quotation ID"
              placeholder="Purchase Quotation ID"
              value={formData.purchaseQuotationId}
              disabled
            />
            <Field
              label="Purchase Quotation Status"
              placeholder="Pending"
              value={
                selectedPurchaseQuotation?.po_quotation_status || "Approved"
              }
              disabled
            />
            <Field
              label="Purchase Order Date"
              type="date"
              placeholder="dd-mm-yyyy"
              value={formData.purchaseOrderDate}
              onChange={(value) =>
                handleInputChange("purchaseOrderDate", value)
              }
            />
            <Field
              label="Purchase Type"
              placeholder={selectedPurchaseQuotation?.purchase_type || "Buy"}
              value={selectedPurchaseQuotation?.purchase_type || "Buy"}
              disabled
            />
            <Field
              label="PO Status"
              type="select"
              placeholder="Pending"
              value={formData.poStatus}
              onChange={(value) => handleInputChange("poStatus", value)}
              options={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
              error={errors.poStatus}
              required
            />
            {/* <Field
              label="Owner"
              placeholder="Enter Owner"
              value={formData.owner}
              onChange={(value) => handleInputChange("owner", value)}
              error={errors.owner}
              required
            /> */}
            <Field
              label="Description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              multiline
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>Selected Products</h3>
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
            {showProductTable ? "Hide Product List" : "Add Products"}
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
                          checked={
                            filteredProducts.length > 0 &&
                            filteredProducts.every((product) =>
                              selectedProductIds.includes(product.id)
                            )
                          }
                          indeterminate={
                            filteredProducts.some((product) =>
                              selectedProductIds.includes(product.id)
                            ) &&
                            !filteredProducts.every((product) =>
                              selectedProductIds.includes(product.id)
                            )
                          }
                          onChange={() => {
                            const allSelected = filteredProducts.every(
                              (product) =>
                                selectedProductIds.includes(product.id)
                            );
                            if (allSelected) {
                              setSelectedProductIds((prev) =>
                                prev.filter(
                                  (id) =>
                                    !filteredProducts.some((p) => p.id === id)
                                )
                              );
                            } else {
                              const newSelected = [
                                ...new Set([
                                  ...selectedProductIds,
                                  ...filteredProducts.map((p) => p.id),
                                ]),
                              ];
                              setSelectedProductIds(newSelected);
                            }
                          }}
                        />
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
          onClick={() => navigate("/dashboard/procurement/purchase-orders")}
        >
          Cancel
        </button>
        <button style={createBtnStyle} onClick={handleSubmit}>
          Create Purchase Order
        </button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
  options = [],
  multiline = false,
  rows = 1,
  error = "",
  required = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
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
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "date" ? (
      <input
        type="date"
        placeholder={placeholder}
        style={{
          ...inputStyle,
          ...(error ? errorInputStyle : {}),
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    ) : multiline ? (
      <textarea
        placeholder={placeholder}
        style={{
          ...inputStyle,
          minHeight: `${rows * 24}px`,
          ...(error ? errorInputStyle : {}),
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
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
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
  maxWidth: "1400px",
  margin: "0 auto",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
  gridColumn: "1 / -1",
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
  marginBottom: "1rem",
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
  fontFamily: "inherit",
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
  fontFamily: "inherit",
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
  transition: "background-color 0.2s ease",
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
  transition: "background-color 0.2s ease",
};

export default PurchaseOrderAddLayout;
