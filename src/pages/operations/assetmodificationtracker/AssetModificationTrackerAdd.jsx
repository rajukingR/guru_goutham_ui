import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetModificationTrackerAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assetId: '',
    product_name: '',
    modificationType: '',
    currentRAM: '',
    newRAM: '',
    newRAMCost: '',
    currentStorage: '',
    newStorage: '',
    newStorageCost: '',
    reason: '',
    requestedBy: '',
    approvedBy: '',
    requestDate: '',
    approvalDate: '',
    status: '',
    remarks: '',
    activeStatus: false,
  });

  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch delivery challans data when component mounts
  useEffect(() => {
    const fetchDeliveryChallans = async () => {
      try {
        const response = await fetch(`${API_URL}/delivery-challans/approved-delivery-challan`);
        if (!response.ok) throw new Error("Failed to fetch delivery challans");
        const data = await response.json();
        setDeliveryChallans(data);
        
        // Extract unique customers
        const uniqueCustomers = data.reduce((acc, challan) => {
          if (!acc.some(c => c.customer_code === challan.customer_code)) {
            acc.push({
              customer_id: challan.customer_code,
              customer_name: challan.customer?.first_name + ' ' + challan.customer?.last_name,
              customer_data: challan.customer
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

  // When customer is selected, filter available delivery challans
  useEffect(() => {
    if (selectedCustomer) {
      const customerChallans = deliveryChallans.filter(
        challan => challan.customer_code === selectedCustomer
      );
      setSelectedChallan(null);
      setAvailableAssets([]);
      setFormData(prev => ({
        ...prev,
        assetId: '',
        product_name: '',
        currentRAM: '',
        currentStorage: ''
      }));
    }
  }, [selectedCustomer, deliveryChallans]);

  // When delivery challan is selected, set available assets
// When delivery challan is selected, set available assets
useEffect(() => {
  if (selectedChallan) {
    const selectedChallanData = deliveryChallans.find(
      challan => challan.id === selectedChallan
    );
    
    if (selectedChallanData) {
      // Process only the assigned device IDs (not available_device_ids)
      const assets = [];
      selectedChallanData.items.forEach(item => {
        // Only add the assigned device IDs
        item.device_ids.forEach(deviceId => {
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
            grade: item.product.grade
          });
        });
      });
      
      setAvailableAssets(assets);
      setFormData(prev => ({
        ...prev,
        assetId: '',
        product_name: '',
        currentRAM: '',
        currentStorage: ''
      }));
    }
  }
}, [selectedChallan, deliveryChallans]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // When assetId changes, auto-fill the asset details
    if (field === 'assetId') {
      const selectedAsset = availableAssets.find(asset => asset.asset_id === value);
      if (selectedAsset) {
        // Extract numeric values from "16GB" format
        const parseSpecValue = (spec) => {
          if (!spec) return '';
          const numValue = spec.replace(/[^\d.]/g, '');
          return numValue || '';
        };

        setFormData(prev => ({
          ...prev,
          product_name: selectedAsset.product_name || '',
          currentRAM: parseSpecValue(selectedAsset.ram),
          currentStorage: parseSpecValue(selectedAsset.storage)
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const selectedChallanData = deliveryChallans.find(challan => challan.id === selectedChallan);
      const selectedAsset = availableAssets.find(asset => asset.asset_id === formData.assetId);
      const selectedCustomerData = customers.find(customer => customer.customer_id === selectedCustomer);

      const payload = {
        // Customer Information
        customer_id: selectedCustomer,
        customer_name: selectedCustomerData?.customer_name || '',
        customer_data: selectedCustomerData?.customer_data || {},

        // Delivery Challan Information
        delivery_challan_id: selectedChallan,
        dc_id: selectedChallanData?.dc_id || '',
        dc_date: selectedChallanData?.dc_date || '',

        // Asset Information
        asset_id: formData.assetId,
        product_id: selectedAsset?.product_id || '',
        product_name: formData.product_name,
        brand: selectedAsset?.brand || '',
        model: selectedAsset?.model || '',

        // Hardware Specifications
        ram: `${formData.currentRAM}GB`,
        new_ram: formData.newRAM ? `${formData.newRAM}GB` : null,
        new_ram_cost: parseFloat(formData.newRAMCost || 0),
        storage: `${formData.currentStorage}GB`,
        new_storage: formData.newStorage ? `${formData.newStorage}GB` : null,
        new_storage_cost: parseFloat(formData.newStorageCost || 0),
        processor: selectedAsset?.processor || '',
        os: selectedAsset?.os || '',
        graphics: selectedAsset?.graphics || '',
        disk_type: selectedAsset?.disk_type || '',
        grade: selectedAsset?.grade || '',

        // Modification Details
        modification_type: formData.modificationType,
        reason: formData.reason,

        // Request & Approval
        requested_by: formData.requestedBy,
        approved_by: formData.approvedBy,
        request_date: formData.requestDate,
        approval_date: formData.approvalDate,
        status: formData.status,
        remarks: formData.remarks,
        active_status: formData.activeStatus,
      };

      const response = await fetch(`${API_URL}/asset-modifications/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create asset modification");
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: "Asset modification created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/operations/asset_modification_tracker");
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
    value={selectedCustomer || ''}
    onChange={(e) => {
      const selectedValue = e.target.value;
      if (selectedValue === "") {
        setSelectedCustomer(null);
      } else {
        const [customerId, challanId] = selectedValue.split('|');
        setSelectedCustomer(customerId);
        setSelectedChallan(challanId ? Number(challanId) : null);
      }
    }}
  >
    <option value="">Select a Customer</option>
    {deliveryChallans.map((challan) => (
      <option 
        key={`${challan.customer_code}|${challan.id}`} 
        value={`${challan.customer_code}|${challan.id}`}
      >
        {challan.order_number} | {challan.customer?.first_name} {challan.customer?.last_name}
      </option>
    ))}
  </select>
</div>
            
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Select Delivery Challan</label>
              <select
                style={inputStyle}
                value={selectedChallan || ''}
                onChange={(e) => setSelectedChallan(Number(e.target.value))}
                disabled={!selectedCustomer}
              >
                <option value="">Select a Delivery Challan</option>
                {selectedCustomer && deliveryChallans
                  .filter(challan => challan.customer_code === selectedCustomer)
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
    onChange={(e) => handleInputChange('assetId', e.target.value)}
    disabled={!selectedChallan}
  >
    <option value="">Select an Asset</option>
    {availableAssets.map((asset) => (
      <option key={asset.asset_id} value={asset.asset_id}>
        {asset.asset_id} - {asset.product_name}
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
              onChange={(v) => handleInputChange('product_name', v)} 
              disabled
            />
            
            <Field 
              label="Modification Type" 
              placeholder="Enter Modification Type" 
              value={formData.modificationType} 
              onChange={(v) => handleInputChange('modificationType', v)} 
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
              type="number" 
              value={formData.currentRAM} 
              onChange={(v) => handleInputChange('currentRAM', v)} 
              disabled
            />
            <Field 
              label="New RAM (GB)" 
              placeholder="New RAM capacity" 
              type="number" 
              value={formData.newRAM} 
              onChange={(v) => handleInputChange('newRAM', v)} 
            />
            <Field 
              label="New RAM Cost ($)" 
              placeholder="Enter RAM upgrade cost" 
              type="number" 
              value={formData.newRAMCost} 
              onChange={(v) => handleInputChange('newRAMCost', v)} 
            />
            <Field 
              label="Current Storage (GB)" 
              placeholder="Current storage capacity" 
              type="number" 
              value={formData.currentStorage} 
              onChange={(v) => handleInputChange('currentStorage', v)} 
              disabled
            />
            <Field 
              label="New Storage (GB)" 
              placeholder="New storage capacity" 
              type="number" 
              value={formData.newStorage} 
              onChange={(v) => handleInputChange('newStorage', v)} 
            />
            <Field 
              label="New Storage Cost ($)" 
              placeholder="Enter storage upgrade cost" 
              type="number" 
              value={formData.newStorageCost} 
              onChange={(v) => handleInputChange('newStorageCost', v)} 
            />
          </div>
        </div>

        {/* Request & Approval Details Section */}
        <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Request & Approval Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field label="Reason for Modification" placeholder="Enter Reason for Modification" value={formData.reason} onChange={(v) => handleInputChange('reason', v)} />
            <Field label="Requested By" placeholder="Enter Requested By" value={formData.requestedBy} onChange={(v) => handleInputChange('requestedBy', v)} />
            <Field label="Request Date" placeholder="" type="date" value={formData.requestDate} onChange={(v) => handleInputChange('requestDate', v)} />
            <Field label="Approved By" placeholder="Enter Approved By" value={formData.approvedBy} onChange={(v) => handleInputChange('approvedBy', v)} />
            <Field label="Approval Date" placeholder="" type="date" value={formData.approvalDate} onChange={(v) => handleInputChange('approvalDate', v)} />
            <Field label="Remarks" placeholder="Enter Remarks" value={formData.remarks} onChange={(v) => handleInputChange('remarks', v)} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <button style={cancelBtnStyle} onClick={() => navigate("/dashboard/operations/asset_modification_tracker")}>
          Cancel
        </button>
        <button style={createBtnStyle} onClick={handleSubmit} disabled={!formData.assetId}>
          Create
        </button>
      </div>
    </div>
  );
};

// Enhanced Field Component with disabled prop
const Field = ({ label, placeholder, type = 'text', value, onChange, disabled = false }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      style={{ ...inputStyle, backgroundColor: disabled ? '#f3f4f6' : '#ffffff' }} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      disabled={disabled}
    />
  </div>
);

// Styles remain the same as in your original code
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1600px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  height: 'fit-content',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0',
};

const iconStyle = {
  fontSize: '1.25rem',
  marginRight: '0.75rem',
  backgroundColor: '#f1f5f9',
  padding: '0.5rem',
  borderRadius: '8px',
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const fieldsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldsGridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
const fieldContainerStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' };
const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: '8px',
  border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#ffffff'
};

const buttonContainerStyle = {
  display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
  marginTop: '2rem', maxWidth: '1400px', margin: '2rem auto 0', padding: '0 1.5rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151',
  border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.875rem', fontWeight: '500'
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white',
  border: 'none', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.875rem', fontWeight: '500'
};

export default AssetModificationTrackerAdd;