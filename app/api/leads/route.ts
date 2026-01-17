import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    phone: z.string().optional(),
    message: z.string().optional()
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = leadSchema.parse(body)

        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                message: data.message || null
            }
        })

        return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            )
        }
        console.error('Lead creation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
