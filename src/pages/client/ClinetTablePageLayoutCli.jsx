import React from "react";
import DynamicTable from "../../components/table-format/DynamicTable";

const ClinetTablePageLayoutCli = () => {
  // Define columns for the brands table
  const columns = [
    { id: "id", label: "ID" },
    { id: "logo", label: "Brand Logo" },
    { id: "name", label: "Brand Name" },
    { id: "country", label: "Country" },
    { id: "founded", label: "Founded" },
    { id: "status", label: "Status" },
  ];

  // Define dummy data for brands
  const data = [
    {
      id: 1,
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Dell_Logo.svg",
      name: "Dell",
      country: "USA",
      founded: "1984",
      status: "Active",
    },
    {
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/HP_Logo_2012.svg",
      name: "HP",
      country: "USA",
      founded: "1939",
      status: "Active",
    },
    {
      id: 3,
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Lenovo_logo_2015.svg",
      name: "Lenovo",
      country: "China",
      founded: "1984",
      status: "Active",
    },
    {
      id: 4,
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/ASUS_Logo.svg",
      name: "Asus",
      country: "Taiwan",
      founded: "1989",
      status: "Active",
    },
    {
      id: 5,
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Acer_Logo.svg",
      name: "Acer",
      country: "Taiwan",
      founded: "1976",
      status: "Active",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={5} />
    </div>
  );
};

export default ClinetTablePageLayoutCli;
