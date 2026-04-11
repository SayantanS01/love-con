import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Detect resource type (image or video/audio)
    const resourceType = file.type.startsWith('audio/') ? 'video' : 'auto'

    // Upload to Cloudinary using a Promise wrapper for the stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'love-con-sanctuary',
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    }) as any

    return NextResponse.json({ 
      url: result.secure_url,
      name: file.name
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
  }
}
