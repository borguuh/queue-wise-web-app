import React from 'react'
import styles from './StatPage.module.css'
import BmSide from '../../../components/bm/bmside/BmSide'
import Navbar from '../../../components/navbar/Navbar'
import QueueDataComponent from '../../../components/bm/stat/QueueDataComponent'

const StatPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <BmSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <QueueDataComponent />
        </div>
    </div>
  )
}

export default StatPage