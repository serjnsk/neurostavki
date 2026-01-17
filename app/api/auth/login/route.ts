import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email и пароль обязательны' },
                { status: 400 }
            )
        }

        const admin = await prisma.admin.findUnique({
            where: { email }
        })

        if (!admin) {
            return NextResponse.json(
                { error: 'Неверные учетные данные' },
                { status: 401 }
            )
        }

        const isValidPassword = await bcrypt.compare(password, admin.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Неверные учетные данные' },
                { status: 401 }
            )
        }

        const token = signToken({ email: admin.email, id: admin.id })

        return NextResponse.json({ token, email: admin.email })
    } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
