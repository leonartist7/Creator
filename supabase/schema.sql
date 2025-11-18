-- AI Writing App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active',
  words_generated INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT NOT NULL,
  title TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  reference_files JSONB DEFAULT '[]'::jsonb,
  learned_style JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Project sections table (for better querying and indexing)
CREATE TABLE IF NOT EXISTS public.project_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  section_config_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'generated', 'edited', 'completed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  parent_section_id UUID REFERENCES public.project_sections(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Uploaded files table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI generation logs (for tracking usage and debugging)
CREATE TABLE IF NOT EXISTS public.ai_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.project_sections(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  ai_provider TEXT NOT NULL CHECK (ai_provider IN ('openai', 'anthropic')),
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Subscription and billing table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_template_id ON public.projects(template_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_sections_project_id ON public.project_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_sections_status ON public.project_sections(status);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON public.ai_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON public.uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_project_id ON public.uploaded_files(project_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Project sections policies
CREATE POLICY "Users can view own project sections" ON public.project_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_sections.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own project sections" ON public.project_sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_sections.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own project sections" ON public.project_sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_sections.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own project sections" ON public.project_sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_sections.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Uploaded files policies
CREATE POLICY "Users can view own uploaded files" ON public.uploaded_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own uploaded files" ON public.uploaded_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploaded files" ON public.uploaded_files
  FOR DELETE USING (auth.uid() = user_id);

-- AI generations policies
CREATE POLICY "Users can view own AI generations" ON public.ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AI generations" ON public.ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_project_sections
  BEFORE UPDATE ON public.project_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update project metadata (word count, completion percentage)
CREATE OR REPLACE FUNCTION public.update_project_metadata()
RETURNS TRIGGER AS $$
DECLARE
  total_words INTEGER;
  completed_count INTEGER;
  total_count INTEGER;
  completion_percentage INTEGER;
BEGIN
  -- Calculate total words from all sections
  SELECT COALESCE(SUM(LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1), 0)
  INTO total_words
  FROM public.project_sections
  WHERE project_id = NEW.project_id AND content != '';

  -- Calculate completion percentage
  SELECT COUNT(*) INTO total_count
  FROM public.project_sections
  WHERE project_id = NEW.project_id;

  SELECT COUNT(*) INTO completed_count
  FROM public.project_sections
  WHERE project_id = NEW.project_id
  AND status IN ('completed', 'generated');

  IF total_count > 0 THEN
    completion_percentage := FLOOR((completed_count::FLOAT / total_count) * 100);
  ELSE
    completion_percentage := 0;
  END IF;

  -- Update project metadata
  UPDATE public.projects
  SET metadata = jsonb_set(
    jsonb_set(
      metadata,
      '{totalWords}',
      to_jsonb(total_words)
    ),
    '{completionPercentage}',
    to_jsonb(completion_percentage)
  )
  WHERE id = NEW.project_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update project metadata when sections change
CREATE TRIGGER update_project_metadata_on_section_change
  AFTER INSERT OR UPDATE OR DELETE ON public.project_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_project_metadata();

-- Storage buckets (run these in the Supabase Storage UI or via API)
-- Create storage bucket for uploaded reference files
-- INSERT INTO storage.buckets (id, name, public) VALUES ('reference-files', 'reference-files', false);

-- Storage policies (for reference-files bucket)
-- CREATE POLICY "Users can upload own reference files" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'reference-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own reference files" ON storage.objects
--   FOR SELECT USING (bucket_id = 'reference-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own reference files" ON storage.objects
--   FOR DELETE USING (bucket_id = 'reference-files' AND auth.uid()::text = (storage.foldername(name))[1]);
