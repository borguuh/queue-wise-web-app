import React from "react";
import styles from "./DeskPage.module.css";
import BmSide from "../../components/bm/bmside/BmSide"
import Navbar from "../../components/navbar/Navbar";
import Desk from "../../components/bm/desk/Desk";

const DeskPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <BmSide />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Desk />
      </div>
    </div>
  );
};

export default DeskPage;
