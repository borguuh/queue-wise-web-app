import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { BASE_URL } from "../../../Constant";
import axios from "axios";
import { useAuth } from "../../../Authcontext";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

const Dashboard = () => {
  const { hqId } = useParams();
  const { accessToken } = useAuth();
  const [headquarterData, setHeadquarterData] = useState(null);
  const [overallInfo, setOverallInfo] = useState({
    branches: 0,
    users: 0,
  });
  const [userInfo, setUserInfo] = useState({
    branchManager: 0,
    headOfficer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeadquarterData = async () => {
    try {
      // Fetch branches data
      const branchesResponse = await axios.get(
        `${BASE_URL}/headquarter/branches/all?model_id=${hqId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const branchesCount = branchesResponse.data.filter(
        (org) => org.organization_type === "BRANCH"
      ).length;

      // Fetch users data
      const userResponse = await axios.get(
        `${BASE_URL}/hq/users/all?hq_id=${hqId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const branchManagerCount = userResponse.data.filter(
        (user) => user.role === "branch-manager"
      ).length;
      const headOfficerCount = userResponse.data.filter(
        (user) => user.role === "head-officer"
      ).length;

      setOverallInfo({
        branches: branchesCount,
        users: branchManagerCount + headOfficerCount,
      });
      setUserInfo({
        branchManager: branchManagerCount,
        headOfficer: headOfficerCount,
      });
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      // if (error.response && error.response.status === 404) {
      //   setError("Headquarter not found.");
      // } else {
      //   setError("An error occurred while fetching data.");
      // }
      console.error("Error fetching headquarter data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (hqId && accessToken) {
      fetchHeadquarterData();
    }
  }, [hqId, accessToken]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h2>{headquarterData?.name} Dashboard</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.users}</h3>
            <p>No of Users</p>
          </div>
          <div>
            <h3>{overallInfo.branches}</h3>
            <p>No of Branches</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h2>Users Info</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{userInfo.headOfficer}</h3>
            <p>Head Officers</p>
          </div>
          <div>
            <h3>{userInfo.branchManager}</h3>
            <p>Branch Managers</p>
          </div>
        </div>
      </div>
      {/* <div className={styles.card}>
        <h2>Branches</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.branches}</h3>
            <p>Branches</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
