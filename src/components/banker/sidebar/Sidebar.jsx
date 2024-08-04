import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaUser, FaBuilding, FaSignOutAlt } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../../Authcontext";
import { BsHouseDoorFill } from "react-icons/bs";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("");
  const { accessToken, userData, fetchUserData } = useAuth();
  const { tenant_id } = useParams();

  useEffect(() => {
    if (accessToken && !userData) {
      fetchUserData(accessToken);
    }
  }, [accessToken, userData, fetchUserData]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("assignment")) {
      setActiveItem("assignment");
    } else if (path.includes("queues")) {
      setActiveItem("queues");
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
        <li className={activeItem === "assignment" ? styles.active : ""}>
          <Link
            to={`/clerk/${tenant_id}`}
            onClick={() => handleClick("assignment")}
          >
            <FaUser className={styles.icon} /> Assignment
          </Link>
        </li>
        <li className={activeItem === "queues" ? styles.active : ""}>
          <Link
            to={`/clerk/${tenant_id}/queue`}
            onClick={() => handleClick("queues")}
          >
            <FaUser className={styles.icon} /> Queues
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
