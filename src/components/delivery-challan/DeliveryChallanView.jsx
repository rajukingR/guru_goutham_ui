import React, { useRef } from 'react';
import logo from "../logo/logo.png";

const DeliveryChallanView = ({ open, onClose, dcData }) => {

  const printRef = useRef();

// Map API data to Delivery Challan format
const mapDeliveryChallanData = (data) => {
  if (!data) return null;

  // Add items from API response (no header rows)
  const apiItems = data.items?.map((item, index) => {
    const product = item.product || {};

    // Build configuration string from product details
    const configParts = [];
    if (product.ram) configParts.push(`${product.ram} RAM`);
    if (product.brand) configParts.push(product.brand);
    if (product.model) configParts.push(product.model);
    if (product.processor) configParts.push(product.processor);
    if (product.storage) configParts.push(product.storage);
    if (product.display_size) configParts.push(`${product.display_size}" Display`);
    if (product.os) configParts.push(product.os);
    if (product.graphics) configParts.push(product.graphics);

    const config = configParts.join(', ');

    // Build the particulars with product name, config, and asset IDs
    let particularsContent = item.product_name || product.product_name || 'Product';
    
    // Add config as a new line
    if (config) {
      particularsContent += `\n${config}`;
    }
    
    if (item.device_ids && Array.isArray(item.device_ids) && item.device_ids.length > 0) {
      const assetIds = item.device_ids.join(', ');
      particularsContent += `\n<strong>Asset IDs:</strong> ${assetIds}`;
    }

    return {
      slNo: index + 1,
      particulars: particularsContent,
      qty: item.quantity || 1
    };
  }) || [];

  // Get contact details from the API response (already included at top level)
  const contact = data.contact || data.dispatch_order?.contact || {};

  // Parse address from contact
  let contactAddress = {};
  if (contact.address) {
    try {
      contactAddress = typeof contact.address === 'string' 
        ? JSON.parse(contact.address) 
        : contact.address;
    } catch (e) {
      console.error('Error parsing address:', e);
      contactAddress = contact.address || {};
    }
  }

  // Build address from contact address
  const addressParts = [];
  if (contactAddress.street) addressParts.push(contactAddress.street);
  if (contactAddress.city) addressParts.push(contactAddress.city);
  if (contactAddress.state) addressParts.push(contactAddress.state);
  if (contactAddress.pincode) addressParts.push(contactAddress.pincode);
  const fullAddress = addressParts.filter(part => part).join(', ');

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get customer name from contact or data
  const customerName = contact.company_name || 
    `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 
    data.customer_name || 
    data.shipping_name || 
    'Customer';

  return {
    challanNo: data.dc_id || data.id || '',
    challanDate: formatDate(data.dc_date || data.created_at || ''),
    contactPerson: contact.first_name ? 
      `${contact.first_name} ${contact.last_name || ''}`.trim() : 
      contact.company_name || data.shipping_name || '',
    contactNo: contact.phone_number || data.shipping_phone_number || '',
    receiverName: data.receiver_name || contact.first_name || '',
    receiverNo: data.receiver_phone_number || contact.phone_number || '',
    deliveryPersonName: data.delivery_person_name || contact.delivery_person_name || '',
    vehicleNo: data.vehicle_number || '',
    customerCode: contact.customer_id || data.customer_code || '',
    emailId: contact.email || data.email || '',
    tinNo: contact.gst || data.gst_number || '',
    panNo: contact.pan_no || data.pan_number || '',
    paperSize: 'A4',
    toAddress: {
      name: customerName,
      address: fullAddress || 'Address not available',
      city: contactAddress.city || data.city || '',
      phone: contact.phone_number || data.shipping_phone_number || '',
      email: contact.email || data.email || ''
    },
    deliveryAddress: fullAddress || 'Delivery address not specified',
    items: apiItems
  };
};

  // Use mapped data or show empty state
  const data = dcData ? mapDeliveryChallanData(dcData) : null;

  if (!data) {
    return (
      <div className="text-center p-8">
        <p>No delivery challan data available</p>
      </div>
    );
  }

  // Calculate total quantity
  const totalQuantity = data.items?.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    return sum + qty;
  }, 0) || 0;

  const getPageStyle = () => {
    switch (data.paperSize) {
      case "A3": return { width: "420mm", height: "297mm" };
      case "A5": return { width: "210mm", height: "148mm" };
      case "Letter": return { width: "8.5in", height: "11in" };
      case "Legal": return { width: "8.5in", height: "14in" };
      case "Custom": return { width: `${data.customWidth || 210}mm`, height: `${data.customHeight || 297}mm` };
      default: return { width: "210mm", height: "297mm" };
    }
  };

  const pageStyle = getPageStyle();

  // Generate page HTML with header and footer for each page
  const generatePageHTML = (itemsHtml, pageNumber, totalPages, showSummary = false) => {
    const showHeader = pageNumber === 1;

    return `
      <div class="page-container">
        <div class="quotation-content">
          ${showHeader ? `
          <div class="title">DELIVERY CHALLAN</div>

          <!-- Header -->
          <table class="header-table">
            <tr>
              <td class="company-section">
                <div class="company-name">Guru Goutam Infotech Pvt. Ltd.</div>
                
                <div class="logo-row">
                  <div class="logo">
                    <img src="${logo}" alt="Logo" />
                  </div>
                  <div class="gg-company-info">
                    <div class="gg-company-registration">
                      <div>CIN: U72200KA2008PTC047679</div>
                      <div>GST: 29AADCG2608Q1Z6</div>
                    </div>
                    <div class="gg-company-address-line">
                      No. 8, 2nd Cross, Diagonal Road, 3rd Block, Jayanagar
                    </div>
                    <div class="gg-company-address-line">
                      Bengaluru-560011, Ph:080-22429955, M:9449078955
                    </div>
                    <div class="gg-company-address-line">
                      Email: info@gurugoutam.com, Web: gurugoutam.com
                    </div>
                  </div>
                </div>
              </td>
              <td class="to-section">
                <b>To,</b><br>
                <b>${data.toAddress?.name || 'Customer'}</b><br>
                ${data.toAddress?.address || 'Address not available'}<br>
                ${data.toAddress?.city || ''}<br>
                Phone: ${data.toAddress?.phone || 'N/A'}<br>
                Email: ${data.toAddress?.email || 'N/A'}
              </td>
            </tr>
          </table>

          <!-- Customer Details -->
          <table class="info-table">
            <tr>
              <td class="info-label1">CHALLAN NO.</td>
              <td class="info-value1">${data.challanNo}</td>
              <td class="info-label1">DC DATE</td>
              <td class="info-label1">${data.challanDate}</td>
              <td class="info-label3">CONTACT PERSON</td>
              <td class="info-value">${data.contactPerson}</td>
              <td class="info-label">CONTACT NO.</td>
              <td class="info-value">${data.contactNo}</td>
            </tr>
            <tr>
              <td class="info-label">CUSTOMER CODE</td>
              <td class="info-value">${data.customerCode}</td>
              <td class="info-label">RECEIVER NAME</td>
              <td class="info-value">${data.receiverName}</td>
              <td className="info-label">DELIVERY STAFF</td>
              <td className="info-value">{data.deliveryPersonName}</td>
              <td className="info-label">VEHICLE NO.</td>
              <td className="info-value">{data.vehicleNo}</td>
            </tr>
          </table>
          ` : `
          <!-- Empty space for pages without header to maintain layout -->
          <div style="height:10px;"></div>
          `}
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width:10%;text-align:center;">SL. NO.</th>
                <th style="width:75%;text-align:left;">PARTICULARS</th>
                <th style="width:15%;text-align:center;">QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              ${showSummary ? `
              <!-- Summary rows -->
              <tr>
                <td colspan="2" style="padding-right:10px;border:0.2px solid #000;">
                  <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
                    <div>
                      <span style="margin-left:100px; font-weight:bold;">TIN No.: </span>${data.tinNo || 'N/A'}
                      <span style="margin-left:100px; font-weight:bold;">PAN No.: </span>${data.panNo || 'N/A'}
                    </div>
                    <span style="font-weight:bold;">TOTAL QTY</span>
                  </div>
                </td>
                <td style="text-align:center;font-weight:bold;border:0.2px solid #000;">${totalQuantity}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          ${showSummary ? `
          <!-- Terms & Conditions Box -->
          <div class="not-for-sale">
            NOT FOR SALE - RETURNABLE BASIS ONLY
          </div>
          <div class="note-subject">
            <div class="note-subject-text">NOTE: Subject to Bengaluru Juristriction</div>
          </div>
          <!-- Footer -->
          <div class="footer">
            <div class="delivery-details">
              <b>Delivery Address</b><br>
              <span class="bold">${data.deliveryAddress || 'Not specified'}.</span>
            </div>

            <div class="box-content" style="text-align:center;">
              Receiver Details & Signature<br>
              <br><br>
              <span style="font-weight:600;">SD/-</span>
              <br><br><br>
              <span style="font-weight:600;font-size:11px;">Signature with seal</span>
            </div>

            <div class="box-content" style="text-align:center;">
              For<br>
              <span style="font-weight:600;font-size:12px;">Guru Goutam Infotech Pvt. Ltd.</span>
              <br><br>
              <span style="font-weight:600;">SD/-</span>
              <br><br><br>
              <span style="font-weight:600;font-size:11px;">Authorised Signatory</span>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  };

const handlePrint = () => {
  const printContent = printRef.current;
  if (!printContent) return;

  const printWindow = window.open('', '_blank', 'width=900,height=600');
  if (!printWindow) {
    window.print();
    return;
  }

  // Prepare items data
  const itemsData = [];
  let slCounter = 1;

  data.items?.forEach((item, index) => {
    if (!item.particulars) return;

    const slNo = item.slNo || slCounter++;

    // Split particulars by newline for display
    const lines = item.particulars.split('\n');

    itemsData.push({
      slNo,
      lines: lines,
      qty: item.qty || '',
      isFirst: index === 0 // Mark first item
    });
  });

  // Calculate items per page
  const itemsPerPage = 12;
  const totalItems = itemsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Generate HTML for each page
  let allPagesHtml = '';

  for (let page = 0; page < totalPages; page++) {
    const start = page * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);
    const pageItems = itemsData.slice(start, end);

    let itemsHtml = '';
    pageItems.forEach((item, index) => {
      let particularsContent = '';
      
      // Add "Product Details:" only for the first item on the first page
      const showProductDetails = (page === 0 && index === 0);
      
      if (showProductDetails) {
        particularsContent += `<div style="margin-bottom:10px;"><span style="font-size:11px;font-weight:600;color:#000;">Product Details:</span></div>`;
      }
      
      // Build particulars with proper formatting
      item.lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          particularsContent += `<br>`;
        }
        const fontSize = lineIndex === 0 ? '12px' : '10px';
        const fontWeight = lineIndex === 0 ? '600' : '400';
        const color = lineIndex === 0 ? '#000' : '#333';
        const marginBottom = lineIndex < item.lines.length - 1 ? '2px' : '0';
        
        particularsContent += `<span style="font-size:${fontSize};font-weight:${fontWeight};color:${color};display:block;margin-bottom:${marginBottom};">${line}</span>`;
      });

      itemsHtml += `
        <tr>
          <td style="text-align:center;vertical-align:top;padding:8px 6px;">${item.slNo}</td>
          <td style="text-align:left;vertical-align:top;padding:8px 6px;">
            ${particularsContent}
          </td>
          <td style="text-align:center;vertical-align:top;padding:8px 6px;">${item.qty}</td>
        </tr>
      `;
    });

    const showSummary = (page === totalPages - 1);
    allPagesHtml += generatePageHTML(itemsHtml, page + 1, totalPages, showSummary);
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DELIVERY CHALLAN</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }

        body {
          background: white;
          padding: 0;
          margin: 0;
        }

        .print-wrapper {
          width: 100%;
          max-width: 100%;
          padding: 0;
          margin: 0;
        }

        .page-container {
          width: 210mm;
          height: 297mm;
          border: 0.2px solid #000;
          padding: 8mm 8mm 8mm 10mm;
          margin: 0 auto;
          page-break-after: always;
          page-break-inside: avoid;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .page-container:last-child {
          page-break-after: auto;
        }

        .quotation-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        .title {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          font-family: 'Arial Narrow', Arial, sans-serif;
          letter-spacing: 0px;
          margin-bottom: 8px;
        }

        .header-table {
          width: 100%;
          border-collapse: collapse;
        }

        .header-table td {
          border: 0.2px solid #000;
          padding: 6px 8px;
          vertical-align: top;
        }

        .company-section {
          width: 55%;
        }

        .to-section {
          width: 40.2%;
        }

        .company-name {
          color: #FF0000;
          font-size: 32px;
          font-weight: 400;
          margin-left: 6px;
          font-family: 'Arial Narrow', Arial, sans-serif;
        }

        .logo-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 2px;
        }

        .logo {
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 400;
          flex-shrink: 0;
          align-self: flex-start;
        }

        .logo img {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .gg-company-info {
          flex: 1;
          font-family: Arial, sans-serif;
          color: #555;
          align-self: flex-start;
        }

        .gg-company-registration {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: #333;
          line-height: 1.1;
          margin-bottom: 3px;
        }

        .gg-company-address-line {
          font-size: 11.5px;
          line-height: 1.2;
          color: #555;
          text-align: left;
        }

        .to-section {
          font-family: Arial, 'Arial Narrow', sans-serif;
          font-size: 12px;
        }

        .to-section b {
          font-family: 'Arial Narrow', Arial, sans-serif;
        }

        .info-table {
          width: 100%;
          height: 100px;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .info-table td {
          border: 0.2px solid #000;
          padding: 3px 6px;
          height: 28px;
          font-size: 11px;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }

        .info-label {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 12%;
          font-size: 10px;
        }

        .info-label3 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 15%;
          font-size: 10px;
        }

        .info-value {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 13%;
          font-size: 10px;
        }

        .info-label1 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 9%;
          font-size: 10px;
        }

        .info-label2 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 10.5%;
          font-size: 10px;
        }

        .info-value1 {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 10%;
          font-size: 10px;
        }

        .info-value2 {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 8%;
          font-size: 10px;
        }

        .info-email {
          text-align: center;
          color: blue;
          font-family: Arial, 'Arial Narrow', sans-serif;
          font-size: 10px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          flex: 1;
        }

        .items-table th {
          border: 0.2px solid #000;
          padding: 3px 6px;
          text-align: center;
          font-size: 11px;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-weight: 400;
        }

        .items-table td {
          border: 0.2px solid #000;
          padding: 3px 6px;
          font-size: 11px;
          vertical-align: middle;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }

        .items-table td:first-child {
          text-align: center;
        }

        .items-table td:nth-child(2) {
          text-align: left;
        }

        .items-table td:nth-child(3) {
          text-align: center;
        }

        .summary-label {
          text-align: center;
          font-size: 10px;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-weight: 400;
        }

        .total-row {
          font-size: 18px;
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
        }

        .terms-box {
          margin-top: 6px;
          padding: 6px 10px;
          border: 0.2px solid #000;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .terms-title {
          font-weight: bold;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .terms-list {
          padding-left: 18px;
          margin-top: 2px;
          font-size: 11px;
          line-height: 1.5;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }

        .terms-list li {
          margin-bottom: 1px;
        }

        .note-subject {
          grid-column: 1 / -1;
          border: 0.2px solid #000;
          padding: 10px 10px;
          text-align: left;
        }
        .note-subject-text {
          font-size: 11px;
          font-weight: bold;
          font-family: 'Arial Narrow', Arial, sans-serif;
          letter-spacing: 1px;
        }
        .not-for-sale {
          grid-column: 1 / -1;
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          font-family: 'Arial Narrow', Arial, sans-serif;
          color: #000;
          border: 0.2px solid #000;
          padding: 15px 8px;
          letter-spacing: 1px;
        }

        .footer {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 20px;
          flex-shrink: 0;
        }

        .delivery-details {
          font-size: 10px;
          line-height: 1.6;
          font-family: Arial, 'Arial Narrow', sans-serif;
          flex: 1;
          border: 0.2px solid #000;
          padding: 8px 12px;
          border-radius: 3px;
        }

        .delivery-details .bold {
          font-weight: 600;
        }

        .box-content {
          font-size: 10px;
          line-height: 1.6;
          font-family: Arial, 'Arial Narrow', sans-serif;
          flex: 1;
          border: 0.2px solid #000;
          padding: 8px 12px;
          border-radius: 3px;
        }

        .box-content .bold {
          font-weight: 600;
        }

        .summary-row-tin-pan {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 8px;
        }
        .tin-pan-left {
          display: flex;
          gap: 20px;
        }
        .total-qty-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .total-qty-number {
          font-size: 24px;
          font-weight: bold;
        }

        @page {
          margin: 0;
          size: A4 portrait;
        }

        @media print {
          body { 
            background: white; 
            padding: 0; 
            margin: 0;
          }
          .page-container {
            border: 0.2px solid #000;
            height: 297mm;
            width: 210mm;
            page-break-after: always;
            page-break-inside: avoid;
            padding: 8mm 8mm 8mm 10mm;
            margin: 0;
          }
          .page-container:last-child {
            page-break-after: auto;
          }
        }

        .items-table tbody tr:last-child td {
          border-bottom: 0.2px solid #000;
        }
      </style>
    </head>
    <body>
      <div class="print-wrapper">
        ${allPagesHtml}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  }, 500);
};

  return (
    <>
      <style>{`
        .print-btn-container {
          position: sticky;
          top: 0;
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
          padding: 10px 20px;
          background: transparent;
          pointer-events: none;
        }
        .print-btn {
          pointer-events: auto;
          padding: 10px 28px;
          background: #1a1a2e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: Arial, 'Arial Narrow', sans-serif;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .print-btn:hover {
          background: #0f3460;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26,26,46,0.4);
        }
        .quotation-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          position: relative;
        }
        .quotation-container {
          width: 900px;
          margin: auto;
          padding: 8mm 8mm 8mm 10mm;
        }
        .title {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          font-family: 'Arial Narrow', Arial, sans-serif;
          letter-spacing: 0px;
          margin-bottom: 8px;
        }
        .header-table {
          width: 100%;
          border-collapse: collapse;
        }
        .header-table td {
          border: 0.2px solid #000;
          padding: 6px 8px;
          vertical-align: top;
        }
        .company-section {
          width: 55%;
        }
        .to-section {
          width: 41.6%;
        }
        .gg-company-info {
          flex: 1;
          font-family: Arial, sans-serif;
          color: #555;
        }
        .gg-company-registration {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: #333;
          line-height: 1.1;
          margin-bottom: 3px;
        }
        .gg-company-address-line {
          font-size: 11.5px;
          line-height: 1.2;
          color: #555;
          text-align: left;
        }
        .company-name {
          color: #FF0000;
          font-size: 32px;
          font-weight: 400;
          margin-left: 6px;
          font-family: 'Arial Narrow', Arial, sans-serif;
          line-height: 1;
        }
        .logo-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 2px;
        }
        .logo {
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 400;
          flex-shrink: 0;
          align-self: flex-start;
        }
        .logo img {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }
        .to-section {
          font-family: Arial, 'Arial Narrow', sans-serif;
          font-size: 12px;
        }
        .to-section b {
          font-family: 'Arial Narrow', Arial, sans-serif;
        }
        .info-table {
          width: 100%;
          height: 100px;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .info-table td {
          border: 0.2px solid #000;
          padding: 3px 6px;
          height: 28px;
          font-size: 11px;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }
        .info-label {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 12%;
          font-size: 10px;
        }
        .info-label3 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 13.5%;
          font-size: 10px;
        }
        .info-value {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 13%;
          font-size: 10px;
        }
        .info-label1 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 10%;
          font-size: 10px;
        }
        .info-label2 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          width: 10.5%;
          font-size: 10px;
        }
        .info-value1 {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 10%;
          font-size: 10px;
        }
        .info-value2 {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 4%;
          font-size: 10px;
        }
        .info-email {
          text-align: center;
          color: blue;
          font-family: Arial, 'Arial Narrow', sans-serif;
          font-size: 10px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        .items-table th {
          border: 0.2px solid #000;
          padding: 3px 6px;
          text-align: center;
          font-size: 11px;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-weight: 400;
        }
        .items-table td {
          border: 0.2px solid #000;
          padding: 10px 6px;
          font-size: 11px;
          vertical-align: middle;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }
        .items-table td:first-child {
          text-align: center;
        }
        .items-table td:nth-child(2) {
          text-align: left;
        }
        .items-table td:nth-child(3) {
          text-align: center;
        }
        .terms-box {
          margin-top: 6px;
          padding: 6px 10px;
          border: 0.2px solid #000;
          border-radius: 3px;
        }
        .terms-title {
          font-weight: bold;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .terms-list {
          padding-left: 18px;
          margin-top: 2px;
          font-size: 11px;
          line-height: 1.5;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }
        .terms-list li {
          margin-bottom: 1px;
        }

        .note-subject {
          grid-column: 1 / -1;
          border: 0.2px solid #000;
          padding: 10px 10px;
          text-align: left;
        }
        .note-subject-text {
          font-size: 11px;
          font-weight: bold;
          font-family: 'Arial Narrow', Arial, sans-serif;
          letter-spacing: 1px;
        }
        .not-for-sale {
          grid-column: 1 / -1;
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          font-family: 'Arial Narrow', Arial, sans-serif;
          color: #000;
          border: 0.2px solid #000;
          padding: 15px 8px;
          letter-spacing: 1px;
        }
        .footer {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 20px;
        }
        .delivery-details {
          font-size: 10px;
          line-height: 1.6;
          font-family: Arial, 'Arial Narrow', sans-serif;
          flex: 1;
          border: 0.2px solid #000;
          padding: 8px 12px;
          border-radius: 3px;
        }
        .delivery-details .bold {
          font-weight: 600;
        }
        .box-content {
          font-size: 10px;
          line-height: 1.6;
          font-family: Arial, 'Arial Narrow', sans-serif;
          flex: 1;
          border: 0.2px solid #000;
          padding: 8px 12px;
          border-radius: 3px;
        }
        .box-content .bold {
          font-weight: 600;
        }

        .summary-row-tin-pan {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 8px;
        }
        .tin-pan-left {
          display: flex;
          gap: 20px;
        }
        .total-qty-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .total-qty-number {
          font-size: 24px;
          font-weight: bold;
        }
          
        @media print {
          .print-btn-container { display: none !important; }
          .quotation-wrapper { padding: 0; background: white; }
          .quotation-container { 
            padding: 8mm 8mm 8mm 10mm;
          }
        }
      `}</style>

      <div className="print-btn-container">
        <button className="print-btn" onClick={handlePrint}>
          🖨️ Print / PDF
        </button>
      </div>

      <div className="quotation-wrapper" ref={printRef}>
        <div className="quotation-container" style={pageStyle}>
          <div className="title">DELIVERY CHALLAN</div>

          {/* Header: Company on Left, To on Right */}
          <table className="header-table">
            <tr>
              <td className="company-section">
                <div className="company-name">Guru Goutam Infotech Pvt. Ltd.</div>
                <div className="logo-row">
                  <div className="logo">
                    <img
                      src={logo}
                      alt="Guru Goutam Logo"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.textContent = 'GG';
                        }
                      }}
                    />
                  </div>
                  <div className="gg-company-info">
                    <div className="gg-company-registration">
                      <div>CIN: U72200KA2008PTC047679</div>
                      <div>GST: 29AADCG2608Q1Z6</div>
                    </div>
                    <div className="gg-company-address-line">
                      No.8, 2nd Cross, Diagonal Road, 3rd Block, Jayanagar
                    </div>
                    <div className="gg-company-address-line">
                      Bengaluru-560011, Ph: 080-22429955, M: 9449078955
                    </div>
                    <div className="gg-company-address-line">
                      Email: info@gurugoutam.com, Web: gurugoutam.com
                    </div>
                  </div>
                </div>
              </td>
              <td className="to-section">
                <b>To,</b><br />
                <b>{data.toAddress?.name || 'Customer'}</b><br />
                {data.toAddress?.address || 'Address not available'}<br />
                {data.toAddress?.city || ''}<br />
              </td>
            </tr>
          </table>

          {/* Customer Details - 4 columns */}
          <table className="info-table">
            <tr>
              <td className="info-label1">CHALLAN NO.</td>
              <td className="info-value1">{data.challanNo}</td>
              <td className="info-label1">DC DATE</td>
              <td className="info-label1">{data.challanDate}</td>
              <td className="info-label2">CONTACT PERSON</td>
              <td className="info-value">{data.contactPerson}</td>
              <td className="info-label">CONTACT NO.</td>
              <td className="info-value">{data.contactNo}</td>
            </tr>
            <tr>
              <td className="info-label">CUSTOMER CODE</td>
              <td className="info-value">{data.customerCode}</td>
              <td className="info-label">RECEIVER NAME</td>
              <td className="info-value">{data.receiverName}</td>
              <td className="info-label">DELIVERY STAFF</td>
              <td className="info-value">{data.deliveryPersonName}</td>
              <td className="info-label">VEHICLE NO.</td>
              <td className="info-value">{data.vehicleNo}</td>
            </tr>
          </table>

         {/* Items Table - with proper alignment */}
