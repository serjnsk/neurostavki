'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Calendar, User } from 'lucide-react'
import styles from './leads.module.css'

interface Lead {
    id: number
    name: string
    email: string
    phone: string | null
    message: string | null
    createdAt: string
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true)
            const token = localStorage.getItem('adminToken')

            try {
                const res = await fetch(`/api/admin/leads?page=${page}&limit=10`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setLeads(data.leads)
                    setTotalPages(data.pagination.pages)
                }
            } catch (error) {
                console.error('Failed to fetch leads:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeads()
    }, [page])

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Заявки</h1>

            {isLoading ? (
                <div className={styles.loading}>Загрузка...</div>
            ) : leads.length === 0 ? (
                <div className={styles.empty}>Заявок пока нет</div>
            ) : (
                <>
                    <div className={styles.table}>
                        <div className={styles.header}>
                            <div>Имя</div>
                            <div>Контакты</div>
                            <div>Дата</div>
                        </div>

                        {leads.map((lead) => (
                            <div key={lead.id} className={styles.row}>
                                <div className={styles.name}>
                                    <User size={16} />
                                    <span>{lead.name}</span>
                                </div>
                                <div className={styles.contacts}>
                                    <div className={styles.contact}>
                                        <Mail size={14} />
                                        <span>{lead.email}</span>
                                    </div>
                                    {lead.phone && (
                                        <div className={styles.contact}>
                                            <Phone size={14} />
                                            <span>{lead.phone}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.date}>
                                    <Calendar size={14} />
                                    <span>{formatDate(lead.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={styles.pageBtn}
                            >
                                Назад
                            </button>
                            <span className={styles.pageInfo}>
                                Страница {page} из {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={styles.pageBtn}
                            >
                                Далее
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
