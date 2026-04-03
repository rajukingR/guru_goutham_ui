import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../api/Api_url";
import { useSelector } from "react-redux";
import { generateSpecifications } from "../../utils/generateSpecifications";
import DefaultImage from "../../assets/logos/default.jpg";

const InventoryTable = () => {

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  //------------------------------------------------
  // FETCH INVENTORY
  //------------------------------------------------

  useEffect(() => {
    fetchInventory();
  }, [page, search]);


  const fetchInventory = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/goods-receipts/approved-receipt-products?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { products, summary, pagination } = response.data;

      setSummary(summary);
      setTotalPages(pagination.totalPages);

      //------------------------------------------------
      // FORMAT DATA
      //------------------------------------------------

      const formattedData = products.map((item, index) => {

        const p = item.product || {};

        const specifications = generateSpecifications(p)
          .trim()
          .replace(/\s+/g, " ");

        return {

          id: (page - 1) * 10 + index + 1,

          product_image: (
            <img
              src={`${IMAGE_API_URL}/${p.product_image}`}
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

          name: p.product_name || "",
          product_category: p.product_category || "",
          specifications,

          total_quantity: item.total_quantity || 0,
          available_quantity: item.available_quantity || 0,
          rented_qty: item.used_quantity || 0,
          buy_qty: 0,

          purchase_price: `₹${Number(
            item.purchase_price || 0
          ).toLocaleString("en-IN")}`,
        };
      });

      setData(formattedData);

    } catch (error) {
      console.error("Inventory Error:", error);
    }
  };



  useEffect(() => {
    setPage(1);
  }, [search]);


  const columns = [
    { id: "id", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "name", label: "Product Name" },
    { id: "product_category", label: "Product Category" },
    { id: "specifications", label: "Specifications" },
    { id: "total_quantity", label: "Total Quantity" },
    { id: "available_quantity", label: "Available Quantity" },
    { id: "rented_qty", label: "Rented Quantity" },
    { id: "buy_qty", label: "Sold Quantity" },
    { id: "purchase_price", label: "Purchase Price (₹)" },
  ];

  //------------------------------------------------

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
        refreshData={fetchInventory}
      />

    </div>
  );
};

export default InventoryTable;
