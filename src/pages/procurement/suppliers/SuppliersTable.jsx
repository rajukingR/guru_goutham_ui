import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const SuppliersTable = () => {

  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //--------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "supplier_name", label: "Supplier Name" },
    { id: "supplier_owner", label: "Owner" },
    { id: "gst_number", label: "GST No." },
    { id: "pan_number", label: "PAN No." },
    { id: "address_summary", label: "Address" },
    { id: "bank_summary", label: "Bank Details" },
  ];

  //--------------------------------

  const fetchSuppliers = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/supplier?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //--------------------------------

      const formatted = response.data.data.map((supplier, index) => {

        const address = supplier.address
          ? `${supplier.address.address_line1}, ${supplier.address.city}, ${supplier.address.state}, ${supplier.address.pincode}`
          : "N/A";

        const bank = supplier.bank
          ? `${supplier.bank.bank_name}, A/C: ${supplier.bank.account_number}`
          : "N/A";

        return {
          ...supplier,

          s_id: (page - 1) * 10 + index + 1,

          address_summary: address,
          bank_summary: bank,
          pan_number: supplier.bank?.pan_number || "N/A",

          status: supplier.is_active ? "Active" : "Inactive",
        };
      });

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  //--------------------------------

  useEffect(() => {
    fetchSuppliers();
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
        refreshData={fetchSuppliers}
      />
    </div>
  );
};

export default SuppliersTable;
