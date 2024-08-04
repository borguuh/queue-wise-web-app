import React from "react";
import ClerkPage from "../../pages/clerk/ClerkPage";
import { Route, Routes } from "react-router-dom";
import ClerkDashPage from "../../pages/clerk/dashboard/ClerkDashPage";
import QueuePage from "../../pages/clerk/queue/QueuePage";
import CalledListPage from "../../pages/clerk/queue/called/CalledListPage"
import RejectedListPage from "../../pages/clerk/queue/rejected/RejectedListPage";
import AcceptedListPage from "../../pages/clerk/queue/accepted/AcceptedListPage";
import ProcessingListPage from "../../pages/clerk/queue/processing/ProcessingListPage";

const ClerkRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/clerk/:tenant_id" element={<ClerkPage />} />
        <Route path="/clerk/:tenant_id/queue" element={<QueuePage />} />
        <Route path="/waiting/:tenant_id" element={<WaitingPage />} />
        <Route path="/called/:tenant_id/:window_id" element={<CalledListPage />} />
        <Route path="/processing/:tenant_id/:window_id" element={<ProcessingListPage />} />
        <Route path="/accepted/:tenant_id/:window_id" element={<AcceptedListPage />} />
        <Route path="/rejected/:tenant_id/:window_id" element={<RejectedListPage />} />
        <Route path="/clerk/dashboard" element={<ClerkDashPage />} />
      </Routes>
    </div>
  );
};

export default ClerkRoutes;
