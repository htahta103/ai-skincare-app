-- Seed Products Database
-- 20 curated skincare products with affiliate links

INSERT INTO products (id, name, brand, category, ingredients, image_url, affiliate_url, metadata, created_at) VALUES

-- CLEANSERS (3)
(gen_random_uuid(), 'Hydrating Facial Cleanser', 'CeraVe', 'cleanser', 
 ARRAY['Ceramides', 'Hyaluronic Acid', 'Glycerin'],
 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
 'https://www.amazon.com/dp/B01MSSDEPK?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["dryness", "sensitivity"], "step_type": "cleanser", "price_range": "budget"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Toleriane Purifying Foaming Cleanser', 'La Roche-Posay', 'cleanser',
 ARRAY['Niacinamide', 'Ceramide-3', 'Thermal Spring Water'],
 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
 'https://www.amazon.com/dp/B01N7T7JKJ?tag=roastskin-20',
 '{"skin_types": ["oily", "combination"], "concerns_targeted": ["acne", "pores"], "step_type": "cleanser", "price_range": "mid"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Hydro Boost Hydrating Cleansing Gel', 'Neutrogena', 'cleanser',
 ARRAY['Hyaluronic Acid', 'Glycerin'],
 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
 'https://www.amazon.com/dp/B00NR1YQHQ?tag=roastskin-20',
 '{"skin_types": ["dry", "normal"], "concerns_targeted": ["dryness", "hydration"], "step_type": "cleanser", "price_range": "budget"}'::jsonb,
 NOW()),

-- TONERS (3)
(gen_random_uuid(), '2% BHA Liquid Exfoliant', 'Paula''s Choice', 'toner',
 ARRAY['Salicylic Acid', 'Green Tea Extract'],
 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
 'https://www.amazon.com/dp/B00949CTQQ?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["acne", "pores", "spots"], "step_type": "toner", "price_range": "premium"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Supple Preparation Facial Toner', 'Klairs', 'toner',
 ARRAY['Hyaluronic Acid', 'Centella Asiatica', 'Licorice Root'],
 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
 'https://www.amazon.com/dp/B00PGOFYG0?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["dryness", "redness"], "step_type": "toner", "price_range": "mid"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Glycolic Acid 7% Toning Solution', 'The Ordinary', 'toner',
 ARRAY['Glycolic Acid', 'Aloe Vera', 'Ginseng'],
 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
 'https://www.amazon.com/dp/B071D4D5DT?tag=roastskin-20',
 '{"skin_types": ["oily", "normal", "combination"], "concerns_targeted": ["spots", "aging", "pores"], "step_type": "toner", "price_range": "budget"}'::jsonb,
 NOW()),

-- SERUMS (4)
(gen_random_uuid(), 'Niacinamide 10% + Zinc 1%', 'The Ordinary', 'serum',
 ARRAY['Niacinamide', 'Zinc PCA'],
 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
 'https://www.amazon.com/dp/B06VSL3BLK?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["acne", "pores", "spots"], "step_type": "serum", "price_range": "budget"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Hyaluronic Acid 2% + B5', 'The Ordinary', 'serum',
 ARRAY['Hyaluronic Acid', 'Vitamin B5'],
 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
 'https://www.amazon.com/dp/B06Y5VSPGX?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination", "oily"], "concerns_targeted": ["dryness", "hydration", "aging"], "step_type": "serum", "price_range": "budget"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'C E Ferulic Serum', 'SkinCeuticals', 'serum',
 ARRAY['Vitamin C', 'Vitamin E', 'Ferulic Acid'],
 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
 'https://www.amazon.com/dp/B001BKTTTC?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["spots", "aging", "glow"], "step_type": "serum", "price_range": "luxury"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Retinol 0.5% in Squalane', 'The Ordinary', 'serum',
 ARRAY['Retinol', 'Squalane'],
 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
 'https://www.amazon.com/dp/B06Y4LW2CB?tag=roastskin-20',
 '{"skin_types": ["normal", "combination", "oily"], "concerns_targeted": ["aging", "spots", "pores"], "step_type": "treatment", "price_range": "budget"}'::jsonb,
 NOW()),

