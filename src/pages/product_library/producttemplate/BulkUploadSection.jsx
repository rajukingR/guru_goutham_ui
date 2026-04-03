import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import API_URL from '../../../api/Api_url';
import { useNavigate } from 'react-router-dom';

const BulkUploadSection = ({ token, onUploadComplete, showSnackbar }) => { // Keep showSnackbar in props
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Remove the local snackbar state and function
  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: "",
  //   severity: "info",
  // });

  // Remove the local showSnackbar function
  // const showSnackbar = (message, severity = "info") => {
  //   setSnackbar({ open: true, message, severity });
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const formData = new FormData();
    formData.append('excel_file', file);
    
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    setUploading(true);
    setProgress(0);

    try {
      const response = await axios.post(
        `${API_URL}/product-templete/bulk-upload-excel`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );
      
      
      // Show success message using the prop function
      if (response.data.success) {
        // Use the showSnackbar prop from parent
        showSnackbar(response.data.message, 'success');
        
        // Show upload status in component
        setUploadStatus({
          success: true,
          message: response.data.message,
          details: response.data.errors,
          summary: response.data.summary
        });
        
        // Call the onUploadComplete callback
        if (onUploadComplete) {
          onUploadComplete();
        }
        
        // Navigate after delay
        setTimeout(() => {
          navigate("/dashboard/product_library");
        }, 2000);
        
      } else {
        // Show error message
        showSnackbar(response.data.message || 'Upload failed', 'error');
        setUploadStatus({
          success: false,
          message: response.data.message,
          details: response.data.error
        });
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Upload failed';
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || error.response.data.error || 'Server error';
      } else if (error.request) {
        console.error('No response:', error.request);
        errorMessage = 'No response from server';
      }
      
      showSnackbar(errorMessage, 'error');
      setUploadStatus({
        success: false,
        message: errorMessage,
        details: error.message
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handleFileUpload(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };


  // Styles
  const styles = {
    container: {
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      margin: '0 0 20px 0',
      color: '#333',
      fontSize: '20px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    dropZone: {
      border: '2px dashed #4a90e2',
      borderRadius: '8px',
      padding: '40px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#f8faff',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
      '&:hover': {
        backgroundColor: '#eef5ff',
        borderColor: '#357ae8'
      }
    },
    dropZoneContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    uploadIcon: {
      fontSize: '48px',
      color: '#4a90e2',
      marginBottom: '10px'
    },
    dropZoneText: {
      margin: '0',
      fontSize: '16px',
      color: '#333',
      fontWeight: '500'
    },
    dropZoneSubText: {
      margin: '0',
      fontSize: '14px',
      color: '#666'
    },
    fileType: {
      margin: '10px 0 0 0',
      fontSize: '12px',
      color: '#999'
    },
    templateSection: {
      textAlign: 'center',
      marginTop: '20px'
    },
    downloadBtn: {
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#357ae8'
      }
    },
    templateNote: {
      fontSize: '12px',
      color: '#666',
      marginTop: '8px'
    },
    progressBar: {
      width: '100%',
      height: '10px',
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
      margin: '15px 0',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4a90e2',
      transition: 'width 0.3s ease',
      borderRadius: '5px'
    },
    uploadingText: {
      textAlign: 'center',
      color: '#666',
      margin: '10px 0'
    },
    statusBox: {
      padding: '15px',
      borderRadius: '6px',
      marginTop: '15px',
      border: '1px solid #ddd'
    },
    statusSuccess: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb',
      color: '#155724'
    },
    statusError: {
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      color: '#721c24'
    },
    detailsBtn: {
      background: 'none',
      border: 'none',
      color: '#4a90e2',
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '10px',
      textDecoration: 'underline'
    },
    errorList: {
      margin: '10px 0 0 0',
      paddingLeft: '20px',
      fontSize: '12px',
      maxHeight: '100px',
      overflowY: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <span style={{ fontSize: '24px' }}>📁</span>
        Bulk Upload Products via Excel
      </h3>
      
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Upload multiple products at once using Excel. Download the template, fill your data, and upload.
      </p>

      <div 
        style={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <div style={styles.dropZoneContent}>
          <div style={styles.uploadIcon}>📤</div>
          <p style={styles.dropZoneText}>
            <strong>Drag & drop Excel file here</strong>
          </p>
          <p style={styles.dropZoneSubText}>
            or click to browse files
          </p>
          <p style={styles.fileType}>
            Supports: .xlsx, .xls, .csv (Max: 10MB)
          </p>
        </div>
      </div>

      {uploading && (
        <div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
          </div>
          <p style={styles.uploadingText}>
            Uploading... {progress}%
          </p>
        </div>
      )}

      {uploadStatus && (
        <div style={{
          ...styles.statusBox,
          ...(uploadStatus.success ? styles.statusSuccess : styles.statusError)
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {uploadStatus.success ? '✅ Success!' : '❌ Error!'}
          </p>
          <p style={{ margin: '10px 0' }}>{uploadStatus.message}</p>
          
          {uploadStatus.details && Array.isArray(uploadStatus.details) && uploadStatus.details.length > 0 && (
            <div>
              <details>
                <summary style={{ cursor: 'pointer', color: '#4a90e2' }}>
                  View {uploadStatus.details.length} error(s)
                </summary>
                <ul style={styles.errorList}>
                  {uploadStatus.details.map((error, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{error}</li>
                  ))}
                </ul>
              </details>
            </div>
          )}

          {uploadStatus.summary && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <p><strong>Summary:</strong></p>
              <p>Total: {uploadStatus.summary.total || 0}</p>
              <p>Success: {uploadStatus.summary.success || 0}</p>
              <p>Failed: {uploadStatus.summary.failed || 0}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default BulkUploadSection;