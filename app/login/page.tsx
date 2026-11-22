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
  Phone,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Briefcase,
  ShoppingBag,
  Store,
  LineChart,
  Sliders,
  Check,
  Building2,
  UserCheck,
  Play,
  X,
  Truck,
  Sparkles,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Konten Storytelling untuk Pintu Masuk PELANGGAN: Alur Aktivitas Pertanian & Peternakan
const CHAPTERS_USER = [
  {
    chapter: 'LANGKAH 01 • PANEN SUBUH LAHAN & KANDANG (03:00 WIB)',
    title: 'Petik Sayur Mayur & Hasil Ternak Fajar',
    quote:
      'Di lereng Ciwidey dan Lembang, petani memetik pakcoy hidroponik, kangkung, cabai domba, dan ubi madu Cilembu saat embun masih dingin. Bersamaan dengan itu, peternak mengambil telur fresh dan ayam potong segar jam 03.00 subuh.',
    badge: 'Panen Subuh: 70% Petani 1P Ciwidey & Peternak Lembang',
    accentColor: '#24B05A',
    bgGradient: 'from-[#042111] via-[#091D13] to-[#05140C]',
    icon: '🌱',
    stepName: '01 Panen Subuh',
    time: '03:00 WIB',
    commodities: ['🥬 Pakcoy & Sosin', '🍠 Ubi Cilembu', '🍗 Ayam Potong', '🥚 Telur Fresh'],
    videoSrc: '/slides/agri-harvest.mp4',
    posterSrc: '/slides/poster-1.png',
  },
  {
    chapter: 'LANGKAH 02 • SORTIR BERSIH & COLD-CHAIN (04:30 WIB)',
    title: 'Pencucian Air Ozon & Rantai Dingin 4°C',
    quote:
      'Bukan sayur pasar becek. Semua hasil panen masuk pembersihan air ozon berstandar supermarket untuk melarutkan sisa getah dan tanah. Daging ayam diproses dingin agar tetap kesat higienis tanpa bau amis.',
    badge: 'Bebas Tanah Becek, Bebas Ulat & Daging Dingin Segar',
    accentColor: '#4C9BD5',
    bgGradient: 'from-[#061D30] via-[#0B1A28] to-[#04111C]',
    icon: '💧',
    stepName: '02 Sortir Ozon',
    time: '04:30 WIB',
    commodities: ['✨ Cuci Air Ozon', '❄️ Daging Ayam 4°C', '⚖️ Seleksi Grade A', '🛡️ Higienis'],
    videoSrc: '/slides/agri-field.mp4',
    posterSrc: '/slides/poster-2.png',
  },
  {
    chapter: 'LANGKAH 03 • KEMASAN PORSI DAPUR KELUARGA (05:30 WIB)',
    title: 'Takaran Pas 250gr, 500gr & 1kg Siap Kulkas',
    quote:
      'Bumbu dan sayur ditimbang presisi dalam kemasan tertutup food-grade per porsi masak harian keluarga. Ibu tidak perlu repot menimbang atau membersihkan tanah, tinggal simpan rapi di kulkas.',
    badge: 'Porsi Masak Pas: 250gr, 500gr & 1kg Tanpa Sisa Busuk',
    accentColor: '#10B981',
    bgGradient: 'from-[#062419] via-[#0C2018] to-[#05160F]',
    icon: '📦',
    stepName: '03 Kemas Porsi',
    time: '05:30 WIB',
    commodities: ['🫙 Cabai & Bawang 250g', '🥦 Sayur Daun 500g', '🥩 Ayam Filet 500g', '🥚 Telur 16 Butir'],
    videoSrc: '/slides/agri-packing.mp4',
    posterSrc: '/slides/poster-3.png',
  },
  {
    chapter: 'LANGKAH 04 • PENGANTARAN SERENTAK GERBANG KOMPLEK (06:30 - 09:00 WIB)',
    title: 'Tiba di Gerbang Sebelum Kompor Dapur Menyala',
    quote:
      'Armada boks pendingin kurir mengantar serentak ke pos satpam komplek atau rumah Mitra IRT Anda sebelum pukul 09.00 pagi. Masih segar dingin berembun, bebas ongkir, dan bergaransi layu langsung ganti saldo.',
    badge: 'Tiba 06.00-09.00 Pagi, Gratis Ongkir & Garansi Saldo',
    accentColor: '#EAB308',
    bgGradient: 'from-[#1F1705] via-[#1C160B] to-[#120E04]',
    icon: '🚛',
    stepName: '04 Tiba Gerbang',
    time: '06:30 - 09:00 WIB',
    commodities: ['🏡 Pos Satpam / IRT', '🚀 Bebas Ongkir', '🛡️ Garansi ≤Rp25rb', '🍳 Siap Masak'],
    videoSrc: '/slides/agri-digging.mp4',
    posterSrc: '/slides/poster-4.png',
  },
];

