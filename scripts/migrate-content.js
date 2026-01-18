// Скрипт для миграции данных из SQLite в Supabase
// Запуск: node scripts/migrate-content.js

const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

async function migrate() {
    // Открываем старую SQLite базу
    const sqlite = new Database('./prisma/dev.db', { readonly: true });

    // Подключаемся к Supabase через Prisma
    const prisma = new PrismaClient();

    try {
        // Читаем контент из SQLite
        const content = sqlite.prepare('SELECT * FROM LandingContent LIMIT 1').get();

        if (content) {
            console.log('Найден контент в SQLite:');
            console.log('- titleText:', content.titleText?.substring(0, 50) + '...');
            console.log('- buttonText:', content.buttonText);

            // Обновляем или создаём в Supabase
            const existing = await prisma.landingContent.findFirst();

            if (existing) {
                await prisma.landingContent.update({
                    where: { id: existing.id },
                    data: {
                        titleText: content.titleText,
                        titleFont: content.titleFont,
                        titleSize: content.titleSize,
                        titleWeight: content.titleWeight,
                        leftText: content.leftText,
                        leftFont: content.leftFont,
                        leftSize: content.leftSize,
                        leftWeight: content.leftWeight,
                        buttonText: content.buttonText,
                        buttonLink: content.buttonLink,
                        buttonFont: content.buttonFont,
                        buttonSize: content.buttonSize,
                        buttonWeight: content.buttonWeight,
                        imageUrl: content.imageUrl,
                        bottomTitle: content.bottomTitle,
                        bottomTitleFont: content.bottomTitleFont,
                        bottomTitleSize: content.bottomTitleSize,
                        bottomTitleWeight: content.bottomTitleWeight,
                        bottomText: content.bottomText,
                        bottomTextFont: content.bottomTextFont,
                        bottomTextSize: content.bottomTextSize,
                        bottomTextWeight: content.bottomTextWeight,
                    }
                });
                console.log('✅ Контент обновлён в Supabase!');
            } else {
                await prisma.landingContent.create({
                    data: {
                        titleText: content.titleText,
                        titleFont: content.titleFont,
                        titleSize: content.titleSize,
                        titleWeight: content.titleWeight,
                        leftText: content.leftText,
                        leftFont: content.leftFont,
                        leftSize: content.leftSize,
                        leftWeight: content.leftWeight,
                        buttonText: content.buttonText,
                        buttonLink: content.buttonLink,
                        buttonFont: content.buttonFont,
                        buttonSize: content.buttonSize,
                        buttonWeight: content.buttonWeight,
                        imageUrl: content.imageUrl,
                        bottomTitle: content.bottomTitle,
                        bottomTitleFont: content.bottomTitleFont,
                        bottomTitleSize: content.bottomTitleSize,
                        bottomTitleWeight: content.bottomTitleWeight,
                        bottomText: content.bottomText,
                        bottomTextFont: content.bottomTextFont,
                        bottomTextSize: content.bottomTextSize,
                        bottomTextWeight: content.bottomTextWeight,
                    }
                });
                console.log('✅ Контент создан в Supabase!');
            }
        } else {
            console.log('❌ Контент не найден в SQLite');
        }

        // Мигрируем Admin
        const admins = sqlite.prepare('SELECT * FROM Admin').all();
        console.log(`\nНайдено ${admins.length} админов`);

        for (const admin of admins) {
            const existingAdmin = await prisma.admin.findUnique({
                where: { email: admin.email }
            });

            if (!existingAdmin) {
                await prisma.admin.create({
                    data: {
                        email: admin.email,
                        password: admin.password
                    }
                });
                console.log('✅ Админ создан:', admin.email);
            } else {
                console.log('⏭️ Админ уже существует:', admin.email);
            }
        }

    } catch (error) {
        console.error('Ошибка миграции:', error);
    } finally {
        sqlite.close();
        await prisma.$disconnect();
    }
}

migrate();
