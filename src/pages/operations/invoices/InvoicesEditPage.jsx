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
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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

const Field = memo(
  ({
    label,
    name,
    placeholder,
    type = "text",
    options = [],
    required = false,
    readOnly = false,
    disabled = false,
    value,
    onChange,
    error,
    children, // <-- keep children support also
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
            disabled={disabled || readOnly}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Support both `options` and `children` */}
            {options.length > 0
              ? options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              : children}
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

// Reuse the DateRangeSelector component
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
        </Box>
      </Box>
    );
  }
);

const formatINR = (number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(number || 0);

const InvoicesEditPage = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const { id } = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    dc_id: "",
  });

  const [formData, setFormData] = useState({
    invoice_number: "",
    invoice_title: "",
    customer_id: "",
    customer_name: "",
    invoice_date: new Date().toISOString().split("T")[0],
    invoice_due_date: new Date().toISOString().split("T")[0],
    purchase_order_date: "",
    purchase_order_number: "",
    dc_id: "",
    dispatch_order_number: "",
    dc_date: "",
    customer_gst_number: "",
    duration: "",
    email: "",
    phone_number: "",
    pan_number: "",
    transaction_type: "",
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
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [productOrderMap, setProductOrderMap] = useState({});
  const [selectedReturnIds, setSelectedReturnIds] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const [dateRanges, setDateRanges] = useState({
    invoiceStartDate: "",
    invoiceEndDate: "",
    previousDeliveredStartDate: "",
    previousDeliveredEndDate: "",
    creditNoteStartDate: "",
    creditNoteEndDate: "",
  });

  // Fetch invoice data to edit
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        // Fetch the invoice data
        const invoiceResponse = await fetch(`${API_URL}/invoices/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!invoiceResponse.ok) {
          throw new Error("Failed to fetch invoice data");
        }
        const invoiceData = await invoiceResponse.json();

        // Fetch other necessary data (products, tax types, etc.)
        const [productsResponse, taxResponse, dispatchOrdersResponse] =
          await Promise.all([
            fetch(`${API_URL}/product-templete`, {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }),
            fetch(`${API_URL}/tax-types`, {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }),
            fetch(`${API_URL}/dispatch-orders/approved-dc`, {
              headers: {
                "Authorization": `Bearer ${userToken}`,
              },
            }),
          ]);

        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        if (!taxResponse.ok) throw new Error("Failed to fetch tax types");
        if (!dispatchOrdersResponse.ok)
          throw new Error("Failed to fetch dispatch orders");

        const productsData = await productsResponse.json();
        const taxData = await taxResponse.json();
        const dispatchOrdersData = await dispatchOrdersResponse.json();

        // Transform dispatch orders data
        const transformedOrders = dispatchOrdersData.map((dispatchOrder) => {
          const dc = dispatchOrder.delivery_challans?.[0] || dispatchOrder;
          return {
            id: dispatchOrder.id,
            order_id: dispatchOrder.order_id,
            dc_id: dc.dc_id || dispatchOrder.dispatch_order_id,
            dispatch_order_number:
              dc.dispatch_order_id || dispatchOrder.dispatch_order_id,
            dc_date: dc.dc_date || dispatchOrder.dispatch_order_date,
            customer_code: dispatchOrder.customer_code,
            order_number: dispatchOrder.order_number,
            dispatch_order_id: dispatchOrder.dispatch_order_id,
            customer_id: dispatchOrder.contact?.id,
            dispatch_order: dispatchOrder,
            personalDetails: {
              first_name:
                dispatchOrder.shipping_name ||
                dispatchOrder.contact?.first_name,
              last_name: dispatchOrder.contact?.last_name || "",
              email: dispatchOrder.email || dispatchOrder.contact?.email,
              phone_number:
                dispatchOrder.shipping_phone_number ||
                dispatchOrder.contact?.phone_number,
              gst_number:
                dispatchOrder.gst_number || dispatchOrder.contact?.gst,
              pan_number:
                dispatchOrder.pan_number || dispatchOrder.contact?.pan_no,
            },
            address: {
              country: dispatchOrder.country || "India",
              state: dispatchOrder.state,
              city: dispatchOrder.city,
              street:
                dispatchOrder.street || dispatchOrder.contact?.address?.street,
              pincode: dispatchOrder.pincode,
              landmark: dispatchOrder.landmark,
            },
            items: dispatchOrder.items.map((item) => ({
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_price: parseFloat(item.total_price) / item.quantity || 0,
              total_price: item.total_price,
              product: item.product,
              device_ids: item.device_ids || [],
              order_id: dispatchOrder.order_id,
            })),
            rental_start_date: dispatchOrder.order?.rental_start_date || null,
            rental_end_date: dispatchOrder.order?.rental_end_date || null,
            rental_duration: dispatchOrder.order?.rental_duration || null,
            transaction_type: dispatchOrder.type || "",
            payment_type: dispatchOrder.payment_type || "",
          };
        });

        // Set the data
        setProducts(productsData);
        setTaxTypes(taxData);
        setOrders(transformedOrders);

        // Process the invoice data to populate the form
        // Try multiple ways to find the matching order
        let selectedOrder = null;

        // First try to match by dispatch_order_number
        if (invoiceData.dispatch_order_number) {
          selectedOrder = transformedOrders.find(
            (order) =>
              order.dispatch_order_id === invoiceData.dispatch_order_number
          );
        }

        // If not found, try by dc_id (database ID)
        if (!selectedOrder && invoiceData.dc_id) {
          selectedOrder = transformedOrders.find(
            (order) => order.id === parseInt(invoiceData.dc_id)
          );
        }

        // If still not found, try by dispatch_order_id field
        if (!selectedOrder && invoiceData.dispatch_order_id) {
          selectedOrder = transformedOrders.find(
            (order) => order.id === parseInt(invoiceData.dispatch_order_id)
          );
        }

        if (selectedOrder) {
          setSelectedOrderId(selectedOrder.id.toString());
          console.log("Found matching order:", selectedOrder);
        } else {
          console.warn(
            "Could not find matching order for invoice:",
            invoiceData
          );
          console.log("Available orders:", transformedOrders);
        }

        // Set quantities and selected products
        const initialQuantities = {};
        const initialSelectedProductIds = [];
        invoiceData.items.forEach((item) => {
          initialQuantities[item.product_id] = item.quantity;
          initialSelectedProductIds.push(item.product_id);
        });

        setQuantities(initialQuantities);
        setSelectedProductIds(initialSelectedProductIds);

        // Set form data
        setFormData({
          ...invoiceData,
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

        // Set date ranges if they exist in the invoice data
        if (invoiceData.invoice_start_date) {
          setDateRanges({
            invoiceStartDate: invoiceData.invoice_start_date,
            invoiceEndDate: invoiceData.invoice_end_date,
            previousDeliveredStartDate:
              invoiceData.previous_delivered_start_date || "",
            previousDeliveredEndDate:
              invoiceData.previous_delivered_end_date || "",
            creditNoteStartDate: invoiceData.credit_note_start_date || "",
            creditNoteEndDate: invoiceData.credit_note_end_date || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching data: " + error.message,
          severity: "error",
        });
      }
    };

    fetchInvoiceData();
  }, [id]);

  // Reuse the same helper functions from InvoicesAddPage
  const calculateRentalPrice = useCallback((product, months = 0, days = 0) => {
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
  }, []);

  const handleCustomerSelect = useCallback(
    (dispatchOrderId) => {
      const selectedOrder = orders.find(
        (order) => order.id === parseInt(dispatchOrderId)
      );
      if (!selectedOrder) return;

      setSelectedOrderId(dispatchOrderId);

      const customerId =
        selectedOrder.contact?.id ||
        selectedOrder.customer_code ||
        selectedOrder.dispatch_order?.customer_code;

      const dispatchOrderDate =
        selectedOrder.dispatch_order?.dispatch_order_date ||
        selectedOrder.dc_date ||
        (selectedOrder.created_at
          ? new Date(selectedOrder.created_at).toISOString().split("T")[0]
          : "");

      const dispatchOrderNumber =
        selectedOrder.dispatch_order_id || selectedOrder.dispatch_order_number;

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
        customer_id: customerId || "",
        customer_name: `${personal?.first_name || ""}`,
        email: personal?.email || "",
        phone_number: personal?.phone_number || "",
        customer_gst_number: personal?.gst_number || "",
        pan_number: selectedOrder.pan_number || personal?.pan_number || "",
        order_id: selectedOrder.order_id,
        transaction_type: selectedOrder.transaction_type || "",
        payment_type: selectedOrder.payment_type || "",
        rental_duration: selectedOrder.rental_duration || "",
        rental_duration_days: selectedOrder.rental_duration_days || 0,
        purchase_order_date: dispatchOrderDate,
        purchase_order_number: selectedOrder.order_number || "",
        dc_id: selectedOrder.dc_id || selectedOrder.dispatch_order_id,
        dispatch_order_number: dispatchOrderNumber,
        dispatch_order_id: selectedOrder.id,
        dc_date: dispatchOrderDate,
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
          ...prev.shippingDetails,
          consignee_name: `${personal?.first_name || ""}`,
          country: address?.country || "India",
          state: address?.state || "",
          city: address?.city || "",
          street: address?.street || "",
          pincode: address?.pincode || "",
          phone_number: personal?.phone_number || "",
          email: personal?.email || "",
        },
      }));
    },
    [orders, products, taxTypes, calculateRentalPrice]
  );

  // Reuse the same input handlers from InvoicesAddPage
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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

  const handleReturnQtyChange = useCallback((productId, value) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(value) || 0,
    }));
  }, []);

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

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reuse the same totals calculation effect
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
  ]);

  // // Handle form submission for editing
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate form
  //   let isValid = true;
  //   const newErrors = {
  //     dc_id: "",
  //   };

  //   if (!selectedOrderId) {
  //     newErrors.dc_id = "DC selection is required";
  //     isValid = false;
  //   }

  //   setErrors(newErrors);

  //   if (!isValid) {
  //     setSnackbar({
  //       open: true,
  //       message: "Please select a DC before submitting",
  //       severity: "error",
  //     });
  //     return;
  //   }

  //   try {
  //     const selectedOrder = orders.find(
  //       (order) => order.id === parseInt(selectedOrderId)
  //     );

  //     const submissionData = {
  //       ...formData,
  //       customer_id: formData.customer_id || selectedOrder?.contact?.id || "",
  //       dc_id: formData.dc_id,
  //       dispatch_order_number:
  //         formData.dispatch_order_number || formData.dispatch_order_id,
  //       dc_date: formData.dc_date,
  //       invoice_start_date: dateRanges.invoiceStartDate,
  //       invoice_end_date: dateRanges.invoiceEndDate,
  //       previous_delivered_start_date: dateRanges.previousDeliveredStartDate,
  //       previous_delivered_end_date: dateRanges.previousDeliveredEndDate,
  //       credit_note_start_date: dateRanges.creditNoteStartDate,
  //       credit_note_end_date: dateRanges.creditNoteEndDate,
  //       rental_duration: formData.rental_duration || "0",
  //       rental_duration_days: formData.rental_duration_days || 0,
  //       rental_duration_months: formData.rental_duration
  //         ? parseInt(formData.rental_duration)
  //         : 0,
  //       payment_mode: formData.payment_type || "",
  //       items: formData.items.map((item) => {
  //         const product = products.find((p) => p.id === item.product_id);
  //         const unit_price = product
  //           ? product.offer_rent_price_per_month !== null &&
  //             product.offer_rent_price_per_month !== ""
  //             ? product.offer_rent_price_per_month
  //             : product.rent_price_per_month
  //           : 0;

  //         const total_price = product
  //           ? product.offer_purchase_price !== null &&
  //             product.offer_purchase_price !== ""
  //             ? product.offer_purchase_price
  //             : product.purchase_price
  //           : 0;

  //         return {
  //           ...item,
  //           order_id: productOrderMap[item.product_id] || "",
  //           device_ids: returnedDeviceIds[item.product_id] || [],
  //           new_device_ids: newDeviceIds[item.product_id] || [],
  //           returned_device_ids: selectedReturnIds[item.product_id]
  //             ? [selectedReturnIds[item.product_id]]
  //             : [],
  //           rental_duration: formData.rental_duration || "0",
  //           rental_duration_days: formData.rental_duration_days || 0,
  //           rental_duration_months: formData.rental_duration
  //             ? parseInt(formData.rental_duration)
  //             : 0,
  //           unit_price: unit_price,
  //           total_price: total_price,
  //         };
  //       }),
  //     };

  //     const response = await fetch(`${API_URL}/invoices/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(submissionData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to update invoice");
  //     }

  //     const result = await response.json();
  //     setSnackbar({
  //       open: true,
  //       message: "Invoice updated successfully!",
  //       severity: "success",
  //     });

  //     setTimeout(() => {
  //       navigate("/dashboard/operations/invoices");
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Error updating invoice:", error);
  //     setSnackbar({
  //       open: true,
  //       message: "Error updating invoice: " + error.message,
  //       severity: "error",
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    let isValid = true;
    const newErrors = {
      dc_id: "",
    };

    if (!selectedOrderId) {
      newErrors.dc_id = "DC selection is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setSnackbar({
        open: true,
        message: "Please select a DC before submitting",
        severity: "error",
      });
      return;
    }

    try {
      const selectedOrder = orders.find(
        (order) => order.id === parseInt(selectedOrderId)
      );

      // Create a map of product prices from the dispatch order
      const dispatchOrderProductPrices = {};
      if (selectedOrder && selectedOrder.items) {
        selectedOrder.items.forEach((item) => {
          dispatchOrderProductPrices[item.product_id] = {
            offer_purchase_price: item.offer_purchase_price || "0.00",
            purchase_price: item.purchase_price || "0.00",
            rent_price_per_month: item.rent_price_per_month || "0.00",
            offer_rent_price_per_month:
              item.offer_rent_price_per_month || "0.00",
            total_price: item.total_price || "0.00",
          };
        });
      }

      const submissionData = {
        ...formData,
        customer_id: formData.customer_id || selectedOrder?.contact?.id || "",
        dc_id: formData.dc_id,
        dispatch_order_number:
          formData.dispatch_order_number || formData.dispatch_order_id,
        dc_date: formData.dc_date,
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
        payment_mode: formData.payment_type || "",
        items: formData.items.map((item) => {
          // Get prices from dispatch order instead of product template
          const dispatchPrices =
            dispatchOrderProductPrices[item.product_id] || {};

          const offer_purchase_price =
            parseFloat(dispatchPrices.offer_purchase_price) || 0;
          const purchase_price = parseFloat(dispatchPrices.purchase_price) || 0;
          const rent_price_per_month =
            parseFloat(dispatchPrices.rent_price_per_month) || 0;
          const offer_rent_price_per_month =
            parseFloat(dispatchPrices.offer_rent_price_per_month) || 0;

          // Simple price assignment as requested
          const total_price =
            offer_purchase_price === 0 ? purchase_price : offer_purchase_price;
          const unit_price =
            offer_rent_price_per_month === 0
              ? rent_price_per_month
              : offer_rent_price_per_month;

          return {
            ...item,
            order_id: productOrderMap[item.product_id] || "",
            device_ids: returnedDeviceIds[item.product_id] || [],
            new_device_ids: newDeviceIds[item.product_id] || [],
            returned_device_ids: selectedReturnIds[item.product_id]
              ? [selectedReturnIds[item.product_id]]
              : [],
            rental_duration: formData.rental_duration || "0",
            rental_duration_days: formData.rental_duration_days || 0,
            rental_duration_months: formData.rental_duration
              ? parseInt(formData.rental_duration)
              : 0,
            unit_price: unit_price,
            total_price: total_price,
            purchase_price: purchase_price,
            offer_purchase_price: offer_purchase_price,
            rent_price_per_month: rent_price_per_month,
            offer_rent_price_per_month: offer_rent_price_per_month,
          };
        }),
      };

      const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
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
          Update the details below to edit the invoice
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
                label="Invoice Date"
                type="date"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleInputChange}
              />

              <Field
                label="Select DC"
                name="dc_id"
                type="select"
                value={selectedOrderId || ""}
                onChange={(e) => {
                  handleCustomerSelect(e.target.value);
                  if (errors.dc_id) {
                    setErrors({ ...errors, dc_id: "" });
                  }
                }}
                placeholder="Select DC"
                error={errors.dc_id}
              >
                <option value="" disabled>
                  Select DC
                </option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.dispatch_order_id} -{" "}
                    {order.personalDetails?.first_name || ""}
                  </option>
                ))}
              </Field>

              <Field
                label="Transaction Type"
                name="transaction_type"
                type="select"
                placeholder="Select Type"
                value={formData.transaction_type}
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
                  { value: "Buy", label: "Sale" },
                ]}
              />

              {formData.transaction_type === "Rent" && (
                <>
                  <Field
                    label="Payment Mode"
                    name="payment_mode"
                    value={formData.payment_mode}
                    onChange={handleInputChange}
                    disabled
                  />

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
                </>
              )}

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
                          Specifications
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Quantity
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
            onClick={() => navigate("/dashboard/operations/invoices")}
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
