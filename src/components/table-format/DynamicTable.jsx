import React, { useEffect, useState } from "react";
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
  Branch: `${API_URL}/branches`,
  users: `${API_URL}/users`,
  invoices: `${API_URL}/invoices`,
  grn: `${API_URL}/credit-notes`,
  service: `${API_URL}/service`,
  clients: `${API_URL}/clients`,
  asset_modification_tracker: `${API_URL}/asset-modifications`,
  "dispatch-orders": `${API_URL}/dispatch-orders`,
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

const DeliveryChallanDialog = ({ open, onClose, dcData }) => {
  if (!dcData) return null;

  const handleDownloadPDF = () => {
    const input = document.getElementById("delivery-challan-container");

    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`delivery-challan-${dcData.dc_id}.pdf`);
    });
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
                  <div style={recipientLabelStyle}>To</div>
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
                    <div style={detailLabelStyle}>Customer Code :</div>
                    {dcData.customer_code}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Person :</div>
                    {dcData.shipping_ordered_by}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Received Person :</div>
                    {dcData.receiver_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Delivered Staff :</div>
                    {dcData.delivery_person_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>PO Number:</div>
                    {dcData.dc_id || "N/A"}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Number :</div>
                    {dcData.shipping_phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Receiver Number :</div>
                    {dcData.receiver_phone_number}
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
        <Button onClick={() => window.print()}>Print</Button>
      </DialogActions>
    </Dialog>
  );
};

// Goods Return Note Dialog Component
const GoodsReturnNoteDialog = ({ open, onClose, grnData }) => {
  if (!grnData) return null;

  const handleDownloadPDF = () => {
    const input = document.getElementById("grn-container");

    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`goods-return-note-${grnData.grn_number}.pdf`);
    });
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
                    CIN: U72200KA2008PTC047679
                    <br />
                    GST: {grnData.gst_number || "29AADCG2608Q1Z6"}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>GOODS RETURN NOTE</div>
                <div style={challanDetailsStyle}>
                  GRN No: {grnData.grn_number}
                  <br />
                  GRN Date:{" "}
                  {new Date(grnData.grn_date).toLocaleDateString("en-GB")}
                  <br />
                  Order No: {grnData.dispatch_order_number}
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div style={recipientSectionStyle}>
              <div style={recipientContainerStyle}>
                <div style={recipientAddressStyle}>
                  <div style={recipientLabelStyle}>To</div>
                  {grnData.company_name}
                  <br />
                  {grnData.street && `${grnData.street}, `}
                  {grnData.landmark && `${grnData.landmark}, `}
                  {grnData.city}, {grnData.state}
                  <br />
                  {grnData.country} - {grnData.pincode}
                </div>
                <div style={recipientDetailsGridStyle}>
                  <div>
                    <div style={detailLabelStyle}>Contact Person :</div>
                    {grnData.informed_person_name}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Collected By :</div>
                    {grnData.returner_name}
                  </div>

                  <div>
                    <div style={detailLabelStyle}>Collected Person No:</div>
                    {grnData.receiver_phone}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Invoice Number:</div>
                    {grnData.invoice_number || "N/A"}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Number :</div>
                    {grnData.phone_number}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Vehicle Number :</div>
                    {grnData.vehicle_number}
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
                      key={item.grn_item_id || index}
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
                          {item.product?.brand || "—"}, Model:{" "}
                          {item.product?.model || "—"}, Processor:{" "}
                          {item.product?.processor || "—"}, RAM:{" "}
                          {item.product?.ram || "—"}, <br />
                          Storage: {item.product?.storage || "—"}, Disk Type:{" "}
                          {item.product?.disk_type || "—"}, Graphics:{" "}
                          {item.product?.graphics || "—"}, OS:{" "}
                          {item.product?.os || "—"}
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
                {grnData.pan_number}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {grnData.gst_number}
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
              <strong>Description:</strong> {grnData.description}
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
                        {grnData.company_name}
                        <br />
                        {grnData.street && `${grnData.street}, `}
                        {grnData.landmark && `${grnData.landmark}, `}
                        {grnData.city}, {grnData.state}
                        <br />
                        {grnData.country} - {grnData.pincode}
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
        <Button onClick={() => window.print()}>Print</Button>
      </DialogActions>
    </Dialog>
  );
};

