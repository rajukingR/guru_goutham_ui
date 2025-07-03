import React, { useState, useEffect, useCallback, memo } from "react";
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
  Typography,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useNavigate, useParams } from "react-router-dom";

// Reuse the same styles from InvoicesAddPage
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

// Field component moved outside and memoized
const Field = memo(
  ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    options = [],
    readOnly = false,
    required = false,
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
            name={name}
            value={value}
            onChange={onChange}
            disabled={readOnly}
            style={selectStyle}
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
      ) : type === "date" ? (
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          style={inputStyle}
          readOnly={readOnly}
          {...props}
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
          {...props}
        />
      )}
    </div>
  )
);

// DateRangeSelector component moved outside and memoized
const DateRangeSelector = memo(
  ({ selectedMonth, setSelectedMonth, dateRanges, setDateRanges }) => {
    const [monthOffset, setMonthOffset] = useState(0);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const calculateDates = useCallback(
      (offset) => {
        const baseDate = new Date();
        const currentMonth = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth() + offset,
          1
        );

        const startDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          1
        );
        const endDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          0
        );
        const prevStartDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        );
        const prevEndDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          0
        );

        setDateRanges({
          invoiceStartDate: formatDate(startDate),
          invoiceEndDate: formatDate(endDate),
          previousDeliveredStartDate: formatDate(prevStartDate),
          previousDeliveredEndDate: formatDate(prevEndDate),
          creditNoteStartDate: formatDate(prevStartDate),
          creditNoteEndDate: formatDate(prevEndDate),
        });
      },
      [setDateRanges]
    );

    useEffect(() => {
      calculateDates(monthOffset);
      if (monthOffset === 0) {
        setSelectedMonth("current");
      }
    }, [monthOffset, calculateDates, setSelectedMonth]);

    const handleMonthChange = (type) => {
      if (type === "previous") {
        setMonthOffset((prev) => prev - 1);
        setSelectedMonth("previous");
      } else if (type === "current") {
        setMonthOffset(0);
        setSelectedMonth("current");
      } else if (type === "next") {
        setMonthOffset((prev) => prev + 1);
        setSelectedMonth("next");
      }
    };

    return (
      <Box sx={{ width: "100%", mb: 10 }}>
        <Box sx={monthButtonContainerStyle}>
          <button
            type="button"
            onClick={() => handleMonthChange("previous")}
            style={monthButtonStyle(selectedMonth === "previous")}
          >
            Previous Month
          </button>
          <button
            type="button"
            onClick={() => handleMonthChange("current")}
            style={monthButtonStyle(selectedMonth === "current")}
          >
            Current Month
          </button>
          <button
            type="button"
            onClick={() => handleMonthChange("next")}
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
            type="date"
            name="invoiceStartDate"
            value={dateRanges.invoiceStartDate}
            onChange={(e) =>
              setDateRanges({ ...dateRanges, invoiceStartDate: e.target.value })
            }
          />
          <Field
            label="Invoice End Date"
            type="date"
            name="invoiceEndDate"
            value={dateRanges.invoiceEndDate}
            onChange={(e) =>
              setDateRanges({ ...dateRanges, invoiceEndDate: e.target.value })
            }
          />
          <Field
            label="Previous Delivered Start Date"
            type="date"
            name="previousDeliveredStartDate"
            value={dateRanges.previousDeliveredStartDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                previousDeliveredStartDate: e.target.value,
              })
            }
          />
          <Field
            label="Previous Delivered End Date"
            type="date"
            name="previousDeliveredEndDate"
            value={dateRanges.previousDeliveredEndDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                previousDeliveredEndDate: e.target.value,
              })
            }
          />
          <Field
            label="Credit Note Start Date"
            type="date"
            name="creditNoteStartDate"
            value={dateRanges.creditNoteStartDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                creditNoteStartDate: e.target.value,
              })
            }
          />
          <Field
            label="Credit Note End Date"
            type="date"
            name="creditNoteEndDate"
            value={dateRanges.creditNoteEndDate}
            onChange={(e) =>
              setDateRanges({
                ...dateRanges,
                creditNoteEndDate: e.target.value,
              })
            }
          />
        </Box>
      </Box>
    );
  }
);

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

const InvoicesEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoice_number: "",
    invoice_title: "",
    customer_id: "",
    customer_name: "",
    invoice_date: new Date().toISOString().split("T")[0],
    invoice_due_date: new Date().toISOString().split("T")[0],
    purchase_order_date: "",
    purchase_order_number: "",
    customer_gst_number: "",
    duration: "",
    email: "",
    phone_number: "",
    pan_number: "",
    payment_terms: "",
    payment_mode: "",
    approval_status: "",
    approval_date: "",
    invoice_consulting_by: "",
    industry: "",
    remarks: "",
    // Add rental fields
    rental_duration: "1", // Default to 1 month
    rental_duration_days: 0,
    rental_duration_months: 1,
    rental_start_date: new Date().toISOString().split("T")[0],
    rental_end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
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
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [productOrderMap, setProductOrderMap] = useState({});
  const [selectedReturnIds, setSelectedReturnIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [returnedDates, setReturnedDates] = useState({});
  const [upgradedRams, setUpgradedRams] = useState({});
  const [upgradeDates, setUpgradeDates] = useState({});

  const [deviceIds, setDeviceIds] = useState({});
  const [selectedReturnDeviceIds, setSelectedReturnDeviceIds] = useState({});

  const [dateRanges, setDateRanges] = useState({
    invoiceStartDate: "",
    invoiceEndDate: "",
    previousDeliveredStartDate: "",
    previousDeliveredEndDate: "",
    creditNoteStartDate: "",
    creditNoteEndDate: "",
  });

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(`${API_URL}/invoices/${id}`);
        if (!response.ok) throw new Error("Failed to fetch invoice");

        const invoiceData = await response.json();

        // Safely parse returned_device_ids
        const itemsWithParsedIds = invoiceData.items.map((item) => ({
          ...item,
          device_ids: item.device_ids || [],
          unit_price: item.unit_price,
          returned_device_ids: (() => {
            const ids = item.returned_device_ids;
            if (typeof ids === "string" && ids.trim().startsWith("[")) {
              try {
                return JSON.parse(ids);
              } catch (e) {
                console.warn("Failed to parse returned_device_ids:", ids);
                return [];
              }
            }
            return Array.isArray(ids) ? ids : [];
          })(),
        }));

        // Initialize device IDs state
        const initialDeviceIds = {};
        const initialSelectedReturns = {};

        itemsWithParsedIds.forEach((item) => {
          initialDeviceIds[item.product_id] = item.device_ids;
          if (item.returned_device_ids && item.returned_device_ids.length > 0) {
            initialSelectedReturns[item.product_id] = item.returned_device_ids;
          }
        });

        setDeviceIds(initialDeviceIds);
        setSelectedReturnDeviceIds(initialSelectedReturns);

        // Set form data from the fetched invoice
        setFormData({
          ...invoiceData,
          items: itemsWithParsedIds,
          customer_id: invoiceData.customer_id,
          shippingDetails: {
            consignee_name: invoiceData.shippingDetail?.consignee_name || "",
            country: invoiceData.shippingDetail?.country || "India",
            state: invoiceData.shippingDetail?.state || "",
            city: invoiceData.shippingDetail?.city || "",
            street: invoiceData.shippingDetail?.street || "",
            landmark: invoiceData.shippingDetail?.landmark || "",
            pincode: invoiceData.shippingDetail?.pincode || "",
            phone_number: invoiceData.shippingDetail?.phone_number || "",
            email: invoiceData.shippingDetail?.email || "",
          },
        });

        if (invoiceData.invoice_start_date) {
          setDateRanges({
            invoiceStartDate: invoiceData.invoice_start_date,
            invoiceEndDate: invoiceData.invoice_end_date,
            previousDeliveredStartDate:
              invoiceData.previous_delivered_start_date,
            previousDeliveredEndDate: invoiceData.previous_delivered_end_date,
            creditNoteStartDate: invoiceData.credit_note_start_date,
            creditNoteEndDate: invoiceData.credit_note_end_date,
          });
        }

        // Set selected products and quantities
        const productIds = itemsWithParsedIds.map((item) => item.product_id);
        setSelectedProductIds(productIds);

        const initialQuantities = {};
        const initialReturnQuantities = {};
        const initialNewQuantities = {};
        const initialNewDeviceIds = {};
        const initialReturnedDeviceIds = {};
        const initialSelectedReturnIds = {};
        const initialReturnedDates = {};
        const initialUpgradedRams = {};
        const initialUpgradeDates = {};

        itemsWithParsedIds.forEach((item) => {
          initialQuantities[item.product_id] = item.quantity || 0;
          initialReturnQuantities[item.product_id] = item.return_quantity || 0;
          initialNewQuantities[item.product_id] = item.new_quantity || 0;
          initialNewDeviceIds[item.product_id] = item.new_device_ids || [];
          initialReturnedDeviceIds[item.product_id] =
            item.returned_device_ids || [];
          initialReturnedDates[item.product_id] = item.returned_date || "";
          initialUpgradedRams[item.product_id] = item.upgraded_ram || "";
          initialUpgradeDates[item.product_id] = item.upgrade_date || "";

          if (item.returned_device_ids && item.returned_device_ids.length > 0) {
            initialSelectedReturnIds[item.product_id] =
              item.returned_device_ids;
          }
        });

        setQuantities(initialQuantities);
        setReturnQuantities(initialReturnQuantities);
        setNewQuantities(initialNewQuantities);
        setNewDeviceIds(initialNewDeviceIds);
        setReturnedDeviceIds(initialReturnedDeviceIds);
        setSelectedReturnIds(initialSelectedReturnIds);
        setReturnedDates(initialReturnedDates);
        setUpgradedRams(initialUpgradedRams);
        setUpgradeDates(initialUpgradeDates);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setSnackbar({
          open: true,
          message: "Error fetching invoice: " + error.message,
          severity: "error",
        });
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  const handleReturnDeviceCheckboxChange = (productId, deviceId) => (event) => {
    const isChecked = event.target.checked;
    setSelectedReturnDeviceIds((prev) => {
      const currentSelected = prev[productId] || [];
      return {
        ...prev,
        [productId]: isChecked
          ? [...currentSelected, deviceId]
          : currentSelected.filter((id) => id !== deviceId),
      };
    });
  };

  // Fetch other necessary data (products, orders, tax types)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodResponse, taxResponse, ordersResponse] = await Promise.all([
          fetch(`${API_URL}/product-templete`),
          fetch(`${API_URL}/tax-types`),
          fetch(`${API_URL}/delivery-challans/approved-delivery-challan`),
        ]);

        if (!prodResponse.ok) throw new Error("Failed to fetch products");
        if (!taxResponse.ok) throw new Error("Failed to fetch tax types");
        if (!ordersResponse.ok) throw new Error("Failed to fetch orders");

        const [prodData, taxData, ordersData] = await Promise.all([
          prodResponse.json(),
          taxResponse.json(),
          ordersResponse.json(),
        ]);

        setProducts(prodData);
        setTaxTypes(taxData);

        // Transform orders data
        const transformedOrders = ordersData.map((dc) => ({
          id: dc.id,
          order_id: dc.order_id,
          personalDetails: {
            first_name: dc.shipping_name || dc.customer?.first_name,
            last_name: dc.customer?.last_name || "",
            email: dc.email || dc.customer?.email,
            phone_number: dc.shipping_phone_number || dc.customer?.phone_number,
            gst_number: dc.gst_number || dc.customer?.gst,
            pan_number: dc.pan_number || dc.customer?.pan_number,
          },
          address: {
            country: dc.country || "India",
            state: dc.state,
            city: dc.city,
            street: dc.street,
            pincode: dc.pincode,
            landmark: dc.landmark,
          },
          items: dc.items.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            product: item.product,
          })),
          rental_start_date: dc.rental_start_date,
          rental_end_date: dc.rental_end_date,
          rental_duration: dc.duration,
          transaction_type: dc.type || "Rent",
          payment_type: dc.payment_type || "Postpaid",
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching initial data: " + error.message,
          severity: "error",
        });
      }
    };

    fetchInitialData();
  }, []);

  const [errors, setErrors] = useState({});

  const handleReturnQtyChange = (productId, value) => {
    const qty = parseInt(value, 10) || 0;
    const issuedQty = quantities[productId] || 0;

    if (qty > issuedQty) {
      setErrors((prev) => ({
        ...prev,
        [productId]: `Cannot return more than ${issuedQty} item(s).`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [productId]: "" }));
    }

    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  const incrementReturnQty = useCallback((productId) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  }, []);

  const decrementReturnQty = useCallback((productId) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  }, []);

  const handleReturnedDateChange = useCallback((productId, date) => {
    setReturnedDates((prev) => ({
      ...prev,
      [productId]: date,
    }));
  }, []);

  const handleUpgradedRamChange = useCallback((productId, ram) => {
    setUpgradedRams((prev) => ({
      ...prev,
      [productId]: ram,
    }));
  }, []);

  const handleUpgradeDateChange = useCallback((productId, date) => {
    setUpgradeDates((prev) => ({
      ...prev,
      [productId]: date,
    }));
  }, []);

  const handleNewQtyChange = useCallback((productId, value) => {
    const updated = { ...newQuantities, [productId]: parseInt(value) || 0 };
    setNewQuantities(updated);
  }, []);

  const incrementNewQty = useCallback((productId) => {
    setNewQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  }, []);

  const decrementNewQty = useCallback((productId) => {
    setNewQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  }, []);

  const handleSelectReturnId = (productId, id) => {
    setSelectedReturnIds((prev) => ({
      ...prev,
      [productId]: id,
    }));
  };

  const handleCustomerSelect = useCallback(
    (customerId) => {
      const selectedOrder = orders.find(
        (order) => order.id === parseInt(customerId)
      );
      if (!selectedOrder) return;

      // Initialize quantities from order items
      const initialQuantities = {};
      selectedOrder.items.forEach((item) => {
        initialQuantities[item.product_id] = item.quantity;
      });

      setQuantities(initialQuantities);

      const personal = selectedOrder.personalDetails;
      const address = selectedOrder.address;
      const orderItems = selectedOrder.items || [];

      const productDeviceMap = {};
      const productOrderMapLocal = {};

      orderItems.forEach((item) => {
        if (item.product_id && Array.isArray(item.device_ids)) {
          productDeviceMap[item.product_id] = item.device_ids;
        }
        if (item.product_id && item.order_id) {
          productOrderMapLocal[item.product_id] = item.order_id;
        }
      });

      setReturnedDeviceIds(productDeviceMap);
      setProductOrderMap(productOrderMapLocal);

      const productIds = orderItems.map((item) => item.product_id);
      setSelectedProductIds(productIds);

      const selectedProducts = products.filter((product) =>
        productIds.includes(product.id)
      );

      let amount = 0;
      const items = selectedProducts.map((product) => {
        const quantity = initialQuantities[product.id] || 0;
        let price = product.purchase_price;

        if (selectedOrder.transaction_type === "Rent") {
          const months = parseInt(selectedOrder.rental_duration) || 0;
          const days = parseInt(selectedOrder.rental_duration_days) || 0;
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
        customer_name: `${personal?.first_name || ""}`,
        email: personal?.email || "",
        phone_number: personal?.phone_number || "",
        customer_gst_number: personal?.gst_number || "",
        pan_number: selectedOrder.pan_number || personal?.pan_number || "",
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
          consignee_name: `${personal?.first_name || ""}`,
          country: address?.country || "India",
          state: address?.state || "",
          city: address?.city || "",
          street: address?.street || "",
          pincode: address?.pincode || "",
          phone_number: personal?.phone_number || "",
          email: personal?.email || "",
        },
      });
    },
    [orders, products, taxTypes, formData]
  );

  // Handle form field changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle shipping details changes
  const handleShippingChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shippingDetails: {
        ...prev.shippingDetails,
        [name]: value,
      },
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
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] || 1,
    }));
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

  // Calculate totals whenever relevant data changes
  useEffect(() => {
    const calculateTotals = () => {
  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.id)
  );

  let amount = 0;

  const items = selectedProducts.map((product) => {
    // Find existing item to preserve its unit_price
    const existingItem = formData.items.find(i => i.product_id === product.id);
    const unit_price = existingItem?.unit_price || product.purchase_price;

    const previous_quantity = quantities[product.id] || 0;
    const quantity = quantities[product.id] || 0;
    const return_quantity = returnQuantities?.[product.id] || 0;
    const new_quantity = newQuantities?.[product.id] || 0;
    const new_device_ids = newDeviceIds?.[product.id] || [];
    const returned_device_ids = returnedDeviceIds?.[product.id] || [];
    const returned_date = returnedDates?.[product.id] || "";
    const upgraded_ram = upgradedRams?.[product.id] || "";
    const upgrade_date = upgradeDates?.[product.id] || "";

    let price = unit_price; // Use the preserved unit_price

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

    const totalPrice = new_quantity * price;
    amount += totalPrice;

    return {
      product_id: product.id,
      product_name: product.product_name,
      previous_quantity,
      quantity,
      return_quantity,
      new_quantity,
      new_device_ids,
      returned_device_ids,
      returned_date,
      upgraded_ram,
      upgrade_date,
      unit_price: price.toString(), // Preserve the calculated price
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
    quantities,
    returnQuantities,
    newQuantities,
    products,
    taxTypes,
    formData.transaction_type,
    formData.rental_duration,
    formData.rental_duration_days,
    returnedDates,
    upgradedRams,
    upgradeDates,
  ]);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const submissionData = {
      ...formData,
      invoice_start_date: dateRanges.invoiceStartDate,
      invoice_end_date: dateRanges.invoiceEndDate,
      previous_delivered_start_date: dateRanges.previousDeliveredStartDate,
      previous_delivered_end_date: dateRanges.previousDeliveredEndDate,
      credit_note_start_date: dateRanges.creditNoteStartDate,
      credit_note_end_date: dateRanges.creditNoteEndDate,

      rental_duration: formData.rental_duration || "0",
      rental_duration_days: formData.rental_duration_days || 0,
      rental_duration_months: formData.rental_duration
        ? parseInt(formData.rental_duration)
        : 0,
      rental_start_date: formData.rental_start_date || dateRanges.invoiceStartDate,
      rental_end_date: formData.rental_end_date || dateRanges.invoiceEndDate,

      purchase_order_number: formData.purchase_order_number || "",
      purchase_order_date: formData.purchase_order_date || "",

      payment_mode: formData.payment_type || "Postpaid",

      items: formData.items.map((item) => ({
        ...item,
        order_id: productOrderMap[item.product_id] || "",
        device_ids: deviceIds[item.product_id] || [],
        new_device_ids: newDeviceIds[item.product_id] || [],
        returned_device_ids: selectedReturnDeviceIds[item.product_id] || [],
        returned_date: returnedDates[item.product_id] || "",
        upgraded_ram: upgradedRams[item.product_id] || "",
        upgrade_date: upgradeDates[item.product_id] || "",
        rental_duration: formData.rental_duration || "0",
        rental_duration_days: formData.rental_duration_days || 0,
        rental_duration_months: formData.rental_duration
          ? parseInt(formData.rental_duration)
          : 0,
      })),
    };

    console.log("Submitting data:", submissionData); // For debugging

    const response = await fetch(`${API_URL}/invoices/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update invoice");
    }

    const result = await response.json();
    setSnackbar({
      open: true,
      message: "Invoice updated successfully!",
      severity: "success",
    });

    setTimeout(() => {
      navigate("/dashboard/operations/invoices");
    }, 1500);
  } catch (error) {
    console.error("Error updating invoice:", error);
    setSnackbar({
      open: true,
      message: "Error updating invoice: " + error.message,
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

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Loading Invoice...</h1>
        </div>
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
        <h1 style={titleStyle}>Edit Invoice</h1>
        <p style={subtitleStyle}>
          Edit the details below for invoice {formData.invoice_number}
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
                label="Invoice ID"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleInputChange}
                placeholder="Enter Invoice Id"
                readOnly
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
                label="Select Customer"
                name="customer_id"
                type="select"
                placeholder="Choose customer"
                value={formData.customer_id}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                options={orders.map((order) => ({
                  value: order.id,
                  label: `${order.order_id} || ${
                    order.personalDetails?.first_name || ""
                  }`,
                }))}
              />

              {/* Date Range Selector - spans full width */}
              <div
                style={{
                  gridColumn: "1 / -1",
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
                        {/* <TableCell sx={{ color: "#fff" }}>
                          Return Quantity
                        </TableCell>
                        <TableCell sx={{ color: "#fff", minWidth: "250px" }}>
                          Returned Device IDs
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Returned Date
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Upgraded RAM
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Upgrade Date
                        </TableCell> */}
                        <TableCell sx={{ color: "#fff" }}>
                          Price for Durations
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts
                        .filter((product) =>
                          selectedProductIds.includes(product.id)
                        )
                        .map((product) => {
                          const productDeviceIds = deviceIds[product.id] || [];
                          const selectedDevices =
                            selectedReturnDeviceIds[product.id] || [];

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
                                      handleQtyChange(
                                        product.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      !selectedProductIds.includes(product.id)
                                    }
                                    inputProps={{
                                      min: 0,
                                      style: {
                                        width: "50px",
                                        textAlign: "center",
                                      },
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
                              {/* <TableCell>
                                <FormControl error={!!errors[product.id]}>
                                  <Box display="flex" alignItems="center">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        decrementReturnQty(product.id)
                                      }
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
                                        style: {
                                          width: "50px",
                                          textAlign: "center",
                                        },
                                      }}
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        incrementReturnQty(product.id)
                                      }
                                      disabled={
                                        !selectedProductIds.includes(product.id)
                                      }
                                    >
                                      <Add fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  {errors[product.id] && (
                                    <FormHelperText>
                                      {errors[product.id]}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </TableCell>

                              <TableCell>
                                {returnQuantities[product.id] > 0 &&
                                  productDeviceIds.length > 0 &&
                                  !errors[product.id] && ( // ✅ Check for no error
                                    <Box display="flex" flexDirection="column">
                                      {productDeviceIds.map((deviceId) => (
                                        <FormControlLabel
                                          key={deviceId}
                                          control={
                                            <Checkbox
                                              checked={selectedDevices.includes(
                                                deviceId
                                              )}
                                              onChange={handleReturnDeviceCheckboxChange(
                                                product.id,
                                                deviceId
                                              )}
                                            />
                                          }
                                          label={deviceId}
                                        />
                                      ))}
                                    </Box>
                                  )}
                              </TableCell>

                              <TableCell>
                                <TextField
                                  type="date"
                                  size="small"
                                  value={returnedDates[product.id] || ""}
                                  onChange={(e) =>
                                    handleReturnedDateChange(
                                      product.id,
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={{ shrink: true }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={upgradedRams[product.id] || ""}
                                  onChange={(e) =>
                                    handleUpgradedRamChange(
                                      product.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="RAM upgrade"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="date"
                                  size="small"
                                  value={upgradeDates[product.id] || ""}
                                  onChange={(e) =>
                                    handleUpgradeDateChange(
                                      product.id,
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={{ shrink: true }}
                                />
                              </TableCell> */}
                              <TableCell>
                                <Box display="flex" flexDirection="column">
                                  <Typography variant="body2">
                                    Month: {product.rent_price_per_month}
                                  </Typography>
                                  {/* <Typography variant="body2">
                                    6 Months: {product.rent_price_6_months}
                                  </Typography>
                                  <Typography variant="body2">
                                    Year: {product.rent_price_1_year}
                                  </Typography> */}
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

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={cancelBtnStyle}
            onClick={() => navigate("/dashboard/operations/invoices")}
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
            Update Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoicesEditPage;
