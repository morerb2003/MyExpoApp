-- ============================================================================
-- Worko Database Seed Data
-- ============================================================================

DO $$
DECLARE
    default_user_id UUID;
BEGIN
    -- 1. Create Default Demo User if not exists
    SELECT id INTO default_user_id FROM users WHERE email = 'demo@worko.app';

    IF default_user_id IS NULL THEN
        INSERT INTO users (email, full_name, avatar_url)
        VALUES ('demo@worko.app', 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
        RETURNING id INTO default_user_id;

        -- 2. User Settings
        INSERT INTO user_settings (user_id, theme, focus_duration, notifications_enabled, sound_enabled)
        VALUES (default_user_id, 'system', 25, true, true);

        -- 3. Initial Tasks
        INSERT INTO tasks (user_id, title, description, priority, category, due_date, status) VALUES
        (default_user_id, 'Finalize Q3 Product Roadmap', 'Align engineering milestones with design sprints', 'high', 'Product', CURRENT_DATE + INTERVAL '2 days', 'in-progress'),
        (default_user_id, 'Design System Dark Mode Audit', 'Verify color contrast and token consistency across all mobile cards', 'medium', 'Design', CURRENT_DATE + INTERVAL '4 days', 'todo'),
        (default_user_id, 'Refactor PostgreSQL Schema', 'Create tables and foreign keys with user_id', 'high', 'Engineering', CURRENT_DATE, 'completed'),
        (default_user_id, 'Prepare Team Sync Presentation', 'Summarize key metrics and launch readiness', 'low', 'Meeting', CURRENT_DATE + INTERVAL '5 days', 'todo');

        -- 4. Calendar Events
        INSERT INTO calendar_events (user_id, title, description, event_date, start_time, duration, category, color, attendees) VALUES
        (default_user_id, 'Sprint Planning & Grooming', 'Bi-weekly backlog refinement with core dev team', CURRENT_DATE, '10:00', '45m', 'Meeting', '#BED8EA', ARRAY['Alex M.', 'David K.', 'Elena R.']),
        (default_user_id, 'Design Review & Prototype Demo', 'Walkthrough high-fidelity mobile dashboard', CURRENT_DATE + INTERVAL '1 day', '14:30', '60m', 'Design', '#F4B3A3', ARRAY['Alex M.', 'Elena R.']),
        (default_user_id, 'Architecture Sync', 'Database indices and connection pool sizing', CURRENT_DATE + INTERVAL '3 days', '16:00', '30m', 'Engineering', '#D8B4E2', ARRAY['Alex M.', 'Marcus L.']);

        -- 5. Notes
        INSERT INTO notes (user_id, title, content, category, color, is_pinned) VALUES
        (default_user_id, 'System Architecture Decisions', 'Using relational PostgreSQL with user_id tenancy for multi-user safety. UUID keys allow seamless offline sync.', 'Engineering', '#BED8EA', true),
        (default_user_id, 'Design Tokens & Typography', 'Primary font Outfit / Inter with soft pastel accents: Coral #F4B3A3, Sky #BED8EA, Mint #BDE0C8.', 'Design', '#F4B3A3', true),
        (default_user_id, 'Quarterly Goals', '1. Complete mobile offline mode\n2. Ship multi-user collaboration\n3. Reach 99.9% uptime on API service', 'Product', '#D8B4E2', false);

        -- 6. Team Members
        INSERT INTO team_members (user_id, name, initials, role, status, color, project, focus, last_active) VALUES
        (default_user_id, 'Elena Rostova', 'ER', 'Lead Product Designer', 'online', '#F4B3A3', 'Mobile UI', 'Prototyping fluid gestures', 'Active now'),
        (default_user_id, 'Marcus Liang', 'ML', 'Staff Backend Engineer', 'focus', '#BED8EA', 'API Core', 'Database connection pooling', '12m ago'),
        (default_user_id, 'David Kim', 'DK', 'DevOps & Infra', 'online', '#BDE0C8', 'Cloud & DB', 'Monitoring cluster health', 'Active now'),
        (default_user_id, 'Sofia Patel', 'SP', 'Frontend Specialist', 'away', '#D8B4E2', 'Web & Mobile', 'AFK until 3 PM', '1h ago');

        -- 7. Activities
        INSERT INTO activities (user_id, actor, message, tone) VALUES
        (default_user_id, 'Alex', 'completed task “Refactor PostgreSQL Schema”', 'mint'),
        (default_user_id, 'Elena', 'updated status to “online”', 'sky'),
        (default_user_id, 'Marcus', 'started a 45m deep focus session', 'coral');

        -- 8. Focus Session
        INSERT INTO focus_sessions (user_id, duration_minutes, completed, notes, started_at, completed_at) VALUES
        (default_user_id, 25, true, 'Completed initial database migration review', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '5 minutes');

        RAISE NOTICE 'Demo user and initial seeds created successfully with user_id: %', default_user_id;
    ELSE
        RAISE NOTICE 'User demo@worko.app already exists with ID: %', default_user_id;
    END IF;
END $$;
