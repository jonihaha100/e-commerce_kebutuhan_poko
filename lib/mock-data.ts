/**
 * lib/mock-data.ts
 * In-memory source of truth mirroring Postgres tables for instant interactive demo & fallback
 */

export interface Cluster {
  id: string;
  name: string;
  qr_slug: string;
  status: 'ACTIVE' | 'WAITLIST' | 'INACTIVE';
  delivery_mode: 'MOBILE_DROP_POINT' | 'MITRA_IRT_CHECKPOINT' | 'WAITLIST';
  waitlist_count: number;
  waitlist_target: number;
  primary_irt_account_id?: string;
  address_notes: string;
}

export interface Account {
  id: string;
  auth_user_id: string;
  email: string;
  phone: string;
  full_name: string;
  role: 'CUSTOMER' | 'MITRA_IRT' | 'VENDOR_PETANI' | 'VENDOR_PASAR_3P' | 'VENDOR_PROTEIN' | 'ADMIN';
  home_cluster_id?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  unit: string;
  category_type: 'VEGETABLE_1P' | 'TUBER_CURED_1P' | 'PROTEIN_1P' | 'SPICE_3P' | 'STAPLE_3P';
  min_curing_days: number;
  is_1p: boolean;
  substitute_product_id?: string;
  is_active: boolean;
  image_url?: string;
}

export interface MarketBenchmark {
  id: string;
  product_id: string;
  benchmark_date: string;
  price_idr: number;
  source_name: string;
}

export interface VendorDailyOffer {
  id: string;
  cycle_id: string;
  vendor_id: string;
  product_id: string;
  net_price_idr: number;
  pack_cost_idr: number;
  stock_qty: number;
  harvest_date: string;
  ready_to_consume_date: string;
  status: 'SUBMITTED' | 'PENDING_ADMIN_REVIEW' | 'APPROVED' | 'REJECTED';
  is_late: boolean;
  created_at: string;
}

export interface DailyCatalogPrice {
  id: string;
  cycle_id: string;
  product_id: string;
  sell_price_idr: number;
  min_safe_price_idr: number;
  vendor_offer_id?: string;
  is_failover_3p: boolean;
  signal_type: 'PRICE_DROP' | 'STABLE' | 'SUPPLY_TIGHT';
  farmer_split_idr: number;
  ops_split_idr: number;
  published_at?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  portion_label: string;
  qty: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  cycle_id: string;
  cluster_id: string;
  cluster_name?: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  items?: OrderItem[];
  total_amount_idr: number;
  payment_status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  delivery_status: 'SCHEDULED' | 'DISPATCHED_TO_HUB' | 'READY_AT_CHECKPOINT' | 'DELIVERED';
  is_group_buy_qualified: boolean;
  cashback_amount_idr: number;
  delivery_slot: string;
  created_at: string;
}

export interface PurchaseOrderHulu {
  id: string;
  cycle_id: string;
  vendor_id: string;
  product_id: string;
  total_aggregated_qty: number;
  unit_net_price_idr: number;
  total_payout_idr: number;
  status: 'ISSUED' | 'DELIVERED_TO_HUB' | 'SETTLED';
  created_at: string;
}

export interface AiAgentAlert {
  id: string;
  cycle_id?: string;
  product_id?: string;
  agent_name: 'HULU_AGENT' | 'QUALITY_AGENT' | 'PRICING_AGENT';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
}

// -----------------------------------------------------------------------------
// INITIAL SEED DATA
// -----------------------------------------------------------------------------

export const initialClusters: Cluster[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Antapani Indah',
    qr_slug: 'antapani-indah',
    status: 'ACTIVE',
    delivery_mode: 'MOBILE_DROP_POINT',
    waitlist_count: 0,
    waitlist_target: 5,
    address_notes: 'Pos Satpam Blok C / Gerbang Utama Jl. Antapani',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Arcamanik Endah',
    qr_slug: 'arcamanik-endah',
    status: 'ACTIVE',
    delivery_mode: 'MITRA_IRT_CHECKPOINT',
    waitlist_count: 0,
    waitlist_target: 5,
    primary_irt_account_id: 'a0000000-0000-0000-0000-000000000002',
    address_notes: 'Rumah Bu RT 04 (Mitra IRT), Jl. Pesona Arcamanik No. 12',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Cisaranten Kulon Asri',
    qr_slug: 'cisaranten-kulon-asri',
    status: 'ACTIVE',
    delivery_mode: 'MOBILE_DROP_POINT',
    waitlist_count: 0,
    waitlist_target: 5,
    address_notes: 'Pos Keamanan Gerbang Timur / Jl. Cisaranten Baru No. 8',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Guruminda Megah',
    qr_slug: 'guruminda-megah',
    status: 'ACTIVE',
    delivery_mode: 'MITRA_IRT_CHECKPOINT',
    waitlist_count: 0,
    waitlist_target: 5,
    address_notes: 'Teras Mitra IRT Bu Hj. Lilis, Jl. Megah Utama Blok H No. 5',
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Riung Bandung Permai',
    qr_slug: 'riung-bandung-permai',
    status: 'ACTIVE',
    delivery_mode: 'MOBILE_DROP_POINT',
    waitlist_count: 0,
    waitlist_target: 5,
    address_notes: 'Pos RW 08 / Balai Warga Jl. Riung Saluyu Raya',
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Buah Batu Regency',
    qr_slug: 'buah-batu-regency',
    status: 'WAITLIST',
    delivery_mode: 'WAITLIST',
    waitlist_count: 2,
    waitlist_target: 5,
    address_notes: 'Komplek Buah Batu Regency Blok B',
  },
];

export const initialAccounts: Account[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    auth_user_id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@berkahtani.id',
    phone: '081234567890',
    full_name: 'Admin Operasional Bandung',
    role: 'ADMIN',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    auth_user_id: '00000000-0000-0000-0000-000000000002',
    email: 'mitra.arcamanik@berkahtani.id',
    phone: '081234567891',
    full_name: 'Ibu Nurhayati (Mitra IRT Arcamanik)',
    role: 'MITRA_IRT',
    home_cluster_id: 'c2222222-2222-2222-2222-222222222222',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    auth_user_id: '00000000-0000-0000-0000-000000000003',
    email: 'petani.lembang@berkahtani.id',
    phone: '081234567892',
    full_name: 'Kang Asep (Gapoktan Lembang)',
    role: 'VENDOR_PETANI',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    auth_user_id: '00000000-0000-0000-0000-000000000004',
    email: 'pasar.caringin@berkahtani.id',
    phone: '081234567893',
    full_name: 'Haji Mahmud (Grosir Caringin 3P)',
    role: 'VENDOR_PASAR_3P',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    auth_user_id: '00000000-0000-0000-0000-000000000005',
    email: 'ibu.ani@gmail.com',
    phone: '081234567894',
    full_name: 'Ibu Ani Suryani',
    role: 'CUSTOMER',
    home_cluster_id: 'c1111111-1111-1111-1111-111111111111',
  },
];

