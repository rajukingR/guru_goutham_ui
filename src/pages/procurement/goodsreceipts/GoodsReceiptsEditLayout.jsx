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
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";
import { generateSpecifications } from "../../../utils/generateSpecifications";

const GoodsReceiptsEditLayout = () => {
  const { id } = useParams();
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
  const [originalData, setOriginalData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch goods receipt data for editing
  useEffect(() => {
    const fetchGoodsReceiptData = async () => {
      if (!id || !userToken) return;

      try {
        setIsLoadingData(true);
        
        const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch goods receipt: ${response.status}`);
        }

        const data = await response.json();
        console.log("Goods Receipt Data:", data); // Debug log
        setOriginalData(data);
        
        // Set form data
        setFormData({
          goodsReceiptId: data.goods_receipt_id || "",
          vendorInvoiceNumber: data.vendor_invoice_number || "",
          purchaseOrderId: data.purchase_order_id || "",
          purchaseOrderStatus: data.purchase_order_status || "",
          goodsReceiptDate: data.goods_receipt_date?.split("T")[0] || new Date().toISOString().split("T")[0],
          purchaseType: data.purchase_type || "",
          goodsReceiptStatus: data.goods_receipt_status || "Pending",
          owner: data.owner || "",
          supplier_id: data.supplier_id || "",
          supplierName: data.supplier?.supplier_name || "",
          description: data.description || "",
          isSupplierLocked: !!data.purchase_order_id,
        });

        // Set usePurchaseOrder based on whether there's a purchase order
        setUsePurchaseOrder(!!data.purchase_order_id);

        // 🚨 CRITICAL FIX: The API returns "selected_products" not "items"
        if (data.selected_products && data.selected_products.length > 0) {
          console.log("Selected Products:", data.selected_products); // Debug log
          
          const productIds = data.selected_products.map(item => item.product_id);
          
          // ✅ AUTO-SELECT CHECKBOXES: Select products that have quantity > 0
          setSelectedProductIds(productIds);
          console.log("Selected Product IDs:", productIds); // Debug log

          const quantityMap = {};
          const assetIdMap = {};
          
          data.selected_products.forEach(item => {
            quantityMap[item.product_id] = item.quantity;
            assetIdMap[item.product_id] = item.asset_ids || [];
          });

          console.log("Quantity Map:", quantityMap); // Debug log
          console.log("Asset ID Map:", assetIdMap); // Debug log

          setQuantities(quantityMap);
          setAssetIds(assetIdMap);
        }

        setIsLoadingData(false);
      } catch (error) {
        console.error("Error loading goods receipt data:", error);
        setSnackbar({
          open: true,
          message: "Error loading goods receipt data",
          severity: "error",
        });
        setIsLoadingData(false);
      }
    };

    fetchGoodsReceiptData();
  }, [id, userToken]);

  // Fetch other data
  useEffect(() => {
    const fetchAllData = async () => {
      if (!userToken) return;

      try {
        // Fetch Purchase Orders
        const poResponse = await fetch(`${API_URL}/purchase-orders/approved`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        });

        if (poResponse.ok) {
          const poData = await poResponse.json();
          setPurchaseOrders(poData || []);
        }

        // Fetch Suppliers
        const supResponse = await fetch(`${API_URL}/supplier`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        });

        if (supResponse.ok) {
          const supData = await supResponse.json();
          setSuppliers(supData || []);
        }

        // Fetch Products
        const prodResponse = await fetch(`${API_URL}/product-templete/without-active`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        });

        if (prodResponse.ok) {
          const prodData = await prodResponse.json();
          const activeProducts = prodData.filter(product =>
            product.is_active === true || product.is_active === undefined
          );
          setProducts(activeProducts || []);
          console.log("Products loaded:", activeProducts.length); // Debug log
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [userToken]);

  // Handle quantity change with asset ID sync
  const handleQtyChange = (productId, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    const currentQty = quantities[productId] || 0;
    const currentAssetIds = assetIds[productId] || [];
    
    // Update quantity
    setQuantities(prev => ({ ...prev, [productId]: qty }));
    
    // Sync Asset IDs with quantity
    if (qty < currentQty) {
      // Reduce quantity: Remove extra asset IDs
      setAssetIds(prev => ({
        ...prev,
        [productId]: prev[productId]?.slice(0, qty) || []
      }));
    } else if (qty > currentQty) {
      // Increase quantity: Add empty asset ID slots
      const newAssetIds = [...currentAssetIds];
      const additionalSlots = qty - currentQty;
      
      for (let i = 0; i < additionalSlots; i++) {
        newAssetIds.push("");
      }
      
      setAssetIds(prev => ({
        ...prev,
        [productId]: newAssetIds
      }));
    }
  };

  const incrementQty = (productId) => {
    const currentQty = quantities[productId] || 0;
    const newQty = currentQty + 1;
    
    // Update quantity
    setQuantities(prev => ({ ...prev, [productId]: newQty }));
    
    // Add new empty asset ID
    setAssetIds(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), ""]
    }));
  };

  const decrementQty = (productId) => {
    const currentQty = quantities[productId] || 0;
    if (currentQty <= 0) return;
    
    const newQty = currentQty - 1;
    
    // Update quantity
    setQuantities(prev => ({ ...prev, [productId]: newQty }));
    
    // Remove last asset ID
    setAssetIds(prev => ({
      ...prev,
      [productId]: prev[productId]?.slice(0, -1) || []
    }));
  };

  // Handle product selection
  const handleManualProductSelection = (productId) => {
    const isCurrentlySelected = selectedProductIds.includes(productId);
    
    if (isCurrentlySelected) {
      // Deselect product
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      });
      setAssetIds(prev => {
        const newAssetIds = { ...prev };
        delete newAssetIds[productId];
        return newAssetIds;
      });
    } else {
      // Select product and initialize with quantity 1 if not already set
      setSelectedProductIds(prev => [...prev, productId]);
      if (!quantities[productId]) {
        setQuantities(prev => ({ ...prev, [productId]: 1 }));
        setAssetIds(prev => ({ ...prev, [productId]: [""] }));
      }
    }
  };

  // Validation functions
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
        }
      }
    });

    setAssetIdErrors(errors);
    return isValid;
  };

  // Purchase order handlers
  const handlePurchaseOrderToggle = (usePO) => {
    setUsePurchaseOrder(usePO);

    if (!usePO) {
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

  // Filter products for search
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit handler
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
      // 🚨 FIX: Use selected_products structure
      const items = selectedProductIds
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

      if (items.length === 0) {
        throw new Error("Please add at least one product with quantity > 0");
      }

      const payload = {
        goods_receipt_id: formData.goodsReceiptId,
        vendor_invoice_number: formData.vendorInvoiceNumber,
        supplier_id: formData.supplier_id,
        goods_receipt_date: formData.goodsReceiptDate,
        purchase_type: formData.purchaseType,
        goods_receipt_status: formData.goodsReceiptStatus,
        description: formData.description,
        owner: formData.owner,
        items, // 🚨 This should match your backend expectation
      };

      if (usePurchaseOrder && selectedPurchaseOrder) {
        payload.purchase_order_id = selectedPurchaseOrder.purchase_order_id;
        payload.purchase_order_status = selectedPurchaseOrder.po_status;
      }

      console.log("Submitting payload:", payload); // Debug log

      const response = await fetch(`${API_URL}/goods-receipts/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update goods receipt"
        );
      }

      setSnackbar({
        open: true,
        message: "Goods Receipt updated successfully!",
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

  // Get products to display in table
  const getProductsToDisplay = () => {
    if (usePurchaseOrder && selectedPurchaseOrder) {
      return products.filter((product) =>
        selectedProductIds.includes(product.id)
      );
    } else {
      // Show products that are selected OR all filtered products
      const selectedProducts = products.filter(product => 
        selectedProductIds.includes(product.id)
      );
      
      // If we have selected products, show them first, then filtered products
      if (selectedProducts.length > 0) {
        return selectedProducts;
      }
      
      return filteredProducts;
    }
  };

  if (isLoadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Box ml={2}>Loading goods receipt data...</Box>
      </Box>
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
                    disabled={!!originalData?.purchase_order_id}
                  />
                }
                label={usePurchaseOrder ? "Using Purchase Order" : "Manual Product Selection"}
              />
              {!!originalData?.purchase_order_id && (
                <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
                  Cannot change mode when a purchase order is already associated
                </div>
              )}
            </div>

            {usePurchaseOrder && (
              <Field
                label="Purchase Order"
                type="select"
                value={selectedPurchaseOrder?.id || ""}
                onChange={handlePurchaseOrderChange}
                error={validationErrors.purchaseOrderId}
                required
                disabled={!!originalData?.purchase_order_id}
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
            {usePurchaseOrder ? "Products from Purchase Order" : "Edit Products"}
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
              : "View/Edit Products"
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
                        <Checkbox sx={{ color: "#fff" }} />
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
                      <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                        Quantity
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                        Asset IDs
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getProductsToDisplay().map((product) => {
                      const productId = product.id;
                      const qty = quantities[productId] || 0;
                      const isSelected = selectedProductIds.includes(productId);
                      const productAssetIds = assetIds[productId] || [];
                      
                      console.log(`Product ${productId}: qty=${qty}, selected=${isSelected}, assetIds=${productAssetIds.length}`); // Debug
                      
                      return (
                        <TableRow key={productId}>
                          <TableCell padding="checkbox">
                            {/* ✅ CHECKBOX: Auto-selected based on existing data */}
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleManualProductSelection(productId)}
                              disabled={usePurchaseOrder}
                            />
                          </TableCell>
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell>{generateSpecifications(product)}</TableCell>
                          <TableCell>
                            <div>
                              <strong>Month:</strong> ₹{product.rent_price_per_month || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* ✅ QUANTITY: Shows actual quantity from goods receipt */}
                            <Box display="flex" alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => decrementQty(productId)}
                                disabled={!isSelected}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <TextField
                                type="number"
                                size="small"
                                value={qty}
                                onChange={(e) =>
                                  handleQtyChange(productId, e.target.value)
                                }
                                disabled={!isSelected}
                                inputProps={{
                                  min: 0,
                                  style: { width: 60, textAlign: "center" },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => incrementQty(productId)}
                                disabled={!isSelected}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {/* ✅ ASSET IDs: Shows actual asset IDs from goods receipt */}
                            {qty > 0 && (
                              <Box display="flex" flexDirection="column" gap={1}>
                                {productAssetIds.slice(0, qty).map((id, idx) => (
                                  <TextField
                                    key={idx}
                                    size="small"
                                    placeholder={`Asset ID ${idx + 1}`}
                                    value={id}
                                    onChange={(e) => {
                                      const updated = [...productAssetIds];
                                      updated[idx] = e.target.value;
                                      setAssetIds((prev) => ({
                                        ...prev,
                                        [productId]: updated,
                                      }));
                                    }}
                                    error={Boolean(assetIdErrors[`${productId}-${idx}`])}
                                    helperText={assetIdErrors[`${productId}-${idx}`]}
                                  />
                                ))}
                                {/* Add more asset IDs if needed */}
                                {productAssetIds.length < qty && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      setAssetIds((prev) => ({
                                        ...prev,
                                        [productId]: [...productAssetIds, ""],
                                      }));
                                    }}
                                  >
                                    + Add Asset ID
                                  </Button>
                                )}
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
          Update Goods Receipt
        </button>
      </div>
    </div>
  );
};

// Styles remain the same...
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

// Field component
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

export default GoodsReceiptsEditLayout;