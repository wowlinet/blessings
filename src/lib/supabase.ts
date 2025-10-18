import { createClient } from '@supabase/supabase-js'
import { Category, Subcategory, Blessing, ShareAnalytics, User, UserFavorite, SearchFilters } from '@/types'

const supabaseUrl = 'https://pohyvwtrdxcutzljipuu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaHl2d3RyZHhjdXR6bGppcHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTMzMDMsImV4cCI6MjA3NjA4OTMwM30.2yKiNlEX0OAv3QUh9ps3v4zkVi1W6Fcu6oyf_apOLK8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      subcategories (*)
    `)
    .order('sort_order')
  
  if (error) throw error
  return data
}

export const getCategoryBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      subcategories (*)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

export const getSubcategoryBySlug = async (categorySlug: string, subcategorySlug: string) => {
  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      *,
      categories (*)
    `)
    .eq('slug', subcategorySlug)
    .eq('categories.slug', categorySlug)
    .single()
  
  if (error) throw error
  return data
}

export const getBlessings = async (filters: {
  category_id?: string
  subcategory_id?: string
  content_type?: string
  is_featured?: boolean
  limit?: number
  offset?: number
} = {}) => {
  let query = supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `)
  
  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id)
  }
  
  if (filters.subcategory_id) {
    query = query.eq('subcategory_id', filters.subcategory_id)
  }
  
  if (filters.content_type) {
    query = query.eq('content_type', filters.content_type)
  }
  
  if (filters.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured)
  }
  
  query = query.order('created_at', { ascending: false })
  
  if (filters.limit) {
    const start = filters.offset || 0
    const end = start + filters.limit - 1
    query = query.range(start, end)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Search error:', error)
    // Return empty results instead of throwing error
    return {
      blessings: [],
      total: 0,
      totalPages: 0
    }
  }
  return data
}

export const getBlessingById = async (id: string) => {
  const { data, error } = await supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const getBlessingBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to sanitize search query for PostgreSQL tsquery
const sanitizeSearchQuery = (query: string): string => {
  // Remove special characters that can cause tsquery syntax errors
  // Replace multiple spaces with single space and trim
  const cleaned = query
    .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
  
  // Split into words and join with & operator for AND search
  const words = cleaned.split(' ').filter(word => word.length > 0)
  return words.join(' & ')
}

export const searchBlessings = async (filters: {
  query: string
  category?: string
  contentType?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}) => {
  const { query: searchQuery, category, contentType, sort = 'created_at', order = 'desc', page = 1, limit = 12 } = filters
  
  // Sanitize the search query to prevent tsquery syntax errors
  const sanitizedQuery = sanitizeSearchQuery(searchQuery)
  
  // If sanitized query is empty, return empty results
  if (!sanitizedQuery) {
    return {
      blessings: [],
      total: 0,
      totalPages: 0
    }
  }
  
  let query = supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `)
    .textSearch('content', sanitizedQuery)
  
  if (category) {
    query = query.eq('categories.slug', category)
  }
  
  if (contentType) {
    query = query.eq('content_type', contentType)
  }
  
  query = query.order(sort, { ascending: order === 'asc' })
  
  const start = (page - 1) * limit
  const end = start + limit - 1
  query = query.range(start, end)
  
  try {
    const { data, error } = await query
    
    if (error) {
      console.error('Search error:', error)
      return {
        blessings: [],
        total: 0,
        totalPages: 0
      }
    }
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('blessings')
      .select('*', { count: 'exact', head: true })
      .textSearch('content', sanitizedQuery)
    
    if (countError) {
      console.error('Count error:', countError)
      // Return results without accurate count
      return {
        blessings: data || [],
        total: data?.length || 0,
        totalPages: 1
      }
    }
    
    return {
      blessings: data || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Unexpected search error:', error)
    return {
      blessings: [],
      total: 0,
      totalPages: 0
    }
  }
}

export const incrementShareCount = async (blessingId: string) => {
  const { error } = await supabase.rpc('increment_share_count', {
    blessing_id: blessingId
  })
  
  if (error) throw error
}

export const trackShare = async (blessingId: string, platform: string, categorySlug?: string, subcategorySlug?: string) => {
  const { error } = await supabase.from('share_analytics').insert({
    blessing_id: blessingId,
    platform,
    category_slug: categorySlug,
    subcategory_slug: subcategorySlug,
    shared_at: new Date().toISOString()
  })
  
  if (error) throw error
  
  // Also increment the share count
  await incrementShareCount(blessingId)
}