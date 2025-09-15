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
import { useSelector } from "react-redux";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useInventory } from "../../../contexts/InventoryContext";

const SalesOrdersEditLayoutPage = ({ product }) => {
  // State for form data
  const { inventoryData } = useInventory();
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const getAvailableQty = (productId) => {
    const entry = inventoryData.find((item) => item.id === productId);
    return entry ? entry.available_quantity : "N/A";
  };

  const { id } = useParams();
  const navigate = useNavigate();

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
    rental_duration_days: null,
    rental_start_date: null,
    rental_end_date: null,
    order_date: new Date().toISOString().split("T")[0],
    contact_status: "Contacted",
    personalDetails: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
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
  const [originalOrderItems, setOriginalOrderItems] = useState([]);

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
        const response = await fetch(`${API_URL}/orders/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }
        const data = await response.json();

        setOriginalOrderItems(data.items || []);

        // Initialize Asset IDs from order items
        const initialDeviceIds = {};
        data.items?.forEach((item) => {
          initialDeviceIds[item.product_id] = item.device_ids || [];
        });
        setDeviceIds(initialDeviceIds);

        // Rest of your existing code...
        setFormData({
          ...data,
          personalDetails: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            gst_number: "",
            pan_number: "",
            ...data.personalDetails,
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

        const productIds = data.items.map((item) => item.product_id);
        setSelectedProductIds(productIds);

        const productQuantities = {};
        data.items.forEach((item) => {
          productQuantities[item.product_id] = item.requested_quantity;
        });
        setQuantities(productQuantities);

        setLoading((prev) => ({ ...prev, order: false }));
      } catch (err) {
        // Error handling...
      }
    };

    fetchOrderData();
  }, [id]);

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

    try {
      // Fetch the selected quotation details
      const quotationResponse = await fetch(
        `${API_URL}/quotations/${quotationId}`,
        {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        }
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
        rental_duration_days: quotationData.rental_duration_days || "",
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
          gst_number: quotationData.personalDetails?.gst_number || "",
          pan_number: quotationData.personalDetails?.pan_number || "",
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
            purchase_price: item.purchase_price,
            rent_price_per_month: item.rent_price_per_month,
            offer_purchase_price: item.offer_purchase_price,
            offer_rent_price_per_month: item.offer_rent_price_per_month,
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

    // Prepare items array with Asset IDs AND PRICING INFORMATION
    const orderItems = selectedProductIds.map((productId) => {
      const product = products.find((p) => p.id === productId);

      // Find the original item to get pricing data
      const originalItem =
        originalOrderItems.find((item) => item.product_id === productId) ||
        formData.items.find((item) => item.product_id === productId);

      return {
        product_id: productId,
        product_name: product?.product_name || "Unknown Product",
        requested_quantity: quantities[productId] || 1,
        device_ids: deviceIds[productId] || [],
        // Include all pricing information from the original item
        purchase_price: originalItem?.purchase_price || 0,
        offer_purchase_price: originalItem?.offer_purchase_price || 0,
        rent_price_per_month: originalItem?.rent_price_per_month || 0,
        offer_rent_price_per_month:
          originalItem?.offer_rent_price_per_month || 0,
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
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.errors && Array.isArray(errorData.errors)) {
          const messages = errorData.errors
            .map((err) => `• ${err.message}`)
            .join("\n");

          throw new Error(
            `${errorData.message || "Update failed"}\n${messages}`
          );
        }

        throw new Error(errorData.message || "Failed to update order");
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
        message: err.message,
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
                onChange={(e) => {
                  handleChange({
                    target: { name: "transaction_type", value: e.target.value },
                  });

                  // Clear rental fields when switching to Buy
                  if (e.target.value === "Buy") {
                    setFormData((prev) => ({
                      ...prev,
                      rental_duration: null,
                      rental_start_date: null,
                      rental_end_date: null,
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
                options={[
                  "Pending",
                  "Approved",
                  "Rejected",
                  "Completed",
                  "Cancelled",
                ]}
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
              {/* <Field
                label="Order Generated By"
                placeholder="Generated By"
                value={formData.order_generated_by}
                readOnly
              /> */}
              {formData.transaction_type === "Rent" && (
                <>
                  <Field
                    label="Rental Duration (months)"
                    placeholder="Enter Duration"
                    type="number"
                    value={formData.rental_duration || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "rental_duration",
                          value: e.target.value,
                        },
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
                        target: {
                          name: "rental_end_date",
                          value: e.target.value,
                        },
                      })
                    }
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
              {/* <Field
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
              /> */}
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
              <Field
                label="PAN Number"
                placeholder="Enter PAN Number"
                value={formData.personalDetails.pan_number}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "personalDetails.pan_number",
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
                              selectedProductIds.length > 0 &&
                              selectedProductIds.length ===
                                filteredProducts.length
                            }
                            indeterminate={
                              selectedProductIds.length > 0 &&
                              selectedProductIds.length <
                                filteredProducts.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds(
                                  filteredProducts.map((p) => p.id)
                                );
                                const newQuantities = {};
                                filteredProducts.forEach((p) => {
                                  newQuantities[p.id] = quantities[p.id] || 1;
                                });
                                setQuantities(newQuantities);
                              } else {
                                setSelectedProductIds([]);
                                setQuantities({});
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
                          Product Category
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Specifications
                        </TableCell>
                        {/* <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>Available Qty</TableCell> */}
                        {/* <TableCell sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>Price per Piece</TableCell> */}
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredProducts.map((product) => {
                        const isSelected = selectedProductIds.includes(
                          product.id
                        );
                        return (
                          <TableRow key={product.id}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedProductIds((prev) =>
                                      prev.filter((id) => id !== product.id)
                                    );
                                    const updatedQuantities = { ...quantities };
                                    delete updatedQuantities[product.id];
                                    setQuantities(updatedQuantities);
                                  } else {
                                    setSelectedProductIds((prev) => [
                                      ...prev,
                                      product.id,
                                    ]);
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [product.id]: prev[product.id] || 1,
                                    }));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{product.product_name}</TableCell>
                            <TableCell>{product.product_category}</TableCell>
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
                            {/* <TableCell>{getAvailableQty(product.id)}</TableCell> */}
                            {/* <TableCell>
              <strong>Month:</strong> ₹{product.rent_price_per_month}
            </TableCell> */}
                            <TableCell>
                              {isSelected ? (
                                <Box display="flex" alignItems="center">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [product.id]: Math.max(
                                          (prev[product.id] || 1) - 1,
                                          1
                                        ),
                                      }))
                                    }
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={quantities[product.id] || ""}
                                    onChange={(e) => {
                                      const value = Math.max(
                                        Number(e.target.value),
                                        1
                                      );
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [product.id]: value,
                                      }));
                                    }}
                                    inputProps={{
                                      min: 1,
                                      style: { width: 50, textAlign: "center" },
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setQuantities((prev) => ({
                                        ...prev,
                                        [product.id]:
                                          (prev[product.id] || 1) + 1,
                                      }))
                                    }
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
