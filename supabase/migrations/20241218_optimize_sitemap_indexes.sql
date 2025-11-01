-- 为 sitemap 查询创建优化索引
-- 这些索引将显著提升 sitemap 生成的性能

-- 为分类表创建 sitemap 专用索引
CREATE INDEX IF NOT EXISTS idx_categories_sitemap 
ON categories(is_active, updated_at DESC) 
WHERE is_active = true;

-- 为子分类表创建 sitemap 专用索引
CREATE INDEX IF NOT EXISTS idx_subcategories_sitemap 
ON subcategories(is_active, updated_at DESC) 
WHERE is_active = true;

-- 为祝福表创建 sitemap 专用索引
CREATE INDEX IF NOT EXISTS idx_blessings_sitemap 
ON blessings(is_active, slug, updated_at DESC) 
WHERE is_active = true AND slug IS NOT NULL;

-- 为关联查询优化 - 子分类与分类的关联
CREATE INDEX IF NOT EXISTS idx_subcategories_category_active 
ON subcategories(category_id, is_active) 
WHERE is_active = true;

-- 为祝福表的 slug 字段创建额外索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_blessings_slug_not_null 
ON blessings(slug) 
WHERE slug IS NOT NULL AND slug != '' AND slug != 'undefined';

-- 添加注释说明索引用途
COMMENT ON INDEX idx_categories_sitemap IS 'Optimized index for sitemap generation - categories';
COMMENT ON INDEX idx_subcategories_sitemap IS 'Optimized index for sitemap generation - subcategories';
COMMENT ON INDEX idx_blessings_sitemap IS 'Optimized index for sitemap generation - blessings';
COMMENT ON INDEX idx_subcategories_category_active IS 'Optimized index for category-subcategory joins in sitemap';
COMMENT ON INDEX idx_blessings_slug_not_null IS 'Optimized index for valid blessing slugs in sitemap';