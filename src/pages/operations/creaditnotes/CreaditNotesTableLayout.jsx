import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";

const CreaditNotesTableLayout = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCreditNotes();
  }, []);

  const fetchCreditNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/credit-notes");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch credit notes:", error);
    }
  };

const columns = [
  { id: "id", label: "S.No." },
  { id: "customer_name", label: "Customer Name" },
  { id: "credit_note_title", label: "Title" },
  { id: "industry", label: "Industry" },
  { id: "transaction_type", label: "Transaction Type" },
  { id: "payment_type", label: "Payment Type" },
  { id: "invoice_date", label: "Invoice Date" },
  { id: "invoice_start_date", label: "Start Date" },
  { id: "invoice_end_date", label: "End Date" },
  { id: "amount", label: "Amount" },
  { id: "reference", label: "Reference" },
  { id: "tin", label: "TIN" },
  { id: "pan", label: "PAN" },
  { id: "email", label: "Email" },
  { id: "shipping_name", label: "Shipping Name" },
  { id: "pincode", label: "Pincode" },
  { id: "status", label: "Status" },
  { id: "print_credit_note", label: "Print Credit Note" },
  { id: "created_by", label: "Created By" },
  { id: "credit_note_number", label: "Credit Note No." },
];


  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default CreaditNotesTableLayout;
