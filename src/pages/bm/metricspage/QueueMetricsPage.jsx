import React from "react";
import styles from "./QueueMetricsPage.module.css";
import BmSide from "../../../components/bm/bmside/BmSide";
import Navbar from "../../../components/navbar/Navbar";
import QueueMetrics from "../../../components/bm/metrics/QueueMetrics";

const QueueMetricsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <BmSide />
      </div>
      <div className={styles.content}>
        <Navbar />
        <QueueMetrics />
      </div>
    </div>
  );
};

export default QueueMetricsPage;
