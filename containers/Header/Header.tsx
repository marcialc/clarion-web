import React from 'react';
import styles from '../../styles/Header.module.scss'

export const Header = (props: any) => {
  return(
    <div className={styles.header}>
      <h1>Clarion</h1>
      {/* <div className={styles.navbar}>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Charts</li>
          <li>News</li>
          <li>Events</li>
        </ul>
      </div> */}
    </div>
  )
};

