-- Database setup script for babymoon-sleep-guide
-- Run this in your Supabase SQL Editor

-- Create babies table with proper schema
CREATE TABLE IF NOT EXISTS public.babies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own babies
CREATE POLICY "Users can view own babies" ON public.babies
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own babies
CREATE POLICY "Users can insert own babies" ON public.babies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own babies
CREATE POLICY "Users can update own babies" ON public.babies
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own babies
CREATE POLICY "Users can delete own babies" ON public.babies
    FOR DELETE USING (auth.uid() = user_id);

-- If the table already exists but is missing the user_id column, add it:
-- ALTER TABLE public.babies ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Grant necessary permissions
GRANT ALL ON public.babies TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 