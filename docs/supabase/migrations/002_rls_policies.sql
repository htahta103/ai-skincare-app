-- ROAST Skincare AI App
-- Row Level Security (RLS) Policies
-- Version: 1.0.0

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_usage ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- SKIN PROFILES POLICIES
-- ============================================

CREATE POLICY "Users can view their own skin profile"
    ON public.skin_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own skin profile"
    ON public.skin_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skin profile"
    ON public.skin_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skin profile"
    ON public.skin_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SKIN SCANS POLICIES
-- ============================================

CREATE POLICY "Users can view their own scans"
    ON public.skin_scans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans"
    ON public.skin_scans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
    ON public.skin_scans FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SCAN RESULTS POLICIES
-- ============================================

CREATE POLICY "Users can view results for their scans"
    ON public.scan_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.skin_scans
            WHERE skin_scans.id = scan_results.scan_id
            AND skin_scans.user_id = auth.uid()
        )
    );

-- ============================================
-- SCAN METRICS POLICIES
-- ============================================

CREATE POLICY "Users can view metrics for their scans"
    ON public.scan_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.skin_scans
            WHERE skin_scans.id = scan_metrics.scan_id
            AND skin_scans.user_id = auth.uid()
        )
    );

-- ============================================
-- PRODUCTS POLICIES (Public read)
-- ============================================

CREATE POLICY "Anyone can view products"
    ON public.products FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- ROUTINES POLICIES
-- ============================================

CREATE POLICY "Users can view their own routines"
    ON public.routines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routines"
    ON public.routines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines"
    ON public.routines FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines"
    ON public.routines FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- ROUTINE STEPS POLICIES
-- ============================================

CREATE POLICY "Users can view steps for their routines"
    ON public.routine_steps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.routines
            WHERE routines.id = routine_steps.routine_id
            AND routines.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create steps for their routines"
    ON public.routine_steps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.routines
            WHERE routines.id = routine_steps.routine_id
            AND routines.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update steps for their routines"
    ON public.routine_steps FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.routines
            WHERE routines.id = routine_steps.routine_id
            AND routines.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete steps for their routines"
    ON public.routine_steps FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.routines
            WHERE routines.id = routine_steps.routine_id
            AND routines.user_id = auth.uid()
        )
    );

-- ============================================
-- PROGRESS PHOTOS POLICIES
-- ============================================

CREATE POLICY "Users can view their own progress photos"
    ON public.progress_photos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress photos"
    ON public.progress_photos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos"
    ON public.progress_photos FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- CHALLENGES POLICIES
-- ============================================

CREATE POLICY "Users can view their own challenges"
    ON public.challenges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges"
    ON public.challenges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
    ON public.challenges FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- CHALLENGE PROGRESS POLICIES
-- ============================================

CREATE POLICY "Users can view their challenge progress"
    ON public.challenge_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.challenges
            WHERE challenges.id = challenge_progress.challenge_id
            AND challenges.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their challenge progress"
    ON public.challenge_progress FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.challenges
            WHERE challenges.id = challenge_progress.challenge_id
            AND challenges.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their challenge progress"
    ON public.challenge_progress FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.challenges
            WHERE challenges.id = challenge_progress.challenge_id
            AND challenges.user_id = auth.uid()
        )
    );

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Note: Updates to subscriptions should only be done by service role (webhooks)

-- ============================================
-- CHAT SESSIONS POLICIES
-- ============================================

CREATE POLICY "Users can view their own chat sessions"
    ON public.chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions"
    ON public.chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
    ON public.chat_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- CHAT MESSAGES POLICIES
-- ============================================

CREATE POLICY "Users can view messages in their sessions"
    ON public.chat_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in their sessions"
    ON public.chat_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- ============================================
-- INGREDIENT SCANS POLICIES
-- ============================================

CREATE POLICY "Users can view their own ingredient scans"
    ON public.ingredient_scans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ingredient scans"
    ON public.ingredient_scans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredient scans"
    ON public.ingredient_scans FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- INGREDIENT RESULTS POLICIES
-- ============================================

CREATE POLICY "Users can view results for their ingredient scans"
    ON public.ingredient_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ingredient_scans
            WHERE ingredient_scans.id = ingredient_results.ingredient_scan_id
            AND ingredient_scans.user_id = auth.uid()
        )
    );

-- ============================================
-- SCAN USAGE POLICIES
-- ============================================

CREATE POLICY "Users can view their own scan usage"
    ON public.scan_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scan usage"
    ON public.scan_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scan usage"
    ON public.scan_usage FOR UPDATE
    USING (auth.uid() = user_id);
