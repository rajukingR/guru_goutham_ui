// import React, { useEffect, useState } from "react";
// import DynamicTable from "../../../components/table-format/DynamicTable";
// import axios from "axios";
// import API_URL from "../../../api/Api_url";

// const ClientsDetailsTable = () => {
//   const [data, setData] = useState([]);

//   const columns = [
//     { id: "s_id", label: "S.No." },
//     { id: "full_name", label: "Client Name" },
//     { id: "email", label: "Email" },
//     { id: "phone_number", label: "Phone" },
//     { id: "company_name", label: "Company" },
//     // { id: "customer_id", label: "Customer ID" },
//     // { id: "date", label: "Date" },
//     { id: "industry", label: "Industry" },
//     // { id: "payment_type", label: "Payment Type" },
//     // { id: "owner", label: "Owner" },
//   ];

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await axios.get(`${API_URL}/contacts`, {
//           headers: { "Authorization": `Bearer ${token}` },
//         });

//         if (response.status === 200) {
//           const dataWithSno = response.data.map((item, index) => ({
//             s_id: index + 1,
//             ...item,
//             full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
//             email: item.email,
//             phone_number: item.phone_number,
//             company_name: item.company_name,
//             customer_id: item.customer_id,
//             date: item.date,
//             industry: item.industry,
//             payment_type: item.payment_type,
//             owner: item.owner,
//           }));
//           setData(dataWithSno);
//         }
//       } catch (error) {
//         console.error("Error fetching delivered clients:", error);
//       }
//     };

//     fetchClients();
//   }, []);

//   return (
//     <div>
//       <h2 style={{ marginBottom: "10px" }}>Plain GRN</h2>
//       <DynamicTable columns={columns} data={data} />
//     </div>
//   );
// };

// export default ClientsDetailsTable;

import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ClientsDetailsTable = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "customer_id", label: "Customer ID" },
    { id: "full_name", label: "Client Name" },
    { id: "phone_number", label: "Phone" },
    { id: "company_name", label: "Company" },
    { id: "industry", label: "Industry" },
    { id: "payment_type", label: "Payment Type" },
  ];

  //-----------------------------------
  // FETCH CLIENTS
  //-----------------------------------

  useEffect(() => {
    fetchClients();
  }, [page, search]);

  const fetchClients = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/contacts/delivered-contacts?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { contacts, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      const formatted = contacts.map((item, index) => ({
        s_id: (page - 1) * 10 + index + 1,
        full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
        ...item,
      }));

      setData(formatted);

    } catch (error) {
      console.error("Error fetching delivered clients:", error);
    }
  };

  //-----------------------------------
  // RESET PAGE ON SEARCH
  //-----------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //-----------------------------------

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
        refreshData={fetchClients}
      />
    </div>
  );
};

export default ClientsDetailsTable;

