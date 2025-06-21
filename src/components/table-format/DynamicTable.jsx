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
  "client-list": `${API_URL}/clients`,
  leads: `${API_URL}/leads`,
  orders: `${API_URL}/orders`,
  contact_type: `${API_URL}/contact-types`,
  taxt_list: `${API_URL}/tax-list`,
  Branch: `${API_URL}/branches`,
  users: `${API_URL}/users`,
  invoices: `${API_URL}/invoices`,
  grn: `${API_URL}/goods-return-notes`,
  service: `${API_URL}/service`,
  credit_notes: `${API_URL}/credit-notes`,
  clients: `${API_URL}/clients`,
};

// Delivery Challan Dialog Component
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
                    CIN: U72200KA2008PTC047679
                    <br />
                    GST: {dcData.gst_number || "29AADCG2608Q1Z6"}
                  </div>
                </div>
              </div>
              <div style={challanHeaderStyle}>
                <div style={challanTitleStyle}>DELIVERY CHALLAN</div>
                <div style={challanDetailsStyle}>
                  Challan No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                  {dcData.dc_id}
                  <br />
                  Challan Date. &nbsp;&nbsp;&nbsp;:{" "}
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
                  {dcData.city}, {dcData.state}
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
                    {dcData.order_number || "N/A"}
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
                      <div style={itemTitleStyle}>{item.product_name}</div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: "10px",
                          color: "#555",
                        }}
                      >
                        <div style={specificationsTitleStyle}>
                          Specifications:
                        </div>
                        <div>
                          <strong>Brand:</strong> {item.product?.brand}
                        </div>
                        <div>
                          <strong>Model:</strong> {item.product?.model}
                        </div>
                        <div>
                          <strong>RAM:</strong> {item.product?.ram}
                        </div>
                        <div>
                          <strong>Storage:</strong> {item.product?.storage}
                        </div>
                        <div>
                          <strong>Processor:</strong> {item.product?.processor}
                        </div>
                        <div>
                          <strong>OS:</strong> {item.product?.os}
                        </div>
                        <div>
                          <strong>Asset IDs:</strong>{" "}
                          {item.device_ids?.join(", ")}
                        </div>
                      </div>
                    </td>
                    <td style={tableCellCenterStyle}>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Info */}
            <div style={footerInfoStyle}>
              <div style={taxDetailsStyle}>
                PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {dcData.pan_number}
                <br />
                GST No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {dcData.gst_number}
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
                  GRN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                  {grnData.grn_number}
                  <br />
                  GRN Date. &nbsp;&nbsp;&nbsp;:{" "}
                  {new Date(grnData.grn_date).toLocaleDateString("en-GB")}
                  <br />
                  Order No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {grnData.order_id}
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
                    <div style={detailLabelStyle}>Customer Code :</div>
                    {grnData.customer_id}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Contact Person :</div>
                    {grnData.informed_person_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Received Person :</div>
                    {grnData.receiver_name}
                  </div>
                  <div>
                    <div style={detailLabelStyle}>Returned By :</div>
                    {grnData.returner_name}
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
                    <div style={detailLabelStyle}>Receiver Number :</div>
                    {grnData.receiver_phone}
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
                      key={item.grn_item_id}
                      style={
                        index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle
                      }
                    >
                      <td style={tableCellCenterStyle}>{index + 1}</td>
                      <td style={tableCellStyle}>
                        <div style={itemTitleStyle}>{item.product_name}</div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: "10px",
                            color: "#555",
                          }}
                        >
                          <div style={specificationsTitleStyle}>
                            Specifications:
                          </div>
                          <div>
                            <strong>Brand:</strong> {item.product?.brand}
                          </div>
                          <div>
                            <strong>Model:</strong> {item.product?.model}
                          </div>
                          <div>
                            <strong>RAM:</strong> {item.product?.ram}
                          </div>
                          <div>
                            <strong>Storage:</strong> {item.product?.storage}
                          </div>
                          <div>
                            <strong>Processor:</strong>{" "}
                            {item.product?.processor}
                          </div>
                          <div>
                            <strong>Asset IDs:</strong> {deviceIds.join(", ")}
                          </div>
                        </div>
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

