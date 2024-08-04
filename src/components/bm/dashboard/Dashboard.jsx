import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { BASE_URL } from "../../../Constant";
import axios from "axios";
import { useAuth } from "../../../Authcontext";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

const Dashboard = () => {
  const { branchId } = useParams();
  const { accessToken } = useAuth();
  const [branchData, setBranchData] = useState(null);
  const [overallInfo, setOverallInfo] = useState({
    users: 0,
    services: 0,
    windows: 0,
  });
  const [userInfo, setUserInfo] = useState({
    clerks: 0,
    ticketDispenser: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranchData = async () => {
    try {
      setLoading(true);

      // Fetch services data
      const servicesResponse = await axios.get(
        `${BASE_URL}/service/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const servicesCount = servicesResponse.data.length;

      // Fetch windows data
      const windowsResponse = await axios.get(
        `${BASE_URL}/window/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const windowsCount = windowsResponse.data.length;

      // Fetch users data
      const usersResponse = await axios.get(
        `${BASE_URL}/organization/users/all?tenant_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const clerksCount = usersResponse.data.filter(
        (user) => user.role === "clerk"
      ).length;
      const ticketDispenserCount = usersResponse.data.filter(
        (user) => user.role === "ticket-dispenser"
      ).length;

      setOverallInfo({
        users: clerksCount + ticketDispenserCount,
        services: servicesCount,
        windows: windowsCount,
      });
      setUserInfo({
        clerks: clerksCount,
        ticketDispenser: ticketDispenserCount,
      });
    } catch (error) {
      // if (error.response && error.response.status === 404) {
      //   setError("Branch not found.");
      // } else {
      //   setError("An error occurred while fetching data.");
      // }
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching branch data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (branchId && accessToken) {
      fetchBranchData();
    }
  }, [branchId, accessToken]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h2>{branchData?.name} Dashboard</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.users}</h3>
            <p>Users</p>
          </div>
          <div>
            <h3>{overallInfo.services}</h3>
            <p>Services</p>
          </div>
          <div>
            <h3>{overallInfo.windows}</h3>
            <p>Windows</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h2>Users Info</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{userInfo.clerks}</h3>
            <p>Clerks</p>
          </div>
          <div>
            <h3>{userInfo.ticketDispenser}</h3>
            <p>Ticket Dispensers</p>
          </div>
        </div>
      </div>
      {/* <div className={styles.card}>
        <h2>Services Info</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.services}</h3>
            <p>Services</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h2>Windows</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.windows}</h3>
            <p>Windows</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
