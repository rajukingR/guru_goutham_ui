// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import {
//     Box,
//     TableContainer,
//     Paper,
//     Table,
//     TableHead,
//     TableRow,
//     TableCell,
//     TableBody,
//     IconButton,
//     Typography,
//     Button,
//     List,
//     ListItem,
//     ListItemText,
//     Card,
//     CardContent,
//     Grid,
//     Chip,
//     TextField,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     FormControl,
//     Select,
//     MenuItem,
//     CircularProgress
// } from "@mui/material";
// import { Delete, Add, QrCode, Remove, Refresh } from "@mui/icons-material";
// import API_URL from "../../../api/Api_url";
// import { useSelector } from "react-redux";

// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const RemoveItemsLayout = () => {
//     const [orders, setOrders] = useState([]);
//     const [deliveryChallans, setDeliveryChallans] = useState([]);
//     const [filteredDeliveryChallans, setFilteredDeliveryChallans] = useState([]);
//     const [searchMode, setSearchMode] = useState(false);
//     const [dcSearchTerm, setDcSearchTerm] = useState("");
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [availableAssetIds, setAvailableAssetIds] = useState({});
//     const [errors, setErrors] = useState({});
//     const [addErrors, setAddErrors] = useState({});

//     const [order, setOrder] = useState(null);
//     const [currentItems, setCurrentItems] = useState([]);
//     const [availableUpgrades, setAvailableUpgrades] = useState([]);
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//     const [removeDialog, setRemoveDialog] = useState({ open: false, item: null });
//     const [addDialog, setAddDialog] = useState({ open: false, upgrade: null });
//     const [parentAssetId, setParentAssetId] = useState("");
//     const [initialItems, setInitialItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [productData, setProductData] = useState(null);
//     const [allowedCategories, setAllowedCategories] = useState([]);
//     const [saving, setSaving] = useState(false);
//     const [refreshingData, setRefreshingData] = useState(false);

//     // Add this function to filter removed items properly
//     const getFinalRemovedItems = (assetTransactions) => {
//         if (!assetTransactions?.length) return [];

//         // Group by asset_id and get the latest status for each
//         const latestStatus = {};

//         assetTransactions
//             .sort((a, b) => new Date(b.action_date) - new Date(a.action_date))
//             .forEach(tx => {
//                 if (!latestStatus[tx.asset_id]) {
//                     latestStatus[tx.asset_id] = {
//                         status: tx.status,
//                         transaction: tx
//                     };
//                 }
//             });

//         // Only return items that are finally removed (not re-added later)
//         const finalRemoved = Object.values(latestStatus)
//             .filter(item => item.status === "Removed")
//             .map(item => item.transaction);

//         return finalRemoved;
//     };

//     // Form states for main form and dialogs
//     const [formData, setFormData] = useState({
//         customerId: "",
//         customerName: "",
//         email: "",
//         pan: "",
//         industry: "",
//         dcId: "",
//         dcNumber: "",
//         paymentType: "",
//         dcDate: "",
//         shippingName: "",
//         pincode: "",
//         selectedAssetId: "",
//         selectedProductId: ""
//     });

//     const [removeForm, setRemoveForm] = useState({
//         parentAssetId: "",
//         itemsAssetId: "",
//         size: "",
//         removingDate: new Date().toISOString().split('T')[0],
//         price: ""
//     });

//     const [addForm, setAddForm] = useState({
//         parentAssetId: "",
//         addItemsAssetId: "",
//         size: "",
//         specification: "",
//         addingDate: new Date().toISOString().split('T')[0],
//         price: 0
//     });

//     // Define allowed categories mapping
//     const categoryMapping = {
//         'RAM': 'ram',
//         'Processor': 'processor',
//         'Storage': 'storage',
//         'SSD': 'storage',
//         'HDD': 'storage',
//         'Monitors': 'monitor'
//     };

//     const navigate = useNavigate();
//     const { user, token } = useSelector((state) => state.auth);

//     const userToken = token;

//     // Fetch contacts on component mount
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch contacts
//                 const contactResponse = await axios.get(
//                     `${API_URL}/contacts/delivered-contacts/list`,
//                     {
//                         headers: {
//                             "Authorization": `Bearer ${userToken}`,
//                         },
//                     }
//                 );
//                 setOrders(contactResponse.data);
//             } catch (error) {
//                 console.error("Error fetching contacts:", error);
//                 showSnackbar("Error fetching contacts: " + error.message, "error");
//             }
//         };

//         fetchData();
//     }, []);

//     // Fetch delivery challans when customer is selected
//     useEffect(() => {
//         if (formData.customerId) {
//             const fetchDeliveryChallans = async () => {
//                 try {
//                     const response = await axios.get(
//                         `${API_URL}/delivery-challans/customer/${formData.customerId}`,
//                         {
//                             headers: {
//                                 "Authorization": `Bearer ${userToken}`,
//                             },
//                         }
//                     );
//                     setDeliveryChallans(response.data);
//                 } catch (error) {
//                     console.error("Error fetching delivery challans:", error);
//                     showSnackbar("Error fetching delivery challans: " + error.message, "error");
//                 }
//             };
//             fetchDeliveryChallans();
//         }
//     }, [formData.customerId]);

//     // Fetch peripheral assets when delivery challan is selected
//     useEffect(() => {
//         if (formData.customerId && formData.dcId) {
//             fetchPeripheralAssets();
//         }
//     }, [formData.customerId, formData.dcId]);

//     const handleSelectChange = (event) => {
//         const { name, value } = event.target;

