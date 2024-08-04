import React from 'react'
import styles from './DeskAssignPage.module.css'
import BmSide from '../../../components/bm/bmside/BmSide'
import Navbar from '../../../components/navbar/Navbar'
import DeskAssign from '../../../components/bm/assign/DeskAssign'

const DeskAssignPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <BmSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <DeskAssign />
        </div>
    </div>
  )
}

export default DeskAssignPage