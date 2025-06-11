import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const InvoicesTablePage = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "invoice_number", label: "Invoice Number" },
    { id: "invoice_title", label: "Title" },
    { id: "customer_name", label: "Customer Name" },
    { id: "invoice_date", label: "Invoice Date" },
    { id: "purchase_order_number", label: "PO Number" },
    { id: "customer_gst_number", label: "GST No." },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "pan_number", label: "PAN" },
    { id: "payment_mode", label: "Payment Mode" },
    { id: "approval_status", label: "Status" },
    { id: "amount", label: "Amount" },
    { id: "cgst", label: "CGST" },
    { id: "sgst", label: "SGST" },
    { id: "total_tax", label: "Total Tax" },
    { id: "total_amount", label: "Total Amount" },
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
            id: index + 1,
            ...item,
            amount: formatINR(item.amount),
            cgst: formatINR(item.cgst),
            sgst: formatINR(item.sgst),
            total_tax: formatINR(item.total_tax),
            total_amount: formatINR(item.total_amount),
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
