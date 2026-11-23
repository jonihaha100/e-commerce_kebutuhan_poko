'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminHeader } from '@/components/AdminHeader';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  Boxes,
  Truck,
  Scale,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  MessageCircle,
  FileText,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Users,
  ChevronDown,
  Sparkles,
  ThermometerSnowflake,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export interface SupplyItem {
  id: string;
  poNumber: string;
  productName: string;
  sku: string;
  category: 'VEGETABLE_1P' | 'PROTEIN_1P' | 'TUBER_1P' | 'SPICE_3P' | 'STAPLE_3P';
  vendorName: string;
  vendorPhone: string;
  vendorLocation: string;
  is1P: boolean;
  orderedQty: number;
  unit: string;
  unitNetPrice: number;
  totalPayout: number;
  supplyStatus: 'MENUNGGU_PANEN' | 'DALAM_PERJALANAN' | 'TIBA_DI_HUB' | 'LOLOS_QC' | 'DISTRIBUSI_SELESAI';
  qcNote: string;
  temperatureC?: number;
  actualWeightKg?: number;
  paymentStatus: 'UNPAID' | 'PAID';
  harvestTime: string;
}

const INITIAL_SUPPLY_DATA: SupplyItem[] = [
  {
    id: 'sup-001',
    poNumber: 'PO-HL-2026-001',
    productName: 'Pakcoy Hidroponik Lembang',
    sku: 'PKC-01',
    category: 'VEGETABLE_1P',
    vendorName: 'Kang Asep (Gapoktan Lembang)',
    vendorPhone: '081234567892',
    vendorLocation: 'Greenhouse Cibodas, Lembang',
    is1P: true,
    orderedQty: 35,
    unit: 'pack (250gr)',
    unitNetPrice: 5500,
    totalPayout: 192500,
    supplyStatus: 'LOLOS_QC',
    qcNote: 'Lolos sortir ozon, akar bersih, renyah tanpa ulat',
    actualWeightKg: 8.8,
    paymentStatus: 'PAID',
    harvestTime: '03:00 WIB Subuh',
  },
  {
    id: 'sup-002',
    poNumber: 'PO-HL-2026-002',
    productName: 'Daging Ayam Filet Dada Segar',
    sku: 'AYM-FLT-01',
    category: 'PROTEIN_1P',
    vendorName: 'Pak Dadang (Peternakan Unggas Lembang)',
    vendorPhone: '081322334455',
    vendorLocation: 'RPA Sejahtera, Maribaya Lembang',
    is1P: true,
    orderedQty: 20,
    unit: 'pack (500gr)',
    unitNetPrice: 24000,
    totalPayout: 480000,
    supplyStatus: 'TIBA_DI_HUB',
    qcNote: 'Suhu rantai dingin terjaga 3.8°C, kemasan vacuum utuh',
    temperatureC: 3.8,
    actualWeightKg: 10.05,
    paymentStatus: 'UNPAID',
    harvestTime: '03:30 WIB Subuh',
  },
  {
    id: 'sup-003',
    poNumber: 'PO-HL-2026-003',
    productName: 'Telur Ayam Negeri Fresh Subuh',
    sku: 'TLR-AYM-01',
    category: 'PROTEIN_1P',
    vendorName: 'Pak Dadang (Peternakan Unggas Lembang)',
    vendorPhone: '081322334455',
    vendorLocation: 'RPA Sejahtera, Maribaya Lembang',
    is1P: true,
    orderedQty: 15,
    unit: 'kg (16 butir)',
    unitNetPrice: 22000,
    totalPayout: 330000,
    supplyStatus: 'TIBA_DI_HUB',
    qcNote: 'Kerabang bersih, bebas retak (sortir candling lolos)',
    actualWeightKg: 15.1,
    paymentStatus: 'PAID',
    harvestTime: '04:00 WIB Subuh',
  },
  {
    id: 'sup-004',
    poNumber: 'PO-HL-2026-004',
    productName: 'Ubi Cilembu Madu (14 Hari Curing)',
    sku: 'UBI-CLM-01',
    category: 'TUBER_1P',
    vendorName: 'Pak Ujang (Petani Cilembu Sumedang)',
    vendorPhone: '081299887766',
    vendorLocation: 'Kebun Cilembu, Tanjungsari Sumedang',
    is1P: true,
    orderedQty: 25,
    unit: 'kg',
    unitNetPrice: 12000,
    totalPayout: 300000,
    supplyStatus: 'DALAM_PERJALANAN',
    qcNote: 'Peram 14 hari selesai, getah madu keluar sempurna',
    actualWeightKg: 25.0,
    paymentStatus: 'UNPAID',
    harvestTime: 'Kemarin Siang (Curing)',
  },
  {
    id: 'sup-005',
    poNumber: 'PO-HL-2026-005',
    productName: 'Cabai Rawit Merah Domba Super',
    sku: 'CBI-RWT-3P',
    category: 'SPICE_3P',
    vendorName: 'Haji Mahmud (Grosir Caringin 3P)',
    vendorPhone: '081234567893',
    vendorLocation: 'Los Bumbu Blok C, Pasar Induk Caringin',
    is1P: false,
    orderedQty: 12,
    unit: 'kg',
    unitNetPrice: 32500,
    totalPayout: 390000,
    supplyStatus: 'LOLOS_QC',
    qcNote: 'Tangkai hijau segar, kadar air seimbang, bebas busuk',
    actualWeightKg: 12.2,
    paymentStatus: 'PAID',
    harvestTime: '02:00 WIB Dini Hari',
  },
  {
    id: 'sup-006',
    poNumber: 'PO-HL-2026-006',
    productName: 'Bawang Merah Brebes Pilihan',
    sku: 'BWG-MRH-3P',
    category: 'SPICE_3P',
    vendorName: 'Haji Mahmud (Grosir Caringin 3P)',
    vendorPhone: '081234567893',
    vendorLocation: 'Los Bumbu Blok C, Pasar Induk Caringin',
    is1P: false,
    orderedQty: 15,
    unit: 'kg',
    unitNetPrice: 28000,
    totalPayout: 420000,
    supplyStatus: 'TIBA_DI_HUB',
    qcNote: 'Umbi padat, kering kulit merah tua beraroma wangi',
    actualWeightKg: 15.0,
    paymentStatus: 'UNPAID',
    harvestTime: 'Stok Gudang Bersih',
  },
  {
    id: 'sup-007',
    poNumber: 'PO-HL-2026-007',
    productName: 'Beras Pandanwangi Asli Cianjur (5kg)',
    sku: 'BRS-PW-05',
    category: 'STAPLE_3P',
    vendorName: 'Distributor Sembako Dapur Jaya',
    vendorPhone: '081122334455',
    vendorLocation: 'Gudang Soekarno-Hatta Bandung',
    is1P: false,
    orderedQty: 8,
    unit: 'karung (5kg)',
    unitNetPrice: 60000,
    totalPayout: 480000,
    supplyStatus: 'LOLOS_QC',
    qcNote: 'Bulu wangi asli, butir utuh tanpa pemutih sintetis',
    actualWeightKg: 40.0,
    paymentStatus: 'PAID',
    harvestTime: 'Gudang Tersedia',
  },
  {
    id: 'sup-008',
    poNumber: 'PO-HL-2026-008',
    productName: 'Minyak Goreng Sawit Murni (Pouch 2L)',
    sku: 'MYK-GRG-2L',
    category: 'STAPLE_3P',
    vendorName: 'Distributor Sembako Dapur Jaya',
    vendorPhone: '081122334455',
    vendorLocation: 'Gudang Soekarno-Hatta Bandung',
    is1P: false,
    orderedQty: 10,
    unit: 'pouch (2L)',
    unitNetPrice: 28000,
    totalPayout: 280000,
    supplyStatus: 'LOLOS_QC',
    qcNote: 'Karton segel pabrik utuh, masa kedaluwarsa 18 bulan',
    actualWeightKg: 18.0,
    paymentStatus: 'PAID',
    harvestTime: 'Gudang Tersedia',
  },
];

