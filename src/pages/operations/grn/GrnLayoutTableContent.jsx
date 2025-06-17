import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";

const GrnLayoutTableContent = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "grn_number", label: "GRN Number" },
    { id: "grn_title", label: "Title" },
    { id: "order_id", label: "Order ID" },
    { id: "invoice_number", label: "Invoice Number" },
    { id: "customer_id", label: "Customer ID" },
    { id: "customer_name", label: "Customer Name" },
    { id: "grn_date", label: "GRN Date" },
    { id: "vehicle_number", label: "Vehicle No." },
    { id: "receiver_name", label: "Receiver Name" },
    { id: "returner_name", label: "Returner Name" },
    { id: "grn_created_by", label: "Created By" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "country", label: "Country" },
    { id: "gst_number", label: "GST No." },
    { id: "pan_number", label: "PAN No." },
  ];

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const response = await axios.get(`${API_URL}/grns`);
        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching GRNs:", error);
      }
    };

    fetchGrns();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default GrnLayoutTableContent;
