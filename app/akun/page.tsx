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
  AlertCircle,
  Package,
} from 'lucide-react';

export default function AkunCRMPage() {
  const { currentUser, addToCart, selectedCluster } = useApp();

  // Progressive Profiling Form State
  const [familyMembers, setFamilyMembers] = useState(4);
  const [portion, setPortion] = useState<'250gr' | '500gr' | '1kg'>('500gr');
  const [notifyTime, setNotifyTime] = useState('08:30');
  const [dietary, setDietary] = useState<string[]>(['Sayur Bebas Pestisida', 'Daging Halal RPA']);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      status: 'CRITICAL_LOW',
    },
    {
      product: initialProducts[0], // Ubi Cilembu Madu
      price: initialCatalogPrices[0],
      lastBoughtDaysAgo: 7,
      frequencyDays: 7,
      status: 'NEEDS_REFILL',
    },
    {
      product: initialProducts[2], // Ayam Filet
      price: initialCatalogPrices[2],
      lastBoughtDaysAgo: 4,
      frequencyDays: 3,
      status: 'NEEDS_REFILL',
    },
  ];

  const [pantryAddedAll, setPantryAddedAll] = useState(false);

  const handleAddAllPantry = () => {
    predictedLowItems.forEach((item) => {
      addToCart(item.product, item.price, 1);
    });
    setPantryAddedAll(true);
    setTimeout(() => setPantryAddedAll(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1B8A44] bg-[#EBF7EE] border border-[#BAE6C5] px-3 py-1 rounded-full uppercase tracking-wider">
            Profil Dapur & Smart Pantry
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {currentUser.full_name}
          </h1>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
            <span>{currentUser.email}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">📍 {selectedCluster.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-xl text-xs font-mono font-bold">
            Role: {currentUser.role}
          </span>
        </div>
      </div>

      {/* Row: Wallet Ledger Card & Farmer Impact Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Ledger Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-300" />
                Saldo Dompet CRM (Cashback & Klaim)
              </span>
              <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full font-bold">
                Tersedia
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              {formatRupiah(walletBalance)}
            </div>

            <p className="text-xs text-emerald-200/80 mt-2">
              Dapat langsung dipotongkan otomatis pada checkout group-buy berikutnya.
            </p>

            <div className="mt-4 pt-4 border-t border-emerald-700/50 flex items-center justify-between text-xs text-emerald-200">
              <span>Status Ledger: ACTIVE</span>
              <span className="font-semibold text-white">Otomatis Terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Farmer Impact Card */}
        <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-200 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-amber-300" />
                Jejak Dampak Petani Binaan
              </span>
              <span className="text-[10px] bg-amber-600/80 px-2 py-0.5 rounded-full font-bold">
                Rantai Hulu 1P
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              {farmerImpactKg} <span className="text-xl font-normal text-amber-200">kg pangan</span>
            </div>

            <p className="text-xs text-amber-200/80 mt-2">
              Bahan dapur yang Anda serap langsung dari Gapoktan Lembang & Ciwidey tanpa perantara berlebih.
            </p>

            <div className="mt-4 pt-4 border-t border-amber-600/50 flex items-center justify-between text-xs text-amber-200">
              <span>Mitra Petani Didukung: 4 Keluarga</span>
              <span className="font-semibold text-white">Transparansi 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Pantry Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-stone-900">Smart Pantry Tracker</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Prediksi AI
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Berdasarkan pola konsumsi dapur keluarga Anda, stok bahan pangan berikut diprediksi habis dalam 24-48 jam.
            </p>
          </div>

          <button
            onClick={handleAddAllPantry}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            {pantryAddedAll ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>3 Bahan Dimasukkan!</span>
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
          {predictedLowItems.map((item) => (
            <div
              key={item.product.id}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/40 transition space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-stone-900">{item.product.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.status === 'CRITICAL_LOW'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status === 'CRITICAL_LOW' ? 'Hampir Habis' : 'Perlu Diisi'}
                </span>
              </div>

              <div className="text-xs text-stone-500">
                Terakhir beli: <b>{item.lastBoughtDaysAgo} hari lalu</b> (siklus rutin: tiap {item.frequencyDays} hari)
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                <span className="font-bold text-emerald-700">
                  {formatRupiah(item.price.sell_price_idr)}
                </span>
                <button
                  onClick={() => addToCart(item.product, item.price, 1)}
                  className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg text-stone-700 font-semibold text-[11px] transition"
                >
                  + Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Profiling Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-stone-900">Profil Dapur Keluarga</h2>
        </div>
        <p className="text-xs text-stone-500 mb-6">
          Bantu kami menyesuaikan porsi kemasan dan jam pengingat agar dapur Anda tidak pernah kehabisan bahan segar.
        </p>

        <form onSubmit={handleSaveProfile} className="space-y-6">
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
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      familyMembers === num
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
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
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      portion === p
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
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
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Data tersimpan terenkripsi di tabel <code className="font-mono text-emerald-800">crm_kitchen_profiles</code>.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
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
