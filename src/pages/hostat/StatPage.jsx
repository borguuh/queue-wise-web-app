import React from 'react'
import styles from './StatPage.module.css'
import HoSide from '../../components/hq/sidebar/HoSide'
import Navbar from '../../components/navbar/Navbar'
import HoStat from '../../components/hq/stat/HoStat'

const StatPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <HoSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <HoStat />
        </div>
    </div>
  )
}

export default StatPage