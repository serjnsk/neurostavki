import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { verifyToken, getTokenFromRequest, unauthorized } from '@/lib/auth'

export async function POST(request: NextRequest) {
    // Verify auth
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
        return unauthorized()
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const ext = file.name.split('.').pop()
        const filename = `hero-${timestamp}.${ext}`

        // Convert to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename)
        await writeFile(uploadPath, buffer)

        return NextResponse.json({
            url: `/uploads/${filename}`,
            message: 'File uploaded successfully'
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