//         if (name === "selectedCustomer") {
//             const selectedCustomer = orders.find((order) => order.id === parseInt(value));
//             if (selectedCustomer) {
//                 setFormData((prev) => ({
//                     ...prev,
//                     customerId: selectedCustomer.id,
//                     customerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
//                     email: selectedCustomer.email,
//                     pan: selectedCustomer.pan_no,
//                     industry: selectedCustomer.industry,
//                     dcId: "", // Reset DC when customer changes
//                     dcNumber: "",
//                     selectedAssetId: "",
//                     selectedProductId: ""
//                 }));
//                 setSelectedOrder(null);
//                 setAvailableAssetIds({});
//                 setAvailableUpgrades([]);
//                 setCurrentItems([]);
//                 setProductData(null);
//                 setParentAssetId("");
//             }
//         }

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleDeliveryChallanSelect = (dcId) => {
//         const selectedDC = deliveryChallans.find((dc) => dc.id === parseInt(dcId));
//         if (selectedDC) {
//             setSelectedOrder(selectedDC);
//             setFormData((prev) => ({
//                 ...prev,
//                 dcId: selectedDC.id,
//                 dcNumber: selectedDC.dispatch_order_number || selectedDC.dc_id,
//                 paymentType: selectedDC.payment_type,
//                 dcDate: selectedDC.dc_date,
//                 shippingName: selectedDC.shipping_name,
//                 pincode: selectedDC.pincode,
//             }));

//             setSearchMode(false);
//             setFilteredDeliveryChallans([]);
//             setDcSearchTerm("");

//             // Prepare available asset IDs
//             const assetMap = {};
//             selectedDC.items.forEach((item) => {
//                 if (item.device_ids && item.device_ids.length > 0) {
//                     assetMap[item.product_id] = item.device_ids;
//                 }
//             });
//             setAvailableAssetIds(assetMap);
//         }
//     };

//     const handleAssetSelect = (event) => {
//         const assetId = event.target.value;
//         setFormData(prev => ({
//             ...prev,
//             selectedAssetId: assetId
//         }));

//         // Extract product ID from asset ID or find it from availableAssetIds
//         const productId = Object.keys(availableAssetIds).find(pid =>
//             availableAssetIds[pid].includes(assetId)
//         );

//         if (productId) {
//             setFormData(prev => ({
//                 ...prev,
//                 selectedProductId: productId
//             }));

//             // Set parent asset ID and fetch product data
//             setParentAssetId(assetId);
//             fetchProductData(productId, assetId);
//         }
//     };

//     const fetchPeripheralAssets = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${API_URL}/delivery-challans/peripheral-assets/${formData.customerId}`,
//                 {
//                     headers: {
//                         "Authorization": `Bearer ${userToken}`,
//                     },
//                 }
//             );

//             const apiData = response.data;
//             console.log("Peripheral Assets API Response:", apiData);

//             // Transform categories
//             const categoriesFromApi = [
//                 ...new Set(apiData.map(item => item.product?.product_category)),
//             ].filter(Boolean);

//             const filteredCategories = categoriesFromApi.filter(cat =>
//                 Object.keys(categoryMapping).includes(cat)
//             );

//             console.log("Filtered Categories:", filteredCategories);
//             setAllowedCategories(filteredCategories);

//             const transformedUpgrades = transformApiDataToUpgrades(
//                 apiData,
//                 filteredCategories
//             );
//             console.log("Transformed Upgrades:", transformedUpgrades);
//             setAvailableUpgrades(transformedUpgrades);

//         } catch (error) {
//             console.error("Error fetching peripheral assets:", error);
//             showSnackbar("Error loading available upgrades", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchProductData = async (productId, assetId) => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${API_URL}/product-templete/asset-transaction/${productId}?asset_id=${encodeURIComponent(assetId)}`,
//                 {
//                     headers: {
//                         "Authorization": `Bearer ${userToken}`,
//                     },
//                 }
//             );

//             const productData = response.data;
//             console.log("Product Data:", productData);
//             setProductData(productData);

//             // Filter assetTransactions to only include Added items
//             const addedTransactions = productData.assetTransactions.filter(
//                 (txn) => txn.status === "Added"
//             );
//             console.log("Added Asset Transactions:", addedTransactions);

//             // Set current configuration based on itemsInfo
//             const currentConfig = [];

//             if (productData.ram && !productData.itemsInfo?.ram) {
//                 currentConfig.push({
//                     id: 1,
//                     type: 'ram',
//                     name: 'RAM',
//                     specification: productData.ram,
//                     isDefault: true,
//                     price: 0,
//                     size: productData.ram,
//                     installedDate: '2024-01-15'
//                 });
//             }

//             if ((productData.processor_model || productData.processor) && (!productData.itemsInfo?.processor_model || !productData.itemsInfo?.processor)) {
//                 currentConfig.push({
//                     id: 2,
//                     type: 'processor',
//                     name: 'Processor',
//                     specification: productData.processor_model || productData.processor,
//                     isDefault: true,
//                     price: 0,
//                     size: productData.processor_model || productData.processor,
//                     installedDate: '2024-01-15'
//                 });
//             }

//             if (productData.storage && !productData.itemsInfo?.storage) {
//                 currentConfig.push({
//                     id: 3,
//                     type: 'storage',
//                     name: 'Storage',
//                     specification: productData.storage,
//                     isDefault: true,
//                     price: 0,
//                     size: productData.storage,
//                     installedDate: '2024-01-15'
//                 });
//             }

//             // Merge addedTransactions into currentConfig
//             const transactionItems = addedTransactions.map((txn) => ({
//                 id: txn.id,
//                 type: txn.item_type,
//                 name: txn.item_name,
//                 specification: txn.specification,
//                 size: txn.size,
//                 assetId: txn.asset_id,
//                 installedDate: txn.action_date,
//                 isDefault: false,
//             }));

//             const mergedConfig = [...currentConfig, ...transactionItems];
//             console.log("Merged Current Configuration:", mergedConfig);

//             setCurrentItems(mergedConfig);
//             setInitialItems(mergedConfig);

//             // Mock order data
//             const mockOrder = {
//                 customer_id: formData.customerId,
//                 parentAssetId: assetId,
//                 product_id: productId
//             };
//             setOrder(mockOrder);

//         } catch (error) {
//             console.error("Error fetching product data:", error);
//             showSnackbar("Error loading product configuration", "error");
//         } finally {
//             setLoading(false);
//         }
//     };


//     // Transform API data to available upgrades format
//     const transformApiDataToUpgrades = (apiData, allowedCats) => {
//         const upgrades = [];

//         apiData.forEach(item => {
//             const product = item.product;
//             if (!product || !product.product_category) return;

//             // Check if category is allowed
//             if (!allowedCats.includes(product.product_category)) {
//                 return;
//             }

//             // Determine component type based on category mapping
//             const type = categoryMapping[product.product_category] || '';
//             if (!type) return;

//             // Get specification based on product category
//             let specification = '';

//             if (product.product_category === 'HDD' || product.product_category === 'SSD') {
//                 specification = product.capacity || product.storage || product.model || product.product_name || '';
//             } else if (product.product_category === 'RAM') {
//                 specification = product.ram || product.model || product.product_name || '';
//             } else if (product.product_category === 'Processor') {
//                 specification = product.processor_model || product.model || product.product_name || '';
//             } else {
//                 specification = product.model || product.product_name || '';
//             }

//             // Handle items with multiple device_ids - split them into individual items
//             if (item.device_ids && item.device_ids.length > 0) {
//                 item.device_ids.forEach((deviceId, index) => {
//                     const upgrade = {
//                         id: `${item.id}-${index}`,
//                         type: type,
//                         name: product.product_name,
//                         specification: specification,
//                         price: parseFloat(product.rent_price_per_month) || 0,
//                         description: `${product.brand} ${product.model}`,
//                         assetPrefix: getAssetPrefix(type),
//                         sizes: product.capacity || product.ram || product.storage || product.processor_model || '',
//                         quantity: 1,
//                         unit_price: parseFloat(item.unit_price) || 0,
//                         total_price: parseFloat(item.total_price) || 0,
//                         device_ids: [deviceId],
//                         productDetails: product,
//                         originalItemId: item.id,
//                         category: product.product_category
//                     };
//                     upgrades.push(upgrade);
//                 });
//             } else {
//                 // For items without device_ids, create one item per quantity
//                 const quantity = item.quantity || 1;
//                 for (let i = 0; i < quantity; i++) {
//                     const upgrade = {
//                         id: `${item.id}-${i}`,
//                         type: type,
//                         name: product.product_name,
//                         specification: specification,
//                         price: parseFloat(product.rent_price_per_month) || 0,
//                         description: `${product.brand} ${product.model}`,
//                         assetPrefix: getAssetPrefix(type),
//                         sizes: product.capacity || product.ram || product.storage || product.processor_model || '',
//                         quantity: 1,
//                         unit_price: parseFloat(item.unit_price) || 0,
//                         total_price: parseFloat(item.total_price) || 0,
//                         device_ids: [],
//                         productDetails: product,
//                         originalItemId: item.id,
//                         category: product.product_category
//                     };
//                     upgrades.push(upgrade);
//                 }
//             }
//         });

//         return upgrades;
//     };

//     // Helper function to get asset prefix based on type
//     const getAssetPrefix = (type) => {
//         switch (type) {
//             case 'ram': return 'RAM';
//             case 'processor': return 'CPU';
//             case 'monitor': return 'Monitors';
//             case 'storage': return 'SSD';
//             default: return 'COMP';
//         }
//     };

//     const showSnackbar = (message, severity = "success") => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbar({ ...snackbar, open: false });
//     };

//     // Handle Remove Form Changes
//     const handleRemoveFormChange = (field, value) => {
//         setRemoveForm(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     // Handle Add Form Changes
//     const handleAddFormChange = (field, value) => {
//         setAddForm(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     // Open Remove Dialog
//     const openRemoveDialog = (item) => {
//         setRemoveForm({
//             parentAssetId: parentAssetId,
//             itemsAssetId: item.assetId || '',
//             size: item.size || '',
//             removingDate: new Date().toISOString().split('T')[0],
//             price: item.price || 0,
//         });
//         setRemoveDialog({ open: true, item });
//     };

//     // Close Remove Dialog
//     const closeRemoveDialog = () => {
//         setRemoveDialog({ open: false, item: null });
//         setRemoveForm({
//             parentAssetId: parentAssetId,
//             itemsAssetId: "",
//             size: "",
//             removingDate: new Date().toISOString().split('T')[0],
//             price: 0
//         });
//     };

//     // Open Add Dialog
//     const openAddDialog = (upgrade) => {
//         // Get the asset ID from the upgrade if available
//         const assetId = upgrade.device_ids && upgrade.device_ids.length > 0
//             ? upgrade.device_ids[0]
//             : `${upgrade.assetPrefix}-${parentAssetId}-${upgrade.sizes}-${Date.now()}`;

//         setAddForm({
//             parentAssetId: parentAssetId,
//             addItemsAssetId: assetId,
//             size: upgrade.sizes,
//             addingDate: new Date().toISOString().split('T')[0],
//             price: upgrade.price,
//             specification: upgrade.specification
//         });
//         setAddDialog({ open: true, upgrade });
//     };

//     // Close Add Dialog
//     const closeAddDialog = () => {
//         setAddDialog({ open: false, upgrade: null });
//         setAddForm({
//             parentAssetId: parentAssetId,
//             addItemsAssetId: "",
//             size: "",
//             addingDate: new Date().toISOString().split('T')[0],
//             price: 0,
//             specification: ""
//         });
//     };

//     // API call to create asset transaction
//     const createAssetTransaction = async (transactionData) => {
//         try {
//             const response = await axios.post(
//                 `${API_URL}/asset-transactions/create`,
//                 transactionData,
//                 {
//                     headers: {
//                         "Authorization": `Bearer ${userToken}`,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );
//             return response.data;
//         } catch (error) {
//             console.error('Error creating asset transaction:', error);
//             throw error;
//         }
//     };

//     // Confirm Remove Item
//     const confirmRemoveItem = async () => {
//         const { item } = removeDialog;

//         if (!item) {
//             showSnackbar("Error: No item selected for removal", "error");
//             return;
//         }

//         // Collect errors
//         const newErrors = {};
//         if (!removeForm.itemsAssetId) newErrors.itemsAssetId = "Items Asset ID is required";
//         if (!removeForm.removingDate) newErrors.removingDate = "Removing Date is required";

//         setErrors(newErrors);

//         // If any errors exist, stop submission
//         if (Object.keys(newErrors).length > 0) return;

//         const removalPayload = {
//             customer_id: order?.customer_id,
//             product_id: order?.product_id,
//             peripheral_asset_id_product_id: item.originalPeripheralProductId || null,
//             parent_asset_id: removeForm.parentAssetId,
//             asset_id: removeForm.itemsAssetId,
//             size: removeForm.size,
//             action_date: removeForm.removingDate,
//             price: parseFloat(removeForm.price) || 0,
//             status: "Removed",
//             itemDetails: {
//                 name: item.name,
//                 specification: item.specification,
//                 type: item.type,
//                 isDefault: item.isDefault ? "Default" : "Upgraded"
//             }
//         };

//         console.log("Removal Payload:", removalPayload);

//         try {
//             await createAssetTransaction(removalPayload);

//             // Update current items list
//             setCurrentItems(prevItems => prevItems.filter(currentItem => currentItem.id !== item.id));

//             showSnackbar(`Removed: ${item.name} ${item.specification}`);

//             // Refresh data to reflect changes
//             await refreshDataAfterChange();
//         } catch (error) {
//             showSnackbar("Error removing item. Please try again.", "error");
//             console.error("Remove error:", error);
//         } finally {
//             closeRemoveDialog();
//         }
//     };

//     // Confirm Add Upgrade
//     const confirmAddUpgrade = async () => {
//         const { upgrade } = addDialog;

//         if (!upgrade) {
//             showSnackbar("Error: No upgrade selected", "error");
//             return;
//         }

//         // Validate required fields
//         const newErrors = {};
//         if (!addForm.addItemsAssetId) newErrors.addItemsAssetId = "Asset ID is required";
//         if (!addForm.addingDate) newErrors.addingDate = "Adding Date is required";

//         setAddErrors(newErrors);

//         if (Object.keys(newErrors).length > 0) return;

//         const addPayload = {
//             customer_id: order?.customer_id,
//             product_id: order?.product_id,
//             peripheral_asset_id_product_id: upgrade.productDetails.id,
//             parent_asset_id: addForm.parentAssetId,
//             asset_id: addForm.addItemsAssetId,
//             size: addForm.size,
//             action_date: addForm.addingDate,
//             price: parseFloat(addForm.price) || 0,
//             status: "Added",
//             itemDetails: {
//                 name: upgrade.name,
//                 specification: upgrade.specification,
//                 type: upgrade.type,
//                 isDefault: "Upgraded",
//             }
//         };

//         try {
//             const result = await createAssetTransaction(addPayload);

//             const newItem = {
//                 id: result.id || Date.now(),
//                 type: upgrade.type,
//                 name: upgrade.name,
//                 specification: upgrade.specification,
//                 price: addForm.price,
//                 isUpgrade: true,
//                 isDefault: false,
//                 description: upgrade.description,
//                 assetId: addForm.addItemsAssetId,
//                 parentAssetId: addForm.parentAssetId,
//                 size: addForm.size,
//                 installedDate: addForm.addingDate,
//                 originalUpgradeId: upgrade.id,
//                 originalPeripheralProductId: upgrade.productDetails.id
//             };

//             setCurrentItems(prevItems => [...prevItems, newItem]);
//             showSnackbar(`Added: ${upgrade.name} - ${upgrade.specification}`);

//             // Refresh data to reflect changes
//             await refreshDataAfterChange();
//         } catch (error) {
//             showSnackbar("Error adding upgrade. Please try again.", "error");
//             console.error("Add error:", error);
//         } finally {
//             closeAddDialog();
//         }
//     };

//     // Refresh data after adding or removing items
//     const refreshDataAfterChange = async () => {
//         if (formData.selectedProductId && parentAssetId) {
//             setRefreshingData(true);
//             try {
//                 // Refresh product data
//                 await fetchProductData(formData.selectedProductId, parentAssetId);
//                 // Refresh peripheral assets
//                 await fetchPeripheralAssets();
//                 console.log("Data refreshed successfully");
//             } catch (error) {
//                 console.error("Error refreshing data:", error);
//             } finally {
//                 setRefreshingData(false);
//             }
//         }
//     };

//     // Check if a specific upgrade is already added
//     const isUpgradeAdded = (upgrade) => {
//         return currentItems.some(item =>
//             item.originalUpgradeId === upgrade.id && !item.isDefault
//         );
//     };

//     // Get available upgrades that are NOT currently added
//     const getAvailableUpgradesByType = (type) => {
//         return availableUpgrades.filter(upgrade =>
//             upgrade.type === type && !isUpgradeAdded(upgrade)
//         );
//     };

//     // Get unique types from available upgrades (dynamic)
//     const getAvailableTypes = () => {
//         const types = [...new Set(availableUpgrades.map(upgrade => upgrade.type))];
//         return types.filter(type => type);
//     };

//     // Get TOTAL available upgrades count (not added ones)
//     const getTotalAvailableUpgradesCount = () => {
//         return availableUpgrades.filter(upgrade => !isUpgradeAdded(upgrade)).length;
//     };

//     // Get all available asset IDs for dropdown
//     const getAllAssetIds = () => {
//         const allAssets = [];
//         Object.keys(availableAssetIds).forEach(productId => {
//             availableAssetIds[productId].forEach(assetId => {
//                 allAssets.push({
//                     assetId,
//                     productId
//                 });
//             });
//         });
//         return allAssets;
//     };

//     const cardStyle = {
//         marginBottom: "1rem",
//         backgroundColor: '#f0f9ff'
//     };

//     const containerStyle = {
//         padding: "2rem",
//         fontFamily: '"Inter", "Segoe UI", sans-serif',
//         minHeight: "100vh",
//         backgroundColor: "#f9fafb"
//     };

//     const labelStyle = {
//         fontWeight: 500,
//         fontSize: "0.875rem",
//         color: "#374151",
//         marginBottom: "6px",
//     };

//     const inputStyle = {
//         backgroundColor: "white"
//     };

//     return (
//         <Box sx={containerStyle}>
//             <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: "#1f2937" }}>
//                 🚀 Peripherals Updation/Deletion
//             </Typography>

//             {/* Customer and Delivery Challan Selection */}
//             <Card sx={cardStyle}>
//                 <CardContent>
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                             <FormControl fullWidth size="small">
//                                 <label style={labelStyle}>
//                                     Select Customer
//                                     <span style={{ color: "red", marginLeft: "4px" }}>*</span>
//                                 </label>
//                                 <Select
//                                     name="selectedCustomer"
//                                     value={formData.customerId || ""}
//                                     onChange={handleSelectChange}
//                                     displayEmpty
//                                     style={inputStyle}
//                                 >
//                                     <MenuItem value="" disabled>
//                                         Select Customer
//                                     </MenuItem>
//                                     {orders.map((order) => (
//                                         <MenuItem key={order.id} value={order.id}>
//                                             {`${order.first_name} ${order.last_name} (${order.company_name})`}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>

//                         <Grid item xs={12} md={6}>
//                             <FormControl fullWidth size="small">
//                                 <label style={labelStyle}>
//                                     Select Order
//                                     <span style={{ color: "red", marginLeft: "4px" }}>*</span>
//                                 </label>
//                                 <Select
//                                     value={formData.dcId || ""}
//                                     onChange={(e) => handleDeliveryChallanSelect(e.target.value)}
//                                     displayEmpty
//                                     style={inputStyle}
//                                     disabled={!formData.customerId}
//                                     MenuProps={{
//                                         PaperProps: {
//                                             style: {
//                                                 maxHeight: 300,
//                                             },
//                                         },
//                                     }}
//                                     renderValue={(selected) => {
//                                         if (!selected) {
//                                             return <em>Select Order</em>;
//                                         }
//                                         const selectedDC = deliveryChallans.find(
//                                             (dc) => dc.id === selected
//                                         );
//                                         return selectedDC
//                                             ? `${selectedDC.dc_id} (${selectedDC.dc_date})`
//                                             : "Select Delivery Challan";
//                                     }}
//                                 >
//                                     <div style={{ padding: "8px", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
//                                         <TextField
//                                             size="small"
//                                             placeholder="Search DC..."
//                                             fullWidth
//                                             value={dcSearchTerm}
//                                             onChange={(e) => setDcSearchTerm(e.target.value)}
//                                             onClick={(e) => e.stopPropagation()}
//                                         />
//                                     </div>

//                                     {deliveryChallans
//                                         .filter((dc) =>
//                                             dc.dc_id.toLowerCase().includes(dcSearchTerm.toLowerCase()) ||
//                                             dc.dc_date.includes(dcSearchTerm)
//                                         )
//                                         .map((dc) => (
//                                             <MenuItem key={dc.id} value={dc.id}>
//                                                 {dc.dc_id} ({dc.dc_date})
//                                             </MenuItem>
//                                         ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>

//                         <Grid item xs={12} md={6}>
//                             <FormControl fullWidth size="small">
//                                 <label style={labelStyle}>
//                                     Select Asset ID
//                                     <span style={{ color: "red", marginLeft: "4px" }}>*</span>
//                                 </label>
//                                 <Select
//                                     value={formData.selectedAssetId || ""}
//                                     onChange={handleAssetSelect}
//                                     displayEmpty
//                                     style={inputStyle}
//                                     disabled={!formData.dcId}
//                                 >
//                                     <MenuItem value="" disabled>
//                                         Select Asset ID
//                                     </MenuItem>
//                                     {getAllAssetIds().map((asset, index) => (
//                                         <MenuItem key={index} value={asset.assetId}>
//                                             {asset.assetId}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//             </Card>

//             {/* Only show the rest if asset is selected */}
//             {formData.selectedAssetId && (
//                 <>
//                     {/* Parent Asset ID Display */}
//                     <Card sx={{ mb: 3, backgroundColor: '#f0f9ff' }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <QrCode /> Parent Asset ID
//                             </Typography>
//                             <Typography variant="h5" sx={{ color: "#2563eb", fontWeight: 700, fontFamily: 'monospace' }}>
//                                 {formData.selectedAssetId}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 All component asset IDs will be linked to this parent asset
//                             </Typography>
//                         </CardContent>
//                     </Card>

//                     {(loading || refreshingData) ? (
//                         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
//                             <CircularProgress />
//                             <Typography sx={{ ml: 2 }}>Loading data...</Typography>
//                         </Box>
//                     ) : (
//                         <Grid container spacing={3}>
//                             {/* Current Configuration */}
//                             <Grid item xs={12} md={6}>
//                                 <Card elevation={3} sx={{ height: '100%' }}>
//                                     <CardContent>
//                                         <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
//                                             💻 Current Configuration ({currentItems.length})
//                                         </Typography>

//                                         {currentItems.length === 0 ? (
//                                             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
//                                                 No configuration data available for this product.
//                                             </Typography>
//                                         ) : (
//                                             <TableContainer component={Paper} variant="outlined">
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell>S.No</TableCell>
//                                                             <TableCell>Component</TableCell>
//                                                             <TableCell>Specification</TableCell>
//                                                             <TableCell>Asset ID</TableCell>
//                                                             <TableCell>Size</TableCell>
//                                                             <TableCell>Action</TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {currentItems.map((item, index) => (
//                                                             <TableRow key={item.id} sx={{
//                                                                 backgroundColor: item.isUpgrade ? '#f0f9ff' : 'inherit'
//                                                             }}>
//                                                                 <TableCell>{index + 1}</TableCell>
//                                                                 <TableCell>
//                                                                     <Typography variant="body2" fontWeight="medium">
//                                                                         {item.name}
//                                                                     </Typography>
//                                                                     <Chip
//                                                                         label={item.isDefault ? "Default" : "Upgrade"}
//                                                                         color={item.isDefault ? "default" : "success"}
//                                                                         size="small"
//                                                                         sx={{ mt: 0.5 }}
//                                                                     />
//                                                                 </TableCell>
//                                                                 <TableCell>{item.specification}</TableCell>
//                                                                 <TableCell>
//                                                                     {item.assetId ? (
//                                                                         <Chip
//                                                                             label={item.assetId}
//                                                                             size="small"
//                                                                             variant="outlined"
//                                                                             color="primary"
//                                                                         />
//                                                                     ) : (
//                                                                         <Typography variant="caption" color="text.secondary">
//                                                                             Not assigned
//                                                                         </Typography>
//                                                                     )}
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <Chip
//                                                                         label={item.size || item.specification}
//                                                                         size="small"
//                                                                         variant="outlined"
//                                                                         color="secondary"
//                                                                     />
//                                                                 </TableCell>
//                                                                 <TableCell>
//                                                                     <IconButton
//                                                                         color="error"
//                                                                         size="small"
//                                                                         onClick={() => openRemoveDialog(item)}
//                                                                         title="Remove item"
//                                                                     >
//                                                                         <Delete />
//                                                                     </IconButton>
//                                                                 </TableCell>
//                                                             </TableRow>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             </Grid>

//                             {/* Available Upgrades */}
//                             <Grid item xs={12} md={6}>
//                                 <Card elevation={3} sx={{ height: '100%' }}>
//                                     <CardContent>
//                                         <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
//                                             ⚡ Available Upgrades ({getTotalAvailableUpgradesCount()})
//                                         </Typography>

//                                         {availableUpgrades.length === 0 ? (
//                                             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
//                                                 No available upgrades found for this customer.
//                                             </Typography>
//                                         ) : (
//                                             <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
//                                                 {getAvailableTypes().map((type) => {
//                                                     const typeUpgrades = getAvailableUpgradesByType(type);
//                                                     if (typeUpgrades.length === 0) return null;

//                                                     return (
//                                                         <Box key={type} sx={{ mb: 3 }}>
//                                                             <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                                                                 {type.toUpperCase()} Upgrades ({typeUpgrades.length})
//                                                             </Typography>
//                                                             <List dense>
//                                                                 {typeUpgrades.map((upgrade) => (
//                                                                     <ListItem
//                                                                         key={upgrade.id}
//                                                                         secondaryAction={
//                                                                             <Button
//                                                                                 variant="contained"
//                                                                                 size="small"
//                                                                                 startIcon={<Add />}
//                                                                                 onClick={() => openAddDialog(upgrade)}
//                                                                                 disabled={isUpgradeAdded(upgrade)}
//                                                                             >
//                                                                                 {isUpgradeAdded(upgrade) ? "Added" : "Add"}
//                                                                             </Button>
//                                                                         }
//                                                                         divider
//                                                                     >
//                                                                         <ListItemText
//                                                                             primary={upgrade.name}
//                                                                             secondary={
//                                                                                 <Box>
//                                                                                     <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
//                                                                                         {upgrade.specification || 'No specification'}
//                                                                                     </Typography>
//                                                                                     {upgrade.device_ids && upgrade.device_ids.length > 0 && (
//                                                                                         <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
//                                                                                             Asset ID: {upgrade.device_ids[0]}
//                                                                                         </Typography>
//                                                                                     )}
//                                                                                 </Box>
//                                                                             }
//                                                                         />
//                                                                     </ListItem>
//                                                                 ))}
//                                                             </List>
//                                                         </Box>
//                                                     );
//                                                 })}
//                                             </Box>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             </Grid>

//                             {/* Removed Items */}
//                             <Grid item xs={12}>
//                                 <Card elevation={3} sx={{ height: '100%' }}>
//                                     <CardContent>
//                                         <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
//                                             🗑️ Removed Items
//                                         </Typography>

//                                         {productData?.assetTransactions?.filter(item => item.status === 'Removed').length === 0 ? (
//                                             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
//                                                 No items have been removed yet.
//                                             </Typography>
//                                         ) : (
//                                             <TableContainer component={Paper} variant="outlined">
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell>S.No</TableCell>
//                                                             <TableCell>Component</TableCell>
//                                                             <TableCell>Specification</TableCell>
//                                                             <TableCell>Asset ID</TableCell>
//                                                             <TableCell>Size</TableCell>
//                                                             <TableCell>Removed Date</TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {getFinalRemovedItems(productData?.assetTransactions)
//                                                             .map((item, index) => (
//                                                                 <TableRow key={item.id}>
//                                                                     <TableCell>{index + 1}</TableCell>
//                                                                     <TableCell>
//                                                                         {item.item_name}
//                                                                         <Chip
//                                                                             label={item.is_default === "Default" ? "Default" : "Upgrade"}
//                                                                             color={item.is_default === "Default" ? "default" : "success"}
//                                                                             size="small"
//                                                                             sx={{ mt: 0.5, ml: 1 }}
//                                                                         />
//                                                                     </TableCell>
//                                                                     <TableCell>{item.specification}</TableCell>
//                                                                     <TableCell>{item.asset_id}</TableCell>
//                                                                     <TableCell>{item.size}</TableCell>
//                                                                     <TableCell>{new Date(item.action_date).toLocaleDateString()}</TableCell>
//                                                                 </TableRow>
//                                                             ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         </Grid>
//                     )}

//                     {/* Remove Item Dialog */}
//                     <Dialog open={removeDialog.open} onClose={closeRemoveDialog} maxWidth="sm" fullWidth>
//                         <DialogTitle>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Remove color="error" /> Remove Component
//                             </Box>
//                         </DialogTitle>
//                         <DialogContent>
//                             <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
//                                 Removing: {removeDialog.item?.name} - {removeDialog.item?.specification}
//                             </Typography>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//                                 <TextField 
//                                     label="Parent Asset ID" 
//                                     value={removeForm.parentAssetId} 
//                                     fullWidth 
//                                     margin="dense" 
//                                     disabled 
//                                 />
//                                 <TextField
//                                     label="Items Asset ID"
//                                     value={removeForm.itemsAssetId}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleRemoveFormChange("itemsAssetId", e.target.value)}
//                                     error={!!errors.itemsAssetId}
//                                     helperText={errors.itemsAssetId}
//                                 />
//                                 <TextField
//                                     label="Size"
//                                     value={removeForm.size || removeDialog.item?.specification}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleRemoveFormChange("size", e.target.value)}
//                                 />
//                                 <TextField
//                                     label="Removing Date"
//                                     type="date"
//                                     value={removeForm.removingDate}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleRemoveFormChange("removingDate", e.target.value)}
//                                     error={!!errors.removingDate}
//                                     helperText={errors.removingDate}
//                                 />
//                                 <TextField
//                                     label="Price"
//                                     type="number"
//                                     value={removeForm.price}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleRemoveFormChange("price", e.target.value)}
//                                     error={!!errors.price}
//                                     helperText={errors.price}
//                                 />
//                             </Box>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={closeRemoveDialog}>Cancel</Button>
//                             <Button onClick={confirmRemoveItem} variant="contained" color="error">
//                                 Confirm Removal
//                             </Button>
//                         </DialogActions>
//                     </Dialog>

//                     {/* Add Upgrade Dialog */}
//                     <Dialog open={addDialog.open} onClose={closeAddDialog} maxWidth="sm" fullWidth>
//                         <DialogTitle>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Add color="success" /> Add Upgrade Component
//                             </Box>
//                         </DialogTitle>
//                         <DialogContent>
//                             <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
//                                 Adding: {addDialog.upgrade?.name} - {addDialog.upgrade?.specification}
//                             </Typography>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//                                 <TextField 
//                                     label="Parent Asset ID" 
//                                     value={addForm.parentAssetId} 
//                                     fullWidth 
//                                     margin="dense" 
//                                     disabled 
//                                 />
//                                 <TextField
//                                     label="Add Items Asset ID"
//                                     value={addForm.addItemsAssetId}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleAddFormChange("addItemsAssetId", e.target.value)}
//                                     error={!!addErrors.addItemsAssetId}
//                                     helperText={addErrors.addItemsAssetId}
//                                 />
//                                 <TextField
//                                     label="Size"
//                                     value={addForm.size || addDialog.upgrade?.specification || ""}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleAddFormChange("size", e.target.value)}
//                                 />
//                                 <TextField
//                                     label="Adding Date"
//                                     type="date"
//                                     value={addForm.addingDate}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleAddFormChange("addingDate", e.target.value)}
//                                     error={!!addErrors.addingDate}
//                                     helperText={addErrors.addingDate}
//                                 />
//                                 <TextField
//                                     label="Price"
//                                     type="number"
//                                     value={addForm.price}
//                                     fullWidth
//                                     margin="dense"
//                                     onChange={(e) => handleAddFormChange("price", e.target.value)}
//                                     error={!!addErrors.price}
//                                     helperText={addErrors.price}
//                                 />
//                             </Box>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={closeAddDialog}>Cancel</Button>
//                             <Button onClick={confirmAddUpgrade} variant="contained" color="success">
//                                 Confirm Addition
//                             </Button>
//                         </DialogActions>
//                     </Dialog>
//                 </>
//             )}

//             {/* Snackbar */}
//             <Snackbar
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//             >
//                 <Alert
//                     onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//                     severity={snackbar.severity}
//                     sx={{ width: "100%", whiteSpace: "pre-line" }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default RemoveItemsLayout;





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Grid,
    Chip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import { Delete, Add, QrCode, Remove, ExpandMore } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RemoveItemsLayout = () => {
    const [orders, setOrders] = useState([]);
    const [deliveryChallans, setDeliveryChallans] = useState([]);
    const [dcSearchTerm, setDcSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [availableAssetIds, setAvailableAssetIds] = useState({});
    const [errors, setErrors] = useState({});
    const [addErrors, setAddErrors] = useState({});

    const [order, setOrder] = useState(null);
    const [currentItems, setCurrentItems] = useState([]);
    const [availableUpgrades, setAvailableUpgrades] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [removeDialog, setRemoveDialog] = useState({ open: false, item: null });
    const [addDialog, setAddDialog] = useState({ open: false, upgrade: null });
    const [parentAssetId, setParentAssetId] = useState("");
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState(null);
    const [allowedCategories, setAllowedCategories] = useState([]);
    const [refreshingData, setRefreshingData] = useState(false);
    const [peripheralsAssetData, setPeripheralsAssetData] = useState([]);
    const [isAssembledPC, setIsAssembledPC] = useState(false);

    // Expanded sections state for accordions
    const [expandedSections, setExpandedSections] = useState({
        ram: true,
        ssd: true,
        hdd: true,
        lan_card: true,
        wifi_card: true,
        smps: true,
        graphic_card: true,
        motherboard: true,
        processor: true
    });

    // Complete category mapping for all 9 categories
    const categoryMapping = {
        'RAM': 'ram',
        'SSD': 'ssd',
        'SSD Storage': 'ssd',
        'HDD': 'hdd',
        'HDD Storage': 'hdd',
        'LAN Card': 'lan_card',
        'Network Card': 'lan_card',
        'Ethernet Card': 'lan_card',
        'Wi-Fi Card': 'wifi_card',
        'Wi-Fi Dongle': 'wifi_card',
        'SMPS': 'smps',
        'Power Supply': 'smps',
        'Graphics Card': 'graphic_card',
        'GPU': 'graphic_card',
        'Motherboard': 'motherboard',
        'Processor': 'processor',
        'CPU': 'processor'
    };

    // Protected components that cannot be removed (Only Motherboard)
    const protectedComponents = ['motherboard'];

    const canRemoveItem = (item) => {
        if (!item) return false;
        if (protectedComponents.includes(item.type?.toLowerCase())) return false;
        if (protectedComponents.includes(item.name?.toLowerCase())) return false;
        if (item.component_type?.toLowerCase() === 'motherboard') return false;
        if (item.peripheralData?.component_type?.toLowerCase() === 'motherboard') return false;
        return true;
    };

    const getFinalRemovedItems = (assetTransactions) => {
        if (!assetTransactions?.length) return [];

        const latestStatusMap = new Map();

        assetTransactions
            .sort((a, b) => new Date(b.action_date) - new Date(a.action_date))
            .forEach(tx => {
                if (!latestStatusMap.has(tx.asset_id)) {
                    latestStatusMap.set(tx.asset_id, {
                        status: tx.status,
                        transaction: tx
                    });
                }
            });

        const removedItems = [];

        for (const [assetId, data] of latestStatusMap.entries()) {
            if (data.status === "Removed") {
                const originalAddTx = assetTransactions.find(tx =>
                    tx.asset_id === assetId && tx.status === "Added"
                );

                if (originalAddTx) {
                    removedItems.push({
                        ...originalAddTx,
                        removed_date: data.transaction.action_date,
                        removed_transaction_id: data.transaction.id
                    });
                } else {
                    removedItems.push({
                        ...data.transaction,
                        removed_date: data.transaction.action_date
                    });
                }
            }
        }

        return removedItems;
    };

    const [formData, setFormData] = useState({
        customerId: "",
        customerName: "",
        email: "",
        pan: "",
        industry: "",
        dcId: "",
        dcNumber: "",
        paymentType: "",
        dcDate: "",
        shippingName: "",
        pincode: "",
        selectedAssetId: "",
        selectedProductId: ""
    });

    const [removeForm, setRemoveForm] = useState({
        parentAssetId: "",
        itemsAssetId: "",
        size: "",
        removingDate: new Date().toISOString().split('T')[0],
        price: ""
    });

    const [addForm, setAddForm] = useState({
        parentAssetId: "",
        addItemsAssetId: "",
        size: "",
        specification: "",
        addingDate: new Date().toISOString().split('T')[0],
        price: 0
    });

    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);
    const userToken = token;

    // Fetch contacts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const contactResponse = await axios.get(
                    `${API_URL}/contacts/delivered-contacts/list`,
                    {
                        headers: { "Authorization": `Bearer ${userToken}` },
                    }
                );
                setOrders(contactResponse.data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
                showSnackbar("Error fetching contacts: " + error.message, "error");
            }
        };
        fetchData();
    }, []);

    // Fetch delivery challans
    useEffect(() => {
        if (formData.customerId) {
            const fetchDeliveryChallans = async () => {
                try {
                    const response = await axios.get(
                        `${API_URL}/delivery-challans/customer/${formData.customerId}`,
                        {
                            headers: { "Authorization": `Bearer ${userToken}` },
                        }
                    );
                    setDeliveryChallans(response.data);
                } catch (error) {
                    console.error("Error fetching delivery challans:", error);
                    showSnackbar("Error fetching delivery challans: " + error.message, "error");
                }
            };
            fetchDeliveryChallans();
        }
    }, [formData.customerId]);

    // Fetch peripheral assets
    useEffect(() => {
        if (formData.customerId && formData.dcId) {
            fetchPeripheralAssets();
        }
    }, [formData.customerId, formData.dcId]);

    const handleSelectChange = (event) => {
        const { name, value } = event.target;

        if (name === "selectedCustomer") {
            const selectedCustomer = orders.find((order) => order.id === parseInt(value));
            if (selectedCustomer) {
                setFormData({
                    customerId: selectedCustomer.id,
                    customerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
                    email: selectedCustomer.email,
                    pan: selectedCustomer.pan_no,
                    industry: selectedCustomer.industry,
                    dcId: "",
                    dcNumber: "",
                    selectedAssetId: "",
                    selectedProductId: ""
                });
                setSelectedOrder(null);
                setAvailableAssetIds({});
                setAvailableUpgrades([]);
                setCurrentItems([]);
                setProductData(null);
                setParentAssetId("");
                setPeripheralsAssetData([]);
                setIsAssembledPC(false);
            }
        }
    };

    const handleDeliveryChallanSelect = (dcId) => {
        const selectedDC = deliveryChallans.find((dc) => dc.id === parseInt(dcId));
        if (selectedDC) {
            setSelectedOrder(selectedDC);
            setFormData(prev => ({
                ...prev,
                dcId: selectedDC.id,
                dcNumber: selectedDC.dispatch_order_number || selectedDC.dc_id,
                paymentType: selectedDC.payment_type,
                dcDate: selectedDC.dc_date,
                shippingName: selectedDC.shipping_name,
                pincode: selectedDC.pincode,
            }));

            setDcSearchTerm("");

            const assetMap = {};
            selectedDC.items.forEach((item) => {
                if (item.device_ids && item.device_ids.length > 0) {
                    assetMap[item.product_id] = item.device_ids;
                }
            });
            setAvailableAssetIds(assetMap);
        }
    };

    const handleAssetSelect = (event) => {
        const assetId = event.target.value;
        setFormData(prev => ({
            ...prev,
            selectedAssetId: assetId
        }));

        const productId = Object.keys(availableAssetIds).find(pid =>
            availableAssetIds[pid].includes(assetId)
        );

        if (productId) {
            setFormData(prev => ({
                ...prev,
                selectedProductId: productId
            }));
            setParentAssetId(assetId);
            fetchProductData(productId, assetId);
        }
    };

    const fetchPeripheralAssets = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/delivery-challans/peripheral-assets/${formData.customerId}`,
                {
                    headers: { "Authorization": `Bearer ${userToken}` },
                }
            );

            const apiData = response.data;
            console.log("Peripheral Assets API Response:", apiData);

            // Check if data is array or object with data property
            let peripheralData = [];
            if (Array.isArray(apiData)) {
                peripheralData = apiData;
            } else if (apiData.data && Array.isArray(apiData.data)) {
                peripheralData = apiData.data;
            } else if (apiData.success && apiData.data && Array.isArray(apiData.data)) {
                peripheralData = apiData.data;
            } else {
                console.warn("Unexpected API response format:", apiData);
                peripheralData = [];
            }

            console.log("Extracted peripheral data:", peripheralData);

            if (peripheralData.length === 0) {
                console.log("No peripheral assets found for customer");
                setAvailableUpgrades([]);
                setAllowedCategories([]);
                return;
            }

            const categoriesFromApi = [
                ...new Set(peripheralData.map(item => item.product?.product_category)),
            ].filter(Boolean);

            console.log("All categories from API:", categoriesFromApi);

            // Allowed categories exactly as specified
            const allowedCategoriesList = [
                'RAM', 'SSD', 'SSD Storage', 'HDD', 'HDD Storage',
                'LAN Card', 'Network Card', 'Ethernet Card',
                'Wi-Fi Card', 'Wi-Fi Dongle', 'SMPS', 'Power Supply',
                'Graphics Card', 'GPU', 'Motherboard', 'Processor', 'CPU'
            ];

            const filteredCategories = categoriesFromApi.filter(cat =>
                allowedCategoriesList.includes(cat)
            );

            console.log("Filtered Categories:", filteredCategories);
            setAllowedCategories(filteredCategories);

            // If no matching categories, show all available peripherals
            let upgrades = [];
            if (filteredCategories.length === 0 && peripheralData.length > 0) {
                console.log("No matching categories, showing all peripherals");
                upgrades = transformApiDataToUpgradesWithoutFilter(peripheralData);
            } else {
                upgrades = transformApiDataToUpgrades(peripheralData, filteredCategories);
            }

            console.log("Transformed Upgrades:", upgrades);
            setAvailableUpgrades(upgrades);

        } catch (error) {
            console.error("Error fetching peripheral assets:", error);
            showSnackbar("Error loading available upgrades: " + (error.response?.data?.message || error.message), "error");
            setAvailableUpgrades([]);
        }
    };

    // Add this new function for transforming without category filter
    const transformApiDataToUpgradesWithoutFilter = (apiData) => {
        const upgrades = [];

        apiData.forEach(item => {
            const product = item.product;
            if (!product) return;

            // Skip Assembled PC
            if (product.product_category === "Assembled PC") return;

            // Determine type from category
            let type = categoryMapping[product.product_category] ||
                product.product_category?.toLowerCase().replace(/ /g, '_') ||
                'peripheral';

            let specification = '';

            // Build specification based on category
            if (product.product_category === 'Processor' || product.product_category === 'CPU') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.speed || ''} ${product.cores || ''} cores`.trim();
            }
            else if (product.product_category === 'Motherboard') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.chipset || ''} ${product.socket_type || ''}`.trim();
            }
            else if (product.product_category === 'Graphics Card' || product.product_category === 'GPU') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.vram || ''} ${product.chipset || ''}`.trim();
            }
            else if (product.product_category === 'SMPS' || product.product_category === 'Power Supply') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.wattage || ''}W ${product.efficiency || ''}`.trim();
            }
            else if (product.product_category === 'SSD' || product.product_category === 'SSD Storage') {
                specification = `${product.brand || ''} ${product.capacity || product.storage || ''} ${product.model || ''}`.trim();
            }
            else if (product.product_category === 'HDD') {
                specification = product.capacity || product.storage || product.model || product.product_name || '';
            }
            else if (product.product_category === 'RAM') {
                specification = product.ram || product.model || product.product_name || '';
            }
            else if (product.product_category === 'LAN Card' ||
                product.product_category === 'Network Card' ||
                product.product_category === 'Ethernet Card') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.speed || ''} ${product.interface_type || ''}`.trim();
            }
            else if (product.product_category === 'Wi-Fi Card' ||
                product.product_category === 'Wi-Fi Dongle') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.speed || ''} ${product.standard || ''}`.trim();
            }
            else {
                specification = product.model || product.product_name || '';
            }

            if (!specification) specification = product.product_name || '';

            // Process device_ids
            if (item.device_ids && item.device_ids.length > 0) {
                item.device_ids.forEach((deviceId, index) => {
                    // Check if this device is already in current configuration
                    const isAlreadyAdded = currentItems.some(
                        currentItem => currentItem.assetId === deviceId
                    );

                    if (!isAlreadyAdded) {
                        upgrades.push({
                            id: `${item.id}-${index}`,
                            type: type,
                            name: product.product_name || product.product_category,
                            specification: specification,
                            price: parseFloat(product.rent_price_per_month) || 0,
                            description: `${product.brand || ''} ${product.model || ''}`.trim(),
                            sizes: product.capacity || product.ram || product.storage || product.speed || product.wattage || '',
                            quantity: 1,
                            unit_price: parseFloat(item.unit_price) || 0,
                            total_price: parseFloat(item.total_price) || 0,
                            device_ids: [deviceId],
                            productDetails: product,
                            originalItemId: item.id,
                            category: product.product_category
                        });
                    }
                });
            } else {
                const quantity = item.available_quantity || item.quantity || 1;
                for (let i = 0; i < quantity; i++) {
                    upgrades.push({
                        id: `${item.id}-${i}`,
                        type: type,
                        name: product.product_name || product.product_category,
                        specification: specification,
                        price: parseFloat(product.rent_price_per_month) || 0,
                        description: `${product.brand || ''} ${product.model || ''}`.trim(),
                        sizes: product.capacity || product.ram || product.storage || product.speed || product.wattage || '',
                        quantity: 1,
                        unit_price: parseFloat(item.unit_price) || 0,
                        total_price: parseFloat(item.total_price) || 0,
                        device_ids: [],
                        productDetails: product,
                        originalItemId: item.id,
                        category: product.product_category
                    });
                }
            }
        });

        return upgrades;
    };

    const transformApiDataToUpgrades = (apiData, allowedCats) => {
        const upgrades = [];

        apiData.forEach(item => {
            const product = item.product;
            if (!product || !product.product_category) return;
            if (product.product_category === "Assembled PC") return;

            const isAllowed = allowedCats.includes(product.product_category);
            if (!isAllowed) return;

            let type = categoryMapping[product.product_category] || product.product_category.toLowerCase();
            if (!type) return;

            let specification = '';

            // Build specification based on category
            if (product.product_category === 'Processor' || product.product_category === 'CPU') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.speed || ''} ${product.cores || ''} cores`.trim();
            }
            else if (product.product_category === 'Motherboard') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.chipset || ''} ${product.socket_type || ''}`.trim();
            }
            else if (product.product_category === 'Graphics Card' || product.product_category === 'GPU') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.vram || ''} ${product.chipset || ''}`.trim();
            }
            else if (product.product_category === 'SMPS' || product.product_category === 'Power Supply') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.wattage || ''}W ${product.efficiency || ''}`.trim();
            }
            else if (product.product_category === 'SSD' || product.product_category === 'SSD Storage') {
                specification = `${product.brand || ''} ${product.capacity || product.storage || ''} ${product.model || ''}`.trim();
            }
            else if (product.product_category === 'HDD') {
                specification = product.capacity || product.storage || product.model || product.product_name || '';
            }
            else if (product.product_category === 'RAM') {
                specification = product.ram || product.model || product.product_name || '';
            }
            else if (product.product_category === 'LAN Card' ||
                product.product_category === 'Network Card' ||
                product.product_category === 'Ethernet Card') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.speed || ''} ${product.interface_type || ''}`.trim();
            }
            else if (product.product_category === 'Wi-Fi Card' ||
                product.product_category === 'Wi-Fi Dongle') {
                specification = `${product.brand || ''} ${product.model || ''} ${product.speed || ''} ${product.standard || ''}`.trim();
            }
            else {
                specification = product.model || product.product_name || '';
            }

            if (!specification) specification = product.product_name || '';

            // Check if item has available device_ids
            const hasAvailableDevices = item.device_ids && item.device_ids.length > 0;
            const availableQuantity = item.available_quantity || (hasAvailableDevices ? item.device_ids.length : (item.quantity || 1));

            if (hasAvailableDevices) {
                // Process each device_id individually
                item.device_ids.forEach((deviceId, index) => {
                    // Check if this device is already in current configuration
                    const isAlreadyAdded = currentItems.some(
                        currentItem => currentItem.assetId === deviceId
                    );

                    if (!isAlreadyAdded) {
                        upgrades.push({
                            id: `${item.id}-${index}`,
                            type: type,
                            name: product.product_name || product.product_category,
                            specification: specification,
                            price: parseFloat(product.rent_price_per_month) || 0,
                            description: `${product.brand || ''} ${product.model || ''}`.trim(),
                            sizes: product.capacity || product.ram || product.storage || product.speed || product.wattage || '',
                            quantity: 1,
                            unit_price: parseFloat(item.unit_price) || 0,
                            total_price: parseFloat(item.total_price) || 0,
                            device_ids: [deviceId],
                            productDetails: product,
                            originalItemId: item.id,
                            category: product.product_category,
                            available_quantity: 1
                        });
                    }
                });
            } else {
                // Add as generic upgrade without specific device_id
                const quantity = availableQuantity;
                for (let i = 0; i < quantity; i++) {
                    const isAlreadyAdded = upgrades.some(
                        u => u.productDetails?.id === product.id && u.device_ids?.length === 0
                    );

                    if (!isAlreadyAdded) {
                        upgrades.push({
                            id: `${item.id}-${i}`,
                            type: type,
                            name: product.product_name || product.product_category,
                            specification: specification,
                            price: parseFloat(product.rent_price_per_month) || 0,
                            description: `${product.brand || ''} ${product.model || ''}`.trim(),
                            sizes: product.capacity || product.ram || product.storage || product.speed || product.wattage || '',
                            quantity: 1,
                            unit_price: parseFloat(item.unit_price) || 0,
                            total_price: parseFloat(item.total_price) || 0,
                            device_ids: [],
                            productDetails: product,
                            originalItemId: item.id,
                            category: product.product_category,
                            available_quantity: quantity
                        });
                        break; // Add only one entry per product type
                    }
                }
            }
        });

        return upgrades;
    };

    const fetchProductData = async (productId, assetId) => {
        try {
            setLoading(true);
            console.log("Fetching product data for:", { productId, assetId });

            const response = await axios.get(
                `${API_URL}/product-templete/asset-transaction/${productId}?asset_id=${encodeURIComponent(assetId)}`,
                {
                    headers: { "Authorization": `Bearer ${userToken}` },
                }
            );

            const productDataResponse = response.data;
            console.log("Product Data Response:", productDataResponse);
            setProductData(productDataResponse);

            const assembled = productDataResponse.product_category === "Assembled PC";
            setIsAssembledPC(assembled);

            const currentConfig = [];

            const latestStatusMap = new Map();
            (productDataResponse.assetTransactions || []).forEach(tx => {
                const existing = latestStatusMap.get(tx.asset_id);
                if (!existing || new Date(tx.action_date) > new Date(existing.action_date)) {
                    latestStatusMap.set(tx.asset_id, tx);
                }
            });

            if (assembled) {
                // Add all original peripherals that are ACTIVE
                if (productDataResponse.peripherals_asset_ids && productDataResponse.peripherals_asset_ids.length > 0) {
                    setPeripheralsAssetData(productDataResponse.peripherals_asset_ids);

                    productDataResponse.peripherals_asset_ids.forEach((peripheral, index) => {
                        const componentType = peripheral.component_type?.toLowerCase();
                        const latestTx = latestStatusMap.get(peripheral.asset_id);
                        const isActive = !latestTx || latestTx.status === "Added";

                        if (isActive) {
                            currentConfig.push({
                                id: `peripheral-${peripheral.id || index}`,
                                type: peripheral.component_type || 'peripheral',
                                name: peripheral.component_type?.toUpperCase() || peripheral.type?.toUpperCase() || 'Component',
                                specification: `${peripheral.brand || ''} ${peripheral.model || ''}`.trim() || peripheral.type || 'N/A',
                                size: peripheral.size || peripheral.speed || peripheral.wattage || '',
                                assetId: peripheral.asset_id,
                                installedDate: peripheral.created_at || '2024-01-15',
                                isDefault: true,
                                isPeripheral: true,
                                isUpgrade: false,
                                price: 0,
                                peripheralData: peripheral,
                                isProtected: componentType === 'motherboard'
                            });
                        }
                    });
                }

                // Add all upgrades that are ACTIVE
                const allAssetTransactions = productDataResponse.assetTransactions || [];

                const activeUpgradeAssetIds = new Set();
                for (const [assetId, latestTx] of latestStatusMap.entries()) {
                    if (latestTx.status === "Added") {
                        activeUpgradeAssetIds.add(assetId);
                    }
                }

                allAssetTransactions.forEach((txn) => {
                    const itemType = txn.item_type?.toLowerCase();
                    if (txn.status === "Added" && activeUpgradeAssetIds.has(txn.asset_id)) {
                        const alreadyAdded = currentConfig.some(item => item.assetId === txn.asset_id);
                        if (!alreadyAdded) {
                            currentConfig.push({
                                id: `upgrade-${txn.id}`,
                                type: txn.item_type,
                                name: txn.item_name || txn.item_type?.toUpperCase(),
                                specification: txn.specification,
                                size: txn.size,
                                assetId: txn.asset_id,
                                installedDate: txn.action_date,
                                isDefault: false,
                                isUpgrade: true,
                                isPeripheral: false,
                                price: txn.price,
                                isProtected: itemType === 'motherboard',
                                transactionId: txn.id,
                                originalPeripheralProductId: txn.peripheral_asset_id_product_id
                            });
                        }
                    }
                });

            } else {
                setPeripheralsAssetData([]);

                const allAssetTransactions = productDataResponse.assetTransactions || [];

                const activeUpgradeAssetIds = new Set();
                for (const [assetId, latestTx] of latestStatusMap.entries()) {
                    if (latestTx.status === "Added") {
                        activeUpgradeAssetIds.add(assetId);
                    }
                }

                // Add active upgrades
                allAssetTransactions.forEach((txn) => {
                    const itemType = txn.item_type?.toLowerCase();
                    if (txn.status === "Added" && activeUpgradeAssetIds.has(txn.asset_id)) {
                        currentConfig.push({
                            id: txn.id,
                            type: txn.item_type,
                            name: txn.item_name || txn.item_type?.toUpperCase(),
                            specification: txn.specification,
                            size: txn.size,
                            assetId: txn.asset_id,
                            installedDate: txn.action_date,
                            isDefault: txn.is_default === "Default",
                            isUpgrade: txn.is_default === "Upgraded",
                            price: txn.price,
                            isProtected: itemType === 'motherboard'
                        });
                    }
                });

                const latestStatusValues = Array.from(latestStatusMap.values());

                // Check RAM
                if (productDataResponse.ram && !productDataResponse.itemsInfo?.ram) {
                    const ramTransaction = latestStatusValues.find(t => t.item_type === "ram");
                    if (!ramTransaction || ramTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 1,
                            type: 'ram',
                            name: 'RAM',
                            specification: productDataResponse.ram,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.ram,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check SSD
                if (productDataResponse.ssd && !productDataResponse.itemsInfo?.ssd) {
                    const ssdTransaction = latestStatusValues.find(t => t.item_type === "ssd");
                    if (!ssdTransaction || ssdTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 2,
                            type: 'ssd',
                            name: 'SSD',
                            specification: productDataResponse.ssd,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.ssd,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check HDD
                if (productDataResponse.hdd && !productDataResponse.itemsInfo?.hdd) {
                    const hddTransaction = latestStatusValues.find(t => t.item_type === "hdd");
                    if (!hddTransaction || hddTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 3,
                            type: 'hdd',
                            name: 'HDD',
                            specification: productDataResponse.hdd,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.hdd,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check Processor
                if (productDataResponse.processor && !productDataResponse.itemsInfo?.processor) {
                    const processorTransaction = latestStatusValues.find(t => t.item_type === "processor");
                    if (!processorTransaction || processorTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 4,
                            type: 'processor',
                            name: 'Processor',
                            specification: productDataResponse.processor,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.processor,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check Motherboard
                if (productDataResponse.motherboard && !productDataResponse.itemsInfo?.motherboard) {
                    const motherboardTransaction = latestStatusValues.find(t => t.item_type === "motherboard");
                    if (!motherboardTransaction || motherboardTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 5,
                            type: 'motherboard',
                            name: 'Motherboard',
                            specification: productDataResponse.motherboard,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.motherboard,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: true
                        });
                    }
                }

                // Check Graphic Card
                if (productDataResponse.graphic_card && !productDataResponse.itemsInfo?.graphic_card) {
                    const gpuTransaction = latestStatusValues.find(t => t.item_type === "graphic_card");
                    if (!gpuTransaction || gpuTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 6,
                            type: 'graphic_card',
                            name: 'Graphics Card',
                            specification: productDataResponse.graphic_card,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.graphic_card,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check SMPS
                if (productDataResponse.smps && !productDataResponse.itemsInfo?.smps) {
                    const smpsTransaction = latestStatusValues.find(t => t.item_type === "smps");
                    if (!smpsTransaction || smpsTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 7,
                            type: 'smps',
                            name: 'Power Supply',
                            specification: productDataResponse.smps,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.smps,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check LAN Card
                if (productDataResponse.lan_card && !productDataResponse.itemsInfo?.lan_card) {
                    const lanTransaction = latestStatusValues.find(t => t.item_type === "lan_card");
                    if (!lanTransaction || lanTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 8,
                            type: 'lan_card',
                            name: 'LAN Card',
                            specification: productDataResponse.lan_card,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.lan_card,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }

                // Check Wi-Fi Card
                if (productDataResponse.wifi_card && !productDataResponse.itemsInfo?.wifi_card) {
                    const wifiTransaction = latestStatusValues.find(t => t.item_type === "wifi_card");
                    if (!wifiTransaction || wifiTransaction.status !== "Removed") {
                        currentConfig.push({
                            id: 9,
                            type: 'wifi_card',
                            name: 'Wi-Fi Card',
                            specification: productDataResponse.wifi_card,
                            isDefault: true,
                            price: 0,
                            size: productDataResponse.wifi_card,
                            installedDate: '2024-01-15',
                            assetId: null,
                            isProtected: false
                        });
                    }
                }
            }

            console.log("Final Current Configuration:", currentConfig);
            setCurrentItems(currentConfig);

            setOrder({
                customer_id: formData.customerId,
                parentAssetId: assetId,
                product_id: productId
            });

        } catch (error) {
            console.error("Error fetching product data:", error);
            showSnackbar("Error loading product configuration: " + (error.response?.data?.message || error.message), "error");
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleRemoveFormChange = (field, value) => {
        setRemoveForm(prev => ({ ...prev, [field]: value }));
    };

    const handleAddFormChange = (field, value) => {
        setAddForm(prev => ({ ...prev, [field]: value }));
    };

    const openRemoveDialog = (item) => {
        // if (!canRemoveItem(item)) {
        //     showSnackbar("Motherboard cannot be removed as it's a protected component", "warning");
        //     return;
        // }

        setRemoveForm({
            parentAssetId: parentAssetId,
            itemsAssetId: item.assetId || '',
            size: item.size || '',
            removingDate: new Date().toISOString().split('T')[0],
            price: item.price || 0,
        });
        setRemoveDialog({ open: true, item });
    };

    const closeRemoveDialog = () => {
        setRemoveDialog({ open: false, item: null });
        setRemoveForm({
            parentAssetId: parentAssetId,
            itemsAssetId: "",
            size: "",
            removingDate: new Date().toISOString().split('T')[0],
            price: 0
        });
    };

    const openAddDialog = (upgrade) => {
        const assetId = upgrade.device_ids && upgrade.device_ids.length > 0
            ? upgrade.device_ids[0]
            : `${upgrade.type.toUpperCase()}-${parentAssetId}-${Date.now()}`;

        setAddForm({
            parentAssetId: parentAssetId,
            addItemsAssetId: assetId,
            size: upgrade.sizes,
            addingDate: new Date().toISOString().split('T')[0],
            price: upgrade.price,
            specification: upgrade.specification
        });
        setAddDialog({ open: true, upgrade });
    };

    const closeAddDialog = () => {
        setAddDialog({ open: false, upgrade: null });
        setAddForm({
            parentAssetId: parentAssetId,
            addItemsAssetId: "",
            size: "",
            addingDate: new Date().toISOString().split('T')[0],
            price: 0,
            specification: ""
        });
    };

    const createAssetTransaction = async (transactionData) => {
        try {
            const response = await axios.post(
                `${API_URL}/asset-transactions/create`,
                transactionData,
                {
                    headers: {
                        "Authorization": `Bearer ${userToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating asset transaction:', error);
            throw error;
        }
    };

    const confirmRemoveItem = async () => {
        const { item } = removeDialog;
        if (!item) {
            showSnackbar("Error: No item selected for removal", "error");
            return;
        }

        const newErrors = {};
        if (!removeForm.itemsAssetId) newErrors.itemsAssetId = "Items Asset ID is required";
        if (!removeForm.removingDate) newErrors.removingDate = "Removing Date is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const removalPayload = {
            customer_id: order?.customer_id,
            product_id: order?.product_id,
            peripheral_asset_id_product_id: item.originalPeripheralProductId || null,
            parent_asset_id: removeForm.parentAssetId,
            asset_id: removeForm.itemsAssetId,
            size: removeForm.size,
            action_date: removeForm.removingDate,
            price: parseFloat(removeForm.price) || 0,
            status: "Removed",
            itemDetails: {
                name: item.name,
                specification: item.specification,
                type: item.type,
                isDefault: item.isDefault ? "Default" : "Upgraded"
            }
        };

        try {
            await createAssetTransaction(removalPayload);
            setCurrentItems(prevItems => prevItems.filter(currentItem => currentItem.id !== item.id));
            showSnackbar(`Removed: ${item.name} ${item.specification}`);
            await refreshDataAfterChange();
        } catch (error) {
            showSnackbar("Error removing item. Please try again.", "error");
        } finally {
            closeRemoveDialog();
        }
    };

    const confirmAddUpgrade = async () => {
        const { upgrade } = addDialog;
        if (!upgrade) {
            showSnackbar("Error: No upgrade selected", "error");
            return;
        }

        const newErrors = {};
        if (!addForm.addItemsAssetId) newErrors.addItemsAssetId = "Asset ID is required";
        if (!addForm.addingDate) newErrors.addingDate = "Adding Date is required";
        setAddErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const addPayload = {
            customer_id: order?.customer_id,
            product_id: order?.product_id,
            peripheral_asset_id_product_id: upgrade.productDetails.id,
            parent_asset_id: addForm.parentAssetId,
            asset_id: addForm.addItemsAssetId,
            size: addForm.size,
            action_date: addForm.addingDate,
            price: parseFloat(addForm.price) || 0,
            status: "Added",
            itemDetails: {
                name: upgrade.name,
                specification: upgrade.specification,
                type: upgrade.type,
                isDefault: "Upgraded",
            }
        };

        try {
            const result = await createAssetTransaction(addPayload);
            const newItem = {
                id: `upgrade-${result.id || Date.now()}`,
                type: upgrade.type,
                name: upgrade.name,
                specification: upgrade.specification,
                price: addForm.price,
                isUpgrade: true,
                isDefault: false,
                description: upgrade.description,
                assetId: addForm.addItemsAssetId,
                parentAssetId: addForm.parentAssetId,
                size: addForm.size,
                installedDate: addForm.addingDate,
                originalUpgradeId: upgrade.id,
                originalPeripheralProductId: upgrade.productDetails.id,
                isProtected: upgrade.type === 'motherboard',
                transactionId: result?.id
            };
            setCurrentItems(prevItems => [...prevItems, newItem]);
            showSnackbar(`Added: ${upgrade.name} - ${upgrade.specification}`);
            await refreshDataAfterChange();
        } catch (error) {
            showSnackbar("Error adding upgrade. Please try again.", "error");
        } finally {
            closeAddDialog();
        }
    };

    const refreshDataAfterChange = async () => {
        if (formData.selectedProductId && parentAssetId) {
            setRefreshingData(true);
            try {
                await fetchProductData(formData.selectedProductId, parentAssetId);
                await fetchPeripheralAssets();
            } catch (error) {
                console.error("Error refreshing data:", error);
            } finally {
                setRefreshingData(false);
            }
        }
    };

    const isUpgradeAdded = (upgrade) => {
        // Check by device_id if available
        if (upgrade.device_ids && upgrade.device_ids.length > 0) {
            return currentItems.some(item =>
                item.assetId === upgrade.device_ids[0]
            );
        }
        // Check by product_id
        return currentItems.some(item =>
            item.originalPeripheralProductId === upgrade.productDetails?.id ||
            (item.name === upgrade.name && item.type === upgrade.type)
        );
    };

    const getAvailableUpgradesByType = (type) => {
        return availableUpgrades.filter(upgrade => upgrade.type === type && !isUpgradeAdded(upgrade));
    };

    const getAvailableTypes = () => {
        const types = [...new Set(availableUpgrades.map(upgrade => upgrade.type))];
        // Order the types as per requirement
        const orderedTypes = ['ram', 'ssd', 'hdd', 'lan_card', 'wifi_card', 'smps', 'graphic_card', 'motherboard', 'processor'];
        return orderedTypes.filter(type => types.includes(type));
    };

    const getTotalAvailableUpgradesCount = () => {
        return availableUpgrades.filter(upgrade => !isUpgradeAdded(upgrade)).length;
    };

    const getAllAssetIds = () => {
        const allAssets = [];
        Object.keys(availableAssetIds).forEach(productId => {
            availableAssetIds[productId].forEach(assetId => {
                allAssets.push({ assetId, productId });
            });
        });
        return allAssets;
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getCategoryIcon = (type) => {
        const icons = {
            ram: "💾",
            ssd: "⚡",
            hdd: "💿",
            lan_card: "🌐",
            wifi_card: "📡",
            smps: "🔌",
            graphic_card: "🎮",
            motherboard: "🔧",
            processor: "⚙️"
        };
        return icons[type] || "🔧";
    };

    const getCategoryTitle = (type) => {
        const titles = {
            ram: "RAM Modules",
            ssd: "SSD Drives",
            hdd: "HDD Drives",
            lan_card: "LAN Cards",
            wifi_card: "Wi-Fi Cards",
            smps: "Power Supplies (SMPS)",
            graphic_card: "Graphics Cards",
            motherboard: "Motherboards",
            processor: "Processors"
        };
        return titles[type] || type.toUpperCase();
    };

    const containerStyle = {
        padding: "2rem",
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        minHeight: "100vh",
        backgroundColor: "#f9fafb"
    };

    const labelStyle = {
        fontWeight: 500,
        fontSize: "0.875rem",
        color: "#374151",
        marginBottom: "6px",
    };

    return (
        <Box sx={containerStyle}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}>
                🚀 Hardware Components Updation & Deletion
            </Typography>
            {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage: RAM | SSD | HDD | LAN Card | Wi-Fi Card | SMPS | Graphics Card | Motherboard | Processor
            </Typography> */}


            {/* Customer and Delivery Challan Selection */}
            <Card sx={{ mb: 2, backgroundColor: '#f0f9ff' }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <label style={labelStyle}>Select Customer *</label>
                                <Select
                                    name="selectedCustomer"
                                    value={formData.customerId || ""}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Customer</MenuItem>
                                    {orders.map((order) => (
                                        <MenuItem key={order.id} value={order.id}>
                                            {`${order.first_name} ${order.last_name} (${order.company_name})`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <label style={labelStyle}>Select Order *</label>
                                <Select
                                    value={formData.dcId || ""}
                                    onChange={(e) => handleDeliveryChallanSelect(e.target.value)}
                                    displayEmpty
                                    disabled={!formData.customerId}
                                    renderValue={(selected) => {
                                        if (!selected) return <em>Select Order</em>;
                                        const selectedDC = deliveryChallans.find(dc => dc.id === selected);
                                        return selectedDC ? `${selectedDC.dc_id} (${selectedDC.dc_date})` : "Select Delivery Challan";
                                    }}
                                >
                                    <div style={{ padding: "8px", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
                                        <TextField
                                            size="small"
                                            placeholder="Search DC..."
                                            fullWidth
                                            value={dcSearchTerm}
                                            onChange={(e) => setDcSearchTerm(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    {deliveryChallans
                                        .filter((dc) => dc.dc_id.toLowerCase().includes(dcSearchTerm.toLowerCase()) || dc.dc_date.includes(dcSearchTerm))
                                        .map((dc) => (
                                            <MenuItem key={dc.id} value={dc.id}>
                                                {dc.dc_id} ({dc.dc_date})
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <label style={labelStyle}>Select Asset ID *</label>
                                <Select
                                    value={formData.selectedAssetId || ""}
                                    onChange={handleAssetSelect}
                                    displayEmpty
                                    disabled={!formData.dcId}
                                >
                                    <MenuItem value="" disabled>Select Asset ID</MenuItem>
                                    {getAllAssetIds().map((asset, index) => (
                                        <MenuItem key={index} value={asset.assetId}>
                                            {asset.assetId}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Main Content */}
            {formData.selectedAssetId && (
                <>
                    {/* Parent Asset ID Display */}
                    <Card sx={{ mb: 3, backgroundColor: '#e0f2fe' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <QrCode /> Parent Asset ID
                            </Typography>
                            <Typography variant="h5" sx={{ color: "#2563eb", fontWeight: 700, fontFamily: 'monospace' }}>
                                {formData.selectedAssetId}
                            </Typography>
                            {isAssembledPC && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    🔧 Assembled PC - Complete Hardware Management
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Loading State */}
                    {(loading || refreshingData) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Loading data...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {/* Current Configuration */}
                            <Grid item xs={12} md={6}>
                                <Card elevation={3} sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
                                            💻 Current Configuration ({currentItems.length} components)
                                        </Typography>
                                        {currentItems.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                                No hardware configuration available.
                                            </Typography>
                                        ) : (
                                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500, overflow: 'auto' }}>
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell><strong>S.No</strong></TableCell>
                                                            <TableCell><strong>Component</strong></TableCell>
                                                            <TableCell><strong>Specification</strong></TableCell>
                                                            <TableCell><strong>Asset ID</strong></TableCell>
                                                            <TableCell><strong>Action</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {currentItems.map((item, index) => {
                                                            // const isProtected = item.isProtected || !canRemoveItem(item);
                                                            return (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="body2" fontWeight="medium">
                                                                            {getCategoryIcon(item.type)} {item.name}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={item.isDefault ? "Default" : "Upgraded"}
                                                                            color={item.isDefault ? "default" : "success"}
                                                                            size="small"
                                                                            sx={{ mt: 0.5 }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="caption" display="block">
                                                                            {item.specification || item.size || 'N/A'}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.assetId ? (
                                                                            <Chip
                                                                                label={item.assetId}
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                sx={{ fontFamily: 'monospace' }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                Not assigned
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Tooltip>
                                                                            <span>
                                                                                <IconButton
                                                                                    color="error"
                                                                                    size="small"
                                                                                    onClick={() => openRemoveDialog(item)}
                                                                                // disabled={isProtected}
                                                                                >
                                                                                    <Delete />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Available Upgrades */}
                            <Grid item xs={12} md={6}>
                                <Card elevation={3} sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
                                            ⚡ Available Upgrades ({getTotalAvailableUpgradesCount()})
                                        </Typography>
                                        {availableUpgrades.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                                No available upgrades found.
                                            </Typography>
                                        ) : (
                                            <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                                                {getAvailableTypes().map((type) => {
                                                    const typeUpgrades = getAvailableUpgradesByType(type);
                                                    if (typeUpgrades.length === 0) return null;
                                                    return (
                                                        <Accordion
                                                            key={type}
                                                            expanded={expandedSections[type]}
                                                            onChange={() => toggleSection(type)}
                                                            sx={{ mb: 1 }}
                                                        >
                                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {getCategoryIcon(type)} {getCategoryTitle(type)} ({typeUpgrades.length})
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <List dense>
                                                                    {typeUpgrades.map((upgrade) => (
                                                                        <ListItem key={upgrade.id} divider>
                                                                            <ListItemText
                                                                                primary={upgrade.name}
                                                                                secondary={
                                                                                    <Box>
                                                                                        <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
                                                                                            {upgrade.specification || 'No specification'}
                                                                                        </Typography>
                                                                                        {upgrade.device_ids && upgrade.device_ids.length > 0 && (
                                                                                            <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
                                                                                                Asset ID: {upgrade.device_ids[0]}
                                                                                            </Typography>
                                                                                        )}
                                                                                        {/* <Typography variant="caption" display="block" color="text.secondary">
                                                                                            Price: ₹{upgrade.price}/month
                                                                                        </Typography> */}
                                                                                    </Box>
                                                                                }
                                                                            />
                                                                            <Button
                                                                                variant="contained"
                                                                                size="small"
                                                                                startIcon={<Add />}
                                                                                onClick={() => openAddDialog(upgrade)}
                                                                                disabled={isUpgradeAdded(upgrade)}
                                                                                sx={{ minWidth: 80 }}
                                                                            >
                                                                                {isUpgradeAdded(upgrade) ? "Added" : "Add"}
                                                                            </Button>
                                                                        </ListItem>
                                                                    ))}
                                                                </List>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    );
                                                })}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Removed Items */}
                            <Grid item xs={12}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
                                            🗑️ Removed Items History
                                        </Typography>
                                        {!productData?.assetTransactions || getFinalRemovedItems(productData?.assetTransactions).length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                                No items have been removed yet.
                                            </Typography>
                                        ) : (
                                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell><strong>S.No</strong></TableCell>
                                                            <TableCell><strong>Component</strong></TableCell>
                                                            <TableCell><strong>Specification</strong></TableCell>
                                                            <TableCell><strong>Asset ID</strong></TableCell>
                                                            <TableCell><strong>Type</strong></TableCell>
                                                            <TableCell><strong>Removed Date</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {getFinalRemovedItems(productData?.assetTransactions).map((item, index) => {
                                                            return (
                                                                <TableRow key={item.id} sx={{ backgroundColor: item.is_default === "Upgraded" ? '#fff3e0' : '#fafafa' }}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="body2" fontWeight="medium">
                                                                            {getCategoryIcon(item.item_type)} {item.item_name || item.item_type?.toUpperCase()}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={item.is_default === "Upgraded" ? "Upgrade" : "Default"}
                                                                            color={item.is_default === "Upgraded" ? "warning" : "default"}
                                                                            size="small"
                                                                            sx={{ mt: 0.5 }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{item.specification || item.size || 'N/A'}</TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={item.asset_id}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ fontFamily: 'monospace' }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={item.item_type?.toUpperCase() || "N/A"}
                                                                            size="small"
                                                                            color="info"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {new Date(item.removed_date || item.action_date).toLocaleDateString()}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Remove Dialog */}
                    <Dialog open={removeDialog.open} onClose={closeRemoveDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Remove color="error" /> Remove Component
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
                                Removing: {removeDialog.item?.name} - {removeDialog.item?.specification}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <TextField label="Parent Asset ID" value={removeForm.parentAssetId} fullWidth margin="dense" disabled />
                                <TextField
                                    label="Items Asset ID"
                                    value={removeForm.itemsAssetId}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleRemoveFormChange("itemsAssetId", e.target.value)}
                                    error={!!errors.itemsAssetId}
                                    helperText={errors.itemsAssetId}
                                    required
                                />
                                <TextField
                                    label="Size/Specification"
                                    value={removeForm.size || removeDialog.item?.specification}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleRemoveFormChange("size", e.target.value)}
                                />
                                <TextField
                                    label="Removing Date"
                                    type="date"
                                    value={removeForm.removingDate}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleRemoveFormChange("removingDate", e.target.value)}
                                    error={!!errors.removingDate}
                                    helperText={errors.removingDate}
                                    required
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={removeForm.price}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleRemoveFormChange("price", e.target.value)}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeRemoveDialog}>Cancel</Button>
                            <Button onClick={confirmRemoveItem} variant="contained" color="error">
                                Confirm Removal
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Add Dialog */}
                    <Dialog open={addDialog.open} onClose={closeAddDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Add color="success" /> Add Upgrade Component
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
                                Adding: {addDialog.upgrade?.name} - {addDialog.upgrade?.specification}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <TextField label="Parent Asset ID" value={addForm.parentAssetId} fullWidth margin="dense" disabled />
                                <TextField
                                    label="Add Items Asset ID"
                                    value={addForm.addItemsAssetId}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleAddFormChange("addItemsAssetId", e.target.value)}
                                    error={!!addErrors.addItemsAssetId}
                                    helperText={addErrors.addItemsAssetId}
                                    required
                                />
                                <TextField
                                    label="Size/Specification"
                                    value={addForm.size || addDialog.upgrade?.specification || ""}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleAddFormChange("size", e.target.value)}
                                />
                                <TextField
                                    label="Adding Date"
                                    type="date"
                                    value={addForm.addingDate}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleAddFormChange("addingDate", e.target.value)}
                                    error={!!addErrors.addingDate}
                                    helperText={addErrors.addingDate}
                                    required
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={addForm.price}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleAddFormChange("price", e.target.value)}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeAddDialog}>Cancel</Button>
                            <Button onClick={confirmAddUpgrade} variant="contained" color="success">
                                Confirm Addition
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            {/* Snackbar */}
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RemoveItemsLayout;