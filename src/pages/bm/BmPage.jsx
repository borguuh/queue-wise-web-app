import React from 'react'
import styles from "./BmPage.module.css"
import Navbar from '../../components/navbar/Navbar'
import BmSide from '../../components/bm/bmside/BmSide'
import Bm from '../../components/bm/Bm'

const BmPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
            <BmSide />
        </div>
        <div className={styles.content}>
            <Navbar />
            <Bm />
        </div>
    </div>
  )
}

export default BmPage