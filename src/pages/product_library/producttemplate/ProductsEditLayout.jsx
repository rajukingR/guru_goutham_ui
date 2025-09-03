import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom";

// Add this Alert component (optional but recommended for better styling)
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsEditLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    // Common product fields
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
    hsn_code: "",
    
    // Specifications - common
    ram: "",
    ram_speed: "",
    disk_type: "",
    processor: "",
    processor_model: "",
    processor_speed: "",
    generation: "",
    storage: "",
    graphics: "",
    os: "",
    display_size: "",
    
    // Laptop specific
    mouse: false,
    keyboard: false,
    dvd: false,
    speaker: false,
    webcam: false,
    
    // Desktop specific
    motherboard: "",
    cabinet: "",
    smps: "",
    ram_slots: "",
    
    // Monitor specific
    screen_size: "",
    
    // HDD specific
    capacity: "",
    speed: "",
    ssd_type: "",
    // RAM specific
    ramType: "",
    sizeGb: "",
    frequencyMhz: "",
    manufacturer: "",
    
    // Price fields
    purchase_price: "",
    rent_percent_per_day: 0,
    rent_price_per_day: "",
    rent_percent_per_month: 0,
    rent_price_per_month: "",
    rent_percent_6_months: 0,
    rent_price_6_months: "",
    rent_percent_1_year: 0,
    rent_price_1_year: "",
    
    // Status
    is_active: true,
  });

  // State for API data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stockLocations, setStockLocations] = useState([]);
  const [existingImage, setExistingImage] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes, stockLocationRes, productRes] = await Promise.all([
          axios.get(`${API_URL}/product-brands/active`),
          axios.get(`${API_URL}/product-categories/active`),
          axios.get(`${API_URL}/stock-location/active-stock-location`),
          axios.get(`${API_URL}/product-templete/${id}`),
        ]);

        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setStockLocations(
          stockLocationRes.data.map((item) => ({
            stockLocationId: item.stock_location_id,
            stockName: item.stock_name,
          }))
        );

        // Set existing product data
        const productData = productRes.data;
        setFormData({
          ...formData,
          product_category: productData.product_category || "",
          product_id: productData.product_id || "",
          product_name: productData.product_name || "",
          brand: productData.brand || "",
          grade: productData.grade || "",
          model: productData.model || "",
          pro_model: productData.pro_model || "",
          st_number: productData.st_number || "",
          stock_location: productData.stock_location || "",
          description: productData.description || "",
          hsn_code: productData.hsn_code || "",
          
          // Specifications
          ram: productData.ram || "",
          ram_speed: productData.ram_speed || "",
          disk_type: productData.disk_type || "",
          processor: productData.processor || "",
          processor_model: productData.processor_model || "",
          processor_speed: productData.processor_speed || "",
          generation: productData.generation || "",
          storage: productData.storage || "",
          graphics: productData.graphics || "",
          os: productData.os || "",
          display_size: productData.display_size || "",
          
          // Accessories
          mouse: productData.mouse || false,
          keyboard: productData.keyboard || false,
          dvd: productData.dvd || false,
          speaker: productData.speaker || false,
          webcam: productData.webcam || false,
          
          // Desktop components
          motherboard: productData.motherboard || "",
          cabinet: productData.cabinet || "",
          smps: productData.smps || "",
          ram_slots: productData.ram_slots || "",
          
          // Monitor
          screen_size: productData.screen_size || "",
          
          // Storage
          capacity: productData.capacity || "",
          speed: productData.speed || "",
          ssd_type:productData.ssd_type || "",
          // RAM
          ramType: productData.ramType || "",
          sizeGb: productData.sizeGb || "",
          frequencyMhz: productData.frequencyMhz || "",
          manufacturer: productData.manufacturer || "",
          
          // Price fields
          purchase_price: productData.purchase_price || "",
          rent_percent_per_day: productData.rent_percent_per_day || 0,
          rent_price_per_day: productData.rent_price_per_day || "",
          rent_percent_per_month: productData.rent_percent_per_month || 0,
          rent_price_per_month: productData.rent_price_per_month || "",
          rent_percent_6_months: productData.rent_percent_6_months || 0,
          rent_price_6_months: productData.rent_price_6_months || "",
          rent_percent_1_year: productData.rent_percent_1_year || 0,
          rent_price_1_year: productData.rent_price_1_year || "",
          
          // Status
          is_active: productData.is_active || true,
        });

        if (productData.product_image) {
          setExistingImage(`${IMAGE_API_URL}/${productData.product_image}`);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "maxSpeed" || name === "speed") {
      const floatValue = parseFloat(value);
      if (floatValue > 10) {
        showSnackbar("Please enter a valid speed (max 10GHz)", "error");
        return;
      }
      if (floatValue <= 0) {
        showSnackbar("Speed must be greater than 0", "error");
        return;
      }
    }

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

  if (parseFloat(formData.purchase_price) <= 0) {
    showSnackbar("Please enter a valid purchase price", "error");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const formDataToSend = new FormData();

    // ✅ Copy and set ram = sizeGb if category is RAM
    const formDataCopy = { ...formData };
    if (formDataCopy.product_category === "RAM") {
      formDataCopy.ram = formDataCopy.sizeGb?.toString() || "";
    }

    // ✅ Append all fields from updated copy
    Object.entries(formDataCopy).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (typeof value === "boolean") {
        formDataToSend.append(key, value ? "1" : "0");
      } else if (value instanceof File) {
        formDataToSend.append(key, value, value.name);
      } else {
        formDataToSend.append(key, value.toString());
      }
    });

    // ✅ Submit update request
    const response = await axios.put(
      `${API_URL}/product-templete/${id}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    showSnackbar(
      response.data.message || "Product updated successfully!",
      "success"
    );

    setTimeout(() => {
      navigate("/dashboard/product_library");
    }, 1500);
  } catch (err) {
    let errorMessage = "An error occurred while updating the product";

    if (err.response) {
      errorMessage =
        err.response.data.message ||
        err.response.data.error ||
        `Server error: ${err.response.status}`;
    } else if (err.request) {
      errorMessage = "No response from server. Please check your connection.";
    }

    showSnackbar(errorMessage, "error");
    console.error("Submission error:", err);
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
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <Field
                label="Display Size"
                name="display_size"
                placeholder="Enter Display Size (inches)"
                value={formData.display_size}
                onChange={handleChange}
                required
              />

              <Field
                label="Processor Model"
                name="processor_model"
                placeholder="Enter Processor Model"
                value={formData.processor_model}
                onChange={handleChange}
                required
              />

              <Field
                label="Processor Speed"
                name="processor_speed"
                placeholder="Enter Processor Speed (GHz)"
                value={formData.processor_speed}
                onChange={handleChange}
                required
              />

              <Field
                label="Generation"
                name="generation"
                placeholder="Enter Generation"
                value={formData.generation}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <Field
                label="RAM"
                name="ram"
                placeholder="Enter RAM (GB)"
                value={formData.ram}
                onChange={handleChange}
                required
              />

              <Field
                label="RAM Speed (optional)"
                name="ram_speed"
                placeholder="Enter RAM Speed (MHz)"
                value={formData.ram_speed}
                onChange={handleChange}
              />
            </div>

            <Field
              label="Hard Drive"
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
              label="Storage Capacity"
              name="storage"
              placeholder="Enter Storage (GB/TB)"
              value={formData.storage}
              onChange={handleChange}
              required
            />

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <Field
                label="GPU"
                name="graphics"
                placeholder="Enter Graphics Card"
                value={formData.graphics}
                onChange={handleChange}
                required
              />

              <Field
                label="Operating System"
                name="os"
                placeholder="Enter OS"
                value={formData.os}
                onChange={handleChange}
                required
              />
            </div>

            <Field
              label="HSN Code"
              name="hsn_code"
              placeholder="Enter HSN Code"
              value={formData.hsn_code}
              onChange={handleChange}
              required
            />
          </>
        );

      case "Branded Desktops":
        return (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <Field
                label="Processor Model"
                name="processor"
                placeholder="Enter Processor Model"
                value={formData.processor}
                onChange={handleChange}
                required
              />

              <Field
                label="Processor Speed"
                name="processor_speed"
                placeholder="Enter Processor Speed (e.g., 3.4 GHz)"
                value={formData.processor_speed}
                onChange={handleChange}
              />

              <Field
                label="Generation"
                name="generation"
                placeholder="Enter Generation (e.g., 12th Gen)"
                value={formData.generation}
                onChange={handleChange}
                required
              />

              <Field
                label="Mother Board"
                name="motherboard"
                placeholder="Enter Motherboard"
                value={formData.motherboard}
                onChange={handleChange}
                required
              />

              <Field
                label="RAM"
                name="ram"
                placeholder="Enter RAM (e.g., 8GB)"
                value={formData.ram}
                onChange={handleChange}
                required
              />
              <Field
                label="Hard Drive"
                name="storage"
                placeholder="Enter Hard Drive (e.g., 512GB)"
                value={formData.storage}
                onChange={handleChange}
                required
              />
            </div>

            <Field
              label="RAM Speed (optional)"
              name="ram_speed"
              placeholder="Enter RAM Speed (MHz)"
              value={formData.ram_speed}
              onChange={handleChange}
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

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <Field
                label="GPU"
                name="graphics"
                placeholder="Enter GPU"
                value={formData.graphics}
                onChange={handleChange}
                required
              />

              <Field
                label="Cabinet"
                name="cabinet"
                placeholder="Enter Cabinet"
                value={formData.cabinet}
                onChange={handleChange}
                required
              />

              <Field
                label="SMPS"
                name="smps"
                placeholder="Enter SMPS"
                value={formData.smps}
                onChange={handleChange}
                required
              />

              <Field
                label="Operating System"
                name="os"
                placeholder="Enter Operating System"
                value={formData.os}
                onChange={handleChange}
                required
              />
            </div>

            <Field
              label="HSN Code"
              name="hsn_code"
              placeholder="Enter HSN Code"
              value={formData.hsn_code}
              onChange={handleChange}
              required
            />
          </>
        );

      case "HDD":
        return (
          <>
            <Field
              label="Storage Capacity"
              name="capacity"
              placeholder="Enter Storage Capacity (e.g., 1TB)"
              value={formData.capacity}
              onChange={handleChange}
              required
            />

            <Field
              label="Speed"
              name="speed"
              placeholder="Enter Speed (e.g., 7200 RPM)"
              value={formData.speed}
              onChange={handleChange}
            />
          </>
        );

        case "SSD":
  return (
    <>
      <Field
        label="Storage Capacity"
        name="capacity"
        placeholder="Enter Storage Capacity (e.g., 512GB)"
        value={formData.capacity}
        onChange={handleChange}
        required
      />

      <Field
        label="SSD Type"
        name="ssd_type"
        type="select"
        value={formData.ssd_type}
        onChange={handleChange}
        required
      >
        <option value="">Select SSD Type</option>
        <option value="SATA">SATA</option>
        <option value="M.2">M.2</option>
        <option value="NVMe">NVMe</option>
      </Field>

      <Field
        label="Read/Write Speed"
        name="speed"
        placeholder="Enter Speed (e.g., 3500 MB/s)"
        value={formData.speed}
        onChange={handleChange}
      />
    </>
  );


      case "Processor":
        return (
          <div style={formContainerStyle}>
            <div style={cardStyle}>
              <div style={fieldsGridStyle}>
                <Field
                  label="Generation"
                  name="generation"
                  placeholder="Enter Generation (e.g., 12th Gen)"
                  value={formData.generation}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Speed (GHz)"
                  name="speed"
                  type="number"
                  placeholder="Enter Base Speed"
                  value={formData.speed}
                  onChange={handleChange}
                  required
                  step="0.1"
                />
              </div>
            </div>
          </div>
        );

      case "Assembled Desktop":
        return (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <Field
                label="Processor Model"
                name="processor"
                placeholder="Enter Processor Model"
                value={formData.processor}
                onChange={handleChange}
                required
              />

              <Field
                label="Processor Speed (optional)"
                name="processor_speed"
                placeholder="Enter Processor Speed (e.g., 3.5 GHz)"
                value={formData.processor_speed}
                onChange={handleChange}
              />

              <Field
                label="Generation"
                name="generation"
                placeholder="Enter Generation"
                value={formData.generation}
                onChange={handleChange}
                required
              />

              <Field
                label="Mother Board"
                name="motherboard"
                placeholder="Enter Mother Board"
                value={formData.motherboard}
                onChange={handleChange}
                required
              />

              <Field
                label="RAM"
                name="ram"
                placeholder="Enter RAM (e.g., 16GB)"
                value={formData.ram}
                onChange={handleChange}
                required
              />

              <Field
                label="RAM Speed (optional)"
                name="ram_speed"
                placeholder="Enter RAM Speed (MHz)"
                value={formData.ram_speed}
                onChange={handleChange}
              />

              <Field
                label="RAM Slots"
                name="ram_slots"
                placeholder="Enter Number of RAM Slots"
                value={formData.ram_slots}
                onChange={handleChange}
              />

              <Field
                label="Hard Drive"
                name="storage"
                placeholder="Enter Hard Drive (e.g., 512GB)"
                value={formData.storage}
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
                label="GPU"
                name="graphics"
                placeholder="Enter GPU"
                value={formData.graphics}
                onChange={handleChange}
                required
              />

              <Field
                label="Cabinet"
                name="cabinet"
                placeholder="Enter Cabinet"
                value={formData.cabinet}
                onChange={handleChange}
                required
              />

              <Field
                label="SMPS"
                name="smps"
                placeholder="Enter SMPS"
                value={formData.smps}
                onChange={handleChange}
                required
              />

              <Field
                label="Operating System"
                name="os"
                placeholder="Enter Operating System"
                value={formData.os}
                onChange={handleChange}
                required
              />

              <Field
                label="HSN Code"
                name="hsn_code"
                placeholder="Enter HSN Code"
                value={formData.hsn_code}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );

      case "RAM":
        return (
          <div style={formContainerStyle}>
            <div style={cardStyle}>
              <div style={fieldsGridStyle}>
                <Field
                  label="RAM Type"
                  name="ramType"
                  type="select"
                  value={formData.ramType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select RAM Type</option>
                  <option value="DDR3">DDR3</option>
                  <option value="DDR4">DDR4</option>
                  <option value="DDR5">DDR5</option>
                  <option value="LPDDR4">LPDDR4</option>
                  <option value="LPDDR5">LPDDR5</option>
                </Field>

                <Field
                  label="Size (GB)"
                  name="sizeGb"
                  type="select"
                  value={formData.sizeGb}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="4GB">4 GB</option>
                  <option value="8GB">8 GB</option>
                  <option value="16GB">16 GB</option>
                  <option value="32GB">32 GB</option>
                  <option value="64GB">64 GB</option>
                </Field>

                <Field
                  label="Speed"
                  name="speed"
                  placeholder="Enter Speed"
                  value={formData.speed}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        );
       
      case "GPU":
        return (
          <>
            <Field
              label="Speed"
              name="speed"
              placeholder="Enter Speed (e.g., 6Gbps)"
              value={formData.speed}
              onChange={handleChange}
              required
            />
          </>
        );
      
      case "SMPS":
        return (
          <>
            <Field
              label="Power in Watts"
              name="smps"
              placeholder="Enter Power (e.g., 450W)"
              value={formData.smps}
              onChange={handleChange}
              required
            />
          </>
        );
      
      case "Cabinet":
        return (
          <>
            <Field
              label="Brand Name"
              name="brand"
              placeholder="Enter Brand Name"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </>
        );

      case "Monitors":
        return (
          <>
            <Field
              label="Screen Size"
              name="screen_size"
              placeholder="Enter Screen Size"
              value={formData.screen_size}
              onChange={handleChange}
              required
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
              <label style={{ fontWeight: "bold" }}>Product Image</label>

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
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {existingImage || formData.product_image ? (
                  <img
                    src={
                      formData.product_image
                        ? URL.createObjectURL(formData.product_image)
                        : existingImage
                    }
                    alt="Product"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      backgroundColor: "white",
                    }}
                  />
                ) : (
                  "+"
                )}
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

              {(formData.product_image || existingImage) && (
                <p
                  style={{ color: "green", fontSize: "14px", marginTop: "8px" }}
                >
                  {formData.product_image
                    ? `Selected: ${formData.product_image.name}`
                    : "Using existing image"}
                </p>
              )}
            </div>

            <Field
              label="Product ID"
              name="product_id"
              placeholder="Product ID"
              value={formData.product_id}
              onChange={handleChange}
              required
              readOnly
            />

            <Field
              label="Product Name"
              name="product_name"
              placeholder="Enter Product Name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />

            {formData.product_category !== "Assembled Desktop" && (
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
              label="Model"
              name="model"
              placeholder="Enter Model"
              value={formData.model}
              onChange={handleChange}
              required
            />

            {/* <Field
              label="Stock Location"
              type="select"
              name="stock_location"
              value={formData.stock_location}
              onChange={handleChange}
              required
            >
              <option value="">Select Stock Location</option>
              {stockLocations.map((location) => (
                <option key={location.stockLocationId} value={location.stockName}>
                  {location.stockName}
                </option>
              ))}
            </Field> */}
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
              {loading ? "Updating..." : "Update Product"}
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
              required
            />

            {[
              {
                label: "Per Month",
                percent: "rent_percent_per_month",
                price: "rent_price_per_month",
              },
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
                    <option value="0">0%</option>
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
      <div
        style={{
          ...checkboxCustomStyle,
          backgroundColor: checked ? "#4CAF50" : "#ffffff",
          borderColor: checked ? "#4CAF50" : "#d1d5db",
        }}
      >
        {checked && <span style={checkmarkStyle}>✓</span>}
      </div>
      <span style={checkboxTextStyle}>{label}</span>
    </label>
  </div>
);

// Styles

const breadcrumbStyle = {
  marginBottom: "1.5rem",
  fontSize: "0.875rem",
  color: "#6b7280",
  fontWeight: "400",
};

const controlSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

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

export default ProductsEditLayout;
