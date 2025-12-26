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
  FormControlLabel,
  Switch,
  CircularProgress, // Added for loading state
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";
import { generateSpecifications } from "../../../utils/generateSpecifications";

const generateRandomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GR-${randomPart}`;
};

const GoodsReceiptsAddLayout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const userToken = token;

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [assetIds, setAssetIds] = useState({});
  const [assetIdErrors, setAssetIdErrors] = useState({});
  const [usePurchaseOrder, setUsePurchaseOrder] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    purchaseOrderId: "",
    goodsReceiptStatus: "",
    owner: "",
    description: "",
    products: "",
    vendorInvoiceNumber: "",
  });

  const [formData, setFormData] = useState({
    goodsReceiptId: generateRandomId(),
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

  // Enhanced loading and error states
  const [isLoading, setIsLoading] = useState({
    purchaseOrders: false,
    suppliers: false,
    products: false,
  });
  const [fetchErrors, setFetchErrors] = useState({
    purchaseOrders: null,
    suppliers: null,
    products: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });





  // ========== CRITICAL FIX: Enhanced Data Fetching ==========
  useEffect(() => {
    const fetchAllData = async () => {
      console.log("🔍 Starting data fetch...");

      try {
        // Fetch Purchase Orders
        setIsLoading(prev => ({ ...prev, purchaseOrders: true }));
        const poResponse = await fetch(`${API_URL}/purchase-orders/approved`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        });
        console.log("📋 PO Response Status:", poResponse.status);

        if (!poResponse.ok) {
          const errorText = await poResponse.text();
          setFetchErrors(prev => ({ ...prev, purchaseOrders: `Failed to fetch purchase orders: ${poResponse.status}` }));
        } else {
          const poData = await poResponse.json();
          setPurchaseOrders(poData || []);
          setFetchErrors(prev => ({ ...prev, purchaseOrders: null }));
        }
        setIsLoading(prev => ({ ...prev, purchaseOrders: false }));

        // Fetch Suppliers
        setIsLoading(prev => ({ ...prev, suppliers: true }));
        const supResponse = await fetch(`${API_URL}/supplier`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        });
        console.log("🏢 Supplier Response Status:", supResponse.status);

        if (!supResponse.ok) {
          const errorText = await supResponse.text();
          setFetchErrors(prev => ({ ...prev, suppliers: `Failed to fetch suppliers: ${supResponse.status}` }));
        } else {
          const supData = await supResponse.json();
          setSuppliers(supData || []);
          setFetchErrors(prev => ({ ...prev, suppliers: null }));
        }
        setIsLoading(prev => ({ ...prev, suppliers: false }));

        setIsLoading(prev => ({ ...prev, products: true }));

        const possibleEndpoints = [
          `${API_URL}/product-templete/without-active`,
        ];

        let productsData = [];
        let successfulEndpoint = "";

        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`🔄 Trying product endpoint: ${endpoint}`);
            const response = await fetch(endpoint, {
              headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
              },
            });

            if (response.ok) {
              productsData = await response.json();
              successfulEndpoint = endpoint;
            } else {
              console.log(`⚠️ Endpoint ${endpoint} returned status: ${response.status}`);
            }
          } catch (err) {
            console.log(`❌ Error with ${endpoint}:`, err.message);
          }
        }

        if (productsData.length === 0) {
          setSnackbar({
            open: true,
            message: "Failed to load products. Please try again or contact support.",
            severity: "error",
          });
        } else {

          const activeProducts = productsData.filter(product =>
            product.is_active === true || product.is_active === undefined
          );

          setProducts(activeProducts || []);
          setFetchErrors(prev => ({ ...prev, products: null }));
        }

        setIsLoading(prev => ({ ...prev, products: false }));

      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error loading data. Please check your connection.",
          severity: "error",
        });
        setIsLoading({
          purchaseOrders: false,
          suppliers: false,
          products: false,
        });
      }
    };

    if (userToken) {
      fetchAllData();
    } else {
      setSnackbar({
        open: true,
        message: "Authentication required. Please login again.",
        severity: "error",
      });
    }
  }, [userToken]);

  const validateForm = () => {
    const errors = {
      goodsReceiptStatus: !formData.goodsReceiptStatus
        ? "Status is required"
        : "",
      products:
        selectedProductIds.length === 0
          ? "At least one product is required"
          : "",
    };

    if (usePurchaseOrder) {
      errors.purchaseOrderId = !formData.purchaseOrderId
        ? "Purchase Order is required"
        : "";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };







  const validateAssetIdInRealTime = (productId, assetIdArray, changedIndex, newValue) => {
    const errors = {};
    const normalizedIds = assetIdArray.map(id => id.trim().toLowerCase());
    const normalizedValue = newValue.trim().toLowerCase();

    // Check for duplicates
    const duplicateCount = normalizedIds.filter(
      id => id && id === normalizedValue
    ).length;

    const isEmpty = !newValue.trim();
    const isDuplicate = duplicateCount > 1;
    const isRequiredField = changedIndex < (quantities[productId] || 0);

    // Set appropriate errors
    if (isDuplicate) {
      errors[productId] = "Duplicate asset IDs found";
      // Mark all duplicate positions (except the first occurrence)
      normalizedIds.forEach((id, idx) => {
        if (id && id === normalizedValue && idx !== normalizedIds.indexOf(id)) {
          errors[`${productId}-${idx}`] = "This Asset ID is already entered";
        }
      });
    } else if (isEmpty && isRequiredField) {
      errors[`${productId}-${changedIndex}`] = `Asset ID ${changedIndex + 1} cannot be empty`;
      errors[productId] = "Please fill all required Asset IDs";
    }

    // Update errors state
    setAssetIdErrors((prev) => {
      const newErrors = { ...prev };

      // Clear previous errors for this product and field
      Object.keys(newErrors).forEach(key => {
        if (key === productId || key.startsWith(`${productId}-`)) {
          delete newErrors[key];
        }
      });

      // Add new errors
      Object.assign(newErrors, errors);

      return newErrors;
    });
  };

  const validateAssetIds = () => {
    const errors = {};
    let isValid = true;

    Object.entries(quantities).forEach(([productId, qty]) => {
      if (qty > 0) {
        const currentAssetIds = assetIds[productId] || [];

        // Check for empty required fields
        for (let i = 0; i < Math.min(currentAssetIds.length, qty); i++) {
          if (!currentAssetIds[i] || !currentAssetIds[i].trim()) {
            errors[`${productId}-${i}`] = `Asset ID ${i + 1} cannot be empty`;
            errors[productId] = "Please fill all required Asset IDs";
            isValid = false;
          }
        }

        // Check for duplicates
        const normalizedIds = currentAssetIds
          .slice(0, qty)
          .map(id => id.trim().toLowerCase())
          .filter(id => id !== "");

        const uniqueIds = new Set(normalizedIds);
        if (uniqueIds.size !== normalizedIds.length) {
          errors[productId] = "Duplicate asset IDs found";
          isValid = false;

          // Find and mark duplicate positions
          const idCounts = {};
          normalizedIds.forEach((id, index) => {
            if (id) {
              if (idCounts[id]) {
                idCounts[id].push(index);
              } else {
                idCounts[id] = [index];
              }
            }
          });

          // Mark all duplicates (except the first occurrence)
          Object.values(idCounts).forEach(positions => {
            if (positions.length > 1) {
              positions.slice(1).forEach(pos => {
                errors[`${productId}-${pos}`] = "This Asset ID is already entered";
              });
            }
          });
        }

        // Check if enough asset IDs are provided
        if (currentAssetIds.length < qty) {
          errors[productId] = `Please enter exactly ${qty} asset ID(s)`;
          isValid = false;
        }
      }
    });

    setAssetIdErrors(errors);
    return isValid;
  };
  const handlePurchaseOrderToggle = (usePO) => {
    setUsePurchaseOrder(usePO);

    if (!usePO) {
      // Reset purchase order related data when switching to manual mode
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
      setQuantities({});
      setAssetIds({});
    } else {
      // Reset manual selections when switching to PO mode
      setSelectedProductIds([]);
      setQuantities({});
      setAssetIds({});
    }
  };

  const handlePurchaseOrderChange = (e) => {
    const selectedId = e.target.value;
    setValidationErrors((prev) => ({ ...prev, purchaseOrderId: "" }));

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
      setQuantities({});
      setAssetIds({});
      return;
    }

    const selectedOrder = purchaseOrders.find(
      (order) => order.id.toString() === selectedId
    );
    setSelectedPurchaseOrder(selectedOrder);

    const supplier = suppliers.find((s) => s.id === selectedOrder.supplier_id);
    const supplierName = supplier ? supplier.supplier_name : "No Supplier name";

    setFormData((prev) => ({
      ...prev,
      purchaseOrderId: selectedOrder.purchase_order_id,
      purchaseOrderStatus: selectedOrder.po_status,
      supplier_id: selectedOrder.supplier_id,
      supplierName: supplierName,
      description: selectedOrder.description,
      isSupplierLocked: true,
      owner: selectedOrder.owner,
      purchaseType: selectedOrder.purchase_type,
    }));

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

  const handleManualProductSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    // Reset quantity when deselecting product
    if (selectedProductIds.includes(productId)) {
      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      });
      setAssetIds((prev) => {
        const newAssetIds = { ...prev };
        delete newAssetIds[productId];
        return newAssetIds;
      });
    }
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

    if (!validateAssetIds()) {
      setSnackbar({
        open: true,
        message: "Please fix all asset ID errors",
        severity: "error",
      });
      return;
    }

    try {
      let items = [];

      if (usePurchaseOrder && selectedPurchaseOrder) {
        // With Purchase Order - use PO products
        items = selectedPurchaseOrder.selected_products
          .filter((item) => quantities[item.product_id] > 0)
          .map((item) => {
            const product = products.find((p) => p.id === item.product_id);
            const quantity = quantities[item.product_id] || 0;
            const productAssetIds = assetIds[item.product_id] || [];

            return {
              product_id: item.product_id,
              product_name: product?.product_name || "",
              quantity: quantity,
              asset_ids: productAssetIds.filter((id) => id.trim() !== ""),
            };
          });
      } else {
        // Without Purchase Order - use manually selected products
        items = selectedProductIds
          .filter((productId) => quantities[productId] > 0)
          .map((productId) => {
            const product = products.find((p) => p.id === productId);
            const quantity = quantities[productId] || 0;
            const productAssetIds = assetIds[productId] || [];

            return {
              product_id: productId,
              product_name: product?.product_name || "",
              quantity: quantity,
              asset_ids: productAssetIds.filter((id) => id.trim() !== ""),
            };
          });
      }

      if (items.length === 0) {
        throw new Error("Please add at least one product with quantity > 0");
      }

      // Optional: Frontend duplicate check within the current form
      const allAssetIds = items.flatMap((item) => item.asset_ids);
      const duplicateInForm = allAssetIds.filter(
        (id, index, arr) => arr.indexOf(id) !== index
      );

      if (duplicateInForm.length > 0) {
        throw new Error(
          `Duplicate asset IDs in form: ${duplicateInForm.join(", ")}`
        );
      }

      // Prepare payload
      const payload = {
        goods_receipt_id: formData.goodsReceiptId,
        vendor_invoice_number: formData.vendorInvoiceNumber,
        supplier_id: formData.supplier_id,
        goods_receipt_date: formData.goodsReceiptDate,
        purchase_type: formData.purchaseType,
        goods_receipt_status: formData.goodsReceiptStatus,
        description: formData.description,
        owner: formData.owner,
        items,
      };

      // Add purchase order data if using PO
      if (usePurchaseOrder && selectedPurchaseOrder) {
        payload.purchase_order_id = selectedPurchaseOrder.purchase_order_id;
        payload.purchase_order_status = selectedPurchaseOrder.po_status;
      }

      const response = await fetch(`${API_URL}/goods-receipts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If backend returns duplicate asset IDs
        if (errorData.duplicateDetails) {
          const messages = errorData.duplicateDetails
            .map((d) => `${d.product_name}: ${d.duplicates.join(", ")}`)
            .join("; ");
          throw new Error(`Duplicate asset IDs found: ${messages}`);
        } else {
          throw new Error(
            errorData.message || "Failed to create goods receipt"
          );
        }
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


    const handleSelectAll = (checked) => {
  if (checked) {
    // Select all visible products
    setSelectedProductIds(allProductIds);

    // Initialize quantities if not present
    setQuantities((prev) => {
      const updated = { ...prev };
      allProductIds.forEach((id) => {
        if (!updated[id]) updated[id] = 1;
      });
      return updated;
    });
  } else {
    // Deselect all
    setSelectedProductIds([]);
    setQuantities({});
    setAssetIds({});
  }
};

  const getProductsToDisplay = () => {
    if (usePurchaseOrder && selectedPurchaseOrder) {
      // Show only products from the selected purchase order
      return products.filter((product) =>
        selectedProductIds.includes(product.id)
      );
    } else {
      // Show all filtered products for manual selection
      return filteredProducts;
    }
  };




  
  const displayedProducts = getProductsToDisplay();
