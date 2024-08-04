import React from "react";
import styles from "./ClerkPage.module.css";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/banker/sidebar/Sidebar";
import Banker from "../../components/banker/Banker";

const ClerkPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Banker />
      </div>
    </div>
  );
};

export default ClerkPage;
