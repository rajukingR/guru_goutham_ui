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
import { generateSpecifications } from "../../../utils/generateSpecifications";

const generateRandomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PQ-${code}`;
};

const PoOperationAddPageLayout = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    purchaseQuotationId: generateRandomId(),
    purchaseRequestId: "",
    purchaseQuotationDate: new Date().toISOString().split("T")[0],
    purchaseType: "",
    poQuotationStatus: "Pending",
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
    purchaseRequests: true,
    suppliers: true,
    products: true,
  });
  const [error, setError] = useState({
    purchaseRequests: "",
    suppliers: "",
    products: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    purchaseRequestId: "",
    poQuotationStatus: "",
    owner: "",
    description: "",
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
        const prResponse = await fetch(
          `${API_URL}/purchase-requests/approved`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!prResponse.ok)
          throw new Error("Failed to fetch purchase requests");
        const prData = await prResponse.json();
        setPurchaseRequests(prData);

        const supResponse = await fetch(`${API_URL}/supplier/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!supResponse.ok) throw new Error("Failed to fetch suppliers");
        const supData = await supResponse.json();
        setSuppliers(supData);

        const prodResponse = await fetch(`${API_URL}/product-templete/without-active`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!prodResponse.ok) throw new Error("Failed to fetch products");

        const prodData = await prodResponse.json();

        // ✅ Filter out "Assembled PC" category
        const filteredProdData = prodData.filter(
          (product) => product.product_category !== "Assembled PC"
        );

        setProducts(filteredProdData);

        setLoading({
          purchaseRequests: false,
          suppliers: false,
          products: false,
        });
      } catch (err) {
        setError({
          purchaseRequests: err.message,
          suppliers: err.message,
          products: err.message,
        });
        setLoading({
          purchaseRequests: false,
          suppliers: false,
          products: false,
        });
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {
      purchaseRequestId: !formData.purchaseRequestId
        ? "Purchase Request is required"
        : "",
      poQuotationStatus: !formData.poQuotationStatus
        ? "Status is required"
        : "",
      products:
        selectedProductIds.length === 0
          ? "At least one product is required"
          : "",
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handlePurchaseRequestChange = (e) => {
    const selectedId = e.target.value;
    setValidationErrors((prev) => ({ ...prev, purchaseRequestId: "" }));

    if (!selectedId) {
      setSelectedPurchaseRequest(null);
      setFormData((prev) => ({
        ...prev,
        purchaseRequestId: "",
        purchaseType: "",
        purchaseRequestStatus: "",
        owner: "",
        supplierId: "",
        supplierName: "",
        description: "",
        isSupplierLocked: false,
      }));
      setSelectedProductIds([]);
      return;
    }

    const selectedRequest = purchaseRequests.find(
      (req) => req.id.toString() === selectedId
    );
    setSelectedPurchaseRequest(selectedRequest);

    const supplier = suppliers.find(
      (s) => s.id === selectedRequest.supplier_id
    );
    const supplierName = supplier ? supplier.supplier_name : "No Supplier name";

    setFormData((prev) => ({
      ...prev,
      purchaseRequestId: selectedRequest.purchase_request_id,
      purchaseType: selectedRequest.purchase_type,
      purchaseRequestStatus: selectedRequest.purchase_request_status,
      owner: selectedRequest.owner,
      supplier_id: selectedRequest.supplier_id,
      supplierName: supplierName,
      description: selectedRequest.description,
      isSupplierLocked: true,
    }));

    const productIds = selectedRequest.selected_products.map(
      (item) => item.product_id
    );
    setSelectedProductIds(productIds);

    const newQuantities = {};
    selectedRequest.selected_products.forEach((item) => {
      newQuantities[item.product_id] = item.quantity;
    });
    setQuantities(newQuantities);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));
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
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      const payload = {
        purchase_quotation_id: formData.purchaseQuotationId,
        purchase_request_id: formData.purchaseRequestId,
        supplier_id: formData.supplier_id,
        purchase_quotation_date: formData.purchaseQuotationDate,
        purchase_type: formData.purchaseType,
        po_quotation_status: formData.poQuotationStatus,
        owner: formData.owner,
        description: formData.description,
        selected_products: selectedProductIds.map((id) => {
          const product = products.find((p) => p.id === id);
          const quantity = quantities[id] || 0;
          const price_per_unit = product?.rent_price_per_month || 0;
          const gst_percentage = product?.gst_percentage || 18;
          const total_price = product?.purchase_price || 0;

          return {
            product_id: id,
            product_name: product?.product_name || "",
            quantity,
            price_per_unit,
            gst_percentage,
            total_price,
          };
        }),
      };

      const response = await fetch(`${API_URL}/purchase-quotation/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create purchase quotation"
        );
      }

      setSnackbar({
        open: true,
        message: "Purchase quotation created successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard/procurement/po-quotations");
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

      <h2 style={headingStyle}>Create Purchase Quotation</h2>

      <div style={formSectionStyle}>
        {/* Column 1: Quotation Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Quotation Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Purchase Quotation ID"
              placeholder="Enter Purchase Quotation ID"
              value={formData.purchaseQuotationId}
              onChange={(e) =>
                handleInputChange("purchaseQuotationId", e.target.value)
              }
              disabled
            />

            <Field
              label="Purchase Request Details"
              type="select"
              placeholder="Select Purchase Request"
              onChange={handlePurchaseRequestChange}
              value={selectedPurchaseRequest?.id || ""}
              error={validationErrors.purchaseRequestId}
              required
            >
              <option value="">Select Purchase Request</option>
              {purchaseRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.purchase_request_id} |{" "}
                  {request.supplier.supplier_name}
                </option>
              ))}
            </Field>

            <Field
              label="Purchase Receipt ID"
              value={formData.purchaseRequestId}
              InputProps={{ readOnly: true }}
            />

            <Field
              label="Purchase Request Status"
              placeholder="Pending"
              value={formData.purchaseRequestStatus}
              disabled
            />

            <Field
              label="Purchase Quotation Date"
              type="date"
              value={formData.purchaseQuotationDate}
              onChange={(e) =>
                handleInputChange("purchaseQuotationDate", e.target.value)
              }
            />

            <Field
              label="Purchase Type"
              placeholder="Buy"
              value={formData.purchaseType}
              disabled
            />

            <Field
              label="PO Quotation Status*"
              type="select"
              placeholder="Pending"
              value={formData.poQuotationStatus}
              onChange={(e) =>
                handleInputChange("poQuotationStatus", e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Field>

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
              <Field
                label="Supplier"
                value={formData.supplierName}
                lockedValueDisplay={formData.supplierName}
              />
            ) : (
              <Field
                label="Supplier"
                type="select"
                placeholder="Select Supplier"
                value={formData.supplierId}
                onChange={(e) =>
                  handleInputChange("supplierId", e.target.value)
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

        {/* Column 3: Additional Info */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>ℹ️</div>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Description"
              placeholder="Enter Description"
              type="textarea"
              style={{ gridColumn: "1 / -1" }}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
                        Price per Piece
                      </TableCell>
                      {/* ✅ New column */}
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
                          <TableCell>{generateSpecifications(product)}</TableCell>
                          <TableCell>
                            <>
                              {/* <div><strong>Day:</strong> ₹{product.rent_price_per_day}</div> */}

                              {product.purchase_price}
                              {/* <div><strong>6 Months:</strong> ₹{product.rent_price_6_months}</div>
    <div><strong>1 Year:</strong> ₹{product.rent_price_1_year}</div> */}
                            </>
                          </TableCell>

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
  disabled = false,
  style,
  children,
  onChange,
  lockedValueDisplay,
  error,
  required = false,
}) => (
  <div style={{ ...fieldContainerStyle, ...style }}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
    {lockedValueDisplay ? (
      <div
        style={{
          padding: "0.75rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
        }}
      >
        {lockedValueDisplay}
      </div>
    ) : type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={{
            ...selectStyle,
            borderColor: error ? "red" : "#d1d5db",
          }}
          value={value}
          disabled={disabled}
          onChange={onChange}
        >
          {children || <option value="">{placeholder}</option>}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        style={{
          ...inputStyle,
          height: "80px",
          borderColor: error ? "red" : "#d1d5db",
        }}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: error ? "red" : "#d1d5db",
        }}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    )}
    {error && (
      <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
        {error}
      </div>
    )}
  </div>
);

// Styles (same as in your original code)
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
  maxWidth: "1400px",
};

const headingStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "1.5rem",
};

const formSectionStyle = {
  display: "flex",
  gap: "1.5rem",
  marginBottom: "1.5rem",
};

const cardStyle = {
  flex: 1,
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
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
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
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
};

export default PoOperationAddPageLayout;
