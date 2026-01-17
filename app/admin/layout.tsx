'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Brain, LayoutDashboard, FileText, LogOut } from 'lucide-react'
import styles from './admin.module.css'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Контент', icon: FileText }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        setMounted(true)
        const token = localStorage.getItem('adminToken')
        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login')
        } else {
            setIsAuthenticated(!!token)
        }
    }, [pathname, router])

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
    }

    // Don't show layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    // Show loading until client-side hydration is complete
    if (!mounted) {
        return (
            <div className={styles.loading} suppressHydrationWarning>
                <div className={styles.spinner} />
            </div>
        )
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        )
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Brain size={28} className={styles.logoIcon} />
                    <span>Admin</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className={styles.logout}>
                    <LogOut size={20} />
                    <span>Выйти</span>
                </button>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
