import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ContactTypeTable = () => {
  const columns = [
    { id: "id", label: "S.No." },
    { id: "contact_type_id", label: "Contact Type ID" },
    { id: "contact_type_name", label: "Contact Type Name" },
    { id: "description", label: "Description" },
  ];

  const data = [
    {
      id: 1,
      contact_type_id: "CT001",
      contact_type_name: "Client",
      description: "Individuals or organizations purchasing services.",
    },
    {
      id: 2,
      contact_type_id: "CT002",
      contact_type_name: "Vendor",
      description: "Suppliers or service providers.",
    },
    {
      id: 3,
      contact_type_id: "CT003",
      contact_type_name: "Partner",
      description: "Collaborative business partners.",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default ContactTypeTable;
