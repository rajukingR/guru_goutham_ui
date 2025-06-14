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
  Button,
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
    payment_mode: "",
    approval_status: "Approved",
    approval_date: new Date().toISOString().slice(0, 19).replace("T", " "),
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

  const [returnQuantities, setReturnQuantities] = useState({});
  const [newQuantities, setNewQuantities] = useState({});
  const [newDeviceIds, setNewDeviceIds] = useState({});
  const [returnedDeviceIds, setReturnedDeviceIds] = useState({});

  const handleReturnQtyChange = (productId, value) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(value) || 0,
    }));
  };

  const incrementReturnQty = (productId) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrementReturnQty = (productId) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const handleNewQtyChange = (productId, value) => {
    const updated = { ...newQuantities, [productId]: parseInt(value) || 0 };
    setNewQuantities(updated);
  };

  const incrementNewQty = (productId) => {
    setNewQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrementNewQty = (productId) => {
    setNewQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

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

  const calculateRentalPrice = (product, months = 0, days = 0) => {
    const perDay = product.rent_price_per_day || 0;
    const perMonth = product.rent_price_per_month || 0;
    const rent6Months = product.rent_price_6_months || perMonth * 6;
    const rent1Year = product.rent_price_1_year || perMonth * 12;

    let price = 0;

    if (months === 0 && days > 0) {
      const dayCost = perDay * days;
      price = days >= 30 && dayCost > perMonth ? perMonth : dayCost;
    } else if (days === 0 && months > 0) {
      if (months === 6) price = rent6Months;
      else if (months === 12) price = rent1Year;
      else price = perMonth * months;
    } else if (months > 0 && days > 0) {
      let monthPrice = 0;

      if (months === 6) monthPrice = rent6Months;
      else if (months === 12) monthPrice = rent1Year;
      else monthPrice = perMonth * months;

      price = monthPrice + perDay * days;
    }

    return price;
  };

  // Add these state variables at the top of your component
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [dateRanges, setDateRanges] = useState({
    invoiceStartDate: "",
    invoiceEndDate: "",
    previousDeliveredStartDate: "",
    previousDeliveredEndDate: "",
    creditNoteStartDate: "",
    creditNoteEndDate: "",
  });

  // Add this useEffect to calculate dates when component mounts or month changes
  useEffect(() => {
    const today = new Date();
    let startDate, endDate;
    let prevStartDate, prevEndDate;

    if (selectedMonth === "previous") {
      // Previous month
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);

      // Previous delivered dates (month before last)
      prevStartDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      prevEndDate = new Date(today.getFullYear(), today.getMonth() - 1, 0);
    } else if (selectedMonth === "current") {
      // Current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Previous delivered dates (last month)
      prevStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      prevEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (selectedMonth === "next") {
      // Next month
      startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

      // Previous delivered dates (current month)
      prevStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
      prevEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    // Format dates as DD-MM-YYYY
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setDateRanges({
      invoiceStartDate: formatDate(startDate),
      invoiceEndDate: formatDate(endDate),
      previousDeliveredStartDate: formatDate(prevStartDate),
      previousDeliveredEndDate: formatDate(prevEndDate),
      creditNoteStartDate: formatDate(prevStartDate), // Same as previous delivered
      creditNoteEndDate: formatDate(prevEndDate), // Same as previous delivered
    });
  }, [selectedMonth]);

  const handleCustomerSelect = (customerId) => {
    const selectedOrder = orders.find(
      (order) => order.id === parseInt(customerId)
    );
    if (!selectedOrder) return;

    const personal = selectedOrder.personalDetails;
    const address = selectedOrder.address;

    const orderItems = selectedOrder.items || [];
    const productIds = orderItems.map((item) => item.product_id);
    const productQuantities = {};

    orderItems.forEach((item) => {
      productQuantities[item.product_id] = item.requested_quantity;
    });

    setSelectedProductIds(productIds);
    setQuantities(productQuantities);

    const selectedProducts = products.filter((product) =>
      productIds.includes(product.id)
    );

    let amount = 0;
    const items = selectedProducts.map((product) => {
      const quantity = quantities[product.id] || 0;
      let price = product.purchase_price;

      if (formData.transaction_type === "Rent") {
        const months = parseInt(formData.rental_duration) || 0;
        const days = parseInt(formData.rental_duration_days) || 0;
        price = calculateRentalPrice(product, months, days);
      }

      const totalPrice = quantity * price;
      amount += totalPrice;

      return {
        product_id: product.id,
        product_name: product.product_name,
        quantity: quantity,
      };
    });

    // Tax Calculation
    const cgstRate =
      taxTypes.find((t) => t.tax_type_name === "CGST")?.percentage || 0;
    const sgstRate =
      taxTypes.find((t) => t.tax_type_name === "SGST")?.percentage || 0;
    const cgst = (amount * parseFloat(cgstRate)) / 100;
    const sgst = (amount * parseFloat(sgstRate)) / 100;
    const totalTax = cgst + sgst;
    const totalAmount = amount + totalTax;

    // Set Form Data
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
      rental_duration_days: selectedOrder.rental_duration_days || 0,
      purchase_order_date: selectedOrder.updated_at
        ? new Date(selectedOrder.updated_at).toISOString().split("T")[0]
        : "",
      purchase_order_number: selectedOrder.order_id || "",
      duration: selectedOrder.rental_duration || 0,
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

  useEffect(() => {
    const calculateTotals = () => {
      const selectedProducts = products.filter((product) =>
        selectedProductIds.includes(product.id)
      );

      let amount = 0;

      const items = selectedProducts.map((product) => {
        const previous_quantity = quantities[product.id] || 0;
        const quantity = quantities[product.id] || 0;

        const return_quantity = returnQuantities?.[product.id] || 0;
        const new_quantity = newQuantities?.[product.id] || 0;
        const new_device_ids = newDeviceIds?.[product.id] || [];
        const returned_device_ids = returnedDeviceIds?.[product.id] || [];

        let price = product.purchase_price;

        if (formData.transaction_type === "Rent") {
          const months = parseInt(formData.rental_duration) || 0;
          const days = parseInt(formData.rental_duration_days) || 0;

          if (months === 0 && days > 0) {
            price = (product.rent_price_per_day || 0) * days;
          } else if (days === 0 && months > 0) {
            if (months === 6) {
              price =
                product.rent_price_6_months ||
                (product.rent_price_per_month || 0) * 6;
            } else if (months === 12) {
              price =
                product.rent_price_1_year ||
                (product.rent_price_per_month || 0) * 12;
            } else {
              price = (product.rent_price_per_month || 0) * months;
            }
          } else if (months > 0 && days > 0) {
            const monthPrice =
              months === 6
                ? product.rent_price_6_months ||
                  (product.rent_price_per_month || 0) * 6
                : months === 12
                ? product.rent_price_1_year ||
                  (product.rent_price_per_month || 0) * 12
                : (product.rent_price_per_month || 0) * months;

            const dayPrice = (product.rent_price_per_day || 0) * days;
            price = monthPrice + dayPrice;
          }
        }

        const totalPrice = new_quantity * price; // 🚨 Only new qty counted for current invoice
        amount += totalPrice;

        return {
          product_id: product.id,
          product_name: product.product_name,
          previous_quantity,
          quantity,
          return_quantity,
          new_quantity,
          new_device_ids, // Add this
          returned_device_ids, // Add this
        };
      });

      const cgstRate =
        taxTypes.find((t) => t.tax_type_name === "CGST")?.percentage || 0;
      const sgstRate =
        taxTypes.find((t) => t.tax_type_name === "SGST")?.percentage || 0;

      const cgst = (amount * parseFloat(cgstRate)) / 100;
      const sgst = (amount * parseFloat(sgstRate)) / 100;
      const totalTax = cgst + sgst;
      const totalAmount = amount + totalTax;

      setFormData((prev) => ({
        ...prev,
        amount,
        cgst,
        sgst,
        total_tax: totalTax,
        total_amount: totalAmount,
        items,
      }));
    };

    calculateTotals();
  }, [
    selectedProductIds,
    quantities, // previous_quantity
    returnQuantities, // return_quantity
    newQuantities, // ✅ new_quantity
    products,
    taxTypes,
    formData.transaction_type,
    formData.rental_duration,
    formData.rental_duration_days,
  ]);

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Prepare the data to be sent
    const submissionData = {
      ...formData,
      // Include date ranges in the submission
      invoice_start_date: dateRanges.invoiceStartDate,
      invoice_end_date: dateRanges.invoiceEndDate,
      previous_delivered_start_date: dateRanges.previousDeliveredStartDate,
      previous_delivered_end_date: dateRanges.previousDeliveredEndDate,
      credit_note_start_date: dateRanges.creditNoteStartDate,
      credit_note_end_date: dateRanges.creditNoteEndDate,

      // Ensure rental duration fields are included
      rental_duration: formData.rental_duration || "0",
      rental_duration_days: formData.rental_duration_days || 0,
      rental_duration_months: formData.rental_duration
        ? parseInt(formData.rental_duration)
        : 0,
      payment_mode: formData.payment_type || "Postpaid",

      // Make sure items have the correct rental duration information
      items: formData.items.map((item) => ({
        ...item,
        new_device_ids: newDeviceIds[item.product_id] || [], // Changed from productId to item.product_id
        returned_device_ids: returnedDeviceIds[item.product_id] || [], // Changed from productId to item.product_id
        rental_duration: formData.rental_duration || "0",
        rental_duration_days: formData.rental_duration_days || 0,
        rental_duration_months: formData.rental_duration
          ? parseInt(formData.rental_duration)
          : 0,
      })),
    };

    const response = await fetch(`${API_URL}/invoices/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create invoice");
    }

    const result = await response.json();
    setSnackbar({
      open: true,
      message: "Invoice created successfully!",
      severity: "success",
    });

    // Optionally reset the form or redirect
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
      maximumFractionDigits: 2,
    }).format(number || 0);

  // Add this component to your form where you want the date selection
  const DateRangeSelector = ({
    selectedMonth,
    setSelectedMonth,
    dateRanges,
    setDateRanges,
  }) => {
    return (
      <Box sx={{ width: "100%", mb: 10 }}>
        <Box sx={monthButtonContainerStyle}>
          <button
            type="button"
            onClick={() => setSelectedMonth("previous")}
            style={monthButtonStyle(selectedMonth === "previous")}
          >
            Previous Month
          </button>
          <button
            type="button"
            onClick={() => setSelectedMonth("current")}
            style={monthButtonStyle(selectedMonth === "current")}
          >
            Current Month
          </button>
          <button
            type="button"
            onClick={() => setSelectedMonth("next")}
            style={monthButtonStyle(selectedMonth === "next")}
          >
            Next Month
          </button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            width: "100%",
          }}
        >
          <Field
            label="Invoice Start Date"
            name="invoiceStartDate"
            value={dateRanges.invoiceStartDate}
            onChange={(e) =>
              setDateRanges({ ...dateRanges, invoiceStartDate: e.target.value })
            }
            type="text"
          />
          <Field
            label="Invoice End Date"
            name="invoiceEndDate"
            value={dateRanges.invoiceEndDate}
            onChange={(e) =>
              setDateRanges({ ...dateRanges, invoiceEndDate: e.target.value })
            }
            type="text"
          />
          <Field
            label="Previous Delivered Start Date"
            name="previousDeliveredStartDate"
            value={dateRanges.previousDeliveredStartDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                previousDeliveredStartDate: e.target.value,
              })
            }
            type="text"
          />
          <Field
            label="Previous Delivered End Date"
            name="previousDeliveredEndDate"
            value={dateRanges.previousDeliveredEndDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                previousDeliveredEndDate: e.target.value,
              })
            }
            type="text"
          />
          <Field
            label="Credit Note Start Date"
            name="creditNoteStartDate"
            value={dateRanges.creditNoteStartDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                creditNoteStartDate: e.target.value,
              })
            }
            type="text"
          />
          <Field
            label="Credit Note End Date"
            name="creditNoteEndDate"
            value={dateRanges.creditNoteEndDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                creditNoteEndDate: e.target.value,
              })
            }
            type="text"
          />
        </Box>
      </Box>
    );
  };

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

              {/* Date Range Selector - spans full width */}
              <div
                style={{
                  gridColumn: "1 / -1", // Makes it span all columns
                  margin: "1rem 0",
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <DateRangeSelector
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  dateRanges={dateRanges}
                  setDateRanges={setDateRanges}
                />
              </div>

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
                value={formData.payment_type}
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
                          New Quantity
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          New Device IDs
                        </TableCell>

                        <TableCell sx={{ color: "#fff" }}>
                          Return Quantity
                        </TableCell>

                        <TableCell sx={{ color: "#fff" }}>
                          Returned Device IDs
                        </TableCell>

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
                              .filter(Boolean)
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
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => decrementNewQty(product.id)}
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
                                    ? newQuantities[product.id] || ""
                                    : ""
                                }
                                onChange={(e) =>
                                  handleNewQtyChange(product.id, e.target.value)
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
                                onClick={() => incrementNewQty(product.id)}
                                disabled={
                                  !selectedProductIds.includes(product.id)
                                }
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          {/* New Device IDs */}
                          <TableCell>
                            {newQuantities[product.id] > 0 && (
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                {(newDeviceIds[product.id] || []).map(
                                  (id, idx) => (
                                    <TextField
                                      key={idx}
                                      size="small"
                                      placeholder={`New Device ID ${idx + 1}`}
                                      value={id}
                                      onChange={(e) => {
                                        const updated = [
                                          ...(newDeviceIds[product.id] || []),
                                        ];
                                        updated[idx] = e.target.value;
                                        setNewDeviceIds((prev) => ({
                                          ...prev,
                                          [product.id]: updated,
                                        }));
                                      }}
                                    />
                                  )
                                )}
                                {(newDeviceIds[product.id]?.length || 0) <
                                  (newQuantities[product.id] || 0) && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                      setNewDeviceIds((prev) => ({
                                        ...prev,
                                        [product.id]: [
                                          ...(prev[product.id] || []),
                                          "",
                                        ],
                                      }))
                                    }
                                  >
                                    + Add New ID
                                  </Button>
                                )}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => decrementReturnQty(product.id)}
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
                                    ? returnQuantities[product.id] || ""
                                    : ""
                                }
                                onChange={(e) =>
                                  handleReturnQtyChange(
                                    product.id,
                                    e.target.value
                                  )
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
                                onClick={() => incrementReturnQty(product.id)}
                                disabled={
                                  !selectedProductIds.includes(product.id)
                                }
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {returnQuantities[product.id] > 0 && (
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                {(returnedDeviceIds[product.id] || []).map(
                                  (id, idx) => (
                                    <TextField
                                      key={idx}
                                      size="small"
                                      placeholder={`Returned Device ID ${
                                        idx + 1
                                      }`}
                                      value={id}
                                      onChange={(e) => {
                                        const updated = [
                                          ...(returnedDeviceIds[product.id] ||
                                            []),
                                        ];
                                        updated[idx] = e.target.value;
                                        setReturnedDeviceIds((prev) => ({
                                          ...prev,
                                          [product.id]: updated,
                                        }));
                                      }}
                                    />
                                  )
                                )}
                                {(returnedDeviceIds[product.id]?.length || 0) <
                                  (returnQuantities[product.id] || 0) && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                      setReturnedDeviceIds((prev) => ({
                                        ...prev,
                                        [product.id]: [
                                          ...(prev[product.id] || []),
                                          "",
                                        ],
                                      }))
                                    }
                                  >
                                    + Add Returned ID
                                  </Button>
                                )}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>{product.purchase_price}</TableCell>
                          <TableCell>
                            {formData.transaction_type === "Rent" ? (
                              <>
                                {/* <div>Day: {product.rent_price_per_day}</div> */}
                                <div>Month: {product.rent_price_per_month}</div>
                                {/* <div>6 Months: {product.rent_price_6_months}</div>
                                <div>1 Year: {product.rent_price_1_year}</div> */}
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
        {/* <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💰</div>
            <h3 style={cardHeaderStyle}>Invoice Totals</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Subtotal" name="amount" value={formatINR(formData.amount)} readOnly />
            <Field label="CGST (9%)" name="cgst" value={formatINR(formData.cgst)} readOnly />
            <Field label="SGST (9%)" name="sgst" value={formatINR(formData.sgst)} readOnly />
            <Field label="Total Tax" name="total_tax" value={formatINR(formData.total_tax)} readOnly />
            <Field label="Total Amount" name="total_amount" value={formatINR(formData.total_amount)} readOnly />
          </div>
        </div> */}

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

// Field component
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

// Add these styles to your existing styles
const monthButtonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginBottom: "1rem",
  width: "100%",
};

const monthButtonStyle = (isSelected) => ({
  padding: "0.5rem 1rem",
  backgroundColor: isSelected ? "#2563eb" : "#f3f4f6",
  color: isSelected ? "white" : "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: isSelected ? "#1d4ed8" : "#e5e7eb",
  },
});

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
