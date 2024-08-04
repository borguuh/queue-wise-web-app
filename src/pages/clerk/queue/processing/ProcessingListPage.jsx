import React from "react";
import styles from "./ProcessingListPage.module.css";
import Sidebar from "../../../../components/banker/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import Tab from "../../../../components/banker/queue/tabs/Tab";
import ProcessingList from "../../../../components/banker/queue/processing/ProcessingList";

const ProcessingListPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Tab />
        <ProcessingList />
      </div>
    </div>
  );
};

export default ProcessingListPage;
