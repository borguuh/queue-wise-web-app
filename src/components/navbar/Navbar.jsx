import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "../../Authcontext";
import axios from "axios";
import { BASE_URL } from "../../Constant";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

export default function Navbar() {
  const { hqId, branchId } = useParams();
  const { userData, accessToken, fetchUserData } = useAuth();
  const [entityData, setEntityData] = useState(null);
  const [entityType, setEntityType] = useState(null);

  useEffect(() => {
    if (accessToken && !userData) {
      fetchUserData(accessToken);
    }
  }, [accessToken, userData, fetchUserData]);

  useEffect(() => {
    if (hqId && accessToken) {
      fetchHeadquarterDetails(hqId);
    } else if (branchId) {
      fetchBranchDetails(branchId);
    }
  }, [hqId, branchId, accessToken]);

  const fetchHeadquarterDetails = async () => {
    if (accessToken) {
      try {
        const response = await axios.get(
          `${BASE_URL}/organization/?model_id=${hqId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const headquarter = response.data;
        setEntityData(headquarter);
        setEntityType("headquarter");
      } catch (error) {
        const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
        toast.error(errMsg);
        console.error("Error fetching headquarter details:", error);
      }
    }
  };

  const fetchBranchDetails = async () => {
    if (accessToken) {
      try {
        const response = await axios.get(
          `${BASE_URL}/organization?model_id=${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const branch = response.data;
        setEntityData(branch);
        setEntityType("branch");
      } catch (error) {
        const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
        toast.error(errMsg);
        console.error("Error fetching branch details:", error);
      }
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const names = name.split(" ");
    return (
      names[0].charAt(0).toUpperCase() +
      (names.length > 1 ? names[1].charAt(0).toUpperCase() : "")
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  if (!userData) {
    return (
      <div className={styles.container}>
        <div className={styles.userDetail}>
          <span className={styles.loading}>Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div className={styles.userImage}>
          {userData.profilePicture ? (
            <img src={userData.profilePicture} alt="Profile" />
          ) : (
            <div className={styles.initials}>
              {getInitials(userData.username)}
            </div>
          )}
        </div>
        <div className={styles.userDetail}>
          <span className={styles.username}>{`${getGreeting()}, ${
            userData.username
          }`}</span>
          <span className={styles.userTitle}>
            Role: <p>{userData.role}</p>
          </span>
        </div>
      </div>
      {entityData && (
        <div className={styles.entityDetails}>
          <p>Name: {entityData.name}</p>
          <p>Contact Phone: {entityData.contact_phone}</p>
          <p>Contact Email: {entityData.contact_email}</p>
        </div>
      )}
    </div>
  );
}
