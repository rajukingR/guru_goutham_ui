import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  CircularProgress,
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";
import { generateSpecifications } from "../../../utils/generateSpecifications";

const POQuotationEdit = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    purchaseQuotationId: "",
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
    initial: true,
    submission: false,
  });
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading((prev) => ({ ...prev, initial: true }));

        // Fetch all necessary data in parallel
        const [prResponse, supResponse, prodResponse] = await Promise.all([
          fetch(`${API_URL}/purchase-requests/approved`, {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }),
          fetch(`${API_URL}/supplier/list`, {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }),
          fetch(`${API_URL}/product-templete/without-active`, {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }),
        ]);

        if (!prResponse.ok)
          throw new Error("Failed to fetch purchase requests");
        if (!supResponse.ok) throw new Error("Failed to fetch suppliers");
        if (!prodResponse.ok) throw new Error("Failed to fetch products");

        const [prData, supData, prodData] = await Promise.all([
          prResponse.json(),
          supResponse.json(),
          prodResponse.json(),
        ]);

        const filteredProdData = prodData.filter(
          (product) => product.product_category !== "Assembled PC"
        );

        setPurchaseRequests(prData);
        setSuppliers(supData);
        setProducts(filteredProdData); // ✅ Set filtered product data here

        // If in edit mode, fetch the existing quotation
        if (isEditMode) {
          const quoteResponse = await fetch(
            `${API_URL}/purchase-quotation/${id}`,
            {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }
          );
          if (!quoteResponse.ok)
            throw new Error("Failed to fetch quotation data");
          const quoteData = await quoteResponse.json();

          // Find the associated purchase request
          const associatedRequest = prData.find(
            (req) => req.purchase_request_id === quoteData.purchase_request_id
          );

          // Find supplier details
          const supplier = supData.find((s) => s.id === quoteData.supplier_id);
          const supplierName =
            quoteData.supplier?.supplier_name || "No Supplier name";

          setFormData({
            purchaseQuotationId: quoteData.purchase_quotation_id,
            purchaseRequestId: quoteData.purchase_request_id,
            purchaseQuotationDate:
              quoteData.purchase_quotation_date.split("T")[0],
            purchaseType: quoteData.purchase_type,
            poQuotationStatus: quoteData.po_quotation_status,
            owner: quoteData.owner,
            supplier_id: quoteData.supplier_id,
            supplierName: supplierName,
            description: quoteData.description,
            isSupplierLocked: true,
          });

          if (associatedRequest) {
            setSelectedPurchaseRequest(associatedRequest);
          }

          // Set selected products and quantities from the quotation
          const productIds = quoteData.selected_products.map(
            (item) => item.product_id
          );
          setSelectedProductIds(productIds);

          const newQuantities = {};
          quoteData.selected_products.forEach((item) => {
            newQuantities[item.product_id] = item.quantity;
          });
          setQuantities(newQuantities);
        }

        setLoading((prev) => ({ ...prev, initial: false }));
      } catch (err) {
        setError(err.message);
        setSnackbar({
          open: true,
          message: `Failed to load data: ${err.message}`,
          severity: "error",
        });
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  const handlePurchaseRequestChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setSelectedPurchaseRequest(null);
      setFormData((prev) => ({
        ...prev,
        purchaseRequestId: "",
        owner: "",
        supplier_id: "",
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
      owner: selectedRequest.owner,
      supplier_id: selectedRequest.supplier_id,
      supplierName: supplierName,
      description: selectedRequest.description || "",
      isSupplierLocked: true,
    }));

    // Set selected products and quantities from the purchase request
    const productIds =
      selectedRequest.selected_products?.map((item) => item.product_id) || [];
    setSelectedProductIds(productIds);

    const newQuantities = {};
    selectedRequest.selected_products?.forEach((item) => {
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
      setLoading((prev) => ({ ...prev, submission: true }));

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

      const url = isEditMode
        ? `${API_URL}/purchase-quotation/${id}`
        : `${API_URL}/purchase-quotation/create`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process request");
      }

      setSnackbar({
        open: true,
        message: isEditMode
          ? "Purchase quotation updated successfully!"
          : "Purchase quotation created successfully!",
        severity: "success",
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/dashboard/procurement/po-quotations");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/procurement/po-quotations");
  };

  if (loading.initial) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Calculate total amount
  const totalAmount = selectedProductIds.reduce((sum, productId) => {
    const product = products.find((p) => p.id === productId);
    const quantity = quantities[productId] || 0;
    const price = product?.unit_price || 0;
    const gst = product?.gst_percentage || 18;
    return sum + quantity * price * (1 + gst / 100);
  }, 0);

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

      <h2 style={headingStyle}>
        {isEditMode
          ? `Edit Purchase Quotation - ${formData.purchaseQuotationId}`
          : "Create Purchase Quotation"}
      </h2>

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
              value={formData.purchaseQuotationId}
              onChange={(e) =>
                handleInputChange("purchaseQuotationId", e.target.value)
              }
              disabled={isEditMode}
            />

            <Field
              label="Purchase Request"
              type="select"
              onChange={handlePurchaseRequestChange}
              value={selectedPurchaseRequest?.id || ""}
              disabled={isEditMode}
            >
              <option value="">Select Purchase Request</option>
              {purchaseRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.purchase_request_id} | {request.owner}
                </option>
              ))}
            </Field>

            <Field
              label="Purchase Request ID"
              value={formData.purchaseRequestId}
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
              value={formData.purchaseType}
              disabled
            />

            <Field
              label="PO Quotation Status"
              type="select"
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
            <Field
              label="Supplier Name"
              value={formData.supplierName}
              lockedValueDisplay={formData.supplierName}
            />
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
              type="textarea"
              style={{ gridColumn: "1 / -1" }}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Selected Products Section */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>Selected Products</h3>
        </div>

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
        {/* Product selection table (shown when editing) */}
        {showProductTable && (
          <Box
            p={2}
            style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
          >
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
          indeterminate={
            selectedProductIds.length > 0 &&
            selectedProductIds.length < products.length
          }
          checked={
            selectedProductIds.length === products.length &&
            products.length > 0
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProductIds(products.map((p) => p.id));
            } else {
              setSelectedProductIds([]);
            }
          }}
        />
      </TableCell>
      <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
        Product Name
      </TableCell>
      <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
        Specifications
      </TableCell>
      <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
        Price per Piece
      </TableCell>
      {/* ✅ New column */}
      <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
        Quantity
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {/* Sort products: selected first, then unselected */}
    {filteredProducts
      .slice() // Create a copy to avoid mutating the original
      .sort((a, b) => {
        const aSelected = selectedProductIds.includes(a.id);
        const bSelected = selectedProductIds.includes(b.id);
        
        // If both are selected or both are unselected, maintain original order
        if (aSelected === bSelected) return 0;
        
        // If a is selected and b is not, a comes first
        if (aSelected && !bSelected) return -1;
        
        // If b is selected and a is not, b comes first
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
              {product.purchase_price}
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

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={handleCancel}>
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onClick={handleSubmit}
          disabled={loading.submission}
        >
          {loading.submission ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            "Update Quotation"
          ) : (
            "Create Quotation"
          )}
        </button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  type = "text",
  value,
  disabled = false,
  style,
  children,
  onChange,
  lockedValueDisplay,
}) => (
  <div style={{ ...fieldContainerStyle, ...style }}>
    <label style={labelStyle}>{label}</label>
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
          style={selectStyle}
          value={value}
          disabled={disabled}
          onChange={onChange}
        >
          {children}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "textarea" ? (
      <textarea
        style={{ ...inputStyle, height: "80px" }}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    ) : (
      <input
        type={type}
        style={inputStyle}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    )}
  </div>
);

// Styles remain the same as in the previous implementation
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
  maxWidth: "1400px",
  margin: "0 auto",
};

const headingStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "1.5rem",
};

const formSectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
  marginBottom: "1.5rem",
};

const cardStyle = {
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
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#e5e7eb",
  },
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
  "&:hover": {
    backgroundColor: "#1d4ed8",
  },
  "&:disabled": {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
};

export default POQuotationEdit;
