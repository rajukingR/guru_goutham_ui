import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetIdsTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "asset_id", label: "Asset ID" },
    { id: "product_name", label: "Product Name" },
    { id: "ram", label: "RAM" },
    { id: "storage", label: "Storage" },
    { id: "processor", label: "Processor" },
    { id: "os", label: "OS" },
    { id: "graphics", label: "Graphics" },
    { id: "brand", label: "Brand" },
    { id: "model", label: "Model" },
    { id: "disk_type", label: "Disk Type" },
  ];

  useEffect(() => {
    const fetchAssetIds = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/asset-modification/asset-ids`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_no: index + 1,
            ...item,
            id: item.product_id,
          }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching asset IDs:", error);
      }
    };

    fetchAssetIds();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default AssetIdsTable;
