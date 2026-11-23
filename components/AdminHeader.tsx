'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  LineChart,
  MapPin,
  Boxes,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { getJakartaTimeString } from '@/lib/time';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const currentTimeWIB = getJakartaTimeString(new Date(), false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'user_role=; path=/; max-age=0';
      localStorage.removeItem('agri_user_role');
    }
    router.push('/admin/login');
  };

  const tabs = [
    {
      href: '/admin/produk',
      label: 'Katalog & Tambah Produk',
      icon: Package,
      badge: 'Master',
    },
    {
      href: '/admin/pasokan',
      label: 'Pasokan & Petani Hulu',
      icon: Boxes,
      badge: 'Subuh',
    },
    {
      href: '/admin/pesanan',
      label: 'Monitor Pesanan Warga',
      icon: ShoppingBag,
      badge: 'Live',
    },
    {
      href: '/admin/komplek',
      label: 'Komplek & Drop Point',
      icon: MapPin,
      badge: 'Rute',
    },
    {
      href: '/admin/radar-harga',
      label: 'Radar Harga Caringin',
      icon: LineChart,
      badge: '15.00 WIB',
    },
    {
      href: '/admin/laporan',
      label: 'Laporan & Tutup Buku',
      icon: FileSpreadsheet,
      badge: 'Bulan',
    },
  ];

  return (
    <div className="bg-[#0A192F] text-white border-b border-slate-800 shadow-md">
      {/* Top micro bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between text-xs border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-300 font-bold tracking-wider text-[11px]">
            AGROJAYA INTERNAL COMMAND CENTER
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            {currentTimeWIB} WIB
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 text-[10px] font-semibold font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Eksekutif</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition font-bold"
          >
            <span>Toko Warga (Live)</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-200 transition font-bold px-2 py-0.5 rounded-md hover:bg-rose-950/40 border border-transparent hover:border-rose-800 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/produk" className="flex items-center gap-2.5">
            <img
              src="/brand-logo.png"
              alt="Logo"
              className="w-9 h-9 object-contain rounded-full border border-sky-400/50 bg-white p-0.5"
            />
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-tight">
                Berkah Tani Sejahtera
              </h1>
              <span className="text-[10px] font-mono tracking-wider text-sky-400 uppercase font-semibold">
                Pusat Kendali Operasional Bandung
              </span>
            </div>
          </Link>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#24B05A] text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
