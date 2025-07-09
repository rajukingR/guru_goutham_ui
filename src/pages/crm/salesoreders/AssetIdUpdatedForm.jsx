import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetIdUpdatedForm = () => {
  const { id, assetId } = useParams(); // ✅ gets productId and assetId
  const product_id = id;
  const [assets, setAssets] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(assetId || ""); // Initialize with assetId if present
  const [formData, setFormData] = useState({
    assetIds: assetId ? [assetId] : [], // Initialize with assetId if present
    product_name: "",
    modificationType: "",
    currentRAM: "",
    newRAM: "",
    newRAMCost: "",
    currentStorage: "",
    newStorage: "",
    newStorageCost: "",
    reason: "",
    requestedBy: "",
    requestDate: new Date().toISOString().split("T")[0],
    approvedBy: "",
    approvalDate: "",
    remarks: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `${API_URL}/asset-modification/product_id/${product_id}`
        );
        const data = await response.json();
        setAssets(data);
        
        // If assetId is provided in URL, find and pre-fill the asset data
        if (assetId) {
          const selectedAsset = data.find(asset => asset.asset_id === assetId);
          if (selectedAsset) {
            setFormData(prev => ({
              ...prev,
              product_name: selectedAsset.product_name,
              currentRAM: selectedAsset.ram || "N/A",
              currentStorage: selectedAsset.storage || "N/A",
            }));
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [product_id, assetId]); // Add assetId to dependency array

  const handleAssetSelect = (assetId) => {
    setSelectedAssetId(assetId);
    setIsDropdownOpen(false);

    const selectedAsset = assets.find((asset) => asset.asset_id === assetId);
    if (selectedAsset) {
      setFormData((prev) => ({
        ...prev,
        assetIds: [assetId],
        product_name: selectedAsset.product_name,
        currentRAM: selectedAsset.ram || "N/A",
        currentStorage: selectedAsset.storage || "N/A",
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_URL}/asset-modification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            product_id: parseInt(product_id),
          }),
        }
      );

      if (response.ok) {
        alert("Asset modification request submitted successfully!");
        // Reset form
        setFormData({
          ...formData,
          modificationType: "",
          newRAM: "",
          newRAMCost: "",
          newStorage: "",
          newStorageCost: "",
          reason: "",
          requestedBy: "",
          approvedBy: "",
          approvalDate: "",
          remarks: "",
        });
        setSelectedAssetId("");
      } else {
        throw new Error("Failed to submit modification request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  if (isLoading) {
    return <div style={containerStyle}>Loading assets...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1>Order Asset Modification</h1>
      <form
        id="modificationForm"
        onSubmit={handleSubmit}
        style={formContainerStyle}
      >
        {/* Asset Selection Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>🔍</div>
            <h3 style={cardHeaderStyle}>Select Assets</h3>
          </div>
          <div style={fieldContainerStyle}>
  <label style={labelStyle}>Asset ID</label>
  <div style={{ position: "relative" }}>
    <div
      style={{
        ...inputStyle,
        padding: "0.75rem",
        cursor: selectedAssetId ? "default" : "pointer", // Change cursor when selected
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        opacity: selectedAssetId ? 0.8 : 1, // Slightly fade when selected
        pointerEvents: selectedAssetId ? "none" : "auto", // Disable clicks when selected
      }}
      onClick={() => !selectedAssetId && setIsDropdownOpen(!isDropdownOpen)} // Only toggle if no selection
    >
      <span style={{ color: selectedAssetId ? "#1e293b" : "#9ca3af" }}>
        {selectedAssetId || "Select an Asset"}
      </span>
      {!selectedAssetId && ( // Only show dropdown arrow when no selection
        <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
          {isDropdownOpen ? "▲" : "▼"}
        </span>
      )}
    </div>

    {/* Only show dropdown if no asset is selected and dropdown is open */}
    {!selectedAssetId && isDropdownOpen && (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          maxHeight: "200px",
          overflowY: "auto",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          zIndex: 10,
        }}
      >
        {assets.map((asset) => (
          <div
            key={asset.asset_id}
            style={{
              padding: "0.75rem",
              cursor: "pointer",
              backgroundColor: selectedAssetId === asset.asset_id ? "#f3f4f6" : "#fff",
              ":hover": {
                backgroundColor: "#f9fafb",
              },
            }}
            onClick={() => handleAssetSelect(asset.asset_id)}
          >
            {asset.asset_id} - {asset.product_name}
          </div>
        ))}
      </div>
    )}
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
              label="Modification Type"
              placeholder="Enter Modification Type"
              value={formData.modificationType}
              onChange={(v) => handleInputChange("modificationType", v)}
              required
            />
          </div>
        </div>

        {/* Hardware Specifications Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>💾</div>
            <h3 style={cardHeaderStyle}>Hardware Specifications</h3>
          </div>
          <div style={fieldsContainerStyle}>
            <Field
              label="Current RAM (GB)"
              placeholder="Current RAM capacity"
              type="text"
              value={formData.currentRAM}
              onChange={(v) => handleInputChange("currentRAM", v)}
              disabled
            />
            <Field
              label="New RAM (GB)"
              placeholder="New RAM capacity"
              type="number"
              value={formData.newRAM}
              onChange={(v) => handleInputChange("newRAM", v)}
            />
            <Field
              label="New RAM Cost"
              placeholder="Enter RAM upgrade cost"
              type="number"
              value={formData.newRAMCost}
              onChange={(v) => handleInputChange("newRAMCost", v)}
            />
            <Field
              label="Current Storage (GB)"
              placeholder="Current storage capacity"
              type="text"
              value={formData.currentStorage}
              onChange={(v) => handleInputChange("currentStorage", v)}
              disabled
            />
            <Field
              label="New Storage (GB)"
              placeholder="New storage capacity"
              type="number"
              value={formData.newStorage}
              onChange={(v) => handleInputChange("newStorage", v)}
            />
            <Field
              label="New Storage Cost"
              placeholder="Enter storage upgrade cost"
              type="number"
              value={formData.newStorageCost}
              onChange={(v) => handleInputChange("newStorageCost", v)}
            />
          </div>
        </div>

        {/* Request & Approval Details Section */}
        <div style={{ ...cardStyle, gridColumn: "span 2" }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Request & Approval Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Reason for Modification"
              placeholder="Enter Reason for Modification"
              value={formData.reason}
              onChange={(v) => handleInputChange("reason", v)}
              required
            />
            <Field
              label="Requested By"
              placeholder="Enter Requested By"
              value={formData.requestedBy}
              onChange={(v) => handleInputChange("requestedBy", v)}
              required
            />
            <Field
              label="Request Date"
              placeholder=""
              type="date"
              value={formData.requestDate}
              onChange={(v) => handleInputChange("requestDate", v)}
              required
            />
            <Field
              label="Approved By"
              placeholder="Enter Approved By"
              value={formData.approvedBy}
              onChange={(v) => handleInputChange("approvedBy", v)}
            />
            <Field
              label="Approval Date"
              placeholder=""
              type="date"
              value={formData.approvalDate}
              onChange={(v) => handleInputChange("approvalDate", v)}
            />

            <Field
              label="Remarks"
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={(v) => handleInputChange("remarks", v)}
            />
          </div>
        </div>
      </form>
      <div style={buttonContainerStyle}>
        <button type="button" style={cancelBtnStyle}>
          Cancel
        </button>
        <button type="submit" form="modificationForm" style={createBtnStyle}>
          Submit Modification Request
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
  disabled = false,
  required = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
    </label>
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
      required={required}
    />
  </div>
);

// Styles
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
  maxWidth: "1600px",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
  transition: "border-color 0.2s, box-shadow 0.2s",
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
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#e5e7eb",
  },
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
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#1d4ed8",
  },
};

export default AssetIdUpdatedForm;
