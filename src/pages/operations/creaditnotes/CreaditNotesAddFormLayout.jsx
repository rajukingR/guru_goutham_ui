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
} from "@mui/material";
import { Add, CheckBox, Remove } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";

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

  const [formData, setFormData] = useState({
    creditNoteNumber: "",
    creditNoteTitle: "",
    returnedDate: "",
    industry: "",
    transactionType: "Credit Note",
    paymentType: "",
    dcId: "",
    customerId: "",
    invoiceDate: "",
    invoiceStartDate: "",
    invoiceEndDate: "",
    customerName: "",
    createdBy: "",
    amount: "",
    reference: "",
    tin: "",
    pan: "",
    email: "",
    shippingName: "",
    pincode: "",
    status: "",
    printCreditNote: false,
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [deviceIds, setDeviceIds] = useState({});
  const [availableAssetIds, setAvailableAssetIds] = useState({});
  const [deviceIdErrors, setDeviceIdErrors] = useState({});
  const [showProductTable, setShowProductTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      creditNoteNumber: generateCreditNoteNumber(),
    }));
  }, []);

  // Fetch orders and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved invoices
        const orderResponse = await axios.get(
          `${API_URL}/invoices/approved-invoices`
        );
        setOrders(orderResponse.data);

        // Fetch products
        const prodResponse = await axios.get(`${API_URL}/product-templete`);
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

  // When an order is selected, populate form data and available assets
  const handleOrderSelect = (orderId) => {
    const selected = orders.find((order) => order.id === orderId);
    if (!selected) return;

    setSelectedOrder(selected);

    // Populate form fields from the selected invoice
    setFormData((prev) => ({
      ...prev,
      creditNoteTitle: `Credit Note for Invoice ${selected.invoice_number}`,
      customerId: selected.customer_id,
      customerName: selected.customer_name,
      dcId: selected.dc_id,
      invoiceDate: selected.invoice_date,
      invoiceStartDate: selected.invoice_start_date,
      invoiceEndDate: selected.invoice_end_date,
      industry: selected.industry,
      email: selected.email,
      pan: selected.pan_number,
      amount: selected.amount,
      shippingName: selected.shippingDetail?.consignee_name || "",
      pincode: selected.shippingDetail?.pincode || "",
    }));

    // Process device IDs from the invoice items
    const newAvailableAssetIds = {};
    selected.items.forEach((item) => {
      try {
        const parsedDeviceIds = JSON.parse(item.device_ids || "[]");

        // Use returned_device_ids as array
        const returnedDevices = Array.isArray(item.returned_device_ids)
          ? item.returned_device_ids
          : typeof item.returned_device_ids === "string"
          ? JSON.parse(item.returned_device_ids || "[]")
          : [];

        // Filter remaining devices
        const remainingDevices = parsedDeviceIds.filter(
          (dev) => !returnedDevices.includes(dev)
        );

        newAvailableAssetIds[item.product_id] = remainingDevices;

        // Use net_quantity instead of quantity
        const netQty =
          typeof item.net_quantity === "number"
            ? item.net_quantity
            : (item.quantity || 0) - (item.return_quantity || 0);

        setQuantities((prev) => ({
          ...prev,
          [item.product_id]: netQty,
        }));
      } catch (e) {
        console.error("Error parsing or processing device IDs:", e);
        newAvailableAssetIds[item.product_id] = [];
      }
    });

    setAvailableAssetIds(newAvailableAssetIds);
    setSelectedProductIds([]); // Reset selected products when changing invoice
    setDeviceIds({}); // Reset selected devices
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

        return prev.filter((id) => id !== productId);
      } else {
        // Add product
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

    if (numValue > invoiceQty) {
      setDeviceIdErrors((prev) => ({
        ...prev,
        [productId]: `Credit quantity cannot exceed invoice quantity (${invoiceQty})`,
      }));
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: numValue,
    }));

    // Validate device IDs count matches quantity
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
        [productId]: `Credit quantity cannot exceed invoice quantity (${invoiceQty})`,
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
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedOrder") {
      handleOrderSelect(parseInt(value));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleToggleChange = () =>
    setFormData((p) => ({ ...p, printCreditNote: !p.printCreditNote }));

  const handleSubmit = async () => {
    // Validate device IDs match quantities
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
      setSnackbarMessage("Please select an invoice first");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const payload = {
      credit_note_number: formData.creditNoteNumber,
      credit_note_title: formData.creditNoteTitle,
      industry: formData.industry,
      transaction_type: formData.transactionType,
      payment_type: formData.paymentType,
      dc_id: formData.dcId,
      customer_id: formData.customerId,
      invoice_id: selectedOrder.id,
      invoice_number: selectedOrder.invoice_number,
      returned_date: formData.returnedDate, // Add this line

      invoice_date: formData.invoiceDate,
      invoice_start_date: formData.invoiceStartDate,
      invoice_end_date: formData.invoiceEndDate,
      customer_name: formData.customerName,
      created_by: formData.createdBy,
      amount: parseFloat(formData.amount) || 0,
      reference: formData.reference,
      tin: formData.tin,
      pan: formData.pan,
      email: formData.email,
      shipping_name: formData.shippingName,
      pincode: formData.pincode,
      status: formData.status,
      print_credit_note: formData.printCreditNote,
      items: selectedProductIds.map((productId) => ({
        product_id: productId,
        product_name:
          products.find((p) => p.id === productId)?.product_name || "",
        quantity: quantities[productId] || 1,
        device_ids: deviceIds[productId] || [],
        unit_price:
          selectedOrder.items.find((item) => item.product_id === productId)
            ?.unit_price || "0.00",
        total_price:
          (quantities[productId] || 1) *
          parseFloat(
            selectedOrder.items.find((item) => item.product_id === productId)
              ?.unit_price || 0
          ),
      })),
    };

    try {
      await axios.post(`${API_URL}/credit-notes/create`, payload);
      setSnackbarMessage("Credit Note created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/dashboard/operations/credit_notes"), 3000);
    } catch (error) {
      console.error("Error creating credit note:", error);
      setSnackbarMessage(
        "Failed to create credit note: " +
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

  return (
    <div style={containerStyle}>
      <div style={breadcrumbStyle}>
        Operations / Credit Notes / Add Credit Note
      </div>

      <div style={formContainerStyle}>
        {/* Credit Note Details Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📄</div>
            <h3 style={cardHeaderStyle}>Credit Note Details:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Credit Note No.
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

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                placeholder="Enter title"
                style={inputStyle}
                name="creditNoteTitle"
                value={formData.creditNoteTitle}
                onChange={handleInputChange}
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
                required
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
              <label style={labelStyle}>Payment Type</label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="">-- Select Payment Type --</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>DC ID</label>
              <input
                type="text"
                placeholder="e.g. DC102"
                style={inputStyle}
                name="dcId"
                value={formData.dcId}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Invoice / Customer Card */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Invoice / Customer:</h3>
          </div>
          <div style={fieldsGridStyle}>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Select Invoice
                <span style={requiredStyle}>*</span>
              </label>
              <FormControl fullWidth size="small">
                <Select
                  name="selectedOrder"
                  value={selectedOrder?.id || ""}
                  onChange={handleSelectChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  style={inputStyle}
                >
                  <MenuItem value="" disabled>
                    Select Invoice
                  </MenuItem>
                  {orders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {`${order.invoice_number} | ${order.customer_name} | ${order.invoice_date}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div style={fieldContainerStyle}>
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
              <label style={labelStyle}>Invoice Date</label>
              <input
                type="date"
                style={inputStyle}
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Start Date</label>
              <input
                type="date"
                style={inputStyle}
                name="invoiceStartDate"
                value={formData.invoiceStartDate}
                onChange={handleInputChange}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>End Date</label>
              <input
                type="date"
                style={inputStyle}
                name="invoiceEndDate"
                value={formData.invoiceEndDate}
                onChange={handleInputChange}
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
            <h3 style={cardHeaderStyle}>Control:</h3>
          </div>
          <div style={fieldsGridStyle}>
            {/* <div style={fieldContainerStyle}>
              <label style={labelStyle}>Reference</label>
              <input
                type="text"
                placeholder="Enter reference"
                style={inputStyle}
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
              />
            </div> */}

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

            {/* <div style={fieldContainerStyle}>
              <label style={labelStyle}>Status</label>
              <input
                type="text"
                placeholder="Enter status"
                style={inputStyle}
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      {selectedOrder && (
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Selected Products from Invoice</h3>
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
                        <TableCell sx={{ color: "#fff" }}>
                          Invoice Qty
                        </TableCell>
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
                            <TableCell>{product.processor}</TableCell>
                            <TableCell>{product.ram}</TableCell>
                            <TableCell>{product.storage}</TableCell>
                            <TableCell>{product.graphics}</TableCell>
                            <TableCell>
                              {invoiceItem.net_quantity ?? invoiceItem.quantity}
                            </TableCell>
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
                                    max:
                                      invoiceItem.net_quantity ??
                                      invoiceItem.quantity,
                                    style: { width: 50, textAlign: "center" },
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => incrementQty(product.id)}
                                  disabled={
                                    !selectedProductIds.includes(product.id) ||
                                    (quantities[product.id] || 1) >=
                                      (invoiceItem.net_quantity ??
                                        invoiceItem.quantity)
                                  }
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>

                            <TableCell>
                              {availableAssetIds[product.id]?.length > 0 && (
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
                                              return {
                                                ...prev,
                                                [product.id]: isChecked
                                                  ? [...currentIds, assetId]
                                                  : currentIds.filter(
                                                      (id) => id !== assetId
                                                    ),
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
          Create Credit Note
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
