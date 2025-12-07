-- RAMS Disclaimer Acceptance Tracking
-- Records user acceptance of terms before downloading RAMS documents

CREATE TABLE rams_disclaimer_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rams_id UUID NOT NULL REFERENCES rams_documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- Acceptance details
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,

    -- Document state at time of acceptance
    rams_version INTEGER NOT NULL DEFAULT 1,
    document_hash TEXT, -- SHA256 of the generated content for audit purposes

    -- What was accepted
    disclaimer_version TEXT NOT NULL DEFAULT '1.0',

    -- Audit trail
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_disclaimer_acceptances_rams ON rams_disclaimer_acceptances(rams_id);
CREATE INDEX idx_disclaimer_acceptances_user ON rams_disclaimer_acceptances(user_id);
CREATE INDEX idx_disclaimer_acceptances_date ON rams_disclaimer_acceptances(accepted_at);

-- Unique constraint: one acceptance per user per RAMS version
CREATE UNIQUE INDEX idx_disclaimer_unique_acceptance
ON rams_disclaimer_acceptances(rams_id, user_id, rams_version);

-- Enable RLS
ALTER TABLE rams_disclaimer_acceptances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own acceptances" ON rams_disclaimer_acceptances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own acceptances" ON rams_disclaimer_acceptances
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add download_count to rams_documents if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'rams_documents'
        AND column_name = 'download_count'
    ) THEN
        ALTER TABLE rams_documents ADD COLUMN download_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'rams_documents'
        AND column_name = 'last_downloaded_at'
    ) THEN
        ALTER TABLE rams_documents ADD COLUMN last_downloaded_at TIMESTAMPTZ;
    END IF;
END $$;

-- Comment on table
COMMENT ON TABLE rams_disclaimer_acceptances IS
'Tracks user acceptance of the liability disclaimer before downloading RAMS documents.
This creates an audit trail showing that users acknowledged their responsibility
for verifying the AI-generated content.';