<table className="items-table">
  <thead>
    <tr>
      <th style={{ width: '10%', textAlign: 'center' }}>SL. NO.</th>
      <th style={{ width: '75%', textAlign: 'left' }}>PARTICULARS</th>
      <th style={{ width: '15%', textAlign: 'center' }}>QUANTITY</th>
    </tr>
  </thead>
  <tbody>
    {data.items?.map((item, index) => {
      if (!item.particulars) return null;

      // Split particulars by newline to display with proper formatting
      const lines = item.particulars.split('\n');

      return (
        <tr key={index}>
          <td style={{ 
            textAlign: 'center', 
            verticalAlign: 'top',
            padding: '8px 6px'
          }}>
            {item.slNo || ''}
          </td>
          <td style={{ 
            textAlign: 'left', 
            verticalAlign: 'top',
            padding: '8px 6px'
          }}>
            {/* Show "Product Details:" only for the first item */}
            {index === 0 && (
              <div style={{ marginBottom: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#000'
                }}>
                  Product Details:
                </span>
              </div>
            )}
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} style={{ 
                marginBottom: lineIndex < lines.length - 1 ? '2px' : '0'
              }}>
                <span 
                  dangerouslySetInnerHTML={{ __html: line }}
                  style={{
                    fontSize: lineIndex === 0 ? '12px' : '10px',
                    fontWeight: lineIndex === 0 ? '600' : '400',
                    color: lineIndex === 0 ? '#000' : '#333',
                    display: 'block'
                  }}
                />
              </div>
            ))}
          </td>
          <td style={{ 
            textAlign: 'center', 
            verticalAlign: 'top',
            padding: '8px 6px'
          }}>
            {item.qty || ''}
          </td>
        </tr>
      );
    })}

    {/* Total Quantity Row */}
    <tr>
      <td colSpan="2" style={{ padding: '8px 6px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div>
            <span style={{ marginLeft: '100px', fontWeight: 'bold' }}>TIN No.: </span>{data.tinNo || 'N/A'}
            <span style={{ marginLeft: '100px', fontWeight: 'bold' }}>
              PAN No.:
            </span> {data.panNo || 'N/A'}
          </div>
          <span style={{ fontWeight: 'bold' }}>TOTAL QTY</span>
        </div>
      </td>
      <td style={{ 
        textAlign: 'center', 
        fontWeight: '600',
        padding: '8px 6px'
      }}>
        {totalQuantity}
      </td>
    </tr>
  </tbody>
</table>

          <div className="not-for-sale">
            NOT FOR SALE - RETURNABLE BASIS ONLY
          </div>

          <div className="note-subject">
            <div className="note-subject-text">NOTE: Subject to Bengaluru Juristriction</div>
          </div>
          {/* Footer */}
          <div className="footer">
            <div className="delivery-details">
              <b>Delivery Address</b><br />
              <span className="bold">{data.deliveryAddress || 'Not specified'}.</span>
            </div>

            

            <div className="box-content" style={{ textAlign: 'center' }}>
              Receiver Details & Signature<br />
              <br /><br />
              <span style={{ fontWeight: 600 }}>SD/-</span>
              <br /><br /><br />
              <span style={{ fontWeight: 600, fontSize: '11px' }}>Signature with seal</span>
            </div>

            <div className="box-content" style={{ textAlign: 'center' }}>
              For<br />
              <span style={{ fontWeight: 600, fontSize: '12px' }}>Guru Goutam Infotech Pvt. Ltd.</span>
              <br /><br />
              <span style={{ fontWeight: 600 }}>SD/-</span>
              <br /><br /><br />
              <span style={{ fontWeight: 600, fontSize: '11px' }}>Authorised Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryChallanView;








// import React, { useRef } from 'react';
// import logo from "../logo/logo.png";

// const DeliveryChallanView = ({ open, onClose, dcData }) => {

//   console.log(dcData,"llllllllllkkkkkkkkkkkkkkkk");
  
//   const printRef = useRef();

//   // Map API data to Delivery Challan format
//   const mapDeliveryChallanData = (data) => {
//     if (!data) return null;

//     // Start with header rows
//     const items = [
//       { slNo: 1, particulars: 'Item Description:', qty: '' },
//       { slNo: '', particulars: 'Product Details:', qty: '' }
//     ];

//     // Add items from API response
//     const apiItems = data.items?.map((item, index) => {
//       const product = item.product || {};

//       // Build configuration string from product details
//       const configParts = [];
//       if (product.processor) configParts.push(product.processor);
//       if (product.ram) configParts.push(`${product.ram} RAM`);
//       if (product.storage) configParts.push(product.storage);
//       if (product.display_size) configParts.push(`${product.display_size}" Display`);
//       if (product.os) configParts.push(product.os);
//       if (product.graphics) configParts.push(product.graphics);

//       const config = configParts.join(', ');

//       return {
//         slNo: index + 2,
//         particulars: item.product_name || product.product_name || 'Product',
//         qty: item.quotation_quantity || 1,
//         config: config || product.description || '',
//         stNo: product.st_number || product.serial_number || ''
//       };
//     }) || [];

//     // Combine header rows with API items
//     const allItems = [...items, ...apiItems];

//     // Get customer details
//     const customer = data.customer || {};

//     // Build address
//     const addressParts = [];
//     if (customer.street) addressParts.push(customer.street);
//     if (customer.city) addressParts.push(customer.city);
//     if (customer.state) addressParts.push(customer.state);
//     if (customer.pincode) addressParts.push(customer.pincode);
//     const fullAddress = addressParts.join(', ');

//     // Get contact person
//     const contactPerson = customer.first_name && customer.last_name
//       ? `${customer.first_name} ${customer.last_name}`
//       : customer.first_name || customer.company_name || '';

//     return {
//       challanNo: data.challan_id || data.delivery_challan_id || data.quotation_id || '',
//       challanDate: data.challan_date || data.delivery_date || data.quotation_date ? new Date(data.quotation_date).toLocaleDateString('en-IN') : '',
//       contactPerson: contactPerson,
//       contactNo: customer.phone_number || '',
//       customerCode: customer.customer_id || '',
//       emailId: customer.email || '',
//       paperSize: 'A4',
//       toAddress: {
//         name: customer.company_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer',
//         address: fullAddress || 'Address not available',
//         city: customer.city || '',
//         phone: customer.phone_number || '',
//         email: customer.email || ''
//       },
//       deliveryAddress: data.delivery_address || fullAddress || 'Delivery address not specified',
//       receiverName: data.receiver_name || customer.first_name || '',
//       receiverContact: data.receiver_contact || customer.phone_number || '',
//       items: allItems
//     };
//   };

//   // Use mapped data or fallback to dummy data
//   const data = dcData ? mapDeliveryChallanData(dcData) : {
//     challanNo: 'DC-2026-001',
//     challanDate: '17-06-2026',
//     contactPerson: 'Avinash Kumar',
//     contactNo: '+91 98765 43210',
//     receiverName: 'Vinod Kumar',
//     receiverNo: '+91 98765 43299',
//     customerCode: 'SKL001',
//     emailId: 'avinash@skillcase.in',
//     tinNo: '12345678901',
//     panNo: 'FBBPM1682R',
//     paperSize: 'A4',
//     toAddress: {
//       name: 'Skillcase Solutions',
//       address: '123 Business Park, Electronic City',
//       city: 'Bengaluru - 560100',
//       phone: '+91 98765 43210',
//       email: 'avinash@skillcase.in'
//     },
//     deliveryAddress: '123 Business Park, Electronic City, Bengaluru - 560100',

//     items: [
//       { slNo: 1, particulars: 'Item Description:', qty: '' },
//       { slNo: '', particulars: 'Product Details:', qty: '' },
//       {
//         slNo: 2, particulars: 'Dell Latitude 3420 Laptop', qty: 5,
//         config: 'Intel Core i5 10th Gen Processor, 8GB RAM, 256GB SSD, 14" Display, Windows 11 Pro, Power Adapter & Backpack',
//         stNo: 'S/T No: 8NBVR93 & 9SYQWM93'
//       },
//       {
//         slNo: 3, particulars: 'HP ProBook 450 G8 Laptop', qty: 3,
//         config: 'Intel Core i7 11th Gen Processor, 16GB RAM, 512GB SSD, 15.6" Display, Windows 11 Pro, Power Adapter & Backpack',
//         stNo: 'S/T No: 5HPROB45 & 6HPROB46'
//       },
//       {
//         slNo: 4, particulars: 'Lenovo ThinkPad E14 Gen 3', qty: 4,
//         config: 'AMD Ryzen 5, 8GB RAM, 512GB SSD, 14" FHD Display, Windows 11 Pro',
//         stNo: 'S/T No: LEN001 & LEN002'
//       },
//       {
//         slNo: 5, particulars: 'Acer Aspire 5 Laptop', qty: 6,
//         config: 'Intel Core i5 11th Gen, 8GB RAM, 512GB SSD, 15.6" Display',
//         stNo: 'S/T No: ACE001 & ACE002'
//       },
//       {
//         slNo: 6, particulars: 'Asus VivoBook 15', qty: 4,
//         config: 'Intel Core i3 12th Gen, 8GB RAM, 256GB SSD, Windows 11',
//         stNo: 'S/T No: ASUS001 & ASUS002'
//       },
//       {
//         slNo: 7, particulars: 'Dell OptiPlex 7090 Desktop', qty: 2,
//         config: 'Intel Core i7 11th Gen, 16GB RAM, 512GB SSD, 22" Monitor',
//         stNo: 'S/T No: DOP001 & DOP002'
//       },
//       {
//         slNo: 8, particulars: 'HP EliteDesk 800 G6', qty: 3,
//         config: 'Intel Core i5 10th Gen, 8GB RAM, 256GB SSD, 21.5" Monitor',
//         stNo: 'S/T No: HPE001 & HPE002'
//       },
//       {
//         slNo: 9, particulars: 'Lenovo ThinkCentre M70s', qty: 5,
//         config: 'Intel Core i5, 8GB RAM, 512GB SSD, Keyboard & Mouse',
//         stNo: 'S/T No: LTC001 & LTC002'
//       },
//       {
//         slNo: 10, particulars: 'Acer Veriton Desktop', qty: 2,
//         config: 'Intel Core i3, 8GB RAM, 256GB SSD, 19.5" Monitor',
//         stNo: 'S/T No: AVD001 & AVD002'
//       },
//       {
//         slNo: 11, particulars: 'LG 24" Monitor', qty: 10,
//         config: '24 Inch Full HD IPS Display, HDMI & VGA Ports',
//         stNo: 'S/T No: LGM001 & LGM002'
//       },
//       {
//         slNo: 12, particulars: 'Dell 22" Monitor', qty: 8,
//         config: '22 Inch Full HD LED Display',
//         stNo: 'S/T No: DMON001 & DMON002'
//       },
//       {
//         slNo: 13, particulars: 'HP LaserJet Pro Printer', qty: 2,
//         config: 'Mono Laser Printer with USB Connectivity',
//         stNo: 'S/T No: HPP001 & HPP002'
//       },
//       {
//         slNo: 14, particulars: 'Canon ImageRunner Printer', qty: 1,
//         config: 'Multifunction Printer, Print Scan Copy',
//         stNo: 'S/T No: CAN001'
//       },
//       {
//         slNo: 15, particulars: 'Epson EcoTank L3250', qty: 3,
//         config: 'Ink Tank Printer with Wi-Fi',
//         stNo: 'S/T No: EPS001 & EPS002'
//       },
//       // {
//       //   slNo: 16, particulars: 'APC UPS 600VA', qty: 6,
//       //   config: 'Backup Power Supply for Desktop Systems',
//       //   stNo: 'S/T No: APC001 & APC002'
//       // },
//       // {
//       //   slNo: 17, particulars: 'Zebronics Keyboard', qty: 15,
//       //   config: 'USB Wired Keyboard',
//       //   stNo: 'S/T No: ZKB001 & ZKB002'
//       // },
//       // {
//       //   slNo: 18, particulars: 'Logitech Wireless Mouse', qty: 20,
//       //   config: '2.4GHz Wireless Optical Mouse',
//       //   stNo: 'S/T No: LWM001 & LWM002'
//       // },
//       // {
//       //   slNo: 19, particulars: 'TP-Link Router', qty: 4,
//       //   config: 'Dual Band Wi-Fi Router',
//       //   stNo: 'S/T No: TPL001 & TPL002'
//       // },
//       // {
//       //   slNo: 20, particulars: 'Cisco Switch 24 Port', qty: 2,
//       //   config: 'Managed Gigabit Ethernet Switch',
//       //   stNo: 'S/T No: CSC001 & CSC002'
//       // },
//       // {
//       //   slNo: 21, particulars: 'Seagate 1TB HDD', qty: 10,
//       //   config: 'Internal SATA Hard Disk Drive',
//       //   stNo: 'S/T No: SGT001 & SGT002'
//       // },
//       // {
//       //   slNo: 22, particulars: 'Samsung 500GB SSD', qty: 12,
//       //   config: 'NVMe M.2 SSD Storage',
//       //   stNo: 'S/T No: SAM001 & SAM002'
//       // },
//       // {
//       //   slNo: 23, particulars: 'Kingston 8GB DDR4 RAM', qty: 15,
//       //   config: '3200MHz Desktop Memory',
//       //   stNo: 'S/T No: KNG001 & KNG002'
//       // },
//       // {
//       //   slNo: 24, particulars: 'Crucial 16GB DDR4 RAM', qty: 8,
//       //   config: '3200MHz Desktop Memory',
//       //   stNo: 'S/T No: CRU001 & CRU002'
//       // },
//       // {
//       //   slNo: 25, particulars: 'Intel Core i5 Processor', qty: 5,
//       //   config: '12th Generation Desktop Processor',
//       //   stNo: 'S/T No: INT001 & INT002'
//       // },
//       // {
//       //   slNo: 26, particulars: 'AMD Ryzen 5 Processor', qty: 5,
//       //   config: '5600G Desktop Processor',
//       //   stNo: 'S/T No: AMD001 & AMD002'
//       // },
//       // {
//       //   slNo: 27, particulars: 'Gigabyte Motherboard', qty: 4,
//       //   config: 'Intel H610 Chipset Motherboard',
//       //   stNo: 'S/T No: GIG001 & GIG002'
//       // },
//       // {
//       //   slNo: 28, particulars: 'ASUS Motherboard', qty: 4,
//       //   config: 'AMD B550 Chipset Motherboard',
//       //   stNo: 'S/T No: AMB001 & AMB002'
//       // },
//       // {
//       //   slNo: 29, particulars: 'NVIDIA GTX 1650 Graphics Card', qty: 3,
//       //   config: '4GB GDDR6 Graphics Card',
//       //   stNo: 'S/T No: NV001 & NV002'
//       // },
//       // {
//       //   slNo: 30, particulars: 'HP Docking Station', qty: 4,
//       //   config: 'USB-C Universal Dock',
//       //   stNo: 'S/T No: HPD001 & HPD002'
//       // },
//       // {
//       //   slNo: 31, particulars: 'Dell Backpack', qty: 10,
//       //   config: '15.6 Inch Laptop Carry Bag',
//       //   stNo: 'S/T No: DBP001 & DBP002'
//       // },
//       // {
//       //   slNo: 32, particulars: 'Logitech Webcam', qty: 5,
//       //   config: '1080P HD Webcam with Microphone',
//       //   stNo: 'S/T No: LWC001 & LWC002'
//       // },
//       // {
//       //   slNo: 33, particulars: 'Jabra Headset', qty: 6,
//       //   config: 'USB Wired Noise Cancelling Headset',
//       //   stNo: 'S/T No: JAB001 & JAB002'
//       // },
//       // {
//       //   slNo: 34, particulars: 'Microsoft Office 2021 License', qty: 20,
//       //   config: 'Office Home & Business License',
//       //   stNo: 'S/T No: MOL001 & MOL002'
//       // },
//       // {
//       //   slNo: 35, particulars: 'Windows 11 Pro License', qty: 20,
//       //   config: 'OEM Operating System License',
//       //   stNo: 'S/T No: WIN001 & WIN002'
//       // },
//       // {
//       //   slNo: 36, particulars: 'External HDD 2TB', qty: 5,
//       //   config: 'USB 3.0 Portable Storage',
//       //   stNo: 'S/T No: EHD001 & EHD002'
//       // },
//       // {
//       //   slNo: 37, particulars: 'Projector Epson X05', qty: 2,
//       //   config: '3300 Lumens XGA Projector',
//       //   stNo: 'S/T No: PRO001 & PRO002'
//       // },
//       // {
//       //   slNo: 38, particulars: 'Conference Speakerphone', qty: 2,
//       //   config: 'Bluetooth Meeting Room Speaker',
//       //   stNo: 'S/T No: CSP001 & CSP002'
//       // },
//       // {
//       //   slNo: 39, particulars: 'Fingerprint Attendance Device', qty: 3,
//       //   config: 'Biometric Access & Attendance System',
//       //   stNo: 'S/T No: BIO001 & BIO002'
//       // },
//       // {
//       //   slNo: 40, particulars: 'Network Rack 12U', qty: 1,
//       //   config: 'Wall Mount Network Cabinet',
//       //   stNo: 'S/T No: NRK001'
//       // },
//       // {
//       //   slNo: 41, particulars: 'Patch Panel 24 Port', qty: 2,
//       //   config: 'CAT6 Network Patch Panel',
//       //   stNo: 'S/T No: PPN001 & PPN002'
//       // }
//     ]
//   };

//   // Calculate total quantity
//   const totalQuantity = data.items?.reduce((sum, item) => {
//     const qty = Number(item.qty) || 0;
//     return sum + qty;
//   }, 0) || 0;

//   const getPageStyle = () => {
//     switch (data.paperSize) {
//       case "A3": return { width: "420mm", height: "297mm" };
//       case "A5": return { width: "210mm", height: "148mm" };
//       case "Letter": return { width: "8.5in", height: "11in" };
//       case "Legal": return { width: "8.5in", height: "14in" };
//       case "Custom": return { width: `${data.customWidth || 210}mm`, height: `${data.customHeight || 297}mm` };
//       default: return { width: "210mm", height: "297mm" };
//     }
//   };

//   const pageStyle = getPageStyle();

//   // Generate page HTML with header and footer for each page
//   const generatePageHTML = (itemsHtml, pageNumber, totalPages, showSummary = false) => {
//     const showHeader = pageNumber === 1;

//     return `
//       <div class="page-container">
//         <div class="quotation-content">
//           ${showHeader ? `
//           <div class="title">DELIVERY CHALLAN</div>

//           <!-- Header -->
//           <table class="header-table">
//             <tr>
//               <td class="company-section">
//                 <div class="company-name">Guru Goutam Infotech Pvt. Ltd.</div>
                
//                 <div class="logo-row">
//                   <div class="logo">
//                     <img src="${logo}" alt="Logo" />
//                   </div>
//                   <div class="gg-company-info">
//                     <div class="gg-company-registration">
//                       <div>CIN: U72200KA2008PTC047679</div>
//                       <div>GST: 29AADCG2608Q1Z6</div>
//                     </div>
//                     <div class="gg-company-address-line">
//                       No. 8, 2nd Cross, Diagonal Road, 3rd Block, Jayanagar
//                     </div>
//                     <div class="gg-company-address-line">
//                       Bengaluru-560011, Ph:080-22429955, M:9449078955
//                     </div>
//                     <div class="gg-company-address-line">
//                       Email: info@gurugoutam.com, Web: gurugoutam.com
//                     </div>
//                   </div>
//                 </div>
//               </td>
//               <td class="to-section">
//                 <b>To,</b><br>
//                 <b>${data.toAddress?.name || 'Customer'}</b><br>
//                 ${data.toAddress?.address || 'Address not available'}<br>
//                 ${data.toAddress?.city || ''}<br>
//                 Phone: ${data.toAddress?.phone || 'N/A'}<br>
//                 Email: ${data.toAddress?.email || 'N/A'}
//               </td>
//             </tr>
//           </table>

//           <!-- Customer Details -->
//           <table class="info-table">
//             <tr>
//               <td class="info-label1">CHALLAN NO.</td>
//               <td class="info-value1">${data.challanNo}</td>
//               <td class="info-label1">DC DATE</td>
//               <td class="info-label1">${data.challanDate}</td>
//               <td class="info-label3">CONTACT PERSON</td>
//               <td class="info-value">${data.contactPerson}</td>
//               <td class="info-label">CONTACT NO.</td>
//               <td class="info-value">${data.contactNo}</td>
//             </tr>
//             <tr>
//               <td class="info-label">CUSTOMER CODE</td>
//               <td class="info-value">${data.customerCode}</td>
//                <td class="info-label">RECEIVER NAME</td>
//               <td class="info-value">${data.receiverName}</td>
//                <td class="info-label">RECEIVER NO</td>
//               <td class="info-email" colspan="3">${data.receiverNo}</td>
             

//             </tr>
//           </table>
//           ` : `
//           <!-- Empty space for pages without header to maintain layout -->
//           <div style="height:10px;"></div>
//           `}
          
//           <!-- Items Table -->
//           <table class="items-table">
//             <thead>
//               <tr>
//                 <th style="width:10%;text-align:center;">SL. NO.</th>
//                 <th style="width:75%;text-align:left;">PARTICULARS</th>
//                 <th style="width:15%;text-align:center;">QUANTITY</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${itemsHtml}
//               ${showSummary ? `
//               <!-- Summary rows -->
//               <tr>
//                <td colspan="2" style="padding-right:10px;border:0.2px solid #000;">
//     <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
//         <div>
//             <span style="margin-left:100px; font-weight:bold;">TIN No.: </span>${data.tinNo || 'N/A'}
//             <span style="margin-left:100px; font-weight:bold;">
//                 PAN No.: 
//             </span>${data.panNo || 'N/A'}
//         </div>
//         <span style="font-weight:bold;">TOTAL QTY</span>
//     </div>
// </td>
//                 <td style="text-align:center;font-weight:bold;border:0.2px solid #000;">${totalQuantity}</td>
//               </tr>
//               ` : ''}
//             </tbody>
//           </table>

//           ${showSummary ? `
//           <!-- Terms & Conditions Box -->
         

//             <div class="not-for-sale">
//               NOT FOR SALE - RETURNABLE BASIS ONLY
//             </div>
//  <div class="note-subject">
//               <div class="note-subject-text">NOTE: Subject to Bengaluru Juristriction</div>
//             </div>
//           <!-- Footer -->
//           <div class="footer">
//             <div class="delivery-details">
//               <b>Delivery Address</b><br>
//               <span class="bold">${data.deliveryAddress || 'Not specified'}.</span>
//             </div>

//             <div class="delivery-details">
//               <b>Receiver Details</b><br>
//               <span class="bold">Name:</span> ${data.receiverName || 'Not specified'}<br>
//               <span class="bold">Contact:</span> ${data.receiverNo || 'Not specified'}<br>
//               <span class="bold">Signature:</span> _________________
//             </div>

//             <div class="box-content" style="text-align:center;">
//               For<br>
//               <span style="font-weight:600;font-size:12px;">Guru Goutam Infotech Pvt. Ltd.</span>
//               <br><br>
//               <span style="font-weight:600;">SD/-</span>
//               <br><br><br>
//               <span style="font-weight:600;font-size:11px;">Authorised Signatory</span>
//             </div>
//           </div>
//           ` : ''}
//         </div>
//       </div>
//     `;
//   };

//   const handlePrint = () => {
//     const printContent = printRef.current;
//     if (!printContent) return;

//     const printWindow = window.open('', '_blank', 'width=900,height=600');
//     if (!printWindow) {
//       window.print();
//       return;
//     }

//     // Prepare items data with headers and configs
//     const itemsData = [];
//     let slCounter = 1;

//     data.items?.forEach((item, index) => {
//       if (!item.particulars) return;

//       const isHeader = item.particulars.includes('Item Description:') ||
//         item.particulars.includes('Product Details:') ||
//         (!item.slNo && index < 3);

//       const slNo = isHeader ? '' : (item.slNo || slCounter++);

//       itemsData.push({
//         isHeader,
//         slNo,
//         particulars: item.particulars,
//         qty: item.qty || '',
//         config: item.config || '',
//         stNo: item.stNo || ''
//       });
//     });

//     // Calculate items per page
//     const itemsPerPage = 12;
//     const totalItems = itemsData.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

//     // Generate HTML for each page
//     let allPagesHtml = '';

//     for (let page = 0; page < totalPages; page++) {
//       const start = page * itemsPerPage;
//       const end = Math.min(start + itemsPerPage, totalItems);
//       const pageItems = itemsData.slice(start, end);

//       let itemsHtml = '';
//       pageItems.forEach(item => {
//         let particularsContent = item.particulars;

//         if (item.config) {
//           particularsContent += `<br><span style="font-size:10px;color:#3d3c3c;font-weight:bold;">${item.config}</span>`;
//         }

//         if (item.stNo) {
//           particularsContent += `<br><span style="font-size:10px;color:#070707;font-weight:bold;margin-top:4px;display:inline-block;">${item.stNo}</span>`;
//         }

//         itemsHtml += `
//           <tr class="${item.isHeader ? 'sub-header' : ''}">
//             <td style="text-align:center;padding:4px 8px;">${item.slNo}</td>
//             <td style="text-align:left;padding:4px 8px;${item.isHeader ? 'font-weight:600;' : ''}">
//               ${particularsContent}
//             </td>
//             <td style="text-align:center;padding:4px 8px;">${item.qty}</td>
//           </tr>
//         `;
//       });

//       const showSummary = (page === totalPages - 1);
//       allPagesHtml += generatePageHTML(itemsHtml, page + 1, totalPages, showSummary);
//     }

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>DELIVERY CHALLAN</title>
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           body {
//             background: white;
//             padding: 0;
//             margin: 0;
//           }

//           .print-wrapper {
//             width: 100%;
//             max-width: 100%;
//             padding: 0;
//             margin: 0;
//           }

//           .page-container {
//             width: 210mm;
//             height: 297mm;
//             border: 0.2px solid #000;
//             padding: 8mm 8mm 8mm 10mm;
//             margin: 0 auto;
//             page-break-after: always;
//             page-break-inside: avoid;
//             display: flex;
//             flex-direction: column;
//             position: relative;
//             overflow: hidden;
//             box-sizing: border-box;
//           }

//           .page-container:last-child {
//             page-break-after: auto;
//           }

//           .quotation-content {
//             flex: 1;
//             display: flex;
//             flex-direction: column;
//             height: 100%;
//             width: 100%;
//           }

//           .title {
//             text-align: center;
//             font-size: 14px;
//             font-weight: 400;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             letter-spacing: 0px;
//             margin-bottom: 8px;
//           }

//           .header-table {
//             width: 100%;
//             border-collapse: collapse;
//           }

//           .header-table td {
//             border: 0.2px solid #000;
//             padding: 6px 8px;
//             vertical-align: top;
//           }

//           .company-section {
//             width: 55%;
//           }

//           .to-section {
//             width: 45%;
//           }

//           .company-name {
//             color: #FF0000;
//             font-size: 32px;
//             font-weight: 400;
//             margin-left: 6px;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//           }

//           .logo-row {
//             display: flex;
//             align-items: flex-start;
//             gap: 8px;
//             margin-top: 2px;
//           }

//           .logo {
//             width: 70px;
//             height: 70px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             font-weight: 400;
//             flex-shrink: 0;
//             align-self: flex-start;
//           }

//           .logo img {
//             width: 80px;
//             height: 80px;
//             object-fit: contain;
//           }

//           .gg-company-info {
//             flex: 1;
//             font-family: Arial, sans-serif;
//             color: #555;
//             align-self: flex-start;
//           }

//           .gg-company-registration {
//             text-align: center;
//             font-size: 11px;
//             font-weight: 700;
//             color: #333;
//             line-height: 1.1;
//             margin-bottom: 3px;
//           }

//           .gg-company-address-line {
//             font-size: 11.5px;
//             line-height: 1.2;
//             color: #555;
//             text-align: left;
//           }

//           .to-section {
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             font-size: 12px;
//           }

//           .to-section b {
//             font-family: 'Arial Narrow', Arial, sans-serif;
//           }

//           .info-table {
//             width: 100%;
//             height: 100px;
//             border-collapse: collapse;
//             table-layout: fixed;
//           }

//           .info-table td {
//             border: 0.2px solid #000;
//             padding: 3px 6px;
//             height: 28px;
//             font-size: 11px;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           .info-label {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             width: 12%;
//             font-size: 10px;
//           }

//           .info-label3 {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             width: 15%;
//             font-size: 10px;
//           }

//           .info-value {
//             font-weight: 500;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             width: 13%;
//             font-size: 10px;
//           }

//           .info-label1 {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             width: 9%;
//             font-size: 10px;
//           }

//           .info-label2 {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             width: 10.5%;
//             font-size: 10px;
//           }

//           .info-value1 {
//             font-weight: 500;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             width: 10%;
//             font-size: 10px;
//           }

//           .info-value2 {
//             font-weight: 500;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             width: 8%;
//             font-size: 10px;
//           }

//           .info-email {
//             text-align: center;
//             color: blue;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             font-size: 10px;
//           }

//           .items-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 16px;
//             flex: 1;
//           }

//           .items-table th {
//             border: 0.2px solid #000;
//             padding: 3px 6px;
//             text-align: center;
//             font-size: 11px;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             font-weight: 400;
//           }

//           .items-table td {
//             border: 0.2px solid #000;
//             padding: 3px 6px;
//             font-size: 11px;
//             vertical-align: middle;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           .items-table .sub-header td {
//             font-weight: 600;
//           }

//           .items-table td:first-child {
//             text-align: center;
//           }

//           .items-table td:nth-child(2) {
//             text-align: left;
//           }

//           .items-table td:nth-child(3) {
//             text-align: center;
//           }

//           .summary-label {
//             text-align: center;
//             font-size: 10px;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             font-weight: 400;
//           }

//           .total-row {
//             font-size: 18px;
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//           }

//           .terms-box {
//             margin-top: 6px;
//             padding: 6px 10px;
//             border: 0.2px solid #000;
//             border-radius: 3px;
//             flex-shrink: 0;
//           }

//           .terms-title {
//             font-weight: bold;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             font-size: 14px;
//             margin-bottom: 2px;
//           }

//           .terms-list {
//             padding-left: 18px;
//             margin-top: 2px;
//             font-size: 11px;
//             line-height: 1.5;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           .terms-list li {
//             margin-bottom: 1px;
//           }

//          .note-subject {
//           grid-column: 1 / -1;
//           border: 0.2px solid #000;
//           padding: 10px 10px;
//           text-align: left;
//         }
//         .note-subject-text {
//           font-size: 11px;
//           font-weight: bold;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           letter-spacing: 1px;
//         }
//                 .not-for-sale {
//           grid-column: 1 / -1;
//           text-align: center;
//           font-size: 16px;
//           font-weight: 400;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           color: #000;
//           border: 0.2px solid #000;
//           padding: 15px 8px;
//           letter-spacing: 1px;
//         }

//           .footer {
//             margin-top: 20px;
//             display: flex;
//             justify-content: space-between;
//             align-items: stretch;
//             gap: 20px;
//             flex-shrink: 0;
//           }

//           .delivery-details {
//             font-size: 10px;
//             line-height: 1.6;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             flex: 1;
//             border: 0.2px solid #000;
//             padding: 8px 12px;
//             border-radius: 3px;
//           }

//           .delivery-details .bold {
//             font-weight: 600;
//           }

//           .box-content {
//             font-size: 10px;
//             line-height: 1.6;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             flex: 1;
//             border: 0.2px solid #000;
//             padding: 8px 12px;
//             border-radius: 3px;
//           }

//           .box-content .bold {
//             font-weight: 600;
//           }

//            .summary-row-tin-pan {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 6px 8px;
//         }
//         .tin-pan-left {
//           display: flex;
//           gap: 20px;
//         }
//         .total-qty-right {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }
//         .total-qty-number {
//           font-size: 24px;
//           font-weight: bold;
//         }

//           @page {
//             margin: 0;
//             size: A4 portrait;
//           }

//           @media print {
//             body { 
//               background: white; 
//               padding: 0; 
//               margin: 0;
//             }
//             .page-container {
//               border: 0.2px solid #000;
//               height: 297mm;
//               width: 210mm;
//               page-break-after: always;
//               page-break-inside: avoid;
//               padding: 8mm 8mm 8mm 10mm;
//               margin: 0;
//             }
//             .page-container:last-child {
//               page-break-after: auto;
//             }
//           }

//           .items-table tbody tr:last-child td {
//             border-bottom: 0.2px solid #000;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="print-wrapper">
//           ${allPagesHtml}
//         </div>
//       </body>
//       </html>
//     `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.onafterprint = () => {
//         printWindow.close();
//       };
//     }, 500);
//   };

//   return (
//     <>
//       <style>{`
//         .print-btn-container {
//           position: sticky;
//           top: 0;
//           z-index: 9999;
//           display: flex;
//           justify-content: flex-end;
//           padding: 10px 20px;
//           background: transparent;
//           pointer-events: none;
//         }
//         .print-btn {
//           pointer-events: auto;
//           padding: 10px 28px;
//           background: #1a1a2e;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .print-btn:hover {
//           background: #0f3460;
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(26,26,46,0.4);
//         }
//         .quotation-wrapper {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 20px;
//           position: relative;
//         }
//         .quotation-container {
//           width: 900px;
//           margin: auto;
//           padding: 8mm 8mm 8mm 10mm;
//         }
//         .title {
//           text-align: center;
//           font-size: 14px;
//           font-weight: 400;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           letter-spacing: 0px;
//           margin-bottom: 8px;
//         }
//         .header-table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         .header-table td {
//           border: 0.2px solid #000;
//           padding: 6px 8px;
//           vertical-align: top;
//         }
//         .company-section {
//           width: 55%;
//         }
//         .to-section {
//           width: 45%;
//         }
//         .gg-company-info {
//           flex: 1;
//           font-family: Arial, sans-serif;
//           color: #555;
//         }
//         .gg-company-registration {
//           text-align: center;
//           font-size: 11px;
//           font-weight: 700;
//           color: #333;
//           line-height: 1.1;
//           margin-bottom: 3px;
//         }
//         .gg-company-address-line {
//           font-size: 11.5px;
//           line-height: 1.2;
//           color: #555;
//           text-align: left;
//         }
//         .company-name {
//           color: #FF0000;
//           font-size: 32px;
//           font-weight: 400;
//           margin-left: 6px;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           line-height: 1;
//         }
//         .logo-row {
//           display: flex;
//           align-items: flex-start;
//           gap: 8px;
//           margin-top: 2px;
//         }
//         .logo {
//           width: 70px;
//           height: 70px;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           font-weight: 400;
//           flex-shrink: 0;
//           align-self: flex-start;
//         }
//         .logo img {
//           width: 80px;
//           height: 80px;
//           object-fit: contain;
//         }
//         .to-section {
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           font-size: 12px;
//         }
//         .to-section b {
//           font-family: 'Arial Narrow', Arial, sans-serif;
//         }
//         .info-table {
//           width: 100%;
//           height: 100px;
//           border-collapse: collapse;
//           table-layout: fixed;
//         }
//         .info-table td {
//           border: 0.2px solid #000;
//           padding: 3px 6px;
//           height: 28px;
//           font-size: 11px;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//         }
//         .info-label {
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           width: 12%;
//           font-size: 10px;
//         }
//                     .info-label3 {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             width: 13.5%;
//             font-size: 10px;
//           }
//         .info-value {
//           font-weight: 500;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           width: 13%;
//           font-size: 10px;
//         }
//         .info-label1 {
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           width: 10%;
//           font-size: 10px;
//         }
//         .info-label2 {
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           width: 10.5%;
//           font-size: 10px;
//         }
//         .info-value1 {
//           font-weight: 500;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           width: 10%;
//           font-size: 10px;
//         }
//         .info-value2 {
//           font-weight: 500;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           width: 4%;
//           font-size: 10px;
//         }
//         .info-email {
//           text-align: center;
//           color: blue;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           font-size: 10px;
//         }
//         .items-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 16px;
//         }
//         .items-table th {
//           border: 0.2px solid #000;
//           padding: 3px 6px;
//           text-align: center;
//           font-size: 11px;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           font-weight: 400;
//         }
//         .items-table td {
//           border: 0.2px solid #000;
//           padding: 10px 6px;
//           font-size: 11px;
//           vertical-align: middle;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//         }
//         .items-table .sub-header td {
//           font-weight: 600;
//         }
//         .items-table td:first-child {
//           text-align: center;
//         }
//         .items-table td:nth-child(2) {
//           text-align: left;
//         }
//         .items-table td:nth-child(3) {
//           text-align: center;
//         }
//         .terms-box {
//           margin-top: 6px;
//           padding: 6px 10px;
//           border: 0.2px solid #000;
//           border-radius: 3px;
//         }
//         .terms-title {
//           font-weight: bold;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           font-size: 14px;
//           margin-bottom: 4px;
//         }
//         .terms-list {
//           padding-left: 18px;
//           margin-top: 2px;
//           font-size: 11px;
//           line-height: 1.5;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//         }
//         .terms-list li {
//           margin-bottom: 1px;
//         }

//         .note-subject {
//           grid-column: 1 / -1;
//           border: 0.2px solid #000;
//           padding: 10px 10px;
//           text-align: left;
//         }
//         .note-subject-text {
//           font-size: 11px;
//           font-weight: bold;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           letter-spacing: 1px;
//         }
//         .not-for-sale {
//           grid-column: 1 / -1;
//           text-align: center;
//           font-size: 16px;
//           font-weight: 400;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           color: #000;
//           border: 0.2px solid #000;
//           padding: 15px 8px;
//           letter-spacing: 1px;
//         }
//         .footer {
//           margin-top: 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: stretch;
//           gap: 20px;
//         }
//         .delivery-details {
//           font-size: 10px;
//           line-height: 1.6;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           flex: 1;
//           border: 0.2px solid #000;
//           padding: 8px 12px;
//           border-radius: 3px;
//         }
//         .delivery-details .bold {
//           font-weight: 600;
//         }
//         .box-content {
//           font-size: 10px;
//           line-height: 1.6;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           flex: 1;
//           border: 0.2px solid #000;
//           padding: 8px 12px;
//           border-radius: 3px;
//         }
//         .box-content .bold {
//           font-weight: 600;
//         }

//          .summary-row-tin-pan {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 6px 8px;
//         }
//         .tin-pan-left {
//           display: flex;
//           gap: 20px;
//         }
//         .total-qty-right {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }
//         .total-qty-number {
//           font-size: 24px;
//           font-weight: bold;
//         }
          
//         @media print {
//           .print-btn-container { display: none !important; }
//           .quotation-wrapper { padding: 0; background: white; }
//           .quotation-container { 
//             padding: 8mm 8mm 8mm 10mm;
//           }
//         }
//       `}</style>

//       <div className="print-btn-container">
//         <button className="print-btn" onClick={handlePrint}>
//           🖨️ Print / PDF
//         </button>
//       </div>

//       <div className="quotation-wrapper" ref={printRef}>
//         <div className="quotation-container" style={pageStyle}>
//           <div className="title">DELIVERY CHALLAN</div>

//           {/* Header: Company on Left, To on Right */}
//           <table className="header-table">
//             <tr>
//               <td className="company-section">
//                 <div className="company-name">Guru Goutam Infotech Pvt. Ltd.</div>
//                 <div className="logo-row">
//                   <div className="logo">
//                     <img
//                       src={logo}
//                       alt="Guru Goutam Logo"
//                       onError={(e) => {
//                         e.currentTarget.style.display = 'none';
//                         const parent = e.currentTarget.parentElement;
//                         if (parent) {
//                           parent.textContent = 'GG';
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="gg-company-info">
//                     <div className="gg-company-registration">
//                       <div>CIN: U72200KA2008PTC047679</div>
//                       <div>GST: 29AADCG2608Q1Z6</div>
//                     </div>
//                     <div className="gg-company-address-line">
//                       No.8, 2nd Cross, Diagonal Road, 3rd Block, Jayanagar
//                     </div>
//                     <div className="gg-company-address-line">
//                       Bengaluru-560011, Ph: 080-22429955, M: 9449078955
//                     </div>
//                     <div className="gg-company-address-line">
//                       Email: info@gurugoutam.com, Web: gurugoutam.com
//                     </div>
//                   </div>
//                 </div>
//               </td>
//               <td className="to-section">
//                 <b>To,</b><br />
//                 <b>{data.toAddress?.name || 'Customer'}</b><br />
//                 {data.toAddress?.address || 'Address not available'}<br />
//                 {data.toAddress?.city || ''}<br />

//               </td>
//             </tr>
//           </table>

//           {/* Customer Details - 4 columns */}
//           <table className="info-table">
//             <tr>
//               <td className="info-label1">CHALLAN NO.</td>
//               <td className="info-value1">{data.challanNo}</td>
//               <td className="info-label1">DC DATE</td>
//               <td className="info-label1">{data.challanDate}</td>
//               <td className="info-label2">CONTACT PERSON</td>
//               <td className="info-value">{data.contactPerson}</td>
//               <td className="info-label">CONTACT NO.</td>
//               <td className="info-value">{data.contactNo}</td>
//             </tr>
//             <tr>
//               <td className="info-label">CUSTOMER CODE</td>
//               <td className="info-value">{data.customerCode}</td>


//               <td className="info-label">RECEIVER NAME</td>
//               <td className="info-value">{data.receiverName}</td>
//               <td className="info-label">RECEIVER NO</td>
//               <td className="info-email" colspan="3">{data.receiverNo}</td>

//             </tr>
//           </table>

//           {/* Items Table - with proper alignment */}
//           <table className="items-table">
//             <thead>
//               <tr>
//                 <th style={{ width: '10%', textAlign: 'center' }}>SL. NO.</th>
//                 <th style={{ width: '75%', textAlign: 'left' }}>PARTICULARS</th>
//                 <th style={{ width: '15%', textAlign: 'center' }}>QUANTITY</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items?.map((item, index) => {
//                 if (!item.particulars) return null;

//                 const isHeader =
//                   item.particulars.includes('Item Description:') ||
//                   item.particulars.includes('Product Details:') ||
//                   (!item.slNo && index < 3);

//                 return (
//                   <tr key={index} className={isHeader ? 'sub-header' : ''}>
//                     <td style={{ textAlign: 'center' }}>
//                       {isHeader ? '' : item.slNo || ''}
//                     </td>
//                     <td style={{ textAlign: 'left', ...(isHeader ? { fontWeight: 600 } : {}) }}>
//                       {item.particulars}
//                       {item.config && (
//                         <>
//                           <br />
//                           <span style={{ fontSize: '10px', color: '#3d3c3c', fontWeight: 400 }}>
//                             {item.config}
//                           </span>
//                         </>
//                       )}
//                       {item.stNo && (
//                         <>
//                           <br />
//                           <span style={{ fontSize: '10px', color: '#070707', fontWeight: "bold", marginTop: '4px', display: 'inline-block' }}>
//                             {item.stNo}
//                           </span>
//                         </>
//                       )}
//                     </td>
//                     <td style={{ textAlign: 'center' }}>{item.qty || ''}</td>
//                   </tr>
//                 );
//               })}

//               {/* Total Quantity Row */}

//               <tr>

//                 <td colSpan="2">
//                   <div
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       width: '100%',
//                     }}
//                   >
//                     <div>
//                       <span style={{ marginLeft: '100px', fontWeight: 'bold' }}>TIN No.: </span>{data.tinNo || 'N/A'}
//                       <span style={{ marginLeft: '100px', fontWeight: 'bold' }}>
//                         PAN No.:
//                       </span> {data.panNo || 'N/A'}
//                     </div>

//                     <span style={{ fontWeight: 'bold' }}>TOTAL QTY</span>
//                   </div>
//                 </td>
//                 <td style={{ textAlign: 'center', fontWeight: '600' }}>
//                   {totalQuantity}
//                 </td>
//               </tr>


//             </tbody>
//           </table>



//           <div className="not-for-sale">
//             NOT FOR SALE - RETURNABLE BASIS ONLY
//           </div>

//           <div className="note-subject">
//             <div className="note-subject-text">NOTE: Subject to Bengaluru Juristriction</div>
//           </div>
//           {/* Footer */}
//           <div className="footer">
//             <div className="delivery-details">
//               <b>Delivery Address</b><br />
//               <span className="bold">{data.deliveryAddress || 'Not specified'}.</span>
//             </div>

//             <div className="delivery-details">
//               <b>Receiver Details</b><br />
//               <span className="bold">Name:</span> {data.receiverName || 'Not specified'}<br />
//               <span className="bold">Contact:</span> {data.receiverNo || 'Not specified'}<br />
//               <span className="bold">Signature:</span> _________________
//             </div>

//             <div className="box-content" style={{ textAlign: 'center' }}>
//               For<br />
//               <span style={{ fontWeight: 600, fontSize: '12px' }}>Guru Goutam Infotech Pvt. Ltd.</span>
//               <br /><br />
//               <span style={{ fontWeight: 600 }}>SD/-</span>
//               <br /><br /><br />
//               <span style={{ fontWeight: 600, fontSize: '11px' }}>Authorised Signatory</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DeliveryChallanView;