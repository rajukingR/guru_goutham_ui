import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../api/Api_url";
  import { useSelector } from "react-redux";

import DefaultImage from "../../assets/logos/default.jpg";

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);




    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const columns = [
    { id: "id", label: "S.No." },
    { id: "product_image", label: "Image" },

    { id: "name", label: "Product Name" },
    { id: "product_category", label: "Product Category" },

    // { id: "model", label: "Model" },
    { id: "specifications", label: "Specifications" },
    { id: "total_quantity", label: "Total Quantity" },
    { id: "available_quantity", label: "Available Quantity" },
    { id: "rented_qty", label: "Rented Quantity" },
    { id: "buy_qty", label: "Sold Quantity" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
    // { id: "total_value", label: "Total Stock Value (₹)" },
    // { id: "used_rent_value", label: "Used Rent Value (₹)" },
    // { id: "used_buy_value", label: "Used Buy Value (₹)" },
  ];

  const formatBoolean = (value) => (value ? "Yes" : "No");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/goods-receipts/approved-receipt-products`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );

        if (response.status === 200) {
          const { products, summary } = response.data;

          const formattedData = products.map((item, index) => {
            const p = item.product || {};

            const specifications = `
              RAM: ${p.ram || "N/A"}, 
              Storage: ${p.storage || "N/A"}, 
              Disk: ${p.disk_type || "N/A"}, 
              Processor: ${p.processor || "N/A"},
              Model: ${p.model || "N/A"},
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
              product_image: (
                <img
                  src={`${IMAGE_API_URL}/${p.product_image}`}
                  alt={p.product_name}
                  style={{
                    width: "65px",
                    height: "65px",
                    objectFit: "contain",
                    border: "2px solid gray",
                    borderRadius: "6px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultImage; // ✅ Use local fallback image
                  }}
                />
              ),

              name: p.product_name || "",
              product_category: p.product_category || "",

              model: p.model || "",
              processor: p.processor || "",
              ram: p.ram || "",
              storage: p.storage || "",
              graphics: p.graphics || "",
              specifications,
              total_quantity: item.total_quantity || 0,
              available_quantity: item.available_quantity || 0,
              rented_qty: item.used_quantity || 0,
              buy_qty: 0,
              purchase_price: `₹${Number(
                item.purchase_price || 0
              ).toLocaleString("en-IN")}`,
              total_value: `₹${Number(item.total_value || 0).toLocaleString(
                "en-IN"
              )}`,
              used_rent_value: "₹0",
              used_buy_value: "₹0",
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
