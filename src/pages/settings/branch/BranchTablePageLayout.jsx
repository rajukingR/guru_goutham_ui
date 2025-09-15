import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const BranchTablePageLayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "branch_code", label: "Branch Code" },
    { id: "branch_name", label: "Branch Name" },
    { id: "address", label: "Address" },
    { id: "country", label: "Country" },
    { id: "state", label: "State" },
    { id: "city", label: "City" },
    { id: "pincode", label: "Pincode" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/branches`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        const formattedData = response.data.map((item, index) => ({
          s_id: index + 1,
          ...item,
          status: item.is_active ? "Active" : "Inactive",
        }));
        setData(formattedData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <DynamicTable columns={columns} data={data} loading={loading} />
    </div>
  );
};

export default BranchTablePageLayout;
