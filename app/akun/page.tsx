'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/lib/pricing-engine';
import { initialProducts, initialCatalogPrices } from '@/lib/mock-data';
import {
  Wallet,
  Leaf,
  Clock,
  Users,
  Utensils,
  Bell,
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  Package,
  MapPin,
  Truck,
  ShieldCheck,
  Check,
  Send,
  Home,
  AlertCircle,
  TrendingDown,
  Info
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
  const [waNotifyEnabled, setWaNotifyEnabled] = useState(true);
  const [savedDropSuccess, setSavedDropSuccess] = useState(false);
  const [testWaSent, setTestWaSent] = useState(false);

  // CRM Wallet Balance & Farmer Impact Metrics
  const walletBalance = 25000; // Available cashback from wallet_ledger
  const farmerImpactKg = 42.5; // Kilograms absorbed directly from 1P farmers

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

      {/* 2. Top Metric Cards: Wallet Ledger & Farmer Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Saldo Dompet CRM */}
        <div className="bg-gradient-to-br from-[#0B4626] to-[#042413] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-emerald-900/50">
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

            <div className="mt-4 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
              <span className="font-mono text-[11px]">Status Ledger: ACTIVE</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                Otomatis Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Jejak Dampak Petani Binaan */}
        <div className="bg-gradient-to-br from-[#9C4B18] to-[#542407] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-amber-900/50">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-200 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-amber-300" />
                Jejak Dampak Petani Binaan
              </span>
              <span className="text-[10px] bg-amber-600/90 text-white px-2.5 py-0.5 rounded-full font-bold">
                Rantai Hulu 1P
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-white">
              {farmerImpactKg} <span className="text-xl font-normal text-amber-200">kg pangan</span>
            </div>

            <p className="text-xs text-amber-200/90 mt-2">
              Bahan dapur yang Anda serap langsung dari Gapoktan Lembang & Ciwidey tanpa perantara berlebih.
            </p>

            <div className="mt-4 pt-4 border-t border-amber-600/60 flex items-center justify-between text-xs text-amber-200">
              <span>Mitra Petani Didukung: 4 Keluarga</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Transparansi 100%
              </span>
            </div>
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
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.status === 'CRITICAL_LOW'
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
                    className={`px-3 py-1.5 border rounded-lg font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 ${
                      isAdded
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
                Porsi Favorit Sekali Masak
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
    </div>
  );
}
