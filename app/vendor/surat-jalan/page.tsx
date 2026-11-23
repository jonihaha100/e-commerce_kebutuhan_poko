'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { initialPurchaseOrdersHulu, initialProducts } from '@/lib/mock-data';
import { formatRupiah } from '@/lib/pricing-engine';
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2, Truck, Package } from 'lucide-react';

export default function VendorSuratJalanPage() {
  const { currentUser } = useApp();

  // Anti-ATM Filter: only purchase orders matching current vendor
  const vendorPOs = currentUser.role === 'ADMIN'
    ? initialPurchaseOrdersHulu
    : initialPurchaseOrdersHulu.filter((po) => po.vendor_id === currentUser.id);

  const totalPayout = vendorPOs.reduce((sum, po) => sum + po.total_payout_idr, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/vendor/input-harian"
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Input Penawaran Harian
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Dokumen Logistik Hulu
          </span>
          <h1 className="text-2xl font-extrabold text-stone-900 mt-2 tracking-tight">
            Rekap Surat Jalan Agregat (PO Hulu)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Vendor: <span className="font-bold text-stone-800">{currentUser.full_name}</span> ({currentUser.role})
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-400 block">Total Payout Hulu</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {formatRupiah(totalPayout)}
          </span>
        </div>
      </div>

      {/* Privacy Shield Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 leading-relaxed">
          <b className="block text-emerald-900 mb-0.5">Proteksi Privasi & Keamanan Data Warga</b>
          Vendor hanya memiliki akses terhadap total kuantitas tonase agregat yang harus dikirim ke Central Hub. Data pribadi pemesan dan alamat rumah warga tersimpan aman dan terproteksi.
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Daftar Surat Jalan Hulu Siklus Hari Ini
          </span>
          <span className="text-xs bg-stone-200 text-stone-700 font-mono px-2 py-0.5 rounded">
            Tabel: purchase_orders_hulu
          </span>
        </div>

        <div className="divide-y divide-stone-200 overflow-x-auto">
          {vendorPOs.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              Belum ada Surat Jalan agregat yang dirilis untuk akun vendor ini.
            </div>
          ) : (
            vendorPOs.map((po) => {
              const product = initialProducts.find((p) => p.id === po.product_id);
              return (
                <div key={po.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 flex-shrink-0">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{product?.name}</span>
                        <span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {product?.sku}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                        <span>Total Koli: <b className="text-stone-800">{po.total_aggregated_qty} {product?.unit}</b></span>
                        <span>•</span>
                        <span>Harga Bersih: <b className="text-stone-800">{formatRupiah(po.unit_net_price_idr)}</b></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-sm font-bold text-emerald-700">
                      {formatRupiah(po.total_payout_idr)}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {po.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
