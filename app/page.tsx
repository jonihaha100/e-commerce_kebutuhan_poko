'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { initialProducts, initialCatalogPrices, Product, DailyCatalogPrice } from '@/lib/mock-data';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  MapPin,
  Users,
  Sparkles,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowRight,
  Leaf,
  Search,
  CheckCircle2,
  Lock,
  Play,
  Share2,
  X,
  Scale,
  CreditCard,
  Truck,
  Eye,
  Utensils,
  ChefHat,
  Sparkle,
  Info,
} from 'lucide-react';

import { PromoBannerSlider } from '@/components/PromoBannerSlider';

// Extra metadata for rich product detail modal (Layman friendly, practical kitchen info)
interface ProductDetailMeta {
  storageTips: string;
  shelfLife: string;
  cookingIdeas: string[];
  qualityGrade: string;
  servingPortion: string;
}

const PRODUCT_EXTRA_DETAILS: Record<string, ProductDetailMeta> = {
  'PKC-01': {
    storageTips: 'Bungkus dengan kertas/tisu dapur kering lalu simpan di crisper kulkas (suhu 4-8°C). Jangan dicuci sebelum disimpan agar tetap renyah.',
    shelfLife: 'Tahan 4-5 hari di dalam chiller kulkas.',
    cookingIdeas: ['Tumis Pakcoy Bawang Putih Gurih', 'Ca Pakcoy Jamur Saus Tiram', 'Pelengkap Sayur Mie Kuah / Sup Bakso'],
    qualityGrade: 'Grade Super (Bebas pestisida kimia sintetis, daun renyah segar tanpa bolong ulat, akar bersih).',
    servingPortion: '1 pack (250gr) pas untuk 2-3 porsi lauk makan keluarga.',
  },
  'UBI-CLM-01': {
    storageTips: 'Simpan di tempat terbuka, kering, dan sejuk pada suhu ruang dengan sirkulasi udara baik. Jangan disimpan di kulkas dalam keadaan mentah.',
    shelfLife: 'Tahan hingga 3 minggu di suhu ruang sejuk.',
    cookingIdeas: ['Ubi Panggang / Oven Madu Meleleh', 'Kolak Manis Ubi Cilembu Santan', 'Camilan Sehat Rebus Pengganti Nasi'],
    qualityGrade: 'Grade Oven Super (Telah melewati pemeraman/curing 14 hari penuh, getah madu alami siap keluar legit saat dipanggang).',
    servingPortion: '1 kg berisi 4-6 buah ukuran sedang, pas untuk camilan santai keluarga.',
  },
  'AYM-FLT-01': {
    storageTips: 'Jika tidak langsung dimasak hari ini, simpan di wadah tertutup dalam freezer beku (-18°C). Di chiller bawah bertahan maksimal 2 hari.',
    shelfLife: '2 hari di chiller, hingga 3 bulan di freezer beku.',
    cookingIdeas: ['Ayam Katsu Saus Teriyaki', 'Tumis Ayam Lada Hitam Paprika', 'Sup Bening Kaldu Ayam Dapur', 'Steak Ayam Teflon Sehat'],
    qualityGrade: '100% Halal RPA Modern, bebas formalin & bahan kimia, daging segar dingin alami tanpa suntikan air/gel.',
    servingPortion: '500gr dapat dipotong menjadi 4-5 porsi lauk makan siang/malam.',
  },
  'TLR-AYM-01': {
    storageTips: 'Simpan di rak kulkas dengan bagian runcing di bawah agar kantung udara di atas tetap stabil dan telur tetap fresh.',
    shelfLife: 'Tahan 3-4 minggu di kulkas, 2 minggu di suhu ruang.',
    cookingIdeas: ['Telur Ceplok / Dadar Bawang Daun', 'Telur Balado Pedas Manis', 'Tamagoyaki / Telur Gulung Lembut'],
    qualityGrade: 'Telur segar subuh fajar, cangkang coklat tebal bebas retak, kuning telur bulat kokoh dan tidak berbau amis.',
    servingPortion: '1 kg berisi 16 butir telur ayam negeri fresh pilihan.',
  },
  'SSN-01': {
    storageTips: 'Potong sedikit ujung pangkal jika kotor, bungkus kertas bersih, masukkan ke kantong sayur kulkas.',
    shelfLife: 'Tahan 3-4 hari di lemari es chiller.',
    cookingIdeas: ['Tumis Sawi Manis Tahu Sutra', 'Sayur Bening Jagung Manis Sawi', 'Pelengkap Mie Godog Jawa Gurih'],
    qualityGrade: 'Petik subuh fajar, daun hijau segar cerah tanpa rasa pahit, batang renyah empuk.',
    servingPortion: '1 ikat (250gr) cukup untuk 1 mangkuk sayur porsi 3-4 orang.',
  },
  'KKG-LMB-01': {
    storageTips: 'Biarkan ikatan akar tetap utuh, bungkus kertas kering dan masukkan ke kantong sayur kulkas.',
    shelfLife: 'Tahan 3-4 hari di chiller pendingin.',
    cookingIdeas: ['Kangkung Tumis Bawang Saus Tiram', 'Plecing Kangkung Sambal Terasi', 'Tumis Kangkung Tauco Pedas'],
    qualityGrade: 'Kangkung akar hijau segar, daun muda tidak alot, bebas residu bahan kimia.',
    servingPortion: '1 ikat (300gr) pas untuk 1 piring saji tumisan keluarga.',
  },
  'BRS-PW-05': {
    storageTips: 'Simpan di wadah beras (rice box) tertutup rapat di tempat kering. Berikan beberapa lembar daun jeruk kering untuk menjaga dari kutu.',
    shelfLife: 'Tahan 6-12 bulan di tempat kering dan sejuk.',
    cookingIdeas: ['Nasi Putih Pulen Wangi Santap Harian', 'Nasi Uduk Gurih Santan', 'Nasi Goreng Spesial'],
    qualityGrade: 'Beras pandan wangi asli, bulir utuh, putih bersih alami tanpa pemutih, tanpa pengawet atau pewangi sintetis.',
    servingPortion: 'Karung 5 kg mencukupi konsumsi nasi 1 keluarga (3-4 jiwa) selama 10-14 hari.',
  },
  'CBI-RWT-3P': {
    storageTips: 'Petik tangkai cabai sebelum disimpan (jangan dicuci dulu), lapisi wadah kedap udara dengan tisu dapur, simpan di chiller.',
    shelfLife: 'Tahan 2-3 minggu tetap segar dan pedas.',
    cookingIdeas: ['Sambal Bawang Ulek Pedas Nendang', 'Bumbu Dasar Balado', 'Pelengkap Lalapan & Gorengan'],
    qualityGrade: 'Cabai rawit domba merah menyala, tingkat pedas maksimal, buah padat tidak lembek/busuk.',
    servingPortion: '1 pack (200gr) cukup untuk stok sambal pedas 1-2 minggu.',
  },
  'BWG-MRH-3P': {
    storageTips: 'Simpan di suhu ruang dengan sirkulasi udara baik (keranjang kawat/anyaman). Hindari kulkas agar tidak lembek dan berjamur.',
    shelfLife: 'Tahan 1-2 bulan di tempat kering berventilasi.',
    cookingIdeas: ['Bawang Merah Goreng Renyah Gurih', 'Bumbu Dasar Aneka Tumis Nusantara', 'Acar Bawang Segar'],
    qualityGrade: 'Bawang merah kering simpan pilihan, umbi padat merah tua mengkilap, bersih dari tanah basah.',
    servingPortion: '500gr mencukupi bumbu masak harian keluarga selama 2-3 minggu.',
  },
  'MYK-GRG-2L': {
    storageTips: 'Tutup rapat kemasan pouch setelah dituang dan letakkan di tempat yang sejuk dan tidak terpapar sinar matahari langsung.',
    shelfLife: 'Tahan hingga 12 bulan.',
    cookingIdeas: ['Menggoreng Renyah (Deep Fry)', 'Menumis Bumbu Masakan Harum', 'Bahan Olesan Bakaran'],
    qualityGrade: 'Minyak kelapa sawit murni berkualitas tinggi, jernih berkilau, difortifikasi Vitamin A.',
    servingPortion: 'Pouch 2 Liter mencukupi kebutuhan goreng & tumis keluarga selama 2-3 minggu.',
  },
};

