import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { Box, Chip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import DefaultImage from "../../../assets/logos/default.jpg";

const AssembledProductsTable = () => {
  const [data, setData] = useState([]);



  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;
  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "assembled_name", label: "Assembled Name" },
    { id: "parent_asset_id", label: "Cabinet asset ID" },
    { id: "specifications", label: "Specifications" },
    { id: "component_types", label: "Hardware Types" },
  ];

  // Function to format specifications dynamically
  const formatSpecifications = (components) => {
    // Group components by type
    const groupedComponents = {};

    components.forEach((comp) => {
      if (!groupedComponents[comp.component_type]) {
        groupedComponents[comp.component_type] = [];
      }

      let specText = "";
      if (comp.brand) specText += comp.brand + " ";
      if (comp.model) specText += comp.model + " ";
      if (comp.size) specText += comp.size + " ";
      if (comp.type) specText += comp.type + " ";
      if (comp.frequency_band) specText += comp.frequency_band + " ";
      if (comp.wifi_standard) specText += comp.wifi_standard + " ";
      if (comp.wattage) specText += comp.wattage + "W ";

      // Remove trailing space and add to group
      if (specText.trim()) {
        groupedComponents[comp.component_type].push(specText.trim());
      }
    });

    // Create specification text dynamically
    let specText = "";

    // Process all component types dynamically
    Object.keys(groupedComponents).forEach((type) => {
      if (groupedComponents[type].length > 0) {
        if (specText) specText += ", ";

        // Special handling for RAM to combine sizes
        if (type === "ram") {
          const ramSizes = groupedComponents[type].map((ram) => {
            const sizeMatch = ram.match(/\d+GB/);
            return sizeMatch ? sizeMatch[0] : ram;
          });
          specText += `RAM: ${ramSizes.join(" + ")}`;
        }
        // Special handling for SSD storage
        else if (type === "ssd") {
          const ssdSizes = groupedComponents[type].map((ssd) => {
            const sizeMatch = ssd.match(/\d+GB|\d+TB/);
            return sizeMatch ? sizeMatch[0] : ssd;
          });
          specText += `SSD: ${ssdSizes.join(" + ")}`;
        }
        // Special handling for HDD storage
        else if (type === "hdd") {
          const hddSizes = groupedComponents[type].map((hdd) => {
            const sizeMatch = hdd.match(/\d+GB|\d+TB/);
            return sizeMatch ? sizeMatch[0] : hdd;
          });
          specText += `HDD: ${hddSizes.join(" + ")}`;
        }
        // For other component types, just join with commas
        else {
          specText += `${type}: ${groupedComponents[type].join(", ")}`;
        }
      }
    });

    return specText || "No specifications available";
  };

  useEffect(() => {
    const fetchAssembledAssets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/assembled-assets`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        const formattedData = res.data.map((item, index) => ({
          id: item.id,
          s_no: index + 1,
          ...item,
          product_image: (
            <img
              src={
                item.product_image
                  ? `${IMAGE_API_URL}/${item.product_image}`
                  : DefaultImage
              }
              alt={item.assembled_name}
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
          assembled_name: item.assembled_name,
          parent_asset_id: item.parent_asset_id,
          specifications: (
            <Box sx={{ maxWidth: 300 }}>
              <Typography
                variant="body2"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {formatSpecifications(item.components)}
              </Typography>
            </Box>
          ),
          component_types: [
            ...new Set(item.components.map((comp) => comp.component_type)),
          ].join(", "),
          is_active: item.is_active ? "Active" : "Inactive",
        }));

        setData(formattedData);
      } catch (err) {
        console.error("❌ Failed to fetch assembled assets:", err);
      }
    };

    fetchAssembledAssets();
  }, []);


  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Assembled Products</h2>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default AssembledProductsTable;
