-- =========================================================================================
-- Sub4You Massive Database Architecture Schema
-- INSTRUCTIONS: Copy this entire file and paste it into your Supabase Dashboard SQL Editor!
-- =========================================================================================

-- 1. Unified Profiles Table (Core Auth Identity)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    university TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Seeker Preferences Table (Implicitly makes a User a Seeker)
CREATE TABLE public.seeker_preferences (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    target_city TEXT NOT NULL,
    target_state TEXT NOT NULL,
    target_zip TEXT,
    move_in_date DATE NOT NULL,
    move_out_date DATE NOT NULL,
    lifestyle_preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Property Listings Table (Implicitly makes a User a Lister)
CREATE TABLE public.property_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lister_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state_code TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    monthly_rent INTEGER NOT NULL,
    utilities INTEGER DEFAULT 0,
    bedrooms NUMERIC(3, 1) NOT NULL,
    bathrooms NUMERIC(3, 1) NOT NULL,
    property_type TEXT NOT NULL,
    gender_preference TEXT DEFAULT 'Any',
    commute_type TEXT,
    commute_minutes INTEGER,
    move_in_date DATE NOT NULL,
    move_out_date DATE NOT NULL,
    description TEXT,
    amenities TEXT[] DEFAULT '{}',
    image_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Saved Properties (Seeker Saving/Hearting Properties)
CREATE TABLE public.saved_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seeker_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.property_listings(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(seeker_profile_id, listing_id) -- Prevents saving the exact same property twice!
);

-- 5. Match Requests (Lister forcefully initiating an invite to a Seeker)
CREATE TABLE public.match_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    initiating_lister_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    listing_context_id UUID REFERENCES public.property_listings(id) ON DELETE CASCADE NOT NULL,
    target_seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(listing_context_id, target_seeker_id) -- Only one match request per property/seeker combo!
);

-- 6. Message Threads (Bridges Seekers directly to Listers freely)
CREATE TABLE public.message_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.property_listings(id) ON DELETE CASCADE NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lister_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(listing_id, seeker_id) -- Ensures only one chat thread exists between a Seeker and a specific Property!
);

-- 7. Messages (Individual lines of text inside a Thread chat)
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);



-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create Open Development Policies
CREATE POLICY "Public Read/Write" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write" ON public.seeker_preferences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write" ON public.property_listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write" ON public.saved_properties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write" ON public.match_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write" ON public.message_threads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write" ON public.messages FOR ALL USING (true) WITH CHECK (true);
