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
  Download,
  Eye,
  MessageCircle,
  TrendingUp,
  Receipt,
  ExternalLink,
} from 'lucide-react';

export default function AdminPesananPage() {
  const { orders, updateOrderStatus, clusters } = useApp();

  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [manifestModalCluster, setManifestModalCluster] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

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

  // Calculate Gross Profit (Laba Kotor Riil)
  const totalHppPaid = orders
    .filter((o) => o.payment_status === 'PAID')
    .reduce((sum, o) => {
      const orderHpp =
        o.items?.reduce((itemSum, item) => {
          return itemSum + Math.round(item.unit_price * 0.72) * item.qty;
        }, 0) || Math.round(o.total_amount_idr * 0.72);
      return sum + orderHpp;
    }, 0);

  const totalGrossProfit = totalGmvPaid - totalHppPaid;
  const grossMarginPct = totalGmvPaid > 0 ? Math.round((totalGrossProfit / totalGmvPaid) * 100) : 0;

  const totalPaidOrders = orders.filter((o) => o.payment_status === 'PAID').length;
  const totalReadyToShip = orders.filter(
    (o) => o.payment_status === 'PAID' && o.delivery_status !== 'DELIVERED'
  ).length;

  const handleDeliveryStatusChange = (orderId: string, newStatus: Order['delivery_status']) => {
    updateOrderStatus(orderId, newStatus);
    setFeedbackToast(`Status pesanan ${orderId} berhasil diubah ke: ${newStatus}`);
    setTimeout(() => setFeedbackToast(null), 3000);

    // Keep selectedOrderDetail updated if open
    if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
      setSelectedOrderDetail((prev) => (prev ? { ...prev, delivery_status: newStatus } : null));
    }
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

  // Export CSV Report
  const handleExportCsv = () => {
    const headers = [
      'No Order',
      'Waktu',
      'Nama Pelanggan',
      'No WhatsApp',
      'Komplek Drop Point',
      'Alamat Pengantaran',
      'Total Tagihan (Rp)',
      'Status Bayar',
      'Status Pengantaran Subuh',
      'Daftar Belanja',
    ];

    const rows = filteredOrders.map((o) => [
      o.order_number,
      `"${o.created_at || 'Hari Ini'}"`,
      `"${o.customer_name}"`,
      o.customer_phone || '-',
      `"${o.cluster_name}"`,
      `"${o.customer_address || '-'}"`,
      o.total_amount_idr,
      o.payment_status,
      o.delivery_status,
      `"${o.items?.map((it) => `${it.product_name} (${it.qty}x)`).join('; ') || '-'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Pesanan_AgroJaya_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatOrderDate = (dateStr?: string) => {
    if (!dateStr) return '22 Nov • 17:30 WIB';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = months[d.getMonth()];
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} • ${hours}:${mins} WIB`;
    } catch {
      return dateStr;
    }
  };

  // Format WhatsApp Number
  const getWhatsAppLink = (
    phone?: string,
    customerName?: string,
    orderNumber?: string,
    cluster?: string
  ) => {
    const cleanPhone = (phone || '081234567894').replace(/[^0-9]/g, '').replace(/^0/, '62');
    const msg = `Halo ${customerName || 'Warga'}, salam dari Tim Berkah Tani Sejahtera. Kami mengonfirmasi pesanan Anda #${orderNumber || ''} siap diantar subuh besok ke drop point ${cluster || 'Komplek'}.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Admin Top Header Navigation */}
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Feedback */}
        {feedbackToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Ekspor Rekap CSV</span>
            </button>

            <button
              onClick={() => setManifestModalCluster('Antapani Indah')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Manifest Surat Jalan Kurir</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards with Gross Margin */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total GMV Terbayar
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700">
                {formatRupiah(totalGmvPaid)}
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Hari Ini
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Laba Kotor Operasional</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-800">
                {formatRupiah(totalGrossProfit)}
              </span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold">
                {grossMarginPct}% Margin
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              🚚 Paket Kirim Besok Subuh
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900">
                {totalReadyToShip} Paket
              </span>
              <span className="text-[10px] text-stone-500 font-medium">06.00-09.00 WIB</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
              🏘️ Drop Point Aktif
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-700">
                {clusters.length} Komplek
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Gratis Ongkir
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

            <div className="text-xs text-stone-500 font-medium text-right sm:text-left self-center">
              Ditemukan <b>{filteredOrders.length}</b> pesanan
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-stone-100">
            {/* Cluster filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                Komplek:
              </span>
              <button
                onClick={() => setSelectedClusterFilter('ALL')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedClusterFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua Komplek
              </button>
              {clusters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClusterFilter(c.name)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedClusterFilter === c.name
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <span className="text-stone-300 hidden sm:inline">|</span>

            {/* Payment filters */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                Status Bayar:
              </span>
              <button
                onClick={() => setSelectedStatusFilter('ALL')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedStatusFilter === 'ALL'
                    ? 'bg-[#24B05A] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua Status
              </button>
              <button
                onClick={() => setSelectedStatusFilter('PAID')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedStatusFilter === 'PAID'
                    ? 'bg-[#24B05A] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ✓ Lunas
              </button>
              <button
                onClick={() => setSelectedStatusFilter('PENDING')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedStatusFilter === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ⏳ Menunggu Bayar
              </button>
            </div>
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
                  <th className="py-3 px-4 text-left">Alur Pengantaran Subuh</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-stone-400">
                      Tidak ada pesanan warga yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-stone-50/80 transition cursor-pointer group"
                      onClick={() => setSelectedOrderDetail(o)}
                    >
                      {/* Order Number & Time */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block group-hover:text-sky-600 transition">
                          {o.order_number}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          {formatOrderDate(o.created_at)}
                        </span>
                        <span className="inline-block mt-0.5 text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                          Slot: {o.delivery_slot || '06:00 - 09:00 Pagi'}
                        </span>
                      </td>

                      {/* Customer & Cluster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{o.customer_name}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 block font-mono">
                          {o.customer_phone}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{o.cluster_name}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                              <span className="text-stone-800 font-medium">
                                <b className="text-emerald-700">{item.qty}x</b> {item.product_name}
                                <span className="text-stone-400 text-[10px] ml-1">({item.portion_label})</span>
                              </span>
                              <span className="text-stone-500 font-mono text-[10px]">
                                {formatRupiah(item.unit_price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-stone-900 block text-sm">
                          {formatRupiah(o.total_amount_idr)}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Bebas Ongkir + Cashb.
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            o.payment_status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {o.payment_status === 'PAID' ? '✓ LUNAS (QRIS)' : '⏳ MENUNGGU'}
                        </span>
                      </td>

                      {/* Delivery Status Stepper */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.delivery_status}
                          onChange={(e) =>
                            handleDeliveryStatusChange(o.id, e.target.value as Order['delivery_status'])
                          }
                          className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-[11px] font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#24B05A] bg-white cursor-pointer"
                        >
                          <option value="SCHEDULED">1. Terjadwal (Kunci 19.45)</option>
                          <option value="DISPATCHED_TO_HUB">2. Sortir Central Hub (03.00)</option>
                          <option value="READY_AT_CHECKPOINT">3. Tiba di Drop Point Pos Satpam (06.30)</option>
                          <option value="DELIVERED">4. Selesai Diambil Warga</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetail(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-sky-50 text-stone-700 hover:text-sky-700 font-bold text-[11px] transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL DETAIL PESANAN & SLIP KURIR / WHATSAPP */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-stone-900 leading-tight">
                      Detail Pesanan #{selectedOrderDetail.order_number}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedOrderDetail.payment_status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedOrderDetail.payment_status === 'PAID' ? '✓ LUNAS' : '⏳ MENUNGGU BAYAR'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Transaksi: {formatOrderDate(selectedOrderDetail.created_at)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/80">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase block">
                    Penerima / Warga Komplek
                  </span>
                  <span className="text-sm font-black text-stone-900">
                    {selectedOrderDetail.customer_name}
                  </span>
                  <span className="text-xs text-stone-600 font-mono block">
                    {selectedOrderDetail.customer_phone || '081234567894'}
                  </span>
                </div>

                <a
                  href={getWhatsAppLink(
                    selectedOrderDetail.customer_phone || '081234567894',
                    selectedOrderDetail.customer_name,
                    selectedOrderDetail.order_number,
                    selectedOrderDetail.cluster_name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase block">
                  Titik Drop Point & Catatan Pengantaran
                </span>
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{selectedOrderDetail.cluster_name} (Pos Satpam Gerbang)</span>
                </p>
                <p className="text-xs text-stone-600 mt-1 font-normal bg-white p-2 rounded-lg border border-stone-200">
                  📍 {selectedOrderDetail.customer_address || 'Jl. Terusan Jakarta Blok C No. 42 (Titip boks pendingin di meja satpam)'}
                </p>
              </div>
            </div>

            {/* Rincian Komoditas Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Rincian Muatan Belanja
              </span>
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100/80 text-stone-600 text-[10px] font-bold uppercase border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Komoditas & Porsi</th>
                      <th className="py-2.5 px-2 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedOrderDetail.items?.map((it, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-3 font-medium text-stone-900">
                          {it.product_name}
                          <span className="text-stone-400 text-[10px] ml-1">({it.portion_label})</span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-emerald-700">
                          {it.qty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                          {formatRupiah(it.unit_price)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                          {formatRupiah(it.unit_price * it.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50 font-bold border-t border-stone-200 text-xs">
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-stone-600">
                        Ongkos Kirim Klaster Hyperlocal:
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">
                        GRATIS (Rp 0)
                      </td>
                    </tr>
                    <tr className="border-t border-stone-200 text-stone-900">
                      <td colSpan={3} className="py-2.5 px-3 text-sm font-black">
                        Total Tagihan Warga:
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm font-black font-mono text-emerald-700">
                        {formatRupiah(selectedOrderDetail.total_amount_idr)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Stepper Status Update */}
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
              <span className="text-xs font-bold text-sky-900 block">
                Perbarui Alur Distribusi Subuh:
              </span>
              <select
                value={selectedOrderDetail.delivery_status}
                onChange={(e) =>
                  handleDeliveryStatusChange(
                    selectedOrderDetail.id,
                    e.target.value as Order['delivery_status']
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-sky-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="SCHEDULED">1. Terjadwal (Kunci 19.45)</option>
                <option value="DISPATCHED_TO_HUB">2. Sortir Central Hub (03.00)</option>
                <option value="READY_AT_CHECKPOINT">3. Tiba di Drop Point Pos Satpam (06.30)</option>
                <option value="DELIVERED">4. Selesai Diambil Warga</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                <span>Cetak Slip Kurir</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MANIFEST MUATAN KURIR SUBUH */}
      {manifestModalCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-tight">
                    Manifest Muatan Kurir Subuh
                  </h3>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Rekap koli serentak gerbang komplek
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setManifestModalCluster(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                <div className="flex items-center gap-2 text-stone-700 font-bold">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Titik Bongkar:</span>
                </div>
                <select
                  value={manifestClusterName}
                  onChange={(e) => setManifestModalCluster(e.target.value)}
                  className="px-3 py-1 rounded-xl border border-stone-300 font-bold text-xs bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#24B05A]"
                >
                  {clusters.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.address_notes || 'Pos Satpam'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
                  <span>Komoditas yang Harus Diturunkan</span>
                  <span>Total Koli / Pack</span>
                </div>

                <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
                  {Object.keys(aggregatedManifest).length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-400">
                      Tidak ada pesanan terbayar untuk klaster ini.
                    </div>
                  ) : (
                    Object.entries(aggregatedManifest).map(([key, item]) => (
                      <div key={key} className="p-3 flex items-center justify-between text-xs hover:bg-stone-50">
                        <div>
                          <span className="font-bold text-stone-900 block">{item.name}</span>
                          <span className="text-[11px] font-mono text-stone-500">{item.portion}</span>
                        </div>
                        <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {item.totalQty} pack
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-950 block">Instruksi Armada Subuh:</span>
                <p className="text-[11px] text-emerald-900 leading-relaxed font-normal">
                  Tiba serentak pukul <b>06.30 WIB</b>. Letakkan boks pendingin di meja pos satpam/mitra IRT. Pastikan temperatur daging tetap 4°C berembun sebelum diambil warga.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-stone-500" />
                  <span>Cetak Surat Jalan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setManifestModalCluster(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
