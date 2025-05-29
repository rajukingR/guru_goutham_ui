import React from "react";
import {
  Card,
  CardContent,
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const DeliveryChallanTablePage = () => {
  // Define columns for the table
  const columns = [
    { id: "dcId", label: "DC I" },
    { id: "orderId", label: "Order ID" },
    { id: "dcTitle", label: "DC Title" },
    { id: "dcDate", label: "DC Date" },
    { id: "companyName", label: "Company Name" },
    { id: "customerId", label: "Customer ID" },
    { id: "dcStatus", label: "DC Status" },
    { id: "industry", label: "Industry" },
    { id: "transactionType", label: "Transaction Type" },
    { id: "reference", label: "Reference" },
    { id: "tin", label: "TIN" },
    { id: "pan", label: "PAN" },
    { id: "email", label: "Email" },
    { id: "dcFile", label: "DC File" },
    { id: "orderPlacedBy", label: "Order Placed By" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "shippingName", label: "Shipping Name" },
    { id: "pincode", label: "Pincode" },
    { id: "vehicleNo", label: "Vehicle No" },
    { id: "deliveryPersonName", label: "Delivery Person Name" },
    { id: "deliveryPersonPhone", label: "Delivery Person Phone No" },
    { id: "receiverName", label: "Receiver Name" },
    { id: "receiverPhone", label: "Receiver Phone No" },
    { id: "moveToNext", label: "Move to Next" },
    { id: "status", label: "Status" },
  ];

  // Sample data for demonstration
  const data = [
    {
      dcId: "DC-001",
      orderId: "ORD-1001",
      dcTitle: "Delivery for Electronics",
      dcDate: "2025-05-28",
      companyName: "ABC Pvt Ltd",
      customerId: "CUST-001",
      dcStatus: "Dispatched",
      industry: "Retail",
      transactionType: "Sale",
      reference: "REF123",
      tin: "TIN001",
      pan: "PAN001",
      email: "customer@example.com",
      dcFile: "dc_file_001.pdf",
      orderPlacedBy: "John Doe",
      phoneNumber: "+91-9876543210",
      shippingName: "Warehouse 7",
      pincode: "682001",
      vehicleNo: "KL-07-BN-2025",
      deliveryPersonName: "Ravi Kumar",
      deliveryPersonPhone: "+91-9988776655",
      receiverName: "Manoj K",
      receiverPhone: "+91-8877665544",
      moveToNext: "Ready",
      status: "Active",
    },
    // Add more rows if needed
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

export default DeliveryChallanTablePage;
