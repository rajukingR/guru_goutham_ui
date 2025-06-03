import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const UsersTablePage = () => {
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
  ];

  const data = [
    {
      id: 1,
      lead_id: "U001",
      lead_title: "Office Lease",
      transaction_type: "Lease",
      lead_source: "LinkedIn",
      source_of_enquiry: "Organic",
      rental_duration_months: 6,
      rental_start_date: "2025-07-15",
      rental_end_date: "2026-01-14",
      lead_date: "2025-06-01",
      contact_name: "Sam Wilson",
      contact_phone: "7894561230",
      contact_company: "Wilson Corp",
      owner: "Admin",
    },
    {
      id: 2,
      lead_id: "U002",
      lead_title: "Retail Space Rent",
      transaction_type: "Rent",
      lead_source: "Facebook",
      source_of_enquiry: "Campaign",
      rental_duration_months: 12,
      rental_start_date: "2025-09-01",
      rental_end_date: "2026-08-31",
      lead_date: "2025-06-02",
      contact_name: "Emily Clarke",
      contact_phone: "9988776655",
      contact_company: "Clarke & Co.",
      owner: "Manager",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default UsersTablePage;
