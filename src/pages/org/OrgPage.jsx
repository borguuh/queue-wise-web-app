import React from 'react'
import styles from "./OrgPage.module.css";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import Org from '../../components/organizations/Org';

const ServicePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Org />
      </div>
    </div>
  )
}

export default ServicePage