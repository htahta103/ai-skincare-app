-- ROAST Skincare AI App
-- Seed Data for Products & Challenges
-- Version: 1.0.0

-- ============================================
-- SKINCARE PRODUCTS (Sample Data)
-- ============================================

INSERT INTO public.products (name, brand, category, ingredients, metadata) VALUES
-- Cleansers
('Gentle Foaming Cleanser', 'CeraVe', 'cleanser', 
 ARRAY['Water', 'Glycerin', 'Sodium Lauroyl Sarcosinate', 'Niacinamide', 'Ceramide NP'],
 '{"skin_types": ["all"], "price_range": "budget", "rating": 4.7}'::jsonb),

('Hydrating Facial Cleanser', 'CeraVe', 'cleanser',
 ARRAY['Water', 'Glycerin', 'Ceramides', 'Hyaluronic Acid', 'Phytosphingosine'],
 '{"skin_types": ["dry", "sensitive"], "price_range": "budget", "rating": 4.8}'::jsonb),

('Soy Face Cleanser', 'Fresh', 'cleanser',
 ARRAY['Water', 'Glycerin', 'Soy Proteins', 'Cucumber Extract', 'Rose Water'],
 '{"skin_types": ["all"], "price_range": "premium", "rating": 4.5}'::jsonb),

-- Toners
('Glycolic Acid 7% Toning Solution', 'The Ordinary', 'toner',
 ARRAY['Water', 'Glycolic Acid', 'Rosa Damascena Flower Water', 'Aloe Barbadensis'],
 '{"skin_types": ["oily", "combination"], "price_range": "budget", "rating": 4.6}'::jsonb),

('Hydrating Toner', 'Klairs', 'toner',
 ARRAY['Water', 'Beta-Glucan', 'Centella Asiatica', 'Sodium Hyaluronate'],
 '{"skin_types": ["dry", "sensitive"], "price_range": "mid", "rating": 4.7}'::jsonb),

-- Serums
('Niacinamide 10% + Zinc 1%', 'The Ordinary', 'serum',
 ARRAY['Water', 'Niacinamide', 'Zinc PCA', 'Pentylene Glycol'],
 '{"skin_types": ["oily", "acne-prone"], "price_range": "budget", "rating": 4.5}'::jsonb),

('Hyaluronic Acid 2% + B5', 'The Ordinary', 'serum',
 ARRAY['Water', 'Sodium Hyaluronate', 'Panthenol', 'Ahnfeltia Concinna Extract'],
 '{"skin_types": ["all"], "price_range": "budget", "rating": 4.6}'::jsonb),

('Vitamin C Serum 23% + HA Spheres', 'Drunk Elephant', 'serum',
 ARRAY['Water', 'L-Ascorbic Acid', 'Ferulic Acid', 'Vitamin E'],
 '{"skin_types": ["all"], "price_range": "premium", "rating": 4.7}'::jsonb),

('Retinol 0.5% in Squalane', 'The Ordinary', 'serum',
 ARRAY['Squalane', 'Retinol', 'Jojoba Seed Oil'],
 '{"skin_types": ["normal", "oily"], "price_range": "budget", "rating": 4.4}'::jsonb),

-- Moisturizers
('Moisturizing Cream', 'CeraVe', 'moisturizer',
 ARRAY['Water', 'Glycerin', 'Ceramides', 'Hyaluronic Acid', 'Petrolatum'],
 '{"skin_types": ["dry", "normal"], "price_range": "budget", "rating": 4.8}'::jsonb),

('PM Facial Moisturizing Lotion', 'CeraVe', 'moisturizer',
 ARRAY['Water', 'Glycerin', 'Niacinamide', 'Ceramides', 'Hyaluronic Acid'],
 '{"skin_types": ["all"], "price_range": "budget", "rating": 4.7}'::jsonb),

('Water Cream', 'Tatcha', 'moisturizer',
 ARRAY['Water', 'Glycerin', 'Japanese Wild Rose', 'Japanese Leopard Lily', 'Hyaluronic Acid'],
 '{"skin_types": ["oily", "combination"], "price_range": "luxury", "rating": 4.6}'::jsonb),

-- Sunscreens
('UV Clear Broad-Spectrum SPF 46', 'EltaMD', 'sunscreen',
 ARRAY['Zinc Oxide', 'Octinoxate', 'Niacinamide', 'Hyaluronic Acid', 'Lactic Acid'],
 '{"skin_types": ["all", "acne-prone"], "price_range": "mid", "rating": 4.7}'::jsonb),

('Unseen Sunscreen SPF 40', 'Supergoop', 'sunscreen',
 ARRAY['Avobenzone', 'Homosalate', 'Octisalate', 'Red Algae'],
 '{"skin_types": ["all"], "price_range": "mid", "rating": 4.6}'::jsonb),

-- Treatments
('Adapalene Gel 0.1%', 'Differin', 'treatment',
 ARRAY['Adapalene', 'Carbomer', 'Propylene Glycol'],
 '{"skin_types": ["acne-prone"], "price_range": "mid", "rating": 4.5}'::jsonb),

('Salicylic Acid 2% Solution', 'The Ordinary', 'treatment',
 ARRAY['Water', 'Salicylic Acid', 'Witch Hazel'],
 '{"skin_types": ["oily", "acne-prone"], "price_range": "budget", "rating": 4.4}'::jsonb),

('Azelaic Acid Suspension 10%', 'The Ordinary', 'treatment',
 ARRAY['Water', 'Azelaic Acid', 'Isodecyl Neopentanoate'],
 '{"skin_types": ["all"], "price_range": "budget", "rating": 4.5}'::jsonb);

-- ============================================
-- CHALLENGE TEMPLATES (Reference Data)
-- ============================================

-- Note: These are stored in application code, but here's the reference
COMMENT ON TABLE public.challenges IS 'Available challenge types:
- glow_7: 7-day daily routine challenge
- acne_reset_30: 30-day anti-acne routine
- texture_smooth_14: 14-day exfoliation focus
- hydration_hero_21: 21-day hydration tracking
- consistency_king_30: 30-day streak challenge
- spf_warrior_14: 14-day sunscreen reminder';
