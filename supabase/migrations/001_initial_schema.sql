-- RAMS Builder Database Schema
-- Initial migration for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription management
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pay_per_use', 'monthly', 'annual')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    rams_limit INTEGER, -- NULL for unlimited
    rams_used_this_period INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('rams_created', 'rams_exported', 'ai_generation')),
    rams_id UUID,
    credits_used INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WIDGET TYPES (Reference Data)
-- ============================================

-- Widget types (trade definitions)
CREATE TABLE widget_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    category TEXT CHECK (category IN ('core_building', 'specialist', 'finishing', 'safety', 'equipment')),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    default_hazards JSONB DEFAULT '[]'::jsonb,
    default_mitigations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Widget relationships (for smart suggestions)
CREATE TABLE widget_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_widget_type_id UUID REFERENCES widget_types(id) ON DELETE CASCADE,
    suggested_widget_type_id UUID REFERENCES widget_types(id) ON DELETE CASCADE,
    relationship_type TEXT CHECK (relationship_type IN ('requires', 'suggests', 'conflicts')),
    strength DECIMAL(3,2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
    reason TEXT,
    UNIQUE(source_widget_type_id, suggested_widget_type_id)
);

-- ============================================
-- CONTEXTUAL QUESTIONS (Reference Data)
-- ============================================

CREATE TABLE contextual_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'boolean' CHECK (question_type IN ('boolean', 'select', 'multiselect', 'text', 'number')),
    options JSONB,
    category TEXT CHECK (category IN ('site_conditions', 'work_environment', 'interfaces', 'emergency', 'environmental', 'general')),
    is_required BOOLEAN DEFAULT FALSE,
    triggers_widgets JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HAZARDS & MITIGATIONS (Reference Data)
-- ============================================

-- Hazard library
CREATE TABLE hazards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('physical', 'chemical', 'biological', 'ergonomic', 'psychosocial', 'environmental')),
    applicable_widget_types JSONB DEFAULT '[]'::jsonb,
    severity_guidance TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mitigation library
CREATE TABLE mitigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('elimination', 'substitution', 'engineering', 'administrative', 'ppe')),
    applicable_hazard_ids JSONB DEFAULT '[]'::jsonb,
    effectiveness_rating TEXT CHECK (effectiveness_rating IN ('high', 'medium', 'low')),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RAMS DOCUMENTS
-- ============================================

-- Main RAMS documents
CREATE TABLE rams_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled RAMS',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'complete', 'archived')),
    version INTEGER DEFAULT 1,
    current_revision_id UUID,

    -- CDM Information (JSONB for flexibility)
    cdm_info JSONB DEFAULT '{}'::jsonb,

    -- Project Details
    project_reference TEXT,
    site_address JSONB DEFAULT '{}'::jsonb,

    -- Canvas state
    canvas_data JSONB DEFAULT '{"zoom": 1, "position": {"x": 0, "y": 0}, "selectedWidgetIds": []}'::jsonb,

    -- Metadata
    is_template BOOLEAN DEFAULT FALSE,
    template_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RAMS revisions (for version history)
CREATE TABLE rams_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rams_id UUID REFERENCES rams_documents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    revision_notes TEXT,

    -- Full snapshot of data at this point
    cdm_info JSONB,
    canvas_data JSONB,
    widgets JSONB,
    contextual_answers JSONB,
    risk_assessments JSONB,
    generated_content JSONB,

    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for current_revision_id after rams_revisions is created
ALTER TABLE rams_documents
ADD CONSTRAINT fk_current_revision
FOREIGN KEY (current_revision_id) REFERENCES rams_revisions(id);

-- ============================================
-- RAMS WIDGETS
-- ============================================

-- Widgets placed in a RAMS document
CREATE TABLE rams_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rams_id UUID REFERENCES rams_documents(id) ON DELETE CASCADE,
    widget_type_id UUID REFERENCES widget_types(id),

    -- Canvas positioning
    position_x DECIMAL(10,2) DEFAULT 0,
    position_y DECIMAL(10,2) DEFAULT 0,
    width DECIMAL(10,2) DEFAULT 200,
    height DECIMAL(10,2) DEFAULT 150,
    z_index INTEGER DEFAULT 0,

    -- Grouping (widget behind widget)
    parent_widget_id UUID REFERENCES rams_widgets(id) ON DELETE SET NULL,

    -- Widget-specific configuration
    config JSONB DEFAULT '{}'::jsonb,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTEXTUAL ANSWERS
-- ============================================

-- Answers for each RAMS
CREATE TABLE rams_contextual_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rams_id UUID REFERENCES rams_documents(id) ON DELETE CASCADE,
    question_id UUID REFERENCES contextual_questions(id),
    answer JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rams_id, question_id)
);

-- ============================================
-- RISK ASSESSMENTS
-- ============================================

-- Risk assessments per RAMS widget
CREATE TABLE rams_risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rams_id UUID REFERENCES rams_documents(id) ON DELETE CASCADE,
    rams_widget_id UUID REFERENCES rams_widgets(id) ON DELETE CASCADE,

    -- Hazard details
    hazard_id UUID REFERENCES hazards(id),
    custom_hazard_name TEXT,
    hazard_description TEXT,

    -- 5x5 Matrix scores (before controls)
    initial_likelihood INTEGER CHECK (initial_likelihood BETWEEN 1 AND 5),
    initial_severity INTEGER CHECK (initial_severity BETWEEN 1 AND 5),
    initial_risk_score INTEGER GENERATED ALWAYS AS (initial_likelihood * initial_severity) STORED,

    -- Mitigations
    mitigations JSONB DEFAULT '[]'::jsonb,

    -- 5x5 Matrix scores (after controls)
    residual_likelihood INTEGER CHECK (residual_likelihood BETWEEN 1 AND 5),
    residual_severity INTEGER CHECK (residual_severity BETWEEN 1 AND 5),
    residual_risk_score INTEGER GENERATED ALWAYS AS (residual_likelihood * residual_severity) STORED,

    -- Additional info
    responsible_person TEXT,
    review_date DATE,
    notes TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEMPLATES & GENERATED CONTENT
