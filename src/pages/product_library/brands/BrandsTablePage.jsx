import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url"; // assuming IMAGE_API_URL is defined

const BrandsTablePage = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "brand_number", label: "Brand Number" },
    { id: "brand_name", label: "Brand Name" },
    { id: "brand_description", label: "Description" },
  ];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_URL}/product-brands`);

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_no: index + 1,
            ...item,
            status: item.active_status ? "Active" : "Inactive",
          }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default BrandsTablePage;
