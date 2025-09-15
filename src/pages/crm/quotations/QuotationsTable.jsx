import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

const QuotationsTable = () => {
  const [data, setData] = useState([]);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "quotation_id", label: "Quotation ID" },
    { id: "full_name", label: "Client Name" },
    // { id: "lead_id", label: "Lead ID" },
    { id: "quotation_date", label: "Quotation Date" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },
    // { id: "rental_start_date", label: "Rental Start" },
    // { id: "rental_end_date", label: "Rental End" },
    // { id: "rental_duration", label: "Duration (months)" },
    { id: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/quotations`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            full_name: `${item.customer_first_name} ${item.customer_last_name}`,
            transaction_type:
              item.transaction_type === "Buy" ? "Sale" : item.transaction_type,
            payment_type: item.payment_type === "" ? "Sale" : item.payment_type,
          }));
          setData(dataWithSno);
        }
      } catch (error) {
        console.error("Error fetching quotations:", error);
      }
    };

    fetchQuotations();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Quotations List</h2>

      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default QuotationsTable;