export const initialProducts: Product[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    sku: 'UBI-CLM-01',
    name: 'Ubi Cilembu Madu',
    description: 'Ubi Cilembu oven grade super, dipanen dan diperam minimal 14 hari sampai madu keluar alami.',
    unit: 'kg',
    category_type: 'TUBER_CURED_1P',
    min_curing_days: 14,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    sku: 'PKC-01',
    name: 'Pakcoy Hidroponik',
    description: 'Pakcoy baby crunchy bebas pestisida sintetis dari green house.',
    unit: 'pack (250gr)',
    category_type: 'VEGETABLE_1P',
    min_curing_days: 0,
    is_1p: true,
    substitute_product_id: 'p0000000-0000-0000-0000-000000000003',
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    sku: 'SSN-01',
    name: 'Sosin Manis Segar',
    description: 'Sawi manis / caisim segar dipanen subuh langsung dari petani.',
    unit: 'ikat (250gr)',
    category_type: 'VEGETABLE_1P',
    min_curing_days: 0,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000004',
    sku: 'AYM-FLT-01',
    name: 'Ayam Filet Dada Segar',
    description: 'Dada ayam tanpa tulang higienis, halal RPA modern, dingin tanpa formalin.',
    unit: '500gr',
    category_type: 'PROTEIN_1P',
    min_curing_days: 0,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000005',
    sku: 'TLR-AYM-01',
    name: 'Telur Ayam Negeri Fresh',
    description: 'Telur ayam fresh berkualitas, cangkang coklat tebal bebas retak.',
    unit: 'kg (16 butir)',
    category_type: 'PROTEIN_1P',
    min_curing_days: 0,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000006',
    sku: 'KKG-LMB-01',
    name: 'Kangkung Akar',
    description: 'Kangkung petik segar berakar utuh daun hijau segar tidak berlubang.',
    unit: 'ikat (300gr)',
    category_type: 'VEGETABLE_1P',
    min_curing_days: 0,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000007',
    sku: 'BRS-PW-05',
    name: 'Beras Pandan Wangi 5kg',
    description: 'Beras pulen wangi alami tanpa pengawet & pemutih langsung dari penggilingan padi.',
    unit: 'karung 5kg',
    category_type: 'STAPLE_3P',
    min_curing_days: 0,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000008',
    sku: 'CBI-RWT-3P',
    name: 'Cabai Rawit Merah Domba',
    description: 'Cabai rawit domba pedas segar grade A pilihan dapur.',
    unit: 'pack (200gr)',
    category_type: 'SPICE_3P',
    min_curing_days: 0,
    is_1p: false,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000009',
    sku: 'BWG-MRH-3P',
    name: 'Bawang Merah Pilihan',
    description: 'Bawang merah kering simpan aroma tajam bersih dari tanah.',
    unit: '500gr',
    category_type: 'SPICE_3P',
    min_curing_days: 0,
    is_1p: false,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000010',
    sku: 'MYK-GRG-2L',
    name: 'Minyak Goreng Sawit Pouch 2L',
    description: 'Minyak goreng kelapa sawit jernih fortifikasi vitamin A.',
    unit: 'pouch 2L',
    category_type: 'STAPLE_3P',
    min_curing_days: 0,
    is_1p: false,
    is_active: true,
  },
];

// Generate 14-day benchmarks
export function generate14DayBenchmarks(): MarketBenchmark[] {
  const benchmarks: MarketBenchmark[] = [];
  const basePrices: Record<string, number> = {
    'UBI-CLM-01': 18000,
    'PKC-01': 6000,
    'SSN-01': 5000,
    'AYM-FLT-01': 32000,
    'TLR-AYM-01': 28500,
    'KKG-LMB-01': 4500,
    'BRS-PW-05': 78000,
    'CBI-RWT-3P': 16000,
    'BWG-MRH-3P': 22000,
    'MYK-GRG-2L': 34000,
  };

  const today = new Date();

  initialProducts.forEach((prod) => {
    const base = basePrices[prod.sku] || 10000;
    for (let d = 14; d >= 0; d--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - d);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      const fluctuation = Math.round(Math.sin(d + 1) * 0.06 * base);
      benchmarks.push({
        id: `bm-${prod.sku}-${dateStr}`,
        product_id: prod.id,
        benchmark_date: dateStr,
        price_idr: base + fluctuation,
        source_name: 'Bapanas Bandung',
      });
    }
  });

  return benchmarks;
}

export const initialBenchmarks = generate14DayBenchmarks();

export const initialVendorOffers: VendorDailyOffer[] = [
  {
    id: 'v0000000-0000-0000-0000-000000000001',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000001',
    net_price_idr: 12000,
    pack_cost_idr: 1000,
    stock_qty: 50,
    harvest_date: '2026-11-06',
    ready_to_consume_date: '2026-11-21',
    status: 'APPROVED',
    is_late: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v0000000-0000-0000-0000-000000000002',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000002',
    net_price_idr: 3800,
    pack_cost_idr: 500,
    stock_qty: 40,
    harvest_date: '2026-11-22',
    ready_to_consume_date: '2026-11-22',
    status: 'APPROVED',
    is_late: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v0000000-0000-0000-0000-000000000003',
    cycle_id: 'd0000000-0000-0000-0000-000000000003',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000003',
    net_price_idr: 3000,
    pack_cost_idr: 400,
    stock_qty: 30,
    harvest_date: '2026-11-22',
    ready_to_consume_date: '2026-11-22',
    status: 'APPROVED',
    is_late: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v0000000-0000-0000-0000-000000000004',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000004',
    net_price_idr: 24000,
    pack_cost_idr: 1500,
    stock_qty: 25,
    harvest_date: '2026-11-22',
    ready_to_consume_date: '2026-11-22',
    status: 'APPROVED',
    is_late: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v0000000-0000-0000-0000-000000000005',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000005',
    net_price_idr: 22000,
    pack_cost_idr: 800,
    stock_qty: 60,
    harvest_date: '2026-11-21',
    ready_to_consume_date: '2026-11-22',
    status: 'APPROVED',
    is_late: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v0000000-0000-0000-0000-000000000006',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000004',
    product_id: 'p0000000-0000-0000-0000-000000000008',
    net_price_idr: 11500,
    pack_cost_idr: 500,
    stock_qty: 30,
    harvest_date: '2026-11-22',
    ready_to_consume_date: '2026-11-22',
    status: 'APPROVED',
    is_late: false,
    created_at: new Date().toISOString(),
  },
];

