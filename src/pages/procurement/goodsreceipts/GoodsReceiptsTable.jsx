import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const GoodsReceiptsTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "goods_receipt_id", label: "Goods Receipt ID" },
    { id: "purchase_order_id", label: "Purchase Order ID" },
    { id: "supplier_name", label: "Supplier Name" },

    { id: "goods_receipt_date", label: "Receipt Date" },
    { id: "purchase_type", label: "Purchase Type" },
    // { id: "description", label: "Description" },
    { id: "goods_receipt_status", label: "Status" },

  ];

  useEffect(() => {
    const fetchGoodsReceipts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/goods-receipts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => {
            const productsSummary = item.selected_products?.map(
              (prod) =>
                `${prod.product_name} (Qty: ${prod.quantity}, ₹${prod.total_price})`
            ).join("; ");

            return {
              s_id: index + 1,
              ...item,
                  supplier_name: item.supplier?.supplier_name || "N/A",

            };
          });

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching goods receipts:", error);
      }
    };

    fetchGoodsReceipts();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default GoodsReceiptsTable;
