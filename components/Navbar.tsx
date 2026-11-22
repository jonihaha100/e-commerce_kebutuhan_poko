'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MapPin, ShoppingBag, Bell, User, Clock, Check, ChevronDown, Sparkles, LogOut, Package, Shield } from 'lucide-react';
import { getJakartaTimeString, getDailyCyclePhase } from '@/lib/time';

export function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCluster, cart, currentUser, switchRole } = useApp();
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Berkah Tani Sejahtera';

  // Language state (inspired by Ramu)
  const [lang, setLang] = useState<'id' | 'en'>('id');

  // Notifications state (inspired by Ramu)
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Slot Group-Buy Terbuka',
      desc: 'Komplek Antapani Indah telah mencapai 7/10 slot! Belanja Rp40.000 untuk dapat cashback 10%.',
      time: '15 menit lalu',
      read: false,
    },
    {
      id: 2,
      title: 'Panen Subuh Tiba di Hub',
      desc: 'Pakcoy Hidroponik & Ubi Cilembu Madu telah lolos sortasi QC di Hub Central Bandung.',
      time: '2 jam lalu',
      read: false,
    },
  ]);

  // User menu state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const currentTimeWIB = getJakartaTimeString(new Date(), false);
  const phase = getDailyCyclePhase();

  const phaseLabels: Record<string, { text: string; color: string }> = {
    BEFORE_INBOUND: { text: 'Persiapan Subuh (Hulu)', color: 'bg-stone-200 text-stone-800' },
    VENDOR_INPUT_ACTIVE: { text: 'Input Modal Vendor (s/d 15:00 WIB)', color: 'bg-amber-100 text-amber-800' },
    ADMIN_PRICE_RADAR: { text: 'Radar Fiksasi Harga (15:00-16:00 WIB)', color: 'bg-indigo-100 text-indigo-800' },
    CATALOG_OPEN: { text: 'Katalog Terbuka (16:00-19:45 WIB)', color: 'bg-emerald-100 text-emerald-800 font-bold' },
    GROUPBUY_COUNTDOWN: { text: 'Hitung Mundur Group-Buy (15 Menit)', color: 'bg-rose-100 text-rose-800 animate-pulse' },
    CYCLE_LOCKED: { text: 'Pesanan Dikunci (Surat Jalan Rilis)', color: 'bg-stone-200 text-stone-700' },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/brand-logo.png"
              alt="Logo Berkah Tani Sejahtera"
              className="w-10 h-10 object-contain rounded-full border-2 border-[#4C9BD5] bg-white p-0.5 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base sm:text-lg text-[#0F172A] tracking-tight">
                {brandName}
              </span>
              <span className="text-[10px] text-[#4C9BD5] uppercase tracking-wider font-extrabold">
                Agrojaya Global Indo Platform
              </span>
            </div>
          </Link>

          {/* Hyperlocal Geofencing Pill (Astro Style) */}
          <Link
            href="/pilih-komplek"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] hover:border-[#4C9BD5] rounded-full text-xs text-[#0F172A] shadow-2xs transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#24B05A]" />
            <span className="font-bold text-slate-800">{selectedCluster.name}</span>
            <span className="text-[10px] bg-[#24B05A]/15 text-[#1B8A44] px-2 py-0.5 rounded-full font-bold">
              {selectedCluster.delivery_mode === 'MOBILE_DROP_POINT' ? 'Drop Point' : selectedCluster.delivery_mode === 'MITRA_IRT_CHECKPOINT' ? 'Mitra IRT' : 'Waitlist'}
            </span>
          </Link>
        </div>

        {/* Center Links (Fokus Belanja & Lacak Pengantaran ala Astro) */}
        <ul className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#475569]">
          <li>
            <Link
              href="/"
              className={`hover:text-[#0F172A] transition pb-1 ${
                pathname === '/' ? 'text-[#24B05A] border-b-2 border-[#24B05A] font-bold' : ''
              }`}
            >
              Katalog Segar
            </Link>
          </li>
          <li>
            <Link
              href="/track"
              className={`hover:text-[#0F172A] transition pb-1 ${
                pathname.startsWith('/track') ? 'text-[#24B05A] border-b-2 border-[#24B05A] font-bold' : ''
              }`}
            >
              Lacak Pesanan
            </Link>
          </li>

          {/* Role specific links (Hanya tampil untuk staf/pengelola) */}
          {currentUser.role === 'ADMIN' && (
            <li>
              <Link
                href="/admin/radar-harga"
                className="px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE] rounded-lg font-bold transition flex items-center gap-1 border border-[#BFDBFE]"
              >
                <Sparkles className="w-3 h-3 text-[#2563EB]" />
                Radar Harga
              </Link>
            </li>
          )}

          {(currentUser.role === 'VENDOR_PETANI' || currentUser.role === 'VENDOR_PASAR_3P') && (
            <li>
              <Link
                href="/vendor/input-harian"
                className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] rounded-lg font-bold transition border border-[#FCD34D]"
              >
                Portal Hulu
              </Link>
            </li>
          )}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#24B05A] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Notifikasi Komunitas</span>
                  {unreadNotifs > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-[#24B05A] hover:underline font-semibold"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                        );
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                        !n.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="font-bold text-slate-900">{n.title}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5 leading-snug">{n.desc}</div>
                      <div className="text-slate-400 text-[10px] mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Button with brand green badge */}
          <button
            onClick={onOpenCart}
            className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition relative flex items-center gap-1.5"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            {cartItemCount > 0 && (
              <span className="bg-[#24B05A] text-white font-extrabold text-[11px] px-1.5 py-0.2 rounded-full min-w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition hidden sm:flex items-center gap-1"
          >
            <span className={lang === 'id' ? 'text-[#24B05A] font-extrabold' : 'text-slate-400'}>
              ID
            </span>
            <span className="text-slate-300">/</span>
            <span className={lang === 'en' ? 'text-[#24B05A] font-extrabold' : 'text-slate-400'}>
              EN
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
              aria-label="User Menu"
            >
              <div className="w-7 h-7 rounded-full bg-[#24B05A] text-white flex items-center justify-center text-xs font-bold">
                {currentUser.full_name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                {currentUser.full_name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{currentUser.full_name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{currentUser.role}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/akun"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profil Dapur Saya</span>
                  </Link>
                  <Link
                    href="/track"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Lacak Pesanan Subuh</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span>Ganti Akun / Peran</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
