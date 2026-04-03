import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import BulkUploadSection from './BulkUploadSection'; // Adjust path as needed
import DownloadTemplate from './DownloadTemplate';


const generateProductId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PRD-${randomPart}`;
};

// Add this Alert component (optional but recommended for better styling)
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsAddLayout = () => {
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  // State for form data
  const [formData, setFormData] = useState({
    // Common product fields
    product_category: "",
    product_id: generateProductId(),
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
    frequency_band: "",
    wifi_standard: "",
    // SSD specific
    ssd_type: "",

    // RAM specific
    ramType: "",
    sizeGb: "",
    frequencyMhz: "",
    manufacturer: "",

    processor_core: "",
    battery: "",
    adapter: "",
    resolution: "",
    brightness: "",

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product_id: generateProductId(),
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes, stockLocationRes] = await Promise.all([
          axios.get(`${API_URL}/product-brands/active`, {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }),
          axios.get(`${API_URL}/product-categories/active`, {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }),
          axios.get(`${API_URL}/stock-location/active-stock-location`, {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }),
        ]);

        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setStockLocations(
          stockLocationRes.data.map((item) => ({
            stockLocationId: item.stock_location_id,
            stockName: item.stock_name,
          }))
        );

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userToken]); // Added userToken as dependency


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // ✅ Allow numbers + decimals + text (no blocking)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  // Handle price changes and calculate rent prices
  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;

    // Remove leading zeros BUT allow single "0"
    if (name.includes("rent_percent") || name === "purchase_price") {
      cleanedValue = cleanedValue.replace(/^0+(?=\d)/, "");
      if (cleanedValue === "") cleanedValue = "0";
    }

    // Convert cleaned value to number ONLY for calculations
    const numericValue = Number(cleanedValue);

    const purchasePrice =
      name === "purchase_price"
        ? numericValue
        : Number(formData.purchase_price) || 0;

    // Update the input field
    const updatedFormData = {
      ...formData,
      [name]: cleanedValue,
    };

    // If purchase price changed → update all rent prices
    if (name === "purchase_price") {
      updatedFormData.rent_price_per_day = (
        (purchasePrice * Number(formData.rent_percent_per_day)) /
        100
      ).toFixed(2);

      updatedFormData.rent_price_per_month = (
        (purchasePrice * Number(formData.rent_percent_per_month)) /
        100
      ).toFixed(2);

      updatedFormData.rent_price_6_months = (
        (purchasePrice * Number(formData.rent_percent_6_months)) /
        100
      ).toFixed(2);

      updatedFormData.rent_price_1_year = (
        (purchasePrice * Number(formData.rent_percent_1_year)) /
        100
      ).toFixed(2);
    }
    // If a rent percentage is updated → update only its rent price
    else if (name.includes("rent_percent")) {
      const priceField = name.replace("percent", "price");
      updatedFormData[priceField] = (
        (purchasePrice * numericValue) /
        100
      ).toFixed(2);
    }

    setFormData(updatedFormData);
  };


  const brandOptions = brands.map((brand) => ({
    value: brand.brand_name,
    label: brand.brand_name,
  }));

  const categoryOptions = categories.map((cat) => ({
    value: cat.category_name,
    label: cat.category_name,
  }));


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

      // ✅ If product_category is RAM, set ram = sizeGb
      const formDataCopy = { ...formData };
      if (formDataCopy.product_category === "RAM") {
        formDataCopy.ram = formDataCopy.sizeGb?.toString() || "";
      }

      // Append all fields to FormData
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

      // Better approach - let axios set the correct Content-Type automatically
      const response = await axios.post(
        `${API_URL}/product-templete/create`,
        formDataToSend,
        {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );

      showSnackbar(
        response.data.message || "Product added successfully!",
        "success"
      );

      // Reset form
      setFormData({
        product_category: "",
        product_id: generateProductId(),
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

        // Specifications
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
        processor_core: "",
        battery: "",
        adapter: "",
        resolution: "",
        brightness: "",
        

        // Accessories
        mouse: true,
        keyboard: true,
        dvd: false,
        speaker: true,
        webcam: true,

        // Desktop components
        motherboard: "",
        cabinet: "",
        smps: "",
        ram_slots: "",

        // Monitor
        screen_size: "",

        // Storage
        capacity: "",
        speed: "",
        frequency_band: "",
        wifi_standard: "",
        ssd_type: "",
        // RAM
        ramType: "",
        sizeGb: "",
        frequencyMhz: "",
        manufacturer: "",

        // Price fields
        purchase_price: 0,
        rent_percent_per_day: 0,
        rent_price_per_day: 0,
        rent_percent_per_month: 0,
        rent_price_per_month: 0,
        rent_percent_6_months: 0,
        rent_price_6_months: 0,
        rent_percent_1_year: 0,
        rent_price_1_year: 0,

        // Status
        is_active: true,
      });

      // Navigate to product library after success
      setTimeout(() => {
        navigate("/dashboard/product_library");
      }, 1500);
    } catch (err) {
      let errorMessage = "An error occurred while saving the product";

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
      case "Laptop": {

        const grid2 = {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        };

        const grid3 = {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        };

        return (
          <>
            {/* Display + Processor Basic */}
            <div style={grid2}>
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
            </div>

            {/* Processor Advanced */}
            <div style={grid3}>
              <Field
                label="Processor Core"
                name="processor_core"
                placeholder="e.g., i5, i7, Ryzen 5"
                value={formData.processor_core}
                onChange={handleChange}
                required
              />

              <Field
                label="Processor Speed"
                name="processor_speed"
                placeholder="Enter Speed (GHz)"
                value={formData.processor_speed}
                onChange={handleChange}
              />

              <Field
                label="Generation"
                name="generation"
                placeholder="Enter Generation"
                value={formData.generation}
                onChange={handleChange}
              />
            </div>

            {/* Battery + Adapter */}
            <div style={grid3}>
              <Field
                label="Battery"
                name="battery"
                placeholder="e.g., 3-cell, 56Wh"
                value={formData.battery}
                onChange={handleChange}
              />

              <Field
                label="Adapter"
                name="adapter"
                placeholder="e.g., 65W, 90W"
                value={formData.adapter}
                onChange={handleChange}
              />
            </div>

            {/* RAM Section */}
            <div style={grid2}>
              <Field
                label="RAM"
                name="ram"
                placeholder="Enter RAM (GB)"
                value={formData.ram}
                onChange={handleChange}
                required
              />

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
                label="RAM Speed"
                name="ram_speed"
                placeholder="Enter RAM Speed (MHz)"
                value={formData.ram_speed}
                onChange={handleChange}
              />

              <Field
                label="RAM Slots"
                name="ram_slots"
                placeholder="Enter Number of Slots"
                value={formData.ram_slots}
                onChange={handleChange}
              />
            </div>

            {/* Storage */}
            <div style={grid2}>
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
            </div>

            {/* Graphics + OS */}
            <div style={grid2}>
              <Field
                label="GPU"
                name="graphics"
                placeholder="Enter Graphics Card"
                value={formData.graphics}
                onChange={handleChange}
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

            {/* HSN */}
            <Field
              label="HSN Code"
              name="hsn_code"
              placeholder="Enter HSN Code"
              value={formData.hsn_code}
              onChange={handleChange}
              required
            />


            {/* <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Included Accessories:
              </label>
              <div style={checkboxGroupStyle}>
                {["mouse", "keyboard", "dvd", "speaker", "webcam"].map(
                  (field) => (
                    <label
                      key={field}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "15px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name={field}
                        checked={formData[field]}
                        onChange={handleChange}
                        style={{ marginRight: "5px" }}
                      />
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  )
                )}
              </div>
            </div> */}
          </>
        );
      }


      case "Projector":
        return (
          <>
            <Field label="Resolution" name="resolution" placeholder="Enter Resolution" value={formData.resolution} onChange={handleChange} required />
            <Field label="Brightness (Lumens)" name="brightness" placeholder="Enter Brightness (Lumens)" value={formData.brightness} onChange={handleChange} />
          </>
        );

      case "Branded Desktop":
        return (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Field
                label="GPU"
                name="graphics"
                placeholder="Enter GPU"
                value={formData.graphics}
                onChange={handleChange}
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
      case "HDD Storage":
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
      case "SSD Storage":
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
              type="text"
              placeholder="e.g., 3500 MB/s, 7200 RPM, 1.6 GHz"
              value={formData.speed}
              onChange={handleChange}
            />

          </>
        );

      case "NVMe Storage":
        return (
          <>
            <Field
              label="Storage Capacity"
              name="capacity"
              placeholder="Enter Storage Capacity (e.g., 512GB / 1TB)"
              value={formData.capacity}
              onChange={handleChange}
              required
            />

            <Field
              label="NVMe Interface"
              name="ramType"
              type="select"
              value={formData.ramType}
              onChange={handleChange}
              required
            >
              <option value="">Select Interface</option>
              <option value="PCIe Gen3">PCIe Gen 3</option>
              <option value="PCIe Gen4">PCIe Gen 4</option>
              <option value="PCIe Gen5">PCIe Gen 5</option>
            </Field>

            <Field
              label="Read/Write Speed"
              name="speed"
              type="text"
              placeholder="e.g., 3500 MB/s"
              value={formData.speed}
              onChange={handleChange}
            />
          </>
        );

      case "Wi-Fi Card":
      case "Wi-Fi Dongle":
        return (
          <>
            <Field
              label="Wi-Fi Standard"
              name="wifi_standard"
              type="select"
              value={formData.wifi_standard}
              onChange={handleChange}
              required
            >
              <option value="">Select Standard</option>
              <option value="802.11a">802.11a</option>
              <option value="802.11b">802.11b</option>
              <option value="802.11g">802.11g</option>
              <option value="802.11n">802.11n</option>
              <option value="802.11ac">802.11ac</option>
              <option value="802.11ax (Wi-Fi 6)">802.11ax (Wi-Fi 6)</option>
            </Field>

            <Field
              label="Frequency Band"
              name="frequency_band"
              type="select"
              value={formData.frequency_band}
              onChange={handleChange}
              required
            >
              <option value="">Select Frequency</option>
              <option value="2.4GHz">2.4GHz</option>
              <option value="5GHz">5GHz</option>
            </Field>

            <Field
              label="Max Speed"
              name="speed"
              placeholder="Enter Max Speed (e.g., 1200 Mbps)"
              value={formData.speed}
              onChange={handleChange}
            />
          </>
        );

      case "Processor":
        return (
          <div style={formContainerStyle}>
            {/* Product Info Card */}
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

                {/* <Field
                  label="Max Speed (GHz)"
                  name="maxSpeed"
                  type="number"
                  placeholder="Enter Max Speed"
                  value={formData.maxSpeed}
                  onChange={handleChange}
                  required
                  step="0.1"
                /> */}

                <Field
                  label="Base Speed (GHz)"
                  name="speed"
                  type="text"          // 👈 IMPORTANT CHANGE
                  placeholder="e.g. 1.6"
                  value={formData.speed}
                  onChange={handleChange}
                  required
                />


              </div>
            </div>
          </div>
        );

      case "Desktop":
        return (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Field
                label="Processor Model"
                name="processor"
                placeholder="Enter Processor Model"
                value={formData.processor}
                onChange={handleChange}
                required
              />

              <Field
                label="Processor Core"
                name="processor_core"
                placeholder="e.g., i5, i7, Ryzen 5"
                value={formData.processor_core}
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
                <option value="SSD / HDD / Hybrid / NVMe">
                  SSD / HDD / Hybrid / NVMe
                </option>
              </Field>

              <Field
                label="GPU"
                name="graphics"
                placeholder="Enter GPU"
                value={formData.graphics}
                onChange={handleChange}
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
            {/* <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Included Accessories:
              </label>
              <div style={checkboxGroupStyle}>
                {["mouse", "keyboard", "dvd", "speaker", "webcam"].map(
                  (field) => (
                    <label
                      key={field}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "15px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name={field}
                        checked={formData[field]}
                        onChange={handleChange}
                        style={{ marginRight: "5px" }}
                      />
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  )
                )}
              </div>
            </div> */}
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

                {/* <Field
                  label="Frequency (MHz)"
                  name="frequencyMhz"
                  type="number"
                  placeholder="Enter Frequency"
                  value={formData.frequencyMhz}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Manufacturer"
                  name="manufacturer"
                  type="text"
                  placeholder="Enter Manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                /> */}
              </div>
            </div>
          </div>
        );

      case "Graphics Card":
        return (
          <>
            <Field
              label="Memory Speed"
              name="speed"
              placeholder="Enter Memory Speed (e.g., 6Gbps)"
              value={formData.speed}
              onChange={handleChange}
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


      case "Monitor":
        return (
          <>
            {/* <Field
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
            /> */}

            <Field
              label="Screen Size"
              name="screen_size"
              placeholder="Enter Screen Size"
              value={formData.screen_size}
              onChange={handleChange}
              required
            />

            <Field label="Resolution" name="resolution" placeholder="Enter Resolution" value={formData.resolution} onChange={handleChange} />


            {/* <Field
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
            /> */}
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


      <BulkUploadSection
        token={userToken}
        onUploadComplete={() => {
          showSnackbar('Bulk upload completed!', 'success');
        }}
        showSnackbar={showSnackbar}
      />


      <DownloadTemplate
        token={userToken}
        showSnackbar={showSnackbar}
      />

      {/* Toggle between single and bulk upload */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            type="button"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#fff',
              color: '#333',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            📝 Add Single Product
          </button>
          <div style={{
            padding: '8px 16px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            OR
          </div>
          <div style={{
            padding: '8px 16px',
            color: '#666'
          }}>
            Use Excel Upload Above
          </div>
        </div>
      </div>


      <form onSubmit={handleSubmit} style={formContainerStyle}>
        {/* Left Column - Product Category & Details */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={cardHeaderStyle}>Product Information</h3>
          </div>

          <div style={fieldsGridStyle}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
                Product Category
              </label>

              <Select
                options={categoryOptions}
                placeholder="Search & Select Category"
                value={
                  categoryOptions.find(
                    (option) => option.value === formData.product_category
                  ) || null
                }
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    product_category: selectedOption
                      ? selectedOption.value
                      : "",
                  }));
                }}
                isClearable
                isSearchable
              />
            </div>

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

            {/* <Field
              label="Product ID"
              name="product_id"
              placeholder="Enter Product ID"
              value={formData.product_id}
              onChange={handleChange}
              required
            /> */}
            <Field
              label="Product Name"
              name="product_name"
              placeholder="Enter Product Name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />

            {formData.product_category !== "Assembled Desktop" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
                  Brand
                </label>

                <Select
                  options={brandOptions}
                  placeholder="Search & Select Brand"
                  value={
                    brandOptions.find(
                      (option) => option.value === formData.brand
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    setFormData((prev) => ({
                      ...prev,
                      brand: selectedOption ? selectedOption.value : "",
                    }))
                  }
                  isClearable
                  isSearchable
                />
              </div>
            )}

            {/* <Field
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
            </Field> */}

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
              {stockLocations.map((loc) => (
                <option key={loc.stockLocationId} value={loc.stockName}>
                  {loc.stockName}
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
              required
            />

            {/* Rent Percentage Input for Per Month */}
            <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
              <label style={labelStyle}>
                Rent Percent Per Month
                <span style={requiredStyle}>*</span>
              </label>

              <input
                type="number"
                min="0"
                max="70"
                step="1"
                name="rent_percent_per_month"
                value={formData.rent_percent_per_month}
                onChange={handlePriceChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                placeholder="Enter Rent Percent (0 - 70)"
              />

              {/* Output Field (Read Only) */}
              <div style={{ marginTop: "1rem" }}>
                <Field
                  label="Rent Price Per Month"
                  type="text"
                  name="rent_price_per_month"
                  value={`₹${formData.rent_price_per_month}/-`}
                  readOnly
                  style={readonlyFieldStyle}
                />
              </div>
            </div>


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

const sliderContainerStyle = {
  position: "relative",
  margin: "1.5rem 0 1rem 0",
  padding: "0 0.5rem",
};

const sliderStyle = {
  width: "100%",
  height: "6px",
  borderRadius: "3px",
  background: "#ddd",
  outline: "none",
  opacity: "0.7",
  transition: "opacity .2s",
  WebkitAppearance: "none",

  "&:hover": {
    opacity: "1",
  },

  "&::-webkit-slider-thumb": {
    WebkitAppearance: "none",
    appearance: "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#2563eb",
    cursor: "pointer",
    border: "2px solid #fff",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  },

  "&::-moz-range-thumb": {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#2563eb",
    cursor: "pointer",
    border: "2px solid #fff",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  },
};

const sliderValueContainerStyle = {
  textAlign: "center",
  marginTop: "10px",
  marginBottom: "25px",
};

const sliderValueStyle = {
  display: "inline-block",
  padding: "5px 15px",
  backgroundColor: "#2563eb",
  color: "white",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: "1rem",
};

const sliderTicksContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  marginTop: "5px",
};

const sliderTickStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
};

const sliderTickMarkStyle = {
  width: "2px",
  height: "10px",
  backgroundColor: "#999",
  marginBottom: "5px",
};

const sliderTickLabelStyle = {
  fontSize: "0.75rem",
  color: "#666",
  position: "absolute",
  top: "15px",
};

const sliderOutputContainerStyle = {
  marginTop: "1rem",
  padding: "1rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
};

const readonlyFieldStyle = {
  backgroundColor: "#f8f9fa",
  cursor: "not-allowed",
};

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

export default ProductsAddLayout;







////UPDATED BACKUP CODE 09-01-2026



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Select from "react-select";


// const generateProductId = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let randomPart = "";
//   for (let i = 0; i < 5; i++) {
//     randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return `PRD-${randomPart}`;
// };

// // Add this Alert component (optional but recommended for better styling)
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const ProductsAddLayout = () => {
//   const navigate = useNavigate();

//   const { user, token } = useSelector((state) => state.auth);

//   const userToken = token;

//   // State for form data
//   const [formData, setFormData] = useState({
//     // Common product fields
//     product_category: "",
//     product_id: generateProductId(),
//     product_name: "",
//     product_image: null,
//     brand: "",
//     grade: "",
//     model: "",
//     pro_model: "",
//     st_number: "",
//     stock_location: "",
//     description: "",
//     hsn_code: "",

//     // Specifications - common
//     ram: "",
//     ram_speed: "",
//     disk_type: "",
//     processor: "",
//     processor_model: "",
//     processor_speed: "",
//     generation: "",
//     storage: "",
//     graphics: "",
//     os: "",
//     display_size: "",

//     // Laptop specific
//     mouse: false,
//     keyboard: false,
//     dvd: false,
//     speaker: false,
//     webcam: false,

//     // Desktop specific
//     motherboard: "",
//     cabinet: "",
//     smps: "",
//     ram_slots: "",

//     // Monitor specific
//     screen_size: "",

//     // HDD specific
//     capacity: "",
//     speed: "",
//     frequency_band: "",
//     wifi_standard: "",
//     // SSD specific
//     ssd_type: "",

//     // RAM specific
//     ramType: "",
//     sizeGb: "",
//     frequencyMhz: "",
//     manufacturer: "",

//     // Price fields
//     purchase_price: "",
//     rent_percent_per_day: 0,
//     rent_price_per_day: "",
//     rent_percent_per_month: 0,
//     rent_price_per_month: "",
//     rent_percent_6_months: 0,
//     rent_price_6_months: "",
//     rent_percent_1_year: 0,
//     rent_price_1_year: "",

//     // Status
//     is_active: true,
//   });

//   // State for API data
//   const [brands, setBrands] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [stockLocations, setStockLocations] = useState([]);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });

//   const showSnackbar = (message, severity = "info") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       product_id: generateProductId(),
//     }));
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [brandsRes, categoriesRes, stockLocationRes] = await Promise.all([
//           axios.get(`${API_URL}/product-brands/active`, {
//             headers: {
//               "Authorization": `Bearer ${userToken}`,
//             },
//           }),
//           axios.get(`${API_URL}/product-categories/active`, {
//             headers: {
//               "Authorization": `Bearer ${userToken}`,
//             },
//           }),
//           axios.get(`${API_URL}/stock-location/active-stock-location`, {
//             headers: {
//               "Authorization": `Bearer ${userToken}`,
//             },
//           }),
//         ]);

//         setBrands(brandsRes.data);
//         setCategories(categoriesRes.data);
//         setStockLocations(
//           stockLocationRes.data.map((item) => ({
//             stockLocationId: item.stock_location_id,
//             stockName: item.stock_name,
//           }))
//         );

//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userToken]); // Added userToken as dependency


//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     // Handle checkbox
//     if (type === "checkbox") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: checked,
//       }));
//       return;
//     }

//     // ✅ Allow numbers + decimals + text (no blocking)
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };




//   // Handle price changes and calculate rent prices
//   const handlePriceChange = (e) => {
//     const { name, value } = e.target;

//     let cleanedValue = value;

//     // Remove leading zeros BUT allow single "0"
//     if (name.includes("rent_percent") || name === "purchase_price") {
//       cleanedValue = cleanedValue.replace(/^0+(?=\d)/, "");
//       if (cleanedValue === "") cleanedValue = "0";
//     }

//     // Convert cleaned value to number ONLY for calculations
//     const numericValue = Number(cleanedValue);

//     const purchasePrice =
//       name === "purchase_price"
//         ? numericValue
//         : Number(formData.purchase_price) || 0;

//     // Update the input field
//     const updatedFormData = {
//       ...formData,
//       [name]: cleanedValue,
//     };

//     // If purchase price changed → update all rent prices
//     if (name === "purchase_price") {
//       updatedFormData.rent_price_per_day = (
//         (purchasePrice * Number(formData.rent_percent_per_day)) /
//         100
//       ).toFixed(2);

//       updatedFormData.rent_price_per_month = (
//         (purchasePrice * Number(formData.rent_percent_per_month)) /
//         100
//       ).toFixed(2);

//       updatedFormData.rent_price_6_months = (
//         (purchasePrice * Number(formData.rent_percent_6_months)) /
//         100
//       ).toFixed(2);

//       updatedFormData.rent_price_1_year = (
//         (purchasePrice * Number(formData.rent_percent_1_year)) /
//         100
//       ).toFixed(2);
//     }
//     // If a rent percentage is updated → update only its rent price
//     else if (name.includes("rent_percent")) {
//       const priceField = name.replace("percent", "price");
//       updatedFormData[priceField] = (
//         (purchasePrice * numericValue) /
//         100
//       ).toFixed(2);
//     }

//     setFormData(updatedFormData);
//   };


//   const brandOptions = brands.map((brand) => ({
//     value: brand.brand_name,
//     label: brand.brand_name,
//   }));

//   const categoryOptions = categories.map((cat) => ({
//     value: cat.category_name,
//     label: cat.category_name,
//   }));


//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (parseFloat(formData.purchase_price) <= 0) {
//       showSnackbar("Please enter a valid purchase price", "error");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const formDataToSend = new FormData();

//       // ✅ If product_category is RAM, set ram = sizeGb
//       const formDataCopy = { ...formData };
//       if (formDataCopy.product_category === "RAM") {
//         formDataCopy.ram = formDataCopy.sizeGb?.toString() || "";
//       }

//       // Append all fields to FormData
//       Object.entries(formDataCopy).forEach(([key, value]) => {
//         if (value === null || value === undefined) return;

//         if (typeof value === "boolean") {
//           formDataToSend.append(key, value ? "1" : "0");
//         } else if (value instanceof File) {
//           formDataToSend.append(key, value, value.name);
//         } else {
//           formDataToSend.append(key, value.toString());
//         }
//       });

//       // Better approach - let axios set the correct Content-Type automatically
//       const response = await axios.post(
//         `${API_URL}/product-templete/create`,
//         formDataToSend,
//         {
//           headers: {
//             "Authorization": `Bearer ${userToken}`,
//           },
//         }
//       );

//       showSnackbar(
//         response.data.message || "Product added successfully!",
//         "success"
//       );

//       // Reset form
//       setFormData({
//         product_category: "",
//         product_id: generateProductId(),
//         product_name: "",
//         product_image: null,
//         brand: "",
//         grade: "",
//         model: "",
//         pro_model: "",
//         st_number: "",
//         stock_location: "",
//         description: "",
//         hsn_code: "",

//         // Specifications
//         ram: "",
//         ram_speed: "",
//         disk_type: "",
//         processor: "",
//         processor_model: "",
//         processor_speed: "",
//         generation: "",
//         storage: "",
//         graphics: "",
//         os: "",
//         display_size: "",

//         // Accessories
//         mouse: true,
//         keyboard: true,
//         dvd: false,
//         speaker: true,
//         webcam: true,

//         // Desktop components
//         motherboard: "",
//         cabinet: "",
//         smps: "",
//         ram_slots: "",

//         // Monitor
//         screen_size: "",

//         // Storage
//         capacity: "",
//         speed: "",
//         frequency_band: "",
//         wifi_standard: "",
//         ssd_type: "",
//         // RAM
//         ramType: "",
//         sizeGb: "",
//         frequencyMhz: "",
//         manufacturer: "",

//         // Price fields
//         purchase_price: 0,
//         rent_percent_per_day: 0,
//         rent_price_per_day: 0,
//         rent_percent_per_month: 0,
//         rent_price_per_month: 0,
//         rent_percent_6_months: 0,
//         rent_price_6_months: 0,
//         rent_percent_1_year: 0,
//         rent_price_1_year: 0,

//         // Status
//         is_active: true,
//       });

//       // Navigate to product library after success
//       setTimeout(() => {
//         navigate("/dashboard/product_library");
//       }, 1500);
//     } catch (err) {
//       let errorMessage = "An error occurred while saving the product";

//       if (err.response) {
//         errorMessage =
//           err.response.data.message ||
//           err.response.data.error ||
//           `Server error: ${err.response.status}`;
//       } else if (err.request) {
//         errorMessage = "No response from server. Please check your connection.";
//       }

//       showSnackbar(errorMessage, "error");
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render different specification fields based on product category
//   const renderSpecificationFields = () => {
//     switch (formData.product_category) {
//       case "Laptop":
//         return (
//           <>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "16px",
//               }}
//             >
//               {/* <Field
//     label="Model"
//     name="model"
//     placeholder="Enter Model"
//     value={formData.model}
//     onChange={handleChange}
//     required
//   /> */}
//               <Field
//                 label="Display Size"
//                 name="display_size"
//                 placeholder="Enter Display Size (inches)"
//                 value={formData.display_size}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Processor Model"
//                 name="processor_model"
//                 placeholder="Enter Processor Model"
//                 value={formData.processor_model}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Processor Speed"
//                 name="processor_speed"
//                 type="text"
//                 placeholder="Enter Processor Speed (GHz)"
//                 value={formData.processor_speed}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Generation"
//                 name="generation"
//                 placeholder="Enter Generation"
//                 value={formData.generation}
//                 onChange={handleChange}
//               />
//             </div>

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "16px",
//               }}
//             >
//               <Field
//                 label="RAM"
//                 name="ram"
//                 placeholder="Enter RAM (GB)"
//                 value={formData.ram}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="RAM Speed (optional)"
//                 name="ram_speed"
//                 placeholder="Enter RAM Speed (MHz)"
//                 value={formData.ram_speed}
//                 onChange={handleChange}
//               />
//             </div>

//             <Field
//               label="Hard Drive"
//               type="select"
//               name="disk_type"
//               value={formData.disk_type}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Disk Type</option>
//               <option value="HDD">HDD</option>
//               <option value="SSD">SSD</option>
//               <option value="NVMe SSD">NVMe SSD</option>
//               <option value="Hybrid">Hybrid</option>
//             </Field>

//             <Field
//               label="Storage Capacity"
//               name="storage"
//               placeholder="Enter Storage (GB/TB)"
//               value={formData.storage}
//               onChange={handleChange}
//               required
//             />

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "16px",
//               }}
//             >
//               <Field
//                 label="GPU"
//                 name="graphics"
//                 placeholder="Enter Graphics Card"
//                 value={formData.graphics}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Operating System"
//                 name="os"
//                 placeholder="Enter OS"
//                 value={formData.os}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <Field
//               label="HSN Code"
//               name="hsn_code"
//               placeholder="Enter HSN Code"
//               value={formData.hsn_code}
//               onChange={handleChange}
//               required
//             />

//             {/* <div style={{ gridColumn: "1 / -1" }}>
//               <label style={{ display: "block", marginBottom: "8px" }}>
//                 Included Accessories:
//               </label>
//               <div style={checkboxGroupStyle}>
//                 {["mouse", "keyboard", "dvd", "speaker", "webcam"].map(
//                   (field) => (
//                     <label
//                       key={field}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginRight: "15px",
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         name={field}
//                         checked={formData[field]}
//                         onChange={handleChange}
//                         style={{ marginRight: "5px" }}
//                       />
//                       {field.charAt(0).toUpperCase() + field.slice(1)}
//                     </label>
//                   )
//                 )}
//               </div>
//             </div> */}
//           </>
//         );

//       case "Projector":
//         return (
//           <>
//             <Field label="Resolution" name="resolution" placeholder="Enter Resolution" value={formData.resolution} onChange={handleChange} required />
//             <Field label="Brightness (Lumens)" name="brightness" placeholder="Enter Brightness (Lumens)" value={formData.brightness} onChange={handleChange} />
//           </>
//         );

//       case "Branded Desktop":
//         return (
//           <>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "16px",
//               }}
//             >
//               <Field
//                 label="Processor Model"
//                 name="processor"
//                 placeholder="Enter Processor Model"
//                 value={formData.processor}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Processor Speed"
//                 name="processor_speed"
//                 placeholder="Enter Processor Speed (e.g., 3.4 GHz)"
//                 value={formData.processor_speed}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Generation"
//                 name="generation"
//                 placeholder="Enter Generation (e.g., 12th Gen)"
//                 value={formData.generation}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Mother Board"
//                 name="motherboard"
//                 placeholder="Enter Motherboard"
//                 value={formData.motherboard}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="RAM"
//                 name="ram"
//                 placeholder="Enter RAM (e.g., 8GB)"
//                 value={formData.ram}
//                 onChange={handleChange}
//                 required
//               />
//               <Field
//                 label="Hard Drive"
//                 name="storage"
//                 placeholder="Enter Hard Drive (e.g., 512GB)"
//                 value={formData.storage}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <Field
//               label="RAM Speed (optional)"
//               name="ram_speed"
//               placeholder="Enter RAM Speed (MHz)"
//               value={formData.ram_speed}
//               onChange={handleChange}
//             />

//             <Field
//               label="Disk type"
//               type="select"
//               name="disk_type"
//               value={formData.disk_type}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Disk Type</option>
//               <option value="HDD">HDD</option>
//               <option value="SSD">SSD</option>
//               <option value="NVMe SSD">NVMe SSD</option>
//             </Field>

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "16px",
//               }}
//             >
//               <Field
//                 label="GPU"
//                 name="graphics"
//                 placeholder="Enter GPU"
//                 value={formData.graphics}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Cabinet"
//                 name="cabinet"
//                 placeholder="Enter Cabinet"
//                 value={formData.cabinet}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="SMPS"
//                 name="smps"
//                 placeholder="Enter SMPS"
//                 value={formData.smps}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Operating System"
//                 name="os"
//                 placeholder="Enter Operating System"
//                 value={formData.os}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <Field
//               label="HSN Code"
//               name="hsn_code"
//               placeholder="Enter HSN Code"
//               value={formData.hsn_code}
//               onChange={handleChange}
//               required
//             />
//           </>
//         );
//       case "HDD Storage":
//         return (
//           <>
//             <Field
//               label="Storage Capacity"
//               name="capacity"
//               placeholder="Enter Storage Capacity (e.g., 1TB)"
//               value={formData.capacity}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="Speed"
//               name="speed"
//               placeholder="Enter Speed (e.g., 7200 RPM)"
//               value={formData.speed}
//               onChange={handleChange}
//             />
//           </>
//         );
//       case "SSD Storage":
//         return (
//           <>
//             <Field
//               label="Storage Capacity"
//               name="capacity"
//               placeholder="Enter Storage Capacity (e.g., 512GB)"
//               value={formData.capacity}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="SSD Type"
//               name="ssd_type"
//               type="select"
//               value={formData.ssd_type}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select SSD Type</option>
//               <option value="SATA">SATA</option>
//               <option value="M.2">M.2</option>
//               <option value="NVMe">NVMe</option>
//             </Field>

//             <Field
//               label="Read/Write Speed"
//               name="speed"
//               type="text"
//               placeholder="e.g., 3500 MB/s, 7200 RPM, 1.6 GHz"
//               value={formData.speed}
//               onChange={handleChange}
//             />

//           </>
//         );

//       case "NVMe Storage":
//         return (
//           <>
//             <Field
//               label="Storage Capacity"
//               name="capacity"
//               placeholder="Enter Storage Capacity (e.g., 512GB / 1TB)"
//               value={formData.capacity}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="NVMe Interface"
//               name="ramType"
//               type="select"
//               value={formData.ramType}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Interface</option>
//               <option value="PCIe Gen3">PCIe Gen 3</option>
//               <option value="PCIe Gen4">PCIe Gen 4</option>
//               <option value="PCIe Gen5">PCIe Gen 5</option>
//             </Field>

//             <Field
//               label="Read/Write Speed"
//               name="speed"
//               type="text"
//               placeholder="e.g., 3500 MB/s"
//               value={formData.speed}
//               onChange={handleChange}
//             />
//           </>
//         );

//       case "Wi-Fi Card":
//       case "Wi-Fi Dongle":
//         return (
//           <>
//             <Field
//               label="Wi-Fi Standard"
//               name="wifi_standard"
//               type="select"
//               value={formData.wifi_standard}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Standard</option>
//               <option value="802.11a">802.11a</option>
//               <option value="802.11b">802.11b</option>
//               <option value="802.11g">802.11g</option>
//               <option value="802.11n">802.11n</option>
//               <option value="802.11ac">802.11ac</option>
//               <option value="802.11ax (Wi-Fi 6)">802.11ax (Wi-Fi 6)</option>
//             </Field>

//             <Field
//               label="Frequency Band"
//               name="frequency_band"
//               type="select"
//               value={formData.frequency_band}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Frequency</option>
//               <option value="2.4GHz">2.4GHz</option>
//               <option value="5GHz">5GHz</option>
//             </Field>

//             <Field
//               label="Max Speed"
//               name="speed"
//               placeholder="Enter Max Speed (e.g., 1200 Mbps)"
//               value={formData.speed}
//               onChange={handleChange}
//             />
//           </>
//         );

//       case "Processor":
//         return (
//           <div style={formContainerStyle}>
//             {/* Product Info Card */}
//             <div style={cardStyle}>
//               <div style={fieldsGridStyle}>
//                 <Field
//                   label="Generation"
//                   name="generation"
//                   placeholder="Enter Generation (e.g., 12th Gen)"
//                   value={formData.generation}
//                   onChange={handleChange}
//                   required
//                 />

//                 {/* <Field
//                   label="Max Speed (GHz)"
//                   name="maxSpeed"
//                   type="number"
//                   placeholder="Enter Max Speed"
//                   value={formData.maxSpeed}
//                   onChange={handleChange}
//                   required
//                   step="0.1"
//                 /> */}

//                 <Field
//                   label="Base Speed (GHz)"
//                   name="speed"
//                   type="text"          // 👈 IMPORTANT CHANGE
//                   placeholder="e.g. 1.6"
//                   value={formData.speed}
//                   onChange={handleChange}
//                   required
//                 />


//               </div>
//             </div>
//           </div>
//         );

//       case "Desktop":
//         return (
//           <>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "16px",
//               }}
//             >
//               <Field
//                 label="Processor Model"
//                 name="processor"
//                 placeholder="Enter Processor Model"
//                 value={formData.processor}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Processor Speed (optional)"
//                 name="processor_speed"
//                 placeholder="Enter Processor Speed (e.g., 3.5 GHz)"
//                 value={formData.processor_speed}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Generation"
//                 name="generation"
//                 placeholder="Enter Generation"
//                 value={formData.generation}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Mother Board"
//                 name="motherboard"
//                 placeholder="Enter Mother Board"
//                 value={formData.motherboard}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="RAM"
//                 name="ram"
//                 placeholder="Enter RAM (e.g., 16GB)"
//                 value={formData.ram}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="RAM Speed (optional)"
//                 name="ram_speed"
//                 placeholder="Enter RAM Speed (MHz)"
//                 value={formData.ram_speed}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="RAM Slots"
//                 name="ram_slots"
//                 placeholder="Enter Number of RAM Slots"
//                 value={formData.ram_slots}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Hard Drive"
//                 name="storage"
//                 placeholder="Enter Hard Drive (e.g., 512GB)"
//                 value={formData.storage}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Disk type"
//                 type="select"
//                 name="disk_type"
//                 value={formData.disk_type}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Disk Type</option>
//                 <option value="HDD">HDD</option>
//                 <option value="SSD">SSD</option>
//                 <option value="SSD / HDD / Hybrid / NVMe">
//                   SSD / HDD / Hybrid / NVMe
//                 </option>
//               </Field>

//               <Field
//                 label="GPU"
//                 name="graphics"
//                 placeholder="Enter GPU"
//                 value={formData.graphics}
//                 onChange={handleChange}
//               />

//               <Field
//                 label="Cabinet"
//                 name="cabinet"
//                 placeholder="Enter Cabinet"
//                 value={formData.cabinet}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="SMPS"
//                 name="smps"
//                 placeholder="Enter SMPS"
//                 value={formData.smps}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="Operating System"
//                 name="os"
//                 placeholder="Enter Operating System"
//                 value={formData.os}
//                 onChange={handleChange}
//                 required
//               />

//               <Field
//                 label="HSN Code"
//                 name="hsn_code"
//                 placeholder="Enter HSN Code"
//                 value={formData.hsn_code}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             {/* <div style={{ gridColumn: "1 / -1" }}>
//               <label style={{ display: "block", marginBottom: "8px" }}>
//                 Included Accessories:
//               </label>
//               <div style={checkboxGroupStyle}>
//                 {["mouse", "keyboard", "dvd", "speaker", "webcam"].map(
//                   (field) => (
//                     <label
//                       key={field}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginRight: "15px",
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         name={field}
//                         checked={formData[field]}
//                         onChange={handleChange}
//                         style={{ marginRight: "5px" }}
//                       />
//                       {field.charAt(0).toUpperCase() + field.slice(1)}
//                     </label>
//                   )
//                 )}
//               </div>
//             </div> */}
//           </>
//         );

//       case "RAM":
//         return (
//           <div style={formContainerStyle}>
//             <div style={cardStyle}>
//               <div style={fieldsGridStyle}>
//                 <Field
//                   label="RAM Type"
//                   name="ramType"
//                   type="select"
//                   value={formData.ramType}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select RAM Type</option>
//                   <option value="DDR3">DDR3</option>
//                   <option value="DDR4">DDR4</option>
//                   <option value="DDR5">DDR5</option>
//                   <option value="LPDDR4">LPDDR4</option>
//                   <option value="LPDDR5">LPDDR5</option>
//                 </Field>

//                 <Field
//                   label="Size (GB)"
//                   name="sizeGb"
//                   type="select"
//                   value={formData.sizeGb}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Size</option>
//                   <option value="4GB">4 GB</option>
//                   <option value="8GB">8 GB</option>
//                   <option value="16GB">16 GB</option>
//                   <option value="32GB">32 GB</option>
//                   <option value="64GB">64 GB</option>
//                 </Field>

//                 <Field
//                   label="Speed"
//                   name="speed"
//                   placeholder="Enter Speed"
//                   value={formData.speed}
//                   onChange={handleChange}
//                   required
//                 />

//                 {/* <Field
//                   label="Frequency (MHz)"
//                   name="frequencyMhz"
//                   type="number"
//                   placeholder="Enter Frequency"
//                   value={formData.frequencyMhz}
//                   onChange={handleChange}
//                   required
//                 />

//                 <Field
//                   label="Manufacturer"
//                   name="manufacturer"
//                   type="text"
//                   placeholder="Enter Manufacturer"
//                   value={formData.manufacturer}
//                   onChange={handleChange}
//                   required
//                 /> */}
//               </div>
//             </div>
//           </div>
//         );

//       case "Graphics Card":
//         return (
//           <>
//             <Field
//               label="Memory Speed"
//               name="speed"
//               placeholder="Enter Memory Speed (e.g., 6Gbps)"
//               value={formData.speed}
//               onChange={handleChange}
//             />
//           </>
//         );
//       case "SMPS":
//         return (
//           <>
//             <Field
//               label="Power in Watts"
//               name="smps"
//               placeholder="Enter Power (e.g., 450W)"
//               value={formData.smps}
//               onChange={handleChange}
//               required
//             />
//           </>
//         );


//       case "Monitor":
//         return (
//           <>
//             {/* <Field
//               label="Display Device"
//               name="display_device"
//               placeholder="Enter Display Device"
//               value={formData.display_device}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="Power Consumption"
//               name="power_consumption"
//               placeholder="Enter Power Consumption"
//               value={formData.power_consumption}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="Resolution"
//               name="resolution"
//               placeholder="Enter Resolution"
//               value={formData.resolution}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="Brightness"
//               name="brightness"
//               placeholder="Enter Brightness"
//               value={formData.brightness}
//               onChange={handleChange}
//               required
//             /> */}

//             <Field
//               label="Screen Size"
//               name="screen_size"
//               placeholder="Enter Screen Size"
//               value={formData.screen_size}
//               onChange={handleChange}
//               required
//             />

//             <Field label="Resolution" name="resolution" placeholder="Enter Resolution" value={formData.resolution} onChange={handleChange} />


//             {/* <Field
//               label="Color"
//               name="color"
//               placeholder="Enter Color"
//               value={formData.color}
//               onChange={handleChange}
//               required
//             />

//             <Field
//               label="Audio Output"
//               name="audio_output"
//               placeholder="Enter Audio Output"
//               value={formData.audio_output}
//               onChange={handleChange}
//             />

//             <Field
//               label="Weight"
//               name="weight"
//               placeholder="Enter Weight"
//               value={formData.weight}
//               onChange={handleChange}
//             /> */}
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   if (loading && brands.length === 0 && categories.length === 0) {
//     return <div style={loadingStyle}>Loading...</div>;
//   }

//   if (error) {
//     return <div style={errorStyle}>Error: {error}</div>;
//   }

//   return (
//     <div style={containerStyle}>
//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <form onSubmit={handleSubmit} style={formContainerStyle}>
//         {/* Left Column - Product Category & Details */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>📦</div>
//             <h3 style={cardHeaderStyle}>Product Information</h3>
//           </div>

//           <div style={fieldsGridStyle}>
//             <div style={{ marginBottom: "16px" }}>
//               <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
//                 Product Category
//               </label>

//               <Select
//                 options={categoryOptions}
//                 placeholder="Search & Select Category"
//                 value={
//                   categoryOptions.find(
//                     (option) => option.value === formData.product_category
//                   ) || null
//                 }
//                 onChange={(selectedOption) => {
//                   setFormData((prev) => ({
//                     ...prev,
//                     product_category: selectedOption
//                       ? selectedOption.value
//                       : "",
//                   }));
//                 }}
//                 isClearable
//                 isSearchable
//               />
//             </div>

//             <div style={{ gridColumn: "1 / -1" }}>
//               <label style={{ fontWeight: "bold" }}>Add Images</label>

//               <div
//                 onClick={() =>
//                   document.getElementById("hiddenImageInput").click()
//                 }
//                 style={{
//                   marginTop: "5px",
//                   border: "2px dashed #ccc",
//                   borderRadius: "8px",
//                   height: "100px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   cursor: "pointer",
//                   backgroundColor: "#f9f9f9",
//                   color: "#888",
//                   fontSize: "24px",
//                 }}
//               >
//                 +
//               </div>

//               <input
//                 type="file"
//                 id="hiddenImageInput"
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     product_image: e.target.files[0] || null,
//                   }))
//                 }
//               />

//               {formData.product_image && (
//                 <p
//                   style={{ color: "green", fontSize: "14px", marginTop: "8px" }}
//                 >
//                   Selected: {formData.product_image.name}
//                 </p>
//               )}
//             </div>

//             {/* <Field
//               label="Product ID"
//               name="product_id"
//               placeholder="Enter Product ID"
//               value={formData.product_id}
//               onChange={handleChange}
//               required
//             /> */}
//             <Field
//               label="Product Name"
//               name="product_name"
//               placeholder="Enter Product Name"
//               value={formData.product_name}
//               onChange={handleChange}
//               required
//             />

//             {formData.product_category !== "Assembled Desktop" && (
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
//                   Brand
//                 </label>

//                 <Select
//                   options={brandOptions}
//                   placeholder="Search & Select Brand"
//                   value={
//                     brandOptions.find(
//                       (option) => option.value === formData.brand
//                     ) || null
//                   }
//                   onChange={(selectedOption) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       brand: selectedOption ? selectedOption.value : "",
//                     }))
//                   }
//                   isClearable
//                   isSearchable
//                 />
//               </div>
//             )}

//             {/* <Field
//               label="Grade"
//               type="select"
//               name="grade"
//               value={formData.grade}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Grade</option>
//               <option value="A+">A+</option>
//               <option value="A">A</option>
//               <option value="B">B</option>
//               <option value="C">C</option>
//               <option value="Refurbished">Refurbished</option>
//             </Field> */}

//             <Field
//               label="Model"
//               name="model"
//               placeholder="Enter Model"
//               value={formData.model}
//               onChange={handleChange}
//               required
//             />

//             {/* <Field
//               label="Stock Location"
//               type="select"
//               name="stock_location"
//               value={formData.stock_location}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Stock Location</option>
//               {stockLocations.map((loc) => (
//                 <option key={loc.stockLocationId} value={loc.stockName}>
//                   {loc.stockName}
//                 </option>
//               ))}
//             </Field> */}
//           </div>
//         </div>

//         {/* Middle Column - Specifications */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>⚙️</div>
//             <h3 style={cardHeaderStyle}>Specifications</h3>
//           </div>

//           <div style={fieldsGridStyle}>{renderSpecificationFields()}</div>

//           <div style={buttonContainerStyle}>
//             <button type="submit" style={saveBtnStyle} disabled={loading}>
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </div>

//         {/* Right Column - Price Details */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>💰</div>
//             <h3 style={cardHeaderStyle}>Price Details</h3>
//           </div>

//           <div style={{ display: "grid", gap: "1.2rem" }}>
//             <Field
//               label="Purchase Price"
//               name="purchase_price"
//               type="number"
//               placeholder="Enter Purchase Price"
//               value={formData.purchase_price}
//               onChange={handlePriceChange}
//               required
//             />

//             {/* Rent Percentage Input for Per Month */}
//             <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
//               <label style={labelStyle}>
//                 Rent Percent Per Month
//                 <span style={requiredStyle}>*</span>
//               </label>

//               <input
//                 type="number"
//                 min="0"
//                 max="70"
//                 step="1"
//                 name="rent_percent_per_month"
//                 value={formData.rent_percent_per_month}
//                 onChange={handlePriceChange}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   borderRadius: "6px",
//                   border: "1px solid #ccc",
//                   fontSize: "14px",
//                   marginTop: "5px",
//                 }}
//                 placeholder="Enter Rent Percent (0 - 70)"
//               />

//               {/* Output Field (Read Only) */}
//               <div style={{ marginTop: "1rem" }}>
//                 <Field
//                   label="Rent Price Per Month"
//                   type="text"
//                   name="rent_price_per_month"
//                   value={`₹${formData.rent_price_per_month}/-`}
//                   readOnly
//                   style={readonlyFieldStyle}
//                 />
//               </div>
//             </div>


//             <div style={{ gridColumn: "1 / -1" }}>
//               <Field
//                 label="Description"
//                 type="textarea"
//                 name="description"
//                 placeholder="Enter Description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>

//             <div style={{ marginTop: "2rem" }}>
//               <div style={cardHeaderContainerStyle}>
//                 <div style={iconStyle}>🎛️</div>
//                 <h3 style={cardHeaderStyle}>Control</h3>
//               </div>
//               <CheckboxField
//                 label="Active Status"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Field component
// const Field = ({
//   label,
//   placeholder,
//   type = "text",
//   name,
//   value,
//   onChange,
//   required = false,
//   children,
//   readOnly,
// }) => (
//   <div style={fieldContainerStyle}>
//     <label style={labelStyle}>
//       {label}
//       {required && <span style={requiredStyle}>*</span>}
//     </label>
//     {type === "select" ? (
//       <div style={selectWrapperStyle}>
//         <select
//           style={selectStyle}
//           name={name}
//           value={value}
//           onChange={onChange}
//           required={required}
//         >
//           {children}
//         </select>
//         <div style={selectArrowStyle}>▼</div>
//       </div>
//     ) : type === "textarea" ? (
//       <textarea
//         name={name}
//         placeholder={placeholder}
//         style={textareaStyle}
//         rows={3}
//         value={value}
//         onChange={onChange}
//         required={required}
//       />
//     ) : type === "button" ? (
//       <button style={buttonFieldStyle}>+</button>
//     ) : type === "number" ? (
//       <input
//         type="text"
//         name={name}
//         placeholder={placeholder}
//         style={inputStyle}
//         value={value}
//         onChange={onChange}
//         required={required}
//         readOnly={readOnly}
//         inputMode="numeric"
//         pattern="[0-9]*"
//       />
//     ) : (
//       <input
//         type={type}
//         name={name}
//         placeholder={placeholder}
//         style={inputStyle}
//         value={value}
//         onChange={onChange}
//         required={required}
//         readOnly={readOnly}
//       />
//     )}
//   </div>
// );

// const CheckboxField = ({ label, name, checked, onChange }) => (
//   <div style={checkboxContainerStyle}>
//     <label style={checkboxLabelStyle}>
//       {/* Hidden but functional checkbox */}
//       <input
//         type="checkbox"
//         name={name}
//         checked={checked}
//         onChange={onChange}
//         style={{
//           position: "absolute",
//           opacity: 0,
//           width: "20px",
//           height: "20px",
//           cursor: "pointer",
//           zIndex: 1,
//         }}
//       />
//       {/* Custom checkbox visualization */}
//       <div
//         style={{
//           ...checkboxCustomStyle,
//           backgroundColor: checked ? "#4CAF50" : "#ffffff",
//           borderColor: checked ? "#4CAF50" : "#d1d5db",
//         }}
//       >
//         {checked && <span style={checkmarkStyle}>✓</span>}
//       </div>
//       <span style={checkboxTextStyle}>{label}</span>
//     </label>
//   </div>
// );

// // Styles

// const sliderContainerStyle = {
//   position: "relative",
//   margin: "1.5rem 0 1rem 0",
//   padding: "0 0.5rem",
// };

// const sliderStyle = {
//   width: "100%",
//   height: "6px",
//   borderRadius: "3px",
//   background: "#ddd",
//   outline: "none",
//   opacity: "0.7",
//   transition: "opacity .2s",
//   WebkitAppearance: "none",

//   "&:hover": {
//     opacity: "1",
//   },

//   "&::-webkit-slider-thumb": {
//     WebkitAppearance: "none",
//     appearance: "none",
//     width: "20px",
//     height: "20px",
//     borderRadius: "50%",
//     background: "#2563eb",
//     cursor: "pointer",
//     border: "2px solid #fff",
//     boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//   },

//   "&::-moz-range-thumb": {
//     width: "20px",
//     height: "20px",
//     borderRadius: "50%",
//     background: "#2563eb",
//     cursor: "pointer",
//     border: "2px solid #fff",
//     boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//   },
// };

// const sliderValueContainerStyle = {
//   textAlign: "center",
//   marginTop: "10px",
//   marginBottom: "25px",
// };

// const sliderValueStyle = {
//   display: "inline-block",
//   padding: "5px 15px",
//   backgroundColor: "#2563eb",
//   color: "white",
//   borderRadius: "20px",
//   fontWeight: "bold",
//   fontSize: "1rem",
// };

// const sliderTicksContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   position: "relative",
//   marginTop: "5px",
// };

// const sliderTickStyle = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   position: "relative",
// };

// const sliderTickMarkStyle = {
//   width: "2px",
//   height: "10px",
//   backgroundColor: "#999",
//   marginBottom: "5px",
// };

// const sliderTickLabelStyle = {
//   fontSize: "0.75rem",
//   color: "#666",
//   position: "absolute",
//   top: "15px",
// };

// const sliderOutputContainerStyle = {
//   marginTop: "1rem",
//   padding: "1rem",
//   backgroundColor: "#f8f9fa",
//   borderRadius: "8px",
//   border: "1px solid #e9ecef",
// };

// const readonlyFieldStyle = {
//   backgroundColor: "#f8f9fa",
//   cursor: "not-allowed",
// };

// const breadcrumbStyle = {
//   marginBottom: "1.5rem",
//   fontSize: "0.875rem",
//   color: "#6b7280",
//   fontWeight: "400",
// };

// const controlSectionStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "1rem",
// };

// const loadingStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   fontSize: "1.2rem",
// };

// const errorStyle = {
//   color: "#ef4444",
//   padding: "2rem",
//   textAlign: "center",
//   fontSize: "1.2rem",
// };

// const successStyle = {
//   position: "fixed",
//   top: "20px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   backgroundColor: "#10b981",
//   color: "white",
//   padding: "1rem 2rem",
//   borderRadius: "8px",
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   zIndex: 1000,
//   display: "flex",
//   alignItems: "center",
//   gap: "1rem",
// };

// const closeSuccessStyle = {
//   backgroundColor: "transparent",
//   border: "none",
//   color: "white",
//   fontSize: "1.2rem",
//   cursor: "pointer",
//   marginLeft: "0.5rem",
// };

// const containerStyle = {
//   padding: "2rem",
//   fontFamily:
//     '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
//   minHeight: "100vh",
//   lineHeight: 1.6,
// };

// const formContainerStyle = {
//   display: "grid",
//   gap: "1.5rem",
//   maxWidth: "1400px",
//   gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
// };

// const cardStyle = {
//   backgroundColor: "#ffffff",
//   padding: "1.5rem",
//   borderRadius: "12px",
//   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
//   border: "1px solid #e2e8f0",
//   transition: "box-shadow 0.2s ease",
// };

// const cardHeaderContainerStyle = {
//   display: "flex",
//   alignItems: "center",
//   marginBottom: "1.5rem",
//   paddingBottom: "1rem",
//   borderBottom: "1px solid #e2e8f0",
// };

// const iconStyle = {
//   fontSize: "1.25rem",
//   marginRight: "0.75rem",
//   backgroundColor: "#f1f5f9",
//   padding: "0.5rem",
//   borderRadius: "8px",
// };

// const cardHeaderStyle = {
//   fontSize: "1.125rem",
//   fontWeight: "600",
//   color: "#1e293b",
//   margin: 0,
// };

// const fieldsGridStyle = {
//   display: "grid",
//   gap: "1rem",
//   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
// };

// const fieldContainerStyle = {
//   display: "flex",
//   flexDirection: "column",
// };

// const labelStyle = {
//   display: "block",
//   marginBottom: "0.5rem",
//   fontWeight: "500",
//   fontSize: "0.875rem",
//   color: "#374151",
//   letterSpacing: "0.025em",
// };

// const requiredStyle = {
//   color: "#ef4444",
//   marginLeft: "0.25rem",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "0.75rem",
//   borderRadius: "8px",
//   border: "1px solid #d1d5db",
//   fontSize: "0.875rem",
//   backgroundColor: "#ffffff",
//   transition: "all 0.2s ease",
//   outline: "none",
//   boxSizing: "border-box",
// };

// const selectWrapperStyle = {
//   position: "relative",
//   width: "100%",
// };

// const selectStyle = {
//   width: "100%",
//   padding: "0.75rem",
//   paddingRight: "2.5rem",
//   borderRadius: "8px",
//   border: "1px solid #d1d5db",
//   fontSize: "0.875rem",
//   backgroundColor: "#ffffff",
//   appearance: "none",
//   transition: "all 0.2s ease",
//   outline: "none",
//   boxSizing: "border-box",
//   cursor: "pointer",
// };

// const selectArrowStyle = {
//   position: "absolute",
//   right: "0.75rem",
//   top: "50%",
//   transform: "translateY(-50%)",
//   pointerEvents: "none",
//   fontSize: "0.75rem",
//   color: "#6b7280",
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "0.75rem",
//   borderRadius: "8px",
//   border: "1px solid #d1d5db",
//   fontSize: "0.875rem",
//   backgroundColor: "#ffffff",
//   transition: "all 0.2s ease",
//   outline: "none",
//   resize: "vertical",
//   fontFamily: "inherit",
//   boxSizing: "border-box",
// };

// const buttonFieldStyle = {
//   width: "100%",
//   padding: "0.75rem",
//   borderRadius: "8px",
//   border: "2px dashed #d1d5db",
//   fontSize: "1.25rem",
//   backgroundColor: "#f9fafb",
//   color: "#6b7280",
//   cursor: "pointer",
//   transition: "all 0.2s ease",
//   outline: "none",
//   fontWeight: "500",
// };

// const checkboxGroupStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
//   gap: "0.75rem",
// };

// const checkboxContainerStyle = {
//   marginTop: "0.5rem",
// };

// const checkboxLabelStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   cursor: "pointer",
//   gap: "0.75rem",
// };

// const checkboxStyle = {
//   display: "none",
// };

// const checkboxCustomStyle = {
//   width: "20px",
//   height: "20px",
//   borderRadius: "4px",
//   border: "2px solid #d1d5db",
//   backgroundColor: "#ffffff",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   transition: "all 0.2s ease",
//   flexShrink: 0,
//   marginTop: "2px",
// };

// const checkmarkStyle = {
//   color: "#ffffff",
//   fontSize: "12px",
//   fontWeight: "bold",
// };

// const checkboxTextStyle = {
//   fontSize: "0.875rem",
//   fontWeight: "500",
//   color: "#374151",
//   display: "block",
// };

// const buttonContainerStyle = {
//   marginTop: "1.5rem",
//   paddingTop: "1rem",
//   borderTop: "1px solid #e2e8f0",
// };

// const saveBtnStyle = {
//   width: "100%",
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#2563eb",
//   color: "white",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "0.875rem",
//   fontWeight: "500",
//   transition: "all 0.2s ease",
//   outline: "none",
// };

// export default ProductsAddLayout;
