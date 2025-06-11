import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../api/Api_url";

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "name", label: "Product Name" },
    { id: "model", label: "Model" },
   
    { id: "specifications", label: "Specifications" },
    { id: "total_quantity", label: "Total Quantity" },
    { id: "available_quantity", label: "Available Quantity" },
    { id: "rented_qty", label: "Rented Quantity" },
    { id: "buy_qty", label: "Sold Quantity" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
    { id: "total_value", label: "Total Stock Value (₹)" },
    { id: "used_rent_value", label: "Used Rent Value (₹)" },
    { id: "used_buy_value", label: "Used Buy Value (₹)" },
  ];

  const formatBoolean = (value) => (value ? "Yes" : "No");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/goods-receipts/approved-receipt-products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const { products, summary } = response.data;

          const formattedData = products.map((item, index) => {
            const p = item.product || {};

            const specifications = `
              RAM: ${p.ram || "N/A"}, 
              Storage: ${p.storage || "N/A"}, 
              Disk: ${p.disk_type || "N/A"}, 
              Processor: ${p.processor || "N/A"}, 
              Graphics: ${p.graphics || "N/A"}, 
              OS: ${p.os || "N/A"}, 
              Mouse: ${formatBoolean(p.mouse)}, 
              Keyboard: ${formatBoolean(p.keyboard)}, 
              Speaker: ${formatBoolean(p.speaker)}, 
              Webcam: ${formatBoolean(p.webcam)}, 
              DVD: ${formatBoolean(p.dvd)}
            `
              .trim()
              .replace(/\s+/g, " ");

            return {
              id: index + 1,
              name: p.product_name || "",
              model: p.model || "",
              processor: p.processor || "",
              ram: p.ram || "",
              storage: p.storage || "",
              graphics: p.graphics || "",
              specifications,
              total_quantity: item.total_quantity,
              available_quantity: item.available_quantity,
              rented_qty: item.rented_qty,
              buy_qty: item.buy_qty,
              purchase_price: `₹${item.purchase_price.toLocaleString("en-IN")}`,
              total_value: `₹${item.total_value.toLocaleString("en-IN")}`,
              used_rent_value: `₹${item.used_rent_value.toLocaleString("en-IN")}`,
              used_buy_value: `₹${item.used_buy_value.toLocaleString("en-IN")}`,
            };
          });

          setData(formattedData);
          setSummary(summary);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default InventoryTable;
