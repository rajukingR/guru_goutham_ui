import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ProductCategoriesPage = () => {
   const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const [data, setData] = useState([]);

  const columns = [
    { id: "s_no", label: "S.No." },
    // { id: "category_number", label: "Category Number" },
    { id: "category_name", label: "Category Name" },
    { id: "description", label: "Description" },
    // { id: "status", label: "Status" }, // Status column
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/product-categories`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_no: index + 1,
            ...item,
            status: item.is_active ? "Active" : "Inactive",
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default ProductCategoriesPage;
