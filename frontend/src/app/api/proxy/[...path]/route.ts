import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const backendPath = `/api/${path.join('/')}`
  const url = new URL(backendPath, BACKEND_URL)
  url.search = req.nextUrl.search

  const res = await fetch(url.toString())
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const backendPath = `/api/${path.join('/')}`
  const url = new URL(backendPath, BACKEND_URL)

  const body = await req.text()

  const backendRes = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  const contentType = backendRes.headers.get('content-type') ?? ''

  // SSE streaming response — pipe through
  if (contentType.includes('text/event-stream') || backendRes.body) {
    const isSSE = contentType.includes('text/event-stream')

    if (isSSE && backendRes.body) {
      return new Response(backendRes.body, {
        status: backendRes.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      })
    }
  }

  // Regular JSON response
  const data = await backendRes.json()
  return NextResponse.json(data, { status: backendRes.status })
}
