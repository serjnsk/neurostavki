import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

    await prisma.admin.upsert({
        where: { email: process.env.ADMIN_EMAIL || 'admin@neurostavki.ru' },
        update: {},
        create: {
            email: process.env.ADMIN_EMAIL || 'admin@neurostavki.ru',
            password: hashedPassword
        }
    })
    console.log('✅ Admin created')

    // Create landing content with default values
    const existingContent = await prisma.landingContent.findFirst()

    if (!existingContent) {
        await prisma.landingContent.create({
            data: {
                // Title
                titleText: 'Ежедневные прогнозы на спорт от нейросети',
                titleFont: 'Poppins',
                titleSize: '45px',
                titleWeight: '800',

                // Left text with list
                leftText: `НейроСтавки анализирует тысячи матчей в 6 видах спорта до мельчайших деталей. Наш ИИ обучен делать точные прогнозы.

✓ 3 прогноза в день, 7 дней в неделю
✓ 87% точность прогнозов
✓ 3 000+ довольных пользователей`,
                leftFont: 'Poppins',
                leftSize: '16px',
                leftWeight: '400',

                // Button
                buttonText: 'Получить прогноз',
                buttonLink: '#',
                buttonFont: 'Poppins',
                buttonSize: '20px',
                buttonWeight: '700',

                // Image
                imageUrl: '/hero-collage.png',

                // Bottom title
                bottomTitle: 'ИИ обучен на анализе 30 088 матчей',
                bottomTitleFont: 'Poppins',
                bottomTitleSize: '24px',
                bottomTitleWeight: '700',

                // Bottom text
                bottomText: 'Построен на TensorFlow, ChatGPT 5.0 и Keras.io',
                bottomTextFont: 'Poppins',
                bottomTextSize: '14px',
                bottomTextWeight: '400'
            }
        })
        console.log('✅ Landing content created')
    } else {
        console.log('⏭️ Landing content already exists')
    }

    console.log('🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
