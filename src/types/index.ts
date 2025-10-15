export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  seo_keywords: string
  sort_order: number
  created_at: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  seo_keywords: string
  sort_order: number
  created_at: string
}

export interface Blessing {
  id: string
  category_id: string
  subcategory_id?: string
  title: string
  content: string
  content_type: 'short' | 'long' | 'image'
  author?: string
  occasion?: string
  language_style: 'formal' | 'casual'
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image_url?: string
  pinterest_image_url?: string
  view_count: number
  share_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  categories?: Category
  subcategories?: Subcategory
}

export interface ShareAnalytics {
  id: string
  blessing_id: string
  platform: string
  category_slug?: string
  subcategory_slug?: string
  user_agent?: string
  referrer?: string
  shared_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  blessing_id: string
  created_at: string
  blessing?: Blessing
}

export interface SearchFilters {
  query?: string
  category?: string
  subcategory?: string
  content_type?: 'short' | 'long' | 'image'
  language_style?: 'formal' | 'casual'
  is_featured?: boolean
}

export interface ShareUrls {
  facebook: string
  twitter: string
  whatsapp: string
  linkedin: string
  pinterest: string
}

export interface PinterestData {
  url: string
  media: string
  description: string
  method: string
  custom: boolean
}