import React from 'react'
import styles from './SecurityPage.module.css'
import Navbar from '../../components/navbar/Navbar'
import Security from '../../components/security/Security'

const SecurityPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.nav}>
            <Navbar />
        </div>
        <Security />
    </div>
  )
}

export default SecurityPage