import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const InvoicesTablePage = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  //---------------------------------------------
  // FETCH
  //---------------------------------------------

  useEffect(() => {
    fetchInvoices();
  }, [page, search]);

  const fetchInvoices = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/invoices?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { invoices, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      const formatted = invoices.map((item, index) => ({
        ...item,

        s_id: (page - 1) * 10 + index + 1,


        status: item.approval_status === "Approved" ? "Active" : "Inactive",

        transaction_type:
          item.transaction_type === "Buy"
            ? "Sale"
            : item.transaction_type,

        payment_mode:
          item.payment_mode === "" ? "Sale" : item.payment_mode,

      }));

      setData(formatted);

    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  //---------------------------------------------
  // RESET PAGE WHEN SEARCH
  //---------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //---------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "invoice_number", label: "Invoice Number" },
    { id: "customer_name", label: "Customer Name" },
    { id: "invoice_date", label: "Invoice Date" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_mode", label: "Payment Type" },
    { id: "phone_number", label: "Phone No" },
  ];

  //---------------------------------------------

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Invoices List</h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchInvoices}
      />
    </div>
  );
};

export default InvoicesTablePage;
