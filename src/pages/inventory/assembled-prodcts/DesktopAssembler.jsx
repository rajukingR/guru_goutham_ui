import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

// Styling constants
const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  sectionTitle: {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.5rem",
  },
  componentTitle: {
    margin: "1.5rem 0 1rem",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#374151",
    display: "flex",
    alignItems: "center",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  fieldWrapper: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.5rem",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "500",
    color: "#4b5563",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "#fff",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    ":focus": {
      outline: "none",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  cardHeader: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    width: "100%",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    ":focus": {
      outline: "none",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
  fieldsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  icon: {
    marginRight: "8px",
    color: "#3b82f6",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "1rem",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "#2563eb",
    },
  },
  addButton: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "0.5rem",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "#059669",
    },
  },
  removeButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "0.5rem",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "#dc2626",
    },
  },
  componentItem: {
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    position: "relative",
  },
};

const cardHeaderContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #e2e8f0",
};

const iconStyle = {
  fontSize: "1.25rem",
  marginRight: "0.75rem",
  backgroundColor: "#f1f5f9",
  padding: "0.5rem",
  borderRadius: "8px",
};

const cardHeaderStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  color: "#1e293b",
  margin: 0,
};

const checkboxContainerStyle = {
  marginTop: "0.5rem",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "flex-start",
  cursor: "pointer",
  gap: "0.75rem",
};

const checkboxStyle = {
  display: "none",
};

const checkboxCustomStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  border: "2px solid #d1d5db",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  flexShrink: 0,
  marginTop: "2px",
};

const checkmarkStyle = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
};

const checkboxTextStyle = {
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  display: "block",
};

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div style={checkboxContainerStyle}>
    <label style={checkboxLabelStyle}>
      {/* Hidden but functional checkbox */}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={{
          position: "absolute",
          opacity: 0,
          width: "20px",
          height: "20px",
          cursor: "pointer",
          zIndex: 1,
        }}
      />
      {/* Custom checkbox visualization */}
      <div
        style={{
          ...checkboxCustomStyle,
          backgroundColor: checked ? "#4CAF50" : "#ffffff",
          borderColor: checked ? "#4CAF50" : "#d1d5db",
        }}
      >
        {checked && <span style={checkmarkStyle}>✓</span>}
      </div>
      <span style={checkboxTextStyle}>{label}</span>
    </label>
  </div>
);

