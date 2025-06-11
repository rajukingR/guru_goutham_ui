import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/Api_url";

const generateDcId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DC-${randomPart}`;
};


const DeliveryChallanAddPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dc_id: "",
    dc_title: "",
    is_dc: false,
    order_id: "",
    customer_code: "",
    order_number: "",
    dc_date: new Date().toISOString().split("T")[0],
    dc_status: "Dispatched",
    dealer_reference: "",
    email: "",
    gst_number: "",
    pan_number: "",
    remarks: "",
    type: "Sale",
    regular_dc: true,
    industry: "",
    shipping_ordered_by: "",
    shipping_phone_number: "",
    shipping_name: "",
    street: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    vehicle_number: "",
    delivery_person_name: "",
    delivery_person_phone_number: "",
    receiver_name: "",
    receiver_phone_number: "",
    items: [],
  });

  // State for UI and data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  useEffect(() => {
  setFormData(prev => ({
    ...prev,
    dc_id: generateDcId()
  }));
}, []);


  // Fetch orders and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved orders
        const orderResponse = await fetch(`${API_URL}/orders/order-approved`);
        if (!orderResponse.ok) throw new Error("Failed to fetch orders");
        const orderData = await orderResponse.json();
        setOrders(orderData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`);
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();
        setProducts(prodData);
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

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    const selectedOrder = orders.find(
      (order) => order.id === parseInt(orderId)
    );
    if (!selectedOrder) return;

    const { personalDetails, address, items } = selectedOrder;

    setFormData({
      ...formData,
      order_id: selectedOrder.id,
      customer_code: selectedOrder.order_id, // Using order_id as customer code
      order_number: selectedOrder.order_id,
      email: personalDetails.email,
      gst_number: personalDetails.gst_number,
      shipping_ordered_by: `${personalDetails.first_name} ${personalDetails.last_name}`,
      shipping_phone_number: personalDetails.phone_number,
      shipping_name: `${personalDetails.first_name} ${personalDetails.last_name}`,
      street: address.street || "",
      landmark: address.landmark || "",
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      country: address.country,
      type: selectedOrder.transaction_type,
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.requested_quantity,
        item_total_value: item.item_total_value,
      })),
    });

    // Auto-select products from the order
    const productIds = items.map((item) => item.product_id);
    setSelectedProductIds(productIds);

    // Set quantities
    const newQuantities = {};
    items.forEach((item) => {
      newQuantities[item.product_id] = item.requested_quantity;
    });
    setQuantities(newQuantities);
  };

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      const pincode = formData.pincode;

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
              city: postOffice.District,
              state: postOffice.State,
              country: "India",
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
  }, [formData.pincode]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare items data
      const items = selectedProductIds.map((productId) => {
        const product = products.find((p) => p.id === productId);
        const quantity = quantities[productId] || 1;

        let total_price = 0;
        if (formData.type === "Rent") {
         
          const rentalDuration =
            formData.items.find((item) => item.product_id === productId)
              ?.rental_duration || 1;

          if (rentalDuration === 12) {
            total_price = product.rent_price_1_year * quantity;
          } else if (rentalDuration === 6) {
            total_price = product.rent_price_6_months * quantity;
          } else {
            total_price = product.rent_price_per_month * quantity;
          }
        } else {
          // For Sale transactions
          total_price = product.purchase_price * quantity;
        }

        return {
          product_id: productId,
          product_name: product.product_name,
          quantity: quantity,
          total_price: total_price,
        };
      });

      const payload = {
        ...formData,
        items,
      };

      const response = await fetch(`${API_URL}/invoices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create delivery challan");

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Invoices created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations/invoices");
      }, 1500);

    } catch (error) {
      console.error("Error creating delivery challan:", error);
      setSnackbar({
        open: true,
        message: "Error creating delivery challan: " + error.message,
        severity: "error",
      });
    }
  };

  // Field component
  const Field = ({
    label,
    name,
    placeholder,
    type = "text",
    options = [],
    required = false,
    readOnly = false,
    value,
    onChange,
    ...props
  }) => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>
      {type === "select" ? (
        <div style={selectWrapperStyle}>
          <select
            style={selectStyle}
            name={name}
            value={value}
            onChange={onChange}
            disabled={readOnly}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={selectArrowStyle}>▼</div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          style={textareaStyle}
          rows={3}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          {...props}
        />
      ) : type === "date" ? (
        <input
          type="date"
          name={name}
          placeholder={placeholder}
          style={inputStyle}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          {...props}
        />
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={onChange}
          style={checkboxStyle}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            backgroundColor: readOnly ? "#f3f4f6" : "#ffffff",
          }}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  );

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
        <h1 style={titleStyle}>Create Delivery Challan</h1>
        <p style={subtitleStyle}>
          Fill in the details below to create a new delivery challan
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Delivery Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📦</div>
              <h3 style={cardHeaderStyle}>Delivery Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="DC ID"
                name="dc_id"
                placeholder="Enter DC ID"
                value={formData.dc_id}
                onChange={handleInputChange}
              />
              <Field
                label="DC Title"
                name="dc_title"
                placeholder="Enter DC Title"
                value={formData.dc_title}
                onChange={handleInputChange}
              />
              {/* <div style={checkboxContainerStyle}>
                <label style={checkboxLabelStyle}>
                  <Field
                    type="checkbox"
                    name="is_dc"
                    checked={formData.is_dc}
                    onChange={handleInputChange}
                  />
                  <div style={checkboxCustomStyle}>
                    {formData.is_dc && <span style={checkmarkStyle}>✓</span>}
                  </div>
                  <div>
                    <span style={checkboxTextStyle}>Is DC</span>
                    <span style={checkboxDescStyle}>
                      Check if this is a delivery challan
                    </span>
                  </div>
                </label>
              </div> */}
              <Field
                label="Order Details"
                name="order_id"
                type="select"
                placeholder="Select Order"
                value={formData.order_id}
                onChange={(e) => handleOrderSelect(e.target.value)}
                options={orders.map((order) => ({
                  value: order.id,
                  label: `${order.order_id} - ${order.order_title}`,
                }))}
              />
              <Field
                label="Customer Code"
                name="customer_code"
                placeholder="Enter Customer Code"
                value={formData.customer_code}
                onChange={handleInputChange}
              />
              <Field
                label="Order Number"
                name="order_number"
                placeholder="Enter Order Number"
                value={formData.order_number}
                onChange={handleInputChange}
                required
              />
              <Field
                label="DC Status"
                name="dc_status"
                type="select"
                placeholder="Select Status"
                value={formData.dc_status}
                onChange={handleInputChange}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Dispatched", label: "Dispatched" },
                  { value: "Delivered", label: "Delivered" },
                ]}
                required
              />
              <Field
                label="DC Date"
                name="dc_date"
                type="date"
                value={formData.dc_date}
                onChange={handleInputChange}
              />
              <Field
                label="Other Reference"
                name="dealer_reference"
                placeholder="Enter Reference"
                value={formData.dealer_reference}
                onChange={handleInputChange}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Field
                label="GST Number"
                name="gst_number"
                placeholder="Enter GST Number"
                value={formData.gst_number}
                onChange={handleInputChange}
                required
              />
              <Field
                label="PAN"
                name="pan_number"
                placeholder="Enter PAN"
                value={formData.pan_number}
                onChange={handleInputChange}
                required
              />
              <Field
                label="Remarks"
                name="remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={handleInputChange}
              />
              <div style={fileUploadContainer}>
                <label style={fileUploadLabel}>
                  <input type="file" style={{ display: "none" }} />
                  <span style={fileUploadButton}>Choose File</span>
                </label>
              </div>
              <Field
                label="DC Type"
                name="regular_dc"
                type="checkbox"
                checked={formData.regular_dc}
                onChange={handleInputChange}
              />
              <Field
                label="Transaction Type"
                name="type"
                type="select"
                placeholder="Select Type"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: "Rent", label: "Rent" },
                  { value: "Sale", label: "Sale" },
                  { value: "Lease", label: "Lease" },
                ]}
              />
              <Field
                label="Industry"
                name="industry"
                placeholder="Enter Industry"
                value={formData.industry}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Shipping Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🚚</div>
              <h3 style={cardHeaderStyle}>Shipping Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Order Placed by"
                name="shipping_ordered_by"
                placeholder="Enter name"
                value={formData.shipping_ordered_by}
                onChange={handleInputChange}
              />
              <Field
                label="Phone Number"
                name="shipping_phone_number"
                placeholder="Enter Phone Number"
                type="tel"
                value={formData.shipping_phone_number}
                onChange={handleInputChange}
              />
              <Field
                label="Shipping Name"
                name="shipping_name"
                placeholder="Enter Shipping Name"
                value={formData.shipping_name}
                onChange={handleInputChange}
              />
              <Field
                label="Street"
                name="street"
                placeholder="Enter Street"
                value={formData.street}
                onChange={handleInputChange}
              />
              <Field
                label="Landmark"
                name="landmark"
                placeholder="Enter Landmark"
                value={formData.landmark}
                onChange={handleInputChange}
              />
              <Field
                label="Pincode"
                name="pincode"
                placeholder="Enter Pincode"
                type="number"
                value={formData.pincode}
                onChange={handleInputChange}
              />
              <Field
                label="City"
                name="city"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleInputChange}
                readOnly
              />
              <Field
                label="State"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleInputChange}
                readOnly
              />
              <Field
                label="Country"
                name="country"
                placeholder="Enter Country"
                value={formData.country}
                onChange={handleInputChange}
                readOnly
              />
            </div>
          </div>

          {/* Other Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📝</div>
              <h3 style={cardHeaderStyle}>Other Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Vehicle Number"
                name="vehicle_number"
                placeholder="Enter Vehicle Number"
                value={formData.vehicle_number}
                onChange={handleInputChange}
                required
              />
              <Field
                label="Delivery Person Name"
                name="delivery_person_name"
                placeholder="Enter Name"
                value={formData.delivery_person_name}
                onChange={handleInputChange}
              />
              <Field
                label="Delivery Person Phone"
                name="delivery_person_phone_number"
                placeholder="Enter Phone"
                type="tel"
                value={formData.delivery_person_phone_number}
                onChange={handleInputChange}
              />
              <Field
                label="Receiver Name"
                name="receiver_name"
                placeholder="Enter Name"
                value={formData.receiver_name}
                onChange={handleInputChange}
              />
              <Field
                label="Receiver Phone Number"
                name="receiver_phone_number"
                placeholder="Enter Phone"
                type="tel"
                value={formData.receiver_phone_number}
                onChange={handleInputChange}
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
                        <TableCell sx={{ color: "#fff" }}>Model</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Processor</TableCell>
                        <TableCell sx={{ color: "#fff" }}>RAM</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Storage</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Graphics</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Price</TableCell>
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
                            {formData.type === "Rent" ? (
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
                          </TableCell>{" "}
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
            type="button"
            style={cancelBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          >
            Cancel
          </button>
          <Box mt={4}>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Create Delivery Challan
            </button>
          </Box>
        </div>
      </form>
    </div>
  );
};

// Styles (same as in your original code)
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

const checkboxContainerStyle = {
  marginTop: "0.5rem",
  gridColumn: "1 / -1",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "flex-start",
  cursor: "pointer",
  gap: "0.75rem",
};

const checkboxStyle = {
  display: "none",
};

const checkboxCustomStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  border: "2px solid #d1d5db",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  flexShrink: 0,
  marginTop: "2px",
};

const checkmarkStyle = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
};

const checkboxTextStyle = {
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  display: "block",
};

const checkboxDescStyle = {
  fontSize: "0.75rem",
  color: "#6b7280",
  display: "block",
  marginTop: "0.25rem",
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

const selectProductBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#ffffff",
  color: "#2563eb",
  border: "1px solid #2563eb",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
  transition: "all 0.2s ease",
  outline: "none",
  width: "100%",
};

const fileUploadContainer = {
  gridColumn: "1 / -1",
};

const fileUploadLabel = {
  display: "block",
  cursor: "pointer",
};

const fileUploadButton = {
  display: "inline-block",
  padding: "0.75rem 1.5rem",
  backgroundColor: "#ffffff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.875rem",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

export default DeliveryChallanAddPage;