export const initialCatalogPrices: DailyCatalogPrice[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000001', // Ubi Cilembu
    sell_price_idr: 9000,
    min_safe_price_idr: 8500,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000001',
    is_failover_3p: false,
    signal_type: 'STABLE',
    farmer_split_idr: 6000,
    ops_split_idr: 3000,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000002', // Pakcoy
    sell_price_idr: 7600,
    min_safe_price_idr: 7200,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000002',
    is_failover_3p: false,
    signal_type: 'STABLE',
    farmer_split_idr: 5500,
    ops_split_idr: 2100,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000003', // Sosin
    sell_price_idr: 5000,
    min_safe_price_idr: 4800,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000003',
    is_failover_3p: false,
    signal_type: 'PRICE_DROP',
    farmer_split_idr: 3600,
    ops_split_idr: 1400,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000004', // Ayam Filet
    sell_price_idr: 16500,
    min_safe_price_idr: 16000,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000004',
    is_failover_3p: false,
    signal_type: 'STABLE',
    farmer_split_idr: 12500,
    ops_split_idr: 4000,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000005',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000005', // Telur
    sell_price_idr: 15000,
    min_safe_price_idr: 14500,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000005',
    is_failover_3p: false,
    signal_type: 'PRICE_DROP',
    farmer_split_idr: 11000,
    ops_split_idr: 4000,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000006',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000006', // Kangkung
    sell_price_idr: 5000,
    min_safe_price_idr: 4800,
    is_failover_3p: false,
    signal_type: 'PRICE_DROP',
    farmer_split_idr: 3600,
    ops_split_idr: 1400,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000007',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000007', // Beras
    sell_price_idr: 78000,
    min_safe_price_idr: 76000,
    is_failover_3p: false,
    signal_type: 'STABLE',
    farmer_split_idr: 60000,
    ops_split_idr: 18000,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000008',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000008', // Cabai Rawit Merah
    sell_price_idr: 9000,
    min_safe_price_idr: 8800,
    is_failover_3p: true,
    signal_type: 'SUPPLY_TIGHT',
    farmer_split_idr: 6500,
    ops_split_idr: 2500,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000009',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000009', // Bawang Merah
    sell_price_idr: 9500,
    min_safe_price_idr: 9200,
    is_failover_3p: true,
    signal_type: 'SUPPLY_TIGHT',
    farmer_split_idr: 7000,
    ops_split_idr: 2500,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000010',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000010', // Minyak Goreng
    sell_price_idr: 34000,
    min_safe_price_idr: 33000,
    is_failover_3p: true,
    signal_type: 'PRICE_DROP',
    farmer_split_idr: 28000,
    ops_split_idr: 6000,
    published_at: new Date().toISOString(),
  },
];

export interface PriceTrendPoint {
  dayName: string;
  date: string;
  sellPrice: number;
  marketPrice: number;
}

export interface ProductPriceTrendInsight {
  sku: string;
  productId: string;
  signal: 'PRICE_DROP' | 'STABLE' | 'SUPPLY_TIGHT';
  changePct: number;
  changeLabel: string;
  source1Internet: string;
  source2Supplier: string;
  marketReason: string;
  shopperTip: string;
  history7d: PriceTrendPoint[];
}

