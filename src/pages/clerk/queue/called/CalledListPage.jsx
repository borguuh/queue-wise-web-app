import React from 'react'
import styles from './CalledListPage.module.css'
import Sidebar from '../../../../components/banker/sidebar/Sidebar'
import Navbar from '../../../../components/navbar/Navbar'
import Tab from '../../../../components/banker/queue/tabs/Tab'
import CalledList from '../../../../components/banker/queue/called/CalledList'

const WaitingPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Tab />
            <CalledList />
        </div>
    </div>
  )
}

export default WaitingPage