const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

// Import the new database service
const db = require('./services/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Use env variable for CORS origin
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
    
    // Simple admin authentication (you can enhance this)
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

// Initialize and start server
async function startServer() {
  try {
    // Test database connection
    await db.healthCheck();
    console.log('✅ Database connection successful');
    
    app.listen(PORT, () => {
      console.log(`🚀 TECH24 Backend API running on port ${PORT}`);
      console.log(`🔗 Using Supabase database`);
      console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 API Base URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
      console.log(`🪣 Storage bucket: ${process.env.STORAGE_BUCKET || 'visionreports'}`);
      console.log(`🔐 Admin credentials: ${process.env.ADMIN_USERNAME || 'admin'}/${process.env.ADMIN_PASSWORD || 'tech24admin'}`);
      console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '***configured***' : '***using fallback***'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
