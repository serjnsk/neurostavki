import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken, unauthorized } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const token = getTokenFromRequest(request)
    if (!token) return unauthorized()

    const payload = verifyToken(token)
    if (!payload) return unauthorized()

    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.lead.count()
        ])

        return NextResponse.json({
            leads,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Leads fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
