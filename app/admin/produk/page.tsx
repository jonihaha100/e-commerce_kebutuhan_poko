'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminHeader } from '@/components/AdminHeader';
import { Product } from '@/lib/mock-data';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  Package,
  Plus,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Tag,
  Trash2,
  Edit3,
  Layers,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Save,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminProdukPage() {
  const { products, addProduct, updateProduct, deleteProduct, catalogPrices, updateCatalogPrice } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form State for Adding Product
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category_type']>('VEGETABLE_1P');
  const [formUnit, setFormUnit] = useState('pack (250gr)');
  const [formModalPrice, setFormModalPrice] = useState<number>(3500);
  const [formSellPrice, setFormSellPrice] = useState<number>(5000);

  // Form State for Editing Product
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<Product['category_type']>('VEGETABLE_1P');
  const [editUnit, setEditUnit] = useState('pack (250gr)');
  const [editModalPrice, setEditModalPrice] = useState<number>(3500);
  const [editSellPrice, setEditSellPrice] = useState<number>(5000);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category_type === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Category options
  const categoryOptions = [
    { id: 'ALL', label: 'Semua Komoditas' },
    { id: 'VEGETABLE_1P', label: '🥬 Sayur Daun 1P (Ciwidey)' },
    { id: 'TUBER_CURED_1P', label: '🍠 Umbi Cilembu 1P (Sumedang)' },
    { id: 'PROTEIN_1P', label: '🍗 Ayam & Telur 1P (Lembang)' },
    { id: 'SPICE_3P', label: '🌶️ Bumbu & Cabai 3P (Caringin)' },
    { id: 'STAPLE_3P', label: '🌾 Sembako Pokok 3P' },
  ];

  // Auto-generate SKU when name changes in Add Form
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!formSku || formSku.startsWith('PROD-')) {
      const generated = val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 4);
      setFormSku(generated ? `${generated}-01` : '');
    }
  };

  // Calculate live margin for Add form
  const calculatedMarginPct =
    formSellPrice > 0 ? Math.round(((formSellPrice - formModalPrice) / formSellPrice) * 100) : 0;

  // Calculate live margin for Edit form
  const calculatedEditMarginPct =
    editSellPrice > 0 ? Math.round(((editSellPrice - editModalPrice) / editSellPrice) * 100) : 0;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) {
      alert('Mohon isi nama komoditas dan kode SKU!');
      return;
    }

    const is1p =
      formCategory === 'VEGETABLE_1P' ||
      formCategory === 'TUBER_CURED_1P' ||
      formCategory === 'PROTEIN_1P';

    addProduct(
      {
        sku: formSku.toUpperCase(),
        name: formName,
        description: formDesc || `Komoditas segar pasokan harian terverifikasi kualitasnya.`,
        unit: formUnit,
        category_type: formCategory,
        min_curing_days: formCategory === 'TUBER_CURED_1P' ? 14 : 0,
        is_1p: is1p,
        is_active: true,
      },
      formSellPrice,
      formModalPrice
    );

    // Reset & feedback
    setIsAddModalOpen(false);
    setFormName('');
    setFormSku('');
    setFormDesc('');
    setFeedbackMsg(`Komoditas "${formName}" berhasil ditambahkan dan langsung aktif di katalog warga!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleOpenEditModal = (prod: Product) => {
    const priceEntry = catalogPrices.find((cp) => cp.product_id === prod.id);
    const sellPrice = priceEntry?.sell_price_idr || 5000;
    const modalPrice = priceEntry?.farmer_split_idr || Math.round(sellPrice * 0.72);

    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku);
    setEditDesc(prod.description || '');
    setEditCategory(prod.category_type);
    setEditUnit(prod.unit);
    setEditModalPrice(modalPrice);
    setEditSellPrice(sellPrice);
    setEditIsActive(prod.is_active);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const is1p =
      editCategory === 'VEGETABLE_1P' ||
      editCategory === 'TUBER_CURED_1P' ||
      editCategory === 'PROTEIN_1P';

    updateProduct(editingProduct.id, {
      name: editName,
      sku: editSku.toUpperCase(),
      description: editDesc,
      category_type: editCategory,
      unit: editUnit,
      is_1p: is1p,
      is_active: editIsActive,
    });

    updateCatalogPrice(editingProduct.id, editSellPrice, editModalPrice);

    setEditingProduct(null);
    setFeedbackMsg(`Perubahan komoditas "${editName}" berhasil disimpan!`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleToggleStatus = (prod: Product) => {
    updateProduct(prod.id, { is_active: !prod.is_active });
  };

  const handleDelete = (prod: Product) => {
    if (confirm(`Yakin ingin menghapus komoditas "${prod.name}" dari katalog master?`)) {
      deleteProduct(prod.id);
      setFeedbackMsg(`Komoditas "${prod.name}" telah dihapus.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Admin Top Header Navigation */}
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Feedback Notification */}
        {feedbackMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Page Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                Katalog Master Hulu
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-xs text-stone-500 font-medium">
                Pembaruan terhubung ke etalase warga
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 tracking-tight">
              Manajemen Komoditas & Tambah Produk
            </h1>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-extrabold rounded-xl shadow-sm transition hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Komoditas Baru</span>
          </button>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Komoditas
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900">{products.length}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Master Aktif
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              🌱 Panen 1P (Petani)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700">
                {products.filter((p) => p.is_1p).length}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Ciwidey & Lembang</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              🏬 Pasokan 3P (Grosir)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-700">
                {products.filter((p) => !p.is_1p).length}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Pasar Caringin</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status Tayang</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900">
                {products.filter((p) => p.is_active).length}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Di Etalase Toko</span>
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
                placeholder="Cari berdasarkan nama sayur, daging, atau SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#24B05A]"
              />
            </div>

            {/* Quick summary text */}
            <div className="text-xs text-stone-500 font-medium text-right sm:text-left self-center">
              Menampilkan <b>{filteredProducts.length}</b> dari {products.length} komoditas
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categoryOptions.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Products Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Komoditas & SKU</th>
                  <th className="py-3 px-4">Kategori & Tipe</th>
                  <th className="py-3 px-4">Satuan Porsi</th>
                  <th className="py-3 px-4 text-right">Modal Petani (HPP)</th>
                  <th className="py-3 px-4 text-right">Harga Jual Warga</th>
                  <th className="py-3 px-4 text-center">Margin</th>
                  <th className="py-3 px-4 text-center">Status Tayang</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-stone-400">
                      Tidak ada komoditas yang sesuai dengan pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const priceEntry = catalogPrices.find((cp) => cp.product_id === p.id);
                    const sellPrice = priceEntry?.sell_price_idr || 5000;
                    const modalPrice = priceEntry?.farmer_split_idr || Math.round(sellPrice * 0.72);
                    const marginPct = Math.round(((sellPrice - modalPrice) / sellPrice) * 100);

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition">
                        {/* Nama & SKU */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-lg flex-shrink-0">
                              {p.name.includes('Pakcoy') && '🥬'}
                              {p.name.includes('Sosin') && '🥗'}
                              {p.name.includes('Ubi') && '🍠'}
                              {p.name.includes('Ayam') && '🍗'}
                              {p.name.includes('Telur') && '🥚'}
                              {p.name.includes('Cabai') && '🌶️'}
                              {p.name.includes('Bawang') && '🧅'}
                              {p.name.includes('Beras') && '🍚'}
                              {p.name.includes('Minyak') && '🛢️'}
                              {p.name.includes('Kangkung') && '🌱'}
                              {!p.name.includes('Pakcoy') &&
                                !p.name.includes('Sosin') &&
                                !p.name.includes('Ubi') &&
                                !p.name.includes('Ayam') &&
                                !p.name.includes('Telur') &&
                                !p.name.includes('Cabai') &&
                                !p.name.includes('Bawang') &&
                                !p.name.includes('Beras') &&
                                !p.name.includes('Minyak') &&
                                !p.name.includes('Kangkung') &&
                                '🥦'}
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block leading-tight">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-mono text-stone-400 font-medium">
                                SKU: {p.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.is_1p
                                ? 'bg-[#EBF7EE] text-[#1B8A44] border border-[#BAE6C5]'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {p.is_1p ? '🌱 1P Petani Hulu' : '🏬 3P Grosir Caringin'}
                          </span>
                        </td>

                        {/* Satuan */}
                        <td className="py-3 px-4 font-mono text-stone-700 font-semibold">
                          {p.unit}
                        </td>

                        {/* Modal HPP */}
                        <td className="py-3 px-4 text-right font-mono text-stone-600">
                          {formatRupiah(modalPrice)}
                        </td>

                        {/* Harga Jual */}
                        <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                          {formatRupiah(sellPrice)}
                        </td>

                        {/* Margin */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              marginPct >= 20
                                ? 'bg-emerald-100 text-emerald-800'
                                : marginPct >= 10
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {marginPct}%
                          </span>
                        </td>

                        {/* Status Switch */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                              p.is_active
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {p.is_active ? '✓ Tayang' : '⚪ Draft / Habis'}
                          </button>
                        </td>

                        {/* Aksi: Edit & Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-stone-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer"
                              title="Ubah komoditas / harga"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus komoditas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL FORM TAMBAH KOMODITAS BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#24B05A] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-tight">
                    Tambah Komoditas Baru
                  </h3>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Langsung tampil otomatis di etalase belanja warga
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Nama Komoditas / Hasil Panen *
                  </label>
                  <span className="text-[10px] text-stone-400">Contoh: Bayam Organik Ciwidey</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Bayam Hijau Super Petik Fajar"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kode SKU Otomatis *
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                    placeholder="E.G. BYM-01"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-mono uppercase text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Satuan Porsi Dapur *
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                  >
                    <option value="pack (250gr)">pack (250gr)</option>
                    <option value="pack (200gr)">pack (200gr)</option>
                    <option value="ikat (250gr)">ikat (250gr)</option>
                    <option value="ikat (300gr)">ikat (300gr)</option>
                    <option value="500gr">500gr</option>
                    <option value="kg">kg</option>
                    <option value="kg (16 butir)">kg (16 butir)</option>
                    <option value="pouch 2L">pouch 2L</option>
                    <option value="karung 5kg">karung 5kg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kategori Rantai Pasok *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                >
                  <option value="VEGETABLE_1P">🥬 Sayuran Daun 1P (Petani Ciwidey/Lembang)</option>
                  <option value="TUBER_CURED_1P">🍠 Umbi Curing 1P (Sumedang Cilembu)</option>
                  <option value="PROTEIN_1P">🍗 Unggas & Telur 1P (Peternak Lembang)</option>
                  <option value="SPICE_3P">🌶️ Bumbu & Cabai 3P (Pasar Induk Caringin)</option>
                  <option value="STAPLE_3P">🌾 Sembako Pokok 3P (Beras / Minyak Goreng)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Modal Petani / HPP (Rp)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formModalPrice}
                    onChange={(e) => setFormModalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-mono font-bold text-stone-900"
                    required
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Hak Petani/Vendor</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Harga Jual Warga (Rp)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formSellPrice}
                    onChange={(e) => setFormSellPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] font-mono font-bold text-stone-900"
                    required
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Tampil di Katalog</span>
                </div>

                <div className="col-span-2 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">Margin Operasional Kotor:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                      calculatedMarginPct >= 20
                        ? 'bg-emerald-100 text-emerald-800'
                        : calculatedMarginPct >= 10
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {calculatedMarginPct}% ({formatRupiah(formSellPrice - formModalPrice)})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Deskripsi Panen & Kesegaran
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Dipetik embun subuh jam 03.00 WIB, bebas residu pestisida, siap simpan kulkas 7 hari."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Terbitkan ke Katalog Warga</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM EDIT KOMODITAS & HARGA */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-tight">
                    Ubah Komoditas & Fiksasi Harga
                  </h3>
                  <span className="text-[11px] text-stone-500 font-normal">
                    ID: {editingProduct.id} • SKU: {editingProduct.sku}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Komoditas / Hasil Panen *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-stone-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kode SKU *
                  </label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono uppercase text-stone-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Satuan Porsi Dapur *
                  </label>
                  <select
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-stone-900 font-medium"
                  >
                    <option value="pack (250gr)">pack (250gr)</option>
                    <option value="pack (200gr)">pack (200gr)</option>
                    <option value="ikat (250gr)">ikat (250gr)</option>
                    <option value="ikat (300gr)">ikat (300gr)</option>
                    <option value="500gr">500gr</option>
                    <option value="kg">kg</option>
                    <option value="kg (16 butir)">kg (16 butir)</option>
                    <option value="pouch 2L">pouch 2L</option>
                    <option value="karung 5kg">karung 5kg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kategori Rantai Pasok *
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-stone-900 font-medium"
                >
                  <option value="VEGETABLE_1P">🥬 Sayuran Daun 1P (Petani Ciwidey/Lembang)</option>
                  <option value="TUBER_CURED_1P">🍠 Umbi Curing 1P (Sumedang Cilembu)</option>
                  <option value="PROTEIN_1P">🍗 Unggas & Telur 1P (Peternak Lembang)</option>
                  <option value="SPICE_3P">🌶️ Bumbu & Cabai 3P (Pasar Induk Caringin)</option>
                  <option value="STAPLE_3P">🌾 Sembako Pokok 3P (Beras / Minyak Goreng)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-sky-50/60 rounded-2xl border border-sky-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Modal Petani / HPP (Rp)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={editModalPrice}
                    onChange={(e) => setEditModalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold text-stone-900"
                    required
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">HPP Masuk Sistem</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Harga Jual Warga (Rp)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={editSellPrice}
                    onChange={(e) => setEditSellPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold text-stone-900"
                    required
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">Harga di Toko</span>
                </div>

                <div className="col-span-2 pt-2 border-t border-sky-200 flex items-center justify-between text-xs">
                  <span className="text-stone-700 font-medium">Margin Operasional Baru:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                      calculatedEditMarginPct >= 20
                        ? 'bg-emerald-100 text-emerald-800'
                        : calculatedEditMarginPct >= 10
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {calculatedEditMarginPct}% ({formatRupiah(editSellPrice - editModalPrice)})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Deskripsi Panen & Kesegaran
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-stone-900"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Status Tayang Etalase</span>
                  <span className="text-[11px] text-stone-500">
                    Aktifkan jika stok sayur tersedia untuk dibeli warga
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditIsActive(!editIsActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    editIsActive ? 'bg-emerald-500 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {editIsActive ? '✓ Aktif Tayang' : '⚪ Dinonaktifkan'}
                </button>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
