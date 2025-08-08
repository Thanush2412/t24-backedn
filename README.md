# TECH24 Portfolio Backend Server

A modern Express.js backend server for the TECH24 portfolio website with Supabase database integration.

## 🚀 Features

- **Modern Architecture**: Built with Express.js and Supabase
- **Database Integration**: Full Supabase PostgreSQL support
- **CRUD Operations**: Complete admin panel functionality
- **Authentication**: JWT-based admin authentication
- **CORS Support**: Cross-origin resource sharing enabled
- **Auto-restart**: Development server with nodemon
- **Data Migration**: Scripts for easy database setup

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account and project

## 🛠 Installation

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Setup
Run the database migration script:
```bash
npm run setup-db
```

### 5. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📜 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Setup database tables
- `npm run migrate-data` - Migrate JSON data to database
- `npm run update-images` - Update image paths

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server health check

### Authentication
- `POST /api/auth/login` - Admin login

### Personal Information
- `GET /api/personal` - Get personal information
- `PUT /api/personal` - Update personal information (requires auth)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth)
- `DELETE /api/projects/:id` - Delete project (requires auth)

### Web Projects
- `GET /api/webprojects` - Get all web projects
- `POST /api/webprojects` - Create new web project (requires auth)
- `PUT /api/webprojects/:id` - Update web project (requires auth)
- `DELETE /api/webprojects/:id` - Delete web project (requires auth)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill (requires auth)
- `PUT /api/skills/:name` - Update skill (requires auth)
- `DELETE /api/skills/:name` - Delete skill (requires auth)

### Tools
- `GET /api/tools` - Get all tools
- `POST /api/tools` - Create new tool (requires auth)
- `PUT /api/tools/:name` - Update tool (requires auth)
- `DELETE /api/tools/:name` - Delete tool (requires auth)

## 🗄 Database Schema

The application uses Supabase PostgreSQL with the following tables:

### personal_info
- `id` (uuid, primary key)
- `name` (text)
- `title` (text)
- `subtitle` (text)
- `greeting` (text)
- `description` (text)
- `profile_image` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### projects
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `category` (text)
- `technologies` (text[])
- `image` (text)
- `github_url` (text)
- `live_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### webprojects
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `technologies` (text[])
- `image` (text)
- `github_url` (text)
- `live_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### skills
- `id` (uuid, primary key)
- `name` (text, unique)
- `level` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### tools
- `id` (uuid, primary key)
- `name` (text, unique)
- `icon` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🔐 Authentication

The API uses JWT tokens for authentication. Default admin credentials:
- Username: `admin`
- Password: `tech24admin`

Tokens expire in 24 hours.

## 🌐 CORS Configuration

The server is configured to accept requests from:
- Development: `http://localhost:5173` (Vite dev server)
- Production: Configure `CORS_ORIGIN` in `.env`

## 📁 Project Structure

```
backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── data/                    # JSON data files (for migration)
│   ├── personal.json
│   ├── projects.json
│   ├── webprojects.json
│   ├── skills.json
│   └── tools.json
├── migrations/
│   └── 001_initial_schema.sql # Database schema
├── scripts/
│   ├── setup-database.js    # Database setup script
│   ├── migrate-data.js      # Data migration script
│   └── update-image-paths.js # Image path updater
├── services/
│   └── database.js          # Database service layer
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── server.js               # Main server file
```

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy from GitHub or using Heroku CLI

### Vercel Deployment
1. Import project to Vercel
2. Set environment variables
3. Deploy automatically

### Docker Deployment
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development

### Adding New Endpoints
1. Add route in `server.js`
2. Create database service in `services/database.js`
3. Update this README with new endpoint documentation

### Database Changes
1. Update schema in `migrations/001_initial_schema.sql`
2. Run migration: `npm run setup-db`
3. Update service layer in `services/database.js`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
