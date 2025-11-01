import { MetadataRoute } from 'next'

const SITE_URL = 'https://blessyou.today'

// 缓存 1 小时
export const revalidate = 3600

// 硬编码的分类和子分类数据
const CATEGORIES_DATA = [
  {
    slug: 'daily-blessings',
    subcategories: ['morning', 'evening', 'today']
  },
  {
    slug: 'birthday-blessings',
    subcategories: ['friends', 'family', 'kids', 'milestone']
  },
  {
    slug: 'wedding-anniversary-blessings',
    subcategories: ['bride', 'groom', 'anniversary', 'toast']
  },
  {
    slug: 'religious-blessings',
    subcategories: ['christian', 'islamic', 'jewish', 'interfaith']
  },
  {
    slug: 'life-events',
    subcategories: ['new-baby', 'graduation', 'new-job', 'recovery']
  },
  {
    slug: 'holiday-blessings',
    subcategories: ['christmas', 'easter', 'thanksgiving', 'new-year']
  },
  {
    slug: 'sympathy-healing',
    subcategories: ['condolences', 'illness', 'strength']
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startTime = Date.now()
  
  try {
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

    // 生成分类页面
    const categoryPages: MetadataRoute.Sitemap = CATEGORIES_DATA.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 生成子分类页面
    const subcategoryPages: MetadataRoute.Sitemap = []
    CATEGORIES_DATA.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategoryPages.push({
          url: `${SITE_URL}/categories/${category.slug}/${subcategory}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      })
    })

    const allPages = [...staticPages, ...categoryPages, ...subcategoryPages]
    
    // 记录生成统计
    const endTime = Date.now()
    console.log(`Sitemap generated in ${endTime - startTime}ms`)
    console.log(`Total URLs: ${allPages.length}`)
    console.log(`- Static pages: ${staticPages.length}`)
    console.log(`- Category pages: ${categoryPages.length}`)
    console.log(`- Subcategory pages: ${subcategoryPages.length}`)

    return allPages

  } catch (error) {
    console.error('Critical error generating sitemap:', error)
    // 发生严重错误时，至少返回静态页面
    const fallbackPages: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ]
    return fallbackPages
  }
}