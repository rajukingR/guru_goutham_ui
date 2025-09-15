import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import DefaultImage from "../../../assets/logos/default.jpg";
import { useSelector } from "react-redux";

const ProductTable = () => {

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const [data, setData] = useState([]);

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "product_id", label: "Product ID" },
    { id: "product_name", label: "Product Name" },
    { id: "brand", label: "Brand" },
    { id: "specifications", label: "Specifications" },
    { id: "model", label: "Model" },
    { id: "product_category", label: "Category" },
  ];

  const formatCurrency = (value) => {
    if (!value) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Function to generate specifications based on product category
  const generateSpecifications = (item) => {
    const { product_category } = item;
    
    switch(product_category) {
      case "Laptops":
        return `
          RAM: ${item.ram || "N/A"}, 
          Storage: ${item.storage || "N/A"}, 
          Disk: ${item.disk_type || "N/A"}, 
          Processor: ${item.processor_model || item.processor || "N/A"} ${item.generation || ""}, 
          Graphics: ${item.graphics || "N/A"}, 
          OS: ${item.os || "N/A"},
          Screen: ${item.display_size || item.screen_size || "N/A"}
        `;
      
      case "Assembled PC":
        return `
          RAM: ${item.ram || "N/A"},
          Processor: ${item.processor || "N/A"},
          RAM Type: ${item.ramType || "N/A"}
        `;
      
      case "Monitors":
        return `
          Size: ${item.screen_size || item.display_size || "N/A"},
          Resolution: ${item.resolution || "N/A"},
          Brightness: ${item.brightness || "N/A"}
        `;
      
      case "Processor":
        return `
          Model: ${item.model || "N/A"},
          Generation: ${item.generation || "N/A"},
          Speed: ${item.speed || item.processor_speed || "N/A"}
        `;
      
      case "RAM":
        return `
          Size: ${item.ram || item.sizeGb || "N/A"},
          Type: ${item.ramType || "N/A"},
          Speed: ${item.speed || item.ram_speed || "N/A"}
        `;
      
      case "SSD":
        return `
          Capacity: ${item.capacity || item.storage || "N/A"},
          Type: ${item.ssd_type || item.disk_type || "N/A"},
          Speed: ${item.speed || "N/A"}
        `;
      
      case "HDD":
        return `
          Capacity: ${item.capacity || item.storage || "N/A"},
          Speed: ${item.speed || "N/A"}
        `;
      
      case "Mother Board":
        return `
          Model: ${item.model || "N/A"},
          Chipset: ${item.pro_model || "N/A"}
        `;
      
      case "Cabinet":
        return `
          Model: ${item.model || "N/A"},
          Form Factor: ${item.cabinet || "N/A"}
        `;
      
      case "SMPS":
        return `
          Wattage: ${item.smps || "N/A"}
        `;
      
      case "GPU":
        return `
          Model: ${item.model || "N/A"},
          Memory: ${item.capacity || "N/A"}
        `;
      
      case "Keyboard-Mouse-Combo":
        return `
          Includes Mouse: ${item.mouse ? "Yes" : "No"},
          Includes Keyboard: ${item.keyboard ? "Yes" : "No"}
        `;
      
      case "Wi-Fi":
        return `
          Standard: ${item.wifi_standard || "N/A"},
          Frequency: ${item.frequency_band || item.frequencyMhz || "N/A"}
        `;
      
      case "Printer":
        return `
          Type: ${item.model || "N/A"}
        `;
      
      case "Projector":
        return `
          Model: ${item.model || "N/A"},
          Resolution: ${item.resolution || "N/A"}
        `;
      
      default:
        return `
          RAM: ${item.ram || "N/A"}, 
          Storage: ${item.storage || "N/A"}, 
          Processor: ${item.processor || "N/A"}
        `;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/product-templete`, {
           headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data
            .filter((item) => item.brand !== "Default Brand")
            .map((item, index) => ({
              s_no: index + 1,
              ...item,
              product_image: (
                <img
                  src={
                    item.product_image
                      ? `${IMAGE_API_URL}/${item.product_image}`
                      : DefaultImage
                  }
                  alt={item.product_name}
                  style={{
                    width: "65px",
                    height: "65px",
                    objectFit: "contain",
                    border: "2px solid rgb(13, 18, 24)",
                    borderRadius: "6px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultImage;
                  }}
                />
              ),
              specifications: generateSpecifications(item)
                .trim()
                .replace(/\s+/g, " "),
              purchase_price: formatCurrency(item.purchase_price),
              rent_price_per_day: formatCurrency(item.rent_price_per_day),
              rent_price_per_month: formatCurrency(item.rent_price_per_month),
              rent_price_6_months: formatCurrency(item.rent_price_6_months),
              rent_price_1_year: formatCurrency(item.rent_price_1_year),
              status: item.is_active ? "Active" : "Inactive",
            }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default ProductTable;