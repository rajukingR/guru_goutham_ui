import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

import API_URL from "../../../api/Api_url";

const QuotationsAddLayoutPage = () => {
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    leads: true,
    products: true,
  });
  const [error, setError] = useState({
    leads: null,
    products: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showProductTable, setShowProductTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const [formData, setFormData] = useState({
    quotationId: "",
    quotationTitle: "",
    leadId: "",
    transactionType: "",
    quotationStatus: "Pending",
    sourceOfEnquiry: "",
    owner: "",
    remarks: "",
    quotationGeneratedBy: "",
    activeStatus: true,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    rentalDurationMonths: "",
    rentalStartDate: "",
    rentalEndDate: "",
    quotationDate: new Date().toISOString().split("T")[0],
    industry: "",
    street: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
  });

  // Fetch active leads
  useEffect(() => {
    const fetchActiveLeads = async () => {
      try {
        const response = await fetch(`${API_URL}/leads/active-leads`);
        if (!response.ok) {
          throw new Error("Failed to fetch active leads");
        }
        const data = await response.json();
        setLeads(data);
        setLoading((prev) => ({ ...prev, leads: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, leads: err.message }));
        setLoading((prev) => ({ ...prev, leads: false }));
        setSnackbar({
          open: true,
          message: "Failed to load active leads",
          severity: "error",
        });
      }
    };

    fetchActiveLeads();
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

  // Handle lead selection change
const handleLeadChange = (leadId) => {
  setSelectedLeadId(leadId);
  const selectedLead = leads.find((lead) => lead.id === parseInt(leadId));

  if (selectedLead) {
    setFormData((prev) => ({
      ...prev,
      leadId: selectedLead.lead_id,
      leadTitle: selectedLead.lead_title,
      transactionType: selectedLead.transaction_type,
      sourceOfEnquiry: selectedLead.source_of_enquiry,
      owner: selectedLead.owner,
      remarks: selectedLead.remarks,
      quotationGeneratedBy: selectedLead.lead_generated_by,
      activeStatus: selectedLead.is_active,
      firstName: selectedLead.contact?.first_name || "",
      lastName: selectedLead.contact?.last_name || "",
      email: selectedLead.contact?.email || "",
      phoneNumber: selectedLead.contact?.phone_number || "",
      rentalDurationMonths: selectedLead.rental_duration_months || "",
      rentalStartDate: selectedLead.rental_start_date || "",
      rentalEndDate: selectedLead.rental_end_date || "",
      industry: selectedLead.contact?.industry || "",
      street: selectedLead.contact?.address?.street || "",
      pincode: selectedLead.contact?.address?.zip || "",
      city: selectedLead.contact?.address?.city || "",
      state: selectedLead.contact?.address?.state || "",
      country: selectedLead.contact?.address?.country || "India",
    }));

    // Auto-select products from the lead - UPDATED CODE
    if (selectedLead.lead_products && selectedLead.lead_products.length > 0) {
      const productIds = selectedLead.lead_products.map(
        (product) => product.product_id
      );
      setSelectedProductIds(productIds);

      const productQuantities = {};
      selectedLead.lead_products.forEach((product) => {
        productQuantities[product.product_id] = product.quantity;
      });
      setQuantities(productQuantities);
    }
  }
};
  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const quotationPayload = {
      quotation_id: formData.quotationId,
      quotation_title: formData.quotationTitle,
      lead_id: selectedLeadId,
      rental_start_date: formData.rentalStartDate,
      rental_end_date: formData.rentalEndDate,
      quotation_date: formData.quotationDate,
      rental_duration: parseInt(formData.rentalDurationMonths) || 0,
      remarks: formData.remarks,
      quotation_generated_by: formData.quotationGeneratedBy,
      status: formData.quotationStatus,
      items: selectedProductIds.map((productId) => {
        const product = products.find((p) => p.id === productId);
        // Get quantity from lead products if available
        const leadProduct = selectedLeadId
          ? leads
              .find((lead) => lead.id === parseInt(selectedLeadId))
              ?.lead_products?.find((lp) => lp.product_id === productId)
          : null;
        
        return {
          product_id: productId,
          requested_quantity: leadProduct?.quantity || 1,
          quotation_quantity: quantities[productId] || 0,
          product_name: product?.product_name || "",
        };
      }),
    };

      const response = await fetch(`${API_URL}/quotations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotationPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to create quotation");
      }

      const result = await response.json();
      console.log("Quotation created:", result);

      setSnackbar({
        open: true,
        message: "Quotation created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/quotations");
      }, 1500);

      // Reset form if needed
      setFormData((prev) => ({ ...prev, quotationTitle: "", remarks: "" }));
      setSelectedProductIds([]);
      setQuantities({});
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbar({
        open: true,
        message: "Error creating quotation. Please try again.",
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
        <h1 style={titleStyle}>Create a new Quotation</h1>
        <p style={subtitleStyle}>
          Fill in the details below to create a new quotation
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Quotation Information Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📋</div>
              <h3 style={cardHeaderStyle}>Quotation Information</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Quotation ID"
                placeholder="Enter Quotation ID"
                value={formData.quotationId}
                onChange={(e) =>
                  handleInputChange("quotationId", e.target.value)
                }
              />
              <Field
                label="Quotation Title"
                placeholder="Enter Quotation Title"
                value={formData.quotationTitle}
                onChange={(e) =>
                  handleInputChange("quotationTitle", e.target.value)
                }
              />
              <Field
                label="Lead Details"
                type="select"
                placeholder="Select Lead"
                value={selectedLeadId || ""}
                onChange={(e) => handleLeadChange(e.target.value)}
                options={leads.map((lead) => ({
                  value: lead.id,
                  label: `${lead.lead_id} - ${lead.contact.first_name} ${lead.contact.last_name}`,
                }))}
              />
              <Field
                label="Lead ID"
                placeholder="Enter Lead ID"
                value={formData.leadId}
                readOnly
              />
              <Field
                label="Transaction Type"
                type="select"
                placeholder="Select Type"
                value={formData.transactionType}
                onChange={(e) =>
                  handleInputChange("transactionType", e.target.value)
                }
                options={["Rent", "Buy"]}
              />
              <Field
                label="Quotation Status"
                type="select"
                placeholder="Select Status"
                value={formData.quotationStatus}
                onChange={(e) =>
                  handleInputChange("quotationStatus", e.target.value)
                }
                options={["Pending", "Approved", "Rejected"]}
              />
              <Field
                label="Source of Enquiry"
                type="select"
                placeholder="Select Source"
                value={formData.sourceOfEnquiry}
                onChange={(e) =>
                  handleInputChange("sourceOfEnquiry", e.target.value)
                }
                options={["Search Engine", "Referral", "Advertisement"]}
              />
              <Field
                label="Owner"
                placeholder="Enter Owner Name"
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
              />
              <Field
                label="Remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
              />
              <Field
                label="Quotation Generated By"
                placeholder="Enter Name"
                value={formData.quotationGeneratedBy}
                disabled
              />
              <div style={{ gridColumn: "1 / -1" }}>
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
                    {formData.activeStatus && (
                      <span style={checkmarkStyle}>✓</span>
                    )}
                  </div>
                  <span style={checkboxTextStyle}>Active Status</span>
                </label>
              </div>
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
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              <Field
                label="Last Name"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              <Field
                label="Email ID"
                placeholder="Enter Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <Field
                label="Phone Number"
                placeholder="Enter Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
              <Field
                label="Rental Duration (Months)"
                placeholder="Enter Duration"
                type="number"
                value={formData.rentalDurationMonths}
                onChange={(e) =>
                  handleInputChange("rentalDurationMonths", e.target.value)
                }
              />
              <Field
                label="Rental Start Date"
                type="date"
                placeholder="Select Date"
                value={formData.rentalStartDate}
                onChange={(e) =>
                  handleInputChange("rentalStartDate", e.target.value)
                }
              />
              <Field
                label="Rental End Date"
                type="date"
                placeholder="Select Date"
                value={formData.rentalEndDate}
                onChange={(e) =>
                  handleInputChange("rentalEndDate", e.target.value)
                }
              />
              <Field
                label="Quotation Date"
                type="date"
                placeholder="Select Date"
                value={formData.quotationDate}
                onChange={(e) =>
                  handleInputChange("quotationDate", e.target.value)
                }
              />
              <Field
                label="Industry"
                placeholder="Enter Industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
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
                onChange={(e) => handleInputChange("street", e.target.value)}
              />
              <Field
                label="Landmark"
                placeholder="Enter Landmark"
                value={formData.landmark}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
              />
              <Field
                label="Pincode"
                placeholder="Enter Pincode"
                type="number"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
              />
              <Field
                label="City"
                placeholder="Enter City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              <Field
                label="State"
                placeholder="Enter State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
              <Field
                label="Country"
                placeholder="Enter Country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
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

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                        <TableCell padding="checkbox" sx={{ color: "#fff" }}>
                          <Checkbox sx={{ color: "#fff" }} />
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
                                value={quantities[product.id] || ""}
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
            Create Quotation
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
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
          value={value}
          onChange={onChange}
          disabled={readOnly}
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
    ) : type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        rows={3}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ) : type === "date" ? (
      <input
        type="date"
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
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

export default QuotationsAddLayoutPage;
