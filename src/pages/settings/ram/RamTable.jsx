import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const RamTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "ram_type", label: "RAM Type" },
    { id: "size_gb", label: "Size (GB)" },
    { id: "frequency_mhz", label: "Frequency (MHz)" },
    { id: "manufacturer", label: "Manufacturer" },
  ];

  useEffect(() => {
    const fetchRamSpecs = async () => {
      try {
        // If you use token auth, uncomment this line:
        // const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/ram-specs`, {
          // headers: { Authorization: `Bearer ${token}` }, // optional
        });

        if (response.status === 200) {
          const formatted = response.data.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching RAM specs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRamSpecs();
  }, []);

  return (
    <div>
      {/* <h2 style={{ marginBottom: "10px" }}>RAM Specifications</h2> */}
      <DynamicTable columns={columns} data={data} loading={loading} />
    </div>
  );
};

export default RamTable;
