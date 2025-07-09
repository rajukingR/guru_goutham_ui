import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const InvoicesTablePage = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "invoice_number", label: "Invoice Number" },
    { id: "invoice_title", label: "Title" },
    { id: "customer_name", label: "Customer Name" },
    { id: "invoice_start_date", label: "Invoice Date" },
    { id: "purchase_order_number", label: "PO Number" },
    { id: "customer_gst_number", label: "GST No." },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "pan_number", label: "PAN" },
        { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_mode", label: "Payment Mode" },
  ];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const formatted = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
           
            status: item.approval_status === "Approved" ? "Active" : "Inactive",
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(parseFloat(value || 0));
  };

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default InvoicesTablePage;
