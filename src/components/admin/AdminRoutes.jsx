import { useEffect } from "react";
import AdminHomepage from "../../pages/admin/AdminHomepage";
import { Routes, Route } from "react-router-dom";
import Add from "../user/add/Add"
import UserPage from "../../pages/user/UserPage";
import OrgPage from "../../pages/org/OrgPage";
import UserModify from "../user/modify/UserModify";
import Dashboard from "../../pages/dashboard/Dashboard";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminHomepage />} />
        <Route path="/user/:hqId" element={<UserPage />} />
        <Route path="/admin/user/add" element={<Add />} />
        <Route path="/admin/user/:userId/modify" element={<UserModify/>} />
        <Route path="/admin/org" element={<OrgPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
