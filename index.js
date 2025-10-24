const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

// Import the new database service
const db = require('./services/database');
// Import email service
const emailService = require('./services/emailService');

const app = express();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tech24-web.web.app',
    'https://tech24-web.firebaseapp.com',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'tech24admin';
    
    if (username !== adminUsername) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10));
    if (!validPassword && password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Projects Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const newProject = await db.createProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const updatedProject = await db.updateProject(parseInt(req.params.id), req.body);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteProject(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Web Projects Routes
app.get('/api/webprojects', async (req, res) => {
  try {
    const webProjects = await db.getWebProjects();
    res.json(webProjects);
  } catch (error) {
    console.error('Error fetching web projects:', error);
    res.status(500).json({ error: 'Failed to fetch web projects' });
  }
});

app.post('/api/webprojects', authenticateToken, async (req, res) => {
  try {
    const newWebProject = await db.createWebProject(req.body);
    res.status(201).json(newWebProject);
  } catch (error) {
    console.error('Error creating web project:', error);
    res.status(500).json({ error: 'Failed to create web project' });
  }
});

app.put('/api/webprojects/:id', authenticateToken, async (req, res) => {
  try {
    const updatedWebProject = await db.updateWebProject(parseInt(req.params.id), req.body);
    res.json(updatedWebProject);
  } catch (error) {
    console.error('Error updating web project:', error);
    res.status(500).json({ error: 'Failed to update web project' });
  }
});

app.delete('/api/webprojects/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteWebProject(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting web project:', error);
    res.status(500).json({ error: 'Failed to delete web project' });
  }
});

// Skills Routes
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await db.getSkills();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

app.post('/api/skills', authenticateToken, async (req, res) => {
  try {
    const newSkill = await db.createSkill(req.body);
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

app.put('/api/skills/:id', authenticateToken, async (req, res) => {
  try {
    const updatedSkill = await db.updateSkill(parseInt(req.params.id), req.body);
    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteSkill(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Tools Routes
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await db.getTools();
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

app.post('/api/tools', authenticateToken, async (req, res) => {
  try {
    const newTool = await db.createTool(req.body);
    res.status(201).json(newTool);
  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({ error: 'Failed to create tool' });
  }
});

app.put('/api/tools/:id', authenticateToken, async (req, res) => {
  try {
    const updatedTool = await db.updateTool(parseInt(req.params.id), req.body);
    res.json(updatedTool);
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({ error: 'Failed to update tool' });
  }
});

app.delete('/api/tools/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteTool(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

// Personal Info Routes
app.get('/api/personal', async (req, res) => {
  try {
    const personal = await db.getPersonalInfo();
    res.json(personal);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    res.status(500).json({ error: 'Failed to fetch personal info' });
  }
});

app.put('/api/personal', authenticateToken, async (req, res) => {
  try {
    const updatedPersonal = await db.updatePersonalInfo(req.body);
    res.json(updatedPersonal);
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({ error: 'Failed to update personal info' });
  }
});

// Image Upload Route
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const imageUrl = await db.uploadImage(fileName, req.file.buffer, process.env.STORAGE_BUCKET || 'visionreports');
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const health = await db.healthCheck();
    res.json({ 
      status: 'OK', 
      database: health,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'Error', 
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// Configuration endpoint (non-sensitive info only)
app.get('/api/config', (req, res) => {
  const PORT = process.env.PORT || 5000;
  res.json({
    server: {
      port: PORT,
      nodeEnv: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
      apiBaseUrl: process.env.API_BASE_URL || `http://localhost:${PORT}`,
    },
    storage: {
      bucket: process.env.STORAGE_BUCKET || 'visionreports',
    },
    auth: {
      jwtConfigured: !!process.env.JWT_SECRET,
      adminUsername: process.env.ADMIN_USERNAME || 'admin',
    },
    database: {
      supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    },
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TECH24 Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Test Email Endpoint (for testing Brevo SMTP)
app.post('/api/test-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ 
        error: 'Email and name are required for testing' 
      });
    }
    
    const testResult = await emailService.sendAutoReply({
      name,
      email,
      subject: 'Test Email',
      message: 'This is a test email to verify Brevo SMTP integration.'
    }, 'contact');
    
    if (testResult.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: testResult.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send test email',
        details: testResult.error
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const testResult = await db.getPersonalInfo();
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      data: testResult 
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Contact Form Submission Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Required fields missing (name, email, message)' 
      });
    }
    
    // Store contact submission in database
    const contactSubmission = await db.createContactSubmission({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });
    
    console.log('📧 New contact submission received:', {
      name,
      email,
      subject: subject || 'General Inquiry',
      timestamp: new Date().toISOString()
    });
    
    // Send email notifications
    try {
      // Send notification to admin
      const adminEmailResult = await emailService.sendAdminNotification({
        name,
        email,
        subject: subject || 'General Inquiry',
        message
      }, 'contact');
      
      // Send auto-reply to client
      const autoReplyResult = await emailService.sendAutoReply({
        name,
        email,
        subject: subject || 'General Inquiry',
        message
      }, 'contact');
      
      console.log('📧 Email notifications sent:', {
        adminEmail: adminEmailResult.success,
        autoReply: autoReplyResult.success
      });
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but form was saved:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: contactSubmission.id
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Failed to submit contact form',
      details: error.message 
    });
  }
});

// Project Form Submission Route
app.post('/api/project-booking', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      projectTitle, 
      projectDescription,
      projectType,
      subcategory,
      existingProjectDetails,
      languagesUsed
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !projectTitle || !projectDescription) {
      return res.status(400).json({ 
        error: 'Required fields missing (name, email, projectTitle, projectDescription)' 
      });
    }
    
    // Store project booking in database
    const projectBooking = await db.createProjectBooking({
      name,
      phone,
      email,
      projectTitle,
      projectDescription,
      projectType,
      subcategory,
      existingProjectDetails,
      languagesUsed
    });
    
    console.log('🎯 New project booking received:', {
      name,
      email,
      projectTitle,
      projectType,
      timestamp: new Date().toISOString()
    });
    
    // Send email notifications
    try {
      // Send notification to admin
      const adminEmailResult = await emailService.sendAdminNotification({
        name,
        phone,
        email,
        projectTitle,
        projectDescription,
        projectType,
        subcategory,
        existingProjectDetails,
        languagesUsed
      }, 'project');
      
      // Send auto-reply to client
      const autoReplyResult = await emailService.sendAutoReply({
        name,
        phone,
        email,
        projectTitle,
        projectDescription,
        projectType,
        subcategory,
        existingProjectDetails,
        languagesUsed
      }, 'project');
      
      console.log('📧 Email notifications sent:', {
        adminEmail: adminEmailResult.success,
        autoReply: autoReplyResult.success
      });
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but booking was saved:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({
      success: true,
      message: 'Project booking submitted successfully',
      bookingId: projectBooking.id
    });
  } catch (error) {
    console.error('Error handling project booking:', error);
    res.status(500).json({ error: 'Failed to submit project booking' });
  }
});

// Get Contact Submissions (Admin only) - Alternative endpoint name
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const submissions = await db.getContactSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Get Contact Submissions (Admin only)
app.get('/api/contact-submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await db.getContactSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Get Project Bookings (Admin only)
app.get('/api/project-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await db.getProjectBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching project bookings:', error);
    res.status(500).json({ error: 'Failed to fetch project bookings' });
  }
});

// Export for Vercel
module.exports = app;
