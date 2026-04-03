import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const LeadsTable = () => {

  const [data, setData] = useState([]);

  //------------------------------------------------
  // PAGINATION
  //------------------------------------------------

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);

  //------------------------------------------------
  // FETCH
  //------------------------------------------------

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  const fetchLeads = async () => {
    try {

      const res = await axios.get(
        `${API_URL}/leads?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { leads, pagination } = res.data;

      setTotalPages(pagination.totalPages);

      //------------------------------------------------
      // FORMAT
      //------------------------------------------------

      const formatted = leads.map((item, index) => ({
        ...item,

        s_id: (page - 1) * 10 + index + 1,

        lead_id: item.lead_id || "-",

        transaction_type:
          item.transaction_type === "Buy"
            ? "Sale"
            : item.transaction_type || "-",

        lead_date: item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-IN")
          : "-",

        contact_name: item.contact
          ? `${item.contact.first_name || ""} ${item.contact.last_name || ""}`
          : "-",

        contact_phone: item.contact?.phone_number || "-",
        contact_company: item.contact?.company_name || "-",

      }));

      setData(formatted);

    } catch (error) {
      console.error("Leads fetch error:", error);
    }
  };

  //------------------------------------------------
  // RESET PAGE ON SEARCH
  //------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //------------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "lead_id", label: "Lead ID" },
    { id: "transaction_type", label: "Transaction Type" },
    { id: "lead_date", label: "Lead Date" },
    { id: "contact_name", label: "Contact Name" },
    { id: "contact_phone", label: "Phone" },
    { id: "contact_company", label: "Company" },
  ];

  //------------------------------------------------

  return (
    <div>

      <h2 style={{ marginBottom: "10px" }}>
        Leads List
      </h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchLeads}
      />

    </div>
  );
};

export default LeadsTable;
