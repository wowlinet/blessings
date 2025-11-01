# Sitemap.xml 实现步骤

## 实施概述

本文档提供了在 BlessYou.Today 项目中实现 Next.js 15 官方 sitemap.ts 的详细步骤和代码。

## 步骤 1: 创建 sitemap.ts 文件

**文件路径**: `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const SITE_URL = 'https://blessyou.today'

// 缓存 1 小时
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startTime = Date.now()
  
  // 静态页面配置
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/favorites`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  try {
    // 并行获取所有动态数据
    const [categoriesResult, subcategoriesResult, blessingsResult] = await Promise.allSettled([
      getCategories(),
      getSubcategories(),
      getBlessings(),
    ])

    // 处理分类页面
    const categoryPages: MetadataRoute.Sitemap = []
    if (categoriesResult.status === 'fulfilled') {
      categoryPages.push(...categoriesResult.value.map((category) => ({
        url: `${SITE_URL}/categories/${category.slug}`,
        lastModified: new Date(category.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })))
    } else {
      console.error('Failed to fetch categories for sitemap:', categoriesResult.reason)
    }

    // 处理子分类页面
    const subcategoryPages: MetadataRoute.Sitemap = []
    if (subcategoriesResult.status === 'fulfilled') {
      subcategoryPages.push(...subcategoriesResult.value.map((subcategory) => ({
        url: `${SITE_URL}/categories/${subcategory.category_slug}/${subcategory.slug}`,
        lastModified: new Date(subcategory.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })))
    } else {
      console.error('Failed to fetch subcategories for sitemap:', subcategoriesResult.reason)
    }

    // 处理祝福详情页面
    const blessingPages: MetadataRoute.Sitemap = []
    if (blessingsResult.status === 'fulfilled') {
      blessingPages.push(...blessingsResult.value.map((blessing) => ({
        url: `${SITE_URL}/blessings/${blessing.slug}`,
        lastModified: new Date(blessing.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })))
    } else {
      console.error('Failed to fetch blessings for sitemap:', blessingsResult.reason)
    }

    const allPages = [...staticPages, ...categoryPages, ...subcategoryPages, ...blessingPages]
    
    // 记录生成统计
    const endTime = Date.now()
    console.log(`Sitemap generated in ${endTime - startTime}ms`)
    console.log(`Total URLs: ${allPages.length}`)
    console.log(`- Static pages: ${staticPages.length}`)
    console.log(`- Category pages: ${categoryPages.length}`)
    console.log(`- Subcategory pages: ${subcategoryPages.length}`)
    console.log(`- Blessing pages: ${blessingPages.length}`)

    return allPages

  } catch (error) {
    console.error('Critical error generating sitemap:', error)
    // 发生严重错误时，至少返回静态页面
    return staticPages
  }
}

// 获取分类数据
async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories for sitemap:', error)
    throw error
  }

  return data || []
}

