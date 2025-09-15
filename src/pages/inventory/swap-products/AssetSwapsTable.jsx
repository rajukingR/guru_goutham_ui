import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const AssetSwapsTable = () => {
  const [data, setData] = useState([]);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "asset_id", label: "Asset ID" },
    { id: "product_name", label: "Product Name" },
    { id: "reason", label: "Reason" },
    { id: "swapped_on", label: "Scrapped On" },
  ];

  useEffect(() => {
    const fetchSwapData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/asset-swaps`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formatted = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchSwapData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Asset Scraps List</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default AssetSwapsTable;
