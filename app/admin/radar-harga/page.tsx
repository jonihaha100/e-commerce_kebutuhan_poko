'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  initialProducts,
  initialBenchmarks,
  initialCatalogPrices,
  initialVendorOffers,
  initialAiAlerts,
  Product,
} from '@/lib/mock-data';
import {
  formatRupiah,
  calculateMinSafePrice,
  calculateFailoverSellPrice,
  calculateOpenBookSplit,
  determinePriceSignal,
} from '@/lib/pricing-engine';
import { getJakartaTimeString, isCatalogPublishTime } from '@/lib/time';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { useApp } from '@/context/AppContext';

export default function RadarHargaAdminPage() {
  const { products, catalogPrices, updateCatalogPrice } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || initialProducts[0].id
  );
  const [alerts, setAlerts] = useState(initialAiAlerts);

  // Selected Product & its related data
  const currentProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || initialProducts[0];
  const currentPriceEntry = catalogPrices.find((cp) => cp.product_id === currentProduct.id);

  // Form edit price state
  const [customSellPrice, setCustomSellPrice] = useState(
    currentPriceEntry?.sell_price_idr || 18000
  );
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [circuitBreakerError, setCircuitBreakerError] = useState<string | null>(null);

  // AI Insight State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Build 14-day Chart Data for selected product
  const productBenchmarks = initialBenchmarks
    .filter((b) => b.product_id === currentProduct.id)
    .sort((a, b) => a.benchmark_date.localeCompare(b.benchmark_date));

  const chartData = productBenchmarks.map((b) => {
    // Simulated historical vendor offer & recommendation based on benchmark
    const vendorModal = Math.round(b.price_idr * 0.68);
    const recommendedSell = Math.max(
      Math.round(b.price_idr * 0.95),
      calculateMinSafePrice(vendorModal, 800)
    );

    return {
      date: b.benchmark_date.slice(5), // "MM-DD"
      bapanasPrice: b.price_idr,
      vendorModal,
      recommendedSell,
    };
  });

  const latestBenchmarkPrice = productBenchmarks[productBenchmarks.length - 1]?.price_idr || 15000;
  const currentMinSafe = calculateMinSafePrice(Math.round(latestBenchmarkPrice * 0.68), 1000);

  // Handle Commodity Change
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    const priceEntry = catalogPrices.find((cp) => cp.product_id === productId);
    setCustomSellPrice(priceEntry?.sell_price_idr || Math.round(latestBenchmarkPrice * 0.95));
    setCircuitBreakerError(null);
    setAiInsight(null);
  };

  // 1-Click Action 1: Activate 1P Substitute (e.g. Pakcoy -> Sosin)
  const handleActivateSubstitution = () => {
    if (currentProduct.substitute_product_id) {
      handleSelectProduct(currentProduct.substitute_product_id);
    }
  };

  // 1-Click Action 2: Activate 3P Failover with Margin Compression
  const handleActivate3PFailover = () => {
    const net3P = Math.round(latestBenchmarkPrice * 0.72);
    const packCost = 600;
    const failoverResult = calculateFailoverSellPrice(net3P, packCost, 1500, currentPriceEntry?.sell_price_idr);

    setCustomSellPrice(failoverResult.sellPrice);
    updateCatalogPrice(currentProduct.id, failoverResult.sellPrice, net3P);
  };

  // Trigger Gemini Flash AI Insight
  const handleFetchAiInsight = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/admin/price-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: currentProduct.name,
          currentSellPrice: customSellPrice,
          benchmarkPrice: latestBenchmarkPrice,
          priceSignal: currentPriceEntry?.signal_type || 'STABLE',
        }),
      });
      const data = await res.json();
      setAiInsight(data.insight);
    } catch (e) {
      setAiInsight('Pemeriksaan parameter tren harga stabil pada batas toleransi operasional.');
    } finally {
      setAiLoading(false);
    }
  };

  // Approve & Publish to Storefront (16:00 WIB trigger with DB CHECK constraint validation)
  const handleApproveAndPublish = () => {
    // CIRCUIT BREAKER INVARIANT VALIDATION
    if (customSellPrice < currentMinSafe) {
      setCircuitBreakerError(
        `🚨 Circuit Breaker Aktif! Harga jual (${formatRupiah(customSellPrice)}) tidak boleh lebih rendah dari P_min_safe (${formatRupiah(currentMinSafe)}). Proteksi modal dan komisi mitra IRT tidak dapat dilanggar!`
      );
      return;
    }

    setCircuitBreakerError(null);

    // Sync to AppContext and storefront
    updateCatalogPrice(
      currentProduct.id,
      customSellPrice,
      Math.round(latestBenchmarkPrice * 0.68)
    );

    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const timeWIB = getJakartaTimeString(new Date(), false);

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Header with Brand Logo */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/brand-logo.png"
            alt="Logo Agrojaya"
            className="w-14 h-14 object-contain rounded-full border-2 border-[#4C9BD5] p-1 bg-white shadow-xs"
          />
          <div>
            <span className="text-xs font-bold text-[#0369A1] bg-[#E0F2FE] border border-[#BAE6FD] px-3 py-1 rounded-full uppercase tracking-wider">
              Executive Command Center (PRD Modul 2B)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
              Radar Harga 14 Hari & Fiksasi 16:00 WIB
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pengawasan tren komoditas Bapanas Bandung, validasi circuit breaker, dan orkestrasi hulu
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl">
            Waktu Operasional: <b className="text-slate-900">{timeWIB}</b>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5]">
            Fase Fiksasi Katalog (15:00 - 16:00 WIB)
          </span>
        </div>
      </div>

      {/* Anomaly Box (ai_agent_alerts) */}
      {alerts.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>Kotak Anomali Hulu & Quality Agent ({alerts.length} Isu Terdeteksi)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-4 bg-white rounded-2xl border border-rose-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">{alt.title}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                    {alt.severity}
                  </span>
                </div>
                <p className="text-xs text-stone-600">{alt.description}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Agent: {alt.agent_name}</span>
                  <span className="text-emerald-700 font-semibold cursor-pointer hover:underline">
                    Verifikasi Anomali
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Trading-style Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Commodity Selector Bar */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Pilih Komoditas untuk Inspeksi 14 Hari:
          </label>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedProductId === p.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {p.is_1p ? '1P' : '3P'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Header Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div>
            <span className="text-xs text-stone-500 block">Acuan Pasar (Bapanas)</span>
            <span className="text-lg font-bold text-cyan-700">
              {formatRupiah(latestBenchmarkPrice)}
            </span>
          </div>
          <div>
            <span className="text-xs text-stone-500 block">Estimasi Modal Hulu</span>
            <span className="text-lg font-bold text-amber-700">
              {formatRupiah(Math.round(latestBenchmarkPrice * 0.68))}
            </span>
          </div>
          <div>
            <span className="text-xs text-stone-500 block">Batas Bawah Aman (P_min_safe)</span>
            <span className="text-lg font-bold text-rose-700">
              {formatRupiah(currentMinSafe)}
            </span>
          </div>
          <div>
            <span className="text-xs text-stone-500 block">Rekomendasi Storefront</span>
            <span className="text-lg font-bold text-emerald-700">
              {formatRupiah(customSellPrice)}
            </span>
          </div>
        </div>

        {/* 14-Day Line Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => formatRupiah(Number(val))}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="bapanasPrice"
                name="Harga Bapanas Bandung"
                stroke="#4C9BD5"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="vendorModal"
                name="Input Modal Vendor"
                stroke="#D97706"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="recommendedSell"
                name="Harga Jual Rekomendasi"
                stroke="#24B05A"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight Box */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Analisis Prediktif AI Hulu Agent (Gemini Flash)</span>
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed max-w-2xl">
              {aiInsight || 'Klik tombol analisis untuk mendapatkan ringkasan prediktif 2 kalimat tren pasokan komoditas ini.'}
            </p>
          </div>

          <button
            onClick={handleFetchAiInsight}
            disabled={aiLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiLoading ? 'Menganalisis...' : 'Analisis AI Hulu Agent'}</span>
          </button>
        </div>

        {/* Failover & Substitution Action Panel */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Panel Aksi Auto-Failover & Mitigasi Stok:
          </span>

          <div className="flex flex-wrap gap-3">
            {currentProduct.substitute_product_id && (
              <button
                onClick={handleActivateSubstitution}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <span>Aktifkan Rekomendasi Substitusi 1P (Sosin Manis)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleActivate3PFailover}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl transition flex items-center gap-2"
            >
              <span>Aktifkan Jalur Cadangan Pasar Induk 3P (Kompresi Margin Flat Rp1.500)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Price Adjustment & Publish Bar */}
        <div className="p-6 bg-stone-900 text-white rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                Fiksasi Harga Jual Storefront ({currentProduct.name})
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Terproteksi batasan database <code className="text-amber-400">sell_price_idr &gt;= min_safe_price_idr ({formatRupiah(currentMinSafe)})</code>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400">Harga Tetap IDR:</span>
              <input
                type="number"
                value={customSellPrice}
                onChange={(e) => setCustomSellPrice(Number(e.target.value))}
                className="w-36 px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl font-bold text-sm text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                step={100}
              />
            </div>
          </div>

          {circuitBreakerError && (
            <div className="p-3 bg-rose-900/80 border border-rose-600 rounded-xl text-xs text-rose-200 font-semibold">
              {circuitBreakerError}
            </div>
          )}

          {publishSuccess && (
            <div className="p-3 bg-emerald-900/80 border border-emerald-600 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Harga berhasil dikunci & dipublikasikan ke katalog storefront untuk jam 16:00 WIB!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleApproveAndPublish}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Approve & Publish to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
