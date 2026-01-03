-- ROAST Skincare AI App
-- Storage Buckets Configuration
-- Version: 1.0.0

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Avatars bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Scans bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'scans',
    'scans',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Progress photos bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'progress',
    'progress',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Ingredients bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'ingredients',
    'ingredients',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Reports bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'reports',
    'reports',
    false,
    20971520, -- 20MB
    ARRAY['application/pdf']
);

-- ============================================
-- STORAGE POLICIES FOR AVATARS (Public)
-- ============================================

-- Anyone can view avatars
CREATE POLICY "Avatars are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================
-- STORAGE POLICIES FOR SCANS (Private)
-- ============================================

CREATE POLICY "Users can view their own scans"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'scans' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can upload their own scans"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'scans' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own scans"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'scans' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================
-- STORAGE POLICIES FOR PROGRESS (Private)
-- ============================================

CREATE POLICY "Users can view their own progress photos"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'progress' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can upload their own progress photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'progress' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own progress photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'progress' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================
-- STORAGE POLICIES FOR INGREDIENTS (Private)
-- ============================================

CREATE POLICY "Users can view their own ingredient scans"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'ingredients' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can upload their own ingredient scans"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'ingredients' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own ingredient scans"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'ingredients' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================
-- STORAGE POLICIES FOR REPORTS (Private)
-- ============================================

CREATE POLICY "Users can view their own reports"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'reports' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can download their own reports"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'reports' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own reports"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'reports' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
