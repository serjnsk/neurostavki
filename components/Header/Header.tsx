'use client'

import styles from './Header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContainer}`}>
                <a href="/" className={styles.logo}>
                    <span className={styles.logoGradient}>НейроСтавки</span>
                </a>
            </div>
        </header>
    )
}
