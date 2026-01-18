import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest, unauthorized } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
        return unauthorized()
    }

    try {
        let content = await prisma.landingContent.findFirst()

        if (!content) {
            // Create default content if not exists
            content = await prisma.landingContent.create({
                data: {}
            })
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error('Error fetching content:', error)
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
        return unauthorized()
    }

    try {
        const data = await request.json()

        // Get existing content
        let content = await prisma.landingContent.findFirst()

        if (content) {
            // Update existing
            content = await prisma.landingContent.update({
                where: { id: content.id },
                data: {
                    titleText: data.titleText,
                    titleFont: data.titleFont,
                    titleSize: data.titleSize,
                    titleWeight: data.titleWeight,
                    leftText: data.leftText,
                    leftFont: data.leftFont,
                    leftSize: data.leftSize,
                    leftWeight: data.leftWeight,
                    buttonText: data.buttonText,
                    buttonLink: data.buttonLink,
                    buttonFont: data.buttonFont,
                    buttonSize: data.buttonSize,
                    buttonWeight: data.buttonWeight,
                    imageUrl: data.imageUrl,
                    bottomTitle: data.bottomTitle,
                    bottomTitleFont: data.bottomTitleFont,
                    bottomTitleSize: data.bottomTitleSize,
                    bottomTitleWeight: data.bottomTitleWeight,
                    bottomText: data.bottomText,
                    bottomTextFont: data.bottomTextFont,
                    bottomTextSize: data.bottomTextSize,
                    bottomTextWeight: data.bottomTextWeight
                }
            })
        } else {
            // Create new
            content = await prisma.landingContent.create({ data })
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error('Error updating content:', error)
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }
}
