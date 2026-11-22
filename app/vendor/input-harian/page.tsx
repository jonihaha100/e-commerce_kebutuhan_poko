'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { initialProducts, initialBenchmarks, initialVendorOffers } from '@/lib/mock-data';
import { formatRupiah, validateCuringGuard, validateVendorSpikeGuard } from '@/lib/pricing-engine';
import { getJakartaTimeString, isPastVendorCutoff, getJakartaDateString } from '@/lib/time';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function VendorInputHarianPage() {
  const { currentUser } = useApp();
  const todayStr = getJakartaDateString();
  const timeWIB = getJakartaTimeString(new Date(), false);
  const isCutoffPast = isPastVendorCutoff();

  // Products assigned to vendor
  const assignedProducts = currentUser.role === 'VENDOR_PASAR_3P'
    ? initialProducts.filter((p) => !p.is_1p)
    : initialProducts.filter((p) => p.is_1p);

  const [selectedProductId, setSelectedProductId] = useState(assignedProducts[0]?.id || '');
  const [netPrice, setNetPrice] = useState(12000);
  const [packCost, setPackCost] = useState(1000);
  const [stockQty, setStockQty] = useState(50);
  const [harvestDate, setHarvestDate] = useState('2026-11-06');
  const [readyDate, setReadyDate] = useState('2026-11-21');

  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  const selectedProduct = initialProducts.find((p) => p.id === selectedProductId) || assignedProducts[0];

  // Latest benchmark for comparison
  const latestBenchmark = initialBenchmarks
    .filter((b) => b.product_id === selectedProductId)
    .sort((a, b) => b.benchmark_date.localeCompare(a.benchmark_date))[0]?.price_idr || 15000;

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);

    try {
      const res = await fetch('/api/vendor/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycle_id: 'd0000000-0000-0000-0000-000000000001',
          vendor_id: currentUser.id,
          product_id: selectedProductId,
          net_price_idr: Number(netPrice),
          pack_cost_idr: Number(packCost),
          stock_qty: Number(stockQty),
          harvest_date: harvestDate,
          ready_to_consume_date: readyDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResultMessage({
          type: 'error',
          text: `🚨 Ditolak Sistem: ${data.error}`,
        });
      } else if (data.spike_warning || data.is_late) {
        setResultMessage({
          type: 'warning',
          text: `⚠️ Penawaran Disimpan (PENDING ADMIN REVIEW): ${data.message}`,
        });
      } else {
        setResultMessage({
          type: 'success',
          text: `✅ Penawaran Berhasil Disimpan & Disetujui (Status: APPROVED)`,
        });
      }
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: `Koneksi gagal: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Test Simulation Shortcuts
  const simulateFailCuring = () => {
    // Select Ubi Cilembu, harvest 5 days ago, ready today (< 14 days curing)
    const ubi = initialProducts.find((p) => p.sku === 'UBI-CLM-01');
    if (ubi) {
      setSelectedProductId(ubi.id);
      setHarvestDate('2026-11-17'); // 5 days ago
      setReadyDate('2026-11-22');
      setNetPrice(13000);
    }
  };

  const simulateSpike40Pct = () => {
    // Select Cabai Rawit or current, set price 40% above benchmark
    const cabai = initialProducts.find((p) => p.sku === 'CBI-RWT-3P') || selectedProduct;
    setSelectedProductId(cabai.id);
    const benchmark = initialBenchmarks.find((b) => b.product_id === cabai.id)?.price_idr || 15000;
    setNetPrice(Math.round(benchmark * 1.40)); // 40% spike
    setHarvestDate('2026-11-22');
    setReadyDate('2026-11-22');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Portal Vendor Hulu & Petani
          </span>
          <h1 className="text-2xl font-extrabold text-stone-900 mt-2 tracking-tight">
            Input Penawaran Modal Harian
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Vendor: <span className="font-bold text-stone-800">{currentUser.full_name}</span> ({currentUser.role})
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-stone-100 rounded-xl">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Jam Operasional: <b className="text-stone-900">{timeWIB}</b></span>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isCutoffPast ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {isCutoffPast ? 'Lewat Cutoff 15:00 WIB (Butuh Review Admin)' : 'Jendela Input Aktif (s/d 15:00 WIB)'}
          </span>
        </div>
      </div>

      {/* Simulator Buttons for Evaluation */}
      <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Uji Cepat Skenario Evaluasi:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={simulateFailCuring}
            className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700 rounded-lg font-medium transition"
          >
            Uji Ubi Cilembu Umur 5 Hari (Harus Ditolak 400)
          </button>
          <button
            onClick={simulateSpike40Pct}
            className="px-3 py-1.5 bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700 rounded-lg font-medium transition"
          >
            Uji Lonjakan Modal +40% (Harus Tertahan Review)
          </button>
        </div>
      </div>

      {/* Alert Result Banner */}
      {resultMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium ${
            resultMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : resultMessage.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {resultMessage.text}
        </div>
      )}

      {/* Main Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Select Product */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Pilih Komoditas
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {assignedProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.unit}) - {p.category_type}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-400 mt-1">
                Acuan Bapanas Bandung hari ini:{' '}
                <b className="text-stone-700">{formatRupiah(latestBenchmark)}</b>
              </p>
            </div>

            {/* Net Price (HPP Petani) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Harga Modal Bersih Petani (Net Price IDR)
              </label>
              <input
                type="number"
                value={netPrice}
                onChange={(e) => setNetPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={100}
                step={100}
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Toleransi lonjakan aman: max +25% ({formatRupiah(Math.round(latestBenchmark * 1.25))})
              </p>
            </div>

            {/* Pack Cost */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Biaya Kemasan & Label (Pack Cost IDR)
              </label>
              <input
                type="number"
                value={packCost}
                onChange={(e) => setPackCost(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={0}
                step={100}
                required
              />
            </div>

            {/* Stock Qty */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Kapasitas Stok Tersedia ({selectedProduct?.unit || 'unit'})
              </label>
              <input
                type="number"
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={0}
                required
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Tanggal Panen (Harvest Date)
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Ready to Consume Date */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Tanggal Siap Konsumsi (Ready to Consume)
              </label>
              <input
                type="date"
                value={readyDate}
                onChange={(e) => setReadyDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              {selectedProduct?.category_type === 'TUBER_CURED_1P' && (
                <p className="text-[11px] text-amber-700 mt-1 font-semibold">
                  ⚠️ Ubi Cilembu wajib curing minimal 14 hari sejak tanggal panen.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/vendor/surat-jalan"
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Lihat Rekap Surat Jalan Agregat Hulu</span>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? 'Memvalidasi Guardrails...' : 'Kirim Penawaran Modal Harian'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
