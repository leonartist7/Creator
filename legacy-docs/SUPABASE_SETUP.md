# Supabase Setup Guide

This guide will help you set up your Supabase database for the Digital Product Creator platform.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Supabase project created

## Step 1: Get Your Supabase Credentials

1. Log in to your Supabase dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep this secret!)

## Step 2: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `backend/supabase-schema.sql`
4. Click **Run** to execute the SQL

This will create:
- `projects` table
- `ai_generations` table
- `user_profiles` table
- Row Level Security (RLS) policies
- Automatic triggers for user profile creation

## Step 3: Configure Environment Variables

### Backend (.env)

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your credentials:

```env
SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Frontend (.env)

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Verify the Setup

### Test Database Connection

1. Start your backend server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Look for the success message:
   ```
   ✅ Supabase connection established successfully
   ```

### Test Authentication

1. Start your frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Open http://localhost:3000
3. Click "Get Started" and create an account
4. You should be logged in and redirected to the dashboard

### Verify Database Tables

1. In Supabase dashboard, go to **Table Editor**
2. You should see:
   - `user_profiles` - with your newly created user
   - `projects` - empty initially
   - `ai_generations` - empty initially

## Database Schema Overview

### user_profiles
- Extends Supabase Auth users
- Stores: first_name, last_name, subscription_tier
- Created automatically when user signs up

### projects
- Stores user's digital product projects
- Fields: title, type, content (JSONB), metadata (JSONB), status
- Protected by RLS - users can only see their own projects

### ai_generations
- Tracks all AI content generations
- Links to projects and users
- Stores: prompt, response, model_used, tokens_used

## Row Level Security (RLS)

All tables have RLS enabled to ensure data security:

- **Projects**: Users can only access their own projects
- **AI Generations**: Users can only see their own generations
- **User Profiles**: Users can only view/edit their own profile

## Common Issues

### "relation does not exist" error
- Make sure you ran the SQL schema in Step 2
- Check that you're connected to the correct Supabase project

### Authentication errors
- Verify your SUPABASE_ANON_KEY is correct
- Check that email confirmation is disabled in Supabase Auth settings (for development)

### "permission denied" errors
- RLS policies are working correctly
- Make sure you're authenticated when making requests

## Disabling Email Confirmation (Development Only)

For easier development:

1. Go to **Authentication** → **Providers** → **Email**
2. Disable **Confirm email**
3. Save changes

**Note**: Re-enable this in production!

## Next Steps

- Create your first project
- Test AI features with Anthropic Claude
- Explore the dashboard and analytics

## Production Considerations

1. **Enable Email Confirmation**
2. **Set up email templates** in Supabase
3. **Configure custom SMTP** for better deliverability
4. **Enable 2FA** for admin accounts
5. **Set up database backups**
6. **Monitor usage** in Supabase dashboard

## Support

- Supabase Docs: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

Your database is now ready to use! 🎉
