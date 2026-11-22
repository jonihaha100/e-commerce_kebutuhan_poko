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

export interface Order {
  id: string;
  order_number: string;
  cycle_id: string;
  cluster_id: string;
  customer_id: string;
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
    name: 'Ubi Cilembu Madu Sumedang',
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
    name: 'Pakcoy Hidroponik Lembang',
    description: 'Pakcoy baby crunchy bebas pestisida sintetis dari green house Lembang.',
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
    description: 'Sawi manis / caisim organik segar dipanen subuh dari petani Ciwidey.',
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
    description: 'Telur segar peternak Ciamis, cangkang coklat tebal bebas retak.',
    unit: 'kg (16 butir)',
    category_type: 'PROTEIN_1P',
    min_curing_days: 0,
    is_1p: true,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000006',
    sku: 'KKG-LMB-01',
    name: 'Kangkung Akar Lembang',
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
    name: 'Beras Pandan Wangi Cianjur 5kg',
    description: 'Beras pulen wangi alami tanpa pengawet & pemutih langsung dari penggilingan padi Cianjur.',
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
    description: 'Cabai rawit domba pedas segar grade A pasokan Pasar Induk Caringin.',
    unit: 'pack (200gr)',
    category_type: 'SPICE_3P',
    min_curing_days: 0,
    is_1p: false,
    is_active: true,
  },
  {
    id: 'p0000000-0000-0000-0000-000000000009',
    sku: 'BWG-MRH-3P',
    name: 'Bawang Merah Brebes Pilihan',
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
    product_id: 'p0000000-0000-0000-0000-000000000001',
    sell_price_idr: 17500,
    min_safe_price_idr: 17200,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000001',
    is_failover_3p: false,
    signal_type: 'PRICE_DROP',
    farmer_split_idr: 12000,
    ops_split_idr: 5500,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000002',
    sell_price_idr: 7600,
    min_safe_price_idr: 7600,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000002',
    is_failover_3p: false,
    signal_type: 'STABLE',
    farmer_split_idr: 3800,
    ops_split_idr: 3800,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000004',
    sell_price_idr: 31000,
    min_safe_price_idr: 30900,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000004',
    is_failover_3p: false,
    signal_type: 'STABLE',
    farmer_split_idr: 24000,
    ops_split_idr: 7000,
    published_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    cycle_id: 'd0000000-0000-0000-0000-000000000001',
    product_id: 'p0000000-0000-0000-0000-000000000008',
    sell_price_idr: 16100,
    min_safe_price_idr: 16100,
    vendor_offer_id: 'v0000000-0000-0000-0000-000000000006',
    is_failover_3p: true,
    signal_type: 'PRICE_DROP',
    farmer_split_idr: 11500,
    ops_split_idr: 4600,
    published_at: new Date().toISOString(),
  },
];

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
