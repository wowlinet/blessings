-- Final fix for the auth trigger to handle user registration properly

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into user_profiles with username from metadata
    INSERT INTO user_profiles (user_id, username, full_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle username conflicts by appending a number
        INSERT INTO user_profiles (user_id, username, full_name)
        VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)) || '_' || extract(epoch from now())::text,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
        );
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE LOG 'Error creating user profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test the trigger by manually calling it for existing user
DO $$
DECLARE
    test_user_id UUID := '11b0364c-1c69-4cf8-864e-1c339b52358b';
    test_username TEXT := 'testuser1760755821682';
    test_full_name TEXT := 'testuser1760755821682';
BEGIN
    -- Check if user exists and profile doesn't
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = test_user_id) AND 
       NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = test_user_id) THEN
        INSERT INTO user_profiles (user_id, username, full_name)
        VALUES (test_user_id, test_username, test_full_name);
        RAISE NOTICE 'Created profile for existing user %', test_user_id;
    END IF;
END $$;