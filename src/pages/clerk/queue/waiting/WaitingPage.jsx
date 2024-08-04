import React from 'react'
import styles from './WaitingPage.module.css'
import Sidebar from '../../../../components/banker/sidebar/Sidebar'
import Navbar from '../../../../components/navbar/Navbar'
import Tab from '../../../../components/banker/queue/tabs/Tab'
import Waiting from '../../../../components/banker/queue/waiting/Waiting'

const WaitingPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Tab />
            <Waiting />
        </div>
    </div>
  )
}

export default WaitingPage