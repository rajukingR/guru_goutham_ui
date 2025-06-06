import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const AddressTable = () => {
  const columns = [
    { id: "id", label: "S.No." },
    { id: "branch_id", label: "Branch ID" },
    { id: "branch_name", label: "Branch Name" },
    { id: "location", label: "Location" },
    { id: "contact_person", label: "Contact Person" },
    { id: "contact_phone", label: "Phone" },
  ];

  const data = [
    {
      id: 1,
      branch_id: "B001",
      branch_name: "Head Office",
      location: "Mumbai",
      contact_person: "Amit Shah",
      contact_phone: "9876543210",
    },
    {
      id: 2,
      branch_id: "B002",
      branch_name: "North Branch",
      location: "Delhi",
      contact_person: "Pooja Verma",
      contact_phone: "9123456780",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default AddressTable;
