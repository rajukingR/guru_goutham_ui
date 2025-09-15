import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

const getGrnStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return (
        <span style={{ color: "green", fontWeight: "bold" }}>Approved</span>
      );
    case "Rejected":
      return <span style={{ color: "red", fontWeight: "bold" }}>Rejected</span>;
    default:
      return (
        <span style={{ color: "orange", fontWeight: "bold" }}>
          {status || "Pending"}
        </span>
      );
  }
};

const GrnLayoutTableContent = () => {
  const [data, setData] = useState([]);


    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "grn_number", label: "GRN Number" },
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
    { id: "grn_status", label: "Status" }, // 👈 Add this
  ];

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/grns`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            grn_status: getGrnStatusBadge(item.grn_status), // 👈 Add this
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
      <h2 style={{ marginBottom: "10px" }}>Goods Return Notes (GRN)</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default GrnLayoutTableContent;
