-- ==============================================================================
-- 003_seed_bandung.sql
-- Seed Data: Bandung Pilot Clusters, 10 SKU (70:30), 14-Day Bapanas Benchmarks
-- ==============================================================================

-- 1. SEED CLUSTERS
INSERT INTO clusters (id, name, qr_slug, status, delivery_mode, waitlist_count, waitlist_target, address_notes)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Antapani Indah', 'antapani-indah', 'ACTIVE', 'MOBILE_DROP_POINT', 0, 5, 'Pos Satpam Blok C / Gerbang Utama Jl. Antapani'),
    ('c2222222-2222-2222-2222-222222222222', 'Arcamanik Endah', 'arcamanik-endah', 'ACTIVE', 'MITRA_IRT_CHECKPOINT', 0, 5, 'Rumah Bu RT 04 (Mitra IRT), Jl. Pesona Arcamanik No. 12'),
    ('c3333333-3333-3333-3333-333333333333', 'Buah Batu Regency', 'buah-batu-regency', 'WAITLIST', 'WAITLIST', 2, 5, 'Komplek Buah Batu Regency Blok B')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED ACCOUNTS (REPRESENTATIVE ROLES)
INSERT INTO accounts (id, auth_user_id, email, phone, full_name, role, home_cluster_id)
VALUES
    ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@berkahtani.id', '081234567890', 'Admin Operasional Bandung', 'ADMIN', NULL),
    ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'mitra.arcamanik@berkahtani.id', '081234567891', 'Ibu Nurhayati (Mitra IRT Arcamanik)', 'MITRA_IRT', 'c2222222-2222-2222-2222-222222222222'),
    ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'petani.lembang@berkahtani.id', '081234567892', 'Kang Asep (Gapoktan Lembang)', 'VENDOR_PETANI', NULL),
    ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'pasar.caringin@berkahtani.id', '081234567893', 'Haji Mahmud (Grosir Caringin 3P)', 'VENDOR_PASAR_3P', NULL),
    ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'ibu.ani@gmail.com', '081234567894', 'Ibu Ani Suryani', 'CUSTOMER', 'c1111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Link primary IRT to Arcamanik cluster
UPDATE clusters 
SET primary_irt_account_id = 'a0000000-0000-0000-0000-000000000002'
WHERE id = 'c2222222-2222-2222-2222-222222222222';

-- 3. SEED 10 SKU PRODUCTS (70% 1P Petani, 30% 3P Pasar)
-- 3.1 First insert Sosin (which will be referenced as substitute by Pakcoy)
INSERT INTO products (id, sku, name, description, unit, category_type, min_curing_days, is_1p, substitute_product_id, is_active)
VALUES
    ('p0000000-0000-0000-0000-000000000003', 'SSN-01', 'Sosin Manis Segar', 'Sawi manis / caisim organik segar dipanen subuh dari petani Ciwidey.', 'ikat (250gr)', 'VEGETABLE_1P', 0, true, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- 3.2 Insert other products
INSERT INTO products (id, sku, name, description, unit, category_type, min_curing_days, is_1p, substitute_product_id, is_active)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'UBI-CLM-01', 'Ubi Cilembu Madu Sumedang', 'Ubi Cilembu oven grade super, dipanen dan diperam minimal 14 hari sampai madu keluar alami.', 'kg', 'TUBER_CURED_1P', 14, true, NULL, true),
    ('p0000000-0000-0000-0000-000000000002', 'PKC-01', 'Pakcoy Hidroponik Lembang', 'Pakcoy baby crunchy bebas pestisida sintesis dari green house Lembang.', 'pack (250gr)', 'VEGETABLE_1P', 0, true, 'p0000000-0000-0000-0000-000000000003', true),
    ('p0000000-0000-0000-0000-000000000004', 'AYM-FLT-01', 'Ayam Filet Dada Segar', 'Dada ayam tanpa tulang higienis, halal RPA modern, dingin tanpa formalin.', '500gr', 'PROTEIN_1P', 0, true, NULL, true),
    ('p0000000-0000-0000-0000-000000000005', 'TLR-AYM-01', 'Telur Ayam Negeri Fresh', 'Telur segar peternak Ciamis, cangkang coklat tebal bebas retak.', 'kg (16 butir)', 'PROTEIN_1P', 0, true, NULL, true),
    ('p0000000-0000-0000-0000-000000000006', 'KKG-LMB-01', 'Kangkung Akar Lembang', 'Kangkung petik segar berakar utuh daun hijau segar tidak berlubang.', 'ikat (300gr)', 'VEGETABLE_1P', 0, true, NULL, true),
    ('p0000000-0000-0000-0000-000000000007', 'BRS-PW-05', 'Beras Pandan Wangi Cianjur 5kg', 'Beras pulen wangi alami tanpa pengawet & pemutih langsung dari penggilingan padi Cianjur.', 'karung 5kg', 'STAPLE_3P', 0, true, NULL, true),
    ('p0000000-0000-0000-0000-000000000008', 'CBI-RWT-3P', 'Cabai Rawit Merah Domba', 'Cabai rawit domba pedas segar grade A pasokan Pasar Induk Caringin.', 'pack (200gr)', 'SPICE_3P', 0, false, NULL, true),
    ('p0000000-0000-0000-0000-000000000009', 'BWG-MRH-3P', 'Bawang Merah Brebes Pilihan', 'Bawang merah kering simpan aroma tajam bersih dari tanah.', '500gr', 'SPICE_3P', 0, false, NULL, true),
    ('p0000000-0000-0000-0000-000000000010', 'MYK-GRG-2L', 'Minyak Goreng Sawit Pouch 2L', 'Minyak goreng kelapa sawit jernih fortifikasi vitamin A.', 'pouch 2L', 'STAPLE_3P', 0, false, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED 14-DAY HISTORICAL MARKET BENCHMARKS (BAPANAS BANDUNG)
-- Generated for each of the 10 products across 14 past days
DO $$
DECLARE
    prod RECORD;
    d INT;
    curr_date DATE := CURRENT_DATE;
    base_price INT;
    fluctuation INT;
BEGIN
    FOR prod IN SELECT id, sku FROM products LOOP
        -- Define base price according to product
        IF prod.sku = 'UBI-CLM-01' THEN base_price := 18000;
        ELSIF prod.sku = 'PKC-01' THEN base_price := 6000;
        ELSIF prod.sku = 'SSN-01' THEN base_price := 5000;
        ELSIF prod.sku = 'AYM-FLT-01' THEN base_price := 32000;
        ELSIF prod.sku = 'TLR-AYM-01' THEN base_price := 28500;
        ELSIF prod.sku = 'KKG-LMB-01' THEN base_price := 4500;
        ELSIF prod.sku = 'BRS-PW-05' THEN base_price := 78000;
        ELSIF prod.sku = 'CBI-RWT-3P' THEN base_price := 16000;
        ELSIF prod.sku = 'BWG-MRH-3P' THEN base_price := 22000;
        ELSIF prod.sku = 'MYK-GRG-2L' THEN base_price := 34000;
        ELSE base_price := 10000;
        END IF;

        FOR d IN 0..14 LOOP
            -- Create slight deterministic realistic market variations (+/- 8%)
            fluctuation := CAST((sin(d + 1) * 0.06 * base_price) AS INT);
            INSERT INTO market_benchmarks (product_id, benchmark_date, price_idr, source_name)
            VALUES (
                prod.id, 
                curr_date - d, 
                base_price + fluctuation, 
                'Bapanas Bandung'
            )
            ON CONFLICT (product_id, benchmark_date) DO UPDATE 
            SET price_idr = EXCLUDED.price_idr;
        END LOOP;
    END LOOP;
END $$;

-- 5. SEED TODAY'S ACTIVE DAILY CYCLE
INSERT INTO daily_cycles (
    id, 
    cycle_date, 
    status, 
    cutoff_vendor_at, 
    publish_catalog_at, 
    cutoff_groupbuy_at
)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    'OPEN',
    (CURRENT_DATE || ' 15:00:00+07')::TIMESTAMPTZ,
    (CURRENT_DATE || ' 16:00:00+07')::TIMESTAMPTZ,
    (CURRENT_DATE || ' 20:00:00+07')::TIMESTAMPTZ
)
ON CONFLICT (cycle_date) DO NOTHING;

