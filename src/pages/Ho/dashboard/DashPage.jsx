import React from 'react'
import styles from './DashPage.module.css'
import HoSide from '../../../components/hq/sidebar/HoSide'
import Navbar from '../../../components/navbar/Navbar'
import Dashboard from '../../../components/hq/dashboard/Dashboard'
import PieChart from '../../../components/hq/dashboard/pie/PieChart'

const DashPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <HoSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Dashboard />
            <PieChart />
        </div>
    </div>
  )
}

export default DashPage