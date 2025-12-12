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
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useSelector } from "react-redux";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { generateSpecifications } from "../../../utils/generateSpecifications";

const GoodsReceiptsEditLayout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const userToken = token;

  const { id } = useParams();
  const [goodsReceipt, setGoodsReceipt] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [assetIds, setAssetIds] = useState({});
  const [assetIdErrors, setAssetIdErrors] = useState({});
  const [supplierName, setSupplierName] = useState("");
  const [usePurchaseOrder, setUsePurchaseOrder] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

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
    owner: "",
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
        const grResponse = await fetch(`${API_URL}/goods-receipts/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!grResponse.ok) throw new Error("Failed to fetch goods receipt");
        const grData = await grResponse.json();
        setGoodsReceipt(grData);

        // Determine if using purchase order based on existing data
        const hasPurchaseOrder = !!grData.purchase_order_id;
        setUsePurchaseOrder(hasPurchaseOrder);

        // Pre-fill form with existing goods receipt data
        setFormData({
          goods_receipt_id: grData.goods_receipt_id,
          vendor_invoice_number: grData.vendor_invoice_number || "",
          purchase_order_id: grData.purchase_order_id || "",
          purchase_order_status: grData.purchase_order_status || "",
          goods_receipt_date: grData.goods_receipt_date.split("T")[0],
          purchase_type: grData.purchase_type || "Buy",
          goods_receipt_status: grData.goods_receipt_status || "Pending",
          supplier_id: grData.supplier_id,
          description: grData.description || "",
          owner: grData.owner || "",
        });

        // Initialize quantities, selected products, and asset IDs
        const newQuantities = {};
        const newSelectedProducts = [];
        const newAssetIds = {};

        // Process selected_products from API response
        if (grData.selected_products && grData.selected_products.length > 0) {
          grData.selected_products.forEach((item) => {
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
        const poResponse = await fetch(`${API_URL}/purchase-orders/approved`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
        const poData = await poResponse.json();
        setPurchaseOrders(poData);

        // Set selected purchase order if exists
        if (hasPurchaseOrder) {
          const existingPO = poData.find(
            (order) => order.purchase_order_id === grData.purchase_order_id
          );
          setSelectedPurchaseOrder(existingPO);
        }

        // Fetch suppliers
        const supResponse = await fetch(`${API_URL}/supplier`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!supResponse.ok) throw new Error("Failed to fetch suppliers");
        const supData = await supResponse.json();
        setSuppliers(supData);

        // Fetch supplier name if supplier_id exists
        if (grData.supplier_id) {
          const supplierResponse = await fetch(
            `${API_URL}/supplier/${grData.supplier_id}`,
            {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }
          );
          if (supplierResponse.ok) {
            const supplierData = await supplierResponse.json();
            setSupplierName(supplierData.supplier_name);
          }
        }

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
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

  const handlePurchaseOrderToggle = (usePO) => {
    setUsePurchaseOrder(usePO);

    if (!usePO) {
      // Reset purchase order related data when switching to manual mode
      setSelectedPurchaseOrder(null);
      setFormData((prev) => ({
        ...prev,
        purchase_order_id: "",
        purchase_order_status: "",
      }));
    } else {
      // Reset manual selections when switching to PO mode
      setSelectedProductIds([]);
      setQuantities({});
      setAssetIds({});
    }
  };

  const handlePurchaseOrderChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setSelectedPurchaseOrder(null);
      setFormData((prev) => ({
        ...prev,
        purchase_order_id: "",
        purchase_order_status: "",
        supplier_id: "",
        description: "",
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

    if (selectedOrder) {
      setFormData((prev) => ({
        ...prev,
        purchase_order_id: selectedOrder.purchase_order_id,
        purchase_order_status: selectedOrder.po_status,
        supplier_id: selectedOrder.supplier_id,
        description: selectedOrder.description,
        owner: selectedOrder.owner,
        purchase_type: selectedOrder.purchase_type,
      }));

      // Initialize quantities and selected products from PO
      const newQuantities = {};
      const newSelectedProducts = [];
      const newAssetIds = {};

      if (
        selectedOrder.selected_products &&
        selectedOrder.selected_products.length > 0
      ) {
        selectedOrder.selected_products.forEach((item) => {
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
    setQuantities((prev) => ({ ...prev, [id]: qty }));

    // Adjust asset IDs array when quantity changes
    if (qty < (assetIds[id]?.length || 0)) {
      setAssetIds((prev) => ({
        ...prev,
        [id]: prev[id]?.slice(0, qty) || [],
      }));
    } else if (qty > (assetIds[id]?.length || 0)) {
      setAssetIds((prev) => ({
        ...prev,
        [id]: [
          ...(prev[id] || []),
          ...Array(qty - (prev[id]?.length || 0)).fill(""),
        ],
      }));
    }
  };

  const incrementQty = (id) => {
    const newQty = (quantities[id] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
    setAssetIds((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ""],
    }));
  };

  const decrementQty = (id) => {
    const newQty = Math.max(0, (quantities[id] || 0) - 1);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
    if (newQty < (assetIds[id]?.length || 0)) {
      setAssetIds((prev) => ({
        ...prev,
        [id]: prev[id].slice(0, newQty),
      }));
    }
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
    } else {
      // Initialize with quantity 1 when selecting product
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
      setAssetIds((prev) => ({ ...prev, [productId]: [""] }));
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

  const handleSubmit = async () => {
    try {
      if (!goodsReceipt) {
        throw new Error("Goods receipt data not loaded");
      }

      if (!validateAssetIds()) {
        throw new Error("Please fix all asset ID errors before submitting");
      }

      // Prepare items array based on mode
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

      // Frontend duplicate check within form
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
        ...formData,
        items,
      };

      // Remove purchase order data if not using PO
      if (!usePurchaseOrder) {
        payload.purchase_order_id = "";
        payload.purchase_order_status = "";
      }

      // Send update request
      const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Backend duplicate check feedback
        if (errorData.duplicateDetails) {
          const messages = errorData.duplicateDetails
            .map((d) => `${d.product_name}: ${d.duplicates.join(", ")}`)
            .join("; ");
          throw new Error(`Duplicate asset IDs found: ${messages}`);
        } else {
          throw new Error(
            errorData.message || "Failed to update goods receipt"
          );
        }
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
              onChange={(e) =>
                handleInputChange("goods_receipt_id", e.target.value)
              }
            />
            <Field
              label="Vendor Invoice Number"
              placeholder="Enter Vendor Invoice Number"
              value={formData.vendor_invoice_number}
              onChange={(e) => handleInputChange("vendor_invoice_number", e.target.value)}
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
                placeholder="Select Purchase Order"
                value={selectedPurchaseOrder?.id || ""}
                onChange={handlePurchaseOrderChange}
              >
                <option value="">Select Purchase Order</option>
                {purchaseOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.purchase_order_id} - {order.supplier?.supplier_name}
                  </option>
                ))}
              </Field>
            )}

            {usePurchaseOrder && selectedPurchaseOrder && (
              <>
                <Field
                  label="Purchase Order ID"
                  value={formData.purchase_order_id}
                  disabled
                />
                <Field
                  label="Purchase Order Status"
                  value={formData.purchase_order_status}
                  disabled
                />
              </>
            )}

            <Field
              label="Goods Receipt Date"
              type="date"
              value={formData.goods_receipt_date}
              onChange={(e) =>
                handleInputChange("goods_receipt_date", e.target.value)
              }
            />

            {usePurchaseOrder && (
              <Field
                label="Purchase Type"
                value={formData.purchase_type}
                onChange={(e) => handleInputChange("purchase_type", e.target.value)}
                disabled={usePurchaseOrder && selectedPurchaseOrder}
              />

            )}
            <Field
              label="Goods Receipt Status"
              type="select"
              placeholder="Select Status"
              options={["Pending", "Approved", "Rejected"]}
              value={formData.goods_receipt_status}
              onChange={(e) =>
                handleInputChange("goods_receipt_status", e.target.value)
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

        {/* Supplier Details */}
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
              disabled={usePurchaseOrder && selectedPurchaseOrder}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
              {formData.supplier_id &&
                !suppliers.some((s) => s.id === formData.supplier_id) && (
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
                ? "View Products"
                : "Edit Products"
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
                    {getProductsToDisplay()
                      .filter(product => selectedProductIds.includes(product.id))
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
                                value={quantities[product.id] || 0}
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
                          <TableCell>
                            {quantities[product.id] > 0 && (
                              <Box display="flex" flexDirection="column" gap={1}>
                                {(assetIds[product.id] || []).map((id, idx) => {
                                  // Check for duplicates in real-time
                                  const currentAssetIds = assetIds[product.id] || [];
                                  const normalizedCurrentIds = currentAssetIds.map(id => id.trim().toLowerCase());
                                  const normalizedId = id.trim().toLowerCase();

                                  // Count how many times this ID appears (excluding current index if empty)
                                  const duplicateCount = normalizedCurrentIds.filter(
                                    (normalizedAssetId, index) =>
                                      normalizedAssetId &&
                                      normalizedAssetId === normalizedId &&
                                      (id.trim() !== "" || index === idx)
                                  ).length;

                                  const isDuplicate = duplicateCount > 1;
                                  const isEmpty = !id.trim();

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

                                        // Immediate validation
                                        const currentIds = updated;
                                        const normalizedIds = currentIds.map(id => id.trim().toLowerCase());
                                        const currentNormalizedValue = newValue.trim().toLowerCase();

                                        // Check for duplicates
                                        const duplicateCountNow = normalizedIds.filter(
                                          normalizedId =>
                                            normalizedId &&
                                            normalizedId === currentNormalizedValue
                                        ).length;

                                        const isEmptyNow = !newValue.trim();
                                        const isDuplicateNow = duplicateCountNow > 1;

                                        // Update errors
                                        setAssetIdErrors((prev) => {
                                          const newErrors = { ...prev };

                                          if (isDuplicateNow) {
                                            newErrors[product.id] = "Duplicate asset IDs found";
                                            newErrors[`${product.id}-${idx}`] = "This Asset ID is already entered";
                                          } else if (isEmptyNow && idx < quantities[product.id]) {
                                            // Don't show empty error for extra optional fields if they exist
                                            if (idx < (quantities[product.id] || 0)) {
                                              newErrors[`${product.id}-${idx}`] = `Asset ID ${idx + 1} cannot be empty`;
                                              if (!newErrors[product.id]) {
                                                newErrors[product.id] = "Please fill all required Asset IDs";
                                              }
                                            }
                                          } else {
                                            // Clear specific field error
                                            delete newErrors[`${product.id}-${idx}`];

                                            // Clear product error if all fields are valid
                                            const hasOtherErrors = Object.keys(newErrors).some(key =>
                                              key.startsWith(`${product.id}-`) ||
                                              (key === product.id && key !== `${product.id}-${idx}`)
                                            );
                                            if (!hasOtherErrors) {
                                              delete newErrors[product.id];
                                            }
                                          }

                                          return newErrors;
                                        });
                                      }}
                                      onBlur={(e) => {
                                        // Final validation on blur
                                        const value = e.target.value.trim();
                                        if (value === "" && idx < quantities[product.id]) {
                                          // Only show error for required fields (based on quantity)
                                          setAssetIdErrors((prev) => ({
                                            ...prev,
                                            [`${product.id}-${idx}`]: `Asset ID ${idx + 1} cannot be empty`,
                                            [product.id]: prev[product.id] || "Please fill all required Asset IDs",
                                          }));
                                        }
                                      }}
                                      error={Boolean(
                                        assetIdErrors[`${product.id}-${idx}`] ||
                                        (idx === 0 && assetIdErrors[product.id] && !assetIdErrors[`${product.id}-0`])
                                      )}
                                      helperText={
                                        assetIdErrors[`${product.id}-${idx}`] ||
                                        (idx === 0 && assetIdErrors[product.id] && !assetIdErrors[`${product.id}-0`] ? assetIdErrors[product.id] : "")
                                      }
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
                                        setAssetIds((prev) => ({
                                          ...prev,
                                          [product.id]: [...(prev[product.id] || []), ""],
                                        }));
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
          Update Goods Receipt
        </button>
      </div>
    </div>
  );
};

// Field component and styles (same as before)
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

export default GoodsReceiptsEditLayout;