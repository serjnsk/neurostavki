import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const content = await prisma.landingContent.findFirst()

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 })
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error('Content fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
