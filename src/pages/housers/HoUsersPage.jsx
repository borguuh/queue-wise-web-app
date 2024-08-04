import React from 'react'
import styles from "./HoUsersPage.module.css";
import HoSide from '../../components/hq/sidebar/HoSide';
import Navbar from '../../components/navbar/Navbar';
import HoUsers from '../../components/hq/users/HoUsers';

const HoUsersPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <HoSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <HoUsers />
        </div>
    </div>
  )
}

export default HoUsersPage