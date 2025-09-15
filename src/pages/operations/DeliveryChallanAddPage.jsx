import React, { useState, useEffect, useCallback, memo } from "react";
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
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/Api_url";
import { useInventory } from "../../contexts/InventoryContext";
import { useSelector } from "react-redux";
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

const checkboxGroupStyle = {
  display: "flex",
  gap: "1rem",
  marginTop: "0.5rem",
};

// Field component
const Field = memo(
  ({
    label,
    name,
    placeholder,
    type = "text",
    options = [],
    required = false,
    readOnly = false,
    value,
    onChange,
    error,
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
            style={{
              ...selectStyle,
              borderColor: error ? "#ef4444" : "#d1d5db",
            }}
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
          style={{
            ...textareaStyle,
            borderColor: error ? "#ef4444" : "#d1d5db",
          }}
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
          style={{
            ...inputStyle,
            borderColor: error ? "#ef4444" : "#d1d5db",
          }}
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
            borderColor: error ? "#ef4444" : "#d1d5db",
          }}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
      {error && (
        <Typography
          variant="caption"
          color="error"
          style={{ marginTop: "4px" }}
        >
          {error}
        </Typography>
      )}
    </div>
  )
);

const generateDcId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DC-${randomPart}`;
};

const DeliveryChallanAddPage = ({ product }) => {
  const navigate = useNavigate();
  const { inventoryData } = useInventory();
  const [assetSearchTerms, setAssetSearchTerms] = useState({});
  const [errors, setErrors] = useState({});

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const getAvailableQty = (productId) => {
    const entry = inventoryData.find((item) => item.id === productId);
    return entry ? entry.available_quantity : "N/A";
  };

  const [formData, setFormData] = useState({
    dc_id: "",
    dc_title: "",
    is_dc: false,
    order_id: "",
    customer_code: "",
    order_number: "",
    dispatch_order_number: "",
    payment_type: "",
    dc_date: new Date().toISOString().split("T")[0],
    dc_status: "",
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
    peripheral_update: false,
    defualt_dc: false,
    mouse: false,
    cable: false,
    bag: false,
    others: false,
  });

  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [availableAssetIds, setAvailableAssetIds] = useState({});
  const [deviceIds, setDeviceIds] = useState({});
  const [deviceIdErrors, setDeviceIdErrors] = useState({});
  // Add a new state for the "Other" accessories input
  const [showOtherAccessory, setShowOtherAccessory] = useState(false);
  const [otherAccessory, setOtherAccessory] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dc_id: generateDcId(),
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dispatchOrderResponse = await fetch(
          `${API_URL}/dispatch-orders/approved`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (!dispatchOrderResponse.ok)
          throw new Error("Failed to fetch dispatch orders");
        const dispatchOrderData = await dispatchOrderResponse.json();
        setDispatchOrders(dispatchOrderData);

        const prodResponse = await fetch(`${API_URL}/product-templete`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.order_id) {
      newErrors.order_id = "Dispatch Order is required";
    }
    if (!formData.dc_status) {
      newErrors.dc_status = "DC Status is required";
    }

    if (!formData.delivery_person_name) {
      newErrors.delivery_person_name = "Delivery Person Name is required";
    }
    if (!formData.delivery_person_phone_number) {
      newErrors.delivery_person_phone_number =
        "Delivery Person Phone is required";
    }

    if (!formData.receiver_name) {
      newErrors.receiver_name = "Receiver Name is required";
    }
    if (!formData.receiver_phone_number) {
      newErrors.receiver_phone_number = "Receiver Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSelect = (orderId) => {
    const selectedOrder = dispatchOrders.find(
      (order) => order.id === parseInt(orderId)
    );
    if (!selectedOrder) return;

    const { contact, items } = selectedOrder;

    const newDeviceIds = {};
    items.forEach((item) => {
      newDeviceIds[item.product_id] = item.device_ids || [];
    });
    setDeviceIds(newDeviceIds);

    setFormData({
      ...formData,
      order_id: selectedOrder.id,
      customer_code: selectedOrder.customer_code,
      order_number: selectedOrder.order_number,
      dispatch_order_number: selectedOrder.dispatch_order_id,
      payment_type: selectedOrder.payment_type,
      email: selectedOrder.email,
      gst_number: selectedOrder.gst_number,
      shipping_ordered_by: selectedOrder.shipping_ordered_by,
      shipping_phone_number: selectedOrder.shipping_phone_number,
      shipping_name: selectedOrder.shipping_name,
      street: selectedOrder.street || "",
      landmark: selectedOrder.landmark || "",
      pincode: selectedOrder.pincode,
      city: selectedOrder.city,
      state: selectedOrder.state,
      country: selectedOrder.country || "India",
      type: selectedOrder.type,
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        item_total_value: item.total_price,
        purchase_price: item.purchase_price || 0,
        offer_purchase_price: item.offer_purchase_price || 0,
        rent_price_per_month: item.rent_price_per_month || 0,
        offer_rent_price_per_month: item.offer_rent_price_per_month || 0,
        device_ids: item.device_ids || [],
      })),
    });

    const productIds = items.map((item) => item.product_id);
    setSelectedProductIds(productIds);

    const newQuantities = {};
    items.forEach((item) => {
      newQuantities[item.product_id] = item.quantity;
    });
    setQuantities(newQuantities);
  };

  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      const pincode = formData.pincode;

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

    const debounceTimer = setTimeout(() => {
      fetchLocationFromPincode();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formData.pincode]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Update the handleChange function to handle the "others" checkbox
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (name === "others") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      // Show/hide the other accessory input based on checkbox state
      setShowOtherAccessory(checked);
      if (!checked) {
        setOtherAccessory(""); // Clear the other accessory field when unchecked
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }, []);

  const handleProductSelection = useCallback((productId) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    setQuantities((prev) => {
      if (!prev[productId]) {
        return { ...prev, [productId]: 1 };
      }
      return prev;
    });
  }, []);

  const handleQtyChange = useCallback((productId, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  }, []);

  const incrementQty = useCallback((productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  }, []);

  const decrementQty = useCallback((productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const items = selectedProductIds.map((productId) => {
        const product = products.find((p) => p.id === productId);
        const orderItem = formData.items.find(
          (item) => item.product_id === productId
        );

        const quantity = quantities[productId] || 1;
        const selectedDeviceIds = deviceIds[productId] || [];
        

        const unit_price = Number(
          orderItem?.offer_rent_price_per_month > 0
            ? orderItem.offer_rent_price_per_month
            : orderItem.rent_price_per_month
        );

        const total_price = Number(
          orderItem?.offer_purchase_price > 0
            ? orderItem.offer_purchase_price
            : orderItem.purchase_price
        );

        return {
          product_id: productId,
          product_name: product.product_name,
          quantity,
          total_price: total_price.toFixed(2),
          unit_price: unit_price.toFixed(2),
          purchase_price: Number(orderItem.purchase_price).toFixed(2),
          offer_purchase_price: Number(orderItem.offer_purchase_price).toFixed(
            2
          ),
          rent_price_per_month: Number(orderItem.rent_price_per_month).toFixed(
            2
          ),
          offer_rent_price_per_month: Number(
            orderItem.offer_rent_price_per_month
          ).toFixed(2),
          device_ids: selectedDeviceIds,
        };
      });

      const payload = {
        ...formData,
        items,
        other_accessory: showOtherAccessory ? otherAccessory : "",
      };

      console.log("Submitting payload:", payload);

      const response = await fetch(`${API_URL}/delivery-challans/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create delivery challan");

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Delivery-Challans created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations");
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
                readOnly
              />

              <Field
                label="Select Dispatch Order"
                name="order_id"
                type="select"
                placeholder="Select Dispatch Order"
                value={formData.order_id}
                onChange={(e) => {
                  handleOrderSelect(e.target.value);
                  if (errors.order_id) {
                    setErrors({ ...errors, order_id: "" });
                  }
                }}
                error={errors.order_id}
                options={dispatchOrders.map((order) => ({
                  value: order.id,
                  label: `${order.dispatch_order_id} - ${
                    order.shipping_name || ""
                  }`,
                }))}
              />

              <Field
                label="Order Number"
                name="order_number"
                placeholder="Enter Order Number"
                value={formData.order_number}
                onChange={handleInputChange}
                readOnly
              />
              <Field
                label="Transaction Type"
                name="type"
                type="select"
                placeholder="Select Type"
                value={formData.type}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value === "Buy") {
                    setFormData((prev) => ({
                      ...prev,
                      payment_type: "",
                    }));
                  }
                }}
                options={[
                  { value: "Rent", label: "Rent" },
                  { value: "Buy", label: "Buy" },
                ]}
                disabled
              />

              {formData.type === "Rent" && (
                <Field
                  label="Payment type"
                  name="payment_type"
                  placeholder="Payment Type"
                  value={formData.payment_type}
                  onChange={handleInputChange}
                  disabled
                />
              )}
              <Field
                label="DC Status"
                name="dc_status"
                type="select"
                placeholder="Select Status"
                value={formData.dc_status}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.dc_status) {
                    setErrors({ ...errors, dc_status: "" });
                  }
                }}
                error={errors.dc_status}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Delivered", label: "Delivered" },
                ]}
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
              />

              <Field
                label="Industry"
                name="industry"
                placeholder="Enter Industry"
                value={formData.industry}
                onChange={handleInputChange}
              />
              <Field
                label="Remarks"
                name="remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
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
                label="Customer Name"
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

          {/* Delivery Person Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📝</div>
              <h3 style={cardHeaderStyle}>Delivery Person Details</h3>
            </div>

            <div style={fieldsGridStyle}>
              {/* Vehicle Number */}
              <Field
                label="Vehicle Number"
                name="vehicle_number"
                placeholder="Enter Vehicle Number"
                value={formData.vehicle_number}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.vehicle_number) {
                    setErrors({ ...errors, vehicle_number: "" });
                  }
                }}
                error={errors.vehicle_number}
              />

              {/* Delivery Person Name */}
              <Field
                label="Delivery Person Name"
                name="delivery_person_name"
                placeholder="Enter Name"
                value={formData.delivery_person_name}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.delivery_person_name) {
                    setErrors({ ...errors, delivery_person_name: "" });
                  }
                }}
                error={errors.delivery_person_name}
                required
              />

              {/* Delivery Person Phone */}
              <Field
                label="Delivery Person Phone"
                name="delivery_person_phone_number"
                placeholder="Enter Phone"
                type="tel"
                value={formData.delivery_person_phone_number}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.delivery_person_phone_number) {
                    setErrors({ ...errors, delivery_person_phone_number: "" });
                  }
                }}
                error={errors.delivery_person_phone_number}
                required
              />

              <Field
                label="Receiver Name"
                name="receiver_name"
                placeholder="Enter Name"
                value={formData.receiver_name}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.receiver_name) {
                    setErrors({ ...errors, receiver_name: "" });
                  }
                }}
                error={errors.receiver_name}
                required
              />
              <Field
                label="Receiver Phone Number"
                name="receiver_phone_number"
                placeholder="Enter Phone"
                type="tel"
                value={formData.receiver_phone_number}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.receiver_phone_number) {
                    setErrors({ ...errors, receiver_phone_number: "" });
                  }
                }}
                error={errors.receiver_phone_number}
                required
              />
            </div>

            {/* Demo DC Checkbox */}
            <div style={fieldContainerStyle}>
              <label
                style={{
                  ...labelStyle,
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <input
                  type="checkbox"
                  name="defualt_dc"
                  checked={formData.defualt_dc || false}
                  onChange={handleChange}
                  style={{
                    marginRight: "0.5rem",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                Demo DC
              </label>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginTop: "0.25rem",
                  marginLeft: "1.5rem", // indent helper text
                }}
              >
                Check if this is a demo delivery challan
              </div>
            </div>

            {/* Accessories Checkboxes */}
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Included Accessories:</label>
              <div style={checkboxGroupStyle}>
                {["mouse", "cable", "bag", "others"].map((field) => (
                  <label
                    key={field}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "15px",
                    }}
                  >
                    <input
                      type="checkbox"
                      name={field}
                      checked={formData[field]}
                      onChange={handleChange}
                      style={{ marginRight: "5px" }}
                    />
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                ))}
              </div>

              {/* Add the Other Accessory input field that appears when "others" is checked */}
              {showOtherAccessory && (
                <div style={{ marginTop: "10px" }}>
                  <Field
                    label="peripherals Other Accessory"
                    name="other_accessory"
                    placeholder="Enter accessory name"
                    value={otherAccessory}
                    onChange={(e) => setOtherAccessory(e.target.value)}
                  />
                </div>
              )}
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

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: "400px",
                    overflow: "auto",
                    position: "relative",
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                        <TableCell
                          padding="checkbox"
                          sx={{ backgroundColor: "#0d47a1" }}
                        >
                          <Checkbox
                            sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
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
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Product Name
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Processor
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          RAM
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Storage
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Graphics
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Selected Asset IDs
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts
                        .filter((product) =>
                          selectedProductIds.includes(product.id)
                        )
                        .map((product) => (
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
                            <TableCell>{product.processor}</TableCell>
                            <TableCell>{product.ram}</TableCell>
                            <TableCell>{product.storage}</TableCell>
                            <TableCell>{product.graphics}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={quantities[product.id] || ""}
                                disabled
                                inputProps={{
                                  min: 0,
                                  style: { width: 50, textAlign: "center" },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {(deviceIds[product.id] || []).join(", ")}
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

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={cancelBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onClick={() => navigate("/dashboard/operations")}
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

export default DeliveryChallanAddPage;
