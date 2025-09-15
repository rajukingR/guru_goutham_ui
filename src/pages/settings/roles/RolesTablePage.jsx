import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
  import { useSelector } from "react-redux";

const RolesTablePage = () => {

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

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
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/roles`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formatted = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            status: item.is_active === true ? "Active" : "Inactive",
          }));
          setData(formatted);
        }
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
