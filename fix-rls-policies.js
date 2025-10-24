// Fix Supabase RLS Policies
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

async function fixRLSPolicies() {
  console.log('🔧 Fixing Supabase RLS Policies...\n');

  try {
    // SQL commands to fix RLS policies
    const sqlCommands = [
      // Drop existing policies if they exist
      'DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;',
      'DROP POLICY IF EXISTS "Allow public selects" ON contact_submissions;',
      'DROP POLICY IF EXISTS "Allow public inserts" ON project_bookings;',
      'DROP POLICY IF EXISTS "Allow public selects" ON project_bookings;',
      
      // Create new policies for contact_submissions
      'CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow public selects" ON contact_submissions FOR SELECT USING (true);',
      
      // Create new policies for project_bookings
      'CREATE POLICY "Allow public inserts" ON project_bookings FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow public selects" ON project_bookings FOR SELECT USING (true);'
    ];

    console.log('📝 Executing SQL commands...');
    
    for (const sql of sqlCommands) {
      console.log(`Executing: ${sql}`);
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.log(`❌ Error executing SQL: ${error.message}`);
        console.log(`SQL: ${sql}`);
      } else {
        console.log('✅ SQL executed successfully');
      }
    }

    // Test the fix
    console.log('\n🧪 Testing the fix...');
    
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
      console.log('❌ Contact insert still failing:', insertContactError.message);
    } else {
      console.log('✅ Contact insert working! Data:', insertContactData);
      
      // Clean up test data
      await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', insertContactData.id);
      console.log('🧹 Test contact data cleaned up');
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
      console.log('❌ Project insert still failing:', insertProjectError.message);
    } else {
      console.log('✅ Project insert working! Data:', insertProjectData);
      
      // Clean up test data
      await supabase
        .from('project_bookings')
        .delete()
        .eq('id', insertProjectData.id);
      console.log('🧹 Test project data cleaned up');
    }

    console.log('\n🎉 RLS Policy fix completed!');

  } catch (error) {
    console.error('❌ RLS Policy fix failed:', error);
    console.log('\n📋 Manual SQL Commands to run in Supabase SQL Editor:');
    console.log(`
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public selects" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON project_bookings;
DROP POLICY IF EXISTS "Allow public selects" ON project_bookings;

-- Create new policies for contact_submissions
CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public selects" ON contact_submissions FOR SELECT USING (true);

-- Create new policies for project_bookings
CREATE POLICY "Allow public inserts" ON project_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public selects" ON project_bookings FOR SELECT USING (true);
    `);
  }
}

// Run the fix
fixRLSPolicies();
