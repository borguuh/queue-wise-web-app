import React from 'react'
import styles from './BmDashPage.module.css'
import BmSide from '../../../components/bm/bmside/BmSide'
import Navbar from '../../../components/navbar/Navbar'
import Dashboard from '../../../components/bm/dashboard/Dashboard'
import PieChart from '../../../components/bm/dashboard/pie/PieChart'

const BmDashPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <BmSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Dashboard />
            <PieChart />
        </div>
    </div>
  )
}

export default BmDashPage