import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ContactsTable = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "full_name", label: "Full Name" },
    { id: "phone_number", label: "Phone" },
    { id: "company_name", label: "Company" },
    { id: "industry", label: "Industry" },
    { id: "address", label: "Address Details" },
  ];

  //----------------------------------
  // FETCH CONTACTS
  //----------------------------------

  const fetchContacts = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/contacts?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const formatted = response.data.data.map((item, index) => ({
        ...item,
        s_id: (page - 1) * 10 + index + 1,
        full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
        address: `${item.address.street}, ${item.address.city}, ${item.address.state}, ${item.address.pincode}.`,
        status: item.is_active ? "Active" : "Inactive",
      }));

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  //----------------------------------

  return (
    <div>

      <h2 style={{ marginBottom: "10px" }}>Clients List</h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchContacts}
      />

    </div>
  );
};

export default ContactsTable;
