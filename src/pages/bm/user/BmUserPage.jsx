import React from 'react'
import styles from "./BmUserPage.module.css"
import BmSide from "../../../components/bm/bmside/BmSide"
import Navbar from '../../../components/navbar/Navbar'
import BmUsers from '../../../components/bm/users/BmUsers'

const BmUserPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <BmSide />
      </div>
      <div className={styles.content}>
        <Navbar />
        <BmUsers />
      </div>
    </div>
  )
}

export default BmUserPage