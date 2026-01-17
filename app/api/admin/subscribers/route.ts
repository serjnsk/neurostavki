import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    // Check auth
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get total count
        const total = await prisma.telegramSubscriber.count()

        // Get active count
        const active = await prisma.telegramSubscriber.count({
            where: { isActive: true }
        })

        // Get completed onboarding count
        const completed = await prisma.telegramSubscriber.count({
            where: { onboardingComplete: true }
        })

        // Get distribution by geo
        const russiaCount = await prisma.telegramSubscriber.count({
            where: { geo: 'russia' }
        })
        const allWorldCount = await prisma.telegramSubscriber.count({
            where: { geo: 'all' }
        })

        // Get all subscribers to calculate sport stats
        const allSubscribers = await prisma.telegramSubscriber.findMany({
            select: { sports: true }
        })

        // Calculate sports distribution
        const sportCounts: Record<string, number> = {
            football: 0,
            hockey: 0,
            basketball: 0,
            tennis: 0,
            esports: 0,
            mma: 0
        }

        allSubscribers.forEach(sub => {
            const sports = sub.sports as string[]
            if (Array.isArray(sports)) {
                sports.forEach(sport => {
                    if (sport in sportCounts) {
                        sportCounts[sport]++
                    }
                })
            }
        })

        // Get recent subscribers
        const recent = await prisma.telegramSubscriber.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                telegramId: true,
                username: true,
                firstName: true,
                lastName: true,
                sports: true,
                geo: true,
                onboardingComplete: true,
                createdAt: true
            }
        })

        // Get daily stats for the last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentSubscribers = await prisma.telegramSubscriber.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
        })

        // Group by day
        const dailyStats: Record<string, number> = {}
        for (let i = 0; i < 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            dailyStats[date.toISOString().split('T')[0]] = 0
        }

        recentSubscribers.forEach(sub => {
            const dateKey = sub.createdAt.toISOString().split('T')[0]
            if (dateKey in dailyStats) {
                dailyStats[dateKey]++
            }
        })

        return NextResponse.json({
            total,
            active,
            completed,
            byGeo: {
                russia: russiaCount,
                all: allWorldCount
            },
            bySport: sportCounts,
            dailyStats,
            recent: recent.map(sub => ({
                ...sub,
                telegramId: sub.telegramId.toString() // BigInt to string for JSON
            }))
        })
    } catch (error) {
        console.error('Error fetching subscribers:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
