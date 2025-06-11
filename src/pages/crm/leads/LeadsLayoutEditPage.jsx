import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL from "../../../api/Api_url";

const LeadsLayoutEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const LoginUserName = user.full_name;

  const [formData, setFormData] = useState({
    leadId: "",
    leadTitle: "",
    transactionType: "",
    leadStatus: "",
    sourceOfEnquiry: "",
    rentalDuration: "",
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

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showProductTable, setShowProductTable] = useState(false);
  const [loading, setLoading] = useState({
    customers: true,
    products: true,
    lead: true,
  });
  const [error, setError] = useState({
    customers: "",
    products: "",
    lead: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

 useEffect(() => {
  const fetchLead = async () => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lead");
      }
      const data = await response.json();

      // Format dates
      const rentalStartDate = data.rental_start_date
        ? new Date(data.rental_start_date)
        : new Date();
      const rentalEndDate = data.rental_end_date
        ? new Date(data.rental_end_date)
        : new Date();
      const leadDate = data.lead_date ? new Date(data.lead_date) : new Date();

      // Set form data
      setFormData({
        leadId: data.lead_id || "",
        leadTitle: data.lead_title || "",
        transactionType: data.transaction_type || "",
        leadStatus: data.lead_source || "",
        sourceOfEnquiry: data.source_of_enquiry || "",
        rentalDuration: data.rental_duration_months || "",
        rentalStartDate,
        rentalEndDate,
        leadDate,
        owner: data.owner || "",
        remarks: data.remarks || "",
        leadGeneratedBy: data.lead_generated_by || LoginUserName,
        activeStatus: !!data.is_active,
        selectedCustomer: data.contact_id ? data.contact_id.toString() : "",
        customerId: data.contact?.customer_id || "",
        firstName: data.contact?.first_name || "",
        lastName: data.contact?.last_name || "",
        email: data.contact?.email || "",
        phoneNumber: data.contact?.phone_number || "",
        companyName: data.contact?.company_name || "",
        industry: data.contact?.industry || "",
        street: data.contact?.address?.street || "",
        landmark: data.contact?.address?.landmark || "",
        pincode: data.contact?.address?.zip || "",
        city: data.contact?.address?.city || "",
        state: data.contact?.address?.state || "",
        country: data.contact?.address?.country || "",
        gst: data.contact?.gst || "",
        panNo: data.contact?.pan_no || "",
        paymentType: data.contact?.payment_type || "",
      });

      // Fixed product selection part
      if (data.lead_products && data.lead_products.length > 0) {
        const productIds = data.lead_products.map((lp) => lp.product_id);
        const productQuantities = data.lead_products.reduce((acc, lp) => {
          acc[lp.product_id] = lp.quantity;
          return acc;
        }, {});

        setSelectedProductIds(productIds);
        setQuantities(productQuantities);
      }

      setLoading((prev) => ({ ...prev, lead: false }));
    } catch (err) {
      setError((prev) => ({ ...prev, lead: err.message }));
      setLoading((prev) => ({ ...prev, lead: false }));
      setSnackbar({
        open: true,
        message: "Failed to load lead data",
        severity: "error",
      });
    }
  };

  fetchLead();
}, [id, LoginUserName]);

  // Fetch active contacts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/contacts/active-contacts`);
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
        pincode: selectedCustomer.address?.zip || "",
        city: selectedCustomer.address?.city || "",
        state: selectedCustomer.address?.state || "",
        country: selectedCustomer.address?.country || "",
        gst: selectedCustomer.gst || "",
        panNo: selectedCustomer.pan_no || "",
        paymentType: selectedCustomer.payment_type || "",
        owner: selectedCustomer.owner || "",
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch location data when pincode changes
  useEffect(() => {
    const fetchLocationData = async () => {
      if (formData.pincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${formData.pincode}`
          );
          const data = await response.json();

          if (data && data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];

            setFormData((prev) => ({
              ...prev,
              country: "India",
              state: postOffice.State,
              city: postOffice.District,
            }));
          } else {
            setSnackbar({
              open: true,
              message: "Invalid Pincode. Please enter a valid one.",
              severity: "error",
            });
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setSnackbar({
            open: true,
            message: "Error fetching location. Try again.",
            severity: "error",
          });
        }
      }
    };

    fetchLocationData();
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
  };

  const incrementQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  const handleSubmit = async () => {
    try {
      const selectedProducts = selectedProductIds.map((id) => ({
      product_id: id,
      product_name: products.find((p) => p.id === id)?.name || "",
      quantity: quantities[id] || 1,
    }));

      const payload = {
        lead_id: formData.leadId,
        lead_title: formData.leadTitle,
        transaction_type: formData.transactionType,
        lead_source: formData.leadStatus,
        source_of_enquiry: formData.sourceOfEnquiry,
        rental_duration_months: formData.rentalDuration,
        rental_start_date: formData.rentalStartDate.toISOString().split("T")[0],
        rental_end_date: formData.rentalEndDate.toISOString().split("T")[0],
        lead_date: formData.leadDate.toISOString().split("T")[0],
        owner: formData.owner,
        remarks: formData.remarks,
        lead_generated_by: formData.leadGeneratedBy,
        is_active: formData.activeStatus,
        contact_id: parseInt(formData.selectedCustomer),
      lead_products: selectedProducts,  // Changed from selected_products to lead_products
      };

      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead");
      }

      setSnackbar({
        open: true,
        message: "Lead updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/lead");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update lead: " + err.message,
        severity: "error",
      });
    }
  };

  if (loading.lead) {
    return <div style={containerStyle}>Loading lead data...</div>;
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
        <h1 style={titleStyle}>Edit Lead</h1>
        <p style={subtitleStyle}>Edit the details below to update this lead</p>
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
            />
            <Field
              label="Lead Title"
              placeholder="Enter Lead Title"
              value={formData.leadTitle}
              onChange={(value) => handleInputChange("leadTitle", value)}
            />
            <Field
              label="Transaction Type"
              type="select"
              placeholder="Select Transaction Type"
              value={formData.transactionType}
              onChange={(value) => handleInputChange("transactionType", value)}
              options={["Rent", "Buy"]}
            />
            <Field
              label="Lead Status"
              type="select"
              placeholder="Select Lead Status"
              value={formData.leadStatus}
              onChange={(value) => handleInputChange("leadStatus", value)}
              options={[
                "New",
                "Contacted",
                "Qualified",
                "Proposal Sent",
                "Negotiation",
                "Closed Won",
                "Closed Lost",
              ]}
            />
            <Field
              label="Source of Enquiry"
              type="select"
              placeholder="Select Source of Enquiry"
              value={formData.sourceOfEnquiry}
              onChange={(value) => handleInputChange("sourceOfEnquiry", value)}
              options={[
                "Search Engine",
                "Referral",
                "Social Media",
                "Email",
                "Cold Call",
                "Existing Customer",
              ]}
            />
            <Field
              label="Rental Duration (Months)"
              placeholder="Enter Rental Duration"
              value={formData.rentalDuration}
              onChange={(value) => handleInputChange("rentalDuration", value)}
              type="number"
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Rental Start Date</label>
                  <DatePicker
                    value={formData.rentalStartDate}
                    onChange={(date) =>
                      handleInputChange("rentalStartDate", date)
                    }
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
            <div style={{ gridColumn: "1 / -1" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={dateFieldContainer}>
                  <label style={labelStyle}>Rental End Date</label>
                  <DatePicker
                    value={formData.rentalEndDate}
                    onChange={(date) =>
                      handleInputChange("rentalEndDate", date)
                    }
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
            <Field
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
              label="Customer"
              type="select"
              placeholder="Select Customer"
              value={formData.selectedCustomer}
              onChange={handleCustomerChange}
              options={customers.map((customer) => ({
                value: customer.id.toString(),
                label: `${customer.first_name} ${customer.last_name} (${customer.company_name})`,
              }))}
            />
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
            <Field
              label="Payment Type"
              type="select"
              placeholder="Select Payment Type"
              value={formData.paymentType}
              onChange={(value) => handleInputChange("paymentType", value)}
              options={["Prepaid", "Postpaid", "COD", "Net 30", "Net 60"]}
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
              label="Street"
              placeholder="Enter Street"
              value={formData.street}
              onChange={(value) => handleInputChange("street", value)}
            />
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
                style={checkboxStyle}
                checked={formData.activeStatus}
                onChange={(e) =>
                  handleInputChange("activeStatus", e.target.checked)
                }
              />
              <div style={checkboxCustomStyle}>
                {formData.activeStatus && <span style={checkmarkStyle}>✓</span>}
              </div>

              <div>
                <span style={checkboxTextStyle}>Active Status</span>
              </div>
            </label>
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
                      <TableCell sx={{ color: "#fff" }}>Product Name</TableCell>
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
          >
            <Remove fontSize="small" />
          </IconButton>
          <TextField
            type="number"
            size="small"
            value={quantities[product.id] || 0}
            onChange={(e) =>
              handleQtyChange(product.id, e.target.value)
            }
            inputProps={{
              min: 0,
              style: { width: 50, textAlign: "center" },
            }}
          />
          <IconButton
            size="small"
            onClick={() => incrementQty(product.id)}
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
          Update Lead
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
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={{ ...selectStyle, opacity: disabled ? 0.7 : 1 }}
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
        style={textareaStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        disabled={disabled}
      />
    ) : type === "date" ? (
      <input
        type="date"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
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

export default LeadsLayoutEditPage;
