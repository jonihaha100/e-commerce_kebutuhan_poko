'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/lib/pricing-engine';
import { initialProducts, initialCatalogPrices } from '@/lib/mock-data';
import {
  Wallet,
  Clock,
  Utensils,
  CheckCircle2,
  ShoppingCart,
  Package,
  MapPin,
  Truck,
  Check,
  Send,
  TrendingDown,
  Share2,
  Eye,
  X,
  ShieldCheck,
  BadgePercent,
  ReceiptText,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Bell,
  Camera,
  CheckCheck,
  Flame,
  ChevronRight
} from 'lucide-react';

export default function AkunCRMPage() {
  const { currentUser, addToCart, selectedCluster, setSelectedCluster, clusters } = useApp();

  // 1. Kitchen OS Core State
  const [walletBalance, setWalletBalance] = useState(25000); // Saldo Dompet Dapur Siaga
  const [totalSavingsIdr, setTotalSavingsIdr] = useState(184500); // Akumulasi Hemat vs Bapanas
  const savingsPercent = 18;

  // 2. Silent Subuh Delivery Configuration
  const [dropLocation, setDropLocation] = useState<'PAGAR' | 'TERAS' | 'KOTAK' | 'SATPAM'>('PAGAR');
  const [houseAddress, setHouseAddress] = useState('Jl. Antapani Raya Blok D No. 12');
  const [gateNotes, setGateNotes] = useState('Pagar hitam tidak dikunci, cantolkan di handle pintu samping bel tanpa ketuk pintu.');
  const [savedDropSuccess, setSavedDropSuccess] = useState(false);
  const [testWaSent, setTestWaSent] = useState(false);

  // 3. Modals State
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [copiedWaMessage, setCopiedWaMessage] = useState(false);

  // 4. Claim State
  const [claimProduct, setClaimProduct] = useState('Telur Retak');
  const [claimAmount, setClaimAmount] = useState(3500);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // 5. Kitchen Profile Parameters
  const [familyMembers, setFamilyMembers] = useState(4);
  const [portion, setPortion] = useState<'250gr' | '500gr' | '1kg'>('500gr');
  const [cookingTime, setCookingTime] = useState('06:00');
  const [dietary, setDietary] = useState<string[]>([
    'Sayur Bebas Pestisida (Organik)',
    'Ayam Potong Halal Segar',
    'Telur Bersih Bebas Salmonela'
  ]);
  const [savedKitchenSuccess, setSavedKitchenSuccess] = useState(false);

  // 6. Kitchen Pantry Stock Radar (Milkbasket Style Inventory)
  const kitchenInventory = [
    {
      id: 'beras',
      name: 'Beras Pandan Wangi 5kg',
      category: 'Karbohidrat Pokok',
      status: 'SAFE',
      daysLeft: 6,
      currentStock: '3.5 kg tersisa',
      icon: '🍚',
      color: 'bg-emerald-500',
    },
    {
      id: 'minyak',
      name: 'Minyak Goreng Sawit 2L',
      category: 'Minyak Goreng',
      status: 'SAFE',
      daysLeft: 5,
      currentStock: '1.2 Liter tersisa',
      icon: '🛢️',
      color: 'bg-emerald-500',
    },
    {
      id: 'telur',
      name: 'Telur Ayam Negeri Fresh 1kg',
      category: 'Protein Harian',
      status: 'WARNING',
      daysLeft: 2,
      currentStock: '4 butir tersisa',
      icon: '🥚',
      color: 'bg-amber-500',
    },
    {
      id: 'sayur',
      name: 'Pakcoy & Sayur Hijau Segar',
      category: 'Sayuran Harian',
      status: 'CRITICAL',
      daysLeft: 1,
      currentStock: 'Habis besok pagi',
      icon: '🥬',
      color: 'bg-rose-500',
    },
  ];

  // 7. Tomorrow Morning Delivery Basket (04:30 - 07:30 WIB)
  const tomorrowSubuhBasket = [
    {
      product: initialProducts[1], // Pakcoy Hidroponik
      price: initialCatalogPrices[1],
      qty: 2,
      notes: 'Segar panen sore Ciwidey',
    },
    {
      product: initialProducts[4], // Telur Ayam Negeri
      price: initialCatalogPrices[4] || { sell_price_idr: 27500 },
      qty: 1,
      notes: 'Kemasan tray anti retak',
    },
    {
      product: initialProducts[0], // Ubi Cilembu Madu
      price: initialCatalogPrices[0],
      qty: 1,
      notes: 'Siap kukus sarapan pagi',
    },
  ];

  // 8. Breakdown Data Penghematan vs Bapanas
  const savingsBreakdown = [
    {
      id: 'telur',
      category: 'Telur Ayam Negeri Fresh',
      icon: '🥚',
      ourPrice: 'Rp 27.500 / kg',
      marketPrice: 'Rp 31.000 / kg',
      purchasedQty: '10 kg (akumulasi bulan ini)',
      savingsIdr: 35000,
      unitDiff: 'Hemat Rp 3.500 / kg',
      sourceNote: 'Direct kandang kemitraan Lembang',
    },
    {
      id: 'sayur',
      category: 'Aneka Sayur Mayur Segar (Pakcoy, Sosin, Kangkung)',
      icon: '🥬',
      ourPrice: 'Rp 5.000 – Rp 7.600 / ikat',
      marketPrice: 'Rp 7.500 – Rp 11.000 / ikat',
      purchasedQty: '16 ikat belanja rutin',
      savingsIdr: 48000,
      unitDiff: 'Hemat rata-rata Rp 3.000 / ikat',
      sourceNote: 'Panen sore langsung kirim subuh tanpa transit pasar',
    },
    {
      id: 'cabai',
      category: 'Bumbu Dapur & Cabai Rawit Merah',
      icon: '🌶️',
      ourPrice: 'Rp 42.000 / kg',
      marketPrice: 'Rp 56.000 / kg',
      purchasedQty: '3 kg (bumbu dapur basah)',
      savingsIdr: 41500,
      unitDiff: 'Hemat Rp 14.000 / kg',
      sourceNote: 'Bypass tengkulak Pasar Induk Caringin',
    },
    {
      id: 'beras',
      category: 'Beras Pandan Wangi & Minyak Sawit Pouch',
      icon: '🍚',
      ourPrice: 'Rp 65.000 / 5kg & Rp 15.500 / L',
      marketPrice: 'Rp 73.000 / 5kg & Rp 17.500 / L',
      purchasedQty: '4 paket kebutuhan pokok dasar',
      savingsIdr: 60000,
      unitDiff: 'Hemat Rp 8.000/sak & Rp 2.000/L',
      sourceNote: 'Pengadaan grosir langsung dari sentra beras Ciwidey',
    },
  ];

  const handleShareWa = () => {
    const waText = `Alhamdulillah bulan ini belanja dapur subuh lewat Berkah Tani di Komplek ${selectedCluster.name} hemat Rp ${totalSavingsIdr.toLocaleString('id-ID')} dibanding harga pasar biasa!\n\nSayurnya segar baru dipetik sore, diantar kurir subuh jam 5 pagi langsung digantung di pagar tanpa ketuk pintu sebelum kita masak sarapan (04:30 - 07:30 WIB).\n\nTetangga yang mau belanja bareng biar ongkir kurirnya gratis bisa cek jadwal klaster kita di sini:\nhttps://berkahtani.id/c/${selectedCluster.qr_slug}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(waText);
    }
    setCopiedWaMessage(true);
    setTimeout(() => setCopiedWaMessage(false), 3000);

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleTopUp = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    setShowTopUpModal(false);
  };

  const handleExecuteClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletBalance((prev) => prev + claimAmount);
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setShowClaimModal(false);
    }, 2000);
  };

  const [pantryBatchAdded, setPantryBatchAdded] = useState(false);
  const handleBatchRestock = () => {
    tomorrowSubuhBasket.forEach((item) => {
      addToCart(item.product, item.price, item.qty);
    });
    setPantryBatchAdded(true);
    setTimeout(() => setPantryBatchAdded(false), 2500);
  };

  const handleSaveKitchenProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedKitchenSuccess(true);
    setTimeout(() => setSavedKitchenSuccess(false), 2500);
  };

  const handleSaveDropPoint = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedDropSuccess(true);
    setTimeout(() => setSavedDropSuccess(false), 2500);
  };

  const handleSendTestWa = () => {
    setTestWaSent(true);
    setTimeout(() => setTestWaSent(false), 3000);
  };

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* 1. Header: Kitchen OS & Cluster Identity */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-[#1B8A44] bg-[#EBF7EE] border border-[#BAE6C5] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Pusat Kendali Dapur Subuh (Kitchen OS)
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Shift Subuh: 04:30 – 07:30 WIB
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dapur Keluarga: {currentUser.full_name}
          </h1>

          <p className="text-xs text-stone-500 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">{currentUser.email}</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {selectedCluster.name} (Klaster Rute Motor #02)
            </span>
            <span>•</span>
            <span className="text-stone-500">
              Kota Bandung • {selectedCluster.address_notes || 'Rute Subuh Harian'}
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start md:items-end gap-3 self-stretch md:self-auto">
          <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200 w-full sm:w-auto">
            <span className="text-[10px] text-stone-500 block font-mono font-bold uppercase tracking-wider">
              PILIH KLASTER RUTE:
            </span>
            <select
              value={selectedCluster.id}
              onChange={(e) => {
                const found = clusters.find((c) => c.id === e.target.value);
                if (found) setSelectedCluster(found);
              }}
              className="mt-1 w-full text-xs font-black bg-white text-stone-900 border border-stone-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <span className="px-3 py-2 bg-stone-100 text-stone-800 rounded-2xl text-xs font-mono font-bold border border-stone-200 shrink-0">
            Role: {currentUser.role}
          </span>
        </div>
      </div>

      {/* 2. SECTION UTAMA A: Live Status Pengantaran Subuh Besok (Silent Delivery Engine) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                JADWAL PENGANTARAN TERDEKAT
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <Truck className="w-6 h-6 text-emerald-400" />
                Besok Pagi: 04:40 – 05:05 WIB (Stop 1 Klaster)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
                ✓ SLA Silent Delivery Aktif
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Titik Drop Tanpa Ketuk Pintu */}
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[10px] text-emerald-200/80 font-mono font-bold block">
                TITIK DROP (SILENT DROP)
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>🏷️ Gantung di Pagar Luar</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                "{gateNotes}"
              </p>
              <span className="text-[10px] text-amber-300 block font-semibold pt-1">
                ⚡ Kurir tidak akan mengetuk pintu / membunyikan bel.
              </span>
            </div>

            {/* Box 2: Kurir & Rute Bertanggung Jawab */}
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[10px] text-emerald-200/80 font-mono font-bold block">
                KURIR MOTOR & RUTE
              </span>
              <div className="text-sm font-bold text-white">
                Kang Ujang • Motor Rute #02
              </div>
              <p className="text-xs text-slate-300">
                Menyusuri 10 rumah di {selectedCluster.name} dalam waktu 28 menit sebelum bergerak ke komplek berikutnya.
              </p>
              <span className="text-[10px] text-emerald-300 block font-mono font-semibold pt-1">
                Kapasitas: 10/10 Rumah Terjadwal
              </span>
            </div>

            {/* Box 3: Paket Subuh Terjadwal */}
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-emerald-200/80 font-mono font-bold block">
                  PAKET SUBUH TERJADWAL
                </span>
                <div className="text-sm font-bold text-white">
                  3 Komoditas Dapur Siap Kirim
                </div>
                <p className="text-xs text-slate-300">
                  Pakcoy Hidroponik (2 ikat), Telur Negeri (1 kg), Ubi Cilembu Madu (1 kg).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBatchRestock}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{pantryBatchAdded ? '3 Bahan Dimasukkan Keranjang!' : 'Ulangi Pesanan Subuh'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION UTAMA B: Buku Kas Dapur Terpadu (Unified Kitchen Ledger & Savings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Saldo Dompet Dapur Siaga (Prepaid Balance + Instant SLA Claim) */}
        <div className="bg-gradient-to-br from-[#0B4626] to-[#042413] text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden border border-emerald-900/60 flex flex-col justify-between space-y-4">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-300" />
                Saldo Dompet Dapur Siaga
              </span>
              <span className="text-[10px] bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full font-black">
                TERPOTONG OTOMATIS
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {formatRupiah(walletBalance)}
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Saldo otomatis memotong belanjaan subuh tanpa perlu bayar QRIS berkali-kali. Mengurangi biaya transfer dan waktu checkout.
            </p>

            {/* Quick Actions Dompet */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Isi Saldo Dapur</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClaimModal(true)}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Klaim Barang Rusak (5 Detik)</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
            <span className="font-mono text-[11px]">Ledger: Negative Working Capital</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              Garansi Uang Aman
            </span>
          </div>
        </div>

        {/* Card 2: Total Penghematan Belanja Dapur vs Bapanas (The Retention Engine) */}
        <div className="bg-gradient-to-br from-[#853B0B] via-[#632704] to-[#3B1402] text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden border border-amber-800/60 flex flex-col justify-between space-y-4">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-300" />
                Total Penghematan Belanja Dapur
              </span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-black tracking-wide shadow-2xs">
                Hemat ~{savingsPercent}% vs Pasar
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {formatRupiah(totalSavingsIdr)}
              </span>
              <span className="text-xs font-semibold text-amber-200/90">
                uang dapur dihemat
              </span>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed">
              Akumulasi selisih belanja keluarga Anda dibanding harga pasar tradisional Kota Bandung berdasarkan pantauan harian data Bapanas.
            </p>

            {/* Quick Action Buttons inside Card */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSavingsModal(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Rincian Hemat</span>
              </button>

              <button
                type="button"
                onClick={handleShareWa}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{copiedWaMessage ? 'Link WA Tersalin!' : 'Share ke Grup WA'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-700/50 flex items-center justify-between text-xs text-amber-200">
            <span className="flex items-center gap-1">
              <BadgePercent className="w-3.5 h-3.5 text-amber-300" />
              Acuan: Radar Bapanas Bandung
            </span>
            <span className="font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Transparansi Riil
            </span>
          </div>
        </div>
      </div>

      {/* 4. SECTION UTAMA C: Radar Ketahanan Stok Dapur (Kitchen Inventory Restock) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Radar Ketahanan Stok Dapur (Kitchen Safety Stock)
              </h2>
              <span className="text-xs bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5] font-bold px-2.5 py-0.5 rounded-full">
                Prediksi Cerdas
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Pantau sisa persediaan bahan pokok dapur keluarga Anda agar tidak kehabisan mendadak saat jam masak pagi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBatchRestock}
            className="px-4 py-2.5 bg-[#1B8A44] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>1-Klik Restock Kebutuhan Dapur</span>
          </button>
        </div>

        {/* 4 Baris Indikator Keterisian Bahan Pokok */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kitchenInventory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    item.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : item.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                  }`}
                >
                  {item.status === 'SAFE'
                    ? 'Stok Aman'
                    : item.status === 'WARNING'
                    ? 'Perlu Refill'
                    : 'Kritis'}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                <span className="text-[10px] text-stone-400 block">{item.category}</span>
              </div>

              {/* Progress bar sisa hari */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-stone-600">{item.currentStock}</span>
                  <span
                    className={
                      item.status === 'CRITICAL'
                        ? 'text-rose-600'
                        : item.status === 'WARNING'
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }
                  >
                    {item.daysLeft} Hari Lagi
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${Math.min(100, (item.daysLeft / 7) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SECTION UTAMA D: Pengaturan Titik Drop Silent Subuh & Alamat */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                SOP Pengantaran Silent Subuh (Tanpa Ketuk Pintu / Bel)
              </h2>
              <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                04:30 – 07:30 WIB
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Kurir subuh mengantarkan pesanan dapur Anda dengan senyap agar istirahat pagi keluarga Anda tidak terganggu.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveDropPoint} className="space-y-6">
          {/* Titik Drop Pilihan */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              Pilih Titik Peletakan Paket Dapur
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'PAGAR', label: 'Gantung di Pagar', icon: '🏷️', desc: 'Cantol di pagar luar' },
                { id: 'TERAS', label: 'Teras Dekat Bel', icon: '🚪', desc: 'Taruh di meja teras' },
                { id: 'KOTAK', label: 'Kotak Paket Depan', icon: '📦', desc: 'Masukkan ke drop box' },
                { id: 'SATPAM', label: 'Pos Satpam Komplek', icon: '👮', desc: 'Titip petugas gerbang' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDropLocation(opt.id as any)}
                  className={`p-3 text-left rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    dropLocation === opt.id
                      ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-1 ring-emerald-600'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{opt.icon}</span>
                    {dropLocation === opt.id && (
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-slate-900 block">{opt.label}</span>
                    <span className="text-[10px] text-stone-500">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Detail Alamat & Catatan Akses Subuh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Nomor Rumah & Blok (Klaster: {selectedCluster.name})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={houseAddress}
                  onChange={(e) => setHouseAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="Contoh: Jl. Antapani Raya No. 12"
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Sesuai rute 10 rumah per klaster kurir motor.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Catatan Khusus Pagar / Anjing Penjaga / Bel
              </label>
              <input
                type="text"
                value={gateNotes}
                onChange={(e) => setGateNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                placeholder="Contoh: Pagar tidak dikunci, gantung di handle pintu"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Instruksi ini tercetak otomatis di manifest jalan kurir subuh.
              </span>
            </div>
          </div>

          {/* Operational Courier Status Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900">
                  Status Pengiriman Subuh Terjadwal
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Kurir Motor: <b className="text-emerald-800">Kang Ujang</b> • Estimasi Tiba:{' '}
                <b>Stop 1 (04:40 – 05:05 WIB)</b> • Klaster: <b>{selectedCluster.name}</b>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSendTestWa}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-stone-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>{testWaSent ? 'Notifikasi WA Terkirim!' : 'Tes Notifikasi WA'}</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {savedDropSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Instruksi Drop Tersimpan!</span>
                  </>
                ) : (
                  <span>Simpan Instruksi Kurir</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 6. SECTION UTAMA E: Profil Dapur Keluarga (Porsi & Jam Masak) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Profil Operasional Dapur Keluarga</h2>
        </div>
        <p className="text-xs text-stone-500 mb-6">
          Sesuaikan porsi belanjaan dan jam mulai masak agar bahan dapur selalu tiba tepat waktu tanpa sisa berlebih.
        </p>

        <form onSubmit={handleSaveKitchenProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Jumlah Anggota Keluarga */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Jumlah Anggota Keluarga
              </label>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setFamilyMembers(num)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      familyMembers === num
                        ? 'bg-[#1B8A44] text-white border-[#1B8A44] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {num} orang
                  </button>
                ))}
              </div>
            </div>

            {/* Porsi Favorit */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Porsi Masak Sekali Makan
              </label>
              <div className="flex items-center gap-2">
                {(['250gr', '500gr', '1kg'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPortion(p)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      portion === p
                        ? 'bg-[#1B8A44] text-white border-[#1B8A44] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Jam Masak Pagi */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Jam Mulai Masak Sarapan (WIB)
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Preferensi Kualitas Bahan */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Standar Higienitas & Mutu Dapur
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Sayur Bebas Pestisida (Organik)',
                'Ayam Potong Halal Segar',
                'Telur Bersih Bebas Salmonela',
                'Bumbu Basah Giling Harian',
                'Beras Ciwidey Tanpa Pemutih',
              ].map((item) => {
                const active = dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDietary(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-stone-500">
              Data tersimpan terenkripsi di tabel <code className="font-mono text-emerald-800">crm_kitchen_profiles</code>.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {savedKitchenSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profil Dapur Tersimpan!</span>
                </>
              ) : (
                <span>Perbarui Preferensi Dapur</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL 1: Rincian Penghematan Belanja Dapur vs Bapanas */}
      {showSavingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <ReceiptText className="w-3.5 h-3.5" />
                  Rapor Transparansi Penghematan
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Rincian Penghematan Dapur Anda
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Perbandingan harga riil belanja Anda di Berkah Tani vs Rata-rata Pasar Tradisional Kota Bandung (Data Acuan Bapanas: Pasar Kosambi & Pasar Sederhana).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSavingsModal(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Total Uang Dapur Dihemat
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-0.5">
                  {formatRupiah(totalSavingsIdr)}
                  <span className="text-xs font-semibold text-emerald-700 ml-2">
                    (Hemat ~{savingsPercent}% per belanja)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-stone-600">
                <span className="block font-semibold">Estimasi Pasar Biasa: Rp 1.016.500</span>
                <span className="block font-black text-emerald-800">
                  Bayar di Berkah Tani: Rp 832.000
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Rincian Per Kategori Komoditas Pangan
              </h4>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
                {savingsBreakdown.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs font-bold text-slate-900">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2">
                        <span>Harga Kita: <b>{item.ourPrice}</b></span>
                        <span>vs</span>
                        <span>Pasar: <b className="text-stone-700">{item.marketPrice}</b></span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        💡 {item.sourceNote}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[11px] text-stone-400 block">{item.purchasedQty}</span>
                      <span className="text-sm font-black text-emerald-700">
                        + {formatRupiah(item.savingsIdr)}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {item.unitDiff}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  Bagikan Bukti Belanja Hemat ke Tetangga Komplek
                </span>
                <p className="text-[11px] text-emerald-800">
                  Ajak warga komplek {selectedCluster.name} ikut memesan agar rute kurir motor subuh makin efisien dan ongkir tetap gratis.
                </p>
              </div>

              <button
                type="button"
                onClick={handleShareWa}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedWaMessage ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-200" />
                    <span>Tersalin ke WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim ke Grup WA</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
              <span className="text-stone-400 text-[11px]">
                Diperbarui otomatis tiap siklus panen & data Bapanas.
              </span>
              <button
                type="button"
                onClick={() => setShowSavingsModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Top-Up Saldo Dompet Dapur Siaga (Prepaid Frictionless Engine) */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" />
                  Isi Saldo Dapur Siaga
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Top-Up Sekali, Belanja Subuh Otomatis
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Saldo terpotong otomatis saat pesanan subuh dikunci tengah malam. Bebas biaya QRIS berulang.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Pilih Nominal Top-Up
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { amount: 50000, label: 'Rp 50.000', bonus: 'Cocok untuk 2x sarapan' },
                  { amount: 100000, label: 'Rp 100.000', bonus: '+ Bonus Cashback Rp 5.000' },
                  { amount: 250000, label: 'Rp 250.000', bonus: '+ Bonus Cashback Rp 15.000 (Paling Favorit)' },
                ].map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    onClick={() => handleTopUp(item.amount)}
                    className="p-3.5 rounded-2xl border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        {item.bonus}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px]">
                Pembayaran via QRIS / Virtual Account instant.
              </span>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Klaim Cepat Komplain Sayur/Telur Rusak (Instant 5-Second Refund) */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Garansi Mutu Subuh
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Klaim Penggantian Instan (5 Detik)
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Ada telur retak atau sayur layu saat diantar subuh? Saldo otomatis masuk ke dompet Anda tanpa perlu retur fisik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowClaimModal(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Pilih Kendala Barang
                </label>
                <select
                  value={claimProduct}
                  onChange={(e) => {
                    setClaimProduct(e.target.value);
                    if (e.target.value.includes('Telur')) setClaimAmount(3500);
                    else if (e.target.value.includes('Pakcoy')) setClaimAmount(5000);
                    else setClaimAmount(4000);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Telur Retak (1-2 butir)">🥚 Telur Retak (1-2 butir) - Ganti Rp 3.500</option>
                  <option value="Sayur Pakcoy Layu">🥬 Sayur Pakcoy Layu - Ganti Rp 5.000</option>
                  <option value="Tomat Pecah">🍅 Tomat Pecah - Ganti Rp 4.000</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Foto Bukti Kondisi Barang (Opsional)
                </label>
                <div className="p-4 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-center space-y-1">
                  <Camera className="w-6 h-6 text-stone-400 mx-auto" />
                  <span className="text-xs text-stone-600 block font-semibold">
                    Klik atau taruh foto bukti paket
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    Format: JPG / PNG (Maks 5 MB)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                💰 Nilai ganti rugi <b>{formatRupiah(claimAmount)}</b> akan otomatis masuk ke Saldo Dompet Dapur Anda.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {claimSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Saldo {formatRupiah(claimAmount)} Berhasil Masuk!</span>
                  </>
                ) : (
                  <span>Kreditkan Penggantian ke Dompet</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
