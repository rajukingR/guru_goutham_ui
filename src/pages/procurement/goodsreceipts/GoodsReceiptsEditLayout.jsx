// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   IconButton,
//   Checkbox,
//   Snackbar,
//   Alert,
//   Button,
//   FormControlLabel,
//   Switch,
//   CircularProgress,
// } from "@mui/material";
// import { Add, Remove } from "@mui/icons-material";
// import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
// import { useSelector } from "react-redux";
// import { generateSpecifications } from "../../../utils/generateSpecifications";

// const GoodsReceiptsEditLayout = () => {
//   const { id } = useParams();
//   const { user, token } = useSelector((state) => state.auth);
//   const userToken = token;

//   const [purchaseOrders, setPurchaseOrders] = useState([]);
//   const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
//   const [suppliers, setSuppliers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//   const [assetIds, setAssetIds] = useState({});
//   const [assetIdErrors, setAssetIdErrors] = useState({});
//   const [usePurchaseOrder, setUsePurchaseOrder] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({
//     purchaseOrderId: "",
//     goodsReceiptStatus: "",
//     owner: "",
//     description: "",
//     products: "",
//     vendorInvoiceNumber: "",
//   });

//   const [formData, setFormData] = useState({
//     goodsReceiptId: "",
//     vendorInvoiceNumber: "",
//     purchaseOrderId: "",
//     purchaseOrderStatus: "",
//     goodsReceiptDate: new Date().toISOString().split("T")[0],
//     purchaseType: "",
//     goodsReceiptStatus: "Pending",
//     owner: "",
//     supplier_id: "",
//     supplierName: "",
//     description: "",
//     isSupplierLocked: false,
//   });

//   const [selectedProductIds, setSelectedProductIds] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showProductTable, setShowProductTable] = useState(false);
//   const [originalData, setOriginalData] = useState(null);
//   const [isLoadingData, setIsLoadingData] = useState(true);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Fetch goods receipt data for editing
//   useEffect(() => {
//     const fetchGoodsReceiptData = async () => {
//       if (!id || !userToken) return;

//       try {
//         setIsLoadingData(true);
        
//         const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
//           headers: {
//             "Authorization": `Bearer ${userToken}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch goods receipt: ${response.status}`);
//         }

//         const data = await response.json();
//         setOriginalData(data);
        
//         // Set form data
//         setFormData({
//           goodsReceiptId: data.goods_receipt_id || "",
//           vendorInvoiceNumber: data.vendor_invoice_number || "",
//           purchaseOrderId: data.purchase_order_id || "",
//           purchaseOrderStatus: data.purchase_order_status || "",
//           goodsReceiptDate: data.goods_receipt_date?.split("T")[0] || new Date().toISOString().split("T")[0],
//           purchaseType: data.purchase_type || "",
//           goodsReceiptStatus: data.goods_receipt_status || "Pending",
//           owner: data.owner || "",
//           supplier_id: data.supplier_id || "",
//           supplierName: data.supplier?.supplier_name || "",
//           description: data.description || "",
//           isSupplierLocked: !!data.purchase_order_id,
//         });

//         // Set usePurchaseOrder based on whether there's a purchase order
//         setUsePurchaseOrder(!!data.purchase_order_id);

//         // 🚨 CRITICAL FIX: The API returns "selected_products" not "items"
//         if (data.selected_products && data.selected_products.length > 0) {          
//           const productIds = data.selected_products.map(item => item.product_id);
          
//           setSelectedProductIds(productIds);
//           const quantityMap = {};
//           const assetIdMap = {};
          
//           data.selected_products.forEach(item => {
//             quantityMap[item.product_id] = item.quantity;
//             assetIdMap[item.product_id] = item.asset_ids || [];
//           });

//           setQuantities(quantityMap);
//           setAssetIds(assetIdMap);
//         }

//         setIsLoadingData(false);
//       } catch (error) {
//         console.error("Error loading goods receipt data:", error);
//         setSnackbar({
//           open: true,
//           message: "Error loading goods receipt data",
//           severity: "error",
//         });
//         setIsLoadingData(false);
//       }
//     };

//     fetchGoodsReceiptData();
//   }, [id, userToken]);

//   // Fetch other data
//   useEffect(() => {
//     const fetchAllData = async () => {
//       if (!userToken) return;

//       try {
//         // Fetch Purchase Orders
//         const poResponse = await fetch(`${API_URL}/purchase-orders/approved`, {
//           headers: {
//             "Authorization": `Bearer ${userToken}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (poResponse.ok) {
//           const poData = await poResponse.json();
//           setPurchaseOrders(poData || []);
//         }

//         // Fetch Suppliers
//         const supResponse = await fetch(`${API_URL}/supplier/list`, {
//           headers: {
//             "Authorization": `Bearer ${userToken}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (supResponse.ok) {
//           const supData = await supResponse.json();
//           setSuppliers(supData || []);
//         }

//         // Fetch Products
//         const prodResponse = await fetch(`${API_URL}/product-templete/without-active`, {
//           headers: {
//             "Authorization": `Bearer ${userToken}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (prodResponse.ok) {
//           const prodData = await prodResponse.json();
//           const activeProducts = prodData.filter(product =>
//             product.is_active === true || product.is_active === undefined
//           );
//           setProducts(activeProducts || []);
//         }

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchAllData();
//   }, [userToken]);

//   // Handle quantity change with asset ID sync
//   const handleQtyChange = (productId, value) => {
//     const qty = Math.max(0, parseInt(value) || 0);
//     const currentQty = quantities[productId] || 0;
//     const currentAssetIds = assetIds[productId] || [];
    
//     // Update quantity
//     setQuantities(prev => ({ ...prev, [productId]: qty }));
    
//     // Sync Asset IDs with quantity
//     if (qty < currentQty) {
//       // Reduce quantity: Remove extra asset IDs
//       setAssetIds(prev => ({
//         ...prev,
//         [productId]: prev[productId]?.slice(0, qty) || []
//       }));
//     } else if (qty > currentQty) {
//       // Increase quantity: Add empty asset ID slots
//       const newAssetIds = [...currentAssetIds];
//       const additionalSlots = qty - currentQty;
      
//       for (let i = 0; i < additionalSlots; i++) {
//         newAssetIds.push("");
//       }
      
//       setAssetIds(prev => ({
//         ...prev,
//         [productId]: newAssetIds
//       }));
//     }
//   };

//   const incrementQty = (productId) => {
//     const currentQty = quantities[productId] || 0;
//     const newQty = currentQty + 1;
    
//     // Update quantity
//     setQuantities(prev => ({ ...prev, [productId]: newQty }));
    
//     // Add new empty asset ID
//     setAssetIds(prev => ({
//       ...prev,
//       [productId]: [...(prev[productId] || []), ""]
//     }));
//   };

