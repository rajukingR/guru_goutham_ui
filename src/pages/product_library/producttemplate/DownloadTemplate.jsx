import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../../api/Api_url';

const DownloadTemplateButton = ({ token, showSnackbar }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      const response = await axios.get(
        `${API_URL}/product-templete/download-template`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'blob' // Important for file download
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'Product_Template.xlsx';
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showSnackbar('Template downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('Download error:', error);
      showSnackbar('Failed to download template', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          ...styles.button,
          ...(downloading && styles.disabledButton)
        }}
      >
        {downloading ? (
          <>
            <span style={styles.spinner}></span>
            Downloading...
          </>
        ) : (
          <>
            <span style={styles.icon}>📥</span>
            Download Products
          </>
        )}
      </button>
      <p style={styles.note}>
        Downloads Excel with all database columns
      </p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px'
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    minWidth: '200px',
    justifyContent: 'center'
  },
  disabledButton: {
    backgroundColor: '#94d3a2',
    cursor: 'not-allowed'
  },
  icon: {
    fontSize: '16px'
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  },
  note: {
    fontSize: '12px',
    color: '#6c757d',
    marginTop: '8px'
  }
};

// Add spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default DownloadTemplateButton;