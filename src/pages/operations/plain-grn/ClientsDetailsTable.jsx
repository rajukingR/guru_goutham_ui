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



    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "full_name", label: "Clinet Name" },
    { id: "email", label: "Email" },
    { id: "phone_number", label: "Phone" },
    { id: "company_name", label: "Company" },
    { id: "customer_id", label: "Customer ID" },
    { id: "date", label: "Date" },
    { id: "industry", label: "Industry" },
    { id: "payment_type", label: "Payment Type" },
    { id: "owner", label: "Owner" },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/contacts/delivered-contacts`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            s_id: index + 1,
            full_name: `${item.first_name} ${item.last_name || ""}`.trim(),
            ...item,
          }));
          setData(dataWithSno);
        }
      } catch (error) {
        console.error("Error fetching delivered clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Clients List</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default ClientsDetailsTable;
