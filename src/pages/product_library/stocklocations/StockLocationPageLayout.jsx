import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import DynamicTable from "../../../components/table-format/DynamicTable";

const StockLocationPageLayout = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No" },
    { id: "stock_location_id", label: "Location ID" },
    { id: "stock_name", label: "Stock Name" },
    { id: "mail_id", label: "Mail ID" },
    { id: "phone_no", label: "Phone No" },
    { id: "pincode", label: "Pincode" },
    { id: "country", label: "Country" },
    { id: "state", label: "State" },
    { id: "city", label: "City" },
    { id: "landmark", label: "Landmark" },
    { id: "street", label: "Street" },
  ];

  useEffect(() => {
    const fetchStockLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/stock-location`);
        const formatted = response.data.map((item, index) => ({
          s_id: index + 1,
          ...item,
            status: item.is_active ? "Active" : "Inactive", // ✅ Status from is_active

        }));
        setData(formatted);
      } catch (error) {
        console.error("Error fetching stock locations:", error);
      }
    };

    fetchStockLocations();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default StockLocationPageLayout;
