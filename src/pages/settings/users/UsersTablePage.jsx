import React, { useState, useEffect } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const UsersTablePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "full_name", label: "Name" },
    { id: "role_name", label: "Role" },
    { id: "email", label: "Email Id" },
    { id: "phone_number", label: "Phone Number" },
    // { id: "login_id", label: "Username" },
    // { id: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        const formatted = data.map((item, index) => ({
          s_id: index + 1,
          ...item,
          status: item.is_active ? "Active" : "Inactive",
        }));

        setUsers(formatted);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <DynamicTable columns={columns} data={users} loading={loading} />
    </div>
  );
};

export default UsersTablePage;
