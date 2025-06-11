import React, { useState, useEffect } from "react";
import API_URL from "../../../api/Api_url";
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

const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PO-${randomPart}`;
};


const PurchaseOrderAddLayout = () => {
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

  console.log(formData,"kkkkkkkkkkkkkkkkkk");
  

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
  setFormData(prev => ({
    ...prev,
    purchaseOrderId: generateRandomId()
  }));

  // You can also include your fetch calls here if needed
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved purchase quotations
        const pqResponse = await fetch(
          `${API_URL}/purchase-quotation/approved`
        );
        if (!pqResponse.ok)
          throw new Error("Failed to fetch purchase quotations");
        const pqData = await pqResponse.json();
        setPurchaseQuotations(pqData);

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

  const handlePurchaseQuotationChange = (e) => {
    const selectedId = e.target.value;
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

  const handleSubmit = async () => {
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
        headers: { "Content-Type": "application/json" },
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
            />
            <Field
              label="Purchase Quotation"
              type="select"
              placeholder="Select Purchase Quotation"
              value={selectedPurchaseQuotation?.id || ""}
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
              value={
                formData.supplierName || "Select a purchase quotation first"
              }
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
                        <Checkbox
                          sx={{ color: "#fff" }}
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
                      <TableCell sx={{ color: "#fff" }}>Product Name</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Brand</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Model</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Processor</TableCell>
                      <TableCell sx={{ color: "#fff" }}>RAM</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Storage</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Graphics</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
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
                            >
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
                            <IconButton
                              size="small"
                              onClick={() => incrementQty(product.id)}
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
        <button style={cancelBtnStyle}>Cancel</button>
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
