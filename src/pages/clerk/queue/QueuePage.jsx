import React from 'react'
import styles from './QueuePage.module.css'
import Sidebar from '../../../components/banker/sidebar/Sidebar'
import Navbar from '../../../components/navbar/Navbar'
import Tab from '../../../components/banker/queue/tabs/Tab'

const QueuePage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Tab />
        </div>
    </div>
  )
}

export default QueuePage