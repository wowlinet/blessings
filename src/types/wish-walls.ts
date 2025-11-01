export type WallTheme = 'flower' | 'star' | 'gift'
export type WallPrivacy = 'public' | 'private' | 'link_only'

export interface WishWall {
  id: string
  title: string
  slug: string
  theme: WallTheme
  cover_image_url?: string
  opening_message: string
  privacy: WallPrivacy
  creator_name: string
  creator_avatar_url?: string
  creator_signature?: string
  view_count: number
  wish_count: number
  user_id?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface WallWish {
  id: string
  wall_id: string
  author_name: string
  content: string
  image_url?: string
  emoji?: string
  is_anonymous: boolean
  like_count: number
  reply_count: number
  user_id?: string
  created_at: string
  is_active: boolean
  replies?: WallWishReply[]
  is_liked?: boolean
}

export interface WallWishLike {
  id: string
  wish_id: string
  user_id?: string
  ip_address?: string
  created_at: string
}

export interface WallWishReply {
  id: string
  wish_id: string
  author_name: string
  content: string
  user_id?: string
  created_at: string
  is_active: boolean
}

export interface CreateWishWallInput {
  title: string
  slug: string
  theme: WallTheme
  cover_image_url?: string
  opening_message: string
  privacy: WallPrivacy
  creator_name: string
  creator_avatar_url?: string
  creator_signature?: string
  user_id?: string
}

export interface CreateWallWishInput {
  wall_id: string
  author_name: string
  content: string
  image_url?: string
  emoji?: string
  is_anonymous?: boolean
  user_id?: string
}

export interface CreateWallWishReplyInput {
  wish_id: string
  author_name: string
  content: string
  user_id?: string
}
