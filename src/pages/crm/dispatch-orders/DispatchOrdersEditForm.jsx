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
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Add, Remove, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import API_URL, {POSTAL_API} from "../../../api/Api_url";
import { useInventory } from "../../../contexts/InventoryContext";
import { useSelector } from "react-redux";

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
    error = "", // <-- Accept error prop
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
              borderColor: error ? "red" : "#d1d5db",
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
            borderColor: error ? "red" : "#d1d5db",
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
            borderColor: error ? "red" : "#d1d5db",
          }}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          {...props}
        />
      ) : type === "checkbox" ? (
        <div style={checkboxContainerStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              style={checkboxStyle}
              {...props}
            />
            <div
              style={{
                ...checkboxCustomStyle,
                backgroundColor: value ? "#2563eb" : "#ffffff",
                borderColor: value ? "#2563eb" : "#d1d5db",
              }}
            >
              {value && <span style={checkmarkStyle}>&#10003;</span>}
            </div>
            <div>
              <span style={checkboxTextStyle}>
                {label}
                {required && <span style={requiredStyle}>*</span>}
              </span>
              {props.description && (
                <span style={checkboxDescStyle}>{props.description}</span>
              )}
            </div>
          </label>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            backgroundColor: readOnly ? "#f3f4f6" : "#ffffff",
            borderColor: error ? "red" : "#d1d5db",
          }}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}

      {/* Show error message */}
      {error && (
        <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
          {error}
        </div>
      )}
    </div>
  )
);
const DispatchOrdersEditForm = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const navigate = useNavigate();
  const { id } = useParams();
  const [newQuantities, setNewQuantities] = useState({});
  const [selectedNewAssetIds, setSelectedNewAssetIds] = useState({});
  const [assetSearchTerms, setAssetSearchTerms] = useState({});
  const [addedDates, setAddedDates] = useState({});
  const [approvedReceiptProducts, setApprovedReceiptProducts] = useState([]);

  const [showAssetSelection, setShowAssetSelection] = useState({});

  const getAvailableQty = (productId) => {
    const entry = approvedReceiptProducts.find(
      (item) => item.product_id === productId
    );
    return entry ? entry.available_quantity : 0;
  };

  const getAvailableAssetIds = (productId) => {
    const entry = approvedReceiptProducts.find(
      (item) => item.product_id === productId
    );
    return entry ? entry.available_asset_ids : [];
  };

  const [formData, setFormData] = useState({
    dispatch_order_id: "",
    dispatch_order_title: "",
    is_dispatch_order: false,
    order_id: "",
    customer_code: "",
    order_number: "",
    payment_type: "",
    dispatch_order_date: new Date().toISOString().split("T")[0],
    order_sale_date: "",
    dispatch_order_status: "",
    dealer_reference: "",
    email: "",
    gst_number: "",
    pan_number: "",
    remarks: "",
    type: "",
    convert_rent_to_sale: "",
    regular_dispatch_order: true,
    industry: "",
    shipping_ordered_by: "",
    shipping_phone_number: "",
    peripheral_update: false,
    is_direct_invoice: false,
    shipping_name: "",
    street: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    items: [],
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [priceForm, setPriceForm] = useState({
    purchase_price: "",
    offer_purchase_price: "",
  });

  // State for UI and data
  const [orders, setOrders] = useState([]);

  const [dispatchOrderItems, setDispatchOrderItems] = useState([]);

  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductTable, setShowProductTable] = useState(false);
  const [deviceIds, setDeviceIds] = useState({});
  const [deviceIdErrors, setDeviceIdErrors] = useState({});
  const [originalDeviceIds, setOriginalDeviceIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [productOfferPrices, setProductOfferPrices] = useState({});

  const [returnedQuantities, setReturnedQuantities] = useState({});
  const [selectedReturnedAssetIds, setSelectedReturnedAssetIds] = useState({});
  const [returnAssetSearchTerms, setReturnAssetSearchTerms] = useState({});
  const [returnedDates, setReturnedDates] = useState({});
  const [productPrices, setProductPrices] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch approved receipt products on component mount
  useEffect(() => {
    const fetchApprovedReceiptProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/goods-receipts/approved-receipt-products`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok)
          throw new Error("Failed to fetch approved receipt products");
        const data = await response.json();
        setApprovedReceiptProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching approved receipt products:", error);
        setSnackbar({
          open: true,
          message: "Error fetching approved receipt products: " + error.message,
          severity: "error",
        });
      }
    };

    fetchApprovedReceiptProducts();
  }, []);

  // Fetch dispatch order data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch dispatch order data
        const dispatchOrderResponse = await fetch(
          `${API_URL}/dispatch-orders/${id}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!dispatchOrderResponse.ok)
          throw new Error("Failed to fetch dispatch order");
        const dispatchOrderData = await dispatchOrderResponse.json();
        setDispatchOrderItems(dispatchOrderData.items || []);

        // Fetch orders
        const orderResponse = await fetch(`${API_URL}/orders/order-approved`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!orderResponse.ok) throw new Error("Failed to fetch orders");
        const orderData = await orderResponse.json();
        setOrders(orderData);

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        const prodData = await prodResponse.json();
        setProducts(prodData);

        // Process dispatch order data
        const { items, ...orderDetails } = dispatchOrderData;

        // Set device IDs for each product
        const newDeviceIds = {};
        const newOriginalDeviceIds = {};

        // Initialize product prices from dispatch order items
        const initialProductPrices = {};

        items.forEach((item) => {
          newDeviceIds[item.product_id] = item.device_ids || [];
          newOriginalDeviceIds[item.product_id] = [...(item.device_ids || [])];

          // Store the prices from the dispatch order
          initialProductPrices[item.product_id] = {
            purchase_price: item.purchase_price || "",
            offer_purchase_price: item.offer_purchase_price || "",
            rent_price_per_month: item.rent_price_per_month || "",
            offer_rent_price_per_month: item.offer_rent_price_per_month || "",
          };
        });

        setProductPrices(initialProductPrices);

        items.forEach((item) => {
          newDeviceIds[item.product_id] = item.device_ids || [];
          newOriginalDeviceIds[item.product_id] = [...(item.device_ids || [])];
        });

        setDeviceIds(newDeviceIds);
        setOriginalDeviceIds(newOriginalDeviceIds);

        // Set selected products and quantities
        const productIds = items.map((item) => item.product_id);
        setSelectedProductIds(productIds);

        const newQuantities = {};
        items.forEach((item) => {
          newQuantities[item.product_id] = item.quantity;
        });
        setQuantities(newQuantities);

        // Set form data
        setFormData({
          ...orderDetails,
          items: items.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            item_total_value: item.item_total_value,
            device_ids: item.device_ids || [],
          })),
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching data: " + error.message,
          severity: "error",
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    const selectedOrder = orders.find(
      (order) => order.id === parseInt(orderId)
    );
    if (!selectedOrder) return;

    const { personalDetails, address, items } = selectedOrder;

    // Set device IDs for each product
    const newDeviceIds = {};

    items.forEach((item) => {
      newDeviceIds[item.product_id] = item.device_ids || [];
    });

    setDeviceIds(newDeviceIds);

    setFormData((prev) => ({
      ...prev,
      order_id: selectedOrder.id,
      customer_code: selectedOrder.customer_id,
      order_number: selectedOrder.order_id,
      payment_type: selectedOrder.payment_type,
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
      type: selectedOrder.type,
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.requested_quantity,
        item_total_value: item.item_total_value,
        device_ids: item.device_ids || [],
        offer_purchase_price: item.offer_purchase_price || 0,
        offer_rent_price_per_month: item.offer_rent_price_per_month || 0,
        purchase_price: item.purchase_price || 0,
        rent_price_per_month: item.rent_price_per_month || 0,
      })),
    }));

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

    if (pincode && pincode.length === 6) {
      try {
        const response = await fetch(
          `${POSTAL_API}=${pincode}`
        );
        const result = await response.json();

        if (result?.data) {
          const info = result.data;

          setFormData((prev) => ({
            ...prev,
            city: info.district_name,
            state: info.state_name,
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


  const handleOpenEditDialog = (product) => {
    // Find the dispatch order item for this product
    const dispatchOrderItem = dispatchOrderItems.find(
      (item) => item.product_id === product.id
    );

    if (dispatchOrderItem) {
      setEditingProduct({
        ...product,
        ...dispatchOrderItem, // Include dispatch order specific data
      });

      setPriceForm({
        purchase_price: dispatchOrderItem.purchase_price || "",
        offer_purchase_price: dispatchOrderItem.offer_purchase_price || "",
        rent_price_per_month: dispatchOrderItem.rent_price_per_month || "",
        offer_rent_price_per_month:
          dispatchOrderItem.offer_rent_price_per_month || "",
      });
    } else {
      // Fallback to product template prices if dispatch order item not found
      setEditingProduct(product);
      setPriceForm({
        purchase_price: product.purchase_price || "",
        offer_purchase_price: product.offer_purchase_price || "",
        rent_price_per_month: product.rent_price_per_month || "",
        offer_rent_price_per_month: product.offer_rent_price_per_month || "",
      });
    }
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingProduct(null);
    setPriceForm({
      purchase_price: "",
      offer_purchase_price: "",
      rent_price_per_month: "",
      offer_rent_price_per_month: "",
    });
  };

  // Handle price form change
  const handlePriceFormChange = (field, value) => {
    setPriceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit updated prices
  // Replace handleUpdatePrices with this:
  // Replace the handleUpdatePrices function with this:
  const handleUpdatePrices = () => {
    if (!editingProduct) return;

    // Update both productPrices and productOfferPrices states
    setProductPrices((prev) => ({
      ...prev,
      [editingProduct.product_id]: {
        ...prev[editingProduct.product_id],
        purchase_price: priceForm.purchase_price,
        offer_purchase_price: priceForm.offer_purchase_price,
        rent_price_per_month: priceForm.rent_price_per_month,
        offer_rent_price_per_month: priceForm.offer_rent_price_per_month,
      },
    }));

    setProductOfferPrices((prev) => ({
      ...prev,
      [editingProduct.id]: priceForm.offer_purchase_price,
    }));

    setSnackbar({
      open: true,
      message: "Prices updated successfully!",
      severity: "success",
    });

    handleCloseEditDialog();
  };

  // Handle form field changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Handle product selection
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

  // Handle quantity changes
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

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Asset IDs
    let hasErrors = false;
    const newDeviceIdErrors = {};

    selectedProductIds.forEach((productId) => {
      const qty = quantities[productId] || 0;
      const ids = deviceIds[productId] || [];

      if (ids.length !== qty) {
        newDeviceIdErrors[productId] = `Please select exactly ${qty} Asset IDs`;
        hasErrors = true;
      } else {
        const emptyIds = ids.filter((id) => !id.trim());
        if (emptyIds.length > 0) {
          newDeviceIdErrors[productId] = `All Asset IDs are required`;
          hasErrors = true;
        }
      }
    });

    setDeviceIdErrors(newDeviceIdErrors);

    if (hasErrors) {
      setSnackbar({
        open: true,
        message: "Please provide all required Asset IDs",
        severity: "error",
      });
      return;
    }

    try {
      // Find the selected order to get rental dates
      const selectedOrder = orders.find(
        (order) => order.id === parseInt(formData.order_id)
      );

      // Prepare rental period data if it's a rental order
      const rentalPeriod =
        formData.transaction_type === "Rent" && selectedOrder
          ? {
              rental_start_date: selectedOrder.rental_start_date,
              rental_end_date: selectedOrder.rental_end_date,
              rental_duration: selectedOrder.rental_duration,
            }
          : null;

      // Prepare items data with updated prices
      const items = selectedProductIds.map((productId) => {
        const orderItem = selectedOrder.items.find(
          (item) => item.product_id === productId
        );

        const product = products.find((p) => p.id === productId);
        const quantity = quantities[productId] || 1;
        const selectedDeviceIds = deviceIds[productId] || [];
        const prices = productPrices[productId] || {};

        // Calculate total price based on transaction type
        let total_price = 0;
        if (formData.transaction_type === "Rent") {
          const rentalDuration = selectedOrder?.rental_duration || 1;
          if (rentalDuration === 12) {
            total_price = product.rent_price_1_year * quantity;
          } else if (rentalDuration === 6) {
            total_price = product.rent_price_6_months * quantity;
          } else {
            const monthlyPrice =
              product?.offer_rent_price_per_month &&
              product.offer_rent_price_per_month !== ""
                ? Number(product.offer_rent_price_per_month)
                : Number(product?.rent_price_per_month || 0);

            total_price = monthlyPrice;
          }
        } else {
          total_price = product.purchase_price * quantity;
        }

        return {
          product_id: productId,
          product_name: product.product_name,
          quantity,
          total_price,
          device_ids: selectedDeviceIds,
          purchase_price:
            orderItem?.purchase_price || product.purchase_price || 0,
          rent_price_per_month:
            orderItem?.rent_price_per_month ||
            product.rent_price_per_month ||
            0,
          offer_purchase_price:
            orderItem?.offer_purchase_price ||
            product.offer_purchase_price ||
            0,
          offer_rent_price_per_month:
            orderItem?.offer_rent_price_per_month ||
            product.offer_rent_price_per_month ||
            0,
        };
      });

      const payload = {
        ...formData,
        type: formData.type,
        convert_rent_to_sale: formData.convert_rent_to_sale,
        order_sale_date:
          formData.convert_rent_to_sale === ""
            ? null
            : formData.order_sale_date,
        items,
      };

      console.log("Updating payload:", payload);

      const response = await fetch(`${API_URL}/dispatch-orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update dispatch order");

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Dispatch Order updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/dispatch-orders");
      }, 1500);
    } catch (error) {
      console.error("Error updating dispatch order:", error);
      setSnackbar({
        open: true,
        message: "Error updating dispatch order: " + error.message,
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <Typography variant="h6">Loading dispatch order data...</Typography>
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

      {/* Price Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogContent>
          {editingProduct && (
            <div style={formContainerStyle}>
              {/* Quotation Information Section */}
              <div style={cardStyle}>
                <div style={cardHeaderContainerStyle}>
                  <h3 style={cardHeaderStyle}>Edit Product Prices</h3>
                </div>
              </div>
              <Field
                label="Product Name"
                value={editingProduct.product_name}
                placeholder=""
                disabled={true} // properly disables the field
              />
              <div style={fieldsGridStyle}>
                {/* Product Name - Disabled */}

                {/* Disabled - Actual Prices */}
                <Field
                  label="Purchase Price (₹)"
                  type="number"
                  value={priceForm.purchase_price}
                  placeholder=""
                  disabled={true}
                />

                {/* Editable - Offer Prices */}
                <Field
                  label="Offer Purchase Price (₹)"
                  type="number"
                  value={priceForm.offer_purchase_price || ""}
                  onChange={(e) =>
                    handlePriceFormChange(
                      "offer_purchase_price",
                      e.target.value
                    )
                  }
                  placeholder=""
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdatePrices} variant="contained">
            Update Prices
          </Button>
        </DialogActions>
      </Dialog>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Edit Dispatch Order</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Order Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📦</div>
              <h3 style={cardHeaderStyle}>Order Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Dispatch Order ID"
                name="dispatch_order_id"
                placeholder="Enter Dispatch Order ID"
                value={formData.dispatch_order_id}
                onChange={handleInputChange}
                readOnly
              />
              <Field
                label="Order Details"
                name="order_id"
                type="select"
                placeholder="Select Order"
                value={formData.order_id}
                onChange={(e) => handleOrderSelect(e.target.value)}
                options={orders.map((order) => {
                  const customer =
                    order.personalDetails || order.personal_details || {};
                  return {
                    value: order.id,
                    label: `${order.order_id} - ${customer.first_name || ""} ${
                      customer.last_name || ""
                    }`,
                  };
                })}
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
                label="Transaction Type"
                name="type"
                type="select"
                placeholder="Select Type"
                value={formData.type}
                onChange={(e) => {
                  handleInputChange(e);
                  // Clear payment type when switching to Buy
                  if (e.target.value === "Buy") {
                    setFormData((prev) => ({
                      ...prev,
                      payment_type: "", // Clear payment type for Buy transactions
                    }));
                  }
                }}
                options={[
                  { value: "Rent", label: "Rent" },
                  { value: "Buy", label: "Sale" },
                ]}
              />

              {/* <Field
                label="Rent To Sale"
                name="convert_rent_to_sale"
                type="select"
                placeholder="Select Type"
                value={formData.convert_rent_to_sale}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                options={[{ value: "Buy", label: "Buy" }]}
              /> */}

              {formData.convert_rent_to_sale === "Buy" && (
                <Field
                  label="Sale Date"
                  name="order_sale_date"
                  type="date"
                  value={formData.order_sale_date}
                  onChange={handleInputChange}
                />
              )}

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
                label="Dispatch Order Status"
                name="dispatch_order_status"
                type="select"
                placeholder="Select Status"
                value={formData.dispatch_order_status}
                onChange={handleInputChange}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Dispatched", label: "Dispatched" },
                  { value: "Delivered", label: "Delivered" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
                required
              />
              <Field
                label="Dispatch Order Date"
                name="dispatch_order_date"
                type="date"
                value={formData.dispatch_order_date}
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
                label="Remarks"
                name="remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={handleInputChange}
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
            {/* Peripheral Update Checkbox */}
            <div style={fieldContainerStyle}>
              <Field
                label="Peripheral Update Required"
                name="peripheral_update"
                type="checkbox"
                value={formData.peripheral_update}
                onChange={handleInputChange}
                description="Check if this delivery includes peripheral updates"
              />

              {/* Direct Invoice Checkbox */}
              <Field
                label="Direct Invoice"
                name="is_direct_invoice"
                type="checkbox"
                value={formData.is_direct_invoice}
                onChange={handleInputChange}
                description="Check if this is a direct invoice"
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

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: "400px", // or whatever height you prefer
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
                          Available Quantity
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

                        {formData.convert_rent_to_sale === "Buy" && (
                          <>
                            <TableCell
                              sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                            >
                              Price per Piece
                            </TableCell>

                            <TableCell
                              sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </>
                        )}
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
                            <TableCell>{getAvailableQty(product.id)}</TableCell>

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

                            {formData.convert_rent_to_sale === "Buy" && (
                              <>
                                <TableCell>
                                  <div>
                                    <strong>Purchase Price:</strong> ₹
                                    {productPrices[product.id]
                                      ?.purchase_price ||
                                      product.purchase_price}
                                  </div>
                                  {productPrices[product.id]
                                    ?.offer_purchase_price && (
                                    <div>
                                      <strong>Offer Price:</strong> ₹
                                      {
                                        productPrices[product.id]
                                          ?.offer_purchase_price
                                      }
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenEditDialog(product)
                                    }
                                    title="Edit Prices"
                                    disabled={
                                      !selectedProductIds.includes(product.id)
                                    }
                                    style={{
                                      opacity: selectedProductIds.includes(
                                        product.id
                                      )
                                        ? 1
                                        : 0.5,
                                      cursor: selectedProductIds.includes(
                                        product.id
                                      )
                                        ? "pointer"
                                        : "not-allowed",
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </>
                            )}
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
            onClick={() => navigate("/dashboard/crm/dispatch-orders")}
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
              Update Dispatch Order
            </button>
          </Box>
        </div>
      </form>
    </div>
  );
};

export default DispatchOrdersEditForm;