-- MOISTURIZERS (4)
(gen_random_uuid(), 'PM Facial Moisturizing Lotion', 'CeraVe', 'moisturizer',
 ARRAY['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
 'https://www.amazon.com/dp/B00365DABC?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["dryness", "hydration"], "step_type": "moisturizer", "price_range": "budget"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Hydro Boost Water Gel', 'Neutrogena', 'moisturizer',
 ARRAY['Hyaluronic Acid', 'Glycerin'],
 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
 'https://www.amazon.com/dp/B00NR1YX0S?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["hydration", "dryness"], "step_type": "moisturizer", "price_range": "budget"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Toleriane Double Repair Face Moisturizer', 'La Roche-Posay', 'moisturizer',
 ARRAY['Ceramide-3', 'Niacinamide', 'Glycerin'],
 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
 'https://www.amazon.com/dp/B01NCGTENH?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["redness", "dryness", "sensitivity"], "step_type": "moisturizer", "price_range": "mid"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Natural Moisturizing Factors + HA', 'The Ordinary', 'moisturizer',
 ARRAY['Amino Acids', 'Hyaluronic Acid', 'Ceramides'],
 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
 'https://www.amazon.com/dp/B06X3Y86FT?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination", "oily"], "concerns_targeted": ["hydration", "dryness"], "step_type": "moisturizer", "price_range": "budget"}'::jsonb,
 NOW()),

-- SPF / SUNSCREEN (3)
(gen_random_uuid(), 'UV Clear Broad-Spectrum SPF 46', 'EltaMD', 'spf',
 ARRAY['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'],
 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400',
 'https://www.amazon.com/dp/B002MSN3QQ?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["acne", "redness", "aging"], "step_type": "spf", "price_range": "premium"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Anthelios Melt-in Milk Sunscreen SPF 60', 'La Roche-Posay', 'spf',
 ARRAY['Avobenzone', 'Homosalate', 'Vitamin E'],
 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400',
 'https://www.amazon.com/dp/B002CML1XE?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["aging", "spots"], "step_type": "spf", "price_range": "mid"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Ultra Sheer Dry-Touch Sunscreen SPF 55', 'Neutrogena', 'spf',
 ARRAY['Avobenzone', 'Homosalate', 'Octisalate'],
 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400',
 'https://www.amazon.com/dp/B004D2826K?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["aging"], "step_type": "spf", "price_range": "budget"}'::jsonb,
 NOW()),

-- TREATMENTS (3)
(gen_random_uuid(), '8% AHA Gel Exfoliant', 'Paula''s Choice', 'treatment',
 ARRAY['Glycolic Acid', 'Chamomile Extract', 'Green Tea'],
 'https://images.unsplash.com/photo-1608979048467-6194a851284c?w=400',
 'https://www.amazon.com/dp/B00949CTOQ?tag=roastskin-20',
 '{"skin_types": ["dry", "normal", "combination"], "concerns_targeted": ["spots", "aging", "dryness"], "step_type": "treatment", "price_range": "premium"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Azelaic Acid Suspension 10%', 'The Ordinary', 'treatment',
 ARRAY['Azelaic Acid'],
 'https://images.unsplash.com/photo-1608979048467-6194a851284c?w=400',
 'https://www.amazon.com/dp/B06VSR5PPQ?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["acne", "spots", "redness"], "step_type": "treatment", "price_range": "budget"}'::jsonb,
 NOW()),

(gen_random_uuid(), 'Adapalene Gel 0.1%', 'Differin', 'treatment',
 ARRAY['Adapalene'],
 'https://images.unsplash.com/photo-1608979048467-6194a851284c?w=400',
 'https://www.amazon.com/dp/B01M0PB3JA?tag=roastskin-20',
 '{"skin_types": ["oily", "combination", "normal"], "concerns_targeted": ["acne", "pores", "aging"], "step_type": "treatment", "price_range": "mid"}'::jsonb,
 NOW());
