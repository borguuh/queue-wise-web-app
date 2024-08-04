import React from "react";
import styles from "./RejectedListPage.module.css";
import Sidebar from "../../../../components/banker/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import Tab from "../../../../components/banker/queue/tabs/Tab";
import RejectedList from "../../../../components/banker/queue/rejected/RejectedList";

const RejectedListPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Tab />
        <RejectedList />
      </div>
    </div>
  );
};

export default RejectedListPage;
