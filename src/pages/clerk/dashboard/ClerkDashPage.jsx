import React from 'react'
import styles from './ClerkDashPage.module.css'
import Sidebar from '../../../components/banker/sidebar/Sidebar'
import Navbar from '../../../components/navbar/Navbar'
import ClerkDash from '../../../components/banker/dashboard/ClerkDash'

const ClerkDashPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar />
        </div>
        <div className={styles.content}>
            <Navbar />
            <ClerkDash />
        </div>
    </div>
  )
}

export default ClerkDashPage