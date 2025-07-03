import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const QuotationsTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "quotation_id", label: "Quotation ID" },
    { id: "full_name", label: "Client Name" },
    { id: "lead_id", label: "Lead ID" },
    { id: "quotation_date", label: "Quotation Date" },
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
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            id: index + 1,
            ...item,
            full_name: `${item.customer_first_name} ${item.customer_last_name}`
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
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default QuotationsTable;
