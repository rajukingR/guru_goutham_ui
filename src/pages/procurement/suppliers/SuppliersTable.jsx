import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const SuppliersTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "supplier_code", label: "Supplier Code" },
    { id: "supplier_name", label: "Name" },
    { id: "supplier_owner", label: "Owner" },
    { id: "gst_number", label: "GST No." },
    { id: "registration_date", label: "Registration Date" },
    { id: "introduced_by", label: "Introduced By" },
    { id: "address_summary", label: "Address" },
    { id: "bank_summary", label: "Bank Details" },
    { id: "contacts_summary", label: "Contacts" },
  ];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${API_URL}/supplier`);
        if (response.status === 200) {
          const formattedData = response.data.map((supplier, index) => {
            const address = supplier.address
              ? `${supplier.address.address_line1}, ${supplier.address.city}, ${supplier.address.state}, ${supplier.address.pincode}`
              : "N/A";

            const bank = supplier.bank
              ? `${supplier.bank.bank_name}, A/C: ${supplier.bank.account_number}`
              : "N/A";

            const contacts = supplier.contacts?.length
              ? supplier.contacts.map((c) => `${c.contact_name} (${c.designation})`).join("; ")
              : "N/A";

            return {
              id: index + 1,
              ...supplier,
              address_summary: address,
              bank_summary: bank,
              contacts_summary: contacts,
            };
          });

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default SuppliersTable;
