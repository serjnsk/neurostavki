import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'НейроСтавки — Умные прогнозы на спорт с помощью ИИ',
    description: 'Нейросеть анализирует тысячи матчей и даёт точные прогнозы. Доверьтесь искусственному интеллекту для успешных ставок.',
    keywords: 'нейросеть, ставки на спорт, прогнозы, ИИ, искусственный интеллект, спортивные прогнозы',
    openGraph: {
        title: 'НейроСтавки — Умные прогнозы на спорт',
        description: 'Нейросеть для точных спортивных прогнозов',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    )
}
