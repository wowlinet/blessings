import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data: blessing, error } = await supabase
      .from('blessings')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        subcategories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blessing:', error)
      return NextResponse.json(
        { error: 'Blessing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blessing)
  } catch (error) {
    console.error('Error in blessing API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}