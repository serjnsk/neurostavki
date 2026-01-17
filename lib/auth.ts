import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

export function signToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { email: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { email: string }
    } catch {
        return null
    }
}

export function getTokenFromRequest(request: Request): string | null {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7)
    }
    return null
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
