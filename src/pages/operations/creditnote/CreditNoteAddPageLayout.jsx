import React, { useState } from 'react';

const CreditNoteAddPageLayout = () => {
  const [formData, setFormData] = useState({
    creditNoteNumber: '',
    referenceInvoice: '',
    issueDate: new Date().toISOString().split('T')[0],
    customer: '',
    reason: 'return',
    items: [
      { id: 1, product: '', description: '', quantity: 1, price: 0, tax: 0, total: 0 }
    ],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );
      
      // Calculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const taxAmount = updatedItems.reduce((sum, item) => sum + (item.tax * item.quantity * item.price / 100), 0);
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount
      };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), product: '', description: '', quantity: 1, price: 0, tax: 0, total: 0 }
      ]
    }));
  };

  const removeItem = (id) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Credit Note Submitted:', formData);
    // API call would go here
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create Credit Note</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>📄</div>
            <h3 style={styles.cardTitle}>Credit Note Details</h3>
          </div>
          
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Credit Note Number*</label>
              <input
                type="text"
                name="creditNoteNumber"
                value={formData.creditNoteNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.field}>
              <label style={styles.label}>Reference Invoice*</label>
              <input
                type="text"
                name="referenceInvoice"
                value={formData.referenceInvoice}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.field}>
              <label style={styles.label}>Issue Date*</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.field}>
              <label style={styles.label}>Customer*</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Customer</option>
                <option value="cust1">Customer A</option>
                <option value="cust2">Customer B</option>
                <option value="cust3">Customer C</option>
              </select>
            </div>
            
            <div style={styles.field}>
              <label style={styles.label}>Reason*</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="return">Return</option>
                <option value="discount">Discount</option>
                <option value="error">Billing Error</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Items Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>🛒</div>
            <h3 style={styles.cardTitle}>Items</h3>
          </div>
          
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Tax (%)</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={item.product}
                        onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                        style={styles.tableInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        style={styles.tableInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
                        style={{...styles.tableInput, width: '60px'}}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
                        style={{...styles.tableInput, width: '80px'}}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.tax}
                        onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value))}
                        style={{...styles.tableInput, width: '60px'}}
                      />
                    </td>
                    <td style={styles.td}>
                      ${(item.quantity * item.price * (1 + item.tax/100)).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={styles.removeButton}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              type="button"
              onClick={addItem}
              style={styles.addItemButton}
            >
              + Add Item
            </button>
          </div>
        </div>
        
        {/* Summary Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>🧾</div>
            <h3 style={styles.cardTitle}>Summary</h3>
          </div>
          
          <div style={styles.summaryGrid}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal:</span>
              <span style={styles.summaryValue}>${formData.subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax:</span>
              <span style={styles.summaryValue}>${formData.taxAmount.toFixed(2)}</span>
            </div>
            <div style={{...styles.summaryRow, borderTop: '1px solid #e2e8f0', paddingTop: '10px'}}>
              <span style={{...styles.summaryLabel, fontWeight: '600'}}>Total:</span>
              <span style={{...styles.summaryValue, fontWeight: '600'}}>${formData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{...styles.input, minHeight: '80px'}}
              placeholder="Additional notes about this credit note"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button type="button" style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" style={styles.submitButton}>
            Create Credit Note
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '2rem',
    fontFamily: '"Inter", sans-serif',
    maxWidth: '1400px',
    minHeight: '100vh'
  },
  header: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0'
  },
  cardIcon: {
    fontSize: '1.25rem',
    marginRight: '0.75rem',
    backgroundColor: '#f1f5f9',
    padding: '0.5rem',
    borderRadius: '0.375rem'
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem'
  },
  field: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#64748b'
  },
  input: {
    width: '100%',
    padding: '0.625rem 0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem'
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#f1f5f9',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0'
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #e2e8f0',
    verticalAlign: 'top'
  },
  tableInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.25rem',
    fontSize: '0.875rem'
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0 0.5rem'
  },
  addItemButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffffff',
    border: '1px dashed #cbd5e1',
    borderRadius: '0.375rem',
    color: '#64748b',
    fontSize: '0.875rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginBottom: '1.5rem'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  summaryLabel: {
    fontSize: '0.875rem',
    color: '#64748b'
  },
  summaryValue: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1e293b'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1rem'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '0.375rem',
    color: '#64748b',
    fontWeight: '500',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '0.375rem',
    color: '#ffffff',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default CreditNoteAddPageLayout;