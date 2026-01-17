'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, LogIn } from 'lucide-react'
import styles from './login.module.css'

export default function AdminLoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Ошибка авторизации')
            }

            localStorage.setItem('adminToken', data.token)
            router.push('/admin')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка авторизации')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <Brain size={40} className={styles.logoIcon} />
                    <span>НейроСтавки</span>
                </div>

                <h1 className={styles.title}>Вход в админ-панель</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                        <LogIn size={18} />
                    </button>
                </form>
            </div>
        </div>
    )
}
