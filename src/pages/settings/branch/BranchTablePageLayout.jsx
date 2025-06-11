import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";

const BranchTablePageLayout = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "branch_code", label: "Branch Code" },
    { id: "branch_name", label: "Branch Name" },
    { id: "address", label: "Address" },
    { id: "country", label: "Country" },
    { id: "state", label: "State" },
    { id: "city", label: "City" },
    { id: "pincode", label: "Pincode" },
    { id: "is_active", label: "Active Status" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/branches");
        const formattedData = response.data.map(item => ({
          id: item.id, // ✅ Fix added here
          branch_code: item.branch_code,
          branch_name: item.branch_name,
          address: item.address,
          country: item.country,
          state: item.state,
          city: item.city,
          pincode: item.pincode,
          is_active: item.is_active ? "Active" : "Inactive",
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default BranchTablePageLayout;
