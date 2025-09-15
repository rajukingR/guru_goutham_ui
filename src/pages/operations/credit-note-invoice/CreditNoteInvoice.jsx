import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

const CreditNoteInvoice = () => {
  const [data, setData] = useState([]);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    // { id: "credit_note_number", label: "Credit Note No." },
    { id: "dispatch_order_number", label: "Order Number" },
    { id: "returned_date", label: "Returned Date" },

    { id: "customer_name", label: "Customer Name" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },

    //     { id: "industry", label: "Industry" },

    // { id: "pan", label: "PAN" },
    { id: "email", label: "Email" },
    { id: "pincode", label: "Pincode" },
  ];

  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/credit-notes`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (response.status === 200) {
          const filteredData = response.data
            // Keep only non-Postpaid
            .filter((item) => item.payment_type !== "Postpaid")
            // Only keep if returned_date vs invoice_start_date are same month OR exactly 1 month apart
            .filter((item) => {
              if (!item.returned_date || !item.invoice?.invoice_start_date)
                return false;

              const returned = new Date(item.returned_date);
              const invoiceStart = new Date(item.invoice.invoice_start_date);

              const yearDiff =
                returned.getFullYear() - invoiceStart.getFullYear();
              const monthDiff =
                yearDiff * 12 + (returned.getMonth() - invoiceStart.getMonth());

              return monthDiff === 0 || monthDiff === 1;
            })
            .map((item, index) => ({
              s_id: index + 1,
              ...item,
            }));

          setData(filteredData);
        }
      } catch (error) {
        console.error("Failed to fetch credit notes:", error);
      }
    };

    fetchCreditNotes();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Credit Note Invoices</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default CreditNoteInvoice;
