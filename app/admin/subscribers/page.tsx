'use client'

import { useEffect, useState } from 'react'
import styles from '../dashboard.module.css'
import subscriberStyles from './subscribers.module.css'

interface SubscriberStats {
    total: number
    active: number
    completed: number
    byGeo: {
        russia: number
        all: number
    }
    bySport: {
        football: number
        hockey: number
        basketball: number
        tennis: number
        esports: number
        mma: number
    }
    dailyStats: Record<string, number>
    recent: Array<{
        id: number
        telegramId: string
        username: string | null
        firstName: string | null
        lastName: string | null
        sports: string[]
        geo: string
        onboardingComplete: boolean
        createdAt: string
    }>
}

const SPORT_LABELS: Record<string, string> = {
    football: '⚽ Футбол',
    hockey: '🏒 Хоккей',
    basketball: '🏀 Баскетбол',
    tennis: '🎾 Теннис',
    esports: '🎮 Киберспорт',
    mma: '🥊 Бокс / ММА'
}

export default function SubscribersPage() {
    const [stats, setStats] = useState<SubscriberStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/subscribers')
            if (!response.ok) {
                throw new Error('Failed to fetch stats')
            }
            const data = await response.json()
            setStats(data)
        } catch (err) {
            setError('Ошибка загрузки статистики')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    if (error || !stats) {
        return <div className={styles.loading}>{error || 'Нет данных'}</div>
    }

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>📱 Telegram-подписчики</h1>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.total}</span>
                        <span className={styles.statLabel}>Всего подписчиков</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.green}`}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.completed}</span>
                        <span className={styles.statLabel}>Прошли опрос</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.blue}`}>
                        <span style={{ fontSize: '1.5rem' }}>🌍</span>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.byGeo.russia} / {stats.byGeo.all}</span>
                        <span className={styles.statLabel}>Россия / Весь мир</span>
                    </div>
                </div>
            </div>

            {/* Sports Distribution */}
            <div className={subscriberStyles.section}>
                <h2 className={subscriberStyles.sectionTitle}>📊 Распределение по видам спорта</h2>
                <div className={subscriberStyles.sportsGrid}>
                    {Object.entries(stats.bySport).map(([sport, count]) => (
                        <div key={sport} className={subscriberStyles.sportCard}>
                            <span className={subscriberStyles.sportLabel}>
                                {SPORT_LABELS[sport] || sport}
                            </span>
                            <span className={subscriberStyles.sportCount}>{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Subscribers */}
            <div className={subscriberStyles.section}>
                <h2 className={subscriberStyles.sectionTitle}>🆕 Последние подписчики</h2>
                <div className={subscriberStyles.tableContainer}>
                    <table className={subscriberStyles.table}>
                        <thead>
                            <tr>
                                <th>Пользователь</th>
                                <th>Telegram ID</th>
                                <th>Виды спорта</th>
                                <th>Гео</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent.map((sub) => (
                                <tr key={sub.id}>
                                    <td>
                                        {sub.username ? (
                                            <a
                                                href={`https://t.me/${sub.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={subscriberStyles.usernameLink}
                                            >
                                                @{sub.username}
                                            </a>
                                        ) : (
                                            <span>{sub.firstName || 'Без имени'}</span>
                                        )}
                                    </td>
                                    <td className={subscriberStyles.telegramId}>
                                        {sub.telegramId}
                                    </td>
                                    <td>
                                        {sub.sports.length > 0
                                            ? sub.sports.map(s => SPORT_LABELS[s]?.split(' ')[0] || s).join(' ')
                                            : '—'
                                        }
                                    </td>
                                    <td>
                                        {sub.geo === 'russia' ? '🇷🇺' : '🌐'}
                                    </td>
                                    <td className={subscriberStyles.date}>
                                        {new Date(sub.createdAt).toLocaleDateString('ru-RU')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
