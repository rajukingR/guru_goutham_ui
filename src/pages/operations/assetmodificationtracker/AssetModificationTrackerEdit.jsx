import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetModificationTrackerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the peripheral asset ID from URL params
  
  const [formData, setFormData] = useState({
    assetId: "",
    product_name: "",
    modificationType: "",
    currentRAM: "",
    currentStorage: "",
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
  const [loading, setLoading] = useState(true);

  // Fetch existing peripheral asset data
  useEffect(() => {
    const fetchPeripheralAsset = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/peripheral-assets/${id}`);
        if (!response.ok) throw new Error("Failed to fetch peripheral asset");
        const data = await response.json();
        
        // Set form data from API response
        setFormData({
          assetId: data.parent_asset_id,
          product_name: data.product_name,
          modificationType: "",
          currentRAM: data.ram ? data.ram.replace('GB', '') : "",
          currentStorage: data.storage ? data.storage.replace('GB', '') : "",
          approvalDate: data.approval_date || "",
        });
        
        // Set customer from API response
        setSelectedCustomer(data.delivery_challan.customer_code);
        
        // Set challan from API response
        setSelectedChallan(data.challan_id);
        
        // Process selected peripherals from API response
        const peripheralsByCategory = {};
        data.items.forEach(item => {
          if (!peripheralsByCategory[item.product_category]) {
            peripheralsByCategory[item.product_category] = [];
          }
          peripheralsByCategory[item.product_category].push(item.device_id);
        });
        setSelectedPeripherals(peripheralsByCategory);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching peripheral asset:", error);
        setSnackbar({
          open: true,
          message: "Error fetching peripheral asset: " + error.message,
          severity: "error",
        });
        setLoading(false);
      }
    };
    
    fetchPeripheralAsset();
  }, [id]);

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
      setAvailableAssets([]);
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
              processor: item.product.processor,
              os: item.product.os,
              graphics: item.product.graphics,
              disk_type: item.product.disk_type,
              grade: item.product.grade,
              product_category: item.product.product_category,
            });
          });
        });

        setAvailableAssets(assets);
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

        setFormData((prev) => ({
          ...prev,
          product_name: selectedAsset.product_name || "",
          currentRAM: parseSpecValue(selectedAsset.ram),
          currentStorage: parseSpecValue(selectedAsset.storage),
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
        product_id: selectedAsset?.product_id || "",
        product_name: formData.product_name,
        brand: selectedAsset?.brand || "",
        model: selectedAsset?.model || "",
        ram: `${formData.currentRAM}GB`,
        storage: `${formData.currentStorage}GB`,
        approval_date: formData.approvalDate,
        items: peripheralUpdates,
      };

      const response = await fetch(`${API_URL}/peripheral-assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update asset modification"
        );
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Asset modification updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations/asset-updation");
      }, 1500);
    } catch (error) {
      console.error("Error updating asset modification:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error updating asset modification",
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

  if (loading) {
    return <div style={containerStyle}>Loading...</div>;
  }

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
                disabled={true} // Disable customer selection in edit mode
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
                disabled={true} // Disable challan selection in edit mode
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
              <label style={labelStyle}>Asset ID</label>
              <select
                style={inputStyle}
                value={formData.assetId}
                onChange={(e) => handleInputChange("assetId", e.target.value)}
                disabled={true} // Disable asset selection in edit mode
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
          </div>
        </div>

        {/* Peripheral Selection Section */}
        <div style={{ ...cardStyle, gridColumn: "span 2" }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Peripheral Asset Management</h3>
          </div>

          {/* Dynamically render sections based on categories found in the data */}
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
          Update Modification
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

export default AssetModificationTrackerEdit;






// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

// const AssetModificationTrackerEdit = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     asset_image_url: '',
//     asset_id: '',
//     asset_name: '',
//     modification_type: '',
//     reason_for_modification: '',
//     requested_by: '',
//     approved_by: '',
//     request_date: '',
//     approval_date: '',
//     estimated_cost: '',
//     status: '',
//     remarks: '',
//     active_status: false,
//   });

//   useEffect(() => {
//     axios.get(`${API_URL}/asset-modifications/${id}`)
//       .then(res => setFormData(res.data))
//       .catch(err => console.error('Fetch failed:', err));
//   }, [id]);

//   const handleChange = (field, value) =>
//     setFormData(prev => ({ ...prev, [field]: value }));

//   const handleSubmit = () => {
//     axios.put(`${API_URL}/asset-modifications/${id}`, formData)
//       .then(() => {
//         setSnackbarOpen(true); // Show success Snackbar
//         setTimeout(() => {
//           navigate('/dashboard/operations/asset_modification_tracker');
//         }, 3000);
//       })
//       .catch(err => console.error('Update failed:', err));
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={formContainerStyle}>
//         {/* Asset Information */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>🏢</div>
//             <h3 style={cardHeaderStyle}>Asset Information</h3>
//           </div>
//           <div style={fieldsContainerStyle}>
//             <Field label="Asset ID" placeholder="Enter Asset ID" value={formData.asset_id} onChange={v => handleChange('asset_id', v)} />
//             <Field label="Asset Name" placeholder="Enter Asset Name" value={formData.asset_name} onChange={v => handleChange('asset_name', v)} />
//             <Field label="Modification Type" placeholder="Enter Modification Type" value={formData.modification_type} onChange={v => handleChange('modification_type', v)} />
//           </div>
//         </div>

//         {/* Request & Approval */}
//         <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>📋</div>
//             <h3 style={cardHeaderStyle}>Request & Approval Details</h3>
//           </div>
//           <div style={fieldsGridStyle}>
//             <Field label="Reason" placeholder="Enter Reason" value={formData.reason_for_modification} onChange={v => handleChange('reason_for_modification', v)} />
//             <Field label="Requested By" placeholder="Enter Requested By" value={formData.requested_by} onChange={v => handleChange('requested_by', v)} />
//             <Field label="Request Date" type="date" value={formData.request_date} onChange={v => handleChange('request_date', v)} />
//             <Field label="Approved By" placeholder="Enter Approved By" value={formData.approved_by} onChange={v => handleChange('approved_by', v)} />
//             <Field label="Approval Date" type="date" value={formData.approval_date} onChange={v => handleChange('approval_date', v)} />
//             <Field label="Estimated Cost" placeholder="Enter Estimated Cost" type="number" value={formData.estimated_cost} onChange={v => handleChange('estimated_cost', v)} />
//             <Field label="Status" placeholder="Enter Status" value={formData.status} onChange={v => handleChange('status', v)} />
//             <Field label="Remarks" placeholder="Enter Remarks" value={formData.remarks} onChange={v => handleChange('remarks', v)} />
//           </div>
//         </div>

//         {/* Control */}
//         <div style={cardStyle}>
//           <div style={cardHeaderContainerStyle}>
//             <div style={iconStyle}>🎛️</div>
//             <h3 style={cardHeaderStyle}>Control</h3>
//           </div>
//           <label style={checkboxLabelStyle}>
//             <input type="checkbox" checked={formData.active_status} onChange={e => handleChange('active_status', e.target.checked)} style={checkboxStyle} />
//             <div style={{ ...checkboxCustomStyle, backgroundColor: formData.active_status ? '#2563eb' : '#fff', borderColor: formData.active_status ? '#2563eb' : '#d1d5db' }}>
//               {formData.active_status && <span style={checkmarkStyle}>✓</span>}
//             </div>
//             <div>
//               <span style={checkboxTextStyle}>Active Status</span>
//               <span style={checkboxDescStyle}>Enable this asset modification tracker for use in the system</span>
//             </div>
//           </label>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div style={buttonContainerStyle}>
//         <button style={cancelBtnStyle} onClick={() => navigate(-1)}>Cancel</button>
//         <button style={createBtnStyle} onClick={handleSubmit}>Update</button>
//       </div>

//       {/* Success Snackbar */}
//     <Snackbar
//   open={snackbarOpen}
//   autoHideDuration={2000}
//   onClose={handleCloseSnackbar}
//   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// >
//   <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
//     Updated successfully!
//   </Alert>
// </Snackbar>

//     </div>
//   );
// };

// const Field = ({ label, placeholder, type = 'text', value, onChange }) => (
//   <div style={fieldContainerStyle}>
//     <label style={labelStyle}>{label}</label>
//     <input type={type} placeholder={placeholder} style={inputStyle} value={value || ''} onChange={e => onChange(e.target.value)} />
//   </div>
// );

//   // Style constants
//   const containerStyle = { padding: '2rem', fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif', minHeight: '100vh', lineHeight: 1.6 };
//   const formContainerStyle = { display: 'grid', gap: '1.5rem', maxWidth: '1600px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' };
//   const cardStyle = { backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0', height: 'fit-content' };
//   const cardHeaderContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' };
//   const iconStyle = { fontSize: '1.25rem', marginRight: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' };
//   const cardHeaderStyle = { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 };
//   const uploadContainerStyle = { marginBottom: '1.5rem' };
//   const uploadButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', transition: 'background-color 0.2s' };
//   const uploadIconStyle = { fontSize: '1rem' };
//   const uploadHintStyle = { display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' };
//   const fieldsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
//   const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
//   const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
//   const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
//   const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#ffffff', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' };
//   const checkboxContainerStyle = { marginTop: '0.5rem' };
//   const checkboxLabelStyle = { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.75rem' };
//   const checkboxStyle = { display: 'none' };
//   const checkboxCustomStyle = { width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #d1d5db', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' };
//   const checkmarkStyle = { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' };
//   const checkboxTextStyle = { fontSize: '0.875rem', fontWeight: '500', color: '#374151', display: 'block' };
//   const checkboxDescStyle = { fontSize: '0.75rem', color: '#6b7280', display: 'block', marginTop: '0.25rem' };
//   const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', maxWidth: '1400px', margin: '2rem auto 0', padding: '0 1.5rem' };
//   const cancelBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' };
//   const createBtnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' };

// export default AssetModificationTrackerEdit;