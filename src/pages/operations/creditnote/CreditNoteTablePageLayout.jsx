import React from "react";
import { Card, CardContent, Button } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const CreditNoteTablePageLayout = () => {
  const columns = [
    { id: "creditNoteNumber", label: "Credit Note Number" },
    { id: "creditNoteTitle", label: "Credit Note Title" },
    { id: "industry", label: "Industry" },
    { id: "transactionType", label: "Transaction Type" },
    { id: "paymentType", label: "Payment Type" },
    { id: "dcId", label: "DC ID" },
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
    {
      id: "printCreditNote",
      label: "Print Credit Note",
      render: () => (
        <Button variant="outlined" size="small" color="primary">
          Print
        </Button>
      )
    }
  ];

  const data = [
    {
      creditNoteNumber: "CN-001",
      creditNoteTitle: "Refund for Overcharged Item",
      industry: "Retail",
      transactionType: "Refund",
      paymentType: "Bank Transfer",
      dcId: "DC-7890",
      customerId: "CUST-1234",
      invoiceDate: "2025-05-25",
      invoiceStartDate: "2025-05-01",
      invoiceEndDate: "2025-05-20",
      customerName: "Neha Sharma",
      createdBy: "Manager",
      amount: "$150.00",
      reference: "REF-CN-321",
      tin: "TIN5678",
      pan: "PAN1234",
      email: "neha@example.com",
      shippingName: "Warehouse 5",
      pincode: "110001",
      status: "Approved",
      printCreditNote: true
    }
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

export default CreditNoteTablePageLayout;
