import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { generateSpecifications } from "../../../utils/generateSpecifications";

const PurchaseOrderEditLayout = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const { id } = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [purchaseQuotations, setPurchaseQuotations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseOrderId: "",
    purchaseQuotationDetails: "",
    purchaseQuotationId: "",
    purchaseQuotationStatus: "Pending",
    purchaseOrderDate: new Date().toISOString().split("T")[0],
    purchaseType: "Buy",
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
    purchaseOrder: true,
    purchaseQuotations: true,
    suppliers: true,
    products: true,
  });
  const [error, setError] = useState({
    purchaseOrder: "",
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

  // Validation functions
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
    if (selectedProductIds.includes(productId)) {
      if (!quantity || quantity === "" || quantity === null || quantity === undefined) {
        return "Quantity is required";
      }
      if (quantity <= 0) {
        return "Quantity must be at least 1";
      }
      if (!Number.isInteger(Number(quantity))) {
        return "Quantity must be a whole number";
      }
    }
    return "";
  };

  const handleQtyChange = (id, value) => {
    // Ensure we get a valid number or empty string
    let qty;
    if (value === "" || value === null || value === undefined) {
      qty = "";
    } else {
      // Parse the value to integer, default to 0 if NaN
      qty = parseInt(value) || 0;
    }

    // Validate the quantity
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
    const currentQty = quantities[id] || 0;
    const newQty = currentQty + 1;
    handleQtyChange(id, newQty);
  };

  const decrementQty = (id) => {
    const currentQty = quantities[id] || 0;
    const newQty = Math.max(1, currentQty - 1); // Don't go below 1
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

    // When adding a new product, initialize quantity to 1
    if (!selectedProductIds.includes(productId)) {
      handleQtyChange(productId, 1);
    } else {
      // When removing a product, clear its quantity error
      setErrors((prev) => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [productId]: "",
        },
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate required fields
    const fieldsToValidate = ["poStatus"];
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
      const quantity = quantities[id];
      const error = validateQuantity(id, quantity);
      quantityErrors[id] = error;
      if (error) {
        isValid = false;
        // Also show a general snackbar error for better UX
        setSnackbar({
          open: true,
          message: `Please enter valid quantity (minimum 1) for all selected products`,
          severity: "error",
        });
      }
    });
    newErrors.quantities = quantityErrors;

    setErrors(newErrors);
    return isValid;
  };

  const areAllQuantitiesValid = () => {
    return selectedProductIds.every(id => {
      const quantity = quantities[id];
      return quantity && quantity >= 1;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the purchase order to edit
        const poResponse = await fetch(`${API_URL}/purchase-orders/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!poResponse.ok) throw new Error("Failed to fetch purchase order");
        const poData = await poResponse.json();
        setPurchaseOrder(poData);

        // Pre-populate form data
        setFormData({
          purchaseOrderId: poData.purchase_order_id,
          purchaseQuotationDetails: poData.description,
          purchaseQuotationId: poData.purchase_quotation_id,
          purchaseQuotationStatus:
            poData.purchase_quotation_status || "Approved",
          purchaseOrderDate: poData.purchase_order_date.split("T")[0],
          purchaseType: poData.purchase_type,
          poStatus: poData.po_status,
          owner: poData.owner,
          supplierId: poData.supplier_id,
          supplierName: poData.supplier?.supplier_name || "",
          description: poData.description,
          isSupplierLocked: true,
        });

        // Set selected products and quantities
        const productIds = poData.selected_products.map(
          (item) => item.product_id
        );
        setSelectedProductIds(productIds);

        const newQuantities = {};
        poData.selected_products.forEach((item) => {
          newQuantities[item.product_id] = item.quantity;
        });
        setQuantities(newQuantities);

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
        const supResponse = await fetch(`${API_URL}/supplier/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!supResponse.ok) throw new Error("Failed to fetch suppliers");
        const supData = await supResponse.json();
        setSuppliers(supData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete/without-active`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();

        // Exclude "Assembled PC" category products
        const filteredProducts = prodData.filter(
          (product) => product.product_category !== "Assembled PC"
        );

        setProducts(filteredProducts);

        setLoading({
          purchaseOrder: false,
          purchaseQuotations: false,
          suppliers: false,
          products: false,
        });
      } catch (err) {
        setError({
          purchaseOrder: err.message,
          purchaseQuotations: err.message,
          suppliers: err.message,
          products: err.message,
        });
        setLoading({
          purchaseOrder: false,
          purchaseQuotations: false,
          suppliers: false,
          products: false,
        });
      }
    };

    fetchData();
  }, [id]);

  const handlePurchaseQuotationChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
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
      newQuantities[item.product_id] = item.quantity || 1;
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

  const handleSubmit = async () => {
    // First check if all selected products have valid quantities
    const hasInvalidQuantities = selectedProductIds.some(id => {
      const quantity = quantities[id];
      return !quantity || quantity < 1;
    });

    if (hasInvalidQuantities) {
      setSnackbar({
        open: true,
        message: "Please ensure all selected products have a quantity of at least 1",
        severity: "error",
      });

      // Trigger validation for all selected products
      selectedProductIds.forEach(id => {
        const error = validateQuantity(id, quantities[id]);
        setErrors(prev => ({
          ...prev,
          quantities: {
            ...prev.quantities,
            [id]: error,
          },
        }));
      });

      return;
    }

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix all validation errors before submitting",
        severity: "error",
      });
      return;
    }

    try {
      const selectedProducts = selectedProductIds.map((id) => {
        const product = products.find((p) => p.id === id);
        const poProduct = purchaseOrder?.selected_products.find(
          (p) => p.product_id === id
        );
        return {
          product_id: id,
          quantity: quantities[id] || poProduct?.quantity || 1,
          price_per_unit: poProduct?.price_per_unit || product?.price || 0,
          gst_percentage:
            poProduct?.gst_percentage || product?.gst_percentage || 0,
          total_price:
            (quantities[id] || poProduct?.quantity || 1) *
            (poProduct?.price_per_unit || product?.price || 0),
        };
      });

      const payload = {
        purchase_order_id: formData.purchaseOrderId,
        purchase_quotation_id: formData.purchaseQuotationId,
        supplier_id: formData.supplierId,
        purchase_order_date: formData.purchaseOrderDate,
        purchase_type: formData.purchaseType,
        po_status: formData.poStatus,
        owner: formData.owner,
        description: formData.description,
        selected_products: selectedProducts,
      };

      const response = await fetch(`${API_URL}/purchase-orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update purchase order");
      }

      setSnackbar({
        open: true,
        message: "Purchase Order updated successfully!",
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

  if (loading.purchaseOrder) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading purchase order data...
      </div>
    );
  }

  if (error.purchaseOrder) {
    return (
      <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>
        {error.purchaseOrder}
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
            />
            <Field
              label="Purchase Quotation"
              type="select"
              placeholder="Select Purchase Quotation"
              value={
                purchaseQuotations.find(
                  (q) =>
                    q.purchase_quotation_id === formData.purchaseQuotationId
                )?.id || ""
              }
              onChange={(value) =>
                handlePurchaseQuotationChange({ target: { value } })
              }
              options={purchaseQuotations.map((q) => ({
                value: q.id,
                label: `${q.purchase_quotation_id} - ${q.supplier?.supplier_name}`,
              }))}
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
              value={formData.purchaseQuotationStatus}
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
              placeholder={formData.purchaseType}
              value={formData.purchaseType}
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
                { value: "Completed", label: "Completed" },
              ]}
              error={errors.poStatus}
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

        {/* Supplier Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📞</div>
            <h3 style={cardHeaderStyle}>Supplier Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Supplier"
              type="text"
              placeholder="Supplier Name"
              value={formData.supplierName}
              disabled
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>ℹ️</div>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={fieldsGridStyle}>
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
            {showProductTable ? "Hide Product List" : "Edit Products"}
          </button>

          {/* Quantity validation warning */}
          {selectedProductIds.length > 0 && !areAllQuantitiesValid() && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#d00',
              fontSize: '0.875rem'
            }}>
              ⚠️ Please ensure all selected products have a quantity of at least 1
            </div>
          )}

          {showProductTable && (
            <Box p={2}>
              <Box className="search-wrapper" mb={2}>
                <TextField
                  size="small"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: "400px",
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
                        Specifications
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Quantity
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts
                      .slice()
                      .sort((a, b) => {
                        const aSelected = selectedProductIds.includes(a.id);
                        const bSelected = selectedProductIds.includes(b.id);

                        if (aSelected === bSelected) return 0;
                        if (aSelected && !bSelected) return -1;
                        return 1;
                      })
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() => handleProductSelection(product.id)}
                            />
                          </TableCell>
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell>{generateSpecifications(product)}</TableCell>
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
                                onChange={(e) => {
                                  // Allow empty string for better UX
                                  const value = e.target.value;
                                  if (value === "" || parseInt(value) >= 1) {
                                    handleQtyChange(product.id, value);
                                  } else {
                                    // Show error immediately for values less than 1
                                    handleQtyChange(product.id, value);
                                  }
                                }}
                                onBlur={(e) => {
                                  // When user leaves the field, ensure it's at least 1
                                  if (selectedProductIds.includes(product.id)) {
                                    const value = e.target.value;
                                    if (value === "" || value < 1) {
                                      handleQtyChange(product.id, 1);
                                    }
                                  }
                                }}
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
          Update
        </button>
      </div>
    </div>
  );
};

// Reuse the same Field component and styles from PurchaseOrderAddLayout
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
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
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
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    ) : multiline ? (
      <textarea
        placeholder={placeholder}
        style={{ ...inputStyle, minHeight: `${rows * 24}px` }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    )}
  </div>
);

// Reuse all the styles from PurchaseOrderAddLayout
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

export default PurchaseOrderEditLayout;
