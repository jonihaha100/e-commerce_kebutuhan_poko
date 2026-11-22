-- ==============================================================================
-- 002_rls_anti_atm.sql
-- Row Level Security (RLS) Anti-ATM & Strict Privacy Separation
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders_hulu ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_daily_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_kitchen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_catalog_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_benchmarks ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTIONS TO RESOLVE AUTHENTICATED USER CONTEXT
CREATE OR REPLACE FUNCTION current_account_id()
RETURNS UUID AS $$
    SELECT id FROM accounts WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_account_role()
RETURNS VARCHAR AS $$
    SELECT role FROM accounts WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- POLICIES: PUBLIC / SHARED READING
-- ==============================================================================

-- Clusters & Products are public read-only for all authenticated & anon users
CREATE POLICY "Public can view active clusters"
    ON clusters FOR SELECT
    USING (true);

CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (is_active = true OR current_account_role() = 'ADMIN');

CREATE POLICY "Public can view open daily cycles"
    ON daily_cycles FOR SELECT
    USING (status IN ('OPEN', 'LOCKED', 'COMPLETED') OR current_account_role() IN ('ADMIN', 'VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN'));

CREATE POLICY "Public can view published catalog prices"
    ON daily_catalog_prices FOR SELECT
    USING (published_at IS NOT NULL OR current_account_role() = 'ADMIN');

CREATE POLICY "Public can view market benchmarks"
    ON market_benchmarks FOR SELECT
    USING (true);

-- ==============================================================================
-- POLICIES: ACCOUNTS
-- ==============================================================================

-- Admin full access
CREATE POLICY "Admin full access to accounts"
    ON accounts FOR ALL
    USING (current_account_role() = 'ADMIN');

-- Users can read and update their own account
CREATE POLICY "Users can read own account"
    ON accounts FOR SELECT
    USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own account"
    ON accounts FOR UPDATE
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- NOTE: VENDOR_PETANI, VENDOR_PASAR_3P, VENDOR_PROTEIN are EXCLUDED from customer accounts!
-- They have NO policy to select accounts where role = 'CUSTOMER'.

-- ==============================================================================
-- POLICIES: ORDERS & ORDER ITEMS (ANTI-ATM)
-- ==============================================================================

-- Admin full access to orders
CREATE POLICY "Admin full access to orders"
    ON orders FOR ALL
    USING (current_account_role() = 'ADMIN');

-- CUSTOMER: can only read and create their own orders
CREATE POLICY "Customer can read own orders"
    ON orders FOR SELECT
    USING (
        current_account_role() = 'CUSTOMER' AND customer_id = current_account_id()
    );

CREATE POLICY "Customer can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (
        current_account_role() = 'CUSTOMER' AND customer_id = current_account_id()
    );

-- MITRA_IRT: can ONLY read orders in clusters where they are assigned as primary or backup
CREATE POLICY "Mitra IRT can read assigned cluster orders"
    ON orders FOR SELECT
    USING (
        current_account_role() = 'MITRA_IRT' AND
        cluster_id IN (
            SELECT id FROM clusters 
            WHERE primary_irt_account_id = current_account_id() 
               OR backup_irt_account_id = current_account_id()
        )
    );

-- VENDORS (PETANI, PASAR_3P, PROTEIN): DILARANG TOTAL (NO POLICY = 0 ROWS)

-- ORDER ITEMS POLICIES
CREATE POLICY "Admin full access to order items"
    ON order_items FOR ALL
    USING (current_account_role() = 'ADMIN');

CREATE POLICY "Customer can read own order items"
    ON order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders WHERE customer_id = current_account_id()
        )
    );

CREATE POLICY "Customer can insert own order items"
    ON order_items FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id FROM orders WHERE customer_id = current_account_id()
        )
    );

CREATE POLICY "Mitra IRT can read assigned cluster order items"
    ON order_items FOR SELECT
    USING (
        order_id IN (
            SELECT o.id FROM orders o
            JOIN clusters c ON o.cluster_id = c.id
            WHERE c.primary_irt_account_id = current_account_id() 
               OR c.backup_irt_account_id = current_account_id()
        )
    );

-- ==============================================================================
-- POLICIES: PURCHASE ORDERS HULU (AGGREGATED SURAT JALAN)
-- ==============================================================================

CREATE POLICY "Admin full access to purchase orders hulu"
    ON purchase_orders_hulu FOR ALL
    USING (current_account_role() = 'ADMIN');

-- Vendors can ONLY read purchase orders belonging to their own vendor_id
CREATE POLICY "Vendor can read own purchase orders hulu"
    ON purchase_orders_hulu FOR SELECT
    USING (
        current_account_role() IN ('VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN') AND
        vendor_id = current_account_id()
    );

-- ==============================================================================
-- POLICIES: VENDOR DAILY OFFERS
-- ==============================================================================

CREATE POLICY "Admin full access to vendor daily offers"
    ON vendor_daily_offers FOR ALL
    USING (current_account_role() = 'ADMIN');

-- Vendors can only read, create, and update their own offers
CREATE POLICY "Vendor can read own daily offers"
    ON vendor_daily_offers FOR SELECT
    USING (
        current_account_role() IN ('VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN') AND
        vendor_id = current_account_id()
    );

CREATE POLICY "Vendor can insert own daily offers"
    ON vendor_daily_offers FOR INSERT
    WITH CHECK (
        current_account_role() IN ('VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN') AND
        vendor_id = current_account_id()
    );

CREATE POLICY "Vendor can update own daily offers"
    ON vendor_daily_offers FOR UPDATE
    USING (
        current_account_role() IN ('VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN') AND
        vendor_id = current_account_id()
    )
    WITH CHECK (
        current_account_role() IN ('VENDOR_PETANI', 'VENDOR_PASAR_3P', 'VENDOR_PROTEIN') AND
        vendor_id = current_account_id()
    );

-- ==============================================================================
-- POLICIES: CRM KITCHEN PROFILES & WALLET LEDGER
-- ==============================================================================

CREATE POLICY "Admin full access to crm kitchen profiles"
    ON crm_kitchen_profiles FOR ALL
    USING (current_account_role() = 'ADMIN');

CREATE POLICY "Customer can manage own kitchen profile"
    ON crm_kitchen_profiles FOR ALL
    USING (customer_id = current_account_id())
    WITH CHECK (customer_id = current_account_id());

CREATE POLICY "Admin full access to wallet ledger"
    ON wallet_ledger FOR ALL
    USING (current_account_role() = 'ADMIN');

CREATE POLICY "Customer can view own wallet ledger"
    ON wallet_ledger FOR SELECT
    USING (customer_id = current_account_id());

-- AI Agent alerts
CREATE POLICY "Admin full access to ai alerts"
    ON ai_agent_alerts FOR ALL
    USING (current_account_role() = 'ADMIN');
