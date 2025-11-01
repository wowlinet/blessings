# Next.js 15 Sitemap.xml 实现指南

## 1. 项目概述

本文档指导如何在 BlessYou.Today 项目中使用 Next.js 15 官方的 sitemap.ts 功能生成 sitemap.xml 文件。

**项目信息：**
- 网站域名：`https://blessyou.today/`
- Next.js 版本：15.0.0
- 数据库：Supabase PostgreSQL
- 主要功能：祝福语分享平台

## 2. Sitemap 结构分析

### 2.1 静态页面
需要包含在 sitemap 中的静态页面：
- `/` - 首页 (最高优先级)
- `/about` - 关于页面
- `/contact` - 联系页面
- `/privacy` - 隐私政策
- `/terms` - 使用条款
- `/cookies` - Cookie 政策
- `/search` - 搜索页面
- `/favorites` - 收藏夹页面
- `/profile` - 个人资料页面

### 2.2 动态路由
基于数据库内容的动态页面：
- `/categories/[slug]` - 分类页面
- `/categories/[slug]/[subcategory]` - 子分类页面
- `/blessings/[slug]` - 祝福详情页面

### 2.3 数据库表结构
```sql
-- categories 表
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- subcategories 表  
CREATE TABLE subcategories (
    id UUID PRIMARY KEY,
    category_id UUID REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- blessings 表
CREATE TABLE blessings (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. 技术实现方案

### 3.1 创建 sitemap.ts 文件

在 `src/app/sitemap.ts` 创建 sitemap 生成器：

```typescript
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const SITE_URL = 'https://blessyou.today'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面
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
    // 获取动态页面数据
    const [categoriesData, subcategoriesData, blessingsData] = await Promise.all([
      getCategories(),
      getSubcategories(),
      getBlessings(),
    ])

    // 分类页面
    const categoryPages: MetadataRoute.Sitemap = categoriesData.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 子分类页面
    const subcategoryPages: MetadataRoute.Sitemap = subcategoriesData.map((subcategory) => ({
      url: `${SITE_URL}/categories/${subcategory.category_slug}/${subcategory.slug}`,
      lastModified: new Date(subcategory.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 祝福详情页面
    const blessingPages: MetadataRoute.Sitemap = blessingsData.map((blessing) => ({
      url: `${SITE_URL}/blessings/${blessing.slug}`,
      lastModified: new Date(blessing.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...categoryPages, ...subcategoryPages, ...blessingPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 如果数据库查询失败，至少返回静态页面
    return staticPages
  }
}

// 数据库查询函数
async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

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
    console.error('Error fetching subcategories:', error)
    return []
  }

  // 转换数据格式，添加 category_slug
  return (data || []).map(item => ({
    slug: item.slug,
    updated_at: item.updated_at,
    category_slug: item.categories.slug
  }))
}

async function getBlessings() {
  const { data, error } = await supabase
    .from('blessings')
    .select('slug, updated_at')
    .eq('is_active', true)
    .not('slug', 'is', null) // 确保 slug 不为空
    .order('updated_at', { ascending: false })
    .limit(1000) // 限制数量避免性能问题

  if (error) {
    console.error('Error fetching blessings:', error)
    return []
  }

  return data || []
}
```

### 3.2 优化数据库查询

为了提高性能，需要确保数据库有适当的索引：

```sql
-- 为 sitemap 查询优化索引
CREATE INDEX IF NOT EXISTS idx_categories_sitemap ON categories(is_active, updated_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_subcategories_sitemap ON subcategories(is_active, updated_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_blessings_sitemap ON blessings(is_active, slug, updated_at DESC) WHERE is_active = true AND slug IS NOT NULL;
```

### 3.3 添加 robots.txt 支持

在 `src/app/robots.ts` 创建 robots.txt：

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: 'https://blessyou.today/sitemap.xml',
  }
}
```

## 4. 配置和部署

### 4.1 Next.js 配置

确保 `next.config.js` 支持 sitemap：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 其他配置...
  
  // 确保 sitemap 可以被正确生成
  experimental: {
    // 如果需要的话可以添加实验性功能
  }
}

module.exports = nextConfig
```

### 4.2 环境变量

确保 Supabase 连接配置正确：

```env
NEXT_PUBLIC_SUPABASE_URL=https://pohyvwtrdxcutzljipuu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 5. 测试和验证

### 5.1 本地测试

```bash
# 启动开发服务器
npm run dev

# 访问 sitemap
curl http://localhost:3000/sitemap.xml
```

### 5.2 生产环境验证

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start

# 验证 sitemap
curl https://blessyou.today/sitemap.xml
```

### 5.3 SEO 工具验证

- Google Search Console
- Bing Webmaster Tools
- 在线 sitemap 验证工具

## 6. 性能优化建议

### 6.1 缓存策略

```typescript
// 在 sitemap.ts 中添加缓存
export const revalidate = 3600 // 1小时重新生成一次
```

### 6.2 分页处理

如果数据量很大，考虑使用 sitemap 索引：

```typescript
// 可以创建多个 sitemap 文件
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 实现分页逻辑
  const page = 1
  const limit = 1000
  
  // 获取分页数据
  const blessings = await getBlessingsWithPagination(page, limit)
  
  // 返回当前页的 sitemap
  return generateSitemapForPage(blessings)
}
```

### 6.3 错误处理

```typescript
// 添加更详细的错误处理
try {
  const data = await supabase.from('categories').select('*')
  if (data.error) throw data.error
  return data.data
} catch (error) {
  console.error('Database error:', error)
  // 记录错误到监控系统
  return []
}
```

## 7. 监控和维护

### 7.1 日志记录

```typescript
// 添加详细日志
console.log(`Generated sitemap with ${totalUrls} URLs`)
console.log(`Categories: ${categoryPages.length}`)
console.log(`Subcategories: ${subcategoryPages.length}`)
console.log(`Blessings: ${blessingPages.length}`)
```

### 7.2 定期检查

- 监控 sitemap 生成时间
- 检查 URL 数量变化
- 验证 lastModified 时间准确性
- 确保所有活跃内容都包含在 sitemap 中

## 8. 总结

通过实现这个 sitemap.ts 文件，BlessYou.Today 网站将能够：

1. **自动生成 sitemap.xml**：包含所有静态和动态页面
2. **优化 SEO**：帮助搜索引擎更好地索引网站内容
3. **实时更新**：基于数据库内容自动更新 sitemap
4. **性能优化**：通过缓存和索引提高生成速度
5. **错误处理**：确保即使部分数据获取失败也能生成基本 sitemap

这个实现方案遵循 Next.js 15 的最佳实践，确保网站的 SEO 表现和搜索引擎友好性。