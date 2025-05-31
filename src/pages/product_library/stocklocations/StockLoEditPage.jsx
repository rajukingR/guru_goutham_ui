import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StockLoEditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    stockLocationId: '',
    stockName: '',
    mailId: '',
    phoneNo: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    landmark: '',
    street: '',
    activeStatus: false,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stock-locations/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error('Error fetching stock location:', err));
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/api/stock-locations/${id}`, formData)
      .then(() => alert('Stock location updated successfully'))
      .catch((err) => alert('Update failed: ' + err.message));
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Stock Location Info */}
        <div style={styles.card}>
          <div style={styles.cardHeaderContainer}>
            <div style={styles.icon}>📍</div>
            <h3 style={styles.cardHeader}>Stock Location Info</h3>
          </div>
          <div style={styles.fieldsGrid}>
            <Field label="Stock Location ID" value={formData.stockLocationId} onChange={(val) => handleInputChange('stockLocationId', val)} />
            <Field label="Stock Name" value={formData.stockName} onChange={(val) => handleInputChange('stockName', val)} />
            <Field label="Mail Id" value={formData.mailId} onChange={(val) => handleInputChange('mailId', val)} />
            <Field label="Phone No" value={formData.phoneNo} onChange={(val) => handleInputChange('phoneNo', val)} />
          </div>
        </div>

        {/* Address */}
        <div style={styles.card}>
          <div style={styles.cardHeaderContainer}>
            <div style={styles.icon}>📫</div>
            <h3 style={styles.cardHeader}>Address Details</h3>
          </div>
          <div style={styles.fieldsGrid}>
            <Field label="Pincode" value={formData.pincode} onChange={(val) => handleInputChange('pincode', val)} />
            <Field label="Country" value={formData.country} onChange={(val) => handleInputChange('country', val)} />
            <Field label="State" value={formData.state} onChange={(val) => handleInputChange('state', val)} />
            <Field label="City" value={formData.city} onChange={(val) => handleInputChange('city', val)} />
            <Field label="Landmark" value={formData.landmark} onChange={(val) => handleInputChange('landmark', val)} />
            <Field label="Street" value={formData.street} onChange={(val) => handleInputChange('street', val)} />
          </div>
        </div>

        {/* Configuration */}
        <div style={styles.card}>
          <div style={styles.cardHeaderContainer}>
            <div style={styles.icon}>⚙️</div>
            <h3 style={styles.cardHeader}>Configuration</h3>
          </div>
          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.activeStatus}
                onChange={(e) => handleInputChange('activeStatus', e.target.checked)}
                style={{ display: 'none' }}
              />
              <div style={styles.checkboxCustom}>
                {formData.activeStatus && <span style={styles.checkmark}>✓</span>}
              </div>
              <div>
                <span style={styles.checkboxText}>Active Status</span>
                <span style={styles.checkboxDesc}>Enable this stock location for use</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.cancelBtn}>Cancel</button>
        <button style={styles.createBtn} onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <div style={styles.fieldContainer}>
    <label style={styles.label}>{label}</label>
    <input
      type="text"
      placeholder={`Enter ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.input}
    />
  </div>
);

const styles = {
  container: { padding: '2rem', fontFamily: 'sans-serif' },
  formContainer: { display: 'grid', gap: '1.5rem', maxWidth: '1400px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' },
  cardHeaderContainer: { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' },
  icon: { fontSize: '1.25rem', marginRight: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' },
  cardHeader: { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  fieldsGrid: { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' },
  fieldContainer: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: '#374151' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' },
  checkboxContainer: { marginTop: '0.5rem' },
  checkboxLabel: { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.75rem' },
  checkboxCustom: { width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #d1d5db', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#2563eb', fontSize: '12px', fontWeight: 'bold' },
  checkboxText: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
  checkboxDesc: { fontSize: '0.75rem', color: '#6b7280' },
  buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' },
  cancelBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' },
  createBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default StockLoEditPage;
