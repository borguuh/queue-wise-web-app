import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaUser, FaBuilding, FaSignOutAlt } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../Authcontext";
import { BsHouseDoorFill } from "react-icons/bs";

const Sidebar = () => {
  const { hqId } = useParams();
  const [activeItem, setActiveItem] = useState("");
  const { accessToken, userData, fetchUserData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (accessToken && !userData) {
      fetchUserData(accessToken);
    }
  }, [accessToken, userData, fetchUserData]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) {
      setActiveItem("dashboard");
    } else if (path.includes("user")) {
      setActiveItem("user");
    } else if (path.includes("org")) {
      setActiveItem("org");
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
            to="/admin/dashboard"
            onClick={() => handleClick("dashboard")}
          >
            <BsHouseDoorFill className={styles.icon} /> Dashboard
          </Link>
        </li>
        <li className={activeItem === "user" ? styles.active : ""}>
          <Link to="/admin/user" onClick={() => handleClick("user")}>
            <FaUser className={styles.icon} /> Users
          </Link>
        </li>
        <li className={activeItem === "org" ? styles.active : ""}>
          <Link to="/admin/org" onClick={() => handleClick("org")}>
            <FaBuilding className={styles.icon} /> Headquarters
          </Link>
        </li>
        <li className={activeItem === "logout" ? styles.active : ""}>
          <Link to="/logout" onClick={() => handleClick("logout")}>
            <FaSignOutAlt className={styles.icon} /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
