import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Hero from '@/components/Hero'

async function getLandingContent() {
    const content = await prisma.landingContent.findFirst()

    if (!content) {
        // Return default content if not found
        return {
            titleText: 'Ежедневные прогнозы на спорт от нейросети',
            titleFont: 'Poppins',
            titleSize: '45px',
            titleWeight: '800',
            leftText: 'НейроСтавки анализирует тысячи матчей.\n✓ 3 прогноза в день\n✓ 87% точность\n✓ 3000+ пользователей',
            leftFont: 'Poppins',
            leftSize: '16px',
            leftWeight: '400',
            buttonText: 'Получить прогноз',
            buttonLink: '#',
            buttonFont: 'Poppins',
            buttonSize: '20px',
            buttonWeight: '700',
            imageUrl: '/hero-collage.png',
            bottomTitle: 'ИИ обучен на анализе 30 088 матчей',
            bottomTitleFont: 'Poppins',
            bottomTitleSize: '24px',
            bottomTitleWeight: '700',
            bottomText: 'Построен на TensorFlow, ChatGPT 5.0 и Keras.io',
            bottomTextFont: 'Poppins',
            bottomTextSize: '14px',
            bottomTextWeight: '400'
        }
    }

    return content
}

export default async function HomePage() {
    const content = await getLandingContent()

    return (
        <main>
            <Header />
            <Hero content={content} />
        </main>
    )
}
