import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreaditNotesEditFormLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const userToken = token;

  const [formData, setFormData] = useState({
    creditNoteNumber: "",
    creditNoteTitle: "",
    returnedDate: "",
    creditDate: "",      // ✅ ADD
    isCount: false,
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
  const [assetSearchTerms, setAssetSearchTerms] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalCreditNote, setOriginalCreditNote] = useState(null);

  // Fetch credit note data and related data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch credit note data
        const creditNoteResponse = await axios.get(
          `${API_URL}/credit-notes/${id}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        const creditNoteData = creditNoteResponse.data;
        setOriginalCreditNote(creditNoteData);

        console.log("Credit Note Data:", creditNoteData); // For debugging

        // Set form data from the fetched credit note
        setFormData({
          creditNoteNumber: creditNoteData.credit_note_number,
          creditNoteTitle: creditNoteData.credit_note_title || "",
          returnedDate: creditNoteData.returned_date,
          creditDate: creditNoteData.credit_date || "",   // ✅ ADD
          isCount: creditNoteData.is_count || false,
          industry: creditNoteData.industry || "",
          transactionType: creditNoteData.transaction_type || "Credit Note",
          paymentType: creditNoteData.payment_type,
          dcId: creditNoteData.dispatch_order_id,
          dcNumber: creditNoteData.dispatch_order_number,
          customerId: creditNoteData.customer_id,
          dcDate: creditNoteData.dc_date,
          customerName: creditNoteData.customer_name,
          createdBy: creditNoteData.created_by || "",
          amount: creditNoteData.amount,
          reference: creditNoteData.reference || "",
          tin: creditNoteData.tin || "",
          pan: creditNoteData.pan || "",
          email: creditNoteData.email || "",
          shippingName: creditNoteData.shipping_name || "",
          pincode: creditNoteData.pincode || "",
          vehicleNo: creditNoteData.vehicle_no || "",
          collectedPersonName: creditNoteData.collected_person_name || "",
          collectedPersonNo: creditNoteData.collected_person_no || "",
          status: creditNoteData.status,
          printCreditNote: creditNoteData.print_credit_note || false,
        });

        // Set selected products and quantities from items
        if (creditNoteData.items && creditNoteData.items.length > 0) {
          const productIds = creditNoteData.items.map((item) => item.product_id);
          setSelectedProductIds(productIds);

          const qtyMap = {};
          const deviceIdMap = {};
          creditNoteData.items.forEach((item) => {
            qtyMap[item.product_id] = item.quantity;
            deviceIdMap[item.product_id] = item.device_ids || [];
          });
          setQuantities(qtyMap);
          setDeviceIds(deviceIdMap);
        }

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

        // Fetch products
        const prodResponse = await axios.get(`${API_URL}/product-templete/without-active`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        setProducts(prodResponse.data);

        // Fetch delivery challans for this customer
        if (creditNoteData.customer_id) {
          const dcResponse = await axios.get(
            `${API_URL}/delivery-challans/customer/${creditNoteData.customer_id}`,
            {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }
          );
          setDeliveryChallans(dcResponse.data);

          // Find and set the selected delivery challan using dispatch_order_id
          const selectedDC = dcResponse.data.find(
            (dc) => dc.id === creditNoteData.dispatch_order_id
          );
          if (selectedDC) {
            setSelectedOrder(selectedDC);

            // Prepare available asset IDs from the delivery challan items
            const assetMap = {};
            selectedDC.items.forEach((item) => {
              assetMap[item.product_id] = item.device_ids || [];
            });
            setAvailableAssetIds(assetMap);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Error fetching data: " + error.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userToken]);

  // Effect to ensure products are properly selected when both selectedOrder and originalCreditNote are available
  useEffect(() => {
    if (selectedOrder && originalCreditNote) {
      // Get the product IDs from the original credit note
      const originalProductIds = originalCreditNote.items.map(item => item.product_id);

      // Only set if they're different from current selection to avoid loops
      if (JSON.stringify(selectedProductIds) !== JSON.stringify(originalProductIds)) {
        setSelectedProductIds(originalProductIds);
      }

      // Set quantities and device IDs from original credit note
      const newQuantities = {};
      const newDeviceIds = {};

      originalCreditNote.items.forEach((item) => {
        newQuantities[item.product_id] = item.quantity;
        newDeviceIds[item.product_id] = item.device_ids || [];
      });

      setQuantities(newQuantities);
      setDeviceIds(newDeviceIds);
    }
  }, [selectedOrder, originalCreditNote]);

  // Fetch delivery challans when customer is changed
  useEffect(() => {
    if (formData.customerId && formData.customerId !== originalCreditNote?.customer_id) {
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
        }
      };
      fetchDeliveryChallans();
    }
  }, [formData.customerId, originalCreditNote, userToken]);

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

      // Clear DC selection when customer changes
      setSelectedOrder(null);
      setFormData(prev => ({
        ...prev,
        dcId: "",
        dcNumber: "",
        dcDate: "",
      }));

      // Clear products
      setSelectedProductIds([]);
      setQuantities({});
      setDeviceIds({});
      setAvailableAssetIds({});
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
        paymentType: selectedDC.payment_type,
        dcDate: selectedDC.dc_date,
        shippingName: selectedDC.shipping_name,
        pincode: selectedDC.pincode,
        customerName: selectedDC.customer_name || prev.customerName,
      }));

      setDcSearchTerm("");

      // Prepare available asset IDs from the delivery challan items
      const assetMap = {};
      selectedDC.items.forEach((item) => {
        assetMap[item.product_id] = item.device_ids || [];
      });

      setAvailableAssetIds(assetMap);

      // If this is the original DC, restore the original selections
      if (originalCreditNote && originalCreditNote.dispatch_order_id === dcId) {
        const originalProductIds = originalCreditNote.items.map(item => item.product_id);
        setSelectedProductIds(originalProductIds);

        const qtyMap = {};
        const deviceIdMap = {};
        originalCreditNote.items.forEach((item) => {
          qtyMap[item.product_id] = item.quantity;
          deviceIdMap[item.product_id] = item.device_ids || [];
        });
        setQuantities(qtyMap);
        setDeviceIds(deviceIdMap);
      } else {
        // Reset product selections when DC changes to a different one
        setSelectedProductIds([]);
        setQuantities({});
        setDeviceIds({});
        setDeviceIdErrors({});
      }
    }
  };

  // Get customer products with their details
  const getCustomerProducts = () => {
    if (!selectedOrder) return [];

    return selectedOrder.items
      .map((item) => {
        // Try to find product in products list, or use the product data from the item
        const product = products.find((p) => p.id === item.product_id) || item.product;
        if (!product) return null;

        // Find if this product exists in the original credit note items
        const originalItem = originalCreditNote?.items?.find(
          (creditItem) => creditItem.product_id === item.product_id
        );

        return {
          ...item,
          product_id: item.product_id,
          product_name: product.product_name,
          quantity: item.quantity, // DC quantity
          original_quantity: originalItem?.quantity || 0,
          original_device_ids: originalItem?.device_ids || [],
          specifications: {
            brand: product.brand,
            model: product.model,
            processor: product.processor,
            ram: product.ram,
            storage: product.storage,
            graphics: product.graphics,
          },
        };
      })
      .filter(Boolean);
  };

  // Filter asset IDs based on search term
  const filterAssetIds = (productId, assetIds) => {
    const searchTerm = assetSearchTerms[productId] || "";
    if (!searchTerm.trim()) return assetIds;

    return assetIds.filter(assetId =>
      assetId.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Remove selected asset ID
  const removeSelectedAssetId = (productId, assetIdToRemove) => {
    setDeviceIds((prev) => ({
      ...prev,
      [productId]: (prev[productId] || []).filter(id => id !== assetIdToRemove)
    }));

    // Clear any errors for this product
    setDeviceIdErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[productId];
      return newErrors;
    });
  };

  // Clear all selected asset IDs for a product
  const clearAllSelectedAssetIds = (productId) => {
    setDeviceIds((prev) => ({
      ...prev,
      [productId]: []
    }));

    // Clear any errors for this product
    setDeviceIdErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[productId];
      return newErrors;
    });
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
  };

  const customerProducts = getCustomerProducts();

  const filteredProducts = selectedOrder
    ? selectedOrder.items
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id) || item.product;
        return product;
      })
      .filter(Boolean)
      .filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

  const handleUpdate = async () => {
    // Validate at least one product is selected
    if (selectedProductIds.length === 0) {
      setSnackbarMessage("Please select at least one product");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Validate each selected product has asset IDs selected
    let productErrors = {};
    let hasProductErrors = false;

    selectedProductIds.forEach((productId) => {
      const selectedDevices = deviceIds[productId] || [];

      // Check if at least one asset ID is selected
      if (selectedDevices.length === 0) {
        productErrors[productId] = "Please select at least one asset ID";
        hasProductErrors = true;
      }
    });

    setDeviceIdErrors(productErrors);
    if (hasProductErrors) {
      setSnackbarMessage("Please select asset IDs for all products");
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

    if (!selectedOrder) {
      setSnackbarMessage("Please select a delivery challan first");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Calculate total amount based on selected products and quantities
    const totalAmount = selectedProductIds.reduce((sum, productId) => {
      const dcItem = selectedOrder.items.find(
        (item) => item.product_id === productId
      );
      const unitPrice = dcItem ? parseFloat(dcItem.unit_price) : 0;
      const qty = (deviceIds[productId] || []).length;
      return sum + unitPrice * qty;
    }, 0);

    const payload = {
      credit_note_number: formData.creditNoteNumber,
      credit_note_title: formData.creditNoteTitle,
      industry: formData.industry,
      transaction_type: formData.transactionType,
      payment_type: formData.paymentType,
      dispatch_order_id: formData.dcId,
      dispatch_order_number: formData.dcNumber,
      customer_id: formData.customerId,
      dc_date: formData.dcDate,
      returned_date: formData.returnedDate,
      credit_date: formData.creditDate,   // ✅ ADD
      is_count: formData.isCount,
      customer_name: formData.customerName,
      created_by: formData.createdBy,
      amount: totalAmount.toFixed(2),
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
        const dcItem = selectedOrder.items.find(
          (item) => item.product_id === productId
        );

        const unitPrice = dcItem ? parseFloat(dcItem.unit_price) : 0;
        const selectedAssetIds = deviceIds[productId] || [];
        const qty = selectedAssetIds.length;

        return {
          product_id: productId,
          product_name: dcItem?.product_name || "",
          quantity: qty,
          device_ids: selectedAssetIds,
          unit_price: unitPrice.toFixed(2),
          total_price: (qty * unitPrice).toFixed(2),
        };
      }),
    };

    console.log("Update Payload:", payload);

    try {
      await axios.put(`${API_URL}/credit-notes/${id}`, payload, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      setSnackbarMessage("Credit Note updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/dashboard/operations/grn"), 3000);
    } catch (error) {
      console.error("Error updating credit note:", error);
      setSnackbarMessage(
        "Failed to update credit note: " +
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

  if (loading) {
    return (
      <div style={containerStyle}>
        <Typography>Loading...</Typography>
      </div>
    );
  }

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
                disabled
              />
            </div>

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
              <label style={labelStyle}>
                Credit Date
                <span style={requiredStyle}>*</span>
              </label>
              <input
                type="date"
                style={inputStyle}
                name="creditDate"
                value={formData.creditDate}
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
                <option value="" disabled>
                  -- Select Payment Type --
                </option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Prepaid">Prepaid</option>
              </select>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>DC Number</label>
              <input
                type="text"
                placeholder="e.g. DC102"
                style={inputStyle}
                name="dcNumber"
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
                Select Client
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
                    Select Client
                  </MenuItem>
                  {orders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {`${order.first_name} ${order.last_name} (${order.company_name})`}
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
            </div>

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


        {/* Control Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Control</h3>
          </div>

         <div style={checkboxContainerStyle}>
  <label style={checkboxLabelStyle}>
    <input
      type="checkbox"
      style={checkboxStyle}
      checked={formData.isCount}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          isCount: e.target.checked,
        }))
      }
    />
    <div
      style={{
        ...checkboxCustomStyle,
        backgroundColor: formData.isCount ? "#3b82f6" : "#ffffff",
        borderColor: formData.isCount ? "#3b82f6" : "#d1d5db",
      }}
    >
      {formData.isCount && <span style={checkmarkStyle}>✓</span>}
    </div>
    <div>
      <span style={checkboxTextStyle}>Count Return Day</span>
    </div>
  </label>
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
              {showProductTable ? "Hide Product List" : "Edit Products"}
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

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                        <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                          Product Name
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                          Specifications
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }} align="center">
                          Total Qty
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }} align="center">
                          Return Qty
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                          Selected Asset IDs
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                          Choose Asset IDs
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerProducts.map((product) => {
                        const selectedCount = (deviceIds[product.product_id] || []).length;
                        const isSelected = selectedProductIds.includes(product.product_id);

                        return (
                          <TableRow
                            key={product.product_id}
                            sx={{
                              backgroundColor: isSelected ? '#f5f5f5' : 'inherit',
                              '&:hover': {
                                backgroundColor: isSelected ? '#eeeeee' : '#fafafa',
                              },
                              cursor: 'pointer'
                            }}
                            onClick={() => handleProductSelection(product.product_id)}
                          >
                            <TableCell>
                              <strong>{product.product_name}</strong>
                            </TableCell>
                            <TableCell>
                              {[
                                product.specifications?.brand,
                                product.specifications?.model,
                                product.specifications?.processor,
                                product.specifications?.ram,
                                product.specifications?.storage,
                                product.specifications?.graphics,
                              ]
                                .filter(Boolean)
                                .join(" | ")}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={product.quantity}
                                color="primary"
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={selectedCount}
                                color={selectedCount > 0 ? "success" : "default"}
                                size="small"
                                variant={selectedCount > 0 ? "filled" : "outlined"}
                              />
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
                                {(deviceIds[product.product_id] || []).length > 0 ? (
                                  <>
                                    {(deviceIds[product.product_id] || []).map((assetId) => (
                                      <Chip
                                        key={assetId}
                                        label={assetId}
                                        size="small"
                                        onDelete={() => removeSelectedAssetId(product.product_id, assetId)}
                                        deleteIcon={<Close />}
                                        sx={{
                                          backgroundColor: "#e3f2fd",
                                          '& .MuiChip-deleteIcon': {
                                            color: '#666',
                                            '&:hover': {
                                              color: '#d32f2f'
                                            }
                                          }
                                        }}
                                      />
                                    ))}
                                    {deviceIds[product.product_id]?.length > 0 && (
                                      <Chip
                                        label="Clear All"
                                        size="small"
                                        onClick={() => clearAllSelectedAssetIds(product.product_id)}
                                        sx={{
                                          backgroundColor: "#ffebee",
                                          color: "#c62828",
                                          cursor: "pointer",
                                          ml: 0.5
                                        }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    No asset IDs selected
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Box display="flex" flexDirection="column" gap={1}>
                                <TextField
                                  size="small"
                                  placeholder="Search Asset ID"
                                  value={assetSearchTerms[product.product_id] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setAssetSearchTerms((prev) => ({
                                      ...prev,
                                      [product.product_id]: value,
                                    }));
                                  }}
                                />

                                {(assetSearchTerms[product.product_id] || "").trim() !== "" && (
                                  <Box
                                    sx={{
                                      maxHeight: 150,
                                      overflowY: "auto",
                                      border: "1px solid #e0e0e0",
                                      borderRadius: 1,
                                      p: 1,
                                    }}
                                  >
                                    {filterAssetIds(product.product_id, availableAssetIds[product.product_id] || []).length > 0 ? (
                                      filterAssetIds(product.product_id, availableAssetIds[product.product_id] || []).map((assetId) => {
                                        const isSelected = (deviceIds[product.product_id] || []).includes(assetId);
                                        return (
                                          <Box
                                            key={assetId}
                                            onClick={() => {
                                              if (!isSelected) {
                                                const currentDeviceIds = deviceIds[product.product_id] || [];
                                                const maxQty = product.quantity;

                                                if (currentDeviceIds.length >= maxQty) {
                                                  setDeviceIdErrors((prev) => ({
                                                    ...prev,
                                                    [product.product_id]: `Only ${maxQty} asset ID(s) allowed.`,
                                                  }));
                                                  return;
                                                }

                                                setDeviceIdErrors((prev) => {
                                                  const newErrors = { ...prev };
                                                  delete newErrors[product.product_id];
                                                  return newErrors;
                                                });

                                                setDeviceIds((prev) => ({
                                                  ...prev,
                                                  [product.product_id]: [
                                                    ...currentDeviceIds,
                                                    assetId,
                                                  ],
                                                }));
                                              }
                                            }}
                                            sx={{
                                              p: 0.5,
                                              cursor: isSelected ? "not-allowed" : "pointer",
                                              backgroundColor: isSelected ? "#e3f2fd" : "transparent",
                                              opacity: isSelected ? 0.7 : 1,
                                              borderRadius: 1,
                                              "&:hover": {
                                                backgroundColor: isSelected ? "#e3f2fd" : "#f5f5f5",
                                              },
                                              mb: 0.5,
                                            }}
                                          >
                                            {assetId} {isSelected && "(Selected)"}
                                          </Box>
                                        );
                                      })
                                    ) : (
                                      <Typography variant="caption" color="textSecondary">
                                        No matching asset IDs found
                                      </Typography>
                                    )}
                                  </Box>
                                )}

                                {deviceIdErrors[product.product_id] && (
                                  <Typography color="error" variant="caption">
                                    {deviceIdErrors[product.product_id]}
                                  </Typography>
                                )}
                              </Box>
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
          onClick={handleUpdate}
          disabled={!selectedOrder}
        >
          Update Credit Note
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


const checkboxContainerStyle = {
  marginTop: "1rem",
  padding: "12px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#f9fafb",
  display: "flex",
  alignItems: "center",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  gap: "10px",
  width: "100%",
};

const checkboxStyle = {
  display: "none",
};

const checkboxCustomStyle = {
  width: "22px",
  height: "22px",
  borderRadius: "6px",
  border: "2px solid #d1d5db",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const checkmarkStyle = {
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "bold",
};

const checkboxTextStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
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

export default CreaditNotesEditFormLayout;