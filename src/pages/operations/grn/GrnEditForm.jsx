import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

// === Reusable Components ===
const Field = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly = false,
  name,
  options = [],
  required = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </label>

    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={inputStyle}
        required={required}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        readOnly={readOnly}
        required={required}
      />
    )}
  </div>
);

// === Main Component ===
const GrnEditForm = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const { id } = useParams();
  const navigate = useNavigate();
  const [useGrnPhone, setUseGrnPhone] = useState(true);

  const [formData, setFormData] = useState({
    grnId: "",
    customerId: "",
    grnTitle: "",
    customer: "",
    email: "",
    phone: "",
    grnDate: "",
    gstNumber: "",
    pan: "",
    grnCreatedBy: "",
    grn_status: "",
    industry: "",
    companyName: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    street: "",
    landmark: "",
    informedPersonName: "",
    informedPersonPhone: "",
    returnerName: "",
    returnerPhone: "",
    receiverName: "",
    receiverPhone: "",
    description: "",
    vehicleNumber: "",
  });

  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [challanProducts, setChallanProducts] = useState([]);
  const [showProductTable, setShowProductTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [originalProducts, setOriginalProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GRN data
        const grnResponse = await fetch(`${API_URL}/goods-return-notes/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!grnResponse.ok) throw new Error("Failed to fetch GRN data");
        const grnData = await grnResponse.json();

        // Set form data from the fetched GRN
        setFormData({
          grnId: grnData.grn_number || "",
          grnTitle: grnData.grn_title || "",
          customer: grnData.customer_name || "",
          email: grnData.email || "",
          phone: grnData.phone_number || "",
          grnDate: grnData.grn_date ? grnData.grn_date.split("T")[0] : "",
          gstNumber: grnData.gst_number || "",
          pan: grnData.pan_number || "",
          grnCreatedBy: grnData.grn_created_by || "",
          grn_status: grnData.grn_status || "Pending",
          industry: grnData.industry || "",
          companyName: grnData.company_name || "",
          pincode: grnData.pincode || "",
          country: grnData.country || "",
          state: grnData.state || "",
          city: grnData.city || "",
          street: grnData.street || "",
          landmark: grnData.landmark || "",
          informedPersonName: grnData.informed_person_name || "",
          informedPersonPhone: grnData.informed_person_phone || "",
          returnerName: grnData.returner_name || "",
          returnerPhone: grnData.returner_phone || "",
          receiverName: grnData.receiver_name || "",
          receiverPhone: grnData.receiver_phone || "",
          description: grnData.description || "",
          vehicleNumber: grnData.vehicle_number || "",
        });

        // Initialize products data safely
        const initialQuantities = {};
        const initialProductIds = [];
        const productsData = grnData.items || []; // Fallback to empty array if undefined

        productsData.forEach((item) => {
          if (item.product_id) {
            // Additional safety check
            initialQuantities[item.product_id] = item.quantity || 1;
            initialProductIds.push(item.product_id);
          }
        });

        setQuantities(initialQuantities);
        setSelectedProductIds(initialProductIds);
        setOriginalProducts(productsData);

        // Fetch delivery challans
        const challansResponse = await fetch(
          `${API_URL}/delivery-challans/approved-delivery-challan`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!challansResponse.ok)
          throw new Error("Failed to fetch delivery challans");
        const challansData = await challansResponse.json();
        setDeliveryChallans(challansData);
        // Find matching delivery challan based on customer_id
        const matchingChallan = challansData.find(
          (challan) =>
            challan.client_details?.customer_id === grnData.customer_id ||
            challan.customer_id === grnData.customer_id
        );

        if (matchingChallan) {
          setSelectedChallan(matchingChallan);
          handleCustomerSelect(matchingChallan.id); // This will auto-populate the customer details
        }

        // Set selected delivery challan if exists
        if (grnData.delivery_challan_id) {
          const selected = challansData.find(
            (challan) => challan.id === grnData.delivery_challan_id
          );
          setSelectedChallan(selected);
        }

        // Fetch products
        const prodResponse = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
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
  }, [id]);

  // When a delivery challan is selected, update the products and selected products
  useEffect(() => {
    if (selectedChallan && selectedChallan.items) {
      const challanProductIds = selectedChallan.items.map(
        (item) => item.product_id
      );
      setChallanProducts(
        products.filter((product) => challanProductIds.includes(product.id))
      );
    }
  }, [selectedChallan, products]);

  // Filter products based on search term and delivery challan products
  const filteredProducts = challanProducts.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelect = (challanId) => {
    const selected = deliveryChallans.find(
      (challan) => challan.id === challanId
    );
    if (selected) {
      setSelectedChallan(selected);

      setFormData((prev) => ({
        ...prev,
        customerId: selected.client_details?.id || prev.customerId,
        customer:
          selected.client_details?.name ||
          selected.customer_name ||
          prev.customer,
        email: selected.email || selected.client_details?.email || prev.email,
        gstNumber: selected.gst_number || prev.gstNumber,
        pan: selected.pan_number || prev.pan,
        companyName:
          selected.company_name ||
          selected.client_details?.company_name ||
          prev.companyName,
        pincode:
          selected.pincode ||
          selected.shipping_address?.pincode ||
          prev.pincode,
        country:
          selected.country ||
          selected.shipping_address?.country ||
          prev.country,
        state: selected.state || selected.shipping_address?.state || prev.state,
        city: selected.city || selected.shipping_address?.city || prev.city,
        street:
          selected.street || selected.shipping_address?.street || prev.street,
        landmark:
          selected.landmark ||
          selected.shipping_address?.landmark ||
          prev.landmark,
        informedPersonName:
          selected.informed_person_name ||
          selected.shipping_name ||
          prev.informedPersonName,
        informedPersonPhone:
          selected.informed_person_phone ||
          selected.shipping_phone_number ||
          prev.informedPersonPhone,
        returnerName:
          selected.returner_name ||
          selected.delivery_person_name ||
          prev.returnerName,
        returnerPhone:
          selected.returner_phone ||
          selected.delivery_person_phone_number ||
          prev.returnerPhone,
        receiverName: selected.receiver_name || prev.receiverName,
        receiverPhone: selected.receiver_phone || prev.receiverPhone,
        vehicleNumber: selected.vehicle_number || prev.vehicleNumber,
      }));

      // Update products from selected delivery challan
      if (selected.items) {
        const productIds = selected.items.map((item) => item.product_id);
        const newQuantities = {};
        selected.items.forEach((item) => {
          newQuantities[item.product_id] = item.quantity || 1;
        });
        setSelectedProductIds(productIds);
        setQuantities(newQuantities);
      }
    }
  };

  // ... rest of the component code remains the same ...

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductSelection = (productId) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        const newQuantities = { ...quantities };
        delete newQuantities[productId];
        setQuantities(newQuantities);
        return prev.filter((id) => id !== productId);
      } else {
        const newQuantities = {
          ...quantities,
          [productId]: quantities[productId] || 1,
        };
        setQuantities(newQuantities);
        return [...prev, productId];
      }
    });
  };

  const handleQtyChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const incrementQty = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrementQty = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCancel = () => {
    navigate("/dashboard/operations/grn");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProducts = filteredProducts
      .filter((product) => selectedProductIds.includes(product.id))
      .map((product) => ({
        product_id: product.id,
        product_name: product.product_name,
        quantity: quantities[product.id] || 1,
        price: product.purchase_price,
        device_ids:
          selectedChallan?.items?.find((item) => item.product_id === product.id)
            ?.device_ids ||
          originalProducts.find((item) => item.product_id === product.id)
            ?.device_ids ||
          [],
      }));

    const payload = {
      grn_number: formData.grnId,
      grn_title: formData.grnTitle,
      customer_id: formData.customerId,
      customer_name: formData.customer,
      email: formData.email,
      phone_number: formData.phone,
      grn_date: formData.grnDate,
      gst_number: formData.gstNumber,
      pan_number: formData.pan,
      grn_created_by: formData.grnCreatedBy,
      grn_status: formData.grn_status,
      industry: formData.industry,
      company_name: formData.companyName,
      pincode: formData.pincode,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      street: formData.street,
      landmark: formData.landmark,
      informed_person_name: formData.informedPersonName,
      informed_person_phone: formData.informedPersonPhone,
      returner_name: formData.returnerName,
      returner_phone: formData.returnerPhone,
      receiver_name: formData.receiverName,
      receiver_phone: formData.receiverPhone,
      vehicle_number: formData.vehicleNumber,
      description: formData.description,
      items: selectedProducts,
      delivery_challan_id: selectedChallan?.id || null,
    };

    try {
      const response = await axios.put(
        `${API_URL}/goods-return-notes/${id}`,
        payload,
        {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: "GRN updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations/grn");
      }, 2000);
    } catch (error) {
      console.error("API Error:", error);
      setSnackbar({
        open: true,
        message: "Failed to update GRN. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        {/* === Basic Details === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Basic Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="GRN ID"
              value={formData.grnId}
              onChange={(v) => handleInputChange("grnId", v)}
              readOnly
            />
            <Field
              label="GRN Title"
              placeholder="Enter GRN Title"
              value={formData.grnTitle}
              onChange={(v) => handleInputChange("grnTitle", v)}
            />

            <Field
              label="Select Delivery Challan"
              name="deliveryChallan"
              type="select"
              placeholder="Select Delivery Challan"
              value={selectedChallan?.id || ""} // initially blank
              onChange={(name, value) => handleCustomerSelect(Number(value))}
              options={deliveryChallans.map((challan) => ({
                value: challan.id,
                label: `${challan.dc_id} - ${
                  challan.client_details?.first_name || ""
                } ${challan.client_details?.last_name || ""}`,
              }))}
            />

            <Field
              label="Customer ID"
              value={formData.customerId}
              onChange={(v) => handleInputChange("customerId", v)}
              readOnly
            />
            <Field
              label="Email ID"
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(v) => handleInputChange("email", v)}
            />
            <Field
              label="Phone No"
              type="tel"
              placeholder="Enter Phone"
              value={
                useGrnPhone
                  ? formData.phone
                  : selectedChallan?.client_details?.phone_number ||
                    selectedChallan?.phone_number ||
                    formData.phone
              }
              onChange={(v) => {
                handleInputChange("phone", v);
                setUseGrnPhone(false);
              }}
            />
            <Field
              label="GRN Date"
              type="date"
              value={formData.grnDate}
              onChange={(v) => handleInputChange("grnDate", v)}
            />
            <Field
              label="GST Number"
              value={formData.gstNumber}
              onChange={(v) => handleInputChange("gstNumber", v)}
            />
            <Field
              label="PAN"
              value={formData.pan}
              onChange={(v) => handleInputChange("pan", v)}
            />
            <Field
              label="GRN Created By"
              value={formData.grnCreatedBy}
              onChange={(v) => handleInputChange("grnCreatedBy", v)}
            />
            <Field
              label="Industry"
              value={formData.industry}
              onChange={(v) => handleInputChange("industry", v)}
            />
            <Field
              label="GRN Status"
              name="grn_status"
              type="select"
              placeholder="Select GRN Status"
              value={formData.grn_status}
              onChange={handleInputChange}
              options={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
              required
            />
          </div>
        </div>

        {/* === To Address === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📍</div>
            <h3 style={cardHeaderStyle}>To Address</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Company Name"
              value={formData.companyName}
              onChange={(v) => handleInputChange("companyName", v)}
            />
            <Field
              label="Pincode"
              value={formData.pincode}
              onChange={(v) => handleInputChange("pincode", v)}
            />
            <Field
              label="Country"
              value={formData.country}
              onChange={(v) => handleInputChange("country", v)}
            />
            <Field
              label="State"
              value={formData.state}
              onChange={(v) => handleInputChange("state", v)}
            />
            <Field
              label="City"
              value={formData.city}
              onChange={(v) => handleInputChange("city", v)}
            />
            <Field
              label="Street"
              value={formData.street}
              onChange={(v) => handleInputChange("street", v)}
            />
            <Field
              label="Landmark"
              value={formData.landmark}
              onChange={(v) => handleInputChange("landmark", v)}
            />
          </div>
        </div>

        {/* === Person Info === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Person Info</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Informed Person Name"
              value={formData.informedPersonName}
              onChange={(v) => handleInputChange("informedPersonName", v)}
            />
            <Field
              label="Informed Person Phone"
              value={formData.informedPersonPhone}
              onChange={(v) => handleInputChange("informedPersonPhone", v)}
            />
            <Field
              label="Returner Name"
              value={formData.returnerName}
              onChange={(v) => handleInputChange("returnerName", v)}
            />
            <Field
              label="Returner Phone"
              value={formData.returnerPhone}
              onChange={(v) => handleInputChange("returnerPhone", v)}
            />
            <Field
              label="Receiver Name"
              value={formData.receiverName}
              onChange={(v) => handleInputChange("receiverName", v)}
            />
            <Field
              label="Receiver Phone"
              value={formData.receiverPhone}
              onChange={(v) => handleInputChange("receiverPhone", v)}
            />
            <Field
              label="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={(v) => handleInputChange("vehicleNumber", v)}
            />
          </div>
          <div style={textareaContainerStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Enter Description"
              style={textareaStyle}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
                            selectedProductIds.length < filteredProducts.length
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
                    {filteredProducts.map((product) => {
                      const challanItem = selectedChallan?.items?.find(
                        (item) => item.product_id === product.id
                      );
                      const originalItem = originalProducts.find(
                        (item) => item.product_id === product.id
                      );

                      return (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() =>
                                handleProductSelection(product.id)
                              }
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
                                  min: 1,
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
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={handleCancel}>
          Cancel
        </button>
        <button style={createBtnStyle} onClick={handleSubmit}>
          Update
        </button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// === Styles ===
const containerStyle = {
  padding: "2rem",
  fontFamily: '"Inter", sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};
const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1400px",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
};
const cardStyle = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};
const cardHeaderContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1.5rem",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "1rem",
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
const fieldContainerStyle = { display: "flex", flexDirection: "column" };
const labelStyle = {
  marginBottom: "0.5rem",
  fontWeight: "500",
  fontSize: "0.875rem",
  color: "#374151",
};
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#fff",
};
const textareaContainerStyle = { marginTop: "1rem" };
const textareaStyle = {
  width: "100%",
  minHeight: "100px",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#fff",
  resize: "vertical",
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
};
const createBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default GrnEditForm;
