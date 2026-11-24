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
  Copy,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  BadgePercent,
  ReceiptText,
  ExternalLink
} from 'lucide-react';

export default function AkunCRMPage() {
  const { currentUser, addToCart, selectedCluster, setSelectedCluster, clusters } = useApp();

  // Progressive Profiling Form State
  const [familyMembers, setFamilyMembers] = useState(4);
  const [portion, setPortion] = useState<'250gr' | '500gr' | '1kg'>('500gr');
  const [notifyTime, setNotifyTime] = useState('08:30');
  const [dietary, setDietary] = useState<string[]>([
    'Sayur Bebas Pestisida (Organik)',
    'Ayam Potong Halal Segar',
    'Telur Bersih Bebas Salmonela'
  ]);
  const [savedKitchenSuccess, setSavedKitchenSuccess] = useState(false);

  // Subuh Courier Drop Point State (Contactless Delivery)
  const [dropLocation, setDropLocation] = useState<'PAGAR' | 'TERAS' | 'KOTAK' | 'SATPAM'>('PAGAR');
  const [houseAddress, setHouseAddress] = useState('Jl. Antapani Raya Blok D No. 12');
  const [gateNotes, setGateNotes] = useState('Pagar hitam tidak dikunci, cantolkan di handle pintu samping bel.');
  const [savedDropSuccess, setSavedDropSuccess] = useState(false);
  const [testWaSent, setTestWaSent] = useState(false);

  // CRM Wallet Balance & Real Savings Metrics
  const walletBalance = 25000; // Available cashback from wallet_ledger
  const totalSavingsIdr = 184500; // Akumulasi hemat vs harga pasar Bapanas
  const savingsPercent = 18; // Persentase rata-rata hemat belanja

  // Modal State & WA Share
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [copiedWaMessage, setCopiedWaMessage] = useState(false);

  // Detail Data Rincian Penghematan Berdasarkan Bapanas Bandung
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
    const waText = `Alhamdulillah bulan ini belanja dapur subuh lewat Berkah Tani di Komplek ${selectedCluster.name} hemat Rp ${totalSavingsIdr.toLocaleString('id-ID')} dibanding harga pasar biasa!\n\nSayurnya segar baru dipetik, telur bersih, diantar subuh jam 5 pagi langsung digantung di pagar sebelum kita masak sarapan (04:30 - 07:30 WIB).\n\nTetangga yang mau belanja bareng biar ongkir kurirnya gratis bisa cek jadwal klaster kita di sini:\nhttps://berkahtani.id/c/${selectedCluster.qr_slug}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(waText);
    }
    setCopiedWaMessage(true);
    setTimeout(() => setCopiedWaMessage(false), 3000);

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  // Smart Pantry Predictions (Bahan diprediksi habis dalam 1-2 hari)
  const predictedLowItems = [
    {
      product: initialProducts[1], // Pakcoy Hidroponik
      price: initialCatalogPrices[1],
      lastBoughtDaysAgo: 5,
      frequencyDays: 4,
      status: 'CRITICAL_LOW' as const,
      priceSignal: 'Hemat Rp 1.500 vs Bapanas',
      signalType: 'PRICE_DROP' as const,
    },
    {
      product: initialProducts[0], // Ubi Cilembu Madu
      price: initialCatalogPrices[0],
      lastBoughtDaysAgo: 7,
      frequencyDays: 7,
      status: 'NEEDS_REFILL' as const,
      priceSignal: 'Mitra Ciwidey Langsung 1P',
      signalType: 'DIRECT_FARMER' as const,
    },
    {
      product: initialProducts[2], // Sosin Manis Segar
      price: initialCatalogPrices[2],
      lastBoughtDaysAgo: 4,
      frequencyDays: 3,
      status: 'NEEDS_REFILL' as const,
      priceSignal: 'Harga Stabil Acuan Bapanas',
      signalType: 'STABLE' as const,
    },
  ];

  const [pantryAddedAll, setPantryAddedAll] = useState(false);
  const [itemAddedMap, setItemAddedMap] = useState<Record<string, boolean>>({});

  const handleAddAllPantry = () => {
    predictedLowItems.forEach((item) => {
      addToCart(item.product, item.price, 1);
    });
    setPantryAddedAll(true);
    setTimeout(() => setPantryAddedAll(false), 2500);
  };

  const handleAddSingleItem = (productId: string, product: any, price: any) => {
    addToCart(product, price, 1);
    setItemAddedMap((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setItemAddedMap((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
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
      {/* 1. Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#1B8A44] bg-[#EBF7EE] border border-[#BAE6C5] px-3 py-1 rounded-full uppercase tracking-wider">
              PROFIL DAPUR & SMART PANTRY
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Shift Subuh: 04:30 – 07:30 WIB
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {currentUser.full_name}
          </h1>
          <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
            <span>{currentUser.email}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {selectedCluster.name}
            </span>
            <span>•</span>
            <span className="text-stone-500">
              Kota Bandung • {selectedCluster.address_notes || 'Rute Subuh Harian'}
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block font-mono">PILIH KLASTER RUTE:</span>
            <select
              value={selectedCluster.id}
              onChange={(e) => {
                const found = clusters.find((c) => c.id === e.target.value);
                if (found) setSelectedCluster(found);
              }}
              className="text-xs font-bold bg-stone-50 text-stone-800 border border-stone-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <span className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-mono font-bold self-start sm:self-center border border-stone-200">
            Role: {currentUser.role}
          </span>
        </div>
      </div>

      {/* 2. Top Metric Cards: Saldo Dompet CRM & Total Penghematan Dapur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Saldo Dompet CRM */}
        <div className="bg-gradient-to-br from-[#0B4626] to-[#042413] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-emerald-900/50 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-300" />
                Saldo Dompet CRM (Cashback & Klaim)
              </span>
              <span className="text-[10px] bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full font-bold">
                Tersedia
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-white">
              {formatRupiah(walletBalance)}
            </div>

            <p className="text-xs text-emerald-200/90 mt-2">
              Dapat langsung dipotongkan otomatis pada checkout group-buy berikutnya.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
            <span className="font-mono text-[11px]">Status Ledger: ACTIVE</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              Otomatis Terverifikasi
            </span>
          </div>
        </div>

        {/* Card 2: Total Penghematan Dapur (Menggantikan Kartu Petani Lama) */}
        <div className="bg-gradient-to-br from-[#853B0B] via-[#632704] to-[#3B1402] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-amber-800/60 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-300" />
                Total Penghematan Belanja Dapur
              </span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-black tracking-wide shadow-2xs">
                Hemat ~{savingsPercent}% vs Pasar
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {formatRupiah(totalSavingsIdr)}
              </span>
              <span className="text-xs font-semibold text-amber-200/90">
                uang dapur dihemat
              </span>
            </div>

            <p className="text-xs text-amber-200/90 mt-2 leading-relaxed">
              Akumulasi selisih belanja keluarga Anda dibanding harga rata-rata Pasar Tradisional & Supermarket.
            </p>

            {/* Quick Action Buttons inside Card */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSavingsModal(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Rincian Hemat</span>
              </button>

              <button
                type="button"
                onClick={handleShareWa}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{copiedWaMessage ? 'Link WA Tersalin!' : 'Share ke Grup WA'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-amber-700/50 flex items-center justify-between text-xs text-amber-200">
            <span className="flex items-center gap-1">
              <BadgePercent className="w-3.5 h-3.5 text-amber-300" />
              Acuan: Radar Bapanas Bandung
            </span>
            <span className="font-semibold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Transparansi Riil
            </span>
          </div>
        </div>
      </div>

      {/* 3. Smart Pantry Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Smart Pantry Tracker</h2>
              <span className="text-xs bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5] font-bold px-2.5 py-0.5 rounded-full">
                Prediksi AI
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Berdasarkan pola konsumsi dapur keluarga Anda, stok bahan pangan berikut diprediksi habis dalam 24–48 jam.
            </p>
          </div>

          <button
            onClick={handleAddAllPantry}
            className="px-4 py-2.5 bg-[#1B8A44] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {pantryAddedAll ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Semua Bahan Dimasukkan!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Masukkan Semua ke Keranjang 1-Klik</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {predictedLowItems.map((item) => {
            const isAdded = itemAddedMap[item.product.id];
            return (
              <div
                key={item.product.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-emerald-50/30 transition space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {item.product.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.status === 'CRITICAL_LOW'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                    >
                      {item.status === 'CRITICAL_LOW' ? 'Hampir Habis' : 'Perlu Diisi'}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500 mt-1">
                    Terakhir beli: <b>{item.lastBoughtDaysAgo} hari lalu</b> (siklus rutin: tiap {item.frequencyDays} hari)
                  </div>

                  {/* Price Radar Signal Badge */}
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                      <TrendingDown className="w-3 h-3 text-emerald-600" />
                      {item.priceSignal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Harga Klaster</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatRupiah(item.price.sell_price_idr)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddSingleItem(item.product.id, item.product, item.price)}
                    className={`px-3 py-1.5 border rounded-lg font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 ${isAdded
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800 shadow-2xs'
                      }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Ditambahkan</span>
                      </>
                    ) : (
                      <span>+ Keranjang</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Subuh Courier Drop Point & Contactless Instructions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Instruksi Pengantaran Kurir Subuh (Contactless)
              </h2>
              <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                04:30 – 07:30 WIB
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Pengantaran subuh tanpa mengetuk pagar atau mengganggu istirahat pagi keluarga Anda. Kurir akan meletakkan paket di titik yang Anda pilih.
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
                  className={`p-3 text-left rounded-2xl border transition cursor-pointer flex flex-col justify-between ${dropLocation === opt.id
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

      {/* 5. Progressive Profiling Form (Profil Dapur Keluarga) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Profil Dapur Keluarga</h2>
        </div>
        <p className="text-xs text-stone-500 mb-6">
          Bantu kami menyesuaikan porsi kemasan dan jam pengingat agar dapur Anda tidak pernah kehabisan bahan segar.
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
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${familyMembers === num
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
                Porsi Favorit Sekali Masak
              </label>
              <div className="flex items-center gap-2">
                {(['250gr', '500gr', '1kg'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPortion(p)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${portion === p
                      ? 'bg-[#1B8A44] text-white border-[#1B8A44] shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Jam Notifikasi Favorit */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Jam Pengingat Dapur (WIB)
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={notifyTime}
                  onChange={(e) => setNotifyTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Preferensi Kualitas Bahan */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Preferensi Kualitas Bahan Dapur
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${active
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

      {/* 6. MODAL POPUP: Rincian Penghematan Belanja Dapur vs Bapanas */}
      {showSavingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
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

            {/* Total Ringkasan Banner */}
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

            {/* Breakdown Items List */}
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

            {/* WA Sharing CTA Box inside Modal */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  Bagikan Bukti Belanja Hemat ke Tetangga Komplek
                </span>
                <p className="text-[11px] text-emerald-800">
                  Ajak warga komplek {selectedCluster.name} ikut memesan agar kuota kurir subuh terpenuhi dan ongkir tetap gratis.
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

            {/* Modal Footer */}
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
    </div>
  );
}
