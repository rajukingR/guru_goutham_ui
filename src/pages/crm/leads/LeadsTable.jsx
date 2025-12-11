import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import { useSelector } from "react-redux";

const LeadsTable = () => {
  const [data, setData] = useState([]);


    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "lead_id", label: "Lead ID" },
    // { id: "lead_title", label: "Title" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },

    { id: "lead_date", label: "Lead Date" },
    { id: "contact_name", label: "Contact Name" },
    { id: "contact_phone", label: "Phone" },
    { id: "contact_company", label: "Company" },
    // { id: "owner", label: "Owner" },
    // { id: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/leads`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            contact_name: item.contact
              ? `${item.contact.first_name} ${item.contact.last_name}`
              : "",
            contact_phone: item.contact?.phone_number || "",
            contact_company: item.contact?.company_name || "",
            transaction_type:
              item.transaction_type === "Buy" ? "Sale" : item.transaction_type,
            payment_type: item.payment_type === "" ? "Sale" : item.payment_type,
            status: item.is_active ? "Active" : "Inactive",
          }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Leads List</h2>

      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default LeadsTable;
