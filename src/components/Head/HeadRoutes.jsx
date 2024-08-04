import React from "react";
import { Route, Routes } from "react-router-dom";
import HoUsersPage from "../../pages/housers/HoUsersPage";
import StatPage from "../../pages/hostat/StatPage";
import DashPage from "../../pages/Ho/dashboard/DashPage";

const HeadRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/headquarters/:hqId/dashboard" element={<DashPage />} />
        <Route path="/headquarters/:hqId/branches" element={<HoPage />} />
        <Route
          path="/user/hq/:hqId/users"
          element={<HoUsersPage />}
        />
        <Route path="/overall-stats/:hqId" element={<StatPage />} />
      </Routes>
    </div>
  );
};

export default HeadRoutes;
