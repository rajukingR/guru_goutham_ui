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
import ItemVarientPageLayout from "../pages/product_library/itemvarient/ItemVarientPageLayout.jsx";
import AssetPageLayout from "../pages/product_library/asset/AssetPageLayout.jsx";
import AssetmtTrackerPageLayout from "../pages/product_library/assetmodificationtracker/AssetmtTrackerPageLayout.jsx";
import GradePageLayoutPage from "../pages/product_library/grade/GradePageLayoutPage.jsx";
import StockLocationPageLayout from "../pages/product_library/stocklocations/StockLocationPageLayout.jsx";
import StockLoAddPage from "../pages/product_library/stocklocations/StockLoAddPage.jsx";
import StockLoEditPage from "../pages/product_library/stocklocations/StockLoEditPage.jsx";
import GradeAddPage from "../pages/product_library/grade/GradeAddPage.jsx";
import GradeEditPage from "../pages/product_library/grade/GradeEditPage.jsx";
import AssetmtTrackerPageLayoutAdd from "../pages/product_library/assetmodificationtracker/AssetmtTrackerPageLayoutAdd.jsx";
import AssetmtTrackerPageLayoutEdit from "../pages/product_library/assetmodificationtracker/AssetmtTrackerPageLayoutEdit.jsx";
import AssetPageLayoutAdd from "../pages/product_library/asset/AssetPageLayoutAdd.jsx";
import AssetPageLayoutEdit from "../pages/product_library/asset/AssetPageLayoutEdit.jsx";
import ItemVariantPageLayoutAdd from "../pages/product_library/itemvarient/ItemVarientPageLayoutAdd.jsx";
import ItemVariantPageLayoutEdit from "../pages/product_library/itemvarient/ItemVarientPageLayoutEdit.jsx";
import ItemMasterPageLayoutAdd from "../pages/product_library/itemmaster/ItemMasterPageLayoutAdd.jsx";
import ItemMasterPageLayoutEdit from "../pages/product_library/itemmaster/ItemMasterPageLayoutEdit.jsx";
import BrandsPageAddLayout from "../pages/product_library/brands/BrandsPageAddLayout.jsx";
import BrandsPageEditLayout from "../pages/product_library/brands/BrandsPageEditLayout.jsx";
import ProductTemplateAdd from "../pages/product_library/producttemplate/ProductTemplateAdd.jsx";
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
            <Route path="product_library/product_template/add" element={<ProductTemplateAdd/>} />
            <Route path="product_library/brands" element={<ProductTable />} />
            <Route path="product_library/brands/add" element={<BrandsPageAddLayout />} />
            <Route path="product_library/brands/edit/:id" element={<BrandsPageEditLayout />} />
            <Route path="product_library/product_categories" element={<ProductCategoriesPage/>} />
            <Route path="product_library/item_master" element={<ItemMasterPageLayout/>} />
            <Route path="product_library/item_master/add" element={<ItemMasterPageLayoutAdd/>} />
            <Route path="product_library/item_master/edit/:id" element={<ItemMasterPageLayoutEdit/>} />
            <Route path="product_library/item_variant" element={<ItemVarientPageLayout/>} />
            <Route path="product_library/item_variant/add" element={<ItemVariantPageLayoutAdd/>} />
            <Route path="product_library/item_variant/edit/:id" element={<ItemVariantPageLayoutEdit/>} />
            <Route path="product_library/asset" element={<AssetPageLayout/>} />
            <Route path="product_library/asset/add" element={<AssetPageLayoutAdd/>} />
            <Route path="product_library/asset/edit/:id" element={<AssetPageLayoutEdit/>} />
            <Route path="product_library/asset_modification_tracker" element={<AssetmtTrackerPageLayout/>} />
            <Route path="product_library/asset_modification_tracker/add" element={<AssetmtTrackerPageLayoutAdd/>} />
            <Route path="product_library/asset_modification_tracker/edit/:id" element={<AssetmtTrackerPageLayoutEdit/>} />
            <Route path="product_library/grade" element={<GradePageLayoutPage/>} />
            <Route path="product_library/grade/add" element={<GradeAddPage/>} />
            <Route path="product_library/grade/edit/:id" element={<GradeEditPage/>} />
            <Route path="product_library/stock_locations" element={<StockLocationPageLayout/>} />
            <Route path="product_library/stock_locations/add/" element={<StockLoAddPage/>} />
            <Route path="product_library/stock_locations/edit/:id" element={<StockLoEditPage/>} />

          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RoutesConfig;
