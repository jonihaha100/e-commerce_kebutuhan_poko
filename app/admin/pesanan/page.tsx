'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminHeader } from '@/components/AdminHeader';
import { Order } from '@/lib/mock-data';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Printer,
  ChevronDown,
  User,
  Phone,
  Calendar,
  AlertCircle,
  FileText,
  X,
  PackageCheck,
} from 'lucide-react';

export default function AdminPesananPage() {
  const { orders, updateOrderStatus, clusters } = useApp();

  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [manifestModalCluster, setManifestModalCluster] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesCluster =
      selectedClusterFilter === 'ALL' || o.cluster_name === selectedClusterFilter;
    const matchesStatus =
      selectedStatusFilter === 'ALL' || o.payment_status === selectedStatusFilter;
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customer_address && o.customer_address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCluster && matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalGmvPaid = orders
    .filter((o) => o.payment_status === 'PAID')
    .reduce((sum, o) => sum + o.total_amount_idr, 0);
  const totalPaidOrders = orders.filter((o) => o.payment_status === 'PAID').length;
  const totalReadyToShip = orders.filter(
    (o) => o.payment_status === 'PAID' && o.delivery_status !== 'DELIVERED'
  ).length;

  const handleDeliveryStatusChange = (orderId: string, newStatus: Order['delivery_status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  // Group items for manifest per cluster
  const manifestClusterName = manifestModalCluster || 'Antapani Indah';
  const clusterOrders = orders.filter((o) => o.cluster_name === manifestClusterName && o.payment_status === 'PAID');
  
  // Aggregate items
  const aggregatedManifest: Record<string, { name: string; portion: string; totalQty: number }> = {};
  clusterOrders.forEach((o) => {
    o.items?.forEach((item) => {
      const key = `${item.product_name}-${item.portion_label}`;
      if (!aggregatedManifest[key]) {
        aggregatedManifest[key] = {
          name: item.product_name,
          portion: item.portion_label,
          totalQty: 0,
        };
      }
      aggregatedManifest[key].totalQty += item.qty;
    });
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Admin Top Header Navigation */}
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full uppercase">
                Monitor Transaksi Warga
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-xs text-stone-500 font-medium">
                Penyaluran pesanan ke pos satpam & mitra IRT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 tracking-tight">
              Monitor Pesanan Warga & Rekap Subuh
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setManifestModalCluster('Antapani Indah')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Manifest Surat Jalan Kurir</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total GMV Terbayar
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-emerald-700">
                {formatRupiah(totalGmvPaid)}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Hari Ini
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Pesanan Masuk
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900">{orders.length} Transaksi</span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold">
                {totalPaidOrders} Lunas
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              🚚 Paket Kirim Besok Subuh
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-800">{totalReadyToShip} Paket</span>
              <span className="text-[10px] text-emerald-600 font-medium">06.00-09.00 WIB</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              🏘️ Drop Point Aktif
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-800">
                {clusters.filter((c) => c.status === 'ACTIVE').length} Komplek
              </span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                Gratis Ongkir
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan No. Pesanan, nama pembeli (Ibu Ani), atau blok komplek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#24B05A]"
              />
            </div>

            {/* Quick summary text */}
            <div className="text-xs text-stone-500 font-medium text-right sm:text-left self-center">
              Ditemukan <b>{filteredOrders.length}</b> pesanan
            </div>
          </div>

          {/* Filter Row: Komplek & Status Bayar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
              Komplek:
            </span>
            {['ALL', 'Antapani Indah', 'Arcamanik Endah', 'Buah Batu Regency'].map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedClusterFilter(comp)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedClusterFilter === comp
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {comp === 'ALL' ? 'Semua Komplek' : comp}
              </button>
            ))}

            <span className="text-stone-300 mx-2 hidden sm:inline">|</span>

            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
              Status Bayar:
            </span>
            {['ALL', 'PAID', 'PENDING'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedStatusFilter === st
                    ? 'bg-[#24B05A] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st === 'ALL' ? 'Semua Status' : st === 'PAID' ? '✓ Lunas' : '⏳ Menunggu Bayar'}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">No. Order & Waktu</th>
                  <th className="py-3 px-4">Pemesan & Drop Point</th>
                  <th className="py-3 px-4">Komoditas & Porsi Belanja</th>
                  <th className="py-3 px-4 text-right">Total Tagihan</th>
                  <th className="py-3 px-4 text-center">Status Bayar</th>
                  <th className="py-3 px-4 text-center">Alur Pengantaran Subuh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-stone-400">
                      Tidak ada pesanan yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80 transition">
                      {/* No Order & Waktu */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-extrabold text-stone-900 block">
                          {ord.order_number}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                          {ord.created_at.slice(11, 16)} WIB • 22 Nov
                        </span>
                        <span className="inline-block mt-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Slot: 06-09 Pagi
                        </span>
                      </td>

                      {/* Pemesan & Drop Point */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-start gap-2">
                          <User className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-stone-900 block">
                              {ord.customer_name || 'Ibu Warga'}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium block">
                              {ord.customer_phone || '0812-xxxx-xxxx'}
                            </span>
                            <span className="text-[10px] text-[#1B8A44] font-bold bg-[#EBF7EE] px-1.5 py-0.5 rounded mt-1 inline-flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {ord.cluster_name || 'Antapani Indah'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rincian Belanjaan */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between gap-3 text-[11px] text-stone-700"
                              >
                                <span>
                                  <b className="text-stone-900">{it.qty}x</b> {it.product_name}
                                  <span className="text-stone-400 text-[10px] ml-1">
                                    ({it.portion_label})
                                  </span>
                                </span>
                                <span className="font-mono text-stone-500 text-[10px]">
                                  {formatRupiah(it.unit_price * it.qty)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">
                              Paket Sayur Masak Subuh
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Tagihan */}
                      <td className="py-3.5 px-4 align-top text-right font-mono">
                        <span className="font-black text-stone-900 text-sm block">
                          {formatRupiah(ord.total_amount_idr)}
                        </span>
                        {ord.is_group_buy_qualified ? (
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            Bebas Ongkir + Cashb.
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 block">Reguler Komplek</span>
                        )}
                      </td>

                      {/* Status Bayar */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.payment_status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          }`}
                        >
                          {ord.payment_status === 'PAID' ? '✓ LUNAS (QRIS)' : '⏳ MENUNGGU'}
                        </span>
                      </td>

                      {/* Alur Pengantaran (Interactive Status Selector) */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <select
                          value={ord.delivery_status}
                          onChange={(e) =>
                            handleDeliveryStatusChange(
                              ord.id,
                              e.target.value as Order['delivery_status']
                            )
                          }
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none transition cursor-pointer ${
                            ord.delivery_status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : ord.delivery_status === 'READY_AT_CHECKPOINT'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : ord.delivery_status === 'DISPATCHED_TO_HUB'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          <option value="SCHEDULED">1. Terjadwal (Kunci 19.45)</option>
                          <option value="DISPATCHED_TO_HUB">2. Sortir Hub Ciwidey (03.00)</option>
                          <option value="READY_AT_CHECKPOINT">3. Tiba di Pos Satpam (06.30)</option>
                          <option value="DELIVERED">4. Selesai Diterima Warga</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL MANIFEST SURAT JALAN LOGISTIK KURIR */}
      {manifestModalCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 leading-tight">
                    Manifest Muatan Kurir Subuh
                  </h3>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Rekap koli serentak gerbang komplek
                  </span>
                </div>
              </div>

              <button
                onClick={() => setManifestModalCluster(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drop Point Selector */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Titik Bongkar:
              </span>
              <select
                value={manifestClusterName}
                onChange={(e) => setManifestModalCluster(e.target.value)}
                className="bg-white border border-stone-200 font-bold text-stone-900 px-3 py-1.5 rounded-xl"
              >
                <option value="Antapani Indah">Antapani Indah (Pos Satpam Blok C)</option>
                <option value="Arcamanik Endah">Arcamanik Endah (Rumah Bu RT 04)</option>
                <option value="Buah Batu Regency">Buah Batu Regency (Gerbang Utama)</option>
              </select>
            </div>

            {/* Aggregated Items Summary Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Komoditas yang Harus Diturunkan</th>
                    <th className="py-2.5 px-3">Takaran Porsi</th>
                    <th className="py-2.5 px-3 text-right">Total Koli / Pack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {Object.keys(aggregatedManifest).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-xs text-stone-400">
                        Belum ada pesanan lunas untuk komplek ini.
                      </td>
                    </tr>
                  ) : (
                    Object.values(aggregatedManifest).map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-bold text-stone-900">{item.name}</td>
                        <td className="py-2.5 px-3 text-stone-500 font-mono">{item.portion}</td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-700 font-mono">
                          {item.totalQty} pack
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Courier instructions */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-950 space-y-1">
              <span className="font-bold block">Instruksi Armada Subuh:</span>
              <p className="leading-relaxed">
                Tiba serentak pukul <b>06.30 WIB</b>. Letakkan boks pendingin di meja pos satpam/mitra IRT. Pastikan temperatur daging tetap 4°C berembun sebelum diambil warga.
              </p>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setManifestModalCluster(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition"
              >
                Tutup Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
