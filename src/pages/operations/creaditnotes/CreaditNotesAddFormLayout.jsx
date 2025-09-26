// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import {
//   Box,
//   TextField,
//   TableContainer,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Checkbox,
//   IconButton,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import { Add, CheckBox, Remove } from "@mui/icons-material";
// import API_URL from "../../../api/Api_url";
// import { useSelector } from "react-redux";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const generateCreditNoteNumber = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let randomPart = "";
//   for (let i = 0; i < 6; i++) {
//     randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return `CN-${randomPart}`;
// };

// // Field-specific edit dialog component
// const FieldEditDialog = ({
//   field,
//   value,
//   product,
//   selectedAssetIds = [],   // ✅ default to empty array
//   open,
//   onClose,
//   onSave,
// }) => {
//   const [editedValue, setEditedValue] = useState(value || "");
//   const [assetId, setAssetId] = useState(product.asset_id || "");
//   const [price, setPrice] = useState(product.price || "");
//   const [parentAssetId] = useState(
//     selectedAssetIds.length > 0 ? selectedAssetIds[0] : "" // ✅ pick first asset if available
//   );

//   const handleSave = () => {
//     const updatedProduct = {
//       ...product,
//       [field]: editedValue,
//       asset_id: assetId,            // manual input
//       price: price,
//       parent_asset_id: parentAssetId, // ✅ included automatically
//     };
//     onSave(updatedProduct);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Edit {field}</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//           <TextField
//             label={field}
//             value={editedValue}
//             onChange={(e) => setEditedValue(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Asset ID"
//             value={assetId}
//             onChange={(e) => setAssetId(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Price"
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             fullWidth
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSave} variant="contained">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };


// const CreaditNotesAddFormLayout = () => {
//   const navigate = useNavigate();
//   const { user, token } = useSelector((state) => state.auth);

//   const userToken = token;

//   const [formData, setFormData] = useState({
//     creditNoteNumber: generateCreditNoteNumber(),
//     creditNoteTitle: "",
//     returnedDate: "",
//     industry: "",
//     transactionType: "Credit Note",
//     paymentType: "",
//     dcId: "",
//     dcNumber: "",
//     customerId: "",
//     dcDate: "",
//     customerName: "",
//     createdBy: "",
//     amount: "",
//     reference: "",
//     tin: "",
//     pan: "",
//     email: "",
//     shippingName: "",
//     pincode: "",
//     vehicleNo: "",
//     collectedPersonName: "",
//     collectedPersonNo: "",
//     status: "Draft",
//     printCreditNote: false,
//   });

//   const [orders, setOrders] = useState([]);
//   const [deliveryChallans, setDeliveryChallans] = useState([]);
//   const [filteredDeliveryChallans, setFilteredDeliveryChallans] = useState([]);
//   const [dcSearchTerm, setDcSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProductIds, setSelectedProductIds] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [deviceIds, setDeviceIds] = useState({});
//   const [availableAssetIds, setAvailableAssetIds] = useState({});
//   const [deviceIdErrors, setDeviceIdErrors] = useState({});
//   const [showProductTable, setShowProductTable] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [searchMode, setSearchMode] = useState(false);
//   const [errors, setErrors] = useState({
//     paymentType: false,
//   });

//   // Fetch contacts and products on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch contacts
//         const contactResponse = await axios.get(
//           `${API_URL}/contacts/delivered-contacts`,
//           {
//             headers: {
//               Authorization: `Bearer ${userToken}`,
//             },
//           }
//         );
//         setOrders(contactResponse.data);

//         // Fetch products
//         const prodResponse = await axios.get(`${API_URL}/product-templete`, {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//           },
//         });
//         setProducts(prodResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setSnackbarMessage("Error fetching data: " + error.message);
//         setSnackbarSeverity("error");
//         setOpenSnackbar(true);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch delivery challans when customer is selected
//   useEffect(() => {
//     if (formData.customerId) {
//       const fetchDeliveryChallans = async () => {
//         try {
//           const response = await axios.get(
//             `${API_URL}/delivery-challans/customer/${formData.customerId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${userToken}`,
//               },
//             }
//           );
//           setDeliveryChallans(response.data);
//         } catch (error) {
//           console.error("Error fetching delivery challans:", error);
//           setSnackbarMessage(
//             "Error fetching delivery challans: " + error.message
//           );
//           setSnackbarSeverity("error");
//           setOpenSnackbar(true);
//         }
//       };
//       fetchDeliveryChallans();
//     }
//   }, [formData.customerId]);

//   const handleOrderSelect = (customerId) => {
//     const selectedCustomer = orders.find((order) => order.id === customerId);
//     if (selectedCustomer) {
//       setFormData((prev) => ({
//         ...prev,
//         customerId: selectedCustomer.id,
//         customerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
//         email: selectedCustomer.email,
//         pan: selectedCustomer.pan_no,
//         industry: selectedCustomer.industry,
//       }));
//     }
//   };

//   const handleDeliveryChallanSelect = (dcId) => {
//     const selectedDC = deliveryChallans.find((dc) => dc.id === dcId);
//     if (selectedDC) {
//       setSelectedOrder(selectedDC);
//       setFormData((prev) => ({
//         ...prev,
//         dcId: selectedDC.id,
//         dcNumber: selectedDC.dispatch_order_number || selectedDC.dc_id,
//         paymentType: selectedDC.payment_type, // This sets the payment type from DC
//         dcDate: selectedDC.dc_date,
//         shippingName: selectedDC.shipping_name,
//         pincode: selectedDC.pincode,
//         customerName: selectedDC.customer_name || prev.customerName,
//       }));

//       setSearchMode(false);
//       setFilteredDeliveryChallans([]);
//       setDcSearchTerm("");

//       // Prepare available asset IDs
//       const assetMap = {};
//       selectedDC.items.forEach((item) => {
//         assetMap[item.product_id] = item.device_ids;
//       });
//       setAvailableAssetIds(assetMap);
//     }
//   };
//   const handleProductSelection = (productId) => {
//     setSelectedProductIds((prev) => {
//       if (prev.includes(productId)) {
//         // Remove product
//         const newQuantities = { ...quantities };
//         delete newQuantities[productId];
//         setQuantities(newQuantities);

//         const newDeviceIds = { ...deviceIds };
//         delete newDeviceIds[productId];
//         setDeviceIds(newDeviceIds);

//         // Clear any errors for this product
//         setDeviceIdErrors((prevErrors) => {
//           const newErrors = { ...prevErrors };
//           delete newErrors[productId];
//           return newErrors;
//         });

//         return prev.filter((id) => id !== productId);
//       } else {
//         // Add product
//         const invoiceItem = selectedOrder.items.find(
//           (item) => item.product_id === productId
//         );
//         const defaultQty = invoiceItem ? invoiceItem.quantity : 1;

//         setQuantities((prev) => ({
//           ...prev,
//           [productId]: defaultQty,
//         }));

//         // Initialize empty device IDs array
//         setDeviceIds((prev) => ({
//           ...prev,
//           [productId]: [],
//         }));

//         return [...prev, productId];
//       }
//     });
//   };

//   const handleQtyChange = (productId, value) => {
//     const numValue = parseInt(value) || 0;
//     const invoiceItem = selectedOrder?.items.find(
//       (item) => item.product_id === productId
//     );
//     const invoiceQty = invoiceItem?.quantity || 0;

//     // Validate against original DC quantity
//     if (numValue > invoiceQty) {
//       setDeviceIdErrors((prev) => ({
//         ...prev,
//         [productId]: `Credit quantity cannot exceed DC quantity (${invoiceQty})`,
//       }));
//       return;
//     }

//     // Validate against selected asset IDs
//     const selectedDevices = deviceIds[productId] || [];
//     if (numValue < selectedDevices.length) {
//       setDeviceIdErrors((prev) => ({
//         ...prev,
//         [productId]: `Quantity cannot be less than selected devices (${selectedDevices.length})`,
//       }));
//       return;
//     }