//   const decrementQty = (productId) => {
//     const currentQty = quantities[productId] || 0;
//     if (currentQty <= 0) return;
    
//     const newQty = currentQty - 1;
    
//     // Update quantity
//     setQuantities(prev => ({ ...prev, [productId]: newQty }));
    
//     // Remove last asset ID
//     setAssetIds(prev => ({
//       ...prev,
//       [productId]: prev[productId]?.slice(0, -1) || []
//     }));
//   };

//   // Handle product selection
//   const handleManualProductSelection = (productId) => {
//     const isCurrentlySelected = selectedProductIds.includes(productId);
    
//     if (isCurrentlySelected) {
//       // Deselect product
//       setSelectedProductIds(prev => prev.filter(id => id !== productId));
//       setQuantities(prev => {
//         const newQuantities = { ...prev };
//         delete newQuantities[productId];
//         return newQuantities;
//       });
//       setAssetIds(prev => {
//         const newAssetIds = { ...prev };
//         delete newAssetIds[productId];
//         return newAssetIds;
//       });
//     } else {
//       // Select product and initialize with quantity 1 if not already set
//       setSelectedProductIds(prev => [...prev, productId]);
//       if (!quantities[productId]) {
//         setQuantities(prev => ({ ...prev, [productId]: 1 }));
//         setAssetIds(prev => ({ ...prev, [productId]: [""] }));
//       }
//     }
//   };

//   // Validation functions
//   const validateForm = () => {
//     const errors = {
//       goodsReceiptStatus: !formData.goodsReceiptStatus
//         ? "Status is required"
//         : "",
//       products:
//         selectedProductIds.length === 0
//           ? "At least one product is required"
//           : "",
//     };

//     if (usePurchaseOrder) {
//       errors.purchaseOrderId = !formData.purchaseOrderId
//         ? "Purchase Order is required"
//         : "";
//     }

//     setValidationErrors(errors);
//     return !Object.values(errors).some((error) => error !== "");
//   };

//   const validateAssetIds = () => {
//     const errors = {};
//     let isValid = true;

//     Object.entries(quantities).forEach(([productId, qty]) => {
//       if (qty > 0) {
//         const currentAssetIds = assetIds[productId] || [];

//         // Check for empty required fields
//         for (let i = 0; i < Math.min(currentAssetIds.length, qty); i++) {
//           if (!currentAssetIds[i] || !currentAssetIds[i].trim()) {
//             errors[`${productId}-${i}`] = `Asset ID ${i + 1} cannot be empty`;
//             errors[productId] = "Please fill all required Asset IDs";
//             isValid = false;
//           }
//         }

//         // Check for duplicates
//         const normalizedIds = currentAssetIds
//           .slice(0, qty)
//           .map(id => id.trim().toLowerCase())
//           .filter(id => id !== "");

//         const uniqueIds = new Set(normalizedIds);
//         if (uniqueIds.size !== normalizedIds.length) {
//           errors[productId] = "Duplicate asset IDs found";
//           isValid = false;
//         }
//       }
//     });

//     setAssetIdErrors(errors);
//     return isValid;
//   };

//   // Purchase order handlers
//   const handlePurchaseOrderToggle = (usePO) => {
//     setUsePurchaseOrder(usePO);

//     if (!usePO) {
//       setSelectedPurchaseOrder(null);
//       setFormData((prev) => ({
//         ...prev,
//         purchaseOrderId: "",
//         purchaseOrderStatus: "",
//         supplier_id: "",
//         supplierName: "",
//         description: "",
//         isSupplierLocked: false,
//       }));
//       setSelectedProductIds([]);
//       setQuantities({});
//       setAssetIds({});
//     } else {
//       setSelectedProductIds([]);
//       setQuantities({});
//       setAssetIds({});
//     }
//   };

//   const handlePurchaseOrderChange = (e) => {
//     const selectedId = e.target.value;
//     setValidationErrors((prev) => ({ ...prev, purchaseOrderId: "" }));

//     if (!selectedId) {
//       setSelectedPurchaseOrder(null);
//       setFormData((prev) => ({
//         ...prev,
//         purchaseOrderId: "",
//         purchaseOrderStatus: "",
//         supplier_id: "",
//         supplierName: "",
//         description: "",
//         isSupplierLocked: false,
//       }));
//       setSelectedProductIds([]);
//       setQuantities({});
//       setAssetIds({});
//       return;
//     }

//     const selectedOrder = purchaseOrders.find(
//       (order) => order.id.toString() === selectedId
//     );
//     setSelectedPurchaseOrder(selectedOrder);

//     const supplier = suppliers.find((s) => s.id === selectedOrder.supplier_id);
//     const supplierName = supplier ? supplier.supplier_name : "No Supplier name";

//     setFormData((prev) => ({
//       ...prev,
//       purchaseOrderId: selectedOrder.purchase_order_id,
//       purchaseOrderStatus: selectedOrder.po_status,
//       supplier_id: selectedOrder.supplier_id,
//       supplierName: supplierName,
//       description: selectedOrder.description,
//       isSupplierLocked: true,
//       owner: selectedOrder.owner,
//       purchaseType: selectedOrder.purchase_type,
//     }));

//     const productIds = selectedOrder.selected_products.map(
//       (item) => item.product_id
//     );
//     setSelectedProductIds(productIds);

//     const newQuantities = {};
//     selectedOrder.selected_products.forEach((item) => {
//       newQuantities[item.product_id] = item.quantity;
//     });
//     setQuantities(newQuantities);
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setValidationErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   // Filter products for search
//   const filteredProducts = products.filter(
//     (product) =>
//       product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.description?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Submit handler
//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       setSnackbar({
//         open: true,
//         message: "Please fill all required fields",
//         severity: "error",
//       });
//       return;
//     }

//     if (!validateAssetIds()) {
//       setSnackbar({
//         open: true,
//         message: "Please fix all asset ID errors",
//         severity: "error",
//       });
//       return;
//     }

//     try {
//       // 🚨 FIX: Use selected_products structure
//       const items = selectedProductIds
//         .filter((productId) => quantities[productId] > 0)
//         .map((productId) => {
//           const product = products.find((p) => p.id === productId);
//           const quantity = quantities[productId] || 0;
//           const productAssetIds = assetIds[productId] || [];

//           return {
//             product_id: productId,
//             product_name: product?.product_name || "",
//             quantity: quantity,
//             asset_ids: productAssetIds.filter((id) => id.trim() !== ""),
//           };
//         });

//       if (items.length === 0) {
//         throw new Error("Please add at least one product with quantity > 0");
//       }

//       const payload = {
//         goods_receipt_id: formData.goodsReceiptId,
//         vendor_invoice_number: formData.vendorInvoiceNumber,
//         supplier_id: formData.supplier_id,
//         goods_receipt_date: formData.goodsReceiptDate,
//         purchase_type: formData.purchaseType,
//         goods_receipt_status: formData.goodsReceiptStatus,
//         description: formData.description,
//         owner: formData.owner,
//         items, // 🚨 This should match your backend expectation
//       };

