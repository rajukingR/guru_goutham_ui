import React from "react";
import { 
  Avatar,
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  InputAdornment, 
  TextField,
  Typography 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ProductCategoriesPage = () => {
  // Define columns for the table
  const columns = [
    { 
      id: "categoryImage", 
      label: "Category Image",
      render: (value) => (
        <Avatar 
          variant="square" 
          src={value} 
          sx={{ width: 56, height: 56 }}
        />
      )
    },
    { id: "categoryName", label: "Category Name" },
    { id: "parentCategory", label: "Parent Category" },
    { id: "description", label: "Description" },
    { id: "productsCount", label: "Products Count" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" },
  ];

  // Sample data for product categories
  const data = [
    {
      categoryName: "Electronics",
      parentCategory: "None",
      description: "All electronic devices and components",
      productsCount: 125,
      status: "Active",
      actions: "..."
    },
    {
      categoryName: "Computers",
      parentCategory: "Electronics",
      description: "Desktops, laptops and accessories",
      productsCount: 78,
      status: "Active",
      actions: "..."
    },
    {
      categoryName: "Monitors",
      parentCategory: "Computers",
      description: "Computer displays and screens",
      productsCount: 42,
      status: "Active",
      actions: "..."
    },
    {
      categoryName: "Accessories",
      parentCategory: "Computers",
      description: "Keyboards, mice and other peripherals",
      productsCount: 56,
      status: "Active",
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

export default ProductCategoriesPage;