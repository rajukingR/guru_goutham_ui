import React, { useRef } from 'react';
import logo from "../logo/logo.png";

const QuotationPreview = ({ open, onClose, quotationData }) => {


const paymentType = quotationData.payment_type === "Prepaid";

  const printRef = useRef();

  // Map API data to match the expected structure
  const mapQuotationData = (data) => {
    if (!data) return null;

    // Start with header rows (these are static and always shown)
    const items = [
      { slNo: 1, particulars: 'Rental Charges For Per Month:', qty: '', rate: '', amount: '' },
      { slNo: '', particulars: 'Laptop with Following Configuration:', qty: '', rate: '', amount: '' }
    ];

    // Add items from API response - using the data structure you provided
    const apiItems = data.items?.map((item, index) => {
      const product = item.product || {};
      
      // Build configuration string from product details
      const configParts = [];
      if (product.processor) configParts.push(product.processor);
      if (product.ram) configParts.push(`${product.ram} RAM`);
      if (product.storage) configParts.push(product.storage);
      if (product.display_size) configParts.push(`${product.display_size}" Display`);
      if (product.os) configParts.push(product.os);
      if (product.graphics) configParts.push(product.graphics);
      
      const config = configParts.join(', ');
      
      return {
        slNo: index + 1, // Start from 2 (since header rows use 1 and empty)
        particulars: item.product_name || product.product_name || 'Product',
        qty: item.quotation_quantity || 1,
        rate: paymentType
  ? parseFloat(item.rent_price_per_month || 0)
  : parseFloat(item.purchase_price || 0),

amount:
  (paymentType
    ? parseFloat(item.rent_price_per_month || 0)
    : parseFloat(item.purchase_price || 0)
  ) * (item.quotation_quantity || 1),
        config: config || product.description || '',
        stNo: product.st_number || product.serial_number || ''
      };
    }) || [];

    // Combine header rows with API items
    const allItems = [...items, ...apiItems];

    // Get customer details
    const customer = data.customer || {};
    
    // Build address
    const addressParts = [];
    if (customer.address.street) addressParts.push(customer.address.street);
    if (customer.address.city) addressParts.push(customer.address.city);
    if (customer.address.state) addressParts.push(customer.address.state);
        if (customer.address.pincode) addressParts.push(customer.address.pincode);

    const fullAddress = addressParts.join(', ');
    
    // Get contact person
    const contactPerson = customer.first_name && customer.last_name 
      ? `${customer.first_name} ${customer.last_name}` 
      : customer.first_name || customer.company_name || '';

    return {
      quoteNo: data.quotation_id || '',
      quoteDate: data.quotation_date ? new Date(data.quotation_date).toLocaleDateString('en-IN') : '',
      contactPerson: contactPerson,
      contactNo: customer.phone_number || '',
      customerCode: customer.customer_id || '',
      minimumDuration: data.rental_duration ? `${data.rental_duration} Month${data.rental_duration > 1 ? 's' : ''}` : '1 Month',
      emailId: customer.email || '',
      paperSize: 'A4',
      toAddress: {
        name: customer.company_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer',
        address: fullAddress || 'Address not available',
        city: customer.city || '',
        phone: customer.phone_number || '',
        email: customer.email || ''
      },
      items: allItems
    };
  };

  // Use mapped data or fallback to dummy data
  const data = quotationData ? mapQuotationData(quotationData) : {
    quoteNo: '3187',
    quoteDate: '17-06-2026',
    contactPerson: 'Avinash Kumar',
    contactNo: '+91 98765 43210',
    customerCode: 'SKL001',
    minimumDuration: '1 Month',
    emailId: 'avinash@skillcase.in',
    paperSize: 'A4',
    toAddress: {
      name: 'Skillcase Solutions',
      address: '123 Business Park, Electronic City',
      phone: '+91 98765 43210',
      email: 'avinash@skillcase.in'
    },
    items: [
      { slNo: 1, particulars: 'Rental Charges For Per Month:', qty: '', rate: '', amount: '' },
      { slNo: '', particulars: 'Laptop with Following Configuration:', qty: '', rate: '', amount: '' }
      // No dummy product data here - it will come from API
    ]
  };

  // The rest of your component remains exactly the same...
  // [All the other functions - numberToWords, handlePrint, return JSX - remain unchanged]

  // Number to words conversion function
  const numberToWords = (num) => {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    return convert(Math.round(num)) + ' Only';
  };

  // Calculate totals
  const subtotal = data.items?.reduce((sum, item) => {
    const amount = Number(item.amount) || 0;
    return sum + amount;
  }, 0) || 0;

  const gst = subtotal * 0.09; // CGST 9%
  const sgst = subtotal * 0.09; // SGST 9%
  const total = subtotal + gst + sgst;
  const amountInWords = numberToWords(total);

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
    // Only show header on first page
    const showHeader = pageNumber === 1;

    return `
      <div class="page-container">
        <div class="quotation-content">
          ${showHeader ? `
          <div class="title">RENTAL QUOTATION</div>

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
                <b>${data.toAddress?.name || 'Skillcase Solutions'}</b><br>
                ${data.toAddress?.address}.<br>

              </td>
            </tr>
          </table>

          <!-- Customer Details -->
          <table class="info-table">
            <tr>
              <td class="info-label1">QUOTE NO.</td>
              <td class="info-value1">${data.quoteNo}</td>
              <td class="info-label1">QUOTE DATE</td>
              <td class="info-label1">${data.quoteDate}</td>
              <td class="info-label3">CONTACT PERSON</td>
              <td class="info-value">${data.contactPerson}</td>
              <td class="info-label">CONTACT NO.</td>
              <td class="info-value">${data.contactNo}</td>
            </tr>
            <tr>
              <td class="info-label">CUSTOMER CODE</td>
              <td class="info-value">${data.customerCode}</td>
              <td class="info-label">MINIMUM DURATION</td>
              <td class="info-value">${data.minimumDuration}</td>
              <td class="info-label">E-MAIL ID</td>
              <td class="info-email" colspan="3">${data.emailId}</td>
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
                <th style="width:60%;text-align:left;">PARTICULARS</th>
                <th style="width:7%;text-align:center;">QTY</th>
                <th style="width:13%;text-align:right;padding-right:10px;">RATE</th>
                <th style="width:13%;text-align:right;padding-right:10px;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              ${showSummary ? `
              <!-- Summary rows -->
              <tr>
                <td colspan="3" rowspan="4" style="border-right:0.1px solid #888787;"></td>
                <td class="summary-label" style="border-left:0.1px solid #888787;">Sub Total</td>
                <td style="text-align:right;padding-right:10px;">${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td class="summary-label" style="border-left:0.1px solid #888787;">CGST@9%</td>
                <td style="text-align:right;padding-right:10px;">${gst.toLocaleString()}</td>
              </tr>
              <tr>
                <td class="summary-label" style="border-left:0.1px solid #888787;">SGST@9%</td>
                <td style="text-align:right;padding-right:10px;">${sgst.toLocaleString()}</td>
              </tr>
              <tr>
                <td class="total-row" style="border-left:1px solid #000;">TOTAL</td>
                <td style="text-align:right;padding-right:10px;font-size:20px;font-weight:bold;">${total.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="4" class="rupees-section">
                  Rupees : ${amountInWords}
                </td>
                <td style="border-left:0.1px solid #888787;"></td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          ${showSummary ? `
          <!-- Terms & Conditions Box -->
          <div class="terms-box">
            <div class="terms-title">Terms & Conditions :</div>
            <ol class="terms-list">
              <li>The client is required to provide photocopies of the ROC/TIN, premises rental deed, and address proofs of all Directors/Proprietors/Partners</li>
              <li>Postdated cheques covering the rental period must be submitted in advance.</li>
              <li>A security deposit cheque corresponding to the value of the rented systems is mandatory.</li>
              <li>Delivery of the rental systems will occur within two (2) business days of receiving the Purchase Order (PO) letter.</li>
              <li>The rental amount must be paid in advance in every month.</li>
              <li>The quoted rates include the installation and maintenance of hardware at the customer's site.</li>
              <li>Software-related services are not included in the rental agreement and will not be provided.</li>
              <li>The rental provider will not be held liable for such damages.</li>
              <li>If any system needs to be relocated from the originally specified premises, prior written notice must be given to the rental provider.</li>
              <li>All legal matters are subject to the jurisdiction of Bengaluru only.</li>
              <li>Transportation Charges will be additional (Depends on distance).</li>
            </ol>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="bank-details">
  <b>Company's Bank Details</b><br><br>

  <div><b>Bank Name :</b> HDFC BANK LTD.,</div>
  <div><b>A/c No. :</b> 50200066767843</div>
  <div><b>Branch & IFS Code :</b> JAYANAGAR-3RD BLOCK & HDFC0000261</div>
</div>
           <div class="box-content" style="text-align:center;">
  For
  <span
    style="
      color: rgb(0 0 0 / 87%);
      font-size: 12px;
      font-weight: 600;
    "
  >
    Guru Goutam Infotech Pvt. Ltd.
  </span>

  <br><br>

  <span style="font-weight:400;">SD/-</span>

  <br><br>

  <span style="font-weight:400;">Authorised Signatory</span>
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

    // Prepare items data with headers and configs
    const itemsData = [];
    let slCounter = 1;

    data.items?.forEach((item, index) => {
      if (!item.particulars) return;

      const isHeader = item.particulars.includes('Rental Charges') ||
        item.particulars.includes('Laptop with Following') ||
        (!item.slNo && index < 3);

      const slNo = isHeader ? '' : (item.slNo || slCounter++);

      itemsData.push({
        isHeader,
        slNo,
        particulars: item.particulars,
        qty: item.qty || '',
        rate: item.rate ? '' + Number(item.rate).toLocaleString() : '',
        amount: item.amount ? '' + Number(item.amount).toLocaleString() : '',
        config: item.config || '',
        stNo: item.stNo || ''
      });
    });

    // Calculate items per page
    const itemsPerPage = 11;
    const totalItems = itemsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    // Generate HTML for each page
    let allPagesHtml = '';

    for (let page = 0; page < totalPages; page++) {
      const start = page * itemsPerPage;
      const end = Math.min(start + itemsPerPage, totalItems);
      const pageItems = itemsData.slice(start, end);

      let itemsHtml = '';
      pageItems.forEach(item => {
        // Build the particulars cell content with config and S/T No
        let particularsContent = item.particulars;

        if (item.config) {
          particularsContent += `<br><span style="font-size:10px;color:#3d3c3c;font-weight:bold;">${item.config}</span>`;
        }

        if (item.stNo) {
          particularsContent += `<br><span style="font-size:10px;color:#070707;font-weight:bold;margin-top:4px;display:inline-block;">${item.stNo}</span>`;
        }

        itemsHtml += `
          <tr class="${item.isHeader ? 'sub-header' : ''}">
            <td style="text-align:center;padding:4px 8px;">${item.slNo}</td>
            <td style="text-align:left;padding:4px 8px;${item.isHeader ? 'font-weight:600;' : ''}">
              ${particularsContent}
            </td>
            <td style="text-align:center;padding:4px 8px;">${item.qty}</td>
            <td style="text-align:right;padding:4px 10px 4px 8px;">${item.rate}</td>
            <td style="text-align:right;padding:4px 10px 4px 8px;">${item.amount}</td>
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
        <title>Rental Quotation-TESTING</title>
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
            background: #fff;
            border: 0.1px solid #888787;
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
            font-weight: 600;
            font-family: 'Arial Narrow', Arial, sans-serif;
            letter-spacing: 0px;
            margin-bottom: 8px;
          }

          .header-table {
            width: 100%;
            border-collapse: collapse;
          }

          .header-table td {
            border: 0.1px solid #888787;
            padding: 6px 8px;
            vertical-align: top;
          }

          .company-section {
            width: 55%;
          }

          .to-section {
            width: 42.2%;
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
            border: 0.1px solid #888787;
            padding: 3px 6px;
            height: 28px;
            font-size: 11px;
            font-family: Arial, 'Arial Narrow', sans-serif;
          }

          .info-label {
            font-weight: 400;
            text-align: center;
            font-family: 'Arial Narrow', Arial, sans-serif;
            background: #f8f9fa;
            width: 12%;
            font-size: 10px;
          }

          .info-label3 {
            font-weight: 400;
            text-align: center;
            font-family: 'Arial Narrow', Arial, sans-serif;
            background: #f8f9fa;
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
            background: #f8f9fa;
            width: 9%;
            font-size: 10px;
          }

          .info-label2 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          background: #f8f9fa;
          width: 10.5%;
          font-size: 10px;
        }

          .info-value1 {
            font-weight: 500;
            font-family: Arial, 'Arial Narrow', sans-serif;
            width: 9%;
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
            border: 0.1px solid #888787;
            padding: 6px 6px;
            text-align: center;
            font-size: 11px;
            background: #f7f7f7;
            font-family: 'Arial Narrow', Arial, sans-serif;
            font-weight: 400;
          }

          .items-table td {
            border: 0.1px solid #888787;
            padding: 3px 6px;
            font-size: 11px;
            vertical-align: middle;
            font-family: Arial, 'Arial Narrow', sans-serif;
          }

          .items-table .sub-header td {
            background: #f5f5f5;
            font-weight: 600;
          }

          .items-table td:first-child {
            text-align: center;
          }

          .items-table td:nth-child(2) {
            text-align: center;
          }

          .items-table td:nth-child(3) {
            text-align: right;
          }

          .items-table td:nth-child(4),
          .items-table td:nth-child(5) {
            text-align: right;
            padding-right: 8px;
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

          .rupees-section {
            height: 35px;
            font-weight: 400;
            font-family: Arial, 'Arial Narrow', sans-serif;
            font-size: 11px;
          }

          .terms-box {
            margin-top: 6px;
            padding: 6px 10px;
            border: 0.1px solid #888787;
            border-radius: 3px;
            background: #f9f9f9;
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

          .footer {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            gap: 20px;
            flex-shrink: 0;
          }


          .bank-details {
  font-size: 14px;
}

          /* Box Styles - Common */
          .bank-details-box,
          .signature-box {
            border: 1.5px solid #000;
            padding: 8px 14px;
            border-radius: 4px;
            background: #fafafa;
            flex: 1;
          }

          .bank-details-box {
            min-width: 200px;
            max-width: 45%;
          }

          .signature-box {
            min-width: 180px;
            max-width: 45%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .box-title {
            font-weight: 600;
            font-size: 11px;
            text-align: center;
            border-bottom: 1px dashed #888;
            padding-bottom: 4px;
            margin-bottom: 6px;
            font-family: 'Arial Narrow', Arial, sans-serif;
          }

          .box-content {
            font-size: 10px;
            line-height: 1.6;
            font-family: Arial, 'Arial Narrow', sans-serif;
          }

          .box-content .bold {
            font-weight: 600;
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
              border: 0.1px solid #888787;
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
            border-bottom: 0.1px solid #888787;
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
          font-weight: 600;
          font-family: 'Arial Narrow', Arial, sans-serif;
          letter-spacing: 0px;
          margin-bottom: 8px;
        }
        .header-table {
          width: 100%;
          border-collapse: collapse;
        }
        .header-table td {
          border: 0.1px solid #888787;
          padding: 6px 8px;
          vertical-align: top;
        }
        .company-section {
          width: 55%;
        }
        .to-section {
          width: 42.2%;
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
          border: 0.1px solid #888787;
          padding: 3px 6px;
          height: 28px;
          font-size: 11px;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }
        .info-label {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          background: #f8f9fa;
          width: 12%;
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
          background: #f8f9fa;
          width: 10%;
          font-size: 10px;
        }

                .info-label2 {
          font-weight: 400;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          background: #f8f9fa;
          width: 10.5%;
          font-size: 10px;
        }
        .info-value1 {
          font-weight: 500;
          font-family: Arial, 'Arial Narrow', sans-serif;
          width: 9%;
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
          border: 0.1px solid #888787;
          padding: 6px 6px;
          text-align: center;
          font-size: 11px;
          background: #f7f7f7;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-weight: 400;
        }
        .items-table td {
          border: 0.1px solid #888787;
          padding: 10px 6px;
          font-size: 11px;
          vertical-align: middle;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }
        .items-table .sub-header td {
          background: #f5f5f5;
          font-weight: 600;
        }
        
        .items-table td:first-child {
          text-align: center;
        }
        .items-table td:nth-child(2) {
          text-align: center;
        }

        
        .items-table td:nth-child(3) {
          text-align: right;
        }
        .items-table td:nth-child(4),
        .items-table td:nth-child(5) {
          text-align: right;
          padding-right: 8px !important;
        }
        
        .amount-cell {
          padding-right: 8px !important;
        }
        .summary-label {
          text-align: center;
          font-size: 10px;
          font-family: 'Arial Narrow', Arial, sans-serif;
          font-weight: 400;
        }
        .total-row {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
        }
        .rupees-section {
          height: 35px;
          font-weight: 400;
          font-family: Arial, 'Arial Narrow', sans-serif;
          font-size: 11px;
        }
        .terms-box {
          margin-top: 6px;
          padding: 6px 10px;
          border: 0.1px solid #888787;
          border-radius: 3px;
          background: #f9f9f9;
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
        .footer {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 20px;
        }

        /* Box Styles - Common */
        .bank-details-box,
        .signature-box {
          border: 1.5px solid #000;
          padding: 8px 14px;
          border-radius: 4px;
          background: #fafafa;
          flex: 1;
        }

        .bank-details {
  font-size: 14px;
}

        .bank-details-box {
          min-width: 200px;
          max-width: 45%;
        }

        .signature-box {
          min-width: 180px;
          max-width: 45%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .box-title {
          font-weight: 600;
          font-size: 11px;
          text-align: center;
          border-bottom: 1px dashed #888;
          padding-bottom: 4px;
          margin-bottom: 6px;
          font-family: 'Arial Narrow', Arial, sans-serif;
        }

        .box-content {
          font-size: 10px;
          line-height: 1.6;
          font-family: Arial, 'Arial Narrow', sans-serif;
        }

        .box-content .bold {
          font-weight: 600;
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
          <div className="title">RENTAL QUOTATION</div>

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
                <b>{data.toAddress?.name || 'Skillcase Solutions'}</b><br />
                {data.toAddress?.address}.<br />

              </td>
            </tr>
          </table>

          {/* Customer Details - 4 columns */}
          <table className="info-table">
            <tr>
              <td className="info-label1">QUOTE NO.</td>
              <td className="info-value1">{data.quoteNo}</td>
              <td className="info-label1">QUOTE DATE</td>
              <td className="info-label1">{data.quoteDate}</td>
              <td className="info-label2">CONTACT PERSON</td>
              <td className="info-value">{data.contactPerson}</td>
              <td className="info-label">CONTACT NO.</td>
              <td className="info-value">{data.contactNo}</td>
            </tr>
            <tr>
              <td className="info-label">CUSTOMER CODE</td>
              <td className="info-value">{data.customerCode}</td>
              <td className="info-label">MINIMUM DURATION</td>
              <td className="info-value">{data.minimumDuration}</td>
              <td className="info-label">E-MAIL ID</td>
              <td className="info-email" colSpan="3">{data.emailId}</td>
            </tr>
          </table>

          {/* Items Table - with proper alignment */}
          <table className="items-table">
            <thead>
              <tr>
                <th style={{ width: '10%', textAlign: 'center' }}>SL. NO.</th>
                <th style={{ width: '60%', textAlign: 'left' }}>PARTICULARS</th>
                <th style={{ width: '7%', textAlign: 'center' }}>QTY</th>
                <th style={{ width: '13%', textAlign: 'right', paddingRight: '10px' }}>RATE</th>
                <th style={{ width: '13%', textAlign: 'right', paddingRight: '10px' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.map((item, index) => {
                if (!item.particulars) return null;

                const isHeader =
                  item.particulars.includes('Rental Charges') ||
                  item.particulars.includes('Laptop with Following') ||
                  (!item.slNo && index < 3);

                return (
                  <tr key={index} className={isHeader ? 'sub-header' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      {isHeader ? '' : item.slNo || ''}
                    </td>

                    <td
                      style={{
                        textAlign: 'left',
                        ...(isHeader ? { fontWeight: 600 } : {}),
                      }}
                    >
                      {item.particulars}

                      {item.config && (
                        <>
                          <br />
                          <span
                            style={{
                              fontSize: '10px',
                              color: '#3d3c3c',
                              fontWeight: 400,
                            }}
                          >
                            {item.config}
                          </span>
                        </>
                      )}

                      {item.stNo && (
                        <>
                          <br />
                          <span
                            style={{
                              fontSize: '10px',
                              color: '#070707',
                              fontWeight: "bold",
                              marginTop: '4px',
                              display: 'inline-block',
                            }}
                          >
                            {item.stNo}
                          </span>
                        </>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>{item.qty || ''}</td>

                    <td className="amount-cell">
                      {item.rate
                        ? `${Number(item.rate).toLocaleString('en-IN')}`
                        : ''}
                    </td>

                    <td className="amount-cell">
                      {item.amount
                        ? `${Number(item.amount).toLocaleString('en-IN')}`
                        : ''}
                    </td>
                  </tr>
                );
              })}

              {/* Summary rows */}
              <tr>
                <td colSpan="3" rowSpan="4"></td>
                <td className="summary-label">Sub Total</td>
                <td className="amount-cell">
                  {subtotal.toLocaleString('en-IN')}
                </td>
              </tr>

              <tr>
                <td className="summary-label">CGST @ 9%</td>
                <td style={{ textAlign: 'right' }}>
                  {gst.toLocaleString('en-IN')}
                </td>
              </tr>

              <tr>
                <td className="summary-label">SGST @ 9%</td>
                <td style={{ textAlign: 'right' }}>
                  {sgst.toLocaleString('en-IN')}
                </td>
              </tr>

              <tr>
                <td className="total-row">TOTAL</td>
                <td
                  className="amount-cell"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {total.toLocaleString('en-IN')}
                </td>
              </tr>

              <tr>
                <td colSpan="4" className="rupees-section">
                  <strong>Rupees :</strong> {amountInWords}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Terms & Conditions Box */}
          <div className="terms-box">
            <div className="terms-title">Terms & Conditions :</div>
            <ol className="terms-list">
              <li>The client is required to provide photocopies of the ROC/TIN, premises rental deed, and address proofs of all Directors/Proprietors/Partners</li>
              <li>Postdated cheques covering the rental period must be submitted in advance.</li>
              <li>A security deposit cheque corresponding to the value of the rented systems is mandatory.</li>
              <li>Delivery of the rental systems will occur within two (2) business days of receiving the Purchase Order (PO) letter.</li>
              <li>The rental amount must be paid in advance in every month.</li>
              <li>The quoted rates include the installation and maintenance of hardware at the customer's site.</li>
              <li>Software-related services are not included in the rental agreement and will not be provided.</li>
              <li>The rental provider will not be held liable for such damages.</li>
              <li>If any system needs to be relocated from the originally specified premises, prior written notice must be given to the rental provider.</li>
              <li>All legal matters are subject to the jurisdiction of Bengaluru only.</li>
              <li>Transportation Charges will be additional (Depends on distance).</li>
            </ol>
          </div>

          {/* Footer */}
          <div className="footer">
           <div className="bank-details">
  <b>Company's Bank Details</b> <br/> <br/>

  <div><b>Bank Name :</b> HDFC BANK LTD.,</div>
  <div><b>A/c No. :</b> 50200066767843</div>
  <div><b>Branch & IFS Code :</b> JAYANAGAR-3RD BLOCK & HDFC0000261</div>
</div>
           <div className="box-content" style={{ textAlign: 'center' }}>
  For{" "}
  <span
    style={{
      color: 'rgb(0 0 0 / 87%)',
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    Guru Goutam Infotech Pvt. Ltd.
  </span>

  <br /><br />

  <span style={{ fontWeight: 600 }}>SD/-</span>

  <br /><br />

  <span style={{ fontWeight: 600 }}>Authorised Signatory</span>
</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationPreview;








// import React, { useRef } from 'react';
// import logo from "../logo/logo.png";

// const QuotationPreview = ({ quotation }) => {
//   const printRef = useRef();

//   // Dummy data with many items including configurations
//   const defaultQuotation = {
//     quoteNo: '3187',
//     quoteDate: '17-06-2026',
//     contactPerson: 'Avinash Kumar',
//     contactNo: '+91 98765 43210',
//     customerCode: 'SKL001',
//     minimumDuration: '1 Month',
//     emailId: 'avinash@skillcase.in',
//     paperSize: 'A4',
//     toAddress: {
//       name: 'Skillcase Solutions',
//       address: '123 Business Park, Electronic City',
//       city: 'Bengaluru - 560100',
//       phone: '+91 98765 43210',
//       email: 'avinash@skillcase.in'
//     },
//     items: [
//       // Header rows
//       { slNo: 1, particulars: 'Rental Charges For Per Month:', qty: '', rate: '', amount: '' },
//       { slNo: '', particulars: 'Laptop with Following Configuration:', qty: '', rate: '', amount: '' },

//       // Laptops with configurations - S/T No is now combined in the same item
//       {
//         slNo: 2, particulars: 'Dell Latitude 3420 Laptop', qty: 5, rate: 6500, amount: 32500,
//         config: 'Intel Core i5 10th Gen Processor, 8GB RAM, 256GB SSD, 14" Display, Windows 11 Pro, Power Adapter & Backpack',
//         stNo: 'S/T No: 8NBVR93 & 9SYQWM93'
//       },

//       {
//         slNo: 3, particulars: 'HP ProBook 450 G8 Laptop', qty: 3, rate: 12000, amount: 36000,
//         config: 'Intel Core i7 11th Gen Processor, 16GB RAM, 512GB SSD, 15.6" Display, Windows 11 Pro, Power Adapter & Backpack',
//         stNo: 'S/T No: 5HPROB45 & 6HPROB46'
//       },

//       // {
//       //   slNo: 4, particulars: 'Lenovo ThinkPad E14 Laptop', qty: 4, rate: 7000, amount: 28000,
//       //   config: 'Intel Core i5 11th Gen Processor, 8GB RAM, 512GB SSD, 14" Display, Windows 11 Pro, Power Adapter & Backpack',
//       //   stNo: 'S/T No: 7LENOVO14 & 8LENOVO15'
//       // },

//       // {
//       //   slNo: 5, particulars: 'Dell OptiPlex 7090 Desktop', qty: 6, rate: 5500, amount: 33000,
//       //   config: 'Intel Core i5 10th Gen Processor, 8GB RAM, 256GB SSD, Windows 11 Pro, Keyboard & Mouse',
//       //   stNo: 'S/T No: 9DELLOP7 & 10DELLOP8'
//       // },

//       // {
//       //   slNo: 6, particulars: 'HP EliteDesk 800 G6 Desktop', qty: 2, rate: 8500, amount: 17000,
//       //   config: 'Intel Core i7 10th Gen Processor, 16GB RAM, 512GB SSD, Windows 11 Pro, Keyboard & Mouse',
//       //   stNo: 'S/T No: 11HPELIT & 12HPELIT2'
//       // },

//       // {
//       //   slNo: 7, particulars: 'Acer Aspire 5 Laptop', qty: 3, rate: 6000, amount: 18000,
//       //   config: 'Intel Core i5 11th Gen Processor, 8GB RAM, 512GB SSD, 15.6" Display, Windows 11 Home, Power Adapter & Backpack',
//       //   stNo: 'S/T No: 13ACERAS5 & 14ACERAS6'
//       // },

//       // {
//       //   slNo: 8, particulars: 'MacBook Air M1 Laptop', qty: 2, rate: 15000, amount: 30000,
//       //   config: 'Apple M1 Chip, 8GB RAM, 256GB SSD, 13.3" Retina Display, macOS, Power Adapter & Backpack',
//       //   stNo: 'S/T No: 15MACBAIR & 16MACBAIR2'
//       // },

//       // {
//       //   slNo: 9, particulars: 'MacBook Pro 14 M2 Laptop', qty: 1, rate: 22000, amount: 22000,
//       //   config: 'Apple M2 Chip, 16GB RAM, 512GB SSD, 14.2" Liquid Retina Display, macOS, Power Adapter & Backpack',
//       //   stNo: 'S/T No: 17MACPRO14 & 18MACPRO15'
//       // },

//       // {
//       //   slNo: 10, particulars: 'ASUS ZenBook 14 Laptop', qty: 3, rate: 11000, amount: 33000,
//       //   config: 'Intel Core i7 12th Gen Processor, 16GB RAM, 512GB SSD, 14" OLED Display, Windows 11 Pro, Power Adapter & Backpack',
//       //   stNo: 'S/T No: 19ASUSZEN & 20ASUSZEN2'
//       // },

//       // {
//       //   slNo: 11, particulars: 'MSI Gaming Laptop', qty: 1, rate: 25000, amount: 25000,
//       //   config: 'Intel Core i9 13th Gen Processor, 32GB RAM, 1TB SSD, 17.3" 4K Display, Windows 11 Pro, Power Adapter & Backpack',
//       //   stNo: 'S/T No: 21MSIGAME & 22MSIGAME2'
//       // },

//       // // Monitors - some with S/T No
//       // {
//       //   slNo: 12, particulars: 'Dell Monitor 24 Inch Full HD', qty: 8, rate: 1200, amount: 9600,
//       //   config: '1920x1080 Resolution, IPS Panel, HDMI & VGA Ports, VESA Mount Compatible',
//       //   stNo: 'S/T No: DELL24M01 & DELL24M02'
//       // },
//       // {
//       //   slNo: 13, particulars: 'HP Monitor 22 Inch Full HD', qty: 5, rate: 1000, amount: 5000,
//       //   config: '1920x1080 Resolution, IPS Panel, HDMI & VGA Ports',
//       //   stNo: 'S/T No: HP22M01 & HP22M02'
//       // },
//       // {
//       //   slNo: 14, particulars: 'Samsung Monitor 27 Inch 4K', qty: 3, rate: 2500, amount: 7500,
//       //   config: '3840x2160 Resolution, IPS Panel, HDMI & DisplayPort, HDR Support'
//       // },
//       // {
//       //   slNo: 15, particulars: 'LG Monitor 32 Inch UltraWide', qty: 2, rate: 3500, amount: 7000,
//       //   config: '3440x1440 Resolution, IPS Panel, HDMI & DisplayPort, USB-C'
//       // },
//       // {
//       //   slNo: 16, particulars: 'Acer Monitor 21 Inch HD', qty: 6, rate: 800, amount: 4800,
//       //   config: '1920x1080 Resolution, TN Panel, HDMI & VGA Ports'
//       // },

//       // // Projectors & Screens
//       // {
//       //   slNo: 17, particulars: 'Projector - Epson EB-X41', qty: 2, rate: 4500, amount: 9000,
//       //   config: '3600 Lumens, XGA Resolution, HDMI & VGA Ports, Screen Size Up to 300"'
//       // },
//       // {
//       //   slNo: 18, particulars: 'Projector - BenQ MH530', qty: 1, rate: 5500, amount: 5500,
//       //   config: '3500 Lumens, Full HD 1080p, HDMI & VGA Ports, Screen Size Up to 300"'
//       // },
//       // {
//       //   slNo: 19, particulars: 'Portable Screen - 100 Inch', qty: 2, rate: 1500, amount: 3000,
//       //   config: '4:3 Aspect Ratio, Tripod Stand Included, Carry Bag Included'
//       // },
//       // {
//       //   slNo: 20, particulars: 'Portable Screen - 120 Inch', qty: 1, rate: 2000, amount: 2000,
//       //   config: '16:9 Aspect Ratio, Tripod Stand Included, Carry Bag Included'
//       // },

//       // // Networking
//       // {
//       //   slNo: 21, particulars: 'WiFi Router - TP-Link AC1200', qty: 4, rate: 800, amount: 3200,
//       //   config: 'Dual Band, 1200Mbps, 4 Ports, 2 Antennas'
//       // },
//       // {
//       //   slNo: 22, particulars: 'WiFi Router - Netgear Nighthawk', qty: 2, rate: 1500, amount: 3000,
//       //   config: 'Dual Band, 1900Mbps, 4 Ports, 3 Antennas'
//       // },
//       // {
//       //   slNo: 23, particulars: 'Network Switch - 24 Port', qty: 2, rate: 1200, amount: 2400,
//       //   config: '10/100/1000 Mbps, 24 Ports, Rack Mountable'
//       // },
//       // {
//       //   slNo: 24, particulars: 'Network Switch - 48 Port', qty: 1, rate: 2500, amount: 2500,
//       //   config: '10/100/1000 Mbps, 48 Ports, Rack Mountable'
//       // },
//       // {
//       //   slNo: 25, particulars: 'WiFi Extender - TP-Link', qty: 3, rate: 500, amount: 1500,
//       //   config: '300Mbps, Wall Plug, WPS Support'
//       // },

//       // // Additional Items
//       // {
//       //   slNo: 26, particulars: 'Additional Item 1', qty: 3, rate: 5500, amount: 16500,
//       //   config: 'Premium Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 27, particulars: 'Additional Item 2', qty: 2, rate: 8500, amount: 17000,
//       //   config: 'Premium Quality, 2 Year Warranty'
//       // },
//       // {
//       //   slNo: 28, particulars: 'Additional Item 3', qty: 5, rate: 1200, amount: 6000,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 29, particulars: 'Additional Item 4', qty: 4, rate: 1500, amount: 6000,
//       //   config: 'Premium Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 30, particulars: 'Additional Item 5', qty: 2, rate: 2500, amount: 5000,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 31, particulars: 'Additional Item 6', qty: 10, rate: 800, amount: 8000,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 32, particulars: 'Additional Item 7', qty: 3, rate: 4500, amount: 13500,
//       //   config: 'Premium Quality, 2 Year Warranty'
//       // },
//       // {
//       //   slNo: 33, particulars: 'Additional Item 8', qty: 2, rate: 1800, amount: 3600,
//       //   config: 'Standard Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 34, particulars: 'Additional Item 9', qty: 4, rate: 3500, amount: 14000,
//       //   config: 'Premium Quality, 2 Year Warranty'
//       // },
//       // {
//       //   slNo: 35, particulars: 'Additional Item 10', qty: 3, rate: 1200, amount: 3600,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 36, particulars: 'Additional Item 11', qty: 5, rate: 900, amount: 4500,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 37, particulars: 'Additional Item 12', qty: 4, rate: 700, amount: 2800,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 38, particulars: 'Additional Item 13', qty: 2, rate: 2500, amount: 5000,
//       //   config: 'Premium Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 39, particulars: 'Additional Item 14', qty: 10, rate: 400, amount: 4000,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//       // {
//       //   slNo: 40, particulars: 'Additional Item 15', qty: 6, rate: 3000, amount: 18000,
//       //   config: 'Premium Quality, 2 Year Warranty'
//       // },
//       // {
//       //   slNo: 41, particulars: 'Additional Item 16', qty: 3, rate: 2200, amount: 6600,
//       //   config: 'Premium Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 42, particulars: 'Additional Item 17', qty: 8, rate: 1500, amount: 12000,
//       //   config: 'Standard Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 43, particulars: 'Additional Item 18', qty: 4, rate: 1800, amount: 7200,
//       //   config: 'Premium Quality, 1 Year Warranty'
//       // },
//       // {
//       //   slNo: 44, particulars: 'Additional Item 19', qty: 2, rate: 3200, amount: 6400,
//       //   config: 'Premium Quality, 2 Year Warranty'
//       // },
//       // {
//       //   slNo: 45, particulars: 'Additional Item 20', qty: 6, rate: 1100, amount: 6600,
//       //   config: 'Standard Quality, 6 Months Warranty'
//       // },
//     ]
//   };

//   const data = quotation || defaultQuotation;

//   // Number to words conversion function
//   const numberToWords = (num) => {
//     if (num === 0) return 'Zero';

//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//     const convert = (n) => {
//       if (n < 20) return ones[n];
//       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//       if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
//       if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
//       if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
//       return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
//     };

//     return convert(Math.round(num)) + ' Only';
//   };

//   // Calculate totals
//   const subtotal = data.items?.reduce((sum, item) => {
//     const amount = Number(item.amount) || 0;
//     return sum + amount;
//   }, 0) || 0;

//   const gst = subtotal * 0.18;
//   const sgst = subtotal * 0.18;
//   const total = subtotal + gst + sgst;
//   const amountInWords = numberToWords(total);

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
//     // Only show header on first page
//     const showHeader = pageNumber === 1;

//     return `
//       <div class="page-container">
//         <div class="quotation-content">
//           ${showHeader ? `
//           <div class="title">RENTAL QUOTATION</div>

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
//                 <b>${data.toAddress?.name || 'Skillcase Solutions'}</b><br>
//                 ${data.toAddress?.address || '123 Business Park, Electronic City'}<br>
//                 ${data.toAddress?.city || 'Bengaluru - 560100'}<br>
//                 Phone: ${data.toAddress?.phone || '+91 98765 43210'}<br>
//                 Email: ${data.toAddress?.email || 'avinash@skillcase.in'}
//               </td>
//             </tr>
//           </table>

//           <!-- Customer Details -->
//           <table class="info-table">
//             <tr>
//               <td class="info-label1">QUOTE NO.</td>
//               <td class="info-value1">${data.quoteNo}</td>
//               <td class="info-label1">QUOTE DATE</td>
//               <td class="info-label1">${data.quoteDate}</td>
//               <td class="info-label3">CONTACT PERSON</td>
//               <td class="info-value">${data.contactPerson}</td>
//               <td class="info-label">CONTACT NO.</td>
//               <td class="info-value">${data.contactNo}</td>
//             </tr>
//             <tr>
//               <td class="info-label">CUSTOMER CODE</td>
//               <td class="info-value">${data.customerCode}</td>
//               <td class="info-label">MINIMUM DURATION</td>
//               <td class="info-value">${data.minimumDuration}</td>
//               <td class="info-label">E-MAIL ID</td>
//               <td class="info-email" colspan="3">${data.emailId}</td>
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
//                 <th style="width:60%;text-align:left;">PARTICULARS</th>
//                 <th style="width:7%;text-align:center;">QTY</th>
//                 <th style="width:13%;text-align:right;padding-right:10px;">RATE</th>
//                 <th style="width:13%;text-align:right;padding-right:10px;">AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${itemsHtml}
//               ${showSummary ? `
//               <!-- Summary rows -->
//               <tr>
//                 <td colspan="3" rowspan="4" style="border-right:0.1px solid #888787;"></td>
//                 <td class="summary-label" style="border-left:0.1px solid #888787;">Sub Total</td>
//                 <td style="text-align:right;padding-right:10px;">${subtotal.toLocaleString()}</td>
//               </tr>
//               <tr>
//                 <td class="summary-label" style="border-left:0.1px solid #888787;">CGST@18%</td>
//                 <td style="text-align:right;padding-right:10px;">${gst.toLocaleString()}</td>
//               </tr>
//               <tr>
//                 <td class="summary-label" style="border-left:0.1px solid #888787;">SGST@18%</td>
//                 <td style="text-align:right;padding-right:10px;">${sgst.toLocaleString()}</td>
//               </tr>
//               <tr>
//                 <td class="total-row" style="border-left:0.1px solid #888787;">TOTAL</td>
//                 <td style="text-align:right;padding-right:10px;font-size:20px;font-weight:bold;">${total.toLocaleString()}</td>
//               </tr>
//               <tr>
//                 <td colspan="4" class="rupees-section">
//                   Rupees : ${amountInWords}
//                 </td>
//                 <td style="border-left:0.1px solid #888787;"></td>
//               </tr>
//               ` : ''}
//             </tbody>
//           </table>

//           ${showSummary ? `
//           <!-- Terms & Conditions Box -->
//           <div class="terms-box">
//             <div class="terms-title">Terms & Conditions :</div>
//             <ol class="terms-list">
//               <li>The client is required to provide photocopies of the ROC/TIN, premises rental deed, and address proofs of all Directors/Proprietors/Partners</li>
//               <li>Postdated cheques covering the rental period must be submitted in advance.</li>
//               <li>A security deposit cheque corresponding to the value of the rented systems is mandatory.</li>
//               <li>Delivery of the rental systems will occur within two (2) business days of receiving the Purchase Order (PO) letter.</li>
//               <li>The rental amount must be paid in advance in every month.</li>
//               <li>The quoted rates include the installation and maintenance of hardware at the customer's site.</li>
//               <li>Software-related services are not included in the rental agreement and will not be provided.</li>
//               <li>The rental provider will not be held liable for such damages.</li>
//               <li>If any system needs to be relocated from the originally specified premises, prior written notice must be given to the rental provider.</li>
//               <li>All legal matters are subject to the jurisdiction of Bengaluru only.</li>
//               <li>Transportation Charges will be additional (Depends on distance).</li>
//             </ol>
//           </div>

//           <!-- Footer -->
//           <div class="footer">
//             <div class="bank-details">
//               <b>Company's Bank Details</b><br>
//               <span class="bold">Bank Name :</span> HDFC BANK LTD.,<br>
//               <span class="bold">A/c No. :</span> 50200066767843<br>
//               <span class="bold">Branch & IFS Code :</span> JAYANAGAR-3RD BLOCK & HDFC0000261
//             </div>
//            <div class="box-content" style="text-align:center;">
//   For Guru Goutam Infotech Pvt. Ltd.<br><br>
//   <span style="font-weight:600;">SD/-</span><br><br>
//   <span style="font-weight:600;">Authorised Signatory</span>
// </div>
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

//       const isHeader = item.particulars.includes('Rental Charges') ||
//         item.particulars.includes('Laptop with Following') ||
//         (!item.slNo && index < 3);

//       const slNo = isHeader ? '' : (item.slNo || slCounter++);

//       itemsData.push({
//         isHeader,
//         slNo,
//         particulars: item.particulars,
//         qty: item.qty || '',
//         rate: item.rate ? '' + Number(item.rate).toLocaleString() : '',
//         amount: item.amount ? '' + Number(item.amount).toLocaleString() : '',
//         config: item.config || '',
//         stNo: item.stNo || ''
//       });
//     });

//     // Calculate items per page
//     const itemsPerPage = 11;
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
//         // Build the particulars cell content with config and S/T No
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
//             <td style="text-align:right;padding:4px 10px 4px 8px;">${item.rate}</td>
//             <td style="text-align:right;padding:4px 10px 4px 8px;">${item.amount}</td>
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
//         <title>Rental Quotation-TESTING</title>
//        <style>
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
//             background: #fff;
//             border: 0.1px solid #888787;
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
//             border: 0.1px solid #888787;
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
//             border: 0.1px solid #888787;
//             padding: 3px 6px;
//             height: 28px;
//             font-size: 11px;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           .info-label {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             background: #f8f9fa;
//             width: 12%;
//             font-size: 10px;
//           }

//           .info-label3 {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             background: #f8f9fa;
//             width: 13.5%;
//             font-size: 10px;
//           }

//           .info-value {
//             font-weight: 500;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             width: 13%;
//             font-size: 10px;
//           }

//                     .info-label1 {
//             font-weight: 400;
//             text-align: center;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             background: #f8f9fa;
//             width: 9%;
//             font-size: 10px;
//           }

//           .info-label2 {
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           background: #f8f9fa;
//           width: 10.5%;
//           font-size: 10px;
//         }

//           .info-value1 {
//             font-weight: 500;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             width: 6%;
//             font-size: 10px;
//           }

//                     .info-value2 {
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
//             border: 0.1px solid #888787;
//             padding: 3px 6px;
//             text-align: center;
//             font-size: 11px;
//             background: #f7f7f7;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//             font-weight: 400;
//           }

//           .items-table td {
//             border: 0.1px solid #888787;
//             padding: 3px 6px;
//             font-size: 11px;
//             vertical-align: middle;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           .items-table .sub-header td {
//             background: #f5f5f5;
//             font-weight: 600;
//           }

//           .items-table td:first-child {
//             text-align: center;
//           }

//           .items-table td:nth-child(2) {
//             text-align: center;
//           }

//           .items-table td:nth-child(3) {
//             text-align: right;
//           }

//           .items-table td:nth-child(4),
//           .items-table td:nth-child(5) {
//             text-align: right;
//             padding-right: 8px;
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

//           .rupees-section {
//             height: 35px;
//             font-weight: 400;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//             font-size: 11px;
//           }

//           .terms-box {
//             margin-top: 6px;
//             padding: 6px 10px;
//             border: 0.1px solid #888787;
//             border-radius: 3px;
//             background: #f9f9f9;
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

//           .footer {
//             margin-top: 20px;
//             display: flex;
//             justify-content: space-between;
//             align-items: stretch;
//             gap: 20px;
//             flex-shrink: 0;
//           }

//           /* Box Styles - Common */
//           .bank-details-box,
//           .signature-box {
//             border: 1.5px solid #000;
//             padding: 8px 14px;
//             border-radius: 4px;
//             background: #fafafa;
//             flex: 1;
//           }

//           .bank-details-box {
//             min-width: 200px;
//             max-width: 45%;
//           }

//           .signature-box {
//             min-width: 180px;
//             max-width: 45%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .box-title {
//             font-weight: 600;
//             font-size: 11px;
//             text-align: center;
//             border-bottom: 1px dashed #888;
//             padding-bottom: 4px;
//             margin-bottom: 6px;
//             font-family: 'Arial Narrow', Arial, sans-serif;
//           }

//           .box-content {
//             font-size: 10px;
//             line-height: 1.6;
//             font-family: Arial, 'Arial Narrow', sans-serif;
//           }

//           .box-content .bold {
//             font-weight: 600;
//           }

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
//               border: 0.1px solid #888787;
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
//             border-bottom: 0.1px solid #888787;
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
//           border: 0.1px solid #888787;
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
//           border: 0.1px solid #888787;
//           padding: 3px 6px;
//           height: 28px;
//           font-size: 11px;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//         }
//         .info-label {
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           background: #f8f9fa;
//           width: 12%;
//           font-size: 10px;
//         }
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
//           background: #f8f9fa;
//           width: 10%;
//           font-size: 10px;
//         }

//                 .info-label2 {
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           background: #f8f9fa;
//           width: 10.5%;
//           font-size: 10px;
//         }
//         .info-value1 {
//           font-weight: 500;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           width: 6%;
//           font-size: 10px;
//         }

//                 .info-value2 {
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
//           border: 0.1px solid #888787;
//           padding: 3px 6px;
//           text-align: center;
//           font-size: 11px;
//           background: #f7f7f7;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           font-weight: 400;
//         }
//         .items-table td {
//           border: 0.1px solid #888787;
//           padding: 3px 6px;
//           font-size: 11px;
//           vertical-align: middle;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//         }
//         .items-table .sub-header td {
//           background: #f5f5f5;
//           font-weight: 600;
//         }
        
//         .items-table td:first-child {
//           text-align: center;
//         }
//         .items-table td:nth-child(2) {
//           text-align: center;
//         }

        
//         .items-table td:nth-child(3) {
//           text-align: right;
//         }
//         .items-table td:nth-child(4),
//         .items-table td:nth-child(5) {
//           text-align: right;
//           padding-right: 8px !important;
//         }
        
//         .amount-cell {
//           padding-right: 8px !important;
//         }
//         .summary-label {
//           text-align: center;
//           font-size: 10px;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//           font-weight: 400;
//         }
//         .total-row {
//           font-size: 18px;
//           font-weight: 400;
//           text-align: center;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//         }
//         .rupees-section {
//           height: 35px;
//           font-weight: 400;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//           font-size: 11px;
//         }
//         .terms-box {
//           margin-top: 6px;
//           padding: 6px 10px;
//           border: 0.1px solid #888787;
//           border-radius: 3px;
//           background: #f9f9f9;
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
//         .footer {
//           margin-top: 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: stretch;
//           gap: 20px;
//         }

//         /* Box Styles - Common */
//         .bank-details-box,
//         .signature-box {
//           border: 1.5px solid #000;
//           padding: 8px 14px;
//           border-radius: 4px;
//           background: #fafafa;
//           flex: 1;
//         }

//         .bank-details-box {
//           min-width: 200px;
//           max-width: 45%;
//         }

//         .signature-box {
//           min-width: 180px;
//           max-width: 45%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .box-title {
//           font-weight: 600;
//           font-size: 11px;
//           text-align: center;
//           border-bottom: 1px dashed #888;
//           padding-bottom: 4px;
//           margin-bottom: 6px;
//           font-family: 'Arial Narrow', Arial, sans-serif;
//         }

//         .box-content {
//           font-size: 10px;
//           line-height: 1.6;
//           font-family: Arial, 'Arial Narrow', sans-serif;
//         }

//         .box-content .bold {
//           font-weight: 600;
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
//           <div className="title">RENTAL QUOTATION</div>

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
//                 <b>{data.toAddress?.name || 'Skillcase Solutions'}</b><br />
//                 {data.toAddress?.address || '123 Business Park, Electronic City'}<br />
//                 {data.toAddress?.city || 'Bengaluru - 560100'}<br />
//                 Phone: {data.toAddress?.phone || '+91 98765 43210'}<br />
//                 Email: {data.toAddress?.email || 'avinash@skillcase.in'}
//               </td>
//             </tr>
//           </table>

//           {/* Customer Details - 4 columns */}
//           <table className="info-table">
//             <tr>
//               <td className="info-label1">QUOTE NO.</td>
//               <td className="info-value1">{data.quoteNo}</td>
//               <td className="info-label1">QUOTE DATE</td>
//               <td className="info-label1">{data.quoteDate}</td>
//               <td className="info-label2">CONTACT PERSON</td>
//               <td className="info-value">{data.contactPerson}</td>
//               <td className="info-label">CONTACT NO.</td>
//               <td className="info-value">{data.contactNo}</td>
//             </tr>
//             <tr>
//               <td className="info-label">CUSTOMER CODE</td>
//               <td className="info-value">{data.customerCode}</td>
//               <td className="info-label">MINIMUM DURATION</td>
//               <td className="info-value">{data.minimumDuration}</td>
//               <td className="info-label">E-MAIL ID</td>
//               <td className="info-email" colSpan="3">{data.emailId}</td>
//             </tr>
//           </table>

//           {/* Items Table - with proper alignment */}
//           <table className="items-table">
//             <thead>
//               <tr>
//                 <th style={{ width: '10%', textAlign: 'center' }}>SL. NO.</th>
//                 <th style={{ width: '60%', textAlign: 'left' }}>PARTICULARS</th>
//                 <th style={{ width: '7%', textAlign: 'center' }}>QTY</th>
//                 <th style={{ width: '13%', textAlign: 'right', paddingRight: '10px' }}>RATE</th>
//                 <th style={{ width: '13%', textAlign: 'right', paddingRight: '10px' }}>AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items?.map((item, index) => {
//                 if (!item.particulars) return null;

//                 const isHeader =
//                   item.particulars.includes('Rental Charges') ||
//                   item.particulars.includes('Laptop with Following') ||
//                   (!item.slNo && index < 3);

//                 return (
//                   <tr key={index} className={isHeader ? 'sub-header' : ''}>
//                     <td style={{ textAlign: 'center' }}>
//                       {isHeader ? '' : item.slNo || ''}
//                     </td>

//                     <td
//                       style={{
//                         textAlign: 'left',
//                         ...(isHeader ? { fontWeight: 600 } : {}),
//                       }}
//                     >
//                       {item.particulars}

//                       {item.config && (
//                         <>
//                           <br />
//                           <span
//                             style={{
//                               fontSize: '10px',
//                               color: '#3d3c3c',
//                               fontWeight: 400,
//                             }}
//                           >
//                             {item.config}
//                           </span>
//                         </>
//                       )}

//                       {item.stNo && (
//                         <>
//                           <br />
//                           <span
//                             style={{
//                               fontSize: '10px',
//                               color: '#070707',
//                               fontWeight: "bold",
//                               marginTop: '4px',
//                               display: 'inline-block',
//                             }}
//                           >
//                             {item.stNo}
//                           </span>
//                         </>
//                       )}
//                     </td>

//                     <td style={{ textAlign: 'center' }}>{item.qty || ''}</td>

//                     <td className="amount-cell">
//                       {item.rate
//                         ? `${Number(item.rate).toLocaleString('en-IN')}`
//                         : ''}
//                     </td>

//                     <td className="amount-cell">
//                       {item.amount
//                         ? `${Number(item.amount).toLocaleString('en-IN')}`
//                         : ''}
//                     </td>
//                   </tr>
//                 );
//               })}

//               {/* Summary rows */}
//               <tr>
//                 <td colSpan="3" rowSpan="4"></td>
//                 <td className="summary-label">Sub Total</td>
//                 <td className="amount-cell">
//                   {subtotal.toLocaleString('en-IN')}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="summary-label">CGST @ 9%</td>
//                 <td style={{ textAlign: 'right' }}>
//                   {gst.toLocaleString('en-IN')}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="summary-label">SGST @ 9%</td>
//                 <td style={{ textAlign: 'right' }}>
//                   {sgst.toLocaleString('en-IN')}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="total-row">TOTAL</td>
//                 <td
//                   className="amount-cell"
//                   style={{
//                     fontSize: '24px',
//                     fontWeight: 'bold',
//                   }}
//                 >
//                   {total.toLocaleString('en-IN')}
//                 </td>
//               </tr>

//               <tr>
//                 <td colSpan="4" className="rupees-section">
//                   <strong>Rupees :</strong> {amountInWords}
//                 </td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Terms & Conditions Box */}
//           <div className="terms-box">
//             <div className="terms-title">Terms & Conditions :</div>
//             <ol className="terms-list">
//               <li>The client is required to provide photocopies of the ROC/TIN, premises rental deed, and address proofs of all Directors/Proprietors/Partners</li>
//               <li>Postdated cheques covering the rental period must be submitted in advance.</li>
//               <li>A security deposit cheque corresponding to the value of the rented systems is mandatory.</li>
//               <li>Delivery of the rental systems will occur within two (2) business days of receiving the Purchase Order (PO) letter.</li>
//               <li>The rental amount must be paid in advance in every month.</li>
//               <li>The quoted rates include the installation and maintenance of hardware at the customer's site.</li>
//               <li>Software-related services are not included in the rental agreement and will not be provided.</li>
//               <li>The rental provider will not be held liable for such damages.</li>
//               <li>If any system needs to be relocated from the originally specified premises, prior written notice must be given to the rental provider.</li>
//               <li>All legal matters are subject to the jurisdiction of Bengaluru only.</li>
//               <li>Transportation Charges will be additional (Depends on distance).</li>
//             </ol>
//           </div>

//           {/* Footer */}
//           <div className="footer">
//             <div className="bank-details">
//               <b>Company's Bank Details</b><br />
//               <span className="bold">Bank Name :</span> HDFC BANK LTD.,<br />
//               <span className="bold">A/c No. :</span> 50200066767843<br />
//               <span className="bold">Branch & IFS Code :</span> JAYANAGAR-3RD BLOCK & HDFC0000261
//             </div>
//             <div className="box-content" style={{ textAlign: 'center' }}>
//               For Guru Goutam Infotech Pvt. Ltd.
//               <br /><br />
//               <span style={{ fontWeight: 600 }}>SD/-</span>
//               <br /><br /><br />
//               <span style={{ fontWeight: 600 }}>Authorised Signatory</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default QuotationPreview;