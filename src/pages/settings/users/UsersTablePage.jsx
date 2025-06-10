import React, { useState, useEffect } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const UsersTablePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "full_name", label: "Name" },
    { id: "role_name", label: "Role" },
    { id: "email", label: "Email Id" },
    { id: "phone_number", label: "Phone Number" },
    { id: "login_id", label: "Username" },
    { id: "password", label: "Password" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Transform the data to match the table structure
  const tableData = users.map(user => ({
    ...user,
    password: "********" // Mask the password for display
  }));

  return (
    <div>
      <DynamicTable 
        columns={columns} 
        data={tableData} 
        loading={loading}
      />
    </div>
  );
};

export default UsersTablePage;