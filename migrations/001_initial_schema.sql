-- Create tables for TECH24 Portfolio

-- Personal Information Table
CREATE TABLE IF NOT EXISTS personal_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    greeting VARCHAR(255),
    description TEXT,
    profile_image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    technologies TEXT[], -- Array of strings
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Web Projects Table
CREATE TABLE IF NOT EXISTS web_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    technologies TEXT[], -- Array of strings
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'Web Development',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INTEGER CHECK (level >= 0 AND level <= 100),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on personal_info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on web_projects" ON web_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tools" ON tools FOR SELECT USING (true);

-- Create policies for authenticated write access (you can modify these based on your auth needs)
CREATE POLICY "Allow authenticated insert on personal_info" ON personal_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on personal_info" ON personal_info FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on personal_info" ON personal_info FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on web_projects" ON web_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on web_projects" ON web_projects FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on web_projects" ON web_projects FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on skills" ON skills FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on skills" ON skills FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on tools" ON tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on tools" ON tools FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on tools" ON tools FOR DELETE USING (true);
