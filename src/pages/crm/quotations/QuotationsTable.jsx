import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const QuotationsTable = () => {

  const [data, setData] = useState([]);

  //------------------------------------------------
  // PAGINATION
  //------------------------------------------------

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);

  //------------------------------------------------
  // FETCH
  //------------------------------------------------

  useEffect(() => {
    fetchQuotations();
  }, [page, search]);

  const fetchQuotations = async () => {
    try {

      const res = await axios.get(
        `${API_URL}/quotations?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { quotations, pagination } = res.data;

      setTotalPages(pagination.totalPages);

      //------------------------------------------------
      // FORMAT
      //------------------------------------------------

      const formatted = quotations.map((item, index) => ({

        ...item,

        s_id: (page - 1) * 10 + index + 1,

        quotation_id: item.quotation_id || "-",

        full_name:
          `${item.customer_first_name || ""} ${item.customer_last_name || ""}`,

        quotation_date: item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-IN")
          : "-",

        transaction_type:
          item.transaction_type === "Buy"
            ? "Sale"
            : item.transaction_type || "-",

        payment_type:
          item.payment_type || "Sale",

        status: item.status || "-"

      }));

      setData(formatted);

    } catch (error) {
      console.error("Quotation fetch error:", error);
    }
  };

  //------------------------------------------------
  // RESET PAGE WHEN SEARCH
  //------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //------------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "quotation_id", label: "Quotation ID" },
    { id: "full_name", label: "Client Name" },
    { id: "quotation_date", label: "Quotation Date" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },
    { id: "status", label: "Status" },
  ];

  //------------------------------------------------

  return (
    <div>

      <h2 style={{ marginBottom: "10px" }}>
        Quotations List
      </h2>

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

export default QuotationsTable;
