import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Imdb Scraper</title>
        <meta name="description" content="this is scraper for imdb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Imdb Scraper
        </h1>
        <p className={styles.description}>
          this is scraper for imdb
        </p>
      </main>
    </div>
  )
}

export default Home
