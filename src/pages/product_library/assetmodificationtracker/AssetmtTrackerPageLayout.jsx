import React from "react";
import { 
  Avatar, 
  Card, 
  CardContent 
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const AssetmtTrackerPageLayout = () => {
  // Define columns for the table
  const columns = [
    { 
      id: "itemImage", 
      label: "Item Image",
      render: (value) => (
        <Avatar 
          variant="square" 
          src={value} 
          sx={{ width: 56, height: 56 }}
        />
      )
    },
    { id: "itemName", label: "Item Name" },
    { id: "itemCode", label: "Item Code" },
    { id: "category", label: "Category" },
    { id: "unitPrice", label: "Unit Price" },
    { id: "stockQuantity", label: "Stock Quantity" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" },
  ];

  // Sample data for items
  const data = [
    {
      itemImage: "https://via.placeholder.com/56", 
      itemName: "Wireless Mouse",
      itemCode: "WM-1001",
      category: "Accessories",
      unitPrice: "$25",
      stockQuantity: 120,
      status: "Available",
      actions: "..."
    },
    {
      itemImage: "https://via.placeholder.com/56", 
      itemName: "Mechanical Keyboard",
      itemCode: "MK-2002",
      category: "Accessories",
      unitPrice: "$70",
      stockQuantity: 85,
      status: "Available",
      actions: "..."
    },
    {
      itemImage: "https://via.placeholder.com/56", 
      itemName: "27-inch Monitor",
      itemCode: "MN-3003",
      category: "Monitors",
      unitPrice: "$230",
      stockQuantity: 30,
      status: "Low Stock",
      actions: "..."
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

export default AssetmtTrackerPageLayout;
