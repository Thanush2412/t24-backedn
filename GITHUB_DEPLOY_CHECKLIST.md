# 🚀 GitHub Deployment Checklist

## Pre-Deployment Setup

### 1. Repository Preparation
- [ ] Create new GitHub repository
- [ ] Initialize with README.md
- [ ] Add .gitignore file
- [ ] Set repository to public/private as needed

### 2. Local Setup
- [ ] Navigate to backend directory
- [ ] Remove existing .git if present: `rm -rf .git`
- [ ] Initialize new git repository: `git init`
- [ ] Add remote origin: `git remote add origin https://github.com/yourusername/repo-name.git`

### 3. Environment Variables
- [ ] Create `.env.example` file with template
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Document all required environment variables

### 4. Dependencies Check
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Update packages if necessary: `npm update`
- [ ] Verify all dependencies are in package.json

## Files to Include

### Essential Files
- [ ] `server.js` - Main application file
- [ ] `package.json` - Dependencies and scripts
- [ ] `package-lock.json` - Exact dependency versions
- [ ] `.gitignore` - Git ignore rules
- [ ] `README.md` - Documentation
- [ ] `.env.example` - Environment template

### Configuration Files
- [ ] `config/supabase.js` - Database configuration
- [ ] `services/database.js` - Database service layer
- [ ] `migrations/001_initial_schema.sql` - Database schema

### Optional Files
- [ ] `Dockerfile` - Container configuration
- [ ] `docker-compose.yml` - Local development
- [ ] `DEPLOYMENT.md` - Deployment guide
- [ ] `.github/workflows/deploy.yml` - CI/CD pipeline

## Deployment Platforms

### Vercel (Recommended for Node.js)
- [ ] Import repository to Vercel
- [ ] Set root directory to backend folder
- [ ] Configure environment variables
- [ ] Test deployment URL

### Heroku
- [ ] Install Heroku CLI
- [ ] Create Heroku app
- [ ] Set environment variables
- [ ] Deploy using git subtree

### Railway
- [ ] Connect GitHub account
- [ ] Import repository
- [ ] Configure environment variables
- [ ] Monitor deployment logs

### Render
- [ ] Create web service
- [ ] Connect GitHub repository
- [ ] Configure build/start commands
- [ ] Set environment variables

## Environment Variables Setup

### Required Variables
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Platform-Specific Setup

#### Vercel
1. Go to project settings
2. Navigate to Environment Variables
3. Add each variable and value
4. Redeploy if necessary

#### Heroku
```bash
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set NODE_ENV=production
```

#### Railway/Render
1. Access project dashboard
2. Go to environment variables section
3. Add variables through UI

## Git Commands for Deployment

### Initial Push
```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial backend deployment setup"

# Push to GitHub
git push -u origin main
```

### Subsequent Updates
```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "Update: describe your changes"

# Push changes
git push origin main
```

### Deploy Specific Folder (Heroku)
```bash
# For backend folder only
git subtree push --prefix backend heroku main
```

## Testing Deployment

### Health Check
- [ ] Test health endpoint: `GET /api/health`
- [ ] Verify response: `{"status": "OK", "timestamp": "..."}`

### API Endpoints
- [ ] Test personal info: `GET /api/personal`
- [ ] Test projects: `GET /api/projects`
- [ ] Test skills: `GET /api/skills`
- [ ] Test tools: `GET /api/tools`
- [ ] Test webprojects: `GET /api/webprojects`

### CORS Testing
- [ ] Test from frontend domain
- [ ] Verify OPTIONS requests work
- [ ] Check browser console for CORS errors

## Monitoring Setup

### Uptime Monitoring
- [ ] Setup UptimeRobot or similar service
- [ ] Monitor `/api/health` endpoint
- [ ] Set up alert notifications

### Error Tracking
- [ ] Integrate Sentry (optional)
- [ ] Monitor application errors
- [ ] Set up error notifications

### Performance Monitoring
- [ ] Monitor response times
- [ ] Check memory usage
- [ ] Monitor database connections

## Security Checklist

### Before Deployment
- [ ] Remove console.log statements
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting (if needed)
- [ ] Add input validation
- [ ] Use secure headers

### Production Security
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Use strong JWT secrets
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

## Common Issues & Solutions

### Deployment Fails
1. Check build logs for errors
2. Verify package.json scripts
3. Ensure all dependencies are listed
4. Check Node.js version compatibility

### Environment Variables Not Working
1. Double-check variable names
2. Restart deployment after adding variables
3. Verify variables in deployment platform
4. Check for typos in variable names

### Database Connection Issues
1. Verify Supabase URL and key
2. Check Supabase project status
3. Test connection locally first
4. Review database access permissions

### CORS Errors
1. Check CORS_ORIGIN environment variable
2. Ensure frontend URL matches exactly
3. Include protocol (https://) in origin
4. Test with browser developer tools

## Post-Deployment Tasks

### Documentation
- [ ] Update README with deployment URL
- [ ] Document API endpoints
- [ ] Add troubleshooting guide
- [ ] Update environment variable documentation

### Maintenance
- [ ] Set up automated backups (if applicable)
- [ ] Schedule dependency updates
- [ ] Monitor application performance
- [ ] Plan for scaling if needed

### Frontend Integration
- [ ] Update frontend API base URL
- [ ] Test all frontend-backend connections
- [ ] Deploy frontend with updated backend URL
- [ ] Verify end-to-end functionality

## Success Criteria

Your deployment is successful when:
- [ ] All API endpoints return expected responses
- [ ] Health check endpoint returns 200 status
- [ ] Frontend can successfully connect to backend
- [ ] Environment variables are properly configured
- [ ] CORS is working correctly
- [ ] No critical errors in deployment logs

## Next Steps

After successful deployment:
1. Share deployment URL with team
2. Update project documentation
3. Set up monitoring and alerts
4. Plan for future updates and maintenance
5. Consider implementing CI/CD pipeline

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Heroku Documentation**: https://devcenter.heroku.com/
- **Railway Documentation**: https://docs.railway.app/
- **Render Documentation**: https://render.com/docs
- **Supabase Documentation**: https://supabase.io/docs

Remember to keep your deployment URL and credentials secure!