//     setQuantities((prev) => ({
//       ...prev,
//       [productId]: numValue,
//     }));

//     // Clear error if validation passes
//     setDeviceIdErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors[productId];
//       return newErrors;
//     });

//     // Validate device IDs count matches new quantity
//     validateDeviceIds(productId, numValue);
//   };

//   const incrementQty = (productId) => {
//     const currentQty = quantities[productId] || 1;
//     const invoiceItem = selectedOrder?.items.find(
//       (item) => item.product_id === productId
//     );
//     const invoiceQty = invoiceItem?.quantity || 0;

//     if (currentQty >= invoiceQty) {
//       setDeviceIdErrors((prev) => ({
//         ...prev,
//         [productId]: `Credit quantity cannot exceed DC quantity (${invoiceQty})`,
//       }));
//       return;
//     }

//     handleQtyChange(productId, currentQty + 1);
//   };

//   const decrementQty = (productId) => {
//     const currentQty = quantities[productId] || 1;
//     if (currentQty > 1) {
//       handleQtyChange(productId, currentQty - 1);
//     }
//   };

//   const validateDeviceIds = (productId, quantity) => {
//     const selectedDevices = deviceIds[productId] || [];

//     if (selectedDevices.length > quantity) {
//       setDeviceIdErrors((prev) => ({
//         ...prev,
//         [productId]: `You've selected more devices (${selectedDevices.length}) than the credit quantity (${quantity})`,
//       }));
//     } else if (
//       selectedDevices.length < quantity &&
//       selectedDevices.length > 0
//     ) {
//       setDeviceIdErrors((prev) => ({
//         ...prev,
//         [productId]: `You need to select ${quantity} devices (currently ${selectedDevices.length})`,
//       }));
//     } else {
//       setDeviceIdErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[productId];
//         return newErrors;
//       });
//     }
//   };