// Konten Storytelling untuk Pintu Masuk ADMIN & OPERASIONAL (Command Center)
const CHAPTERS_ADMIN = [
  {
    chapter: 'BAB 01 • RADAR PASAR INDUK BANDUNG',
    title: 'Benchmarking Caringin & Sederhana',
    quote:
      'Pemantauan harga acuan pasar komoditas harian secara real-time. Memastikan harga jual Agrojaya tetap kompetitif di bawah rata-rata pasar induk Bandung.',
    badge: 'Monitoring 10 Komoditas Kunci',
    accentColor: '#4C9BD5',
    bgGradient: 'from-[#071A2E] via-[#0D253F] to-[#05111F]',
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
    accentColor: '#38BDF8',
    bgGradient: 'from-[#08233C] via-[#0F2D4A] to-[#061524]',
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
    bgGradient: 'from-[#06241C] via-[#0B2E24] to-[#041712]',
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
    bgGradient: 'from-[#211906] via-[#2A1F08] to-[#120D03]',
    icon: '📋',
    stepName: '04 Manifest Subuh',
    videoSrc: '/slides/agri-harvest.mp4',
    posterSrc: '/slides/poster-1.png',
  },
];

// Tur Panduan Onboarding untuk Gerbang Masuk
const TOUR_STEPS_LOGIN = [
  {
    badge: 'LANGKAH 01 • AKSES DUA PINTU',
    title: 'Pilih Portal: Warga Belanja atau Tim Operasional',
    desc: 'Warga komplek masuk untuk belanja kebutuhan pokok harian. Tim operasional masuk untuk memantau radar Caringin, fiksasi harga jam 15.00 WIB, dan rute kurir subuh.',
    icon: ShoppingBag,
  },
  {
    badge: 'LANGKAH 02 • ALUR PANEN & TERNAK',
    title: 'Panen Subuh 03.00 WIB di Ciwidey & Lembang',
    desc: 'Sayuran mayur dipetik saat fajar, ayam potong & telur segar diproses higienis rantai dingin 4°C, dicuci air ozon, dan dikemas rapi porsi dapur keluarga.',
    icon: Store,
  },
  {
    badge: 'LANGKAH 03 • KATALOG & PENGANTARAN',
    title: 'Tiba di Gerbang Komplek Jam 06.00 - 09.00 Pagi',
    desc: 'Pengantaran serentak ke pos satpam atau mitra IRT komplek Anda dengan armada dingin berembun, bebas ongkir, dan bergaransi layu langsung ganti saldo.',
    icon: Truck,
  },
  {
    badge: 'LANGKAH 04 • MASUK 1-KLIK SIMULASI',
    title: 'Eksplorasi Langsung Tanpa Repot Input Sandi',
    desc: 'Gunakan tombol 1-Klik Akun Contoh (Ibu Ani untuk Pelanggan atau Tim Eksekutif untuk Admin) untuk langsung menjelajahi antarmuka toko belanja.',
    icon: CheckCircle2,
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const initialPortalParam = searchParams.get('portal');
  const requiredRole = searchParams.get('required_role');

  const { setCurrentUser } = useApp();

  // 2 Pintu Utama: USER (Pelanggan Warga) vs ADMIN (Operasional & Manajemen)
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const [portalType, setPortalType] = useState<'USER' | 'ADMIN'>(
    initialPortalParam === 'admin' || requiredRole === 'ADMIN' ? 'ADMIN' : 'USER'
  );

  const [activeChapter, setActiveChapter] = useState(0);

  // Form states untuk User
  const [userTab, setUserTab] = useState<'LOGIN' | 'PHONE' | 'DEMO'>('LOGIN');
  const [userEmailOrPhone, setUserEmailOrPhone] = useState('ibu.ani@antapani.id');
  const [userPassword, setUserPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Form states untuk Admin
  const [adminEmail, setAdminEmail] = useState('admin@agrojaya.id');
  const [adminPassword, setAdminPassword] = useState('••••••••');
  const [adminRoleTab, setAdminRoleTab] = useState<'EXECUTIVE' | 'MITRA_IRT' | 'PETANI'>('EXECUTIVE');

  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  const chapters = portalType === 'USER' ? CHAPTERS_USER : CHAPTERS_ADMIN;
  const currentCh = chapters[activeChapter] || chapters[0];

  const handleNextChapter = () => {
    setActiveChapter((prev) => (prev + 1) % chapters.length);
  };

  const handlePrevChapter = () => {
    setActiveChapter((prev) => (prev - 1 + chapters.length) % chapters.length);
  };

  // Switch Portal Type
  const switchPortal = (type: 'USER' | 'ADMIN') => {
    setPortalType(type);
    setActiveChapter(0);
  };

  const handle1ClickLogin = (account: Account, destination?: string) => {
    setIsLoggingIn(account.id);
    setCurrentUser(account);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_user_role', account.role);
      document.cookie = `user_role=${account.role}; path=/; max-age=86400`;
    }
    setTimeout(() => {
      if (destination) {
        router.push(destination);
      } else if (account.role === 'ADMIN') {
        router.push('/admin/radar-harga');
      } else {
        router.push(redirectPath);
      }
    }, 600);
  };

  const handleUserFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = initialAccounts[4]; // Ibu Ani
    handle1ClickLogin(cust, redirectPath);
  };

  const handleAdminFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminRoleTab === 'EXECUTIVE') {
      const adminAcc = initialAccounts[0]; // Admin Executive
      handle1ClickLogin(adminAcc, '/admin/radar-harga');
    } else if (adminRoleTab === 'MITRA_IRT') {
      const irtAcc = initialAccounts[1]; // Ibu Nurhayati
      handle1ClickLogin(irtAcc, '/pilih-komplek');
    } else {
      const vendorAcc = initialAccounts[2]; // Kang Asep
      handle1ClickLogin(vendorAcc, '/vendor/input-harian');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Banner Mulai Tur Panduan Website & Fitur Baru (Persis seperti tangkapan layar user) */}
      <div className="w-full max-w-5xl mb-4 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/90 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center font-bold border border-amber-200 flex-shrink-0">
            <Play className="w-5 h-5 fill-[#D97706]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Mulai Tur Panduan Website & Fitur Baru</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Interaktif
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Panduan Belanja & Pembaruan Sistem Agrojaya Hyperlocal Pasundan
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setTourStep(0);
            setShowTour(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs rounded-xl shadow-xs transition hover:scale-102 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Mulai Tur Interaktif</span>
        </button>
      </div>

      {/* Container Utama Split-Screen Ramu Style */}
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* ======================================================== */}
        {/* SISI KIRI: Atmosfer Visual Video Sinematik Pertanian     */}
        {/* ======================================================== */}
        <div
          className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between relative text-white bg-slate-950 overflow-hidden min-h-[460px] sm:min-h-[580px]"
        >
          {/* Background Video Looping Sinematik Pertanian & Peternakan Asli */}
          <video
            key={currentCh.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={currentCh.posterSrc}
            className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 transition-opacity duration-1000 pointer-events-none"
          >
            <source src={currentCh.videoSrc} type="video/mp4" />
          </video>

          {/* Lapisan Gradien Gelap Lembut untuk Kontras & Keterbacaan Teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/20 pointer-events-none" />
          <div
            className={`absolute inset-0 ${
              portalType === 'USER' ? 'bg-emerald-950/25' : 'bg-sky-950/25'
            } mix-blend-multiply pointer-events-none`}
          />

          {/* Ambient Lighting Glow */}
          <div
            className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: currentCh.accentColor }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: currentCh.accentColor }}
          />

          {/* Top Bar on Visual Panel */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/15 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda Toko</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTourStep(0);
                  setShowTour(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold backdrop-blur-md transition cursor-pointer"
              >
                <Play className="w-3 h-3 fill-amber-300" />
                <span>Tur Panduan</span>
              </button>

              {portalType === 'USER' ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                    ⏰ {(currentCh as any).time || '03:00 WIB'}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    🟢 PANEN & TERNAK 1P
                  </span>
                </div>
              ) : (
                <span className="text-[11px] font-mono tracking-wider text-sky-300/90 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30">
                  🔵 AGROJAYA COMMAND CENTER
                </span>
              )}
            </div>
          </div>

          {/* Center Storytelling Narrative */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 text-[11px] font-mono uppercase tracking-widest text-emerald-300">
              <span>{currentCh.icon}</span>
              <span>{currentCh.chapter}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {currentCh.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-md">
              &ldquo;{currentCh.quote}&rdquo;
            </p>

            {/* Real Commodity Badges (Pertanian & Peternakan) */}
            {Array.isArray((currentCh as any).commodities) && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {((currentCh as any).commodities as string[]).map((item: string) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/15 text-emerald-200 border border-white/20 backdrop-blur-sm shadow-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✓ {currentCh.badge}
              </span>
            </div>
          </div>

          {/* Bottom Carousel Controls ala Ramu */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-slate-400">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.stepName}
                  onClick={() => setActiveChapter(idx)}
                  className={`transition-all text-left cursor-pointer ${
                    activeChapter === idx
                      ? 'text-white font-bold border-b-2 border-white pb-0.5'
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
        {/* SISI KANAN: Formulir Masuk (Pilihan Akses User vs Admin) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            
            {/* Header: Logo & Dual-Door Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/brand-logo.png"
                  alt="Logo Berkah Tani Sejahtera"
                  className="w-10 h-10 object-contain rounded-full border border-[#4C9BD5] p-0.5"
                />
                <div>
                  <span className="text-sm font-black text-slate-900 tracking-tight block">
                    Berkah Tani Sejahtera
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Agrojaya Global Indo Platform
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  portalType === 'USER'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-sky-50 text-sky-800 border-sky-200'
                }`}
              >
                {portalType === 'USER' ? '🛒 Pintu Warga' : '💼 Portal Admin'}
              </span>
            </div>

            {/* SAKELAR 2 PINTU UTAMA: USER VS ADMIN */}
            <div className="p-1 bg-slate-100 rounded-2xl flex text-xs font-bold text-slate-600 shadow-inner">
              <button
                onClick={() => switchPortal('USER')}
                className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  portalType === 'USER'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'hover:text-slate-900 text-slate-500'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>1. Belanja Warga (User)</span>
              </button>
              <button
                onClick={() => switchPortal('ADMIN')}
                className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  portalType === 'ADMIN'
                    ? 'bg-[#0E2A47] text-white shadow-xs'
                    : 'hover:text-slate-900 text-slate-500'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>2. Tim Operasional (Admin)</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* TAMPILAN PINTU 1: USER (WARGA / PELANGGAN)              */}
            {/* ======================================================== */}
            {portalType === 'USER' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Masuk ke Swalayan Segar
                  </h1>
                  <p className="text-xs text-slate-500">
                    Silakan masuk untuk menikmati harga panen petani dan belanja bebas ongkir komplek.
                  </p>
                </div>

                {/* Sub-tab User: Masuk Akun / No. WhatsApp / 1-Klik Demo */}
                <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-4">
                  <button
                    onClick={() => setUserTab('LOGIN')}
                    className={`pb-2 border-b-2 transition cursor-pointer ${
                      userTab === 'LOGIN'
                        ? 'border-[#24B05A] text-[#24B05A]'
                        : 'border-transparent hover:text-slate-800'
                    }`}
                  >
                    Masuk Akun
                  </button>
                  <button
                    onClick={() => setUserTab('PHONE')}
                    className={`pb-2 border-b-2 transition cursor-pointer ${
                      userTab === 'PHONE'
                        ? 'border-[#24B05A] text-[#24B05A]'
                        : 'border-transparent hover:text-slate-800'
                    }`}
                  >
                    Nomor WhatsApp
                  </button>
                  <button
                    onClick={() => setUserTab('DEMO')}
                    className={`pb-2 border-b-2 transition cursor-pointer ${
                      userTab === 'DEMO'
                        ? 'border-[#24B05A] text-[#24B05A]'
                        : 'border-transparent hover:text-slate-800'
                    }`}
                  >
                    Akses Cepat Ibu Ani ✨
                  </button>
                </div>

                {userTab === 'LOGIN' && (
                  <form onSubmit={handleUserFormLogin} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email / No. Handphone
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userEmailOrPhone}
                          onChange={(e) => setUserEmailOrPhone(e.target.value)}
                          placeholder="nama@email.com atau 0812xxxx"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-slate-900 font-medium"
                          required
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          placeholder="Masukkan password"
                          className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-slate-900 font-medium"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-[#24B05A] focus:ring-[#24B05A]"
                        />
                        <span>Ingat saya</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Fitur reset kata sandi via WhatsApp: Kode verifikasi akan dikirim ke nomor Anda.')}
                        className="text-xs text-[#4C9BD5] font-semibold hover:underline"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn !== null}
                      className="w-full py-3 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 animate-spin" />
                          <span>Menyiapkan Keranjang Swalayan...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Swalayan Segar</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="relative flex items-center justify-center my-2">
                      <div className="border-t border-slate-200 w-full" />
                      <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                        ATAU
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handle1ClickLogin(initialAccounts[4], redirectPath)}
                      className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Lanjutkan dengan Google</span>
                    </button>
                  </form>
                )}

                {userTab === 'PHONE' && (
                  <form onSubmit={(e) => { e.preventDefault(); handle1ClickLogin(initialAccounts[4], redirectPath); }} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp Aktif
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-slate-900 font-bold"
                          required
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Kode OTP instan 4-digit akan dikirim ke WhatsApp Anda.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span>Kirim Kode & Masuk Belanja</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {userTab === 'DEMO' && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#24B05A] text-white flex items-center justify-center text-lg">
                        👩
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">
                          Ibu Ani Suryani
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold">
                          Warga Komplek Antapani Indah (RT 04 / RW 08)
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Gunakan profil ini untuk menguji pengalaman belanja sayur porsi 250gr, stepper Astro, dan simulasi Midtrans Snap.
                    </p>
                    <button
                      type="button"
                      onClick={() => handle1ClickLogin(initialAccounts[4], redirectPath)}
                      className="w-full py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>1-Klik Masuk sebagai Ibu Ani</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAMPILAN PINTU 2: ADMIN & OPERASIONAL (COMMAND CENTER)    */}
            {/* ======================================================== */}
            {portalType === 'ADMIN' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Masuk Command Center</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold">
                      Internal
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Akses kontrol eksekutif: Radar Harga Caringin, Fiksasi Sore, dan Manifest Pengiriman.
                  </p>
                </div>

                {/* Sub-tab Peran Admin & Mitra */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    onClick={() => { setAdminRoleTab('EXECUTIVE'); setAdminEmail('admin@agrojaya.id'); }}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                      adminRoleTab === 'EXECUTIVE'
                        ? 'bg-[#0E2A47] text-white shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Admin Executive
                  </button>
                  <button
                    onClick={() => { setAdminRoleTab('MITRA_IRT'); setAdminEmail('nurhayati@arcamanik.id'); }}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                      adminRoleTab === 'MITRA_IRT'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Mitra IRT
                  </button>
                  <button
                    onClick={() => { setAdminRoleTab('PETANI'); setAdminEmail('asep@gapoktan-ciwidey.id'); }}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                      adminRoleTab === 'PETANI'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Petani 1P
                  </button>
                </div>

                <form onSubmit={handleAdminFormLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Internal / NIP Kerja
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4C9BD5] text-slate-900 font-bold"
                        required
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PIN Otorisasi / Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4C9BD5] text-slate-900 font-bold"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn !== null}
                    className="w-full py-3 bg-[#0E2A47] hover:bg-[#1A3D63] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-spin" />
                        <span>Membuka Command Center...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Dashboard {adminRoleTab === 'EXECUTIVE' ? 'Radar Harga' : adminRoleTab === 'MITRA_IRT' ? 'Titik Antar IRT' : 'Input Petani'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      <span>Protokol Keamanan Sistem Agrojaya:</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Sesi ini terikat dengan audit log fiksasi harga komoditas pukul 15.00-16.00 WIB. Seluruh penyesuaian harga terekam permanen.
                    </p>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Footer Footnote ala Ramu Roastery */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs mt-6">
            {portalType === 'USER' ? (
              <>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#24B05A]" />
                  <span>Data warga terenkripsi</span>
                </div>
                <button
                  type="button"
                  onClick={() => switchPortal('ADMIN')}
                  className="text-xs font-bold text-[#4C9BD5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Portal Masuk Admin & Operasional →</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Jalur Operasional Terproteksi</span>
                </div>
                <button
                  type="button"
                  onClick={() => switchPortal('USER')}
                  className="text-xs font-bold text-[#24B05A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>← Kembali ke Pintu Belanja Warga</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* INTERACTIVE ONBOARDING TOUR MODAL */}
      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-sm">
                  <Play className="w-4 h-4 fill-[#D97706]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] block">
                    {TOUR_STEPS_LOGIN[tourStep].badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Tur Panduan Website & Fitur Baru
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTour(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Step Content */}
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF7EE] text-[#24B05A] flex items-center justify-center text-2xl font-bold border border-[#BAE6C5] mx-auto sm:mx-0">
                {React.createElement(TOUR_STEPS_LOGIN[tourStep].icon, { className: 'w-7 h-7' })}
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h4 className="text-base font-extrabold text-slate-900">
                  {TOUR_STEPS_LOGIN[tourStep].title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {TOUR_STEPS_LOGIN[tourStep].desc}
                </p>
              </div>

              {/* Step Dots Indicator */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                {TOUR_STEPS_LOGIN.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTourStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      tourStep === idx ? 'w-6 bg-[#24B05A]' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={() => setTourStep((prev) => Math.max(0, prev - 1))}
                disabled={tourStep === 0}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-30 cursor-pointer"
              >
                Sebelumnya
              </button>

              {tourStep < TOUR_STEPS_LOGIN.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setTourStep((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTour(false)}
                  className="px-5 py-2.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Selesai & Masuk Belanja</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Memuat gerbang masuk...</div>}>
      <LoginContent />
    </Suspense>
  );
}
