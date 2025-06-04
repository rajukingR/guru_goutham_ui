import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CircularProgress, 
  Typography 
} from "@mui/material";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";

const StockLocationPageLayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns (Removed "Active Status" and "Actions")
  const columns = [
    { id: "stockLocationId", label: "Stock Location ID" },
    { id: "stockName", label: "Stock Name" },
    { id: "mailId", label: "Mail ID" },
    { id: "phoneNo", label: "Phone No" },
    { id: "pincode", label: "Pincode" },
    { id: "country", label: "Country" },
    { id: "state", label: "State" },
    { id: "city", label: "City" },
    { id: "landmark", label: "Landmark" },
    { id: "street", label: "Street" }
  ];

  useEffect(() => {
    const fetchStockLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stock-location/");
        const formattedData = response.data.map((item) => ({
          stockLocationId: item.stock_location_id,
          stockName: item.stock_name,
          mailId: item.mail_id,
          phoneNo: item.phone_no,
          pincode: item.pincode,
          country: item.country,
          state: item.state,
          city: item.city,
          landmark: item.landmark,
          street: item.street
        }));
        setData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stock locations:", err);
        setError("Failed to load stock locations.");
        setLoading(false);
      }
    };

    fetchStockLocations();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
  }

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

export default StockLocationPageLayout;