//   const filteredProducts = selectedOrder
//     ? selectedOrder.items
//         .map((item) => products.find((p) => p.id === item.product_id))
//         .filter(Boolean)
//         .filter(
//           (product) =>
//             product.product_name
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase()) ||
//             product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             product.model.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     : [];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     // Clear error when user selects something
//     if (name === "paymentType" && value) {
//       setErrors((prev) => ({ ...prev, paymentType: false }));
//     }
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "selectedCustomer") {
//       handleOrderSelect(parseInt(value));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // Add a reset function
//   const resetDcSearch = () => {
//     setFilteredDeliveryChallans([]);
//     setDcSearchTerm("");
//     setSearchMode(true);
//   };

//   const handleSubmit = async () => {
//     // Validate at least one product is selected
//     if (selectedProductIds.length === 0) {
//       setSnackbarMessage("Please select at least one product");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     // Validate each selected product has quantity and matching asset IDs
//     let productErrors = {};
//     let hasProductErrors = false;

//     selectedProductIds.forEach((productId) => {
//       const qty = quantities[productId] || 0;
//       const selectedDevices = deviceIds[productId] || [];
//       const availableAssets = availableAssetIds[productId] || [];

//       // Quantity validation
//       if (qty <= 0) {
//         productErrors[productId] = "Quantity must be greater than 0";
//         hasProductErrors = true;
//       }

//       // Asset ID validation (only if product has asset IDs)
//       if (availableAssets.length > 0) {
//         if (selectedDevices.length === 0) {
//           productErrors[productId] = "Please select at least one asset ID";
//           hasProductErrors = true;
//         } else if (selectedDevices.length !== qty) {
//           productErrors[
//             productId
//           ] = `Select exactly ${qty} asset IDs for this product`;
//           hasProductErrors = true;
//         }
//       }
//     });

//     setDeviceIdErrors(productErrors);
//     if (hasProductErrors) {
//       setSnackbarMessage("Please fix product selection errors");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     // Validate required fields
//     if (!formData.returnedDate) {
//       setSnackbarMessage("Returned Date is required");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     if (!formData.paymentType) {
//       setSnackbarMessage("Payment Type is required");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     if (!formData.customerId) {
//       setSnackbarMessage("Customer selection is required");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     if (!formData.dcId) {
//       setSnackbarMessage("Delivery Challan selection is required");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     // Validate collected person fields
//     if (!formData.collectedPersonName) {
//       setErrors((prev) => ({ ...prev, collectedPersonName: true }));
//       setSnackbarMessage("Collected Person Name is required");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     if (!formData.collectedPersonNo) {
//       setErrors((prev) => ({ ...prev, collectedPersonNo: true }));
//       setSnackbarMessage("Collected Person No is required");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     let isValid = true;
//     const newErrors = {};

//     selectedProductIds.forEach((productId) => {
//       const qty = quantities[productId] || 0;
//       const selectedDevices = deviceIds[productId] || [];

//       if (selectedDevices.length !== qty) {
//         newErrors[
//           productId
//         ] = `Number of selected devices (${selectedDevices.length}) must match quantity (${qty})`;
//         isValid = false;
//       }
//     });

//     setDeviceIdErrors(newErrors);
//     if (!isValid) {
//       setSnackbarMessage("Please ensure device selections match quantities");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     if (!selectedOrder) {
//       setSnackbarMessage("Please select a dispatch order first");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//       return;
//     }

//     // Calculate total amount based on selected products and quantities
//     const totalAmount = selectedProductIds.reduce((sum, productId) => {
//       const product = products.find((p) => p.id === productId);
//       const unitPrice = product ? parseFloat(product.rent_price_per_month) : 0;
//       const qty = quantities[productId] || 0;
//       return sum + unitPrice * qty;
//     }, 0);

//     const payload = {
//       credit_note_number: formData.creditNoteNumber,
//       credit_note_title: formData.creditNoteTitle,
//       industry: formData.industry,
//       transaction_type: formData.transactionType,
//       payment_type: formData.paymentType,
//       dc_id: formData.dcId,
//       dispatch_order_id: selectedOrder.dispatch_order_id,
//       dc_number: formData.dcNumber,
//       customer_id: formData.customerId,
//       dc_date: formData.dcDate,
//       returned_date: formData.returnedDate,
//       customer_name: formData.customerName,
//       created_by: formData.createdBy,
//       amount: totalAmount,
//       reference: formData.reference,
//       tin: formData.tin,
//       pan: formData.pan,
//       email: formData.email,
//       shipping_name: formData.shippingName,
//       pincode: formData.pincode,
//       vehicle_no: formData.vehicleNo,
//       collected_person_name: formData.collectedPersonName,
//       collected_person_no: formData.collectedPersonNo,
//       status: formData.status,
//       print_credit_note: formData.printCreditNote,
//       items: selectedProductIds.map((productId) => {
//         const item = selectedOrder.items.find(
//           (item) => item.product_id === productId
//         );
//         const product = products.find((p) => p.id === productId);
//         const unitPrice = product ? product.rent_price_per_month : "0.00";

//         return {
//           product_id: productId,
//           product_name: item?.product_name || product?.product_name || "",
//           quantity: quantities[productId] || 1,
//           device_ids: deviceIds[productId] || [],
//           unit_price: unitPrice,
//           total_price: (quantities[productId] || 1) * parseFloat(unitPrice),
//         };
//       }),
//     };

//     try {
//       await axios.post(`${API_URL}/credit-notes/create`, payload, {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       });
//       setSnackbarMessage("GRN created successfully!");
//       setSnackbarSeverity("success");
//       setOpenSnackbar(true);
//       setTimeout(() => navigate("/dashboard/operations/grn"), 3000);
//     } catch (error) {
//       console.error("Error creating grn:", error);
//       setSnackbarMessage(
//         "Failed to create grn: " +
//           (error.response?.data?.message || error.message)
//       );
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") return;
//     setOpenSnackbar(false);
//   };

//   const handleDcSearch = () => {
//     if (!dcSearchTerm.trim()) {
//       setFilteredDeliveryChallans([]);
//       return;
//     }

//     const filtered = deliveryChallans.filter(
//       (dc) =>
//         dc.dc_id.toLowerCase().includes(dcSearchTerm.toLowerCase()) ||
//         dc.dc_date.includes(dcSearchTerm)
//     );
//     setFilteredDeliveryChallans(filtered);
//     setSearchMode(true);
//   };

//   // In your main component, add these state variables:
//   const [editingField, setEditingField] = useState(null);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [fieldDialogOpen, setFieldDialogOpen] = useState(false);

//   // Add this function to handle saving edited field
//   const handleSaveField = async (updatedProduct) => {
//   try {
//     // Prepare the payload for the API
//     const payload = {
//       product_id: updatedProduct.id,
//       field_updates: {
//         [editingField]: updatedProduct[editingField],
//         asset_id: updatedProduct.asset_id,
//         price: updatedProduct.price,
//         parent_asset_id:updatedProduct.parent_asset_id,
//       }
//     };

//     // Make API call to update the product
//     const response = await axios.put(
//       `${API_URL}/products/${updatedProduct.id}/update-field`,
//       payload,
//       {
//         headers: {
//           "Authorization": `Bearer ${userToken}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     if (response.status === 200 || response.status === 201) {
//       // Update local state only after successful API call
//       setProducts(prev => 
//         prev.map(product => 
//           product.id === updatedProduct.id ? updatedProduct : product
//         )
//       );
      
//       // If this product is currently selected, update the selected products state
//       if (selectedProductIds.includes(updatedProduct.id)) {
//         // You might need to update quantities or deviceIds if price changed
//         if (editingField === "price") {
//           // Recalculate totals if price was updated
//           // This would depend on your specific implementation
//         }
//       }
      
//       setSnackbarMessage("Product updated successfully");
//       setSnackbarSeverity("success");
//     } else {
//       throw new Error("Failed to update product");
//     }
//   } catch (error) {
//     console.error("Error updating product:", error);
//     setSnackbarMessage(
//       "Failed to update product: " + 
//       (error.response?.data?.message || error.message)
//     );
//     setSnackbarSeverity("error");
//   } finally {
//     setOpenSnackbar(true);
//   }
// };

//   return (
//     <div style={containerStyle}>
//       <div style={formContainerStyle}>
//         {/* Credit Note Details Card */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>📄</div>
//             <h3 style={cardHeaderStyle}>Goods return notes Details:</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>
//                 GRN No.
//                 <span style={requiredStyle}>*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. CN-2025-001"
//                 style={inputStyle}
//                 name="creditNoteNumber"
//                 value={formData.creditNoteNumber}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             {/* <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Title</label>
//               <input
//                 type="text"
//                 placeholder="Enter title"
//                 style={inputStyle}
//                 name="creditNoteTitle"
//                 value={formData.creditNoteTitle}
//                 onChange={handleInputChange}
//               />
//             </div> */}

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>
//                 Returned Date
//                 <span style={requiredStyle}>*</span>
//               </label>
//               <input
//                 type="date"
//                 style={inputStyle}
//                 name="returnedDate"
//                 value={formData.returnedDate}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Industry</label>
//               <input
//                 type="text"
//                 placeholder="e.g. IT Services"
//                 style={inputStyle}
//                 name="industry"
//                 value={formData.industry}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               {formData.paymentType !== "Postpaid" && (
//                 <>
//                   <div style={fieldContainerStyle}>
//                     <label style={labelStyle}>Transaction Type</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Refund"
//                       style={inputStyle}
//                       name="transactionType"
//                       value={formData.transactionType}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div style={fieldContainerStyle}>
//                     <label style={labelStyle}>
//                       Payment Type
//                       <span style={requiredStyle}>*</span>
//                     </label>
//                     <select
//                       name="paymentType"
//                       value={formData.paymentType}
//                       onChange={handleInputChange}
//                       style={inputStyle}
//                     >
//                       <option value="" disabled selected>
//                         -- Select Payment Type --
//                       </option>
//                       <option value="Cash">Cash</option>
//                       <option value="Bank Transfer">Bank Transfer</option>
//                       <option value="UPI">UPI</option>
//                       <option value="Cheque">Cheque</option>
//                     </select>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>DC ID</label>
//               <input
//                 type="text"
//                 placeholder="e.g. DC102"
//                 style={inputStyle}
//                 name="dcId"
//                 value={formData.dcNumber}
//                 onChange={handleInputChange}
//                 disabled
//               />
//             </div>
//           </div>
//         </div>

//         {/* Dispatch Order / Customer Card */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>👤</div>
//             <h3 style={cardHeaderStyle}>Dispatch Order / Customer:</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>
//                 Select Customer
//                 <span style={requiredStyle}>*</span>
//               </label>
//               <FormControl fullWidth size="small">
//                 <Select
//                   name="selectedCustomer"
//                   value={formData.customerId || ""}
//                   onChange={handleSelectChange}
//                   displayEmpty
//                   inputProps={{ "aria-label": "Without label" }}
//                   style={inputStyle}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Customer
//                   </MenuItem>
//                   {orders.map((order) => (
//                     <MenuItem key={order.id} value={order.id}>
//                       {order.first_name} {order.last_name} ({order.customer_id})
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>
//                 Delivery Challan<span style={requiredStyle}>*</span>
//               </label>

//               <div
//                 style={{ display: "flex", gap: "8px", flexDirection: "column" }}
//               >
//                 {/* Combined Select and Search Input */}
//                 <div style={{ position: "relative" }}>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={formData.dcId || ""}
//                       onChange={(e) =>
//                         handleDeliveryChallanSelect(e.target.value)
//                       }
//                       displayEmpty
//                       style={{
//                         ...inputStyle,
//                         borderColor: errors.dcId ? "red" : "#d1d5db",
//                       }}
//                       disabled={!formData.customerId}
//                       MenuProps={{
//                         PaperProps: {
//                           style: {
//                             maxHeight: 300,
//                           },
//                         },
//                       }}
//                       renderValue={(selected) => {
//                         if (!selected) {
//                           return <em>Select Delivery Challan</em>;
//                         }
//                         const selectedDC = deliveryChallans.find(
//                           (dc) => dc.id === selected
//                         );
//                         return selectedDC
//                           ? `${selectedDC.dc_id} (${selectedDC.dc_date})`
//                           : "Select Delivery Challan";
//                       }}
//                     >
//                       {/* Search Input inside Dropdown */}
//                       <div
//                         style={{
//                           padding: "8px",
//                           position: "sticky",
//                           top: 0,
//                           backgroundColor: "#fff",
//                           zIndex: 1,
//                         }}
//                       >
//                         <TextField
//                           size="small"
//                           placeholder="Search DC..."
//                           fullWidth
//                           value={dcSearchTerm}
//                           onChange={(e) => setDcSearchTerm(e.target.value)}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </div>

//                       {/* Filtered DC List */}
//                       {deliveryChallans
//                         .filter(
//                           (dc) =>
//                             dc.dc_id
//                               .toLowerCase()
//                               .includes(dcSearchTerm.toLowerCase()) ||
//                             dc.dc_date.includes(dcSearchTerm)
//                         )
//                         .map((dc) => (
//                           <MenuItem key={dc.id} value={dc.id}>
//                             {dc.dc_id} ({dc.dc_date})
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </div>

//                 {/* Selected DC Info */}
//                 {formData.dcId && (
//                   <div
//                     style={{
//                       padding: "8px",
//                       border: "1px solid #e0e0e0",
//                       borderRadius: "4px",
//                       backgroundColor: "#f8f9fa",
//                     }}
//                   >
//                     <Typography variant="body2">
//                       <strong>Selected:</strong> {formData.dcNumber} (
//                       {new Date(formData.dcDate).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                       )
//                     </Typography>
//                   </div>
//                 )}
//               </div>

//               {errors.dcId && (
//                 <span style={{ color: "red", fontSize: "0.75rem" }}>
//                   Delivery Challan selection is required
//                 </span>
//               )}
//             </div>

//             {/* <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Customer ID</label>
//               <input
//                 type="text"
//                 placeholder="e.g. CUST2001"
//                 style={inputStyle}
//                 name="customerId"
//                 value={formData.customerId}
//                 onChange={handleInputChange}
//                 disabled
//               />
//             </div> */}

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Customer Name</label>
//               <input
//                 type="text"
//                 placeholder="Customer name"
//                 style={inputStyle}
//                 name="customerName"
//                 value={formData.customerName}
//                 onChange={handleInputChange}
//                 disabled
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>DC Date</label>
//               <input
//                 type="date"
//                 style={inputStyle}
//                 name="dcDate"
//                 value={formData.dcDate}
//                 onChange={handleInputChange}
//                 disabled
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Created By</label>
//               <input
//                 type="text"
//                 placeholder="Enter creator"
//                 style={inputStyle}
//                 name="createdBy"
//                 value={formData.createdBy}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Control Card */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>⚙️</div>
//             <h3 style={cardHeaderStyle}>Other Details:</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>PAN</label>
//               <input
//                 type="text"
//                 placeholder="Enter PAN"
//                 style={inputStyle}
//                 name="pan"
//                 value={formData.pan}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Email</label>
//               <input
//                 type="email"
//                 placeholder="Enter email"
//                 style={inputStyle}
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Shipping Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter shipping name"
//                 style={inputStyle}
//                 name="shippingName"
//                 value={formData.shippingName}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Pincode</label>
//               <input
//                 type="text"
//                 placeholder="Enter pincode"
//                 style={inputStyle}
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Vehicle No</label>
//               <input
//                 type="text"
//                 placeholder="Enter Vehicle No"
//                 style={{
//                   ...inputStyle,
//                   borderColor: errors.vehicleNo ? "red" : "#d1d5db",
//                 }}
//                 name="vehicleNo"
//                 value={formData.vehicleNo}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>
//                 Collected Person Name
//                 <span style={requiredStyle}>*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Collected Person Name"
//                 style={{
//                   ...inputStyle,
//                   borderColor: errors.collectedPersonName ? "red" : "#d1d5db",
//                 }}
//                 name="collectedPersonName"
//                 value={formData.collectedPersonName}
//                 onChange={handleInputChange}
//               />
//               {errors.collectedPersonName && (
//                 <span style={{ color: "red", fontSize: "0.75rem" }}>
//                   This field is required
//                 </span>
//               )}
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>
//                 Collected Person No
//                 <span style={requiredStyle}>*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Collected Person No"
//                 style={{
//                   ...inputStyle,
//                   borderColor: errors.collectedPersonNo ? "red" : "#d1d5db",
//                 }}
//                 name="collectedPersonNo"
//                 value={formData.collectedPersonNo}
//                 onChange={handleInputChange}
//               />
//               {errors.collectedPersonNo && (
//                 <span style={{ color: "red", fontSize: "0.75rem" }}>
//                   This field is required
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Select Products Section */}
//       {selectedOrder && (
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <h3 style={cardHeaderStyle}>Product Details</h3>
//           </div>

