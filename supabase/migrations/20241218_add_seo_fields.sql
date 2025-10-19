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