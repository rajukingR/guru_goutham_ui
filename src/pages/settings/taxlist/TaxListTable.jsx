import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const TaxListTable = () => {
  const columns = [
    { id: "id", label: "S.No." },
    { id: "tax_id", label: "Tax ID" },
    { id: "tax_name", label: "Tax Name" },
    { id: "tax_percentage", label: "Tax (%)" },
    { id: "description", label: "Description" },
  ];

  const data = [
    {
      id: 1,
      tax_id: "TX001",
      tax_name: "GST",
      tax_percentage: 18,
      description: "Goods and Services Tax applicable across India.",
    },
    {
      id: 2,
      tax_id: "TX002",
      tax_name: "VAT",
      tax_percentage: 12.5,
      description: "Value Added Tax used for goods at state level.",
    },
    {
      id: 3,
      tax_id: "TX003",
      tax_name: "Service Tax",
      tax_percentage: 15,
      description: "Tax on services rendered.",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default TaxListTable;