//           <div style={{ marginBottom: "1.5rem" }}>
//             <button
//               type="button"
//               onClick={() => setShowProductTable(!showProductTable)}
//               style={{
//                 padding: "0.75rem 1.5rem",
//                 backgroundColor: showProductTable ? "#f3f4f6" : "#2563eb",
//                 color: showProductTable ? "#374151" : "white",
//                 border: "1px solid #d1d5db",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 fontSize: "0.875rem",
//                 fontWeight: "500",
//                 transition: "all 0.2s ease",
//                 outline: "none",
//                 marginBottom: "1rem",
//               }}
//             >
//               {showProductTable ? "Hide Product List" : "Add Products"}
//             </button>

//             {showProductTable && (
//               <Box p={2}>
//                 <Box display="flex" gap={2} mb={2} alignItems="center">
//                   <TextField
//                     size="small"
//                     placeholder="Search products"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     fullWidth
//                   />
//                 </Box>

//                 <TableContainer component={Paper}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: "#0d47a1" }}>
//                         <TableCell padding="checkbox" sx={{ color: "#fff" }}>
//                           <Checkbox
//                             sx={{ color: "#fff" }}
//                             checked={
//                               selectedProductIds.length ===
//                                 filteredProducts.length &&
//                               filteredProducts.length > 0
//                             }
//                             indeterminate={
//                               selectedProductIds.length > 0 &&
//                               selectedProductIds.length <
//                                 filteredProducts.length
//                             }
//                             onChange={() => {
//                               if (
//                                 selectedProductIds.length ===
//                                 filteredProducts.length
//                               ) {
//                                 setSelectedProductIds([]);
//                               } else {
//                                 const newQuantities = {};
//                                 filteredProducts.forEach((product) => {
//                                   newQuantities[product.id] =
//                                     quantities[product.id] ||
//                                     selectedOrder.items.find(
//                                       (item) => item.product_id === product.id
//                                     )?.quantity ||
//                                     1;
//                                 });
//                                 setQuantities(newQuantities);
//                                 setSelectedProductIds(
//                                   filteredProducts.map((product) => product.id)
//                                 );
//                               }
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell sx={{ color: "#fff" }}>
//                           Product Name
//                         </TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Brand</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Model</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Processor</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>RAM</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Storage</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Graphics</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>DC Qty</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Credit Qty</TableCell>
//                         <TableCell sx={{ color: "#fff" }}>Asset IDs</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredProducts.map((product) => {
//                         const invoiceItem = selectedOrder.items.find(
//                           (item) => item.product_id === product.id
//                         );
//                         if (!invoiceItem) return null;

//                         return (
//                           <TableRow key={product.id}>
//                             <TableCell padding="checkbox">
//                               <Checkbox
//                                 checked={selectedProductIds.includes(
//                                   product.id
//                                 )}
//                                 onChange={() =>
//                                   handleProductSelection(product.id)
//                                 }
//                               />
//                             </TableCell>
//                             <TableCell>{product.product_name}</TableCell>
//                             <TableCell>{product.brand}</TableCell>
//                             <TableCell>{product.model}</TableCell>
//                             <TableCell>
//   {product.processor_model}
//   {deviceIds[product.id] && deviceIds[product.id].length > 0 && (
//     <IconButton 
//       size="small" 
//       onClick={() => {
//         setEditingField("processor_model");
//         setEditingProduct(product);
//         setFieldDialogOpen(true);
//       }}
//       sx={{ ml: 1 }}
//     >
//       <EditIcon fontSize="small" />
//     </IconButton>
//   )}
// </TableCell>

// <TableCell>
//   {product.ram}
//   {deviceIds[product.id] && deviceIds[product.id].length > 0 && (
//     <IconButton 
//       size="small" 
//       onClick={() => {
//         setEditingField("ram");
//         setEditingProduct(product);
//         setFieldDialogOpen(true);
//       }}
//       sx={{ ml: 1 }}
//     >
//       <EditIcon fontSize="small" />
//     </IconButton>
//   )}
// </TableCell>

// <TableCell>
//   {product.storage}
//   {deviceIds[product.id] && deviceIds[product.id].length > 0 && (
//     <IconButton 
//       size="small" 
//       onClick={() => {
//         setEditingField("storage");
//         setEditingProduct(product);
//         setFieldDialogOpen(true);
//       }}
//       sx={{ ml: 1 }}
//     >
//       <EditIcon fontSize="small" />
//     </IconButton>
//   )}
// </TableCell>