const formatINRCurrency = (value) => {
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

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Invoices Dialog Component

// Invoices Dialog Component
const InvoiceDialog = ({ open, onClose, invoiceData }) => {
  if (!invoiceData) return null;

  const invoiceType = invoiceData.type || "current";
  const rentalStartDate = new Date(invoiceData.rental_start_date);
  const rentalEndDate = new Date(invoiceData.rental_end_date);
  const currentMonthStart = new Date(
    rentalStartDate.getFullYear(),
    rentalStartDate.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    rentalStartDate.getFullYear(),
    rentalStartDate.getMonth(),
    0
  );
  // Calculate next month dates
  const nextMonthStart = new Date(
    rentalStartDate.getFullYear(),
    rentalStartDate.getMonth() + 1,
    1
  );
  const nextMonthEnd = new Date(
    nextMonthStart.getFullYear(),
    nextMonthStart.getMonth() + 1,
    0
  );

  const getMonthRange = (dateStr) => {
    if (!dateStr) return { start: "-", end: "-" };
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      start: start.toLocaleDateString(),
      end: end.toLocaleDateString(),
    };
  };

  const currentInvoicePeriod = getMonthRange(invoiceData?.rental_start_date);

  // 2. Credit note month (prefer returned_date, fallback to rental_end_date)
  const creditDateSource =
    invoiceData?.items?.find((item) => item.returned_date)?.returned_date ||
    invoiceData?.rental_end_date;
  const creditNotePeriod = getMonthRange(creditDateSource);

  // Calculate invoice items with proper amounts
  const calculateInvoiceItems = () => {
    return invoiceData.items
      ?.map((item) => {
        const indianDateOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };

        // Initialize all variables
        let quantity = 0;
        let NextQty = 0;
        let amount = 0;
        let days = 0;
        let description = "";
        let deviceIds = [];
        let newQtyDays = 0;
        let returnQtyDays = 0;
        let returnedQtyAmount = 0;
        let creditReturnDays = 0; // This is the correct variable name
        let CreditNoteQty = 0;
        let currentNewQtyAmount = 0;
        let currentReturnedAmount = 0;
        let currentFinalQty = 0;

        const rate = Number(item.unit_price) || 0;
        const dailyRate = rate / 30;

        const addedDate = item.added_date ? new Date(item.added_date) : null;
        const returnedDate = item.returned_date
          ? new Date(item.returned_date)
          : null;

        // Calculate days for new devices
        if (addedDate) {
          const endOfAddedMonth = new Date(
            addedDate.getFullYear(),
            addedDate.getMonth() + 1,
            0
          );
          newQtyDays = calculateDays(addedDate, endOfAddedMonth);
        }

        // Calculate days for returned devices
        if (returnedDate) {
          returnQtyDays = calculateDays(returnedDate, rentalEndDate);
          creditReturnDays = calculateDays(returnedDate, rentalEndDate); // This is the correct variable
        }

        switch (invoiceType) {
          case "current":
            const currentbaseQty = Number(item.previous_quantity) || 0;
            const currentnewQty = Number(item.new_quantity) || 0;
            const currentreturnQty = Number(item.return_quantity) || 0;

            quantity = currentbaseQty;
            currentFinalQty = quantity + currentnewQty - currentreturnQty;

            days = calculateDays(rentalStartDate, currentMonthEnd);
            const currentNewQtyAmount = dailyRate * newQtyDays * currentnewQty;
            const currentReturnedAmount =
              dailyRate * currentreturnQty * returnQtyDays;
            amount = quantity * dailyRate * days + currentNewQtyAmount;
            deviceIds = [
              ...(item.device_ids || []),
              ...(item.new_device_ids || []),
            ].filter((id) => !(item.returned_device_ids || []).includes(id));
            description = `Rental for ${days} days (${rentalStartDate.toLocaleDateString(
              "en-IN",
              indianDateOptions
            )} to ${currentMonthEnd.toLocaleDateString(
              "en-IN",
              indianDateOptions
            )})`;
            break;

          case "next":
            const baseQty = Number(item.previous_quantity) || 0;
            const newQty = Number(item.new_quantity) || 0;
            const returnQty = Number(item.return_quantity) || 0;

            quantity = baseQty + newQty;
            NextQty = quantity;
            days = calculateDays(nextMonthStart, nextMonthEnd);
            const mainAmount = quantity * rate;
            const newQtyAmount = newQty * dailyRate * newQtyDays;
            returnedQtyAmount = returnQty * dailyRate * creditReturnDays; // Using the correct variable here

            amount = mainAmount + newQtyAmount;

            deviceIds = [
              ...(item.device_ids || []),
              ...(item.new_device_ids || []),
            ];
            break;

          case "credit":
            quantity = Number(item.return_quantity) || 0;
            CreditNoteQty = quantity;

            if (quantity > 0 && returnedDate) {
              days = creditReturnDays; // Using the correct variable here
              amount = quantity * dailyRate * days;
              description = `Credit for returned devices (${returnedDate.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${rentalEndDate.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )})`;
              deviceIds = item.returned_device_ids || [];
            }
            break;

          default:
            break;
        }

        return {
          ...item,
          quantity,
          NextQty,
          days,
          amount,
          description,
          deviceIds,
          rate,
          total: amount,
          newQtyDays,
          returnQtyDays,
          returnedQtyAmount,
          creditReturnDays, // Correct variable name
          CreditNoteQty,
          currentNewQtyAmount,
          currentReturnedAmount,
          currentFinalQty,
        };
      })
      .filter((item) => item.amount > 0 || item.quantity > 0);
  };

  const items = calculateInvoiceItems();
  const totalReturnedAmount = items.reduce(
    (sum, item) => sum + (item.returnedQtyAmount || 0),
    0
  );
  const totalAmount =
    items.reduce((sum, item) => sum + item.amount, 0) - totalReturnedAmount;

  const finalTotalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  {
    /* Invoice Period */
  }
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isSameMonth = (date1, date2) => {
    return (
      date1 &&
      date2 &&
      new Date(date1).getMonth() === new Date(date2).getMonth() &&
      new Date(date1).getFullYear() === new Date(date2).getFullYear()
    );
  };

  // Function to render the invoice
  // Render the invoice
  const renderInvoice = () => {
    const isCreditNote = invoiceType === "credit";
    const title =
      invoiceType === "current"
        ? "Current Month Invoice"
        : invoiceType === "next"
        ? "Next Month Projection"
        : "Return Credit Note";

    const cgst = totalAmount * 0.09;
    const sgst = totalAmount * 0.09;
    const totalTax = cgst + sgst;
    const grandTotal = totalAmount + totalTax;

    return (
      <div
        style={receiptContainerStyle}
        id={`invoice-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
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
              <div style={companyNameStyle}>Guru Goutam Infotech Pvt. Ltd.</div>
              <div style={companyDetailsStyle}>
                CIN: U72200KA2008PTC047679
                <br />
                GST: {invoiceData.customer_gst_number || "29AADCG2608Q1Z6"}
              </div>
            </div>
          </div>
          <div style={challanHeaderStyle}>
            <div style={challanTitleStyle}>
              {isCreditNote ? "CREDIT NOTE" : "TAX INVOICE"}
            </div>
            <div style={challanDetailsStyle}>
  {isCreditNote ? "Credit Note No." : "Invoice No."} &nbsp;:{" "}
  {invoiceData.invoice_number}
  <br />
  Invoice Date :{" "}
  {invoiceType === "credit"
    ? formatDate(
        invoiceData?.items?.find((item) => item.returned_date)
          ?.returned_date || invoiceData?.rental_end_date
      )
    : invoiceType === "next"
    ? formatDate(nextMonthStart)
    : formatDate(invoiceData?.rental_start_date)}

  {!isCreditNote && (
    <>
      <br />
      {/* Due Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
      {invoiceData.invoice_due_date} */}
    </>
  )}
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
              {invoiceData.shippingDetail?.state}
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
                <div style={detailLabelStyle}>PO Number :</div>
                {invoiceData.purchase_order_number}
              </div>
              <div>
                <div style={detailLabelStyle}>PO Date :</div>
                {invoiceData.purchase_order_date}
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

        <div style={invoicePeriodStyle}>
          {invoiceType === "credit" ? (
            <div>
              <strong>Credit Note Period:</strong>{" "}
              {formatDate(
                invoiceData?.items?.find((item) => item.returned_date)
                  ?.returned_date || invoiceData?.rental_end_date
              )}{" "}
              to {formatDate(invoiceData?.rental_end_date)}
            </div>
          ) : invoiceType === "current" ? (
            <div>
              <strong>Current Invoice:</strong>{" "}
              {formatDate(invoiceData?.rental_start_date)} to{" "}
              {formatDate(
                new Date(
                  new Date(invoiceData?.rental_start_date).getFullYear(),
                  new Date(invoiceData?.rental_start_date).getMonth() + 1,
                  0
                )
              )}
            </div>
          ) : invoiceType === "next" ? (
            <div>
              <strong>Next Month Period:</strong> {formatDate(nextMonthStart)}{" "}
              to {formatDate(nextMonthEnd)}
            </div>
          ) : null}
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderNoStyle}>NO.</th>
              <th style={tableHeaderParticularsStyle}>Product Details</th>

              {invoiceType !== "credit" && (
                <>
                  <th style={tableHeaderQtyStyle}>Prev Qty</th>
                  <th style={tableHeaderQtyStyle}>New Qty</th>
                </>
              )}

              <th style={tableHeaderQtyStyle}>Return Qty</th>
              {invoiceType === "credit" && (
                <>
                  <th style={tableHeaderDaysStyle}></th>
                  <th style={tableHeaderDaysStyle}></th>
                  <th style={tableHeaderDaysStyle}></th>
                </>
              )}

              {invoiceType !== "credit" && (
                <th style={tableHeaderQtyStyle}>Final Qty</th>
              )}

              {(invoiceType === "credit" ||
                invoiceType === "next" ||
                invoiceType === "current") && (
                <>
                  <th style={tableHeaderDaysStyle}>Days</th>
                  <th style={tableHeaderDaysStyle}>Per Day</th>
                </>
              )}

              <th style={tableHeaderRateStyle}>Per Month</th>
              <th style={tableHeaderRateStyle}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const showNewQty =
                item.new_quantity > 0 &&
                ((invoiceType === "current" &&
                  isSameMonth(
                    item.added_date,
                    invoiceData?.rental_start_date
                  )) ||
                  (invoiceType === "next" &&
                    isSameMonth(item.added_date, nextMonthStart)));

              const showReturnQty =
                item.return_quantity > 0 &&
                ((invoiceType === "current" &&
                  isSameMonth(
                    item.returned_date,
                    invoiceData?.rental_start_date
                  )) ||
                  (invoiceType === "next" &&
                    isSameMonth(item.returned_date, nextMonthStart)));

              const showCurrentDays =
                invoiceType === "current" || invoiceType === "next";

              return (
                <tr
                  key={item.id}
                  style={index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle}
                >
                  <td style={tableCellCenterStyle}>{index + 1}</td>

                  {/* Product Details */}
                  <td style={tableCellStyle}>
                    <div style={itemTitleStyle}>{item.product_name}</div>
                    <div
                      style={{ marginTop: 4, fontSize: "10px", color: "#555" }}
                    >
                      <div>
                        <strong>Brand:</strong> {item.productDetails?.brand}
                      </div>
                      <div>
                        <strong>Model:</strong> {item.productDetails?.model}
                      </div>
                      {item.deviceIds?.length > 0 && (
                        <div>
                          <strong>Asset IDs:</strong>{" "}
                          {item.deviceIds.join(", ")}
                        </div>
                      )}
                      <div style={{ marginTop: 4, fontStyle: "italic" }}>
                        {item.description}
                      </div>
                    </div>
                  </td>

                  {/* Prev + New Qty */}
                  {invoiceType !== "credit" && (
                    <>
                      <td style={tableCellCenterStyle}>{item.quantity || 0}</td>
                      <td style={tableCellCenterStyle}>
                        {showNewQty ? (
                          <>
                            {item.new_quantity}
                            <div style={{ fontSize: "10px" }}>
                              {new Date(item.added_date).toLocaleDateString(
                                "en-IN"
                              )}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    </>
                  )}

                  {/* Return Qty */}
                  <td style={tableCellCenterStyle}>
                    {showReturnQty ? (
                      <>
                        {item.return_quantity}
                        <div style={{ fontSize: "10px" }}>
                          {new Date(item.returned_date).toLocaleDateString(
                            "en-IN"
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {invoiceType === "credit" && (
                      <div>{item.return_quantity}</div>
                    )}
                  </td>

                  {/* Final Qty */}
                  {invoiceType !== "credit" && invoiceType !== "current" && (
                    <td style={tableCellCenterStyle}>{item.quantity}</td>
                  )}
                  {invoiceType === "current" && (
                    <td style={tableCellCenterStyle}>{item.currentFinalQty}</td>
                  )}

                  {/* Days and Per Day */}
                  {showCurrentDays && (
                    <>
                      <td style={tableCellCenterStyle}>
                        {item.days > 0 && (
                          <div>
                            <strong>Total:</strong> {item.days} days
                          </div>
                        )}
                        {item.newQtyDays > 0 && showNewQty && (
                          <div>
                            <strong>New:</strong> {item.newQtyDays} days
                          </div>
                        )}
                        {item.returnQtyDays > 0 && showReturnQty && (
                          <div>
                            <strong>Return:</strong> {item.returnQtyDays} days
                          </div>
                        )}
                      </td>
                      <td style={tableCellCenterStyle}>
                        {formatINRCurrency(item.rate / 30)}
                      </td>
                    </>
                  )}

                  {/* Credit Type Days */}
                  {invoiceType === "credit" && (
                    <>
                      <td style={tableCellCenterStyle}></td>
                      <td style={tableCellCenterStyle}></td>
                      <td style={tableCellCenterStyle}></td>
                      <td style={tableCellCenterStyle}>
                        {item.creditReturnDays} Days
                      </td>
                      <td style={tableCellCenterStyle}>
                        {formatINRCurrency(item.rate / 30)}
                      </td>
                    </>
                  )}

                  {/* Rate + Total */}
                  <td style={tableCellRightStyle}>
                    {formatINRCurrency(item.rate)}
                  </td>
                  <td style={tableCellRightStyle}>
                    {formatINRCurrency(item.amount)}
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr style={totalsRowStyle}>
              <td style={tableCellCenterStyle} colSpan={6}>
                <strong>TOTAL</strong>
              </td>
              <td></td>
              <td></td>
              <td style={tableCellRightStyle}></td>
              <td style={tableCellRightStyle}>
                {formatINRCurrency(finalTotalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tax and Total Section */}
        <div style={taxTotalContainerStyle}>
          <div style={taxDetailsStyle}>
            {(invoiceType === "current" || invoiceType === "next") &&
              totalReturnedAmount > 0 && (
                <div style={taxRowStyle}>
                  <span>Returned Amount:</span>
                  <span>- {formatINRCurrency(totalReturnedAmount)}</span>
                </div>
              )}

            <div style={taxRowStyle}>
              <span>Subtotal:</span>
              <span>{formatINRCurrency(totalAmount)}</span>
            </div>

            <div style={taxRowStyle}>
              <span>CGST @9%:</span>
              <span>{formatINRCurrency(cgst)}</span>
            </div>
            <div style={taxRowStyle}>
              <span>SGST @9%:</span>
              <span>{formatINRCurrency(sgst)}</span>
            </div>
            <div style={taxRowTotalStyle}>
              <span>Total Tax:</span>
              <span>{formatINRCurrency(totalTax)}</span>
            </div>

            <div style={grandTotalStyle}>
              <span>
                {invoiceType === "credit" ? "Credit Amount" : "Grand Total"}:
              </span>
              <span>{formatINRCurrency(grandTotal)}</span>
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
  // Handle PDF download
  const handleDownloadPDF = () => {
    const element = document.getElementById(
      `invoice-${
        invoiceType === "current"
          ? "current-month-invoice"
          : invoiceType === "next"
          ? "next-month-projection"
          : "return-credit-note"
      }`
    );

    if (!element) return;

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(
        `${
          invoiceType === "current"
            ? "invoice"
            : invoiceType === "next"
            ? "next-month"
            : "credit-note"
        }-${invoiceData.invoice_number}.pdf`
      );
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        {invoiceType === "current"
          ? "Current Month Invoice"
          : invoiceType === "next"
          ? "Next Month Invoice"
          : "Return Credit Note"}
      </DialogTitle>
      <DialogContent>
        <div style={{ padding: "20px" }}>{renderInvoice()}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
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
        {tableType !== "inventory" && (
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
              : tableType === "job_description"
              ? "Add Job Description"
              : `Add ${tableType.charAt(0).toUpperCase() + tableType.slice(1)}`}
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
              {tableType !== "purchase-requests" &&
                tableType !== "purchase-orders" &&
                tableType !== "goodsreceipt" &&
                tableType !== "po-quotations" &&
                tableType !== "supplier" &&
                tableType !== "inventory" &&
                tableType !== "quotations" &&
                tableType !== "orders" &&
                tableType !== "operations" &&
                tableType !== "grn" && (
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Active Status
                  </TableCell>
                )}
              {tableType === "invoices" && (
                <>
                  {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Previous Invoice
                  </TableCell> */}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Current Invoice
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Next Month Invoice
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Credit Note Invoice
                  </TableCell>
                </>
              )}

              {tableType !== "inventory" && (
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

                  {tableType !== "purchase-requests" &&
                    tableType !== "purchase-orders" &&
                    tableType !== "goodsreceipt" &&
                    tableType !== "po-quotations" &&
                    tableType !== "supplier" &&
                    tableType !== "inventory" &&
                    tableType !== "quotations" &&
                    tableType !== "orders" &&
                    tableType !== "operations" &&
                    tableType !== "grn" && (
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

                  {tableType === "invoices" && (
                    <>
                      {/* Previous Invoice Button */}
                      {/* <TableCell align="center">
                        <Button
                          onClick={() => handleViewInvoice(row, "previous")}
                          sx={{ minWidth: "30px", p: 0 }}
                          title="View Previous Invoice"
                        >
                          <img
                            src={ViewDC}
                            alt="View Previous"
                            width="45"
                            height="35"
                          />
                        </Button>
                      </TableCell> */}

                      {/* Current Invoice Button */}
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
                      {/* Next Month Button */}
                      <TableCell align="center">
                        <Button
                          onClick={() => handleViewInvoice(row, "next")}
                          sx={{ minWidth: "30px", p: 0 }}
                          title="View Next Invoice"
                        >
                          <img
                            src={ViewDC}
                            alt="View Next"
                            width="45"
                            height="35"
                          />
                        </Button>
                      </TableCell>
                      {/* Credit Note Button */}
                      <TableCell align="center">
                        <Button
                          onClick={() => handleViewInvoice(row, "credit")}
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
                    </>
                  )}

                  {tableType !== "inventory" && (
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        {tableType === "operations" && (
                          <Button
                            onClick={() => handleViewDC(row)}
                            sx={{ minWidth: "30px", p: 0 }}
                          >
                            <img
                              src={ViewDC}
                              alt="ViewDC"
                              width="45"
                              height="35"
                            />
                          </Button>
                        )}

                        {tableType === "grn" && (
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
                        )}

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
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
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
  fontWeight: "bold",
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
  fontWeight: "bold",
  fontSize: "0.75rem",
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
  fontSize: "14px",
  fontWeight: "bold",
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
