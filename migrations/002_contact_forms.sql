-- Migration to add contact form and project booking tables
-- Run this in your Supabase SQL Editor

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_bookings table
CREATE TABLE IF NOT EXISTS project_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    project_title TEXT NOT NULL,
    project_description TEXT NOT NULL,
    project_type TEXT,
    subcategory TEXT,
    existing_project_details TEXT,
    languages_used TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_project_bookings_created_at ON project_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_bookings_status ON project_bookings(status);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_bookings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow all operations for authenticated users" ON contact_submissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON project_bookings
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts" ON project_bookings
    FOR INSERT WITH CHECK (true);

-- Create functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_bookings_updated_at 
    BEFORE UPDATE ON project_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