//                             <TableCell>{product.graphics}</TableCell>
//                             <TableCell>{invoiceItem.quantity}</TableCell>
//                             <TableCell>
//                               <Box display="flex" alignItems="center">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => decrementQty(product.id)}
//                                   disabled={
//                                     !selectedProductIds.includes(product.id) ||
//                                     (quantities[product.id] || 1) <= 1
//                                   }
//                                 >
//                                   <Remove fontSize="small" />
//                                 </IconButton>
//                                 <TextField
//                                   type="number"
//                                   size="small"
//                                   value={
//                                     selectedProductIds.includes(product.id)
//                                       ? quantities[product.id] || 1
//                                       : ""
//                                   }
//                                   onChange={(e) =>
//                                     handleQtyChange(product.id, e.target.value)
//                                   }
//                                   disabled={
//                                     !selectedProductIds.includes(product.id)
//                                   }
//                                   error={
//                                     !!deviceIdErrors[product.id] &&
//                                     deviceIdErrors[product.id].includes(
//                                       "quantity"
//                                     )
//                                   }
//                                   helperText={
//                                     deviceIdErrors[product.id] &&
//                                     deviceIdErrors[product.id].includes(
//                                       "quantity"
//                                     )
//                                       ? deviceIdErrors[product.id]
//                                       : ""
//                                   }
//                                   inputProps={{
//                                     min: 1,
//                                     max: invoiceItem.quantity,
//                                     style: { width: 50, textAlign: "center" },
//                                   }}
//                                 />
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => incrementQty(product.id)}
//                                   disabled={
//                                     !selectedProductIds.includes(product.id) ||
//                                     (quantities[product.id] || 1) >=
//                                       invoiceItem.quantity
//                                   }
//                                 >
//                                   <Add fontSize="small" />
//                                 </IconButton>
//                               </Box>
//                             </TableCell>

//                             <TableCell>
//                               {availableAssetIds[product.id]?.length > 0 ? (
//                                 <Box
//                                   display="flex"
//                                   flexDirection="column"
//                                   gap={1}
//                                 >
//                                   {availableAssetIds[product.id].map(
//                                     (assetId, idx) => (
//                                       <Box
//                                         key={assetId}
//                                         display="flex"
//                                         alignItems="center"
//                                       >
//                                         <Checkbox
//                                           checked={(
//                                             deviceIds[product.id] || []
//                                           ).includes(assetId)}
//                                           onChange={(e) => {
//                                             const isChecked = e.target.checked;
//                                             setDeviceIds((prev) => {
//                                               const currentIds =
//                                                 prev[product.id] || [];
//                                               const newIds = isChecked
//                                                 ? [...currentIds, assetId]
//                                                 : currentIds.filter(
//                                                     (id) => id !== assetId
//                                                   );

//                                               // Validate after change
//                                               validateDeviceIds(
//                                                 product.id,
//                                                 quantities[product.id] || 1
//                                               );

//                                               return {
//                                                 ...prev,
//                                                 [product.id]: newIds,
//                                               };
//                                             });
//                                             setParentAssetIds((prev) => {
//                 if (isChecked) {
//                   return { ...prev, [product.id]: assetId };
//                 } else if (prev[product.id] === assetId) {
//                   // remove parent if unchecked
//                   const updated = { ...prev };
//                   delete updated[product.id];
//                   return updated;
//                 }
//                 return prev;
//               });
//                                           }}
//                                           disabled={
//                                             !selectedProductIds.includes(
//                                               product.id
//                                             ) ||
//                                             (!(
//                                               deviceIds[product.id] || []
//                                             ).includes(assetId) &&
//                                               (deviceIds[product.id] || [])
//                                                 .length >=
//                                                 (quantities[product.id] || 0))
//                                           }
//                                         />
//                                         <Typography>{assetId}</Typography>
//                                       </Box>
//                                     )
//                                   )}
//                                   {deviceIdErrors[product.id] && (
//                                     <Typography color="error" variant="caption">
//                                       {deviceIdErrors[product.id]}
//                                     </Typography>
//                                   )}
//                                 </Box>
//                               ) : (
//                                 <Typography
//                                   variant="body2"
//                                   color="textSecondary"
//                                 >
//                                   No asset IDs available
//                                 </Typography>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//                 {editingProduct && editingField && (
//                   <FieldEditDialog
//                     field={editingField}
//                     value={editingProduct[editingField]}
//                     product={editingProduct}
//                     open={fieldDialogOpen}
//                     onClose={() => setFieldDialogOpen(false)}
//                     onSave={handleSaveField}
//                   />
//                 )}
//               </Box>
//             )}
//           </div>
//         </div>
//       )}

//       <div style={buttonContainerStyle}>
//         <button
//           style={cancelBtnStyle}
//           onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
//           onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
//           onClick={() => navigate("/dashboard/operations/credit_notes")}
//         >
//           Cancel
//         </button>
//         <button
//           style={createBtnStyle}
//           onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
//           onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
//           onClick={handleSubmit}
//           disabled={!selectedOrder}
//         >
//           Create GRN
//         </button>
//       </div>

//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// // Modern Styles
// const containerStyle = {
//   padding: "2rem",
//   fontFamily:
//     '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
//   minHeight: "100vh",
//   lineHeight: 1.6,
// };

// const breadcrumbStyle = {
//   marginBottom: "1.5rem",
//   fontSize: "0.875rem",
//   color: "#6b7280",
//   fontWeight: "400",
// };

// const formContainerStyle = {
//   display: "grid",
//   gap: "1.5rem",
//   maxWidth: "1400px",
//   margin: "0 auto",
//   gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
//   marginBottom: "1.5rem",
// };

// const cardStyle = {
//   backgroundColor: "#ffffff",
//   padding: "1.5rem",
//   borderRadius: "12px",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
//   border: "1px solid #e2e8f0",
//   transition: "box-shadow 0.2s ease",
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
//   backgroundColor: "#f1f5f9",
//   padding: "0.5rem",
//   borderRadius: "8px",
// };

// const cardHeaderStyle = {
//   fontSize: "1.125rem",
//   fontWeight: "600",
//   color: "#1e293b",
//   margin: 0,
// };

// const fieldsGridStyle = {
//   display: "grid",
//   gap: "1rem",
//   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
// };

// const fieldContainerStyle = {
//   display: "flex",
//   flexDirection: "column",
// };

// const labelStyle = {
//   display: "block",
//   marginBottom: "0.5rem",
//   fontWeight: "500",
//   fontSize: "0.875rem",
//   color: "#374151",
//   letterSpacing: "0.025em",
// };

// const requiredStyle = {
//   color: "#ef4444",
//   marginLeft: "0.25rem",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "0.75rem",
//   borderRadius: "8px",
//   border: "1px solid #d1d5db",
//   fontSize: "0.875rem",
//   backgroundColor: "#ffffff",
//   transition: "all 0.2s ease",
//   outline: "none",
//   boxSizing: "border-box",
// };

// const buttonContainerStyle = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "0.75rem",
//   maxWidth: "1400px",
//   margin: "2rem auto 0",
//   padding: "0 1.5rem",
// };

// const cancelBtnStyle = {
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#f3f4f6",
//   color: "#374151",
//   border: "1px solid #d1d5db",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "0.875rem",
//   fontWeight: "500",
//   transition: "all 0.2s ease",
//   outline: "none",
// };

// const createBtnStyle = {
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#2563eb",
//   color: "white",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "0.875rem",
//   fontWeight: "500",
//   transition: "all 0.2s ease",
//   outline: "none",
// };

// export default CreaditNotesAddFormLayout;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add, CheckBox, Remove } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const generateCreditNoteNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CN-${randomPart}`;
};

