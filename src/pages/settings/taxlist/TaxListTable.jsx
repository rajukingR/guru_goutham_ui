import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import { id } from "date-fns/locale";

const TaxListTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "tax_code", label: "Tax Code" },
    { id: "tax_name", label: "Tax Name" },
    { id: "percentage", label: "Tax (%)" },
    { id: "is_active", label: "Active Status" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tax-list");

        const formatted = response.data.map((item, index) => ({
          s_no: index + 1,
          id: item.id,
          tax_code: item.tax_code,
          tax_name: item.tax_name,
          percentage: item.percentage,
          is_active: item.is_active ? "Active" : "Inactive",
        }));

        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch tax list", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? <p>Loading tax list...</p> : <DynamicTable columns={columns} data={data} />}
    </div>
  );
};

export default TaxListTable;