-- ============================================

-- User-saved templates (paid feature)
CREATE TABLE user_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated documents
CREATE TABLE generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rams_id UUID REFERENCES rams_documents(id) ON DELETE CASCADE,
    revision_id UUID REFERENCES rams_revisions(id),

    -- AI-generated content
    generated_content JSONB,
    method_statement TEXT,

    -- Export tracking
    export_format TEXT CHECK (export_format IN ('docx', 'pdf')),
    export_url TEXT,
    export_expires_at TIMESTAMPTZ,

    generation_model TEXT,
    generation_tokens INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);

CREATE INDEX idx_rams_documents_user_id ON rams_documents(user_id);
CREATE INDEX idx_rams_documents_status ON rams_documents(status);
CREATE INDEX idx_rams_documents_created_at ON rams_documents(created_at);

CREATE INDEX idx_rams_widgets_rams_id ON rams_widgets(rams_id);
CREATE INDEX idx_rams_widgets_widget_type ON rams_widgets(widget_type_id);

CREATE INDEX idx_rams_risk_assessments_rams_id ON rams_risk_assessments(rams_id);
CREATE INDEX idx_rams_risk_assessments_widget ON rams_risk_assessments(rams_widget_id);

CREATE INDEX idx_rams_revisions_rams_id ON rams_revisions(rams_id);
CREATE INDEX idx_rams_contextual_answers_rams ON rams_contextual_answers(rams_id);

CREATE INDEX idx_generated_documents_rams ON generated_documents(rams_id);
CREATE INDEX idx_user_templates_user ON user_templates(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rams_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rams_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rams_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rams_contextual_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rams_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions Policies
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Usage Logs Policies
CREATE POLICY "Users can view own usage" ON usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RAMS Documents Policies
CREATE POLICY "Users can view own RAMS" ON rams_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own RAMS" ON rams_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RAMS" ON rams_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own RAMS" ON rams_documents
    FOR DELETE USING (auth.uid() = user_id);

-- RAMS Widgets Policies
CREATE POLICY "Users can view own widgets" ON rams_widgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_widgets.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own widgets" ON rams_widgets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_widgets.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own widgets" ON rams_widgets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_widgets.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own widgets" ON rams_widgets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_widgets.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

-- Risk Assessments Policies
CREATE POLICY "Users can view own risk assessments" ON rams_risk_assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_risk_assessments.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own risk assessments" ON rams_risk_assessments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_risk_assessments.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own risk assessments" ON rams_risk_assessments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_risk_assessments.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own risk assessments" ON rams_risk_assessments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_risk_assessments.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

-- Contextual Answers Policies
CREATE POLICY "Users can view own answers" ON rams_contextual_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_contextual_answers.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own answers" ON rams_contextual_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_contextual_answers.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

-- Revisions Policies
CREATE POLICY "Users can view own revisions" ON rams_revisions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_revisions.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own revisions" ON rams_revisions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = rams_revisions.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

-- User Templates Policies
CREATE POLICY "Users can view own templates" ON user_templates
    FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can manage own templates" ON user_templates
    FOR ALL USING (auth.uid() = user_id);

-- Generated Documents Policies
CREATE POLICY "Users can view own generated docs" ON generated_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = generated_documents.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own generated docs" ON generated_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM rams_documents
            WHERE rams_documents.id = generated_documents.rams_id
            AND rams_documents.user_id = auth.uid()
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rams_documents_updated_at
    BEFORE UPDATE ON rams_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rams_widgets_updated_at
    BEFORE UPDATE ON rams_widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rams_risk_assessments_updated_at
    BEFORE UPDATE ON rams_risk_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_templates_updated_at
    BEFORE UPDATE ON user_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'user');

    INSERT INTO subscriptions (user_id, tier, status, rams_limit, rams_used_this_period)
    VALUES (NEW.id, 'free', 'active', 2, 0);

    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_rams_usage(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE subscriptions
    SET rams_used_this_period = rams_used_this_period + 1
    WHERE user_id = p_user_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to check if user can create RAMS
CREATE OR REPLACE FUNCTION can_create_rams(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_tier TEXT;
    v_limit INTEGER;
    v_used INTEGER;
BEGIN
    SELECT tier, rams_limit, rams_used_this_period
    INTO v_tier, v_limit, v_used
    FROM subscriptions
    WHERE user_id = p_user_id;

    -- Unlimited tiers
    IF v_limit IS NULL THEN
        RETURN TRUE;
    END IF;

    -- Check limit
    RETURN v_used < v_limit;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ============================================
-- SEED DATA: Reference Tables
-- ============================================

-- Note: In production, you would typically seed this via a separate seed.sql file
-- or through your application. This is included here for completeness.

-- Widget Types will be seeded via the application from constants/trades.ts
-- Hazards will be seeded via the application from constants/hazards.ts
-- Mitigations will be seeded via the application from constants/mitigations.ts
-- Questions will be seeded via the application from constants/questions.ts
