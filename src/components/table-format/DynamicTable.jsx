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
                          <strong>Device IDs:</strong>{" "}
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

// Invoices Dialog Component

// Invoices Dialog Component
const InvoiceDialog = ({ open, onClose, invoiceData }) => {
  if (!invoiceData) return null;

  // Determine which type of invoice to display
  const invoiceType = invoiceData.type || "current";

  // Calculate dates for all invoice types
  const currentMonthStart = new Date(invoiceData.invoice_start_date);
  const currentMonthEnd = new Date(invoiceData.invoice_end_date);
  const prevMonthStart = new Date(invoiceData.previous_delivered_start_date);
  const prevMonthEnd = new Date(invoiceData.previous_delivered_end_date);
  const creditNoteStart = new Date(invoiceData.credit_note_start_date);
  const creditNoteEnd = new Date(invoiceData.credit_note_end_date);

  // Calculate next month dates
  const nextMonthStart = new Date(currentMonthEnd);
  nextMonthStart.setDate(nextMonthStart.getDate() + 1);
  const nextMonthEnd = new Date(nextMonthStart);
  nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 1);
  nextMonthEnd.setDate(0); // Last day of next month

  // Function to calculate days between dates
  const calculateDays = (startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Function to calculate item values for the selected invoice type
  const calculateInvoiceItems = () => {
    return invoiceData.items
      ?.map((item) => {
        const rate = Number(item.unit_price) || 0;
        const monthlyRate = rate * 30;
        const perMonthAmount = Number(item.unit_price) || 0;

        let quantity = 0;
        let days = 0;
        let amount = 0;
        let description = "";
        let deviceIds = [];
        const indianDateOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };

        switch (invoiceType) {
          case "current":
            // Current month - all devices minus returns
            quantity =
              (Number(item.quantity) || 0) +
              (Number(item.new_quantity) || 0) -
              (Number(item.return_quantity) || 0);
            days = calculateDays(currentMonthStart, currentMonthEnd);
            amount = quantity * rate;
            description = `Rental for ${days} days (${currentMonthStart.toLocaleDateString(
              "en-IN",
              indianDateOptions
            )} to ${currentMonthEnd.toLocaleDateString(
              "en-IN",
              indianDateOptions
            )})`;
            deviceIds = [
              ...(item.device_ids || []),
              ...(item.new_device_ids || []),
            ].filter((id) => !(item.returned_device_ids || []).includes(id));
            break;

          case "previous":
            // Previous month - only new devices delivered in previous month
            quantity = Number(item.new_quantity) || 0;
            if (quantity > 0) {
              days = calculateDays(prevMonthStart, prevMonthEnd);
              amount = quantity * rate;
              description = `Additional devices delivered in previous month (${prevMonthStart.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${prevMonthEnd.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )})`;
              deviceIds = item.new_device_ids || [];
            }
            break;

          case "next":
            // Next month - current devices plus new minus returns
            quantity =
              (Number(item.quantity) || 0) +
              (Number(item.new_quantity) || 0) -
              (Number(item.return_quantity) || 0);
            days = calculateDays(nextMonthStart, nextMonthEnd);
            amount = quantity * rate;
            description = `Projected rental for ${days} days (${nextMonthStart.toLocaleDateString(
              "en-IN",
              indianDateOptions
            )} to ${nextMonthEnd.toLocaleDateString(
              "en-IN",
              indianDateOptions
            )})`;
            deviceIds = [
              ...(item.device_ids || []),
              ...(item.new_device_ids || []),
            ].filter((id) => !(item.returned_device_ids || []).includes(id));
            break;

          case "credit":
            // Credit note - only returned devices
            quantity = Number(item.return_quantity) || 0;
            if (quantity > 0) {
              days = calculateDays(creditNoteStart, creditNoteEnd);
              amount = quantity * rate;
              description = `Credit for returned devices (${creditNoteStart.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${creditNoteEnd.toLocaleDateString(
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
          days,
          amount,
          description,
          deviceIds,
          rate,
          total: amount,
        };
      })
      .filter((item) => item.quantity > 0);
  };

  const items = calculateInvoiceItems();
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // Function to render the invoice
  const renderInvoice = () => {
    const isCreditNote = invoiceType === "credit";
    const title =
      invoiceType === "current"
        ? "Current Month Invoice"
        : invoiceType === "previous"
        ? "Previous Month Reference"
        : invoiceType === "next"
        ? "Next Month Projection"
        : "Return Credit Note";

    const cgst = totalAmount * 0.09;
    const sgst = totalAmount * 0.09;
    const totalTax = cgst + sgst;
    const grandTotal = isCreditNote ? totalAmount : totalAmount + totalTax;
    const indianDateOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return (
      <div
        style={{
          ...receiptContainerStyle,
          marginBottom: "40px",
          pageBreakAfter: "always",
        }}
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
              Date
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              {invoiceData.invoice_date}
              {!isCreditNote && (
                <>
                  <br />
                  Due Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                  {invoiceData.invoice_due_date}
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

        {/* Invoice Period */}
        <div style={invoicePeriodStyle}>
          {invoiceType === "next"
            ? `Projection Period: ${nextMonthStart.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${nextMonthEnd.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )}`
            : isCreditNote
            ? `Credit Note Period: ${creditNoteStart.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${creditNoteEnd.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )}`
            : invoiceType === "previous"
            ? `Previous Month Period: ${prevMonthStart.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${prevMonthEnd.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )}`
            : `Invoice Period: ${currentMonthStart.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )} to ${currentMonthEnd.toLocaleDateString(
                "en-IN",
                indianDateOptions
              )}`}
        </div>
        {/* Items Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderNoStyle}>NO.</th>
              <th style={tableHeaderParticularsStyle}>Product Details</th>
              <th style={tableHeaderQtyStyle}>QTY</th>
              <th style={tableHeaderDaysStyle}></th>
              <th style={tableHeaderRateStyle}>Rate/Day</th>
              <th style={tableHeaderRateStyle}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                style={index % 2 === 0 ? tableRowOddStyle : tableRowEvenStyle}
              >
                <td style={tableCellCenterStyle}>{index + 1}</td>
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
                    {item.deviceIds.length > 0 && (
                      <div>
                        <strong>Device IDs:</strong> {item.deviceIds.join(", ")}
                      </div>
                    )}
                    <div style={{ marginTop: 4, fontStyle: "italic" }}>
                      {item.description}
                    </div>
                  </div>
                </td>
                <td style={tableCellCenterStyle}>{item.quantity}</td>
                <td style={tableCellCenterStyle}></td>
                <td style={tableCellRightStyle}>
                  {formatINRCurrency(item.rate)}
                </td>
                <td style={tableCellRightStyle}>
                  {formatINRCurrency(item.amount)}
                </td>
              </tr>
            ))}

            {/* Totals Row */}
            <tr style={totalsRowStyle}>
              <td style={tableCellCenterStyle} colSpan={3}>
                <strong>TOTAL</strong>
              </td>
              <td style={tableCellCenterStyle}>
                {/* <strong>
                  {items.reduce((sum, item) => sum + item.days, 0)}
                </strong> */}
              </td>
              <td style={tableCellRightStyle}></td>
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

            {!isCreditNote && (
              <>
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
              </>
            )}

            <div style={grandTotalStyle}>
              <span>{isCreditNote ? "Credit Amount" : "Grand Total"}:</span>
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
            Amt. in Words:{" "}
            <span style={highlightTextStyle}>
              {numberToWords(Math.abs(grandTotal))}{" "}
              {isCreditNote ? "(Credit)" : ""}
            </span>
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
  const handleDownloadPDF = () => {
    const element = document.getElementById(
      `invoice-${
        invoiceType === "current"
          ? "current-month-invoice"
          : invoiceType === "previous"
          ? "previous-month-reference"
          : "return-credit-note"
      }`
    );

    if (!element) return;

    html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `${
          invoiceType === "current"
            ? "invoice"
            : invoiceType === "previous"
            ? "previous-month"
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
          : invoiceType === "previous"
          ? "Previous Month Reference"
          : "Return Credit Note"}
      </DialogTitle>
      <DialogContent>
        <div style={containerStyle}>{renderInvoice()}</div>
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

  const handleViewInvoice = async (row, type = "current") => {
    try {
      const response = await axios.get(`${API_URL}/invoices/${row.id}`);
      console.log("Invoice Data Response:", response.data);

      const invoiceWithType = {
        ...response.data,
        type, // inject type for filtering inside dialog
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
                tableType !== "operations" && (
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Active Status
                  </TableCell>
                )}
              {tableType === "invoices" && (
                <>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Previous Invoice
                  </TableCell>
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
                    tableType !== "operations" && (
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
                      <TableCell align="center">
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
                      </TableCell>

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
                          onClick={() =>
                            handleViewInvoice(row, "next")
                          } /* ... */
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
