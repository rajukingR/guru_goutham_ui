import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const CreditNoteInvoice = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    // { id: "credit_note_number", label: "Credit Note No." },
    { id: "dispatch_order_number", label: "Order Number" },
    { id: "returned_date", label: "Returned Date" },

    { id: "customer_name", label: "Customer Name" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },

        { id: "industry", label: "Industry" },

    { id: "pan", label: "PAN" },
    { id: "email", label: "Email" },
    { id: "pincode", label: "Pincode" },
    
  ];

  useEffect(() => {
    const fetchCreditNotes = async () => {
  try {
    const response = await axios.get(`${API_URL}/credit-notes`);
    if (response.status === 200) {
      const filteredData = response.data
        .filter((item) => item.payment_type !== "Postpaid") // 🔥 filter here
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
