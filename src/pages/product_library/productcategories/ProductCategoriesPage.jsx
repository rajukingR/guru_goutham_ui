import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ProductCategoriesPage = () => {
  const columns = [
    { id: "sno", label: "S.No" },
    { id: "category_code", label: "Category Code" },
    { id: "category_name", label: "Category Name" },
    { id: "hsn_code", label: "HSN Code" },
    { id: "category_type", label: "Type" },
    {
      render: (value) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "error"}
          size="small"
        />
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data instead of API call
    const dummyData = [
      {
        category_code: "CAT-1001",
        category_name: "Laptops",
        hsn_code: "8471",
        category_type: "Electronics",
        is_active: true,
      },
      {
        category_code: "CAT-1002",
        category_name: "Desktops",
        hsn_code: "8471",
        category_type: "Electronics",
        is_active: true,
      },
      {
        category_code: "CAT-1003",
        category_name: "Accessories",
        hsn_code: "8473",
        category_type: "Peripheral",
        is_active: false,
      },
    ];

    const processedData = dummyData.map((item, index) => ({
      ...item,
      sno: index + 1,
    }));

    setTimeout(() => {
      setData(processedData);
      setLoading(false);
    }, 500); // simulate API delay
  }, []);

  // Filter data based on search term (optional, currently unused)
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Product Categories</Typography>
        </Box>

        {filteredData.length > 0 ? (
          <DynamicTable
            columns={columns}
            data={filteredData}
            rowsPerPage={5}
            keyProp="category_code"
          />
        ) : (
          <Alert severity="info">
            {searchTerm ? "No matching categories found" : "No categories available"}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCategoriesPage;
