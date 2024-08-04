import React from 'react'
import styles from './AcceptedListPage.module.css'
import Sidebar from '../../../../components/banker/sidebar/Sidebar'
import Navbar from '../../../../components/navbar/Navbar'
import Tab from '../../../../components/banker/queue/tabs/Tab'
import AcceptedList from '../../../../components/banker/queue/accepted/AcceptedList'

const AcceptedListPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Tab />
            <AcceptedList />
        </div>
    </div>
  )
}

export default AcceptedListPage