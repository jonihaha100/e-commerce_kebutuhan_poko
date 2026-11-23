'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminHeader } from '@/components/AdminHeader';
import { Cluster } from '@/lib/mock-data';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Share2,
  Copy,
  Users,
  Truck,
  ShieldCheck,
  AlertCircle,
  Home,
  Tag,
  Check,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminKomplekPage() {
  const {
    clusters,
    addCluster,
    updateCluster,
    deleteCluster,
    activateWaitlistCluster,
    selectedCluster,
    setSelectedCluster,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);

  // Form State: Add Cluster
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formMode, setFormMode] = useState<Cluster['delivery_mode']>('MOBILE_DROP_POINT');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<Cluster['status']>('ACTIVE');
  const [formTarget, setFormTarget] = useState<number>(5);

  // Form State: Edit Cluster
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editMode, setEditMode] = useState<Cluster['delivery_mode']>('MOBILE_DROP_POINT');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState<Cluster['status']>('ACTIVE');
  const [editTarget, setEditTarget] = useState<number>(5);

  // Active Promo View Tab
  const [activeTab, setActiveTab] = useState<'KOMPLEK' | 'PROMO'>('KOMPLEK');

  // Auto-generate slug when name changes in Add modal
  const handleNameChange = (val: string) => {
    setFormName(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormSlug(slug);
  };

  // Filtered clusters
  const filteredClusters = clusters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.qr_slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Metrics
  const totalActiveClusters = clusters.filter((c) => c.status === 'ACTIVE').length;
  const totalGatePoints = clusters.filter(
    (c) => c.status === 'ACTIVE' && c.delivery_mode === 'MOBILE_DROP_POINT'
  ).length;
  const totalIrtPoints = clusters.filter(
    (c) => c.status === 'ACTIVE' && c.delivery_mode === 'MITRA_IRT_CHECKPOINT'
  ).length;
  const totalWaitlist = clusters.filter((c) => c.status === 'WAITLIST').length;

  const handleCopyLink = (slug: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleSaveNewCluster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      setFeedbackToast('⚠️ Mohon isi nama komplek dan catatan titik drop point!');
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }

    addCluster({
      name: formName,
      qr_slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-'),
      status: formStatus,
      delivery_mode: formMode,
      waitlist_count: formStatus === 'ACTIVE' ? 0 : 1,
      waitlist_target: formTarget || 5,
      address_notes: formAddress,
    });

    setIsAddModalOpen(false);
    setFormName('');
    setFormSlug('');
    setFormAddress('');
    setFeedbackToast(`Rute "${formName}" berhasil ditambahkan ke sistem operasional!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleOpenEdit = (c: Cluster) => {
    setEditingCluster(c);
    setEditName(c.name);
    setEditSlug(c.qr_slug);
    setEditMode(c.delivery_mode);
    setEditAddress(c.address_notes);
    setEditStatus(c.status);
    setEditTarget(c.waitlist_target || 5);
  };

  const handleSaveEditCluster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCluster) return;

    updateCluster(editingCluster.id, {
      name: editName,
      qr_slug: editSlug,
      delivery_mode: editMode,
      address_notes: editAddress,
      status: editStatus,
      waitlist_target: editTarget,
    });

    setEditingCluster(null);
    setFeedbackToast(`Informasi titik drop point "${editName}" berhasil diperbarui!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleActivateWaitlist = (c: Cluster) => {
    activateWaitlistCluster(c.id);
    setFeedbackToast(
      `🎉 Rute "${c.name}" resmi DIAKTIFKAN! Warga komplek kini bisa langsung belanja bebas ongkir.`
    );
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleDelete = (c: Cluster) => {
    if (confirm(`Yakin ingin menghapus rute komplek "${c.name}"?`)) {
      deleteCluster(c.id);
      setFeedbackToast(`Rute "${c.name}" telah dihapus.`);
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Admin Navigation */}
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

        {/* Header Title & Primary Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 uppercase tracking-wider font-mono">
                Logistik Hyperlocal Subuh
              </span>
              <span className="text-xs text-stone-400">• Bebas Ongkir Terkoordinasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 tracking-tight">
              Kelola Komplek Perumahan & Titik Drop Point
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Atur pos satpam, koordinator Mitra IRT, aktivasi rute baru, dan kelola promo informasi belanja warga.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-black rounded-xl shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Komplek Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Komplek Aktif Terlayani</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-800">
                {totalActiveClusters} Komplek
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Rute Subuh
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Pos Satpam / Gerbang</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-800">
                {totalGatePoints} Titik
              </span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold">
                Drop Point Boks
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Titik Mitra IRT (Bu RT)</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-800">
                {totalIrtPoints} Checkpoint
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                Komisi Aktif
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Waitlist Permintaan Rute</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-800">
                {totalWaitlist} Komplek
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                Min. 5 Warga
              </span>
            </div>
          </div>
        </div>

        {/* Section Tabs: Komplek vs Promo Manager */}
        <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('KOMPLEK')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'KOMPLEK'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Daftar Komplek & Drop Point ({clusters.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PROMO')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'PROMO'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Slide Promo & Voucher Belanja (Tokopedia)</span>
          </button>
        </div>

        {/* TAB 1: KELOLA KOMPLEK & DROP POINT */}
        {activeTab === 'KOMPLEK' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari komplek, alamat pos, atau slug..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#24B05A]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                  Status:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Semua ({clusters.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatusFilter('ACTIVE')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'ACTIVE'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  ✓ Aktif ({totalActiveClusters})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatusFilter('WAITLIST')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'WAITLIST'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  ⏳ Waitlist ({totalWaitlist})
                </button>
              </div>
            </div>

            {/* Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClusters.map((cluster) => {
                const isActive = cluster.status === 'ACTIVE';
                const isWaitlist = cluster.status === 'WAITLIST';
                const isGateDrop = cluster.delivery_mode === 'MOBILE_DROP_POINT';
                const isIrt = cluster.delivery_mode === 'MITRA_IRT_CHECKPOINT';

                return (
                  <div
                    key={cluster.id}
                    className={`bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                      isActive ? 'border-stone-200' : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isActive ? '✓ Rute Aktif' : '⏳ Waitlist Warga'}
                        </span>

                        <span className="text-[10px] font-bold text-stone-400 font-mono">
                          /c/{cluster.qr_slug}
                        </span>
                      </div>

                      {/* Cluster Name & Mode */}
                      <div>
                        <h3 className="text-base font-black text-stone-900 leading-tight">
                          {cluster.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isGateDrop
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : isIrt
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {isGateDrop && '🚚 Pos Satpam Gerbang'}
                            {isIrt && '🏡 Mitra IRT (Rumah Bu RT)'}
                            {!isGateDrop && !isIrt && '⏳ Menunggu Kuota Warga'}
                          </span>
                        </div>
                      </div>

                      {/* Drop point notes */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                          Titik Kumpul / Catatan Pengantaran:
                        </span>
                        <p className="font-semibold text-stone-800 leading-relaxed">
                          📍 {cluster.address_notes}
                        </p>
                      </div>

                      {/* Waitlist Progress Bar (if applicable) */}
                      {isWaitlist && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                            <span>Peminat Terkumpul:</span>
                            <span>
                              {cluster.waitlist_count} / {cluster.waitlist_target || 5} Warga
                            </span>
                          </div>
                          <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-amber-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((cluster.waitlist_count || 1) / (cluster.waitlist_target || 5)) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-amber-700 font-medium">
                            Butuh {(cluster.waitlist_target || 5) - (cluster.waitlist_count || 0)}{' '}
                            warga lagi untuk otomatis membuka rute armada.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      {isWaitlist && (
                        <button
                          type="button"
                          onClick={() => handleActivateWaitlist(cluster)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aktivasi Rute Sekarang</span>
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(cluster.qr_slug)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg border text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            copiedSlug === cluster.qr_slug
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                          }`}
                        >
                          {copiedSlug === cluster.qr_slug ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/c/${cluster.qr_slug}`}
                          target="_blank"
                          className="py-1.5 px-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cluster)}
                          className="p-1.5 rounded-lg text-sky-700 hover:bg-sky-50 transition cursor-pointer"
                          title="Edit Titik Drop Point"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(cluster)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Rute"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PROMO & VOUCHER INFORMATION MANAGER */}
        {activeTab === 'PROMO' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-black text-stone-900">
                    Slide Banner Promosi Toko Warga (Tokopedia Style)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Banner promosi aktif yang tampil di bagian atas etalase utama (/):
                  </p>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                >
                  <span>Lihat di Toko Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 Slides Preview Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                    Slide 1: Ungu Tokopedia
                  </span>
                  <h3 className="text-base font-black leading-tight">
                    Malas Belanja Becek ke Pasar?
                  </h3>
                  <p className="text-xs text-white/90">
                    Sayur hidroponik & ayam potong segar petik subuh 03.00, jaminan pasti bersih & higienis!
                  </p>
                  <span className="text-[11px] font-bold bg-white text-slate-900 px-3 py-1 rounded-lg inline-block">
                    CTA: Cek Sekarang (#katalog)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-800 text-white space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                    Slide 2: Hijau Emerald
                  </span>
                  <h3 className="text-base font-black leading-tight">
                    Belanja Bareng Tetangga, Hemat s/d 15%!
                  </h3>
                  <p className="text-xs text-white/90">
                    Ajak 10 warga perumahan, pesanan diantar serentak ke pos satpam gerbang tanpa ongkir.
                  </p>
                  <span className="text-[11px] font-bold bg-white text-slate-900 px-3 py-1 rounded-lg inline-block">
                    CTA: Gabung Rute Komplek (/pilih-komplek)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-800 text-white space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                    Slide 3: Emas Panen
                  </span>
                  <h3 className="text-base font-black leading-tight">
                    Takaran Pas 250gr, 500gr & 1kg
                  </h3>
                  <p className="text-xs text-white/90">
                    Beli cabai, bawang & ubi madu secukupnya. Kulkas tetap rapi tanpa sisa sayur layu terbuang.
                  </p>
                  <span className="text-[11px] font-bold bg-white text-slate-900 px-3 py-1 rounded-lg inline-block">
                    CTA: Pilih Takaran Porsi (#katalog)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-800 text-white space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                    Slide 4: Biru Langit
                  </span>
                  <h3 className="text-base font-black leading-tight">
                    Garansi Segar Sampai Pintu Dapur
                  </h3>
                  <p className="text-xs text-white/90">
                    Sayur layu atau telur retak? Klaim kompensasi otomatis langsung masuk ke dompet belanja Anda.
                  </p>
                  <span className="text-[11px] font-bold bg-white text-slate-900 px-3 py-1 rounded-lg inline-block">
                    CTA: Lihat Bukti Sortir QC (/track)
                  </span>
                </div>
              </div>
            </div>

            {/* Voucher Codes List */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="text-base font-black text-stone-900">
                Kode Voucher Aktif yang Tersedia untuk Warga
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-purple-700 block">
                      KOMPLEKHEMAT10
                    </span>
                    <span className="text-stone-600">Cashback 10% Group-Buy Perumahan</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    Aktif
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-purple-700 block">
                      ONGKIRNOLRUPIAH
                    </span>
                    <span className="text-stone-600">Gratis Ongkir Gerbang Komplek</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    Aktif
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-purple-700 block">
                      GARANSI25K
                    </span>
                    <span className="text-stone-600">Kompensasi Retur Instan Rp25.000</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    Aktif
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-purple-700 block">
                      PORSIHEMAT3P
                    </span>
                    <span className="text-stone-600">Paket Bundling Sembako Dapur</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: TAMBAH KOMPLEK BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">
                  Tambah Komplek Perumahan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCluster} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Perumahan / Komplek</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Griya Bandung Asri 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Slug URL (/c/[slug])</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="griya-bandung-asri-3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-mono text-stone-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mode Pengantaran</label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as Cluster['delivery_mode'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-medium text-stone-900 bg-white"
                  >
                    <option value="MOBILE_DROP_POINT">Pos Satpam Gerbang</option>
                    <option value="MITRA_IRT_CHECKPOINT">Rumah Mitra IRT (Bu RT)</option>
                    <option value="WAITLIST">Waitlist (Menunggu Kuota)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status Awal</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Cluster['status'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-medium text-stone-900 bg-white"
                  >
                    <option value="ACTIVE">✓ Aktif (Bisa Belanja)</option>
                    <option value="WAITLIST">⏳ Waitlist (Kumpulkan Warga)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Catatan Titik Drop Point (Pos Satpam / Rumah Bu RT)
                </label>
                <textarea
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Contoh: Pos Satpam Gerbang Utama Jl. Terusan Bojongsoang (Titip meja satpam boks pendingin)"
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-black rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Rute Komplek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT KOMPLEK */}
      {editingCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">
                  Edit Titik Drop Point: {editingCluster.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCluster(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCluster} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Komplek</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-bold text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mode Pengantaran</label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value as Cluster['delivery_mode'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-medium text-stone-900 bg-white"
                  >
                    <option value="MOBILE_DROP_POINT">Pos Satpam Gerbang</option>
                    <option value="MITRA_IRT_CHECKPOINT">Rumah Mitra IRT (Bu RT)</option>
                    <option value="WAITLIST">Waitlist (Menunggu Kuota)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status Rute</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Cluster['status'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-medium text-stone-900 bg-white"
                  >
                    <option value="ACTIVE">✓ Aktif (Bisa Belanja)</option>
                    <option value="WAITLIST">⏳ Waitlist (Kumpulkan Warga)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Catatan Titik Drop Point (Pos Satpam / Rumah Bu RT)
                </label>
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingCluster(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-xs transition cursor-pointer"
                >
                  Perbarui Rute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
