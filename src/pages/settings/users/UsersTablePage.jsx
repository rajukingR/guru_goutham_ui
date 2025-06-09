import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const UsersTablePage = () => {
  const columns = [
    { id: "name", label: "Name" },
    { id: "role", label: "Role" },
    { id: "email", label: "Email Id" },
    { id: "phone", label: "Phone Number" },
    { id: "username", label: "Username" },
    { id: "password", label: "Password" },
  ];

  const data = [
    {
      name: "John Doe",
      role: "Admin",
      email: "john@example.com",
      phone: "9876543210",
      username: "johndoe",
      password: "********",
    },
    {
      name: "Jane Smith",
      role: "Manager",
      email: "jane@example.com",
      phone: "9123456780",
      username: "janesmith",
      password: "********",
    },
    {
      name: "Mike Brown",
      role: "User",
      email: "mike@example.com",
      phone: "9988776655",
      username: "mikebrown",
      password: "********",
    },
    {
      name: "Sara Lee",
      role: "Editor",
      email: "sara@example.com",
      phone: "8877665544",
      username: "saralee",
      password: "********",
    },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default UsersTablePage;
