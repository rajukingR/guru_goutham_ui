import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Button
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

import API_URL from "../../../api/Api_url";

const GoodsReceiptsEditLayout = () => {
  const { id } = useParams();
  const [goodsReceipt, setGoodsReceipt] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [assetIds, setAssetIds] = useState({});
  const [assetIdErrors, setAssetIdErrors] = useState({});
  const [supplierName, setSupplierName] = useState("");
  const [formData, setFormData] = useState({
    goods_receipt_id: "",
    vendor_invoice_number: "",
    purchase_order_id: "",
    purchase_order_status: "",
    goods_receipt_date: new Date().toISOString().split("T")[0],
    purchase_type: "Buy",
    goods_receipt_status: "Pending",
    supplier_id: "",
    description: "",
  });
  
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [loading, setLoading] = useState({
    goodsReceipt: true,
    purchaseOrders: true,
    suppliers: true,
    products: true,
  });
  const [error, setError] = useState({
    goodsReceipt: "",
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
        // Fetch existing goods receipt
        const grResponse = await fetch(`${API_URL}/goods-receipts/${id}`);
        if (!grResponse.ok) throw new Error("Failed to fetch goods receipt");
        const grData = await grResponse.json();
        setGoodsReceipt(grData);
        
        // Pre-fill form with existing goods receipt data
        setFormData({
          goods_receipt_id: grData.goods_receipt_id,
          vendor_invoice_number: grData.vendor_invoice_number,
          purchase_order_id: grData.purchase_order_id,
          purchase_order_status: grData.purchase_order_status,
          goods_receipt_date: grData.goods_receipt_date.split('T')[0],
          purchase_type: grData.purchase_type || "Buy",
          goods_receipt_status: grData.goods_receipt_status || "Pending",
          supplier_id: grData.supplier_id,
          description: grData.description,
        });

        // Initialize quantities, selected products, and asset IDs
        const newQuantities = {};
        const newSelectedProducts = [];
        const newAssetIds = {};
        
        // Process selected_products from API response
        if (grData.selected_products && grData.selected_products.length > 0) {
          grData.selected_products.forEach(item => {
            newQuantities[item.product_id] = item.quantity;
            newSelectedProducts.push(item.product_id);
            if (item.asset_ids && item.asset_ids.length > 0) {
              newAssetIds[item.product_id] = item.asset_ids;
            } else {
              // Initialize empty array if no asset IDs exist
              newAssetIds[item.product_id] = Array(item.quantity).fill("");
            }
          });
        }

        setQuantities(newQuantities);
        setSelectedProductIds(newSelectedProducts);
        setAssetIds(newAssetIds);

        // Fetch purchase orders
        const poResponse = await fetch(`${API_URL}/purchase-orders`);
        if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
        const poData = await poResponse.json();
        setPurchaseOrders(poData);

         // Fetch supplier name if supplier_id exists
      if (grData.supplier_id) {
        const supplierResponse = await fetch(`${API_URL}/supplier/${grData.supplier_id}`);
        if (supplierResponse.ok) {
          const supplierData = await supplierResponse.json();
          setSupplierName(supplierData.supplier_name);
        }
      }
        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`);
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();
        setProducts(prodData);

        setLoading({
          goodsReceipt: false,
          purchaseOrders: false,
          suppliers: false,
          products: false,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError({
          goodsReceipt: err.message,
          purchaseOrders: err.message,
          suppliers: err.message,
          products: err.message,
        });
        setLoading({
          goodsReceipt: false,
          purchaseOrders: false,
          suppliers: false,
          products: false,
        });
      }
    };

    fetchData();
  }, [id]);

  const handlePurchaseOrderChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData(prev => ({
        ...prev,
        purchase_order_id: "",
        purchase_order_status: "",
        supplier_id: "",
        description: "",
      }));
      setSelectedProductIds([]);
      return;
    }

    const selectedOrder = purchaseOrders.find(
      order => order.purchase_order_id === selectedId
    );

    if (selectedOrder) {
      setFormData(prev => ({
        ...prev,
        purchase_order_id: selectedOrder.purchase_order_id,
        purchase_order_status: selectedOrder.po_status,
        supplier_id: selectedOrder.supplier_id,
        description: selectedOrder.description,
      }));

      // Initialize quantities and selected products
      const newQuantities = {};
      const newSelectedProducts = [];
      const newAssetIds = {};

      if (selectedOrder.selected_products && selectedOrder.selected_products.length > 0) {
        selectedOrder.selected_products.forEach(item => {
          newQuantities[item.product_id] = item.quantity;
          newSelectedProducts.push(item.product_id);
          newAssetIds[item.product_id] = Array(item.quantity).fill("");
        });
      }

      setQuantities(newQuantities);
      setSelectedProductIds(newSelectedProducts);
      setAssetIds(newAssetIds);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredProducts = products.filter(
    product =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQtyChange = (id, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities(prev => ({ ...prev, [id]: qty }));
    
    // Adjust asset IDs array when quantity changes
    if (qty < (assetIds[id]?.length || 0)) {
      setAssetIds(prev => ({
        ...prev,
        [id]: prev[id]?.slice(0, qty) || []
      }));
    } else if (qty > (assetIds[id]?.length || 0)) {
      setAssetIds(prev => ({
        ...prev,
        [id]: [...(prev[id] || []), ...Array(qty - (prev[id]?.length || 0)).fill("")]
      }));
    }
  };

  const incrementQty = (id) => {
    const newQty = (quantities[id] || 0) + 1;
    setQuantities(prev => ({ ...prev, [id]: newQty }));
    setAssetIds(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), ""]
    }));
  };

  const decrementQty = (id) => {
    const newQty = Math.max(0, (quantities[id] || 0) - 1);
    setQuantities(prev => ({ ...prev, [id]: newQty }));
    if (newQty < (assetIds[id]?.length || 0)) {
      setAssetIds(prev => ({
        ...prev,
        [id]: prev[id].slice(0, newQty)
      }));
    }
  };

  const validateAssetIds = () => {
    const errors = {};
    let isValid = true;

    Object.entries(quantities).forEach(([productId, qty]) => {
      if (qty > 0) {
        const currentAssetIds = assetIds[productId] || [];
        
        if (currentAssetIds.length !== qty) {
          errors[productId] = `Please enter exactly ${qty} asset ID(s)`;
          isValid = false;
        }
        
        currentAssetIds.forEach((id, index) => {
          if (!id.trim()) {
            errors[productId] = `Asset ID ${index + 1} cannot be empty`;
            isValid = false;
          }
        });
        
        const uniqueIds = new Set(currentAssetIds.map(id => id.trim().toLowerCase()));
        if (uniqueIds.size !== currentAssetIds.length) {
          errors[productId] = "Duplicate asset IDs found";
          isValid = false;
        }
      }
    });

    setAssetIdErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      if (!goodsReceipt) {
        throw new Error("Goods receipt data not loaded");
      }

      if (!validateAssetIds()) {
        throw new Error("Please fix all asset ID errors before submitting");
      }
      
      // Prepare items with asset IDs
      const items = selectedProductIds
        .filter(productId => quantities[productId] > 0)
        .map(productId => {
          const product = products.find(p => p.id === productId);
          return {
            product_id: productId,
            product_name: product?.product_name || "",
            quantity: quantities[productId] || 0,
            asset_ids: (assetIds[productId] || []).filter(id => id.trim() !== "")
          };
        });

      if (items.length === 0) {
        throw new Error("Please add at least one product with quantity > 0");
      }

      const payload = {
        ...formData,
        items
      };

      const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update goods receipt");
      }

      setSnackbar({
        open: true,
        message: "Goods Receipt updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate('/dashboard/procurement/goodsreceipt');
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  if (loading.goodsReceipt) {
    return <div>Loading goods receipt data...</div>;
  }

  if (error.goodsReceipt) {
    return <div>Error: {error.goodsReceipt}</div>;
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
              value={formData.goods_receipt_id}
              onChange={(e) => handleInputChange("goods_receipt_id", e.target.value)}
            />
            <Field 
              label="Vendor Invoice Number" 
              placeholder="Enter Vendor Invoice Number" 
              value={formData.vendor_invoice_number}
              onChange={(e) => handleInputChange("vendor_invoice_number", e.target.value)}
            />
            <Field 
              label="Purchase Order" 
              type="select" 
              placeholder="Select Purchase Order"
              value={formData.purchase_order_id}
              onChange={handlePurchaseOrderChange}
            >
              <option value="">Select Purchase Order</option>
              {purchaseOrders.map((order) => (
                <option key={order.id} value={order.purchase_order_id}>
                  {order.purchase_order_id}
                </option>
              ))}
            </Field>
            <Field 
              label="Purchase Order Status" 
              value={formData.purchase_order_status} 
              disabled 
            />
            <Field 
              label="Goods Receipt Date" 
              type="date" 
              value={formData.goods_receipt_date}
              onChange={(e) => handleInputChange("goods_receipt_date", e.target.value)}
            />
            <Field 
              label="Purchase Type" 
              value={formData.purchase_type} 
              disabled 
            />
            <Field 
              label="Goods Receipt Status*" 
              type="select" 
              placeholder="Select Status" 
              options={["Pending", "Approved", "Rejected"]}
              value={formData.goods_receipt_status}
              onChange={(e) => handleInputChange("goods_receipt_status", e.target.value)}
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
    label="Supplier"
    type="select"
    value={formData.supplier_id}
    onChange={(e) => handleInputChange("supplier_id", e.target.value)}
  >
    <option value="">Select Supplier</option>
    {suppliers.map(supplier => (
      <option key={supplier.id} value={supplier.id}>
        {supplier.supplier_name}
      </option>
    ))}
    {formData.supplier_id && !suppliers.some(s => s.id === formData.supplier_id) && (
      <option value={formData.supplier_id} selected>
        {supplierName || "Loading..."}
      </option>
    )}
  </Field>
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
              multiline
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Select Products Section */}
    <Box mt={4}>
        <Button
          variant="contained"
          onClick={() => setShowProductTable(!showProductTable)}
          sx={{ mb: 2 }}
        >
          {showProductTable ? "Hide Product List" : "Edit Products"}
        </Button>

        {showProductTable && (
          <Box p={2} border={1} borderColor="divider" borderRadius={1}>
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
                  <TableRow sx={{ backgroundColor: "primary.main" }}>
                    <TableCell padding="checkbox" sx={{ color: "common.white" }}>
                      <Checkbox sx={{ color: "common.white" }} />
                    </TableCell>
                    <TableCell sx={{ color: "common.white" }}>Product Name</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Brand</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Model</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Processor</TableCell>
                    <TableCell sx={{ color: "common.white" }}>RAM</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Storage</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Graphics</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Quantity</TableCell>
                    <TableCell sx={{ color: "common.white" }}>Asset IDs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => {
                            setSelectedProductIds(prev =>
                              prev.includes(product.id)
                                ? prev.filter(id => id !== product.id)
                                : [...prev, product.id]
                            );
                            // Initialize asset IDs when selecting a product
                            if (!selectedProductIds.includes(product.id)) {
                              setAssetIds(prev => ({
                                ...prev,
                                [product.id]: Array(quantities[product.id] || 1).fill("")
                              }));
                            }
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
                            disabled={!selectedProductIds.includes(product.id)}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            type="number"
                            size="small"
                            value={quantities[product.id] || 0}
                            onChange={(e) =>
                              handleQtyChange(product.id, e.target.value)
                            }
                            inputProps={{
                              min: 0,
                              style: { width: 50, textAlign: "center" },
                            }}
                            disabled={!selectedProductIds.includes(product.id)}
                          />
                          <IconButton
                            size="small"
                            onClick={() => incrementQty(product.id)}
                            disabled={!selectedProductIds.includes(product.id)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {selectedProductIds.includes(product.id) && quantities[product.id] > 0 && (
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
                                  setAssetIds(prev => ({
                                    ...prev,
                                    [product.id]: updated
                                  }));
                                  // Clear error when user types
                                  if (assetIdErrors[product.id]) {
                                    setAssetIdErrors(prev => {
                                      const newErrors = {...prev};
                                      delete newErrors[product.id];
                                      return newErrors;
                                    });
                                  }
                                }}
                                error={Boolean(assetIdErrors[product.id])}
                                helperText={idx === 0 ? assetIdErrors[product.id] : ''}
                              />
                            ))}
                            {(assetIds[product.id]?.length || 0) < (quantities[product.id] || 0) && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  setAssetIds(prev => ({
                                    ...prev,
                                    [product.id]: [...(prev[product.id] || []), ""]
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
      </Box>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button 
          style={cancelBtnStyle}
          onClick={() => navigate('/dashboard/procurement/goodsreceipt')}
        >
          Cancel
        </button>
        <button 
          style={createBtnStyle}
          onClick={handleSubmit}
        >
          Update Goods Receipt
        </button>
      </div>
    </div>
  );
};

const Field = ({ 
  label, 
  placeholder, 
  type = 'text', 
  value = '', 
  disabled = false, 
  options = [], 
  onChange,
  children,
  multiline = false,
  rows = 1
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select 
          style={selectStyle} 
          disabled={disabled} 
          value={value}
          onChange={onChange}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.length > 0 ? (
            options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))
          ) : (
            children
          )}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        style={multiline ? textareaStyle : inputStyle}
        onChange={onChange}
        rows={rows}
        multiline={multiline ? "true" : undefined}
        as={multiline ? "textarea" : undefined}
      />
    )}
  </div>
);

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", sans-serif',
};

const formContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem',
  marginBottom: '1.5rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
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
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  margin: 0,
};

const fieldsGridStyle = {
  display: 'grid',
  gap: '1rem',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem',
};

const inputStyle = {
  padding: '0.625rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '0.875rem',
  width: '100%',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '80px',
  resize: 'vertical',
};

const selectWrapperStyle = {
  position: 'relative',
  width: '100%',
};

const selectStyle = {
  width: '100%',
  padding: '0.625rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  appearance: 'none',
  fontSize: '0.875rem',
  backgroundColor: '#fff',
};

const selectArrowStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#4b5563',
};

const buttonContainerStyle = {
  marginTop: '2.5rem',
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
};

export default GoodsReceiptsEditLayout;