const CreaditNotesAddFormLayout = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const [formData, setFormData] = useState({
    creditNoteNumber: generateCreditNoteNumber(),
    creditNoteTitle: "",
    returnedDate: "",
    industry: "",
    transactionType: "Credit Note",
    paymentType: "",
    dcId: "",
    dcNumber: "",
    customerId: "",
    dcDate: "",
    customerName: "",
    createdBy: "",
    amount: "",
    reference: "",
    tin: "",
    pan: "",
    email: "",
    shippingName: "",
    pincode: "",
    vehicleNo: "",
    collectedPersonName: "",
    collectedPersonNo: "",
    status: "Draft",
    printCreditNote: false,
  });

  const [orders, setOrders] = useState([]);
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [filteredDeliveryChallans, setFilteredDeliveryChallans] = useState([]);
  const [dcSearchTerm, setDcSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [deviceIds, setDeviceIds] = useState({});
  const [availableAssetIds, setAvailableAssetIds] = useState({});
  const [deviceIdErrors, setDeviceIdErrors] = useState({});
  const [showProductTable, setShowProductTable] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchMode, setSearchMode] = useState(false);
  const [errors, setErrors] = useState({
    paymentType: false,
  });

  // Fetch contacts and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts
        const contactResponse = await axios.get(
          `${API_URL}/contacts/delivered-contacts`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setOrders(contactResponse.data);

        // Fetch products
        const prodResponse = await axios.get(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        setProducts(prodResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Error fetching data: " + error.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchData();
  }, []);

  // Fetch delivery challans when customer is selected
  useEffect(() => {
    if (formData.customerId) {
      const fetchDeliveryChallans = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/delivery-challans/customer/${formData.customerId}`,
            {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }
          );
          setDeliveryChallans(response.data);
        } catch (error) {
          console.error("Error fetching delivery challans:", error);
          setSnackbarMessage(
            "Error fetching delivery challans: " + error.message
          );
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      };
      fetchDeliveryChallans();
    }
  }, [formData.customerId]);

  const handleOrderSelect = (customerId) => {
    const selectedCustomer = orders.find((order) => order.id === customerId);
    if (selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        customerId: selectedCustomer.id,
        customerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
        email: selectedCustomer.email,
        pan: selectedCustomer.pan_no,
        industry: selectedCustomer.industry,
      }));
    }
  };

  const handleDeliveryChallanSelect = (dcId) => {
    const selectedDC = deliveryChallans.find((dc) => dc.id === dcId);
    if (selectedDC) {
      setSelectedOrder(selectedDC);
      setFormData((prev) => ({
        ...prev,
        dcId: selectedDC.id,
        dcNumber: selectedDC.dispatch_order_number || selectedDC.dc_id,
        paymentType: selectedDC.payment_type, // This sets the payment type from DC
        dcDate: selectedDC.dc_date,
        shippingName: selectedDC.shipping_name,
        pincode: selectedDC.pincode,
        customerName: selectedDC.customer_name || prev.customerName,
      }));

      setSearchMode(false);
      setFilteredDeliveryChallans([]);
      setDcSearchTerm("");

      // Prepare available asset IDs
      const assetMap = {};
      selectedDC.items.forEach((item) => {
        assetMap[item.product_id] = item.device_ids;
      });
      setAvailableAssetIds(assetMap);
    }
  };
  const handleProductSelection = (productId) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        // Remove product
        const newQuantities = { ...quantities };
        delete newQuantities[productId];
        setQuantities(newQuantities);

        const newDeviceIds = { ...deviceIds };
        delete newDeviceIds[productId];
        setDeviceIds(newDeviceIds);

        // Clear any errors for this product
        setDeviceIdErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[productId];
          return newErrors;
        });

        return prev.filter((id) => id !== productId);
      } else {
        // Add product
        const invoiceItem = selectedOrder.items.find(
          (item) => item.product_id === productId
        );
        const defaultQty = invoiceItem ? invoiceItem.quantity : 1;

        setQuantities((prev) => ({
          ...prev,
          [productId]: defaultQty,
        }));

        // Initialize empty device IDs array
        setDeviceIds((prev) => ({
          ...prev,
          [productId]: [],
        }));

        return [...prev, productId];
      }
    });
  };

  const handleQtyChange = (productId, value) => {
    const numValue = parseInt(value) || 0;
    const invoiceItem = selectedOrder?.items.find(
      (item) => item.product_id === productId
    );
    const invoiceQty = invoiceItem?.quantity || 0;

    // Validate against original DC quantity
    if (numValue > invoiceQty) {
      setDeviceIdErrors((prev) => ({
        ...prev,
        [productId]: `Credit quantity cannot exceed DC quantity (${invoiceQty})`,
      }));
      return;
    }

    // Validate against selected asset IDs
    const selectedDevices = deviceIds[productId] || [];
    if (numValue < selectedDevices.length) {
      setDeviceIdErrors((prev) => ({
        ...prev,
        [productId]: `Quantity cannot be less than selected devices (${selectedDevices.length})`,
      }));
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: numValue,
    }));

    // Clear error if validation passes
    setDeviceIdErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[productId];
      return newErrors;
    });

    // Validate device IDs count matches new quantity
    validateDeviceIds(productId, numValue);
  };

  const incrementQty = (productId) => {
    const currentQty = quantities[productId] || 1;
    const invoiceItem = selectedOrder?.items.find(
      (item) => item.product_id === productId
    );
    const invoiceQty = invoiceItem?.quantity || 0;

    if (currentQty >= invoiceQty) {
      setDeviceIdErrors((prev) => ({
        ...prev,
        [productId]: `Credit quantity cannot exceed DC quantity (${invoiceQty})`,
      }));
      return;
    }

    handleQtyChange(productId, currentQty + 1);
  };

  const decrementQty = (productId) => {
    const currentQty = quantities[productId] || 1;
    if (currentQty > 1) {
      handleQtyChange(productId, currentQty - 1);
    }
  };

  const validateDeviceIds = (productId, quantity) => {
    const selectedDevices = deviceIds[productId] || [];

    if (selectedDevices.length > quantity) {
      setDeviceIdErrors((prev) => ({
        ...prev,
        [productId]: `You've selected more devices (${selectedDevices.length}) than the credit quantity (${quantity})`,
      }));
    } else if (
      selectedDevices.length < quantity &&
      selectedDevices.length > 0
    ) {
      setDeviceIdErrors((prev) => ({
        ...prev,
        [productId]: `You need to select ${quantity} devices (currently ${selectedDevices.length})`,
      }));
    } else {
      setDeviceIdErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[productId];
        return newErrors;
      });
    }
  };

  const filteredProducts = selectedOrder
    ? selectedOrder.items
        .map((item) => products.find((p) => p.id === item.product_id))
        .filter(Boolean)
        .filter(
          (product) =>
            product.product_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user selects something
    if (name === "paymentType" && value) {
      setErrors((prev) => ({ ...prev, paymentType: false }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedCustomer") {
      handleOrderSelect(parseInt(value));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a reset function
  const resetDcSearch = () => {
    setFilteredDeliveryChallans([]);
    setDcSearchTerm("");
    setSearchMode(true);
  };

  const handleSubmit = async () => {
    // Validate at least one product is selected
    if (selectedProductIds.length === 0) {
      setSnackbarMessage("Please select at least one product");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Validate each selected product has quantity and matching asset IDs
    let productErrors = {};
    let hasProductErrors = false;

    selectedProductIds.forEach((productId) => {
      const qty = quantities[productId] || 0;
      const selectedDevices = deviceIds[productId] || [];
      const availableAssets = availableAssetIds[productId] || [];

      // Quantity validation
      if (qty <= 0) {
        productErrors[productId] = "Quantity must be greater than 0";
        hasProductErrors = true;
      }

      // Asset ID validation (only if product has asset IDs)
      if (availableAssets.length > 0) {
        if (selectedDevices.length === 0) {
          productErrors[productId] = "Please select at least one asset ID";
          hasProductErrors = true;
        } else if (selectedDevices.length !== qty) {
          productErrors[
            productId
          ] = `Select exactly ${qty} asset IDs for this product`;
          hasProductErrors = true;
        }
      }
    });

    setDeviceIdErrors(productErrors);
    if (hasProductErrors) {
      setSnackbarMessage("Please fix product selection errors");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Validate required fields
    if (!formData.returnedDate) {
      setSnackbarMessage("Returned Date is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!formData.paymentType) {
      setSnackbarMessage("Payment Type is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!formData.customerId) {
      setSnackbarMessage("Customer selection is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!formData.dcId) {
      setSnackbarMessage("Delivery Challan selection is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Validate collected person fields
    if (!formData.collectedPersonName) {
      setErrors((prev) => ({ ...prev, collectedPersonName: true }));
      setSnackbarMessage("Collected Person Name is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!formData.collectedPersonNo) {
      setErrors((prev) => ({ ...prev, collectedPersonNo: true }));
      setSnackbarMessage("Collected Person No is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    let isValid = true;
    const newErrors = {};

    selectedProductIds.forEach((productId) => {
      const qty = quantities[productId] || 0;
      const selectedDevices = deviceIds[productId] || [];

      if (selectedDevices.length !== qty) {
        newErrors[
          productId
        ] = `Number of selected devices (${selectedDevices.length}) must match quantity (${qty})`;
        isValid = false;
      }
    });

    setDeviceIdErrors(newErrors);
    if (!isValid) {
      setSnackbarMessage("Please ensure device selections match quantities");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!selectedOrder) {
      setSnackbarMessage("Please select a dispatch order first");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Calculate total amount based on selected products and quantities
    const totalAmount = selectedProductIds.reduce((sum, productId) => {
      const product = products.find((p) => p.id === productId);
      const unitPrice = product ? parseFloat(product.rent_price_per_month) : 0;
      const qty = quantities[productId] || 0;
      return sum + unitPrice * qty;
    }, 0);

    const payload = {
      credit_note_number: formData.creditNoteNumber,
      credit_note_title: formData.creditNoteTitle,
      industry: formData.industry,
      transaction_type: formData.transactionType,
      payment_type: formData.paymentType,
      dc_id: formData.dcId,
      dispatch_order_id: selectedOrder.dispatch_order_id,
      dc_number: formData.dcNumber,
      customer_id: formData.customerId,
      dc_date: formData.dcDate,
      returned_date: formData.returnedDate,
      customer_name: formData.customerName,
      created_by: formData.createdBy,
      amount: totalAmount,
      reference: formData.reference,
      tin: formData.tin,
      pan: formData.pan,
      email: formData.email,
      shipping_name: formData.shippingName,
      pincode: formData.pincode,
      vehicle_no: formData.vehicleNo,
      collected_person_name: formData.collectedPersonName,
      collected_person_no: formData.collectedPersonNo,
      status: formData.status,
      print_credit_note: formData.printCreditNote,
      items: selectedProductIds.map((productId) => {
        const item = selectedOrder.items.find(
          (item) => item.product_id === productId
        );
        const product = products.find((p) => p.id === productId);
        const unitPrice = product ? product.rent_price_per_month : "0.00";

        return {
          product_id: productId,
          product_name: item?.product_name || product?.product_name || "",
          quantity: quantities[productId] || 1,
          device_ids: deviceIds[productId] || [],
          unit_price: unitPrice,
          total_price: (quantities[productId] || 1) * parseFloat(unitPrice),
        };
      }),
    };

    try {
      await axios.post(`${API_URL}/credit-notes/create`, payload, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      setSnackbarMessage("GRN created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/dashboard/operations/grn"), 3000);
    } catch (error) {
      console.error("Error creating grn:", error);
      setSnackbarMessage(
        "Failed to create grn: " +
          (error.response?.data?.message || error.message)
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleDcSearch = () => {
    if (!dcSearchTerm.trim()) {
      setFilteredDeliveryChallans([]);
      return;
    }

    const filtered = deliveryChallans.filter(
      (dc) =>
        dc.dc_id.toLowerCase().includes(dcSearchTerm.toLowerCase()) ||
        dc.dc_date.includes(dcSearchTerm)
    );
    setFilteredDeliveryChallans(filtered);
    setSearchMode(true);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* Credit Note Details Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📄</div>
            <h3 style={cardHeaderStyle}>Goods return notes Details:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                GRN No.
                <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CN-2025-001"
                style={inputStyle}
                name="creditNoteNumber"
                value={formData.creditNoteNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* <div style={fieldContainerStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                placeholder="Enter title"
                style={inputStyle}
                name="creditNoteTitle"
                value={formData.creditNoteTitle}
                onChange={handleInputChange}
              />
            </div> */}

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Returned Date
                <span style={requiredStyle}>*</span>
              </label>
              <input
                type="date"
                style={inputStyle}
                name="returnedDate"
                value={formData.returnedDate}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Industry</label>
              <input
                type="text"
                placeholder="e.g. IT Services"
                style={inputStyle}
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              {formData.paymentType !== "Postpaid" && (
                <>
                  <div style={fieldContainerStyle}>
                    <label style={labelStyle}>Transaction Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Refund"
                      style={inputStyle}
                      name="transactionType"
                      value={formData.transactionType}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                      Payment Type
                      <span style={requiredStyle}>*</span>
                    </label>
                    <select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="" disabled selected>
                        -- Select Payment Type --
                      </option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>DC ID</label>
              <input
                type="text"
                placeholder="e.g. DC102"
                style={inputStyle}
                name="dcId"
                value={formData.dcNumber}
                onChange={handleInputChange}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Dispatch Order / Customer Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Dispatch Order / Customer:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Select Customer
                <span style={requiredStyle}>*</span>
              </label>
              <FormControl fullWidth size="small">
                <Select
                  name="selectedCustomer"
                  value={formData.customerId || ""}
                  onChange={handleSelectChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  style={inputStyle}
                >
                  <MenuItem value="" disabled>
                    Select Customer
                  </MenuItem>
                  {orders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {order.first_name} {order.last_name} ({order.customer_id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Delivery Challan<span style={requiredStyle}>*</span>
              </label>

              <div
                style={{ display: "flex", gap: "8px", flexDirection: "column" }}
              >
                {/* Combined Select and Search Input */}
                <div style={{ position: "relative" }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.dcId || ""}
                      onChange={(e) =>
                        handleDeliveryChallanSelect(e.target.value)
                      }
                      displayEmpty
                      style={{
                        ...inputStyle,
                        borderColor: errors.dcId ? "red" : "#d1d5db",
                      }}
                      disabled={!formData.customerId}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Select Delivery Challan</em>;
                        }
                        const selectedDC = deliveryChallans.find(
                          (dc) => dc.id === selected
                        );
                        return selectedDC
                          ? `${selectedDC.dc_id} (${selectedDC.dc_date})`
                          : "Select Delivery Challan";
                      }}
                    >
                      {/* Search Input inside Dropdown */}
                      <div
                        style={{
                          padding: "8px",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          zIndex: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          placeholder="Search DC..."
                          fullWidth
                          value={dcSearchTerm}
                          onChange={(e) => setDcSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Filtered DC List */}
                      {deliveryChallans
                        .filter(
                          (dc) =>
                            dc.dc_id
                              .toLowerCase()
                              .includes(dcSearchTerm.toLowerCase()) ||
                            dc.dc_date.includes(dcSearchTerm)
                        )
                        .map((dc) => (
                          <MenuItem key={dc.id} value={dc.id}>
                            {dc.dc_id} ({dc.dc_date})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Selected DC Info */}
                {formData.dcId && (
                  <div
                    style={{
                      padding: "8px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Selected:</strong> {formData.dcNumber} (
                      {new Date(formData.dcDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      )
                    </Typography>
                  </div>
                )}
              </div>

              {errors.dcId && (
                <span style={{ color: "red", fontSize: "0.75rem" }}>
                  Delivery Challan selection is required
                </span>
              )}
            </div>

            {/* <div style={fieldContainerStyle}>
              <label style={labelStyle}>Customer ID</label>
              <input
                type="text"
                placeholder="e.g. CUST2001"
                style={inputStyle}
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                disabled
              />
            </div> */}

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Customer Name</label>
              <input
                type="text"
                placeholder="Customer name"
                style={inputStyle}
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>DC Date</label>
              <input
                type="date"
                style={inputStyle}
                name="dcDate"
                value={formData.dcDate}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Created By</label>
              <input
                type="text"
                placeholder="Enter creator"
                style={inputStyle}
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Control Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Other Details:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>PAN</label>
              <input
                type="text"
                placeholder="Enter PAN"
                style={inputStyle}
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                style={inputStyle}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Shipping Name</label>
              <input
                type="text"
                placeholder="Enter shipping name"
                style={inputStyle}
                name="shippingName"
                value={formData.shippingName}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Pincode</label>
              <input
                type="text"
                placeholder="Enter pincode"
                style={inputStyle}
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Vehicle No</label>
              <input
                type="text"
                placeholder="Enter Vehicle No"
                style={{
                  ...inputStyle,
                  borderColor: errors.vehicleNo ? "red" : "#d1d5db",
                }}
                name="vehicleNo"
                value={formData.vehicleNo}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Collected Person Name
                <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Collected Person Name"
                style={{
                  ...inputStyle,
                  borderColor: errors.collectedPersonName ? "red" : "#d1d5db",
                }}
                name="collectedPersonName"
                value={formData.collectedPersonName}
                onChange={handleInputChange}
              />
              {errors.collectedPersonName && (
                <span style={{ color: "red", fontSize: "0.75rem" }}>
                  This field is required
                </span>
              )}
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Collected Person No
                <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Collected Person No"
                style={{
                  ...inputStyle,
                  borderColor: errors.collectedPersonNo ? "red" : "#d1d5db",
                }}
                name="collectedPersonNo"
                value={formData.collectedPersonNo}
                onChange={handleInputChange}
              />
              {errors.collectedPersonNo && (
                <span style={{ color: "red", fontSize: "0.75rem" }}>
                  This field is required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      {selectedOrder && (
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Product Details</h3>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
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
                              selectedProductIds.length ===
                                filteredProducts.length &&
                              filteredProducts.length > 0
                            }
                            indeterminate={
                              selectedProductIds.length > 0 &&
                              selectedProductIds.length <
                                filteredProducts.length
                            }
                            onChange={() => {
                              if (
                                selectedProductIds.length ===
                                filteredProducts.length
                              ) {
                                setSelectedProductIds([]);
                              } else {
                                const newQuantities = {};
                                filteredProducts.forEach((product) => {
                                  newQuantities[product.id] =
                                    quantities[product.id] ||
                                    selectedOrder.items.find(
                                      (item) => item.product_id === product.id
                                    )?.quantity ||
                                    1;
                                });
                                setQuantities(newQuantities);
                                setSelectedProductIds(
                                  filteredProducts.map((product) => product.id)
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Product Name
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Brand</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Model</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Processor</TableCell>
                        <TableCell sx={{ color: "#fff" }}>RAM</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Storage</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Graphics</TableCell>
                        <TableCell sx={{ color: "#fff" }}>DC Qty</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Credit Qty</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Asset IDs</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const invoiceItem = selectedOrder.items.find(
                          (item) => item.product_id === product.id
                        );
                        if (!invoiceItem) return null;

                        return (
                          <TableRow key={product.id}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedProductIds.includes(
                                  product.id
                                )}
                                onChange={() =>
                                  handleProductSelection(product.id)
                                }
                              />
                            </TableCell>
                            <TableCell>{product.product_name}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{product.model}</TableCell>
                            <TableCell>{product.processor_model}</TableCell>
                            <TableCell>{product.ram}</TableCell>
                            <TableCell>{product.storage}</TableCell>
                            <TableCell>{product.graphics}</TableCell>
                            <TableCell>{invoiceItem.quantity}</TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <IconButton
                                  size="small"
                                  onClick={() => decrementQty(product.id)}
                                  disabled={
                                    !selectedProductIds.includes(product.id) ||
                                    (quantities[product.id] || 1) <= 1
                                  }
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={
                                    selectedProductIds.includes(product.id)
                                      ? quantities[product.id] || 1
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleQtyChange(product.id, e.target.value)
                                  }
                                  disabled={
                                    !selectedProductIds.includes(product.id)
                                  }
                                  error={
                                    !!deviceIdErrors[product.id] &&
                                    deviceIdErrors[product.id].includes(
                                      "quantity"
                                    )
                                  }
                                  helperText={
                                    deviceIdErrors[product.id] &&
                                    deviceIdErrors[product.id].includes(
                                      "quantity"
                                    )
                                      ? deviceIdErrors[product.id]
                                      : ""
                                  }
                                  inputProps={{
                                    min: 1,
                                    max: invoiceItem.quantity,
                                    style: { width: 50, textAlign: "center" },
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => incrementQty(product.id)}
                                  disabled={
                                    !selectedProductIds.includes(product.id) ||
                                    (quantities[product.id] || 1) >=
                                      invoiceItem.quantity
                                  }
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>

                            <TableCell>
                              {availableAssetIds[product.id]?.length > 0 ? (
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={1}
                                >
                                  {availableAssetIds[product.id].map(
                                    (assetId, idx) => (
                                      <Box
                                        key={assetId}
                                        display="flex"
                                        alignItems="center"
                                      >
                                        <Checkbox
                                          checked={(
                                            deviceIds[product.id] || []
                                          ).includes(assetId)}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setDeviceIds((prev) => {
                                              const currentIds =
                                                prev[product.id] || [];
                                              const newIds = isChecked
                                                ? [...currentIds, assetId]
                                                : currentIds.filter(
                                                    (id) => id !== assetId
                                                  );

                                              // Validate after change
                                              validateDeviceIds(
                                                product.id,
                                                quantities[product.id] || 1
                                              );

                                              return {
                                                ...prev,
                                                [product.id]: newIds,
                                              };
                                            });
                                          }}
                                          disabled={
                                            !selectedProductIds.includes(
                                              product.id
                                            ) ||
                                            (!(
                                              deviceIds[product.id] || []
                                            ).includes(assetId) &&
                                              (deviceIds[product.id] || [])
                                                .length >=
                                                (quantities[product.id] || 0))
                                          }
                                        />
                                        <Typography>{assetId}</Typography>
                                      </Box>
                                    )
                                  )}
                                  {deviceIdErrors[product.id] && (
                                    <Typography color="error" variant="caption">
                                      {deviceIdErrors[product.id]}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  No asset IDs available
                                </Typography>
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
      )}

      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          onClick={() => navigate("/dashboard/operations/credit_notes")}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onClick={handleSubmit}
          disabled={!selectedOrder}
        >
          Create GRN
        </button>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Modern Styles
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const breadcrumbStyle = {
  marginBottom: "1.5rem",
  fontSize: "0.875rem",
  color: "#6b7280",
  fontWeight: "400",
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1400px",
  margin: "0 auto",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  marginBottom: "1.5rem",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
  transition: "box-shadow 0.2s ease",
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
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "500",
  fontSize: "0.875rem",
  color: "#374151",
  letterSpacing: "0.025em",
};

const requiredStyle = {
  color: "#ef4444",
  marginLeft: "0.25rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  maxWidth: "1400px",
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
  transition: "all 0.2s ease",
  outline: "none",
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
  outline: "none",
};

export default CreaditNotesAddFormLayout;