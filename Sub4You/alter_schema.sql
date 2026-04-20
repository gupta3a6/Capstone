-- =========================================================================================
-- Phase 5 SQL Migration: Profile Upgrades & Avatars Bucket
-- INSTRUCTIONS: Copy this entire file and paste it into your Supabase Dashboard SQL Editor!
-- =========================================================================================

-- 1. Add missing fields to `profiles` table to match the Profile Creation Form
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS academic_year TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS setup_complete BOOLEAN DEFAULT false;

-- 1.5 Add missing fields to `seeker_preferences` table
ALTER TABLE public.seeker_preferences
ADD COLUMN IF NOT EXISTS move_in_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS move_out_date DATE,
ADD COLUMN IF NOT EXISTS target_zip TEXT,
ADD COLUMN IF NOT EXISTS target_city TEXT,
ADD COLUMN IF NOT EXISTS target_state TEXT,
ADD COLUMN IF NOT EXISTS budget_min INTEGER,
ADD COLUMN IF NOT EXISTS budget_max INTEGER,
ADD COLUMN IF NOT EXISTS lifestyle_preferences TEXT[] DEFAULT '{}';

-- 2. Create the 'avatars' Storage Bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies omitted since they already successfully executed for you!
