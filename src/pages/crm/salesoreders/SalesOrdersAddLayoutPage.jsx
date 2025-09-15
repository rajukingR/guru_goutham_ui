import React, { useState, useEffect } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useInventory } from "../../../contexts/InventoryContext";
import { useSelector } from "react-redux";

const generateSalesOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SO-${randomPart}`;
};

const SalesOrdersAddLayoutPage = ({ product }) => {
  // State for form data
  const { inventoryData } = useInventory();
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const getAvailableQty = (productId) => {
    const entry = inventoryData.find((item) => item.id === productId);
    return entry ? entry.available_quantity : "N/A";
  };

  const [errors, setErrors] = useState({
    selectedQuotation: "",
    rentalDuration: "",
    rentalStartDate: "",
    rentalEndDate: "",
  });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    order_id: "",
    order_title: "",
    quotation_id: "",
    customer_id: "",
    transaction_type: "",
    payment_type: "",
    order_status: "Pending",
    source_of_entry: "",
    owner: "",
    remarks: "",
    order_generated_by: "Login User",
    rental_duration: null,
    rental_duration_days: null,
    rental_start_date: null,
    rental_end_date: null,
    order_date: new Date().toISOString().split("T")[0],
    contact_status: "Contacted",
    personal_details: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      gst_number: "",
      pan_number: "",
    },
    address: {
      billing_address: "",
      shipping_address: "",
      shipping_street: "",
      shipping_landmark: "",
      shipping_city: "",
      shipping_state: "",
      shipping_country: "India",
      shipping_pincode: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    items: [],
  });

  // State for data fetching
  const [quotations, setQuotations] = useState([]);
  const [products, setProducts] = useState([]);
  const [deviceIds, setDeviceIds] = useState({});
  const [deviceIdErrors, setDeviceIdErrors] = useState({});
  const [selectedAssetIds, setSelectedAssetIds] = useState({});
  const [availableAssetIds, setAvailableAssetIds] = useState({});
  const [quotationItems, setQuotationItems] = useState([]);

  const [loading, setLoading] = useState({
    quotations: true,
    products: true,
  });
  const [error, setError] = useState({
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      order_id: generateSalesOrderId(), // Match key used in form
    }));
  }, []);

  // Fetch approved quotations
  useEffect(() => {
    const fetchApprovedQuotations = async () => {
      try {
        const response = await fetch(`${API_URL}/quotations/approved`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
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

  const handleRentalDurationChange = (field, value) => {
    if (field === "rental_duration") {
      const months = Math.max(0, parseInt(value) || 0);
      const currentDate = new Date();

      // Format date as YYYY-MM-DD for date inputs
      const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Format date as DD-MM-YYYY for display
      const formatDateForDisplay = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const startDate = formatDateForInput(currentDate);
      let endDate = null;

      // Calculate end date by adding exact months (same day)
      if (months > 0) {
        const endDateObj = new Date(currentDate);
        endDateObj.setMonth(endDateObj.getMonth() + months);
        endDate = formatDateForInput(endDateObj);
      }

      setFormData((prev) => ({
        ...prev,
        rental_duration: months,
        rental_duration_days: null,
        rental_start_date: startDate,
        rental_end_date: endDate || prev.rental_end_date,
        order_date: startDate,
      }));
    } else if (field === "rental_duration_days") {
      const days = Math.max(0, parseInt(value) || 0);
      setFormData((prev) => ({
        ...prev,
        rental_duration_days: days,
        rental_duration: null,
      }));
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
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

    const selectedQuotation = quotations.find(
      (q) => q.id === parseInt(quotationId)
    );
    if (!selectedQuotation) return;

    setQuotationItems(selectedQuotation.items);

    const assetIdsMap = {};
    selectedQuotation.items.forEach((item) => {
      assetIdsMap[item.product_id] = item.available_asset_ids || [];
    });
    setAvailableAssetIds(assetIdsMap);

    try {
      // Determine shipping address based on transaction type
      const transactionType = selectedQuotation.transaction_type;
      const shippingAddress =
        transactionType === "Buy"
          ? ""
          : selectedQuotation.customer?.address?.street || "";

      // Update form data with quotation information
      setFormData((prev) => ({
        ...prev,
        quotation_id: selectedQuotation.id,
        customer_id: selectedQuotation.customer_id,
        payment_type: selectedQuotation.payment_type, // ✅ RETAIN this!

        rental_duration: selectedQuotation.rental_duration,
        transaction_type: selectedQuotation.transaction_type,
        rental_duration_days: selectedQuotation.rental_duration_days,
        rental_start_date: selectedQuotation.rental_start_date,
        rental_end_date: selectedQuotation.rental_end_date,
        order_title: `Order for Quotation ${selectedQuotation.quotation_id}`,
        owner: selectedQuotation.customer?.owner || "", // Access owner from customer
        remarks: selectedQuotation.remarks,
        personal_details: {
          ...prev.personal_details,
          first_name: selectedQuotation.customer?.first_name || "",
          last_name: selectedQuotation.customer?.last_name || "",
          phone_number: selectedQuotation.customer?.phone_number || "",
          email: selectedQuotation.customer?.email || "",
          gst_number: selectedQuotation.customer?.gst || "",
          pan_number: selectedQuotation.customer?.pan_no || "",
        },
        address: {
          ...prev.address,
          billing_address: selectedQuotation.customer?.address?.street || "",
          shipping_address: shippingAddress,
          city: selectedQuotation.customer?.address?.city || "",
          state: selectedQuotation.customer?.address?.state || "",
          pincode: selectedQuotation.customer?.address?.pincode || "",
          country: selectedQuotation.customer?.address?.country || "India",
        },
        items: selectedQuotation.items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quotation_quantity,
          offer_purchase_price: item.offer_purchase_price,
          offer_rent_price_per_month: item.offer_rent_price_per_month,
        })),
      }));

      // Set quantities for selected products
      const newQuantities = {};
      selectedQuotation.items.forEach((item) => {
        newQuantities[item.product_id] = item.quotation_quantity;
      });
      setQuantities(newQuantities);
      setSelectedProductIds(
        selectedQuotation.items.map((item) => item.product_id)
      );
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load quotation details",
        severity: "error",
      });
    }
  };

  // Fetch location data when shipping pincode changes
  useEffect(() => {
    const fetchShippingLocationFromPincode = async () => {
      const shippingPincode = formData.address.shipping_pincode;

      // Only make API call if shipping pincode is 6 digits (India specific)
      if (shippingPincode && shippingPincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${shippingPincode}`
          );
          const data = await response.json();

          if (data && data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];

            setFormData((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                shipping_city: postOffice.District,
                shipping_state: postOffice.State,
                shipping_country: "India",
              },
            }));
          } else {
            setSnackbar({
              open: true,
              message: "Could not find location for this shipping pincode",
              severity: "warning",
            });
          }
        } catch (error) {
          console.error("Error fetching shipping location data:", error);
          setSnackbar({
            open: true,
            message:
              "Error fetching shipping location data. Please check the pincode and try again.",
            severity: "error",
          });
        }
      }
    };

    // Add debounce to prevent too many API calls
    const debounceTimer = setTimeout(() => {
      fetchShippingLocationFromPincode();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formData.address.shipping_pincode]);

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
                shipping_address: prev.address.shipping_address,
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

    // Initialize quantity and Asset IDs
    if (!selectedProductIds.includes(productId)) {
      const qty = quantities[productId] || 1;
      setQuantities((prev) => ({ ...prev, [productId]: qty }));
      setDeviceIds((prev) => ({
        ...prev,
        [productId]: Array(qty).fill(""),
      }));
    }
  };

  const handleQtyChange = (productId, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => {
      // Adjust Asset IDs array when quantity changes
      const currentDeviceIds = deviceIds[productId] || [];
      let newDeviceIds = currentDeviceIds.slice(0, qty);

      // If increasing quantity, add empty strings for new Asset IDs
      if (qty > currentDeviceIds.length) {
        newDeviceIds = [
          ...currentDeviceIds,
          ...Array(qty - currentDeviceIds.length).fill(""),
        ];
      }

      setDeviceIds((prev) => ({
        ...prev,
        [productId]: newDeviceIds,
      }));

      return { ...prev, [productId]: qty };
    });
  };

  const incrementQty = (productId) => {
    handleQtyChange(productId, (quantities[productId] || 0) + 1);
  };

  const decrementQty = (productId) => {
    handleQtyChange(productId, Math.max(0, (quantities[productId] || 0) - 1));
  };
  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    let isValid = true;
    const newErrors = {
      selectedQuotation: "",
      rentalDuration: "",
      rentalStartDate: "",
      rentalEndDate: "",
    };

    // Validate quotation selection
    if (!formData.quotation_id) {
      newErrors.selectedQuotation = "Quotation selection is required";
      isValid = false;
    }

    // Validate rental fields if transaction type is Rent
    if (formData.transaction_type === "Rent") {
      if (!formData.rental_duration && !formData.rental_duration_days) {
        newErrors.rentalDuration = "Rental duration is required";
        isValid = false;
      }
      if (!formData.rental_start_date) {
        newErrors.rentalStartDate = "Rental start date is required";
        isValid = false;
      }
      if (!formData.rental_end_date) {
        newErrors.rentalEndDate = "Rental end date is required";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) {
      setSnackbar({
        open: true,
        message: "Please fix the errors before submitting",
        severity: "error",
      });
      return;
    }

    // Prepare items array with Asset IDs
    const orderItems = selectedProductIds.map((productId) => {
      const quotationItem = quotationItems.find(
        (item) => item.product_id === productId
      );
      const product = products.find((p) => p.id === productId);

      return {
        product_id: productId,
        product_name: product?.product_name || "Unknown Product",
        requested_quantity: quantities[productId] || 1,
        device_ids: deviceIds[productId] || [],
        // Include the offer prices from the quotation
        offer_purchase_price: quotationItem?.offer_purchase_price || 0,
        offer_rent_price_per_month:
          quotationItem?.offer_rent_price_per_month || 0,
        // Include regular prices as well if needed
        purchase_price: quotationItem?.purchase_price || 0,
        rent_price_per_month: quotationItem?.rent_price_per_month || 0,
      };
    });

    const payload = {
      ...formData,
      rental_duration_months: formData.rental_duration,
      rental_duration_days: formData.rental_duration_days,
      items: orderItems,
    };

    try {
      const response = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message === "Some products have insufficient stock" &&
          data.errors
        ) {
          const errorMessages = data.errors
            .map((error) => error.message)
            .join("\n");
          setSnackbar({
            open: true,
            message: errorMessages,
            severity: "error",
          });
        } else {
          throw new Error(data.message || "Failed to create order");
        }
        return;
      }

      setSnackbar({
        open: true,
        message: "Order created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/orders");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to create order",
        severity: "error",
      });
    }
  };

  return (
    <div style={containerStyle}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000} // Increased duration for longer messages
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", whiteSpace: "pre-line" }} // This preserves line breaks
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Create Order</h1>
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
              {/* <Field
                label="Order Title"
                placeholder="Enter Order Title"
                value={formData.order_title}
                onChange={(e) =>
                  handleChange({
                    target: { name: "order_title", value: e.target.value },
                  })
                }
              /> */}
              <Field
                label="Select Quotation"
                type="select"
                placeholder="Select Quotation"
                value={formData.quotation_id}
                onChange={(e) => {
                  handleChange({
                    target: { name: "quotation_id", value: e.target.value },
                  });
                  // Clear error when a selection is made
                  if (errors.selectedQuotation) {
                    setErrors({ ...errors, selectedQuotation: "" });
                  }
                }}
                error={errors.selectedQuotation}
                options={quotations.map((q) => ({
                  value: q.id,
                  label: `${q.quotation_id} - ${q.customer_first_name} ${q.customer_last_name}`,
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
                onChange={(e) => {
                  handleChange({
                    target: { name: "transaction_type", value: e.target.value },
                  });
                  // Clear rental fields when switching to Buy
                  if (e.target.value === "Buy") {
                    setFormData((prev) => ({
                      ...prev,
                      rental_duration: null,
                      rental_duration_days: null,
                      rental_start_date: null,
                      rental_end_date: null,
                      address: {
                        ...prev.address,
                        shipping_address: "", // Clear shipping address for Buy transactions
                      },
                    }));
                  }
                }}
                options={[
                  { value: "Rent", label: "Rent" },
                  { value: "Buy", label: "Sale" },
                ]}
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
                options={["Pending", "Approved", "Rejected"]}
              />
              {/* <Field
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
              /> */}
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

              {formData.transaction_type === "Rent" && (
                <>
                  <Field
                    label="Rental Duration (months)"
                    placeholder="Enter Duration in Months"
                    type="number"
                    value={formData.rental_duration || ""}
                    onChange={(e) =>
                      handleRentalDurationChange(
                        "rental_duration",
                        e.target.value
                      )
                    }
                    error={errors.rentalDuration}
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
                    error={errors.rentalStartDate}
                  />

                  <Field
                    label="Rental End Date"
                    type="date"
                    placeholder="Select Date"
                    value={formData.rental_end_date || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "rental_end_date",
                          value: e.target.value,
                        },
                      })
                    }
                    error={errors.rentalEndDate}
                  />
                </>
              )}

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
                value={formData.personal_details.first_name}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personal_details.first_name",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Last Name"
                placeholder="Enter Last Name"
                value={formData.personal_details.last_name}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personal_details.last_name",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="Contact Number"
                placeholder="Enter Contact Number"
                value={formData.personal_details.phone_number}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personal_details.phone_number",
                      value: e.target.value,
                    },
                  })
                }
              />

              <Field
                label="Email ID"
                placeholder="Enter Email"
                type="email"
                value={formData.personal_details.email}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personal_details.email",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="GST Number"
                placeholder="Enter GST Number"
                value={formData.personal_details.gst_number}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personal_details.gst_number",
                      value: e.target.value,
                    },
                  })
                }
              />
              <Field
                label="PAN Number"
                placeholder="Enter PAN Number"
                value={formData.personal_details.pan_number || ""} // Added optional chaining
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personal_details.pan_number",
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
              <h3 style={cardHeaderStyle}>Billing Address</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Pincode"
                placeholder="Enter Pincode"
                type="number"
                value={formData.address.pincode || ""} // Correct path
                onChange={(e) =>
                  handleChange({
                    target: { name: "address.pincode", value: e.target.value },
                  })
                }
              />
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
                label="City"
                placeholder="Enter City"
                value={formData.address.city}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address.city", value: e.target.value },
                  })
                }
                disabled
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
                disabled
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
                disabled
              />
            </div>
          </div>

          {/* Address Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏠</div>
              <h3 style={cardHeaderStyle}>Shipping Address</h3>
            </div>
            <div style={fieldsGridStyle}>
              {/* Shipping Address (only for Rent) */}
              {formData.transaction_type === "Rent" && (
                <>
                  <Field
                    label="Shipping Pincode"
                    placeholder="Enter Shipping Pincode"
                    type="number"
                    value={formData.address.shipping_pincode || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "address.shipping_pincode",
                          value: e.target.value,
                        },
                      })
                    }
                  />

                  <Field
                    label="Shipping Street"
                    placeholder="Enter Shipping Street"
                    value={formData.address.shipping_street || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "address.shipping_street",
                          value: e.target.value,
                        },
                      })
                    }
                  />
                  <Field
                    label="Shipping Landmark"
                    placeholder="Enter Landmark"
                    value={formData.address.shipping_landmark || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "address.shipping_landmark",
                          value: e.target.value,
                        },
                      })
                    }
                  />
                  <Field
                    label="Shipping City"
                    placeholder="Enter City"
                    value={formData.address.shipping_city || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "address.shipping_city",
                          value: e.target.value,
                        },
                      })
                    }
                    disabled
                  />
                  <Field
                    label="Shipping State"
                    placeholder="Enter State"
                    value={formData.address.shipping_state || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "address.shipping_state",
                          value: e.target.value,
                        },
                      })
                    }
                    disabled
                  />
                  <Field
                    label="Shipping Country"
                    placeholder="Enter Country"
                    value={formData.address.shipping_country || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "address.shipping_country",
                          value: e.target.value,
                        },
                      })
                    }
                    disabled
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Select Products Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Select Products</h3>
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
              {showProductTable ? "Hide Product List" : "Select Products"}
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
                          Product Category
                        </TableCell>
                        {/* <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>Brand</TableCell> */}
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Specifications
                        </TableCell>

                        {/* <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
                          Price per Piece
                        </TableCell> */}
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Quantity
                        </TableCell>
                        {/* <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>Asset IDs</TableCell> */}
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
                            <TableCell>{product.product_category}</TableCell>
                            {/* <TableCell>{product.brand}</TableCell> */}
                            <TableCell>
                              <div>
                                <strong>Model:</strong> {product.model}
                              </div>
                              <div>
                                <strong>Processor:</strong> {product.processor}
                              </div>
                              <div>
                                <strong>RAM:</strong> {product.ram}
                              </div>
                              <div>
                                <strong>Storage:</strong> {product.storage}
                              </div>
                              <div>
                                <strong>Graphics:</strong> {product.graphics}
                              </div>
                            </TableCell>
                            {/* <TableCell>
                              {formData.transaction_type === "Rent" ? (
                                <>
                                  <div>
                                    Month: {product.rent_price_per_month}
                                  </div>
                                </>
                              ) : (
                                product.purchase_price
                              )}
                            </TableCell> */}

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
                                  value={quantities[product.id] || ""}
                                  onChange={(e) =>
                                    handleQtyChange(product.id, e.target.value)
                                  }
                                  inputProps={{
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
                            {/* <TableCell>
                              {availableAssetIds[product.id]?.length > 0 && (
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={1}
                                >
                                  {(availableAssetIds[product.id] || []).map(
                                    (assetId, idx) => (
                                      <Box
                                        key={assetId}
                                        display="flex"
                                        alignItems="center"
                                      >
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={(
                                                deviceIds[product.id] || []
                                              ).includes(assetId)}
                                              onChange={(e) => {
                                                const isChecked =
                                                  e.target.checked;
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
                                            />
                                          }
                                          label={assetId}
                                        />
                                      </Box>
                                    )
                                  )}
                                </Box>
                              )}
                            </TableCell> */}
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
          <button
            type="submit"
            style={createBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Create Order
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
  disabled = false, // ✅ added
  required = false,
  error = "",
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
    {type === "select" ? (
      <div>
        <div style={selectWrapperStyle}>
          <select
            style={{
              ...selectStyle,
              borderColor: error ? "red" : "#d1d5db",
              backgroundColor: disabled ? "#f3f4f6" : "white", // ✅ grey background if disabled
            }}
            value={value}
            onChange={onChange}
            disabled={disabled} // ✅ use disabled
            required={required}
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
        {error && (
          <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
            {error}
          </div>
        )}
      </div>
    ) : type === "textarea" ? (
      <>
        <textarea
          placeholder={placeholder}
          style={{
            ...textareaStyle,
            borderColor: error ? "red" : "#d1d5db",
            backgroundColor: disabled ? "#f3f4f6" : "white",
          }}
          rows={3}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled} // ✅ use disabled
          required={required}
        />
        {error && (
          <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
            {error}
          </div>
        )}
      </>
    ) : type === "date" ? (
      <>
        <input
          type="date"
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: error ? "red" : "#d1d5db",
            backgroundColor: disabled ? "#f3f4f6" : "white",
          }}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled} // ✅ use disabled
          required={required}
        />
        {error && (
          <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
            {error}
          </div>
        )}
      </>
    ) : (
      <>
        <input
          type={type}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: error ? "red" : "#d1d5db",
            backgroundColor: disabled ? "#f3f4f6" : "white",
          }}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled} // ✅ use disabled
          required={required}
        />
        {error && (
          <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
            {error}
          </div>
        )}
      </>
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

export default SalesOrdersAddLayoutPage;
