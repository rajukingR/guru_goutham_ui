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
import { useNavigate, useParams } from "react-router-dom";
import API_URL, { POSTAL_API } from "../../api/Api_url";
import { useInventory } from "../../contexts/InventoryContext";
import { useSelector } from "react-redux";

// Reuse the same styles from DeliveryChallanAddPage
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

const checkboxGroupStyle = {
  display: "flex",
  gap: "1rem",
  marginTop: "0.5rem",
};

// Field component (same as in AddPage)
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

const DeliveryChallanEditPage = () => {
  const { id } = useParams();
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
    defualt_dc: false,
    mouse: false,
    cable: false,
    bag: false,
    others: false,
    mouse_qty: 0,
    cable_qty: 0,
    bag_qty: 0,
    others_qty: 0,
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
  const [loading, setLoading] = useState(true);
  // Add these state variables near the other state declarations
  const [showOtherAccessory, setShowOtherAccessory] = useState(false);
  const [otherAccessory, setOtherAccessory] = useState("");
  const [accessoryErrors, setAccessoryErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the delivery challan data
        const dcResponse = await fetch(`${API_URL}/delivery-challans/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!dcResponse.ok) throw new Error("Failed to fetch delivery challan");
        const dcData = await dcResponse.json();

        // Fetch dispatch orders
        const dispatchOrderResponse = await fetch(
          `${API_URL}/dispatch-orders/approved`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!dispatchOrderResponse.ok)
          throw new Error("Failed to fetch dispatch orders");
        const dispatchOrderData = await dispatchOrderResponse.json();
        setDispatchOrders(dispatchOrderData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();
        setProducts(prodData);

        // Set form data from the fetched delivery challan
        setFormData({
          ...dcData,
          dc_date: dcData.dc_date
            ? dcData.dc_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          mouse_qty: dcData.mouse_qty || 0,
          cable_qty: dcData.cable_qty || 0,
          bag_qty: dcData.bag_qty || 0,
          others_qty: dcData.others_qty || 0,
        });

        // Initialize other accessory state
        setShowOtherAccessory(dcData.others || false);
        setOtherAccessory(dcData.other_accessory || "");

        // Set selected products and quantities
        const productIds = dcData.items.map((item) => item.product_id);
        setSelectedProductIds(productIds);

        const newQuantities = {};
        dcData.items.forEach((item) => {
          newQuantities[item.product_id] = item.quantity;
        });
        setQuantities(newQuantities);

        // Set device IDs
        const newDeviceIds = {};
        dcData.items.forEach((item) => {
          newDeviceIds[item.product_id] = item.device_ids || [];
        });
        setDeviceIds(newDeviceIds);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching data: " + error.message,
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const validateForm = () => {
    const newErrors = {};
    const newAccessoryErrors = {};

    // Existing validations
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
      newErrors.delivery_person_phone_number = "Delivery Person Phone is required";
    }
    if (!formData.receiver_name) {
      newErrors.receiver_name = "Receiver Name is required";
    }
    if (!formData.receiver_phone_number) {
      newErrors.receiver_phone_number = "Receiver Phone number is required";
    }

    // Accessory quantity validations
    const accessoryFields = ["mouse", "cable", "bag", "others"];
    accessoryFields.forEach(field => {
      if (formData[field]) {
        const qtyField = `${field}_qty`;
        const quantity = formData[qtyField] || 0;

        if (quantity < 1) {
          newAccessoryErrors[field] = `Quantity must be at least 1 for ${field}`;
        }
      }
    });

    // Updated validation for "others" accessory name
    if (formData.others && showOtherAccessory) {
      // Check if otherAccessory is array or string and handle accordingly
      if (Array.isArray(otherAccessory)) {
        if (otherAccessory.length === 0 || otherAccessory.some(item => !item.trim())) {
          newAccessoryErrors.others = "Please specify at least one other accessory name";
        }
      } else {
        // Handle string case (backward compatibility)
        if (!otherAccessory || !otherAccessory.trim()) {
          newAccessoryErrors.others = "Please specify the other accessory name";
        }
      }
    }

    setErrors(newErrors);
    setAccessoryErrors(newAccessoryErrors);

    return Object.keys(newErrors).length === 0 && Object.keys(newAccessoryErrors).length === 0;
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
        total_price: item.total_price,
        unit_price: item.unit_price,
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

  const [postOffices, setPostOffices] = useState([]); // Billing/Main Pincode


  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      const pincode = formData.pincode;

      if (pincode && pincode.length === 6) {
        try {
          const response = await fetch(`${POSTAL_API}/${pincode}`);
          const result = await response.json();

          // Set Post Offices if available
          if (Array.isArray(result) && result.length > 0 && result[0]?.PostOffice) {
            setPostOffices(result[0].PostOffice);
          }

          // Update formData with first post office info (optional)
          if (result[0]?.PostOffice?.length > 0) {
            const firstOffice = result[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              city: firstOffice.District,
              state: firstOffice.State,
              country: firstOffice.Country || "India",
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
            message: "Error fetching location data. Please check the pincode and try again.",
            severity: "error",
          });
        }
      }
    };

    const debounceTimer = setTimeout(fetchLocationFromPincode, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.pincode]);

  // Update the handleInputChange function to handle the "others" checkbox
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (name === "others") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      setShowOtherAccessory(checked);

      if (!checked) {
        setOtherAccessory("");
        setFormData((prev) => ({ ...prev, others_qty: 0 }));
        // Clear others error when unchecked
        setAccessoryErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.others;
          return newErrors;
        });
      }
    } else if (name.endsWith('_qty')) {
      // Handle quantity changes
      const qtyValue = Math.max(0, parseInt(value) || 0);
      setFormData((prev) => ({
        ...prev,
        [name]: qtyValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // When unchecking a checkbox, clear its error
      if (type === "checkbox" && !checked && accessoryErrors[name]) {
        setAccessoryErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [accessoryErrors]);

  // Update handleAccessoryQtyChange to clear errors when quantity becomes valid
  const handleAccessoryQtyChange = useCallback((accessoryName, value) => {
    const qtyField = `${accessoryName}_qty`;
    const qtyValue = Math.max(0, parseInt(value) || 0);

    setFormData((prev) => ({
      ...prev,
      [qtyField]: qtyValue
    }));

    // Clear error when user starts typing valid quantity
    if (qtyValue >= 1 && accessoryErrors[accessoryName]) {
      setAccessoryErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[accessoryName];
        return newErrors;
      });
    }
  }, [accessoryErrors]);

  // Update increment/decrement functions to handle validation
  const incrementAccessoryQty = useCallback((accessoryName) => {
    const qtyField = `${accessoryName}_qty`;
    setFormData((prev) => ({
      ...prev,
      [qtyField]: (prev[qtyField] || 0) + 1
    }));

    // Clear error when incrementing
    if (accessoryErrors[accessoryName]) {
      setAccessoryErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[accessoryName];
        return newErrors;
      });
    }
  }, [accessoryErrors]);

  const decrementAccessoryQty = useCallback((accessoryName) => {
    const qtyField = `${accessoryName}_qty`;
    const newQty = Math.max(0, (formData[qtyField] || 0) - 1);

    setFormData((prev) => ({
      ...prev,
      [qtyField]: newQty
    }));

    // Set error if quantity becomes 0
    if (newQty === 0) {
      setAccessoryErrors(prev => ({
        ...prev,
        [accessoryName]: `Quantity must be at least 1 for ${accessoryName}`
      }));
    } else if (accessoryErrors[accessoryName]) {
      // Clear error if quantity becomes valid
      setAccessoryErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[accessoryName];
        return newErrors;
      });
    }
  }, [formData, accessoryErrors]);

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
        const quantity = quantities[productId] || 1;
        const selectedDeviceIds = deviceIds[productId] || [];
        const orderItem = formData.items.find((item) => item.product_id === productId);

        const total_price = orderItem.total_price;
        const unit_price = orderItem.unit_price;

        return {
          product_id: productId,
          product_name: product.product_name,
          quantity,
          total_price,
          unit_price,
          device_ids: selectedDeviceIds,
        };
      });

      // Prepare accessories data for API
      const accessoriesData = {
        mouse: formData.mouse ? { included: true, quantity: formData.mouse_qty || 0 } : { included: false, quantity: 0 },
        cable: formData.cable ? { included: true, quantity: formData.cable_qty || 0 } : { included: false, quantity: 0 },
        bag: formData.bag ? { included: true, quantity: formData.bag_qty || 0 } : { included: false, quantity: 0 },
        others: formData.others ? {
          included: true,
          quantity: formData.others_qty || 0,
          name: otherAccessory
        } : { included: false, quantity: 0, name: "" }
      };

      const payload = {
        ...formData,
        items,
        accessories: accessoriesData,
        other_accessory: showOtherAccessory ? otherAccessory : "",
        // Include individual quantity fields in the payload
        mouse_qty: formData.mouse_qty || 0,
        cable_qty: formData.cable_qty || 0,
        bag_qty: formData.bag_qty || 0,
        others_qty: formData.others_qty || 0,
      };

      console.log("Updating payload:", payload);

      const response = await fetch(`${API_URL}/delivery-challans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update delivery challan");

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Delivery Challan updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations");
      }, 1500);
    } catch (error) {
      console.error("Error updating delivery challan:", error);
      setSnackbar({
        open: true,
        message: "Error updating delivery challan: " + error.message,
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <Typography variant="h6">Loading delivery challan data...</Typography>
      </div>
    );
  }

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
        <h1 style={titleStyle}>Edit Delivery Challan</h1>
        <p style={subtitleStyle}>
          Update the details below for the delivery challan
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
                label="Select Order Preparation"
                name="order_id"
                type="select"
                placeholder="Select Order Preparation"
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
                  label: `${order.dispatch_order_id} - ${order.shipping_name || ""} (${order.contact.company_name || ""})`,
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

              {(formData.dc_status === "Pending" || formData.dc_status === "Rejected") && (
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

                    { value: "Rejected", label: "Rejected" },
                  ]}
                />
              )
              }

              <Field
                label="DC Date"
                name="dc_date"
                type="date"
                value={formData.dc_date}
                onChange={handleInputChange}
              />
              {/* <Field
                label="Other Reference"
                name="dealer_reference"
                placeholder="Enter Reference"
                value={formData.dealer_reference}
                onChange={handleInputChange}
              /> */}
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleInputChange}
              />

              {/* <Field
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
              /> */}
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

          {/* Other Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📝</div>
              <h3 style={cardHeaderStyle}>Delivery Person Details</h3>
            </div>
            <div style={fieldsGridStyle}>
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
              />

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
            {/* Default DC Checkbox */}
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
                  onChange={handleInputChange}
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
                Check if this is a default delivery challan
              </div>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Included Accessories:</label>
              <div style={checkboxGroupStyle}>
                {["mouse", "cable", "bag", "others"].map((field) => (
                  <div key={field} style={{ marginBottom: "10px" }}>
                    <label
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
                        onChange={handleInputChange}
                        style={{ marginRight: "5px" }}
                      />
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>

                    {/* Quantity input that appears when checkbox is checked */}
                    {formData[field] && (
                      <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                        <label style={{ fontSize: "12px", marginRight: "5px" }}>
                          Quantity:
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <button
                            type="button"
                            onClick={() => decrementAccessoryQty(field)}
                            style={{
                              padding: "2px 6px",
                              fontSize: "12px",
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              cursor: "pointer"
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            name={`${field}_qty`}
                            value={formData[`${field}_qty`] || 0}
                            onChange={(e) => handleAccessoryQtyChange(field, e.target.value)}
                            min="0"
                            style={{
                              width: "60px",
                              padding: "2px 5px",
                              height: "30px",
                              fontSize: "12px",
                              border: accessoryErrors[field] ? "1px solid red" : "1px solid #ccc",
                              borderRadius: "3px"
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => incrementAccessoryQty(field)}
                            style={{
                              padding: "2px 6px",
                              fontSize: "12px",
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              cursor: "pointer"
                            }}
                          >
                            +
                          </button>
                        </div>
                        {/* Error message for accessory quantity */}
                        {accessoryErrors[field] && (
                          <div style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "2px",
                            marginLeft: "5px"
                          }}>
                            {accessoryErrors[field]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Other Accessory input field */}
              {showOtherAccessory && (
                <div style={{ marginTop: "10px" }}>
                  <Field
                    label="Specify Other Accessory"
                    name="other_accessory"
                    placeholder="Enter accessory name"
                    value={otherAccessory}
                    onChange={(e) => {
                      setOtherAccessory(e.target.value);
                      // Clear error when user starts typing
                      if (e.target.value.trim() && accessoryErrors.others) {
                        setAccessoryErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.others;
                          return newErrors;
                        });
                      }
                    }}
                    error={accessoryErrors.others}
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
              Update Delivery Challan
            </button>
          </Box>
        </div>
      </form>
    </div>
  );
};

export default DeliveryChallanEditPage;