const CreditNoteDialog = ({ open, onClose, creditNoteData }) => {
  if (!creditNoteData) return null;

  // Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate days between returned_date and rental_end_date
  const calculateDaysDifference = (returnedDate, rentalEndDate) => {
    if (!returnedDate || !rentalEndDate) return 0;
    const returned = new Date(returnedDate);
    const rentalEnd = new Date(rentalEndDate);
    const diffTime = Math.abs(rentalEnd - returned);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of both dates
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
    const daysUsed = calculateDaysDifference(monthStartDate, returnedDate) - 1;

    // Calculate day difference
    const daysDifference = Math.ceil(
      (endOfMonth - returnedDate) / (1000 * 60 * 60 * 24)
    );

    return items.map((item) => {
      const unitPrice = parseFloat(item.unit_price || 0);
      const dailyRate = unitPrice / 30;
      const totalPrice = daysDifference * item.quantity * dailyRate;

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

  const handleDownloadPDF = () => {
    const input = document.getElementById("credit-note-container");

    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`credit-note-${creditNoteData.credit_note_number}.pdf`);
    });
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
                  Return Date:{" "}
                  {new Date(creditNoteData.returned_date).toLocaleDateString(
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

                  <div>
                    <div style={detailLabelStyle}>Payment Type:</div>
                    {creditNoteData.payment_type}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Industry:</div>
                    {creditNoteData.industry}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Email:</div>
                    {creditNoteData.email}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Created By:</div>
                    {creditNoteData.created_by}
                  </div>
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
                            {formatDate(item.monthStartDate)} to{" "}
                            {formatDate(item.returnedDate)}
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
                Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar Branch
              </div>
              <div style={bankLineStyle}>
                Current A/c No: 50200066787843. &nbsp;&nbsp; IFSC Code:
                HDFC0000261
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
        <Button onClick={() => window.print()}>Print</Button>
      </DialogActions>
    </Dialog>
  );
};

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
//             Current A/c No: 50200066787843. &nbsp;&nbsp; IFSC Code: HDFC0000261
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
  const invoiceDate = new Date(invoiceData.invoice_start_date);
  const paymentMode = invoiceData.payment_mode === "Postpaid";
  const isKarnataka = invoiceData.shippingDetail?.state === "Karnataka";

  // Date calculations
  const invoiceStartDate = new Date(invoiceData.invoice_start_date);
  const dcDate = new Date(invoiceData.dc_date);
  const invoiceEndDate = new Date(invoiceData.invoice_end_date);
  const dcPeriodEnd = new Date(dcDate.getFullYear(), dcDate.getMonth() + 1, 0);

  // Calculate month difference between invoice start date and DC date
  const monthDiff =
    (invoiceStartDate.getFullYear() - dcDate.getFullYear()) * 12 +
    (invoiceStartDate.getMonth() - dcDate.getMonth());

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

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both dates
  };

  const calculateReturnDays = (returnDate) => {
    const returnDateObj = new Date(returnDate);
    if (monthDiff > 1) {
      // If more than 1 month difference, calculate from start of month to return date
      const startOfMonth = new Date(
        returnDateObj.getFullYear(),
        returnDateObj.getMonth(),
        1
      );
      return calculateDays(startOfMonth, returnDateObj);
    } else {
      // Otherwise calculate from dc date to return date
      return calculateDays(dcDate, returnDateObj);
    }
  };

  const calculateInvoiceItems = () => {
    // Step 1: Preprocess returned devices from additional challans
    const challanReturnsMap = {};

    invoiceData.additional_delivery_challans?.forEach((challan) => {
      challan.credit_notes?.forEach((cn) => {
        const returnedDate = new Date(cn.returned_date);

        cn.items?.forEach((ri) => {
          const key = `${ri.product_id}`;
          if (!challanReturnsMap[key]) challanReturnsMap[key] = [];

          const startOfMonth = new Date(
            returnedDate.getFullYear(),
            returnedDate.getMonth(),
            1
          );
          const daysUsed = calculateDays(startOfMonth, returnedDate);
          const dailyRate = invoiceData.items?.find(
            (item) => item.product_id === ri.product_id
          )
            ? Number(
                invoiceData.items.find(
                  (item) => item.product_id === ri.product_id
                ).unit_price
              ) / 30
            : 0;

          challanReturnsMap[key].push({
            returnedDate,
            daysUsed,
            deviceIds: ri.device_ids,
            amount: parseFloat(
              (daysUsed * dailyRate * ri.device_ids.length).toFixed(2)
            ),
          });
        });
      });
    });

    // Step 2: Gather all returned device IDs (from root & additional)
    const allReturnedDeviceIds = [
      ...(invoiceData.credit_notes?.flatMap((cn) =>
        cn.items.flatMap((ri) => ri.device_ids)
      ) || []),
      ...(Object.values(challanReturnsMap).flatMap((arr) =>
        arr.flatMap((r) => r.deviceIds)
      ) || []),
    ];

    // Step 3: Process main invoice items
    const mainItems =
      invoiceData.items?.map((item) => {
        const rate = isBuyTransaction
          ? Number(item.total_price) || 0
          : Number(item.unit_price) || 0;
        const dailyRate = rate / 30;
        const originalDeviceIds = item.device_ids || [];
        const days = calculateDays(invoiceStartDate, invoiceEndDate); // Actual days calculation
        const isFullMonth = days >= 28; // Consider as full month if 28+ days

        const returnedItems =
          invoiceData.credit_notes?.flatMap((cn) =>
            cn.items
              .filter((ri) => ri.product_id === item.product_id)
              .map((ri) => ({
                ...ri,
                returned_date: cn.returned_date,
              }))
          ) || [];

        const preInvoiceReturnedDeviceIds = returnedItems.flatMap((ri) =>
          new Date(ri.returned_date) < invoiceStartDate ? ri.device_ids : []
        );

        const effectiveDeviceIds = originalDeviceIds.filter(
          (id) =>
            !preInvoiceReturnedDeviceIds.includes(id) &&
            !allReturnedDeviceIds.includes(id)
        );

        const effectiveQty = effectiveDeviceIds.length;
        const dcDays = calculateDays(dcDate, dcPeriodEnd);

        const grouped = {};

        returnedItems.forEach((ri) => {
          const returnedDate = new Date(ri.returned_date);
          if (returnedDate <= invoiceEndDate) {
            const daysUsed = calculateReturnDays(ri.returned_date);
            const key = returnedDate.toISOString().split("T")[0];
            if (!grouped[key]) {
              grouped[key] = {
                returnedDate,
                daysUsed,
                deviceIds: [],
                unusedDays: dcDays - daysUsed,
              };
            }
            grouped[key].deviceIds.push(...ri.device_ids);
          }
        });

        const extraReturns =
          challanReturnsMap[item.product_id]?.filter(
            (er) => new Date(er.returnedDate) <= invoiceEndDate
          ) || [];

        extraReturns.forEach((er) => {
          const key = er.returnedDate.toISOString().split("T")[0];
          if (!grouped[key]) {
            grouped[key] = {
              returnedDate: er.returnedDate,
              daysUsed: er.daysUsed,
              deviceIds: [],
              unusedDays: 0,
            };
          }
          grouped[key].deviceIds.push(...er.deviceIds);
          grouped[key].amount = (grouped[key].amount || 0) + er.amount;
        });

        const returnedDevices = Object.values(grouped).map((rd) => ({
          ...rd,
          amount:
            rd.amount ||
            parseFloat(
              (rd.daysUsed * dailyRate * rd.deviceIds.length).toFixed(2)
            ),
        }));

        const returnedQty = returnedDevices.reduce(
          (sum, rd) => sum + rd.deviceIds.length,
          0
        );
        const usedQty = effectiveQty - returnedQty;

        // Calculate amount based on payment mode
        let fullMonthAmount;
        if (paymentMode) {
          // For Postpaid, calculate based on actual usage (full period minus returns)
          fullMonthAmount = effectiveQty * rate;
          if (!isFullMonth) {
            fullMonthAmount = effectiveQty * dailyRate * days;
          }
        } else {
          // For Prepaid, calculate full amount (returns will be handled separately)
          fullMonthAmount = isFullMonth
            ? effectiveQty * rate
            : effectiveQty * dailyRate * days;
        }

        const returnedDevicesAmount = returnedDevices.reduce(
          (sum, rd) => sum + rd.amount,
          0
        );

        const dcAmountBeforeReturns = showDcPeriod && !paymentMode && !isBuyTransaction
          ? effectiveQty * dailyRate * dcDays
          : 0;

        return {
          ...item,
          originalDeviceIds,
          device_ids: effectiveDeviceIds,
          quantity: effectiveQty,
          usedQty,
          returnedQty,
          rate,
          dailyRate,
          days,
          dcDays,
          amount: fullMonthAmount,
          dcAmountBeforeReturns,
          returnedDevices,
          totalReturnedQtyAmount: returnedDevicesAmount,
          description: `Billing Start Date: ${formatDate(
            invoiceStartDate
          )} - Billing End Date: ${formatDate(invoiceEndDate)} (${days} days)`,
          isFullMonth,
        };
      }) || [];

    // Step 4: Process additional delivery challan items
    const additionalItems =
      invoiceData.additional_delivery_challans?.flatMap((challan) =>
        challan.items.map((item) => {
          const quantity = Number(item.quantity) || 0;
          const unit_price =
            quantity > 0 ? Number(item.total_price) / quantity : 0;
          const amount = Number(item.total_price) || 0;

          const challanDateObj = new Date(challan.dc_date);
          const challanMonthEnd = new Date(
            challanDateObj.getFullYear(),
            challanDateObj.getMonth() + 1,
            0
          );
          const days = calculateDays(challan.dc_date, challanMonthEnd);
          const isFullMonth = days >= 28;

          const productDetails = invoiceData.items?.find(
            (mainItem) => mainItem.product_id === item.product_id
          )?.productDetails;

          const relatedReturns =
            challan.credit_notes?.flatMap((cn) =>
              cn.items
                .filter((ri) => ri.product_id === item.product_id)
                .map((ri) => {
                  const daysUsed = calculateReturnDays(cn.returned_date);
                  return {
                    returnedDate: cn.returned_date,
                    daysUsed,
                    deviceIds: ri.device_ids,
                    amount: parseFloat(
                      (
                        (unit_price / 30) *
                        ri.device_ids.length *
                        daysUsed
                      ).toFixed(2)
                    ),
                  };
                })
            ) || [];

          const totalReturnedQtyAmount = relatedReturns.reduce(
            (sum, r) => sum + r.amount,
            0
          );

          // Calculate amount based on payment mode
          let calculatedAmount;
          if (paymentMode) {
            // For Postpaid, calculate based on actual usage
            calculatedAmount = isFullMonth
              ? quantity * unit_price
              : quantity * (unit_price / 30) * days;
          } else {
            // For Prepaid, calculate full amount
            calculatedAmount = isFullMonth
              ? quantity * unit_price
              : quantity * (unit_price / 30) * days;
          }

          return {
            ...item,
            isAdditionalChallan: true,
            challanNumber: challan.dc_id,
            challanDate: challan.dc_date,
            challanMonthEndDate: challanMonthEnd.toISOString().split("T")[0],
            device_ids: item.device_ids || [],
            quantity,
            unit_price,
            rate: unit_price,
            amount: calculatedAmount,
            days,
            description: `Additional Delivery Challan: ${
              challan.dc_id
            } (${formatDate(challan.dc_date)}) - ${days} days`,
            returnedDevices: relatedReturns,
            totalReturnedQtyAmount,
            productDetails,
            isFullMonth,
          };
        })
      ) || [];

    // Step 5: Combine all items
    return [...mainItems, ...additionalItems];
  };

  const items = calculateInvoiceItems();

  const groupItemsByProduct = (items) => {
    const grouped = {};

    items.forEach((item) => {
      const key = item.product_id;
      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          allDeviceIds: [...(item.device_ids || [])],
          allRows: [item],
          isAdditional: item.isAdditionalChallan,
          totalQuantity: item.quantity || 0,
          totalAmount: item.amount || 0,
          dcAmountBeforeReturns: item.dcAmountBeforeReturns || 0,
          returnedDevices: [...(item.returnedDevices || [])],
          totalReturnedQtyAmount: item.totalReturnedQtyAmount || 0,
        };
      } else {
        grouped[key].allDeviceIds = [
          ...grouped[key].allDeviceIds,
          ...(item.device_ids || []),
        ];
        grouped[key].allRows.push(item);
        grouped[key].totalQuantity += item.quantity || 0;
        grouped[key].totalAmount += item.amount || 0;
        grouped[key].dcAmountBeforeReturns += item.dcAmountBeforeReturns || 0;

        // Merge returned devices without duplicates
        const existingDeviceIds = new Set(
          grouped[key].returnedDevices.flatMap((rd) => rd.deviceIds)
        );

        item.returnedDevices?.forEach((rd) => {
          const newDeviceIds = rd.deviceIds.filter(
            (id) => !existingDeviceIds.has(id)
          );
          if (newDeviceIds.length > 0) {
            grouped[key].returnedDevices.push({
              ...rd,
              deviceIds: newDeviceIds,
            });
            grouped[key].totalReturnedQtyAmount += rd.amount;
          }
        });
      }
    });

    return Object.values(grouped);
  };

  const groupedItems = groupItemsByProduct(items);

  const computedTotalAmount1 = groupedItems.reduce((acc, group) => {
    // Main invoice period amount (full month or prorated)
    const mainAmount = paymentMode
      ? group.totalAmount // For Postpaid, we already calculated the correct amount
      : group.isFullMonth
      ? group.rate * group.totalQuantity
      : group.dailyRate * group.totalQuantity * group.days;

    // DC period amount (only for Prepaid invoices)
    const dcAmount = !paymentMode ? group.dcAmountBeforeReturns : 0;

    // Returned amounts (ONLY subtract for Postpaid invoices)
    const returnsAmount = paymentMode
      ? group.totalReturnedQtyAmount
      : 0;

    return acc + mainAmount + dcAmount - returnsAmount;
  }, 0);

  const computedPostpaidTotalAmount = groupedItems.reduce((total, group) => {
  let groupTotal = 0;

  // 1. Main item charge
  if (group.isFullMonth) {
    groupTotal += group.rate * group.totalQuantity;
  } else {
    groupTotal += (group.dailyRate || group.rate / 30) * group.totalQuantity * group.days;
  }

  // 2. Add mid-month usage (dcAmountBeforeReturns)
  group.allRows?.forEach((row) => {
    if (row.dcAmountBeforeReturns > 0) {
      groupTotal += row.dcAmountBeforeReturns;
    }
  });

  // 3. Add returned device charges (Postpaid only)
  if (paymentMode && group.returnedDevices?.length > 0) {
    group.returnedDevices.forEach((rd) => {
      groupTotal += rd.amount;
    });
  }

  return total + groupTotal;
}, 0);

