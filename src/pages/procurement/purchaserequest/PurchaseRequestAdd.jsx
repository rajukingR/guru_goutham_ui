import React, { useState, useEffect } from 'react';
import {
  Box, Checkbox, IconButton, MenuItem, Paper, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import API_URL from "../../../api/Api_url";
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const PurchaseRequestAdd = () => {
  const [showProductTable, setShowProductTable] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    suppliers: true,
    products: true
  });
  const [error, setError] = useState({
    suppliers: null,
    products: null
  });

  const [formData, setFormData] = useState({
    purchaseRequestId: '',
    purchaseRequestDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    purchaseType: 'Buy',
    purchaseRequestStatus: 'Pending',
    owner: '',
    supplier: '',
    description: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success'
});


  useEffect(() => {
    // Fetch suppliers
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${API_URL}/supplier`);
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const data = await response.json();
        setSuppliers(data);
        setLoading(prev => ({ ...prev, suppliers: false }));
      } catch (err) {
        setError(prev => ({ ...prev, suppliers: err.message }));
        setLoading(prev => ({ ...prev, suppliers: false }));
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product-templete`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(prev => ({ ...prev, products: false }));
      } catch (err) {
        setError(prev => ({ ...prev, products: err.message }));
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQtyChange = (id, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities({ ...quantities, [id]: qty });
  };

  const incrementQty = (id) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementQty = (id) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

const handleSubmit = async () => {
  const selectedProducts = products
    .filter(p => selectedProductIds.includes(p.id))
    .map(p => ({
      product_id: p.id,
      product_name: p.name,
      quantity: quantities[p.id] || 0,
      unit_price: 0
    }));

  const payload = {
    purchase_request_id: formData.purchaseRequestId,
    purchase_request_date: formData.purchaseRequestDate,
    purchase_type: formData.purchaseType,
    purchase_request_status: formData.purchaseRequestStatus,
    owner: formData.owner,
    supplier_id: formData.supplier,
    description: formData.description,
    selected_products: selectedProducts
  };

  try {
    const response = await fetch(`${API_URL}/purchase-requests/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setSnackbar({ open: true, message: 'Purchase request created successfully!', severity: 'success' });
      setTimeout(() => {
        navigate('/dashboard/procurement/purchase-requests');
      }, 1500);
    } else {
      const error = await response.json();
      console.error(error);
      setSnackbar({ open: true, message: 'Failed to create purchase request.', severity: 'error' });
    }
  } catch (err) {
    console.error(err);
    setSnackbar({ open: true, message: 'Error occurred during submission.', severity: 'error' });
  }
};


  if (loading.suppliers || loading.products) {
    return <div style={containerStyle}>Loading...</div>;
  }

  if (error.suppliers || error.products) {
    return (
      <div style={containerStyle}>
        {error.suppliers && <p>Error loading suppliers: {error.suppliers}</p>}
        {error.products && <p>Error loading products: {error.products}</p>}
      </div>
    );
  }


  return (
    <div style={containerStyle}>
        
        <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
    >
      <Alert
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    
      <div style={formContainerStyle}>
        {/* Purchase Request Details Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>📋</div>
            <h3 style={cardHeaderStyle}>Purchase Request Details</h3>
          </div>
          <div style={fieldsGridStyle}>
            <Field
              label="Purchase Request ID"
              placeholder="Enter Purchase Request ID"
              value={formData.purchaseRequestId}
              onChange={(value) => handleInputChange('purchaseRequestId', value)}
            />
            <Field
              label="Purchase Request Date"
              type="date"
              placeholder="yyyy-mm-dd"
              value={formData.purchaseRequestDate}
              onChange={(value) => handleInputChange('purchaseRequestDate', value)}
            />
            <Field
              label="Purchase Type"
              type="select"
              placeholder="Select Purchase Type"
              value={formData.purchaseType}
              onChange={(value) => handleInputChange('purchaseType', value)}
              required
            />
            <Field
              label="Purchase Request Status"
              type="select"
              placeholder="Select Status"
              value={formData.purchaseRequestStatus}
              onChange={(value) => handleInputChange('purchaseRequestStatus', value)}
              required
            />
            <Field
              label="Owner"
              placeholder="Enter Owner"
              value={formData.owner}
              onChange={(value) => handleInputChange('owner', value)}
            />
          </div>
        </div>

        {/* Select Supplier Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Select Supplier</h3>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <Field
              label="Select Supplier"
              type="select"
              placeholder="Select Supplier"
              value={formData.supplier}
              onChange={(value) => handleInputChange('supplier', value)}
              options={suppliers.map(supplier => ({
                value: supplier.supplier_id,
                label: supplier.supplier_name
              }))}
            />
          </div>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Additional Information</h3>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field
              label="Description"
              placeholder="Enter Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
            />
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <h3 style={cardHeaderStyle}>Select Products</h3>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowProductTable(!showProductTable)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: showProductTable ? '#f3f4f6' : '#2563eb',
              color: showProductTable ? '#374151' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              outline: 'none',
              marginBottom: '1rem',
            }}
          >
            {showProductTable ? 'Hide Product List' : 'Select Products'}
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
      <TableRow sx={{ backgroundColor: '#0d47a1' }}>
        <TableCell padding="checkbox" sx={{ color: '#fff' }}>
          <Checkbox sx={{ color: '#fff' }} />
        </TableCell>
        <TableCell sx={{ color: '#fff' }}>Product ID</TableCell>
        <TableCell sx={{ color: '#fff' }}>Product Name</TableCell>
        <TableCell sx={{ color: '#fff' }}>Brand</TableCell>
        <TableCell sx={{ color: '#fff' }}>Model</TableCell>
        <TableCell sx={{ color: '#fff' }}>Processor</TableCell>
        <TableCell sx={{ color: '#fff' }}>RAM</TableCell>
        <TableCell sx={{ color: '#fff' }}>Storage</TableCell>
        <TableCell sx={{ color: '#fff' }}>Graphics</TableCell>
        <TableCell sx={{ color: '#fff' }}>Quantity</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredProducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedProductIds.includes(product.id)}
              onChange={() => {
                setSelectedProductIds(prev =>
                  prev.includes(product.id)
                    ? prev.filter(id => id !== product.id)
                    : [...prev, product.id]
                );
              }}
            />
          </TableCell>
          <TableCell>{product.product_id}</TableCell>
          <TableCell>{product.product_name}</TableCell>
          <TableCell>{product.brand}</TableCell>
          <TableCell>{product.model}</TableCell>
          <TableCell>{product.processor}</TableCell>
          <TableCell>{product.ram}</TableCell>
          <TableCell>{product.storage}</TableCell>
          <TableCell>{product.graphics}</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <IconButton size="small" onClick={() => decrementQty(product.id)}>
                <Remove fontSize="small" />
              </IconButton>
              <TextField
                type="number"
                size="small"
                value={quantities[product.id] || ''}
                onChange={(e) => handleQtyChange(product.id, e.target.value)}
                inputProps={{ min: 0, style: { width: 50, textAlign: 'center' } }}
              />
              <IconButton size="small" onClick={() => incrementQty(product.id)}>
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
        <button style={cancelBtnStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'} onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
          Cancel
        </button>
        <button
          style={createBtnStyle}
          onClick={handleSubmit}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          disabled={!formData.supplier || selectedProductIds.length === 0}
        >
          Create Purchase Request
        </button>
      </div>
    </div>
  );
};



const Field = ({ label, placeholder, type = 'text', required = false, value, onChange, options }) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {label}
      {required && <span style={requiredStyle}>*</span>}
    </label>
    {type === 'select' ? (
      <div style={selectWrapperStyle}>
        <select
          style={selectStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        >
          <option value="">{placeholder}</option>
          {label === "Purchase Type" && (
            <>
              <option value="Buy">Buy</option>
              <option value="Lease">Lease</option>
              <option value="Rent">Rent</option>
            </>
          )}
          {label === "Purchase Request Status" && (
            <>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </>
          )}
          {label === "Select Supplier" && options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div style={selectArrowStyle}>▼</div>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        required={required}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    )}
  </div>
);

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const formContainerStyle = {
  display: 'grid',
  gap: '1.5rem',
  maxWidth: '1200px',
  margin: '0 auto',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  transition: 'box-shadow 0.2s ease',
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

const fieldsGridStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
  letterSpacing: '0.025em',
};

const requiredStyle = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectWrapperStyle = {
  position: 'relative',
  width: '100%',
};

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  paddingRight: '2.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

const selectArrowStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  fontSize: '0.75rem',
  color: '#6b7280',
};

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '2rem',
  maxWidth: '1200px',
  margin: '2rem auto 0',
  padding: '0 1.5rem',
};

const cancelBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
};

const createBtnStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  outline: 'none',
};

export default PurchaseRequestAdd;