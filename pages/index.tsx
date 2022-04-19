import { styled } from '@mui/material'
import type { NextPage } from 'next'
import React from 'react'
import { Dashboard } from '../containers/Dashboard/Dashboard'
import { Footer } from '../containers/Footer/Footer'
import { Header } from '../containers/Header/Header'
import styles from '../styles/Home.module.scss'

const Root = styled('div', { label: 'root' })(({ theme }: any) => ({
  padding: '0 1rem',
  backgroundColor: '#10092a'
}));

const Home: NextPage = () => {
  return (
    <Root>
      <Header />
      <main className={styles.main}>
        <Dashboard />
      </main>
      <Footer />
    </Root>
  )
}

export default Home
