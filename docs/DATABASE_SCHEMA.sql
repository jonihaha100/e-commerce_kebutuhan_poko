-- ==============================================================================
-- DATABASE SCHEMA: Agri-Commerce Bandung (Berkah Tani Sejahtera / Agrojaya)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CLUSTERS (GEOFENCING & DROPOFF POINTS)
CREATE TABLE IF NOT EXISTS clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    qr_slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'WAITLIST', 'INACTIVE')),
    delivery_mode VARCHAR(30) NOT NULL DEFAULT 'MOBILE_DROP_POINT' CHECK (delivery_mode IN ('MOBILE_DROP_POINT', 'MITRA_IRT_CHECKPOINT', 'WAITLIST')),
    waitlist_count INT NOT NULL DEFAULT 0,
    waitlist_target INT NOT NULL DEFAULT 5,
    primary_irt_account_id UUID,
    backup_irt_account_id UUID,
    address_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ACCOUNTS (USER & ROLE MANAGEMENT)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30),
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN (
        'CUSTOMER',
        'MITRA_IRT',
        'VENDOR_PETANI',
        'VENDOR_PASAR_3P',
        'VENDOR_PROTEIN',
        'ADMIN'
    )),
    home_cluster_id UUID REFERENCES clusters(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Circular foreign key reference for clusters IRT accounts
ALTER TABLE clusters 
    ADD CONSTRAINT fk_clusters_primary_irt FOREIGN KEY (primary_irt_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_clusters_backup_irt FOREIGN KEY (backup_irt_account_id) REFERENCES accounts(id) ON DELETE SET NULL;

-- 3. PRODUCTS (MASTER CATALOGUE & CURING RULES)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    unit VARCHAR(20) NOT NULL DEFAULT 'ikat',
    category_type VARCHAR(30) NOT NULL CHECK (category_type IN (
        'VEGETABLE_1P',
        'TUBER_CURED_1P',
        'PROTEIN_1P',
        'SPICE_3P',
        'STAPLE_3P'
    )),
    min_curing_days INT NOT NULL DEFAULT 0,
    is_1p BOOLEAN NOT NULL DEFAULT true,
    substitute_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DAILY CYCLES (OPERATIONAL SCHEDULE PER CYCLE DATE)
CREATE TABLE IF NOT EXISTS daily_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_date DATE UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'OPEN', 'LOCKED', 'COMPLETED')),
    cutoff_vendor_at TIMESTAMPTZ NOT NULL,
    publish_catalog_at TIMESTAMPTZ NOT NULL,
    cutoff_groupbuy_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MARKET BENCHMARKS (BAPANAS / REGIONAL COMMODITY TRACKER)
CREATE TABLE IF NOT EXISTS market_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    benchmark_date DATE NOT NULL,
    price_idr INT NOT NULL CHECK (price_idr > 0),
    source_name VARCHAR(100) NOT NULL DEFAULT 'Bapanas Bandung',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, benchmark_date)
);

-- 6. VENDOR DAILY OFFERS (HULU INPUT WITH GUARDRAILS)
CREATE TABLE IF NOT EXISTS vendor_daily_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES daily_cycles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    net_price_idr INT NOT NULL CHECK (net_price_idr > 0),
    pack_cost_idr INT NOT NULL DEFAULT 0 CHECK (pack_cost_idr >= 0),
    stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    harvest_date DATE,
    ready_to_consume_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED',
        'PENDING_ADMIN_REVIEW',
        'APPROVED',
        'REJECTED'
    )),
    is_late BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cycle_id, vendor_id, product_id)
);

-- 7. DAILY CATALOG PRICES (FINAL STOREFRONT PRICING & CIRCUIT BREAKER)
CREATE TABLE IF NOT EXISTS daily_catalog_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES daily_cycles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sell_price_idr INT NOT NULL,
    min_safe_price_idr INT NOT NULL,
    vendor_offer_id UUID REFERENCES vendor_daily_offers(id) ON DELETE SET NULL,
    is_failover_3p BOOLEAN NOT NULL DEFAULT false,
    signal_type VARCHAR(20) NOT NULL DEFAULT 'STABLE' CHECK (signal_type IN ('PRICE_DROP', 'STABLE', 'SUPPLY_TIGHT')),
    farmer_split_idr INT NOT NULL,
    ops_split_idr INT NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cycle_id, product_id),
    CONSTRAINT chk_sell_ge_min_safe CHECK (sell_price_idr >= min_safe_price_idr),
    CONSTRAINT chk_open_book_sum CHECK (farmer_split_idr + ops_split_idr = sell_price_idr)
);

-- 8. ORDERS (CUSTOMER TRANSACTIONS & GROUP-BUY LOGIC)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    cycle_id UUID NOT NULL REFERENCES daily_cycles(id),
    cluster_id UUID NOT NULL REFERENCES clusters(id),
    customer_id UUID NOT NULL REFERENCES accounts(id),
    total_amount_idr INT NOT NULL CHECK (total_amount_idr >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED')),
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED' CHECK (delivery_status IN (
        'SCHEDULED',
        'DISPATCHED_TO_HUB',
        'READY_AT_CHECKPOINT',
        'DELIVERED'
    )),
    is_group_buy_qualified BOOLEAN NOT NULL DEFAULT false,
    cashback_amount_idr INT NOT NULL DEFAULT 0,
    delivery_slot VARCHAR(50) DEFAULT 'Pagi (05:00 - 08:00 WIB)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    qty INT NOT NULL CHECK (qty > 0),
    unit_price_idr INT NOT NULL CHECK (unit_price_idr >= 0),
    subtotal_idr INT NOT NULL CHECK (subtotal_idr >= 0),
    farmer_split_idr INT NOT NULL DEFAULT 0,
    ops_split_idr INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PURCHASE ORDERS HULU (AGGREGATED SURAT JALAN - ANTI-ATM)
CREATE TABLE IF NOT EXISTS purchase_orders_hulu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES daily_cycles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    total_aggregated_qty INT NOT NULL CHECK (total_aggregated_qty >= 0),
    unit_net_price_idr INT NOT NULL CHECK (unit_net_price_idr >= 0),
    total_payout_idr INT NOT NULL CHECK (total_payout_idr >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'DELIVERED_TO_HUB', 'SETTLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cycle_id, vendor_id, product_id)
);

-- 11. CRM KITCHEN PROFILES (PROGRESSIVE PROFILING & PANTRY)
CREATE TABLE IF NOT EXISTS crm_kitchen_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID UNIQUE NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    family_members_count INT NOT NULL DEFAULT 3,
    preferred_portion VARCHAR(20) NOT NULL DEFAULT '500gr' CHECK (preferred_portion IN ('250gr', '500gr', '1kg')),
    preferred_notify_time TIME DEFAULT '08:00:00',
    dietary_preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. WALLET LEDGER (LOYALTY, CASHBACK & QUICK REFUND)
CREATE TABLE IF NOT EXISTS wallet_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount_idr INT NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('CREDIT_CASHBACK', 'CREDIT_REFUND', 'DEBIT_PURCHASE')),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'PENDING', 'USED')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AI AGENT ALERTS (ANOMALY, PRICE SURGE & QUALITY MONITOR)
CREATE TABLE IF NOT EXISTS ai_agent_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID REFERENCES daily_cycles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    agent_name VARCHAR(50) NOT NULL CHECK (agent_name IN ('HULU_AGENT', 'QUALITY_AGENT', 'PRICING_AGENT')),
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
