-- =========================================================================================
-- Sub4You Capstone Presentation Seed Script
-- WARNING: Run this in your Supabase SQL Editor to inject rich, demo-ready fake data!
-- =========================================================================================

-- We create a PL/pgSQL block to easily handle creating all the relational data
DO $$
DECLARE
  -- Static UUIDs to easily link users to properties without guessing IDs
  lister1_id UUID := '11111111-1111-1111-1111-111111111111';
  lister2_id UUID := '22222222-2222-2222-2222-222222222222';
  lister3_id UUID := '33333333-3333-3333-3333-333333333333';
  
  seeker1_id UUID := '44444444-4444-4444-4444-444444444444';
  seeker2_id UUID := '55555555-5555-5555-5555-555555555555';
  seeker3_id UUID := '66666666-6666-6666-6666-666666666666';

  prop1_id UUID := '77777777-7777-7777-7777-777777777777';
  prop2_id UUID := '88888888-8888-8888-8888-888888888888';
  prop3_id UUID := '99999999-9999-9999-9999-999999999999';

BEGIN

  -- ----------------------------------------------------
  -- 1. BYPASS AUTH & INSERT DUMMY ACCOUNTS (auth.users)
  -- ----------------------------------------------------
  -- This tricks the relational foreign-keys into allowing these users to exist.
  -- The crazy string for encrypted_password allows them to login with password: 'password123' if you ever wanted.
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES 
    (lister1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'shannon.demo@college.edu', '$2a$10$w8T.N0c8F4lqXmRQ8.y.Oe5c1N0/PZ4G1rQh6e5D7V8o2O9l5P.T2', now(), now(), now()),
    (lister2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alex.demo@college.edu', '$2a$10$w8T.N0c8F4lqXmRQ8.y.Oe5c1N0/PZ4G1rQh6e5D7V8o2O9l5P.T2', now(), now(), now()),
    (lister3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mike.demo@college.edu', '$2a$10$w8T.N0c8F4lqXmRQ8.y.Oe5c1N0/PZ4G1rQh6e5D7V8o2O9l5P.T2', now(), now(), now()),
    (seeker1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah.demo@college.edu', '$2a$10$w8T.N0c8F4lqXmRQ8.y.Oe5c1N0/PZ4G1rQh6e5D7V8o2O9l5P.T2', now(), now(), now()),
    (seeker2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jason.demo@college.edu', '$2a$10$w8T.N0c8F4lqXmRQ8.y.Oe5c1N0/PZ4G1rQh6e5D7V8o2O9l5P.T2', now(), now(), now()),
    (seeker3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'emily.demo@college.edu', '$2a$10$w8T.N0c8F4lqXmRQ8.y.Oe5c1N0/PZ4G1rQh6e5D7V8o2O9l5P.T2', now(), now(), now())
  ON CONFLICT (id) DO NOTHING;


  -- ----------------------------------------------------
  -- 2. CREATE BEAUTIFUL DEMO PROFILES (public.profiles)
  -- ----------------------------------------------------
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, age, gender, major, academic_year, university, bio, setup_complete)
  VALUES 
    -- Listers
    (lister1_id, 'Shannon', 'Thomas', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', 21, 'Female', 'Architecture', 'Senior', 'State University', 'Hi! I am graduating early and looking for someone super clean to take over the remainder of my lease. I love board games and baking!', true),
    (lister2_id, 'Alex', 'Jenkins', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', 22, 'Male', 'Computer Science', 'Graduate', 'State University', 'Big foodie and very social! I spend most of my time studying at the library or at the gym.', true),
    (lister3_id, 'Mike', 'Otsuka', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', 20, 'Male', 'Business', 'Junior', 'State University', 'Very chill, usually just play fifa with my roommates. Looking to sublease for the summer while I intern in the city!', true),
    
    -- Seekers
    (seeker1_id, 'Sarah', 'Lee', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', 20, 'Female', 'Nursing', 'Sophomore', 'State University', 'Quiet, studious, and very organized! Looking for a 4-month lease for the summer.', true),
    (seeker2_id, 'Jason', 'Chen', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80', 23, 'Male', 'Marketing', 'Graduate', 'State University', 'Working professional. Clean, easy-going, and looking for a private room with parking if possible.', true),
    (seeker3_id, 'Emily', 'Russo', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80', 19, 'Female', 'Biology', 'Freshman', 'State University', 'Just looking to move off campus next semester! I love dogs but dont have any pets myself.', true)
  ON CONFLICT (id) DO NOTHING;


  -- ----------------------------------------------------
  -- 3. CREATE STUNNING PROPERTY LISTINGS
  -- ----------------------------------------------------
  INSERT INTO public.property_listings (id, lister_id, title, street_address, city, state, zipcode, lat, lng, monthly_rent, bedrooms, bathrooms, property_type, gender_preference, available_from, available_until, description, is_active)
  VALUES 
    (prop1_id, lister1_id, 'Sunny Private Bed & Bath Near Campus', '123 College Ave', 'College Town', 'ST', '12345', 39.1330, -84.5151, 850, 1.0, 1.0, 'Apartment', 'Female Only', '2026-05-01', '2026-08-31', 'Beautiful fully furnished room in a 3x3 apartment. You get your own private bathroom and walk-in closet! My roommates are super quiet and respectful. 5 min walk to campus.', true),
    
    (prop2_id, lister2_id, 'Huge Downtown Loft Space - Men Only', '456 Main St', 'College Town', 'ST', '12345', 39.1310, -84.5120, 1100, 1.0, 1.0, 'House', 'Male Only', '2026-06-01', '2026-12-31', 'Amazing loft right above the best bars downtown. Exposed brick, 15ft ceilings, huge TV. I am leaving for 6 months to study abroad.', true),
    
    (prop3_id, lister3_id, 'Cozy Studio Apartment - Entire Place!', '789 Quiet Lane', 'College Town', 'ST', '12345', 39.1350, -84.5180, 1350, 1.0, 1.0, 'Studio', 'Any', '2026-08-01', '2027-05-31', 'You get the entire studio to yourself! No roommates to worry about. Hardwood floors, updated kitchen with granite countertops, and pet friendly.', true)
  ON CONFLICT (id) DO UPDATE SET lat = EXCLUDED.lat, lng = EXCLUDED.lng;

  -- Insert Listing Images manually to map to the new schema
  INSERT INTO public.listing_images (listing_id, image_url, order_index)
  VALUES 
    (prop1_id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 0),
    (prop1_id, 'https://images.unsplash.com/photo-1502672260266-1c1ea2a5098c?w=800&q=80', 1),
    (prop2_id, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', 0),
    (prop3_id, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', 0)
  ON CONFLICT DO NOTHING;


  -- ----------------------------------------------------
  -- 4. CREATE SEEKER PREFERENCES (So Listers can "Search Candidates")
  -- ----------------------------------------------------
  INSERT INTO public.seeker_preferences (user_id, budget_min, budget_max, city, state, move_in_date, move_out_date, lifestyle_preferences)
  VALUES 
    (seeker1_id, 400, 900, 'College Town', 'ST', '2026-05-01', '2026-08-31', '["Clean", "Quiet", "Study at Library"]'::jsonb),
    (seeker2_id, 800, 1400, 'College Town', 'ST', '2026-06-01', '2026-12-31', '["No Smoking", "Gym Enthusiast", "Car Owner"]'::jsonb),
    (seeker3_id, 500, 1000, 'College Town', 'ST', '2026-08-01', '2027-05-31', '["Social", "Pets Allowed", "Vegetarian/Vegan"]'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

END $$;
