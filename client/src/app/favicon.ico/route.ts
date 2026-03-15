import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Minimal 16x16 PNG (transparent) used when logo is missing
const FALLBACK_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjgPz/fxkGABfXAf2+W1gZAAAAAElFTkSuQmCC',
  'base64'
)

export async function GET() {
  try {
    const faviconPath = path.join(process.cwd(), 'public', 'Physiofi Logo icon.png')
    if (fs.existsSync(faviconPath)) {
      const fileBuffer = fs.readFileSync(faviconPath)
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  } catch {
    // Fall through to fallback
  }
  return new NextResponse(FALLBACK_PNG, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
