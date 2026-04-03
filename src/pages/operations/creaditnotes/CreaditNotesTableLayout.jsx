import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const CreditNotesTableLayout = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  //--------------------------------------------------
  // FETCH
  //--------------------------------------------------

  useEffect(() => {
    fetchCreditNotes();
  }, [page, search]);

  const fetchCreditNotes = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/credit-notes?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Cache-Control": "no-cache"
          },
        }
      );

      const { creditNotes, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      //------------------------------------------------
      // KEEP YOUR FILTER LOGIC (AS YOU REQUESTED)
      //------------------------------------------------

      const formatted = creditNotes
        .filter(
          (item) =>
            item.transaction_type !== "Asset Swap" &&
            item.transaction_type !== "Asset Removed"
        )
        .map((item, index) => ({
          s_id: (page - 1) * 10 + index + 1,
          ...item,
        }));

      setData(formatted);

    } catch (error) {
      console.error("Failed to fetch credit notes:", error);
    }
  };

  //--------------------------------------------------
  // RESET PAGE WHEN SEARCH
  //--------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //--------------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "dispatch_order_number", label: "Order Number" },
    { id: "returned_date", label: "Returned Date" },
    { id: "customer_name", label: "Customer Name" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },
  ];

  //--------------------------------------------------

  return (
    <div>

      <h2 style={{ marginBottom: "10px" }}>
        Goods return notes
      </h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchCreditNotes}
      />

    </div>
  );
};

export default CreditNotesTableLayout;
