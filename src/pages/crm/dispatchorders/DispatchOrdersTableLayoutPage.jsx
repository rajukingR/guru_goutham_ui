import React from "react";
import { Card, CardContent } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const DispatchOrdersTableLayoutPage = () => {
  const columns = [
    { id: "date", label: "Date" },
    { id: "dispatchTitle", label: "Dispatch Title" },
    { id: "dispatchId", label: "Dispatch ID" },
    { id: "orderId", label: "Order ID" },
    { id: "deliveryMethod", label: "Delivery Method" },
    { id: "dispatchStatus", label: "Dispatch Status" },
    { id: "courierPartner", label: "Courier Partner" },
    { id: "trackingId", label: "Tracking ID" },
    { id: "customerName", label: "Customer Name" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "email", label: "Email" },
    { id: "shippingAddress", label: "Shipping Address" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "country", label: "Country" },
    { id: "pincode", label: "Pincode" },
    { id: "remarks", label: "Remarks" },
    { id: "actions", label: "Actions" },
  ];

  const data = [
    {
      date: "2025-05-28",
      dispatchTitle: "Dispatch - Order #001",
      dispatchId: "DISP-001",
      orderId: "ORD-001",
      deliveryMethod: "Courier",
      dispatchStatus: "Shipped",
      courierPartner: "BlueDart",
      trackingId: "BD1234567890",
      customerName: "Ankit Verma",
      phoneNumber: "+91-9876543210",
      email: "ankit.verma@smartapps.com",
      shippingAddress: "123 Business Ave, Near IT Hub",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560076",
      remarks: "Deliver before Friday",
      actions: "..."
    },
    {
      date: "2025-05-27",
      dispatchTitle: "Dispatch - Order #002",
      dispatchId: "DISP-002",
      orderId: "ORD-002",
      deliveryMethod: "Hand Delivery",
      dispatchStatus: "In Transit",
      courierPartner: "Internal Team",
      trackingId: "INT123456",
      customerName: "Priya Mehta",
      phoneNumber: "+91-9988776655",
      email: "priya.mehta@retailking.com",
      shippingAddress: "75 MG Road, Next to City Mall",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400012",
      remarks: "Handle with care",
      actions: "..."
    },
    {
      date: "2025-05-26",
      dispatchTitle: "Dispatch - Order #003",
      dispatchId: "DISP-003",
      orderId: "ORD-003",
      deliveryMethod: "Courier",
      dispatchStatus: "Delivered",
      courierPartner: "Delhivery",
      trackingId: "DL1234567890",
      customerName: "Karan Singh",
      phoneNumber: "+91-9123456780",
      email: "karan.singh@trendmart.com",
      shippingAddress: "Plot 45, Industrial Area, Opp Metro Station",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110075",
      remarks: "Package received by security",
      actions: "..."
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

export default DispatchOrdersTableLayoutPage;
