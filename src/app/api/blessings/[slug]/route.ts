import { NextRequest, NextResponse } from 'next/server'
import { getBlessingBySlug } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const blessing = await getBlessingBySlug(slug)

    return NextResponse.json(blessing)
  } catch (error) {
    console.error('Error in blessing API:', error)
    return NextResponse.json(
      { error: 'Blessing not found' },
      { status: 404 }
    )
  }
}