const computedTotalAmount = paymentMode ? computedPostpaidTotalAmount : computedTotalAmount1;

  const netAmount = computedTotalAmount;
  const cgst = netAmount * 0.09;
  const sgst = netAmount * 0.09;
  const igst = isKarnataka ? 0 : netAmount * 0.18;
  const totalTax = cgst + sgst + igst;
  const grandTotal = netAmount + totalTax;

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
              Invoice Date:{" "}
              {paymentMode
                ? formatDate(invoiceEndDate)
                : formatDate(invoiceDate)}
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
              <div>
                <div style={detailLabelStyle}>Customer GST :</div>
                {invoiceData.customer_gst_number}
              </div>
              <div>
                <div style={detailLabelStyle}>PAN Number :</div>
                {invoiceData.pan_number}
              </div>
              <div>
                <div style={detailLabelStyle}>Order Number :</div>
                {invoiceData.dispatch_order_number}
              </div>
              <div>
                <div style={detailLabelStyle}>DC Date :</div>
                {invoiceData.dc_date}
              </div>
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

        {/* TABLE */}
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
            {(() => {
              let rowCounter = 0; // Global counter for alternating row styles

              return groupedItems.map((group, index) => {
                const dailyRate = group.dailyRate || group.rate / 30;
                const product = group.productDetails || group.product;
                const isAdditional = group.isAdditional;
                const days = group.days;

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
                          <strong>Brand:</strong> {product.brand}.{" "}
                        </>
                      )}
                      {product?.model && (
                        <>
                          <strong>Model:</strong> {product.model}.{" "}
                        </>
                      )}
                      {product?.processor && (
                        <>
                          <strong>Processor:</strong> {product.processor}.{" "}
                        </>
                      )}
                      {product?.ram && (
                        <>
                          <strong>RAM:</strong> {product.ram}.{" "}
                        </>
                      )}
                      {product?.storage && (
                        <>
                          <strong>Storage:</strong> {product.storage}.{" "}
                        </>
                      )}
                      {product?.disk_type && (
                        <>
                          <strong>Disk Type:</strong> {product.disk_type}.{" "}
                        </>
                      )}
                      {product?.graphics && (
                        <>
                          <strong>Graphics:</strong> {product.graphics}.{" "}
                        </>
                      )}
                      {product?.os && (
                        <>
                          <strong>OS:</strong> {product.os}.{" "}
                        </>
                      )}
                    </div>
                  );
                };

                return (
                  <React.Fragment key={`group-${index}`}>
                    {/* Main Product Row */}
                    <tr
                      style={
                        ++rowCounter % 2 === 0
                          ? tableRowEvenStyle
                          : tableRowOddStyle
                      }
                    >
                      <td style={tableCellCenterStyle}>{index + 1}</td>
                      <td style={tableCellStyle}>
                        <div style={itemTitleStyle}>{group.product_name}</div>
                        {renderSpecifications(product)}
                        {group.allDeviceIds.length > 0 && (
                          <>
                            <br />
                            <div style={itemTitleStyle}>
                              Asset IDs: {group.allDeviceIds.join(", ")}
                            </div>
                          </>
                        )}
                        {!isAdditional && (
                          <>
                            <br />
                            <div style={itemTitleStyle}>
                              Billing Start Date: {formatDate(invoiceStartDate)}{" "}
                              - Billing End Date: {formatDate(invoiceEndDate)}
                            </div>
                          </>
                        )}
                      </td>
                      <td style={tableCellCenterStyle}>
                        {group.totalQuantity}
                      </td>
                      {invoiceData.transaction_type === "Rent" && (
                        <>
                          <td style={tableCellCenterStyle}>{days}</td>
                          <td style={tableCellCenterStyle}>
                            {formatINRCurrency(dailyRate)}
                          </td>
                        </>
                      )}

                      <td style={tableCellRightStyle}>
                        {formatINRCurrency(group.rate)}
                      </td>
                      <td style={tableCellRightStyle}>
                        {group.isFullMonth ? (
                          <>
                            {formatINRCurrency(
                              group.rate * group.totalQuantity
                            )}
                          </>
                        ) : (
                          <>
                            {formatINRCurrency(
                              group.dailyRate * group.totalQuantity * group.days
                            )}
                          </>
                        )}
                      </td>
                    </tr>

                    {/* Mid-Month Usage Rows */}
                    {!isAdditional && !isBuyTransaction &&
                      showDcPeriod &&
                      group.allRows.map((row, rowIndex) =>
                        row.dcAmountBeforeReturns > 0 ? (
                          <tr>
                            <td style={tableCellCenterStyle}></td>
                            <td style={tableCellStyle}>
                              <div>
                                <strong>Mid-Month Usage:</strong>
                              </div>
                              <br />
                              <div style={itemTitleStyle}>
                                {group.product_name}
                              </div>
                              {renderSpecifications(product)}
                              <br />
                              <div style={itemTitleStyle}>
                                Asset IDs: {row.device_ids?.join(", ")}
                              </div>
                              <br />
                              <div style={itemTitleStyle}>
                                Billing Start Date: {formatDate(dcDate)} to{" "}
                                {formatDate(dcPeriodEnd)}
                              </div>
                            </td>
                            <td style={tableCellCenterStyle}>{row.quantity}</td>
                            <td style={tableCellCenterStyle}>{row.dcDays}</td>
                            <td style={tableCellCenterStyle}>
                              {formatINRCurrency(dailyRate)}
                            </td>
                            <td style={tableCellRightStyle}></td>
                            <td style={tableCellRightStyle}>
                              {formatINRCurrency(row.dcAmountBeforeReturns)}
                            </td>
                          </tr>
                        ) : null
                      )}

                    {paymentMode &&
                      group.returnedDevices?.map((rd, rdIndex) => {
                        const returnDate = new Date(rd.returnedDate);
                        const startDate =
                          monthDiff > 1
                            ? new Date(
                                returnDate.getFullYear(),
                                returnDate.getMonth(),
                                1
                              )
                            : dcDate;

                        return (
                          <tr key={`returned-${index}-${rdIndex}`}>
                            <td style={tableCellCenterStyle}></td>
                            <td style={tableCellStyle}>
                              <div>
                                <strong>Returned Asset IDs:</strong>{" "}
                                {rd.deviceIds.join(", ")}
                              </div>
                              <br />
                              <div style={itemTitleStyle}>
                                {group.product_name}
                              </div>
                              {renderSpecifications(product)}
                              {/* <br />
                              Used for {rd.daysUsed} days:{" "}
                              {formatDate(startDate)} to{" "}
                              {formatDate(rd.returnedDate)} */}
                            </td>
                            <td style={tableCellCenterStyle}>
                              {rd.deviceIds.length}
                            </td>
                            <td style={tableCellCenterStyle}>{rd.daysUsed}</td>
                            <td style={tableCellCenterStyle}>
                              {formatINRCurrency(dailyRate)}
                            </td>
                            <td style={tableCellRightStyle}></td>
                            <td style={tableCellRightStyle}>
                              {formatINRCurrency(rd.amount)}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              });
            })()}

            <tr style={totalsRowStyle}>
              <td
                style={tableCellCenterStyle}
                colSpan={invoiceData.transaction_type === "Rent" ? 6 : 4}
              >
                <strong>TOTAL</strong>
              </td>
              <td style={tableCellRightStyle}>
                {formatINRCurrency(computedTotalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tax and Total Section */}
        <div style={taxTotalContainerStyle}>
          <div style={taxDetailsStyle}>
            <div style={taxRowStyle}>
              <span>Subtotal:</span>
              <span>{formatINRCurrency(computedTotalAmount)}</span>
            </div>

            <div style={taxRowStyle}>
              <span>CGST @9%:</span>
              <span>{formatINRCurrency(cgst)}</span>
            </div>
            <div style={taxRowStyle}>
              <span>SGST @9%:</span>
              <span>{formatINRCurrency(sgst)}</span>
            </div>
            {!isKarnataka && (
              <div style={taxRowStyle}>
                <span>IGST @18%:</span>
                <span>{formatINRCurrency(igst)}</span>
              </div>
            )}
            <div style={taxRowTotalStyle}>
              <span>Total Tax:</span>
              <span>{formatINRCurrency1(totalTax)}</span>
            </div>

            <div style={grandTotalStyle}>
              <span>Grand Total:</span>
              <span>{formatINRCurrency1(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div style={bankDetailsContainerStyle}>
          <div style={bankDetailsTitleStyle}>Bank Details:</div>
          <div style={bankLineStyle}>
            Guru Goutham Infotech Pvt. Ltd., HDFC Bank Ltd, Jayanagar Branch
          </div>
          <div style={bankLineStyle}>
            Current A/c No: 50200066787843. &nbsp;&nbsp; IFSC Code: HDFC0000261
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

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Wait for dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Try multiple selectors to find the invoice element
      const element =
        document.getElementById("invoice-current-month-invoice") ||
        document.querySelector(".MuiDialog-paper .invoice-container");

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

      pdf.save(`invoice-${invoiceData.invoice_number}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("invoice-current-month-invoice");

    if (!element) {
      console.error("Print element not found");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Current Month Invoice</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
            .print-container { 
              width: 210mm; 
              min-height: 297mm; 
              padding: 10mm; 
              box-sizing: border-box;
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
                window.close();
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
        <div style={{ padding: "20px" }}>{renderInvoice()}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handlePrint} variant="contained" color="secondary">
          Print
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
        >
          Download PDF
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

  const [data, setData] = useState([]);
  const [status, setStatus] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedDCRow, setSelectedDCRow] = useState(null);
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
      console.log("Toggled Status:", updatedStatus);
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
    console.log("Selected Row for Deletion:", row);
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleViewDC = async (row) => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-challans/${row.id}`
      );
      console.log("DC Data Response:", response.data);
      setSelectedDCRow(response.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error fetching DC details:", error);
    }
  };

  // Add this to your component where you manage the dialog state
  const [openGrnDialog, setOpenGrnDialog] = useState(false);
  const [selectedGrnRow, setSelectedGrnRow] = useState(null);
  const [selectedCreditNoteRow, setSelectedCreditNoteRow] = useState(null);
  const [openCreditNoteDialog, setOpenCreditNoteDialog] = useState(false);

  const handleViewGRN = async (row) => {
    try {
      const response = await axios.get(`${API_URL}/grns/${row.id}`);
      console.log("GRN Data Response:", response.data);
      setSelectedGrnRow(response.data);
      setOpenGrnDialog(true);
    } catch (error) {
      console.error("Error fetching GRN details:", error);
    }
  };

  const handleViewCreditNote = async (row, type = "credit") => {
    try {
      const response = await axios.get(`${API_URL}/credit-notes/${row.id}`);
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
      const response = await axios.get(`${API_URL}/invoices/${row.id}`);
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
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(`Deleted ID: ${selectedRow.id} from ${tableType}`);
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
          tableType !== "credit-notes" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`${location.pathname}/add`)}
            >
              {tableType === "settings"
                ? "Add User"
                : tableType === "crm"
                ? "Add Client"
                : tableType === "operations"
                ? "Add DC"
                : tableType === "credit_notes"
                ? "Add Return Order"
                : tableType === "job_description"
                ? "Add Job Description"
                : `Add ${
                    tableType.charAt(0).toUpperCase() + tableType.slice(1)
                  }`}
            </Button>
          )}
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
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
                "credit-notes",
                "asset-modifications",
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

              {tableType === "operations" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View DC
                </TableCell>
              )}

              {tableType === "credit-notes" && (
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  View Credit Note
                </TableCell>
              )}

              {["inventory", "asset", "grn", "credit-notes"].includes(
                tableType
              ) === false && (
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
                        title="View Current Invoice"
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

                  {/* Action Buttons */}
                  {["inventory"].includes(tableType) === false && (
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        {/* {tableType === "grn" && (
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
                        )} */}

                        {["asset", "credit-notes"].includes(tableType) ===
                          false && (
                          <>
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
            Are you sure you want to delete{" "}
            <b>{selectedRow ? selectedRow[columns[1]?.id] : "this record"}</b>?
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
    </Box>
  );
};

// Styles (keep all your existing styles exactly as they are)
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
