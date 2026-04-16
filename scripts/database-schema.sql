-- Hong Kong Education Funding Monitor System
-- Database Schema for PostgreSQL/Supabase
-- 香港教育資助監測系統數據庫架構

-- ===================
-- Funding Sources Table 資助來源表
-- ===================
CREATE TABLE IF NOT EXISTS funding_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    url VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'government', 'foundation', 'corporate'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'error'
    last_checked_at TIMESTAMP WITH TIME ZONE,
    last_updated_at TIMESTAMP WITH TIME ZONE,
    check_frequency_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- Funding Programs Table 資助計劃表
-- ===================
CREATE TABLE IF NOT EXISTS funding_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES funding_sources(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    name_zh VARCHAR(500),
    organization VARCHAR(255) NOT NULL,
    organization_zh VARCHAR(255),
    category VARCHAR(100) NOT NULL, -- '創科教育', '青年發展', '環保教育', etc.
    description TEXT,
    description_zh TEXT,
    max_amount VARCHAR(100),
    application_period VARCHAR(255),
    deadline DATE,
    status VARCHAR(20) DEFAULT 'upcoming', -- 'open', 'upcoming', 'closed'
    relevance VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    requirements TEXT,
    requirements_zh TEXT,
    url VARCHAR(500),
    source_url VARCHAR(500), -- Original announcement URL
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- Monitoring Logs Table 監測日誌表
-- ===================
CREATE TABLE IF NOT EXISTS monitoring_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES funding_sources(id) ON DELETE CASCADE,
    check_type VARCHAR(50) NOT NULL, -- 'scheduled', 'manual', 'webhook'
    status VARCHAR(20) NOT NULL, -- 'success', 'error', 'timeout'
    response_time_ms INTEGER,
    changes_detected BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- Detected Changes Table 變更記錄表
-- ===================
CREATE TABLE IF NOT EXISTS detected_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES funding_sources(id) ON DELETE CASCADE,
    program_id UUID REFERENCES funding_programs(id) ON DELETE SET NULL,
    change_type VARCHAR(50) NOT NULL, -- 'new_program', 'deadline_change', 'status_change', 'content_update'
    old_value TEXT,
    new_value TEXT,
    is_notified BOOLEAN DEFAULT FALSE,
    notified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- User Favorites Table 用戶收藏表
-- ===================
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- For future auth integration
    program_id UUID REFERENCES funding_programs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, program_id)
);

-- ===================
-- Application Tracking Table 申請追蹤表
-- ===================
CREATE TABLE IF NOT EXISTS application_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    program_id UUID REFERENCES funding_programs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'preparing', 'submitted', 'approved', 'rejected'
    submission_date DATE,
    result_date DATE,
    amount_requested DECIMAL(15, 2),
    amount_approved DECIMAL(15, 2),
    notes TEXT,
    documents JSONB, -- Store document metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- Notification Settings Table 通知設定表
-- ===================
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email VARCHAR(255),
    phone VARCHAR(50),
    notify_new_programs BOOLEAN DEFAULT TRUE,
    notify_deadline_7days BOOLEAN DEFAULT TRUE,
    notify_deadline_3days BOOLEAN DEFAULT TRUE,
    notify_deadline_1day BOOLEAN DEFAULT TRUE,
    notify_status_changes BOOLEAN DEFAULT TRUE,
    categories_filter JSONB, -- Filter by categories
    relevance_filter VARCHAR(20)[], -- Filter by relevance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================
-- Indexes 索引
-- ===================
CREATE INDEX IF NOT EXISTS idx_programs_source ON funding_programs(source_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON funding_programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_deadline ON funding_programs(deadline);
CREATE INDEX IF NOT EXISTS idx_programs_relevance ON funding_programs(relevance);
CREATE INDEX IF NOT EXISTS idx_programs_category ON funding_programs(category);
CREATE INDEX IF NOT EXISTS idx_logs_source ON monitoring_logs(source_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON monitoring_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_changes_source ON detected_changes(source_id);
CREATE INDEX IF NOT EXISTS idx_changes_notified ON detected_changes(is_notified);

-- ===================
-- Functions 函數
-- ===================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_funding_sources_updated_at
    BEFORE UPDATE ON funding_sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funding_programs_updated_at
    BEFORE UPDATE ON funding_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_tracking_updated_at
    BEFORE UPDATE ON application_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- Views 視圖
-- ===================

-- Active programs with source info
CREATE OR REPLACE VIEW v_active_programs AS
SELECT 
    p.*,
    s.name as source_name,
    s.name_zh as source_name_zh,
    s.url as source_url,
    CASE 
        WHEN p.deadline IS NULL THEN NULL
        WHEN p.deadline < CURRENT_DATE THEN 0
        ELSE p.deadline - CURRENT_DATE
    END as days_until_deadline
FROM funding_programs p
JOIN funding_sources s ON p.source_id = s.id
WHERE p.status IN ('open', 'upcoming')
ORDER BY p.deadline ASC NULLS LAST;

-- Monitoring summary
CREATE OR REPLACE VIEW v_monitoring_summary AS
SELECT 
    s.id,
    s.name,
    s.name_zh,
    s.status,
    s.last_checked_at,
    COUNT(DISTINCT p.id) as total_programs,
    COUNT(DISTINCT CASE WHEN p.status = 'open' THEN p.id END) as open_programs,
    (
        SELECT COUNT(*) 
        FROM detected_changes c 
        WHERE c.source_id = s.id 
        AND c.created_at > NOW() - INTERVAL '7 days'
    ) as recent_changes
FROM funding_sources s
LEFT JOIN funding_programs p ON s.id = p.source_id
GROUP BY s.id;

COMMENT ON TABLE funding_sources IS '資助來源表 - 儲存所有監測的資助來源';
COMMENT ON TABLE funding_programs IS '資助計劃表 - 儲存所有資助計劃詳情';
COMMENT ON TABLE monitoring_logs IS '監測日誌表 - 記錄每次監測結果';
COMMENT ON TABLE detected_changes IS '變更記錄表 - 記錄檢測到的變更';
COMMENT ON TABLE user_favorites IS '用戶收藏表 - 用戶收藏的計劃';
COMMENT ON TABLE application_tracking IS '申請追蹤表 - 追蹤申請進度';
COMMENT ON TABLE notification_settings IS '通知設定表 - 用戶通知偏好';
