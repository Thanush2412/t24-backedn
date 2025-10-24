// Supabase Database Checker and Table Creator
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://rsioktfxukraqlwowcgc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function checkAndCreateTables() {
  console.log('🔍 Checking Supabase database tables...\n');

  try {
    // Check if contact_submissions table exists
    console.log('1. Checking contact_submissions table...');
    const { data: contactData, error: contactError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);

    if (contactError) {
      console.log('❌ contact_submissions table does not exist or has issues');
      console.log('Error:', contactError.message);
      
      // Create contact_submissions table
      console.log('\n📝 Creating contact_submissions table...');
      const createContactTableSQL = `
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(500),
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createContactError } = await supabase.rpc('exec_sql', {
        sql: createContactTableSQL
      });
      
      if (createContactError) {
        console.log('❌ Failed to create contact_submissions table:', createContactError.message);
        console.log('📋 Manual SQL to run in Supabase SQL Editor:');
        console.log(createContactTableSQL);
      } else {
        console.log('✅ contact_submissions table created successfully');
      }
    } else {
      console.log('✅ contact_submissions table exists and is accessible');
      console.log('📊 Sample data:', contactData);
    }

    // Check if project_bookings table exists
    console.log('\n2. Checking project_bookings table...');
    const { data: projectData, error: projectError } = await supabase
      .from('project_bookings')
      .select('*')
      .limit(1);

    if (projectError) {
      console.log('❌ project_bookings table does not exist or has issues');
      console.log('Error:', projectError.message);
      
      // Create project_bookings table
      console.log('\n📝 Creating project_bookings table...');
      const createProjectTableSQL = `
        CREATE TABLE IF NOT EXISTS project_bookings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          project_title VARCHAR(500) NOT NULL,
          project_description TEXT NOT NULL,
          project_type VARCHAR(100),
          subcategory VARCHAR(100),
          existing_project_details TEXT,
          languages_used TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createProjectError } = await supabase.rpc('exec_sql', {
        sql: createProjectTableSQL
      });
      
      if (createProjectError) {
        console.log('❌ Failed to create project_bookings table:', createProjectError.message);
        console.log('📋 Manual SQL to run in Supabase SQL Editor:');
        console.log(createProjectTableSQL);
      } else {
        console.log('✅ project_bookings table created successfully');
      }
    } else {
      console.log('✅ project_bookings table exists and is accessible');
      console.log('📊 Sample data:', projectData);
    }

    // Test inserting data
    console.log('\n3. Testing data insertion...');
    
    // Test contact submission
    const testContactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    };
    
    const { data: insertContactData, error: insertContactError } = await supabase
      .from('contact_submissions')
      .insert([testContactData])
      .select()
      .single();
    
    if (insertContactError) {
      console.log('❌ Failed to insert test contact data:', insertContactError.message);
    } else {
      console.log('✅ Test contact data inserted successfully:', insertContactData);
      
      // Clean up test data
      await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', insertContactData.id);
      console.log('🧹 Test data cleaned up');
    }

    // Test project booking
    const testProjectData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      project_title: 'Test Project',
      project_description: 'This is a test project description',
      project_type: 'Web Development',
      subcategory: 'React App',
      existing_project_details: 'None',
      languages_used: 'React, Node.js'
    };
    
    const { data: insertProjectData, error: insertProjectError } = await supabase
      .from('project_bookings')
      .insert([testProjectData])
      .select()
      .single();
    
    if (insertProjectError) {
      console.log('❌ Failed to insert test project data:', insertProjectError.message);
    } else {
      console.log('✅ Test project data inserted successfully:', insertProjectData);
      
      // Clean up test data
      await supabase
        .from('project_bookings')
        .delete()
        .eq('id', insertProjectData.id);
      console.log('🧹 Test data cleaned up');
    }

    console.log('\n🎉 Database check completed!');

  } catch (error) {
    console.error('❌ Database check failed:', error);
    console.log('\n📋 Manual SQL Commands to run in Supabase SQL Editor:');
    console.log(`
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_bookings table
CREATE TABLE IF NOT EXISTS project_bookings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  project_title VARCHAR(500) NOT NULL,
  project_description TEXT NOT NULL,
  project_type VARCHAR(100),
  subcategory VARCHAR(100),
  existing_project_details TEXT,
  languages_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public selects" ON contact_submissions FOR SELECT USING (true);

CREATE POLICY "Allow public inserts" ON project_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public selects" ON project_bookings FOR SELECT USING (true);
    `);
  }
}

// Run the check
checkAndCreateTables();
