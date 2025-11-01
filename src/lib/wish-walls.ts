import { supabase } from './supabase'
import type {
  WishWall,
  WallWish,
  WallWishReply,
  CreateWishWallInput,
  CreateWallWishInput,
  CreateWallWishReplyInput
} from '@/types/wish-walls'

// Wish Wall CRUD operations
export const createWishWall = async (input: CreateWishWallInput) => {
  console.log('Creating wish wall with input:', input)

  const { data, error } = await supabase
    .from('wish_walls')
    .insert(input)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to create wish wall: ${error.message || JSON.stringify(error)}`)
  }

  if (!data) {
    throw new Error('No data returned from wish wall creation')
  }

  return data as WishWall
}

export const getWishWallBySlug = async (slug: string, userId?: string) => {
  const { data, error } = await supabase
    .from('wish_walls')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error

  // Check privacy
  const wall = data as WishWall
  if (wall.privacy === 'private' && wall.user_id !== userId) {
    throw new Error('This wish wall is private')
  }

  return wall
}

export const getPublicWishWalls = async (limit = 12, offset = 0) => {
  const { data, error } = await supabase
    .from('wish_walls')
    .select('*')
    .eq('privacy', 'public')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as WishWall[]
}

export const getUserWishWalls = async (userId: string) => {
  const { data, error } = await supabase
    .from('wish_walls')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as WishWall[]
}

export const updateWishWall = async (id: string, updates: Partial<WishWall>) => {
  const { data, error } = await supabase
    .from('wish_walls')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as WishWall
}

export const deleteWishWall = async (id: string) => {
  const { error } = await supabase
    .from('wish_walls')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

export const incrementWallViewCount = async (wallId: string) => {
  const { error } = await supabase.rpc('increment_wall_view_count', {
    wall_id: wallId
  })

  if (error) console.error('Error incrementing view count:', error)
}

// Wall Wishes CRUD operations
export const createWallWish = async (input: CreateWallWishInput) => {
  const { data, error } = await supabase
    .from('wall_wishes')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as WallWish
}

export const getWallWishes = async (wallId: string, userId?: string) => {
  const { data, error } = await supabase
    .from('wall_wishes')
    .select(`
      *,
      replies:wall_wish_replies(*)
    `)
    .eq('wall_id', wallId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  const wishes = data as WallWish[]

  // Check if user has liked each wish
  if (userId) {
    const { data: likes } = await supabase
      .from('wall_wish_likes')
      .select('wish_id')
      .eq('user_id', userId)
      .in('wish_id', wishes.map(w => w.id))

    const likedWishIds = new Set(likes?.map(l => l.wish_id) || [])
    wishes.forEach(wish => {
      wish.is_liked = likedWishIds.has(wish.id)
    })
  }

  return wishes
}

export const deleteWallWish = async (id: string) => {
  const { error } = await supabase
    .from('wall_wishes')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

// Like operations
export const toggleWishLike = async (wishId: string, userId?: string, ipAddress?: string) => {
  // Check if already liked
  let query = supabase
    .from('wall_wish_likes')
    .select('id')
    .eq('wish_id', wishId)

  if (userId) {
    query = query.eq('user_id', userId)
  } else if (ipAddress) {
    query = query.eq('ip_address', ipAddress)
  } else {
    throw new Error('User ID or IP address required')
  }

  const { data: existing } = await query.single()

  if (existing) {
    // Unlike
    const { error } = await supabase
      .from('wall_wish_likes')
      .delete()
      .eq('id', existing.id)

    if (error) throw error
    return { liked: false }
  } else {
    // Like
    const { error } = await supabase
      .from('wall_wish_likes')
      .insert({ wish_id: wishId, user_id: userId, ip_address: ipAddress })

    if (error) throw error
    return { liked: true }
  }
}

// Reply operations
export const createWallWishReply = async (input: CreateWallWishReplyInput) => {
  const { data, error } = await supabase
    .from('wall_wish_replies')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as WallWishReply
}

export const getWishReplies = async (wishId: string) => {
  const { data, error } = await supabase
    .from('wall_wish_replies')
    .select('*')
    .eq('wish_id', wishId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as WallWishReply[]
}

// Generate unique slug
export const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('wish_walls')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!data) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// Generate slug from title
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}
