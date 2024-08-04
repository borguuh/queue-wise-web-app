import React, { useEffect, useState } from "react";
import styles from "./Info.module.css";
import { BASE_URL } from "../../../Constant";
import axios from "axios";
import { useAuth } from "../../../Authcontext";
import { toast, Toaster } from 'react-hot-toast'; 

const Info = () => {
  const { accessToken, setAccessToken } = useAuth();
  const [overallInfo, setOverallInfo] = useState({
    headquarters: 0,
    users: 0,
  });
  const [userInfo, setUserInfo] = useState({
    admin: 0,
    superAdmin: 0,
    headOfficer: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchOverallInfo = async () => {
    try {
      // Fetch headquarters count
      const orgResponse = await axios.get(
        `${BASE_URL}/headquarters/all?skip=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const headquartersCount = orgResponse.data.filter(
        (org) => org.organization_type === "HEAD"
      ).length;

      const userResponse = await axios.get(`${BASE_URL}/user/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const adminCount = userResponse.data.filter(
        (user) => user.role === "admin"
      ).length;
      const superAdminCount = userResponse.data.filter(
        (user) => user.role === "super-admin"
      ).length;
      const headOfficerCount = userResponse.data.filter(
        (user) => user.role === "head-officer"
      ).length;

      setOverallInfo({
        headquarters: headquartersCount,
        users: adminCount + superAdminCount + headOfficerCount,
      });
      setUserInfo({
        admin: adminCount,
        superAdmin: superAdminCount,
        headOfficer: headOfficerCount,
      });
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching overall info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken){
 

    fetchOverallInfo();
  }
  }, [accessToken]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h2>Overall Information</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.users}</h3>
            <p>No of Users</p>
          </div>
          <div>
            <h3>{overallInfo.headquarters}</h3>
            <p>No of Headquarters</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h2>Users Info</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{userInfo.superAdmin}</h3>
            <p>Super Admins</p>
          </div>
          <div>
            <h3>{userInfo.admin}</h3>
            <p>Admins</p>
          </div>
          <div>
            <h3>{userInfo.headOfficer}</h3>
            <p>Head Officers</p>
          </div>
        </div>
      </div>
      {/* <div className={styles.card}>
        <h2>Headquarters</h2>
        <div className={styles.cardContent}>
          <div>
            <h3>{overallInfo.headquarters}</h3>
            <p>Headquarters</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Info;
