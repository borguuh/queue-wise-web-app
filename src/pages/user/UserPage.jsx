import React from "react";
import styles from "./UserPage.module.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import User from "../../components/user/User";

const UserPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <User />
      </div>
    </div>
  );
};

export default UserPage;
