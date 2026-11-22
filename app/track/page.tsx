'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/lib/pricing-engine';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function TrackContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId') || 'ORD-2026-BNDG-001';

  const [orderId, setOrderId] = useState(orderIdParam);
  const { selectedCluster } = useApp();

  const steps = [
    {
      title: 'Pesanan Terkunci & Surat Jalan Dirilis',
      time: '20:00 WIB (Kemarin)',
      desc: 'Pesanan diagregasikan ke Surat Jalan Hulu Gapoktan Lembang.',
      status: 'COMPLETED',
    },
    {
      title: 'Panen Subuh & Kontrol Kualitas (QC)',
      time: '03:30 WIB Subuh',
      desc: 'Sayur dipetik segar dan lolos sortir timbang di Hub Central Bandung.',
      status: 'COMPLETED',
    },
    {
      title: 'Armada Menuju Titik Kumpul Komplek',
      time: '05:30 WIB Pagi',
      desc: `Mobil pick-up berpendingin sedang meluncur ke ${selectedCluster.name}.`,
      status: 'ACTIVE',
    },
    {
      title: 'Serah Terima di Pos / Checkpoint Mitra IRT',
      time: 'Estimasi 06:30 WIB Pagi',
      desc: `Siap diambil di ${selectedCluster.address_notes}.`,
      status: 'UPCOMING',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-3">
        <img
          src="/brand-logo.png"
          alt="Logo Agrojaya"
          className="w-12 h-12 object-contain rounded-full border-2 border-[#4C9BD5] mx-auto p-0.5 shadow-xs"
        />
        <span className="text-xs font-bold text-[#4C9BD5] uppercase tracking-wider">
          Pelacakan Logistik Pangan Subuh
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Lacak Pengantaran Pesanan Komplek
        </h1>
        <p className="text-xs text-slate-500">
          Masukkan nomor pesanan dapur Anda untuk memantau status armada subuh
        </p>

        <div className="relative mt-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full pl-10 pr-24 py-3 rounded-2xl border border-slate-300 font-mono font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24B05A]"
            placeholder="Contoh: ORD-2026-BNDG-001"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <button className="absolute right-2 top-2 px-3 py-1.5 bg-[#24B05A] text-white text-xs font-bold rounded-xl hover:bg-[#1B8A44] transition cursor-pointer">
            Lacak
          </button>
        </div>
      </div>

      {/* Active Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#15803D]" />
              <h2 className="text-base font-bold text-stone-900 font-mono">{orderId}</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Dalam Perjalanan
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Tujuan: <b className="text-stone-800">{selectedCluster.name}</b> • {selectedCluster.address_notes}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-400 block">Jadwal Sampai</span>
            <span className="text-sm font-bold text-[#15803D]">Pagi Ini (06:00 - 07:00 WIB)</span>
          </div>
        </div>

        {/* Visual Progression Timeline */}
        <div className="space-y-6 pt-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 relative">
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                    step.status === 'COMPLETED' ? 'bg-[#15803D]' : 'bg-stone-200'
                  }`}
                />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 ${
                  step.status === 'COMPLETED'
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : step.status === 'ACTIVE'
                    ? 'bg-amber-500 text-white animate-pulse shadow-xs'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {step.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.status === 'ACTIVE' ? (
                  <Truck className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xs font-bold text-stone-900">{step.title}</h3>
                  <span className="text-[11px] font-semibold text-stone-400">{step.time}</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Protection Note */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-stone-700 leading-relaxed">
            <b className="text-stone-900 block mb-0.5">Garansi Kesegaran & Timbangan Jujur</b>
            Jika terdapat sayur layu, telur retak, atau pesanan tidak sesuai, klaim otomatis s/d <b>Rp25.000</b> langsung masuk ke dompet CRM tanpa persetujuan berbelit-belit.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Memuat status pesanan...</div>}>
      <TrackContent />
    </Suspense>
  );
}
