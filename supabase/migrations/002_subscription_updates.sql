-- Migration: Subscription system updates
-- Adds: template_limit, user_limit, credits columns to subscriptions
-- Adds: team_members table for multi-user support
-- Adds: user_templates table for custom template storage
-- Adds: standard_processes, user_processes, rams_processes tables for process library

-- ============================================
-- SUBSCRIPTIONS TABLE UPDATES
-- ============================================

-- Add new columns to subscriptions table if they don't exist
DO $$
BEGIN
  -- Add template_limit column (NULL = unlimited, 0 = none)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'template_limit') THEN
    ALTER TABLE subscriptions ADD COLUMN template_limit INTEGER;
  END IF;

  -- Add user_limit column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'user_limit') THEN
    ALTER TABLE subscriptions ADD COLUMN user_limit INTEGER DEFAULT 1;
  END IF;

  -- Add credits column for pay-per-use
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'credits') THEN
    ALTER TABLE subscriptions ADD COLUMN credits INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, member_id)
);

-- RLS for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Owner can manage their team members
CREATE POLICY IF NOT EXISTS "team_members_owner_all" ON team_members
  FOR ALL USING (owner_id = auth.uid());

-- Members can see team relationships they're part of
CREATE POLICY IF NOT EXISTS "team_members_member_select" ON team_members
  FOR SELECT USING (member_id = auth.uid());

-- ============================================
-- USER TEMPLATES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- Supabase Storage path
  extracted_structure JSONB, -- Parsed template sections
  placeholders JSONB, -- Detected placeholders
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for user_templates
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;

-- Users can only access their own templates
CREATE POLICY IF NOT EXISTS "user_templates_user_all" ON user_templates
  FOR ALL USING (user_id = auth.uid());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_templates_user_id ON user_templates(user_id);

-- ============================================
-- STANDARD PROCESSES TABLE (System-wide library)
-- ============================================

CREATE TABLE IF NOT EXISTS standard_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- e.g., 'LOTO', 'HOT_WORKS'
  description TEXT,
  category TEXT NOT NULL, -- 'Isolation', 'Permits', 'General', etc.
  content JSONB NOT NULL, -- Steps, hazards, controls, PPE
  icon TEXT, -- Icon name for UI
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS for standard_processes - all authenticated users can read
ALTER TABLE standard_processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "standard_processes_read_all" ON standard_processes
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- USER PROCESSES TABLE (Custom processes)
-- ============================================

CREATE TABLE IF NOT EXISTS user_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Extracted from upload: steps, hazards, controls, PPE
  source_file_path TEXT, -- Original upload in Storage
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for user_processes
ALTER TABLE user_processes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own custom processes
CREATE POLICY IF NOT EXISTS "user_processes_user_all" ON user_processes
  FOR ALL USING (user_id = auth.uid());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_processes_user_id ON user_processes(user_id);

-- ============================================
-- RAMS PROCESSES JUNCTION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS rams_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rams_id UUID NOT NULL REFERENCES rams_documents(id) ON DELETE CASCADE,
  process_type TEXT NOT NULL CHECK (process_type IN ('standard', 'custom')),
  process_id UUID NOT NULL, -- ID from standard_processes or user_processes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(rams_id, process_type, process_id)
);

-- RLS for rams_processes
ALTER TABLE rams_processes ENABLE ROW LEVEL SECURITY;

-- Users can access rams_processes for their own RAMS documents
CREATE POLICY IF NOT EXISTS "rams_processes_user_all" ON rams_processes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rams_documents
      WHERE rams_documents.id = rams_processes.rams_id
      AND rams_documents.user_id = auth.uid()
    )
  );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rams_processes_rams_id ON rams_processes(rams_id);

-- ============================================
-- UPDATE FUNCTIONS
-- ============================================

-- Function to update subscription limits based on tier
CREATE OR REPLACE FUNCTION update_subscription_limits()
RETURNS TRIGGER AS $$
BEGIN
  -- Set limits based on tier
  CASE NEW.tier
    WHEN 'free' THEN
      NEW.rams_limit := 1;
      NEW.template_limit := 0;
      NEW.user_limit := 1;
    WHEN 'pay_per_use' THEN
      NEW.rams_limit := NULL; -- Credit-based
      NEW.template_limit := 0;
      NEW.user_limit := 1;
    WHEN 'starter_monthly', 'starter_annual' THEN
      NEW.rams_limit := 10;
      NEW.template_limit := 10;
      NEW.user_limit := 5;
    WHEN 'professional_monthly', 'professional_annual' THEN
      NEW.rams_limit := 30;
      NEW.template_limit := NULL; -- Unlimited
      NEW.user_limit := 3;
    WHEN 'team_monthly', 'team_annual' THEN
      NEW.rams_limit := NULL; -- Unlimited
      NEW.template_limit := NULL; -- Unlimited
      NEW.user_limit := 10;
    ELSE
      -- Default to free tier limits
      NEW.rams_limit := 1;
      NEW.template_limit := 0;
      NEW.user_limit := 1;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update limits when tier changes
DROP TRIGGER IF EXISTS trigger_update_subscription_limits ON subscriptions;
CREATE TRIGGER trigger_update_subscription_limits
  BEFORE INSERT OR UPDATE OF tier ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_limits();

-- ============================================
-- UPDATE EXISTING SUBSCRIPTIONS
-- ============================================

-- Update existing free tier subscriptions to have correct limits
UPDATE subscriptions
SET
  rams_limit = 1,
  template_limit = 0,
  user_limit = 1
WHERE tier = 'free';