// Pricing options derived directly from the real Berkah Tani Sejahtera catalog (PDF Mei 2024)
interface PortionOption {
  label: string;
  price: number;
  farmerSplit: number;
  opsSplit: number;
  marketBenchmark: number;
}

const CATALOG_PORTIONS: Record<string, PortionOption[]> = {
  // Pakcoy Hidroponik
  'PKC-01': [
    { label: 'pack (250gr)', price: 7600, farmerSplit: 5500, opsSplit: 2100, marketBenchmark: 9000 },
    { label: '500 gr', price: 14000, farmerSplit: 9500, opsSplit: 4500, marketBenchmark: 16000 },
    { label: '1 kg', price: 23000, farmerSplit: 16000, opsSplit: 7000, marketBenchmark: 27000 },
  ],
  // Ubi Cilembu Madu (14d Cured)
  'UBI-CLM-01': [
    { label: '500 gr', price: 9000, farmerSplit: 6000, opsSplit: 3000, marketBenchmark: 11000 },
    { label: '1 kg', price: 17500, farmerSplit: 12000, opsSplit: 5500, marketBenchmark: 20000 },
  ],
  // Ayam Filet Dada (Tanpa Tulang)
  'AYM-FLT-01': [
    { label: '250 gr', price: 16500, farmerSplit: 12500, opsSplit: 4000, marketBenchmark: 20000 },
    { label: '500 gr', price: 31000, farmerSplit: 24000, opsSplit: 7000, marketBenchmark: 36000 },
    { label: '1 kg', price: 60000, farmerSplit: 47000, opsSplit: 13000, marketBenchmark: 70000 },
  ],
  // Telur Ayam Negeri Fresh
  'TLR-AYM-01': [
    { label: '1/2 kg (8 butir)', price: 15000, farmerSplit: 11000, opsSplit: 4000, marketBenchmark: 17000 },
    { label: '1 kg (16 butir)', price: 28500, farmerSplit: 21500, opsSplit: 7000, marketBenchmark: 32000 },
  ],
  // Sosin Manis Segar
  'SSN-01': [
    { label: 'ikat (250gr)', price: 5000, farmerSplit: 3600, opsSplit: 1400, marketBenchmark: 6500 },
    { label: '500 gr', price: 9500, farmerSplit: 7000, opsSplit: 2500, marketBenchmark: 12000 },
  ],
  // Kangkung Akar Lembang
  'KKG-LMB-01': [
    { label: 'ikat (300gr)', price: 5000, farmerSplit: 3600, opsSplit: 1400, marketBenchmark: 6500 },
    { label: '2 ikat (600gr)', price: 9000, farmerSplit: 6800, opsSplit: 2200, marketBenchmark: 11500 },
  ],
  // Cabai Rawit Merah
  'CBI-RWT-3P': [
    { label: 'pack (200gr)', price: 9000, farmerSplit: 6500, opsSplit: 2500, marketBenchmark: 11000 },
    { label: '500 gr', price: 21000, farmerSplit: 15500, opsSplit: 5500, marketBenchmark: 25000 },
  ],
  // Bawang Merah Brebes
  'BWG-MRH-3P': [
    { label: '250 gr', price: 9500, farmerSplit: 7000, opsSplit: 2500, marketBenchmark: 12000 },
    { label: '500 gr', price: 18000, farmerSplit: 13500, opsSplit: 4500, marketBenchmark: 22000 },
  ],
  // Beras Pandan Wangi
  'BRS-PW-05': [
    { label: 'karung 5kg', price: 78000, farmerSplit: 60000, opsSplit: 18000, marketBenchmark: 85000 },
  ],
  // Minyak Goreng Sawit
  'MYK-GRG-2L': [
    { label: 'pouch 2L', price: 34000, farmerSplit: 28000, opsSplit: 6000, marketBenchmark: 38000 },
  ],
};

