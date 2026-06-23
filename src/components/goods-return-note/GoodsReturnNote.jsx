import React, { useRef } from 'react';
import logo from "../logo/logo.png";

const GoodsReturnNote = ({ open, onClose, deliveryChallanData }) => {
    const printRef = useRef();

    // Map API data to Delivery Challan format
    const mapDeliveryChallanData = (data) => {
        if (!data) return null;

        // Add items from API response
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
                slNo: index + 1,
                particulars: item.product_name || product.product_name || 'Product',
                qty: item.quotation_quantity || 1,
                config: config || product.description || '',
                stNo: product.st_number || product.serial_number || '',
                isHeader: false
            };
        }) || [];

        // Get customer details
        const customer = data.customer || {};

        // Build address
        const addressParts = [];
        if (customer.street) addressParts.push(customer.street);
        if (customer.city) addressParts.push(customer.city);
        if (customer.state) addressParts.push(customer.state);
        if (customer.pincode) addressParts.push(customer.pincode);
        const fullAddress = addressParts.join(', ');

        // Get contact person
        const contactPerson = customer.first_name && customer.last_name
            ? `${customer.first_name} ${customer.last_name}`
            : customer.first_name || customer.company_name || '';

        return {
            challanNo: data.challan_id || data.delivery_challan_id || data.quotation_id || '',
            challanDate: data.challan_date || data.delivery_date || data.quotation_date ? new Date(data.quotation_date).toLocaleDateString('en-IN') : '',
            contactPerson: contactPerson,
            contactNo: customer.phone_number || '',
            customerCode: customer.customer_id || '',
            emailId: customer.email || '',
            tinNo: customer.gst_no || data.tin_no || '',
            panNo: customer.pan_no || data.pan_no || '',
            paperSize: 'A4',
            toAddress: {
                name: customer.company_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer',
                address: fullAddress || 'Address not available',
                city: customer.city || '',
                phone: customer.phone_number || '',
                email: customer.email || ''
            },
            deliveryAddress: data.delivery_address || fullAddress || 'Delivery address not specified',
            receiverName: data.receiver_name || customer.first_name || '',
            receiverNo: data.receiver_contact || customer.phone_number || '',
            items: apiItems
        };
    };

    // Use mapped data or fallback to dummy data
    const data = deliveryChallanData ? mapDeliveryChallanData(deliveryChallanData) : {
        challanNo: 'GRN-2026-001',
        challanDate: '17-06-2026',
        contactPerson: 'Avinash Kumar',
        contactNo: '+91 98765 43210',
        receiverName: 'Vinod Kumar',
        receiverNo: '+91 98765 43299',
        customerCode: 'SKL001',
        emailId: 'avinash@skillcase.in',
        tinNo: '12345678901',
        panNo: 'FBBPM1682R',
        paperSize: 'A4',
        toAddress: {
            name: 'Skillcase Solutions',
            address: '123 Business Park, Electronic City',
            city: 'Bengaluru - 560100',
            phone: '+91 98765 43210',
            email: 'avinash@skillcase.in'
        },
        deliveryAddress: '123 Business Park, Electronic City, Bengaluru - 560100',
        items: [
            {
                slNo: 1,
                particulars: 'Dell Latitude 3420 Laptop',
                qty: 5,
                config: 'Laptop with the following configuration:\nIntel Core i5 10th Gen Processor, 8GB RAM, 256GB SSD, 14" Display, Windows 11 Pro, Power Adapter & Backpack',
                stNo: 'S/T No: 8NBVR93 & 9SYQWM93',
                isHeader: false
            },
            {
                slNo: 2,
                particulars: 'HP ProBook 450 G8 Laptop',
                qty: 3,
                config: 'Intel Core i7 11th Gen Processor, 16GB RAM, 512GB SSD, 15.6" Display, Windows 11 Pro, Power Adapter & Backpack',
                stNo: 'S/T No: 5HPROB45 & 6HPROB46',
                isHeader: false
            }
        ]
    };

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
          <div class="title">GOODS RETURN NOTE</div>

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
              <td class="info-label1">GRN NO.</td>
              <td class="info-value1">${data.challanNo}</td>
              <td class="info-label1">GRN DATE</td>
              <td class="info-label1">${data.challanDate}</td>
              <td class="info-label3">INFORMED PERSON</td>
              <td class="info-value">${data.contactPerson}</td>
              <td class="info-label">CONTACT NO.</td>
              <td class="info-value">${data.contactNo}</td>
            </tr>
            <tr>
              <td class="info-label">CUSTOMER CODE</td>
              <td class="info-value">${data.customerCode}</td>
              <td class="info-label">RETURNED PERSON</td>
              <td class="info-value">${data.receiverName}</td>
              <td class="info-label">VEHICLE NO</td>
              <td class="info-email" colspan="3">${data.receiverNo}</td>
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
              <tr class="summary-row">
                <td colspan="2" style="padding:1px 8px !important;border:0.2px solid #000;border-top:0.2px solid #000;">
                  <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
                    <div>
                      <span style="margin-left:100px; font-weight:bold;">TIN No.: </span>${data.tinNo || 'N/A'}
                      <span style="margin-left:100px; font-weight:bold;">PAN No.: </span>${data.panNo || 'N/A'}
                    </div>
                    <span style="font-weight:bold;">TOTAL QTY</span>
                  </div>
                </td>
                <td style="text-align:center;font-weight:bold;padding:1px 8px !important;border:0.2px solid #000;border-top:0.2px solid #000;">${totalQuantity}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          ${showSummary ? `
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

            <div class="delivery-details">
              <b>Receiver Details</b><br>
              <span class="bold">Name:</span> ${data.receiverName || 'Not specified'}<br>
              <span class="bold">Contact:</span> ${data.receiverNo || 'Not specified'}<br>
              <span class="bold">Signature:</span> _________________
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

        // Prepare items data with headers and configs
        const itemsData = [];
        let slCounter = 1;

        data.items?.forEach((item, index) => {
            if (!item.particulars) return;

            const isHeader = item.isHeader === true || 
                            item.particulars.includes('Laptop with the following configuration') ||
                            item.particulars.includes('Item Description:') ||
                            item.particulars.includes('Product Details:');

            const slNo = isHeader ? '' : (item.slNo || slCounter++);

            itemsData.push({
                isHeader,
                slNo,
                particulars: item.particulars,
                qty: item.qty || '',
                config: item.config || '',
                stNo: item.stNo || ''
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
            pageItems.forEach(item => {
                let particularsContent = item.particulars;

                // Check if config contains the header text
                if (item.config && item.config.includes('Laptop with the following configuration:')) {
                    const parts = item.config.split('\n');
                    const headerText = parts[0]; // "Laptop with the following configuration:"
                    const configText = parts.slice(1).join('\n'); // Rest of the config
                    
                    particularsContent = `
                        <span style="font-weight:bold;font-size:11px;display:block;margin-bottom:10px;">${headerText}</span>
                        ${item.particulars}
                        <br><span style="font-size:10px;color:#3d3c3c;font-weight:400;">${configText}</span>
                    `;
                } else if (item.config) {
                    particularsContent += `<br><span style="font-size:10px;color:#3d3c3c;font-weight:400;">${item.config}</span>`;
                }

                if (item.stNo) {
                    particularsContent += `<br><span style="font-size:10px;color:#070707;font-weight:bold;margin-top:4px;display:inline-block;">${item.stNo}</span>`;
                }

                itemsHtml += `
          <tr>
            <td style="text-align:center;">${item.slNo}</td>
            <td style="text-align:left;">
              ${particularsContent}
            </td>
            <td style="text-align:center;">${item.qty}</td>
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
        <title>GOODS RETURN NOTE</title>
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
            width: 55.2%;
          }

          .to-section {
            width: 38.8%;
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
            width: 12%;
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

          /* Summary row with minimal padding - OVERRIDE */
          .items-table .summary-row td {
            padding: 1px 8px !important;
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
            }
            .items-table .summary-row td {
              padding: 1px 8px !important;
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
          width: 55.2%;
        }
        .to-section {
          width: 38.8%;
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
          width: 12%;
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
        /* Summary row with minimal padding - OVERRIDE */
        .items-table .summary-row td {
          padding: 18px 8px !important;
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
                    <div className="title">GOODS RETURN NOTE</div>

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
                            <td className="info-label1">GRN NO.</td>
                            <td className="info-value1">{data.challanNo}</td>
                            <td className="info-label1">GRN DATE</td>
                            <td className="info-label1">{data.challanDate}</td>
                            <td className="info-label2">INFORMED PERSON</td>
                            <td className="info-value">{data.contactPerson}</td>
                            <td className="info-label">CONTACT NO.</td>
                            <td className="info-value">{data.contactNo}</td>
                        </tr>
                        <tr>
                            <td className="info-label">CUSTOMER CODE</td>
                            <td className="info-value">{data.customerCode}</td>
                            <td className="info-label">RETURNED PERSON</td>
                            <td className="info-value">{data.receiverName}</td>
                            <td className="info-label">VEHICLE NO</td>
                            <td className="info-email" colspan="3">{data.receiverNo}</td>
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

                                const isHeader = item.isHeader === true || 
                                                item.particulars.includes('Laptop with the following configuration') ||
                                                item.particulars.includes('Item Description:') ||
                                                item.particulars.includes('Product Details:');

                                if (isHeader) return null;

                                let particularsContent = item.particulars;

                                // Check if config contains the header text
                                if (item.config && item.config.includes('Laptop with the following configuration:')) {
                                    const parts = item.config.split('\n');
                                    const headerText = parts[0];
                                    const configText = parts.slice(1).join('\n');
                                    
                                    return (
                                        <tr key={index}>
                                            <td style={{ textAlign: 'center' }}>{item.slNo}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '11px', display: 'block', marginBottom: '10px' }}>
                                                    {headerText}
                                                </span>
                                                {item.particulars}
                                                <br />
                                                <span style={{ fontSize: '10px', color: '#3d3c3c', fontWeight: 400 }}>
                                                    {configText}
                                                </span>
                                                {item.stNo && (
                                                    <>
                                                        <br />
                                                        <span style={{ fontSize: '10px', color: '#070707', fontWeight: "bold", marginTop: '4px', display: 'inline-block' }}>
                                                            {item.stNo}
                                                        </span>
                                                    </>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                        </tr>
                                    );
                                }

                                return (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center' }}>{item.slNo}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            {item.particulars}
                                            {item.config && (
                                                <>
                                                    <br />
                                                    <span style={{ fontSize: '10px', color: '#3d3c3c', fontWeight: 400 }}>
                                                        {item.config}
                                                    </span>
                                                </>
                                            )}
                                            {item.stNo && (
                                                <>
                                                    <br />
                                                    <span style={{ fontSize: '10px', color: '#070707', fontWeight: "bold", marginTop: '4px', display: 'inline-block' }}>
                                                        {item.stNo}
                                                    </span>
                                                </>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                    </tr>
                                );
                            })}

                            {/* Total Quantity Row */}
                            <tr className="summary-row">
                                <td colSpan="2" style={{ border: '0.2px solid #000' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <div>
                                            <span style={{ marginLeft: '100px', fontWeight: 'bold' }}>TIN No.: </span>
                                            {data.tinNo || 'N/A'}
                                            <span style={{ marginLeft: '100px', fontWeight: 'bold' }}>
                                                PAN No.: 
                                            </span>
                                            {data.panNo || 'N/A'}
                                        </div>
                                        <span style={{ fontWeight: 'bold' }}>TOTAL QTY</span>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: '600', border: '0.2px solid #000' }}>
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
                            <b>PICKUP ADDRESS</b><br />
                            <span className="bold">{data.deliveryAddress || 'Not specified'}.</span>
                        </div>

                        <div className="delivery-details">
                            <b>SIGNATURE WITH SEAL</b><br />
                            <br /><br /><br /><br /><br /><br />
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

export default GoodsReturnNote;