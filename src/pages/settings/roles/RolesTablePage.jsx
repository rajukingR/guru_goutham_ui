import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";

const RolesTablePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
const columns = [
    { id: "id", label: "S.No." },
    { id: "role_name", label: "RoleName" },
    { id: "description", label: "Description" },
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        setData(response.data); // assuming API returns an array of objects
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DynamicTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default RolesTablePage;
