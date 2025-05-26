import React from "react";
import { useSelector } from "react-redux";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "../pages/auth_page/SignIn";
import DashBoard from "../pages/dashboard_page/DashBoard";
import SignUp from "../pages/auth_page/SignUp";
import LayOut from "../layouts/LayOut.jsx"; 
import ProfilePage from "../pages/user-profile/ProfilePage.jsx"
import EditProfile from "../pages/user-profile/EditProfile.jsx"
import ProductTemplatePage from "../pages/product_library/producttemplate/ProductTable.jsx";
import ProductTable from "../pages/product_library/producttemplate/ProductTable.jsx";
import ProductCategoriesPage from "../pages/product_library/productcategories/ProductCategoriesPage.jsx";
import ItemMasterPageLayout from "../pages/product_library/itemmaster/ItemMasterPageLayout.jsx";
const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? element : <Navigate to="/signin" replace />;
};
const RoutesConfig = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Dashboard */}
          <Route path="/dashboard/*" element={<ProtectedRoute element={<LayOut />} />}>
          <Route index element={<DashBoard />} />

            
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit-profile/:id" element={<EditProfile />} />
            <Route path="product_library/product_template" element={<ProductTemplatePage />} />
            <Route path="product_library/brands" element={<ProductTable />} />
            <Route path="product_library/product_categories" element={<ProductCategoriesPage/>} />
            <Route path="product_library/item_master" element={<ItemMasterPageLayout/>} />

          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RoutesConfig;
