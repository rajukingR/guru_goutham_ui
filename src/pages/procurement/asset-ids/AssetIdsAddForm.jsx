import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetIdsAddForm = ({ productId }) => {
  const [assets, setAssets] = useState([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [formData, setFormData] = useState({
    modificationType: '',
    currentRAM: '',
    newRAM: '',
    newRAMCost: '',
    currentStorage: '',
    newStorage: '',
    newStorageCost: '',
    reason: '',
    requestedBy: '',
    requestDate: new Date().toISOString().split('T')[0],
    approvedBy: '',
    approvalDate: '',
    estimatedCost: '',
    remarks: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assets data from API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${API_URL}/asset-modification/product_id/${productId}`);
        setAssets(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [productId]);

  // Handle asset selection
  const handleAssetSelection = (assetId) => {
    setSelectedAssetIds(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });

    // Auto-fill form with first selected asset's data
    if (selectedAssetIds.length === 0) {
      const selectedAsset = assets.find(asset => asset.asset_id === assetId);
      if (selectedAsset) {
        setFormData(prev => ({
          ...prev,
          product_name: selectedAsset.product_name,
          currentRAM: selectedAsset.ram,
          currentStorage: selectedAsset.storage
        }));
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for each selected asset
      const modifications = selectedAssetIds.map(assetId => {
        const asset = assets.find(a => a.asset_id === assetId);
        return {
          asset_id: assetId,
          product_id: asset.product_id,
          ...formData
        };
      });

      

      // Send data to API
      const response = await axios.post(`${API_URL}/asset-modification`, {
        modifications
      });

      alert('Modifications saved successfully!');
      // Reset form or redirect as needed
    } catch (err) {
      setError(err.message);
    }
  };

  // Styles (you can move these to a separate CSS file)
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '20px',
      marginBottom: '20px'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px'
    },
    icon: {
      fontSize: '24px',
      marginRight: '10px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    checkbox: {
      marginRight: '10px'
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    error: {
      color: 'red',
      marginBottom: '15px'
    }
  };

  if (isLoading) return <div>Loading assets...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1>Asset Modification Form</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.icon}>🖥️</span>
          <h2>Select Assets to Modify</h2>
        </div>
        
        <div style={styles.formGroup}>
          {assets.map(asset => (
            <div key={asset.asset_id} style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`asset-${asset.asset_id}`}
                checked={selectedAssetIds.includes(asset.asset_id)}
                onChange={() => handleAssetSelection(asset.asset_id)}
                style={styles.checkbox}
              />
              <label htmlFor={`asset-${asset.asset_id}`}>
                {asset.asset_id} - {asset.product_name} (RAM: {asset.ram}, Storage: {asset.storage})
              </label>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Asset Information Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.icon}>🏢</span>
            <h2>Asset Modification</h2>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Product name</label>
            <input
              type="text"
              style={styles.input}
              value={formData.product_name || ''}
              readOnly
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Modification Type</label>
            <input
              type="text"
              style={styles.input}
              value={formData.modificationType}
              onChange={(e) => handleInputChange('modificationType', e.target.value)}
              placeholder="Enter Modification Type"
              required
            />
          </div>
        </div>

        {/* Hardware Specifications Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.icon}>💾</span>
            <h2>Hardware Specifications</h2>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Current RAM (GB)</label>
            <input
              type="text"
              style={styles.input}
              value={formData.currentRAM || ''}
              readOnly
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>New RAM (GB)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.newRAM}
              onChange={(e) => handleInputChange('newRAM', e.target.value)}
              placeholder="Enter new RAM capacity"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>New RAM Cost ($)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.newRAMCost}
              onChange={(e) => handleInputChange('newRAMCost', e.target.value)}
              placeholder="Enter RAM upgrade cost"
              step="0.01"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Storage (GB)</label>
            <input
              type="text"
              style={styles.input}
              value={formData.currentStorage || ''}
              readOnly
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>New Storage (GB)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.newStorage}
              onChange={(e) => handleInputChange('newStorage', e.target.value)}
              placeholder="Enter new storage capacity"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>New Storage Cost ($)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.newStorageCost}
              onChange={(e) => handleInputChange('newStorageCost', e.target.value)}
              placeholder="Enter storage upgrade cost"
              step="0.01"
            />
          </div>
        </div>

        {/* Request & Approval Details Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.icon}>📋</span>
            <h2>Request & Approval Details</h2>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Reason for Modification</label>
            <textarea
              style={{ ...styles.input, minHeight: '80px' }}
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Enter reason for modification"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Requested By</label>
            <input
              type="text"
              style={styles.input}
              value={formData.requestedBy}
              onChange={(e) => handleInputChange('requestedBy', e.target.value)}
              placeholder="Enter requester name"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Request Date</label>
            <input
              type="date"
              style={styles.input}
              value={formData.requestDate}
              onChange={(e) => handleInputChange('requestDate', e.target.value)}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Approved By</label>
            <input
              type="text"
              style={styles.input}
              value={formData.approvedBy}
              onChange={(e) => handleInputChange('approvedBy', e.target.value)}
              placeholder="Enter approver name"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Approval Date</label>
            <input
              type="date"
              style={styles.input}
              value={formData.approvalDate}
              onChange={(e) => handleInputChange('approvalDate', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Estimated Cost ($)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.estimatedCost}
              onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
              placeholder="Enter total estimated cost"
              step="0.01"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Remarks</label>
            <textarea
              style={{ ...styles.input, minHeight: '80px' }}
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="Enter any additional remarks"
            />
          </div>
        </div>

        <button type="submit" style={styles.button} disabled={selectedAssetIds.length === 0}>
          Submit Modifications
        </button>
      </form>
    </div>
  );
};

export default AssetIdsAddForm;