import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import DefaultImage from "../../../assets/logos/default.jpg";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";

const ClientPlaceStock = () => {
  const [clients, setClients] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [assetData, setAssetData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "asset_id", label: "Asset ID" },
    { id: "name", label: "Product Name" },
    { id: "product_category", label: "Product Category" },
    { id: "specifications", label: "Specifications" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
    // { id: "dc_id", label: "DC Number" },
    // { id: "dc_date", label: "Delivery Date" },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/contacts/delivered-contacts`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            s_id: index + 1,
            full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
            ...item,
          }));
          setClients(dataWithSno);

          // Auto-select the first customer if available
          if (response.data.length > 0) {
            setSelectedCustomer(response.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching delivered clients:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchClientSideAssets(selectedCustomer);
    }
  }, [selectedCustomer]);

  const fetchClientSideAssets = async (customerId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/delivery-challans/customer-details/${customerId}`,
        {
          headers: { "Authorization": `Bearer ${userToken}` },
        }
      );

      if (response.status === 200) {
        const { customer, challans } = response.data;

        const assets = [];
        let serialNumber = 1;

        // Process each challan and its items
        challans.forEach((challan) => {
          if (challan.items && challan.items.length > 0) {
            challan.items.forEach((item) => {
              const p = item.product || {};

              // Process each device in the device_ids array
              if (item.device_ids && item.device_ids.length > 0) {
                item.device_ids.forEach((deviceId) => {
                  const specifications = `
                    RAM: ${p.ram || "N/A"}, 
                    Storage: ${p.storage || "N/A"}, 
                    Disk: ${p.disk_type || "N/A"}, 
                    Processor: ${p.processor_model || p.processor || "N/A"},
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

                  assets.push({
                    s_id: serialNumber++,
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
                    asset_id: deviceId,
                    name: p.product_name || "N/A",
                    product_category: p.product_category || "N/A",
                    specifications,
                    purchase_price: p.purchase_price
                      ? `₹${parseFloat(p.purchase_price).toLocaleString(
                          "en-IN"
                        )}`
                      : "N/A",
                    dc_id: challan.dc_id || "N/A",
                    dc_date: challan.dc_date || "N/A",
                    original_price: p.purchase_price || 0,
                  });
                });
              }
            });
          }
        });

        // Calculate summary
        const totalAssets = assets.length;
        const totalValue = assets.reduce(
          (sum, asset) => sum + parseFloat(asset.original_price || 0),
          0
        );

        setAssetData(assets);
        setSummary({
          totalAssets,
          totalValue,
          customerName: `${customer.first_name} ${
            customer.last_name || ""
          }`.trim(),
          companyName: customer.company_name || "N/A",
          customerId: customer.customer_id || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching Client Place Stock:", error);
      setAssetData([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format boolean values
  const formatBoolean = (value) => {
    if (value === true || value === "true") return "Yes";
    if (value === false || value === "false") return "No";
    return "N/A";
  };

  return (
    <div>
      {/* Customer Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
        <InputLabel>Select Customer</InputLabel>
        <Select
          value={selectedCustomer}
          label="Select Customer"
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.full_name} - {client.company_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <Typography>Loading assets...</Typography>}

      {summary && !loading && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Client Place Asset Inventory Summary
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
            <Typography variant="body1">
              Total Assets: <strong>{summary.totalAssets}</strong>
            </Typography>
          </Box>
        </Box>
      )}

      {assetData.length > 0 && !loading && (
        <DynamicTable columns={columns} data={assetData} />
      )}

      {selectedCustomer && assetData.length === 0 && !loading && (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No assets found for this customer.
        </Typography>
      )}
    </div>
  );
};

export default ClientPlaceStock;

// import React, { useEffect, useState } from "react";
// import DynamicTable from "../../../components/table-format/DynamicTable";
// import axios from "axios";
// import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
// import DefaultImage from "../../../assets/logos/default.jpg";
// import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// const ClientPlaceStock = () => {
//   const [clients, setClients] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState("");
//   const [assetData, setAssetData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const columns = [
//     { id: "s_id", label: "S.No." },
//     { id: "product_image", label: "Image" },
//     { id: "asset_id", label: "Asset ID" },
//     { id: "name", label: "Product Name" },
//     { id: "product_category", label: "Product Category" },
//     { id: "specifications", label: "Specifications" },
//     { id: "purchase_price", label: "Purchase Price (₹)" },

//   ];

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`${API_URL}/contacts`, {
//           headers: { "Authorization": `Bearer ${token}` },
//         });

//         if (response.status === 200) {
//           const dataWithSno = response.data.map((item, index) => ({
//             s_id: index + 1,
//             id: item.id,
//             full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
//             company_name: item.company_name,
//             customer_id: item.customer_id,
//           }));

//           setClients(dataWithSno);

//           // Auto-select the first customer if available
//           if (dataWithSno.length > 0) {
//             setSelectedCustomer(dataWithSno[0].id);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching contacts:", error);
//       }
//     };

//     fetchClients();
//   }, []);

//   useEffect(() => {
//     if (selectedCustomer) {
//       fetchClientSideAssets(selectedCustomer);
//     }
//   }, [selectedCustomer]);

//   const fetchClientSideAssets = async (customerId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_URL}/delivery-challans/customer-details/${customerId}`,
//         {
//           headers: { "Authorization": `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         const { customer, challans } = response.data;

//         const assets = [];
//         let serialNumber = 1;

//         challans.forEach((challan) => {
//           if (challan.items && challan.items.length > 0) {
//             challan.items.forEach((item) => {
//               const p = item.product || {};

//               if (item.device_ids && item.device_ids.length > 0) {
//                 item.device_ids.forEach((deviceId) => {
//                   const specifications = `
//                     RAM: ${p.ram || "N/A"},
//                     Storage: ${p.storage || "N/A"},
//                     Disk: ${p.disk_type || "N/A"},
//                     Processor: ${p.processor_model || p.processor || "N/A"},
//                     Model: ${p.model || "N/A"},
//                     Graphics: ${p.graphics || "N/A"},
//                     OS: ${p.os || "N/A"},
//                     Mouse: ${formatBoolean(p.mouse)},
//                     Keyboard: ${formatBoolean(p.keyboard)},
//                     Speaker: ${formatBoolean(p.speaker)},
//                     Webcam: ${formatBoolean(p.webcam)},
//                     DVD: ${formatBoolean(p.dvd)}
//                   `
//                     .trim()
//                     .replace(/\s+/g, " ");

//                   assets.push({
//                     s_id: serialNumber++,
//                     product_image: (
//                       <img
//                         src={
//                           p.product_image
//                             ? `${IMAGE_API_URL}/${p.product_image}`
//                             : DefaultImage
//                         }
//                         alt={p.product_name}
//                         style={{
//                           width: "65px",
//                           height: "65px",
//                           objectFit: "contain",
//                           border: "2px solid gray",
//                           borderRadius: "6px",
//                         }}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = DefaultImage;
//                         }}
//                       />
//                     ),
//                     asset_id: deviceId,
//                     name: p.product_name || "N/A",
//                     product_category: p.product_category || "N/A",
//                     specifications,
//                     purchase_price: p.purchase_price
//                       ? `₹${parseFloat(p.purchase_price).toLocaleString(
//                           "en-IN"
//                         )}`
//                       : "N/A",
//                     dc_id: challan.dc_id || "N/A",
//                     dc_date: challan.dc_date || "N/A",
//                     original_price: p.purchase_price || 0,
//                   });
//                 });
//               }
//             });
//           }
//         });

//         const totalAssets = assets.length;
//         const totalValue = assets.reduce(
//           (sum, asset) => sum + parseFloat(asset.original_price || 0),
//           0
//         );

//         setAssetData(assets);
//         setSummary({
//           totalAssets,
//           totalValue,
//           customerName: `${customer.first_name} ${customer.last_name || ""}`.trim(),
//           companyName: customer.company_name || "N/A",
//           customerId: customer.customer_id || "N/A",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching Client Place Stock:", error);
//       setAssetData([]);
//       setSummary(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatBoolean = (value) => {
//     if (value === true || value === "true") return "Yes";
//     if (value === false || value === "false") return "No";
//     return "N/A";
//   };

//   return (
//     <div>
//       {/* Customer Selection Dropdown */}
//       <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
//         <InputLabel>Select Customer</InputLabel>
//         <Select
//           value={selectedCustomer}
//           label="Select Customer"
//           onChange={(e) => setSelectedCustomer(e.target.value)}
//         >
//           {clients.map((client) => (
//             <MenuItem key={client.id} value={client.id}>
//               {client.full_name} - {client.company_name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {loading && <Typography>Loading assets...</Typography>}

//       {summary && !loading && (
//         <Box
//           sx={{
//             mb: 3,
//             p: 2,
//             border: "1px solid #ddd",
//             borderRadius: 1,
//             backgroundColor: "#f9f9f9",
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Client Place Asset Inventory Summary
//           </Typography>

//           <Box sx={{ display: "flex", gap: 3, mt: 1 }}>

//             <Typography variant="body1">
//               Total Assets: <strong>{summary.totalAssets}</strong>
//             </Typography>

//           </Box>
//         </Box>
//       )}

//       {assetData.length > 0 && !loading && (
//         <DynamicTable columns={columns} data={assetData} />
//       )}

//       {selectedCustomer && assetData.length === 0 && !loading && (
//         <Typography
//           variant="body1"
//           sx={{ mt: 2, color: "text.secondary" }}
//         >
//           <DynamicTable columns={columns} data={assetData} />
//         </Typography>
//       )}
//     </div>
//   );
// };

// export default ClientPlaceStock;
