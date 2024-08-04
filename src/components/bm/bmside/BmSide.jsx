import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaCogs,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaUserTie,
  FaClipboard,
} from "react-icons/fa";
import styles from "./BmSide.module.css";
import { useAuth } from "../../../Authcontext";
import { Link, useParams } from "react-router-dom";
import { BsHouseDoorFill } from "react-icons/bs";
import { IoIosStats } from "react-icons/io";

const BmSide = () => {
  const [activeItem, setActiveItem] = useState("");
  const { accessToken, userData, fetchUserData } = useAuth();
  const { branchId } = useParams();

  useEffect(() => {
    if (accessToken && !userData) {
      fetchUserData(accessToken);
    }
  }, [accessToken, userData, fetchUserData]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) {
      setActiveItem("dashboard");
    } else if (path.includes("services")) {
      setActiveItem("services");
    } else if (path.includes("windows")) {
      setActiveItem("windows");
    } else if (path.includes("assign")) {
      setActiveItem("assign");
    } else if (path.includes("metrics")) {
      setActiveItem("metrics");
    } else if (path.includes("users")) {
      setActiveItem("users");
    } else if (path.includes("logout")) {
      setActiveItem("logout");
    }
  }, [location.pathname]);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  if (!userData) {
    return <div className={styles.loader}></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        QueueWise<span>.</span>
      </div>
      <ul className={styles.list}>
        <li className={activeItem === "dashboard" ? styles.active : ""}>
          <Link
            to={`/branches/${branchId}/dashboard`}
            onClick={() => handleClick("dashboard")}
          >
            <BsHouseDoorFill className={styles.icon} /> Dashboard
          </Link>
        </li>
        <li
          className={activeItem === "services" ? styles.active : ""}
        >
          <Link
            to={`/branches/${branchId}/services`}
            onClick={() => handleClick("services")}
          >
            <FaCogs className={styles.icon} /> Services
          </Link>
        </li>
        <li className={activeItem === "windows" ? styles.active : ""}>
          <Link
            to={`/windows/${branchId}`}
            onClick={() => handleClick("windows")}
          >
            <FaUserTie className={styles.icon} /> Desk Management
          </Link>
        </li>
        <li className={activeItem === "assign" ? styles.active : ""}>
          <Link
            to={`/branch/${branchId}`}
            onClick={() => handleClick("assign")}
          >
            <FaClipboard className={styles.icon} /> Desk Assignment
          </Link>
        </li>
        <li className={activeItem === "metrics" ? styles.active : ""}>
          <Link
            to={`/branch/${branchId}/queuemetrics`}
            onClick={() => handleClick("metrics")}
          >
            <FaClipboard className={styles.icon} /> Queue Overview
          </Link>
        </li>
        <li className={activeItem === "users" ? styles.active : ""}>
          <Link
            to={`/branch/${branchId}/users`}
            onClick={() => handleClick("users")}
          >
            <FaUsers className={styles.icon} /> Users
          </Link>
        </li>
        {/* <li className={activeItem === "statistics" ? styles.active : ""}>
          <Link
            to="/branch/statistics"
            onClick={() => handleClick("statistics")}
          >
            <IoIosStats className={styles.icon} /> Statistics
          </Link>
        </li> */}
        <li className={activeItem === "logout" ? styles.active : ""}>
          <Link to="/logout" onClick={() => handleClick("logout")}>
            <FaSignOutAlt className={styles.icon} />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default BmSide;
