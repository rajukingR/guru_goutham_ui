import React, { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ContactTypeTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "contact_type_name", label: "Contact Type Name" },
    { id: "type", label: "Type" },
    { id: "description", label: "Description" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contact-types");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching contact types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading contact types...</p>
      ) : (
        <DynamicTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default ContactTypeTable;
