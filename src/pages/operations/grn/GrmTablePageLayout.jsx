import React from "react";
import { Card, CardContent } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const GrmTablePageLayout = () => {
  // Define columns for the GRN table
  const columns = [
    { id: "grnNumber", label: "GRN Number" },
    { id: "grnTitle", label: "GRN Title" },
    { id: "industry", label: "Industry" },
    { id: "transactionType", label: "Transaction Type" },
    { id: "customerId", label: "Customer ID" },
    { id: "date", label: "Date" },
    { id: "customerName", label: "Customer Name" },
    { id: "createdBy", label: "Created By" },
    { id: "reference", label: "Reference" },
    { id: "tin", label: "TIN" },
    { id: "pan", label: "PAN" },
    { id: "email", label: "Email" },
    { id: "shippingName", label: "Shipping Name" },
    { id: "pincode", label: "Pincode" },
    { id: "vehicleNo", label: "Vehicle No" },
    { id: "informedPersonName", label: "Informed Person Name" },
    { id: "informedPersonPhone", label: "Informed Person Phone No" },
    { id: "returnerName", label: "Returner Name" },
    { id: "returnerPhone", label: "Returner Phone No" },
    { id: "receiverName", label: "Receiver Name" },
    { id: "receiverPhone", label: "Receiver Phone No" },
    { id: "status", label: "Status" },
  ];

  // Sample GRN data
  const data = [
    {
      grnNumber: "GRN-001",
      grnTitle: "Return of Damaged Items",
      industry: "Electronics",
      transactionType: "Return",
      customerId: "CUST-101",
      date: "2025-05-29",
      customerName: "Arjun Mehta",
      createdBy: "Admin",
      reference: "REF-1234",
      tin: "TIN9876",
      pan: "PAN4567",
      email: "arjun@example.com",
      shippingName: "Warehouse A",
      pincode: "560001",
      vehicleNo: "KA01AB1234",
      informedPersonName: "Rajesh Kumar",
      informedPersonPhone: "9876543210",
      returnerName: "Suresh",
      returnerPhone: "9123456780",
      receiverName: "Kiran",
      receiverPhone: "8899776655",
      status: "Completed",
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

export default GrmTablePageLayout;
