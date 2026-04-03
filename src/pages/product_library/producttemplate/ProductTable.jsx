import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import DefaultImage from "../../../assets/logos/default.jpg";
import { useSelector } from "react-redux";
import { generateSpecifications } from "../../../utils/generateSpecifications";

const ProductTable = () => {

  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //----------------------------------

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

  //----------------------------------

  const fetchProducts = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/product-templete?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = response.data.data.map((item, index) => ({
        ...item,

        s_no: (page - 1) * 10 + index + 1,

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
              border: "2px solid gray",
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

        status: item.is_active ? "Active" : "Inactive",
      }));

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  //----------------------------------

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  //----------------------------------

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchProducts}
      />
    </div>
  );
};

export default ProductTable;