const HardwareSelector = () => {
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Form data state
  const [formData, setFormData] = useState({
    assembledDesktop: "",
    asset_id: "",
    product_image: null,
    is_active: true,
  });

  // Loading states
  const [loading, setLoading] = useState({
    brands: false,
    models: false,
    capacities: false,
    assets: false,
  });

  // Component categories
  const componentCategories = {
    ram: "RAM",
    processor: "Processor",
    motherboard: "Mother Board",
    cabinet: "Cabinet",
    storage: ["SSD", "HDD", "NVMe"],
    gpu: "GPU",
    smps: "SMPS",
    wifi: "Wi-Fi",
  };

  // First, update the RAM and Storage state to include product_id
  const [ramModules, setRamModules] = useState([
    {
      type: "",
      brand: "",
      model: "",
      size: "",
      asset_id: "",
      product_id: "", // Add product_id for RAM
      brands: [],
      models: [],
      sizes: [],
      assetIds: [],
      productIds: [], // Add productIds array to store available product_ids
    },
  ]);

  const [storageDrives, setStorageDrives] = useState([
    {
      type: "",
      brand: "",
      model: "",
      size: "",
      asset_id: "",
      product_id: "", // Add product_id for Storage
      brands: [],
      models: [],
      sizes: [],
      assetIds: [],
      productIds: [], // Add productIds array to store available product_ids
    },
  ]);

  // Processor State
  const [processorBrand, setProcessorBrand] = useState("");
  const [processorBrands, setProcessorBrands] = useState([]);
  const [processorModel, setProcessorModel] = useState("");
  const [processorModels, setProcessorModels] = useState([]);
  const [processorAssetIds, setProcessorAssetIds] = useState([]);
  const [selectedProcessorAssetId, setSelectedProcessorAssetId] = useState("");

  // Motherboard State
  const [motherboardBrand, setMotherboardBrand] = useState("");
  const [motherboardBrands, setMotherboardBrands] = useState([]);
  const [motherboardModel, setMotherboardModel] = useState("");
  const [motherboardModels, setMotherboardModels] = useState([]);
  const [motherboardAssetIds, setMotherboardAssetIds] = useState([]);
  const [selectedMotherboardAssetId, setSelectedMotherboardAssetId] =
    useState("");

  // Cabinet State
  const [cabinetBrand, setCabinetBrand] = useState("");
  const [cabinetBrands, setCabinetBrands] = useState([]);
  const [cabinetModel, setCabinetModel] = useState("");
  const [cabinetModels, setCabinetModels] = useState([]);
  const [cabinetAssetIds, setCabinetAssetIds] = useState([]);
  const [selectedCabinetAssetId, setSelectedCabinetAssetId] = useState("");

  // GPU State
  const [gpuBrand, setGpuBrand] = useState("");
  const [gpuBrands, setGpuBrands] = useState([]);
  const [gpuModel, setGpuModel] = useState("");
  const [gpuModels, setGpuModels] = useState([]);
  const [gpuAssetIds, setGpuAssetIds] = useState([]);
  const [selectedGpuAssetId, setSelectedGpuAssetId] = useState("");

  // SMPS State
  const [smpsBrand, setSmpsBrand] = useState("");
  const [smpsBrands, setSmpsBrands] = useState([]);
  const [smpsModel, setSmpsModel] = useState("");
  const [smpsModels, setSmpsModels] = useState([]);
  const [smpsWattage, setSmpsWattage] = useState("");
  const [smpsWattages, setSmpsWattages] = useState([]);
  const [smpsAssetIds, setSmpsAssetIds] = useState([]);
  const [selectedSmpsAssetId, setSelectedSmpsAssetId] = useState("");

  // Wi-Fi Router State
  const [wifiType, setWifiType] = useState("");
  const [wifiBrand, setWifiBrand] = useState("");
  const [wifiBrands, setWifiBrands] = useState([]);
  const [wifiModel, setWifiModel] = useState("");
  const [wifiModels, setWifiModels] = useState([]);
  const [wifiAssetIds, setWifiAssetIds] = useState([]);
  const [selectedWifiAssetId, setSelectedWifiAssetId] = useState("");
  const [wifiProductId, setWifiProductId] = useState("");
  // Add these to your existing Wi-Fi state variables
  const [frequencyBands, setFrequencyBands] = useState([]);
  const [selectedFrequencyBand, setSelectedFrequencyBand] = useState("");
  const [wifiStandards, setWifiStandards] = useState([]);
  const [selectedWifiStandard, setSelectedWifiStandard] = useState("");

  // Update all component states to include product_id
  const [processorProductId, setProcessorProductId] = useState("");
  const [motherboardProductId, setMotherboardProductId] = useState("");
  const [gpuProductId, setGpuProductId] = useState("");
  const [smpsProductId, setSmpsProductId] = useState("");
  const [cabinetProductId, setCabinetProductId] = useState("");

  // Generic fetch function for all components
  const fetchComponentData = async (endpointParams) => {
    try {
      const url = `${API_URL}/product-templete/products-with-assets?${endpointParams}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Return both asset_ids and product_id
      if (data && data.length > 0 && data[0].asset_ids) {
        return {
          asset_ids: data[0].asset_ids,
          product_id: data[0].product_id,
        };
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching component data:", error);
      return [];
    }
  };

  // ========== RAM MODULE FUNCTIONS ========== //
  const addRamModule = () => {
    setRamModules([
      ...ramModules,
      {
        type: "",
        brand: "",
        model: "",
        size: "",
        asset_id: "",
        brands: [],
        models: [],
        sizes: [],
        assetIds: [],
      },
    ]);
  };

  const removeRamModule = (index) => {
    if (ramModules.length > 1) {
      const updatedRamModules = [...ramModules];
      updatedRamModules.splice(index, 1);
      setRamModules(updatedRamModules);
    }
  };

  const updateRamModule = (index, field, value) => {
    const updatedRamModules = [...ramModules];
    updatedRamModules[index][field] = value;

    // Reset dependent fields when parent field changes
    if (field === "type") {
      updatedRamModules[index].brand = "";
      updatedRamModules[index].model = "";
      updatedRamModules[index].size = "";
      updatedRamModules[index].asset_id = "";
      updatedRamModules[index].brands = [];
      updatedRamModules[index].models = [];
      updatedRamModules[index].sizes = [];
      updatedRamModules[index].assetIds = [];
    } else if (field === "brand") {
      updatedRamModules[index].model = "";
      updatedRamModules[index].size = "";
      updatedRamModules[index].asset_id = "";
      updatedRamModules[index].models = [];
      updatedRamModules[index].sizes = [];
      updatedRamModules[index].assetIds = [];
    } else if (field === "model") {
      updatedRamModules[index].size = "";
      updatedRamModules[index].asset_id = "";
      updatedRamModules[index].sizes = [];
      updatedRamModules[index].assetIds = [];
    } else if (field === "size") {
      updatedRamModules[index].asset_id = "";
      updatedRamModules[index].assetIds = [];
    }

    setRamModules(updatedRamModules);
  };

  // ========== STORAGE DRIVE FUNCTIONS ========== //
  const addStorageDrive = () => {
    setStorageDrives([
      ...storageDrives,
      {
        type: "",
        brand: "",
        model: "",
        size: "",
        asset_id: "",
        brands: [],
        models: [],
        sizes: [],
        assetIds: [],
      },
    ]);
  };

  const removeStorageDrive = (index) => {
    if (storageDrives.length > 1) {
      const updatedStorageDrives = [...storageDrives];
      updatedStorageDrives.splice(index, 1);
      setStorageDrives(updatedStorageDrives);
    }
  };

  const updateStorageDrive = (index, field, value) => {
    const updatedStorageDrives = [...storageDrives];
    updatedStorageDrives[index][field] = value;

    // Reset dependent fields when parent field changes
    if (field === "type") {
      updatedStorageDrives[index].brand = "";
      updatedStorageDrives[index].model = "";
      updatedStorageDrives[index].size = "";
      updatedStorageDrives[index].asset_id = "";
      updatedStorageDrives[index].brands = [];
      updatedStorageDrives[index].models = [];
      updatedStorageDrives[index].sizes = [];
      updatedStorageDrives[index].assetIds = [];
    } else if (field === "brand") {
      updatedStorageDrives[index].model = "";
      updatedStorageDrives[index].size = "";
      updatedStorageDrives[index].asset_id = "";
      updatedStorageDrives[index].models = [];
      updatedStorageDrives[index].sizes = [];
      updatedStorageDrives[index].assetIds = [];
    } else if (field === "model") {
      updatedStorageDrives[index].size = "";
      updatedStorageDrives[index].asset_id = "";
      updatedStorageDrives[index].sizes = [];
      updatedStorageDrives[index].assetIds = [];
    } else if (field === "size") {
      updatedStorageDrives[index].asset_id = "";
      updatedStorageDrives[index].assetIds = [];
    }

    setStorageDrives(updatedStorageDrives);
  };

  // ========== DATA FETCHING EFFECTS ========== //

  // RAM Effects
  useEffect(() => {
    const fetchRamData = async () => {
      await Promise.all(
        ramModules.map(async (ram, index) => {
          if (ram.type && !ram.brands.length) {
            setLoading((prev) => ({ ...prev, brands: true }));
            const data = await fetchComponentData(
              `product_category=RAM&ramType=${ram.type}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedRamModules = [...ramModules];
            updatedRamModules[index].brands = data;
            setRamModules(updatedRamModules);
            setLoading((prev) => ({ ...prev, brands: false }));
          }

          if (ram.type && ram.brand && !ram.models.length) {
            setLoading((prev) => ({ ...prev, models: true }));
            const data = await fetchComponentData(
              `product_category=RAM&ramType=${ram.type}&brand=${ram.brand}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedRamModules = [...ramModules];
            updatedRamModules[index].models = data;
            setRamModules(updatedRamModules);
            setLoading((prev) => ({ ...prev, models: false }));
          }

          if (ram.type && ram.brand && ram.model && !ram.sizes.length) {
            setLoading((prev) => ({ ...prev, capacities: true }));
            const data = await fetchComponentData(
              `product_category=RAM&ramType=${ram.type}&brand=${ram.brand}&model=${ram.model}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedRamModules = [...ramModules];
            updatedRamModules[index].sizes = data;
            setRamModules(updatedRamModules);
            setLoading((prev) => ({ ...prev, capacities: false }));
          }

          if (
            ram.type &&
            ram.brand &&
            ram.model &&
            ram.size &&
            !ram.assetIds.length
          ) {
            setLoading((prev) => ({ ...prev, assets: true }));
            const data = await fetchComponentData(
              `product_category=RAM&ramType=${ram.type}&brand=${ram.brand}&model=${ram.model}&capacity=${ram.size}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedRamModules = [...ramModules];
            updatedRamModules[index].assetIds = data.asset_ids;
            updatedRamModules[index].product_id = data.product_id; // Store product_id
            setRamModules(updatedRamModules);
            setLoading((prev) => ({ ...prev, assets: false }));
          }
        })
      );
    };

    fetchRamData();
  }, [ramModules]);

  // Storage Effects
  useEffect(() => {
    const fetchStorageData = async () => {
      await Promise.all(
        storageDrives.map(async (drive, index) => {
          if (drive.type && !drive.brands.length) {
            setLoading((prev) => ({ ...prev, brands: true }));
            const data = await fetchComponentData(
              `product_category=${drive.type}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedStorageDrives = [...storageDrives];
            updatedStorageDrives[index].brands = data;
            setStorageDrives(updatedStorageDrives);
            setLoading((prev) => ({ ...prev, brands: false }));
          }

          if (drive.type && drive.brand && !drive.models.length) {
            setLoading((prev) => ({ ...prev, models: true }));
            const data = await fetchComponentData(
              `product_category=${drive.type}&brand=${drive.brand}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedStorageDrives = [...storageDrives];
            updatedStorageDrives[index].models = data;
            setStorageDrives(updatedStorageDrives);
            setLoading((prev) => ({ ...prev, models: false }));
          }

          if (drive.type && drive.brand && drive.model && !drive.sizes.length) {
            setLoading((prev) => ({ ...prev, capacities: true }));
            const data = await fetchComponentData(
              `product_category=${drive.type}&brand=${drive.brand}&model=${drive.model}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedStorageDrives = [...storageDrives];
            updatedStorageDrives[index].sizes = data;
            setStorageDrives(updatedStorageDrives);
            setLoading((prev) => ({ ...prev, capacities: false }));
          }

          if (
            drive.type &&
            drive.brand &&
            drive.model &&
            drive.size &&
            !drive.assetIds.length
          ) {
            setLoading((prev) => ({ ...prev, assets: true }));
            const data = await fetchComponentData(
              `product_category=${drive.type}&brand=${drive.brand}&model=${drive.model}&capacity=${drive.size}`,
              {
                headers: {
                  "Authorization": `Bearer ${userToken}`,
                },
              }
            );
            const updatedStorageDrives = [...storageDrives];
            updatedStorageDrives[index].assetIds = data.asset_ids;
            updatedStorageDrives[index].product_id = data.product_id; // Store product_id
            setStorageDrives(updatedStorageDrives);
            setLoading((prev) => ({ ...prev, assets: false }));
          }
        })
      );
    };

    fetchStorageData();
  }, [storageDrives]);

  // Processor Effects
  useEffect(() => {
    if (componentCategories.processor) {
      const fetchProcessorBrands = async () => {
        setLoading((prev) => ({ ...prev, brands: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.processor}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setProcessorBrands(data);
        setLoading((prev) => ({ ...prev, brands: false }));
      };
      fetchProcessorBrands();
    }
  }, []);

  useEffect(() => {
    if (componentCategories.processor && processorBrand) {
      const fetchProcessorModels = async () => {
        setLoading((prev) => ({ ...prev, models: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.processor}&brand=${processorBrand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setProcessorModels(data);
        setLoading((prev) => ({ ...prev, models: false }));
      };
      fetchProcessorModels();
    }
  }, [processorBrand]);

  // Processor asset IDs
  useEffect(() => {
    if (componentCategories.processor && processorBrand && processorModel) {
      const fetchProcessorAssetIds = async () => {
        setLoading((prev) => ({ ...prev, assets: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.processor}&brand=${processorBrand}&model=${processorModel}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setProcessorAssetIds(data.asset_ids);
        setProcessorProductId(data.product_id); // Store product_id
        setLoading((prev) => ({ ...prev, assets: false }));
      };
      fetchProcessorAssetIds();
    }
  }, [processorBrand, processorModel]);

  // Motherboard Effects
  useEffect(() => {
    if (componentCategories.motherboard) {
      const fetchMotherboardBrands = async () => {
        setLoading((prev) => ({ ...prev, brands: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.motherboard}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setMotherboardBrands(data);
        setLoading((prev) => ({ ...prev, brands: false }));
      };
      fetchMotherboardBrands();
    }
  }, []);

  useEffect(() => {
    if (componentCategories.motherboard && motherboardBrand) {
      const fetchMotherboardModels = async () => {
        setLoading((prev) => ({ ...prev, models: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.motherboard}&brand=${motherboardBrand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setMotherboardModels(data);
        setLoading((prev) => ({ ...prev, models: false }));
      };
      fetchMotherboardModels();
    }
  }, [motherboardBrand]);

  useEffect(() => {
    if (
      componentCategories.motherboard &&
      motherboardBrand &&
      motherboardModel
    ) {
      const fetchMotherboardAssetIds = async () => {
        setLoading((prev) => ({ ...prev, assets: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.motherboard}&brand=${motherboardBrand}&model=${motherboardModel}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setMotherboardAssetIds(data.asset_ids);
        setMotherboardProductId(data.product_id); // Store product_id
        setLoading((prev) => ({ ...prev, assets: false }));
      };
      fetchMotherboardAssetIds();
    }
  }, [motherboardBrand, motherboardModel]);

  // Cabinet Effects
  useEffect(() => {
    if (componentCategories.cabinet) {
      const fetchCabinetBrands = async () => {
        setLoading((prev) => ({ ...prev, brands: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.cabinet}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setCabinetBrands(data);
        setLoading((prev) => ({ ...prev, brands: false }));
      };
      fetchCabinetBrands();
    }
  }, []);

  useEffect(() => {
    if (componentCategories.cabinet && cabinetBrand) {
      const fetchCabinetModels = async () => {
        setLoading((prev) => ({ ...prev, models: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.cabinet}&brand=${cabinetBrand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setCabinetModels(data);
        setLoading((prev) => ({ ...prev, models: false }));
      };
      fetchCabinetModels();
    }
  }, [cabinetBrand]);

  useEffect(() => {
    if (componentCategories.cabinet && cabinetBrand && cabinetModel) {
      const fetchCabinetAssetIds = async () => {
        setLoading((prev) => ({ ...prev, assets: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.cabinet}&brand=${cabinetBrand}&model=${cabinetModel}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setCabinetAssetIds(data.asset_ids);
        setCabinetProductId(data.product_id); // Store product_id
        setLoading((prev) => ({ ...prev, assets: false }));
      };
      fetchCabinetAssetIds();
    }
  }, [cabinetBrand, cabinetModel]);

  // GPU Effects
  useEffect(() => {
    if (componentCategories.gpu) {
      const fetchGpuBrands = async () => {
        setLoading((prev) => ({ ...prev, brands: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.gpu}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setGpuBrands(data);
        setLoading((prev) => ({ ...prev, brands: false }));
      };
      fetchGpuBrands();
    }
  }, []);

  useEffect(() => {
    if (componentCategories.gpu && gpuBrand) {
      const fetchGpuModels = async () => {
        setLoading((prev) => ({ ...prev, models: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.gpu}&brand=${gpuBrand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setGpuModels(data);
        setLoading((prev) => ({ ...prev, models: false }));
      };
      fetchGpuModels();
    }
  }, [gpuBrand]);

  // GPU asset IDs
  useEffect(() => {
    if (componentCategories.gpu && gpuBrand && gpuModel) {
      const fetchGpuAssetIds = async () => {
        setLoading((prev) => ({ ...prev, assets: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.gpu}&brand=${gpuBrand}&model=${gpuModel}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setGpuAssetIds(data.asset_ids);
        setGpuProductId(data.product_id); // Store product_id
        setLoading((prev) => ({ ...prev, assets: false }));
      };
      fetchGpuAssetIds();
    }
  }, [gpuBrand, gpuModel]);
  // SMPS Effects
  useEffect(() => {
    if (componentCategories.smps) {
      const fetchSmpsBrands = async () => {
        setLoading((prev) => ({ ...prev, brands: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.smps}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setSmpsBrands(data);
        setLoading((prev) => ({ ...prev, brands: false }));
      };
      fetchSmpsBrands();
    }
  }, []);

  useEffect(() => {
    if (componentCategories.smps && smpsBrand) {
      const fetchSmpsModels = async () => {
        setLoading((prev) => ({ ...prev, models: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.smps}&brand=${smpsBrand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setSmpsModels(data);
        setLoading((prev) => ({ ...prev, models: false }));
      };
      fetchSmpsModels();
    }
  }, [smpsBrand]);

  useEffect(() => {
    if (componentCategories.smps && smpsBrand && smpsModel) {
      const fetchSmpsWattages = async () => {
        setLoading((prev) => ({ ...prev, capacities: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.smps}&brand=${smpsBrand}&model=${smpsModel}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setSmpsWattages(data);
        setLoading((prev) => ({ ...prev, capacities: false }));
      };
      fetchSmpsWattages();
    }
  }, [smpsBrand, smpsModel]);

  useEffect(() => {
    if (componentCategories.smps && smpsBrand && smpsModel && smpsWattage) {
      const fetchSmpsAssetIds = async () => {
        setLoading((prev) => ({ ...prev, assets: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.smps}&brand=${smpsBrand}&model=${smpsModel}&smps=${smpsWattage}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setSmpsAssetIds(data.asset_ids);
        setSmpsProductId(data.product_id); // Store product_id
        setLoading((prev) => ({ ...prev, assets: false }));
      };
      fetchSmpsAssetIds();
    }
  }, [smpsBrand, smpsModel, smpsWattage]);

  // Wi-Fi Router Effects
  useEffect(() => {
    if (componentCategories.wifi) {
      const fetchWifiBrands = async () => {
        setLoading((prev) => ({ ...prev, brands: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.wifi}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setWifiBrands(data);
        setLoading((prev) => ({ ...prev, brands: false }));
      };
      fetchWifiBrands();
    }
  }, []);

  useEffect(() => {
    if (componentCategories.wifi && wifiBrand) {
      const fetchWifiModels = async () => {
        setLoading((prev) => ({ ...prev, models: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.wifi}&brand=${wifiBrand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setWifiModels(data);
        setLoading((prev) => ({ ...prev, models: false }));
      };
      fetchWifiModels();
    }
  }, [wifiBrand]);

  useEffect(() => {
    if (componentCategories.wifi && wifiBrand && wifiModel) {
      const fetchWifiFrequencyBands = async () => {
        setLoading((prev) => ({ ...prev, details: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.wifi}&brand=${wifiBrand}&model=${wifiModel}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setFrequencyBands(data);
        setLoading((prev) => ({ ...prev, details: false }));
      };
      fetchWifiFrequencyBands();
    }
  }, [wifiBrand, wifiModel]);

  useEffect(() => {
    if (
      componentCategories.wifi &&
      wifiBrand &&
      wifiModel &&
      selectedFrequencyBand
    ) {
      const fetchWifiStandards = async () => {
        setLoading((prev) => ({ ...prev, details: true }));
        const data = await fetchComponentData(
          `product_category=${componentCategories.wifi}&brand=${wifiBrand}&model=${wifiModel}&frequency_band=${selectedFrequencyBand}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        setWifiStandards(data);
        setLoading((prev) => ({ ...prev, details: false }));
      };
      fetchWifiStandards();
    }
  }, [wifiBrand, wifiModel, selectedFrequencyBand]);

  useEffect(() => {
    if (
      componentCategories.wifi &&
      wifiBrand &&
      wifiModel &&
      selectedFrequencyBand &&
      selectedWifiStandard
    ) {
      const fetchWifiAssetIds = async () => {
        setLoading((prev) => ({ ...prev, assets: true }));

        const data = await fetchComponentData(
          `product_category=${componentCategories.wifi}&brand=${wifiBrand}&model=${wifiModel}&frequency_band=${selectedFrequencyBand}&wifi_standard=${selectedWifiStandard}`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );

        setWifiAssetIds(data.asset_ids);
        setWifiProductId(data.product_id); // Store product_id

        setLoading((prev) => ({ ...prev, assets: false }));
      };

      fetchWifiAssetIds();
    }
  }, [wifiBrand, wifiModel, selectedFrequencyBand, selectedWifiStandard]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.assembledDesktop) {
      showSnackbar("Enter Assembled Desktop Name is required", "error");
      return;
    }

    if (!formData.asset_id) {
      showSnackbar("Enter Asset ID is required", "error");
      return;
    }

    // Validate that at least one hardware component is selected
    const hasSelectedComponents =
      ramModules.some((ram) => ram.asset_id) ||
      storageDrives.some((drive) => drive.asset_id) ||
      selectedProcessorAssetId ||
      selectedMotherboardAssetId ||
      selectedCabinetAssetId ||
      selectedGpuAssetId ||
      selectedSmpsAssetId ||
      selectedWifiAssetId;

    if (!hasSelectedComponents) {
      showSnackbar("Please select at least one hardware component", "error");
      return;
    }

    const formDataToSend = new FormData();

    // ✅ Copy formData to handle special fields
    const formDataCopy = { ...formData };
    if (formDataCopy.product_category === "RAM") {
      formDataCopy.ram = formDataCopy.sizeGb?.toString() || "";
    }

    // Append basic fields to FormData
    Object.entries(formDataCopy).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (typeof value === "boolean") {
        formDataToSend.append(key, value ? "1" : "0");
      } else if (value instanceof File) {
        formDataToSend.append("product_image", value, value.name);
      } else {
        formDataToSend.append(key, value.toString());
      }
    });

    // ✅ Build components only if asset_id is present
    const components = {
      ram: ramModules
        .filter((ram) => ram.asset_id)
        .map((ram) => ({
          type: ram.type,
          brand: ram.brand,
          model: ram.model,
          size: ram.size,
          asset_id: ram.asset_id,
          product_id: ram.product_id,
        })),
      storage: storageDrives
        .filter((drive) => drive.asset_id)
        .map((drive) => ({
          type: drive.type,
          brand: drive.brand,
          model: drive.model,
          size: drive.size,
          asset_id: drive.asset_id,
          product_id: drive.product_id,
        })),
    };

    if (selectedProcessorAssetId) {
      components.processor = {
        brand: processorBrand,
        model: processorModel,
        asset_id: selectedProcessorAssetId,
        product_id: processorProductId,
      };
    }

    if (selectedMotherboardAssetId) {
      components.motherboard = {
        brand: motherboardBrand,
        model: motherboardModel,
        asset_id: selectedMotherboardAssetId,
        product_id: motherboardProductId,
      };
    }

    if (selectedGpuAssetId) {
      components.gpu = {
        brand: gpuBrand,
        model: gpuModel,
        asset_id: selectedGpuAssetId,
        product_id: gpuProductId,
      };
    }

    if (selectedSmpsAssetId) {
      components.smps = {
        brand: smpsBrand,
        model: smpsModel,
        wattage: smpsWattage,
        asset_id: selectedSmpsAssetId,
        product_id: smpsProductId,
      };
    }

    if (selectedCabinetAssetId) {
      components.cabinet = {
        brand: cabinetBrand,
        model: cabinetModel,
        asset_id: selectedCabinetAssetId,
        product_id: cabinetProductId,
      };
    }

    if (selectedWifiAssetId) {
      components.wifi = {
        type: wifiType,
        brand: wifiBrand,
        model: wifiModel,
        frequency_band: selectedFrequencyBand,
        wifi_standard: selectedWifiStandard,
        asset_id: selectedWifiAssetId,
        product_id: wifiProductId,
      };
    }

    // ✅ Final AssembledDesktop object
    const assembledDesktop = {
      assembled_name: formData.assembledDesktop,
      parent_asset_id: formData.asset_id,
      is_active: formData.is_active,
      components,
    };

    // ✅ Append the complex object as a JSON string
    formDataToSend.append("assembled_data", JSON.stringify(assembledDesktop));

    try {
      const response = await fetch(`${API_URL}/assembled-assets/create`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar(
          data.message || "Assembled PC created successfully!!",
          "success"
        );

        // Reset form state
        setFormData({
          assembledDesktop: "",
          asset_id: "",
          is_active: false,
          product_image: null,
        });
        setRamModules([
          {
            type: "",
            brand: "",
            model: "",
            size: "",
            asset_id: "",
            product_id: "",
            brands: [],
            models: [],
            sizes: [],
            assetIds: [],
            productIds: [],
          },
        ]);
        setStorageDrives([
          {
            type: "",
            brand: "",
            model: "",
            size: "",
            asset_id: "",
            product_id: "",
            brands: [],
            models: [],
            sizes: [],
            assetIds: [],
            productIds: [],
          },
        ]);
        setProcessorBrand("");
        setProcessorModel("");
        setSelectedProcessorAssetId("");
        setProcessorProductId("");
        setMotherboardBrand("");
        setMotherboardModel("");
        setSelectedMotherboardAssetId("");
        setMotherboardProductId("");
        setGpuBrand("");
        setGpuModel("");
        setSelectedGpuAssetId("");
        setGpuProductId("");
        setSmpsBrand("");
        setSmpsModel("");
        setSmpsWattage("");
        setSelectedSmpsAssetId("");
        setSmpsProductId("");
        setCabinetBrand("");
        setCabinetModel("");
        setSelectedCabinetAssetId("");
        setCabinetProductId("");
        setWifiType("");
        setWifiBrand("");
        setWifiModel("");
        setSelectedWifiAssetId("");
        setWifiProductId("");
        setSelectedFrequencyBand("");
        setSelectedWifiStandard("");
        setFrequencyBands([]);
        setWifiStandards([]);

        setTimeout(() => {
          navigate("/dashboard/inventory/assembled-products");
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving desktop configuration:", error);
      showSnackbar(error.message || "An unexpected error occurred", "error");
    }
  };

  return (
    <div style={styles.container}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit}>
        {/* Desktop Configuration Card */}
        <div style={styles.card}>
          <h3 style={styles.cardHeader}>
            <span style={styles.icon}>💻</span>
            Assembled Desktop & Asset Selection
          </h3>

          <div style={{ gridColumn: "1 / -1", marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Add Images</label>

            <div
              onClick={() =>
                document.getElementById("hiddenImageInput").click()
              }
              style={{
                marginTop: "5px",
                border: "2px dashed #ccc",
                borderRadius: "8px",
                height: "50px",
                width: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                color: "#888",
                fontSize: "24px",
              }}
            >
              +
            </div>

            <input
              type="file"
              id="hiddenImageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  product_image: e.target.files[0] || null,
                }))
              }
            />

            {formData.product_image && (
              <p style={{ color: "green", fontSize: "14px", marginTop: "8px" }}>
                Selected: {formData.product_image.name}
              </p>
            )}
          </div>

          <div style={styles.fieldsContainer}>
            <div style={styles.fieldWrapper}>
              <label style={styles.label}>Assembled Desktop Name</label>
              <input
                type="text"
                style={styles.input}
                value={formData.assembledDesktop}
                onChange={(e) =>
                  handleInputChange("assembledDesktop", e.target.value)
                }
                placeholder="Enter Assembled Desktop Name"
              />
            </div>
            <div style={styles.fieldWrapper}>
              <label style={styles.label}>Cabinet asset ID</label>
              <input
                type="text"
                style={styles.input}
                value={formData.asset_id}
                onChange={(e) => handleInputChange("asset_id", e.target.value)}
                placeholder="Enter Cabinet asset ID"
              />
            </div>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Hardware Configuration</h2>

        {/* RAM Selector - Now supports multiple modules */}
        <h4 style={styles.componentTitle}>
          RAM
          <button
            type="button"
            style={{ ...styles.addButton, marginLeft: "1rem" }}
            onClick={addRamModule}
          >
            + Add RAM Module
          </button>
        </h4>

        {ramModules.map((ram, index) => (
          <div key={`ram-module-${index}`} style={styles.componentItem}>
            {ramModules.length > 1 && (
              <button
                type="button"
                style={{
                  ...styles.removeButton,
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                }}
                onClick={() => removeRamModule(index)}
              >
                Remove
              </button>
            )}

            <div style={styles.gridContainer}>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Select RAM Type</label>
                <select
                  style={styles.select}
                  value={ram.type}
                  onChange={(e) =>
                    updateRamModule(index, "type", e.target.value)
                  }
                >
                  <option value="">Select RAM Type</option>
                  <option value="DDR3">DDR3</option>
                  <option value="DDR4">DDR4</option>
                  <option value="DDR5">DDR5</option>
                  <option value="LPDDR4">LPDDR4</option>
                  <option value="LPDDR5">LPDDR5</option>
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Brand</label>
                <select
                  style={styles.select}
                  value={ram.brand}
                  onChange={(e) =>
                    updateRamModule(index, "brand", e.target.value)
                  }
                  disabled={!ram.type || loading.brands}
                >
                  <option value="">
                    {loading.brands ? "Loading..." : "Select Brand"}
                  </option>
                  {ram.brands.map((brand, brandIndex) => (
                    <option
                      key={`ram-brand-${index}-${brandIndex}`}
                      value={brand}
                    >
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Model</label>
                <select
                  style={styles.select}
                  value={ram.model}
                  onChange={(e) =>
                    updateRamModule(index, "model", e.target.value)
                  }
                  disabled={!ram.brand || loading.models}
                >
                  <option value="">
                    {loading.models ? "Loading..." : "Select Model"}
                  </option>
                  {ram.models.map((model, modelIndex) => (
                    <option
                      key={`ram-model-${index}-${modelIndex}`}
                      value={model}
                    >
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Capacity</label>
                <select
                  style={styles.select}
                  value={ram.size}
                  onChange={(e) =>
                    updateRamModule(index, "size", e.target.value)
                  }
                  disabled={!ram.model || loading.capacities}
                >
                  <option value="">
                    {loading.capacities ? "Loading..." : "Select Capacity"}
                  </option>
                  {ram.sizes.map((size, sizeIndex) => (
                    <option key={`ram-size-${index}-${sizeIndex}`} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Asset ID</label>
                <select
                  style={styles.select}
                  value={ram.asset_id}
                  onChange={(e) =>
                    updateRamModule(index, "asset_id", e.target.value)
                  }
                  disabled={ram.assetIds.length === 0 || loading.assets}
                >
                  <option value="">
                    {loading.assets
                      ? "Loading..."
                      : ram.assetIds.length
                      ? "Select Asset ID"
                      : "Select options first"}
                  </option>
                  {ram.assetIds.map((asset_id, assetIndex) => (
                    <option
                      key={`ram-asset-${index}-${assetIndex}`}
                      value={asset_id}
                    >
                      {asset_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Storage Drive Selector - Now supports multiple drives */}
        <h4 style={styles.componentTitle}>
          Storage Drives
          <button
            type="button"
            style={{ ...styles.addButton, marginLeft: "1rem" }}
            onClick={addStorageDrive}
          >
            + Add Storage Drive
          </button>
        </h4>

        {storageDrives.map((drive, index) => (
          <div key={`storage-drive-${index}`} style={styles.componentItem}>
            {storageDrives.length > 1 && (
              <button
                type="button"
                style={{
                  ...styles.removeButton,
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                }}
                onClick={() => removeStorageDrive(index)}
              >
                Remove
              </button>
            )}

            <div style={styles.gridContainer}>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Select Category</label>
                <select
                  style={styles.select}
                  value={drive.type}
                  onChange={(e) =>
                    updateStorageDrive(index, "type", e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {componentCategories.storage.map((type, typeIndex) => (
                    <option
                      key={`storage-type-${index}-${typeIndex}`}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Brand</label>
                <select
                  style={styles.select}
                  value={drive.brand}
                  onChange={(e) =>
                    updateStorageDrive(index, "brand", e.target.value)
                  }
                  disabled={!drive.type || loading.brands}
                >
                  <option value="">
                    {loading.brands ? "Loading..." : "Select Brand"}
                  </option>
                  {drive.brands.map((brand, brandIndex) => (
                    <option
                      key={`storage-brand-${index}-${brandIndex}`}
                      value={brand}
                    >
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Model</label>
                <select
                  style={styles.select}
                  value={drive.model}
                  onChange={(e) =>
                    updateStorageDrive(index, "model", e.target.value)
                  }
                  disabled={!drive.brand || loading.models}
                >
                  <option value="">
                    {loading.models ? "Loading..." : "Select Model"}
                  </option>
                  {drive.models.map((model, modelIndex) => (
                    <option
                      key={`storage-model-${index}-${modelIndex}`}
                      value={model}
                    >
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Capacity</label>
                <select
                  style={styles.select}
                  value={drive.size}
                  onChange={(e) =>
                    updateStorageDrive(index, "size", e.target.value)
                  }
                  disabled={!drive.model || loading.capacities}
                >
                  <option value="">
                    {loading.capacities ? "Loading..." : "Select Capacity"}
                  </option>
                  {drive.sizes.map((size, sizeIndex) => (
                    <option
                      key={`storage-size-${index}-${sizeIndex}`}
                      value={size}
                    >
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrapper}>
                <label style={styles.label}>Asset ID</label>
                <select
                  style={styles.select}
                  value={drive.asset_id}
                  onChange={(e) =>
                    updateStorageDrive(index, "asset_id", e.target.value)
                  }
                  disabled={drive.assetIds.length === 0 || loading.assets}
                >
                  <option value="">
                    {loading.assets
                      ? "Loading..."
                      : drive.assetIds.length
                      ? "Select Asset ID"
                      : "Select options first"}
                  </option>
                  {drive.assetIds.map((asset_id, assetIndex) => (
                    <option
                      key={`storage-asset-${index}-${assetIndex}`}
                      value={asset_id}
                    >
                      {asset_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Processor Selector */}
        <h4 style={styles.componentTitle}> Processor</h4>
        <div style={styles.gridContainer}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Select Categories</label>
            <select
              style={styles.select}
              value={componentCategories.processor}
              disabled
            >
              <option value="">Select Categories</option>
              <option value={componentCategories.processor}>
                {componentCategories.processor}
              </option>
            </select>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Brand</label>
            <select
              style={styles.select}
              value={processorBrand}
              onChange={(e) => {
                setProcessorBrand(e.target.value);
              }}
              disabled={loading.brands}
            >
              <option value="">
                {loading.brands ? "Loading..." : "Select Brand"}
              </option>
              {processorBrands.map((brand, index) => (
                <option key={`processor-brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={processorModel}
              onChange={(e) => {
                setProcessorModel(e.target.value);
              }}
              disabled={!processorBrand || loading.models}
            >
              <option value="">
                {loading.models ? "Loading..." : "Select Model"}
              </option>
              {processorModels.map((model, index) => (
                <option key={`processor-model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Asset ID</label>
            <select
              style={styles.select}
              value={selectedProcessorAssetId}
              onChange={(e) => setSelectedProcessorAssetId(e.target.value)}
              disabled={processorAssetIds.length === 0 || loading.assets}
            >
              <option value="">
                {loading.assets
                  ? "Loading..."
                  : processorAssetIds.length
                  ? "Select Asset ID"
                  : "Select options first"}
              </option>
              {processorAssetIds.map((asset_id, index) => (
                <option key={`processor-asset-${index}`} value={asset_id}>
                  {asset_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Motherboard Selector */}
        <h4 style={styles.componentTitle}>Motherboard</h4>
        <div style={styles.gridContainer}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Select Categories</label>
            <select
              style={styles.select}
              value={componentCategories.motherboard}
              disabled
            >
              <option value="">Select Categories</option>
              <option value={componentCategories.motherboard}>
                {componentCategories.motherboard}
              </option>
            </select>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Brand</label>
            <select
              style={styles.select}
              value={motherboardBrand}
              onChange={(e) => {
                setMotherboardBrand(e.target.value);
              }}
              disabled={loading.brands}
            >
              <option value="">
                {loading.brands ? "Loading..." : "Select Brand"}
              </option>
              {motherboardBrands.map((brand, index) => (
                <option key={`motherboard-brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={motherboardModel}
              onChange={(e) => {
                setMotherboardModel(e.target.value);
              }}
              disabled={!motherboardBrand || loading.models}
            >
              <option value="">
                {loading.models ? "Loading..." : "Select Model"}
              </option>
              {motherboardModels.map((model, index) => (
                <option key={`motherboard-model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Asset ID</label>
            <select
              style={styles.select}
              value={selectedMotherboardAssetId}
              onChange={(e) => setSelectedMotherboardAssetId(e.target.value)}
              disabled={motherboardAssetIds.length === 0 || loading.assets}
            >
              <option value="">
                {loading.assets
                  ? "Loading..."
                  : motherboardAssetIds.length
                  ? "Select Asset ID"
                  : "Select options first"}
              </option>
              {motherboardAssetIds.map((asset_id, index) => (
                <option key={`motherboard-asset-${index}`} value={asset_id}>
                  {asset_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cabinet Selector */}
        <h4 style={styles.componentTitle}>Cabinet</h4>
        <div style={styles.gridContainer}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Select Categories</label>
            <select
              style={styles.select}
              value={componentCategories.cabinet}
              disabled
            >
              <option value="">Select Categories</option>
              <option value={componentCategories.cabinet}>
                {componentCategories.cabinet}
              </option>
            </select>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Brand</label>
            <select
              style={styles.select}
              value={cabinetBrand}
              onChange={(e) => {
                setCabinetBrand(e.target.value);
              }}
              disabled={loading.brands}
            >
              <option value="">
                {loading.brands ? "Loading..." : "Select Brand"}
              </option>
              {cabinetBrands.map((brand, index) => (
                <option key={`cabinet-brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={cabinetModel}
              onChange={(e) => {
                setCabinetModel(e.target.value);
              }}
              disabled={!cabinetBrand || loading.models}
            >
              <option value="">
                {loading.models ? "Loading..." : "Select Model"}
              </option>
              {cabinetModels.map((model, index) => (
                <option key={`cabinet-model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Asset ID</label>
            <select
              style={styles.select}
              value={selectedCabinetAssetId}
              onChange={(e) => setSelectedCabinetAssetId(e.target.value)}
              disabled={cabinetAssetIds.length === 0 || loading.assets}
            >
              <option value="">
                {loading.assets
                  ? "Loading..."
                  : cabinetAssetIds.length
                  ? "Select Asset ID"
                  : "Select options first"}
              </option>
              {cabinetAssetIds.map((asset_id, index) => (
                <option key={`cabinet-asset-${index}`} value={asset_id}>
                  {asset_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GPU Selector */}
        <h4 style={styles.componentTitle}>Graphics Card</h4>
        <div style={styles.gridContainer}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Select Categories</label>
            <select
              style={styles.select}
              value={componentCategories.gpu}
              disabled
            >
              <option value="">Select Categories</option>
              <option value={componentCategories.gpu}>
                {componentCategories.gpu}
              </option>
            </select>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Brand</label>
            <select
              style={styles.select}
              value={gpuBrand}
              onChange={(e) => {
                setGpuBrand(e.target.value);
              }}
              disabled={loading.brands}
            >
              <option value="">
                {loading.brands ? "Loading..." : "Select Brand"}
              </option>
              {gpuBrands.map((brand, index) => (
                <option key={`gpu-brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={gpuModel}
              onChange={(e) => {
                setGpuModel(e.target.value);
              }}
              disabled={!gpuBrand || loading.models}
            >
              <option value="">
                {loading.models ? "Loading..." : "Select Model"}
              </option>
              {gpuModels.map((model, index) => (
                <option key={`gpu-model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Asset ID</label>
            <select
              style={styles.select}
              value={selectedGpuAssetId}
              onChange={(e) => setSelectedGpuAssetId(e.target.value)}
              disabled={gpuAssetIds.length === 0 || loading.assets}
            >
              <option value="">
                {loading.assets
                  ? "Loading..."
                  : gpuAssetIds.length
                  ? "Select Asset ID"
                  : "Select options first"}
              </option>
              {gpuAssetIds.map((asset_id, index) => (
                <option key={`gpu-asset-${index}`} value={asset_id}>
                  {asset_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SMPS Selector */}
        <h4 style={styles.componentTitle}>Power Supply</h4>
        <div style={styles.gridContainer}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Select Categories</label>
            <select
              style={styles.select}
              value={componentCategories.smps}
              disabled
            >
              <option value="">Select Categories</option>
              <option value={componentCategories.smps}>
                {componentCategories.smps}
              </option>
            </select>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Brand</label>
            <select
              style={styles.select}
              value={smpsBrand}
              onChange={(e) => {
                setSmpsBrand(e.target.value);
              }}
              disabled={loading.brands}
            >
              <option value="">
                {loading.brands ? "Loading..." : "Select Brand"}
              </option>
              {smpsBrands.map((brand, index) => (
                <option key={`smps-brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={smpsModel}
              onChange={(e) => {
                setSmpsModel(e.target.value);
              }}
              disabled={!smpsBrand || loading.models}
            >
              <option value="">
                {loading.models ? "Loading..." : "Select Model"}
              </option>
              {smpsModels.map((model, index) => (
                <option key={`smps-model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Wattage</label>
            <select
              style={styles.select}
              value={smpsWattage}
              onChange={(e) => {
                setSmpsWattage(e.target.value);
              }}
              disabled={!smpsModel || loading.capacities}
            >
              <option value="">
                {loading.capacities ? "Loading..." : "Select Wattage"}
              </option>
              {smpsWattages.map((wattage, index) => (
                <option key={`smps-wattage-${index}`} value={wattage}>
                  {wattage}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Asset ID</label>
            <select
              style={styles.select}
              value={selectedSmpsAssetId}
              onChange={(e) => setSelectedSmpsAssetId(e.target.value)}
              disabled={smpsAssetIds.length === 0 || loading.assets}
            >
              <option value="">
                {loading.assets
                  ? "Loading..."
                  : smpsAssetIds.length
                  ? "Select Asset ID"
                  : "Select options first"}
              </option>
              {smpsAssetIds.map((asset_id, index) => (
                <option key={`smps-asset-${index}`} value={asset_id}>
                  {asset_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wi-Fi Selector */}
        <h4 style={styles.componentTitle}>Wi-Fi Router</h4>
        <div style={styles.gridContainer}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Select Categories</label>
            <select
              style={styles.select}
              value={wifiType}
              onChange={(e) => {
                setWifiType(e.target.value);
              }}
            >
              <option value="">Select Categories</option>
              <option value="Wi-Fi">Wi-Fi</option>
            </select>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Brand</label>
            <select
              style={styles.select}
              value={wifiBrand}
              onChange={(e) => {
                setWifiBrand(e.target.value);
              }}
              disabled={!wifiType || loading.brands}
            >
              <option value="">
                {loading.brands ? "Loading..." : "Select Brand"}
              </option>
              {wifiBrands.map((brand, index) => (
                <option key={`wifi-brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={wifiModel}
              onChange={(e) => {
                setWifiModel(e.target.value);
              }}
              disabled={!wifiBrand || loading.models}
            >
              <option value="">
                {loading.models ? "Loading..." : "Select Model"}
              </option>
              {wifiModels.map((model, index) => (
                <option key={`wifi-model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Frequency Band</label>
            <select
              style={styles.select}
              value={selectedFrequencyBand}
              onChange={(e) => setSelectedFrequencyBand(e.target.value)}
              disabled={
                !wifiModel || frequencyBands.length === 0 || loading.details
              }
            >
              <option value="">
                {loading.details
                  ? "Loading..."
                  : frequencyBands.length
                  ? "Select Frequency Band"
                  : "Select model first"}
              </option>
              {frequencyBands.map((band, index) => (
                <option key={`wifi-band-${index}`} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>

          {/* WiFi Standard Selector */}
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>WiFi Standard</label>
            <select
              style={styles.select}
              value={selectedWifiStandard}
              onChange={(e) => setSelectedWifiStandard(e.target.value)}
              disabled={
                !wifiModel || wifiStandards.length === 0 || loading.details
              }
            >
              <option value="">
                {loading.details
                  ? "Loading..."
                  : wifiStandards.length
                  ? "Select WiFi Standard"
                  : "Select model first"}
              </option>
              {wifiStandards.map((standard, index) => (
                <option key={`wifi-standard-${index}`} value={standard}>
                  {standard}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Asset ID</label>
            <select
              style={styles.select}
              value={selectedWifiAssetId}
              onChange={(e) => setSelectedWifiAssetId(e.target.value)}
              disabled={wifiAssetIds.length === 0 || loading.assets}
            >
              <option value="">
                {loading.assets
                  ? "Loading..."
                  : wifiAssetIds.length
                  ? "Select Asset ID"
                  : "Select options first"}
              </option>
              {wifiAssetIds.map((asset_id, index) => (
                <option key={`wifi-asset-${index}`} value={asset_id}>
                  {asset_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* <div style={{ marginTop: "2rem" }}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🎛️</div>
              <h3 style={cardHeaderStyle}>Control</h3>
            </div>
            <CheckboxField
              label="Active Status"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              required
            />
          </div> */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={styles.button}>Save Configuration</button>
        </div>
      </form>
    </div>
  );
};

export default HardwareSelector;
