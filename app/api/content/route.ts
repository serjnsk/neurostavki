import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const section = searchParams.get('section')

        if (section) {
            const content = await prisma.contentSection.findUnique({
                where: { sectionKey: section }
            })

            if (!content) {
                return NextResponse.json({ error: 'Section not found' }, { status: 404 })
            }

            return NextResponse.json({
                section: content.sectionKey,
                content: JSON.parse(content.content),
                updatedAt: content.updatedAt
            })
        }

        // Return all sections
        const sections = await prisma.contentSection.findMany()
        const result: Record<string, unknown> = {}

        for (const s of sections) {
            result[s.sectionKey] = JSON.parse(s.content)
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Content fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