const allProductIds = displayedProducts.map((p) => p.id);

const isAllSelected =
  allProductIds.length > 0 &&
  allProductIds.every((id) => selectedProductIds.includes(id));

const isSomeSelected =
  allProductIds.some((id) => selectedProductIds.includes(id)) &&
  !isAllSelected;




  
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
              disabled
            />
            <Field
              label="Vendor Invoice Number"
              placeholder="Enter Vendor Invoice Number"
              value={formData.vendorInvoiceNumber}
              onChange={(e) =>
                handleInputChange("vendorInvoiceNumber", e.target.value)
              }
              error={validationErrors.vendorInvoiceNumber}
            />

            <div style={fieldsGridStyle}>
              <FormControlLabel
                control={
                  <Switch
                    checked={usePurchaseOrder}
                    onChange={(e) => handlePurchaseOrderToggle(e.target.checked)}
                    color="primary"
                  />
                }
                label={usePurchaseOrder ? "Using Purchase Order" : "Manual Product Selection"}
              />
              <div style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>
                {usePurchaseOrder
                  ? "Products will be auto-selected from the chosen Purchase Order"
                  : "Manually select products from the product catalog"}
              </div>
            </div>

            {usePurchaseOrder && (
              <Field
                label="Purchase Order"
                type="select"
                value={selectedPurchaseOrder?.id || ""}
                onChange={handlePurchaseOrderChange}
                error={validationErrors.purchaseOrderId}
                required
              >
                <option value="">Select Purchase Order</option>
                {purchaseOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.purchase_order_id} - {order.supplier.supplier_name}
                  </option>
                ))}
              </Field>
            )}

            {usePurchaseOrder && selectedPurchaseOrder && (
              <>
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
              </>
            )}

            <Field
              label="Goods Receipt Date"
              type="date"
              value={formData.goodsReceiptDate}
              onChange={(e) =>
                handleInputChange("goodsReceiptDate", e.target.value)
              }
            />
            {usePurchaseOrder && (
              <Field
                label="Purchase Type"
                value={formData.purchaseType}
                onChange={(e) => handleInputChange("purchaseType", e.target.value)}
                disabled={usePurchaseOrder && selectedPurchaseOrder}
              />

            )}

            <Field
              label="Goods Receipt Status"
              type="select"
              value={formData.goodsReceiptStatus}
              onChange={(e) =>
                handleInputChange("goodsReceiptStatus", e.target.value)
              }
              error={validationErrors.goodsReceiptStatus}
              options={["Pending", "Approved", "Rejected"]}
            />
            <Field
              label="Owner"
              placeholder="Enter Owner"
              value={formData.owner}
              onChange={(e) => handleInputChange("owner", e.target.value)}
              error={validationErrors.owner}
            />
          </div>
        </div>

        {/* Supplier Details */}
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
              error={validationErrors.description}
              type="textarea"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>
            {usePurchaseOrder ? "Products from Purchase Order" : "Select Products"}
          </h3>
        </div>
        {validationErrors.products && (
          <div style={{ color: "red", margin: "0 0 1rem 1rem" }}>
            {validationErrors.products}
          </div>
        )}

        {usePurchaseOrder && !selectedPurchaseOrder && (
          <div style={{ color: "#666", margin: "0 0 1rem 1rem" }}>
            Please select a Purchase Order to view products
          </div>
        )}

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
            disabled={usePurchaseOrder && !selectedPurchaseOrder}
          >
            {showProductTable
              ? "Hide Product List"
              : usePurchaseOrder
                ? "View PO Products"
                : "Add Products"
            }
          </button>

          {showProductTable && (
            <Box p={2}>
              {!usePurchaseOrder && (
                <Box className="search-wrapper" mb={2}>
                  <TextField
                    size="small"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>

              )}

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
                      <TableCell padding="checkbox" sx={{ backgroundColor: "#0d47a1" }}>
  <Checkbox
    sx={{ color: "#fff" }}
    checked={isAllSelected}
    indeterminate={isSomeSelected}
    onChange={(e) => handleSelectAll(e.target.checked)}
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
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                      >
                        Asset IDs
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
  {[...getProductsToDisplay()]
    .sort((a, b) => {
      const aSelected = selectedProductIds.includes(a.id);
      const bSelected = selectedProductIds.includes(b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    })
    .map((product) => (
      <TableRow key={product.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => handleManualProductSelection(product.id)}
                          />
                        </TableCell>

                        <TableCell>{product.product_name}</TableCell>
                        <TableCell>{generateSpecifications(product)}</TableCell>
                        <TableCell>
                          <div>
                            <strong>Month:</strong> ₹
                            {product.rent_price_per_month}
                          </div>
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
                              disabled={
                                !selectedProductIds.includes(product.id)
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
                        <TableCell>
                          {quantities[product.id] > 0 && (
                            <Box display="flex" flexDirection="column" gap={1}>
                              {(assetIds[product.id] || []).map((id, idx) => {
                                // Get current errors for this field
                                const fieldError = assetIdErrors[`${product.id}-${idx}`];
                                const productError = assetIdErrors[product.id];
                                const isRequiredField = idx < quantities[product.id];
                                const isLastField = idx === (assetIds[product.id]?.length || 0) - 1;
                                const canAddMore = (assetIds[product.id]?.length || 0) < (quantities[product.id] || 0);

                                return (
                                  <TextField
                                    key={idx}
                                    size="small"
                                    placeholder={`Asset ID ${idx + 1}`}
                                    value={id}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updated = [...(assetIds[product.id] || [])];
                                      updated[idx] = newValue;

                                      setAssetIds((prev) => ({
                                        ...prev,
                                        [product.id]: updated,
                                      }));

                                      // Call validation function on change
                                      validateAssetIdInRealTime(product.id, updated, idx, newValue);
                                    }}
                                    onKeyDown={(e) => {
                                      // Add new field when Enter is pressed on the last field
                                      if (e.key === 'Enter' && isLastField && canAddMore) {
                                        e.preventDefault(); // Prevent form submission if in a form
                                        setAssetIds((prev) => ({
                                          ...prev,
                                          [product.id]: [...(prev[product.id] || []), ""],
                                        }));

                                        // Focus the new field after a brief delay
                                        setTimeout(() => {
                                          const nextField = document.querySelector(`[data-asset-id="${product.id}-${idx + 1}"]`);
                                          if (nextField) {
                                            nextField.focus();
                                          }
                                        }, 10);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      const value = e.target.value.trim();
                                      // Only validate empty fields for required positions
                                      if (isRequiredField && value === "") {
                                        setAssetIdErrors((prev) => ({
                                          ...prev,
                                          [`${product.id}-${idx}`]: `Asset ID ${idx + 1} cannot be empty`,
                                          [product.id]: prev[product.id] || "Please fill all required Asset IDs",
                                        }));
                                      }
                                    }}
                                    error={Boolean(fieldError || (idx === 0 && productError && !fieldError))}
                                    helperText={
                                      fieldError ||
                                      (idx === 0 && productError && !fieldError ? productError : "")
                                    }
                                    // Add data attribute for easy selection
                                    inputProps={{
                                      'data-asset-id': `${product.id}-${idx}`
                                    }}
                                  />
                                );
                              })}

                              {(assetIds[product.id]?.length || 0) < (quantities[product.id] || 0) && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    const currentLength = assetIds[product.id]?.length || 0;
                                    const requiredQty = quantities[product.id] || 0;

                                    if (currentLength < requiredQty) {
                                      const newAssetIds = [...(assetIds[product.id] || []), ""];
                                      setAssetIds((prev) => ({
                                        ...prev,
                                        [product.id]: newAssetIds,
                                      }));

                                      // Focus the new field after a brief delay
                                      setTimeout(() => {
                                        const newFieldIndex = newAssetIds.length - 1;
                                        const newField = document.querySelector(`[data-asset-id="${product.id}-${newFieldIndex}"]`);
                                        if (newField) {
                                          newField.focus();
                                        }
                                      }, 10);
                                    }
                                  }}
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
          Create Goods Receipt
        </button>
      </div>
    </div>
  );
};

// Styles (same as before)
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
};

// Field component (same as before)
const Field = ({
  label,
  placeholder,
  type = "text",
  value = "",
  disabled = false,
  options = [],
  onChange,
  children,
  error = "",
  required = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={{
            ...selectStyle,
            borderColor: error ? "red" : "#cbd5e1",
          }}
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
    ) : type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        style={{
          ...inputStyle,
          height: "80px",
          borderColor: error ? "red" : "#cbd5e1",
        }}
        onChange={onChange}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        style={{
          ...inputStyle,
          borderColor: error ? "red" : "#cbd5e1",
        }}
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

export default GoodsReceiptsAddLayout;