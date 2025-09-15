import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const CourierChargesTable = () => {
  const [data, setData] = useState([]);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
    
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "service_number", label: "Courier Number" },
    { id: "customer_name", label: "Customer Name" },
    { id: "service_date", label: "Courier Date" },

  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/courier-charges`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formatted = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            customer_name: `${item.customer.first_name} ${item.customer.last_name}`,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Courier Charges List</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default CourierChargesTable;