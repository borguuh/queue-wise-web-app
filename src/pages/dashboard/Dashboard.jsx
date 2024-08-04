import React from 'react'
import styles from "./Dashboard.module.css"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import PieChart from '../../components/user/stat/pie/PieChart'
import Info from '../../components/user/info/Info'

const Stat = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Info />
            <PieChart />
        </div>
    </div>
  )
}

export default Stat