//       if (usePurchaseOrder && selectedPurchaseOrder) {
//         payload.purchase_order_id = selectedPurchaseOrder.purchase_order_id;
//         payload.purchase_order_status = selectedPurchaseOrder.po_status;
//       }

//       console.log("Submitting payload:", payload); // Debug log

//       const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${userToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Failed to update goods receipt"
//         );
//       }

//       setSnackbar({
//         open: true,
//         message: "Goods Receipt updated successfully!",
//         severity: "success",
//       });

//       setTimeout(() => {
//         navigate("/dashboard/procurement/goodsreceipt");
//       }, 1500);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err.message,
//         severity: "error",
//       });
//     }
//   };

//   // Get products to display in table
//   const getProductsToDisplay = () => {
//     if (usePurchaseOrder && selectedPurchaseOrder) {
//       return products.filter((product) =>
//         selectedProductIds.includes(product.id)
//       );
//     } else {
//       // Show products that are selected OR all filtered products
//       const selectedProducts = products.filter(product => 
//         selectedProductIds.includes(product.id)
//       );
      
//       // If we have selected products, show them first, then filtered products
//       if (selectedProducts.length > 0) {
//         return selectedProducts;
//       }
      
//       return filteredProducts;
//     }
//   };

//   if (isLoadingData) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//         <Box ml={2}>Loading goods receipt data...</Box>
//       </Box>
//     );
//   }

//   return (
//     <div style={containerStyle}>
//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//       >
//         <Alert
//           onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <div style={formContainerStyle}>
//         {/* Goods Receipt Details */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>📦</div>
//             <h3 style={cardHeaderStyle}>Goods Receipt Details</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             <Field
//               label="Goods Receipt ID"
//               placeholder="Enter Goods Receipt ID"
//               value={formData.goodsReceiptId}
//               onChange={(e) =>
//                 handleInputChange("goodsReceiptId", e.target.value)
//               }
//               disabled
//             />
//             <Field
//               label="Vendor Invoice Number"
//               placeholder="Enter Vendor Invoice Number"
//               value={formData.vendorInvoiceNumber}
//               onChange={(e) =>
//                 handleInputChange("vendorInvoiceNumber", e.target.value)
//               }
//               error={validationErrors.vendorInvoiceNumber}
//             />

//             <div style={fieldsGridStyle}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={usePurchaseOrder}
//                     onChange={(e) => handlePurchaseOrderToggle(e.target.checked)}
//                     color="primary"
//                     disabled={!!originalData?.purchase_order_id}
//                   />
//                 }
//                 label={usePurchaseOrder ? "Using Purchase Order" : "Manual Product Selection"}
//               />
//               {!!originalData?.purchase_order_id && (
//                 <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
//                   Cannot change mode when a purchase order is already associated
//                 </div>
//               )}
//             </div>

//             {usePurchaseOrder && (
//               <Field
//                 label="Purchase Order"
//                 type="select"
//                 value={selectedPurchaseOrder?.id || ""}
//                 onChange={handlePurchaseOrderChange}
//                 error={validationErrors.purchaseOrderId}
//                 required
//                 disabled={!!originalData?.purchase_order_id}
//               >
//                 <option value="">Select Purchase Order</option>
//                 {purchaseOrders.map((order) => (
//                   <option key={order.id} value={order.id}>
//                     {order.purchase_order_id} - {order.supplier.supplier_name}
//                   </option>
//                 ))}
//               </Field>
//             )}

//             {usePurchaseOrder && selectedPurchaseOrder && (
//               <>
//                 <Field
//                   label="Purchase Order ID"
//                   value={formData.purchaseOrderId}
//                   disabled
//                 />
//                 <Field
//                   label="Purchase Order Status"
//                   value={formData.purchaseOrderStatus}
//                   disabled
//                 />
//               </>
//             )}

//             <Field
//               label="Goods Receipt Date"
//               type="date"
//               value={formData.goodsReceiptDate}
//               onChange={(e) =>
//                 handleInputChange("goodsReceiptDate", e.target.value)
//               }
//             />
//             {usePurchaseOrder && (
//               <Field
//                 label="Purchase Type"
//                 value={formData.purchaseType}
//                 onChange={(e) => handleInputChange("purchaseType", e.target.value)}
//                 disabled={usePurchaseOrder && selectedPurchaseOrder}
//               />
//             )}

//             <Field
//               label="Goods Receipt Status"
//               type="select"
//               value={formData.goodsReceiptStatus}
//               onChange={(e) =>
//                 handleInputChange("goodsReceiptStatus", e.target.value)
//               }
//               error={validationErrors.goodsReceiptStatus}
//               options={["Pending", "Approved", "Rejected"]}
//             />
//             <Field
//               label="Owner"
//               placeholder="Enter Owner"
//               value={formData.owner}
//               onChange={(e) => handleInputChange("owner", e.target.value)}
//               error={validationErrors.owner}
//             />
//           </div>
//         </div>

//         {/* Supplier Details */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>🏢</div>
//             <h3 style={cardHeaderStyle}>Supplier Details</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             {formData.isSupplierLocked ? (
//               <Field label="Supplier" value={formData.supplierName} disabled />
//             ) : (
//               <Field
//                 label="Supplier"
//                 type="select"
//                 value={formData.supplier_id}
//                 onChange={(e) =>
//                   handleInputChange("supplier_id", e.target.value)
//                 }
//               >
//                 <option value="">Select Supplier</option>
//                 {suppliers.map((supplier) => (
//                   <option key={supplier.id} value={supplier.id}>
//                     {supplier.supplier_name}
//                   </option>
//                 ))}
//               </Field>
//             )}
//           </div>
//         </div>

//         {/* Additional Information */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>📝</div>
//             <h3 style={cardHeaderStyle}>Additional Information</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             <Field
//               label="Description"
//               placeholder="Enter Description"
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               error={validationErrors.description}
//               type="textarea"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div style={cardStyle}>
//         <div style={cardHeaderContainerStyle}>
//           <h3 style={cardHeaderStyle}>
//             {usePurchaseOrder ? "Products from Purchase Order" : "Edit Products"}
//           </h3>
//         </div>
//         {validationErrors.products && (
//           <div style={{ color: "red", margin: "0 0 1rem 1rem" }}>
//             {validationErrors.products}
//           </div>
//         )}

//         {usePurchaseOrder && !selectedPurchaseOrder && (
//           <div style={{ color: "#666", margin: "0 0 1rem 1rem" }}>
//             Please select a Purchase Order to view products
//           </div>
//         )}

