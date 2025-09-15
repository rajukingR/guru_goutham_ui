import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const AssetTrackerOp = () => {
  const [data, setData] = useState([]);



    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "parent_asset_id", label: "Parent Asset ID" },
    { id: "product_name", label: "Product Name" },
    { id: "ram", label: "RAM" },
    { id: "storage", label: "Storage" },
    { id: "processor", label: "Processor" },
  ];

  useEffect(() => {
    const fetchPeripheral = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/peripheral-assets`, {
          headers: { "Authorization": `Bearer ${userToken}` },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => {
            // Extract all RAM items and combine their specifications
            const ramItems = item.items.filter(
              (i) => i.product_category === "RAM"
            );
            const ramSpecs = ramItems
              .map((item) => item.specifications)
              .join(" + ");

            // Extract Storage items
            const storageItems = item.items.filter(
              (i) =>
                i.product_category === "SSD" || i.product_category === "HDD"
            );
            const storageSpecs = storageItems
              .map((item) => item.specifications)
              .join(" + ");

            // Extract Processor
            const processorItem = item.items.find(
              (i) => i.product_category === "Processor"
            );

            return {
              s_id: index + 1,
              ...item,
              parent_asset_id: item.parent_asset_id,
              product_name: item.product_name,
              ram: ramSpecs || item.ram || "N/A",
              storage: storageSpecs || item.storage || "N/A",
              processor: processorItem ? processorItem.specifications : "N/A",
            };
          });

          setData(dataWithSno);
        }
      } catch (error) {
        console.error("Error fetching peripheral:", error);
      }
    };

    fetchPeripheral();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default AssetTrackerOp;