-- 6. SEED VENDOR OFFERS & PUBLISHED CATALOG PRICES FOR TODAY
INSERT INTO vendor_daily_offers (
    id, cycle_id, vendor_id, product_id, net_price_idr, pack_cost_idr, stock_qty, harvest_date, ready_to_consume_date, status, is_late
)
VALUES
    ('v0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 12000, 1000, 50, CURRENT_DATE - 16, CURRENT_DATE - 1, 'APPROVED', false),
    ('v0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000002', 3800, 500, 40, CURRENT_DATE, CURRENT_DATE, 'APPROVED', false),
    ('v0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000003', 3000, 400, 30, CURRENT_DATE, CURRENT_DATE, 'APPROVED', false),
    ('v0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000004', 24000, 1500, 25, CURRENT_DATE, CURRENT_DATE, 'APPROVED', false),
    ('v0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000005', 22000, 800, 60, CURRENT_DATE - 1, CURRENT_DATE, 'APPROVED', false),
    ('v0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000008', 11500, 500, 30, CURRENT_DATE, CURRENT_DATE, 'APPROVED', false)
ON CONFLICT (id) DO NOTHING;

-- Publish prices for the cycle
INSERT INTO daily_catalog_prices (
    id, cycle_id, product_id, sell_price_idr, min_safe_price_idr, vendor_offer_id, is_failover_3p, signal_type, farmer_split_idr, ops_split_idr, published_at
)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 17500, 17200, 'v0000000-0000-0000-0000-000000000001', false, 'PRICE_DROP', 12000, 5500, NOW()),
    ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 7600, 7600, 'v0000000-0000-0000-0000-000000000002', false, 'STABLE', 3800, 3800, NOW()),
    ('c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004', 31000, 30900, 'v0000000-0000-0000-0000-000000000004', false, 'STABLE', 24000, 7000, NOW()),
    ('c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000008', 16100, 16100, 'v0000000-0000-0000-0000-000000000006', true, 'PRICE_DROP', 11500, 4600, NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. SEED INITIAL CRM KITCHEN PROFILE & WALLET FOR BU ANI
INSERT INTO crm_kitchen_profiles (id, customer_id, family_members_count, preferred_portion, preferred_notify_time, dietary_preferences)
VALUES (
    'k0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000005',
    4,
    '500gr',
    '08:30:00',
    ARRAY['sayur_organik', 'daging_halal_rpa']
)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO wallet_ledger (id, customer_id, amount_idr, type, status, notes)
VALUES (
    'w0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000005',
    25000,
    'CREDIT_CASHBACK',
    'AVAILABLE',
    'Bonus Cashback Selamat Datang Warga Antapani Indah'
)
ON CONFLICT (id) DO NOTHING;
