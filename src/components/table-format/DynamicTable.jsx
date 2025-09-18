import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Stack,
  Pagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import numWords from "num-words";

// Import Icons
import DeleteIcon from "../../assets/logos/delete.png";
import EditIcon from "../../assets/logos/edit.png";
import ViewDC from "../../assets/logos/ViewDC.png";

import StatusOff from "../../assets/logos/turnoff.png";
import StatusOn from "../../assets/logos/turnon.png";
import API_URL from "../../api/Api_url";
import { useSelector } from "react-redux";
// API Endpoints Mapping
const apiEndpoints = {
  settings: `${API_URL}/users`,
  roles: `${API_URL}/roles`,
  operations: `${API_URL}/delivery-challans`,
  supplier: `${API_URL}/supplier`,
  quotations: `${API_URL}/quotations`,
  goodsreceipt: `${API_URL}/goods-receipts`,
  "po-quotations": `${API_URL}/purchase-quotation`,
  "purchase-requests": `${API_URL}/purchase-requests`,
  product_library: `${API_URL}/product-templete`,
  brands: `${API_URL}/product-brands`,
  product_categories: `${API_URL}/product-categories`,
  stock_locations: `${API_URL}/stock-location`,
  "purchase-orders": `${API_URL}/purchase-orders`,
  "client-list": `${API_URL}/contacts`,
  lead: `${API_URL}/leads`,
  orders: `${API_URL}/orders`,
  contact_type: `${API_URL}/contact-types`,
  taxt_list: `${API_URL}/tax-list`,
  branches: `${API_URL}/branches`,
  users: `${API_URL}/users`,
  invoices: `${API_URL}/invoices`,
  grn: `${API_URL}/credit-notes`,
  service: `${API_URL}/service`,
  clients: `${API_URL}/clients`,
  asset_modification_tracker: `${API_URL}/asset-modifications`,
  "dispatch-orders": `${API_URL}/dispatch-orders`,
  "assembled-products": `${API_URL}/assembled-assets`,
  "asset-updation": `${API_URL}/peripheral-assets`,
  "courier-charges": `${API_URL}/courier-charges`,
  service_maintenance: `${API_URL}/service-charges`,
  swap: `${API_URL}/asset-swaps`,
};

// Delivery Challan Dialog Component
// const DeliveryChallanDialog = ({ open, onClose, dcData }) => {
//   if (!dcData) return null;

//   const handleDownloadPDF = () => {
//     const input = document.getElementById("delivery-challan-container");

//     html2canvas(input, {
//       scale: 2,
//       logging: false,
//       useCORS: true,
//       allowTaint: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`delivery-challan-${dcData.dc_id}.pdf`);
//     });
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>Delivery Challan Details</DialogTitle>
//       <DialogContent>
//         <div style={containerStyle}>
//           <div id="delivery-challan-container" style={receiptContainerStyle}>
//             {/* Header Color Bar */}
//             <div style={headerBarStyle}></div>

//             {/* Company Header */}
//             <div style={companyHeaderStyle}>
//               <div style={companyInfoContainerStyle}>
//                 <div style={logoStyle}>
//                   <img
//                     src="/SORT-ICON.png"
//                     alt="Company Logo"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <div style={companyNameStyle}>
//                     Guru Goutam Infotech Pvt. Ltd.
//                   </div>
//                   <div style={companyDetailsStyle}>
//                     CIN: U72200KA2008PTC047679
//                     <br />
//                     GST: {dcData.gst_number || "29AADCG2608Q1Z6"}
//                   </div>
//                 </div>
//               </div>
//               <div style={challanHeaderStyle}>
//                 <div style={challanTitleStyle}>DELIVERY CHALLAN</div>
//                 <div style={challanDetailsStyle}>
//                   Challan No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
//                   {dcData.dc_id}
//                   <br />
//                   Challan Date. &nbsp;&nbsp;&nbsp;:{" "}
//                   {new Date(dcData.dc_date).toLocaleDateString("en-GB")}
//                 </div>
//               </div>
//             </div>

//             {/* Recipient Section */}
//             <div style={recipientSectionStyle}>
//               <div style={recipientContainerStyle}>
//                 <div style={recipientAddressStyle}>
//                   <div style={recipientLabelStyle}>To</div>
//                   {dcData.shipping_name}
//                   <br />
//                   {dcData.street && `${dcData.street}, `}
//                   {dcData.landmark && `${dcData.landmark}, `}
//                   {dcData.city}, {dcData.state}
//                   <br />
//                   {dcData.country} - {dcData.pincode}
//                 </div>
//                 <div style={recipientDetailsGridStyle}>
//                   <div>
//                     <div style={detailLabelStyle}>Customer Code :</div>
//                     {dcData.customer_code}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Contact Person :</div>
//                     {dcData.shipping_ordered_by}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Received Person :</div>
//                     {dcData.receiver_name}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Delivered Staff :</div>
//                     {dcData.delivery_person_name}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>PO Number:</div>
//                     {dcData.order_number || "N/A"}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Contact Number :</div>
//                     {dcData.shipping_phone_number}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Receiver Number :</div>
//                     {dcData.receiver_phone_number}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Vehicle Number :</div>
//                     {dcData.vehicle_number}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <table style={tableStyle}>
//               <thead>
//                 <tr>
//                   <th style={tableHeaderNoStyle}>S.NO.</th>
//                   <th style={tableHeaderQtyStyle1}>Asset Id's</th>

//                   <th style={tableHeaderParticularsStyle}>Product Name</th>
//                   <th style={tableHeaderQtyStyle}>QTY</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(() => {
//                   let serial = 1;
//                   return dcData.items?.flatMap((item, itemIndex) =>
//                     (item.device_ids?.length > 0
//                       ? item.device_ids
//                       : [null]
//                     ).map((deviceId, deviceIndex) => (
//                       <tr
//                         key={`${item.id}-${deviceIndex}`}
//                         style={
//                           serial % 2 === 0
//                             ? tableRowEvenStyle
//                             : tableRowOddStyle
//                         }
//                       >
//                         <td style={tableCellCenterStyle}>{serial++}</td>
//                         <td style={tableCellCenterStyle}>{deviceId}</td>

//                         <td style={tableCellStyle}>
//                           <div style={itemTitleStyle}>{item.product_name}</div>
//                           <div
//                             style={{
//                               marginTop: 4,
//                               fontSize: "10px",
//                               color: "#555",
//                             }}
//                           >
//                             <div style={specificationsTitleStyle}>
//                               Specifications:
//                             </div>
//                             <div>
//                               <strong>Brand:</strong> {item.product?.brand},{" "}
//                               <strong>Model:</strong> {item.product?.model},{" "}
//                               <strong>RAM:</strong> {item.product?.ram},{" "}
//                               <strong>Storage:</strong> {item.product?.storage},{" "}
//                               <strong>Processor:</strong>{" "}
//                               {item.product?.processor}, <strong>OS:</strong>{" "}
//                               {item.product?.os}, <strong>Asset ID:</strong>{" "}
//                               {deviceId || "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                         <td style={tableCellCenterStyle}>1</td>
//                       </tr>
//                     ))
//                   );
//                 })()}
//               </tbody>
//             </table>

//             {/* Footer Info */}
//             <div style={footerInfoStyle}>
//               <div style={taxDetailsStyle}>
//                 PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
//                 {dcData.pan_number}
//                 <br />
//                 GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
//                 {dcData.gst_number}
//               </div>

//               <div style={totalContainerStyle}>
//                 <div style={totalLabelStyle}>TOTAL QTY :</div>
//                 <div style={totalValueStyle}>{dcData.totalQuantity}</div>
//               </div>
//             </div>

//             {/* Not For Sale */}
//             <div style={notForSaleStyle}>
//               {dcData.type === "Rent"
//                 ? "NOT FOR SALE - RETURNABLE BASIS ONLY"
//                 : "FOR SALE"}
//             </div>

//             {/* Signature Section */}
//             <div style={signatureSectionStyle}>
//               <div style={leftSignatureAreaStyle}>
//                 <div style={jurisdictionNoteStyle}>
//                   Note: Subjected to Bengaluru Jurisdiction
//                 </div>
//                 <table style={signatureTableStyle}>
//                   <tbody>
//                     <tr>
//                       <td style={signatureTableHeaderStyle}>
//                         Delivery Address
//                       </td>
//                       <td style={signatureTableHeaderStyle}>
//                         Receiver Date and Signature
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style={signatureTableCellStyle}>
//                         {dcData.shipping_name}
//                         <br />
//                         {dcData.street && `${dcData.street}, `}
//                         {dcData.landmark && `${dcData.landmark}, `}
//                         {dcData.city}, {dcData.state}
//                         <br />
//                         {dcData.country} - {dcData.pincode}
//                       </td>
//                       <td style={signatureTableCellStyle}></td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               <div style={rightSignatureAreaStyle}>
//                 <div style={companySignatureLabelStyle}>
//                   For Guru Goutham Infotech Private Limited
//                 </div>
//                 <div style={signatureBoxStyle}>SD/-</div>
//                 <div style={signatureDesignationStyle}>
//                   Authorised Signatory
//                 </div>
//               </div>
//             </div>

//             {/* Company Footer */}
//             <div style={companyFooterStyle}>
//               <div style={footerAddressStyle}>
//                 <span>📍</span>
//                 <span>
//                   No. 8, 2nd Cross, Diagonal Road, 3rd Block,
//                   <br />
//                   Jayanagar Bengaluru-560011.
//                 </span>
//               </div>
//               <div style={footerContactStyle}>
//                 <div style={footerContactItemStyle}>
//                   <span>🌐</span>
//                   <span>gurugoutam.com</span>
//                 </div>
//                 <div style={footerContactItemStyle}>
//                   <span>📞</span>
//                   <span>080-2242 9955, +91 9449 0789 55</span>
//                 </div>
//                 <div style={footerContactItemStyle}>
//                   <span>✉️</span>
//                   <span>info@gurugoutam.com</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//         <Button onClick={handleDownloadPDF} variant="contained" color="primary">
//           Download PDF
//         </Button>
//         <Button onClick={() => window.print()}>Print</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

///25-08-2025

// Goods Return Note Dialog Component
// const DeliveryChallanDialog = ({ open, onClose, dcData }) => {
//   if (!dcData) return null;

//   const handleDownloadPDF = () => {
//     const input = document.getElementById("delivery-challan-container");

//     html2canvas(input, {
//       scale: 2,
//       logging: false,
//       useCORS: true,
//       allowTaint: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`delivery-challan-${dcData.dc_id}.pdf`);
//     });
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>Delivery Challan Details</DialogTitle>
//       <DialogContent>
//         <div style={containerStyle}>
//           <div id="delivery-challan-container" style={receiptContainerStyle}>
//             {/* Header Color Bar */}
//             <div style={headerBarStyle}></div>

//             {/* Company Header */}
//             <div style={companyHeaderStyle}>
//               <div style={companyInfoContainerStyle}>
//                 <div style={logoStyle}>
//                   <img
//                     src="/SORT-ICON.png"
//                     alt="Company Logo"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <div style={companyNameStyle}>
//                     Guru Goutam Infotech Pvt. Ltd.
//                   </div>
//                   <div style={companyDetailsStyle}>
//                     {/* CIN: U72200KA2008PTC047679 */}
//                     <br />
//                     {/* GST: {dcData.gst_number || "29AADCG2608Q1Z6"} */}
//                   </div>
//                 </div>
//               </div>
//               <div style={challanHeaderStyle}>
//                 <div style={challanTitleStyle}>DELIVERY CHALLAN</div>
//                 <div style={challanDetailsStyle}>
//                   Challan No: {dcData.dc_id}
//                   <br />
//                   Challan Date:{" "}
//                   {new Date(dcData.dc_date).toLocaleDateString("en-GB")}
//                 </div>
//               </div>
//             </div>

//             {/* Recipient Section */}
//             <div style={recipientSectionStyle}>
//               <div style={recipientContainerStyle}>
//                 <div style={recipientAddressStyle}>
//                   <div style={recipientLabelStyle}>To</div>
//                   {dcData.shipping_name}
//                   <br />
//                   {dcData.street && `${dcData.street}, `}
//                   {dcData.landmark && `${dcData.landmark}, `}
//                   {dcData.city}, {dcData.state},
//                   <br />
//                   {dcData.country} - {dcData.pincode}
//                 </div>
//                 <div style={recipientDetailsGridStyle}>
//                   {/* <div>
//                     <div style={detailLabelStyle}>Customer Code :</div>
//                     {dcData.customer_code}
//                   </div> */}
//                   <div>
//                     <div style={detailLabelStyle}>Contact Person :</div>
//                     {dcData.shipping_ordered_by}
//                   </div>
//                   {/* <div>
//                     <div style={detailLabelStyle}>Received Person :</div>
//                     {dcData.receiver_name}
//                   </div> */}
//                   <div>
//                     <div style={detailLabelStyle}>Contact Number :</div>
//                     {dcData.shipping_phone_number}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>PO Number:</div>
//                     {dcData.dc_id || "N/A"}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Delivered Person :</div>
//                     {dcData.delivery_person_name}
//                   </div>

//                   <div>
//                     <div style={detailLabelStyle}>Deliver Perso Number :</div>
//                     {dcData.delivery_person_phone_number}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Vehicle Number :</div>
//                     {dcData.vehicle_number}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Items Table */}
//             <table style={tableStyle}>
//               <thead>
//                 <tr>
//                   <th style={tableHeaderNoStyle}>NO.</th>
//                   <th style={tableHeaderParticularsStyle}>Product Name</th>
//                   <th style={tableHeaderQtyStyle}>QTY</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dcData.items?.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     style={
//                       index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
//                     }
//                   >
//                     <td style={tableCellCenterStyle}>{index + 1}</td>
//                     <td style={tableCellStyle}>
//                       <div
//                         style={{
//                           fontWeight: "bold",
//                           fontSize: "14px",
//                           color: "#000",
//                         }}
//                       >
//                         {item.product_name}
//                       </div>
//                       <div
//                         style={{
//                           fontSize: "11px",
//                           color: "#555",
//                           marginTop: 4,
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         <strong>Specifications:</strong> Brand:{" "}
//                         {item.product?.brand}. Model: {item.product?.model}.
//                         Processor: {item.product?.processor}. RAM:{" "}
//                         {item.product?.ram}. Storage: {item.product?.storage}.
//                         <br />
//                         Disk Type: {item.product?.disk_type}. Graphics:{" "}
//                         {item.product?.graphics}. OS: {item.product?.os}.
//                       </div>
//                       <br />
//                       {item.device_ids?.length > 0 && (
//                         <div style={itemTitleStyle}>
//                           <strong>Asset IDs:</strong>{" "}
//                           {item.device_ids.join(", ")}
//                         </div>
//                       )}
//                     </td>

//                     <td style={tableCellCenterStyle}>{item.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Footer Info */}
//             <div style={footerInfoStyle}>
//               <div style={taxDetailsStyle}>
//                 {/* PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
//                 {dcData.pan_number}
//                 <br />
//                 GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
//                 {dcData.gst_number} */}
//               </div>

//               <div style={totalContainerStyle}>
//                 <div style={totalLabelStyle}>TOTAL QTY :</div>
//                 <div style={totalValueStyle}>{dcData.totalQuantity}</div>
//               </div>
//             </div>

//             {/* Not For Sale */}
//             <div style={notForSaleStyle}>
//               {dcData.type === "Rent"
//                 ? "NOT FOR SALE - RETURNABLE BASIS ONLY"
//                 : "FOR SALE"}
//             </div>

//             {/* Signature Section */}
//             <div style={signatureSectionStyle}>
//               <div style={leftSignatureAreaStyle}>
//                 <div style={jurisdictionNoteStyle}>
//                   Note: Subjected to Bengaluru Jurisdiction
//                 </div>
//                 <table style={signatureTableStyle}>
//                   <tbody>
//                     <tr>
//                       <td style={signatureTableHeaderStyle}>
//                         Delivery Address
//                       </td>
//                       <td style={signatureTableHeaderStyle}>
//                         Receiver Date and Signature
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style={signatureTableCellStyle}>
//                         {dcData.shipping_name}
//                         <br />
//                         {dcData.street && `${dcData.street}, `}
//                         {dcData.landmark && `${dcData.landmark}, `}
//                         {dcData.city}, {dcData.state}
//                         <br />
//                         {dcData.country} - {dcData.pincode}
//                       </td>
//                       <td style={signatureTableCellStyle}></td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               <div style={rightSignatureAreaStyle}>
//                 <div style={companySignatureLabelStyle}>
//                   For Guru Goutham Infotech Private Limited
//                 </div>
//                 <div style={signatureBoxStyle}>SD/-</div>
//                 <div style={signatureDesignationStyle}>
//                   Authorised Signatory
//                 </div>
//               </div>
//             </div>

//             {/* Company Footer */}
//             <div style={companyFooterStyle}>
//               <div style={footerAddressStyle}>
//                 <span>📍</span>
//                 <span>
//                   No. 8, 2nd Cross, Diagonal Road, 3rd Block,
//                   <br />
//                   Jayanagar Bengaluru-560011.
//                 </span>
//               </div>
//               <div style={footerContactStyle}>
//                 <div style={footerContactItemStyle}>
//                   <span>🌐</span>
//                   <span>gurugoutam.com</span>
//                 </div>
//                 <div style={footerContactItemStyle}>
//                   <span>📞</span>
//                   <span>080-2242 9955, +91 9449 0789 55</span>
//                 </div>
//                 <div style={footerContactItemStyle}>
//                   <span>✉️</span>
//                   <span>info@gurugoutam.com</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//         <Button onClick={handleDownloadPDF} variant="contained" color="primary">
//           Download PDF
//         </Button>
//         <Button onClick={() => window.print()}>Print</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

