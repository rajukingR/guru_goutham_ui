import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const BrandsTablePage = () => {
  const columns = [
    { id: "sno", label: "S.No." }, // dynamically rendered, not in data
    { id: "brand_number", label: "Brand Number" },
    { id: "brand_name", label: "Brand Name" },
    { id: "brand_description", label: "Description" },
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/brand");

        const brandsArray = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setData(brandsArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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
        <Alert severity="error">Error loading brands: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>Brands Management</h2>

      {data.length > 0 ? (
        <DynamicTable columns={columns} data={data} rowsPerPage={5} keyProp="brand_id" />
      ) : (
        <Alert severity="info">No brands found in the system</Alert>
      )}
    </Box>
  );
};

export default BrandsTablePage;
