import React from "react";
import { Route, Routes } from "react-router-dom";
import BmPage from "../../pages/bm/BmPage";
import DeskPage from "../../pages/Desk/DeskPage";
import BmUserPage from "../../pages/bm/user/BmUserPage";
import BmDashPage from "../../pages/bm/dash/BmDashPage";
import DeskAssignPage from "../../pages/bm/assignpage/DeskAssignPage";
import BmStatPage from "../../pages/bm/stat/BmStatPage";
import QueueMetricsPage from "../../pages/bm/metricspage/QueueMetricsPage";

const BranchRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/branches/:branchId/services"
          element={<BmDashPage />}
        />
        <Route
          path="/branches/:branchId/services"
          element={<BmPage />}
        />
        <Route path="/windows/:branchId" element={<DeskPage />} /> 
        <Route path="/branch/:branchId" element={<DeskAssignPage />} />
        <Route path="/branch/:branchId/queuemetrics" element={<QueueMetricsPage />} />
        <Route path="/branch/:branchId/users" element={<BmUserPage />} />
        <Route path="/branch/statistics" element={<BmStatPage />} />
      </Routes>
    </div>
  );
};

export default BranchRoutes;
