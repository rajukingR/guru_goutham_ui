import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const POQuotationTable = () => {

  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //-------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "purchase_quotation_id", label: "Quotation ID" },
    { id: "purchase_request_id", label: "Purchase Request ID" },
    { id: "purchase_quotation_date", label: "Quotation Date" },
    { id: "supplier_name", label: "Supplier Name" },
    { id: "po_quotation_status", label: "Status" },
  ];

  //-------------------------------------

  const fetchQuotations = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/purchase-quotation?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //---------------------------------

      const formatted = response.data.data.map((item, index) => ({
        ...item,

        s_id: (page - 1) * 10 + index + 1,

        supplier_name: item.supplier?.supplier_name || "N/A",
      }));

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching purchase quotations:", error);
    }
  };

  //-------------------------------------

  useEffect(() => {
    fetchQuotations();
  }, [page, search]);

  //-------------------------------------

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
        refreshData={fetchQuotations}
      />
    </div>
  );
};

export default POQuotationTable;
