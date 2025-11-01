-- Create wish_walls table
CREATE TABLE IF NOT EXISTS wish_walls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN ('flower', 'star', 'gift')),
  cover_image_url TEXT,
  opening_message TEXT NOT NULL,
  privacy TEXT NOT NULL DEFAULT 'link_only' CHECK (privacy IN ('public', 'private', 'link_only')),
  creator_name TEXT NOT NULL,
  creator_avatar_url TEXT,
  creator_signature TEXT,
  view_count INTEGER DEFAULT 0,
  wish_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create wall_wishes table
CREATE TABLE IF NOT EXISTS wall_wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wall_id UUID NOT NULL REFERENCES wish_walls(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  emoji TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create wall_wish_likes table
CREATE TABLE IF NOT EXISTS wall_wish_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID NOT NULL REFERENCES wall_wishes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wish_id, user_id),
  UNIQUE(wish_id, ip_address)
);

-- Create wall_wish_replies table
CREATE TABLE IF NOT EXISTS wall_wish_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID NOT NULL REFERENCES wall_wishes(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes
CREATE INDEX idx_wish_walls_slug ON wish_walls(slug);
CREATE INDEX idx_wish_walls_privacy ON wish_walls(privacy);
CREATE INDEX idx_wish_walls_user_id ON wish_walls(user_id);
CREATE INDEX idx_wish_walls_created_at ON wish_walls(created_at DESC);
CREATE INDEX idx_wall_wishes_wall_id ON wall_wishes(wall_id);
CREATE INDEX idx_wall_wishes_created_at ON wall_wishes(created_at DESC);
CREATE INDEX idx_wall_wish_likes_wish_id ON wall_wish_likes(wish_id);
CREATE INDEX idx_wall_wish_replies_wish_id ON wall_wish_replies(wish_id);

-- Enable Row Level Security
ALTER TABLE wish_walls ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_wish_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_wish_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wish_walls
CREATE POLICY "Public wish walls are viewable by everyone"
  ON wish_walls FOR SELECT
  USING (privacy = 'public' OR privacy = 'link_only');

CREATE POLICY "Users can view their own private wish walls"
  ON wish_walls FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create a wish wall"
  ON wish_walls FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own wish walls"
  ON wish_walls FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wish walls"
  ON wish_walls FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for wall_wishes
CREATE POLICY "Wishes are viewable if wall is viewable"
  ON wall_wishes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wish_walls
      WHERE wish_walls.id = wall_wishes.wall_id
      AND (wish_walls.privacy = 'public' OR wish_walls.privacy = 'link_only' OR wish_walls.user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can add a wish"
  ON wall_wishes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own wishes"
  ON wall_wishes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishes"
  ON wall_wishes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for wall_wish_likes
CREATE POLICY "Likes are viewable by everyone"
  ON wall_wish_likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can like a wish"
  ON wall_wish_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can unlike their own likes"
  ON wall_wish_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for wall_wish_replies
CREATE POLICY "Replies are viewable by everyone"
  ON wall_wish_replies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add a reply"
  ON wall_wish_replies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own replies"
  ON wall_wish_replies FOR DELETE
  USING (auth.uid() = user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_wall_view_count(wall_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE wish_walls
  SET view_count = view_count + 1
  WHERE id = wall_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update wish count when a wish is added
CREATE OR REPLACE FUNCTION update_wish_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE wish_walls
    SET wish_count = wish_count + 1
    WHERE id = NEW.wall_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE wish_walls
    SET wish_count = wish_count - 1
    WHERE id = OLD.wall_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update wish count
CREATE TRIGGER update_wish_count_trigger
AFTER INSERT OR DELETE ON wall_wishes
FOR EACH ROW
EXECUTE FUNCTION update_wish_count();

-- Function to update like count when a like is added/removed
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE wall_wishes
    SET like_count = like_count + 1
    WHERE id = NEW.wish_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE wall_wishes
    SET like_count = like_count - 1
    WHERE id = OLD.wish_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update like count
CREATE TRIGGER update_like_count_trigger
AFTER INSERT OR DELETE ON wall_wish_likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

-- Function to update reply count when a reply is added/removed
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE wall_wishes
    SET reply_count = reply_count + 1
    WHERE id = NEW.wish_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE wall_wishes
    SET reply_count = reply_count - 1
    WHERE id = OLD.wish_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update reply count
CREATE TRIGGER update_reply_count_trigger
AFTER INSERT OR DELETE ON wall_wish_replies
FOR EACH ROW
EXECUTE FUNCTION update_reply_count();
