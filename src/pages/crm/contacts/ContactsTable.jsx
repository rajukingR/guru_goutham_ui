import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ContactsTable = () => {
  const [data, setData] = useState([]);

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "full_name", label: "Full Name" },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "company_name", label: "Company" },
    { id: "industry", label: "Industry" },
    // { id: "payment_type", label: "Payment Type" },
    // { id: "owner", label: "Owner" }
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/contacts`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            ...item,
            s_id: index + 1,
            full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
            status: item.is_active ? "Active" : "Inactive",
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
      <h2 style={{ marginBottom: "10px" }}>Clients List</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default ContactsTable;
