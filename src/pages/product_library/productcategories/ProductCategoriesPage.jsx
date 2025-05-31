import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
      )
    }
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product-categories");
        
        // Process the response data
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data 
            ? response.data.data 
            : [response.data];

        // Add serial numbers
        const processedData = categoriesData.map((item, index) => ({
          ...item,
          sno: index + 1,
          is_active: Boolean(item.is_active)
        }));

        setData(processedData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(
      value =>
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

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Product Categories</Typography>
    
        </Box>

        <Box mb={3}>

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