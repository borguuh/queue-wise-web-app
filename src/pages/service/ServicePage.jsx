import React from 'react'
import styles from "./ServicePage.module.css";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import Service from '../../components/service/Service'

const ServicePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Service />
      </div>
    </div>
  )
}

export default ServicePage