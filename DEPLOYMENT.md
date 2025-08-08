# Deployment Guide - TECH24 Portfolio Backend

This guide covers different deployment options for the TECH24 portfolio backend server.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended for Small Projects)

1. **Fork the repository** to your GitHub account

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Select the `backend` folder as root directory

3. **Configure Environment Variables**:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Deploy**: Vercel will automatically deploy your app

### 2. Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### 3. Railway

1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Select your repository

2. **Configure**:
   - Set root directory to `backend`
   - Add environment variables in Railway dashboard

3. **Deploy**: Railway automatically deploys from GitHub

### 4. Render

1. **Create Web Service**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Set root directory to `backend`

2. **Configure Build & Start Commands**:
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables** in Render dashboard

## 🐳 Docker Deployment

### Local Docker

1. **Build image**:
   ```bash
   docker build -t tech24-backend .
   ```

2. **Run container**:
   ```bash
   docker run -p 5000:5000 --env-file .env tech24-backend
   ```

### Docker Compose

1. **Start services**:
   ```bash
   docker-compose up -d
   ```

2. **Stop services**:
   ```bash
   docker-compose down
   ```

### Production Docker

1. **Build for production**:
   ```bash
   docker build -t tech24-backend:prod .
   ```

2. **Run with production config**:
   ```bash
   docker run -d \
     --name tech24-backend \
     -p 5000:5000 \
     -e NODE_ENV=production \
     -e SUPABASE_URL=your_url \
     -e SUPABASE_ANON_KEY=your_key \
     --restart unless-stopped \
     tech24-backend:prod
   ```

## ☁️ Cloud Platform Deployment

### AWS ECS

1. **Create ECR repository**:
   ```bash
   aws ecr create-repository --repository-name tech24-backend
   ```

2. **Build and push image**:
   ```bash
   docker build -t tech24-backend .
   docker tag tech24-backend:latest your-account.dkr.ecr.region.amazonaws.com/tech24-backend:latest
   docker push your-account.dkr.ecr.region.amazonaws.com/tech24-backend:latest
   ```

3. **Create ECS service** using AWS Console or CloudFormation

### Google Cloud Run

1. **Build and push to Container Registry**:
   ```bash
   gcloud builds submit --tag gcr.io/your-project/tech24-backend
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy tech24-backend \
     --image gcr.io/your-project/tech24-backend \
     --platform managed \
     --region your-region \
     --allow-unauthenticated
   ```

### Azure Container Instances

1. **Create resource group**:
   ```bash
   az group create --name tech24-rg --location eastus
   ```

2. **Deploy container**:
   ```bash
   az container create \
     --resource-group tech24-rg \
     --name tech24-backend \
     --image your-registry/tech24-backend:latest \
     --ports 5000 \
     --environment-variables NODE_ENV=production
   ```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Supabase (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Optional Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_custom_jwt_secret
JWT_EXPIRES_IN=24h

# Admin Credentials (if using basic auth)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Logging
LOG_LEVEL=info
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```
GET /api/health
```

Returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Monitoring Setup

1. **Uptime Monitoring**:
   - Use services like UptimeRobot or Pingdom
   - Monitor the `/api/health` endpoint

2. **Error Tracking**:
   - Integrate Sentry for error tracking
   - Add application performance monitoring

3. **Logging**:
   - Use structured logging (JSON format)
   - Aggregate logs with services like LogDNA or Papertrail

## 🔐 Security Considerations

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use strong JWT secrets
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling
- [ ] Add request validation
- [ ] Use secure headers (helmet.js)

### Database Security

- [ ] Use row-level security (RLS) in Supabase
- [ ] Rotate API keys regularly
- [ ] Monitor database access logs
- [ ] Use connection pooling
- [ ] Implement backup strategies

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Find process using port 5000
   lsof -i :5000
   # Kill the process
   kill -9 <PID>
   ```

2. **CORS errors**:
   - Check `CORS_ORIGIN` environment variable
   - Ensure frontend URL matches exactly

3. **Database connection issues**:
   - Verify Supabase URL and key
   - Check Supabase project status
   - Test connection manually

4. **Memory issues**:
   - Monitor memory usage
   - Implement proper garbage collection
   - Use memory profiling tools

### Logs and Debugging

1. **Enable debug logging**:
   ```env
   LOG_LEVEL=debug
   ```

2. **Docker logs**:
   ```bash
   docker logs tech24-backend
   ```

3. **Production debugging**:
   - Use remote debugging tools
   - Implement structured logging
   - Monitor application metrics

## 📈 Performance Optimization

### Production Optimizations

1. **Enable compression**:
   ```javascript
   app.use(compression());
   ```

2. **Implement caching**:
   - Add Redis for session storage
   - Use CDN for static assets
   - Implement API response caching

3. **Database optimization**:
   - Use database indexes
   - Implement connection pooling
   - Monitor query performance

4. **Load balancing**:
   - Use reverse proxy (nginx)
   - Implement horizontal scaling
   - Add health checks

## 📞 Support

For deployment issues or questions:

1. Check the main README.md for basic setup
2. Review server logs for error messages
3. Test API endpoints manually
4. Verify environment variables
5. Contact support team if needed

Remember to keep your environment variables secure and never commit them to version control!
