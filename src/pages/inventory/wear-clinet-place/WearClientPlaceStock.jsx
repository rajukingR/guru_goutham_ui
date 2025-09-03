import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import DefaultImage from "../../../assets/logos/default.jpg";
import { Box, Typography, Paper } from "@mui/material";

const WearClientPlaceStock = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "asset_id", label: "Asset ID" },
    { id: "name", label: "Product Name" },
    { id: "product_category", label: "Product Category" },
    { id: "specifications", label: "Specifications" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
  ];

  useEffect(() => {
    const fetchWearClientPlaceStock = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/goods-receipts/approved-receipt-products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const { products, summary } = response.data;

          // Create a flat array with one row per asset ID
          const assetData = [];
          let serialNumber = 1;

          products.forEach((item) => {
            // Skip products that don't have asset IDs
            if (
              !item.available_asset_ids ||
              item.available_asset_ids.length === 0
            ) {
              return;
            }

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

            // Create a row for each asset ID
            item.available_asset_ids.forEach((assetId) => {
              assetData.push({
                id: serialNumber++,
                product_image: (
                  <img
                    src={
                      p.product_image
                        ? `${IMAGE_API_URL}/${p.product_image}`
                        : DefaultImage
                    }
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
                      e.target.src = DefaultImage;
                    }}
                  />
                ),
                asset_id: assetId,
                name: p.product_name || "",
                product_category: p.product_category || "",
                specifications,
                purchase_price: `₹${Number(
                  item.purchase_price || 0
                ).toLocaleString("en-IN")}`,
              });
            });
          });

          setData(assetData);
          setSummary(summary);
        }
      } catch (error) {
        console.error("Error fetching Wear - Client Place Stock:", error);
      }
    };

    fetchWearClientPlaceStock();
  }, []);

  // Helper function to format boolean values
  const formatBoolean = (value) => {
    if (value === true || value === "true") return "Yes";
    if (value === false || value === "false") return "No";
    return "N/A";
  };

  return (
    <div>
      {summary && (
        <div>
          <Typography variant="h6" gutterBottom>
            Asset Inventory Summary
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography>
              Total Available Assets: <strong>{data.length}</strong>
            </Typography>
          </Box>
        </div>
      )}
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default WearClientPlaceStock;