export const PRODUCT_PRICE_TRENDS: Record<string, ProductPriceTrendInsight> = {
  'PKC-01': {
    sku: 'PKC-01',
    productId: 'p0000000-0000-0000-0000-000000000002',
    signal: 'STABLE',
    changePct: 0,
    changeLabel: 'Harga Stabil',
    source1Internet: 'Bapanas Kota Bandung (Pasar Kosambi & Kiaracondong: Rp 9.000)',
    source2Supplier: 'Kelompok Tani Hidroponik Mandiri Ciwidey (Input 14:00 WIB)',
    marketReason: 'Panen hidroponik green house terlindung cuaca sehingga pasokan subuh sangat teratur dan tidak terdampak hujan.',
    shopperTip: 'Kondisi pasokan sangat aman. Pilihan terbaik untuk kebutuhan sayur segar harian.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 7600, marketPrice: 9000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 7600, marketPrice: 9000 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 7700, marketPrice: 9000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 7600, marketPrice: 9000 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 7600, marketPrice: 9000 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 7600, marketPrice: 9000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 7600, marketPrice: 9000 },
    ],
  },
  'CBI-RWT-3P': {
    sku: 'CBI-RWT-3P',
    productId: 'p0000000-0000-0000-0000-000000000008',
    signal: 'SUPPLY_TIGHT',
    changePct: 18,
    changeLabel: 'Tren Naik +18%',
    source1Internet: 'Bapanas Kota Bandung (Pasar Caringin & Sederhana: Rp 11.000)',
    source2Supplier: 'Juragan Cabai Caringin Blok B (Input 14:30 WIB)',
    marketReason: 'Curah hujan deras di sentra perkebunan menyebabkan keterlambatan petik dan modal grosir naik Rp 1.500/kg.',
    shopperTip: 'Amankan pesanan hari ini sebelum potensi kenaikan lanjutan. Pilih takaran 200 gram untuk menekan anggaran belanja.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 7500, marketPrice: 9500 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 7800, marketPrice: 9800 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 8000, marketPrice: 10000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 8300, marketPrice: 10500 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 8600, marketPrice: 10800 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 8800, marketPrice: 11000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 9000, marketPrice: 11000 },
    ],
  },
  'TLR-AYM-01': {
    sku: 'TLR-AYM-01',
    productId: 'p0000000-0000-0000-0000-000000000005',
    signal: 'PRICE_DROP',
    changePct: -11,
    changeLabel: 'Lagi Turun 11%',
    source1Internet: 'Bapanas Kota Bandung (Rata-rata Pasar Tradisional: Rp 17.000)',
    source2Supplier: 'Koperasi Peternak Telur Sejahtera Lembang (Input 13:45 WIB)',
    marketReason: 'Produktivitas ayam petelur meningkat dan distribusi pakan lancar, stok subuh melimpah.',
    shopperTip: 'Waktu terbaik beli banyak! Manfaatkan harga hemat untuk stok protein keluarga (pilih kemasan 1 kg / 16 butir).',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 17000, marketPrice: 19000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 16800, marketPrice: 18500 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 16500, marketPrice: 18000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 16000, marketPrice: 17500 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 15500, marketPrice: 17000 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 15200, marketPrice: 17000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 15000, marketPrice: 17000 },
    ],
  },
  'SSN-01': {
    sku: 'SSN-01',
    productId: 'p0000000-0000-0000-0000-000000000003',
    signal: 'PRICE_DROP',
    changePct: -14,
    changeLabel: 'Lagi Turun 14%',
    source1Internet: 'Bapanas Kota Bandung (Pasar Kiaracondong: Rp 6.500)',
    source2Supplier: 'Petani Sayur Daun Gapoktan Ciwidey (Input 14:15 WIB)',
    marketReason: 'Panen serentak menghasilkan limpahan pasokan sayur daun fajar di kebun petani.',
    shopperTip: 'Harga sangat murah dan segar dingin. Cocok sebagai pengganti pakcoy untuk menu tumisan harian.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 5800, marketPrice: 7000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 5600, marketPrice: 6800 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 5500, marketPrice: 6800 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 5300, marketPrice: 6500 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 5200, marketPrice: 6500 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 5000, marketPrice: 6500 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 5000, marketPrice: 6500 },
    ],
  },
  'AYM-FLT-01': {
    sku: 'AYM-FLT-01',
    productId: 'p0000000-0000-0000-0000-000000000004',
    signal: 'STABLE',
    changePct: 0,
    changeLabel: 'Harga Stabil',
    source1Internet: 'Bapanas Kota Bandung (Pasar Sederhana: Rp 20.000)',
    source2Supplier: 'Rumah Potong Unggas Higienis Lembang (Input 14:00 WIB)',
    marketReason: 'Kontrak pasokan ayam potong dingin 4°C terjaga tanpa ada gangguan rantai pakan.',
    shopperTip: 'Daging filet dada tanpa tulang kesat higienis. Porsi 250gr praktis langsung masak.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 16500, marketPrice: 20000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 16500, marketPrice: 20000 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 16500, marketPrice: 20000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 16500, marketPrice: 20000 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 16500, marketPrice: 20000 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 16500, marketPrice: 20000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 16500, marketPrice: 20000 },
    ],
  },
  'BWG-MRH-3P': {
    sku: 'BWG-MRH-3P',
    productId: 'p0000000-0000-0000-0000-000000000009',
    signal: 'SUPPLY_TIGHT',
    changePct: 15,
    changeLabel: 'Tren Naik +15%',
    source1Internet: 'Bapanas Kota Bandung (Pasar Kosambi: Rp 12.000)',
    source2Supplier: 'Distributor Bawang Brebes Caringin (Input 14:40 WIB)',
    marketReason: 'Kiriman stok bawang merah kering dari Brebes mengalami penurunan volume harian.',
    shopperTip: 'Ambil takaran 250gr untuk kebutuhan bumbu dasar masak seminggu agar tetap hemat.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 8200, marketPrice: 10500 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 8500, marketPrice: 11000 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 8700, marketPrice: 11200 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 9000, marketPrice: 11500 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 9200, marketPrice: 11800 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 9400, marketPrice: 12000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 9500, marketPrice: 12000 },
    ],
  },
  'UBI-CLM-01': {
    sku: 'UBI-CLM-01',
    productId: 'p0000000-0000-0000-0000-000000000001',
    signal: 'STABLE',
    changePct: 0,
    changeLabel: 'Harga Stabil',
    source1Internet: 'Bapanas Jawa Barat (Pasar Tradisional: Rp 11.000)',
    source2Supplier: 'Kelompok Tani Cilembu Tanjungsari (Input 13:30 WIB)',
    marketReason: 'Ubi telah melewati proses curing (pemeraman) 14 hari penuh di gudang penyimpanan alami.',
    shopperTip: 'Getah madu sudah keluar legit alami. Sangat cocok dipanggang/oven untuk camilan sehat.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 9000, marketPrice: 11000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 9000, marketPrice: 11000 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 9000, marketPrice: 11000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 9000, marketPrice: 11000 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 9000, marketPrice: 11000 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 9000, marketPrice: 11000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 9000, marketPrice: 11000 },
    ],
  },
  'KKG-LMB-01': {
    sku: 'KKG-LMB-01',
    productId: 'p0000000-0000-0000-0000-000000000006',
    signal: 'PRICE_DROP',
    changePct: -9,
    changeLabel: 'Lagi Turun 9%',
    source1Internet: 'Bapanas Kota Bandung (Pasar Kiaracondong: Rp 6.500)',
    source2Supplier: 'Petani Sayur Lembang Fajar (Input 14:10 WIB)',
    marketReason: 'Panen air fajar lancar dengan daun hijau segar utuh dan akar bersih.',
    shopperTip: 'Kangkung petik subuh berakar utuh tahan lebih lama di kulkas rumah dibanding kangkung pasar.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 5500, marketPrice: 7000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 5400, marketPrice: 6800 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 5300, marketPrice: 6800 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 5200, marketPrice: 6500 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 5100, marketPrice: 6500 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 5000, marketPrice: 6500 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 5000, marketPrice: 6500 },
    ],
  },
  'BRS-PW-05': {
    sku: 'BRS-PW-05',
    productId: 'p0000000-0000-0000-0000-000000000007',
    signal: 'STABLE',
    changePct: 0,
    changeLabel: 'Harga Stabil',
    source1Internet: 'Bapanas Kota Bandung (PIHPS Beras Premium: Rp 85.000)',
    source2Supplier: 'Penggilingan Padi Mitra Cianjur (Input 12:00 WIB)',
    marketReason: 'Pasokan gabah giling baru terjaga dengan stok lumbung aman untuk 30 hari ke depan.',
    shopperTip: 'Beras pulen harum alami tanpa pemutih dan tanpa pewangi sintetis.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 78000, marketPrice: 85000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 78000, marketPrice: 85000 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 78000, marketPrice: 85000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 78000, marketPrice: 85000 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 78000, marketPrice: 85000 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 78000, marketPrice: 85000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 78000, marketPrice: 85000 },
    ],
  },
  'MYK-GRG-2L': {
    sku: 'MYK-GRG-2L',
    productId: 'p0000000-0000-0000-0000-000000000010',
    signal: 'PRICE_DROP',
    changePct: -6,
    changeLabel: 'Lagi Turun 6%',
    source1Internet: 'Bapanas Kota Bandung (Rata-rata Eceran: Rp 38.000)',
    source2Supplier: 'Distributor Pangan Pokok Caringin (Input 13:00 WIB)',
    marketReason: 'Ketersediaan pasokan CPO dan alokasi minyak goreng kemasan lancar tanpa hambatan logistik.',
    shopperTip: 'Harga hemat pouch 2 liter, sangat pas untuk kebutuhan memasak bulanan keluarga.',
    history7d: [
      { dayName: 'Sen', date: '17 Nov', sellPrice: 36000, marketPrice: 38000 },
      { dayName: 'Sel', date: '18 Nov', sellPrice: 35500, marketPrice: 38000 },
      { dayName: 'Rab', date: '19 Nov', sellPrice: 35000, marketPrice: 38000 },
      { dayName: 'Kam', date: '20 Nov', sellPrice: 34500, marketPrice: 38000 },
      { dayName: 'Jum', date: '21 Nov', sellPrice: 34000, marketPrice: 38000 },
      { dayName: 'Sab', date: '22 Nov', sellPrice: 34000, marketPrice: 38000 },
      { dayName: 'Min', date: '23 Nov', sellPrice: 34000, marketPrice: 38000 },
    ],
  },
};