// 获取子分类数据
async function getSubcategories() {
  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      slug, 
      updated_at,
      categories!inner(slug)
    `)
    .eq('is_active', true)
    .eq('categories.is_active', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching subcategories for sitemap:', error)
    throw error
  }

  // 转换数据格式
  return (data || []).map(item => ({
    slug: item.slug,
    updated_at: item.updated_at,
    category_slug: item.categories.slug
  }))
}

// 获取祝福数据
async function getBlessings() {
  const { data, error } = await supabase
    .from('blessings')
    .select('slug, updated_at')
    .eq('is_active', true)
    .not('slug', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(2000) // 限制数量以避免性能问题

  if (error) {
    console.error('Error fetching blessings for sitemap:', error)
    throw error
  }

  // 过滤掉无效的 slug
  return (data || []).filter(blessing => 
    blessing.slug && 
    blessing.slug.trim() !== '' && 
    blessing.slug !== 'undefined'
  )
}
```

## 步骤 2: 创建 robots.txt

**文件路径**: `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/debug/',
          '/*.json$',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/debug/'],
      },
    ],
    sitemap: 'https://blessyou.today/sitemap.xml',
    host: 'https://blessyou.today',
  }
}
```

## 步骤 3: 数据库索引优化

**执行 SQL 脚本**:

```sql
-- 为 sitemap 查询创建优化索引
CREATE INDEX IF NOT EXISTS idx_categories_sitemap 
ON categories(is_active, updated_at DESC) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_subcategories_sitemap 
ON subcategories(is_active, updated_at DESC) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_blessings_sitemap 
ON blessings(is_active, slug, updated_at DESC) 
WHERE is_active = true AND slug IS NOT NULL;

-- 为关联查询优化
CREATE INDEX IF NOT EXISTS idx_subcategories_category_active 
ON subcategories(category_id, is_active) 
WHERE is_active = true;
```

## 步骤 4: 更新 Supabase 类型定义

**文件路径**: `src/types/index.ts` (如果需要更新)

```typescript
// 确保类型定义包含 sitemap 需要的字段
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Blessing {
  id: string
  category_id: string
  subcategory_id: string
  title: string
  content: string
  content_type: 'short' | 'long' | 'image'
  author?: string
  slug?: string
  image_url?: string
  pinterest_image_url?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image_url?: string
  share_count: number
  view_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
  subcategories?: Subcategory
}
```

## 步骤 5: 测试和验证

### 5.1 本地测试脚本

创建测试脚本 `scripts/test-sitemap.js`:

```javascript
const https = require('https')

const testSitemap = async () => {
  const url = process.env.NODE_ENV === 'production' 
    ? 'https://blessyou.today/sitemap.xml'
    : 'http://localhost:3000/sitemap.xml'
  
  console.log(`Testing sitemap: ${url}`)
  
  try {
    const response = await fetch(url)
    const text = await response.text()
    
    console.log('Status:', response.status)
    console.log('Content-Type:', response.headers.get('content-type'))
    console.log('Content length:', text.length)
    
    // 统计 URL 数量
    const urlCount = (text.match(/<url>/g) || []).length
    console.log('Total URLs:', urlCount)
    
    // 检查是否包含关键页面
    const hasHomepage = text.includes('<loc>https://blessyou.today</loc>')
    const hasCategories = text.includes('/categories/')
    const hasBlessings = text.includes('/blessings/')
    
    console.log('Contains homepage:', hasHomepage)
    console.log('Contains categories:', hasCategories)
    console.log('Contains blessings:', hasBlessings)
    
  } catch (error) {
    console.error('Error testing sitemap:', error)
  }
}

testSitemap()
```

### 5.2 验证清单

- [ ] sitemap.xml 可以正常访问
- [ ] 包含所有静态页面
- [ ] 包含所有活跃的分类页面
- [ ] 包含所有活跃的子分类页面
- [ ] 包含所有活跃的祝福详情页面
- [ ] lastModified 时间正确
- [ ] URL 格式正确
- [ ] robots.txt 包含 sitemap 引用
- [ ] 性能测试通过（生成时间 < 5秒）

## 步骤 6: 部署和监控

### 6.1 部署检查

```bash
# 构建项目
npm run build

# 检查构建输出
ls -la .next/

# 启动生产服务器
npm start

# 测试 sitemap
curl -I https://blessyou.today/sitemap.xml
```

### 6.2 监控设置

添加到监控系统的检查项：
- sitemap.xml 响应时间
- sitemap.xml 内容大小
- URL 数量变化
- 错误日志监控

### 6.3 SEO 工具提交

1. **Google Search Console**
   - 提交 sitemap: `https://blessyou.today/sitemap.xml`
   - 监控索引状态

2. **Bing Webmaster Tools**
   - 提交 sitemap
   - 检查爬取统计

## 预期结果

实施完成后，您将获得：

1. **自动生成的 sitemap.xml**，包含：
   - 9 个静态页面
   - 7 个分类页面（基于当前数据）
   - 28 个子分类页面（基于当前数据）
   - 所有活跃的祝福详情页面

2. **优化的性能**：
   - 缓存 1 小时
   - 数据库查询优化
   - 错误处理机制

3. **SEO 改进**：
   - 搜索引擎更好地发现内容
   - 更快的索引速度
   - 更好的搜索排名

4. **自动维护**：
   - 基于数据库内容自动更新
   - 新内容自动包含
   - 删除的内容自动移除

这个实现将显著提升 BlessYou.Today 网站的 SEO 表现和搜索引擎可见性。