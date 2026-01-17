'use client'

import { useEffect, useState } from 'react'
import { Users, FileText, TrendingUp } from 'lucide-react'
import styles from './dashboard.module.css'

interface Stats {
    totalLeads: number
    todayLeads: number
    weekLeads: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken')
            try {
                const res = await fetch('/api/admin/leads?limit=1000', {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    const leads = data.leads || []
                    const today = new Date().toDateString()
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

                    setStats({
                        totalLeads: leads.length,
                        todayLeads: leads.filter((l: { createdAt: string }) =>
                            new Date(l.createdAt).toDateString() === today
                        ).length,
                        weekLeads: leads.filter((l: { createdAt: string }) =>
                            new Date(l.createdAt) > weekAgo
                        ).length
                    })
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Dashboard</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats?.totalLeads || 0}</span>
                        <span className={styles.statLabel}>Всего заявок</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.green}`}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats?.todayLeads || 0}</span>
                        <span className={styles.statLabel}>Сегодня</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.blue}`}>
                        <FileText size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats?.weekLeads || 0}</span>
                        <span className={styles.statLabel}>За неделю</span>
                    </div>
                </div>
            </div>

            <div className={styles.quickLinks}>
                <h2>Быстрые действия</h2>
                <div className={styles.linksGrid}>
                    <a href="/admin/leads" className={styles.linkCard}>
                        <Users size={20} />
                        <span>Просмотреть заявки</span>
                    </a>
                    <a href="/admin/content" className={styles.linkCard}>
                        <FileText size={20} />
                        <span>Редактировать контент</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