const DeliveryChallanDialog = ({ open, onClose, dcData }) => {
  if (!dcData) return null;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the delivery-challan container element
      const element = document.getElementById("delivery-challan-container");

      if (!element) {
        throw new Error("Could not find delivery-challan element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`delivery-challan-${dcData.dc_id || "DC"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("delivery-challan-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the delivery-challan content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery-Challan - ${dcData.dc_id || "DC"}</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Function to render accessories information
  const renderAccessories = () => {
    const accessories = [];

    // Add standard accessories if they are true
    if (dcData.mouse) accessories.push("Mouse");
    if (dcData.cable) accessories.push("Cable");
    if (dcData.bag) accessories.push("Bag");

    // Add other accessories from the array
    if (dcData.other_accessory && dcData.other_accessory.length > 0) {
      accessories.push(...dcData.other_accessory);
    }

    // Add "Others" if the others field is true but no specific accessories listed
    if (dcData.others && accessories.length === 0) {
      accessories.push("Others");
    }

    return accessories.length > 0 ? (
      <div style={accessoriesContainerStyle}>
        <div style={accessoriesTitleStyle}>Accessories Included:</div>
        <ul style={accessoriesListStyle}>
          {accessories.map((item, index) => (
            <li key={index} style={accessoriesListItemStyle}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Delivery Challan Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="delivery-challan-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    {/* CIN: U72200KA2008PTC047679 */}
                    <br />
                    {/* GST: {dcData.gst_number || "29AADCG2608Q1Z6"} */}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>DELIVERY CHALLAN</div>
                <div style={challanDetailsStyle}>
                  Challan No: {dcData.dc_id}
                  <br />
                  Challan Date:{" "}
                  {new Date(dcData.dc_date).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>Ship To</div>
                  {dcData.shipping_name}
                  <br />
                  {dcData.street && `${dcData.street}, `}
                  {dcData.landmark && `${dcData.landmark}, `}
                  {dcData.city}, {dcData.state},
                  <br />
                  {dcData.country} - {dcData.pincode}
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Receiver Person :</div>
                    {dcData.receiver_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Receiver Number :</div>
                    {dcData.receiver_phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>PO Number:</div>
                    {dcData.dc_id || "N/A"}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Delivered Person :</div>
                    {dcData.delivery_person_name}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Deliver Perso Number :</div>
                    {dcData.delivery_person_phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Vehicle Number :</div>
                    {dcData.vehicle_number}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>Product Name</th>
                  <th style={tableHeaderQtyStyle}>QTY</th>
                </tr>
              </thead>
              <tbody>
                {dcData.items?.map((item, index) => (
                  <tr
                    key={item.id}
                    style={
                      index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                    }
                  >
                    <td style={tableCellCenterStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#000",
                        }}
                      >
                        {item.product_name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#555",
                          marginTop: 4,
                          lineHeight: "1.4",
                        }}
                      >
                        <strong>Specifications:</strong> Brand:{" "}
                        {item.product?.brand}. Model: {item.product?.model}.
                        Processor: {item.product?.processor}. RAM:{" "}
                        {item.product?.ram}. Storage: {item.product?.storage}.
                        <br />
                        Disk Type: {item.product?.disk_type}. Graphics:{" "}
                        {item.product?.graphics}. OS: {item.product?.os}.
                      </div>
                      <br />
                      {item.device_ids?.length > 0 && (
                        <div style={itemTitleStyle}>
                          <strong>Asset IDs:</strong>{" "}
                          {item.device_ids.join(", ")}
                        </div>
                      )}
                    </td>

                    <td style={tableCellCenterStyle}>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Accessories Section */}
            {renderAccessories()}

            {/* Footer Info */}
            <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                {/* PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {dcData.pan_number}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {dcData.gst_number} */}
              </div>

              <div style={totalContainerStyle}>
                <div style={totalLabelStyle}>TOTAL QTY :</div>
                <div style={totalValueStyle}>{dcData.totalQuantity}</div>
              </div>
            </div>

            {/* Not For Sale */}
            <div style={notForSaleStyle}>
              {dcData.type === "Rent"
                ? "NOT FOR SALE - RETURNABLE BASIS ONLY"
                : "FOR SALE"}
            </div>

            {/* Signature Section */}
            <div style={signatureSectionStyle}>
              <div style={leftSignatureAreaStyle}>
                <div style={jurisdictionNoteStyle}>
                  Note: Subjected to Bengaluru Jurisdiction
                </div>
                <table style={signatureTableStyle}>
                  <tbody>
                    <tr>
                      <td style={signatureTableHeaderStyle}>
                        Delivery Address
                      </td>
                      <td style={signatureTableHeaderStyle}>
                        Receiver Date and Signature
                      </td>
                    </tr>
                    <tr>
                      <td style={signatureTableCellStyle}>
                        {dcData.shipping_name}
                        <br />
                        {dcData.street && `${dcData.street}, `}
                        {dcData.landmark && `${dcData.landmark}, `}
                        {dcData.city}, {dcData.state}
                        <br />
                        {dcData.country} - {dcData.pincode}
                      </td>
                      <td style={signatureTableCellStyle}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const QuotationDialog = ({ open, onClose, quotationData }) => {
  if (!quotationData) return null;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the quotation container element
      const element = document.getElementById("quotation-container");

      if (!element) {
        throw new Error("Could not find quotation element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`quotation-${quotationData.quotation_id || "QI"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("quotation-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the invoice content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation - ${quotationData.quotation_id || "QI"}</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Calculate total quantity
  const totalQuantity = quotationData.items?.reduce((total, item) => {
    return total + (item.quotation_quantity || 0);
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Quotation Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="quotation-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    CIN: U72200KA2008PTC047679
                    <br />
                    GST: 29AADCG2608Q1Z6
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>QUOTATION</div>
                <div style={challanDetailsStyle}>
                  Quotation No: {quotationData.quotation_id}
                  <br />
                  Quotation Date:{" "}
                  {new Date(quotationData.quotation_date).toLocaleDateString(
                    "en-GB"
                  )}
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>Ship To</div>
                  {quotationData.customer_first_name}{" "}
                  {quotationData.customer_last_name}
                  <br />
                  {quotationData.customer?.company_name && (
                    <>
                      {quotationData.customer.company_name}
                      <br />
                    </>
                  )}
                  {quotationData.customer.address.street &&
                    `${quotationData.customer.address.street}, `}
                  {quotationData.customer.address.city},<br />{" "}
                  {quotationData.customer.address.state},
                  <br />
                  {quotationData.customer.address.country} -{" "}
                  {quotationData.customer.address.pincode}.
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Receiver Person :</div>
                    {quotationData.customer.first_name}{" "}
                    {quotationData.customer.last_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Receiver Number :</div>
                    {quotationData.customer.phone_number}
                  </div>
                  {/* <div>
                    <div style={detailLabelStyle}>PO Number:</div>
                    {quotationData.dc_id || "N/A"}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Delivered Person :</div>
                    {quotationData.delivery_person_name}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Deliver Perso Number :</div>
                    {quotationData.delivery_person_phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Vehicle Number :</div>
                    {quotationData.vehicle_number}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>Product Details</th>
                  <th style={tableHeaderParticularsStyle}>
                    {quotationData.transaction_type === "Rent"
                      ? "Price Per Month"
                      : "Purchase Price"}
                  </th>
                  <th style={tableHeaderQtyStyle}>QTY</th>
                </tr>
              </thead>
              <tbody>
                {quotationData.items?.map((item, index) => {
                  // Select base price & offer price
                  const basePrice =
                    quotationData.transaction_type === "Buy"
                      ? parseFloat(item.purchase_price)
                      : parseFloat(item.rent_price_per_month);

                  const offerPrice =
                    quotationData.transaction_type === "Buy"
                      ? parseFloat(item.offer_purchase_price)
                      : parseFloat(item.offer_rent_price_per_month);

                  // Use offer price if not zero, otherwise normal price
                  const finalPrice = offerPrice > 0 ? offerPrice : basePrice;

                  const total = finalPrice * item.quotation_quantity;

                  return (
                    <tr
                      key={item.id}
                      style={
                        index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                      }
                    >
                      <td style={tableCellCenterStyle}>{index + 1}</td>
                      <td style={tableCellStyle}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          {item.product_name}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#555",
                            marginTop: 4,
                            lineHeight: "1.4",
                          }}
                        >
                          <strong>Specifications:</strong> Brand:{" "}
                          {item.product?.brand}. Model: {item.product?.model}.
                          Processor: {item.product?.processor}. RAM:{" "}
                          {item.product?.ram}. Storage: {item.product?.storage}.
                          <br />
                          Disk Type: {item.product?.disk_type}. Graphics:{" "}
                          {item.product?.graphics}. OS: {item.product?.os}.
                        </div>
                        <br />
                      </td>

                      {/* Price Cell */}
                      <td style={tableCellStyle}>{finalPrice.toFixed(2)}</td>

                      {/* Quantity Cell */}
                      <td style={tableCellCenterStyle}>
                        {item.quotation_quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer Info */}
            <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                {/* PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {dcData.pan_number}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {dcData.gst_number} */}
              </div>

              <div style={totalContainerStyle}>
                <div style={totalLabelStyle}>TOTAL QTY :</div>
                <div style={totalValueStyle}>
                  {quotationData.items?.reduce(
                    (sum, item) => sum + (item.quotation_quantity || 0),
                    0
                  )}
                </div>{" "}
              </div>
            </div>

            {/* Not For Sale */}
            <div style={notForSaleStyle}>
              {quotationData.transaction_type === "Rent"
                ? "NOT FOR SALE - RETURNABLE BASIS ONLY"
                : "FOR SALE"}
            </div>

            {/* Signature Section */}
            <div style={signatureSectionStyle}>
              <div style={leftSignatureAreaStyle}>
                <div style={jurisdictionNoteStyle}>
                  Note: Subjected to Bengaluru Jurisdiction
                </div>
                <table style={signatureTableStyle}>
                  <tbody>
                    <tr>
                      <td style={signatureTableHeaderStyle}>
                        Quotation Address
                      </td>
                      <td style={signatureTableHeaderStyle}>
                        Receiver Date and Signature
                      </td>
                    </tr>
                    <tr>
                      <td style={signatureTableCellStyle}>
                        {quotationData.customer_first_name}{" "}
                        {quotationData.customer_last_name},
                        <br />
                        {quotationData.customer.address.street &&
                          `${quotationData.customer.address.street}, `}
                        {quotationData.customer.address.city},{" "}
                        {quotationData.customer.address.state}
                        <br />
                        {quotationData.customer.address.country} -{" "}
                        {quotationData.customer.address.pincode}.
                      </td>
                      <td style={signatureTableCellStyle}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Goods Return Note Dialog Component
const GoodsReturnNoteDialog = ({ open, onClose, grnData }) => {
  if (!grnData) return null;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the GRN container element
      const element = document.getElementById("grn-container");

      if (!element) {
        throw new Error("Could not find GRN element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`goods-return-note-${grnData.credit_note_number || "GRN"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("grn-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the GRN content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Goods Return Note - ${grnData.credit_note_number || "CN-9JGRRE"
      }</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Goods Return Note Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="grn-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    CIN: UT2200KA2008PTC047879
                    <br />
                    GST: {grnData.customer?.gst || "29AADCG2606Q1Z6"}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>GOODS RETURN NOTE</div>
                <div style={challanDetailsStyle}>
                  GRN No: {grnData.credit_note_number || "CN-9JGRRE"}
                  <br />
                  GRN Date:{" "}
                  {new Date(
                    grnData.returned_date || "2025-11-11"
                  ).toLocaleDateString("en-GB")}
                  <br />
                  Order No: {grnData.dispatch_order_number || "DC-W428BK"}
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>To:</div>
                  {grnData.customer?.first_name} {grnData.customer?.last_name},
                  <br />
                  {grnData.customer?.address?.street &&
                    `${grnData.customer.address.street}, `}
                  {grnData.customer?.address?.city &&
                    `${grnData.customer.address.city}, `}
                  {grnData.customer?.address?.state &&
                    `${grnData.customer.address.state}`}
                  <br />
                  {grnData.customer?.address?.country &&
                    `${grnData.customer.address.country} - `}
                  {grnData.customer?.address?.pincode}
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Contact Person:</div>
                    {grnData.customer?.first_name} {grnData.customer?.last_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Number:</div>
                    {grnData.customer?.phone_number}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Collected Person Name:</div>
                    {grnData.collected_person_name || "Not specified"}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Collected Person No:</div>
                    {grnData.collected_person_no || "Not specified"}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Vehicle Number:</div>
                    {grnData.vehicle_no || "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>Product Name</th>
                  <th style={tableHeaderQtyStyle}>QTY</th>
                </tr>
              </thead>
              <tbody>
                {grnData.items?.map((item, index) => {
                  const deviceIds =
                    typeof item.device_ids === "string"
                      ? JSON.parse(item.device_ids)
                      : item.device_ids || [];

                  return (
                    <tr
                      key={item.id || index}
                      style={
                        index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                      }
                    >
                      <td style={tableCellCenterStyle}>{index + 1}</td>
                      <td style={tableCellStyle}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          {item.product_name}
                        </div>

                        <div
                          style={{
                            fontSize: "11px",
                            color: "#555",
                            marginTop: 4,
                            lineHeight: "1.5",
                          }}
                        >
                          <strong>Specifications:</strong> Brand:{" "}
                          {item.product?.brand || "Dell"}, Model:{" "}
                          {item.product?.model || "3420"}, Processor:{" "}
                          {item.product?.processor || "—"}, RAM:{" "}
                          {item.product?.ram || "8GB DDR4"}, <br />
                          Storage: {item.product?.storage || "250GB"}, Disk
                          Type: {item.product?.disk_type || "SSD"}, Graphics:{" "}
                          {item.product?.graphics || "No"}, OS:{" "}
                          {item.product?.os || "Windows 11 Pro"}
                        </div>
                        <br />

                        {deviceIds.length > 0 && (
                          <div style={itemTitleStyle}>
                            <strong>Asset IDs:</strong> {deviceIds.join(", ")}
                          </div>
                        )}
                      </td>
                      <td style={tableCellCenterStyle}>{item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer Info */}
            <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {grnData.customer?.pan_no || "FGHIJ6789L"}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {grnData.customer?.gst || "29AADCG2606Q1Z6"}
              </div>

              <div style={totalContainerStyle}>
                <div style={totalLabelStyle}>TOTAL QTY :</div>
                <div style={totalValueStyle}>
                  {grnData.items?.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={totalLabelStyle}>
              <strong>Description:</strong>{" "}
              {grnData.description || "Goods return note"}
            </div>

            {/* Signature Section */}
            <div style={signatureSectionStyle}>
              <div style={leftSignatureAreaStyle}>
                <div style={jurisdictionNoteStyle}>
                  Note: Subjected to Bengaluru Jurisdiction
                </div>
                <table style={signatureTableStyle}>
                  <tbody>
                    <tr>
                      <td style={signatureTableHeaderStyle}>Return Address</td>
                      <td style={signatureTableHeaderStyle}>
                        Receiver Date and Signature
                      </td>
                    </tr>
                    <tr>
                      <td style={signatureTableCellStyle}>
                        {grnData.customer?.first_name}{" "}
                        {grnData.customer?.last_name},
                        <br />
                        {grnData.customer?.address?.street &&
                          `${grnData.customer.address.street}, `}
                        {grnData.customer?.address?.city &&
                          `${grnData.customer.address.city}, `}
                        {grnData.customer?.address?.state &&
                          `${grnData.customer.address.state}`}
                        <br />
                        {grnData.customer?.address?.country &&
                          `${grnData.customer.address.country} - `}
                        {grnData.customer?.address?.pincode}
                      </td>
                      <td style={signatureTableCellStyle}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PlainGoodsReturnNoteDialog = ({ open, onClose, grnData }) => {
  if (!grnData) return null;

  // Extract items from all challans
  const allItems =
    grnData.challans?.flatMap(
      (challan) =>
        challan.items?.map((item) => ({
          ...item,
          challanId: challan.dc_id,
          challanDate: challan.dc_date,
        })) || []
    ) || [];

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the GRN container element
      const element = document.getElementById("grn-container");

      if (!element) {
        throw new Error("Could not find GRN element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`goods-return-note-${grnData.credit_note_number || "GRN"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("grn-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the GRN content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Goods Return Note - ${grnData.credit_note_number || "CN-9JGRRE"
      }</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Goods Return Note Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="grn-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    CIN: UT2200KA2008PTC047879
                    <br />
                    GST: {grnData.customer?.gst || "29AADCG2606Q1Z6"}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>GOODS RETURN NOTE</div>
                <div style={challanDetailsStyle}>
                  GRN No: {grnData.credit_note_number || "CN-9JGRRE"}
                  <br />
                  GRN Date: {new Date().toLocaleDateString("en-GB")}
                  <br />
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>To:</div>
                  {grnData.customer?.first_name} {grnData.customer?.last_name},
                  <br />
                  {grnData.customer?.address?.street &&
                    `${grnData.customer.address.street}, `}
                  {grnData.customer?.address?.city &&
                    `${grnData.customer.address.city}, `}
                  {grnData.customer?.address?.state &&
                    `${grnData.customer.address.state}`}
                  <br />
                  {grnData.customer?.address?.country &&
                    `${grnData.customer.address.country} - `}
                  {grnData.customer?.address?.pincode}
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Contact Person:</div>
                    {grnData.customer?.first_name} {grnData.customer?.last_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Number:</div>
                    {grnData.customer?.phone_number}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>Product Name</th>
                  <th style={{ ...tableHeaderParticularsStyle, width: "40%" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {allItems
                  .filter((item) => {
                    const deviceIds =
                      typeof item.device_ids === "string"
                        ? JSON.parse(item.device_ids)
                        : item.device_ids || [];
                    return deviceIds.length > 0;
                  })
                  .map((item, index) => {
                    const deviceIds =
                      typeof item.device_ids === "string"
                        ? JSON.parse(item.device_ids)
                        : item.device_ids || [];

                    return (
                      <tr
                        key={item.id || index}
                        style={index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle}
                      >
                        <td style={tableCellCenterStyle}>{index + 1}</td>

                        {/* Product Name Column */}
                        <td style={tableCellStyle}>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "14px",
                              color: "#000",
                            }}
                          >
                            {item.product_name}
                          </div>

                          <div
                            style={{
                              fontSize: "11px",
                              color: "#555",
                              marginTop: 4,
                              lineHeight: "1.5",
                            }}
                          >
                            <strong>Specifications:</strong> Brand:{" "}
                            {item.product?.brand || "Dell"}, Model:{" "}
                            {item.product?.model || "3420"}, Processor:{" "}
                            {item.product?.processor || "—"}, RAM:{" "}
                            {item.product?.ram || "8GB DDR4"}, <br />
                            Storage: {item.product?.storage || "250GB"}, Disk Type:{" "}
                            {item.product?.disk_type || "SSD"}, Graphics:{" "}
                            {item.product?.graphics || "No"}, OS:{" "}
                            {item.product?.os || "Windows 11 Pro"}
                          </div>
                          <br />

                          <div style={itemTitleStyle}>
                            <strong>Asset IDs:</strong> {deviceIds.join(", ")}
                          </div>
                        </td>

                        <td style={{ padding: "8px", verticalAlign: "top", width: "40%" }}>
                          <div
                            style={{
                              width: "100%",
                              minHeight: "100px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "6px",
                              fontSize: "12px",
                              lineHeight: "1.5",
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              textAlign: "left",
                              boxSizing: "border-box",
                            }}
                          >
                          </div>
                        </td>



                      </tr>
                    );
                  })}
              </tbody>
            </table>


            {/* Footer Info */}
            <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {grnData.customer?.pan_no || "FGHIJ6789L"}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {grnData.customer?.gst || "29AADCG2606Q1Z6"}
              </div>
            </div>

            {/* Description */}
            <div style={totalLabelStyle}>
              <strong>Description:</strong>{" "}
              {grnData.description || "Goods return note"}
            </div>

            {/* Signature Section */}
            <div style={signatureSectionStyle}>
              <div style={leftSignatureAreaStyle}>
                <div style={jurisdictionNoteStyle}>
                  Note: Subjected to Bengaluru Jurisdiction
                </div>
                <table style={signatureTableStyle}>
                  <tbody>
                    <tr>
                      <td style={signatureTableHeaderStyle}>Return Address</td>
                      <td style={signatureTableHeaderStyle}>
                        Receiver Date and Signature
                      </td>
                    </tr>
                    <tr>
                      <td style={signatureTableCellStyle}>
                        {grnData.customer?.first_name}{" "}
                        {grnData.customer?.last_name},
                        <br />
                        {grnData.customer?.address?.street &&
                          `${grnData.customer.address.street}, `}
                        {grnData.customer?.address?.city &&
                          `${grnData.customer.address.city}, `}
                        {grnData.customer?.address?.state &&
                          `${grnData.customer.address.state}`}
                        <br />
                        {grnData.customer?.address?.country &&
                          `${grnData.customer.address.country} - `}
                        {grnData.customer?.address?.pincode}
                      </td>
                      <td style={signatureTableCellStyle}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreditNoteDialog = ({ open, onClose, creditNoteData }) => {
  if (!creditNoteData) return null;

  const isSameMonth = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
    );
  };

  // Set the flag
  const sameMonthFlag = isSameMonth(
    creditNoteData.dc_date,
    creditNoteData.returned_date
  );

  // Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate days between returned_date and rental_end_date using 30-day months
  const calculateDaysDifference = (returnedDate, rentalEndDate) => {
    if (!returnedDate || !rentalEndDate) return 0;

    const ret = new Date(returnedDate);
    const end = new Date(rentalEndDate);

    let retDay = ret.getDate();
    let retMonth = ret.getMonth(); // 0-based
    let retYear = ret.getFullYear();

    let endDay = end.getDate();
    let endMonth = end.getMonth();
    let endYear = end.getFullYear();

    // 🔹 Force day = 30 if it's 31 (normalize to 30/360 convention)
    if (retDay === 31) retDay = 30;
    if (endDay === 31) endDay = 30;

    // 🔹 Convert to total "billing days"
    const totalRetDays = retYear * 360 + retMonth * 30 + retDay;
    const totalEndDays = endYear * 360 + endMonth * 30 + endDay;

    // Inclusive difference (+1)
    return Math.abs(totalEndDays - totalRetDays) + 1;
  };


  // Calculate item prices based on days difference
  const calculateItemPrices = (items) => {
    const returnedDate = new Date(creditNoteData.returned_date);

    // Calculate end of returnedDate's month
    const endOfMonth = new Date(
      returnedDate.getFullYear(),
      returnedDate.getMonth() + 1,
      0
    );

    const monthStartDate = new Date(
      returnedDate.getFullYear(),
      returnedDate.getMonth(),
      1
    );

    // Calculate days used (from 1st July to 20th July 2025 = 20 days)
    const daysUsed = sameMonthFlag
      ? calculateDaysDifference(creditNoteData.dc_date, returnedDate)
      : calculateDaysDifference(monthStartDate, returnedDate);

    // Calculate day difference
    const daysDifference = calculateDaysDifference(returnedDate, endOfMonth);

    return items.map((item) => {
      const unitPrice = parseFloat(item.unit_price || 0);
      const dailyRate = Math.round((unitPrice / 30) * 100) / 100;
      const totalPrice =
        Math.round(daysDifference * item.quantity * dailyRate * 100) / 100;

      return {
        ...item,
        days: daysDifference,
        daily_rate: dailyRate,
        total_price: totalPrice,
        daysUsed,
        monthStartDate,
        returnedDate,
        endOfMonth,
      };
    });
  };

  const itemsWithCalculatedPrices = calculateItemPrices(
    creditNoteData.items || []
  );

  // Calculate tax values (assuming 9% GST split into CGST and SGST)
  const subtotal = itemsWithCalculatedPrices.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );

  const cgstRate = 0.09; // 9%
  const sgstRate = 0.09; // 9%
  const cgst = subtotal * cgstRate;
  const sgst = subtotal * sgstRate;
  const totalTax = cgst + sgst;
  const grandTotal = subtotal + totalTax;

  // Format currency for Indian Rupees
  const formatINRCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("₹", "₹ ");
  };

  // Format currency without symbol
  const formatINRCurrency1 = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the credit note container element
      const element = document.getElementById("credit-note-container");

      if (!element) {
        throw new Error("Could not find credit note element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`credit-note-${creditNoteData.credit_note_number || "CN"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("credit-note-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the credit note content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Credit Note - ${creditNoteData.credit_note_number || "CN"
      }</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Credit Note Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="credit-note-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    CIN: U72200KA2008PTC047679
                    <br />
                    GST: {creditNoteData.customer?.gst || "29AADCG2608Q1Z6"}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>CREDIT NOTE</div>
                <div style={challanDetailsStyle}>
                  Credit Note No: {creditNoteData.credit_note_number}
                  <br />
                  {creditNoteData.transaction_type === "Asset Swap" ? (
                    <>
                      Scrap Date:{" "}
                      {new Date(
                        creditNoteData.returned_date
                      ).toLocaleDateString("en-GB")}
                    </>
                  ) : (
                    <>
                      Return Date:{" "}
                      {new Date(
                        creditNoteData.returned_date
                      ).toLocaleDateString("en-GB")}
                    </>
                  )}
                  <br />
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>To</div>
                  {creditNoteData.customer_name}
                  <br />
                  {creditNoteData.customer?.company_name &&
                    `${creditNoteData.customer.company_name}, `}
                  {creditNoteData.customer?.address?.street &&
                    `${creditNoteData.customer.address.street}, `}
                  {creditNoteData.customer?.address?.city},{" "}
                  {creditNoteData.customer?.address?.state},
                  <br />
                  {creditNoteData.customer?.address?.country} -{" "}
                  {creditNoteData.customer?.address?.pincode}
                  <br />
                  <br />
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Contact No:</div>
                    {creditNoteData.customer?.phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>PAN:</div>
                    {creditNoteData.pan ||
                      creditNoteData.customer?.pan_no ||
                      "N/A"}
                  </div>

                  {/* <div>
                    <div style={detailLabelStyle}>Payment Type:</div>
                    {creditNoteData.payment_type}
                  </div> */}
                  <div>
                    <div style={detailLabelStyle}>Industry:</div>
                    {creditNoteData.industry}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Email:</div>
                    {creditNoteData.email}
                  </div>
                  {/* <div>
                    <div style={detailLabelStyle}>Created By:</div>
                    {creditNoteData.created_by}
                  </div> */}
                </div>
              </div>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>Product Details</th>
                  <th style={tableHeaderQtyStyle}>QTY</th>
                  <th style={tableHeaderQtyStyle}>Days</th>
                  <th style={tableHeaderQtyStyle}>Daily Rate</th>
                  <th style={tableHeaderQtyStyle}>Total</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithCalculatedPrices.map((item, index) => (
                  <tr
                    key={item.id}
                    style={
                      index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                    }
                  >
                    <td style={tableCellCenterStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>
                      <div style={productNameStyle}>{item.product_name}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#555",
                          textAlign: "justify",
                          lineHeight: "1.4",
                        }}
                      >
                        Specifications:{" "}
                        {item.product?.brand && (
                          <>
                            <strong>Brand:</strong> {item.product.brand}.{" "}
                          </>
                        )}
                        {item.product?.model && (
                          <>
                            <strong>Model:</strong> {item.product.model}.{" "}
                          </>
                        )}
                        {item.product?.processor && (
                          <>
                            <strong>Processor:</strong> {item.product.processor}
                            .{" "}
                          </>
                        )}
                        {item.product?.ram && (
                          <>
                            <strong>RAM:</strong> {item.product.ram}.{" "}
                          </>
                        )}
                        <br />
                        {item.product?.storage && (
                          <>
                            <strong>Storage:</strong> {item.product.storage}.{" "}
                          </>
                        )}
                        {item.product?.disk_type && (
                          <>
                            <strong>Disk Type:</strong> {item.product.disk_type}
                            .{" "}
                          </>
                        )}
                        {item.product?.graphics && (
                          <>
                            <strong>Graphics:</strong> {item.product.graphics}.{" "}
                          </>
                        )}
                        {item.product?.os && (
                          <>
                            <strong>OS:</strong> {item.product.os}.{" "}
                          </>
                        )}
                      </div>
                      {item.device_ids?.length > 0 && (
                        <>
                          <div style={itemTitleStyle}>
                            <br />
                            Asset IDs: {item.device_ids.join(", ")}
                          </div>
                          <div>
                            <br />
                            Used for {item.daysUsed} days{" "}
                            {formatDate(item.returnedDate)} to{" "}
                            {formatDate(item.endOfMonth)}
                          </div>
                        </>
                      )}
                    </td>
                    <td style={tableCellCenterStyle}>{item.quantity}</td>
                    <td style={tableCellCenterStyle}>{item.days}</td>
                    <td style={tableCellRightStyle}>
                      {formatINRCurrency1(item.daily_rate || 0)}
                    </td>
                    <td style={tableCellRightStyle}>
                      {formatINRCurrency1(item.total_price || 0)}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr style={totalsRowStyle}>
                  <td colSpan={5} style={tableCellRightStyle}>
                    <strong>TOTAL</strong>
                  </td>
                  <td style={tableCellRightStyle}>
                    {formatINRCurrency1(subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tax and Total Section */}
            <div style={taxTotalContainerStyle}>
              <div style={taxDetailsStyle}>
                <div style={taxRowStyle}>
                  <span>Subtotal:</span>
                  <span>{formatINRCurrency1(subtotal)}</span>
                </div>

                <div style={taxRowStyle}>
                  <span>CGST @9%:</span>
                  <span>{formatINRCurrency1(cgst)}</span>
                </div>
                <div style={taxRowStyle}>
                  <span>SGST @9%:</span>
                  <span>{formatINRCurrency1(sgst)}</span>
                </div>
                <div style={taxRowTotalStyle}>
                  <span>Total Tax:</span>
                  <span>₹ {formatINRCurrency1(totalTax)}</span>
                </div>

                <div style={grandTotalStyle}>
                  <span>Grand Total:</span>
                  <span>₹ {formatINRCurrency1(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div style={bankDetailsContainerStyle}>
              <div style={bankDetailsTitleStyle}>Bank Details:</div>
              <div style={bankLineStyle}>
                Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar
                Branch.
              </div>
              <div style={bankLineStyle}>
                Current A/c No: 50200066787843, IFSC Code: HDFC0000261
              </div>

              <div style={amountWordsStyle}>
                Amt. in Words: <span>{numberToWords(grandTotal)}</span>
              </div>

              <div style={jurisdictionNoteStyle}>
                Note:{" "}
                <span style={highlightTextStyle}>
                  Subject to Bengaluru Jurisdiction
                </span>
              </div>
            </div>

            {/* Signature Section */}
            <div style={signatureSectionStyle}>
              {/* Left: Receiver Signature */}
              <div style={leftSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}></div>
                <div style={signatureBoxStyle}></div>
                <div style={signatureDesignationStyle}>
                  {" "}
                  Receiver Signature with Seal
                </div>
              </div>

              {/* Right: Authorised Signatory */}
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

//25-08-2025

// const CreditNoteDialog = ({ open, onClose, creditNoteData }) => {
//   if (!creditNoteData) return null;

//   const isSameMonth = (date1, date2) => {
//     if (!date1 || !date2) return false;
//     const d1 = new Date(date1);
//     const d2 = new Date(date2);
//     return (
//       d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
//     );
//   };

//   // Set the flag
//   const sameMonthFlag = isSameMonth(
//     creditNoteData.dc_date,
//     creditNoteData.returned_date
//   );

//   // Debug / output

//   // Helper functions
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Calculate days between returned_date and rental_end_date
//   const calculateDaysDifference = (returnedDate, rentalEndDate) => {
//     if (!returnedDate || !rentalEndDate) return 0;

//     const ret = new Date(returnedDate);
//     const end = new Date(rentalEndDate);

//     // Extract day, month, year
//     const retDay = ret.getDate();
//     const retMonth = ret.getMonth(); // 0-based
//     const retYear = ret.getFullYear();

//     const endDay = end.getDate();
//     const endMonth = end.getMonth();
//     const endYear = end.getFullYear();

//     // Convert to total "billing days" using 30-day months and 360-day years
//     const totalRetDays = retYear * 360 + retMonth * 30 + retDay;
//     const totalEndDays = endYear * 360 + endMonth * 30 + endDay;

//     // Inclusive difference (+1)
//     return Math.abs(totalEndDays - totalRetDays) + 1;
//   };

//   // Calculate item prices based on days difference
//   const calculateItemPrices = (items) => {
//     const returnedDate = new Date(creditNoteData.returned_date);

//     // Calculate end of returnedDate's month
//     const endOfMonth = new Date(
//       returnedDate.getFullYear(),
//       returnedDate.getMonth() + 1,
//       0
//     );

//     const monthStartDate = new Date(
//       returnedDate.getFullYear(),
//       returnedDate.getMonth(),
//       1
//     );

//     // Calculate days used (from 1st July to 20th July 2025 = 20 days)
//     const daysUsed = sameMonthFlag
//       ? calculateDaysDifference(creditNoteData.dc_date, returnedDate)
//       : calculateDaysDifference(monthStartDate, returnedDate);

//     // Calculate day difference
//     const daysDifference = Math.ceil(
//       (endOfMonth - returnedDate) / (1000 * 60 * 60 * 24)
//     );

//     return items.map((item) => {
//       const unitPrice = parseFloat(item.unit_price || 0);
//       const dailyRate = unitPrice / 30;
//       const totalPrice = daysDifference * item.quantity * dailyRate;

//       return {
//         ...item,
//         days: daysDifference,
//         daily_rate: dailyRate,
//         total_price: totalPrice,
//         daysUsed,
//         monthStartDate,
//         returnedDate,
//         endOfMonth,
//       };
//     });
//   };

//   const itemsWithCalculatedPrices = calculateItemPrices(
//     creditNoteData.items || []
//   );

//   // Calculate tax values (assuming 9% GST split into CGST and SGST)
//   const subtotal = itemsWithCalculatedPrices.reduce(
//     (sum, item) => sum + (item.total_price || 0),
//     0
//   );

//   const cgstRate = 0.09; // 9%
//   const sgstRate = 0.09; // 9%
//   const cgst = subtotal * cgstRate;
//   const sgst = subtotal * sgstRate;
//   const totalTax = cgst + sgst;
//   const grandTotal = subtotal + totalTax;

//   // Format currency for Indian Rupees
//   const formatINRCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })
//       .format(amount)
//       .replace("₹", "₹ ");
//   };

//   // Format currency without symbol
//   const formatINRCurrency1 = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   const handleDownloadPDF = () => {
//     const input = document.getElementById("credit-note-container");

//     html2canvas(input, {
//       scale: 2,
//       logging: false,
//       useCORS: true,
//       allowTaint: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`credit-note-${creditNoteData.credit_note_number}.pdf`);
//     });
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>Credit Note Details</DialogTitle>
//       <DialogContent>
//         <div style={containerStyle}>
//           <div id="credit-note-container" style={receiptContainerStyle}>
//             {/* Header Color Bar */}
//             <div style={headerBarStyle}></div>

//             {/* Company Header */}
//             <div style={companyHeaderStyle}>
//               <div style={companyInfoContainerStyle}>
//                 <div style={logoStyle}>
//                   <img
//                     src="/SORT-ICON.png"
//                     alt="Company Logo"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <div style={companyNameStyle}>
//                     Guru Goutam Infotech Pvt. Ltd.
//                   </div>
//                   <div style={companyDetailsStyle}>
//                     CIN: U72200KA2008PTC047679
//                     <br />
//                     GST: {creditNoteData.customer?.gst || "29AADCG2608Q1Z6"}
//                   </div>
//                 </div>
//               </div>
//               <div style={challanHeaderStyle}>
//                 <div style={challanTitleStyle}>CREDIT NOTE</div>
//                 <div style={challanDetailsStyle}>
//                   Credit Note No: {creditNoteData.credit_note_number}
//                   <br />
//                   Return Date:{" "}
//                   {new Date(creditNoteData.returned_date).toLocaleDateString(
//                     "en-GB"
//                   )}
//                   <br />
//                 </div>
//               </div>
//             </div>

//             {/* Recipient Section */}
//             <div style={recipientSectionStyle}>
//               <div style={recipientContainerStyle}>
//                 <div style={recipientAddressStyle}>
//                   <div style={recipientLabelStyle}>To</div>
//                   {creditNoteData.customer_name}
//                   <br />
//                   {creditNoteData.customer?.company_name &&
//                     `${creditNoteData.customer.company_name}, `}
//                   {creditNoteData.customer?.address?.street &&
//                     `${creditNoteData.customer.address.street}, `}
//                   {creditNoteData.customer?.address?.city},{" "}
//                   {creditNoteData.customer?.address?.state},
//                   <br />
//                   {creditNoteData.customer?.address?.country} -{" "}
//                   {creditNoteData.customer?.address?.pincode}
//                   <br />
//                   <br />
//                 </div>
//                 <div style={recipientDetailsGridStyle}>
//                   <div>
//                     <div style={detailLabelStyle}>Contact No:</div>
//                     {creditNoteData.customer?.phone_number}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>PAN:</div>
//                     {creditNoteData.pan ||
//                       creditNoteData.customer?.pan_no ||
//                       "N/A"}
//                   </div>

//                   <div>
//                     <div style={detailLabelStyle}>Payment Type:</div>
//                     {creditNoteData.payment_type}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Industry:</div>
//                     {creditNoteData.industry}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Email:</div>
//                     {creditNoteData.email}
//                   </div>
//                   <div>
//                     <div style={detailLabelStyle}>Created By:</div>
//                     {creditNoteData.created_by}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <table style={tableStyle}>
//               <thead>
//                 <tr>
//                   <th style={tableHeaderNoStyle}>NO.</th>
//                   <th style={tableHeaderParticularsStyle}>Product Details</th>
//                   <th style={tableHeaderQtyStyle}>QTY</th>
//                   <th style={tableHeaderQtyStyle}>Days</th>
//                   <th style={tableHeaderQtyStyle}>Daily Rate</th>
//                   <th style={tableHeaderQtyStyle}>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {itemsWithCalculatedPrices.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     style={
//                       index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
//                     }
//                   >
//                     <td style={tableCellCenterStyle}>{index + 1}</td>
//                     <td style={tableCellStyle}>
//                       <div style={productNameStyle}>{item.product_name}</div>
//                       <div
//                         style={{
//                           fontSize: "12px",
//                           color: "#555",
//                           textAlign: "justify",
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         Specifications:{" "}
//                         {item.product?.brand && (
//                           <>
//                             <strong>Brand:</strong> {item.product.brand}.{" "}
//                           </>
//                         )}
//                         {item.product?.model && (
//                           <>
//                             <strong>Model:</strong> {item.product.model}.{" "}
//                           </>
//                         )}
//                         {item.product?.processor && (
//                           <>
//                             <strong>Processor:</strong> {item.product.processor}
//                             .{" "}
//                           </>
//                         )}
//                         {item.product?.ram && (
//                           <>
//                             <strong>RAM:</strong> {item.product.ram}.{" "}
//                           </>
//                         )}
//                         <br />
//                         {item.product?.storage && (
//                           <>
//                             <strong>Storage:</strong> {item.product.storage}.{" "}
//                           </>
//                         )}
//                         {item.product?.disk_type && (
//                           <>
//                             <strong>Disk Type:</strong> {item.product.disk_type}
//                             .{" "}
//                           </>
//                         )}
//                         {item.product?.graphics && (
//                           <>
//                             <strong>Graphics:</strong> {item.product.graphics}.{" "}
//                           </>
//                         )}
//                         {item.product?.os && (
//                           <>
//                             <strong>OS:</strong> {item.product.os}.{" "}
//                           </>
//                         )}
//                       </div>
//                       {item.device_ids?.length > 0 && (
//                         <>
//                           <div style={itemTitleStyle}>
//                             <br />
//                             Asset IDs: {item.device_ids.join(", ")}
//                           </div>
//                           <div>
//                             <br />
//                             Used for {item.daysUsed} days{" "}
//                             {formatDate(item.returnedDate)} to{" "}
//                             {formatDate(item.endOfMonth)}
//                           </div>
//                         </>
//                       )}
//                     </td>
//                     <td style={tableCellCenterStyle}>{item.quantity}</td>
//                     <td style={tableCellCenterStyle}>{item.days}</td>
//                     <td style={tableCellRightStyle}>
//                       {formatINRCurrency1(item.daily_rate || 0)}
//                     </td>
//                     <td style={tableCellRightStyle}>
//                       {formatINRCurrency1(item.total_price || 0)}
//                     </td>
//                   </tr>
//                 ))}

//                 {/* Total Row */}
//                 <tr style={totalsRowStyle}>
//                   <td colSpan={5} style={tableCellRightStyle}>
//                     <strong>TOTAL</strong>
//                   </td>
//                   <td style={tableCellRightStyle}>
//                     {formatINRCurrency1(subtotal)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Tax and Total Section */}
//             <div style={taxTotalContainerStyle}>
//               <div style={taxDetailsStyle}>
//                 <div style={taxRowStyle}>
//                   <span>Subtotal:</span>
//                   <span>{formatINRCurrency1(subtotal)}</span>
//                 </div>

//                 <div style={taxRowStyle}>
//                   <span>CGST @9%:</span>
//                   <span>{formatINRCurrency1(cgst)}</span>
//                 </div>
//                 <div style={taxRowStyle}>
//                   <span>SGST @9%:</span>
//                   <span>{formatINRCurrency1(sgst)}</span>
//                 </div>
//                 <div style={taxRowTotalStyle}>
//                   <span>Total Tax:</span>
//                   <span>₹ {formatINRCurrency1(totalTax)}</span>
//                 </div>

//                 <div style={grandTotalStyle}>
//                   <span>Grand Total:</span>
//                   <span>₹ {formatINRCurrency1(grandTotal)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Bank Details Section */}
//             <div style={bankDetailsContainerStyle}>
//               <div style={bankDetailsTitleStyle}>Bank Details:</div>
//               <div style={bankLineStyle}>
//                 Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar Branch
//               </div>
//               <div style={bankLineStyle}>
//                 Current A/c No: 50200066787843. &nbsp;&nbsp; IFSC Code:
//                 HDFC0000261
//               </div>

//               <div style={amountWordsStyle}>
//                 Amt. in Words: <span>{numberToWords(grandTotal)}</span>
//               </div>

//               <div style={jurisdictionNoteStyle}>
//                 Note:{" "}
//                 <span style={highlightTextStyle}>
//                   Subject to Bengaluru Jurisdiction
//                 </span>
//               </div>
//             </div>

//             {/* Signature Section */}
//             <div style={signatureSectionStyle}>
//               {/* Left: Receiver Signature */}
//               <div style={leftSignatureAreaStyle}>
//                 <div style={companySignatureLabelStyle}></div>
//                 <div style={signatureBoxStyle}></div>
//                 <div style={signatureDesignationStyle}>
//                   {" "}
//                   Receiver Signature with Seal
//                 </div>
//               </div>

//               {/* Right: Authorised Signatory */}
//               <div style={rightSignatureAreaStyle}>
//                 <div style={companySignatureLabelStyle}>
//                   For Guru Goutham Infotech Private Limited
//                 </div>
//                 <div style={signatureBoxStyle}>SD/-</div>
//                 <div style={signatureDesignationStyle}>
//                   Authorised Signatory
//                 </div>
//               </div>
//             </div>

//             {/* Company Footer */}
//             <div style={companyFooterStyle}>
//               <div style={footerAddressStyle}>
//                 <span>📍</span>
//                 <span>
//                   No. 8, 2nd Cross, Diagonal Road, 3rd Block,
//                   <br />
//                   Jayanagar Bengaluru-560011.
//                 </span>
//               </div>
//               <div style={footerContactStyle}>
//                 <div style={footerContactItemStyle}>
//                   <span>🌐</span>
//                   <span>gurugoutam.com</span>
//                 </div>
//                 <div style={footerContactItemStyle}>
//                   <span>📞</span>
//                   <span>080-2242 9955, +91 9449 0789 55</span>
//                 </div>
//                 <div style={footerContactItemStyle}>
//                   <span>✉️</span>
//                   <span>info@gurugoutam.com</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//         <Button onClick={handleDownloadPDF} variant="contained" color="primary">
//           Download PDF
//         </Button>
//         <Button onClick={() => window.print()}>Print</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

const formatINRCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatINRCurrency1 = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const numberToWords = (amount) => {
  const number = Math.floor(amount);
  const decimal = Math.round((amount - number) * 100);

  let result = `${capitalize(numWords(number))} Rupees `;
  if (decimal > 0) {
    result += ` and ${capitalize(numWords(decimal))} Paise`;
  }
  return result + " Only.";
};

const capitalize = (text) =>
  text.replace(/\b\w/g, (char) => char.toUpperCase());

// Invoices Dialog Component

// Invoices Dialog Component
// Invoices Dialog Component
// const InvoiceDialog = ({ open, onClose, invoiceData }) => {
//   if (!invoiceData) return null;

//   const invoiceType = invoiceData.type || "current";
//   const isBuyTransaction = invoiceData.transaction_type === "Buy";

//   // Use invoice dates instead of rental dates
//   const invoiceStartDate = new Date(invoiceData.invoice_start_date);
//   const invoiceDate = new Date(invoiceData.invoice_date);

//   const dcDate = new Date(invoiceData.dc_date);
//   const showDcPeriod = dcDate.getDate() !== 1; // Only show if not 1st of month

//   const invoiceEndDate = new Date(invoiceData.invoice_end_date);
//   const previousDeliveredStartDate = new Date(
//     invoiceData.previous_delivered_start_date
//   );
//   const previousDeliveredEndDate = new Date(
//     invoiceData.previous_delivered_end_date
//   );
//   const creditNoteStartDate = (() => {
//     const firstItem = invoiceData.items[0];
//     if (!firstItem) return null;

//     const date = new Date(firstItem.returned_date);
//     return isNaN(date.getTime()) ? null : date;
//   })();

//   const creditNoteEndDate = creditNoteStartDate
//     ? new Date(
//         creditNoteStartDate.getFullYear(),
//         creditNoteStartDate.getMonth() + 1,
//         0
//       )
//     : null;

//   // Calculate date ranges based on invoice dates
//   const currentMonthStart = new Date(
//     invoiceStartDate.getFullYear(),
//     invoiceStartDate.getMonth(),
//     1
//   );
//   const currentMonthEnd = new Date(
//     invoiceStartDate.getFullYear(),
//     invoiceStartDate.getMonth() + 1,
//     0
//   );

//   // Calculate next month dates
//   const nextMonthStart = new Date(
//     invoiceStartDate.getFullYear(),
//     invoiceStartDate.getMonth() + 1,
//     1
//   );
//   const nextMonthEnd = new Date(
//     nextMonthStart.getFullYear(),
//     nextMonthStart.getMonth() + 1,
//     0
//   );

//   // Helper functions
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const isSameMonth = (date1, date2) => {
//     return (
//       date1 &&
//       date2 &&
//       new Date(date1).getMonth() === new Date(date2).getMonth() &&
//       new Date(date1).getFullYear() === new Date(date2).getFullYear()
//     );
//   };

//   const calculateInvoiceItems = () => {
//     return invoiceData.items
//       ?.map((item) => {
//         const invoiceType = invoiceData.type || "current";

//         // Common data
//         const rate = isBuyTransaction
//           ? Number(item.productDetails?.purchase_price || 0)
//           : Number(item.unit_price) || 0;

//         const dailyRate = isBuyTransaction ? 0 : rate / 30; // Only relevant for rental

//         const addedDate = item.added_date ? new Date(item.added_date) : null;
//         const returnedDate = item.returned_date
//           ? new Date(item.returned_date)
//           : null;

//         const isReturnInSameMonth = isSameMonth(returnedDate, invoiceStartDate);
//         const safeReturnQty = isReturnInSameMonth
//           ? Number(item.return_quantity) || 0
//           : 0;

//         const calculateDays = (startDate, endDate) => {
//           if (!startDate || !endDate || isBuyTransaction) return 0;

//           const start = new Date(startDate);
//           const end = new Date(endDate);

//           // If start is 1st and end is last day of month, return 30
//           const isFullMonth =
//             start.getDate() === 1 &&
//             (end.getDate() === 30 ||
//               end.getDate() === 31 ||
//               (end.getMonth() === 1 &&
//                 (end.getDate() === 28 || end.getDate() === 29)));

//           if (isFullMonth) return 30;

//           const diffTime = Math.abs(end - start);
//           return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // +1 to include both days
//         };

//         const getReturnEndDate = () => {
//           switch (invoiceType) {
//             case "previous":
//               return previousDeliveredEndDate;
//             case "current":
//               return invoiceEndDate;
//             case "next":
//               return nextMonthEnd;
//             case "credit":
//               return returnedDate
//                 ? new Date(
//                     returnedDate.getFullYear(),
//                     returnedDate.getMonth() + 1,
//                     0
//                   )
//                 : invoiceEndDate; // fallback to something safe
//             default:
//               return invoiceEndDate;
//           }
//         };

//         const getReturnStartDate = () => {
//           switch (invoiceType) {
//             case "previous":
//               return previousDeliveredStartDate;
//             case "current":
//               return invoiceDate;
//             case "next":
//               return nextMonthStart;
//             case "credit":
//               return returnedDate || invoiceStartDate; // Use returned date or fallback
//             default:
//               return invoiceStartDate;
//           }
//         };

//         const creditNoteEndDate = new Date(getReturnEndDate());

//         // Return days (only for rental)
//         const returnQtyDays =
//           !isBuyTransaction && returnedDate
//             ? calculateDays(returnedDate, getReturnEndDate())
//             : 0;

//         const creditReturnDays =
//           !isBuyTransaction && returnedDate
//             ? calculateDays(returnedDate, getReturnStartDate())
//             : 0;

//         // Added (new) device days (only for rental)
//         let newQtyDays = 0;
//         if (!isBuyTransaction && addedDate) {
//           const endOfAddedMonth = new Date(
//             addedDate.getFullYear(),
//             addedDate.getMonth() + 1,
//             0
//           );
//           newQtyDays = calculateDays(addedDate, endOfAddedMonth);
//         }

//         // Init result variables
//         let quantity = 0;
//         let days = 0;
//         let amount = 0;
//         let description = "";
//         let deviceIds = [];
//         let PrevQty = 0;
//         let NextQty = 0;
//         let CreditNoteQty = 0;
//         let returnedQtyAmount = 0;
//         let currentNewQtyAmount = 0;
//         let currentReturnedAmount = 0;
//         let currentFinalQty = 0;
//         let usedAmount = 0;
//         let dcAmount = 0;

//         let dcPeriodEnd = 0;
//         let dcDays = 0;

//         if (showDcPeriod) {
//           dcPeriodEnd = new Date(
//             dcDate.getFullYear(),
//             dcDate.getMonth() + 1,
//             0
//           );
//           dcDays =
//             Math.ceil((dcPeriodEnd - dcDate) / (1000 * 60 * 60 * 24));
//         }

//         if (isBuyTransaction) {
//           // Handle Buy transaction type
//           quantity = Number(item.quantity) || 0;
//           amount = quantity * rate;
//           description = `Purchase of ${quantity} Qty ${
//             item.product_name
//           } at ${rate.toFixed(2)} each`;
//           deviceIds = item.device_ids || [];
//         } else {
//           // Handle Rent transaction type (original logic)
//           switch (invoiceType) {
//             case "previous":
//               quantity = Number(item.previous_quantity) || 0;
//               PrevQty = quantity;
//               days = calculateDays(
//                 previousDeliveredStartDate,
//                 previousDeliveredEndDate
//               );
//               amount = quantity * dailyRate * days;
//               description = `Billing Start Date: ${formatDate(
//                 previousDeliveredStartDate
//               )} - Billing End Date: ${formatDate(previousDeliveredEndDate)}`;
//               deviceIds = item.device_ids || [];
//               break;

//             case "current":
//               const currentbaseQty = Number(item.previous_quantity) || 0;
//               const currentnewQty = Number(item.new_quantity) || 0;
//               const currentreturnQty = safeReturnQty;

//               usedAmount = currentreturnQty * dailyRate * creditReturnDays;

//               quantity = currentbaseQty;
//               currentFinalQty = quantity;
//               days = calculateDays(invoiceStartDate, invoiceEndDate);
//               currentNewQtyAmount = dailyRate;
//               currentReturnedAmount = dailyRate;
//               dcAmount = dailyRate * quantity * dcDays;

//               amount = quantity * dailyRate * days;
//               deviceIds = [
//                 ...(item.device_ids || []),
//                 ...(item.new_device_ids || []),
//               ].filter((id) =>
//                 isReturnInSameMonth
//                   ? !(item.returned_device_ids || []).includes(id)
//                   : true
//               );

//               description = `Billing Start Date: ${formatDate(
//                 invoiceStartDate
//               )} - Billing End Date: ${formatDate(invoiceEndDate)}`;
//               break;

//             case "next":
//               const baseQty = Number(item.previous_quantity) || 0;
//               const newQty = Number(item.new_quantity) || 0;
//               const returnQty =
//                 item.return_quantity != null
//                   ? Number(item.return_quantity)
//                   : "-";

//               quantity = baseQty + newQty - returnQty;
//               NextQty = quantity;
//               days = calculateDays(nextMonthStart, nextMonthEnd);
//               const mainAmount = quantity * rate;
//               const newQtyAmount = newQty * dailyRate * newQtyDays;
//               returnedQtyAmount = returnQty * dailyRate * creditReturnDays;
//               amount = mainAmount + newQtyAmount;
//               description = `Billing Start Date: ${formatDate(
//                 nextMonthStart
//               )} - Billing End Date: ${formatDate(nextMonthEnd)}`;
//               deviceIds = [
//                 ...(item.device_ids || []),
//                 ...(item.new_device_ids || []),
//               ];
//               break;

//             case "credit":
//               quantity =
//                 item.return_quantity != null
//                   ? Number(item.return_quantity)
//                   : "-";
//               CreditNoteQty = quantity;

//               if (quantity > 0 && returnedDate) {
//                 days = returnQtyDays;
//                 amount = quantity * dailyRate * days;
//                 description = `Credit for returned devices ${returnQtyDays} Days (${formatDate(
//                   returnedDate
//                 )} to ${formatDate(creditNoteEndDate)})`;
//                 deviceIds = item.returned_device_ids || [];
//               }
//               break;

//             default:
//               break;
//           }
//         }

//         return {
//           ...item,
//           quantity,
//           PrevQty,
//           NextQty,
//           CreditNoteQty,
//           days,
//           dcDays,
//           amount,
//           description,
//           deviceIds,
//           rate,
//           total: amount,
//           newQtyDays,
//           returnQtyDays,
//           returnedQtyAmount,
//           creditReturnDays,
//           currentNewQtyAmount,
//           currentReturnedAmount,
//           currentFinalQty,
//           usedAmount,
//           dcAmount,
//         };
//       })
//       .filter((item) => item.amount > 0 || item.quantity > 0);
//   };

//   const items = calculateInvoiceItems();
//   const totalReturnedAmount = items.reduce(
//     (sum, item) => sum + (item.returnedQtyAmount || 0),
//     0
//   );
//   const totalAmount = items.reduce((sum, item) => sum + item.amount + item.dcAmount, 0);

//   const finalTotalAmount = items.reduce((sum, item) => sum + item.amount, 0);

//   const renderInvoice = () => {
//     const isCreditNote = invoiceType === "credit";
//     const title =
//       invoiceType === "current"
//         ? "Current Month Invoice"
//         : invoiceType === "next"
//         ? "Next Month Projection"
//         : invoiceType === "previous"
//         ? "Previous Month Invoice"
//         : "Return Credit Note";

//     const cgst = totalAmount * 0.09;
//     const sgst = totalAmount * 0.09;
//     const totalTax = cgst + sgst;
//     const grandTotal = totalAmount + totalTax;

//     const transformedItems = items.flatMap((item) => {
//       const assetIds = Array.isArray(item.deviceIds) ? item.deviceIds : [];

//       return assetIds.map((assetId) => ({
//         ...item,
//         singleAssetId: assetId,
//         days: item.days || 0,
//         perDay: item.rate / 30,
//         totalAmount: ((item.rate / 30) * item.days).toFixed(2),
//       }));
//     });

//     const calculateDaysBetweenDates = (startDate, endDate) => {
//       const diffTime = Math.abs(endDate - startDate);
//       return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
//     };

//     return (
//       <div
//         className="invoice-container"
//         style={receiptContainerStyle}
//         id={`invoice-${
//           invoiceType === "current"
//             ? "current-month-invoice"
//             : invoiceType === "next"
//             ? "next-month-projection"
//             : "return-credit-note"
//         }`}
//       >
//         {/* Header and company info */}
//         <div style={headerBarStyle}></div>
//         <div style={companyHeaderStyle}>
//           <div style={companyInfoContainerStyle}>
//             <div style={logoStyle}>
//               <img
//                 src="/SORT-ICON.png"
//                 alt="Company Logo"
//                 style={{ width: "100%", height: "100%", objectFit: "contain" }}
//               />
//             </div>
//             <div>
//               <div style={companyNameStyle}>Guru Goutam Infotech Pvt. Ltd.</div>
//               <div style={companyDetailsStyle}>
//                 CIN: U72200KA2008PTC047679
//                 <br />
//                 GST: {invoiceData.customer_gst_number || "29AADCG2608Q1Z6"}
//               </div>
//             </div>
//           </div>
//           <div style={challanHeaderStyle}>
//             <div style={challanTitleStyle}>
//               {isCreditNote ? "CREDIT NOTE" : "TAX INVOICE"}
//             </div>
//             <div style={challanDetailsStyle}>
//               {isCreditNote ? "Credit Note No." : "Invoice No"}:{" "}
//               {invoiceData.invoice_number}
//               <br />
//               Invoice Date:{" "}
//               {invoiceType === "credit"
//                 ? formatDate(
//                     invoiceData?.items?.find((item) => item.returned_date)
//                       ?.returned_date || invoiceEndDate
//                   )
//                 : invoiceType === "next"
//                 ? formatDate(nextMonthStart)
//                 : formatDate(invoiceDate)}
//             </div>
//           </div>
//         </div>

//         {/* Recipient Section */}
//         <div style={recipientSectionStyle}>
//           <div style={recipientContainerStyle}>
//             <div style={recipientAddressStyle}>
//               <div style={recipientLabelStyle}>Bill To</div>
//               {invoiceData.customer_name}
//               <br />
//               {invoiceData.shippingDetail?.street &&
//                 `${invoiceData.shippingDetail.street}, `}
//               {invoiceData.shippingDetail?.landmark &&
//                 `${invoiceData.shippingDetail.landmark}, `}
//               {invoiceData.shippingDetail?.city},{" "}
//               {invoiceData.shippingDetail?.state}
//               <br />
//               {invoiceData.shippingDetail?.country} -{" "}
//               {invoiceData.shippingDetail?.pincode}
//             </div>
//             <div style={recipientDetailsGridStyle}>
//               <div>
//                 <div style={detailLabelStyle}>Customer GST :</div>
//                 {invoiceData.customer_gst_number}
//               </div>
//               <div>
//                 <div style={detailLabelStyle}>PAN Number :</div>
//                 {invoiceData.pan_number}
//               </div>
//               <div>
//                 <div style={detailLabelStyle}>PO Number :</div>
//                 {invoiceData.purchase_order_number}
//               </div>
//               <div>
//                 <div style={detailLabelStyle}>PO Date :</div>
//                 {invoiceData.purchase_order_date}
//               </div>
//               <div>
//                 <div style={detailLabelStyle}>Email :</div>
//                 {invoiceData.email}
//               </div>
//               <div>
//                 <div style={detailLabelStyle}>Phone :</div>
//                 {invoiceData.phone_number}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Invoice Period */}

//         {!isBuyTransaction && (
//           <>
//             <div style={invoicePeriodStyle}>
//               {invoiceType === "previous" && (
//                 <div>
//                   <strong>Previous Invoice Period:</strong>{" "}
//                   {formatDate(previousDeliveredStartDate)} to{" "}
//                   {formatDate(previousDeliveredEndDate)}
//                 </div>
//               )}
//               {invoiceType === "current" && (
//                 <div>
//                   <strong>Invoice Period:</strong> {formatDate(invoiceDate)} to{" "}
//                   {formatDate(invoiceEndDate)}
//                 </div>
//               )}
//               {invoiceType === "next" && (
//                 <div>
//                   <strong>Next Month Period:</strong>{" "}
//                   {formatDate(nextMonthStart)} to {formatDate(nextMonthEnd)}
//                 </div>
//               )}

//             </div>
//           </>
//         )}

//         <table style={tableStyle}>
//   <thead>
//     <tr>
//       <th style={tableHeaderNoStyle}>NO.</th>
//       <th style={tableHeaderParticularsStyle}>Product Details</th>

//       {invoiceType === "credit" && <th style={tableHeaderQtyStyle}></th>}
//       {invoiceType !== "credit" && <th style={tableHeaderQtyStyle}>Qty</th>}
//       {invoiceType === "credit" && (
//         <th style={tableHeaderQtyStyle}>Return Qty</th>
//       )}

//       {(invoiceType === "credit" ||
//         invoiceType === "next" ||
//         invoiceType === "previous" ||
//         invoiceType === "current") && (
//         <>
//           <th style={tableHeaderDaysStyle}>Days</th>
//           <th style={tableHeaderDaysStyle}>Per Day</th>
//         </>
//       )}

//       {invoiceType !== "credit" && (
//         <th style={tableHeaderRateStyle}>
//           {isBuyTransaction ? "Purchase Amount" : "Per Month"}
//         </th>
//       )}
//       <th style={tableHeaderRateStyle}>TOTAL</th>
//     </tr>
//   </thead>

//   <tbody>
//     {items.map((item, index) => {
//       const showCurrentDays =
//         invoiceType === "current" ||
//         invoiceType === "next" ||
//         invoiceType === "previous";

//       const assetLabel =
//         invoiceType === "credit" ? "Returned Asset IDs:" : "Asset IDs:";

//       const assetIds =
//         invoiceType === "next"
//           ? item.remaining_device_ids
//           : invoiceType === "credit"
//           ? item.returned_device_ids
//           : item.device_ids;

//       const validIds = (assetIds || []).filter(
//         (id) =>
//           typeof id === "string" &&
//           id.trim() &&
//           !id.startsWith("[") &&
//           !id.endsWith("]")
//       );

//       return (
//         <React.Fragment key={item.id}>
//           <tr
//             style={index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle}
//           >
//             <td style={tableCellCenterStyle}>{index + 1}</td>

//             <td style={tableCellStyle}>
//               <div style={itemTitleStyle}>{item.product_name}</div>
//               <div style={{ marginTop: 4, fontSize: "10px", color: "#555" }}>
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     color: "#555",
//                     textAlign: "justify",
//                     lineHeight: "1.4",
//                   }}
//                 >
//                   Specifications:{" "}
//                   {item.productDetails?.brand && (
//                     <>
//                       <strong>Brand:</strong> {item.productDetails.brand}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.model && (
//                     <>
//                       <strong>Model:</strong> {item.productDetails.model}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.processor && (
//                     <>
//                       <strong>Processor:</strong>{" "}
//                       {item.productDetails.processor}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.ram && (
//                     <>
//                       <strong>RAM:</strong> {item.productDetails.ram}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.storage && (
//                     <>
//                       <strong>Storage:</strong>{" "}
//                       {item.productDetails.storage}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.disk_type && (
//                     <>
//                       <strong>Disk Type:</strong>{" "}
//                       {item.productDetails.disk_type}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.graphics && (
//                     <>
//                       <strong>Graphics:</strong>{" "}
//                       {item.productDetails.graphics}.{" "}
//                     </>
//                   )}
//                   {item.productDetails?.os && (
//                     <>
//                       <strong>OS:</strong> {item.productDetails.os}.{" "}
//                     </>
//                   )}
//                 </div>
//               </div>
//               <br />

//               {validIds.length > 0 && (
//                 <div style={itemTitleStyle}>
//                   {assetLabel} {validIds.join(", ")}
//                 </div>
//               )}
//               <br />
//               <div style={itemTitleStyle}>{item.description}</div>
//             </td>

//             {invoiceType !== "credit" && (
//               <td style={tableCellCenterStyle}>{item.quantity || 0}</td>
//             )}

//             {invoiceType === "credit" && (
//               <>
//                 <td style={tableCellCenterStyle}></td>
//                 <td style={tableCellCenterStyle}>
//                   {item.return_quantity || "-"}
//                 </td>
//                 <td style={tableCellCenterStyle}>{item.returnQtyDays}</td>
//                 <td style={tableCellRightStyle}>
//                   {formatINRCurrency(item.rate / 30)}
//                 </td>
//               </>
//             )}

//             {showCurrentDays && (
//               <>
//                 <td style={tableCellCenterStyle}>
//                   {item.days > 0 && <div>{item.days}</div>}
//                   {item.newQtyDays > 0 && <div>{item.newQtyDays}</div>}
//                 </td>
//                 <td style={tableCellCenterStyle}>
//                   {formatINRCurrency(item.rate / 30)}
//                 </td>
//               </>
//             )}

//             {invoiceType !== "credit" && (
//               <td style={tableCellRightStyle}>
//                 {formatINRCurrency(item.rate)}
//               </td>
//             )}

//             <td style={tableCellRightStyle}>
//               {formatINRCurrency(item.amount)}
//             </td>
//           </tr>

//           {/* 🔸 MID-MONTH (DC) USAGE ROW */}
//           {invoiceType === "current" &&
//   showDcPeriod &&
//   item.dcAmount > 0 && (
//     <tr
//       key={`dc-${item.id}`}
//       style={
//         index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
//       }
//     >
//       <td style={tableCellCenterStyle}></td>
//       <td style={tableCellStyle}>
//         <strong style={{ color: "#333" }}>Mid-Month Usage</strong><br />
//         From {formatDate(dcDate)} to {formatDate(
//           new Date(dcDate.getFullYear(), dcDate.getMonth() + 1, 0)
//         )}
//       </td>
//       <td style={tableCellCenterStyle}>{item.quantity}</td>
//       <td style={tableCellCenterStyle}>{item.dcDays}</td>
//       <td style={tableCellCenterStyle}>
//         {formatINRCurrency(item.rate / 30)}
//       </td>
//       <td style={tableCellRightStyle}></td>
//       <td style={tableCellRightStyle}>
//         {formatINRCurrency(item.dcAmount)}
//       </td>
//     </tr>
//   )}

//         </React.Fragment>
//       );
//     })}

//     {/* Totals Row */}
//     <tr style={totalsRowStyle}>
//       <td style={tableCellCenterStyle} colSpan={2}>
//         <strong>TOTAL</strong>
//       </td>

//       {invoiceType !== "credit" && <td></td>}
//       {invoiceType === "credit" && (
//         <>
//           <td></td>
//           <td></td>
//         </>
//       )}
//       {(invoiceType === "credit" ||
//         invoiceType === "next" ||
//         invoiceType === "previous" ||
//         invoiceType === "current") && (
//         <>
//           <td></td>
//           <td></td>
//         </>
//       )}
//       {invoiceType !== "credit" && <td></td>}

//       <td style={tableCellRightStyle}>
//         {formatINRCurrency(totalAmount)}
//       </td>
//     </tr>
//   </tbody>
// </table>

//         {/* Tax and Total Section */}
//         <div style={taxTotalContainerStyle}>
//           <div style={taxDetailsStyle}>
//             <div style={taxRowStyle}>
//               <span>Subtotal:</span>
//               <span>{formatINRCurrency(totalAmount)}</span>
//             </div>

//             <div style={taxRowStyle}>
//               <span>CGST @9%:</span>
//               <span>{formatINRCurrency(cgst)}</span>
//             </div>
//             <div style={taxRowStyle}>
//               <span>SGST @9%:</span>
//               <span>{formatINRCurrency(sgst)}</span>
//             </div>
//             <div style={taxRowTotalStyle}>
//               <span>Total Tax:</span>
//               <span>{formatINRCurrency(totalTax)}</span>
//             </div>

//             <div style={grandTotalStyle}>
//               <span>
//                 {invoiceType === "credit" ? "Credit Amount" : "Grand Total"}:
//               </span>
//               <span>{formatINRCurrency(grandTotal)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Bank Details Section */}
//         <div style={bankDetailsContainerStyle}>
//           <div style={bankDetailsTitleStyle}>Bank Details:</div>
//           <div style={bankLineStyle}>
//             Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar Branch
//           </div>
//           <div style={bankLineStyle}>
//             Current A/c No: 50200066787843. &nbsp;&nbsp; IFSC Code: HDFC0000261.
//           </div>

//           <div style={amountWordsStyle}>
//             Amt. in Words: <span>{numberToWords(grandTotal)}</span>
//           </div>

//           <div style={jurisdictionNoteStyle}>
//             Note:{" "}
//             <span style={highlightTextStyle}>
//               Subject to Bengaluru Jurisdiction
//             </span>
//           </div>
//         </div>

//         {/* Signature Section */}
//         <div style={signatureSectionStyle}>
//           {/* Left: Receiver Signature */}
//           <div style={leftSignatureAreaStyle}>
//             <div style={companySignatureLabelStyle}></div>
//             <div style={signatureBoxStyle}></div>
//             <div style={signatureDesignationStyle}>
//               {" "}
//               Receiver Signature with Seal
//             </div>
//           </div>

//           {/* Right: Authorised Signatory */}
//           <div style={rightSignatureAreaStyle}>
//             <div style={companySignatureLabelStyle}>
//               For Guru Goutham Infotech Private Limited
//             </div>
//             <div style={signatureBoxStyle}>SD/-</div>
//             <div style={signatureDesignationStyle}>Authorised Signatory</div>
//           </div>
//         </div>

//         {/* Company Footer */}
//         <div style={companyFooterStyle}>
//           <div style={footerAddressStyle}>
//             <span>📍</span>
//             <span>
//               No. 8, 2nd Cross, Diagonal Road, 3rd Block,
//               <br />
//               Jayanagar Bengaluru-560011.
//             </span>
//           </div>
//           <div style={footerContactStyle}>
//             <div style={footerContactItemStyle}>
//               <span>🌐</span>
//               <span>gurugoutam.com</span>
//             </div>
//             <div style={footerContactItemStyle}>
//               <span>📞</span>
//               <span>080-2242 9955, +91 9449 0789 55</span>
//             </div>
//             <div style={footerContactItemStyle}>
//               <span>✉️</span>
//               <span>info@gurugoutam.com</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Handle PDF download
//   // Handle PDF download
//   const handleDownloadPDF = async () => {
//     try {
//       // Wait for dialog to fully render
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const title =
//         invoiceType === "current"
//           ? "current-month-invoice"
//           : invoiceType === "next"
//           ? "next-month-projection"
//           : invoiceType === "previous"
//           ? "previous-month-invoice"
//           : "return-credit-note";

//       // Try multiple selectors to find the invoice element
//       const element =
//         document.getElementById(`invoice-${title}`) ||
//         document.querySelector(".MuiDialog-paper .invoice-container");

//       if (!element) {
//         throw new Error("Could not find invoice element in DOM");
//       }

//       // Create a clone for PDF generation to avoid layout issues
//       const clone = element.cloneNode(true);
//       clone.style.position = "absolute";
//       clone.style.left = "-9999px";
//       clone.style.visibility = "visible";
//       clone.style.width = "210mm";
//       document.body.appendChild(clone);

//       const options = {
//         scale: 2,
//         logging: true,
//         useCORS: true,
//         scrollX: 0,
//         scrollY: 0,
//         windowWidth: clone.scrollWidth,
//         windowHeight: clone.scrollHeight,
//         backgroundColor: "#FFFFFF",
//       };

//       const canvas = await html2canvas(clone, options);
//       document.body.removeChild(clone);

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");

//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       // Handle multi-page PDF
//       let heightLeft = pdfHeight;
//       let position = 0;
//       const pageHeight = pdf.internal.pageSize.getHeight();

//       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - pdfHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`invoice-${invoiceData.invoice_number}.pdf`);
//     } catch (error) {
//       console.error("PDF Generation Error:", error);
//       alert(`Failed to generate PDF: ${error.message}`);
//     }
//   };

//   const handlePrint = () => {
//     const title =
//       invoiceType === "current"
//         ? "current-month-invoice"
//         : invoiceType === "next"
//         ? "next-month-projection"
//         : invoiceType === "previous"
//         ? "previous-month-invoice"
//         : "return-credit-note";

//     const element = document.getElementById(`invoice-${title}`);

//     if (!element) {
//       console.error("Print element not found");
//       return;
//     }

//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>${title}</title>
//           <style>
//             @page { size: A4; margin: 0; }
//             body { margin: 0; padding: 0; }
//             .print-container {
//               width: 210mm;
//               min-height: 297mm;
//               padding: 10mm;
//               box-sizing: border-box;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-container">
//             ${element.innerHTML}
//           </div>
//           <script>
//             window.onload = function() {
//               setTimeout(function() {
//                 window.print();
//                 window.close();
//               }, 300);
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       scroll="paper"
//       TransitionProps={{
//         onEntered: () => {
//           // Ensures content is rendered before PDF/print
//         },
//       }}
//     >
//       <DialogTitle>
//         {invoiceType === "current"
//           ? "Invoice"
//           : invoiceType === "next"
//           ? "Next Month Invoice"
//           : invoiceType === "previous"
//           ? "Previous Month Invoice"
//           : "Return Credit Note"}
//       </DialogTitle>
//       <DialogContent>
//         <div style={{ padding: "20px" }}>{renderInvoice()}</div>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//         <Button onClick={handlePrint} variant="contained" color="secondary">
//           Print
//         </Button>
//         <Button
//           onClick={handleDownloadPDF}
//           variant="contained"
//           color="primary"
//           style={{ marginLeft: "10px" }}
//         >
//           Download PDF
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// Invoices Dialog Component

const InvoiceDialog = ({ open, onClose, invoiceData }) => {
  if (!invoiceData) return null;

  const invoiceType = invoiceData.type;
  const isBuyTransaction = invoiceData.transaction_type === "Buy";
  const isRentTransaction = invoiceData.transaction_type === "Rent";
  const startDate = new Date(invoiceData.invoice_date);
  const invoiceDate = new Date(invoiceData.invoice_start_date);
  const paymentMode = invoiceData.payment_mode === "Postpaid";
  const isKarnataka = invoiceData.shippingDetail?.state === "Karnataka";

  const dcDate123 = new Date(invoiceData.dc_date);
  const invoiceDateOnly = new Date(invoiceData.invoice_date);

  const sameMonth =
    dcDate123.getMonth() === invoiceDateOnly.getMonth() &&
    dcDate123.getFullYear() === invoiceDateOnly.getFullYear();

  // Helper: same month & year check
  const isSameMonthYear = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  const hasSameMonthReturn =
    // Check direct credit_notes array
    invoiceData.credit_notes?.some((note) => {
      if (!note.returned_date) return false;
      return isSameMonthYear(
        new Date(invoiceData.dc_date),
        new Date(note.returned_date)
      );
    }) ||
    // Check inside additional_delivery_challans
    invoiceData.additional_delivery_challans?.some((challan) =>
      challan.credit_notes?.some((note) => {
        if (!note.returned_date) return false;
        return isSameMonthYear(
          new Date(challan.dc_date || invoiceData.dc_date),
          new Date(note.returned_date)
        );
      })
    ) ||
    false;

  const hasMonthDifference = invoiceData.credit_notes?.some((creditNote) => {
    if (!creditNote.returned_date) return false;

    const returnDate = new Date(creditNote.returned_date);
    const monthDiff =
      (invoiceDate.getFullYear() - returnDate.getFullYear()) * 12 +
      (invoiceDate.getMonth() - returnDate.getMonth());

    return monthDiff >= 1;
  });

  // Date calculations
  const invoiceStartDate = new Date(invoiceData.invoice_start_date);
  const dcDate = new Date(invoiceData.dc_date);
  const invoiceEndDate = new Date(invoiceData.invoice_end_date);
  const dcPeriodEnd = new Date(dcDate.getFullYear(), dcDate.getMonth() + 1, 0);

  const hasCreditNoteReturnedDate =
    // Check direct credit_notes array
    invoiceData.credit_notes?.some((note) => !!note.returned_date) ||
    // Check each additional_delivery_challan's credit_notes
    invoiceData.additional_delivery_challans?.some((challan) =>
      challan.credit_notes?.some((note) => !!note.returned_date)
    );

  // Count all DC dates (main + additional)
  function countAllDcDates(invoiceData) {
    if (!invoiceData) return 0;

    const mainDcCount = 1; // Always 1 main DC
    const additionalDcsCount =
      invoiceData.additional_delivery_challans?.length || 0;

    return mainDcCount + additionalDcsCount;
  }

  // Usage:
  const dcDatesCount = countAllDcDates(invoiceData);

  // Calculate month difference between invoice start date and DC date
  const monthDiff =
    (invoiceStartDate.getFullYear() - dcDate.getFullYear()) * 12 +
    (invoiceStartDate.getMonth() - dcDate.getMonth());

  // Check for special case conditions
  const hasAdditionalChallans =
    invoiceData.additional_delivery_challans?.length > 0;
  let additionalChallanMonthDiff = 0;

  if (hasAdditionalChallans) {
    const additionalChallanDate = new Date(
      invoiceData.additional_delivery_challans[0].dc_date
    );
    additionalChallanMonthDiff =
      (invoiceStartDate.getFullYear() - additionalChallanDate.getFullYear()) *
      12 +
      (invoiceStartDate.getMonth() - additionalChallanDate.getMonth());
  }

  const hasSameMonthChallan =
    hasAdditionalChallans && additionalChallanMonthDiff === 0;
  const hasPrevMonthChallan =
    hasAdditionalChallans && additionalChallanMonthDiff === 1;
  const specialCase =
    paymentMode &&
    monthDiff === 0 &&
    (hasSameMonthChallan || hasPrevMonthChallan);

  // Only show DC period if exactly 0 or 1 month difference and not starting on 1st
  const showDcPeriod =
    (monthDiff === 1 || monthDiff === 0) && dcDate.getDate() !== 1;

  // Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Utility: always 30 days per month, 360 days per year
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let startDay = Math.min(start.getDate(), 30);
    let endDay = Math.min(end.getDate(), 30);

    // ✅ If endDate is last day of the month → treat as 30
    const lastDayOfMonth = new Date(
      end.getFullYear(),
      end.getMonth() + 1,
      0
    ).getDate();
    if (end.getDate() === lastDayOfMonth) {
      endDay = 30;
    }

    const totalStartDays =
      start.getFullYear() * 360 + start.getMonth() * 30 + startDay;
    const totalEndDays = end.getFullYear() * 360 + end.getMonth() * 30 + endDay;

    return totalEndDays - totalStartDays + 1;
  };

  const calculateReturnDays = (returnDate) => {
    const returnDateObj = new Date(returnDate);

    // Find the matching dc_date for this return
    let matchedDcDate = null;

    // Check main credit_notes
    invoiceData.credit_notes?.forEach((note) => {
      if (note.returned_date === returnDate) {
        matchedDcDate = new Date(invoiceData.dc_date);
      }
    });

    // Check additional_delivery_challans credit_notes
    if (!matchedDcDate) {
      invoiceData.additional_delivery_challans?.forEach((challan) => {
        challan.credit_notes?.forEach((note) => {
          if (note.returned_date === returnDate) {
            matchedDcDate = new Date(challan.dc_date || invoiceData.dc_date);
          }
        });
      });
    }

    // Fallback to invoice dc_date if no match found
    if (!matchedDcDate) {
      matchedDcDate = new Date(invoiceData.dc_date);
    }

    // Calculate days based on hasSameMonthReturn logic
    if (hasSameMonthReturn) {
      // Same month: calculate days between dc_date and return_date
      const diffTime = Math.abs(returnDateObj - matchedDcDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      // Different month: calculate days from start of return month to return_date
      const startOfMonth = new Date(
        returnDateObj.getFullYear(),
        returnDateObj.getMonth(),
        1
      );
      const diffTime = Math.abs(returnDateObj - startOfMonth);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
    }
  };

  let finalCondition = false;

  invoiceData.additional_delivery_challans?.forEach((challan) => {
    const challanDate = new Date(challan.dc_date);
    const mainDcDate = new Date(invoiceData.dc_date);
    const invoiceStartDate = new Date(invoiceData.invoice_start_date);

    const dcMonthDiff =
      (mainDcDate.getFullYear() - challanDate.getFullYear()) * 12 +
      (mainDcDate.getMonth() - challanDate.getMonth());

    const isSameMonthBetweenDCs = dcMonthDiff === 0;

    const dcToInvoiceMonthDiff =
      (invoiceStartDate.getFullYear() - mainDcDate.getFullYear()) * 12 +
      (invoiceStartDate.getMonth() - mainDcDate.getMonth());

    if (isSameMonthBetweenDCs && dcToInvoiceMonthDiff === 1) {
      finalCondition = true;
    }
  });

  const calculateInvoiceItems = () => {
    // Step 1: Preprocess returned devices from all sources (root and additional challans)
    const allReturnsMap = {};
    const allSwapsMap = {}; // New map for asset swaps

    // Process root credit notes
    invoiceData.credit_notes?.forEach((cn) => {
      const returnedDate = new Date(cn.returned_date);
      const dcDate = new Date(cn.dc_date || invoiceData.dc_date);

      cn.items?.forEach((ri) => {
        const key = `${ri.product_id}`;
        if (!allReturnsMap[key]) allReturnsMap[key] = [];

        const returnedStartDate = new Date(
          returnedDate.getFullYear(),
          returnedDate.getMonth(),
          1
        );

        const daysUsed = hasSameMonthReturn
          ? calculateDays(dcDate, returnedDate)
          : calculateDays(returnedStartDate, returnedDate);

        const dailyRate = invoiceData.items?.find(
          (item) => item.product_id === ri.product_id
        )
          ? Number(
            invoiceData.items.find(
              (item) => item.product_id === ri.product_id
            ).unit_price
          ) / 30
          : 0;

        allReturnsMap[key].push({
          returnedDate,
          daysUsed,
          deviceIds: ri.device_ids,
          amount: parseFloat(
            (daysUsed * dailyRate * ri.device_ids.length).toFixed(2)
          ),
          source: "root",
          dcDate: dcDate,
        });
      });
    });

    // Process asset swaps (similar to credit notes)
    invoiceData.asset_swaps?.forEach((swap) => {
      const swappedDate = new Date(swap.swapped_on);
      const dcDate = new Date(invoiceData.dc_date); // Use main invoice DC date

      const key = `${swap.product_id}`;
      if (!allSwapsMap[key]) allSwapsMap[key] = [];

      const swappedStartDate = new Date(
        swappedDate.getFullYear(),
        swappedDate.getMonth(),
        1
      );

      const sameMonth = isSameMonthYear(dcDate, swappedDate);

      const daysUsed = sameMonth
        ? calculateDays(dcDate, swappedDate)
        : calculateDays(swappedStartDate, swappedDate);

      const dailyRateSource =
        invoiceData.items?.find((item) => item.product_id === swap.product_id)?.unit_price ||
        swap.rent_price_per_month ||
        0;

      const dailyRate = Number(dailyRateSource) / 30;

      allSwapsMap[key].push({
        swappedDate,
        daysUsed,
        deviceIds: [swap.asset_id], // Single device per swap
        amount: parseFloat((daysUsed * dailyRate).toFixed(2)),
        source: "root",
        dcDate: dcDate,
        reason: swap.reason,
        newDeviceIds: swap.new_device_ids || [], // If you have new device IDs
      });
    });

    // Process additional delivery challans' credit notes
    invoiceData.additional_delivery_challans?.forEach((challan) => {
      const challanDcDate = new Date(challan.dc_date);

      challan.credit_notes?.forEach((cn) => {
        const returnedDate = new Date(cn.returned_date);

        cn.items?.forEach((ri) => {
          const key = `${ri.product_id}`;
          if (!allReturnsMap[key]) allReturnsMap[key] = [];

          const returnedStartDate = new Date(
            returnedDate.getFullYear(),
            returnedDate.getMonth(),
            1
          );

          const daysUsed = hasSameMonthReturn
            ? calculateDays(challanDcDate, returnedDate)
            : calculateDays(returnedStartDate, returnedDate);

          const dailyRate = challan.items?.find(
            (item) => item.product_id === ri.product_id
          )
            ? Number(
              challan.items.find((item) => item.product_id === ri.product_id)
                .unit_price
            ) / 30
            : 0;

          allReturnsMap[key].push({
            returnedDate,
            daysUsed,
            dailyRate,
            deviceIds: ri.device_ids,
            amount: parseFloat(
              (daysUsed * dailyRate * ri.device_ids.length).toFixed(2)
            ),
            source: "additional",
            dcDate: challanDcDate,
          });
        });
      });

      // Process additional delivery challans' asset swaps if they exist
      challan.asset_swaps?.forEach((swap) => {
        const swappedDate = new Date(swap.swapped_on);

        const key = `${swap.product_id}`;
        if (!allSwapsMap[key]) allSwapsMap[key] = [];

        const swappedStartDate = new Date(
          swappedDate.getFullYear(),
          swappedDate.getMonth(),
          1
        );

        const daysUsed = hasSameMonthReturn
          ? calculateDays(challanDcDate, swappedDate)
          : calculateDays(swappedStartDate, swappedDate);

        const dailyRate = challan.items?.find(
          (item) => item.product_id === swap.product_id
        )
          ? Number(
            challan.items.find((item) => item.product_id === swap.product_id)
              .unit_price
          ) / 30
          : 0;

        allSwapsMap[key].push({
          swappedDate,
          daysUsed,
          deviceIds: [swap.asset_id],
          amount: parseFloat((daysUsed * dailyRate).toFixed(2)),
          source: "additional",
          dcDate: challanDcDate,
          reason: swap.reason,
          newDeviceIds: swap.new_device_ids || [],
        });
      });
    });

    // Step 2: Gather all returned device IDs (from all sources)
    const allReturnedDeviceIds = Object.values(allReturnsMap).flatMap((arr) =>
      arr.flatMap((r) => r.deviceIds)
    );

    // Gather all swapped device IDs (from all sources)
    const allSwappedDeviceIds = Object.values(allSwapsMap).flatMap((arr) =>
      arr.flatMap((s) => s.deviceIds)
    );

    // Step 3: Process main invoice items
    const mainItems =
      invoiceData.items?.map((item) => {
        const rate = isBuyTransaction
          ? Number(item.total_price) || 0
          : Number(item.unit_price) || 0;
        const dailyRate = rate / 30;

        const originalDeviceIds = item.device_ids || [];
        const hasDeviceIds = originalDeviceIds.length > 0;

        const baseQuantity = hasDeviceIds
          ? originalDeviceIds.length
          : item.quantity || 0;

        let days;
        if (specialCase) {
          days = calculateDays(dcDate, invoiceEndDate);
        } else if (sameMonth) {
          days = calculateDays(dcDate, invoiceEndDate);
        } else {
          days = calculateDays(invoiceStartDate, invoiceEndDate);
        }

        const isFullMonth = isBuyTransaction ? true : days >= 28;

        // Get returns for this product from all sources
        const returnedDevices =
          allReturnsMap[item.product_id]?.filter(
            (rd) => new Date(rd.returnedDate) <= invoiceEndDate
          ) || [];

        // Get swaps for this product from all sources
        const swappedDevices =
          allSwapsMap[item.product_id]?.filter(
            (sd) => new Date(sd.swappedDate) <= invoiceEndDate
          ) || [];

        // Filter out pre-invoice returns
        const preInvoiceReturnedDeviceIds = returnedDevices
          .filter((rd) => new Date(rd.returnedDate) < invoiceStartDate)
          .flatMap((rd) => rd.deviceIds);

        // Filter out pre-invoice swaps
        const preInvoiceSwappedDeviceIds = swappedDevices
          .filter((sd) => new Date(sd.swappedDate) < invoiceStartDate)
          .flatMap((sd) => sd.deviceIds);

        let effectiveDeviceIds = [];
        let effectiveQty = baseQuantity;

        if (hasDeviceIds) {
          effectiveDeviceIds = originalDeviceIds.filter(
            (id) =>
              !preInvoiceReturnedDeviceIds.includes(id) &&
              !preInvoiceSwappedDeviceIds.includes(id) &&
              !allReturnedDeviceIds.includes(id) &&
              !allSwappedDeviceIds.includes(id)
          );
          effectiveQty = effectiveDeviceIds.length;
        } else {
          // For direct invoices: subtract returned quantities
          const totalReturnedQty = returnedDevices.reduce(
            (sum, rd) => sum + (rd.quantity || 0),
            0
          );
          const totalSwappedQty = swappedDevices.reduce(
            (sum, sd) => sum + (sd.quantity || 0),
            0
          );
          effectiveQty = Math.max(
            0,
            baseQuantity - totalReturnedQty - totalSwappedQty
          );
        }

        const dcDays = calculateDays(dcDate, dcPeriodEnd);

        // Calculate amount based on payment mode
        let fullMonthAmount;
        if (paymentMode) {
          fullMonthAmount = effectiveQty * rate;
          if (!isFullMonth) {
            fullMonthAmount = effectiveQty * dailyRate * days;
          }
        } else {
          fullMonthAmount = isFullMonth
            ? effectiveQty * rate
            : effectiveQty * dailyRate * days;
        }

        const returnedDevicesAmount = returnedDevices.reduce(
          (sum, rd) => sum + rd.amount,
          0
        );

        const swappedDevicesAmount = swappedDevices.reduce(
          (sum, sd) => sum + sd.amount,
          0
        );

        const dcAmountBeforeReturns =
          showDcPeriod && !paymentMode && !isBuyTransaction
            ? effectiveQty * dailyRate * dcDays
            : 0;

        let description;

        if (specialCase) {
          days = calculateDays(dcDate, invoiceEndDate);
          description = `Billing Start Date: ${formatDate(
            dcDate
          )} to ${formatDate(invoiceEndDate)}`;
        } else if (sameMonth) {
          days = calculateDays(dcDate, invoiceEndDate);
          description = `Billing Start Date: ${formatDate(
            dcDate
          )} to ${formatDate(invoiceEndDate)}`;
        } else {
          days = calculateDays(invoiceStartDate, invoiceEndDate);
          description = `Billing Start Date: ${formatDate(
            invoiceStartDate
          )} - Billing End Date: ${formatDate(invoiceEndDate)}`;
        }

        return {
          ...item,
          originalDeviceIds,
          device_ids: effectiveDeviceIds,
          quantity: effectiveQty,
          rate,
          dailyRate,
          days,
          dcDays,
          amount: fullMonthAmount,
          dcAmountBeforeReturns,
          returnedDevices,
          swappedDevices, // Add swapped devices to the item
          totalReturnedQtyAmount: returnedDevicesAmount + swappedDevicesAmount,
          description,
          isFullMonth,
          isSpecialCase: specialCase,
        };
      }) || [];

    // Step 4: Process additional delivery challan items
    const additionalItems =
      invoiceData.additional_delivery_challans?.flatMap((challan) => {
        const challanDateObj = new Date(challan.dc_date);
        const orderSaleDateObj = new Date(challan.order_sale_date);
        const challanMonthStart = new Date(
          orderSaleDateObj.getFullYear(),
          orderSaleDateObj.getMonth(),
          1
        );

        const invoiceStartDateObj = new Date(invoiceData.invoice_start_date);
        const invoiceEndDateObj = new Date(invoiceData.invoice_end_date);

        const monthDiff =
          (invoiceStartDateObj.getFullYear() - challanDateObj.getFullYear()) *
          12 +
          (invoiceStartDateObj.getMonth() - challanDateObj.getMonth());

        return challan.items.map((item) => {
          const quantity = Number(item.quantity) || 0;
          const unit_price = quantity > 0 ? Number(item.unit_price) : 0;

          const dailyRate = unit_price / 30;
          const device_ids = item.device_ids || [];

          let days,
            amount,
            description,
            midMonthDays = 0;

          if (monthDiff === 1) {
            const deliveryMonthEnd = new Date(
              challanDateObj.getFullYear(),
              challanDateObj.getMonth() + 1,
              0
            );
            midMonthDays = calculateDays(challanDateObj, deliveryMonthEnd);
            days = calculateDays(invoiceStartDateObj, invoiceEndDateObj);
            amount =
              quantity * dailyRate * midMonthDays + quantity * unit_price;
            description = `Billing Start Date: ${formatDate(
              invoiceStartDateObj
            )} to ${formatDate(invoiceEndDate)}`;
          } else if (monthDiff === 0 && challanDateObj.getDate() !== 1) {
            days = calculateDays(challanDateObj, invoiceEndDateObj);

            amount = quantity * dailyRate * days;
            description = `Billing Start Date: ${formatDate(
              challan.dc_date
            )} to ${formatDate(invoiceEndDate)}`;
          } else {
            if (paymentMode) {
              if (
                challan.order_sale_date &&
                isSameMonthYear(invoiceStartDateObj, orderSaleDateObj)
              ) {
                days = calculateDays(challanMonthStart, orderSaleDateObj);
              }
            }
            days = calculateDays(invoiceStartDateObj, invoiceEndDateObj);

            amount = quantity * unit_price;
            description = `Billing Start Date: ${formatDate(
              invoiceStartDate
            )} - Billing End Date: ${formatDate(invoiceEndDate)}`;
          }

          // Get returns for this product from all sources
          const returnedDevices =
            allReturnsMap[item.product_id]?.filter(
              (rd) =>
                new Date(rd.returnedDate) <= invoiceEndDate &&
                rd.source === "additional"
            ) || [];

          // Get swaps for this product from all sources
          const swappedDevices =
            allSwapsMap[item.product_id]?.filter(
              (sd) =>
                new Date(sd.swappedDate) <= invoiceEndDate &&
                sd.source === "additional"
            ) || [];

          return {
            ...item,
            isAdditionalChallan: true,
            challanNumber: challan.dc_id,
            challanDate: challan.dc_date,
            device_ids,
            quantity,
            unit_price,
            rate: unit_price,
            dailyRate,
            amount,
            days,
            midMonthDays,
            description,
            productDetails: item.product,
            isFullMonth: days >= 28,
            isSpecialCase: specialCase,
            isPrevMonthDelivery: monthDiff === 1,
            shouldShowMidMonth:
              monthDiff === 1 ||
              (monthDiff === 0 && challanDateObj.getDate() !== 1),
            returnedDevices,
            swappedDevices, // Add swapped devices to additional items
          };
        });
      }) || [];

    return [...mainItems, ...additionalItems];
  };

  const items = calculateInvoiceItems();

  ///25-08-2025

  let totalAmount = 0;
  let rowCounter = 0;

  // Keep track of already-rendered Asset IDs globally for this invoice render
  let renderedAssetIds = new Set();

  // Utility to merge device IDs without duplicates
  const mergeDeviceIds = (items) => {
    const allIds = items.flatMap((i) => i.device_ids || []);
    return [...new Set(allIds)];
  };

  // Utility: calculate amount consistently
  const calculateAmount = (daysUsed, dailyRate, baseCount, monthlyRate) => {
    const roundedRate = parseFloat(dailyRate.toFixed(2));
    const rawAmount =
      daysUsed === 30
        ? monthlyRate * baseCount
        : daysUsed * roundedRate * baseCount;
    return parseFloat(rawAmount.toFixed(2));
  };

  // Render product specifications
  const renderSpecifications = (product) => {
    if (!product) return null;
    return (
      <div
        style={{
          fontSize: "12px",
          color: "#555",
          textAlign: "justify",
          lineHeight: "1.4",
        }}
      >
        Specifications:{" "}
        {product?.brand && (
          <>
            {" "}
            <strong>Brand:</strong> {product.brand}.{" "}
          </>
        )}
        {product?.model && (
          <>
            {" "}
            <strong>Model:</strong> {product.model}.{" "}
          </>
        )}
        {product?.processor && (
          <>
            {" "}
            <strong>Processor:</strong> {product.processor}.{" "}
          </>
        )}
        {product?.ram && (
          <>
            {" "}
            <strong>RAM:</strong> {product.ram}.{" "}
          </>
        )}
        {product?.storage && (
          <>
            {" "}
            <strong>Storage:</strong> {product.storage}.{" "}
          </>
        )}
        {product?.disk_type && (
          <>
            {" "}
            <strong>Disk Type:</strong> {product.disk_type}.{" "}
          </>
        )}
        {product?.graphics && (
          <>
            {" "}
            <strong>Graphics:</strong> {product.graphics}.{" "}
          </>
        )}
        {product?.os && (
          <>
            {" "}
            <strong>OS:</strong> {product.os}.{" "}
          </>
        )}
      </div>
    );
  };

  // Check if a row should be displayed
  // Check if a row should be displayed (updated)
  const shouldShowRow = (item) => {
    const hasReturnedDevices = item.returnedDevices?.some(
      (rd) => rd.deviceIds?.length > 0 || rd.quantity > 0
    );
    const hasSwappedDevices = item.swappedDevices?.some(
      (sd) => sd.deviceIds?.length > 0
    );
    return (
      item.quantity > 0 ||
      item.isAdditionalChallan ||
      hasReturnedDevices ||
      hasSwappedDevices
    );
  };
  // Render main product row
  const renderProductRow = (items, product, combinedDeviceIds) => {
    const quantity = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    if (quantity === 0 && combinedDeviceIds.length === 0) return null;

    const firstItem = items[0];
    const daysUsed = firstItem.days || 1;
    const dailyRate = firstItem.dailyRate || firstItem.rate / 30;
    const baseCount =
      combinedDeviceIds.length > 0 ? combinedDeviceIds.length : quantity;
    const amount = calculateAmount(
      daysUsed,
      dailyRate,
      baseCount,
      firstItem.rate
    );

    totalAmount += Number(amount) || 0;

    return (
      <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
        <td style={tableCellCenterStyle}>{rowCounter}</td>
        <td style={tableCellStyle}>
          <div style={itemTitleStyle}>{firstItem.product_name}</div>
          {renderSpecifications(product)}
          {combinedDeviceIds.length > 0 && (
            <>
              <br />
              <div style={itemTitleStyle}>
                Asset IDs: {combinedDeviceIds.join(", ")}
              </div>
            </>
          )}
          <br />

          {invoiceData.transaction_type === "Rent" && (
            <>
              <div style={itemTitleStyle}>{firstItem.description}</div>
            </>
          )}
        </td>
        <td style={tableCellCenterStyle}>{baseCount}</td>
        {invoiceData.transaction_type === "Rent" && (
          <>
            <td style={tableCellCenterStyle}>{daysUsed}</td>
            <td style={tableCellCenterStyle}>{formatINRCurrency(dailyRate)}</td>
          </>
        )}
        <td style={tableCellRightStyle}>{formatINRCurrency(firstItem.rate)}</td>
        <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
      </tr>
    );
  };

  const shouldRenderMidMonth = (item, isAdditionalChallan = false) => {
    // If it's an additional challan, NEVER show mid-month data
    if (isAdditionalChallan) {
      return false;
    }

    // For main invoice items only
    const challanDate = new Date(invoiceData.dc_date);
    const invoiceStartDate = new Date(invoiceData.invoice_start_date);

    // Make sure we're comparing dates correctly (set to first of month)
    const challanMonth = new Date(
      challanDate.getFullYear(),
      challanDate.getMonth(),
      1
    );
    const invoiceMonth = new Date(
      invoiceStartDate.getFullYear(),
      invoiceStartDate.getMonth(),
      1
    );

    // Calculate month difference
    const monthDiff =
      (invoiceMonth.getFullYear() - challanMonth.getFullYear()) * 12 +
      (invoiceMonth.getMonth() - challanMonth.getMonth());

    // Should be exactly 1 month difference
    if (monthDiff !== 1) return false;

    // Main invoice rule - only show mid-month for first invoice creation
    return invoiceData.times_created_in_invoice === 1;
  };

  const renderReturnedDeviceRow = (item, product, rd) => {
    if (!paymentMode && !shouldRenderMidMonth(item)) return null;

    let deviceIds = [...new Set((rd.deviceIds || []).map((id) => id.trim()))];
    deviceIds = deviceIds.filter((id) => !renderedAssetIds.has(id));
    if (deviceIds.length === 0) return null; // stop duplicate rows

    deviceIds.forEach((id) => renderedAssetIds.add(id));

    const daysUsed = rd.daysUsed || 1;
    const baseCount = deviceIds.length > 0 ? deviceIds.length : rd.quantity;
    const dailyRate = rd.dailyRate || item.dailyRate || item.rate / 30;
    const amount = calculateAmount(daysUsed, dailyRate, baseCount);

    totalAmount += Number(amount) || 0;

    return (
      <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
        <td style={tableCellCenterStyle}>{rowCounter}</td>
        <td style={tableCellStyle}>
          <div style={itemTitleStyle}>{item.product_name}</div>
          {renderSpecifications(product)}
          <br />
          <div>
            <strong>Returned Asset IDs:</strong> {deviceIds.join(", ")}
          </div>
          <br />
          <div style={itemTitleStyle}>
            Return Date: {formatDate(new Date(rd.returnedDate))}
          </div>
        </td>
        <td style={tableCellCenterStyle}>{baseCount}</td>
        {invoiceData.transaction_type === "Rent" && (
          <>
            <td style={tableCellCenterStyle}>{daysUsed}</td>
            <td style={tableCellCenterStyle}>{formatINRCurrency(dailyRate)}</td>
          </>
        )}
        <td style={tableCellRightStyle}></td>
        <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
      </tr>
    );
  };

  // Render swapped device row
  const renderSwappedDeviceRow = (item, product, sd) => {
    if (!paymentMode && !shouldRenderMidMonth(item)) {
      return null;
    }

    let deviceIds = [...new Set(sd.deviceIds || [])];
    deviceIds = deviceIds.filter((id) => !renderedAssetIds.has(id));
    deviceIds.forEach((id) => renderedAssetIds.add(id));

    if (deviceIds.length === 0) return null;

    const daysUsed = sd.daysUsed || 1;
    const baseCount = deviceIds.length;
    const dailyRate = sd.dailyRate || item.dailyRate || item.rate / 30;
    const amount = calculateAmount(daysUsed, dailyRate, baseCount, item.rate);

    totalAmount += Number(amount) || 0;

    return (
      <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
        <td style={tableCellCenterStyle}>{rowCounter}</td>
        <td style={tableCellStyle}>
          <div style={itemTitleStyle}>{item.product_name}</div>
          {renderSpecifications(product)}
          <br />
          <div>
            <strong>Swapped Asset IDs:</strong> {deviceIds.join(", ")}
          </div>

          <br />
          <div style={itemTitleStyle}>
            Swap Date: {formatDate(new Date(sd.swappedDate))}
            {sd.reason && (
              <div>
                <strong>Reason:</strong> {sd.reason}
              </div>
            )}
          </div>
        </td>
        <td style={tableCellCenterStyle}>{baseCount}</td>
        {invoiceData.transaction_type === "Rent" && (
          <>
            <td style={tableCellCenterStyle}>{daysUsed}</td>
            <td style={tableCellCenterStyle}>{formatINRCurrency(dailyRate)}</td>
          </>
        )}
        <td style={tableCellRightStyle}></td>
        <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
      </tr>
    );
  };

  ////08-09-25

  // // Determine mid-month billing
  // const shouldRenderMidMonth = (item) => {
  //   const challanDate = item.isAdditionalChallan
  //     ? new Date(item.challanDate)
  //     : new Date(invoiceData.dc_date);
  //   const invoiceStartDate = new Date(invoiceData.invoice_start_date);
  //   const monthDiff =
  //     (challanDate.getFullYear() - invoiceStartDate.getFullYear()) * 12 +
  //     (challanDate.getMonth() - invoiceStartDate.getMonth());
  //   return monthDiff === -1;
  // };

  // // Render mid-month row
  // const renderMidMonthRow = (item, product) => {
  //   if (!shouldRenderMidMonth(item)) return null;
  //   if (
  //     item.quantity === 0 &&
  //     (!item.device_ids || item.device_ids.length === 0)
  //   )
  //     return null;

  //   const deviceIds = item.device_ids || [];
  //   const baseCount = deviceIds.length > 0 ? deviceIds.length : item.quantity;

  //   const challanDate = item.isAdditionalChallan
  //     ? new Date(item.challanDate)
  //     : new Date(invoiceData.dc_date);
  //   const startDate = challanDate;
  //   const endDate = new Date(
  //     challanDate.getFullYear(),
  //     challanDate.getMonth() + 1,
  //     0
  //   );

  //   const daysUsed = calculateDays(startDate, endDate);
  //   const dailyRate = item.dailyRate || item.rate / 30;
  //   const amount = calculateAmount(daysUsed, dailyRate, baseCount);

  //   totalAmount += Number(amount) || 0;

  //   return (
  //     <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
  //       <td style={tableCellCenterStyle}>{rowCounter}</td>
  //       <td style={tableCellStyle}>
  //         <div>
  //           <strong>Mid-Month Usage:</strong>
  //         </div>
  //         <br />
  //         <div style={itemTitleStyle}>{item.product_name}</div>
  //         {renderSpecifications(product)}
  //         {deviceIds.length > 0 && (
  //           <div style={itemTitleStyle}>Asset IDs: {deviceIds.join(", ")}</div>
  //         )}
  //         <br />
  //         <div style={itemTitleStyle}>
  //           Billing Start Date: {formatDate(startDate)} to {formatDate(endDate)}
  //         </div>
  //       </td>
  //       <td style={tableCellCenterStyle}>{baseCount}</td>
  //       {invoiceData.transaction_type === "Rent" && (
  //         <>
  //           <td style={tableCellCenterStyle}>{daysUsed}</td>
  //           <td style={tableCellCenterStyle}>{formatINRCurrency(dailyRate)}</td>
  //         </>
  //       )}
  //       <td style={tableCellRightStyle}></td>
  //       <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
  //     </tr>
  //   );
  // };

  // // 🔥 Main rendering loop
  // const rows = [];
  // const groupedItems = {};

  // items.forEach((item) => {
  //   if (!shouldShowRow(item)) return;

  //   // normalize calculation inputs
  //   const daysUsed = item.isFullMonth ? 30 : item.days || 1;
  //   const dailyRate = item.dailyRate || item.rate / 30;
  //   const monthlyRate = item.rate;

  //   // 🔑 Grouping key = product + billingPeriod + amount factors
  //   const key = [
  //     item.product_name,
  //     item.billingPeriod || "full",
  //     daysUsed,
  //     dailyRate.toFixed(2),
  //     monthlyRate,
  //   ].join("_");

  //   if (!groupedItems[key]) groupedItems[key] = [];
  //   groupedItems[key].push(item);
  // });

  // Object.values(groupedItems).forEach((group) => {
  //   const product = group[0].productDetails || group[0].product;
  //   const combinedDeviceIds = mergeDeviceIds(group);

  //   // Main row
  //   const mainRow = renderProductRow(group, product, combinedDeviceIds);
  //   if (mainRow) rows.push(mainRow);

  //   // Mid-month + Returns + Swaps
  //   group.forEach((item) => {
  //     if (!isBuyTransaction && !paymentMode && showDcPeriod) {
  //       const isMidMonthItem = item.isAdditionalChallan
  //         ? new Date(item.challanDate).getDate() !== 1
  //         : item.dcAmountBeforeReturns > 0;
  //       const midRow = isMidMonthItem ? renderMidMonthRow(item, product) : null;
  //       if (midRow) rows.push(midRow);
  //     }

  //     // Returned devices
  //     item.returnedDevices?.forEach((rd) => {
  //       const retRow = renderReturnedDeviceRow(item, product, rd);
  //       if (retRow) rows.push(retRow);
  //     });

  //     // Swapped devices - NEWLY ADDED
  //     item.swappedDevices?.forEach((sd) => {
  //       const swapRow = renderSwappedDeviceRow(item, product, sd);
  //       if (swapRow) rows.push(swapRow);
  //     });
  //   });
  // });

  // -----------------------------
  // Determine if mid-month billing row should be shown
  // -----------------------------

  // -----------------------------
  // Render mid-month row
  // -----------------------------

  const renderMidMonthRow = (item, product) => {
    if (!shouldRenderMidMonth(item)) return null;
    if (
      item.quantity === 0 &&
      (!item.device_ids || item.device_ids.length === 0)
    )
      return null;

    const deviceIds = item.device_ids || [];
    const baseCount = deviceIds.length > 0 ? deviceIds.length : item.quantity;

    const challanDate = item.isAdditionalChallan
      ? new Date(item.challanDate)
      : new Date(invoiceData.dc_date);
    const startDate = challanDate;
    const endDate = new Date(
      challanDate.getFullYear(),
      challanDate.getMonth() + 1,
      0
    );

    const invoiceStartDate = new Date(invoiceData.invoice_start_date);

    // Helper to check if two dates are within 1 month
    const isWithinOneMonth = (d1, d2) => {
      const diff =
        (d2.getFullYear() - d1.getFullYear()) * 12 +
        (d2.getMonth() - d1.getMonth());
      return diff === 0 || diff === 1;
    };

    // 🚫 If not within 1 month → skip
    if (!isWithinOneMonth(startDate, invoiceStartDate)) {
      return null;
    }

    const daysUsed = calculateDays(startDate, endDate);
    const dailyRate = item.dailyRate || item.rate / 30;
    const amount = calculateAmount(daysUsed, dailyRate, baseCount);

    totalAmount += Number(amount) || 0;

    return (
      <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
        <td style={tableCellCenterStyle}>{rowCounter}</td>
        <td style={tableCellStyle}>
          <div>
            <strong>Mid-Month Usage:</strong>
          </div>
          <br />
          <div style={itemTitleStyle}>{item.product_name}</div>
          {renderSpecifications(product)}
          {deviceIds.length > 0 && (
            <div style={itemTitleStyle}>Asset IDs: {deviceIds.join(", ")}</div>
          )}
          <br />
          <div style={itemTitleStyle}>
            Billing Start Date: {formatDate(startDate)} to {formatDate(endDate)}
          </div>
        </td>
        <td style={tableCellCenterStyle}>{baseCount}</td>
        {invoiceData.transaction_type === "Rent" && (
          <>
            <td style={tableCellCenterStyle}>{daysUsed}</td>
            <td style={tableCellCenterStyle}>{formatINRCurrency(dailyRate)}</td>
          </>
        )}
        <td style={tableCellRightStyle}></td>
        <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
      </tr>
    );
  };

  // -----------------------------
  // 🔥 Main rendering loop
  // -----------------------------
  const rows = [];
  const groupedItems = {};

  // Group items
  items.forEach((item) => {
    if (!shouldShowRow(item)) return;

    const daysUsed = item.isFullMonth ? 30 : item.days || 1;
    const dailyRate = item.dailyRate || item.rate / 30;
    const monthlyRate = item.rate;

    const key = [
      item.product_name,
      item.billingPeriod || "full",
      daysUsed,
      dailyRate.toFixed(2),
      monthlyRate,
    ].join("_");

    if (!groupedItems[key]) groupedItems[key] = [];
    groupedItems[key].push(item);
  });

  // Render grouped items
  Object.values(groupedItems).forEach((group) => {
    const product = group[0].productDetails || group[0].product;
    const combinedDeviceIds = mergeDeviceIds(group);

    // Main row
    const mainRow = renderProductRow(group, product, combinedDeviceIds);
    if (mainRow) rows.push(mainRow);

    // Mid-month + Returns + Swaps
    group.forEach((item) => {
      if (!isBuyTransaction && !paymentMode && showDcPeriod) {
        const midRow = renderMidMonthRow(item, product);
        if (midRow) rows.push(midRow);
      }

      // Returned devices
      item.returnedDevices?.forEach((rd) => {
        const retRow = renderReturnedDeviceRow(item, product, rd);
        if (retRow) rows.push(retRow);
      });

      // Swapped devices
      item.swappedDevices?.forEach((sd) => {
        const swapRow = renderSwappedDeviceRow(item, product, sd);
        if (swapRow) rows.push(swapRow);
      });
    });
  });

  // // 🔥 Main rendering loop
  // const rows = [];
  // const groupedItems = {};
  // items.forEach((item) => {
  //   if (!shouldShowRow(item)) return;
  //   const key = `${item.product_name}_${item.billingPeriod || "full"}`;
  //   if (!groupedItems[key]) groupedItems[key] = [];
  //   groupedItems[key].push(item);
  // });

  // Object.values(groupedItems).forEach((group) => {
  //   const product = group[0].productDetails || group[0].product;
  //   const combinedDeviceIds = mergeDeviceIds(group);

  //   // Main row
  //   const mainRow = renderProductRow(group, product, combinedDeviceIds);
  //   if (mainRow) rows.push(mainRow);

  //   // Mid-month + Returns
  //   group.forEach((item) => {
  //     if (!isBuyTransaction && !paymentMode && showDcPeriod) {
  //       const isMidMonthItem = item.isAdditionalChallan
  //         ? new Date(item.challanDate).getDate() !== 1
  //         : item.dcAmountBeforeReturns > 0;
  //       const midRow = isMidMonthItem ? renderMidMonthRow(item, product) : null;
  //       if (midRow) rows.push(midRow);
  //     }

  //     item.returnedDevices?.forEach((rd) => {
  //       const retRow = renderReturnedDeviceRow(item, product, rd);
  //       if (retRow) rows.push(retRow);
  //     });
  //   });
  // });

  // Taxes
  const netAmount = totalAmount;
  let cgst = isKarnataka ? netAmount * 0.09 : 0;
  let sgst = isKarnataka ? netAmount * 0.09 : 0;
  let igst = isKarnataka ? 0 : netAmount * 0.18;
  let totalTax = cgst + sgst + igst;
  const grandTotal = netAmount + totalTax;

  // let totalAmount = 0;
  // let rowCounter = 0;

  // // Utility to merge device IDs without duplicates
  // const mergeDeviceIds = (items) => {
  //   const allIds = items.flatMap((i) => i.device_ids || []);
  //   return [...new Set(allIds)];
  // };

  // // Utility to sum quantities
  // const sumQuantities = (items) =>
  //   items.reduce((acc, i) => acc + (i.quantity || 0), 0);

  // // Utility to sum amounts
  // const sumAmounts = (items) =>
  //   items.reduce((acc, i) => {
  //     const amount = i.isFullMonth
  //       ? i.rate * i.quantity
  //       : i.dailyRate * i.quantity * (i.days || 1);
  //     return acc + (Number(amount) || 0);
  //   }, 0);

  // // Render product specifications
  // const renderSpecifications = (product) => {
  //   if (!product) return null;
  //   return (
  //     <div
  //       style={{
  //         fontSize: "12px",
  //         color: "#555",
  //         textAlign: "justify",
  //         lineHeight: "1.4",
  //       }}
  //     >
  //       Specifications:{" "}
  //       {product?.brand && (
  //         <>
  //           {" "}
  //           <strong>Brand:</strong> {product.brand}.{" "}
  //         </>
  //       )}
  //       {product?.model && (
  //         <>
  //           {" "}
  //           <strong>Model:</strong> {product.model}.{" "}
  //         </>
  //       )}
  //       {product?.processor && (
  //         <>
  //           {" "}
  //           <strong>Processor:</strong> {product.processor}.{" "}
  //         </>
  //       )}
  //       {product?.ram && (
  //         <>
  //           {" "}
  //           <strong>RAM:</strong> {product.ram}.{" "}
  //         </>
  //       )}
  //       {product?.storage && (
  //         <>
  //           {" "}
  //           <strong>Storage:</strong> {product.storage}.{" "}
  //         </>
  //       )}
  //       {product?.disk_type && (
  //         <>
  //           {" "}
  //           <strong>Disk Type:</strong> {product.disk_type}.{" "}
  //         </>
  //       )}
  //       {product?.graphics && (
  //         <>
  //           {" "}
  //           <strong>Graphics:</strong> {product.graphics}.{" "}
  //         </>
  //       )}
  //       {product?.os && (
  //         <>
  //           {" "}
  //           <strong>OS:</strong> {product.os}.{" "}
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  // // Check if a row should be displayed
  // const shouldShowRow = (item) => {
  //   const hasReturnedDevices = item.returnedDevices?.some(
  //     (rd) => rd.deviceIds?.length > 0
  //   );
  //   const deviceIdsLength = item.device_ids?.length || 0;
  //   return (
  //     (item.quantity > 0 && deviceIdsLength > 0) ||
  //     item.isAdditionalChallan ||
  //     hasReturnedDevices
  //   );
  // };

  // // Render main product row
  // const renderProductRow = (items, product, combinedDeviceIds) => {
  //   const quantity = sumQuantities(items);
  //   // DON'T SHOW if quantity is 0 OR deviceIdsLength is 0
  //   if (quantity === 0 || combinedDeviceIds.length === 0) return null;

  //   const amount = sumAmounts(items);
  //   totalAmount += Number(amount) || 0;

  //   const firstItem = items[0];

  //   return (
  //     <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
  //       <td style={tableCellCenterStyle}>{rowCounter}</td>
  //       <td style={tableCellStyle}>
  //         <div style={itemTitleStyle}>{firstItem.product_name}</div>
  //         {renderSpecifications(product)}
  //         {combinedDeviceIds.length > 0 && (
  //           <>
  //             <br />
  //             <div style={itemTitleStyle}>
  //               Asset IDs: {combinedDeviceIds.join(", ")}
  //             </div>
  //           </>
  //         )}
  //         <br />
  //         <div style={itemTitleStyle}>{firstItem.description}</div>
  //       </td>
  //       <td style={tableCellCenterStyle}>{quantity}</td>
  //       {invoiceData.transaction_type === "Rent" && (
  //         <>
  //           <td style={tableCellCenterStyle}>{firstItem.days}</td>
  //           <td style={tableCellCenterStyle}>
  //             {formatINRCurrency(firstItem.dailyRate)}
  //           </td>
  //         </>
  //       )}
  //       <td style={tableCellRightStyle}>{formatINRCurrency(firstItem.rate)}</td>
  //       <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
  //     </tr>
  //   );
  // };

  // // Keep track of already-rendered Asset IDs globally for this invoice render
  // let renderedAssetIds = new Set();

  // const renderReturnedDeviceRow = (item, product, rd) => {
  //   // Ensure deviceIds is unique for this rd
  //   let deviceIds = [...new Set(rd.deviceIds || [])];

  //   // Filter out already-rendered IDs (avoid duplicates across rows)
  //   deviceIds = deviceIds.filter((id) => !renderedAssetIds.has(id));

  //   // Update global tracker
  //   deviceIds.forEach((id) => renderedAssetIds.add(id));

  //   // DON'T SHOW if no valid IDs left OR quantity is 0
  //   if (deviceIds.length === 0 || rd.quantity === 0) return null;

  //   const returnDate = new Date(rd.returnedDate);
  //   totalAmount += Number(rd.amount) || 0;

  //   return (
  //     <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
  //       <td style={tableCellCenterStyle}>{rowCounter}</td>
  //       <td style={tableCellStyle}>
  //         <div>
  //           <strong>Returned Asset IDs:</strong> {deviceIds.join(", ")}
  //         </div>
  //         <br />
  //         <div style={itemTitleStyle}>{item.product_name}</div>
  //         {renderSpecifications(product)}
  //         <br />
  //         <div style={itemTitleStyle}>
  //           Return Date: {formatDate(returnDate)}
  //         </div>
  //       </td>
  //       <td style={tableCellCenterStyle}>{deviceIds.length}</td>
  //       {invoiceData.transaction_type === "Rent" && (
  //         <>
  //           <td style={tableCellCenterStyle}>{rd.daysUsed}</td>
  //           <td style={tableCellCenterStyle}>
  //             {formatINRCurrency(rd.amount / rd.daysUsed)}
  //           </td>
  //         </>
  //       )}
  //       <td style={tableCellRightStyle}></td>
  //       <td style={tableCellRightStyle}>{formatINRCurrency(rd.amount)}</td>
  //     </tr>
  //   );
  // };

  // // Determine mid-month billing
  // const shouldRenderMidMonth = (item) => {
  //   const challanDate = item.isAdditionalChallan
  //     ? new Date(item.challanDate)
  //     : new Date(invoiceData.dc_date);
  //   const invoiceStartDate = new Date(invoiceData.invoice_start_date);
  //   const monthDiff =
  //     (challanDate.getFullYear() - invoiceStartDate.getFullYear()) * 12 +
  //     (challanDate.getMonth() - invoiceStartDate.getMonth());
  //   return monthDiff === -1;
  // };

  // // Render mid-month row
  // const renderMidMonthRow = (item, product) => {
  //   if (!shouldRenderMidMonth(item)) return null;
  //   // DON'T SHOW if quantity is 0 OR deviceIdsLength is 0
  //   if (item.quantity === 0 || (item.device_ids?.length || 0) === 0)
  //     return null;

  //   const deviceIds = item.device_ids || [];
  //   const quantity = item.quantity;

  //   const challanDate = item.isAdditionalChallan
  //     ? new Date(item.challanDate)
  //     : new Date(invoiceData.dc_date);
  //   const startDate = challanDate;
  //   const endDate = new Date(
  //     challanDate.getFullYear(),
  //     challanDate.getMonth() + 1,
  //     0
  //   );
  //   const daysUsed = calculateDays(startDate, endDate);

  //   const amount = item.isAdditionalChallan
  //     ? item.dailyRate * quantity * daysUsed
  //     : item.dcAmountBeforeReturns;
  //   totalAmount += Number(amount) || 0;

  //   return (
  //     <tr style={++rowCounter % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
  //       <td style={tableCellCenterStyle}>{rowCounter}</td>
  //       <td style={tableCellStyle}>
  //         <div>
  //           <strong>Mid-Month Usage:</strong>
  //         </div>
  //         <br />
  //         <div style={itemTitleStyle}>{item.product_name}</div>
  //         {renderSpecifications(product)}
  //         {deviceIds.length > 0 && (
  //           <div style={itemTitleStyle}>Asset IDs: {deviceIds.join(", ")}</div>
  //         )}
  //         <br />
  //         <div style={itemTitleStyle}>
  //           Billing Start Date: {formatDate(startDate)} to {formatDate(endDate)}
  //         </div>
  //       </td>
  //       <td style={tableCellCenterStyle}>{quantity}</td>
  //       {invoiceData.transaction_type === "Rent" && (
  //         <>
  //           <td style={tableCellCenterStyle}>{daysUsed}</td>
  //           <td style={tableCellCenterStyle}>
  //             {formatINRCurrency(item.dailyRate || item.rate / 30)}
  //           </td>
  //         </>
  //       )}
  //       <td style={tableCellRightStyle}></td>
  //       <td style={tableCellRightStyle}>{formatINRCurrency(amount)}</td>
  //     </tr>
  //   );
  // };

  // // 🔥 Main rendering loop
  // const rows = [];
  // const groupedItems = {};
  // items.forEach((item) => {
  //   if (!shouldShowRow(item)) return;
  //   const key = `${item.product_name}_${item.billingPeriod || "full"}`;
  //   if (!groupedItems[key]) groupedItems[key] = [];
  //   groupedItems[key].push(item);
  // });

  // Object.values(groupedItems).forEach((group) => {
  //   const product = group[0].productDetails || group[0].product;
  //   const combinedDeviceIds = mergeDeviceIds(group);

  //   // Render main row
  //   const mainRow = renderProductRow(group, product, combinedDeviceIds);
  //   if (mainRow) rows.push(mainRow);

  //   // Mid-month rows
  //   group.forEach((item) => {
  //     if (!isBuyTransaction && !paymentMode && showDcPeriod) {
  //       const isMidMonthItem = item.isAdditionalChallan
  //         ? new Date(item.challanDate).getDate() !== 1
  //         : item.dcAmountBeforeReturns > 0;
  //       const midRow = isMidMonthItem ? renderMidMonthRow(item, product) : null;
  //       if (midRow) rows.push(midRow);
  //     }

  //     // Returned devices
  //     item.returnedDevices?.forEach((rd) => {
  //       const retRow = renderReturnedDeviceRow(item, product, rd);
  //       if (retRow) rows.push(retRow);
  //     });
  //   });
  // });

  // // Taxes
  // const netAmount = totalAmount;
  // let cgst = isKarnataka ? netAmount * 0.09 : 0;
  // let sgst = isKarnataka ? netAmount * 0.09 : 0;
  // let igst = isKarnataka ? 0 : netAmount * 0.18;
  // let totalTax = cgst + sgst + igst;
  // const grandTotal = netAmount + totalTax;

  // Table rendering remains the same as your original code
  // Just make sure to conditionally show/hide sections based on paymentMode
  const renderInvoice = () => {
    return (
      <div
        className="invoice-container"
        style={receiptContainerStyle}
        id="invoice-current-month-invoice"
      >
        {/* Header and company info */}
        <div style={headerBarStyle}></div>
        <div style={companyHeaderStyle}>
          <div style={companyInfoContainerStyle}>
            <div style={logoStyle}>
              <img
                src="/SORT-ICON.png"
                alt="Company Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div style={companyNameStyle}>Guru Goutam Infotech Pvt. Ltd.</div>
              <div style={companyDetailsStyle}>
                CIN: U72200KA2008PTC047679
                <br />
                GST: {invoiceData.customer_gst_number || "29AADCG2608Q1Z6"}
              </div>
            </div>
          </div>
          <div style={challanHeaderStyle}>
            <div style={challanTitleStyle}>TAX INVOICE</div>

            <div style={challanDetailsStyle}>
              Invoice No: {invoiceData.invoice_number}
              <br />
              Invoice Date: {formatDate(startDate)}
              {/* Invoice Date:{" "}
              {paymentMode
                ? formatDate(invoiceEndDate)
                : formatDate(invoiceDate)} */}
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div style={recipientSectionStyle}>
          <div style={recipientContainerStyle}>
            <div style={recipientAddressStyle}>
              <div style={recipientLabelStyle}>Bill To</div>
              {invoiceData.customer_name}
              <br />
              {invoiceData.shippingDetail?.street &&
                `${invoiceData.shippingDetail.street}, `}
              {invoiceData.shippingDetail?.landmark &&
                `${invoiceData.shippingDetail.landmark}, `}
              {invoiceData.shippingDetail?.city},{" "}
              {invoiceData.shippingDetail?.state},
              <br />
              {invoiceData.shippingDetail?.country} -{" "}
              {invoiceData.shippingDetail?.pincode}
            </div>
            <div style={recipientDetailsGridStyle}>
              {/* <div>
                <div style={detailLabelStyle}>Customer GST :</div>
                {invoiceData.customer_gst_number}
              </div> */}
              <div>
                <div style={detailLabelStyle}>PAN Number :</div>
                {invoiceData.pan_number}
              </div>
              <div>
                <div style={detailLabelStyle}>Order Number :</div>
                {invoiceData.dispatch_order_number}
              </div>
              {invoiceData.dc_date !== null && (
                <div>
                  <div style={detailLabelStyle}>DC Date :</div>
                  {invoiceData.dc_date}
                </div>
              )}

              <div>
                <div style={detailLabelStyle}>Email :</div>
                {invoiceData.email}
              </div>
              <div>
                <div style={detailLabelStyle}>Phone :</div>
                {invoiceData.phone_number}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Period */}
        {!isBuyTransaction && (
          <div style={invoicePeriodStyle}>
            <div>
              <strong>Invoice Period:</strong> {formatDate(invoiceDate)} to{" "}
              {formatDate(invoiceEndDate)}
            </div>
          </div>
        )}

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderNoStyle}>NO.</th>
              <th style={tableHeaderParticularsStyle}>Product Details</th>
              <th style={tableHeaderQtyStyle}>Qty</th>
              {invoiceData.transaction_type === "Rent" && (
                <>
                  <th style={tableHeaderDaysStyle}>Days</th>
                  <th style={tableHeaderDaysStyle}>Per Day</th>
                </>
              )}
              <th style={tableHeaderDaysStyle}>
                {invoiceData.transaction_type === "Rent"
                  ? "Per Month"
                  : "Purchase Price"}
              </th>
              <th style={tableHeaderRateStyle}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows}
            {/* Add total row at the end */}
            <tr key="total-row" style={totalsRowStyle}>
              <td
                style={tableCellCenterStyle}
                colSpan={invoiceData.transaction_type === "Rent" ? 6 : 4}
              >
                <strong>TOTAL</strong>
              </td>
              <td style={tableCellRightStyle}>
                {formatINRCurrency(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tax and Total Section */}
        <div style={taxTotalContainerStyle}>
          <div style={taxDetailsStyle}>
            <div style={taxRowStyle}>
              <span>Subtotal:</span>
              <span>{formatINRCurrency(totalAmount)}</span>
            </div>

            {isKarnataka && (
              <>
                <div style={taxRowStyle}>
                  <span>CGST @9%:</span>
                  <span>{formatINRCurrency(cgst)}</span>
                </div>
                <div style={taxRowStyle}>
                  <span>SGST @9%:</span>
                  <span>{formatINRCurrency(sgst)}</span>
                </div>
              </>
            )}
            {!isKarnataka && (
              <div style={taxRowStyle}>
                <span>IGST @18%:</span>
                <span>{formatINRCurrency(igst)}</span>
              </div>
            )}
            <div style={taxRowTotalStyle}>
              <span>Total Tax:</span>
              <span>{formatINRCurrency(totalTax)}</span>
            </div>

            <div style={grandTotalStyle}>
              <span>Grand Total:</span>
              <span>{formatINRCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div style={bankDetailsContainerStyle}>
          <div style={bankDetailsTitleStyle}>Bank Details:</div>
          <div style={bankLineStyle}>
            Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar Branch.
          </div>
          <div style={bankLineStyle}>
            Current A/c No: 50200066787843, IFSC Code: HDFC0000261.
          </div>

          <div style={amountWordsStyle}>
            Amt. in Words: <span>{numberToWords(grandTotal)}</span>
          </div>

          <div style={jurisdictionNoteStyle}>
            Note:{" "}
            <span style={highlightTextStyle}>
              Subject to Bengaluru Jurisdiction
            </span>
          </div>
        </div>

        {/* Signature Section */}
        <div style={signatureSectionStyle}>
          {/* Left: Receiver Signature */}
          <div style={leftSignatureAreaStyle}>
            <div style={companySignatureLabelStyle}></div>
            <div style={signatureBoxStyle}></div>
            <div style={signatureDesignationStyle}>
              {" "}
              Receiver Signature with Seal
            </div>
          </div>

          {/* Right: Authorised Signatory */}
          <div style={rightSignatureAreaStyle}>
            <div style={companySignatureLabelStyle}>
              For Guru Goutham Infotech Private Limited
            </div>
            <div style={signatureBoxStyle}>SD/-</div>
            <div style={signatureDesignationStyle}>Authorised Signatory</div>
          </div>
        </div>

        {/* Company Footer */}
        <div style={companyFooterStyle}>
          <div style={footerAddressStyle}>
            <span>📍</span>
            <span>
              No. 8, 2nd Cross, Diagonal Road, 3rd Block,
              <br />
              Jayanagar Bengaluru-560011.
            </span>
          </div>
          <div style={footerContactStyle}>
            <div style={footerContactItemStyle}>
              <span>🌐</span>
              <span>gurugoutam.com</span>
            </div>
            <div style={footerContactItemStyle}>
              <span>📞</span>
              <span>080-2242 9955, +91 9449 0789 55</span>
            </div>
            <div style={footerContactItemStyle}>
              <span>✉️</span>
              <span>info@gurugoutam.com</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the invoice container element
      const element = document.getElementById("invoice-current-month-invoice");

      if (!element) {
        throw new Error("Could not find invoice element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${invoiceData.invoice_number || "INV"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("invoice-current-month-invoice");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the invoice content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceData.invoice_number || "INV"}</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      TransitionProps={{
        onEntered: () => {
          // Ensures content is rendered before PDF/print
        },
      }}
    >
      <DialogTitle>Invoice</DialogTitle>
      <DialogContent>
        <div style={{ padding: "20px" }} id="invoice-current-month-invoice">
          {renderInvoice()}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
        >
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CourierInvoiceDialog = ({ open, onClose, courierData }) => {
  if (!courierData) return null;

  // ✅ Check if all states are Karnataka
  const isOnlyKarnataka = courierData?.addresses?.every(
    (address) => address.state === "Karnataka"
  );

  let cgst = 0,
    sgst = 0,
    igst = 0;

  courierData.addresses?.forEach((addr) => {
    const price = Number(addr.courier_charges_price) || 0;

    if (addr.state?.toLowerCase() === "karnataka") {
      cgst += price * 0.09;
      sgst += price * 0.09;
    } else {
      igst += price * 0.18;
    }
  });

  const netAmount = courierData.addresses?.reduce(
    (sum, addr) => sum + (Number(addr.courier_charges_price) || 0),
    0
  );
  const totalTax = cgst + sgst + igst;
  const grandTotal = netAmount + totalTax;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the invoice container element
      const element = document.getElementById("courier-invoice-container");

      if (!element) {
        throw new Error("Could not find invoice element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`courier-invoice-${courierData.service_number || "CI"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("courier-invoice-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the invoice content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Courier Invoice - ${courierData.service_number || "CI"}</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Courier Invoice Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="courier-invoice-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    CIN: UT2200KA2008PTC047879
                    <br />
                    GST: {courierData.customer?.gst}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>COURIER INVOICE</div>
                <div style={challanDetailsStyle}>
                  Invoice No: {courierData.invoice_number}
                  <br />
                  Courier No: {courierData.service_number}
                  <br />
                  Courier Date:{" "}
                  {new Date(courierData.service_date).toLocaleDateString(
                    "en-GB"
                  )}
                  <br />
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>Bill To:</div>
                  {courierData.customer?.first_name}{" "}
                  {courierData.customer?.last_name},
                  <br />
                  {courierData.customer?.company_name && (
                    <>
                      {courierData.customer.company_name}
                      <br />
                    </>
                  )}
                  {courierData.customer?.address?.street &&
                    `${courierData.customer.address.street}, `}
                  {courierData.customer?.address?.city &&
                    `${courierData.customer.address.city}, `}
                  {courierData.customer?.address?.state &&
                    `${courierData.customer.address.state}`}
                  <br />
                  {courierData.customer?.address?.country &&
                    `${courierData.customer.address.country} - `}
                  {courierData.customer?.address?.pincode}
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Contact Person:</div>
                    {courierData.customer?.first_name}{" "}
                    {courierData.customer?.last_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Number:</div>
                    {courierData.customer?.phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Customer ID:</div>
                    {courierData.customer?.customer_id}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Industry:</div>
                    {courierData.customer?.industry}
                  </div>
                </div>
              </div>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>PARTICULARS</th>
                  <th style={tableHeaderQtyStyle}>QTY</th>
                  <th style={tableHeaderQtyStyle}>RATE</th>
                  <th style={tableHeaderQtyStyle}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...tableCellStyle,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      Laptop Courier Charges:
                    </div>
                  </td>
                </tr>

                {courierData.addresses &&
                  courierData.addresses.map((address, index) => (
                    <tr
                      key={index}
                      style={
                        index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                      }
                    >
                      <td style={tableCellCenterStyle}>{index + 1}</td>
                      <td style={tableCellStyle}>
                        <div style={{ fontStyle: "italic" }}>
                          {address.courier_description} to {address.city}{" "}
                          {address.district} {address.state} {address.pincode}
                        </div>
                      </td>
                      <td style={tableCellRightStyle}>1</td>
                      <td style={tableCellRightStyle}>
                        ₹{address.courier_charges_price || "0"}
                      </td>
                      <td style={tableCellRightStyle}>
                        ₹{address.courier_charges_price || "0"}
                      </td>
                    </tr>
                  ))}

                {/* ✅ Total Row */}
                <tr key="total-row" style={totalsRowStyle}>
                  <td style={tableCellCenterStyle} colSpan={4}>
                    <strong>TOTAL</strong>
                  </td>
                  <td style={tableCellRightStyle}>
                    <strong>₹{netAmount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tax and Total Section */}
            <div style={taxTotalContainerStyle}>
              <div style={taxDetailsStyle}>
                <div style={taxRowStyle}>
                  <span>Subtotal:</span>
                  <span>{formatINRCurrency(netAmount)}</span>
                </div>

                <div style={taxRowStyle}>
                  <span>CGST @9%:</span>
                  <span>{formatINRCurrency(cgst)}</span>
                </div>
                <div style={taxRowStyle}>
                  <span>SGST @9%:</span>
                  <span>{formatINRCurrency(sgst)}</span>
                </div>

                {!isOnlyKarnataka && (
                  <div style={taxRowStyle}>
                    <span>IGST @18%:</span>
                    <span>{formatINRCurrency(igst)}</span>
                  </div>
                )}

                <div style={taxRowTotalStyle}>
                  <span>Total Tax:</span>
                  <span>{formatINRCurrency(totalTax)}</span>
                </div>

                <div style={grandTotalStyle}>
                  <span>Grand Total:</span>
                  <span>{formatINRCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div style={bankDetailsContainerStyle}>
              <div style={bankDetailsTitleStyle}>Bank Details:</div>
              <div style={bankLineStyle}>
                Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar
                Branch.
              </div>
              <div style={bankLineStyle}>
                Current A/c No: 50200066787843, IFSC Code: HDFC0000261.
              </div>

              <div style={amountWordsStyle}>
                Amt. in Words: <span>{numberToWords(grandTotal)}</span>
              </div>

              <div style={jurisdictionNoteStyle}>
                Note:{" "}
                <span style={highlightTextStyle}>
                  Subject to Bengaluru Jurisdiction
                </span>
              </div>
            </div>

            {/* Footer Info */}
            {/* <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {courierData.customer?.pan_no || "FGHIJ6789L"}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {courierData.customer?.gst || "29AADCG2606Q1Z6"}
              </div>
            </div> */}

            {/* Description */}
            {/* <div style={totalLabelStyle}>
              <strong>Remarks:</strong>{" "}
              {courierData.customer?.remarks || "Courier invoice"}
            </div> */}

            <div style={signatureSectionStyle}>
              {/* Left: Receiver Signature */}
              <div style={leftSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}></div>
                <div style={signatureBoxStyle}></div>
                <div style={signatureDesignationStyle}>
                  {" "}
                  Receiver Signature with Seal
                </div>
              </div>

              {/* Right: Authorised Signatory */}
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ServiceInvoiceDialog = ({ open, onClose, serviceData }) => {
  if (!serviceData) return null;

  // ✅ Check if all states are Karnataka
  const isOnlyKarnataka = serviceData?.addresses?.every(
    (address) => address.state === "Karnataka"
  );

  let cgst = 0,
    sgst = 0,
    igst = 0;

  serviceData.addresses?.forEach((addr) => {
    const price = Number(addr.courier_charges_price) || 0;

    if (addr.state?.toLowerCase() === "karnataka") {
      cgst += price * 0.09;
      sgst += price * 0.09;
    } else {
      igst += price * 0.18;
    }
  });

  const netAmount = serviceData.addresses?.reduce(
    (sum, addr) => sum + (Number(addr.courier_charges_price) || 0),
    0
  );

  const totalTax = cgst + sgst + igst;
  const grandTotal = netAmount + totalTax;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the invoice container element
      const element = document.getElementById("service-invoice-container");

      if (!element) {
        throw new Error("Could not find invoice element in DOM");
      }

      // Create a clone for PDF generation to avoid layout issues
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.visibility = "visible";
      clone.style.width = "210mm";
      document.body.appendChild(clone);

      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        backgroundColor: "#FFFFFF",
      };

      const canvas = await html2canvas(clone, options);
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page PDF
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`service-invoice-${serviceData.service_number || "SI"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("service-invoice-container");

    if (!element) {
      console.error("Print element not found");
      alert("Could not find the invoice content for printing");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Invoice - ${serviceData.service_number || "SI"}</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container { 
              width: 190mm; 
              min-height: 277mm; 
              padding: 0;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Service Invoice Details</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <div id="service-invoice-container" style={receiptContainerStyle}>
            {/* Header Color Bar */}
            <div style={headerBarStyle}></div>

            {/* Company Header */}
            <div style={companyHeaderStyle}>
              <div style={companyInfoContainerStyle}>
                <div style={logoStyle}>
                  <img
                    src="/SORT-ICON.png"
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <div style={companyNameStyle}>
                    Guru Goutam Infotech Pvt. Ltd.
                  </div>
                  <div style={companyDetailsStyle}>
                    CIN: UT2200KA2008PTC047879
                    <br />
                    GST: {serviceData.customer?.gst}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>SERVICE INVOICE</div>
                <div style={challanDetailsStyle}>
                  Invoice No: {serviceData.invoice_number}
                  <br />
                  Service No: {serviceData.service_number}
                  <br />
                  Service Date:{" "}
                  {new Date(serviceData.service_date).toLocaleDateString(
                    "en-GB"
                  )}
                  <br />
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>Bill To:</div>
                  {serviceData.customer?.first_name}{" "}
                  {serviceData.customer?.last_name},
                  <br />
                  {serviceData.customer?.company_name && (
                    <>
                      {serviceData.customer.company_name}
                      <br />
                    </>
                  )}
                  {serviceData.customer?.address?.street &&
                    `${serviceData.customer.address.street}, `}
                  {serviceData.customer?.address?.city &&
                    `${serviceData.customer.address.city}, `}
                  {serviceData.customer?.address?.state &&
                    `${serviceData.customer.address.state}`}
                  <br />
                  {serviceData.customer?.address?.country &&
                    `${serviceData.customer.address.country} - `}
                  {serviceData.customer?.address?.pincode}
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Contact Person:</div>
                    {serviceData.customer?.first_name}{" "}
                    {serviceData.customer?.last_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Number:</div>
                    {serviceData.customer?.phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Customer ID:</div>
                    {serviceData.customer?.customer_id}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Industry:</div>
                    {serviceData.customer?.industry}
                  </div>
                </div>
              </div>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderNoStyle}>NO.</th>
                  <th style={tableHeaderParticularsStyle}>PARTICULARS</th>
                  <th style={tableHeaderQtyStyle}>QTY</th>
                  <th style={tableHeaderQtyStyle}>RATE</th>
                  <th style={tableHeaderQtyStyle}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...tableCellStyle,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Service and Maintenance Charges:
                  </td>
                </tr>

                {serviceData.addresses &&
                  serviceData.addresses.map((address, index) => (
                    <tr
                      key={index}
                      style={
                        index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                      }
                    >
                      <td style={tableCellCenterStyle}>{index + 1}</td>
                      <td style={tableCellStyle}>
                        {address.city}, {address.district}, {address.state} -{" "}
                        {address.pincode}
                      </td>
                      <td style={tableCellRightStyle}>1</td>
                      <td style={tableCellRightStyle}>
                        ₹{address.courier_charges_price || "0"}
                      </td>
                      <td style={tableCellRightStyle}>
                        ₹{address.courier_charges_price || "0"}
                      </td>
                    </tr>
                  ))}

                {/* ✅ Total Row */}
                <tr key="total-row" style={totalsRowStyle}>
                  <td style={tableCellCenterStyle} colSpan={4}>
                    <strong>TOTAL</strong>
                  </td>
                  <td style={tableCellRightStyle}>
                    <strong>₹{netAmount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tax and Total Section */}
            <div style={taxTotalContainerStyle}>
              <div style={taxDetailsStyle}>
                <div style={taxRowStyle}>
                  <span>Subtotal:</span>
                  <span>{formatINRCurrency(netAmount)}</span>
                </div>

                <div style={taxRowStyle}>
                  <span>CGST @9%:</span>
                  <span>{formatINRCurrency(cgst)}</span>
                </div>
                <div style={taxRowStyle}>
                  <span>SGST @9%:</span>
                  <span>{formatINRCurrency(sgst)}</span>
                </div>

                {!isOnlyKarnataka && (
                  <div style={taxRowStyle}>
                    <span>IGST @18%:</span>
                    <span>{formatINRCurrency(igst)}</span>
                  </div>
                )}

                <div style={taxRowTotalStyle}>
                  <span>Total Tax:</span>
                  <span>{formatINRCurrency(totalTax)}</span>
                </div>

                <div style={grandTotalStyle}>
                  <span>Grand Total:</span>
                  <span>{formatINRCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div style={bankDetailsContainerStyle}>
              <div style={bankDetailsTitleStyle}>Bank Details:</div>
              <div style={bankLineStyle}>
                Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar
                Branch.
              </div>
              <div style={bankLineStyle}>
                Current A/c No: 50200066787843, IFSC Code: HDFC0000261.
              </div>

              <div style={amountWordsStyle}>
                Amt. in Words: <span>{numberToWords(grandTotal)}</span>
              </div>

              <div style={jurisdictionNoteStyle}>
                Note:{" "}
                <span style={highlightTextStyle}>
                  Subject to Bengaluru Jurisdiction
                </span>
              </div>
            </div>

            {/* Footer Info */}
            {/* <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {serviceData.customer?.pan_no || "FGHIJ6789L"}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {serviceData.customer?.gst || "29AADCG2606Q1Z6"}
              </div>
            </div> */}

            {/* Signature Section */}
            <div style={signatureSectionStyle}>
              {/* Left: Receiver Signature */}
              <div style={leftSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}></div>
                <div style={signatureBoxStyle}></div>
                <div style={signatureDesignationStyle}>
                  {" "}
                  Receiver Signature with Seal
                </div>
              </div>

              {/* Right: Authorised Signatory */}
              <div style={rightSignatureAreaStyle}>
                <div style={companySignatureLabelStyle}>
                  For Guru Goutham Infotech Private Limited
                </div>
                <div style={signatureBoxStyle}>SD/-</div>
                <div style={signatureDesignationStyle}>
                  Authorised Signatory
                </div>
              </div>
            </div>

            {/* Company Footer */}
            <div style={companyFooterStyle}>
              <div style={footerAddressStyle}>
                <span>📍</span>
                <span>
                  No. 8, 2nd Cross, Diagonal Road, 3rd Block,
                  <br />
                  Jayanagar Bengaluru-560011.
                </span>
              </div>
              <div style={footerContactStyle}>
                <div style={footerContactItemStyle}>
                  <span>🌐</span>
                  <span>gurugoutam.com</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>📞</span>
                  <span>080-2242 9955, +91 9449 0789 55</span>
                </div>
                <div style={footerContactItemStyle}>
                  <span>✉️</span>
                  <span>info@gurugoutam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DynamicTable = ({
  columns,
  data: initialData = [],
  rowsPerPage = 10,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tableType = location.pathname.split("/").pop();
  const deleteApiUrl = apiEndpoints[tableType];

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const [data, setData] = useState([]);
  const [status, setStatus] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedDCRow, setSelectedDCRow] = useState(null);
  const [openViewQuotationDialog, setOpenViewQuotationDialog] = useState(false);
  const [selectedQuotationRow, setSelectedQuotationRow] = useState(null);
  // Then in your DynamicTable component, add the state and handler for the invoice dialog:
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [selectedInvoiceRow, setSelectedInvoiceRow] = useState(null);
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setData(initialData);
      setStatus(initialData.map((row) => row.status === "Active"));
    } else {
      setData([]);
      setStatus([]);
    }
  }, [initialData]);

  const toggleStatus = (index) => {
    setStatus((prevStatus) => {
      const updatedStatus = [...prevStatus];
      updatedStatus[index] = !updatedStatus[index];
      return updatedStatus;
    });
  };

  // Filter Data Based on Search
  const filteredData = data.filter((row) =>
    columns.some((column) =>
      row[column.id]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Navigate to Edit Page
  const handleEdit = (row) => {
    navigate(`${location.pathname}/edit/${row.id}`);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleViewDC = async (row) => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-challans/${row.id}`,
        {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );
      setSelectedDCRow(response.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error fetching DC details:", error);
    }
  };

  const handleViewQuotation = async (row) => {
    try {
      const response = await axios.get(`${API_URL}/quotations/${row.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      setSelectedQuotationRow(response.data);
      setOpenViewQuotationDialog(true);
    } catch (error) {
      console.error("Error fetching DC details:", error);
    }
  };

  // Add this to your component where you manage the dialog state
  const [openGrnDialog, setOpenGrnDialog] = useState(false);
  const [openPlainGrnDialog, setOpenGrnPlainDialog] = useState(false);
  const [openCourierChargesDialog, setOpenCourierChargesDialog] =
    useState(false);

  const [selectedGrnRow, setSelectedGrnRow] = useState(null);
  const [selectedPlainGrnRow, setSelectedPlainGrnRow] = useState(null);
  const [selectedCourierChargesRow, setSelectedCourierChargesRow] =
    useState(null);

  const [openserviceChargesDialog, setOpenserviceChargesDialog] =
    useState(false);
  const [selectedServiceChargesRow, setSelectedServiceChargesRow] =
    useState(null);

  const [selectedCreditNoteRow, setSelectedCreditNoteRow] = useState(null);
  const [openCreditNoteDialog, setOpenCreditNoteDialog] = useState(false);

  const handleViewGRN = async (row) => {
    try {
      const response = await axios.get(`${API_URL}/credit-notes/${row.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      setSelectedGrnRow(response.data);
      setOpenGrnDialog(true);
    } catch (error) {
      console.error("Error fetching GRN details:", error);
    }
  };

  const handleViewPlainGRN = async (row) => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-challans/customer-details/${row.id}`,
        {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );
      setSelectedPlainGrnRow(response.data);
      setOpenGrnPlainDialog(true);
    } catch (error) {
      console.error("Error fetching Plain GRN details:", error);
    }
  };

  const handleViewCourierInvoice = async (row) => {
    try {
      const response = await axios.get(`${API_URL}/courier-charges/${row.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      setSelectedCourierChargesRow(response.data);
      setOpenCourierChargesDialog(true);
    } catch (error) {
      console.error("Error fetching courier-charges details:", error);
    }
  };

  const handleViewServriceInvoice = async (row) => {
    try {
      const response = await axios.get(`${API_URL}/service-charges/${row.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      setSelectedServiceChargesRow(response.data);
      setOpenserviceChargesDialog(true);
    } catch (error) {
      console.error("Error fetching service-charges details:", error);
    }
  };

  const handleViewCreditNote = async (row, type = "credit") => {
    try {
      const response = await axios.get(`${API_URL}/credit-notes/${row.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      const creditNoteWithType = {
        ...response.data,
        type,
        returned_date:
          response.data.returned_date || new Date().toISOString().split("T")[0],
      };

      setSelectedCreditNoteRow(creditNoteWithType);
      setOpenCreditNoteDialog(true);
    } catch (error) {
      console.error("Error fetching credit note details:", error);
    }
  };

  // Fetch invoice data
  const handleViewInvoice = async (row, type = "current") => {
    try {
      const response = await axios.get(`${API_URL}/invoices/${row.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      const invoiceWithType = {
        ...response.data,
        type,
        rental_start_date:
          response.data.rental_start_date ||
          new Date().toISOString().split("T")[0],
        rental_end_date:
          response.data.rental_end_date ||
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            .toISOString()
            .split("T")[0],
      };

      setSelectedInvoiceRow(invoiceWithType);
      setOpenInvoiceDialog(true);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  //   const handleViewInvoice = async (row, type = "current") => {
  //   try {
  //     const customerId = row.customer_id;
  //     const invoiceDate = row.invoice_date;

  //     if (!customerId || !invoiceDate) {
  //       console.error("Missing customer_id or invoice_date");
  //       return;
  //     }

  //     const response = await axios.get(
  //       `${API_URL}/invoices/customer/${customerId}/${invoiceDate}`
  //     );

  //     const invoiceWithType = {
  //       ...response.data,
  //       type,
  //       rental_start_date:
  //         response.data.rental_start_date ||
  //         new Date().toISOString().split("T")[0],
  //       rental_end_date:
  //         response.data.rental_end_date ||
  //         new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  //           .toISOString()
  //           .split("T")[0],
  //     };

  //     setSelectedInvoiceRow(invoiceWithType);
  //     setOpenInvoiceDialog(true);
  //   } catch (error) {
  //     console.error("Error fetching invoice details:", error);
  //   }
  // };

  // Handle Confirm Delete API Call
  const handleConfirmDelete = async () => {
    if (selectedRow && deleteApiUrl) {
      try {
        const response = await fetch(`${deleteApiUrl}/${selectedRow.id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
          method: "DELETE",
        });

        if (response.ok) {
          setData((prevData) =>
            prevData.filter((row) => row.id !== selectedRow.id)
          );
        } else {
          console.error("Failed to delete:", await response.text());
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
    setOpenDeleteDialog(false);
  };

  // Get button text based on table type
  const getButtonText = () => {
    switch (tableType) {
      case "settings":
        return "Add User";
      case "crm":
        return "Add Client";
      case "assembled-products":
        return "Create Assembled";
      case "operations":
        return "Add DC";
      case "credit_notes":
        return "Add Return Order";
      case "courier-charges":
        return "Create Courier Invoice";
      case "service_maintenance":
        return "Create Service Invoice";
      case "job_description":
        return "Add Job Description";
      case "goodsreceipt":
        return "Add Receipt";
      case "purchase-orders":
        return "Add Order";
      case "po-quotations":
        return "Add Quotation";
      case "purchase-requests":
        return "Add Request";
      case "product_library":
        return "Add Product";
      case "product_categories":
        return "Add Category";
      case "asset-updation":
        return "Add Asset"; // Specific text for asset updation
      default:
        return `Add ${tableType.charAt(0).toUpperCase() + tableType.slice(1)}`;
    }
  };

  return (
    <Box>
      {/* Search and Add Button */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {tableType !== "inventory" &&
          tableType !== "asset" &&
          tableType !== "plain-grn" &&
          tableType !== "wear-house" &&
          tableType !== "client-place" &&
          tableType !== "asset-modifications" &&
          tableType !== "credit-notes" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`${location.pathname}/add`)}
              sx={{
                minWidth: "140px",
                padding: "8px 16px",
                fontWeight: "bold",
                fontSize: "14px",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                textTransform: "none",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {getButtonText()}
            </Button>
          )}
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          maxHeight: "calc(100vh - 200px)", // Adjust as needed
          position: "relative",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}

              {/* Conditional Extra Columns */}
              {[
                "purchase-requests",
                "purchase-orders",
                "goodsreceipt",
                "po-quotations",
                "supplier",
                "inventory",
                "quotations",
                "orders",
                "operations",
                "grn",
                "credit_notes",
                "asset",
                "invoices",
                "wear-house",
                "credit-notes",
                "asset-modifications",
                "asset-updation",
                "client-place",
                "courier-charges",
                "service_maintenance",
                "swap",
              ].includes(tableType) === false && (
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Active Status
                  </TableCell>
                )}

              {tableType === "invoices" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Invoice
                </TableCell>
              )}

              {tableType === "courier-charges" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Courier Invoice
                </TableCell>
              )}

              {tableType === "service_maintenance" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Service Invoice
                </TableCell>
              )}

              {tableType === "operations" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View DC
                </TableCell>
              )}

              {tableType === "quotations" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Quotation
                </TableCell>
              )}

              {tableType === "credit-notes" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Credit Note
                </TableCell>
              )}

              {tableType === "plain-grn" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Plain GRN
                </TableCell>
              )}

              {tableType === "grn" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View GRN
                </TableCell>
              )}

              {[
                "inventory",
                "asset",
                "credit-notes",
                "client-place",
                "wear-house",
                "plain-grn",
              ].includes(tableType) === false && (
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align="center"
                      sx={{
                        minWidth: column.id === "specifications" ? 250 : 106,
                        maxWidth: column.id === "specifications" ? 300 : "auto",
                        whiteSpace:
                          column.id === "specifications"
                            ? "pre-wrap"
                            : "normal",
                        wordWrap:
                          column.id === "specifications"
                            ? "break-word"
                            : "normal",
                        textAlign:
                          column.id === "specifications" ? "left" : "center",
                      }}
                    >
                      {[
                        "purchase_request_status",
                        "po_quotation_status",
                        "po_status",
                        "goods_receipt_status",
                        "status",
                        "order_status",
                      ].includes(column.id) ? (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                            color:
                              row[column.id] === "Pending"
                                ? "#b26a00"
                                : row[column.id] === "Approved"
                                  ? "#1b5e20"
                                  : row[column.id] === "Rejected"
                                    ? "#b71c1c"
                                    : "inherit",
                            backgroundColor:
                              row[column.id] === "Pending"
                                ? "#fff3e0"
                                : row[column.id] === "Approved"
                                  ? "#e8f5e9"
                                  : row[column.id] === "Rejected"
                                    ? "#ffebee"
                                    : "transparent",
                          }}
                        >
                          {row[column.id]}
                        </Typography>
                      ) : (
                        row[column.id] || "N/A"
                      )}
                    </TableCell>
                  ))}

                  {/* Active Status */}
                  {[
                    "purchase-requests",
                    "purchase-orders",
                    "goodsreceipt",
                    "po-quotations",
                    "supplier",
                    "inventory",
                    "quotations",
                    "orders",
                    "operations",
                    "grn",
                    "credit_notes",
                    "asset",
                    "asset-modifications",
                    "credit-notes",
                    "invoices",
                    "client-place",
                    "wear-house",
                    "asset-updation",
                    "courier-charges",
                    "service_maintenance",
                    "swap",
                  ].includes(tableType) === false && (
                      <TableCell align="center">
                        <Button onClick={() => toggleStatus(rowIndex)}>
                          <img
                            src={status[rowIndex] ? StatusOn : StatusOff}
                            alt={status[rowIndex] ? "Active" : "Inactive"}
                            width="40"
                            height="24"
                          />
                        </Button>
                      </TableCell>
                    )}

                  {/* View Invoice */}
                  {tableType === "invoices" && (
                    <TableCell align="center">
                      <Button
                        onClick={() => handleViewInvoice(row, "current")}
                        sx={{ minWidth: "30px", p: 0 }}
                        title="View Invoice"
                      >
                        <img
                          src={ViewDC}
                          alt="View Current"
                          width="45"
                          height="35"
                        />
                      </Button>
                    </TableCell>
                  )}

                  {/* service maintenance */}
                  {tableType === "courier-charges" && (
                    <TableCell align="center">
                      <Button
                        onClick={() => handleViewCourierInvoice(row, "current")}
                        sx={{ minWidth: "30px", p: 0 }}
                        title="View Invoice"
                      >
                        <img
                          src={ViewDC}
                          alt="View Current"
                          width="45"
                          height="35"
                        />
                      </Button>
                    </TableCell>
                  )}

                  {tableType === "service_maintenance" && (
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          handleViewServriceInvoice(row, "current")
                        }
                        sx={{ minWidth: "30px", p: 0 }}
                        title="View Invoice"
                      >
                        <img
                          src={ViewDC}
                          alt="View Current"
                          width="45"
                          height="35"
                        />
                      </Button>
                    </TableCell>
                  )}

                  {/* View Credit Note */}
                  {tableType === "credit-notes" ? (
                    row.transaction_type !== "Buy" && row.returned_date ? (
                      <TableCell align="center">
                        <Button
                          onClick={() => handleViewCreditNote(row, "credit")}
                          sx={{ minWidth: "30px", p: 0 }}
                          title="View Credit Note"
                        >
                          <img
                            src={ViewDC}
                            alt="View Credit"
                            width="45"
                            height="35"
                          />
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell align="center">—</TableCell>
                    )
                  ) : null}

                  {/* View DC for operations */}
                  {tableType === "operations" && (
                    <TableCell align="center">
                      <Button
                        onClick={() => handleViewDC(row)}
                        sx={{ minWidth: "30px", p: 0 }}
                      >
                        <img src={ViewDC} alt="ViewDC" width="45" height="35" />
                      </Button>
                    </TableCell>
                  )}

                  {/* View DC for operations */}
                  {tableType === "quotations" && (
                    <TableCell align="center">
                      <Button
                        onClick={() => handleViewQuotation(row)}
                        sx={{ minWidth: "30px", p: 0 }}
                      >
                        <img src={ViewDC} alt="ViewDC" width="45" height="35" />
                      </Button>
                    </TableCell>
                  )}

                  {tableType === "grn" && (
                    <>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleViewGRN(row)}
                          sx={{ minWidth: "30px", p: 0 }}
                        >
                          <img
                            src={ViewDC}
                            alt="ViewDC"
                            width="45"
                            height="35"
                          />
                        </Button>
                      </TableCell>
                    </>
                  )}

                  {/* Action Buttons */}
                  {["inventory"].includes(tableType) === false && (
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        {tableType === "plain-grn" && (
                          <>
                            <Button
                              onClick={() => handleViewPlainGRN(row)}
                              sx={{ minWidth: "30px", p: 0 }}
                            >
                              <img
                                src={ViewDC}
                                alt="ViewDC"
                                width="45"
                                height="35"
                              />
                            </Button>
                          </>
                        )}

                        {[
                          "asset",
                          "credit-notes",
                          "client-place",
                          "wear-house",
                          "plain-grn",

                        ].includes(tableType) === false && (
                            <>
                              {/* Always show Edit if allowed */}
                              <Button
                                onClick={() => handleEdit(row)}
                                sx={{ minWidth: "30px", p: 0 }}
                              >
                                <img
                                  src={EditIcon}
                                  alt="Edit"
                                  width="45"
                                  height="35"
                                />
                              </Button>

                              {/* Show Delete only if not asset-modifications */}
                              {tableType !== "asset-modifications" && (
                                <Button
                                  onClick={() => handleDeleteClick(row)}
                                  sx={{ minWidth: "30px", p: 0 }}
                                >
                                  <img
                                    src={DeleteIcon}
                                    alt="Delete"
                                    width="45"
                                    height="35"
                                  />
                                </Button>
                              )}
                            </>
                          )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 4} align="center">
                  <Typography>No data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: 2 }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete?{" "}
            <b>{selectedRow ? selectedRow[columns[1]?.id] : "this record"}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delivery Challan Dialog */}
      <DeliveryChallanDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        dcData={selectedDCRow}
      />

      <QuotationDialog
        open={openViewQuotationDialog}
        onClose={() => setOpenViewQuotationDialog(false)}
        quotationData={selectedQuotationRow}
      />

      <InvoiceDialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
        invoiceData={selectedInvoiceRow}
      />
      <CreditNoteDialog
        open={openCreditNoteDialog}
        onClose={() => setOpenCreditNoteDialog(false)}
        creditNoteData={selectedCreditNoteRow}
      />

      <GoodsReturnNoteDialog
        open={openGrnDialog}
        onClose={() => setOpenGrnDialog(false)}
        grnData={selectedGrnRow}
      />
      <PlainGoodsReturnNoteDialog
        open={openPlainGrnDialog}
        onClose={() => setOpenGrnPlainDialog(false)}
        grnData={selectedPlainGrnRow}
      />

      <ServiceInvoiceDialog
        open={openserviceChargesDialog}
        onClose={() => setOpenserviceChargesDialog(false)}
        serviceData={selectedServiceChargesRow}
      />

      <CourierInvoiceDialog
        open={openCourierChargesDialog}
        onClose={() => setOpenCourierChargesDialog(false)}
        courierData={selectedCourierChargesRow}
      />
    </Box>
  );
};

// Styles (keep all your existing styles exactly as they are)

// Add these styles to your existing styles
const accessoriesContainerStyle = {
  marginTop: "20px",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
};

const accessoriesTitleStyle = {
  fontWeight: "bold",
  marginBottom: "8px",
  fontSize: "14px",
};

const accessoriesListStyle = {
  margin: 0,
  paddingLeft: "20px",
};

const accessoriesListItemStyle = {
  fontSize: "13px",
  marginBottom: "4px",
};

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
  padding: "1.25rem",
};

const receiptContainerStyle = {
  maxWidth: "64rem",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
};

const headerBarStyle = {
  height: "0.5rem",
  background: "linear-gradient(to right, #475569, #475569, #60a5fa)",
};

const companyHeaderStyle = {
  padding: "1.25rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const companyInfoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const logoStyle = {
  width: "3rem",
  height: "3rem",
  backgroundColor: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "0.875rem",
};

const companyNameStyle = {
  color: "#f97316",
  fontSize: "1.5rem",
  fontWeight: "bold",
};

const companyDetailsStyle = {
  fontSize: "0.75rem",
  color: "#4b5563",
  marginTop: "0.25rem",
};

const challanHeaderStyle = {
  textAlign: "right",
};

const challanTitleStyle = {
  color: "#60a5fa",
  fontSize: "2.25rem",
  fontWeight: "bold",
  letterSpacing: "0.1em",
};

const challanDetailsStyle = {
  fontSize: "0.75rem",
  color: "#4b5563",
  marginTop: "0.5rem",
};

const recipientSectionStyle = {
  backgroundColor: "#e2e8f0",
  padding: "1rem 1.25rem",
};

const recipientContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const recipientAddressStyle = {
  fontSize: "0.75rem",
  color: "#1f2937",
};

const recipientLabelStyle = {
  fontWeight: "bold",
  marginBottom: "0.25rem",
};

const recipientDetailsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "1.25rem",
  fontSize: "0.75rem",
  color: "#4b5563",
};

const detailLabelStyle = {
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: "0.25rem",
};

// Add these new styles to your existing styles
const tableHeaderRateStyle = {
  backgroundColor: "#60a5fa",
  color: "#ffffff",
  padding: "0.75rem",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "0.75rem",
  width: "6rem",
};

const tableHeaderAmountStyle = {
  backgroundColor: "#60a5fa",
  color: "#ffffff",
  padding: "0.75rem",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "0.75rem",
  width: "7rem",
};

const tableCellRightStyle = {
  padding: "1rem",
  textAlign: "right",
  fontSize: "0.75rem",
};

const specificationsRowStyle = {
  backgroundColor: "#f9f9f9",
  borderBottom: "1px solid #ddd",
};

const specificationsCellStyle = {
  padding: "10px",
};

const specificationsTitleStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
};

const specificationsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "5px 20px",
  marginBottom: "10px",
};

const deviceIdsContainer = {
  display: "flex",
  alignItems: "flex-start",
  marginTop: "5px",
};

const deviceIdsTitle = {
  fontWeight: "bold",
  marginRight: "5px",
};

const deviceIdsList = {
  flex: 1,
};
const taxTotalContainerStyle = {
  padding: "1.25rem",
  display: "flex",
  justifyContent: "flex-end",
};

const taxRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "20rem",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
};

const totalsRowStyle = {
  fontWeight: "bold",
  backgroundColor: "#f0f0f0",
};

const minusStyle = {
  color: "red",
};

const taxRowTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "20rem",
  margin: "0.5rem 0",
  paddingTop: "0.5rem",
  borderTop: "1px solid #d1d5db",
  fontSize: "0.875rem",
  fontWeight: "bold",
};

const contactInfoStyle = {
  marginTop: "10px",
  fontSize: "13px",
};

const grandTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "20rem",
  marginTop: "1rem",
  paddingTop: "0.5rem",
  borderTop: "2px solid #d1d5db",
  fontSize: "1rem",
  fontWeight: "bold",
};

const bankDetailsContainerStyle = {
  marginTop: "2rem",
  padding: "1rem",
  fontSize: "0.875rem",
  color: "#1f2937", // gray-800
  backgroundColor: "#f9fafb", // light gray background for neatness
  borderRadius: "0.5rem",
  border: "1px solid #e5e7eb", // soft border (gray-200)
};

const bankDetailsTitleStyle = {
  fontWeight: "bold",
  marginBottom: "0.5rem",
  color: "#111827", // gray-900
};

const bankLineStyle = {
  marginBottom: "0.25rem",
};

const amountWordsStyle = {
  marginTop: "1rem",
  marginBottom: "0.25rem",
};

const highlightTextStyle = {
  fontWeight: "600",
};

const paymentTermsStyle = {
  padding: "0 1.25rem 1.25rem",
  fontSize: "0.875rem",
};

const termsTitleStyle = {
  fontWeight: "bold",
  marginBottom: "0.5rem",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderNoStyle = {
  backgroundColor: "#475569",
  color: "#ffffff",
  padding: "0.75rem",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "0.75rem",
  width: "4rem",
  whiteSpace: "nowrap",
};

const tableHeaderParticularsStyle = {
  backgroundColor: "#60a5fa",
  color: "#ffffff",
  padding: "0.75rem",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "0.75rem",
};

const tableHeaderQtyStyle = {
  backgroundColor: "#60a5fa",
  color: "#ffffff",
  padding: "0.75rem",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "0.75rem",
  width: "5rem",
};

const tableHeaderQtyStyle1 = {
  backgroundColor: "#60a5fa",
  color: "#ffffff",
  padding: "0.75rem",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "0.75rem",
};

const tableRowOddStyle = {
  borderBottom: "1px solid #e2e8f0",
  backgroundColor: "#f1f5f9",
};

const tableRowEvenStyle = {
  borderBottom: "1px solid #e2e8f0",
  backgroundColor: "#e2e8f0",
};

const tableCellStyle = {
  padding: "1rem",
  fontSize: "0.75rem",
};

const tableCellCenterStyle = {
  padding: "1rem",
  textAlign: "center",
  fontSize: "0.75rem",
};

const productNameStyle = {
  fontWeight: "bold",
  fontSize: "14px",
  color: "#000",
  marginBottom: "5px",
};

const assetIdsStyle = {
  fontSize: "12px",
  color: "#555",
  marginTop: "5px",
};

const receiverSignatureStyle = {
  marginTop: "40px",
};

const signatureLabelStyle = {
  fontSize: "14px",
  marginBottom: "5px",
};

const signatureLineStyle = {
  height: "1px",
  width: "250px",
  backgroundColor: "#000",
  marginTop: "30px",
};

const itemTitleStyle = {
  fontWeight: "bold",
  marginBottom: "0.25rem",
};

const footerInfoStyle = {
  padding: "1.25rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};

const taxDetailsStyle = {
  fontSize: "0.75rem",
  color: "#4b5563",
};

const notesSectionStyle = {
  marginBottom: "30px",
};

const notesTitleStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
};

const notesContentStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  minHeight: "50px",
};

const totalContainerStyle = {
  display: "flex",
  alignItems: "center",
};

const totalLabelStyle = {
  backgroundColor: "#60a5fa",
  color: "#ffffff",
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  fontWeight: "bold",
};

const totalValueStyle = {
  backgroundColor: "#475569",
  color: "#ffffff",
  padding: "0.5rem 1rem",
  fontSize: "1.125rem",
  fontWeight: "bold",
  minWidth: "3rem",
  textAlign: "center",
};

const notForSaleStyle = {
  textAlign: "center",
  fontSize: "0.875rem",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "1.25rem 0",
};

const signatureSectionStyle = {
  padding: "0 1.25rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  fontSize: "0.75rem",
  color: "#4b5563",
};

const leftSignatureAreaStyle = {
  width: "50%",
};

const jurisdictionNoteStyle = {
  marginBottom: "0.75rem",
  color: "#1f2937",
};

const signatureTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #d1d5db",
};

const signatureTableHeaderStyle = {
  border: "1px solid #d1d5db",
  padding: "1rem",
  fontWeight: "bold",
  backgroundColor: "#ffffff",
};

const signatureTableCellStyle = {
  border: "1px solid #d1d5db",
  padding: "1rem",
  height: "5rem",
  backgroundColor: "#ffffff",
};

const rightSignatureAreaStyle = {
  textAlign: "center",
  marginLeft: "2rem",
};

const companySignatureLabelStyle = {
  marginBottom: "0.75rem",
  color: "#1f2937",
};

// Add these new styles to your existing styles
const invoicePeriodStyle = {
  padding: "8px 16px",
  backgroundColor: "#f5f5f5",
  borderBottom: "1px solid #ddd",
  fontSize: "15px",
  textAlign: "center",
  marginBottom: "16px",
};

const tableHeaderDaysStyle = {
  ...tableHeaderQtyStyle,
  width: "60px",
  whiteSpace: "nowrap",
  textAlign: "center",
  verticalAlign: "middle",
};

const signatureBoxStyle = {
  width: "12rem",
  height: "6rem",
  border: "1px solid #d1d5db",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#4b5563",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
};

const signatureDesignationStyle = {
  marginTop: "0.75rem",
  fontSize: "0.75rem",
  color: "#1f2937",
};

const companyFooterStyle = {
  backgroundColor: "#334155",
  color: "#ffffff",
  padding: "1rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.75rem",
};

const footerAddressStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const footerContactStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",
};

const footerContactItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export default DynamicTable;

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Box,
//   Stack,
//   Pagination,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Typography,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";

// // Import Icons
// import DeleteIcon from "../../assets/logos/delete.png";
// import EditIcon from "../../assets/logos/edit.png";
// import StatusOff from "../../assets/logos/turnoff.png";
// import StatusOn from "../../assets/logos/turnon.png";
// import API_URL from "../../api/Api_url";

// // API Endpoints Mapping
// const apiEndpoints = {
//   settings: `${API_URL}/users`,
//   roles: `${API_URL}/roles`,
//   product_categories: `${API_URL}/product-categories`,
//   operations: `${API_URL}/delivery-challans`,

// };

// const DynamicTable = ({

//   columns,
//   data: initialData = [],
//   rowsPerPage = 10,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const tableType = location.pathname.split("/").pop();
//   const deleteApiUrl = apiEndpoints[tableType];

//   const [data, setData] = useState([]);
//   const [status, setStatus] = useState([]);

//   useEffect(() => {

//     if (Array.isArray(initialData) && initialData.length > 0) {
//       setData(initialData);
//       setStatus(initialData.map((row) => row.status === "Active"));
//     } else {
//       setData([]);
//       setStatus([]);
//     }
//   }, [initialData]);

//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const toggleStatus = (index) => {
//     setStatus((prevStatus) => {
//       const updatedStatus = [...prevStatus];
//       updatedStatus[index] = !updatedStatus[index];
//       console.log("Toggled Status:", updatedStatus);
//       return updatedStatus;
//     });
//   };

//   // Filter Data Based on Search
//   const filteredData = data.filter((row) =>
//     columns.some((column) =>
//       row[column.id]
//         ?.toString()
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     )
//   );

//   // Pagination Logic
//   const paginatedData = filteredData.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   // Navigate to Edit Page
//   const handleEdit = (row) => {
//     navigate(`${location.pathname}/edit/${row.id}`);
//   };

//   const handleDeleteClick = (row) => {
//     console.log("Selected Row for Deletion:", row);
//     setSelectedRow(row);
//     setOpenDeleteDialog(true);
//   };

//   // Handle Confirm Delete API Call
//   const handleConfirmDelete = async () => {
//     if (selectedRow && deleteApiUrl) {
//       try {
//         const response = await fetch(`${deleteApiUrl}/${selectedRow.id}`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.ok) {
//           console.log(`Deleted ID: ${selectedRow.id} from ${tableType}`);
//           setData((prevData) =>
//             prevData.filter((row) => row.id !== selectedRow.id)
//           );
//         } else {
//           console.error("Failed to delete:", await response.text());
//         }
//       } catch (error) {
//         console.error("Error deleting:", error);
//       }
//     }
//     setOpenDeleteDialog(false);
//   };

//   return (
//     <Box>
//       {/* Search and Add Button */}
//       <Box
//         display="flex"
//         justifyContent="flex-end"
//         alignItems="center"
//         gap={2}
//         mb={2}
//       >
//         <TextField
//           label="Search"
//           variant="outlined"
//           size="small"
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         {tableType !== "inventory" && (
//           <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate(`${location.pathname}/add`)}
//         >
//           {tableType === "settings"
//             ? "Add User"
//             : tableType === "crm"
//             ? "Add Client"
//             : tableType === "operations"
//             ? "Add DC"
//             : tableType === "job_description"
//             ? "Add Job Description"
//             : `Add ${tableType.charAt(0).toUpperCase() + tableType.slice(1)}`}
//         </Button>
//         )}
//       </Box>

//       {/* Table */}
//       <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//         <Table sx={{ minWidth: 600 }}>
//           <TableHead>
//             <TableRow>
//               {columns.map((column, index) => (
//                 <TableCell
//                   key={index}
//                   align="center"
//                   sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//               {tableType !== "purchase-requests" &&
//                 tableType !== "purchase-orders" &&
//                 tableType !== "goodsreceipt" &&
//                 tableType !== "po-quotations" &&
//                 tableType !== "supplier" &&
//                 tableType !== "inventory" &&
//                 tableType !== "quotations" &&
//                 tableType !== "orders" &&
//                 tableType !== "operations" && (
//                   <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                     Active Status
//                   </TableCell>
//                 )}
//               {tableType !== "inventory" && (
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                   Action
//                 </TableCell>
//               )}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map((row, rowIndex) => (
//                 <TableRow key={row.id}>
//                   {columns.map((column, colIndex) => (
//                     <TableCell
//                       key={colIndex}
//                       align="center"
//                       sx={{
//                         minWidth: column.id === "specifications" ? 250 : 106,
//                         maxWidth: column.id === "specifications" ? 300 : "auto",
//                         whiteSpace:
//                           column.id === "specifications"
//                             ? "pre-wrap"
//                             : "normal",
//                         wordWrap:
//                           column.id === "specifications"
//                             ? "break-word"
//                             : "normal",
//                         textAlign:
//                           column.id === "specifications" ? "left" : "center",
//                       }}
//                     >
//                       {[
//                         "purchase_request_status",
//                         "po_quotation_status",
//                         "po_status",
//                         "goods_receipt_status",
//                         "status",
//                         "order_status",
//                       ].includes(column.id) ? (
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             fontWeight: 600,
//                             px: 1.5,
//                             py: 0.5,
//                             borderRadius: 2,
//                             display: "inline-block",
//                             color:
//                               row[column.id] === "Pending"
//                                 ? "#b26a00"
//                                 : row[column.id] === "Approved"
//                                 ? "#1b5e20"
//                                 : row[column.id] === "Rejected"
//                                 ? "#b71c1c"
//                                 : "inherit",
//                             backgroundColor:
//                               row[column.id] === "Pending"
//                                 ? "#fff3e0"
//                                 : row[column.id] === "Approved"
//                                 ? "#e8f5e9"
//                                 : row[column.id] === "Rejected"
//                                 ? "#ffebee"
//                                 : "transparent",
//                           }}
//                         >
//                           {row[column.id]}
//                         </Typography>
//                       ) : (
//                         row[column.id] || "N/A"
//                       )}
//                     </TableCell>
//                   ))}

//                   {tableType !== "purchase-requests" &&
//                     tableType !== "purchase-orders" &&
//                     tableType !== "goodsreceipt" &&
//                     tableType !== "po-quotations" &&
//                     tableType !== "supplier" &&
//                     tableType !== "inventory" &&
//                     tableType !== "quotations" &&
//                     tableType !== "orders" &&
//                     tableType !== "operations" && (
//                       <TableCell align="center">
//                         <Button onClick={() => toggleStatus(rowIndex)}>
//                           <img
//                             src={status[rowIndex] ? StatusOn : StatusOff}
//                             alt={status[rowIndex] ? "Active" : "Inactive"}
//                             width="40"
//                             height="24"
//                           />
//                         </Button>
//                       </TableCell>
//                     )}

//                   {tableType !== "inventory" && (
//                     <TableCell align="center">
//                       <Box display="flex" justifyContent="center" gap={1}>
//                         <Button
//                           onClick={() => handleEdit(row)}
//                           sx={{ minWidth: "30px", p: 0 }}
//                         >
//                           <img
//                             src={EditIcon}
//                             alt="Edit"
//                             width="45"
//                             height="35"
//                           />
//                         </Button>
//                         <Button
//                           onClick={() => handleDeleteClick(row)}
//                           sx={{ minWidth: "30px", p: 0 }}
//                         >
//                           <img
//                             src={DeleteIcon}
//                             alt="Delete"
//                             width="45"
//                             height="35"
//                           />
//                         </Button>
//                       </Box>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length + 2} align="center">
//                   <Typography>No data available</Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <Stack
//         spacing={2}
//         direction="row"
//         justifyContent="center"
//         alignItems="center"
//         sx={{ marginTop: 2 }}
//       >
//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={(event, value) => setPage(value)}
//           color="primary"
//         />
//       </Stack>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete{" "}
//             <b>{selectedRow ? selectedRow[columns[1]?.id] : "this record"}</b>?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default DynamicTable;
