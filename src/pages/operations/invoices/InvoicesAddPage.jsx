import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

import API_URL from "../../../api/Api_url";

const InvoicesAddPage = () => {
  const [formData, setFormData] = useState({
    invoice_number: "",
    invoice_title: "",
    customer_id: "",
    customer_name: "",
    invoice_date: new Date().toISOString().split("T")[0],
    invoice_due_date: "",
    purchase_order_date: "",
    purchase_order_number: "",
    customer_gst_number: "",
    duration: "",
    email: "",
    phone_number: "",
    pan_number: "",
    payment_terms: "",
    payment_mode: "NEFT",
    approval_status: "Approved",
    approval_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    amount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    total_tax: 0,
    total_amount: 0,
    invoice_consulting_by: "",
    industry: "",
    remarks: "",
    items: [],
    shippingDetails: {
      consignee_name: "",
      country: "India",
      state: "",
      city: "",
      street: "",
      landmark: "",
      pincode: "",
      phone_number: "",
      email: "",
    },
  });


  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const orderApprovedResponse = await fetch(
          `${API_URL}/orders/order-approved`
        );
        if (!orderApprovedResponse.ok)
          throw new Error("Failed to fetch orders");
        const orderApprovedData = await orderApprovedResponse.json();
        setOrders(orderApprovedData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`);
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();
        setProducts(prodData);

        // Fetch tax types
        const taxResponse = await fetch(`${API_URL}/tax-types`);
        if (!taxResponse.ok) throw new Error("Failed to fetch tax types");
        const taxData = await taxResponse.json();
        setTaxTypes(taxData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching data: " + error.message,
          severity: "error",
        });
      }
    };

    fetchData();
  }, []);
  const handleCustomerSelect = (customerId) => {
    const selectedOrder = orders.find(
      (order) => order.id === parseInt(customerId)
    );
    if (!selectedOrder) return;

    const personal = selectedOrder.personalDetails;
    const address = selectedOrder.address;

    // Extract product IDs and quantities from the order items
    const orderItems = selectedOrder.items || [];
    const productIds = orderItems.map((item) => item.product_id);
    const productQuantities = {};

    orderItems.forEach((item) => {
      productQuantities[item.product_id] = item.requested_quantity;
    });

    // Set the selected products and quantities
    setSelectedProductIds(productIds);
    setQuantities(productQuantities);

    // Calculate initial totals based on the order items
    const selectedProducts = products.filter((product) =>
      productIds.includes(product.id)
    );

    let amount = 0;
    const items = selectedProducts.map((product) => {
      const quantity = productQuantities[product.id] || 0;
      let price = product.purchase_price;
      if (selectedOrder.transaction_type === "Rent") {
        const duration = selectedOrder.rental_duration;
        const monthlyRate = product.rent_price_per_month || 0;

        switch (duration) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
            price = monthlyRate * parseInt(duration);
            break;
          case "6":
            price = product.rent_price_6_months || monthlyRate * 6;
            break;
          case "7":
          case "8":
          case "9":
          case "10":
          case "11":
            price = monthlyRate * parseInt(duration);
            break;
          case "12":
            price = product.rent_price_1_year || monthlyRate * 12;
            break;
          default:
            price = product.rent_price_per_day || 0; // fallback
        }
      }

      const totalPrice = quantity * price;
      amount += totalPrice;
      return {
        product_id: product.id,
        product_name: product.product_name,
        quantity: quantity,
        unit_price: price,
        total_price: totalPrice,
      };
    });

    // Calculate taxes
    const cgstRate =
      taxTypes.find((t) => t.tax_type_name === "CGST")?.percentage || 0;
    const sgstRate =
      taxTypes.find((t) => t.tax_type_name === "SGST")?.percentage || 0;
    console.log(cgstRate,"kkkkkkkkkkkkkkkkkkkkk");
    
    const cgst = (amount * parseFloat(cgstRate)) / 100;
    const sgst = (amount * parseFloat(sgstRate)) / 100;
    const totalTax = cgst + sgst;
    const totalAmount = amount + totalTax;
    console.log(cgst,"llllllllllllllllll");

    setFormData({
      ...formData,
      customer_id: selectedOrder.id,
      customer_name: `${personal?.first_name || ""} ${
        personal?.last_name || ""
      }`,
      email: personal?.email || "",
      phone_number: personal?.phone_number || "",
      customer_gst_number: personal?.gst_number || "",
      pan_number: "",
      order_id: selectedOrder.order_id,
      transaction_type: selectedOrder.transaction_type || "Sale",
      payment_type: selectedOrder.payment_type || "Postpaid",
      rental_duration: selectedOrder.rental_duration || "",
      purchase_order_date: selectedOrder.updated_at
        ? new Date(selectedOrder.updated_at).toISOString().split("T")[0]
        : "",
      purchase_order_number: selectedOrder.order_id || "",
      duration: selectedOrder.rental_duration || 0, // <- setting duration here
      rental_start_date: selectedOrder.rental_start_date || "",
      rental_end_date: selectedOrder.rental_end_date || "",
      amount: amount,
      cgst: cgst,
      sgst: sgst,
      total_tax: totalTax,
      total_amount: totalAmount,
      items: items,
      shippingDetails: {
        ...formData.shippingDetails,
        consignee_name: `${personal?.first_name || ""} ${
          personal?.last_name || ""
        }`,
        country: address?.country || "India",
        state: address?.state || "",
        city: address?.city || "",
        street: address?.street || "",
        pincode: address?.pincode || "",
        phone_number: personal?.phone_number || "",
        email: personal?.email || "",
      },
    });
  };

  // Helper function to get rental price based on duration
  const getRentalPrice = (product, duration) => {
    switch (duration) {
      case "1":
        return product.rent_price_per_day;
      case "30":
        return product.rent_price_per_month;
      case "180":
        return product.rent_price_6_months;
      case "365":
        return product.rent_price_1_year;
      default:
        return product.rent_price_per_day;
    }
  };
  // Add this effect to update the form data when selected products or quantities change
  useEffect(() => {
    if (selectedProductIds.length > 0) {
      setShowProductTable(true); // Automatically show the product table when products are selected
    }
  }, [selectedProductIds]);
  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      const pincode = formData.shippingDetails.pincode;

      // Only make API call if pincode is 6 digits (India specific)
      if (pincode && pincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = await response.json();

          if (data && data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];

            setFormData((prev) => ({
              ...prev,
              shippingDetails: {
                ...prev.shippingDetails,
                city: postOffice.District,
                state: postOffice.State,
                country: "India",
              },
            }));
          } else {
            setSnackbar({
              open: true,
              message: "Could not find location for this pincode",
              severity: "warning",
            });
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
          setSnackbar({
            open: true,
            message:
              "Error fetching location data. Please check the pincode and try again.",
            severity: "error",
          });
        }
      }
    };

    // Add debounce to prevent too many API calls
    const debounceTimer = setTimeout(() => {
      fetchLocationFromPincode();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formData.shippingDetails.pincode]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle shipping details changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      shippingDetails: {
        ...formData.shippingDetails,
        [name]: value,
      },
    });
  };

  // Handle product selection
  const handleProductSelection = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
      setQuantities((prev) => ({
        ...prev,
        [productId]: prev[productId] || 1,
      }));
    }
  };

  // Handle quantity changes
  const handleQtyChange = (productId, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const incrementQty = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrementQty = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals when products or quantities change
  useEffect(() => {
    const calculateTotals = () => {
      const selectedProducts = products.filter((product) =>
        selectedProductIds.includes(product.id)
      );

      let amount = 0;
      const items = selectedProducts.map((product) => {
        const quantity = quantities[product.id] || 0;
        const price =
          formData.transaction_type === "Rent"
            ? getRentalPrice(product, formData.rental_duration)
            : product.purchase_price;

        const totalPrice = quantity * price;
        amount += totalPrice;
        return {
          product_id: product.id,
          product_name: product.product_name,
          quantity: quantity,
          unit_price: price,
          total_price: totalPrice,
        };
      });

      // Calculate taxes
      const cgstRate =
        taxTypes.find((t) => t.tax_type_name === "CGST")?.percentage || 0;
      const sgstRate =
        taxTypes.find((t) => t.tax_type_name === "SGST")?.percentage || 0;
      const cgst = (amount * parseFloat(cgstRate)) / 100;
      const sgst = (amount * parseFloat(sgstRate)) / 100;
      const totalTax = cgst + sgst;
      const totalAmount = amount + totalTax;

      console.log(cgst,"jjjjjjjjjjjjjjjjjjjjjjjjj");
      

      setFormData((prev) => ({
        ...prev,
        amount: amount,
        cgst: cgst,
        sgst: sgst,
        total_tax: totalTax,
        total_amount: totalAmount,
        items: items,
      }));
    };

    calculateTotals();
  }, [
    selectedProductIds,
    quantities,
    products,
    taxTypes,
    formData.transaction_type,
    formData.rental_duration,
  ]);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/invoices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create invoice");

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Invoice created successfully!",
        severity: "success",
      });
      // Reset form or redirect as needed
    } catch (error) {
      console.error("Error creating invoice:", error);
      setSnackbar({
        open: true,
        message: "Error creating invoice: " + error.message,
        severity: "error",
      });
    }
  };


  const formatINR = (number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(number || 0);

  return (
    <div style={containerStyle}>
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

      <div style={headerStyle}>
        <h1 style={titleStyle}>Create Invoice</h1>
        <p style={subtitleStyle}>
          Fill in the details below to create a new invoice
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Basic Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📄</div>
              <h3 style={cardHeaderStyle}>Basic Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Invoice Number"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleInputChange}
                placeholder="Enter Invoice Number"
              />
              <Field
                label="Invoice Title"
                name="invoice_title"
                value={formData.invoice_title}
                onChange={handleInputChange}
                placeholder="Enter Invoice Title"
              />

              <FormControl fullWidth>
                <InputLabel>Select Customer</InputLabel>
                <Select
                  value={formData.customer_id}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  label="Select Customer"
                >
                  {orders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {order.order_id} || {order.personalDetails?.first_name}{" "}
                      {order.personalDetails?.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Field
                label="Invoice Date"
                type="date"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleInputChange}
              />
              <Field
                label="Due Date"
                type="date"
                name="invoice_due_date"
                value={formData.invoice_due_date}
                onChange={handleInputChange}
              />
              <Field
                label="PO Number"
                name="purchase_order_number"
                value={formData.purchase_order_number}
                onChange={handleInputChange}
                placeholder="Enter PO Number"
              />
              <Field
                label="PO Date"
                type="date"
                name="purchase_order_date"
                value={formData.purchase_order_date}
                onChange={handleInputChange}
              />
              <Field
                label="Customer GST"
                name="customer_gst_number"
                value={formData.customer_gst_number}
                onChange={handleInputChange}
                placeholder="Enter GST Number"
              />
              <Field
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                type="email"
              />
              <Field
                label="Phone"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter Phone"
                type="tel"
              />
              <Field
                label="PAN"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleInputChange}
                placeholder="Enter PAN"
              />
              <Field
                label="Payment Terms"
                name="payment_terms"
                value={formData.payment_terms}
                onChange={handleInputChange}
                placeholder="Enter Payment Terms"
              />
              <Field
                label="Payment Mode"
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleInputChange}
                placeholder="Enter Payment Mode"
              />
              <Field
                label="Consultant"
                name="invoice_consulting_by"
                value={formData.invoice_consulting_by}
                onChange={handleInputChange}
                placeholder="Enter Consultant Name"
              />
              <Field
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="Enter Industry"
              />
              <Field
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Enter Remarks"
              />
            </div>
          </div>

          {/* Shipping Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏢</div>
              <h3 style={cardHeaderStyle}>Shipping Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Consignee Name"
                name="consignee_name"
                value={formData.shippingDetails.consignee_name}
                onChange={handleShippingChange}
                placeholder="Enter Consignee Name"
              />
              <Field
                label="Pincode"
                name="pincode"
                value={formData.shippingDetails.pincode}
                onChange={handleShippingChange}
                placeholder="Enter Pincode"
                type="number"
              />
              <Field
                label="Country"
                name="country"
                value={formData.shippingDetails.country}
                onChange={handleShippingChange}
                placeholder="Enter Country"
              />
              <Field
                label="State"
                name="state"
                value={formData.shippingDetails.state}
                onChange={handleShippingChange}
                placeholder="Enter State"
              />
              <Field
                label="City"
                name="city"
                value={formData.shippingDetails.city}
                onChange={handleShippingChange}
                placeholder="Enter City"
              />
              <Field
                label="Street"
                name="street"
                value={formData.shippingDetails.street}
                onChange={handleShippingChange}
                placeholder="Enter Street"
              />
              <Field
                label="Landmark"
                name="landmark"
                value={formData.shippingDetails.landmark}
                onChange={handleShippingChange}
                placeholder="Enter Landmark"
              />
              <Field
                label="Shipping Phone"
                name="phone_number"
                value={formData.shippingDetails.phone_number}
                onChange={handleShippingChange}
                placeholder="Enter Phone"
                type="tel"
              />
              <Field
                label="Shipping Email"
                name="email"
                value={formData.shippingDetails.email}
                onChange={handleShippingChange}
                placeholder="Enter Email"
                type="email"
              />
            </div>
          </div>
        </div>

        {/* Select Products Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Selected Products</h3>
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
                                    quantities[product.id] || 1;
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
                        <TableCell sx={{ color: "#fff" }}>
                          Specifications
                        </TableCell>

                        <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Purchase Price
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Price for Durations
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() =>
                                handleProductSelection(product.id)
                              }
                            />
                          </TableCell>
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell>{product.brand}</TableCell>

                          <TableCell>
                            {[
                              product.model,
                              product.processor,
                              product.ram,
                              product.storage,
                              product.graphics,
                            ]
                              .filter(Boolean) // Remove undefined/null values
                              .join(" | ")}
                          </TableCell>

                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => decrementQty(product.id)}
                                disabled={
                                  !selectedProductIds.includes(product.id)
                                }
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <TextField
                                type="number"
                                size="small"
                                value={
                                  selectedProductIds.includes(product.id)
                                    ? quantities[product.id] || ""
                                    : ""
                                }
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
                                disabled={
                                  !selectedProductIds.includes(product.id)
                                }
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>{product.purchase_price}</TableCell>

                          <TableCell>
                            {formData.transaction_type === "Rent" ? (
                              <>
                                <div>Day: {product.rent_price_per_day}</div>
                                <div>Month: {product.rent_price_per_month}</div>
                                <div>
                                  6 Months: {product.rent_price_6_months}
                                </div>
                                <div>1 Year: {product.rent_price_1_year}</div>
                              </>
                            ) : (
                              product.purchase_price
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

        {/* Totals Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💰</div>
            <h3 style={cardHeaderStyle}>Invoice Totals</h3>
          </div>
          <div style={fieldsGridStyle}>
  <Field label="Subtotal" name="amount" value={formatINR(formData.amount)} readOnly />
  <Field label="CGST (9%)" name="cgst" value={formatINR(formData.cgst)} readOnly />
  <Field label="SGST (9%)" name="sgst" value={formatINR(formData.sgst)} readOnly />
  {/* <Field label="IGST" name="igst" value={formatINR(formData.igst)} readOnly /> */}
  <Field label="Total Tax" name="total_tax" value={formatINR(formData.total_tax)} readOnly />
  <Field label="Total Amount" name="total_amount" value={formatINR(formData.total_amount)} readOnly />
</div>

        </div>
        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={cancelBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={submitBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Submit Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
          name={name}
          value={value}
          onChange={onChange}
          disabled={readOnly}
        >
          <option value="" disabled>
            {placeholder}
          </option>
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "date" ? (
      <input
        type="date"
        style={inputStyle}
        name={name}
        value={value}
        onChange={onChange}
        disabled={readOnly}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          backgroundColor: readOnly ? "#f3f4f6" : "#ffffff",
        }}
        readOnly={readOnly}
      />
    )}
  </div>
);

// Styles
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: "2rem",
  maxWidth: "1400px",
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 0.5rem 0",
  letterSpacing: "-0.025em",
};

const subtitleStyle = {
  fontSize: "1rem",
  color: "#64748b",
  margin: 0,
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1400px",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
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

const selectWrapperStyle = {
  position: "relative",
  width: "100%",
};

const selectStyle = {
  width: "100%",
  padding: "0.75rem",
  paddingRight: "2.5rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  appearance: "none",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
  cursor: "pointer",
};

const selectArrowStyle = {
  position: "absolute",
  right: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  fontSize: "0.75rem",
  color: "#6b7280",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "2rem",
  maxWidth: "1200px",
  margin: "2rem auto 0",
  padding: "0 1.5rem",
  flexWrap: "wrap",
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

const submitBtnStyle = {
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

export default InvoicesAddPage;