export const initialPurchaseOrdersHulu: PurchaseOrderHulu[] = [
  {
    id: 'po000000-0000-0000-0000-000000000001',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000001',
    total_aggregated_qty: 35,
    unit_net_price_idr: 12000,
    total_payout_idr: 420000,
    status: 'ISSUED',
    created_at: new Date().toISOString(),
  },
  {
    id: 'po000000-0000-0000-0000-000000000002',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000003',
    product_id: 'p0000000-0000-0000-0000-000000000002',
    total_aggregated_qty: 28,
    unit_net_price_idr: 3800,
    total_payout_idr: 106400,
    status: 'ISSUED',
    created_at: new Date().toISOString(),
  },
  {
    id: 'po000000-0000-0000-0000-000000000003',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    vendor_id: 'a0000000-0000-0000-0000-000000000004',
    product_id: 'p0000000-0000-0000-0000-000000000008',
    total_aggregated_qty: 15,
    unit_net_price_idr: 11500,
    total_payout_idr: 172500,
    status: 'ISSUED',
    created_at: new Date().toISOString(),
  },
];

export const initialAiAlerts: AiAgentAlert[] = [
  {
    id: 'alt-001',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000008',
    agent_name: 'HULU_AGENT',
    severity: 'WARNING',
    title: 'Lonjakan Modal Cabai Rawit Merah (+28%)',
    description: 'Harga penawaran modal grosir 3P Rp16.500 lebih tinggi 28% dari benchmark Bapanas Bandung (Rp12.800). Butuh review admin.',
    is_resolved: false,
    created_at: new Date().toISOString(),
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ord-001',
    order_number: 'ORD-892101',
    cycle_id: 'd1',
    cluster_id: 'c1111111-1111-1111-1111-111111111111',
    cluster_name: 'Antapani Indah',
    customer_id: 'a0000000-0000-0000-0000-000000000005',
    customer_name: 'Ibu Ani Suryani',
    customer_phone: '081234567894',
    customer_address: 'Jl. Antapani Raya No. 42 Blok B',
    items: [
      { product_id: 'p0000000-0000-0000-0000-000000000002', product_name: 'Pakcoy Hidroponik', portion_label: 'pack (250gr)', qty: 2, unit_price: 3500 },
      { product_id: 'p0000000-0000-0000-0000-000000000004', product_name: 'Ayam Filet Dada Segar', portion_label: '500gr', qty: 1, unit_price: 24000 },
      { product_id: 'p0000000-0000-0000-0000-000000000005', product_name: 'Telur Ayam Negeri Fresh', portion_label: '1 kg (16 butir)', qty: 1, unit_price: 28500 },
    ],
    total_amount_idr: 59500,
    payment_status: 'PAID',
    delivery_status: 'DISPATCHED_TO_HUB',
    is_group_buy_qualified: true,
    cashback_amount_idr: 5950,
    delivery_slot: 'Besok 06.00 - 09.00 WIB',
    created_at: '2026-11-22T17:15:00+07:00',
  },
  {
    id: 'ord-002',
    order_number: 'ORD-892102',
    cycle_id: 'd1',
    cluster_id: 'c1111111-1111-1111-1111-111111111111',
    cluster_name: 'Antapani Indah',
    customer_id: 'a0000000-0000-0000-0000-000000000006',
    customer_name: 'Ibu Dewi Sartika',
    customer_phone: '081298765432',
    customer_address: 'Komplek Antapani Indah Blok C No. 10',
    items: [
      { product_id: 'p0000000-0000-0000-0000-000000000001', product_name: 'Ubi Cilembu Madu', portion_label: '1 kg', qty: 2, unit_price: 18000 },
      { product_id: 'p0000000-0000-0000-0000-000000000008', product_name: 'Cabai Rawit Merah Domba', portion_label: 'pack (200gr)', qty: 1, unit_price: 9000 },
    ],
    total_amount_idr: 45000,
    payment_status: 'PAID',
    delivery_status: 'SCHEDULED',
    is_group_buy_qualified: true,
    cashback_amount_idr: 4500,
    delivery_slot: 'Besok 06.00 - 09.00 WIB',
    created_at: '2026-11-22T17:40:00+07:00',
  },
  {
    id: 'ord-003',
    order_number: 'ORD-892103',
    cycle_id: 'd1',
    cluster_id: 'c2222222-2222-2222-2222-222222222222',
    cluster_name: 'Arcamanik Endah',
    customer_id: 'a0000000-0000-0000-0000-000000000007',
    customer_name: 'Bapak Hendra Gunawan',
    customer_phone: '081311223344',
    customer_address: 'Jl. Pesona Arcamanik Blok D5',
    items: [
      { product_id: 'p0000000-0000-0000-0000-000000000007', product_name: 'Beras Pandanwangi Cianjur Asli', portion_label: '5 kg', qty: 1, unit_price: 78000 },
      { product_id: 'p0000000-0000-0000-0000-000000000010', product_name: 'Minyak Goreng Sawit Pouch 2L', portion_label: 'pouch 2L', qty: 1, unit_price: 34000 },
    ],
    total_amount_idr: 112000,
    payment_status: 'PAID',
    delivery_status: 'SCHEDULED',
    is_group_buy_qualified: true,
    cashback_amount_idr: 11200,
    delivery_slot: 'Besok 06.00 - 09.00 WIB',
    created_at: '2026-11-22T18:10:00+07:00',
  },
  {
    id: 'ord-004',
    order_number: 'ORD-892104',
    cycle_id: 'd1',
    cluster_id: 'c1111111-1111-1111-1111-111111111111',
    cluster_name: 'Antapani Indah',
    customer_id: 'a0000000-0000-0000-0000-000000000008',
    customer_name: 'Ibu Ratna Kumala',
    customer_phone: '081255667788',
    customer_address: 'Jl. Antapani Selatan Blok A No. 15',
    items: [
      { product_id: 'p0000000-0000-0000-0000-000000000006', product_name: 'Kangkung Petik Fajar Lembang', portion_label: 'ikat (500gr)', qty: 2, unit_price: 3500 },
      { product_id: 'p0000000-0000-0000-0000-000000000009', product_name: 'Bawang Merah Brebes Pilihan', portion_label: '500gr', qty: 1, unit_price: 18000 },
    ],
    total_amount_idr: 25000,
    payment_status: 'PENDING',
    delivery_status: 'SCHEDULED',
    is_group_buy_qualified: false,
    cashback_amount_idr: 0,
    delivery_slot: 'Besok 06.00 - 09.00 WIB',
    created_at: '2026-11-22T18:25:00+07:00',
  },
];

