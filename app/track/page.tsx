'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ShoppingBag,
  User,
  Check,
} from 'lucide-react';
import Link from 'next/link';

function TrackContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId') || 'ORD-2026-BNDG-001';

  const [searchInput, setSearchInput] = useState(orderIdParam);
  const [activeOrderId, setActiveOrderId] = useState(orderIdParam);
  const { orders, selectedCluster } = useApp();

  const matchedOrder = orders.find(
    (o) =>
      o.order_number.toLowerCase() === activeOrderId.trim().toLowerCase() ||
      o.id.toLowerCase() === activeOrderId.trim().toLowerCase()
  );

  const clusterName = matchedOrder?.cluster_name || selectedCluster.name;
  const addressNotes = matchedOrder?.customer_address || selectedCluster.address_notes;

  // Determine stage progression from matchedOrder?.delivery_status
  const deliveryStatus = matchedOrder?.delivery_status || 'DISPATCHED_TO_HUB';

  const getStepStatus = (stepIndex: number): 'COMPLETED' | 'ACTIVE' | 'UPCOMING' => {
    if (stepIndex === 0) return 'COMPLETED'; // Pesanan masuk & terkunci

    if (stepIndex === 1) {
      // Panen Subuh & QC
      if (deliveryStatus === 'SCHEDULED') return 'ACTIVE';
      return 'COMPLETED';
    }

    if (stepIndex === 2) {
      // Armada menuju komplek
      if (deliveryStatus === 'SCHEDULED') return 'UPCOMING';
      if (deliveryStatus === 'DISPATCHED_TO_HUB') return 'ACTIVE';
      return 'COMPLETED';
    }

    if (stepIndex === 3) {
      // Tiba di checkpoint
      if (deliveryStatus === 'DELIVERED') return 'COMPLETED';
      if (deliveryStatus === 'READY_AT_CHECKPOINT') return 'ACTIVE';
      return 'UPCOMING';
    }

    return 'UPCOMING';
  };

  const steps = [
    {
      title: 'Pesanan Terkunci & Surat Jalan Hulu Dirilis',
      time: '20:00 WIB (Kemarin)',
      desc: 'Pesanan diagregasikan ke PO Hulu Gapoktan Lembang & Ciwidey.',
      status: getStepStatus(0),
    },
    {
      title: 'Panen Subuh & QC Sortir Timbang',
      time: '03:30 WIB Subuh',
      desc: 'Dipetik dini hari, sortir ozon bebas residu di Central Hub Bandung.',
      status: getStepStatus(1),
    },
    {
      title: 'Armada Dingin Meluncur ke Komplek',
      time: '05:30 WIB Pagi',
      desc: `Pick-up berpendingin sedang meluncur menuju ${clusterName}.`,
      status: getStepStatus(2),
    },
    {
      title: 'Serah Terima di Pos Satpam / Mitra IRT',
      time: 'Estimasi 06:30 - 07:00 WIB',
      desc: `Siap diambil warga di ${addressNotes}.`,
      status: getStepStatus(3),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveOrderId(searchInput.trim());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-full border border-emerald-300">
            ✅ Selesai Diterima
          </span>
        );
      case 'READY_AT_CHECKPOINT':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[11px] font-extrabold rounded-full border border-blue-300">
            📍 Siap Diambil di Pos/Mitra
          </span>
        );
      case 'DISPATCHED_TO_HUB':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-extrabold rounded-full border border-amber-300">
            🚚 Armada Meluncur ke Komplek
          </span>
        );
      case 'SCHEDULED':
      default:
        return (
          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[11px] font-extrabold rounded-full border border-purple-300">
            📦 Panen & Sortir Subuh
          </span>
        );
    }
  };

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
          Pantau status panen dan armada subuh langsung ke titik kumpul komplek Anda
        </p>

        <form onSubmit={handleSearch} className="relative mt-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-24 py-3 rounded-2xl border border-slate-300 font-mono font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24B05A]"
            placeholder="Contoh: ORD-2026-BNDG-001"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1.5 bg-[#24B05A] text-white text-xs font-bold rounded-xl hover:bg-[#1B8A44] transition cursor-pointer"
          >
            Lacak
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-400 font-medium">Contoh No. Order:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setSearchInput(o.order_number);
                setActiveOrderId(o.order_number);
              }}
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              {o.order_number}
            </button>
          ))}
        </div>
      </div>

      {/* Active Order Card */}
      {matchedOrder ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Package className="w-5 h-5 text-[#15803D]" />
                <h2 className="text-base font-bold text-stone-900 font-mono">
                  {matchedOrder.order_number}
                </h2>
                {getStatusBadge(matchedOrder.delivery_status)}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Pemesan: <b className="text-stone-800">{matchedOrder.customer_name}</b> (
                {matchedOrder.customer_phone})
              </p>
              <p className="text-xs text-stone-500">
                Tujuan: <b className="text-stone-800">{matchedOrder.cluster_name}</b> •{' '}
                {matchedOrder.customer_address}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-stone-400 block">Jadwal Sampai</span>
              <span className="text-sm font-bold text-[#15803D]">
                {matchedOrder.delivery_slot || 'Pagi Ini (06:00 - 07:00 WIB)'}
              </span>
              <span className="text-xs font-bold text-slate-800 block mt-0.5">
                Total: {formatRupiah(matchedOrder.total_amount_idr)}
              </span>
            </div>
          </div>

          {/* Itemized preview */}
          {matchedOrder.items && matchedOrder.items.length > 0 && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Daftar Belanjaan Dapur ({matchedOrder.items.length} item):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {matchedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-100"
                  >
                    <span className="font-bold text-stone-800">
                      {item.qty}x {item.product_name}
                      <span className="text-[10px] text-stone-500 font-normal ml-1">
                        ({item.portion_label})
                      </span>
                    </span>
                    <span className="font-mono text-stone-600 font-medium">
                      {formatRupiah(item.unit_price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              Jika terdapat sayur layu, telur retak, atau pesanan tidak sesuai, klaim otomatis s/d{' '}
              <b>Rp25.000</b> langsung masuk ke dompet CRM tanpa persetujuan berbelit-belit.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
          <Package className="w-10 h-10 text-stone-300 mx-auto" />
          <h2 className="text-base font-bold text-stone-800">
            Pesanan &quot;{activeOrderId}&quot; Tidak Ditemukan
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Silakan periksa kembali nomor pesanan pada bukti pembayaran atau pilih dari daftar
            pesanan aktif di atas.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-stone-400">Memuat status pesanan...</div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
