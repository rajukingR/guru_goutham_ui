import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";

const CreditNotesTableLayout = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "credit_note_number", label: "Credit Note No." },
    { id: "customer_name", label: "Customer Name" },
    { id: "industry", label: "Industry" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },
    { id: "returned_date", label: "Returned Date" },
    { id: "invoice_date", label: "Invoice Date" },
    { id: "invoice_start_date", label: "Start Date" },
    { id: "invoice_end_date", label: "End Date" },
    { id: "pan", label: "PAN" },
    { id: "email", label: "Email" },
    { id: "shipping_name", label: "Shipping Name" },
    { id: "pincode", label: "Pincode" },
    { id: "created_by", label: "Created By" },
  ];

  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/credit-notes`);
        if (response.status === 200) {
          const formatted = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch credit notes:", error);
      }
    };

    fetchCreditNotes();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Credit Notes</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default CreditNotesTableLayout;