function getProductIcon(product: Product): string {
  const name = product.name.toLowerCase();
  if (name.includes('pakcoy')) return '🥬';
  if (name.includes('sosin') || name.includes('sawi')) return '🥗';
  if (name.includes('ubi') || name.includes('cilembu')) return '🍠';
  if (name.includes('ayam') || name.includes('dada')) return '🍗';
  if (name.includes('telur')) return '🥚';
  if (name.includes('cabai') || name.includes('cabe')) return '🌶️';
  if (name.includes('bawang')) return '🧅';
  if (name.includes('beras')) return '🍚';
  if (name.includes('minyak')) return '🛢️';
  if (name.includes('kangkung') || name.includes('bayam')) return '🌱';
  if (name.includes('tahu') || name.includes('tempe')) return '🧈';
  if (name.includes('wortel')) return '🥕';
  if (name.includes('tomat')) return '🍅';
  if (name.includes('kentang')) return '🥔';

  if (product.category_type === 'PROTEIN_1P') return '🍗';
  if (product.category_type === 'TUBER_CURED_1P') return '🍠';
  if (product.category_type === 'SPICE_3P') return '🌶️';
  if (product.category_type === 'STAPLE_3P') return '🌾';
  return '🥬';
}

export default function StorefrontHomePage() {
  const router = useRouter();
  const {
    selectedCluster,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    cartTotal,
    groupBuySlotsFilled,
    groupBuyTargetSlots,
    isGroupBuyEligible,
    projectedCashback,
    products,
    catalogPrices,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Selected portion index per product
  const [selectedPortions, setSelectedPortions] = useState<Record<string, number>>({
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    p5: 0,
    p6: 0,
    p7: 0,
    p8: 0,
    p9: 0,
    p10: 0,
  });

  // Onboarding Guided Tour Modal state
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Share WA Toast feedback
  const [shareFeedback, setShareFeedback] = useState(false);

  // Product Detail Modal state (layman-friendly interactive details)
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'info' | 'storage' | 'recipes'>('info');

  const categories = [
    { id: 'ALL', label: 'Semua Produk', icon: '🧺' },
    { id: 'VEGETABLE_1P', label: 'Sayur Daun', icon: '🥬' },
    { id: 'TUBER_CURED_1P', label: 'Umbi Cilembu', icon: '🍠' },
    { id: 'PROTEIN_1P', label: 'Ayam & Telur', icon: '🍗' },
    { id: 'SPICE_3P', label: 'Bumbu & Cabai', icon: '🌶️' },
    { id: 'STAPLE_3P', label: 'Sembako Pokok', icon: '🌾' },
  ];

  // Active products master from AppContext
  const activeProductList = products && products.length > 0 ? products : initialProducts;

  // Filtered products based on search and category
  const filteredProducts = activeProductList
    .filter((p) => p.is_active)
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || p.category_type === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleShareWA = () => {
    const text = `Halo tetangga Komplek ${selectedCluster.name}! Yuk ikutan belanja sayur panen subuh di Berkah Tani Sejahtera. Tinggal 3 slot lagi untuk dapat Gratis Ongkir ke gerbang komplek + Cashback 10%!: ${typeof window !== 'undefined' ? window.location.origin : ''}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Group-Buy Berkah Tani Sejahtera', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  // Onboarding tour steps data
  const tourStepsData = [
    {
      title: 'Pilih Titik Antar Komplek Perumahan',
      desc: 'Pengiriman sayur dilakukan serentak ke gerbang komplek perumahan Anda setiap jam 06.00 - 09.00 pagi. Ini memangkas biaya kurir sehingga ongkos kirim menjadi GRATIS.',
      icon: MapPin,
      badge: 'Langkah 1 dari 5',
    },
    {
      title: 'Pilih Takaran Porsi Masak (250 gr / 500 gr / 1 kg)',
      desc: 'Bebas memilih porsi bumbu dan sayur sesuai kebutuhan masak harian keluarga. Anda bisa beli cabai dan bawang mulai 250 gram hemat tanpa takut busuk di kulkas.',
      icon: Scale,
      badge: 'Langkah 2 dari 5',
    },
    {
      title: 'Kunci Pesanan Pukul 20.00 WIB Malam',
      desc: 'Pesanan warga dikunci jam 20.00 WIB dan otomatis dirangkum ke Surat Jalan Petani. Sayur dipetik jam 03.00 subuh di Ciwidey/Lembang, menjamin kesegaran maksimal.',
      icon: Clock,
      badge: 'Langkah 3 dari 5',
    },
    {
      title: 'Group-Buy Rp40.000 & Bonus Cashback 10%',
      desc: 'Cukup belanja minimal Rp40.000. Jika 10 rumah di komplek Anda ikut memesan, sistem otomatis mengkreditkan cashback 10% ke saldo dompet dapur Anda!',
      icon: Users,
      badge: 'Langkah 4 dari 5',
    },
    {
      title: 'Pembayaran Fleksibel & Garansi Mutu ≤ Rp25.000',
      desc: 'Bayar instan via Midtrans (QRIS GoPay/OVO/BCA), Virtual Account, atau Bayar di Tempat (COD). Jika sayur tidak segar, garansi klaim instan Rp25.000 langsung cair.',
      icon: ShieldCheck,
      badge: 'Langkah 5 dari 5',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-28">
      {/* 1. TOKOPEDIA-STYLE SLIDING PROMO HERO BANNER */}
      <PromoBannerSlider
        onOpenTour={() => {
          setTourStep(0);
          setShowTour(true);
        }}
      />

      {/* DUAL-GRID HERO BANNER: Balanced 60:40 Layout (No Empty Void) */}
      <section className="bg-gradient-to-r from-[#4C9BD5] via-[#2BAE66] to-[#24B05A] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column (7 Cols / 60%): Headline, Value Prop, and Onboarding Tour Trigger */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>📍 Pengantaran: <b>{selectedCluster.name}</b></span>
              <Link
                href="/pilih-komplek"
                className="underline text-amber-200 hover:text-white ml-1 text-[11px]"
              >
                Ganti
              </Link>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Sayur Panen Subuh & Sembako Dapur, Tiba Sebelum Masak.
            </h1>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
              Dipetik jam 03.00 WIB dari petani Ciwidey & Lembang. Diantar serentak ke pos komplek Anda jam <b>06.00 - 09.00 pagi</b> dengan harga jujur dan bebas ongkir.
            </p>

            {/* TOUR TRIGGER BUTTON (Persis seperti tangkapan layar user) */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => {
                  setTourStep(0);
                  setShowTour(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#613D1A] hover:bg-amber-50 font-extrabold text-xs rounded-xl shadow-md border border-amber-200 transition-all hover:scale-102 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
                <span>Mulai Tur Panduan Website & Fitur Baru</span>
              </button>

              <a
                href="#katalog"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black/20 hover:bg-black/30 text-white font-bold text-xs rounded-xl border border-white/30 transition cursor-pointer"
              >
                <span>Lihat Katalog Hari Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Value Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Panen Subuh 03.00 WIB</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full font-semibold">
                <Clock className="w-3.5 h-3.5 text-sky-200" />
                <span>Tiba 06.00 - 09.00 Pagi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                <span>Garansi Mutu ≤ Rp25.000</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols / 40%): LIVE COMMUNITY CLUSTER PULSE WIDGET */}
          <div className="lg:col-span-5 bg-white text-slate-800 p-5 rounded-3xl shadow-xl border-2 border-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EBF7EE] text-[#24B05A] flex items-center justify-center font-bold text-sm">
                  🏘️
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                    Komunitas Komplek
                  </h3>
                  <span className="text-[11px] text-[#4C9BD5] font-bold block">
                    {selectedCluster.name}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5] px-2 py-0.5 rounded-full">
                70% Terpenuhi
              </span>
            </div>

            {/* Group-Buy Slot Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Slot Belanja Hari Ini:</span>
                <span className="text-[#24B05A]">
                  {groupBuySlotsFilled} dari {groupBuyTargetSlots} Rumah
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#4C9BD5] to-[#24B05A] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(groupBuySlotsFilled / groupBuyTargetSlots) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Tersisa <b>3 rumah lagi</b> untuk mengaktifkan <b>Gratis Ongkir + Cashback 10%</b> ke seluruh warga komplek!
              </p>
            </div>

            {/* Cutoff & Delivery Schedule */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Kunci Pesanan:
                </span>
                <span className="font-bold text-slate-900">20.00 WIB Malam Ini</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-[#24B05A]" />
                  Pengantaran:
                </span>
                <span className="font-bold text-[#1B8A44]">Besok 06.00 - 09.00 WIB</span>
              </div>
            </div>

            {/* Share to WhatsApp Button */}
            <button
              onClick={handleShareWA}
              className="w-full py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareFeedback ? 'Pesan Tersalin ke Clipboard!' : 'Ajak Tetangga Komplek (WhatsApp)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Astro-Style Search & Category Quick Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari sayur segar, ubi cilembu, cabai rawit, bawang merah, ayam filet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#24B05A] focus:ring-2 focus:ring-[#24B05A]/20 transition shadow-2xs"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                  isActive
                    ? 'bg-[#24B05A] text-white shadow-sm scale-102'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#24B05A] hover:bg-slate-50'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Catalog Grid with Tiered Gramature Options (From Real PDF) */}
      <section id="katalog" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-[#4C9BD5] uppercase tracking-wider">
              Katalog Dapur Pasundan
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Pilihan Sayur Segar & Kebutuhan Dapur
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredProducts.length} Komoditas Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map((product) => {
            const catalogPriceEntry = catalogPrices.find((cp) => cp.product_id === product.id);
            const dynamicBasePrice = catalogPriceEntry?.sell_price_idr || 15000;
            const portionList = CATALOG_PORTIONS[product.sku] || CATALOG_PORTIONS[product.id] || [
              {
                label: product.unit,
                price: dynamicBasePrice,
                farmerSplit: Math.round(dynamicBasePrice * 0.7),
                opsSplit: Math.round(dynamicBasePrice * 0.3),
                marketBenchmark: Math.round(dynamicBasePrice * 1.15),
              },
            ];

            const selectedIdx = selectedPortions[product.id] || 0;
            const currentPortion = portionList[selectedIdx] || portionList[0];

            // Build dynamic catalog price object for the selected portion
            const dynamicPrice: DailyCatalogPrice = {
              id: `${product.id}-${currentPortion.label}`,
              cycle_id: 'd1',
              product_id: product.id,
              sell_price_idr: currentPortion.price,
              min_safe_price_idr: Math.round(currentPortion.price * 0.9),
              is_failover_3p: !product.is_1p,
              signal_type: 'STABLE',
              farmer_split_idr: currentPortion.farmerSplit,
              ops_split_idr: currentPortion.opsSplit,
            };

            const inCart = cart.find((item) => item.product.id === product.id);
            const qtyInCart = inCart ? inCart.qty : 0;

            return (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProductDetail(product);
                  setDetailActiveTab('info');
                }}
                className="astro-card p-3 sm:p-4 flex flex-col justify-between group hover:border-[#24B05A] transition-all bg-white cursor-pointer relative hover:shadow-md"
                title="Klik untuk melihat deskripsi detail, resep, dan tips penyimpanan"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full truncate ${
                        product.is_1p
                          ? 'bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5]'
                          : 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'
                      }`}
                    >
                      {product.is_1p ? '🌱 1P Petani' : '🏬 3P Grosir'}
                    </span>

                    <span className="text-[9px] font-bold text-slate-400">
                      Subuh 03.00
                    </span>
                  </div>

                  {/* Visual Badge Icon */}
                  <div className="w-full h-20 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-103 transition-transform">
                    {getProductIcon(product)}
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight group-hover:text-[#24B05A] transition line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Pilihan takaran:</span>
                      <span className="text-[#24B05A] font-bold group-hover:underline flex items-center gap-0.5">
                        Info Detail &rarr;
                      </span>
                    </div>
                  </div>

                  {/* TIERED PORTION SELECTOR BUTTONS (From real PDF catalog!) */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {portionList.map((portion, idx) => (
                      <button
                        key={portion.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPortions((prev) => ({ ...prev, [product.id]: idx }));
                        }}
                        className={`px-2 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                          selectedIdx === idx
                            ? 'bg-[#24B05A] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {portion.label}
                      </button>
                    ))}
                  </div>

                  {/* Open-Book Split Breakdown */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[10px] space-y-0.5 text-slate-500">
                    <div className="flex justify-between">
                      <span>🌾 Modal Petani:</span>
                      <span className="font-bold text-slate-700">
                        {formatRupiah(currentPortion.farmerSplit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>📦 Biaya Kemas & Ops:</span>
                      <span className="font-bold text-slate-700">
                        {formatRupiah(currentPortion.opsSplit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Astro Stepper Button */}
                <div className="pt-3 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 line-through block">
                      {formatRupiah(currentPortion.marketBenchmark)}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#24B05A]">
                      {formatRupiah(currentPortion.price)}
                    </span>
                  </div>

                  {/* Astro Stepper Button */}
                  {qtyInCart === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, dynamicPrice, 1);
                      }}
                      className="w-full py-2 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah ({currentPortion.label})</span>
                    </button>
                  ) : (
                    <div
                      className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(product.id, qtyInCart - 1);
                        }}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition shadow-2xs font-bold cursor-pointer"
                        aria-label="Kurangi"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-black text-slate-900 px-2">
                        {qtyInCart}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(product.id, qtyInCart + 1);
                        }}
                        className="w-7 h-7 rounded-lg bg-[#24B05A] text-white hover:bg-[#1B8A44] flex items-center justify-center transition shadow-2xs font-bold cursor-pointer"
                        aria-label="Tambah"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Bottom Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#0F172A] text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#24B05A] text-white flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-semibold">{cartItemCount} Item</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-sm font-black text-white">{formatRupiah(cartTotal)}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  {isGroupBuyEligible
                    ? '🎉 Kuota Group-Buy Terpenuhi (Gratis Ongkir + Cashback 10%)'
                    : `Kurang ${formatRupiah(40000 - cartTotal)} untuk Bebas Ongkir`}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="px-4 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm flex-shrink-0 cursor-pointer"
            >
              <span>Lanjut Bayar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* INTERACTIVE PRODUCT DETAIL MODAL (Triggered when tapping/clicking any product item) */}
      {selectedProductDetail && (() => {
        const detailProduct = selectedProductDetail;
        const catalogPriceEntry = catalogPrices.find((cp) => cp.product_id === detailProduct.id);
        const dynamicBasePrice = catalogPriceEntry?.sell_price_idr || 15000;
        const portionList = CATALOG_PORTIONS[detailProduct.sku] || CATALOG_PORTIONS[detailProduct.id] || [
          {
            label: detailProduct.unit,
            price: dynamicBasePrice,
            farmerSplit: Math.round(dynamicBasePrice * 0.7),
            opsSplit: Math.round(dynamicBasePrice * 0.3),
            marketBenchmark: Math.round(dynamicBasePrice * 1.15),
          },
        ];
        const selectedIdx = selectedPortions[detailProduct.id] || 0;
        const currentPortion = portionList[selectedIdx] || portionList[0];
        const extra = PRODUCT_EXTRA_DETAILS[detailProduct.sku] || {
          storageTips: 'Simpan di tempat sejuk atau bagian bawah kulkas agar kesegaran alaminya tetap terjaga.',
          shelfLife: 'Tahan 3-5 hari dalam suhu dingin.',
          cookingIdeas: ['Aneka Olahan Masakan Dapur Keluarga'],
          qualityGrade: 'Grade Pilihan Segar (Sortir subuh, bebas bahan kimia sintetis berbahaya).',
          servingPortion: `1 ${detailProduct.unit} cukup untuk konsumsi masak harian keluarga.`,
        };
        const inCart = cart.find((item) => item.product.id === detailProduct.id);
        const qtyInCart = inCart ? inCart.qty : 0;

        const dynamicPrice: DailyCatalogPrice = {
          id: `${detailProduct.id}-${currentPortion.label}`,
          cycle_id: 'd1',
          product_id: detailProduct.id,
          sell_price_idr: currentPortion.price,
          min_safe_price_idr: Math.round(currentPortion.price * 0.9),
          is_failover_3p: !detailProduct.is_1p,
          signal_type: 'STABLE',
          farmer_split_idr: currentPortion.farmerSplit,
          ops_split_idr: currentPortion.opsSplit,
        };

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setSelectedProductDetail(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      detailProduct.is_1p
                        ? 'bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5]'
                        : 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'
                    }`}
                  >
                    {detailProduct.is_1p ? '🌱 1P Petani' : '🏬 3P Grosir'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    Panen Subuh 03.00
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                {/* Product Hero Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-100 border border-emerald-100 flex items-center justify-center text-5xl flex-shrink-0 shadow-2xs">
                    {getProductIcon(detailProduct)}
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      KODE SKU: {detailProduct.sku}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {detailProduct.name}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {detailProduct.description}
                    </p>
                  </div>
                </div>

                {/* Gramature / Portion Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#24B05A]" />
                      Pilihan Takaran Porsi Masak:
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Hemat Rp {formatRupiah(currentPortion.marketBenchmark - currentPortion.price)} vs Pasar
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {portionList.map((portion, idx) => (
                      <button
                        key={portion.label}
                        type="button"
                        onClick={() =>
                          setSelectedPortions((prev) => ({ ...prev, [detailProduct.id]: idx }))
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedIdx === idx
                            ? 'bg-[#24B05A] text-white border-[#24B05A] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#24B05A]'
                        }`}
                      >
                        <span className="text-xs font-extrabold block truncate">
                          {portion.label}
                        </span>
                        <span
                          className={`text-[11px] font-bold block ${
                            selectedIdx === idx ? 'text-emerald-100' : 'text-[#24B05A]'
                          }`}
                        >
                          {formatRupiah(portion.price)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                    <span>🌾 Modal Petani: <b>{formatRupiah(currentPortion.farmerSplit)}</b></span>
                    <span>📦 Kemas & Distribusi: <b>{formatRupiah(currentPortion.opsSplit)}</b></span>
                  </div>
                </div>

                {/* 3 Interactive Information Tabs (Educational & Practical Kitchen Info) */}
                <div className="space-y-3">
                  <div className="flex border-b border-slate-200 text-xs font-bold gap-2 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setDetailActiveTab('info')}
                      className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                        detailActiveTab === 'info'
                          ? 'border-[#24B05A] text-[#24B05A]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Standar Mutu & Porsi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDetailActiveTab('storage')}
                      className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                        detailActiveTab === 'storage'
                          ? 'border-[#24B05A] text-[#24B05A]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Leaf className="w-4 h-4" />
                      <span>Tips Simpan di Kulkas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDetailActiveTab('recipes')}
                      className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                        detailActiveTab === 'recipes'
                          ? 'border-[#24B05A] text-[#24B05A]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Ide Masakan</span>
                    </button>
                  </div>

                  {/* Tab 1: Kualitas & Porsi */}
                  {detailActiveTab === 'info' && (
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">Kualitas & Kebersihan:</span>
                          <span className="text-slate-600 leading-relaxed">{extra.qualityGrade}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-1 border-t border-emerald-200/50">
                        <Users className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">Kecukupan Porsi Masak:</span>
                          <span className="text-slate-600 leading-relaxed">{extra.servingPortion}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Tips Simpan */}
                  {detailActiveTab === 'storage' && (
                    <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">Daya Tahan Kesegaran:</span>
                          <span className="text-slate-600 leading-relaxed">{extra.shelfLife}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-1 border-t border-sky-200/50">
                        <Leaf className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">Cara Menyimpan di Rumah:</span>
                          <span className="text-slate-600 leading-relaxed">{extra.storageTips}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Resep Olahan */}
                  {detailActiveTab === 'recipes' && (
                    <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2 text-xs">
                      <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-amber-600" />
                        Rekomendasi Menu Dapur Keluarga:
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {extra.cookingIdeas.map((recipe, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-2 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{recipe}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Fresh Guarantee Banner */}
                <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-slate-900 font-extrabold block text-xs">
                        Garansi Mutu Kesegaran 100%
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        Kurang segar atau rusak saat diambil di pos komplek? Langsung kami ganti baru!
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Sticky Action Bar */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Total Harga ({currentPortion.label}):
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#24B05A]">
                    {formatRupiah(currentPortion.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {qtyInCart > 0 && (
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQty(detailProduct.id, qtyInCart - 1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition font-bold cursor-pointer"
                        aria-label="Kurangi"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-slate-900 px-3">
                        {qtyInCart}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(detailProduct.id, qtyInCart + 1)}
                        className="w-8 h-8 rounded-lg bg-[#24B05A] text-white hover:bg-[#1B8A44] flex items-center justify-center transition font-bold cursor-pointer"
                        aria-label="Tambah"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(detailProduct, dynamicPrice, 1);
                    }}
                    className="px-5 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{qtyInCart > 0 ? 'Tambah Lagi' : 'Tambah ke Keranjang'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* INTERACTIVE ONBOARDING TOUR MODAL (Triggered by "▷ Mulai Tur Panduan Website & Fitur Baru") */}
      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-sm">
                  <Play className="w-4 h-4 fill-[#D97706]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] block">
                    {tourStepsData[tourStep].badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Tur Panduan Belanja
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowTour(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Step Content */}
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF7EE] text-[#24B05A] flex items-center justify-center text-2xl font-bold border border-[#BAE6C5] mx-auto sm:mx-0">
                {React.createElement(tourStepsData[tourStep].icon, { className: 'w-7 h-7' })}
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h4 className="text-base font-extrabold text-slate-900">
                  {tourStepsData[tourStep].title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tourStepsData[tourStep].desc}
                </p>
              </div>

              {/* Step Dots Indicator */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                {tourStepsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTourStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      tourStep === idx ? 'w-6 bg-[#24B05A]' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <button
                onClick={() => setTourStep((prev) => Math.max(0, prev - 1))}
                disabled={tourStep === 0}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-30 cursor-pointer"
              >
                Sebelumnya
              </button>

              {tourStep < tourStepsData.length - 1 ? (
                <button
                  onClick={() => setTourStep((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowTour(false)}
                  className="px-5 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Selesai & Mulai Belanja</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
