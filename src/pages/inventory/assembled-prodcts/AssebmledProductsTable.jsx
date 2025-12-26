import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import {
  Box,
  Chip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  Visibility,
  ExpandMore,
  Memory,
  Storage,
  DeveloperBoard,
  Settings,
  Computer,
  Power,
  Wifi
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import DefaultImage from "../../../assets/logos/default.jpg";

const AssembledProductsTable = () => {
  const [data, setData] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const userToken = token;

  // Component type icons mapping
  const componentIcons = {
    processor: <Settings sx={{ mr: 1, color: '#2196f3' }} />,
    ram: <Memory sx={{ mr: 1, color: '#4caf50' }} />,
    storage: <Storage sx={{ mr: 1, color: '#ff9800' }} />,
    motherboard: <DeveloperBoard sx={{ mr: 1, color: '#9c27b0' }} />,
    gpu: <Computer sx={{ mr: 1, color: '#f44336' }} />,
    smps: <Power sx={{ mr: 1, color: '#607d8b' }} />,
    cabinet: <Computer sx={{ mr: 1, color: '#795548' }} />,
    wifi: <Wifi sx={{ mr: 1, color: '#009688' }} />,
  };

  // Component type labels
  const componentLabels = {
    processor: "Processor",
    ram: "RAM",
    storage: "Storage",
    motherboard: "Motherboard",
    gpu: "GPU",
    smps: "SMPS",
    cabinet: "Cabinet",
    wifi: "Wi-Fi",
  };

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "assembled_name", label: "Assembled Name" },
    { id: "parent_asset_id", label: "Cabinet asset ID" },
    { id: "component_types", label: "Hardware Types" },
    { id: "view_specs", label: "View Details" },
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

  // Function to show detailed specifications in modal
  const handleViewSpecifications = (assembledProduct) => {
    setSelectedSpecs({
      name: assembledProduct.assembled_name,
      cabinetId: assembledProduct.parent_asset_id,
      components: assembledProduct.components || []
    });
    setDialogOpen(true);
  };

  // Close specifications dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSpecs(null);
  };

  // Format component details for display
  const formatComponentDetail = (component) => {
    const details = [];

    if (component.brand) details.push(component.brand);
    if (component.model) details.push(component.model);
    if (component.type && component.component_type !== component.type.toLowerCase()) {
      details.push(component.type);
    }
    if (component.size) details.push(component.size);
    if (component.frequency_band) details.push(component.frequency_band);
    if (component.wifi_standard) details.push(component.wifi_standard);
    if (component.wattage) details.push(`${component.wattage}W`);
    if (component.asset_id) details.push(`Asset: ${component.asset_id}`);

    return details.join(' • ');
  };

  useEffect(() => {
    const fetchAssembledAssets = async () => {
      try {
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
          // ADDED VIEW DETAILS BUTTON
          view_specs: (
            <Tooltip title="View Full Specifications">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={() => handleViewSpecifications(item)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                View
              </Button>
            </Tooltip>
          ),
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

      {/* Specifications Dialog - ADDED THIS */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedSpecs && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <Box display="flex" alignItems="center">
                <Computer sx={{ mr: 2 }} />
                <Typography variant="h6">
                  {selectedSpecs.name} - Specifications
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                Cabinet Asset ID: {selectedSpecs.cabinetId}
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              {/* Group components by type */}
              {Object.entries(
                selectedSpecs.components.reduce((groups, comp) => {
                  const type = comp.component_type;
                  if (!groups[type]) groups[type] = [];
                  groups[type].push(comp);
                  return groups;
                }, {})
              ).map(([type, components]) => (
                <Accordion
                  key={type}
                  defaultExpanded
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: 'action.hover',
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      {componentIcons[type] || <Settings sx={{ mr: 1 }} />}
                      <Typography fontWeight="bold" sx={{ flexGrow: 1 }}>
                        {componentLabels[type] || type.toUpperCase()} ({components.length})
                      </Typography>
                      <Chip
                        label={components.length}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width="40%">Component Details</TableCell>
                            <TableCell width="30%">Asset ID</TableCell>
                            <TableCell width="30%">Brand & Model</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {components.map((comp, idx) => (
                            <TableRow key={comp.id || idx}>
                              <TableCell>
                                <Typography variant="body2">
                                  {formatComponentDetail(comp)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={comp.asset_id}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {comp.brand || 'Unknown'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {comp.model || 'No model'}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Component summary */}
                    {type === 'ram' && components.length > 0 && (
                      <Box mt={2} p={1} bgcolor="info.light" borderRadius={1}>
                        <Typography variant="body2" fontWeight="bold">
                          RAM Summary:
                        </Typography>
                        <Typography variant="body2">
                          Total: {components.reduce((total, ram) => {
                            const sizeMatch = ram.size?.match(/(\d+)/);
                            return total + (sizeMatch ? parseInt(sizeMatch[1]) : 0);
                          }, 0)}GB across {components.length} stick(s)
                        </Typography>
                      </Box>
                    )}

                    {type === 'storage' && components.length > 0 && (
                      <Box mt={2} p={1} bgcolor="success.light" borderRadius={1}>
                        <Typography variant="body2" fontWeight="bold">
                          Storage Summary:
                        </Typography>
                        <Typography variant="body2">
                          {components.map(comp => comp.type || 'Storage').join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Total Components Summary */}
              <Box mt={3} p={2} bgcolor="primary.light" borderRadius={2}>
                <Typography variant="h6" gutterBottom>
                  System Summary
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <Chip
                    label={`${selectedSpecs.components.length} Total Peripherals`}
                    color="primary"
                    variant="outlined"
                  />
                  
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Main Table */}
      <DynamicTable
        columns={columns}
        data={data}
        rowsPerPage={10}
      />
    </div>
  );
};

export default AssembledProductsTable;