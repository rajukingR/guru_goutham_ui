import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const AssetTrackerOp = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "asset_id", label: "Asset ID" },
    { id: "product_name", label: "Product Name" },
    { id: "ram", label: "Old RAM" },
    { id: "new_ram", label: "New RAM" },
    { id: "new_ram_cost", label: "New RAM Cost", format: formatINR },
    { id: "storage", label: "Old Storage" },
    { id: "new_storage", label: "New Storage" },
    { id: "new_storage_cost", label: "New Storage Cost", format: formatINR },
    { id: "processor", label: "Processor" },
    { id: "os", label: "Operating System" },
    { id: "graphics", label: "Graphics" },
    { id: "brand", label: "Brand" },
    { id: "model", label: "Model" },
   
  ];

  useEffect(() => {
    const fetchModifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/asset-modification/asset-ids`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API response:", response.data);

        // Handle both response.data or response.data.data
        const rawData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const formatted = rawData.map((item, index) => ({
          s_id: index + 1,
          ...item,
        }));

        setData(formatted);
      } catch (error) {
        console.error("Error fetching asset modifications:", error);
      }
    };

    fetchModifications();
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN");
  }

  function formatINR(value) {
    if (!value || isNaN(value)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  }

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default AssetTrackerOp;
