import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const API_URL = "http://localhost:5000/api";

const SalesOrdersEditLayoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(id, "kkkkkkkkkkkkkkkkk");

  // State for form data
  const [formData, setFormData] = useState({
    order_id: "",
    order_title: "",
    quotation_id: "",
    transaction_type: "",
    payment_type: "",
    order_status: "Pending",
    source_of_entry: "",
    owner: "",
    remarks: "",
    order_generated_by: "User A",
    rental_duration: null,
    rental_start_date: null,
    rental_end_date: null,
    order_date: new Date().toISOString().split("T")[0],
    contact_status: "Contacted",
    personalDetails: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
    address: {
      street: "",
      landmark: "",
      pincode: "",
      city: "",
      state: "",
      country: "India",
    },
    items: [],
  });

  // State for data fetching
  const [quotations, setQuotations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    order: true,
    quotations: true,
    products: true,
  });
  const [error, setError] = useState({
    order: null,
    quotations: null,
    products: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // UI state
  const [showProductTable, setShowProductTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }
        const data = await response.json();

        // Set form data with fetched order
        setFormData({
          ...data,
          personalDetails: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            gst_number: "",
            ...data.personalDetails, // ✅ This must match API key exactly
          },
          address: {
            billing_address: "",
            shipping_address: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            ...data.address,
          },
          items: data.items || [],
        });

        // Set selected products and quantities
        const productIds = data.items.map((item) => item.product_id);
        setSelectedProductIds(productIds);

        const productQuantities = {};
        data.items.forEach((item) => {
          productQuantities[item.product_id] = item.requested_quantity;
        });
        setQuantities(productQuantities);

        setLoading((prev) => ({ ...prev, order: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, order: err.message }));
        setLoading((prev) => ({ ...prev, order: false }));
        setSnackbar({
          open: true,
          message: "Failed to load order data",
          severity: "error",
        });
      }
    };

    fetchOrderData();
  }, [id]);

  // Fetch approved quotations
  useEffect(() => {
    const fetchApprovedQuotations = async () => {
      try {
        const response = await fetch(`${API_URL}/quotations/approved`);
        if (!response.ok) {
          throw new Error("Failed to fetch approved quotations");
        }
        const data = await response.json();
        setQuotations(data);
        setLoading((prev) => ({ ...prev, quotations: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, quotations: err.message }));
        setLoading((prev) => ({ ...prev, quotations: false }));
        setSnackbar({
          open: true,
          message: "Failed to load approved quotations",
          severity: "error",
        });
      }
    };

    fetchApprovedQuotations();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product-templete`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setLoading((prev) => ({ ...prev, products: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, products: err.message }));
        setLoading((prev) => ({ ...prev, products: false }));
        setSnackbar({
          open: true,
          message: "Failed to load products",
          severity: "error",
        });
      }
    };

    fetchProducts();
  }, []);

  // Handle quotation selection
  const handleQuotationSelect = async (quotationId) => {
    if (!quotationId) return;

    try {
      // Fetch the selected quotation details
      const quotationResponse = await fetch(
        `${API_URL}/quotations/${quotationId}`
      );
      if (!quotationResponse.ok) {
        throw new Error("Failed to fetch quotation details");
      }
      const quotationData = await quotationResponse.json();

      // Update form data with quotation information
      setFormData((prev) => ({
        ...prev,
        quotation_id: quotationId,
        transaction_type: quotationData.transaction_type || "",
        payment_type: quotationData.payment_type || "",
        rental_duration: quotationData.rental_duration || "",
        rental_start_date: quotationData.rental_start_date || "",
        rental_end_date: quotationData.rental_end_date || "",
        order_title: `Order for Quotation ${quotationData.quotation_id}`,
        owner: quotationData.owner || "",
        remarks: quotationData.remarks || "",
        personalDetails: {
          ...prev.personalDetails,
          first_name: quotationData.personalDetails?.first_name || "",
          last_name: quotationData.personalDetails?.last_name || "",
          email: quotationData.personalDetails?.email || "",
          phone_number: quotationData.personalDetails?.phone_number || "",
        },
        address: {
          ...prev.address,
          street: quotationData.address?.street || "",
          landmark: quotationData.address?.landmark || "",
          pincode: quotationData.address?.pincode || "",
          city: quotationData.address?.city || "",
          state: quotationData.address?.state || "",
          country: quotationData.address?.country || "India",
        },
        items:
          quotationData.items?.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            requested_quantity: item.requested_quantity,
          })) || [],
      }));

      // Set quantities for selected products
      const newQuantities = {};
      quotationData.items?.forEach((item) => {
        newQuantities[item.product_id] = item.requested_quantity;
      });
      setQuantities(newQuantities);
      setSelectedProductIds(
        quotationData.items?.map((item) => item.product_id) || []
      );
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load quotation details",
        severity: "error",
      });
    }
  };

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      const pincode = formData.address.pincode;

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
              address: {
                ...prev.address,
                country: "India", // Default to India as the API only works for Indian pincodes
                state: postOffice.State,
                city: postOffice.District,
                // Optionally update addresses if they're empty
                billing_address:
                  prev.address.billing_address ||
                  `${postOffice.Name}, ${postOffice.District}`,
                shipping_address:
                  prev.address.shipping_address ||
                  `${postOffice.Name}, ${postOffice.District}`,
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
  }, [formData.address.pincode]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quotation_id") {
      handleQuotationSelect(value);
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle product selection changes
  const handleProductSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    // If adding a new product, initialize its quantity to 1 if not already set
    if (!selectedProductIds.includes(productId) && !quantities[productId]) {
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
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

  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare items array from selected products and quantities
    const orderItems = selectedProductIds.map((productId) => {
      const product = products.find((p) => p.id === productId);
      return {
        product_id: productId,
        product_name: product.name,
        requested_quantity: quantities[productId] || 1,
      };
    });

    const payload = {
      ...formData,
      items: orderItems,
    };

    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: "Order updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/orders");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update order",
        severity: "error",
      });
    }
  };

  if (loading.order) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Typography variant="h6">Loading order data...</Typography>
        </div>
      </div>
    );
  }

  if (error.order) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Typography variant="h6" color="error">
            Error loading order: {error.order}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem" }}
          >
            Retry
          </Button>
        </div>
      </div>
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

      <div style={headerStyle}>
        <h1 style={titleStyle}>Edit Order #{formData.order_id}</h1>
        <p style={subtitleStyle}>
          Update the details below to modify this order
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Order Information Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🧾</div>
              <h3 style={cardHeaderStyle}>Order Information</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Order ID"
                placeholder="Enter Order ID"
                value={formData.order_id}
                onChange={(e) =>
                  handleChange({
                    target: { name: "order_id", value: e.target.value },
                  })
                }
              />
              <Field
                label="Order Title"
                placeholder="Enter Order Title"
                value={formData.order_title}
                onChange={(e) =>
                  handleChange({
                    target: { name: "order_title", value: e.target.value },
                  })
                }
              />
              <Field
                label="Quotation Details"
                type="select"
                placeholder="Select Quotation"
                value={formData.quotation_id}
                onChange={(e) =>
                  handleChange({
                    target: { name: "quotation_id", value: e.target.value },
                  })
                }
                options={quotations.map((q) => ({
                  value: q.id,
                  label: `${q.quotation_id} - ${q.quotation_title}`,
                }))}
              />
              <Field
                label="Quotation ID"
                placeholder="Quotation ID"
                value={
                  quotations.find(
                    (q) => q.id === parseInt(formData.quotation_id)
                  )?.quotation_id || ""
                }
                readOnly
              />
              <Field
                label="Transaction Type"
                type="select"
                placeholder="Select Type"
                value={formData.transaction_type}
                onChange={(e) =>
                  handleChange({
                    target: { name: "transaction_type", value: e.target.value },
                  })
                }
                options={["Rent", "Sale"]}
              />
              <Field
                label="Payment Type"
                type="select"
                placeholder="Select Type"
                value={formData.payment_type}
                onChange={(e) =>
                  handleChange({
                    target: { name: "payment_type", value: e.target.value },
                  })
                }
                options={["Prepaid", "Postpaid"]}
              />
              <Field
                label="Order Status"
                type="select"
                placeholder="Select Status"
                value={formData.order_status}
                onChange={(e) =>
                  handleChange({
                    target: { name: "order_status", value: e.target.value },
                  })
                }
                options={[
                  "Pending",
                  "Approved",
                  "Rejected",
                  "Completed",
                  "Cancelled",
                ]}
              />
              <Field
                label="Source of Entry"
                type="select"
                placeholder="Select Source"
                value={formData.source_of_entry}
                onChange={(e) =>
                  handleChange({
                    target: { name: "source_of_entry", value: e.target.value },
                  })
                }
                options={["Online", "Offline", "Referral"]}
              />
              <Field
                label="Owner"
                placeholder="Enter Owner Name"
                value={formData.owner}
                onChange={(e) =>
                  handleChange({
                    target: { name: "owner", value: e.target.value },
                  })
                }
              />
              <Field
                label="Remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(e) =>
                  handleChange({
                    target: { name: "remarks", value: e.target.value },
                  })
                }
              />
              <Field
                label="Order Generated By"
                placeholder="Generated By"
                value={formData.order_generated_by}
                readOnly
              />
              <Field
                label="Rental Duration (months)"
                placeholder="Enter Duration"
                type="number"
                value={formData.rental_duration || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "rental_duration", value: e.target.value },
                  })
                }
              />
              <Field
                label="Rental Start Date"
                type="date"
                placeholder="Select Date"
                value={formData.rental_start_date || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "rental_start_date",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Rental End Date"
                type="date"
                placeholder="Select Date"
                value={formData.rental_end_date || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "rental_end_date", value: e.target.value },
                  })
                }
              />
              <Field
                label="Order Date"
                type="date"
                placeholder="Select Date"
                value={formData.order_date}
                onChange={(e) =>
                  handleChange({
                    target: { name: "order_date", value: e.target.value },
                  })
                }
              />
              <Field
                label="Contact Status"
                type="select"
                placeholder="Select Status"
                value={formData.contact_status}
                onChange={(e) =>
                  handleChange({
                    target: { name: "contact_status", value: e.target.value },
                  })
                }
                options={["Contacted", "Not Contacted", "Follow Up"]}
              />
            </div>
          </div>

          {/* Personal Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>👤</div>
              <h3 style={cardHeaderStyle}>Personal Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="First Name"
                placeholder="Enter First Name"
                value={formData.personalDetails?.first_name || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personalDetails.first_name",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Last Name"
                placeholder="Enter Last Name"
                value={formData.personalDetails?.last_name || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personalDetails.last_name",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Contact Number"
                placeholder="Enter Contact Number"
                value={formData.personalDetails.phone_number}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personalDetails.phone_number",
                      value: e.target.value,
                    },
                  })
                }
              />

              <Field
                label="Email ID"
                placeholder="Enter Email"
                type="email"
                value={formData.personalDetails.email}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personalDetails.email",
                      value: e.target.value,
                    },
                  })
                }
              />

              <Field
                label="GST Number"
                placeholder="Enter GST Number"
                value={formData.personalDetails.gst_number}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personalDetails.gst_number",
                      value: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Address Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏠</div>
              <h3 style={cardHeaderStyle}>Address</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Billing Address"
                placeholder="Enter Billing Address"
                type="textarea"
                value={formData.address.billing_address}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "address.billing_address",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Shipping Address"
                placeholder="Enter Shipping Address"
                type="textarea"
                value={formData.address.shipping_address}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "address.shipping_address",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Pincode"
                placeholder="Enter Pincode"
                type="number"
                value={formData.address.pincode}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address.pincode", value: e.target.value },
                  })
                }
              />
              <Field
                label="City"
                placeholder="Enter City"
                value={formData.address.city}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address.city", value: e.target.value },
                  })
                }
              />
              <Field
                label="State"
                placeholder="Enter State"
                value={formData.address.state}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address.state", value: e.target.value },
                  })
                }
              />
              <Field
                label="Country"
                placeholder="Enter Country"
                value={formData.address.country}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address.country", value: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Select Products Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Order Items</h3>
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
                          <Checkbox sx={{ color: "#fff" }} />
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
                        <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() => {
                                setSelectedProductIds((prev) =>
                                  prev.includes(product.id)
                                    ? prev.filter((id) => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }}
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
                                inputProps={{
                                  min: 0,
                                  style: { width: 50, textAlign: "center" },
                                  disabled: !selectedProductIds.includes(
                                    product.id
                                  ),
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Current Order Items */}
            {/* <Box mt={3}>
              <Typography variant="h6" gutterBottom>Current Order Items</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                      <TableCell sx={{ color: '#fff' }}>Product ID</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Product Name</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.requested_quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={cancelBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onClick={() => navigate("/dashboard/crm/orders")}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={updateBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  type = "text",
  options = [],
  value,
  onChange,
  readOnly = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
          value={value}
          onChange={onChange}
          disabled={readOnly}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, idx) =>
            typeof option === "object" ? (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ) : (
              <option key={idx} value={option}>
                {option}
              </option>
            )
          )}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        rows={3}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ) : type === "date" ? (
      <input
        type="date"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    )}
  </div>
);

// Styles (same as in SalesOrdersAddLayoutPage)
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
  fontSize: "2rem",
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

const textareaStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "2rem",
  maxWidth: "1200px",
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

const updateBtnStyle = {
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

export default SalesOrdersEditLayoutPage;
