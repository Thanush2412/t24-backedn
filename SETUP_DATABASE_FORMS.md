# Database Migration Instructions

## 🗄️ **Run Database Migration**

**You need to create the contact forms tables in your Supabase database:**

### **Step 1: Open Supabase SQL Editor**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`tech24-web`)
3. Click on "SQL Editor" in the left sidebar

### **Step 2: Run the Migration**
Copy and paste the contents of `migrations/002_contact_forms.sql` into the SQL Editor and execute it.

**Or run this SQL directly:**

```sql
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_bookings_created_at ON project_bookings(created_at DESC);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON project_bookings FOR INSERT WITH CHECK (true);
```

### **Step 3: Verify Tables Created**
Run this query to verify the tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('contact_submissions', 'project_bookings');
```

## ✅ **After Migration Complete**

Your forms will now:
- ✅ **Contact Form**: Save to `contact_submissions` table
- ✅ **Project Form**: Save to `project_bookings` table  
- ✅ **Admin Access**: View submissions at `/admin` (requires login)
- ✅ **API Endpoints**: 
  - `POST /api/contact`
  - `POST /api/project-booking`
  - `GET /api/contact-submissions` (admin only)
  - `GET /api/project-bookings` (admin only)
