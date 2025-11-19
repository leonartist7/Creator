# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (for production)
- OpenAI API key
- Domain name (optional)

## Production Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=3001

# Database - Use PostgreSQL in production
DATABASE_URL=postgresql://user:password@host:port/database

# Security
JWT_SECRET=<generate-strong-random-string>
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=<your-openai-api-key>

# Stripe (if using payments)
STRIPE_SECRET_KEY=<your-stripe-secret>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>

# Frontend URL
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)

```env
VITE_API_URL=https://api.your-domain.com
VITE_STRIPE_PUBLIC_KEY=<your-stripe-public-key>
```

## Deployment Options

### Option 1: Railway (Recommended for Backend)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Deploy backend:
   ```bash
   cd backend
   railway init
   railway up
   ```

4. Add environment variables in Railway dashboard

5. Add PostgreSQL database:
   ```bash
   railway add postgresql
   ```

### Option 2: Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard
6. Add PostgreSQL database from Render dashboard

### Option 3: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Set environment variables in Vercel dashboard

**Backend on Railway:**
- Follow Railway instructions above

### Option 4: Docker

Build and run with Docker:

```bash
# Backend
cd backend
docker build -t digital-creator-backend .
docker run -p 3001:3001 --env-file .env digital-creator-backend

# Frontend
cd frontend
docker build -t digital-creator-frontend .
docker run -p 3000:3000 digital-creator-frontend
```

Docker Compose:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:3001

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: digitalcreator
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Database Migration

### Switch from SQLite to PostgreSQL

1. Install PostgreSQL adapter:
   ```bash
   cd backend
   npm install pg pg-hstore
   ```

2. Update `backend/src/database/connection.ts`:
   ```typescript
   export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
     dialect: 'postgres',
     logging: false,
   });
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

## Performance Optimization

### Backend

1. Enable compression (already configured)
2. Add Redis for caching:
   ```bash
   npm install redis
   ```

3. Implement rate limiting:
   ```bash
   npm install express-rate-limit
   ```

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```

2. Enable lazy loading for routes
3. Optimize images
4. Use CDN for static assets

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT secret (32+ characters)
- [ ] Enable CORS only for your domain
- [ ] Use helmet middleware (already configured)
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Hash passwords (already using bcrypt)
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Implement logging and monitoring

## Monitoring

### Recommended Services

- **Error Tracking**: Sentry
- **Logging**: Logtail or LogRocket
- **Uptime Monitoring**: UptimeRobot
- **Performance**: New Relic or Datadog

### Health Check Endpoint

Already implemented at `GET /health`

## Scaling

### Horizontal Scaling

1. Use load balancer (Nginx, Cloudflare)
2. Deploy multiple backend instances
3. Use shared session storage (Redis)
4. Use managed database (AWS RDS, Heroku Postgres)

### Vertical Scaling

1. Upgrade server resources
2. Optimize database queries
3. Implement caching strategy
4. Use CDN for static assets

## Backup Strategy

### Database Backups

```bash
# PostgreSQL backup
pg_dump -U user -d database > backup.sql

# Restore
psql -U user -d database < backup.sql
```

### Automated Backups

- Use database provider's backup feature
- Schedule daily backups
- Store backups in different region
- Test restore process regularly

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: Build
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build

      - name: Deploy
        run: |
          # Add your deployment commands here
```

## Domain Setup

1. Purchase domain from registrar
2. Point domain to your server:
   - Frontend: CNAME to Vercel/Netlify
   - Backend: A record to server IP

3. Set up SSL certificate (Let's Encrypt)
4. Configure DNS records

## Post-Deployment

1. Test all features in production
2. Monitor error logs
3. Set up analytics
4. Configure backup schedule
5. Document any issues
6. Update DNS TTL if needed

## Rollback Plan

1. Keep previous deployment available
2. Use git tags for versions
3. Maintain database backups
4. Document rollback procedure
5. Test rollback process

## Support

For deployment issues:
- Check application logs
- Review environment variables
- Verify database connection
- Check API endpoint accessibility
- Review firewall rules
