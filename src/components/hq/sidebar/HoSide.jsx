import React, { useEffect, useState } from "react";
import styles from "./HoSide.module.css";
import { useAuth } from "../../../Authcontext";
import { Link, useParams } from "react-router-dom";
import { BsBank2, BsHouseDoorFill } from "react-icons/bs";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";

const HoSide = () => {
  const { hqId } = useParams();
  const [activeItem, setActiveItem] = useState("");
  const { accessToken, userData, fetchUserData } = useAuth();

  useEffect(() => {
    if (accessToken && !userData) {
      fetchUserData(accessToken);
    }
  }, [accessToken, userData, fetchUserData]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) {
      setActiveItem("dashboard");
    } else if (path.includes("branches")) {
      setActiveItem("branches");
    } else if (path.includes("users")) {
      setActiveItem("users");
    } else if (path.includes("statistics")) {
      setActiveItem("statistics");
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
            to={`/headquarters/${hqId}/dashboard`}
            onClick={() => handleClick("dashboard")}
          >
            <BsHouseDoorFill className={styles.icon} />  Dashboard
          </Link>
        </li>
        <li className={activeItem === "branches" ? styles.active : ""}>
          <Link
            to={`/headquarters/${hqId}/branches`}
            onClick={() => handleClick("branches")}
          >
           <BsBank2 className={styles.icon} /> Branches
          </Link>
        </li>
        <li className={activeItem === "users" ? styles.active : ""}>
          <Link
            to={`/user/hq/${hqId}/users`}
            onClick={() => handleClick("users")}
          >
           <FaUser className={styles.icon} /> Users
          </Link>
        </li>
        <li className={activeItem === "statistics" ? styles.active : ""}>
          <Link
            to={`/overall-stats/${hqId}`}
            onClick={() => handleClick("statistics")}
          >
           <IoIosStats className={styles.icon} /> Statistics
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

export default HoSide;