export default function AdminPasokanPage() {
  const { products } = useApp();

  const [supplies, setSupplies] = useState<SupplyItem[]>(INITIAL_SUPPLY_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<'ALL' | '1P' | '3P'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('ALL');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Modals State
  const [selectedQCItem, setSelectedQCItem] = useState<SupplyItem | null>(null);
  const [isAddBufferModalOpen, setIsAddBufferModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  // QC Form State
  const [qcWeightInput, setQcWeightInput] = useState<number>(0);
  const [qcTempInput, setQcTempInput] = useState<number>(4);
  const [qcNotesInput, setQcNotesInput] = useState<string>('');

  // Add Buffer Form State
  const [bufferProduct, setBufferProduct] = useState(products[0]?.name || 'Pakcoy Hidroponik Lembang');
  const [bufferQty, setBufferQty] = useState<number>(5);
  const [bufferVendor, setBufferVendor] = useState('Kang Asep (Gapoktan Lembang)');
  const [bufferPrice, setBufferPrice] = useState<number>(5500);

  // Filter supplies
  const filteredSupplies = supplies.filter((s) => {
    const matchesSearch =
      s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource =
      filterSource === 'ALL' ||
      (filterSource === '1P' && s.is1P) ||
      (filterSource === '3P' && !s.is1P);
    const matchesStatus = filterStatus === 'ALL' || s.supplyStatus === filterStatus;
    const matchesPayment = filterPayment === 'ALL' || s.paymentStatus === filterPayment;

    return matchesSearch && matchesSource && matchesStatus && matchesPayment;
  });

  // Calculate Aggregated Metrics
  const totalPayoutAll = supplies.reduce((sum, s) => sum + s.totalPayout, 0);
  const totalPayoutPaid = supplies
    .filter((s) => s.paymentStatus === 'PAID')
    .reduce((sum, s) => sum + s.totalPayout, 0);
  const totalPayoutUnpaid = totalPayoutAll - totalPayoutPaid;

  const total1PItems = supplies.filter((s) => s.is1P).length;
  const total3PItems = supplies.filter((s) => !s.is1P).length;
  const totalPassedQC = supplies.filter((s) => s.supplyStatus === 'LOLOS_QC').length;

  // Toggle Payout Status
  const handleTogglePayment = (id: string) => {
    setSupplies((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = s.paymentStatus === 'PAID' ? 'UNPAID' : 'PAID';
          return { ...s, paymentStatus: next };
        }
        return s;
      })
    );
    setFeedbackToast(`Status pembayaran PO berhasil diperbarui!`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Open QC Verification Modal
  const handleOpenQC = (item: SupplyItem) => {
    setSelectedQCItem(item);
    setQcWeightInput(item.actualWeightKg || item.orderedQty);
    setQcTempInput(item.temperatureC || 4.0);
    setQcNotesInput(item.qcNote || 'Kondisi fisik segar, bersih, dan sesuai pesanan.');
  };

  // Save QC Verification
  const handleSaveQC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQCItem) return;

    setSupplies((prev) =>
      prev.map((s) => {
        if (s.id === selectedQCItem.id) {
          return {
            ...s,
            actualWeightKg: qcWeightInput,
            temperatureC: selectedQCItem.category === 'PROTEIN_1P' ? qcTempInput : undefined,
            qcNote: qcNotesInput,
            supplyStatus: 'LOLOS_QC',
          };
        }
        return s;
      })
    );

    setSelectedQCItem(null);
    setFeedbackToast(`Komoditas "${selectedQCItem.productName}" diverifikasi LOLOS QC!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Save New Buffer
  const handleSaveBuffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupply: SupplyItem = {
      id: `sup-${Date.now()}`,
      poNumber: `PO-HL-BUF-${Date.now().toString().slice(-4)}`,
      productName: bufferProduct,
      sku: `BUF-${Date.now().toString().slice(-4)}`,
      category: 'VEGETABLE_1P',
      vendorName: bufferVendor,
      vendorPhone: '081234567890',
      vendorLocation: 'Hub Pasokan Bandung',
      is1P: true,
      orderedQty: bufferQty,
      unit: 'pack',
      unitNetPrice: bufferPrice,
      totalPayout: bufferQty * bufferPrice,
      supplyStatus: 'TIBA_DI_HUB',
      qcNote: 'Buffer pengadaan tambahan untuk antisipasi pesanan susulan warga',
      actualWeightKg: bufferQty * 0.25,
      paymentStatus: 'UNPAID',
      harvestTime: '04:00 WIB Subuh',
    };

    setSupplies((prev) => [newSupply, ...prev]);
    setIsAddBufferModalOpen(false);
    setFeedbackToast(`Buffer pasokan "${bufferProduct}" (${bufferQty} unit) berhasil ditambahkan!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Generate WhatsApp Message for Farmer
  const getFarmerWhatsAppLink = (item: SupplyItem) => {
    const cleanPhone = item.vendorPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const msg = `Halo ${item.vendorName}, konfirmasi Surat Jalan Pengadaan Berkah Tani (${item.poNumber}) untuk pasokan subuh besok:\n\n` +
      `📦 Komoditas: ${item.productName}\n` +
      `⚖️ Kuantitas: ${item.orderedQty} ${item.unit}\n` +
      `💰 Harga Modal HPP: ${formatRupiah(item.unitNetPrice)}/${item.unit}\n` +
      `💵 Total Payout: ${formatRupiah(item.totalPayout)}\n` +
      `⏰ Jadwal Petik/Angkut: ${item.harvestTime}\n` +
      `📍 Pengiriman: Pick-up menuju Central Hub Bandung.\n\n` +
      `Mohon konfirmasi kesiapan panen subuh. Terima kasih!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const getStatusBadge = (status: SupplyItem['supplyStatus']) => {
    switch (status) {
      case 'LOLOS_QC':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>✓ Lolos QC Subuh</span>
          </span>
        );
      case 'TIBA_DI_HUB':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
            <Boxes className="w-3 h-3 text-sky-600" />
            <span>Tiba di Hub Central</span>
          </span>
        );
      case 'DALAM_PERJALANAN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Truck className="w-3 h-3 text-amber-600" />
            <span>🚚 Armada Angkut</span>
          </span>
        );
      case 'MENUNGGU_PANEN':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-600" />
            <span>Petik 03.00 Subuh</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-stone-400 hover:text-stone-700 font-bold ml-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider font-mono">
                Rantai Pasok Hulu (Supply Chain)
              </span>
              <span className="text-xs text-stone-400">• Agregasi Koli Panen Subuh 03.00</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 tracking-tight">
              Manajemen Pasokan Bahan & Petani Hulu
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Pantau surat jalan tonase petani, verifikasi kontrol kualitas (QC) subuh, dan pencatatan transfer payout vendor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsManifestModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Manifest Surat Jalan Petani</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddBufferModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-black rounded-xl shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Pasokan / Buffer</span>
            </button>
          </div>
        </div>

        {/* 4 Financial & Supply Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Tagihan Pasokan (HPP)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {formatRupiah(totalPayoutAll)}
              </span>
              <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full font-bold">
                {supplies.length} Komoditas
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Belanja modal dari Gapoktan & Grosir
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payout Terbayar (Lunas)</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700">
                {formatRupiah(totalPayoutPaid)}
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Transfer Sukses
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Sisa transfer: <b>{formatRupiah(totalPayoutUnpaid)}</b>
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Lolos Uji Kontrol Mutu (QC)</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-800">
                {totalPassedQC} / {supplies.length}
              </span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold">
                {Math.round((totalPassedQC / supplies.length) * 100)}% Lolos
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Bebas tanah & ayam suhu 4°C
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block flex items-center gap-1">
              <Boxes className="w-3.5 h-3.5" />
              <span>Komposisi Asal Pasokan</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-800">
                {total1PItems} Petani : {total3PItems} Pasar
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                1P vs 3P
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Kemitraan langsung Gapoktan Lembang & Ciwidey
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komoditas, vendor, atau nomor PO..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#24B05A]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          {/* Group of filter buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto text-xs font-bold">
            {/* Filter Sumber */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterSource('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterSource === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Semua Sumber
              </button>
              <button
                type="button"
                onClick={() => setFilterSource('1P')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterSource === '1P' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                🌱 1P Petani ({total1PItems})
              </button>
              <button
                type="button"
                onClick={() => setFilterSource('3P')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterSource === '3P' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                🏬 3P Grosir ({total3PItems})
              </button>
            </div>

            {/* Filter Pembayaran */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterPayment('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterPayment === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Semua Bayar
              </button>
              <button
                type="button"
                onClick={() => setFilterPayment('PAID')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterPayment === 'PAID' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                ✓ Lunas
              </button>
              <button
                type="button"
                onClick={() => setFilterPayment('UNPAID')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterPayment === 'UNPAID' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                ⏳ Belum Bayar
              </button>
            </div>
          </div>
        </div>

        {/* Inbound Supply Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">No. PO & Komoditas</th>
                  <th className="py-3 px-4">Mitra Pemasok (Vendor)</th>
                  <th className="py-3 px-3 text-center">Kuantitas Order</th>
                  <th className="py-3 px-3 text-right">Harga Modal (HPP)</th>
                  <th className="py-3 px-3 text-right">Total Payout</th>
                  <th className="py-3 px-3 text-center">Status Alur Pasokan</th>
                  <th className="py-3 px-3 text-center">Hasil QC Subuh</th>
                  <th className="py-3 px-3 text-center">Status Bayar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSupplies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-stone-400">
                      Tidak ada pasokan bahan baku yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredSupplies.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition">
                      {/* PO Number & Product */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-sky-700 block">
                          {item.poNumber}
                        </span>
                        <span className="font-black text-stone-900 block text-xs">
                          {item.productName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              item.is1P
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {item.is1P ? '🌱 1P Petani' : '🏬 3P Grosir'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {item.sku}
                          </span>
                        </div>
                      </td>

                      {/* Vendor Name & Location */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-800 block">
                          {item.vendorName}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          📍 {item.vendorLocation}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {item.vendorPhone}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-black text-sm text-stone-900 block">
                          {item.orderedQty}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {item.unit}
                        </span>
                        {item.actualWeightKg && (
                          <span className="inline-block mt-0.5 text-[9px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                            Timbang: {item.actualWeightKg} kg
                          </span>
                        )}
                      </td>

                      {/* Unit Price */}
                      <td className="py-3 px-3 text-right font-mono text-stone-600 font-medium">
                        {formatRupiah(item.unitNetPrice)}
                      </td>

                      {/* Total Payout */}
                      <td className="py-3 px-3 text-right font-mono font-black text-stone-900 text-xs">
                        {formatRupiah(item.totalPayout)}
                      </td>

                      {/* Supply Status */}
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(item.supplyStatus)}
                        <span className="text-[9px] text-stone-400 block mt-0.5">
                          {item.harvestTime}
                        </span>
                      </td>

                      {/* QC Result */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenQC(item)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                          title="Periksa Catatan QC"
                        >
                          <Scale className="w-3 h-3 text-sky-600" />
                          <span>QC</span>
                        </button>
                        {item.temperatureC && (
                          <span className="block text-[9px] text-blue-600 font-mono font-bold mt-0.5">
                            ❄️ {item.temperatureC}°C
                          </span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePayment(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            item.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {item.paymentStatus === 'PAID' ? '✓ Lunas' : '⏳ Belum'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={getFarmerWhatsAppLink(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white transition shadow-2xs"
                            title="Kirim PO WhatsApp ke Petani"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleOpenQC(item)}
                            className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                            title="Update Verifikasi Timbangan QC"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: VERIFIKASI QC TIMBANGAN & SUHU SUBARU */}
      {selectedQCItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-tight">
                    Kontrol Mutu & Timbangan Subuh
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {selectedQCItem.poNumber} • {selectedQCItem.productName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQCItem(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQC} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Kuantitas Pesanan Hulu
                </label>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 font-bold text-stone-800 flex justify-between">
                  <span>Target: {selectedQCItem.orderedQty} {selectedQCItem.unit}</span>
                  <span className="text-stone-500 font-normal">Dari {selectedQCItem.vendorName}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Hasil Timbangan Aktual Tiba di Hub (kg)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={qcWeightInput}
                  onChange={(e) => setQcWeightInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-bold text-stone-900 font-mono"
                  required
                />
              </div>

              {selectedQCItem.category === 'PROTEIN_1P' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600" />
                    <span>Suhu Rantai Dingin Saat Tiba (°C)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={qcTempInput}
                    onChange={(e) => setQcTempInput(parseFloat(e.target.value) || 0)}
                    placeholder="Maksimal 4.0 °C"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-bold text-blue-900 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    *Wajib $\le$ 4°C untuk jaminan kesegaran daging ayam filet.
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Catatan Pengujian Fisik & Sortasi Ozon
                </label>
                <textarea
                  value={qcNotesInput}
                  onChange={(e) => setQcNotesInput(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedQCItem(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verifikasi & Loloskan QC</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH PASOKAN BUFFER EKSTRA */}
      {isAddBufferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">
                  Tambah Pasokan Ekstra / Safety Buffer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBufferModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBuffer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pilih Komoditas</label>
                <select
                  value={bufferProduct}
                  onChange={(e) => setBufferProduct(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-bold text-stone-900 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jumlah Kuantitas</label>
                  <input
                    type="number"
                    value={bufferQty}
                    onChange={(e) => setBufferQty(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-black text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Modal Satuan</label>
                  <input
                    type="number"
                    value={bufferPrice}
                    onChange={(e) => setBufferPrice(parseInt(e.target.value) || 0)}
                    step={500}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-black text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Pemasok / Vendor Ditunjuk</label>
                <select
                  value={bufferVendor}
                  onChange={(e) => setBufferVendor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-medium text-stone-900 bg-white"
                >
                  <option value="Kang Asep (Gapoktan Lembang)">Kang Asep (Gapoktan Lembang)</option>
                  <option value="Pak Dadang (Peternakan Unggas Lembang)">Pak Dadang (Peternakan Unggas Lembang)</option>
                  <option value="Haji Mahmud (Grosir Caringin 3P)">Haji Mahmud (Grosir Caringin 3P)</option>
                  <option value="Pak Ujang (Petani Cilembu Sumedang)">Pak Ujang (Petani Cilembu Sumedang)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddBufferModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-black rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Pasokan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MANIFEST SURAT JALAN PENGADAAN HULU (CETAK PRINT) */}
      {isManifestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <img
                  src="/brand-logo.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain rounded-full border border-sky-400 bg-white p-0.5"
                />
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-tight">
                    Surat Jalan & Manifest Pengadaan Hulu (Gapoktan)
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    Siklus Subuh • Jam 03.00 - 05.00 WIB • Central Hub Bandung
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManifestModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Tujuan Pengantaran:</span>
                  <span className="font-bold text-stone-900">Hub Central Agrojaya Bandung</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Waktu Jemput Armada:</span>
                  <span className="font-bold text-emerald-700">03.30 - 04.30 WIB Dini Hari</span>
                </div>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-600 text-[10px] uppercase font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Komoditas & SKU</th>
                      <th className="py-2.5 px-3">Pemasok / Kebun</th>
                      <th className="py-2.5 px-2 text-center">Kuantitas</th>
                      <th className="py-2.5 px-3 text-right">Harga Modal</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {supplies.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2 px-3 font-bold text-stone-900">
                          {it.productName}
                          <span className="block text-[10px] text-stone-400 font-mono">{it.sku}</span>
                        </td>
                        <td className="py-2 px-3 text-stone-600">
                          {it.vendorName}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-emerald-800">
                          {it.orderedQty} {it.unit}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-stone-600">
                          {formatRupiah(it.unitNetPrice)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">
                          {formatRupiah(it.totalPayout)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50 font-bold border-t border-stone-200 text-xs">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3 text-stone-700 text-sm">
                        Total Payout Pembelian Bahan:
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-800 text-sm">
                        {formatRupiah(totalPayoutAll)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-[10px] text-stone-400">
                Dicetak otomatis dari Sistem Rantai Pasok Berkah Tani
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Surat Jalan (Print)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
