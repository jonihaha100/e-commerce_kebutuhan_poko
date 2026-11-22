'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { initialAccounts, Account } from '@/lib/mock-data';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Briefcase,
  LineChart,
  Sliders,
  Check,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// Slide Operasional Khusus Staf & Admin Command Center
const CHAPTERS_ADMIN = [
  {
    chapter: 'BAB 01 • RADAR PASAR INDUK BANDUNG',
    title: 'Benchmarking Caringin & Sederhana',
    quote:
      'Pemantauan harga acuan pasar komoditas harian secara real-time. Memastikan harga jual Agrojaya tetap kompetitif di bawah rata-rata pasar induk Bandung.',
    badge: 'Monitoring 10 Komoditas Kunci',
    accentColor: '#38BDF8',
    icon: '📊',
    stepName: '01 Radar Caringin',
    videoSrc: '/slides/agri-field.mp4',
    posterSrc: '/slides/poster-2.png',
  },
  {
    chapter: 'BAB 02 • FIKSASI HARGA HARIAN',
    title: 'Window Fiksasi 15.00 - 16.00 WIB',
    quote:
      'Setiap sore pukul 15.00 WIB, sistem mengunci harga katalog esok hari berdasarkan rata-rata input pasokan petani Ciwidey dan margin safety.',
    badge: 'Kunci Katalog H-1 Sebelum Cutoff',
    accentColor: '#4C9BD5',
    icon: '⏰',
    stepName: '02 Fiksasi 15.00',
    videoSrc: '/slides/agri-packing.mp4',
    posterSrc: '/slides/poster-3.png',
  },
  {
    chapter: 'BAB 03 • FORMULA SAFETY MARGIN',
    title: 'Pencegahan Rugi & Kontrol Margin',
    quote:
      'Algoritma memvalidasi floor price P_min_safe = C_in / (1 - target_margin) secara otomatis untuk melindungi arus kas dan hak petani.',
    badge: 'Safety Margin Terproteksi',
    accentColor: '#10B981',
    icon: '🛡️',
    stepName: '03 Safety Floor',
    videoSrc: '/slides/agri-digging.mp4',
    posterSrc: '/slides/poster-4.png',
  },
  {
    chapter: 'BAB 04 • KONTROL SURAT JALAN & KLUSTER',
    title: 'Routing Subuh Kluster Antapani',
    quote:
      'Penerbitan surat jalan otomatis, verifikasi timbangan gabah/sayur Gapoktan, dan pemetaan rute kurir sebelum fajar menyingsing.',
    badge: 'Akurasi Manifest Logistik',
    accentColor: '#F59E0B',
    icon: '📋',
    stepName: '04 Manifest Subuh',
    videoSrc: '/slides/agri-harvest.mp4',
    posterSrc: '/slides/poster-1.png',
  },
];

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/produk';

  const { setCurrentUser } = useApp();

  const [activeChapter, setActiveChapter] = useState(0);
  const [adminEmail, setAdminEmail] = useState('admin@agrojaya.id');
  const [adminPassword, setAdminPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  const currentCh = CHAPTERS_ADMIN[activeChapter];

  const handleNextChapter = () => {
    setActiveChapter((prev) => (prev + 1) % CHAPTERS_ADMIN.length);
  };

  const handlePrevChapter = () => {
    setActiveChapter((prev) => (prev - 1 + CHAPTERS_ADMIN.length) % CHAPTERS_ADMIN.length);
  };

  const handleAdminLogin = (account: Account, destination: string = redirectPath) => {
    setIsLoggingIn(account.id);
    setCurrentUser(account);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_user_role', 'ADMIN');
      document.cookie = `user_role=ADMIN; path=/; max-age=86400`;
    }
    setTimeout(() => {
      router.push(destination);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminAccount = initialAccounts[0]; // Admin Eksekutif
    handleAdminLogin(adminAccount, redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#071322] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Top Banner Otorisasi */}
      <div className="w-full max-w-5xl mb-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-sky-500/30 p-3 sm:p-4 shadow-xl flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-mono text-sky-300 font-bold tracking-wider">
            PORTAL OTORISASI INTERNAL AGROJAYA
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Khusus Staf Operasional, Tim Logistik, dan Manajemen Eksekutif
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition font-semibold text-[11px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Toko Warga</span>
        </Link>
      </div>

      {/* Container Utama Split-Screen Command Center */}
      <div className="w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* ======================================================== */}
        {/* SISI KIRI: Atmosfer Visual Operasional Hulu & Logistik   */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between relative text-white bg-slate-950 overflow-hidden min-h-[460px] sm:min-h-[580px]">
          {/* Background Video Looping Operasional Pertanian */}
          <video
            key={currentCh.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={currentCh.posterSrc}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-opacity duration-1000 pointer-events-none"
          >
            <source src={currentCh.videoSrc} type="video/mp4" />
          </video>

          {/* Gradien Gelap untuk Command Center */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/30 pointer-events-none" />
          <div className="absolute inset-0 bg-sky-950/30 mix-blend-multiply pointer-events-none" />

          {/* Top Bar on Visual Panel */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-sky-300 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>SISTEM KENDALI HYPERLOCAL</span>
            </span>

            <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-full border border-amber-500/30">
              ⚡ LIVE OPS WIB
            </span>
          </div>

          {/* Center Storytelling Narrative */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 text-[11px] font-mono uppercase tracking-widest text-sky-300">
              <span>{currentCh.icon}</span>
              <span>{currentCh.chapter}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {currentCh.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              &ldquo;{currentCh.quote}&rdquo;
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                ✓ {currentCh.badge}
              </span>
            </div>
          </div>

          {/* Bottom Carousel Controls */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-slate-400">
              {CHAPTERS_ADMIN.map((ch, idx) => (
                <button
                  key={ch.stepName}
                  onClick={() => setActiveChapter(idx)}
                  className={`transition-all text-left cursor-pointer ${
                    activeChapter === idx
                      ? 'text-white font-bold border-b-2 border-sky-400 pb-0.5'
                      : 'hover:text-slate-200'
                  }`}
                >
                  <span className="hidden sm:inline">{ch.stepName}</span>
                  <span className="sm:hidden">{`0${idx + 1}`}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevChapter}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextChapter}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SISI KANAN: Formulir Otorisasi Masuk Staf / Admin        */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-slate-900 text-white border-l border-slate-800">
          <div className="space-y-6">
            
            {/* Header Brand Admin */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/brand-logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain rounded-full border border-sky-400/50 bg-white p-0.5"
                />
                <div>
                  <span className="text-sm font-black text-white tracking-tight block">
                    Berkah Tani Sejahtera
                  </span>
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block font-mono">
                    Command Center Operasional
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                🔒 RESTRICTED AREA
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Masuk Command Center
              </h1>
              <p className="text-xs text-slate-400">
                Kelola master produk, monitoring pesanan klaster, dan kontrol fiksasi harga harian.
              </p>
            </div>

            {/* Quick 1-Click Role Login for Admin/Staff */}
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Akses Cepat 1-Klik Simulasi Admin</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Demo Mode</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAdminLogin(initialAccounts[0], '/admin/produk')}
                  disabled={isLoggingIn !== null}
                  className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-sky-500 text-left transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                      Admin Eksekutif
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Katalog Master & Pesanan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAdminLogin(initialAccounts[0], '/admin/radar-harga')}
                  disabled={isLoggingIn !== null}
                  className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-sky-500 text-left transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                      Admin Radar Caringin
                    </span>
                    <LineChart className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Fiksasi Harga 15.00 WIB
                  </span>
                </button>
              </div>
            </div>

            {/* Form Manual Admin */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Operasional / ID Staf
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@agrojaya.id"
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Kata Sandi Otorisasi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan sandi otorisasi"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn !== null}
                className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-950 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mengautentikasi Command Center...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Pusat Kendali</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Card */}
          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
            <p className="text-[11px]">
              Platform Terenkripsi • AgroJaya Global Indo Pusat Operasional Bandung
            </p>
            <div>
              <Link
                href="/login"
                className="text-sky-400 hover:text-sky-300 font-bold transition inline-flex items-center gap-1 text-[11px]"
              >
                <span>Bukan Tim Operasional? Masuk sebagai Pelanggan Belanja</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071322] flex items-center justify-center text-white text-xs font-mono">
          Memuat Portal Admin AgroJaya...
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
