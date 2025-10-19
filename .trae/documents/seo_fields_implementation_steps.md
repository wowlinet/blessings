# SEO 字段实现步骤

## 1. 数据库迁移

创建新的迁移文件 `supabase/migrations/20241218_add_seo_fields.sql`：

```sql
-- 为 categories 表添加 SEO 字段
ALTER TABLE categories 
ADD COLUMN seo_title VARCHAR(200),
ADD COLUMN seo_description TEXT;

-- 为 subcategories 表添加 SEO 字段  
ALTER TABLE subcategories
ADD COLUMN seo_title VARCHAR(200),
ADD COLUMN seo_description TEXT;

-- 创建索引以提升查询性能
CREATE INDEX idx_categories_seo_title ON categories(seo_title);
CREATE INDEX idx_subcategories_seo_title ON subcategories(seo_title);
```

## 2. 类型定义更新

修改 `/src/types/index.ts` 文件，更新 Category 和 Subcategory 接口：

```typescript
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  seo_keywords: string
  seo_title?: string        // 新增字段
  seo_description?: string  // 新增字段
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
  seo_title?: string        // 新增字段
  seo_description?: string  // 新增字段
  sort_order: number
  created_at: string
}
```

## 3. Categories 页面元数据更新

修改 `/src/app/categories/[slug]/page.tsx` 的 generateMetadata 函数：

```typescript
export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found | BlessYou.Today',
      description: 'The requested category could not be found.',
    }
  }

  const resolvedSearchParams = await searchParams
  const subcategory = resolvedSearchParams.subcategory 
    ? category.subcategories?.find(sub => sub.slug === resolvedSearchParams.subcategory)
    : null

  // 优先使用 seo_title，回退到原有逻辑
  const title = subcategory 
    ? (subcategory.seo_title || `${subcategory.name} ${category.name} | BlessYou.Today`)
    : (category.seo_title || `${category.name} | BlessYou.Today`)
  
  // 优先使用 seo_description，回退到原有逻辑
  const description = subcategory
    ? (subcategory.seo_description || `Find heartfelt ${subcategory.name.toLowerCase()} ${category.name.toLowerCase()} blessings. ${subcategory.description}`)
    : (category.seo_description || `Discover beautiful ${category.name.toLowerCase()} for every occasion. ${category.description}`)

  return {
    title,
    description,
    keywords: `${category.seo_keywords}${subcategory ? `, ${subcategory.seo_keywords}` : ''}`,
    openGraph: {
      title,
      description,
      url: subcategory 
        ? `https://blessyou.today/categories/${category.slug}?subcategory=${subcategory.slug}`
        : `https://blessyou.today/categories/${category.slug}`,
      siteName: 'BlessYou.Today',
      images: [
        {
          url: `/api/og-image/category/${category.slug}${subcategory ? `/${subcategory.slug}` : ''}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og-image/category/${category.slug}${subcategory ? `/${subcategory.slug}` : ''}`],
    },
  }
}
```

## 4. Subcategory 页面元数据更新

修改 `/src/app/categories/[slug]/[subcategory]/page.tsx` 的 generateMetadata 函数：

```typescript
export async function generateMetadata({ params, searchParams }: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subcategory: subcategorySlug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found | BlessYou.Today',
      description: 'The requested category could not be found.',
    }
  }

  const subcategory = await getSubcategoryBySlug(category.id, subcategorySlug)
  
  if (!subcategory) {
    return {
      title: 'Subcategory Not Found | BlessYou.Today',
      description: 'The requested subcategory could not be found.',
    }
  }

  // 优先使用 seo_title，回退到原有逻辑
  const title = subcategory.seo_title || `${subcategory.name} ${category.name} | BlessYou.Today`
  
  // 优先使用 seo_description，回退到原有逻辑
  const description = subcategory.seo_description || `Find heartfelt ${subcategory.name.toLowerCase()} ${category.name.toLowerCase()} blessings. ${subcategory.description || ''}`

  return {
    title,
    description,
    keywords: `${category.seo_keywords}, ${subcategory.seo_keywords || ''}`,
    openGraph: {
      title,
      description,
      url: `https://blessyou.today/categories/${category.slug}/${subcategory.slug}`,
      siteName: 'BlessYou.Today',
      images: [
        {
          url: `/api/og-image/category/${category.slug}/${subcategory.slug}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og-image/category/${category.slug}/${subcategory.slug}`],
    },
  }
}
```

## 5. 示例数据填充

在迁移文件中添加示例数据（可选）：

```sql
-- 示例数据更新
UPDATE categories SET 
  seo_title = 'Beautiful Daily Blessings & Inspirational Messages | BlessYou.Today',
  seo_description = 'Start your day with uplifting daily blessings, morning prayers, and evening gratitude messages. Find peace and inspiration for every moment of your day.'
WHERE slug = 'daily-blessings';

UPDATE categories SET 
  seo_title = 'Heartfelt Birthday Blessings & Wishes | BlessYou.Today', 
  seo_description = 'Celebrate special birthdays with meaningful blessings and wishes for friends, family, and loved ones. Find the perfect birthday message for every age and relationship.'
WHERE slug = 'birthday-blessings';

UPDATE subcategories SET
  seo_title = 'Good Morning Blessings & Prayers to Start Your Day | BlessYou.Today',
  seo_description = 'Begin each morning with beautiful blessings and prayers. Find inspiration, gratitude, and positive energy to start your day right.'
WHERE slug = 'morning' AND category_id = (SELECT id FROM categories WHERE slug = 'daily-blessings');

UPDATE subcategories SET
  seo_title = 'Evening Blessings & Peaceful Night Prayers | BlessYou.Today', 
  seo_description = 'End your day with peaceful evening blessings and gratitude prayers. Find comfort and tranquility for a restful night.'
WHERE slug = 'evening' AND category_id = (SELECT id FROM categories WHERE slug = 'daily-blessings');
```

## 6. 测试验证

1. 执行数据库迁移
2. 确认类型定义更新
3. 验证页面元数据正确显示
4. 检查 SEO 标签在页面源代码中的呈现

## 7. 注意事项

- 新字段为可选字段，确保向后兼容性
- 使用条件逻辑确保在字段为空时回退到原有逻辑
- 确保 OpenGraph 和 Twitter 卡片元数据也使用新的 SEO 字段
- 定期审查和优化 SEO 标题和描述内容