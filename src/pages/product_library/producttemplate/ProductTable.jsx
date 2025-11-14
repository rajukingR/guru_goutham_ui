import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";
import DefaultImage from "../../../assets/logos/default.jpg";
import { useSelector } from "react-redux";

const ProductTable = () => {

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const [data, setData] = useState([]);

  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "product_image", label: "Image" },
    { id: "product_id", label: "Product ID" },
    { id: "product_name", label: "Product Name" },
    { id: "brand", label: "Brand" },
    { id: "specifications", label: "Specifications" },
    { id: "model", label: "Model" },
    { id: "product_category", label: "Category" },
  ];

  const formatCurrency = (value) => {
    if (!value) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Function to generate specifications based on product category
  const generateSpecifications = (item) => {
    const { product_category } = item;
    
    switch(product_category) {
      case "Laptops":
        return `
          RAM: ${item.ram || "N/A"}, 
          Storage: ${item.storage || "N/A"}, 
          Disk: ${item.disk_type || "N/A"}, 
          Processor: ${item.processor_model || item.processor || "N/A"} ${item.generation || ""}, 
          Graphics: ${item.graphics || "N/A"}, 
          OS: ${item.os || "N/A"},
          Screen: ${item.display_size || item.screen_size || "N/A"}
        `;
      
      case "Assembled PC":
        return `
          RAM: ${item.ram || "N/A"},
          Processor: ${item.processor || "N/A"},
          RAM Type: ${item.ramType || "N/A"}
        `;
      
      case "Monitors":
        return `
          Size: ${item.screen_size || item.display_size || "N/A"},
          Resolution: ${item.resolution || "N/A"},
          Brightness: ${item.brightness || "N/A"}
        `;
      
      case "Processor":
        return `
          Model: ${item.model || "N/A"},
          Generation: ${item.generation || "N/A"},
          Speed: ${item.speed || item.processor_speed || "N/A"}
        `;
      
      case "RAM":
        return `
          Size: ${item.ram || item.sizeGb || "N/A"},
          Type: ${item.ramType || "N/A"},
          Speed: ${item.speed || item.ram_speed || "N/A"}
        `;
      
      case "SSD":
        return `
          Capacity: ${item.capacity || item.storage || "N/A"},
          Type: ${item.ssd_type || item.disk_type || "N/A"},
          Speed: ${item.speed || "N/A"}
        `;
      
      case "HDD":
        return `
          Capacity: ${item.capacity || item.storage || "N/A"},
          Speed: ${item.speed || "N/A"}
        `;
      
      case "Mother Board":
        return `
          Model: ${item.model || "N/A"},
          Chipset: ${item.pro_model || "N/A"}
        `;
      
      case "Cabinet":
        return `
          Model: ${item.model || "N/A"},
          Form Factor: ${item.cabinet || "N/A"}
        `;
      
      case "SMPS":
        return `
          Wattage: ${item.smps || "N/A"}
        `;
      
      case "GPU":
        return `
          Model: ${item.model || "N/A"},
          Memory: ${item.capacity || "N/A"}
        `;
      
      case "Keyboard-Mouse-Combo":
        return `
          Includes Mouse: ${item.mouse ? "Yes" : "No"},
          Includes Keyboard: ${item.keyboard ? "Yes" : "No"}
        `;
      
      case "Wi-Fi":
        return `
          Standard: ${item.wifi_standard || "N/A"},
          Frequency: ${item.frequency_band || item.frequencyMhz || "N/A"}
        `;
      
      case "Printer":
        return `
          Type: ${item.model || "N/A"}
        `;
      
      case "Projector":
        return `
          Model: ${item.model || "N/A"},
          Resolution: ${item.resolution || "N/A"}
        `;
      
      default:
        return `
          RAM: ${item.ram || "N/A"}, 
          Storage: ${item.storage || "N/A"}, 
          Processor: ${item.processor || "N/A"}
        `;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/product-templete`, {
           headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data
            .filter((item) => item.brand !== "Default Brand")
            .map((item, index) => ({
              s_no: index + 1,
              ...item,
              product_image: (
                <img
                  src={
                    item.product_image
                      ? `${IMAGE_API_URL}/${item.product_image}`
                      : DefaultImage
                  }
                  alt={item.product_name}
                  style={{
                    width: "65px",
                    height: "65px",
                    objectFit: "contain",
                    border: "2px solid rgb(13, 18, 24)",
                    borderRadius: "6px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultImage;
                  }}
                />
              ),
              specifications: generateSpecifications(item)
                .trim()
                .replace(/\s+/g, " "),
              purchase_price: formatCurrency(item.purchase_price),
              rent_price_per_day: formatCurrency(item.rent_price_per_day),
              rent_price_per_month: formatCurrency(item.rent_price_per_month),
              rent_price_6_months: formatCurrency(item.rent_price_6_months),
              rent_price_1_year: formatCurrency(item.rent_price_1_year),
              status: item.is_active ? "Active" : "Inactive",
            }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default ProductTable;



























//goeducated.com/course/get-all-courses
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const CourseTableLayout = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const columns = [
//     { id: "s_no", label: "S.No." },
//     { id: "courseName", label: "Course Name" },
//     { id: "courseCategory", label: "Category" },
//     { id: "subCategories", label: "Sub Category" },
//     { id: "actions", label: "Actions" },
//   ];

//   const handleEdit = (course) => {
//     if (course._id) {
//       navigate(`/dashboard/product_library/edit/${course._id}`);
//     } else {
//       navigate("/edit-course", { state: { courseData: course } });
//     }
//   };

//   const handleAddNew = () => {
//     navigate("/add-course");
//   };

//   const handleViewDetails = (course) => {
//     navigate("/course-details", { state: { courseData: course } });
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/course/get-all-courses`);
//         const formattedData = res.data.map((item, index) => ({
//           s_no: index + 1,
//           courseName: item.courseName,
//           courseCategory: item.courseCategory,
//           subCategories: item.subCategories?.join(", "),
//           originalData: item,
//           id: item._id || item.id,
//         }));
//         setData(formattedData);
//         setFilteredData(formattedData);
//       } catch (error) {
//         console.error("Error fetching course data:", error);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // 🔍 Handle search filtering
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = data.filter(
//       (course) =>
//         course.courseName.toLowerCase().includes(value) ||
//         course.courseCategory.toLowerCase().includes(value)
//     );
//     setFilteredData(filtered);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       {/* Header Section */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "20px",
//           flexWrap: "wrap",
//           gap: "10px",
//         }}
//       >
//         {/* Left Side: Search Input */}
//         <div style={{ flex: 1, maxWidth: "400px" }}>
//           <input
//             type="text"
//             placeholder="🔍 Search courses..."
//             value={searchTerm}
//             onChange={handleSearch}
//             style={{
//               width: "100%",
//               padding: "10px 14px",
//               border: "1px solid #ccc",
//               borderRadius: "6px",
//               fontSize: "14px",
//               outline: "none",
//             }}
//           />
//         </div>

//         {/* Right Side: Add New Course Button */}
//         <button
//           onClick={handleAddNew}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#28a745",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "14px",
//             fontWeight: "500",
//             whiteSpace: "nowrap",
//           }}
//           onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
//           onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
//         >
//           + Add New Course
//         </button>
//       </div>

//       {/* Table Section */}
//       <div
//         style={{
//           border: "1px solid #ddd",
//           borderRadius: "8px",
//           overflow: "hidden",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           overflowX: "auto",
//         }}
//       >
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             backgroundColor: "white",
//             minWidth: "800px",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: "#f5f5f5" }}>
//               {columns.map((column) => (
//                 <th
//                   key={column.id}
//                   style={{
//                     padding: "12px 16px",
//                     textAlign: "left",
//                     borderBottom: "2px solid #ddd",
//                     fontWeight: "600",
//                     color: "#333",
//                   }}
//                 >
//                   {column.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((row, index) => (
//                 <tr
//                   key={row.id || index}
//                   style={{
//                     backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
//                     borderBottom: "1px solid #eee",
//                   }}
//                 >
//                   {columns.map((column) => (
//                     <td
//                       key={column.id}
//                       style={{
//                         padding: "12px 16px",
//                         borderBottom: "1px solid #eee",
//                         verticalAlign: "middle",
//                       }}
//                     >
//                       {column.id === "actions" ? (
//                         <div style={{ display: "flex", gap: "8px" }}>
//                           <button
//                             onClick={() =>
//                               handleEdit(row.originalData || row)
//                             }
//                             style={{
//                               padding: "6px 12px",
//                               backgroundColor: "#007bff",
//                               color: "white",
//                               border: "none",
//                               borderRadius: "4px",
//                               cursor: "pointer",
//                               fontSize: "14px",
//                             }}
//                             onMouseOver={(e) =>
//                               (e.target.style.backgroundColor = "#0056b3")
//                             }
//                             onMouseOut={(e) =>
//                               (e.target.style.backgroundColor = "#007bff")
//                             }
//                           >
//                             Edit
//                           </button>

//                           <button
//                             onClick={() =>
//                               handleViewDetails(row.originalData || row)
//                             }
//                             style={{
//                               padding: "6px 12px",
//                               backgroundColor: "#6c757d",
//                               color: "white",
//                               border: "none",
//                               borderRadius: "4px",
//                               cursor: "pointer",
//                               fontSize: "14px",
//                             }}
//                             onMouseOver={(e) =>
//                               (e.target.style.backgroundColor = "#545b62")
//                             }
//                             onMouseOut={(e) =>
//                               (e.target.style.backgroundColor = "#6c757d")
//                             }
//                           >
//                             View
//                           </button>
//                         </div>
//                       ) : (
//                         row[column.id] || "-"
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
//                   No courses found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CourseTableLayout;