//         <div style={{ marginBottom: "1.5rem" }}>
//           <button
//             onClick={() => setShowProductTable(!showProductTable)}
//             style={{
//               padding: "0.75rem 1.5rem",
//               backgroundColor: showProductTable ? "#f3f4f6" : "#2563eb",
//               color: showProductTable ? "#374151" : "white",
//               border: "1px solid #d1d5db",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "0.875rem",
//               fontWeight: "500",
//               transition: "all 0.2s ease",
//               outline: "none",
//               marginBottom: "1rem",
//             }}
//             disabled={usePurchaseOrder && !selectedPurchaseOrder}
//           >
//             {showProductTable
//               ? "Hide Product List"
//               : "View/Edit Products"
//             }
//           </button>

//           {showProductTable && (
//             <Box p={2}>
//               {!usePurchaseOrder && (
//                 <Box className="search-wrapper" mb={2}>
//                   <TextField
//                     size="small"
//                     placeholder="Search products"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </Box>
//               )}

//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   maxHeight: "400px",
//                   overflow: "auto",
//                   position: "relative",
//                 }}
//               >
//                 <Table size="small" stickyHeader>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#0d47a1" }}>
//                       <TableCell padding="checkbox" sx={{ backgroundColor: "#0d47a1" }}>
//                         <Checkbox sx={{ color: "#fff" }} />
//                       </TableCell>
//                       <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
//                         Product Name
//                       </TableCell>
//                       <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
//                         Specifications
//                       </TableCell>
//                       <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
//                         Price per Piece
//                       </TableCell>
//                       <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
//                         Quantity
//                       </TableCell>
//                       <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
//                         Asset IDs
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {getProductsToDisplay().map((product) => {
//                       const productId = product.id;
//                       const qty = quantities[productId] || 0;
//                       const isSelected = selectedProductIds.includes(productId);
//                       const productAssetIds = assetIds[productId] || [];
                      
//                       console.log(`Product ${productId}: qty=${qty}, selected=${isSelected}, assetIds=${productAssetIds.length}`); // Debug
                      
//                       return (
//                         <TableRow key={productId}>
//                           <TableCell padding="checkbox">
//                             {/* ✅ CHECKBOX: Auto-selected based on existing data */}
//                             <Checkbox
//                               checked={isSelected}
//                               onChange={() => handleManualProductSelection(productId)}
//                               disabled={usePurchaseOrder}
//                             />
//                           </TableCell>
//                           <TableCell>{product.product_name}</TableCell>
//                           <TableCell>{generateSpecifications(product)}</TableCell>
//                           <TableCell>
//                             <div>
//                               <strong>Month:</strong> ₹{product.rent_price_per_month || "N/A"}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             {/* ✅ QUANTITY: Shows actual quantity from goods receipt */}
//                             <Box display="flex" alignItems="center">
//                               <IconButton
//                                 size="small"
//                                 onClick={() => decrementQty(productId)}
//                                 disabled={!isSelected}
//                               >
//                                 <Remove fontSize="small" />
//                               </IconButton>
//                               <TextField
//                                 type="number"
//                                 size="small"
//                                 value={qty}
//                                 onChange={(e) =>
//                                   handleQtyChange(productId, e.target.value)
//                                 }
//                                 disabled={!isSelected}
//                                 inputProps={{
//                                   min: 0,
//                                   style: { width: 60, textAlign: "center" },
//                                 }}
//                               />
//                               <IconButton
//                                 size="small"
//                                 onClick={() => incrementQty(productId)}
//                                 disabled={!isSelected}
//                               >
//                                 <Add fontSize="small" />
//                               </IconButton>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             {/* ✅ ASSET IDs: Shows actual asset IDs from goods receipt */}
//                             {qty > 0 && (
//                               <Box display="flex" flexDirection="column" gap={1}>
//                                 {productAssetIds.slice(0, qty).map((id, idx) => (
//                                   <TextField
//                                     key={idx}
//                                     size="small"
//                                     placeholder={`Asset ID ${idx + 1}`}
//                                     value={id}
//                                     onChange={(e) => {
//                                       const updated = [...productAssetIds];
//                                       updated[idx] = e.target.value;
//                                       setAssetIds((prev) => ({
//                                         ...prev,
//                                         [productId]: updated,
//                                       }));
//                                     }}
//                                     error={Boolean(assetIdErrors[`${productId}-${idx}`])}
//                                     helperText={assetIdErrors[`${productId}-${idx}`]}
//                                   />
//                                 ))}
//                                 {/* Add more asset IDs if needed */}
//                                 {productAssetIds.length < qty && (
//                                   <Button
//                                     size="small"
//                                     variant="outlined"
//                                     onClick={() => {
//                                       setAssetIds((prev) => ({
//                                         ...prev,
//                                         [productId]: [...productAssetIds, ""],
//                                       }));
//                                     }}
//                                   >
//                                     + Add Asset ID
//                                   </Button>
//                                 )}
//                               </Box>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div style={buttonContainerStyle}>
//         <button
//           style={cancelBtnStyle}
//           onClick={() => navigate("/dashboard/procurement/goodsreceipt")}
//         >
//           Cancel
//         </button>
//         <button style={createBtnStyle} onClick={handleSubmit}>
//           Update Goods Receipt
//         </button>
//       </div>
//     </div>
//   );
// };

// // Styles remain the same...
// const containerStyle = {
//   padding: "2rem",
//   fontFamily: '"Inter", "Segoe UI", sans-serif',
// };

// const formContainerStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(3, 1fr)",
//   gap: "1.5rem",
//   marginBottom: "1.5rem",
// };

// const cardStyle = {
//   backgroundColor: "#ffffff",
//   padding: "1.5rem",
//   borderRadius: "12px",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//   border: "1px solid #e2e8f0",
// };

// const cardHeaderContainerStyle = {
//   display: "flex",
//   alignItems: "center",
//   marginBottom: "1.5rem",
//   paddingBottom: "1rem",
//   borderBottom: "1px solid #e2e8f0",
// };

// const iconStyle = {
//   fontSize: "1.25rem",
//   marginRight: "0.75rem",
// };

// const cardHeaderStyle = {
//   fontSize: "1.125rem",
//   fontWeight: "600",
//   margin: 0,
// };

// const fieldsGridStyle = {
//   display: "grid",
//   gap: "1rem",
// };

// const fieldContainerStyle = {
//   display: "flex",
//   flexDirection: "column",
// };

// const labelStyle = {
//   marginBottom: "0.5rem",
//   fontWeight: "500",
//   fontSize: "0.875rem",
// };

// const inputStyle = {
//   padding: "0.625rem",
//   borderRadius: "6px",
//   border: "1px solid #cbd5e1",
//   fontSize: "0.875rem",
//   width: "100%",
// };

// const selectWrapperStyle = {
//   position: "relative",
//   width: "100%",
// };

// const selectStyle = {
//   width: "100%",
//   padding: "0.625rem",
//   borderRadius: "6px",
//   border: "1px solid #cbd5e1",
//   appearance: "none",
//   fontSize: "0.875rem",
//   backgroundColor: "#fff",
// };

// const selectArrowStyle = {
//   position: "absolute",
//   right: "0.75rem",
//   top: "50%",
//   transform: "translateY(-50%)",
//   pointerEvents: "none",
//   color: "#4b5563",
// };

// const buttonContainerStyle = {
//   marginTop: "2.5rem",
//   display: "flex",
//   gap: "1rem",
//   justifyContent: "center",
// };

// const cancelBtnStyle = {
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#f3f4f6",
//   color: "#374151",
//   borderRadius: "6px",
//   border: "1px solid #d1d5db",
//   cursor: "pointer",
//   fontWeight: "500",
//   fontSize: "0.875rem",
// };

// const createBtnStyle = {
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#2563eb",
//   color: "#ffffff",
//   borderRadius: "6px",
//   border: "none",
//   cursor: "pointer",
//   fontWeight: "500",
//   fontSize: "0.875rem",
// };

// // Field component
// const Field = ({
//   label,
//   placeholder,
//   type = "text",
//   value = "",
//   disabled = false,
//   options = [],
//   onChange,
//   children,
//   error = "",
//   required = false,
// }) => (
//   <div style={fieldContainerStyle}>
//     <label style={labelStyle}>
//       {label}
//       {required && <span style={{ color: "red" }}>*</span>}
//     </label>
//     {type === "select" ? (
//       <div style={selectWrapperStyle}>
//         <select
//           style={{
//             ...selectStyle,
//             borderColor: error ? "red" : "#cbd5e1",
//           }}
//           disabled={disabled}
//           value={value}
//           onChange={onChange}
//         >
//           {placeholder && (
//             <option value="" disabled>
//               {placeholder}
//             </option>
//           )}
//           {options.length > 0
//             ? options.map((opt, idx) => (
//                 <option key={idx} value={opt}>
//                   {opt}
//                 </option>
//               ))
//             : children}
//         </select>
//         <div style={selectArrowStyle}>▼</div>
//       </div>
//     ) : type === "textarea" ? (
//       <textarea
//         placeholder={placeholder}
//         value={value}
//         disabled={disabled}
//         style={{
//           ...inputStyle,
//           height: "80px",
//           borderColor: error ? "red" : "#cbd5e1",
//         }}
//         onChange={onChange}
//       />
//     ) : (
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         disabled={disabled}
//         style={{
//           ...inputStyle,
//           borderColor: error ? "red" : "#cbd5e1",
//         }}
//         onChange={onChange}
//       />
//     )}
//     {error && (
//       <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
//         {error}
//       </div>
//     )}
//   </div>
// );

// export default GoodsReceiptsEditLayout;














import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Typography,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
} from "@mui/material";
import { 
  Add, 
  Remove, 
  Search,
  Inventory,
  Business,
  Description,
  Save,
  Cancel,
  Receipt,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { generateSpecifications } from "../../../utils/generateSpecifications";
import API_URL from "../../../api/Api_url";

// ==================== Constants ====================
const GOODS_RECEIPT_STATUSES = ["Pending", "Approved", "Rejected"];
const PURCHASE_TYPES = ["Busy", "Sale"];
const SNACKBAR_DURATION = 3000;
const NAVIGATION_DELAY = 1500;

// ==================== Custom Hooks ====================
const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showSnackbar, hideSnackbar };
};

// ==================== API Service ====================
const apiService = {
  async fetchGoodsReceipt(id, token) {
    const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!response.ok) throw new Error(`Failed to fetch goods receipt: ${response.status}`);
    return response.json();
  },

  async fetchPurchaseOrders(token) {
    const response = await fetch(`${API_URL}/purchase-orders/approved`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!response.ok) throw new Error("Failed to fetch purchase orders");
    return response.json();
  },

  async fetchSuppliers(token) {
    const response = await fetch(`${API_URL}/supplier/list`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!response.ok) throw new Error("Failed to fetch suppliers");
    return response.json();
  },

  async fetchProducts(token) {
    const response = await fetch(`${API_URL}/product-templete/without-active`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async updateGoodsReceipt(id, data, token) {
    const response = await fetch(`${API_URL}/goods-receipts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update goods receipt");
    }
    return response.json();
  }
};

// ==================== Utility Functions ====================
const transformGoodsReceiptData = (data) => ({
  goodsReceiptId: data.goods_receipt_id || "",
  vendorInvoiceNumber: data.vendor_invoice_number || "",
  purchaseOrderId: data.purchase_order_id || "",
  purchaseOrderStatus: data.purchase_order_status || "",
  goodsReceiptDate: data.goods_receipt_date?.split("T")[0] || new Date().toISOString().split("T")[0],
  purchaseType: data.purchase_type || "",
  goodsReceiptStatus: data.goods_receipt_status || "Pending",
  owner: data.owner || "",
  supplierId: data.supplier_id || "",
  supplierName: data.supplier?.supplier_name || "",
  description: data.description || "",
});

// ==================== Sub-components ====================

// Form Field Component
const FormField = ({ 
  label, 
  name,
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  type = "text",
  placeholder,
  options = [],
  multiline = false,
  rows = 1,
  fullWidth = true,
  children,
  ...props 
}) => {
  const fieldId = `field-${name}`;
  
  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={!!error}
      disabled={disabled}
      variant="outlined"
      size="small"
    >
      {type === "select" ? (
        <>
          <InputLabel id={`${fieldId}-label`} required={required}>
            {label}
          </InputLabel>
          <Select
            labelId={`${fieldId}-label`}
            id={fieldId}
            value={value}
            onChange={onChange}
            label={label}
            {...props}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}
            {options.length > 0 ? (
              options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))
            ) : (
              children
            )}
          </Select>
        </>
      ) : (
        <TextField
          id={fieldId}
          label={label}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error}
          required={required}
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          size="small"
          {...props}
        />
      )}
    </FormControl>
  );
};

// Product Row Component
const ProductRow = ({
  product,
  isSelected,
  quantity,
  assetIds,
  onSelect,
  onQuantityChange,
  onIncrement,
  onDecrement,
  onAssetIdChange,
  onAddAssetId,
  errors,
  mode = "manual",
}) => {
  const productId = product.id;
  const assetIdErrors = errors[productId] || {};
  
  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(productId)}
        />
      </TableCell>
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {product.product_name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Model: {product.model || 'N/A'} | SKU: {product.sku || 'N/A'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ maxWidth: 200 }}>
          {generateSpecifications(product)}
        </Typography>
      </TableCell>
      <TableCell>
        <Box>
          <Typography variant="body2">
            <strong>Monthly:</strong> ₹{product.rent_price_per_month?.toLocaleString() || 'N/A'}
          </Typography>
          {product.rent_price_per_year && (
            <Typography variant="caption" color="textSecondary">
              Yearly: ₹{product.rent_price_per_year.toLocaleString()}
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            size="small"
            onClick={() => onDecrement(productId)}
            disabled={!isSelected || quantity <= 0}
            color="primary"
          >
            <Remove fontSize="small" />
          </IconButton>
          <TextField
            type="number"
            size="small"
            value={quantity}
            onChange={(e) => onQuantityChange(productId, e.target.value)}
            disabled={!isSelected}
            inputProps={{
              min: 0,
              style: { width: 60, textAlign: "center" },
            }}
          />
          <IconButton
            size="small"
            onClick={() => onIncrement(productId)}
            disabled={!isSelected}
            color="primary"
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell sx={{ minWidth: 200 }}>
        {quantity > 0 && (
          <Box display="flex" flexDirection="column" gap={1}>
            {Array.from({ length: quantity }).map((_, idx) => (
              <TextField
                key={idx}
                size="small"
                placeholder={`Asset ID ${idx + 1}`}
                value={assetIds[idx] || ""}
                onChange={(e) => onAssetIdChange(productId, idx, e.target.value)}
                error={!!assetIdErrors[`${productId}-${idx}`]}
                helperText={assetIdErrors[`${productId}-${idx}`]}
                fullWidth
              />
            ))}
            {assetIds.length < quantity && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onAddAssetId(productId)}
                startIcon={<Add />}
                sx={{ mt: 0.5 }}
              >
                Add Asset ID
              </Button>
            )}
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
};

// ==================== Main Component ====================
const GoodsReceiptsEditLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  // Custom hooks
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // Loading states
  const [loading, setLoading] = useState({
    initial: true,
    submitting: false,
  });

  // Data states
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    goodsReceiptId: "",
    vendorInvoiceNumber: "",
    purchaseOrderId: "",
    purchaseOrderStatus: "",
    goodsReceiptDate: new Date().toISOString().split("T")[0],
    purchaseType: "",
    goodsReceiptStatus: "Pending",
    owner: "",
    supplierId: "",
    supplierName: "",
    description: "",
  });

  // Product selection states
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [assetIds, setAssetIds] = useState({});
  const [assetIdErrors, setAssetIdErrors] = useState({});

  // UI states
  const [usePurchaseOrder, setUsePurchaseOrder] = useState(false);
  const [showProductTable, setShowProductTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // ==================== Data Fetching ====================
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return;

      try {
        setLoading(prev => ({ ...prev, initial: true }));
        
        // Fetch all data in parallel
        const [goodsReceipt, poList, suppliersList, productsList] = await Promise.all([
          apiService.fetchGoodsReceipt(id, token),
          apiService.fetchPurchaseOrders(token),
          apiService.fetchSuppliers(token),
          apiService.fetchProducts(token),
        ]);

        // Set goods receipt data
        const transformedData = transformGoodsReceiptData(goodsReceipt);
        setFormData(transformedData);
        
        // Set mode based on existing data
        setUsePurchaseOrder(!!goodsReceipt.purchase_order_id);

        // Set purchase orders and suppliers
        setPurchaseOrders(poList || []);
        setSuppliers(suppliersList || []);
        
        // Set products (filter active)
        const activeProducts = (productsList || []).filter(
          product => product.is_active !== false
        );
        setProducts(activeProducts);

        // Set selected products from goods receipt
        if (goodsReceipt.selected_products?.length > 0) {
          const productIds = goodsReceipt.selected_products.map(item => item.product_id);
          setSelectedProductIds(productIds);
          
          const quantityMap = {};
          const assetIdMap = {};
          
          goodsReceipt.selected_products.forEach(item => {
            quantityMap[item.product_id] = item.quantity;
            assetIdMap[item.product_id] = item.asset_ids || [];
          });

          setQuantities(quantityMap);
          setAssetIds(assetIdMap);
        }

        // Find and set selected purchase order if exists
        if (goodsReceipt.purchase_order_id && poList) {
          const selectedOrder = poList.find(
            order => order.purchase_order_id === goodsReceipt.purchase_order_id
          );
          if (selectedOrder) {
            setSelectedPurchaseOrder(selectedOrder);
          }
        }

      } catch (error) {
        console.error("Error loading data:", error);
        showSnackbar(error.message, "error");
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    fetchInitialData();
  }, [id, token, showSnackbar]);

  // ==================== Handlers ====================
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: "" }));
  }, []);

  // Mode toggle handler - ALWAYS editable
  const handleModeToggle = useCallback((usePO) => {
    setUsePurchaseOrder(usePO);

    if (!usePO) {
      // Switching to manual mode
      setSelectedPurchaseOrder(null);
      setFormData(prev => ({
        ...prev,
        purchaseOrderId: "",
        purchaseOrderStatus: "",
        supplierId: "",
        supplierName: "",
        description: "",
      }));
      // Keep existing products when switching to manual
    } else {
      // Switching to PO mode
      setSelectedPurchaseOrder(null);
      setFormData(prev => ({
        ...prev,
        purchaseOrderId: "",
        purchaseOrderStatus: "",
        supplierId: "",
        supplierName: "",
        description: "",
      }));
      // Clear products when switching to PO mode
      setSelectedProductIds([]);
      setQuantities({});
      setAssetIds({});
    }
    
    setShowProductTable(false);
  }, []);

  // Purchase order change handler
  const handlePurchaseOrderChange = useCallback((event) => {
    const selectedId = event.target.value;
    setValidationErrors(prev => ({ ...prev, purchaseOrderId: "" }));

    if (!selectedId) {
      setSelectedPurchaseOrder(null);
      setFormData(prev => ({
        ...prev,
        purchaseOrderId: "",
        purchaseOrderStatus: "",
        supplierId: "",
        supplierName: "",
        description: "",
      }));
      setSelectedProductIds([]);
      setQuantities({});
      setAssetIds({});
      return;
    }

    const selectedOrder = purchaseOrders.find(
      order => order.id.toString() === selectedId
    );
    
    if (selectedOrder) {
      const supplier = suppliers.find(s => s.id === selectedOrder.supplier_id);
      const supplierName = supplier ? supplier.supplier_name : "No Supplier name";

      setSelectedPurchaseOrder(selectedOrder);
      setFormData(prev => ({
        ...prev,
        purchaseOrderId: selectedOrder.purchase_order_id,
        purchaseOrderStatus: selectedOrder.po_status,
        supplierId: selectedOrder.supplier_id,
        supplierName: supplierName,
        description: selectedOrder.description || "",
        owner: selectedOrder.owner || prev.owner,
        purchaseType: selectedOrder.purchase_type || prev.purchaseType,
      }));

      // Set products from purchase order
      if (selectedOrder.selected_products?.length > 0) {
        const productIds = selectedOrder.selected_products.map(item => item.product_id);
        setSelectedProductIds(productIds);

        const newQuantities = {};
        selectedOrder.selected_products.forEach(item => {
          newQuantities[item.product_id] = item.quantity;
        });
        setQuantities(newQuantities);
        
        // Initialize empty asset IDs for each product
        const newAssetIds = {};
        selectedOrder.selected_products.forEach(item => {
          newAssetIds[item.product_id] = Array(item.quantity).fill("");
        });
        setAssetIds(newAssetIds);
      }
    }
  }, [purchaseOrders, suppliers]);

  // Quantity handlers
  const handleQuantityChange = useCallback((productId, value) => {
    const newQty = Math.max(0, parseInt(value) || 0);
    const currentQty = quantities[productId] || 0;
    
    setQuantities(prev => ({ ...prev, [productId]: newQty }));
    
    // Sync asset IDs with quantity
    setAssetIds(prev => {
      const currentAssetIds = prev[productId] || [];
      
      if (newQty < currentQty) {
        // Reduce quantity: remove extra asset IDs
        return {
          ...prev,
          [productId]: currentAssetIds.slice(0, newQty)
        };
      } else if (newQty > currentQty) {
        // Increase quantity: add empty asset ID slots
        const additionalSlots = newQty - currentQty;
        return {
          ...prev,
          [productId]: [...currentAssetIds, ...Array(additionalSlots).fill("")]
        };
      }
      
      return prev;
    });
  }, [quantities]);

  const handleIncrement = useCallback((productId) => {
    const currentQty = quantities[productId] || 0;
    handleQuantityChange(productId, currentQty + 1);
  }, [quantities, handleQuantityChange]);

  const handleDecrement = useCallback((productId) => {
    const currentQty = quantities[productId] || 0;
    if (currentQty <= 0) return;
    handleQuantityChange(productId, currentQty - 1);
  }, [quantities, handleQuantityChange]);

  // Asset ID handlers
  const handleAssetIdChange = useCallback((productId, index, value) => {
    setAssetIds(prev => ({
      ...prev,
      [productId]: (prev[productId] || []).map((id, i) => i === index ? value : id)
    }));
    
    // Clear error for this specific asset ID
    setAssetIdErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${productId}-${index}`];
      return newErrors;
    });
  }, []);

  const handleAddAssetId = useCallback((productId) => {
    setAssetIds(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), ""]
    }));
  }, []);

  // Product selection handler
  const handleProductSelect = useCallback((productId) => {
    setSelectedProductIds(prev => {
      const isSelected = prev.includes(productId);
      
      if (isSelected) {
        // Deselect
        setQuantities(prevQuantities => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[productId];
          return newQuantities;
        });
        setAssetIds(prevAssetIds => {
          const newAssetIds = { ...prevAssetIds };
          delete newAssetIds[productId];
          return newAssetIds;
        });
        return prev.filter(id => id !== productId);
      } else {
        // Select with default quantity 1
        setQuantities(prev => ({ ...prev, [productId]: 1 }));
        setAssetIds(prev => ({ ...prev, [productId]: [""] }));
        return [...prev, productId];
      }
    });
  }, []);

  // ==================== Validation ====================
  const validateForm = useCallback(() => {
    const errors = {};
    let isValid = true;

    // Check products
    if (selectedProductIds.length === 0) {
      errors.products = "At least one product is required";
      isValid = false;
    }

    // Check purchase order if in PO mode
    if (usePurchaseOrder && !formData.purchaseOrderId) {
      errors.purchaseOrderId = "Purchase Order is required";
      isValid = false;
    }

    // Check status
    if (!formData.goodsReceiptStatus) {
      errors.goodsReceiptStatus = "Status is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [selectedProductIds, usePurchaseOrder, formData.purchaseOrderId, formData.goodsReceiptStatus]);

  const validateAssetIds = useCallback(() => {
    const errors = {};
    let isValid = true;

    Object.entries(quantities).forEach(([productId, qty]) => {
      if (qty > 0) {
        const currentAssetIds = assetIds[productId] || [];

        // Check for empty required fields
        for (let i = 0; i < Math.min(currentAssetIds.length, qty); i++) {
          if (!currentAssetIds[i]?.trim()) {
            errors[`${productId}-${i}`] = `Asset ID ${i + 1} is required`;
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
  }, [quantities, assetIds]);

  // ==================== Submit Handler ====================
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    if (!validateAssetIds()) {
      showSnackbar("Please fix all asset ID errors", "error");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));

      // Prepare items
      const items = selectedProductIds
        .filter(productId => (quantities[productId] || 0) > 0)
        .map(productId => {
          const product = products.find(p => p.id === productId);
          const quantity = quantities[productId] || 0;
          const productAssetIds = (assetIds[productId] || []).filter(id => id.trim() !== "");

          return {
            product_id: productId,
            product_name: product?.product_name || "",
            quantity: quantity,
            asset_ids: productAssetIds,
          };
        });

      if (items.length === 0) {
        throw new Error("Please add at least one product with quantity > 0");
      }

      // Prepare payload
      const payload = {
        goods_receipt_id: formData.goodsReceiptId,
        vendor_invoice_number: formData.vendorInvoiceNumber,
        supplier_id: formData.supplierId,
        goods_receipt_date: formData.goodsReceiptDate,
        purchase_type: formData.purchaseType,
        goods_receipt_status: formData.goodsReceiptStatus,
        description: formData.description,
        owner: formData.owner,
        items,
      };

      if (usePurchaseOrder && selectedPurchaseOrder) {
        payload.purchase_order_id = selectedPurchaseOrder.purchase_order_id;
        payload.purchase_order_status = selectedPurchaseOrder.po_status;
      }

      await apiService.updateGoodsReceipt(id, payload, token);

      showSnackbar("Goods Receipt updated successfully!", "success");

      setTimeout(() => {
        navigate("/dashboard/procurement/goodsreceipt");
      }, NAVIGATION_DELAY);

    } catch (error) {
      console.error("Error updating goods receipt:", error);
      showSnackbar(error.message, "error");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  }, [id, formData, selectedProductIds, quantities, products, assetIds, usePurchaseOrder, selectedPurchaseOrder, token, navigate, validateForm, validateAssetIds, showSnackbar]);

  // ==================== Computed Values ====================
  const filteredProducts = useMemo(() => {
    if (usePurchaseOrder && selectedPurchaseOrder) {
      // In PO mode, only show products from the selected PO
      return products.filter(product => selectedProductIds.includes(product.id));
    } else {
      // In manual mode, show filtered products
      return products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [products, searchTerm, usePurchaseOrder, selectedPurchaseOrder, selectedProductIds]);

  const currentMode = usePurchaseOrder ? "purchase-order" : "manual";

  // ==================== Loading State ====================
  if (loading.initial) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="textSecondary">
          Loading goods receipt data...
        </Typography>
      </Box>
    );
  }

  // ==================== Render ====================
  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Receipt color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Edit Goods Receipt
          </Typography>
          <Chip 
            label={usePurchaseOrder ? "PO Mode" : "Manual Mode"} 
            color={usePurchaseOrder ? "primary" : "default"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <Typography variant="caption" color="textSecondary">
          ID: {formData.goodsReceiptId || 'New'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Main Form Grid */}
      <Grid container spacing={3}>
        {/* Goods Receipt Details Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              avatar={<Inventory color="primary" />}
              title="Goods Receipt Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormField
                    label="Goods Receipt ID"
                    name="goodsReceiptId"
                    value={formData.goodsReceiptId}
                    disabled
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormField
                    label="Vendor Invoice Number"
                    name="vendorInvoiceNumber"
                    value={formData.vendorInvoiceNumber}
                    onChange={(e) => handleInputChange("vendorInvoiceNumber", e.target.value)}
                    fullWidth
                    placeholder="Enter invoice number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={500}>
                      Mode:
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={usePurchaseOrder}
                          onChange={(e) => handleModeToggle(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {usePurchaseOrder ? "Purchase Order" : "Manual"}
                        </Typography>
                      }
                      labelPlacement="start"
                    />
                  </Box>
                </Grid>

                {usePurchaseOrder && (
                  <Grid item xs={12}>
                    <FormField
                      label="Purchase Order"
                      name="purchaseOrderId"
                      type="select"
                      value={selectedPurchaseOrder?.id || ""}
                      onChange={handlePurchaseOrderChange}
                      error={validationErrors.purchaseOrderId}
                      required
                      fullWidth
                    >
                      <MenuItem value="" disabled>Select Purchase Order</MenuItem>
                      {purchaseOrders.map((order) => (
                        <MenuItem key={order.id} value={order.id}>
                          {order.purchase_order_id} - {order.supplier?.supplier_name}
                        </MenuItem>
                      ))}
                    </FormField>
                  </Grid>
                )}

                {usePurchaseOrder && selectedPurchaseOrder && (
                  <>
                    <Grid item xs={12}>
                      <FormField
                        label="Purchase Order ID"
                        name="purchaseOrderId"
                        value={formData.purchaseOrderId}
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormField
                        label="Purchase Order Status"
                        name="purchaseOrderStatus"
                        value={formData.purchaseOrderStatus}
                        disabled
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <FormField
                    label="Goods Receipt Date"
                    name="goodsReceiptDate"
                    type="date"
                    value={formData.goodsReceiptDate}
                    onChange={(e) => handleInputChange("goodsReceiptDate", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {usePurchaseOrder && (
                  <Grid item xs={12}>
                    <FormField
                      label="Purchase Type"
                      name="purchaseType"
                      value={formData.purchaseType}
                      onChange={(e) => handleInputChange("purchaseType", e.target.value)}
                      fullWidth
                      disabled
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormField
                    label="Status"
                    name="goodsReceiptStatus"
                    value={formData.goodsReceiptStatus}
                    onChange={(e) => handleInputChange("goodsReceiptStatus", e.target.value)}
                    type="select"
                    options={GOODS_RECEIPT_STATUSES}
                    required
                    error={validationErrors.goodsReceiptStatus}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    label="Owner"
                    name="owner"
                    value={formData.owner}
                    onChange={(e) => handleInputChange("owner", e.target.value)}
                    fullWidth
                    placeholder="Enter owner name"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Supplier Details Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              avatar={<Business color="primary" />}
              title="Supplier Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <FormField
                label="Supplier"
                name="supplierId"
                value={formData.supplierId}
                onChange={(e) => handleInputChange("supplierId", e.target.value)}
                type="select"
                fullWidth
              >
                <MenuItem value="" disabled>Select Supplier</MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </MenuItem>
                ))}
              </FormField>
              {formData.supplierName && formData.supplierId && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {formData.supplierName}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              avatar={<Description color="primary" />}
              title="Additional Information"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <FormField
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder="Enter description..."
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Products Section */}
<Grid item xs={12}>
  <Card elevation={2}>
    <CardHeader
      title={
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Products
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowProductTable(!showProductTable)}
            startIcon={showProductTable ? <Remove /> : <Add />}
          >
            {showProductTable ? "Hide Products" : "View/Edit Products"}
          </Button>
        </Box>
      }
    />
    <Divider />
    <CardContent>
      {validationErrors.products && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationErrors.products}
        </Alert>
      )}

      {showProductTable && (
        <Box>
          {/* Search Bar - Only show in manual mode */}
          {!usePurchaseOrder && (
            <Box mb={2}>
              <TextField
                size="small"
                placeholder="Search products by name, model, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Box>
          )}

          {/* Products Table with Scroll */}
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{ 
              maxHeight: '500px', 
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
                '&:hover': {
                  background: '#666',
                },
              },
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    padding="checkbox" 
                    width={50}
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <Checkbox />
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      fontWeight: 600,
                    }}
                  >
                    Product
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      fontWeight: 600,
                    }}
                  >
                    Specifications
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      fontWeight: 600,
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell 
                    width={150}
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      fontWeight: 600,
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      fontWeight: 600,
                    }}
                  >
                    Asset IDs
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        {usePurchaseOrder && !selectedPurchaseOrder 
                          ? "Select a purchase order to view products"
                          : "No products found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      isSelected={selectedProductIds.includes(product.id)}
                      quantity={quantities[product.id] || 0}
                      assetIds={assetIds[product.id] || []}
                      onSelect={handleProductSelect}
                      onQuantityChange={handleQuantityChange}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onAssetIdChange={handleAssetIdChange}
                      onAddAssetId={handleAddAssetId}
                      errors={assetIdErrors}
                      mode={currentMode}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary */}
          {selectedProductIds.length > 0 && (
            <Box 
              mt={2} 
              p={2} 
              bgcolor="#f5f5f5" 
              borderRadius={1}
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
              }}
            >
              <Typography variant="body2">
                <strong>Selected Products:</strong> {selectedProductIds.length} | 
                <strong> Total Items:</strong> {Object.values(quantities).reduce((a, b) => a + b, 0)}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </CardContent>
  </Card>
</Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard/procurement/goodsreceipt")}
              startIcon={<Cancel />}
              disabled={loading.submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              startIcon={loading.submitting ? <CircularProgress size={20} /> : <Save />}
              disabled={loading.submitting}
              color="primary"
            >
              {loading.submitting ? "Updating..." : "Update Goods Receipt"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={SNACKBAR_DURATION}
        onClose={hideSnackbar}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GoodsReceiptsEditLayout;