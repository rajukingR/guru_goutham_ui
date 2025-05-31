import React, { useState, useEffect } from "react";
import { 
  Avatar, 
  Card, 
  CardContent,
  Chip,
  CircularProgress,
  Box
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";

const StockLocationPageLayout = () => {
  const [stockLocations, setStockLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns for the table (removed status column)
  const columns = [
    { 
      id: "stock_location_id", 
      label: "Location ID",
      render: (value) => (
        <Chip 
          label={value} 
          color="primary"
          variant="outlined"
        />
      )
    },
    { id: "stock_name", label: "Stock Name" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "country", label: "Country" },
    { id: "phone_no", label: "Phone" },
    // Removed the status column completely
  ];

  // Fetch stock locations data
  useEffect(() => {
    const fetchStockLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock-locations');
        setStockLocations(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching stock locations:', err);
      }
    };

    fetchStockLocations();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Chip label={`Error: ${error}`} color="error" />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <DynamicTable 
          columns={columns} 
          data={stockLocations} 
          rowsPerPage={5} 
        />
      </CardContent>
    </Card>
  );
};

export default StockLocationPageLayout;