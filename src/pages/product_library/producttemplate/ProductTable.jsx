import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
const IMAGE_API_URL = "http://localhost:5000/uploads";

const ProductTable = () => {
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
    { id: "stock_location", label: "Stock Location" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
    { id: "rent_price_per_day", label: "Rent/Day (₹)" },
    { id: "rent_price_per_month", label: "Rent/Month (₹)" },
    { id: "rent_price_6_months", label: "Rent/6 Months (₹)" },
    { id: "rent_price_1_year", label: "Rent/Year (₹)" },
  ];

  const formatCurrency = (value) => {
    if (!value) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBoolean = (value) => (value ? "Yes" : "No");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product-templete`);

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_no: index + 1,
            ...item,
            product_image: item.product_image ? (
              <img
                src={`${IMAGE_API_URL}/${item.product_image}`}
                alt={item.product_name}
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
            ) : (
              "No Image"
            ),

            specifications: `
              RAM: ${item.ram || "N/A"}, 
              Storage: ${item.storage || "N/A"}, 
              Disk: ${item.disk_type || "N/A"}, 
              Processor: ${item.processor || "N/A"}, 
              Graphics: ${item.graphics || "N/A"}, 
              OS: ${item.os || "N/A"}, 
              Mouse: ${formatBoolean(item.mouse)}, 
              Keyboard: ${formatBoolean(item.keyboard)}, 
              Speaker: ${formatBoolean(item.speaker)}, 
              Webcam: ${formatBoolean(item.webcam)}, 
              DVD: ${formatBoolean(item.dvd)}
            `
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
