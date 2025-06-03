import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const LeadsTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "lead_id", label: "Lead ID" },
    { id: "lead_title", label: "Title" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "lead_source", label: "Lead Source" },
    { id: "source_of_enquiry", label: "Source of Enquiry" },
    { id: "rental_duration_months", label: "Rental Duration (Months)" },
    { id: "rental_start_date", label: "Start Date" },
    { id: "rental_end_date", label: "End Date" },
    { id: "lead_date", label: "Lead Date" },
    { id: "contact_name", label: "Contact Name" },
    { id: "contact_phone", label: "Phone" },
    { id: "contact_company", label: "Company" },
    { id: "owner", label: "Owner" },
    // { id: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            id: index + 1,
            contact_name: item.contact ? `${item.contact.first_name} ${item.contact.last_name}` : "",
            contact_phone: item.contact?.phone_number || "",
            contact_company: item.contact?.company_name || "",
            status: item.is_active ? "Active" : "Inactive",
            ...item,
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
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default LeadsTable;