// -----------------------------------------------------------------------------
// COURIER 3-HOUR SHIFT DISPATCH ARCHITECTURE (50 ORDERS / 5 CLUSTERS)
// -----------------------------------------------------------------------------

export interface DispatchOrderItem {
  seq: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  houseAddress: string;
  itemsSummary: string;
  totalPriceIdr: number;
  paymentStatus: 'PAID' | 'COD';
  dropInstruction: string;
}

export interface DispatchRouteStop {
  stopNumber: number;
  clusterId: string;
  clusterName: string;
  dropPointNote: string;
  targetArrival: string;
  targetDeparture: string;
  durationMinutes: number;
  totalOrders: number;
  totalWeightKg: number;
  orders: DispatchOrderItem[];
}

export const COURIER_5_CLUSTERS_DISPATCH: DispatchRouteStop[] = [
  {
    stopNumber: 1,
    clusterId: 'c1111111-1111-1111-1111-111111111111',
    clusterName: 'Antapani Indah',
    dropPointNote: 'Pos Satpam Blok C / Gerbang Utama Jl. Antapani',
    targetArrival: '04:55 WIB',
    targetDeparture: '05:20 WIB',
    durationMinutes: 25,
    totalOrders: 10,
    totalWeightKg: 13.2,
    orders: [
      { seq: 1, orderNumber: 'ORD-892101', customerName: 'Ibu Ratna Kumala', phone: '08122341001', houseAddress: 'Blok A1 No. 04', itemsSummary: 'Pakcoy (250g), Telur (1/2kg), Cabai Rawit (200g)', totalPriceIdr: 31600, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar depan' },
      { seq: 2, orderNumber: 'ORD-892102', customerName: 'Pak Bambang S.', phone: '08122341002', houseAddress: 'Blok A1 No. 09', itemsSummary: 'Beras Pandanwangi (5kg), Minyak Pouch 2L', totalPriceIdr: 112000, paymentStatus: 'PAID', dropInstruction: 'Teras dekat pot bunga' },
      { seq: 3, orderNumber: 'ORD-892103', customerName: 'Ibu Dewi Sartika', phone: '08122341003', houseAddress: 'Blok A2 No. 12', itemsSummary: 'Ayam Filet (500g), Sosin (250g), Bawang Merah (250g)', totalPriceIdr: 31000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 4, orderNumber: 'ORD-892104', customerName: 'Ibu Yuliana', phone: '08122341004', houseAddress: 'Blok B1 No. 03', itemsSummary: 'Kangkung (300g), Tempe, Cabai Rawit (200g)', totalPriceIdr: 22000, paymentStatus: 'PAID', dropInstruction: 'Titip di pos satpam' },
      { seq: 5, orderNumber: 'ORD-892105', customerName: 'Pak Hendra Gunawan', phone: '08122341005', houseAddress: 'Blok B1 No. 08', itemsSummary: 'Ubi Cilembu (1kg), Telur (1kg)', totalPriceIdr: 44000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar samping' },
      { seq: 6, orderNumber: 'ORD-892106', customerName: 'Ibu Rina Marlina', phone: '08122341006', houseAddress: 'Blok B2 No. 15', itemsSummary: 'Pakcoy (500g), Ayam Filet (500g)', totalPriceIdr: 30500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 7, orderNumber: 'ORD-892107', customerName: 'Ibu Siti Aminah', phone: '08122341007', houseAddress: 'Blok C1 No. 02', itemsSummary: 'Bawang Merah (500g), Cabai Rawit (500g)', totalPriceIdr: 37500, paymentStatus: 'PAID', dropInstruction: 'Teras depan pintu' },
      { seq: 8, orderNumber: 'ORD-892108', customerName: 'Pak Agus Salim', phone: '08122341008', houseAddress: 'Blok C1 No. 07', itemsSummary: 'Beras Pandanwangi (5kg)', totalPriceIdr: 78000, paymentStatus: 'PAID', dropInstruction: 'Titip pos satpam' },
      { seq: 9, orderNumber: 'ORD-892109', customerName: 'Ibu Fitriani', phone: '08122341009', houseAddress: 'Blok C2 No. 11', itemsSummary: 'Sosin (500g), Kangkung (600g), Telur (1/2kg)', totalPriceIdr: 30000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 10, orderNumber: 'ORD-892110', customerName: 'Ibu Nenden', phone: '08122341010', houseAddress: 'Blok C2 No. 18', itemsSummary: 'Minyak Pouch 2L, Telur (1/2kg)', totalPriceIdr: 49000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar depan' },
    ],
  },
  {
    stopNumber: 2,
    clusterId: 'c2222222-2222-2222-2222-222222222222',
    clusterName: 'Arcamanik Endah',
    dropPointNote: 'Rumah Bu RT 04 (Mitra IRT), Jl. Pesona Arcamanik No. 12',
    targetArrival: '05:25 WIB',
    targetDeparture: '05:50 WIB',
    durationMinutes: 25,
    totalOrders: 10,
    totalWeightKg: 12.8,
    orders: [
      { seq: 11, orderNumber: 'ORD-892201', customerName: 'Ibu Nurhayati (RT)', phone: '08122342001', houseAddress: 'Jl. Pesona Blok D1 No. 12', itemsSummary: 'Beras (5kg), Ayam Filet (1kg)', totalPriceIdr: 110000, paymentStatus: 'PAID', dropInstruction: 'Teras pos mitra IRT' },
      { seq: 12, orderNumber: 'ORD-892202', customerName: 'Ibu Maya Pratiwi', phone: '08122342002', houseAddress: 'Jl. Pesona Blok D1 No. 05', itemsSummary: 'Pakcoy (250g), Sosin (250g), Telur (1/2kg)', totalPriceIdr: 27600, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 13, orderNumber: 'ORD-892203', customerName: 'Pak Denny Cahya', phone: '08122342003', houseAddress: 'Jl. Pesona Blok D2 No. 08', itemsSummary: 'Ayam Filet (500g), Bawang Merah (250g)', totalPriceIdr: 26000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 14, orderNumber: 'ORD-892204', customerName: 'Ibu Sri Wahyuni', phone: '08122342004', houseAddress: 'Jl. Pesona Blok D2 No. 14', itemsSummary: 'Ubi Cilembu (1kg), Minyak 2L', totalPriceIdr: 43000, paymentStatus: 'PAID', dropInstruction: 'Teras dekat garasi' },
      { seq: 15, orderNumber: 'ORD-892205', customerName: 'Ibu Eka Rahayu', phone: '08122342005', houseAddress: 'Jl. Pesona Blok D3 No. 02', itemsSummary: 'Cabai Rawit (200g), Kangkung (300g)', totalPriceIdr: 14000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 16, orderNumber: 'ORD-892206', customerName: 'Pak Ridwan Kamil', phone: '08122342006', houseAddress: 'Jl. Pesona Blok D3 No. 09', itemsSummary: 'Telur (1kg), Ayam Filet (500g)', totalPriceIdr: 46500, paymentStatus: 'PAID', dropInstruction: 'Teras depan pintu' },
      { seq: 17, orderNumber: 'ORD-892207', customerName: 'Ibu Dian Sastro', phone: '08122342007', houseAddress: 'Jl. Pesona Blok D4 No. 04', itemsSummary: 'Pakcoy (250g), Bawang Merah (500g)', totalPriceIdr: 27100, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 18, orderNumber: 'ORD-892208', customerName: 'Pak Taufik Hidayat', phone: '08122342008', houseAddress: 'Jl. Pesona Blok D4 No. 11', itemsSummary: 'Beras Pandanwangi (5kg)', totalPriceIdr: 78000, paymentStatus: 'PAID', dropInstruction: 'Titip pos Bu RT' },
      { seq: 19, orderNumber: 'ORD-892209', customerName: 'Ibu Mega Utami', phone: '08122342009', houseAddress: 'Jl. Pesona Blok D5 No. 06', itemsSummary: 'Sosin (500g), Cabai Rawit (200g)', totalPriceIdr: 19000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 20, orderNumber: 'ORD-892210', customerName: 'Ibu Anita Zahra', phone: '08122342010', houseAddress: 'Jl. Pesona Blok D5 No. 17', itemsSummary: 'Minyak 2L, Telur (1/2kg), Kangkung (300g)', totalPriceIdr: 54000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar depan' },
    ],
  },
  {
    stopNumber: 3,
    clusterId: 'c3333333-3333-3333-3333-333333333333',
    clusterName: 'Cisaranten Kulon Asri',
    dropPointNote: 'Pos Keamanan Gerbang Timur / Jl. Cisaranten Baru No. 8',
    targetArrival: '05:55 WIB',
    targetDeparture: '06:20 WIB',
    durationMinutes: 25,
    totalOrders: 10,
    totalWeightKg: 13.5,
    orders: [
      { seq: 21, orderNumber: 'ORD-892301', customerName: 'Ibu Mira Lesmana', phone: '08122343001', houseAddress: 'Blok E1 No. 03', itemsSummary: 'Pakcoy (500g), Telur (1/2kg), Cabai (200g)', totalPriceIdr: 39000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 22, orderNumber: 'ORD-892302', customerName: 'Pak Dedi Mulyadi', phone: '08122343002', houseAddress: 'Blok E1 No. 10', itemsSummary: 'Beras (5kg), Bawang Merah (250g)', totalPriceIdr: 87500, paymentStatus: 'PAID', dropInstruction: 'Titip di pos jaga' },
      { seq: 23, orderNumber: 'ORD-892303', customerName: 'Ibu Ratih Pradita', phone: '08122343003', houseAddress: 'Blok E2 No. 07', itemsSummary: 'Ayam Filet (500g), Sosin (250g)', totalPriceIdr: 21500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 24, orderNumber: 'ORD-892304', customerName: 'Pak Irfan Hakim', phone: '08122343004', houseAddress: 'Blok E2 No. 15', itemsSummary: 'Minyak Pouch 2L, Kangkung (300g)', totalPriceIdr: 39000, paymentStatus: 'PAID', dropInstruction: 'Teras depan rumah' },
      { seq: 25, orderNumber: 'ORD-892305', customerName: 'Ibu Kartika Sari', phone: '08122343005', houseAddress: 'Blok F1 No. 02', itemsSummary: 'Ubi Cilembu (1kg), Telur (1/2kg)', totalPriceIdr: 24000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 26, orderNumber: 'ORD-892306', customerName: 'Ibu Intan Permata', phone: '08122343006', houseAddress: 'Blok F1 No. 08', itemsSummary: 'Pakcoy (250g), Cabai Rawit (200g)', totalPriceIdr: 16600, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar samping' },
      { seq: 27, orderNumber: 'ORD-892307', customerName: 'Pak Gunawan Wibowo', phone: '08122343007', houseAddress: 'Blok F2 No. 05', itemsSummary: 'Ayam Filet (500g), Telur (1/2kg)', totalPriceIdr: 31500, paymentStatus: 'PAID', dropInstruction: 'Teras depan pintu' },
      { seq: 28, orderNumber: 'ORD-892308', customerName: 'Ibu Siska Amelia', phone: '08122343008', houseAddress: 'Blok F2 No. 12', itemsSummary: 'Bawang Merah (500g), Sosin (250g)', totalPriceIdr: 24500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 29, orderNumber: 'ORD-892309', customerName: 'Pak Wahyu Hidayat', phone: '08122343009', houseAddress: 'Blok F3 No. 04', itemsSummary: 'Beras Pandanwangi (5kg)', totalPriceIdr: 78000, paymentStatus: 'PAID', dropInstruction: 'Titip pos timur' },
      { seq: 30, orderNumber: 'ORD-892310', customerName: 'Ibu Halimah', phone: '08122343010', houseAddress: 'Blok F3 No. 11', itemsSummary: 'Kangkung (600g), Cabai Rawit (200g), Telur (1/2kg)', totalPriceIdr: 33000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar depan' },
    ],
  },
  {
    stopNumber: 4,
    clusterId: 'c4444444-4444-4444-4444-444444444444',
    clusterName: 'Guruminda Megah',
    dropPointNote: 'Teras Mitra IRT Bu Hj. Lilis, Jl. Megah Utama Blok H No. 5',
    targetArrival: '06:25 WIB',
    targetDeparture: '06:50 WIB',
    durationMinutes: 25,
    totalOrders: 10,
    totalWeightKg: 12.6,
    orders: [
      { seq: 31, orderNumber: 'ORD-892401', customerName: 'Bu Hj. Lilis (Mitra)', phone: '08122344001', houseAddress: 'Blok H No. 05', itemsSummary: 'Beras (5kg), Minyak 2L, Ayam Filet (1kg)', totalPriceIdr: 145000, paymentStatus: 'PAID', dropInstruction: 'Teras pos mitra IRT' },
      { seq: 32, orderNumber: 'ORD-892402', customerName: 'Ibu Cindy Claudia', phone: '08122344002', houseAddress: 'Blok G1 No. 04', itemsSummary: 'Pakcoy (250g), Sosin (250g)', totalPriceIdr: 12600, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 33, orderNumber: 'ORD-892403', customerName: 'Pak Aris Munandar', phone: '08122344003', houseAddress: 'Blok G1 No. 11', itemsSummary: 'Ayam Filet (500g), Telur (1/2kg)', totalPriceIdr: 31500, paymentStatus: 'PAID', dropInstruction: 'Teras depan garasi' },
      { seq: 34, orderNumber: 'ORD-892404', customerName: 'Ibu Poppy Sovia', phone: '08122344004', houseAddress: 'Blok G2 No. 06', itemsSummary: 'Cabai Rawit (200g), Bawang Merah (250g)', totalPriceIdr: 18500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 35, orderNumber: 'ORD-892405', customerName: 'Pak Fajar Siddiq', phone: '08122344005', houseAddress: 'Blok G2 No. 15', itemsSummary: 'Ubi Cilembu (1kg), Kangkung (300g)', totalPriceIdr: 14000, paymentStatus: 'PAID', dropInstruction: 'Titip Bu Hj. Lilis' },
      { seq: 36, orderNumber: 'ORD-892406', customerName: 'Ibu Heni Hendriani', phone: '08122344006', houseAddress: 'Blok H No. 02', itemsSummary: 'Minyak Pouch 2L, Telur (1/2kg)', totalPriceIdr: 49000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 37, orderNumber: 'ORD-892407', customerName: 'Ibu Wulan Guritno', phone: '08122344007', houseAddress: 'Blok H No. 09', itemsSummary: 'Pakcoy (250g), Kangkung (300g), Sosin (250g)', totalPriceIdr: 17600, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar samping' },
      { seq: 38, orderNumber: 'ORD-892408', customerName: 'Pak Budi Hartono', phone: '08122344008', houseAddress: 'Blok H No. 14', itemsSummary: 'Beras Pandanwangi (5kg)', totalPriceIdr: 78000, paymentStatus: 'PAID', dropInstruction: 'Teras depan pintu' },
      { seq: 39, orderNumber: 'ORD-892409', customerName: 'Ibu Desi Ratnasari', phone: '08122344009', houseAddress: 'Blok H No. 19', itemsSummary: 'Ayam Filet (500g), Cabai Rawit (200g)', totalPriceIdr: 25500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 40, orderNumber: 'ORD-892410', customerName: 'Ibu Fenny Rose', phone: '08122344010', houseAddress: 'Blok H No. 23', itemsSummary: 'Telur (1kg), Bawang Merah (250g)', totalPriceIdr: 39500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar depan' },
    ],
  },
  {
    stopNumber: 5,
    clusterId: 'c5555555-5555-5555-5555-555555555555',
    clusterName: 'Riung Bandung Permai',
    dropPointNote: 'Pos RW 08 / Balai Warga Jl. Riung Saluyu Raya',
    targetArrival: '06:55 WIB',
    targetDeparture: '07:20 WIB',
    durationMinutes: 25,
    totalOrders: 10,
    totalWeightKg: 13.0,
    orders: [
      { seq: 41, orderNumber: 'ORD-892501', customerName: 'Pak Ketua RW 08', phone: '08122345001', houseAddress: 'Jl. Riung Saluyu Blok J1 No. 01', itemsSummary: 'Beras (5kg), Minyak 2L, Telur (1kg)', totalPriceIdr: 142000, paymentStatus: 'PAID', dropInstruction: 'Balai RW 08' },
      { seq: 42, orderNumber: 'ORD-892502', customerName: 'Ibu Tantri Kotak', phone: '08122345002', houseAddress: 'Jl. Riung Saluyu Blok J1 No. 08', itemsSummary: 'Pakcoy (250g), Ayam Filet (500g)', totalPriceIdr: 24100, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 43, orderNumber: 'ORD-892503', customerName: 'Pak Armand Maulana', phone: '08122345003', houseAddress: 'Jl. Riung Saluyu Blok J2 No. 05', itemsSummary: 'Kangkung (300g), Sosin (250g), Telur (1/2kg)', totalPriceIdr: 25000, paymentStatus: 'PAID', dropInstruction: 'Teras depan pintu' },
      { seq: 44, orderNumber: 'ORD-892504', customerName: 'Ibu Raisa Andriana', phone: '08122345004', houseAddress: 'Jl. Riung Saluyu Blok J2 No. 12', itemsSummary: 'Cabai Rawit (200g), Bawang Merah (250g)', totalPriceIdr: 18500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 45, orderNumber: 'ORD-892505', customerName: 'Pak Ariel Nazril', phone: '08122345005', houseAddress: 'Jl. Riung Saluyu Blok K1 No. 03', itemsSummary: 'Ubi Cilembu (1kg), Telur (1/2kg)', totalPriceIdr: 24000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar samping' },
      { seq: 46, orderNumber: 'ORD-892506', customerName: 'Ibu Isyana Sarasvati', phone: '08122345006', houseAddress: 'Jl. Riung Saluyu Blok K1 No. 09', itemsSummary: 'Pakcoy (500g), Ayam Filet (500g)', totalPriceIdr: 30500, paymentStatus: 'PAID', dropInstruction: 'Teras dekat bel' },
      { seq: 47, orderNumber: 'ORD-892507', customerName: 'Ibu Rossa Roslaina', phone: '08122345007', houseAddress: 'Jl. Riung Saluyu Blok K2 No. 04', itemsSummary: 'Minyak Pouch 2L, Sosin (250g)', totalPriceIdr: 39000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 48, orderNumber: 'ORD-892508', customerName: 'Pak Judika Sihotang', phone: '08122345008', houseAddress: 'Jl. Riung Saluyu Blok K2 No. 11', itemsSummary: 'Beras Pandanwangi (5kg)', totalPriceIdr: 78000, paymentStatus: 'PAID', dropInstruction: 'Titip pos satpam RW' },
      { seq: 49, orderNumber: 'ORD-892509', customerName: 'Ibu Lyodra Ginting', phone: '08122345009', houseAddress: 'Jl. Riung Saluyu Blok K3 No. 07', itemsSummary: 'Ayam Filet (500g), Cabai Rawit (200g)', totalPriceIdr: 25500, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar' },
      { seq: 50, orderNumber: 'ORD-892510', customerName: 'Ibu Tiara Andini', phone: '08122345010', houseAddress: 'Jl. Riung Saluyu Blok K3 No. 16', itemsSummary: 'Kangkung (300g), Telur (1kg)', totalPriceIdr: 35000, paymentStatus: 'PAID', dropInstruction: 'Gantung di pagar depan' },
    ],
  },
];
