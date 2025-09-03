import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetModificationTrackerAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assetId: "",
    product_name: "",
    modificationType: "",
    currentRAM: "",
    currentStorage: "",
    processorModel: "",
    approvalDate: "",
  });

  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [peripheralAssets, setPeripheralAssets] = useState([]);
  const [selectedPeripherals, setSelectedPeripherals] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch delivery challans data when component mounts
  useEffect(() => {
    const fetchDeliveryChallans = async () => {
      try {
        const response = await fetch(
          `${API_URL}/delivery-challans/approved-delivery-challan`
        );
        if (!response.ok) throw new Error("Failed to fetch delivery challans");
        const data = await response.json();
        setDeliveryChallans(data);

        // Extract unique customers
        const uniqueCustomers = data.reduce((acc, challan) => {
          if (!acc.some((c) => c.customer_code === challan.customer_code)) {
            acc.push({
              customer_id: challan.customer_code,
              customer_name:
                challan.customer?.first_name +
                " " +
                challan.customer?.last_name,
              customer_data: challan.customer,
            });
          }
          return acc;
        }, []);
        setCustomers(uniqueCustomers);
      } catch (error) {
        console.error("Error fetching delivery challans:", error);
        setSnackbar({
          open: true,
          message: "Error fetching delivery challans: " + error.message,
          severity: "error",
        });
      }
    };
    fetchDeliveryChallans();
  }, []);

  // Fetch peripheral assets when customer is selected
  useEffect(() => {
    const fetchPeripheralAssets = async () => {
      if (!selectedCustomer) return;

      try {
        const response = await fetch(
          `${API_URL}/delivery-challans/peripheral-assets/${selectedCustomer}`
        );
        if (!response.ok) throw new Error("Failed to fetch peripheral assets");
        const data = await response.json();

        // Transform the API data to handle multiple device IDs
        const transformedData = data.map((item) => {
          const specs = [];
          const category = item.product.product_category;

          if (category === "RAM") {
            // RAM category → show RAM
            if (item.product.ram) specs.push(`${item.product.ram} RAM`);
          } else if (category === "SSD" || category === "HDD") {
            // SSD/HDD category → show storage capacity only
            if (item.product.capacity) specs.push(item.product.capacity);
          } else {
            // Other categories → collect specs
            if (item.product.ram) specs.push(`${item.product.ram} RAM`);
            if (item.product.storage)
              specs.push(`${item.product.storage} Storage`);
            if (item.product.disk_type) specs.push(item.product.disk_type);
          }

          // Fallback → use model if no specs
          if (specs.length === 0 && item.product.model) {
            specs.push(item.product.model);
          }

          return {
            id: item.id,
            asset_id: item.device_ids[0], // Primary device ID for reference
            device_ids: item.device_ids, // ALL device IDs
            product_id: item.product_id,
            product_name: item.product_name,
            category,
            specifications: specs.join(" | ") || item.product_name,
            status: "available",
            product: item.product,
            total_devices: item.device_ids.length, // Count of total devices
          };
        });

        setPeripheralAssets(transformedData);

        // Initialize selectedPeripherals with empty arrays for each category
        const categories = [
          ...new Set(transformedData.map((item) => item.category)),
        ];
        const initialSelected = {};
        categories.forEach((category) => {
          initialSelected[category] = [];
        });
        setSelectedPeripherals(initialSelected);
      } catch (error) {
        console.error("Error fetching peripheral assets:", error);
        setSnackbar({
          open: true,
          message: "Error fetching peripheral assets: " + error.message,
          severity: "error",
        });
      }
    };
    fetchPeripheralAssets();
  }, [selectedCustomer]);

  // When customer is selected, filter available delivery challans
  useEffect(() => {
    if (selectedCustomer) {
      const customerChallans = deliveryChallans.filter(
        (challan) => challan.customer_code === selectedCustomer
      );
      setSelectedChallan(null);
      setAvailableAssets([]);
      setFormData((prev) => ({
        ...prev,
        assetId: "",
        product_name: "",
        currentRAM: "",
        currentStorage: "",
        processorModel: "",
      }));
    }
  }, [selectedCustomer, deliveryChallans]);

  // When delivery challan is selected, set available assets
  useEffect(() => {
    if (selectedChallan) {
      const selectedChallanData = deliveryChallans.find(
        (challan) => challan.id === selectedChallan
      );

      if (selectedChallanData) {
        // Process only the assigned device IDs (not available_device_ids)
        const assets = [];
        selectedChallanData.items.forEach((item) => {
          // Only add the assigned device IDs
          item.device_ids.forEach((deviceId) => {
            assets.push({
              asset_id: deviceId,
              product_id: item.product_id,
              product_name: item.product_name,
              ram: item.product.ram,
              storage: item.product.storage,
              brand: item.product.brand,
              model: item.product.model,
  processor_model: item.product.processor_model, // Add this
              os: item.product.os,
              graphics: item.product.graphics,
              disk_type: item.product.disk_type,
              grade: item.product.grade,
              product_category: item.product.product_category,
            });
          });
        });

        setAvailableAssets(assets);
        setFormData((prev) => ({
          ...prev,
          assetId: "",
          product_name: "",
          currentRAM: "",
          currentStorage: "",
          processorModel: "",
        }));
      }
    }
  }, [selectedChallan, deliveryChallans]);

 const handleInputChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));

  // When assetId changes, auto-fill the asset details
  if (field === "assetId") {
    const selectedAsset = availableAssets.find(
      (asset) => asset.asset_id === value
    );

    if (selectedAsset) {
      // Extract numeric values from "16GB" format
      const parseSpecValue = (spec) => {
        if (!spec) return "";
        const numValue = spec.replace(/[^\d.]/g, "");
        return numValue || "";
      };

      // Build processor string from available fields
      const processorModel = [
        selectedAsset.processor_model,
        selectedAsset.generation,
        selectedAsset.processor_speed
      ]
        .filter(Boolean) // Remove empty/null values
        .join(" ");

      setFormData((prev) => ({
        ...prev,
        product_name: selectedAsset.product_name || "",
        currentRAM: parseSpecValue(selectedAsset.ram),
        currentStorage: parseSpecValue(selectedAsset.storage),
        processorModel: processorModel || "", // Use the constructed processor string
      }));
    }
  }
};

  const handlePeripheralSelection = (category, deviceId, action) => {
    setSelectedPeripherals((prev) => {
      if (action === "add") {
        // Add single device ID
        if (!prev[category]?.includes(deviceId)) {
          return {
            ...prev,
            [category]: [...(prev[category] || []), deviceId],
          };
        }
      } else if (action === "remove") {
        // Remove single device ID
        return {
          ...prev,
          [category]: (prev[category] || []).filter((id) => id !== deviceId),
        };
      } else if (action === "clear") {
        // Clear all selections for this category
        return {
          ...prev,
          [category]: [],
        };
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      const selectedChallanData = deliveryChallans.find(
        (challan) => challan.id === selectedChallan
      );
      const selectedAsset = availableAssets.find(
        (asset) => asset.asset_id === formData.assetId
      );
      const selectedCustomerData = customers.find(
        (customer) => customer.customer_id === selectedCustomer
      );

      // Prepare peripheral updates with full details for each device
      const peripheralUpdates = {};
      Object.keys(selectedPeripherals).forEach((category) => {
        peripheralUpdates[category] = selectedPeripherals[category].map(
          (deviceId) => {
            // Find the peripheral asset that contains this device ID
            const asset = peripheralAssets.find((a) =>
              a.device_ids.includes(deviceId)
            );
            return asset
              ? {
                  asset_id: deviceId,
                  product_id: asset.product_id,
                  product_name: asset.product_name,
                  product_category: asset.product_category,

                  specifications: asset.specifications,
                  device_ids: [deviceId], // Single device ID for this specific device
                  product: asset.product,
                }
              : { asset_id: deviceId };
          }
        );
      });

      const payload = {
        // Customer Information
        customer_id: selectedCustomer,
        customer_name: selectedCustomerData?.customer_name || "",
        customer_data: selectedCustomerData?.customer_data || {},

        // Delivery Challan Information
        delivery_challan_id: selectedChallanData?.id || "",
        dc_id: selectedChallanData?.dc_id || "",
        dc_date: selectedChallanData?.dc_date || "",

        // Asset Information
        parent_asset_id: formData.assetId,
        parent_product_id: selectedAsset?.product_id || "",
        product_name: formData.product_name,
        brand: selectedAsset?.brand || "",
        model: selectedAsset?.model || "",
        ram: `${formData.currentRAM}GB`,
        storage: `${formData.currentStorage}GB`,
        processor: formData.processorModel,
        approval_date: formData.approvalDate,
        items: peripheralUpdates,
      };

      const response = await fetch(`${API_URL}/peripheral-assets/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create asset modification"
        );
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Asset modification created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations/asset-updation");
      }, 1500);
    } catch (error) {
      console.error("Error creating asset modification:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error creating asset modification",
        severity: "error",
      });
    }
  };

  // Get unique categories from peripheral assets
  const getUniqueCategories = () => {
    return [...new Set(peripheralAssets.map((asset) => asset.category))];
  };

  // Filter peripheral assets by category
  const getPeripheralAssetsByCategory = (category) => {
    return peripheralAssets.filter((asset) => asset.category === category);
  };

  // Get selected peripheral details for a category
  const getSelectedPeripheralDetails = (category) => {
    return (selectedPeripherals[category] || []).map((deviceId) => {
      const asset = peripheralAssets.find((a) =>
        a.device_ids.includes(deviceId)
      );
      return asset ? `${deviceId} (${asset.specifications})` : deviceId;
    });
  };

  // Count total devices of a specific category
  const getTotalDevicesByCategory = (category) => {
    return getPeripheralAssetsByCategory(category).reduce(
      (total, asset) => total + asset.total_devices,
      0
    );
  };

  // Count total product types of a specific category
  const getTotalProductTypesByCategory = (category) => {
    return getPeripheralAssetsByCategory(category).length;
  };

  // Check if a specific device ID is selected
  const isDeviceSelected = (category, deviceId) => {
    return (selectedPeripherals[category] || []).includes(deviceId);
  };

  // Render a peripheral section for a specific category
  const renderPeripheralSection = (category) => {
    return (
      <div key={category} style={peripheralSectionStyle}>
        <div style={peripheralHeaderRowStyle}>
          <div>
            <h4 style={peripheralHeaderStyle}>{category} Assets</h4>
          </div>
          <button
            style={clearButtonStyle}
            onClick={() => handlePeripheralSelection(category, null, "clear")}
            disabled={!selectedCustomer}
          >
            Clear All
          </button>
        </div>

        <div style={selectedPeripheralsStyle}>
          {getSelectedPeripheralDetails(category).map((detail, index) => (
            <div key={index} style={selectedPeripheralItemStyle}>
              <span>{detail}</span>
              <button
                style={removeButtonStyle}
                onClick={() =>
                  handlePeripheralSelection(
                    category,
                    selectedPeripherals[category][index],
                    "remove"
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div style={peripheralGridStyle}>
          {!selectedCustomer ? (
            <div style={noSelectionStyle}>Please select a customer first</div>
          ) : getPeripheralAssetsByCategory(category).length === 0 ? (
            <div style={noDataStyle}>
              No {category.toLowerCase()} assets available for this customer
            </div>
          ) : (
            getPeripheralAssetsByCategory(category).map((asset) => (
              <div key={asset.id} style={peripheralAssetGroupStyle}>
                <div style={assetGroupHeaderStyle}>
                  <h5 style={assetGroupTitleStyle}>{asset.product_name}</h5>
                </div>

                <div style={deviceListStyle}>
                  {asset.device_ids.map((deviceId) => (
                    <div
                      key={deviceId}
                      style={{
                        ...deviceItemStyle,
                        backgroundColor: isDeviceSelected(category, deviceId)
                          ? "#e6f7ff"
                          : "#f8f9fa",
                        border: isDeviceSelected(category, deviceId)
                          ? "2px solid #1890ff"
                          : "1px solid #ddd",
                      }}
                      onClick={() =>
                        handlePeripheralSelection(
                          category,
                          deviceId,
                          isDeviceSelected(category, deviceId)
                            ? "remove"
                            : "add"
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        id={`${category}-${deviceId}`}
                        checked={isDeviceSelected(category, deviceId)}
                        onChange={(e) =>
                          handlePeripheralSelection(
                            category,
                            deviceId,
                            e.target.checked ? "add" : "remove"
                          )
                        }
                      />
                      <label
                        htmlFor={`${category}-${deviceId}`}
                        style={deviceLabelStyle}
                      >
                        <div>
                          <strong>{deviceId}</strong>
                        </div>
                        <div style={deviceSpecsStyle}>
                          {asset.specifications}
                        </div>
                        <div style={statusStyle(asset.status)}>
                          {asset.status}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
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

      <div style={formContainerStyle}>
        {/* Customer and Delivery Challan Selection */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>👤</div>
            <h3 style={cardHeaderStyle}>Customer & Asset Selection</h3>
          </div>

          <div style={fieldsContainerStyle}>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Select Customer</label>
              <select
                style={inputStyle}
                value={selectedCustomer || ""}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === "") {
                    setSelectedCustomer(null);
                  } else {
                    setSelectedCustomer(selectedValue);
                  }
                }}
              >
                <option value="">Select a Customer</option>
                {customers
                  .filter(
                    (customer, index, self) =>
                      index ===
                      self.findIndex(
                        (c) => c.customer_id === customer.customer_id
                      )
                  )
                  .map((customer) => (
                    <option
                      key={customer.customer_id}
                      value={customer.customer_id}
                    >
                      {customer.customer_name}
                    </option>
                  ))}
              </select>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Select Order</label>
              <select
                style={inputStyle}
                value={selectedChallan || ""}
                onChange={(e) => setSelectedChallan(Number(e.target.value))}
                disabled={!selectedCustomer}
              >
                <option value="">Select a Order</option>
                {selectedCustomer &&
                  deliveryChallans
                    .filter(
                      (challan) => challan.customer_code === selectedCustomer
                    )
                    .map((challan) => (
                      <option key={challan.id} value={challan.id}>
                        {challan.dc_id} - {challan.dc_date}
                      </option>
                    ))}
              </select>
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Select Asset ID</label>
              <select
                style={inputStyle}
                value={formData.assetId}
                onChange={(e) => handleInputChange("assetId", e.target.value)}
                disabled={!selectedChallan}
              >
                <option value="">Select an Asset</option>
                {availableAssets.map((asset) => (
                  <option key={asset.asset_id} value={asset.asset_id}>
                    {asset.asset_id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Asset Information Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🏢</div>
            <h3 style={cardHeaderStyle}>Asset Modification</h3>
          </div>

          <div style={fieldsContainerStyle}>
            <Field
              label="Product name"
              placeholder="Product name"
              value={formData.product_name}
              onChange={(v) => handleInputChange("product_name", v)}
              disabled
            />

            <Field
              label="Approval Date"
              placeholder=""
              type="date"
              value={formData.approvalDate}
              onChange={(v) => handleInputChange("approvalDate", v)}
            />
          </div>
        </div>

        {/* Hardware Specifications Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💾</div>
            <h3 style={cardHeaderStyle}>Product Details</h3>
          </div>
          <div style={fieldsContainerStyle}>
            <Field
              label="Current RAM (GB)"
              placeholder="Current RAM capacity"
              type="number"
              value={formData.currentRAM}
              onChange={(v) => handleInputChange("currentRAM", v)}
              disabled
            />

            <Field
              label="Current Storage (GB)"
              placeholder="Current storage capacity"
              type="number"
              value={formData.currentStorage}
              onChange={(v) => handleInputChange("currentStorage", v)}
              disabled
            />
            <Field
              label="Current Processor"
              placeholder="Current processor"
              type="text"
              value={formData.processorModel}
              onChange={(v) => handleInputChange("processorModel", v)}
              disabled
            />
          </div>
        </div>

        {/* Peripheral Selection Section */}
        <div style={{ ...cardStyle, gridColumn: "span 2" }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Peripheral Asset Management</h3>
          </div>

          {getUniqueCategories().map((category) =>
            renderPeripheralSection(category)
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button
          style={cancelBtnStyle}
          onClick={() =>
            navigate("/dashboard/operations/asset_modification_tracker")
          }
        >
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onClick={handleSubmit}
          disabled={!formData.assetId}
        >
          Create Modification
        </button>
      </div>
    </div>
  );
};

// Enhanced Field Component with disabled prop
const Field = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={{
        ...inputStyle,
        backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

// Helper function for status styling
const statusStyle = (status) => ({
  fontSize: "0.75rem",
  padding: "2px 6px",
  borderRadius: "4px",
  backgroundColor: status === "available" ? "#d4edda" : "#f8d7da",
  color: status === "available" ? "#155724" : "#721c24",
  display: "inline-block",
  marginTop: "4px",
});

// New Styles for individual device selection
const peripheralAssetGroupStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  backgroundColor: "#ffffff",
};

const assetGroupHeaderStyle = {
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid #f1f3f4",
};

const assetGroupTitleStyle = {
  margin: "0 0 0.5rem 0",
  fontSize: "1rem",
  color: "#1f2937",
};

const assetGroupSpecsStyle = {
  fontSize: "0.875rem",
  color: "#6b7280",
  marginBottom: "0.5rem",
};

const deviceListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "0.75rem",
};

const deviceItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.75rem",
  padding: "0.75rem",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const deviceLabelStyle = {
  fontSize: "0.875rem",
  cursor: "pointer",
  flex: 1,
  lineHeight: "1.4",
};

const deviceSpecsStyle = {
  fontSize: "0.75rem",
  color: "#6b7280",
  marginTop: "0.25rem",
};

const summaryStyle = {
  fontSize: "0.875rem",
  color: "#666",
  marginTop: "0.25rem",
};

// Existing Styles
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
  backgroundColor: "#f5f5f5",
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1600px",
  margin: "0 auto",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  height: "fit-content",
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

const fieldsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
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
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

const peripheralSectionStyle = {
  marginBottom: "2rem",
  padding: "1.5rem",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const peripheralHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1rem",
};

const peripheralHeaderStyle = {
  margin: "0",
  fontSize: "1rem",
  color: "#334155",
  fontWeight: "600",
};

const clearButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f8f9fa",
  color: "#6c757d",
  border: "1px solid #dee2e6",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.875rem",
};

const selectedPeripheralsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1rem",
  minHeight: "2rem",
};

const selectedPeripheralItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem 0.75rem",
  backgroundColor: "#e6f7ff",
  border: "1px solid #91d5ff",
  borderRadius: "6px",
  fontSize: "0.875rem",
};

const removeButtonStyle = {
  padding: "0",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "#ff7875",
  color: "white",
  cursor: "pointer",
  fontSize: "0.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const peripheralGridStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const noSelectionStyle = {
  padding: "2rem",
  textAlign: "center",
  color: "#6c757d",
  fontStyle: "italic",
};

const noDataStyle = {
  padding: "2rem",
  textAlign: "center",
  color: "#6c757d",
  fontStyle: "italic",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "2rem",
  maxWidth: "1400px",
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
};

export default AssetModificationTrackerAdd;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

// const AssetModificationTrackerAdd = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     assetId: "",
//     product_name: "",
//     modificationType: "",
//     currentRAM: "",
//     currentStorage: "",
//     approvalDate: "",
//   });

//   const [deliveryChallans, setDeliveryChallans] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [availableAssets, setAvailableAssets] = useState([]);
//   const [peripheralAssets, setPeripheralAssets] = useState([]);
//   const [selectedPeripherals, setSelectedPeripherals] = useState({
//     ram: [],
//     storage: [],
//     processor: []
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Dummy peripheral assets data
//   const dummyPeripheralAssets = [
//     { id: 1, asset_id: "RAM001", type: "ram", specifications: "16GB DDR4", status: "available" },
//     { id: 2, asset_id: "RAM002", type: "ram", specifications: "32GB DDR4", status: "available" },
//     { id: 3, asset_id: "RAM003", type: "ram", specifications: "8GB DDR4", status: "in-use" },
//     { id: 4, asset_id: "RAM004", type: "ram", specifications: "64GB DDR4", status: "available" },
//     { id: 5, asset_id: "STR001", type: "storage", specifications: "512GB SSD", status: "available" },
//     { id: 6, asset_id: "STR002", type: "storage", specifications: "1TB SSD", status: "available" },
//     { id: 7, asset_id: "STR003", type: "storage", specifications: "2TB HDD", status: "in-use" },
//     { id: 8, asset_id: "STR004", type: "storage", specifications: "256GB SSD", status: "available" },
//     { id: 9, asset_id: "CPU001", type: "processor", specifications: "Intel i7-10700", status: "available" },
//     { id: 10, asset_id: "CPU002", type: "processor", specifications: "AMD Ryzen 7", status: "available" },
//     { id: 11, asset_id: "CPU003", type: "processor", specifications: "Intel i5-10400", status: "in-use" },
//     { id: 12, asset_id: "CPU004", type: "processor", specifications: "AMD Ryzen 5", status: "available" },
//   ];

//   // Fetch delivery challans data when component mounts
//   useEffect(() => {
//     const fetchDeliveryChallans = async () => {
//       try {
//         const response = await fetch(
//           `${API_URL}/delivery-challans/approved-delivery-challan`
//         );
//         if (!response.ok) throw new Error("Failed to fetch delivery challans");
//         const data = await response.json();
//         setDeliveryChallans(data);

//         // Extract unique customers
//         const uniqueCustomers = data.reduce((acc, challan) => {
//           if (!acc.some((c) => c.customer_code === challan.customer_code)) {
//             acc.push({
//               customer_id: challan.customer_code,
//               customer_name:
//                 challan.customer?.first_name +
//                 " " +
//                 challan.customer?.last_name,
//               customer_data: challan.customer,
//             });
//           }
//           return acc;
//         }, []);
//         setCustomers(uniqueCustomers);
//       } catch (error) {
//         console.error("Error fetching delivery challans:", error);
//         setSnackbar({
//           open: true,
//           message: "Error fetching delivery challans: " + error.message,
//           severity: "error",
//         });
//       }
//     };
//     fetchDeliveryChallans();
//   }, []);

//   // Set dummy peripheral assets data
//   useEffect(() => {
//     setPeripheralAssets(dummyPeripheralAssets);
//   }, []);

//   // When customer is selected, filter available delivery challans
//   useEffect(() => {
//     if (selectedCustomer) {
//       const customerChallans = deliveryChallans.filter(
//         (challan) => challan.customer_code === selectedCustomer
//       );
//       setSelectedChallan(null);
//       setAvailableAssets([]);
//       setFormData((prev) => ({
//         ...prev,
//         assetId: "",
//         product_name: "",
//         currentRAM: "",
//         currentStorage: "",
//       }));
//     }
//   }, [selectedCustomer, deliveryChallans]);

//   // When delivery challan is selected, set available assets
//   useEffect(() => {
//     if (selectedChallan) {
//       const selectedChallanData = deliveryChallans.find(
//         (challan) => challan.id === selectedChallan
//       );

//       if (selectedChallanData) {
//         // Process only the assigned device IDs (not available_device_ids)
//         const assets = [];
//         selectedChallanData.items.forEach((item) => {
//           // Only add the assigned device IDs
//           item.device_ids.forEach((deviceId) => {
//             assets.push({
//               asset_id: deviceId,
//               product_id: item.product_id,
//               product_name: item.product_name,
//               ram: item.product.ram,
//               storage: item.product.storage,
//               brand: item.product.brand,
//               model: item.product.model,
//               processor: item.product.processor,
//               os: item.product.os,
//               graphics: item.product.graphics,
//               disk_type: item.product.disk_type,
//               grade: item.product.grade,
//             });
//           });
//         });

//         setAvailableAssets(assets);
//         setFormData((prev) => ({
//           ...prev,
//           assetId: "",
//           product_name: "",
//           currentRAM: "",
//           currentStorage: "",
//         }));
//       }
//     }
//   }, [selectedChallan, deliveryChallans]);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // When assetId changes, auto-fill the asset details
//     if (field === "assetId") {
//       const selectedAsset = availableAssets.find(
//         (asset) => asset.asset_id === value
//       );
//       if (selectedAsset) {
//         // Extract numeric values from "16GB" format
//         const parseSpecValue = (spec) => {
//           if (!spec) return "";
//           const numValue = spec.replace(/[^\d.]/g, "");
//           return numValue || "";
//         };

//         setFormData((prev) => ({
//           ...prev,
//           product_name: selectedAsset.product_name || "",
//           currentRAM: parseSpecValue(selectedAsset.ram),
//           currentStorage: parseSpecValue(selectedAsset.storage),
//         }));
//       }
//     }
//   };

//   const handlePeripheralSelection = (type, assetId, action) => {
//     setSelectedPeripherals(prev => {
//       if (action === 'add') {
//         // Add the asset ID if it's not already selected
//         if (!prev[type].includes(assetId)) {
//           return {
//             ...prev,
//             [type]: [...prev[type], assetId]
//           };
//         }
//       } else if (action === 'remove') {
//         // Remove the asset ID
//         return {
//           ...prev,
//           [type]: prev[type].filter(id => id !== assetId)
//         };
//       } else if (action === 'clear') {
//         // Clear all selections for this type
//         return {
//           ...prev,
//           [type]: []
//         };
//       }
//       return prev;
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const selectedChallanData = deliveryChallans.find(
//         (challan) => challan.id === selectedChallan
//       );
//       const selectedAsset = availableAssets.find(
//         (asset) => asset.asset_id === formData.assetId
//       );
//       const selectedCustomerData = customers.find(
//         (customer) => customer.customer_id === selectedCustomer
//       );

//       const payload = {
//         // Customer Information
//         customer_id: selectedCustomer,
//         customer_name: selectedCustomerData?.customer_name || "",
//         customer_data: selectedCustomerData?.customer_data || {},

//         // Delivery Challan Information
//         delivery_challan_id: selectedChallan,
//         dc_id: selectedChallanData?.dc_id || "",
//         dc_date: selectedChallanData?.dc_date || "",

//         // Asset Information
//         asset_id: formData.assetId,
//         product_id: selectedAsset?.product_id || "",
//         product_name: formData.product_name,
//         brand: selectedAsset?.brand || "",
//         model: selectedAsset?.model || "",
//         ram: `${formData.currentRAM}GB`,
//         storage: `${formData.currentStorage}GB`,
//         approval_date: formData.approvalDate,

//         // Peripheral Information
//         peripheral_updates: selectedPeripherals
//       };

//       const response = await fetch(`${API_URL}/asset-modifications/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Failed to create asset modification"
//         );
//       }

//       const result = await response.json();
//       setSnackbar({
//         open: true,
//         message: "Asset modification created successfully!",
//         severity: "success",
//       });

//       setTimeout(() => {
//         navigate("/dashboard/operations/asset_modification_tracker");
//       }, 1500);
//     } catch (error) {
//       console.error("Error creating asset modification:", error);
//       setSnackbar({
//         open: true,
//         message: error.message || "Error creating asset modification",
//         severity: "error",
//       });
//     }
//   };

//   // Filter peripheral assets by type
//   const getPeripheralAssetsByType = (type) => {
//     return peripheralAssets.filter(asset => asset.type === type);
//   };

//   // Get selected peripheral details
//   const getSelectedPeripheralDetails = (type) => {
//     return selectedPeripherals[type].map(assetId => {
//       const asset = peripheralAssets.find(a => a.asset_id === assetId);
//       return asset ? `${asset.asset_id} (${asset.specifications})` : assetId;
//     });
//   };

//   return (
//     <div style={containerStyle}>
//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//       >
//         <Alert
//           onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//           severity={snackbar.severity}
//           sx={{ width: "100%", whiteSpace: "pre-line" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <div style={formContainerStyle}>
//         {/* Customer and Delivery Challan Selection */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>👤</div>
//             <h3 style={cardHeaderStyle}>Customer & Asset Selection</h3>
//           </div>

//           <div style={fieldsContainerStyle}>
//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Select Customer</label>
//               <select
//                 style={inputStyle}
//                 value={selectedCustomer || ""}
//                 onChange={(e) => {
//                   const selectedValue = e.target.value;
//                   if (selectedValue === "") {
//                     setSelectedCustomer(null);
//                   } else {
//                     setSelectedCustomer(selectedValue);
//                   }
//                 }}
//               >
//                 <option value="">Select a Customer</option>
//                 {customers
//                   .filter(
//                     (customer, index, self) =>
//                       // Filter out duplicates by customer_id
//                       index ===
//                       self.findIndex(
//                         (c) => c.customer_id === customer.customer_id
//                       )
//                   )
//                   .map((customer) => (
//                     <option
//                       key={customer.customer_id}
//                       value={customer.customer_id}
//                     >
//                       {customer.customer_name}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Select Order</label>
//               <select
//                 style={inputStyle}
//                 value={selectedChallan || ""}
//                 onChange={(e) => setSelectedChallan(Number(e.target.value))}
//                 disabled={!selectedCustomer}
//               >
//                 <option value="">Select a Order</option>
//                 {selectedCustomer &&
//                   deliveryChallans
//                     .filter(
//                       (challan) => challan.customer_code === selectedCustomer
//                     )
//                     .map((challan) => (
//                       <option key={challan.id} value={challan.id}>
//                         {challan.dc_id} - {challan.dc_date}
//                       </option>
//                     ))}
//               </select>
//             </div>

//             <div style={fieldContainerStyle}>
//               <label style={labelStyle}>Asset ID</label>
//               <select
//                 style={inputStyle}
//                 value={formData.assetId}
//                 onChange={(e) => handleInputChange("assetId", e.target.value)}
//                 disabled={!selectedChallan}
//               >
//                 <option value="">Select an Asset</option>
//                 {availableAssets.map((asset) => (
//                   <option key={asset.asset_id} value={asset.asset_id}>
//                     {asset.asset_id}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Asset Information Section */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>🏢</div>
//             <h3 style={cardHeaderStyle}>Asset Modification</h3>
//           </div>

//           <div style={fieldsContainerStyle}>
//             <Field
//               label="Product name"
//               placeholder="Product name"
//               value={formData.product_name}
//               onChange={(v) => handleInputChange("product_name", v)}
//               disabled
//             />

//             <Field
//               label="Approval Date"
//               placeholder=""
//               type="date"
//               value={formData.approvalDate}
//               onChange={(v) => handleInputChange("approvalDate", v)}
//             />
//           </div>
//         </div>

//         {/* Hardware Specifications Section */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>💾</div>
//             <h3 style={cardHeaderStyle}>Product Details</h3>
//           </div>
//           <div style={fieldsContainerStyle}>
//             <Field
//               label="Current RAM (GB)"
//               placeholder="Current RAM capacity"
//               type="number"
//               value={formData.currentRAM}
//               onChange={(v) => handleInputChange("currentRAM", v)}
//               disabled
//             />

//             <Field
//               label="Current Storage (GB)"
//               placeholder="Current storage capacity"
//               type="number"
//               value={formData.currentStorage}
//               onChange={(v) => handleInputChange("currentStorage", v)}
//               disabled
//             />
//           </div>
//         </div>

//         {/* Peripheral Selection Section */}
//         <div style={{ ...cardStyle, gridColumn: "span 2" }}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>📋</div>
//             <h3 style={cardHeaderStyle}>Peripheral Asset Management</h3>
//           </div>

//           {/* RAM Assets */}
//           <div style={peripheralSectionStyle}>
//             <div style={peripheralHeaderRowStyle}>
//               <h4 style={peripheralHeaderStyle}>RAM Assets</h4>
//               <button
//                 style={clearButtonStyle}
//                 onClick={() => handlePeripheralSelection('ram', null, 'clear')}
//               >
//                 Clear All
//               </button>
//             </div>
//             <div style={selectedPeripheralsStyle}>
//               {getSelectedPeripheralDetails('ram').map((detail, index) => (
//                 <div key={index} style={selectedPeripheralItemStyle}>
//                   <span>{detail}</span>
//                   <button
//                     style={removeButtonStyle}
//                     onClick={() => handlePeripheralSelection('ram', selectedPeripherals.ram[index], 'remove')}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div style={peripheralGridStyle}>
//               {getPeripheralAssetsByType('ram').map(asset => (
//                 <div
//                   key={asset.id}
//                   style={{
//                     ...peripheralItemStyle,
//                     backgroundColor: selectedPeripherals.ram.includes(asset.asset_id) ? '#e6f7ff' : '#f8f9fa',
//                     border: selectedPeripherals.ram.includes(asset.asset_id) ? '1px solid #1890ff' : '1px solid #ddd'
//                   }}
//                   onClick={() => handlePeripheralSelection(
//                     'ram',
//                     asset.asset_id,
//                     selectedPeripherals.ram.includes(asset.asset_id) ? 'remove' : 'add'
//                   )}
//                 >
//                   <input
//                     type="checkbox"
//                     id={`ram-${asset.asset_id}`}
//                     checked={selectedPeripherals.ram.includes(asset.asset_id)}
//                     onChange={(e) => handlePeripheralSelection(
//                       'ram',
//                       asset.asset_id,
//                       e.target.checked ? 'add' : 'remove'
//                     )}
//                   />
//                   <label htmlFor={`ram-${asset.asset_id}`} style={peripheralLabelStyle}>
//                     <div><strong>{asset.asset_id}</strong></div>
//                     <div>{asset.specifications}</div>
//                     <div style={statusStyle(asset.status)}>{asset.status}</div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Storage Assets */}
//           <div style={peripheralSectionStyle}>
//             <div style={peripheralHeaderRowStyle}>
//               <h4 style={peripheralHeaderStyle}>Storage Assets</h4>
//               <button
//                 style={clearButtonStyle}
//                 onClick={() => handlePeripheralSelection('storage', null, 'clear')}
//               >
//                 Clear All
//               </button>
//             </div>
//             <div style={selectedPeripheralsStyle}>
//               {getSelectedPeripheralDetails('storage').map((detail, index) => (
//                 <div key={index} style={selectedPeripheralItemStyle}>
//                   <span>{detail}</span>
//                   <button
//                     style={removeButtonStyle}
//                     onClick={() => handlePeripheralSelection('storage', selectedPeripherals.storage[index], 'remove')}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div style={peripheralGridStyle}>
//               {getPeripheralAssetsByType('storage').map(asset => (
//                 <div
//                   key={asset.id}
//                   style={{
//                     ...peripheralItemStyle,
//                     backgroundColor: selectedPeripherals.storage.includes(asset.asset_id) ? '#e6f7ff' : '#f8f9fa',
//                     border: selectedPeripherals.storage.includes(asset.asset_id) ? '1px solid #1890ff' : '1px solid #ddd'
//                   }}
//                   onClick={() => handlePeripheralSelection(
//                     'storage',
//                     asset.asset_id,
//                     selectedPeripherals.storage.includes(asset.asset_id) ? 'remove' : 'add'
//                   )}
//                 >
//                   <input
//                     type="checkbox"
//                     id={`storage-${asset.asset_id}`}
//                     checked={selectedPeripherals.storage.includes(asset.asset_id)}
//                     onChange={(e) => handlePeripheralSelection(
//                       'storage',
//                       asset.asset_id,
//                       e.target.checked ? 'add' : 'remove'
//                     )}
//                   />
//                   <label htmlFor={`storage-${asset.asset_id}`} style={peripheralLabelStyle}>
//                     <div><strong>{asset.asset_id}</strong></div>
//                     <div>{asset.specifications}</div>
//                     <div style={statusStyle(asset.status)}>{asset.status}</div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Processor Assets */}
//           <div style={peripheralSectionStyle}>
//             <div style={peripheralHeaderRowStyle}>
//               <h4 style={peripheralHeaderStyle}>Processor Assets</h4>
//               <button
//                 style={clearButtonStyle}
//                 onClick={() => handlePeripheralSelection('processor', null, 'clear')}
//               >
//                 Clear All
//               </button>
//             </div>
//             <div style={selectedPeripheralsStyle}>
//               {getSelectedPeripheralDetails('processor').map((detail, index) => (
//                 <div key={index} style={selectedPeripheralItemStyle}>
//                   <span>{detail}</span>
//                   <button
//                     style={removeButtonStyle}
//                     onClick={() => handlePeripheralSelection('processor', selectedPeripherals.processor[index], 'remove')}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div style={peripheralGridStyle}>
//               {getPeripheralAssetsByType('processor').map(asset => (
//                 <div
//                   key={asset.id}
//                   style={{
//                     ...peripheralItemStyle,
//                     backgroundColor: selectedPeripherals.processor.includes(asset.asset_id) ? '#e6f7ff' : '#f8f9fa',
//                     border: selectedPeripherals.processor.includes(asset.asset_id) ? '1px solid #1890ff' : '1px solid #ddd'
//                   }}
//                   onClick={() => handlePeripheralSelection(
//                     'processor',
//                     asset.asset_id,
//                     selectedPeripherals.processor.includes(asset.asset_id) ? 'remove' : 'add'
//                   )}
//                 >
//                   <input
//                     type="checkbox"
//                     id={`processor-${asset.asset_id}`}
//                     checked={selectedPeripherals.processor.includes(asset.asset_id)}
//                     onChange={(e) => handlePeripheralSelection(
//                       'processor',
//                       asset.asset_id,
//                       e.target.checked ? 'add' : 'remove'
//                     )}
//                   />
//                   <label htmlFor={`processor-${asset.asset_id}`} style={peripheralLabelStyle}>
//                     <div><strong>{asset.asset_id}</strong></div>
//                     <div>{asset.specifications}</div>
//                     <div style={statusStyle(asset.status)}>{asset.status}</div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div style={buttonContainerStyle}>
//         <button
//           style={cancelBtnStyle}
//           onClick={() =>
//             navigate("/dashboard/operations/asset_modification_tracker")
//           }
//         >
//           Cancel
//         </button>
//         <button
//           style={createBtnStyle}
//           onClick={handleSubmit}
//           disabled={!formData.assetId}
//         >
//           Create Modification
//         </button>
//       </div>
//     </div>
//   );
// };

// // Enhanced Field Component with disabled prop
// const Field = ({
//   label,
//   placeholder,
//   type = "text",
//   value,
//   onChange,
//   disabled = false,
// }) => (
//   <div style={fieldContainerStyle}>
//     <label style={labelStyle}>{label}</label>
//     <input
//       type={type}
//       placeholder={placeholder}
//       style={{
//         ...inputStyle,
//         backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
//       }}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//     />
//   </div>
// );

// // Helper function for status styling
// const statusStyle = (status) => ({
//   fontSize: "0.75rem",
//   padding: "2px 6px",
//   borderRadius: "4px",
//   backgroundColor: status === "available" ? "#d4edda" : "#f8d7da",
//   color: status === "available" ? "#155724" : "#721c24",
//   display: "inline-block",
//   marginTop: "4px"
// });

// // Styles
// const containerStyle = {
//   padding: "2rem",
//   fontFamily:
//     '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
//   minHeight: "100vh",
//   lineHeight: 1.6,
//   backgroundColor: "#f5f5f5",
// };

// const formContainerStyle = {
//   display: "grid",
//   gap: "1.5rem",
//   maxWidth: "1600px",
//   margin: "0 auto",
//   gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
// };

// const cardStyle = {
//   backgroundColor: "#ffffff",
//   padding: "1.5rem",
//   borderRadius: "12px",
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
//   border: "1px solid #e2e8f0",
//   height: "fit-content",
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

// const fieldsContainerStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "1rem",
// };

// const fieldContainerStyle = { display: "flex", flexDirection: "column" };
// const labelStyle = {
//   marginBottom: "0.5rem",
//   fontWeight: "500",
//   fontSize: "0.875rem",
//   color: "#374151",
// };
// const inputStyle = {
//   width: "100%",
//   padding: "0.75rem",
//   borderRadius: "8px",
//   border: "1px solid #d1d5db",
//   fontSize: "0.875rem",
//   backgroundColor: "#ffffff",
//   boxSizing: "border-box",
// };

// const peripheralSectionStyle = {
//   marginBottom: "2rem",
//   padding: "1.5rem",
//   backgroundColor: "#f8fafc",
//   borderRadius: "8px",
//   border: "1px solid #e2e8f0",
// };

// const peripheralHeaderRowStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: "1rem",
// };

// const peripheralHeaderStyle = {
//   margin: "0",
//   fontSize: "1rem",
//   color: "#334155",
//   fontWeight: "600",
// };

// const clearButtonStyle = {
//   padding: "0.25rem 0.5rem",
//   backgroundColor: "#f8f9fa",
//   color: "#6c757d",
//   border: "1px solid #dee2e6",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontSize: "0.75rem",
// };

// const selectedPeripheralsStyle = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "0.5rem",
//   marginBottom: "1rem",
//   minHeight: "2rem",
// };

// const selectedPeripheralItemStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "0.5rem",
//   padding: "0.25rem 0.5rem",
//   backgroundColor: "#e6f7ff",
//   border: "1px solid #91d5ff",
//   borderRadius: "4px",
//   fontSize: "0.875rem",
// };

// const removeButtonStyle = {
//   padding: "0",
//   width: "16px",
//   height: "16px",
//   borderRadius: "50%",
//   border: "none",
//   backgroundColor: "#ff7875",
//   color: "white",
//   cursor: "pointer",
//   fontSize: "0.75rem",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const peripheralGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//   gap: "0.75rem",
// };

// const peripheralItemStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   gap: "0.5rem",
//   padding: "0.75rem",
//   borderRadius: "8px",
//   cursor: "pointer",
//   transition: "all 0.2s ease",
// };

// const peripheralLabelStyle = {
//   fontSize: "0.875rem",
//   cursor: "pointer",
//   flex: 1,
// };

// const buttonContainerStyle = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "0.75rem",
//   marginTop: "2rem",
//   maxWidth: "1400px",
//   margin: "2rem auto 0",
//   padding: "0 1.5rem",
// };

// const cancelBtnStyle = {
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#f3f4f6",
//   color: "#374151",
//   border: "1px solid #d1d5db",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "0.875rem",
//   fontWeight: "500",
//   transition: "all 0.2s ease",
// };

// const createBtnStyle = {
//   padding: "0.75rem 1.5rem",
//   backgroundColor: "#2563eb",
//   color: "white",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "0.875rem",
//   fontWeight: "500",
//   transition: "all 0.2s ease",
// };

// cancelBtnStyle[":hover"] = {
//   backgroundColor: "#e5e7eb",
// };

// createBtnStyle[":hover"] = {
//   backgroundColor: "#1d4ed8",
// };

// export default AssetModificationTrackerAdd;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import API_URL from "../../../api/Api_url";

// const AssetModificationTrackerEdit = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   // Form data state
//   const [formData, setFormData] = useState({
//     id: "",
//     asset_id: "",
//     product_name: "",
//     product_id: "",
//     ram: "",
//     storage: "",
//     invoice_id: ""
//   });

//   // Loading states
//   const [loading, setLoading] = useState({
//     brands: false,
//     models: false,
//     capacities: false,
//     assets: false,
//   });

//   // Component categories
//   const componentCategories = {
//     ram: "RAM",
//     processor: "Processor",
//     storage: ["HDD", "SSD", "NVMe SSD"],
//   };

//   // RAM state
//   const [ramModules, setRamModules] = useState([
//     {
//       type: "",
//       brand: "",
//       model: "",
//       size: "",
//       asset_id: "",
//       product_id: "",
//       brands: [],
//       models: [],
//       sizes: [],
//       assetIds: [],
//       productIds: [],
//     },
//   ]);

//   // Storage state
//   const [storageDrives, setStorageDrives] = useState([
//     {
//       type: "",
//       brand: "",
//       model: "",
//       size: "",
//       asset_id: "",
//       product_id: "",
//       brands: [],
//       models: [],
//       sizes: [],
//       assetIds: [],
//       productIds: [],
//     },
//   ]);

//   // Processor State
//   const [processorBrand, setProcessorBrand] = useState("");
//   const [processorBrands, setProcessorBrands] = useState([]);
//   const [processorModel, setProcessorModel] = useState("");
//   const [processorModels, setProcessorModels] = useState([]);
//   const [processorAssetIds, setProcessorAssetIds] = useState([]);
//   const [selectedProcessorAssetId, setSelectedProcessorAssetId] = useState("");
//   const [processorProductId, setProcessorProductId] = useState("");

//   // Show snackbar function
//   const showSnackbar = (message, severity) => {
//     setSnackbar({
//       open: true,
//       message,
//       severity
//     });
//   };

//   // Handle snackbar close
//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // Handle input changes
//   const handleInputChange = (field, value) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   // Updated fetch function to properly handle API response
// // Updated fetch function to better handle API response
// // Updated fetch function to handle the correct API response structure
// const fetchComponentData = async (endpointParams) => {
//   try {
//     const url = `${API_URL}/product-templete/products-with-assets?${endpointParams}`;
//     console.log("Fetching:", url); // Debug log

//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();

//     console.log("API Response:", data); // Debug log

//     // Handle the actual API response structure
//     if (data && Array.isArray(data) && data.length > 0) {
//       const firstItem = data[0];

//       // Extract asset_ids and product_id from the response
//       const assetIds = firstItem.asset_ids || [];
//       const productId = firstItem.product_id || "";

//       return {
//         asset_ids: assetIds,
//         product_id: productId,
//         data: data
//       };
//     }

//     return { asset_ids: [], product_id: "", data: [] };
//   } catch (error) {
//     console.error("Error fetching component data:", error);
//     return { asset_ids: [], product_id: "", data: [] };
//   }
// };

//   // ========== RAM MODULE FUNCTIONS ========== //
//   const addRamModule = () => {
//     setRamModules([
//       ...ramModules,
//       {
//         type: "",
//         brand: "",
//         model: "",
//         size: "",
//         asset_id: "",
//         product_id: "",
//         brands: [],
//         models: [],
//         sizes: [],
//         assetIds: [],
//         productIds: [],
//       },
//     ]);
//   };

//   const removeRamModule = (index) => {
//     if (ramModules.length > 1) {
//       const updatedRamModules = [...ramModules];
//       updatedRamModules.splice(index, 1);
//       setRamModules(updatedRamModules);
//     }
//   };

//   const updateRamModule = (index, field, value) => {
//     const updatedRamModules = [...ramModules];
//     updatedRamModules[index][field] = value;

//     // Reset dependent fields when parent field changes
//     if (field === "type") {
//       updatedRamModules[index].brand = "";
//       updatedRamModules[index].model = "";
//       updatedRamModules[index].size = "";
//       updatedRamModules[index].asset_id = "";
//       updatedRamModules[index].brands = [];
//       updatedRamModules[index].models = [];
//       updatedRamModules[index].sizes = [];
//       updatedRamModules[index].assetIds = [];
//     } else if (field === "brand") {
//       updatedRamModules[index].model = "";
//       updatedRamModules[index].size = "";
//       updatedRamModules[index].asset_id = "";
//       updatedRamModules[index].models = [];
//       updatedRamModules[index].sizes = [];
//       updatedRamModules[index].assetIds = [];
//     } else if (field === "model") {
//       updatedRamModules[index].size = "";
//       updatedRamModules[index].asset_id = "";
//       updatedRamModules[index].sizes = [];
//       updatedRamModules[index].assetIds = [];
//     } else if (field === "size") {
//       updatedRamModules[index].asset_id = "";
//       updatedRamModules[index].assetIds = [];
//     }

//     setRamModules(updatedRamModules);
//   };

//   // ========== STORAGE DRIVE FUNCTIONS ========== //
//   const addStorageDrive = () => {
//     setStorageDrives([
//       ...storageDrives,
//       {
//         type: "",
//         brand: "",
//         model: "",
//         size: "",
//         asset_id: "",
//         product_id: "",
//         brands: [],
//         models: [],
//         sizes: [],
//         assetIds: [],
//         productIds: [],
//       },
//     ]);
//   };

//   const removeStorageDrive = (index) => {
//     if (storageDrives.length > 1) {
//       const updatedStorageDrives = [...storageDrives];
//       updatedStorageDrives.splice(index, 1);
//       setStorageDrives(updatedStorageDrives);
//     }
//   };

//   const updateStorageDrive = (index, field, value) => {
//     const updatedStorageDrives = [...storageDrives];
//     updatedStorageDrives[index][field] = value;

//     // Reset dependent fields when parent field changes
//     if (field === "type") {
//       updatedStorageDrives[index].brand = "";
//       updatedStorageDrives[index].model = "";
//       updatedStorageDrives[index].size = "";
//       updatedStorageDrives[index].asset_id = "";
//       updatedStorageDrives[index].brands = [];
//       updatedStorageDrives[index].models = [];
//       updatedStorageDrives[index].sizes = [];
//       updatedStorageDrives[index].assetIds = [];
//     } else if (field === "brand") {
//       updatedStorageDrives[index].model = "";
//       updatedStorageDrives[index].size = "";
//       updatedStorageDrives[index].asset_id = "";
//       updatedStorageDrives[index].models = [];
//       updatedStorageDrives[index].sizes = [];
//       updatedStorageDrives[index].assetIds = [];
//     } else if (field === "model") {
//       updatedStorageDrives[index].size = "";
//       updatedStorageDrives[index].asset_id = "";
//       updatedStorageDrives[index].sizes = [];
//       updatedStorageDrives[index].assetIds = [];
//     } else if (field === "size") {
//       updatedStorageDrives[index].asset_id = "";
//       updatedStorageDrives[index].assetIds = [];
//     }

//     setStorageDrives(updatedStorageDrives);
//   };

//   // Fetch product data on component mount
//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const response = await fetch(
//           `${API_URL}/asset-modification/product-id/${id}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch product data");
//         }
//         const data = await response.json();

//         // Check if we have data
//         if (data) {
//           // Set form data from API response
//           setFormData({
//             id: data.id || "",
//             asset_id: data.asset_id || "",
//             product_name: data.product_name || "",
//             product_id: data.product_id || "",
//             ram: data.ram || "",
//             storage: data.storage || "",
//             invoice_id: data.invoice_id || ""
//           });

//           // Process components data
//           if (data.components && data.components.length > 0) {
//             // Separate components by type
//             const ramComponents = data.components.filter(
//               (comp) => comp.component_type === "ram"
//             );
//             const storageComponents = data.components.filter(
//               (comp) => comp.component_type === "storage"
//             );
//             const processorComponents = data.components.filter(
//               (comp) => comp.component_type === "processor"
//             );

//             // Set RAM modules
//             if (ramComponents.length > 0) {
//               setRamModules(
//                 ramComponents.map((ram) => ({
//                   type: ram.type || "",
//                   brand: ram.brand || "",
//                   model: ram.model || "",
//                   size: ram.size || "",
//                   asset_id: ram.asset_id || "",
//                   product_id: ram.product_id || "",
//                   brands: [],
//                   models: [],
//                   sizes: [],
//                   assetIds: [ram.asset_id], // Pre-populate with existing asset_id
//                   productIds: [],
//                 }))
//               );
//             }

//             // Set storage drives
//             if (storageComponents.length > 0) {
//               setStorageDrives(
//                 storageComponents.map((drive) => ({
//                   type: drive.type || "",
//                   brand: drive.brand || "",
//                   model: drive.model || "",
//                   size: drive.size || "",
//                   asset_id: drive.asset_id || "",
//                   product_id: drive.product_id || "",
//                   brands: [],
//                   models: [],
//                   sizes: [],
//                   assetIds: [drive.asset_id], // Pre-populate with existing asset_id
//                   productIds: [],
//                 }))
//               );
//             }

//             // Set processor if available
//             if (processorComponents.length > 0) {
//               const processor = processorComponents[0];
//               setProcessorBrand(processor.brand || "");
//               setProcessorModel(processor.model || "");
//               setSelectedProcessorAssetId(processor.asset_id || "");
//               setProcessorProductId(processor.product_id || "");
//               setProcessorAssetIds([processor.asset_id]); // Pre-populate with existing asset_id
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//         showSnackbar("Failed to fetch product data", "error");
//       }
//     };

//     if (id) {
//       fetchProductData();
//     }
//   }, [id]);

//   // RAM Effects
//   useEffect(() => {
//     const fetchRamData = async () => {
//       await Promise.all(
//         ramModules.map(async (ram, index) => {
//           // Fetch brands if type is selected but brands are empty
//           if (ram.type && !ram.brands.length) {
//             setLoading((prev) => ({ ...prev, brands: true }));
//             const data = await fetchComponentData(
//               `product_category=RAM&ramType=${ram.type}`
//             );
//             const updatedRamModules = [...ramModules];
//             updatedRamModules[index].brands = data.data || [];
//             setRamModules(updatedRamModules);
//             setLoading((prev) => ({ ...prev, brands: false }));
//           }

//           // Fetch models if brand is selected but models are empty
//           if (ram.type && ram.brand && !ram.models.length) {
//             setLoading((prev) => ({ ...prev, models: true }));
//             const data = await fetchComponentData(
//               `product_category=RAM&ramType=${ram.type}&brand=${ram.brand}`
//             );
//             const updatedRamModules = [...ramModules];
//             updatedRamModules[index].models = data.data || [];
//             setRamModules(updatedRamModules);
//             setLoading((prev) => ({ ...prev, models: false }));
//           }

//           // Fetch sizes if model is selected but sizes are empty
//           if (ram.type && ram.brand && ram.model && !ram.sizes.length) {
//             setLoading((prev) => ({ ...prev, capacities: true }));
//             const data = await fetchComponentData(
//               `product_category=RAM&ramType=${ram.type}&brand=${ram.brand}&model=${ram.model}`
//             );
//             const updatedRamModules = [...ramModules];
//             updatedRamModules[index].sizes = data.data || [];
//             setRamModules(updatedRamModules);
//             setLoading((prev) => ({ ...prev, capacities: false }));
//           }

//           // Fetch asset IDs if all previous fields are selected but asset IDs are empty
//           if (ram.type && ram.brand && ram.model && ram.size && !ram.assetIds.length) {
//             setLoading((prev) => ({ ...prev, assets: true }));
//             const data = await fetchComponentData(
//               `product_category=RAM&ramType=${ram.type}&brand=${ram.brand}&model=${ram.model}&capacity=${ram.size}`
//             );
//             const updatedRamModules = [...ramModules];
//             updatedRamModules[index].assetIds = data.asset_ids || [];
//             updatedRamModules[index].product_id = data.product_id || "";
//             setRamModules(updatedRamModules);
//             setLoading((prev) => ({ ...prev, assets: false }));
//           }
//         })
//       );
//     };

//     fetchRamData();
//   }, [ramModules]);

//   // Storage Effects
//   useEffect(() => {
//     const fetchStorageData = async () => {
//       await Promise.all(
//         storageDrives.map(async (drive, index) => {
//           // Fetch brands if type is selected but brands are empty
//           if (drive.type && !drive.brands.length) {
//             setLoading((prev) => ({ ...prev, brands: true }));
//             const data = await fetchComponentData(
//               `product_category=${drive.type}`
//             );
//             const updatedStorageDrives = [...storageDrives];
//             updatedStorageDrives[index].brands = data.data || [];
//             setStorageDrives(updatedStorageDrives);
//             setLoading((prev) => ({ ...prev, brands: false }));
//           }

//           // Fetch models if brand is selected but models are empty
//           if (drive.type && drive.brand && !drive.models.length) {
//             setLoading((prev) => ({ ...prev, models: true }));
//             const data = await fetchComponentData(
//               `product_category=${drive.type}&brand=${drive.brand}`
//             );
//             const updatedStorageDrives = [...storageDrives];
//             updatedStorageDrives[index].models = data.data || [];
//             setStorageDrives(updatedStorageDrives);
//             setLoading((prev) => ({ ...prev, models: false }));
//           }

//           // Fetch sizes if model is selected but sizes are empty
//           if (drive.type && drive.brand && drive.model && !drive.sizes.length) {
//             setLoading((prev) => ({ ...prev, capacities: true }));
//             const data = await fetchComponentData(
//               `product_category=${drive.type}&brand=${drive.brand}&model=${drive.model}`
//             );
//             const updatedStorageDrives = [...storageDrives];
//             updatedStorageDrives[index].sizes = data.data || [];
//             setStorageDrives(updatedStorageDrives);
//             setLoading((prev) => ({ ...prev, capacities: false }));
//           }

//           // Fetch asset IDs if all previous fields are selected but asset IDs are empty
//           if (drive.type && drive.brand && drive.model && drive.size && !drive.assetIds.length) {
//             setLoading((prev) => ({ ...prev, assets: true }));
//             const data = await fetchComponentData(
//               `product_category=${drive.type}&brand=${drive.brand}&model=${drive.model}&capacity=${drive.size}`
//             );
//             const updatedStorageDrives = [...storageDrives];
//             updatedStorageDrives[index].assetIds = data.asset_ids || [];
//             updatedStorageDrives[index].product_id = data.product_id || "";
//             setStorageDrives(updatedStorageDrives);
//             setLoading((prev) => ({ ...prev, assets: false }));
//           }
//         })
//       );
//     };

//     fetchStorageData();
//   }, [storageDrives]);

//   // Processor Effects
//   useEffect(() => {
//     if (componentCategories.processor) {
//       const fetchProcessorBrands = async () => {
//         setLoading((prev) => ({ ...prev, brands: true }));
//         const data = await fetchComponentData(
//           `product_category=${componentCategories.processor}`
//         );
//         setProcessorBrands(data.data || []);
//         setLoading((prev) => ({ ...prev, brands: false }));
//       };
//       fetchProcessorBrands();
//     }
//   }, []);

//   useEffect(() => {
//     if (componentCategories.processor && processorBrand) {
//       const fetchProcessorModels = async () => {
//         setLoading((prev) => ({ ...prev, models: true }));
//         const data = await fetchComponentData(
//           `product_category=${componentCategories.processor}&brand=${processorBrand}`
//         );
//         setProcessorModels(data.data || []);
//         setLoading((prev) => ({ ...prev, models: false }));
//       };
//       fetchProcessorModels();
//     }
//   }, [processorBrand]);

//   // Processor asset IDs
// useEffect(() => {
//   if (componentCategories.processor && processorBrand && processorModel) {
//     const fetchProcessorAssetIds = async () => {
//       setLoading((prev) => ({ ...prev, assets: true }));

//       // Fix the API parameters for processor
//       const data = await fetchComponentData(
//         `product_category=${componentCategories.processor}&brand=${processorBrand}&model=${encodeURIComponent(processorModel)}`
//       );

//       console.log("Processor Asset IDs Response:", data); // Debug log

//       setProcessorAssetIds(data.asset_ids || []);
//       setProcessorProductId(data.product_id || "");
//       setLoading((prev) => ({ ...prev, assets: false }));
//     };

//     fetchProcessorAssetIds();
//   } else {
//     // Reset asset IDs if conditions aren't met
//     setProcessorAssetIds([]);
//   }
// }, [processorBrand, processorModel]);

// // Also add this useEffect to handle initial data loading for processor
// useEffect(() => {
//   // If we have processor data from the API but asset IDs are empty, try to fetch them
//   if (processorBrand && processorModel && processorAssetIds.length === 0 && selectedProcessorAssetId) {
//     const fetchInitialProcessorAssets = async () => {
//       setLoading((prev) => ({ ...prev, assets: true }));
//       try {
//         const data = await fetchComponentData(
//           `product_category=${componentCategories.processor}&brand=${processorBrand}&model=${encodeURIComponent(processorModel)}`
//         );

//         // If we get asset IDs, use them, otherwise keep the pre-populated one
//         if (data.asset_ids && data.asset_ids.length > 0) {
//           setProcessorAssetIds(data.asset_ids);
//         } else {
//           // If no assets found from API, keep the one from initial data
//           setProcessorAssetIds([selectedProcessorAssetId]);
//         }

//         setProcessorProductId(data.product_id || "");
//       } catch (error) {
//         console.error("Error fetching processor assets:", error);
//         // Fallback to the initial asset ID
//         setProcessorAssetIds([selectedProcessorAssetId]);
//       }
//       setLoading((prev) => ({ ...prev, assets: false }));
//     };

//     fetchInitialProcessorAssets();
//   }
// }, [processorBrand, processorModel, selectedProcessorAssetId]);
//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.asset_id) {
//       showSnackbar("Asset ID is required", "error");
//       return;
//     }

//     // Build components array
//     const components = [];

//     // RAM
//     ramModules
//       .filter((ram) => ram.asset_id)
//       .forEach((ram) => {
//         components.push({
//           component_type: "ram",
//           type: ram.type,
//           brand: ram.brand,
//           model: ram.model,
//           size: ram.size,
//           asset_id: ram.asset_id,
//           product_id: ram.product_id,
//         });
//       });

//     // Storage
//     storageDrives
//       .filter((drive) => drive.asset_id)
//       .forEach((drive) => {
//         components.push({
//           component_type: "storage",
//           type: drive.type,
//           brand: drive.brand,
//           model: drive.model,
//           size: drive.size,
//           asset_id: drive.asset_id,
//           product_id: drive.product_id,
//         });
//       });

//     // Processor
//     if (selectedProcessorAssetId) {
//       components.push({
//         component_type: "processor",
//         brand: processorBrand,
//         model: processorModel,
//         asset_id: selectedProcessorAssetId,
//         product_id: processorProductId,
//       });
//     }

//     // Final object (wrapped inside asset_modification_data)
//     const assetModificationData = {
//       id: formData.id,
//       invoice_id: formData.invoice_id,
//       asset_id: formData.asset_id,
//       product_name: formData.product_name,
//       product_id: formData.product_id,
//       components,
//     };

//     try {
//       const response = await fetch(
//         `${API_URL}/asset-modification/${formData.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             asset_modification_data: assetModificationData,
//           }), // ✅ wrapped
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         showSnackbar(
//           data.message || "Asset modification updated successfully!!",
//           "success"
//         );

//         setTimeout(() => {
//           navigate("/dashboard/inventory/asset-modifications");
//         }, 1500);
//       } else {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Failed to update asset modification"
//         );
//       }
//     } catch (error) {
//       console.error("Error updating asset modification:", error);
//       showSnackbar(error.message || "An unexpected error occurred", "error");
//     }
//   };

//   // Styling constants
//   const styles = {
//     container: {
//       padding: "2rem",
//       maxWidth: "1200px",
//       margin: "0 auto",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       backgroundColor: "#f9fafb",
//       borderRadius: "12px",
//       boxShadow:
//         "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//     },
//     title: {
//       fontSize: "1.875rem",
//       fontWeight: "700",
//       color: "#1f2937",
//       marginBottom: "1.5rem",
//     },
//     form: {
//       backgroundColor: "#ffffff",
//       padding: "2rem",
//       borderRadius: "10px",
//       boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//     },
//     fieldsContainer: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//       gap: "1.5rem",
//       marginBottom: "2rem",
//     },
//     fieldWrapper: {
//       display: "flex",
//       flexDirection: "column",
//       marginBottom: "1rem",
//     },
//     label: {
//       marginBottom: "0.5rem",
//       fontWeight: "500",
//       color: "#374151",
//       fontSize: "0.875rem",
//     },
//     input: {
//       padding: "0.75rem",
//       border: "1px solid #d1d5db",
//       borderRadius: "0.5rem",
//       fontSize: "0.875rem",
//       color: "#111827",
//       width: "100%",
//       boxSizing: "border-box",
//       transition: "all 0.2s ease",
//     },
//     select: {
//       padding: "0.75rem",
//       border: "1px solid #d1d5db",
//       borderRadius: "0.5rem",
//       fontSize: "0.875rem",
//       color: "#111827",
//       backgroundColor: "#fff",
//       transition: "all 0.2s ease",
//       width: "100%",
//     },
//     sectionTitle: {
//       marginBottom: "1.5rem",
//       fontSize: "1.25rem",
//       fontWeight: "600",
//       color: "#1f2937",
//       borderBottom: "2px solid #e5e7eb",
//       paddingBottom: "0.5rem",
//     },
//     componentTitle: {
//       margin: "1.5rem 0 1rem",
//       fontSize: "1.125rem",
//       fontWeight: "600",
//       color: "#374151",
//       display: "flex",
//       alignItems: "center",
//     },
//     gridContainer: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//       gap: "1rem",
//       marginBottom: "1.5rem",
//       backgroundColor: "#f9fafb",
//       padding: "1rem",
//       borderRadius: "0.5rem",
//     },
//     componentItem: {
//       backgroundColor: "#f3f4f6",
//       padding: "1rem",
//       borderRadius: "0.5rem",
//       marginBottom: "1rem",
//       position: "relative",
//     },
//     addButton: {
//       backgroundColor: "#10b981",
//       color: "white",
//       padding: "0.5rem 1rem",
//       border: "none",
//       borderRadius: "0.375rem",
//       cursor: "pointer",
//       fontSize: "0.875rem",
//       fontWeight: "500",
//       marginLeft: "1rem",
//     },
//     removeButton: {
//       backgroundColor: "#ef4444",
//       color: "white",
//       padding: "0.5rem 1rem",
//       border: "none",
//       borderRadius: "0.375rem",
//       cursor: "pointer",
//       fontSize: "0.875rem",
//       fontWeight: "500",
//       position: "absolute",
//       top: "0.5rem",
//       right: "0.5rem",
//     },
//     submitButton: {
//       backgroundColor: "#3b82f6",
//       color: "white",
//       padding: "0.75rem 1.5rem",
//       border: "none",
//       borderRadius: "0.5rem",
//       cursor: "pointer",
//       fontSize: "1rem",
//       fontWeight: "600",
//       marginTop: "1.5rem",
//       width: "100%",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>Asset Modification</h1>

//       <form style={styles.form} onSubmit={handleSubmit}>
//         <div style={styles.fieldsContainer}>
//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>Product Name</label>
//             <input
//               type="text"
//               style={styles.input}
//               value={formData.product_name}
//               onChange={(e) =>
//                 handleInputChange("product_name", e.target.value)
//               }
//               disabled
//             />
//           </div>
//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>Parent Asset ID</label>
//             <input
//               type="text"
//               style={styles.input}
//               value={formData.asset_id}
//               onChange={(e) => handleInputChange("asset_id", e.target.value)}
//               disabled
//             />
//           </div>

//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>RAM</label>
//             <input
//               type="text"
//               style={styles.input}
//               value={formData.ram}
//               onChange={(e) => handleInputChange("ram", e.target.value)}
//               disabled
//             />
//           </div>

//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>Storage</label>
//             <input
//               type="text"
//               style={styles.input}
//               value={formData.storage}
//               onChange={(e) => handleInputChange("storage", e.target.value)}
//               disabled
//             />
//           </div>
//         </div>

//         <h2 style={styles.sectionTitle}>Hardware Configuration</h2>

//         {/* RAM Selector - Now supports multiple modules */}
//         <h4 style={styles.componentTitle}>
//           RAM
//           <button type="button" style={styles.addButton} onClick={addRamModule}>
//             + Add RAM Module
//           </button>
//         </h4>

//         {ramModules.map((ram, index) => (
//           <div key={`ram-module-${index}`} style={styles.componentItem}>
//             {ramModules.length > 1 && (
//               <button
//                 type="button"
//                 style={styles.removeButton}
//                 onClick={() => removeRamModule(index)}
//               >
//                 Remove
//               </button>
//             )}

//             <div style={styles.gridContainer}>
//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Select RAM Type</label>
//                 <select
//                   style={styles.select}
//                   value={ram.type}
//                   onChange={(e) =>
//                     updateRamModule(index, "type", e.target.value)
//                   }
//                 >
//                   <option value="">Select RAM Type</option>
//                   <option value="DDR3">DDR3</option>
//                   <option value="DDR4">DDR4</option>
//                   <option value="DDR5">DDR5</option>
//                   <option value="LPDDR4">LPDDR4</option>
//                   <option value="LPDDR5">LPDDR5</option>
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Brand</label>
//                 <select
//                   style={styles.select}
//                   value={ram.brand}
//                   onChange={(e) =>
//                     updateRamModule(index, "brand", e.target.value)
//                   }
//                   disabled={!ram.type || loading.brands}
//                 >
//                   <option value="">
//                     {loading.brands ? "Loading..." : "Select Brand"}
//                   </option>
//                   {ram.brands.map((brand, brandIndex) => (
//                     <option
//                       key={`ram-brand-${index}-${brandIndex}`}
//                       value={brand.brand || brand}
//                     >
//                       {brand.brand || brand}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Model</label>
//                 <select
//                   style={styles.select}
//                   value={ram.model}
//                   onChange={(e) =>
//                     updateRamModule(index, "model", e.target.value)
//                   }
//                   disabled={!ram.brand || loading.models}
//                 >
//                   <option value="">
//                     {loading.models ? "Loading..." : "Select Model"}
//                   </option>
//                   {ram.models.map((model, modelIndex) => (
//                     <option
//                       key={`ram-model-${index}-${modelIndex}`}
//                       value={model.model || model}
//                     >
//                       {model.model || model}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Capacity</label>
//                 <select
//                   style={styles.select}
//                   value={ram.size}
//                   onChange={(e) =>
//                     updateRamModule(index, "size", e.target.value)
//                   }
//                   disabled={!ram.model || loading.capacities}
//                 >
//                   <option value="">
//                     {loading.capacities ? "Loading..." : "Select Capacity"}
//                   </option>
//                   {ram.sizes.map((size, sizeIndex) => (
//                     <option key={`ram-size-${index}-${sizeIndex}`} value={size.size || size}>
//                       {size.size || size}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Asset ID</label>
//                 <select
//                   style={styles.select}
//                   value={ram.asset_id}
//                   onChange={(e) =>
//                     updateRamModule(index, "asset_id", e.target.value)
//                   }
//                   disabled={ram.assetIds.length === 0 || loading.assets}
//                 >
//                   <option value="">
//                     {loading.assets
//                       ? "Loading..."
//                       : ram.assetIds.length
//                       ? "Select Asset ID"
//                       : "Select options first"}
//                   </option>
//                   {ram.assetIds.map((asset_id, assetIndex) => (
//                     <option
//                       key={`ram-asset-${index}-${assetIndex}`}
//                       value={asset_id}
//                     >
//                       {asset_id}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Storage Drive Selector - Now supports multiple drives */}
//         <h4 style={styles.componentTitle}>
//           Storage Drives
//           <button
//             type="button"
//             style={styles.addButton}
//             onClick={addStorageDrive}
//           >
//             + Add Storage Drive
//           </button>
//         </h4>

//         {storageDrives.map((drive, index) => (
//           <div key={`storage-drive-${index}`} style={styles.componentItem}>
//             {storageDrives.length > 1 && (
//               <button
//                 type="button"
//                 style={styles.removeButton}
//                 onClick={() => removeStorageDrive(index)}
//               >
//                 Remove
//               </button>
//             )}

//             <div style={styles.gridContainer}>
//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Select Category</label>
//                 <select
//                   style={styles.select}
//                   value={drive.type}
//                   onChange={(e) =>
//                     updateStorageDrive(index, "type", e.target.value)
//                   }
//                 >
//                   <option value="">Select Category</option>
//                   {componentCategories.storage.map((type, typeIndex) => (
//                     <option
//                       key={`storage-type-${index}-${typeIndex}`}
//                       value={type}
//                     >
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Brand</label>
//                 <select
//                   style={styles.select}
//                   value={drive.brand}
//                   onChange={(e) =>
//                     updateStorageDrive(index, "brand", e.target.value)
//                   }
//                   disabled={!drive.type || loading.brands}
//                 >
//                   <option value="">
//                     {loading.brands ? "Loading..." : "Select Brand"}
//                   </option>
//                   {drive.brands.map((brand, brandIndex) => (
//                     <option
//                       key={`storage-brand-${index}-${brandIndex}`}
//                       value={brand.brand || brand}
//                     >
//                       {brand.brand || brand}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Model</label>
//                 <select
//                   style={styles.select}
//                   value={drive.model}
//                   onChange={(e) =>
//                     updateStorageDrive(index, "model", e.target.value)
//                   }
//                   disabled={!drive.brand || loading.models}
//                 >
//                   <option value="">
//                     {loading.models ? "Loading..." : "Select Model"}
//                   </option>
//                   {drive.models.map((model, modelIndex) => (
//                     <option
//                       key={`storage-model-${index}-${modelIndex}`}
//                       value={model.model || model}
//                     >
//                       {model.model || model}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Capacity</label>
//                 <select
//                   style={styles.select}
//                   value={drive.size}
//                   onChange={(e) =>
//                     updateStorageDrive(index, "size", e.target.value)
//                   }
//                   disabled={!drive.model || loading.capacities}
//                 >
//                   <option value="">
//                     {loading.capacities ? "Loading..." : "Select Capacity"}
//                   </option>
//                   {drive.sizes.map((size, sizeIndex) => (
//                     <option
//                       key={`storage-size-${index}-${sizeIndex}`}
//                       value={size.size || size}
//                     >
//                       {size.size || size}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div style={styles.fieldWrapper}>
//                 <label style={styles.label}>Asset ID</label>
//                 <select
//                   style={styles.select}
//                   value={drive.asset_id}
//                   onChange={(e) =>
//                     updateStorageDrive(index, "asset_id", e.target.value)
//                   }
//                   disabled={drive.assetIds.length === 0 || loading.assets}
//                 >
//                   <option value="">
//                     {loading.assets
//                       ? "Loading..."
//                       : drive.assetIds.length
//                       ? "Select Asset ID"
//                       : "Select options first"}
//                   </option>
//                   {drive.assetIds.map((asset_id, assetIndex) => (
//                     <option
//                       key={`storage-asset-${index}-${assetIndex}`}
//                       value={asset_id}
//                     >
//                       {asset_id}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Processor Selector */}
//         <h4 style={styles.componentTitle}> Processor</h4>
//         <div style={styles.gridContainer}>
//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>Select Categories</label>
//             <select
//               style={styles.select}
//               value={componentCategories.processor}
//               disabled
//             >
//               <option value="">Select Categories</option>
//               <option value={componentCategories.processor}>
//                 {componentCategories.processor}
//               </option>
//             </select>
//           </div>

//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>Brand</label>
//             <select
//               style={styles.select}
//               value={processorBrand}
//               onChange={(e) => {
//                 setProcessorBrand(e.target.value);
//                 // Reset model and asset ID when brand changes
//                 setProcessorModel("");
//                 setSelectedProcessorAssetId("");
//                 setProcessorAssetIds([]);
//               }}
//               disabled={loading.brands}
//             >
//               <option value="">
//                 {loading.brands ? "Loading..." : "Select Brand"}
//               </option>
//               {processorBrands.map((brand, index) => (
//                 <option key={`processor-brand-${index}`} value={brand.brand || brand}>
//                   {brand.brand || brand}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.fieldWrapper}>
//             <label style={styles.label}>Model</label>
//             <select
//               style={styles.select}
//               value={processorModel}
//               onChange={(e) => {
//                 setProcessorModel(e.target.value);
//                 // Reset asset ID when model changes
//                 setSelectedProcessorAssetId("");
//               }}
//               disabled={!processorBrand || loading.models}
//             >
//               <option value="">
//                 {loading.models ? "Loading..." : "Select Model"}
//               </option>
//               {processorModels.map((model, index) => (
//                 <option key={`processor-model-${index}`} value={model.model || model}>
//                   {model.model || model}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.fieldWrapper}>
//   <label style={styles.label}>Asset ID</label>
//   <select
//     style={styles.select}
//     value={selectedProcessorAssetId}
//     onChange={(e) => setSelectedProcessorAssetId(e.target.value)}
//   >
//     <option value="">
//       {loading.assets
//         ? "Loading..."
//         : processorAssetIds.length
//         ? "Select Asset ID"
//         : "Select options first"}
//     </option>
//     {processorAssetIds.map((asset_id, index) => (
//       <option key={`processor-asset-${index}`} value={asset_id}>
//         {asset_id}
//       </option>
//     ))}
//     {/* Add current asset ID as an option even if not in fetched list */}
//     {selectedProcessorAssetId &&
//      !processorAssetIds.includes(selectedProcessorAssetId) && (
//       <option value={selectedProcessorAssetId}>
//         {selectedProcessorAssetId}
//       </option>
//     )}
//   </select>
// </div>
//         </div>

//         <button type="submit" style={styles.submitButton}>
//           Update Configuration
//         </button>
//       </form>

//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default AssetModificationTrackerEdit;
