import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";

const ClinetTableLayout = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "client_id", label: "Client ID" },
    { id: "client_name", label: "Client Name" },
    { id: "company_name", label: "Company Name" },
    { id: "customer_industry", label: "Industry" },
    { id: "phone_number", label: "Phone" },
    { id: "email", label: "Email" },
    { id: "city", label: "City" },
    { id: "rental_start_date", label: "Start Date" },
    { id: "rental_return_date", label: "Return Date" },
    { id: "client_status", label: "Status" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user"); 
        const formattedData = res.data.map((item, index) => ({
          s_no: index + 1,
          client_id: item.client_id,
          client_name: item.client_name,
          company_name: item.company_name,
          customer_industry: item.customer_industry,
          phone_number: item.phone_number,
          email: item.email,
          city: item.city,
          rental_start_date: item.rental_start_date,
          rental_return_date: item.rental_return_date,
          client_status: item.client_status,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Client List</h2>
      <DynamicTable columns={columns} data={data} rowsPerPage={5} />
    </div>
  );
};

export default ClinetTableLayout;
