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
    CircularProgress
} from "@mui/material";
import { Delete, Add, QrCode, Remove, Refresh } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RemoveItemsLayout = () => {
    const [orders, setOrders] = useState([]);
    const [deliveryChallans, setDeliveryChallans] = useState([]);
    const [filteredDeliveryChallans, setFilteredDeliveryChallans] = useState([]);
    const [searchMode, setSearchMode] = useState(false);
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
    const [initialItems, setInitialItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState(null);
    const [allowedCategories, setAllowedCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [refreshingData, setRefreshingData] = useState(false);

    // Add this function to filter removed items properly
    const getFinalRemovedItems = (assetTransactions) => {
        if (!assetTransactions?.length) return [];

        // Group by asset_id and get the latest status for each
        const latestStatus = {};

        assetTransactions
            .sort((a, b) => new Date(b.action_date) - new Date(a.action_date))
            .forEach(tx => {
                if (!latestStatus[tx.asset_id]) {
                    latestStatus[tx.asset_id] = {
                        status: tx.status,
                        transaction: tx
                    };
                }
            });

        // Only return items that are finally removed (not re-added later)
        const finalRemoved = Object.values(latestStatus)
            .filter(item => item.status === "Removed")
            .map(item => item.transaction);

        return finalRemoved;
    };

    // Form states for main form and dialogs
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

    // Define allowed categories mapping
    const categoryMapping = {
        'RAM': 'ram',
        'Processor': 'processor',
        'Storage': 'storage',
        'SSD': 'storage',
        'HDD': 'storage',
        'Monitors': 'monitor'
    };

    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);

    const userToken = token;

    // Fetch contacts on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch contacts
                const contactResponse = await axios.get(
                    `${API_URL}/contacts/delivered-contacts/list`,
                    {
                        headers: {
                            "Authorization": `Bearer ${userToken}`,
                        },
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
                    showSnackbar("Error fetching delivery challans: " + error.message, "error");
                }
            };
            fetchDeliveryChallans();
        }
    }, [formData.customerId]);

    // Fetch peripheral assets when delivery challan is selected
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
                setFormData((prev) => ({
                    ...prev,
                    customerId: selectedCustomer.id,
                    customerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
                    email: selectedCustomer.email,
                    pan: selectedCustomer.pan_no,
                    industry: selectedCustomer.industry,
                    dcId: "", // Reset DC when customer changes
                    dcNumber: "",
                    selectedAssetId: "",
                    selectedProductId: ""
                }));
                setSelectedOrder(null);
                setAvailableAssetIds({});
                setAvailableUpgrades([]);
                setCurrentItems([]);
                setProductData(null);
                setParentAssetId("");
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeliveryChallanSelect = (dcId) => {
        const selectedDC = deliveryChallans.find((dc) => dc.id === parseInt(dcId));
        if (selectedDC) {
            setSelectedOrder(selectedDC);
            setFormData((prev) => ({
                ...prev,
                dcId: selectedDC.id,
                dcNumber: selectedDC.dispatch_order_number || selectedDC.dc_id,
                paymentType: selectedDC.payment_type,
                dcDate: selectedDC.dc_date,
                shippingName: selectedDC.shipping_name,
                pincode: selectedDC.pincode,
            }));

            setSearchMode(false);
            setFilteredDeliveryChallans([]);
            setDcSearchTerm("");

            // Prepare available asset IDs
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

        // Extract product ID from asset ID or find it from availableAssetIds
        const productId = Object.keys(availableAssetIds).find(pid =>
            availableAssetIds[pid].includes(assetId)
        );

        if (productId) {
            setFormData(prev => ({
                ...prev,
                selectedProductId: productId
            }));

            // Set parent asset ID and fetch product data
            setParentAssetId(assetId);
            fetchProductData(productId, assetId);
        }
    };

    const fetchPeripheralAssets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/delivery-challans/peripheral-assets/${formData.customerId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${userToken}`,
                    },
                }
            );

            const apiData = response.data;
            console.log("Peripheral Assets API Response:", apiData);

            // Transform categories
            const categoriesFromApi = [
                ...new Set(apiData.map(item => item.product?.product_category)),
            ].filter(Boolean);

            const filteredCategories = categoriesFromApi.filter(cat =>
                Object.keys(categoryMapping).includes(cat)
            );

            console.log("Filtered Categories:", filteredCategories);
            setAllowedCategories(filteredCategories);

            const transformedUpgrades = transformApiDataToUpgrades(
                apiData,
                filteredCategories
            );
            console.log("Transformed Upgrades:", transformedUpgrades);
            setAvailableUpgrades(transformedUpgrades);

        } catch (error) {
            console.error("Error fetching peripheral assets:", error);
            showSnackbar("Error loading available upgrades", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchProductData = async (productId, assetId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/product-templete/asset-transaction/${productId}?asset_id=${encodeURIComponent(assetId)}`,
                {
                    headers: {
                        "Authorization": `Bearer ${userToken}`,
                    },
                }
            );

            const productData = response.data;
            console.log("Product Data:", productData);
            setProductData(productData);

            // Filter assetTransactions to only include Added items
            const addedTransactions = productData.assetTransactions.filter(
                (txn) => txn.status === "Added"
            );
            console.log("Added Asset Transactions:", addedTransactions);

            // Set current configuration based on itemsInfo
            const currentConfig = [];

            if (productData.ram && !productData.itemsInfo?.ram) {
                currentConfig.push({
                    id: 1,
                    type: 'ram',
                    name: 'RAM',
                    specification: productData.ram,
                    isDefault: true,
                    price: 0,
                    size: productData.ram,
                    installedDate: '2024-01-15'
                });
            }

            if ((productData.processor_model || productData.processor) && (!productData.itemsInfo?.processor_model || !productData.itemsInfo?.processor)) {
                currentConfig.push({
                    id: 2,
                    type: 'processor',
                    name: 'Processor',
                    specification: productData.processor_model || productData.processor,
                    isDefault: true,
                    price: 0,
                    size: productData.processor_model || productData.processor,
                    installedDate: '2024-01-15'
                });
            }

            if (productData.storage && !productData.itemsInfo?.storage) {
                currentConfig.push({
                    id: 3,
                    type: 'storage',
                    name: 'Storage',
                    specification: productData.storage,
                    isDefault: true,
                    price: 0,
                    size: productData.storage,
                    installedDate: '2024-01-15'
                });
            }

            // Merge addedTransactions into currentConfig
            const transactionItems = addedTransactions.map((txn) => ({
                id: txn.id,
                type: txn.item_type,
                name: txn.item_name,
                specification: txn.specification,
                size: txn.size,
                assetId: txn.asset_id,
                installedDate: txn.action_date,
                isDefault: false,
            }));

            const mergedConfig = [...currentConfig, ...transactionItems];
            console.log("Merged Current Configuration:", mergedConfig);

            setCurrentItems(mergedConfig);
            setInitialItems(mergedConfig);

            // Mock order data
            const mockOrder = {
                customer_id: formData.customerId,
                parentAssetId: assetId,
                product_id: productId
            };
            setOrder(mockOrder);

        } catch (error) {
            console.error("Error fetching product data:", error);
            showSnackbar("Error loading product configuration", "error");
        } finally {
            setLoading(false);
        }
    };


    // Transform API data to available upgrades format
    const transformApiDataToUpgrades = (apiData, allowedCats) => {
        const upgrades = [];

        apiData.forEach(item => {
            const product = item.product;
            if (!product || !product.product_category) return;

            // Check if category is allowed
            if (!allowedCats.includes(product.product_category)) {
                return;
            }

            // Determine component type based on category mapping
            const type = categoryMapping[product.product_category] || '';
            if (!type) return;

            // Get specification based on product category
            let specification = '';

            if (product.product_category === 'HDD' || product.product_category === 'SSD') {
                specification = product.capacity || product.storage || product.model || product.product_name || '';
            } else if (product.product_category === 'RAM') {
                specification = product.ram || product.model || product.product_name || '';
            } else if (product.product_category === 'Processor') {
                specification = product.processor_model || product.model || product.product_name || '';
            } else {
                specification = product.model || product.product_name || '';
            }

            // Handle items with multiple device_ids - split them into individual items
            if (item.device_ids && item.device_ids.length > 0) {
                item.device_ids.forEach((deviceId, index) => {
                    const upgrade = {
                        id: `${item.id}-${index}`,
                        type: type,
                        name: product.product_name,
                        specification: specification,
                        price: parseFloat(product.rent_price_per_month) || 0,
                        description: `${product.brand} ${product.model}`,
                        assetPrefix: getAssetPrefix(type),
                        sizes: product.capacity || product.ram || product.storage || product.processor_model || '',
                        quantity: 1,
                        unit_price: parseFloat(item.unit_price) || 0,
                        total_price: parseFloat(item.total_price) || 0,
                        device_ids: [deviceId],
                        productDetails: product,
                        originalItemId: item.id,
                        category: product.product_category
                    };
                    upgrades.push(upgrade);
                });
            } else {
                // For items without device_ids, create one item per quantity
                const quantity = item.quantity || 1;
                for (let i = 0; i < quantity; i++) {
                    const upgrade = {
                        id: `${item.id}-${i}`,
                        type: type,
                        name: product.product_name,
                        specification: specification,
                        price: parseFloat(product.rent_price_per_month) || 0,
                        description: `${product.brand} ${product.model}`,
                        assetPrefix: getAssetPrefix(type),
                        sizes: product.capacity || product.ram || product.storage || product.processor_model || '',
                        quantity: 1,
                        unit_price: parseFloat(item.unit_price) || 0,
                        total_price: parseFloat(item.total_price) || 0,
                        device_ids: [],
                        productDetails: product,
                        originalItemId: item.id,
                        category: product.product_category
                    };
                    upgrades.push(upgrade);
                }
            }
        });

        return upgrades;
    };

    // Helper function to get asset prefix based on type
    const getAssetPrefix = (type) => {
        switch (type) {
            case 'ram': return 'RAM';
            case 'processor': return 'CPU';
            case 'monitor': return 'Monitors';
            case 'storage': return 'SSD';
            default: return 'COMP';
        }
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Handle Remove Form Changes
    const handleRemoveFormChange = (field, value) => {
        setRemoveForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle Add Form Changes
    const handleAddFormChange = (field, value) => {
        setAddForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Open Remove Dialog
    const openRemoveDialog = (item) => {
        setRemoveForm({
            parentAssetId: parentAssetId,
            itemsAssetId: item.assetId || '',
            size: item.size || '',
            removingDate: new Date().toISOString().split('T')[0],
            price: item.price || 0,
        });
        setRemoveDialog({ open: true, item });
    };

    // Close Remove Dialog
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

    // Open Add Dialog
    const openAddDialog = (upgrade) => {
        // Get the asset ID from the upgrade if available
        const assetId = upgrade.device_ids && upgrade.device_ids.length > 0
            ? upgrade.device_ids[0]
            : `${upgrade.assetPrefix}-${parentAssetId}-${upgrade.sizes}-${Date.now()}`;

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

    // Close Add Dialog
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

    // API call to create asset transaction
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

    // Confirm Remove Item
    const confirmRemoveItem = async () => {
        const { item } = removeDialog;

        if (!item) {
            showSnackbar("Error: No item selected for removal", "error");
            return;
        }

        // Collect errors
        const newErrors = {};
        if (!removeForm.itemsAssetId) newErrors.itemsAssetId = "Items Asset ID is required";
        if (!removeForm.removingDate) newErrors.removingDate = "Removing Date is required";

        setErrors(newErrors);

        // If any errors exist, stop submission
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

        console.log("Removal Payload:", removalPayload);

        try {
            await createAssetTransaction(removalPayload);
            
            // Update current items list
            setCurrentItems(prevItems => prevItems.filter(currentItem => currentItem.id !== item.id));
            
            showSnackbar(`Removed: ${item.name} ${item.specification}`);
            
            // Refresh data to reflect changes
            await refreshDataAfterChange();
        } catch (error) {
            showSnackbar("Error removing item. Please try again.", "error");
            console.error("Remove error:", error);
        } finally {
            closeRemoveDialog();
        }
    };

    // Confirm Add Upgrade
    const confirmAddUpgrade = async () => {
        const { upgrade } = addDialog;

        if (!upgrade) {
            showSnackbar("Error: No upgrade selected", "error");
            return;
        }

        // Validate required fields
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
                id: result.id || Date.now(),
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
                originalPeripheralProductId: upgrade.productDetails.id
            };

            setCurrentItems(prevItems => [...prevItems, newItem]);
            showSnackbar(`Added: ${upgrade.name} - ${upgrade.specification}`);
            
            // Refresh data to reflect changes
            await refreshDataAfterChange();
        } catch (error) {
            showSnackbar("Error adding upgrade. Please try again.", "error");
            console.error("Add error:", error);
        } finally {
            closeAddDialog();
        }
    };

    // Refresh data after adding or removing items
    const refreshDataAfterChange = async () => {
        if (formData.selectedProductId && parentAssetId) {
            setRefreshingData(true);
            try {
                // Refresh product data
                await fetchProductData(formData.selectedProductId, parentAssetId);
                // Refresh peripheral assets
                await fetchPeripheralAssets();
                console.log("Data refreshed successfully");
            } catch (error) {
                console.error("Error refreshing data:", error);
            } finally {
                setRefreshingData(false);
            }
        }
    };

    // Check if a specific upgrade is already added
    const isUpgradeAdded = (upgrade) => {
        return currentItems.some(item =>
            item.originalUpgradeId === upgrade.id && !item.isDefault
        );
    };

    // Get available upgrades that are NOT currently added
    const getAvailableUpgradesByType = (type) => {
        return availableUpgrades.filter(upgrade =>
            upgrade.type === type && !isUpgradeAdded(upgrade)
        );
    };

    // Get unique types from available upgrades (dynamic)
    const getAvailableTypes = () => {
        const types = [...new Set(availableUpgrades.map(upgrade => upgrade.type))];
        return types.filter(type => type);
    };

    // Get TOTAL available upgrades count (not added ones)
    const getTotalAvailableUpgradesCount = () => {
        return availableUpgrades.filter(upgrade => !isUpgradeAdded(upgrade)).length;
    };

    // Get all available asset IDs for dropdown
    const getAllAssetIds = () => {
        const allAssets = [];
        Object.keys(availableAssetIds).forEach(productId => {
            availableAssetIds[productId].forEach(assetId => {
                allAssets.push({
                    assetId,
                    productId
                });
            });
        });
        return allAssets;
    };

    const cardStyle = {
        marginBottom: "1rem",
        backgroundColor: '#f0f9ff'
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

    const inputStyle = {
        backgroundColor: "white"
    };

    return (
        <Box sx={containerStyle}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: "#1f2937" }}>
                🚀 Peripherals Updation/Deletion
            </Typography>

            {/* Customer and Delivery Challan Selection */}
            <Card sx={cardStyle}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <label style={labelStyle}>
                                    Select Customer
                                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                                </label>
                                <Select
                                    name="selectedCustomer"
                                    value={formData.customerId || ""}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    style={inputStyle}
                                >
                                    <MenuItem value="" disabled>
                                        Select Customer
                                    </MenuItem>
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
                                <label style={labelStyle}>
                                    Select Order
                                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                                </label>
                                <Select
                                    value={formData.dcId || ""}
                                    onChange={(e) => handleDeliveryChallanSelect(e.target.value)}
                                    displayEmpty
                                    style={inputStyle}
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
                                            return <em>Select Order</em>;
                                        }
                                        const selectedDC = deliveryChallans.find(
                                            (dc) => dc.id === selected
                                        );
                                        return selectedDC
                                            ? `${selectedDC.dc_id} (${selectedDC.dc_date})`
                                            : "Select Delivery Challan";
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
                                        .filter((dc) =>
                                            dc.dc_id.toLowerCase().includes(dcSearchTerm.toLowerCase()) ||
                                            dc.dc_date.includes(dcSearchTerm)
                                        )
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
                                <label style={labelStyle}>
                                    Select Asset ID
                                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                                </label>
                                <Select
                                    value={formData.selectedAssetId || ""}
                                    onChange={handleAssetSelect}
                                    displayEmpty
                                    style={inputStyle}
                                    disabled={!formData.dcId}
                                >
                                    <MenuItem value="" disabled>
                                        Select Asset ID
                                    </MenuItem>
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

            {/* Only show the rest if asset is selected */}
            {formData.selectedAssetId && (
                <>
                    {/* Parent Asset ID Display */}
                    <Card sx={{ mb: 3, backgroundColor: '#f0f9ff' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <QrCode /> Parent Asset ID
                            </Typography>
                            <Typography variant="h5" sx={{ color: "#2563eb", fontWeight: 700, fontFamily: 'monospace' }}>
                                {formData.selectedAssetId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                All component asset IDs will be linked to this parent asset
                            </Typography>
                        </CardContent>
                    </Card>

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
                                            💻 Current Configuration ({currentItems.length})
                                        </Typography>

                                        {currentItems.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                                No configuration data available for this product.
                                            </Typography>
                                        ) : (
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Component</TableCell>
                                                            <TableCell>Specification</TableCell>
                                                            <TableCell>Asset ID</TableCell>
                                                            <TableCell>Size</TableCell>
                                                            <TableCell>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {currentItems.map((item, index) => (
                                                            <TableRow key={item.id} sx={{
                                                                backgroundColor: item.isUpgrade ? '#f0f9ff' : 'inherit'
                                                            }}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2" fontWeight="medium">
                                                                        {item.name}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={item.isDefault ? "Default" : "Upgrade"}
                                                                        color={item.isDefault ? "default" : "success"}
                                                                        size="small"
                                                                        sx={{ mt: 0.5 }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>{item.specification}</TableCell>
                                                                <TableCell>
                                                                    {item.assetId ? (
                                                                        <Chip
                                                                            label={item.assetId}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="primary"
                                                                        />
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Not assigned
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={item.size || item.specification}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color="secondary"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IconButton
                                                                        color="error"
                                                                        size="small"
                                                                        onClick={() => openRemoveDialog(item)}
                                                                        title="Remove item"
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
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
                                                No available upgrades found for this customer.
                                            </Typography>
                                        ) : (
                                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                {getAvailableTypes().map((type) => {
                                                    const typeUpgrades = getAvailableUpgradesByType(type);
                                                    if (typeUpgrades.length === 0) return null;

                                                    return (
                                                        <Box key={type} sx={{ mb: 3 }}>
                                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                                                {type.toUpperCase()} Upgrades ({typeUpgrades.length})
                                                            </Typography>
                                                            <List dense>
                                                                {typeUpgrades.map((upgrade) => (
                                                                    <ListItem
                                                                        key={upgrade.id}
                                                                        secondaryAction={
                                                                            <Button
                                                                                variant="contained"
                                                                                size="small"
                                                                                startIcon={<Add />}
                                                                                onClick={() => openAddDialog(upgrade)}
                                                                                disabled={isUpgradeAdded(upgrade)}
                                                                            >
                                                                                {isUpgradeAdded(upgrade) ? "Added" : "Add"}
                                                                            </Button>
                                                                        }
                                                                        divider
                                                                    >
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
                                                                                </Box>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Removed Items */}
                            <Grid item xs={12}>
                                <Card elevation={3} sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ color: "#374151" }}>
                                            🗑️ Removed Items
                                        </Typography>

                                        {productData?.assetTransactions?.filter(item => item.status === 'Removed').length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                                No items have been removed yet.
                                            </Typography>
                                        ) : (
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Component</TableCell>
                                                            <TableCell>Specification</TableCell>
                                                            <TableCell>Asset ID</TableCell>
                                                            <TableCell>Size</TableCell>
                                                            <TableCell>Removed Date</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {getFinalRemovedItems(productData?.assetTransactions)
                                                            .map((item, index) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>
                                                                        {item.item_name}
                                                                        <Chip
                                                                            label={item.is_default === "Default" ? "Default" : "Upgrade"}
                                                                            color={item.is_default === "Default" ? "default" : "success"}
                                                                            size="small"
                                                                            sx={{ mt: 0.5, ml: 1 }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{item.specification}</TableCell>
                                                                    <TableCell>{item.asset_id}</TableCell>
                                                                    <TableCell>{item.size}</TableCell>
                                                                    <TableCell>{new Date(item.action_date).toLocaleDateString()}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Remove Item Dialog */}
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
                                <TextField 
                                    label="Parent Asset ID" 
                                    value={removeForm.parentAssetId} 
                                    fullWidth 
                                    margin="dense" 
                                    disabled 
                                />
                                <TextField
                                    label="Items Asset ID"
                                    value={removeForm.itemsAssetId}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleRemoveFormChange("itemsAssetId", e.target.value)}
                                    error={!!errors.itemsAssetId}
                                    helperText={errors.itemsAssetId}
                                />
                                <TextField
                                    label="Size"
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
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={removeForm.price}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleRemoveFormChange("price", e.target.value)}
                                    error={!!errors.price}
                                    helperText={errors.price}
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

                    {/* Add Upgrade Dialog */}
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
                                <TextField 
                                    label="Parent Asset ID" 
                                    value={addForm.parentAssetId} 
                                    fullWidth 
                                    margin="dense" 
                                    disabled 
                                />
                                <TextField
                                    label="Add Items Asset ID"
                                    value={addForm.addItemsAssetId}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleAddFormChange("addItemsAssetId", e.target.value)}
                                    error={!!addErrors.addItemsAssetId}
                                    helperText={addErrors.addItemsAssetId}
                                />
                                <TextField
                                    label="Size"
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
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={addForm.price}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => handleAddFormChange("price", e.target.value)}
                                    error={!!addErrors.price}
                                    helperText={addErrors.price}
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
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: "100%", whiteSpace: "pre-line" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RemoveItemsLayout;