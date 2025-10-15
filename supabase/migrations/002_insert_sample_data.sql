-- Insert categories
INSERT INTO categories (name, slug, description, seo_keywords, sort_order) VALUES
('Daily Blessings', 'daily-blessings', 'Start and end your day with meaningful blessings for morning, evening, and everyday moments', 'daily blessings, morning blessings, evening blessings, good morning blessings', 1),
('Birthday Blessings', 'birthday-blessings', 'Heartfelt birthday wishes and blessings for friends, family, and loved ones of all ages', 'happy birthday blessings, birthday wishes, birthday quotes, birthday prayers', 2),
('Wedding & Anniversary Blessings', 'wedding-anniversary-blessings', 'Beautiful blessings for weddings, anniversaries, and celebrating love and commitment', 'wedding blessings, anniversary blessings, marriage blessings, wedding prayers', 3),
('Religious Blessings', 'religious-blessings', 'Spiritual blessings from various faith traditions including Christian, Islamic, Jewish, and more', 'Christian blessings, Islamic blessings, religious prayers, spiritual blessings', 4),
('Life Events', 'life-events', 'Blessings for major life milestones including new babies, graduations, new jobs, and recovery', 'new baby blessings, graduation blessings, new job blessings, life milestone blessings', 5),
('Holiday Blessings', 'holiday-blessings', 'Seasonal and holiday blessings for Christmas, Easter, Thanksgiving, and other celebrations', 'Christmas blessings, Easter blessings, Thanksgiving blessings, holiday prayers', 6),
('Sympathy & Healing', 'sympathy-healing', 'Comforting blessings for times of loss, illness, and healing with messages of hope and strength', 'sympathy blessings, healing blessings, comfort prayers, condolence messages', 7);

-- Insert subcategories for Daily Blessings
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'daily-blessings'), 'Morning Blessings', 'morning', 'Start your day with uplifting morning blessings and prayers', 'good morning blessings, morning prayers, daily morning blessings', 1),
((SELECT id FROM categories WHERE slug = 'daily-blessings'), 'Evening Blessings', 'evening', 'End your day peacefully with evening blessings and gratitude', 'good evening blessings, evening prayers, nighttime blessings', 2),
((SELECT id FROM categories WHERE slug = 'daily-blessings'), 'Today''s Blessing', 'today', 'Special blessing for today and everyday moments', 'today blessings, daily inspiration, everyday blessings', 3);

-- Insert subcategories for Birthday Blessings
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'birthday-blessings'), 'For Friends', 'friends', 'Birthday blessings and wishes for your dear friends', 'birthday blessings for friends, friend birthday wishes', 1),
((SELECT id FROM categories WHERE slug = 'birthday-blessings'), 'For Family', 'family', 'Heartfelt birthday blessings for family members', 'family birthday blessings, birthday wishes for family', 2),
((SELECT id FROM categories WHERE slug = 'birthday-blessings'), 'For Kids', 'kids', 'Fun and loving birthday blessings for children', 'kids birthday blessings, children birthday wishes', 3),
((SELECT id FROM categories WHERE slug = 'birthday-blessings'), 'Milestone Ages', 'milestone', 'Special blessings for milestone birthdays like 18th, 21st, 50th', 'milestone birthday blessings, special age birthday wishes', 4);

-- Insert subcategories for Wedding & Anniversary
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'wedding-anniversary-blessings'), 'For Bride', 'bride', 'Beautiful blessings for the bride on her special day', 'bride blessings, wedding blessings for bride', 1),
((SELECT id FROM categories WHERE slug = 'wedding-anniversary-blessings'), 'For Groom', 'groom', 'Meaningful blessings for the groom on his wedding day', 'groom blessings, wedding blessings for groom', 2),
((SELECT id FROM categories WHERE slug = 'wedding-anniversary-blessings'), 'For Parents', 'parents', 'Anniversary blessings for parents and married couples', 'anniversary blessings for parents, marriage blessings', 3),
((SELECT id FROM categories WHERE slug = 'wedding-anniversary-blessings'), 'Toast Blessings', 'toast', 'Wedding toast blessings and speeches', 'wedding toast blessings, wedding speech blessings', 4);

-- Insert subcategories for Religious Blessings
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'religious-blessings'), 'Christian', 'christian', 'Christian blessings, prayers, and biblical verses', 'Christian blessings, biblical blessings, Christian prayers', 1),
((SELECT id FROM categories WHERE slug = 'religious-blessings'), 'Islamic', 'islamic', 'Islamic blessings, duas, and prayers from the Quran', 'Islamic blessings, Islamic duas, Muslim prayers', 2),
((SELECT id FROM categories WHERE slug = 'religious-blessings'), 'Jewish', 'jewish', 'Jewish blessings, prayers, and traditional wishes', 'Jewish blessings, Hebrew blessings, Jewish prayers', 3),
((SELECT id FROM categories WHERE slug = 'religious-blessings'), 'Interfaith', 'interfaith', 'Universal spiritual blessings for all faiths', 'interfaith blessings, universal prayers, spiritual blessings', 4);

-- Insert subcategories for Life Events
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'life-events'), 'New Baby', 'new-baby', 'Blessings for newborns and new parents', 'new baby blessings, baby blessing prayers, newborn blessings', 1),
((SELECT id FROM categories WHERE slug = 'life-events'), 'Graduation', 'graduation', 'Graduation blessings for students and achievements', 'graduation blessings, graduation prayers, student blessings', 2),
((SELECT id FROM categories WHERE slug = 'life-events'), 'New Job', 'new-job', 'Blessings for new career opportunities and success', 'new job blessings, career blessings, work success prayers', 3),
((SELECT id FROM categories WHERE slug = 'life-events'), 'Recovery', 'recovery', 'Healing and recovery blessings for health and wellness', 'recovery blessings, healing prayers, health blessings', 4);

-- Insert subcategories for Holiday Blessings
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'holiday-blessings'), 'Christmas', 'christmas', 'Christmas blessings and holiday wishes for family', 'Christmas blessings, Christmas prayers, holiday blessings', 1),
((SELECT id FROM categories WHERE slug = 'holiday-blessings'), 'Easter', 'easter', 'Easter blessings and resurrection celebrations', 'Easter blessings, Easter prayers, resurrection blessings', 2),
((SELECT id FROM categories WHERE slug = 'holiday-blessings'), 'Thanksgiving', 'thanksgiving', 'Thanksgiving blessings and gratitude prayers', 'Thanksgiving blessings, gratitude prayers, thankful blessings', 3),
((SELECT id FROM categories WHERE slug = 'holiday-blessings'), 'New Year', 'new-year', 'New Year blessings and fresh start wishes', 'New Year blessings, new year prayers, fresh start blessings', 4);

-- Insert subcategories for Sympathy & Healing
INSERT INTO subcategories (category_id, name, slug, description, seo_keywords, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'sympathy-healing'), 'Condolences', 'condolences', 'Sympathy blessings for times of loss and grief', 'condolence blessings, sympathy prayers, grief comfort', 1),
((SELECT id FROM categories WHERE slug = 'sympathy-healing'), 'Illness', 'illness', 'Healing blessings for those facing illness', 'illness blessings, healing prayers, sick blessings', 2),
((SELECT id FROM categories WHERE slug = 'sympathy-healing'), 'Strength', 'strength', 'Blessings for strength during difficult times', 'strength blessings, courage prayers, difficult times blessings', 3);