import React from 'react'
import styles from './DisplayPage.module.css'
import Navbar from '../../components/navbar/Navbar'
import Display from '../../components/display/Display'

const DisplayPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.nav}>
            <Navbar />
        </div>
        <Display />
    </div>
  )
}

export default DisplayPage