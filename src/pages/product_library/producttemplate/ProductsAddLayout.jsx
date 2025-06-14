import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

// Add this Alert component (optional but recommended for better styling)
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsAddLayout = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    product_category: "",
    product_id: "",
    product_name: "",
    product_image: null, // ← initially null or empty
    brand: "",
    grade: "",
    model: "",
    pro_model: "",
    st_number: "",
    stock_location: "",
    description: "",
    // Common specifications
    ram: "",
    disk_type: "",
    processor: "",
    storage: "",
    graphics: "",
    os: "",
    // Laptop specific
    mouse: false,
    keyboard: false,
    dvd: false,
    speaker: false,
    webcam: false,
    // Monitor specific
    display_device: "",
    power_consumption: "",
    resolution: "",
    brightness: "",
    screen_size: "",
    color: "",
    audio_output: "",
    weight: "",
    // Price
    purchase_price: 0,
    rent_percent_per_day: 0,
    rent_price_per_day: 0,
    rent_percent_per_month: 0,
    rent_price_per_month: 0,
    rent_percent_6_months: 0,
    rent_price_6_months: 0,
    rent_percent_1_year: 0,
    rent_price_1_year: 0,
    is_active: true,
  });

  // State for API data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // can be "error", "warning", "info", "success"
  });

  // Show snackbar helper function
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  // Fetch brands and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/product-brands/active`),
          axios.get(`${API_URL}/product-categories/active`),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  // Handle price changes and calculate rent prices
  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    // Remove leading zeros for numeric fields
    let numericValue;
    if (
      name === "purchase_price" ||
      name.includes("rent_percent") ||
      name.includes("rent_price")
    ) {
      // Remove leading zeros and parse as float
      const cleanedValue = value.replace(/^0+/, "") || "0";
      numericValue = parseFloat(cleanedValue) || 0;
    } else {
      numericValue = value;
    }

    const purchasePrice =
      name === "purchase_price"
        ? numericValue
        : parseFloat(formData.purchase_price) || 0;

    // Update the changed field first
    const updatedFormData = {
      ...formData,
      [name]: numericValue,
    };

    // If purchase price changed, update all rent prices
    if (name === "purchase_price") {
      updatedFormData.rent_price_per_day = (
        (purchasePrice * updatedFormData.rent_percent_per_day) /
        100
      ).toFixed(2);
      updatedFormData.rent_price_per_month = (
        (purchasePrice * updatedFormData.rent_percent_per_month) /
        100
      ).toFixed(2);
      updatedFormData.rent_price_6_months = (
        (purchasePrice * updatedFormData.rent_percent_6_months) /
        100
      ).toFixed(2);
      updatedFormData.rent_price_1_year = (
        (purchasePrice * updatedFormData.rent_percent_1_year) /
        100
      ).toFixed(2);
    }
    // If a rent percentage changed, update just that rent price
    else if (name.includes("rent_percent")) {
      const priceField = name.replace("percent", "price");
      updatedFormData[priceField] = (
        (purchasePrice * numericValue) /
        100
      ).toFixed(2);
    }

    setFormData(updatedFormData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      }

      // Submit the multipart/form-data request
      await axios.post(`${API_URL}/product-templete/create`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);

      showSnackbar("Product added successfully!", "success");

      setTimeout(() => {
        navigate("/dashboard/product_library");
      }, 1500);

      // Reset form after success
      setFormData({
        product_category: "",
        product_id: "",
        product_name: "",
        product_image: null,
        brand: "",
        grade: "",
        model: "",
        pro_model: "",
        st_number: "",
        stock_location: "",
        description: "",
        ram: "",
        disk_type: "",
        processor: "",
        storage: "",
        graphics: "",
        os: "",
        mouse: true,
        keyboard: true,
        dvd: false,
        speaker: true,
        webcam: true,
        display_device: "",
        power_consumption: "",
        resolution: "",
        brightness: "",
        screen_size: "",
        color: "",
        audio_output: "",
        weight: "",
        purchase_price: 0,
        rent_percent_per_day: 0,
        rent_price_per_day: 0,
        rent_percent_per_month: 0,
        rent_price_per_month: 0,
        rent_percent_6_months: 0,
        rent_price_6_months: 0,
        rent_percent_1_year: 0,
        rent_price_1_year: 0,
        is_active: true,
      });
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || err.message || "An error occurred",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Render different specification fields based on product category
  const renderSpecificationFields = () => {
    switch (formData.product_category) {
      case "Laptops":
        return (
          <>
            <Field
              label="RAM"
              name="ram"
              placeholder="Enter RAM"
              value={formData.ram}
              onChange={handleChange}
              required
            />

            <Field
              label="Disk type"
              type="select"
              name="disk_type"
              value={formData.disk_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Disk Type</option>
              <option value="HDD">HDD</option>
              <option value="SSD">SSD</option>
              <option value="NVMe SSD">NVMe SSD</option>
              <option value="Hybrid">Hybrid</option>
            </Field>

            <Field
              label="Processor"
              name="processor"
              placeholder="Enter Processor"
              value={formData.processor}
              onChange={handleChange}
              required
            />

            <Field
              label="Storage"
              name="storage"
              placeholder="Enter Storage"
              value={formData.storage}
              onChange={handleChange}
              required
            />

            <Field
              label="Graphics"
              name="graphics"
              placeholder="Enter Graphics"
              value={formData.graphics}
              onChange={handleChange}
              required
            />

            <Field
              label="OS"
              name="os"
              placeholder="Enter OS"
              value={formData.os}
              onChange={handleChange}
              required
            />

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={checkboxGroupStyle}>
  {["mouse", "keyboard", "dvd", "speaker", "webcam"].map((field) => (
    <label key={field} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
      <input
        type="checkbox"
        name={field}
        checked={formData[field]}
        onChange={handleChange}
        style={{ marginRight: '5px' }}
      />
      {field.charAt(0).toUpperCase() + field.slice(1)}
    </label>
  ))}
</div>
            </div>
          </>
        );

      case "Branded Systems":
        return (
          <>
            <Field
              label="RAM"
              name="ram"
              placeholder="Enter RAM"
              value={formData.ram}
              onChange={handleChange}
              required
            />

            <Field
              label="Disk type"
              type="select"
              name="disk_type"
              value={formData.disk_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Disk Type</option>
              <option value="HDD">HDD</option>
              <option value="SSD">SSD</option>
              <option value="NVMe SSD">NVMe SSD</option>
            </Field>

            <Field
              label="Processor"
              name="processor"
              placeholder="Enter Processor"
              value={formData.processor}
              onChange={handleChange}
              required
            />

            <Field
              label="Storage"
              name="storage"
              placeholder="Enter Storage"
              value={formData.storage}
              onChange={handleChange}
              required
            />

            <Field
              label="Graphics"
              name="graphics"
              placeholder="Enter Graphics"
              value={formData.graphics}
              onChange={handleChange}
              required
            />

            <Field
              label="OS"
              name="os"
              placeholder="Enter OS"
              value={formData.os}
              onChange={handleChange}
              required
            />

            <Field
              label="ST. Number"
              name="st_number"
              placeholder="Enter ST. Number"
              value={formData.st_number}
              onChange={handleChange}
              required
            />
          </>
        );
      case "Assembled":
        return (
          <>
            <Field
              label="RAM"
              name="ram"
              placeholder="Enter RAM"
              value={formData.ram}
              onChange={handleChange}
              required
            />

            <Field
              label="Disk type"
              type="select"
              name="disk_type"
              value={formData.disk_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Disk Type</option>
              <option value="HDD">HDD</option>
              <option value="SSD">SSD</option>
              <option value="NVMe SSD">NVMe SSD</option>
            </Field>

            <Field
              label="Processor"
              name="processor"
              placeholder="Enter Processor"
              value={formData.processor}
              onChange={handleChange}
              required
            />

            <Field
              label="Storage"
              name="storage"
              placeholder="Enter Storage"
              value={formData.storage}
              onChange={handleChange}
              required
            />

            <Field
              label="Graphics"
              name="graphics"
              placeholder="Enter Graphics"
              value={formData.graphics}
              onChange={handleChange}
              required
            />

            <Field
              label="OS"
              name="os"
              placeholder="Enter OS"
              value={formData.os}
              onChange={handleChange}
              required
            />

            <Field
              label="Pro Model"
              name="pro_model"
              placeholder="Enter Pro Model"
              value={formData.pro_model}
              onChange={handleChange}
              required
            />
          </>
        );
      case "Monitors":
        return (
          <>
            <Field
              label="Display Device"
              name="display_device"
              placeholder="Enter Display Device"
              value={formData.display_device}
              onChange={handleChange}
              required
            />

            <Field
              label="Power Consumption"
              name="power_consumption"
              placeholder="Enter Power Consumption"
              value={formData.power_consumption}
              onChange={handleChange}
              required
            />

            <Field
              label="Resolution"
              name="resolution"
              placeholder="Enter Resolution"
              value={formData.resolution}
              onChange={handleChange}
              required
            />

            <Field
              label="Brightness"
              name="brightness"
              placeholder="Enter Brightness"
              value={formData.brightness}
              onChange={handleChange}
              required
            />

            <Field
              label="Screen Size"
              name="screen_size"
              placeholder="Enter Screen Size"
              value={formData.screen_size}
              onChange={handleChange}
              required
            />

            <Field
              label="Color"
              name="color"
              placeholder="Enter Color"
              value={formData.color}
              onChange={handleChange}
              required
            />

            <Field
              label="Audio Output"
              name="audio_output"
              placeholder="Enter Audio Output"
              value={formData.audio_output}
              onChange={handleChange}
            />

            <Field
              label="Weight"
              name="weight"
              placeholder="Enter Weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (loading && brands.length === 0 && categories.length === 0) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  if (error) {
    return <div style={errorStyle}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <form onSubmit={handleSubmit} style={formContainerStyle}>
        {/* Left Column - Product Category & Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Product Information</h3>
          </div>

          <div style={fieldsGridStyle}>
            <Field
              label="Product Category"
              type="select"
              name="product_category"
              value={formData.product_category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </Field>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontWeight: "bold" }}>Add Images</label>

              <div
                onClick={() =>
                  document.getElementById("hiddenImageInput").click()
                }
                style={{
                  marginTop: "5px",
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  color: "#888",
                  fontSize: "24px",
                }}
              >
                +
              </div>

              <input
                type="file"
                id="hiddenImageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_image: e.target.files[0] || null,
                  }))
                }
              />

              {formData.product_image && (
                <p
                  style={{ color: "green", fontSize: "14px", marginTop: "8px" }}
                >
                  Selected: {formData.product_image.name}
                </p>
              )}
            </div>

            <Field
              label="Product ID"
              name="product_id"
              placeholder="Enter Product ID"
              value={formData.product_id}
              onChange={handleChange}
              required
            />
            <Field
              label="Product Name"
              name="product_name"
              placeholder="Enter Product Name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />

            {formData.product_category !== "Assembled" && (
              <Field
                label="Brand"
                type="select"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.brand_name}>
                    {brand.brand_name}
                  </option>
                ))}
              </Field>
            )}

            <Field
              label="Grade"
              type="select"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
            >
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="Refurbished">Refurbished</option>
            </Field>

            <Field
              label="Model"
              name="model"
              placeholder="Enter Model"
              value={formData.model}
              onChange={handleChange}
              required
            />

            <Field
              label="Stock Location"
              type="select"
              name="stock_location"
              value={formData.stock_location}
              onChange={handleChange}
              required
            >
              <option value="">Select Stock Location</option>
              <option value="Warehouse-A">Warehouse-A</option>
              <option value="Warehouse-B">Warehouse-B</option>
              <option value="FutureVault-04">FutureVault-04</option>
              <option value="Main Storage">Main Storage</option>
            </Field>

            <div style={{ gridColumn: "1 / -1" }}>
              <Field
                label="Description"
                type="textarea"
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Middle Column - Specifications */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3 style={cardHeaderStyle}>Specifications</h3>
          </div>

          <div style={fieldsGridStyle}>{renderSpecificationFields()}</div>

          <div style={buttonContainerStyle}>
            <button type="submit" style={saveBtnStyle} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Right Column - Price Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💰</div>
            <h3 style={cardHeaderStyle}>Price Details</h3>
          </div>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            <Field
              label="Purchase Price"
              name="purchase_price"
              type="number"
              placeholder="Enter Purchase Price"
              value={formData.purchase_price}
              onChange={handlePriceChange}
            />

            {[
              // {
              //   label: "Per Day",
              //   percent: "rent_percent_per_day",
              //   price: "rent_price_per_day",
              // },
              {
                label: "Per Month",
                percent: "rent_percent_per_month",
                price: "rent_price_per_month",
              },
              // {
              //   label: "6 Months",
              //   percent: "rent_percent_6_months",
              //   price: "rent_price_6_months",
              // },
              // {
              //   label: "1 Year",
              //   percent: "rent_percent_1_year",
              //   price: "rent_price_1_year",
              // },
            ].map(({ label, percent, price }) => (
              <div
                key={label}
                style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}
              >
                <div style={{ flex: 1 }}>
                  <Field
                    label={`Rent Percent ${label}`}
                    type="select"
                    name={percent}
                    value={formData[percent]}
                    onChange={handlePriceChange}
                    required
                  >
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                    <option value="3">3%</option>
                    <option value="4">4%</option>
                    <option value="5">5%</option>
                    <option value="8">8%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="18">18%</option>
                    <option value="20">20%</option>
                    <option value="25">25%</option>
                    <option value="30">30%</option>
                    <option value="35">35%</option>
                    <option value="40">40%</option>
                    <option value="45">45%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="65">65%</option>
                    <option value="70">70%</option>
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field
                    label=" "
                    type="text"
                    name={price}
                    value={`₹${formData[price]}/-`}
                    readOnly
                  />
                </div>
              </div>
            ))}

            <div style={{ marginTop: "2rem" }}>
              <div style={cardHeaderContainerStyle}>
                <div style={iconStyle}>🎛️</div>
                <h3 style={cardHeaderStyle}>Control</h3>
              </div>
              <CheckboxField
                label="Active Status"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Field component
const Field = ({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  children,
  readOnly,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {type === "select" ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {children}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === "textarea" ? (
      <textarea
        name={name}
        placeholder={placeholder}
        style={textareaStyle}
        rows={3}
        value={value}
        onChange={onChange}
        required={required}
      />
    ) : type === "button" ? (
      <button style={buttonFieldStyle}>+</button>
    ) : type === "number" ? (
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        inputMode="numeric"
        pattern="[0-9]*"
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
      />
    )}
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div style={checkboxContainerStyle}>
    <label style={checkboxLabelStyle}>
      {/* Hidden but functional checkbox */}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={{
          position: "absolute",
          opacity: 0,
          width: "20px",
          height: "20px",
          cursor: "pointer",
          zIndex: 1,
        }}
      />
      {/* Custom checkbox visualization */}
      <div style={{
        ...checkboxCustomStyle,
        backgroundColor: checked ? "#4CAF50" : "#ffffff",
        borderColor: checked ? "#4CAF50" : "#d1d5db",
      }}>
        {checked && <span style={checkmarkStyle}>✓</span>}
      </div>
      <span style={checkboxTextStyle}>{label}</span>
    </label>
  </div>
);

// Styles
const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "1.2rem",
};

const errorStyle = {
  color: "#ef4444",
  padding: "2rem",
  textAlign: "center",
  fontSize: "1.2rem",
};

const successStyle = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#10b981",
  color: "white",
  padding: "1rem 2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const closeSuccessStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  fontSize: "1.2rem",
  cursor: "pointer",
  marginLeft: "0.5rem",
};

const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
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

const buttonFieldStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "2px dashed #d1d5db",
  fontSize: "1.25rem",
  backgroundColor: "#f9fafb",
  color: "#6b7280",
  cursor: "pointer",
  transition: "all 0.2s ease",
  outline: "none",
  fontWeight: "500",
};

const checkboxGroupStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "0.75rem",
};

const checkboxContainerStyle = {
  marginTop: "0.5rem",
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

const buttonContainerStyle = {
  marginTop: "1.5rem",
  paddingTop: "1rem",
  borderTop: "1px solid #e2e8f0",
};

const saveBtnStyle = {
  width: "100%",
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

export default ProductsAddLayout;
