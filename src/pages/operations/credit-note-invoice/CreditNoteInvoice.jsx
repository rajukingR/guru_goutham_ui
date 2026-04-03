import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const CreditNoteInvoice = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "dispatch_order_number", label: "Order Number" },
    { id: "returned_date", label: "Returned Date" },
    { id: "customer_name", label: "Customer Name" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },
    { id: "pincode", label: "Pincode" },
  ];

  //---------------------------------------------
  // FETCH CREDIT NOTES
  //---------------------------------------------

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
          },
        }
      );

      const { creditNotes, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      //------------------------------------------------
      // KEEP YOUR LOGIC EXACTLY SAME
      //------------------------------------------------

      const filteredData = creditNotes
        .filter((item) => item.payment_type !== "Postpaid")

        .filter((item) => {
          if (!item.returned_date || !item.invoice?.invoice_start_date)
            return false;

          const returned = new Date(item.returned_date);
          const invoiceStart = new Date(item.invoice.invoice_start_date);

          const yearDiff =
            returned.getFullYear() - invoiceStart.getFullYear();

          const monthDiff =
            yearDiff * 12 + (returned.getMonth() - invoiceStart.getMonth());

          return monthDiff === 0 || monthDiff >= 1;
        })

        .map((item, index) => ({
          s_id: (page - 1) * 10 + index + 1,
          ...item,
        }));

      setData(filteredData);

    } catch (error) {
      console.error("Failed to fetch credit notes:", error);
    }
  };

  //---------------------------------------------
  // RESET PAGE WHEN SEARCH
  //---------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //---------------------------------------------

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Credit Note Invoices</h2>

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

export default CreditNoteInvoice;
