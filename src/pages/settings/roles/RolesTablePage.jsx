import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const RolesTablePage = () => {
  const columns = [
    { id: "id", label: "S.No." },
    { id: "lead_id", label: "Lead ID" },
    { id: "lead_title", label: "Title" },
    { id: "transaction_type", label: "Transaction Type" },
  ];

  const data = [
    {
      id: 1,
      lead_id: "U001",
      lead_title: "Office Lease",
      transaction_type: "Lease",
    },
    {
      id: 2,
      lead_id: "U002",
      lead_title: "Retail Space Rent",
      transaction_type: "Rent",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default RolesTablePage;
