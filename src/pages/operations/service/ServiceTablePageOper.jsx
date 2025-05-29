import React from "react";
import { Avatar, Card, CardContent } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ServiceTablePageOper = () => {
  const columns = [
    {
      id: "productImage",
      label: "Product Image",
      render: (value) => (
        <Avatar
          variant="square"
          src={value}
          sx={{ width: 56, height: 56 }}
        />
      )
    },
    { id: "type", label: "Type" },
    { id: "priority", label: "Priority" },
    { id: "productId", label: "Product ID" },
    { id: "productName", label: "Product Name" },
    { id: "orderNo", label: "Order No" },
    { id: "clientId", label: "Client ID" },
    { id: "amc", label: "AMC" },
    { id: "saleDate", label: "Sale Date" },
    { id: "clientName", label: "Client Name" },
    { id: "serviceHead", label: "Service Head" },
    { id: "serviceStaff", label: "Service Staff" },
    { id: "serviceReceiveData", label: "Service Receive Data" },
    { id: "startDateTime", label: "Start Date & Time" },
    { id: "endDateTime", label: "End Date & Time" },
    { id: "taskDuration", label: "Task Duration" },
    { id: "expense", label: "Expense" }
  ];

  const data = [
    {
      productImage: "https://via.placeholder.com/56",
      type: "Installation",
      priority: "High",
      productId: "PRD-001",
      productName: "Smart AC",
      orderNo: "ORD-2025-001",
      clientId: "CL-101",
      amc: "Yes",
      saleDate: "2025-05-10",
      clientName: "Rajesh Kumar",
      serviceHead: "Anil Mehta",
      serviceStaff: "Suresh Yadav",
      serviceReceiveData: "2025-05-15",
      startDateTime: "2025-05-16 10:00 AM",
      endDateTime: "2025-05-16 12:30 PM",
      taskDuration: "2h 30m",
      expense: "$45"
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

export default ServiceTablePageOper;
