import React from "react";
import {
  Avatar,
  Card,
  CardContent
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ProductsTableLayout = () => {
  const columns = [
    {
      id: "productTemplateImage",
      label: "Product Template Image",
      render: (value) => (
        <Avatar variant="square" src={value} sx={{ width: 56, height: 56 }} />
      ),
    },
    { id: "productTemplateName", label: "Product Template Name" },
    { id: "category", label: "Category" },
    { id: "brand", label: "Brand" },
    { id: "productTemplateSpecifications", label: "Product Template Specifications" },
    { id: "totalQuantity", label: "Total Quantity" },
    { id: "availableQuantity", label: "Available Quantity" },
    { id: "rentedQuantity", label: "Rented Quantity" },
    { id: "inRepairQuantity", label: "In Repair Quantity" },
    { id: "returnedQuantity", label: "Returned Quantity" },
    { id: "orderedQuantity", label: "Ordered Quantity" },
    { id: "soldQuantity", label: "Sold Quantity" },
    { id: "scrappedQuantity", label: "Scrapped Quantity" },
    { id: "purchasePrice", label: "Purchase Price" },
    { id: "salePrice", label: "Sale Price" },
    { id: "monthlyRentalPrice", label: "Monthly Rental Price" },
    { id: "totalPrice", label: "Total Price" },
    { id: "activeStatus", label: "Active Status" },
    { id: "actions", label: "Actions" },
  ];

  const data = [
    {
      productTemplateImage: "https://via.placeholder.com/56",
      productTemplateName: "Wireless Mouse Template",
      category: "Accessories",
      brand: "Logitech",
      productTemplateSpecifications: "Ergonomic design, USB receiver",
      totalQuantity: 150,
      availableQuantity: 100,
      rentedQuantity: 20,
      inRepairQuantity: 5,
      returnedQuantity: 10,
      orderedQuantity: 15,
      soldQuantity: 80,
      scrappedQuantity: 3,
      purchasePrice: "$20",
      salePrice: "$30",
      monthlyRentalPrice: "$5",
      totalPrice: "$3000",
      activeStatus: "Active",
      actions: "..."
    },
    {
      productTemplateImage: "https://via.placeholder.com/56",
      productTemplateName: "Mechanical Keyboard Template",
      category: "Accessories",
      brand: "Keychron",
      productTemplateSpecifications: "Backlit keys, Bluetooth, USB-C",
      totalQuantity: 90,
      availableQuantity: 60,
      rentedQuantity: 10,
      inRepairQuantity: 3,
      returnedQuantity: 5,
      orderedQuantity: 10,
      soldQuantity: 50,
      scrappedQuantity: 2,
      purchasePrice: "$60",
      salePrice: "$90",
      monthlyRentalPrice: "$10",
      totalPrice: "$5400",
      activeStatus: "Active",
      actions: "..."
    },
    {
      productTemplateImage: "https://via.placeholder.com/56",
      productTemplateName: "27-inch Monitor Template",
      category: "Monitors",
      brand: "Dell",
      productTemplateSpecifications: "1920x1080, HDMI, IPS panel",
      totalQuantity: 40,
      availableQuantity: 25,
      rentedQuantity: 5,
      inRepairQuantity: 2,
      returnedQuantity: 3,
      orderedQuantity: 5,
      soldQuantity: 20,
      scrappedQuantity: 1,
      purchasePrice: "$200",
      salePrice: "$250",
      monthlyRentalPrice: "$25",
      totalPrice: "$10000",
      activeStatus: "Inactive",
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

export default ProductsTableLayout;
