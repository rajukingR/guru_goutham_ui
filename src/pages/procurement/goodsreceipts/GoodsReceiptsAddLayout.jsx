import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Checkbox,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

import API_URL from "../../../api/Api_url";

const GoodsReceiptsAddLayout = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [assetIds, setAssetIds] = useState({});
  const [assetIdErrors, setAssetIdErrors] = useState({}); // { productId: 'Error message' }

  const [formData, setFormData] = useState({
    goodsReceiptId: "",
    vendorInvoiceNumber: "",
    purchaseOrderId: "",
    purchaseOrderStatus: "",
    goodsReceiptDate: new Date().toISOString().split("T")[0],
    purchaseType: "",
    goodsReceiptStatus: "Pending",
    owner: "",
    supplier_id: "",
    supplierName: "",
    description: "",
    isSupplierLocked: false,
  });

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [loading, setLoading] = useState({
    purchaseOrders: true,
    suppliers: true,
    products: true,
  });
  const [error, setError] = useState({
    purchaseOrders: "",
    suppliers: "",
    products: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved purchase orders
        const poResponse = await fetch(`${API_URL}/purchase-orders/approved`);
        if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
        const poData = await poResponse.json();
        setPurchaseOrders(poData);

        // Fetch suppliers
        const supResponse = await fetch(`${API_URL}/supplier`);
        if (!supResponse.ok) throw new Error("Failed to fetch suppliers");
        const supData = await supResponse.json();
        setSuppliers(supData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`);
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();
        setProducts(prodData);

        setLoading({
          purchaseOrders: false,
          suppliers: false,
          products: false,
        });
      } catch (err) {
        setError({
          purchaseOrders: err.message,
          suppliers: err.message,
          products: err.message,
        });
        setLoading({
          purchaseOrders: false,
          suppliers: false,
          products: false,
        });
      }
    };

    fetchData();
  }, []);

  const handlePurchaseOrderChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setSelectedPurchaseOrder(null);
      setFormData((prev) => ({
        ...prev,
        purchaseOrderId: "",
        purchaseOrderStatus: "",
        supplier_id: "",
        supplierName: "",
        description: "",
        isSupplierLocked: false,
      }));
      setSelectedProductIds([]);
      return;
    }

    const selectedOrder = purchaseOrders.find(
      (order) => order.id.toString() === selectedId
    );
    setSelectedPurchaseOrder(selectedOrder);

    const supplier = suppliers.find((s) => s.id === selectedOrder.supplier_id);
    const supplierName = supplier ? supplier.supplier_name : "No Supplier name";

    // Auto-fill the form fields
    setFormData((prev) => ({
      ...prev,
      purchaseOrderId: selectedOrder.purchase_order_id,
      purchaseOrderStatus: selectedOrder.po_status,
      supplier_id: selectedOrder.supplier_id,
      supplierName: selectedOrder.supplier?.supplier_name || "No Supplier name",
      description: selectedOrder.description,
      isSupplierLocked: true,
      owner: selectedOrder.owner,
      purchaseType:selectedOrder.purchase_type,
    }));

    // Set selected products and quantities from the purchase order
    const productIds = selectedOrder.selected_products.map(
      (item) => item.product_id
    );
    setSelectedProductIds(productIds);

    const newQuantities = {};
    selectedOrder.selected_products.forEach((item) => {
      newQuantities[item.product_id] = item.quantity;
    });
    setQuantities(newQuantities);
  };

  const handleInputChange = (field, value) => {
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
    setQuantities({ ...quantities, [id]: qty });

    // When quantity changes, adjust asset IDs array
    if (qty < (assetIds[id]?.length || 0)) {
      setAssetIds((prev) => ({
        ...prev,
        [id]: prev[id]?.slice(0, qty) || [],
      }));
    }
  };

  const incrementQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  // Validate asset IDs before submission
  const validateAssetIds = () => {
    const errors = {};
    let isValid = true;

    // Check each product with quantity
    Object.entries(quantities).forEach(([productId, qty]) => {
      if (qty > 0) {
        const currentAssetIds = assetIds[productId] || [];

        // Check if number of asset IDs matches quantity
        if (currentAssetIds.length !== qty) {
          errors[productId] = `Please enter exactly ${qty} asset ID(s)`;
          isValid = false;
        }

        // Check for empty asset IDs
        currentAssetIds.forEach((id, index) => {
          if (!id.trim()) {
            errors[productId] = `Asset ID ${index + 1} cannot be empty`;
            isValid = false;
          }
        });

        // Check for duplicate asset IDs
        const uniqueIds = new Set(
          currentAssetIds.map((id) => id.trim().toLowerCase())
        );
        if (uniqueIds.size !== currentAssetIds.length) {
          errors[productId] = "Duplicate asset IDs found";
          isValid = false;
        }
      }
    });

    setAssetIdErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!selectedPurchaseOrder) {
        throw new Error("Please select a purchase order");
      }

      // Validate asset IDs
      if (!validateAssetIds()) {
        throw new Error("Please fix all asset ID errors before submitting");
      }

      // Prepare items with asset IDs
      const items = selectedPurchaseOrder.selected_products
        .filter((item) => quantities[item.product_id] > 0) // Only include items with quantity > 0
        .map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          const quantity = quantities[item.product_id] || 0;
          const productAssetIds = assetIds[item.product_id] || [];

          return {
            product_id: item.product_id,
            product_name: product?.product_name || "",
            quantity: quantity,
            asset_ids: productAssetIds.filter((id) => id.trim() !== ""), // Include non-empty asset IDs
          };
        });

      // Check if there are any items to submit
      if (items.length === 0) {
        throw new Error("Please add at least one product with quantity > 0");
      }

      const payload = {
        goods_receipt_id: formData.goodsReceiptId || `GR-${Date.now()}`,
        vendor_invoice_number:
          formData.vendorInvoiceNumber || `INV-${Date.now()}`,
        purchase_order_id: selectedPurchaseOrder.purchase_order_id,
        supplier_id: formData.supplier_id,
        purchase_order_status: formData.purchaseOrderStatus,
        goods_receipt_date: formData.goodsReceiptDate,
        purchase_type: formData.purchaseType,
        goods_receipt_status: formData.goodsReceiptStatus,
        description: formData.description,
        items,
      };

      const response = await fetch(`${API_URL}/goods-receipts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create goods receipt");
      }

      setSnackbar({
        open: true,
        message: "Goods Receipt created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/procurement/goodsreceipt");
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
        {/* Goods Receipt Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Goods Receipt Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Goods Receipt ID"
              placeholder="Enter Goods Receipt ID"
              value={formData.goodsReceiptId}
              onChange={(e) =>
                handleInputChange("goodsReceiptId", e.target.value)
              }
            />
            <Field
              label="Vendor Invoice Number"
              placeholder="Enter Vendor Invoice Number"
              value={formData.vendorInvoiceNumber}
              onChange={(e) =>
                handleInputChange("vendorInvoiceNumber", e.target.value)
              }
            />
            <Field
              label="Purchase Order Details"
              type="select"
              value={selectedPurchaseOrder?.id || ""}
              onChange={handlePurchaseOrderChange}
            >
              <option value="">Select Purchase Order</option>
              {purchaseOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.purchase_order_id} - {order.owner}
                </option>
              ))}
            </Field>
            <Field
              label="Purchase Order ID"
              value={formData.purchaseOrderId}
              disabled
            />
            <Field
              label="Purchase Order Status"
              value={formData.purchaseOrderStatus}
              disabled
            />
            <Field
              label="Goods Receipt Date"
              type="date"
              value={formData.goodsReceiptDate}
              onChange={(e) =>
                handleInputChange("goodsReceiptDate", e.target.value)
              }
            />
            <Field
              label="Purchase Type"
              value={formData.purchaseType}
              disabled
            />
            <Field
              label="Goods Receipt Status*"
              type="select"
              placeholder="Select Status"
              options={["Pending", "Approved", "Rejected"]}
              value={formData.goodsReceiptStatus}
              onChange={(e) =>
                handleInputChange("goodsReceiptStatus", e.target.value)
              }
            />
            <Field
              label="Owner"
              placeholder="Enter Owner"
              value={formData.owner}
              onChange={(e) => handleInputChange("owner", e.target.value)}
            />
          </div>
        </div>

        {/* Column 2: Supplier Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Supplier Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            {formData.isSupplierLocked ? (
              <Field label="Supplier" value={formData.supplierName} disabled />
            ) : (
              <Field
                label="Supplier"
                type="select"
                placeholder="Select Supplier"
                value={formData.supplier_id}
                onChange={(e) =>
                  handleInputChange("supplier_id", e.target.value)
                }
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </Field>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📝</div>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>Selected Products</h3>
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

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                      <TableCell padding="checkbox" sx={{ color: "#fff" }}>
                        <Checkbox sx={{ color: "#fff" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#fff" }}>Product Name</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Brand</TableCell>
                      <TableCell sx={{ color: "#fff" }}>
                        Specifications
                      </TableCell>
                      <TableCell sx={{ color: "#fff" }}>
                        Price per Piece
                      </TableCell>
                      <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Asset IDs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
  {filteredProducts
    .filter((product) => selectedProductIds.includes(product.id))
    .map((product) => (
      <TableRow key={product.id}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedProductIds.includes(product.id)}
            onChange={() => {
              setSelectedProductIds((prev) =>
                prev.includes(product.id)
                  ? prev.filter((id) => id !== product.id)
                  : [...prev, product.id]
              );
            }}
          />
        </TableCell>
        <TableCell>{product.product_name}</TableCell>
        <TableCell>{product.brand}</TableCell>
        <TableCell>
          <div><strong>Model:</strong> {product.model}</div>
          <div><strong>Processor:</strong> {product.processor}</div>
          <div><strong>RAM:</strong> {product.ram}</div>
          <div><strong>Storage:</strong> {product.storage}</div>
          <div><strong>Graphics:</strong> {product.graphics}</div>
        </TableCell>
        <TableCell>
          {/* <div><strong>Day:</strong> ₹{product.rent_price_per_day}</div> */}
          <div><strong>Month:</strong> ₹{product.rent_price_per_month}</div>
          {/* <div><strong>6 Months:</strong> ₹{product.rent_price_6_months}</div>
          <div><strong>1 Year:</strong> ₹{product.rent_price_1_year}</div> */}
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <IconButton size="small" onClick={() => decrementQty(product.id)}>
              <Remove fontSize="small" />
            </IconButton>
            <TextField
              type="number"
              size="small"
              value={quantities[product.id] || ""}
              onChange={(e) =>
                handleQtyChange(product.id, e.target.value)
              }
              inputProps={{
                min: 0,
                style: { width: 50, textAlign: "center" },
              }}
            />
            <IconButton size="small" onClick={() => incrementQty(product.id)}>
              <Add fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
        <TableCell>
          {quantities[product.id] > 0 && (
            <Box display="flex" flexDirection="column" gap={1}>
              {(assetIds[product.id] || []).map((id, idx) => (
                <TextField
                  key={idx}
                  size="small"
                  placeholder={`Asset ID ${idx + 1}`}
                  value={id}
                  onChange={(e) => {
                    const updated = [...(assetIds[product.id] || [])];
                    updated[idx] = e.target.value;
                    setAssetIds((prev) => ({
                      ...prev,
                      [product.id]: updated,
                    }));
                    if (assetIdErrors[product.id]) {
                      setAssetIdErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[product.id];
                        return newErrors;
                      });
                    }
                  }}
                  error={Boolean(assetIdErrors[product.id])}
                  helperText={idx === 0 ? assetIdErrors[product.id] : ""}
                />
              ))}
              {(assetIds[product.id]?.length || 0) <
                (quantities[product.id] || 0) && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setAssetIds((prev) => ({
                      ...prev,
                      [product.id]: [...(prev[product.id] || []), ""],
                    }))
                  }
                >
                  + Add Asset ID
                </Button>
              )}
            </Box>
          )}
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
          onClick={() => navigate("/dashboard/procurement/goodsreceipt")}
        >
          Cancel
        </button>
        <button style={createBtnStyle} onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  type = "text",
  value = "",
  disabled = false,
  options = [],
  onChange,
  children,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
          disabled={disabled}
          value={value}
          onChange={onChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))
            : children}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        style={inputStyle}
        onChange={onChange}
      />
    )}
  </div>
);

// Styles
const containerStyle = {
  padding: "2rem",
  fontFamily: '"Inter", "Segoe UI", sans-serif',
};

const formContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1.5rem",
  marginBottom: "1.5rem",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e2e8f0",
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
};

const cardHeaderStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  margin: 0,
};

const fieldsGridStyle = {
  display: "grid",
  gap: "1rem",
};

const fieldContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "0.5rem",
  fontWeight: "500",
  fontSize: "0.875rem",
};

const inputStyle = {
  padding: "0.625rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "0.875rem",
  width: "100%",
};

const selectWrapperStyle = {
  position: "relative",
  width: "100%",
};

const selectStyle = {
  width: "100%",
  padding: "0.625rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  appearance: "none",
  fontSize: "0.875rem",
  backgroundColor: "#fff",
};

const selectArrowStyle = {
  position: "absolute",
  right: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "#4b5563",
};

const buttonContainerStyle = {
  marginTop: "2.5rem",
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
};

const cancelBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
};

const createBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
};

export default GoodsReceiptsAddLayout;
