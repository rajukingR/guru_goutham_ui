import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";
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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL, POSTAL_API } from "../../../api/Api_url";
import { useNavigate } from "react-router-dom";
import { generateSpecifications } from "../../../utils/generateSpecifications";

const generateLeadId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LD-${randomPart}`;
};

const LeadsLayoutAddPage = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const LoginUserName = user.full_name;
  const navigate = useNavigate();
  const [postOffices, setPostOffices] = useState([]);

  const [formData, setFormData] = useState({
    leadId: "",
    leadTitle: "",
    transactionType: "",
    leadStatus: "",
    leadSource: "",
    sourceOfEnquiry: "",
    rentalDuration: "",
    rentalDurationDays: "",
    rentalStartDate: new Date(),
    rentalEndDate: new Date(),
    leadDate: new Date(),
    owner: "",
    remarks: "",
    leadGeneratedBy: "",
    activeStatus: true,
    selectedCustomer: "",
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    industry: "",
    street: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    gst: "",
    panNo: "",
    paymentType: "",
  });

  const [errors, setErrors] = useState({
    transactionType: "",
    selectedCustomer: "",
    paymentType: "",
    products: "",
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showProductTable, setShowProductTable] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const [loading, setLoading] = useState({
    customers: true,
    products: true,
  });
  const [error, setError] = useState({
    customers: "",
    products: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      leadId: generateLeadId(),
    }));
  }, []);

  useEffect(() => {
    if (LoginUserName) {
      setFormData((prev) => ({
        ...prev,
        leadGeneratedBy: LoginUserName,
      }));
    }
  }, [LoginUserName]);

  const validateForm = () => {
    const newErrors = {
      transactionType: "",
      selectedCustomer: "",
      paymentType: "",
      products: "",
    };
    let isValid = true;

    // Validate transaction type
    if (!formData.transactionType) {
      newErrors.transactionType = "Transaction type is required";
      isValid = false;
    }

    // Validate customer selection
    if (!formData.selectedCustomer) {
      newErrors.selectedCustomer = "Customer selection is required";
      isValid = false;
    }

    // Validate payment type if transaction is Rent
    if (formData.transactionType === "Rent" && !formData.paymentType) {
      newErrors.paymentType = "Payment type is required for rental";
      isValid = false;
    }

    // Validate product selection and quantities
    if (selectedProductIds.length === 0) {
      newErrors.products = "At least one product must be selected";
      isValid = false;
    } else {
      // Check if all selected products have quantity >= 1
      for (const id of selectedProductIds) {
        if (!quantities[id] || quantities[id] < 1) {
          newErrors.products = "All selected products must have quantity ≥ 1";
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fetch active contacts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/contacts/active-contacts`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data);
        setLoading((prev) => ({ ...prev, customers: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, customers: err.message }));
        setLoading((prev) => ({ ...prev, customers: false }));
        setSnackbar({
          open: true,
          message: "Failed to load customers",
          severity: "error",
        });
      }
    };

    fetchCustomers();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product-templete/without-active`, {
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

  // Handle customer selection change
  const handleCustomerChange = (customerId) => {
    const selectedCustomer = customers.find(
      (c) => c.id.toString() === customerId
    );
    if (selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        selectedCustomer: customerId,
        customerId: selectedCustomer.customer_id,
        firstName: selectedCustomer.first_name,
        lastName: selectedCustomer.last_name,
        email: selectedCustomer.email,
        phoneNumber: selectedCustomer.phone_number,
        companyName: selectedCustomer.company_name,
        industry: selectedCustomer.industry,
        street: selectedCustomer.address?.street || "",
        pincode: selectedCustomer.address?.pincode || "",
        city: selectedCustomer.address?.city || "",
        state: selectedCustomer.address?.state || "",
        country: selectedCustomer.address?.country || "",
        gst: selectedCustomer.gst || "",
        panNo: selectedCustomer.pan_no || "",
        payment_type: selectedCustomer.payment_type || "",
        owner: selectedCustomer.owner || "",
      }));

      setCustomerSearchTerm("");
    }
    // Clear customer error when selection changes
    if (errors.selectedCustomer) {
      setErrors((prev) => ({ ...prev, selectedCustomer: "" }));
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "transactionType") {
      setFormData((prev) => ({ ...prev, [field]: value, paymentType: "" }));
      // Clear transaction type error when changed
      if (errors.transactionType) {
        setErrors((prev) => ({ ...prev, transactionType: "" }));
      }
    } else if (field === "paymentType") {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear payment type error when changed
      if (errors.paymentType) {
        setErrors((prev) => ({ ...prev, paymentType: "" }));
      }
    } else if (field === "rentalDuration") {
      const months = Math.max(0, parseInt(value) || 0);
      setFormData((prev) => ({ ...prev, rentalDuration: months }));
    } else if (field === "rentalDurationDays") {
      const days = Math.max(0, parseInt(value) || 0);
      setFormData((prev) => ({ ...prev, rentalDurationDays: days }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationData = async () => {
      const pincode = formData.pincode;

      if (pincode && pincode.length === 6) {
        try {
          const response = await fetch(`${POSTAL_API}/${pincode}`);
          const result = await response.json();

          // If API returns PostOffice array
          if (Array.isArray(result) && result.length > 0 && result[0]?.PostOffice) {
            const postOffices = result[0].PostOffice;
            setPostOffices(postOffices);

            const first = postOffices[0];
            setFormData((prev) => ({
              ...prev,
              city: first.District || "",
              state: first.State || "",
              country: first.Country || "India",
              street: first.Name || "",
            }));
          }
          // If API returns result.data format
          else if (result?.data) {
            const info = result.data;
            setFormData((prev) => ({
              ...prev,
              city: info.district_name || "",
              state: info.state_name || "",
              country: "India",
            }));
          } else {
            setPostOffices([]);
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
      fetchLocationData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formData.pincode]);



  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQtyChange = (id, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities({ ...quantities, [id]: qty });
    // Clear products error when quantity changes
    if (errors.products) {
      setErrors((prev) => ({ ...prev, products: "" }));
    }
  };

  const incrementQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    // Clear products error when quantity changes
    if (errors.products) {
      setErrors((prev) => ({ ...prev, products: "" }));
    }
  };

  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
    // Clear products error when quantity changes
    if (errors.products) {
      setErrors((prev) => ({ ...prev, products: "" }));
    }
  };

  const handleProductSelection = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
    // Clear products error when selection changes
    if (errors.products) {
      setErrors((prev) => ({ ...prev, products: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the validation errors",
        severity: "error",
      });
      return;
    }

    if (
      parseInt(formData.rentalDuration) === 0 &&
      parseInt(formData.rentalDurationDays) < 1
    ) {
      setSnackbar({
        open: true,
        message: "Please enter at least 1 rental day if months is 0.",
        severity: "error",
      });
      return;
    }

    try {
      const selectedProducts = selectedProductIds.map((id) => ({
        product_id: id,
        product_name: products.find((p) => p.id === id)?.name || "",
        quantity: quantities[id] || 1,
      }));

      const payload = {
        lead_id: formData.leadId,
        lead_title: formData.leadTitle,
        lead_source: formData.leadSource,
        transaction_type: formData.transactionType,
        payment_type: formData.paymentType,
        source_of_enquiry: formData.sourceOfEnquiry,
        rental_duration_months: formData.rentalDuration,
        rental_duration_days: formData.rentalDurationDays,
        rental_start_date: formData.rentalStartDate.toISOString().split("T")[0],
        rental_end_date: formData.rentalEndDate.toISOString().split("T")[0],
        lead_date: formData.leadDate.toISOString().split("T")[0],
        owner: formData.owner,
        remarks: formData.remarks,
        lead_generated_by: formData.leadGeneratedBy,
        is_active: formData.activeStatus,
        contact_id: parseInt(formData.selectedCustomer),
        selected_products: selectedProducts,
      };

      const response = await fetch(`${API_URL}/leads/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      setSnackbar({
        open: true,
        message: "Lead created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/lead");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to create lead: " + err.message,
        severity: "error",
      });
    }
  };

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
        <h1 style={titleStyle}>Create a new Lead</h1>
        <p style={subtitleStyle}>
          Fill in the details below to create a new lead
        </p>
      </div>

      <div style={formContainerStyle}>
        {/* Lead Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Lead Information</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Lead ID"
              placeholder="Enter Lead ID"
              value={formData.leadId}
              onChange={(value) => handleInputChange("leadId", value)}
              disabled
            />

            <Field
              label="Source of Enquiry"
              type="select"
              placeholder="Select Source"
              value={formData.sourceOfEnquiry}
              onChange={(value) => handleInputChange("sourceOfEnquiry", value)}
              options={[
                "Website",
                "Referral",
                "Social Media",
                "Email Campaign",
                "Phone Inquiry",
                "Other",
              ]}
            />

            <Field
              label="Reference name"
              placeholder="Enter reference name"
              value={formData.leadSource}
              onChange={(value) => handleInputChange("leadSource", value)}
            />

            <Field
              label="Transaction Type"
              type="select"
              placeholder="Select Transaction Type"
              value={formData.transactionType}
              onChange={(value) => handleInputChange("transactionType", value)}
              options={[
                { value: "Rent", label: "Rent" },
                { value: "Buy", label: "Sale" },
              ]}
              required
              error={errors.transactionType}
            />
            {formData.transactionType === "Rent" && (
              <Field
                label="Payment Type"
                type="select"
                placeholder="Select Payment Type"
                value={formData.paymentType}
                onChange={(value) => handleInputChange("paymentType", value)}
                options={["Prepaid", "Postpaid"]}
                required
                error={errors.paymentType}
              />
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Lead Date</label>
                  <DatePicker
                    value={formData.leadDate}
                    onChange={(date) => handleInputChange("leadDate", date)}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div style={dateInputWrapper}>
                        <input
                          ref={inputRef}
                          {...inputProps}
                          style={dateInputStyle}
                        />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />
                </div>
              </LocalizationProvider>
            </div>
            {/* <Field
              label="Owner"
              placeholder="Enter Owner Name"
              value={formData.owner}
              onChange={(value) => handleInputChange("owner", value)}
            />
            <Field
              label="Remarks"
              placeholder="Enter Remarks"
              type="textarea"
              value={formData.remarks}
              onChange={(value) => handleInputChange("remarks", value)}
            />
            <Field
              label="Lead Generated By"
              placeholder="Enter Lead Generated By"
              value={formData.leadGeneratedBy}
              disabled
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
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Customer <span style={requiredStyle}>*</span>
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.selectedCustomer || ""}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    displayEmpty
                    style={{
                      ...inputStyle,
                      borderColor: errors.selectedCustomer ? "red" : "#d1d5db",
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 },
                      },
                      onEntered: () => setCustomerSearchTerm(""), // 🔥 RESET SEARCH WHEN DROPDOWN OPENS
                    }}
                    renderValue={(selected) => {
                      if (!selected) return <em>Select Customer</em>;

                      const cust = customers.find(
                        (c) => c.id.toString() === selected
                      );

                      return cust
                        ? `${cust.first_name} ${cust.last_name} (${cust.company_name})`
                        : "Select Customer";
                    }}
                  >
                    {/* 🔎 Search Box Inside Dropdown */}
                    <div
                      style={{
                        padding: "8px",
                        position: "sticky",
                        top: 0,
                        background: "#fff",
                        zIndex: 1,
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search Customer..."
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()} // IMPORTANT
                      />
                    </div>

                    {/* ⭐ Smart Multi-Word Search Filter */}
                    {customers
                      .filter((c) => {
                        const term = customerSearchTerm.trim().toLowerCase();
                        const words = term.split(" ").filter(Boolean);

                        const fullName = `${c.first_name} ${c.last_name} ${c.company_name}`
                          .toLowerCase();

                        // 🧠 All words typed must exist anywhere in the text
                        return words.every((w) => fullName.includes(w));
                      })
                      .map((c) => (
                        <MenuItem key={c.id} value={c.id.toString()}>
                          {c.first_name} {c.last_name} ({c.company_name})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {/* Error Message */}
                {errors.selectedCustomer && (
                  <span style={{ color: "red", fontSize: "0.75rem" }}>
                    Customer selection is required
                  </span>
                )}
              </div>
            </div>


            <Field
              label="Customer ID"
              placeholder="Enter Customer ID"
              value={formData.customerId}
              onChange={(value) => handleInputChange("customerId", value)}
              disabled
            />
            <Field
              label="First Name"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(value) => handleInputChange("firstName", value)}
            />
            <Field
              label="Last Name"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(value) => handleInputChange("lastName", value)}
            />
            <Field
              label="Email"
              placeholder="Enter Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
            />
            <Field
              label="Phone Number"
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange("phoneNumber", value)}
            />
            <Field
              label="Company Name"
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={(value) => handleInputChange("companyName", value)}
            />
            <Field
              label="Industry"
              placeholder="Enter Industry"
              value={formData.industry}
              onChange={(value) => handleInputChange("industry", value)}
            />
            <Field
              label="GST Number"
              placeholder="Enter GST Number"
              value={formData.gst}
              onChange={(value) => handleInputChange("gst", value)}
            />
            <Field
              label="PAN Number"
              placeholder="Enter PAN Number"
              value={formData.panNo}
              onChange={(value) => handleInputChange("panNo", value)}
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
            {/* <Field
              label="Street"
              placeholder="Enter Street"
              value={formData.street}
              onChange={(value) => handleInputChange("street", value)}
            /> */}
            <Field
              label="Landmark"
              placeholder="Enter Landmark"
              value={formData.landmark}
              onChange={(value) => handleInputChange("landmark", value)}
            />
            <Field
              label="Pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(value) => handleInputChange("pincode", value)}
            />
            <Field
              label="City"
              placeholder="Enter City"
              value={formData.city}
              onChange={(value) => handleInputChange("city", value)}
            />
            <Field
              label="State"
              placeholder="Enter State"
              value={formData.state}
              onChange={(value) => handleInputChange("state", value)}
            />
            <Field
              label="Country"
              placeholder="Enter Country"
              value={formData.country}
              onChange={(value) => handleInputChange("country", value)}
            />
          </div>
        </div>

        {/* Control Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Configuration</h3>
          </div>
          <div style={checkboxContainerStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                style={{
                  ...checkboxStyle,
                  position: "absolute",
                  opacity: 0,
                  cursor: "pointer",
                }}
                checked={formData.activeStatus}
                onChange={(e) =>
                  handleInputChange("activeStatus", e.target.checked)
                }
              />
              <div style={checkboxCustomStyle}>
                {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
              </div>
              <span style={checkboxTextStyle}>Active Status</span>
            </label>
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>Select Products</h3>
          {errors.products && (
            <div style={{ color: "#ef4444", marginLeft: "1rem" }}>
              {errors.products}
            </div>
          )}
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <button
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
                      .slice()
                      .sort((a, b) => {
                        const aSelected = selectedProductIds.includes(a.id);
                        const bSelected = selectedProductIds.includes(b.id);

                        if (aSelected === bSelected) return 0;
                        if (aSelected && !bSelected) return -1;
                        return 1;
                      })
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() => handleProductSelection(product.id)}
                            />
                          </TableCell>
                          <TableCell>{product.product_name}</TableCell>

                          <TableCell>{generateSpecifications(product)}</TableCell>

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
          style={cancelBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          onClick={() => navigate("/dashboard/crm/lead")}
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onClick={handleSubmit}
        >
          Create Lead
        </button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  error = "",
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
            opacity: disabled ? 0.7 : 1,
            borderColor: error ? "#ef4444" : "#d1d5db",
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) =>
            typeof option === "object" ? (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ) : (
              <option key={option} value={option}>
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
        style={{
          ...textareaStyle,
          borderColor: error ? "#ef4444" : "#d1d5db",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        disabled={disabled}
      />
    ) : type === "date" ? (
      <input
        type="date"
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: error ? "#ef4444" : "#d1d5db",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: error ? "#ef4444" : "#d1d5db",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    )}
    {error && (
      <div
        style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}
      >
        {error}
      </div>
    )}
  </div>
);
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

const requiredStyle = {
  color: "#ef4444",
  marginLeft: "0.25rem",
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

const checkboxContainerStyle = {
  marginTop: "0.5rem",
};
const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  gap: "8px",
  position: "relative",
};

const checkboxStyle = {
  width: 0,
  height: 0,
  opacity: 0,
  position: "absolute",
};

const checkboxCustomStyle = {
  width: "20px",
  height: "20px",
  border: "2px solid #007bff",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
};

const checkmarkStyle = {
  color: "#007bff",
  fontSize: "16px",
  fontWeight: "bold",
};

const checkboxTextStyle = {
  fontSize: "14px",
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

const productsSectionStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 1.5rem",
};

const sectionTitleStyle = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "1rem",
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
};

const dateFieldContainer = {
  width: "100%",
  marginBottom: "1rem",
};

const dateInputWrapper = {
  position: "relative",
  width: "100%",
};

const dateInputStyle = {
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

export default LeadsLayoutAddPage;
