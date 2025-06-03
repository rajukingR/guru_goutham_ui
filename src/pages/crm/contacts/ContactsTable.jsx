import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const ContactsTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "full_name", label: "Full Name" },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "company_name", label: "Company" },
    { id: "industry", label: "Industry" },
    { id: "payment_type", label: "Payment Type" },
    { id: "status", label: "Status" },
    { id: "owner", label: "Owner" }
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            id: index + 1,
            full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
            ...item,
          }));
          setData(dataWithSno);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default ContactsTable;
