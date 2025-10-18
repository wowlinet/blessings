-- Add slug column to blessings table
ALTER TABLE blessings ADD COLUMN slug VARCHAR(255);

-- Create a function to generate URL-friendly slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase and replace spaces with hyphens
    slug := lower(trim(input_text));
    -- Replace multiple spaces with single space
    slug := regexp_replace(slug, '\s+', ' ', 'g');
    -- Replace spaces with hyphens
    slug := replace(slug, ' ', '-');
    -- Remove special characters except hyphens and alphanumeric
    slug := regexp_replace(slug, '[^a-z0-9\-]', '', 'g');
    -- Remove multiple consecutive hyphens
    slug := regexp_replace(slug, '-+', '-', 'g');
    -- Remove leading and trailing hyphens
    slug := trim(slug, '-');
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Generate slugs for existing blessings based on title
UPDATE blessings 
SET slug = generate_slug(title) 
WHERE slug IS NULL;

-- Handle duplicate slugs by adding numeric suffixes
DO $$
DECLARE
    rec RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    -- Find duplicate slugs
    FOR rec IN 
        SELECT slug, array_agg(id ORDER BY created_at) as ids
        FROM blessings 
        WHERE slug IS NOT NULL
        GROUP BY slug 
        HAVING count(*) > 1
    LOOP
        -- Keep the first one as is, add suffixes to others
        FOR i IN 2..array_length(rec.ids, 1) LOOP
            counter := 2;
            new_slug := rec.slug || '-' || counter;
            
            -- Find a unique slug
            WHILE EXISTS (SELECT 1 FROM blessings WHERE slug = new_slug) LOOP
                counter := counter + 1;
                new_slug := rec.slug || '-' || counter;
            END LOOP;
            
            -- Update the blessing with the new unique slug
            UPDATE blessings SET slug = new_slug WHERE id = rec.ids[i];
        END LOOP;
    END LOOP;
END $$;

-- Add NOT NULL constraint after populating slugs
ALTER TABLE blessings ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint on slug
ALTER TABLE blessings ADD CONSTRAINT blessings_slug_unique UNIQUE (slug);

-- Add index for better query performance
CREATE INDEX idx_blessings_slug ON blessings (slug);

-- Create a trigger to automatically generate slug for new blessings
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Only generate slug if it's not provided
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.title);
        final_slug := base_slug;
        
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM blessings WHERE slug = final_slug AND id != COALESCE(NEW.id, 0)) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
CREATE TRIGGER trigger_auto_generate_slug
    BEFORE INSERT OR UPDATE ON blessings
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_slug();