import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import DefaultImage from "../../../assets/logos/default.jpg";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  IconButton,
  Chip,
  Autocomplete
} from "@mui/material";
import { useSelector } from "react-redux";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { generateSpecifications } from "../../../utils/generateSpecifications";

const WearClientPlaceStock = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Category-specific filter states
  const [ramTypeFilter, setRamTypeFilter] = useState("");
  const [ramSizeFilter, setRamSizeFilter] = useState("");
  const [laptopFilter, setLaptopFilter] = useState("");
  const [assembledPCFilter, setAssembledPCFilter] = useState("");
  const [processorFilter, setProcessorFilter] = useState("");
  const [ssdTypeFilter, setSsdTypeFilter] = useState("");
  const [ssdCapacityFilter, setSsdCapacityFilter] = useState("");
  const [monitorSizeFilter, setMonitorSizeFilter] = useState("");
  const [gpuModelFilter, setGpuModelFilter] = useState("");
  const [gpuMemoryFilter, setGpuMemoryFilter] = useState("");
  const [hddCapacityFilter, setHddCapacityFilter] = useState("");
  const [motherboardFilter, setMotherboardFilter] = useState("");
  const [wifiStandardFilter, setWifiStandardFilter] = useState("");
  const [cabinetFilter, setCabinetFilter] = useState("");
  const [smpsFilter, setSmpsFilter] = useState("");

  // Available options for filters
  const [ramTypes, setRamTypes] = useState([]);
  const [ramSizes, setRamSizes] = useState([]);
  const [laptopNames, setLaptopNames] = useState([]);
  const [assembledPCNames, setAssembledPCNames] = useState([]);
  const [processorModels, setProcessorModels] = useState([]);
  const [ssdTypes, setSsdTypes] = useState([]);
  const [ssdCapacities, setSsdCapacities] = useState([]);
  const [monitorSizes, setMonitorSizes] = useState([]);
  const [gpuModels, setGpuModels] = useState([]);
  const [gpuMemories, setGpuMemories] = useState([]);
  const [hddCapacities, setHddCapacities] = useState([]);
  const [motherboardModels, setMotherboardModels] = useState([]);
  const [wifiStandards, setWifiStandards] = useState([]);
  const [cabinetModels, setCabinetModels] = useState([]);
  const [smpsWattages, setSmpsWattages] = useState([]);

  const { user, token } = useSelector((state) => state.auth);
  const userToken = token;

  const columns = [
    { id: "id", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "asset_id", label: "Asset ID" },
    { id: "name", label: "Product Name" },
    { id: "product_category", label: "Product Category" },
    { id: "specifications", label: "Specifications" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
  ];


  // Extract all unique options from data for each category
  useEffect(() => {
    if (data.length > 0) {
      // Get unique categories
      const uniqueCategories = [...new Set(data.map(item => item.product_category))].filter(Boolean);
      setCategories(uniqueCategories);

      // Extract all possible filter values directly from product data
      const ramTypeSet = new Set();
      const ramSizeSet = new Set();
      const laptopNameSet = new Set();
      const assembledPCNameSet = new Set();
      const processorModelSet = new Set();
      const ssdTypeSet = new Set();
      const ssdCapacitySet = new Set();
      const monitorSizeSet = new Set();
      const gpuModelSet = new Set();
      const gpuMemorySet = new Set();
      const hddCapacitySet = new Set();
      const motherboardModelSet = new Set();
      const wifiStandardSet = new Set();
      const cabinetModelSet = new Set();
      const smpsWattageSet = new Set();

      data.forEach(item => {
        const category = item.product_category;
        const product = item.rawProduct;

        if (product) {
          if (category === "RAM") {
            if (product.ramType) ramTypeSet.add(product.ramType.trim());
            if (product.ram || product.sizeGb) ramSizeSet.add((product.ram || product.sizeGb).trim());
          }
          else if (category === "Laptop") {
            if (item.name) laptopNameSet.add(item.name);
          }
          else if (category === "Assembled PC") {
            if (item.name) assembledPCNameSet.add(item.name);
          }
          else if (category === "Processor") {
            if (product.model) processorModelSet.add(product.model.trim());
          }
          else if (category === "SSD Storage") {
            if (product.ssd_type || product.disk_type) {
              const type = (product.ssd_type || product.disk_type).trim();
              ssdTypeSet.add(type);
            }
            if (product.capacity || product.storage) {
              const capacity = (product.capacity || product.storage).trim();
              ssdCapacitySet.add(capacity);
            }
          }
          else if (category === "Monitor") {
            if (product.screen_size || product.display_size) {
              const size = (product.screen_size || product.display_size).trim();
              monitorSizeSet.add(size);
            }
          }
          else if (category === "Graphics Card") {
            if (product.model) gpuModelSet.add(product.model.trim());
            if (product.speed || product.capacity) {
              const memory = (product.speed || product.capacity).trim();
              gpuMemorySet.add(memory);
            }
          }
          else if (category === "HDD Storage") {
            if (product.capacity || product.storage) {
              const capacity = (product.capacity || product.storage).trim();
              hddCapacitySet.add(capacity);
            }
          }
          else if (category === "Motherboard") {
            if (product.model) motherboardModelSet.add(product.model.trim());
          }
          else if (category === "Wi-Fi Card" || category === "Wi-Fi Dongle") {
            if (product.wifi_standard) wifiStandardSet.add(product.wifi_standard.trim());
          }
          else if (category === "Cabinet" || category === "Cabinet with SMPS") {
            if (product.model) cabinetModelSet.add(product.model.trim());
          }
          else if (category === "SMPS") {
            if (product.smps) smpsWattageSet.add(product.smps.trim());
          }
        }
      });

      // Convert Sets to Arrays
      setRamTypes(Array.from(ramTypeSet).sort());
      setRamSizes(Array.from(ramSizeSet).sort());
      setLaptopNames(Array.from(laptopNameSet).sort());
      setAssembledPCNames(Array.from(assembledPCNameSet).sort());
      setProcessorModels(Array.from(processorModelSet).sort());
      setSsdTypes(Array.from(ssdTypeSet).sort());
      setSsdCapacities(Array.from(ssdCapacitySet).sort());
      setMonitorSizes(Array.from(monitorSizeSet).sort());
      setGpuModels(Array.from(gpuModelSet).sort());
      setGpuMemories(Array.from(gpuMemorySet).sort());
      setHddCapacities(Array.from(hddCapacitySet).sort());
      setMotherboardModels(Array.from(motherboardModelSet).sort());
      setWifiStandards(Array.from(wifiStandardSet).sort());
      setCabinetModels(Array.from(cabinetModelSet).sort());
      setSmpsWattages(Array.from(smpsWattageSet).sort());
    }
  }, [data]);

  // Filter data based on selections
  useEffect(() => {
    let result = [...data];

    // Apply category filter first
    if (selectedCategory) {
      result = result.filter(item =>
        item.product_category === selectedCategory
      );

      // Apply category-specific filters
      if (selectedCategory === "RAM") {
        if (ramTypeFilter) {
          result = result.filter(item =>
            item.rawProduct?.ramType === ramTypeFilter
          );
        }
        if (ramSizeFilter) {
          result = result.filter(item =>
            (item.rawProduct?.ram || item.rawProduct?.sizeGb) === ramSizeFilter
          );
        }
      }
      else if (selectedCategory === "Laptop") {
        if (laptopFilter) {
          result = result.filter(item =>
            item.name === laptopFilter
          );
        }
      }
      else if (selectedCategory === "Assembled PC") {
        if (assembledPCFilter) {
          result = result.filter(item =>
            item.name === assembledPCFilter
          );
        }
      }
      else if (selectedCategory === "Processor") {
        if (processorFilter) {
          result = result.filter(item =>
            item.rawProduct?.model === processorFilter
          );
        }
      }
      else if (selectedCategory === "SSD Storage") {
        if (ssdTypeFilter) {
          result = result.filter(item =>
            (item.rawProduct?.ssd_type || item.rawProduct?.disk_type) === ssdTypeFilter
          );
        }
        if (ssdCapacityFilter) {
          result = result.filter(item =>
            (item.rawProduct?.capacity || item.rawProduct?.storage) === ssdCapacityFilter
          );
        }
      }
      else if (selectedCategory === "Monitor") {
        if (monitorSizeFilter) {
          result = result.filter(item =>
            (item.rawProduct?.screen_size || item.rawProduct?.display_size) === monitorSizeFilter
          );
        }
      }
      else if (selectedCategory === "Graphics Card") {
        if (gpuModelFilter) {
          result = result.filter(item =>
            item.rawProduct?.model === gpuModelFilter
          );
        }
        if (gpuMemoryFilter) {
          result = result.filter(item =>
            (item.rawProduct?.speed || item.rawProduct?.capacity) === gpuMemoryFilter
          );
        }
      }
      else if (selectedCategory === "HDD Storage") {
        if (hddCapacityFilter) {
          result = result.filter(item =>
            (item.rawProduct?.capacity || item.rawProduct?.storage) === hddCapacityFilter
          );
        }
      }
      else if (selectedCategory === "Motherboard") {
        if (motherboardFilter) {
          result = result.filter(item =>
            item.rawProduct?.model === motherboardFilter
          );
        }
      }
      else if (selectedCategory === "Wi-Fi Card" || selectedCategory === "Wi-Fi Dongle") {
        if (wifiStandardFilter) {
          result = result.filter(item =>
            item.rawProduct?.wifi_standard === wifiStandardFilter
          );
        }
      }
      else if (selectedCategory === "Cabinet" || selectedCategory === "Cabinet with SMPS") {
        if (cabinetFilter) {
          result = result.filter(item =>
            item.rawProduct?.model === cabinetFilter
          );
        }
      }
      else if (selectedCategory === "SMPS") {
        if (smpsFilter) {
          result = result.filter(item =>
            item.rawProduct?.smps === smpsFilter
          );
        }
      }
    }

    // Apply global search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.asset_id?.toLowerCase().includes(term) ||
        item.name?.toLowerCase().includes(term) ||
        item.product_category?.toLowerCase().includes(term) ||
        item.specifications?.toLowerCase().includes(term)
      );
    }

    // Reset serial numbers
    result = result.map((item, index) => ({
      ...item,
      id: index + 1
    }));

    setFilteredData(result);
  }, [
    data, selectedCategory, searchTerm,
    ramTypeFilter, ramSizeFilter,
    laptopFilter, assembledPCFilter, processorFilter,
    ssdTypeFilter, ssdCapacityFilter,
    monitorSizeFilter, gpuModelFilter,
    gpuMemoryFilter, hddCapacityFilter,
    motherboardFilter, wifiStandardFilter,
    cabinetFilter, smpsFilter
  ]);

  useEffect(() => {
    const fetchWearClientPlaceStock = async () => {
      try {
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
          const assetData = [];
          let serialNumber = 1;

          products.forEach((item) => {
            if (!item.available_asset_ids || item.available_asset_ids.length === 0) {
              return;
            }

            const p = item.product || {};
            const specifications = generateSpecifications(p)
              .trim()
              .replace(/\s+/g, " ")
              .replace(/\n/g, "");

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
                purchase_price: `₹${Number(item.purchase_price || 0).toLocaleString("en-IN")}`,
                rawProduct: p,
              });
            });
          });

          setData(assetData);
          setFilteredData(assetData);
          setSummary(summary);
        }
      } catch (error) {
        console.error("Error fetching Wear - Client Place Stock:", error);
      }
    };

    fetchWearClientPlaceStock();
  }, []);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
    setRamTypeFilter("");
    setRamSizeFilter("");
    setLaptopFilter("");
    setAssembledPCFilter("");
    setProcessorFilter("");
    setSsdTypeFilter("");
    setSsdCapacityFilter("");
    setMonitorSizeFilter("");
    setGpuModelFilter("");
    setGpuMemoryFilter("");
    setHddCapacityFilter("");
    setMotherboardFilter("");
    setWifiStandardFilter("");
    setCabinetFilter("");
    setSmpsFilter("");
  };

  // Render category-specific filters
  const renderCategoryFilters = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory) {
      case "RAM":
        return (
          <>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>RAM Type</InputLabel>
              <Select
                value={ramTypeFilter}
                label="RAM Type"
                onChange={(e) => setRamTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {ramTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>RAM Size</InputLabel>
              <Select
                value={ramSizeFilter}
                label="RAM Size"
                onChange={(e) => setRamSizeFilter(e.target.value)}
              >
                <MenuItem value="">All Sizes</MenuItem>
                {ramSizes.map(size => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );

      case "Laptop":
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Product Name</InputLabel>
            <Select
              value={laptopFilter}
              label="Product Name"
              onChange={(e) => setLaptopFilter(e.target.value)}
            >
              <MenuItem value="">All Laptops</MenuItem>
              {laptopNames.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Assembled PC":
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Product Name</InputLabel>
            <Select
              value={assembledPCFilter}
              label="Product Name"
              onChange={(e) => setAssembledPCFilter(e.target.value)}
            >
              <MenuItem value="">All Assembled PCs</MenuItem>
              {assembledPCNames.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Processor":
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Processor Model</InputLabel>
            <Select
              value={processorFilter}
              label="Processor Model"
              onChange={(e) => setProcessorFilter(e.target.value)}
            >
              <MenuItem value="">All Models</MenuItem>
              {processorModels.map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "SSD Storage":
        return (
          <>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>SSD Type</InputLabel>
              <Select
                value={ssdTypeFilter}
                label="SSD Type"
                onChange={(e) => setSsdTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {ssdTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>SSD Capacity</InputLabel>
              <Select
                value={ssdCapacityFilter}
                label="SSD Capacity"
                onChange={(e) => setSsdCapacityFilter(e.target.value)}
              >
                <MenuItem value="">All Capacities</MenuItem>
                {ssdCapacities.map(capacity => (
                  <MenuItem key={capacity} value={capacity}>{capacity}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );

      case "Monitor":
        return (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Monitor Size</InputLabel>
            <Select
              value={monitorSizeFilter}
              label="Monitor Size"
              onChange={(e) => setMonitorSizeFilter(e.target.value)}
            >
              <MenuItem value="">All Sizes</MenuItem>
              {monitorSizes.map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Graphics Card":
        return (
          <>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>GPU Model</InputLabel>
              <Select
                value={gpuModelFilter}
                label="GPU Model"
                onChange={(e) => setGpuModelFilter(e.target.value)}
              >
                <MenuItem value="">All Models</MenuItem>
                {gpuModels.map(model => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>GPU Memory</InputLabel>
              <Select
                value={gpuMemoryFilter}
                label="GPU Memory"
                onChange={(e) => setGpuMemoryFilter(e.target.value)}
              >
                <MenuItem value="">All Memories</MenuItem>
                {gpuMemories.map(memory => (
                  <MenuItem key={memory} value={memory}>{memory}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );

      case "HDD Storage":
        return (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>HDD Capacity</InputLabel>
            <Select
              value={hddCapacityFilter}
              label="HDD Capacity"
              onChange={(e) => setHddCapacityFilter(e.target.value)}
            >
              <MenuItem value="">All Capacities</MenuItem>
              {hddCapacities.map(capacity => (
                <MenuItem key={capacity} value={capacity}>{capacity}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Motherboard":
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Motherboard Model</InputLabel>
            <Select
              value={motherboardFilter}
              label="Motherboard Model"
              onChange={(e) => setMotherboardFilter(e.target.value)}
            >
              <MenuItem value="">All Models</MenuItem>
              {motherboardModels.map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Wi-Fi Card":
      case "Wi-Fi Dongle":
        return (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Wi-Fi Standard</InputLabel>
            <Select
              value={wifiStandardFilter}
              label="Wi-Fi Standard"
              onChange={(e) => setWifiStandardFilter(e.target.value)}
            >
              <MenuItem value="">All Standards</MenuItem>
              {wifiStandards.map(standard => (
                <MenuItem key={standard} value={standard}>{standard}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Cabinet":
      case "Cabinet with SMPS":
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Cabinet Model</InputLabel>
            <Select
              value={cabinetFilter}
              label="Cabinet Model"
              onChange={(e) => setCabinetFilter(e.target.value)}
            >
              <MenuItem value="">All Models</MenuItem>
              {cabinetModels.map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "SMPS":
        return (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>SMPS Wattage</InputLabel>
            <Select
              value={smpsFilter}
              label="SMPS Wattage"
              onChange={(e) => setSmpsFilter(e.target.value)}
            >
              <MenuItem value="">All Wattages</MenuItem>
              {smpsWattages.map(wattage => (
                <MenuItem key={wattage} value={wattage}>{wattage}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        // For other categories, show generic product name filter
        const otherProductNames = [...new Set(
          data
            .filter(item => item.product_category === selectedCategory)
            .map(item => item.name)
        )].filter(Boolean);

        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Product Name</InputLabel>
            <Select
              value={""}
              label="Product Name"
              disabled={otherProductNames.length === 0}
            >
              <MenuItem value="">Select category</MenuItem>
              {otherProductNames.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
    }
  };

  return (
    <div>
      {summary && (
        <div>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              Total Available Assets: <strong>{filteredData.length}</strong>
            </Typography>
          </Box>
        </div>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Left side - Search */}
        <Grid item xs={12} md={6}>

        </Grid>

        {/* Right side - Filters */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            {/* Category Selector */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => {
                  handleClearFilters();
                  setSelectedCategory(e.target.value);
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category-specific filters */}
            {renderCategoryFilters()}

            {/* Clear filters button */}
            {(selectedCategory || searchTerm || ramTypeFilter || ramSizeFilter) && (
              <IconButton
                onClick={handleClearFilters}
                color="primary"
                title="Clear all filters"
                sx={{
                  border: '1px solid #1976d2',
                  borderRadius: '8px'
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Show active filters as chips */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {selectedCategory && <Chip label={`Category: ${selectedCategory}`} />}
        {ramTypeFilter && <Chip label={`RAM Type: ${ramTypeFilter}`} onDelete={() => setRamTypeFilter("")} />}
        {ramSizeFilter && <Chip label={`RAM Size: ${ramSizeFilter}`} onDelete={() => setRamSizeFilter("")} />}
        {laptopFilter && <Chip label={`Laptop: ${laptopFilter}`} onDelete={() => setLaptopFilter("")} />}
        {assembledPCFilter && <Chip label={`Assembled PC: ${assembledPCFilter}`} onDelete={() => setAssembledPCFilter("")} />}
        {processorFilter && <Chip label={`Processor: ${processorFilter}`} onDelete={() => setProcessorFilter("")} />}
        {ssdTypeFilter && <Chip label={`SSD Type: ${ssdTypeFilter}`} onDelete={() => setSsdTypeFilter("")} />}
        {ssdCapacityFilter && <Chip label={`SSD Capacity: ${ssdCapacityFilter}`} onDelete={() => setSsdCapacityFilter("")} />}
        {monitorSizeFilter && <Chip label={`Monitor Size: ${monitorSizeFilter}`} onDelete={() => setMonitorSizeFilter("")} />}
        {gpuModelFilter && <Chip label={`GPU Model: ${gpuModelFilter}`} onDelete={() => setGpuModelFilter("")} />}
        {gpuMemoryFilter && <Chip label={`GPU Memory: ${gpuMemoryFilter}`} onDelete={() => setGpuMemoryFilter("")} />}
        {hddCapacityFilter && <Chip label={`HDD Capacity: ${hddCapacityFilter}`} onDelete={() => setHddCapacityFilter("")} />}
        {motherboardFilter && <Chip label={`Motherboard: ${motherboardFilter}`} onDelete={() => setMotherboardFilter("")} />}
        {wifiStandardFilter && <Chip label={`Wi-Fi: ${wifiStandardFilter}`} onDelete={() => setWifiStandardFilter("")} />}
        {cabinetFilter && <Chip label={`Cabinet: ${cabinetFilter}`} onDelete={() => setCabinetFilter("")} />}
        {smpsFilter && <Chip label={`SMPS: ${smpsFilter}`} onDelete={() => setSmpsFilter("")} />}
        {searchTerm && <Chip label={`Search: ${searchTerm}`} onDelete={() => setSearchTerm("")} />}
      </Box>

      <DynamicTable
        columns={columns}
        data={filteredData}
      />
    </div>
  );
};

export default WearClientPlaceStock;