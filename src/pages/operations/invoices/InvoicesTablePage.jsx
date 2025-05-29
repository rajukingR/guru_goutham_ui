import React from "react";
import { 
  Card, 
  CardContent 
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const InvoicesTablePage = () => {
  // Define columns for the table
  const columns = [
    { id: "invoiceNumber", label: "Invoice Number" },
    { id: "invoiceTitle", label: "Invoice Title" },
    { id: "industry", label: "Industry" },
    { id: "transactionType", label: "Transaction Type" },
    { id: "paymentType", label: "Payment Type" },
    { id: "dcId", label: "DC ID" },
    { id: "companyName", label: "Company Name" },
    { id: "customerId", label: "Customer ID" },
    { id: "invoiceDate", label: "Invoice Date" },
    { id: "invoiceStartDate", label: "Invoice Start Date" },
    { id: "invoiceEndDate", label: "Invoice End Date" },
    { id: "customerName", label: "Customer Name" },
    { id: "createdBy", label: "Created By" },
    { id: "amount", label: "Amount" },
    { id: "reference", label: "Reference" },
    { id: "tin", label: "TIN" },
    { id: "pan", label: "PAN" },
    { id: "email", label: "Email" },
    { id: "shippingName", label: "Shipping Name" },
    { id: "pincode", label: "Pincode" },
    { id: "status", label: "Status" },
    { id: "printCurrentMonth", label: "Print Current Month Invoice" },
    { id: "printPreviousMonth", label: "Print Previous Month" },
    { id: "deliveriesInvoice", label: "Deliveries Invoice" },
    { id: "printCreditNote", label: "Print Credit Note" },
  ];

  // Sample data (can be extended or fetched from API)
  const data = [
    {
      invoiceNumber: "INV-001",
      invoiceTitle: "Monthly Subscription",
      industry: "IT Services",
      transactionType: "Sale",
      paymentType: "Online",
      dcId: "DC-123",
      companyName: "Tech Solutions Pvt Ltd",
      customerId: "CUST-101",
      invoiceDate: "2025-05-29",
      invoiceStartDate: "2025-05-01",
      invoiceEndDate: "2025-05-31",
      customerName: "Rahul Sharma",
      createdBy: "Admin",
      amount: "$1500",
      reference: "REF-INV-001",
      tin: "TIN456",
      pan: "PAN789",
      email: "rahul@example.com",
      shippingName: "Main Warehouse",
      pincode: "110001",
      status: "Paid",
      printCurrentMonth: "Yes",
      printPreviousMonth: "No",
      deliveriesInvoice: "INV-DEL-01",
      printCreditNote: "No",
    },
  ];

  return (
    <Card>
      <CardContent>
        <DynamicTable 
          columns={columns} 
          data={data} 
          rowsPerPage={5} 
        />
      </CardContent>
    </Card>
  );
};

export default InvoicesTablePage;
