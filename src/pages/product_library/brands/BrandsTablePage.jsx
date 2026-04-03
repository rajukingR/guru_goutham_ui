import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const BrandsTablePage = () => {

  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //--------------------------------

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "brand_number", label: "Brand Number" },
    { id: "brand_name", label: "Brand Name" },
    { id: "brand_description", label: "Description" },
  ];

  //--------------------------------

  const fetchBrands = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/product-brands?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = response.data.data.map((item, index) => ({
        ...item,

        // ✅ Correct serial number across pages
        s_no: (page - 1) * 10 + index + 1,

        status: item.is_active ? "Active" : "Inactive",
      }));

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  //--------------------------------

  useEffect(() => {
    fetchBrands();
  }, [page, search]);

  //--------------------------------

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
        refreshData={fetchBrands}
      />
    </div>
  );
};

export default BrandsTablePage;
