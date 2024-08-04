import React from 'react'
import styles from "./HoPage.module.css";
import Navbar from '../../components/navbar/Navbar'
import HoSide from '../../components/hq/sidebar/HoSide';
import Ho from '../../components/hq/Ho';

const ServicePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <HoSide />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Ho />
      </div>
    </div>
  )
}

export default ServicePage