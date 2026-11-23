'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  ArrowRight,
  X,
  CheckCircle2,
  Copy,
  Gift,
  ShieldCheck,
  Truck,
  Percent,
} from 'lucide-react';

export interface PromoSlide {
  id: string;
  tag: string;
  tagBg: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  gradientBg: string;
  accentColor: string;
  badgeEmoji: string;
  illustrationType: 'market' | 'groupbuy' | 'cilembu' | 'guarantee';
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'slide-1',
    tag: 'MALAS KE PASAR BECEK?',
    tagBg: 'bg-white/20 text-white border-white/30',
    headline: 'Malas Belanja Becek ke Pasar?',
    subheadline: 'Sayur hidroponik & ayam potong segar petik subuh 03.00, jaminan pasti bersih & higienis!',
    ctaText: 'Cek Sekarang',
    ctaHref: '#katalog',
    gradientBg: 'from-[#8B5CF6] via-[#7C3AED] to-[#5B21B6]', // Tokopedia Purple Aesthetic as in user image
    accentColor: '#C4B5FD',
    badgeEmoji: '🥬',
    illustrationType: 'market',
  },
  {
    id: 'slide-2',
    tag: 'GROUP-BUY HEMAT 10%',
    tagBg: 'bg-emerald-900/40 text-emerald-100 border-emerald-400/40',
    headline: 'Belanja Bareng Tetangga, Hemat s/d 15%!',
    subheadline: 'Ajak 10 warga perumahan, pesanan diantar serentak ke pos satpam gerbang tanpa ongkir.',
    ctaText: 'Gabung Rute Komplek',
    ctaHref: '/pilih-komplek',
    gradientBg: 'from-[#059669] via-[#047857] to-[#064E3B]',
    accentColor: '#6EE7B7',
    badgeEmoji: '🏘️',
    illustrationType: 'groupbuy',
  },
  {
    id: 'slide-3',
    tag: 'PORSI PAS ANTI-BUSUK',
    tagBg: 'bg-amber-900/40 text-amber-100 border-amber-400/40',
    headline: 'Takaran Pas 250gr, 500gr & 1kg',
    subheadline: 'Beli cabai, bawang & ubi madu secukupnya. Kulkas tetap rapi tanpa sisa sayur layu terbuang.',
    ctaText: 'Pilih Takaran Porsi',
    ctaHref: '#katalog',
    gradientBg: 'from-[#D97706] via-[#B45309] to-[#78350F]',
    accentColor: '#FDE68A',
    badgeEmoji: '🍠',
    illustrationType: 'cilembu',
  },
  {
    id: 'slide-4',
    tag: 'GARANSI TIMBANGAN JUJUR',
    tagBg: 'bg-sky-900/40 text-sky-100 border-sky-400/40',
    headline: 'Garansi Segar Sampai Pintu Dapur',
    subheadline: 'Sayur layu atau telur retak? Klaim kompensasi otomatis langsung masuk ke dompet belanja Anda.',
    ctaText: 'Lihat Bukti Sortir QC',
    ctaHref: '/track',
    gradientBg: 'from-[#0284C7] via-[#0369A1] to-[#0C4A6E]',
    accentColor: '#BAE6FD',
    badgeEmoji: '🛡️',
    illustrationType: 'guarantee',
  },
];

const PROMO_VOUCHERS = [
  {
    code: 'KOMPLEKHEMAT10',
    title: 'Cashback 10% Group-Buy Perumahan',
    desc: 'Min. belanja Rp40.000 untuk pengiriman kolektif ke pos satpam komplek aktif.',
    icon: Percent,
    validUntil: 'Setiap Hari s/d 20.00 WIB',
  },
  {
    code: 'ONGKIRNOLRUPIAH',
    title: 'Gratis Ongkir Gerbang Komplek',
    desc: 'Otomatis aktif tanpa syarat minimal belanja untuk rute klaster terjadwal.',
    icon: Truck,
    validUntil: 'Pengantaran Subuh 06.00-09.00',
  },
  {
    code: 'GARANSI25K',
    title: 'Klaim Penggantian Retur Instan Rp25.000',
    desc: 'Kompensasi saldo otomatis jika terdapat komoditas yang tidak sesuai standar QC.',
    icon: ShieldCheck,
    validUntil: 'Berlaku 1x24 jam sejak paket tiba',
  },
  {
    code: 'PORSIHEMAT3P',
    title: 'Paket Bundling Sembako Dapur',
    desc: 'Hemat Rp5.000 untuk pembelian kombinasi Beras Pandanwangi 5kg + Minyak Goreng 2L.',
    icon: Gift,
    validUntil: 'Katalog harian jam 16.00 - 20.00',
  },
];

export function PromoBannerSlider({ onOpenTour }: { onOpenTour?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const totalSlides = PROMO_SLIDES.length;

  // Auto-play timer (4.5s), pauses on hover
  useEffect(() => {
    if (isPaused || isPromoModalOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, isPromoModalOpen, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50) {
      handleNext(); // Swipe left -> next slide
    } else if (diff < -50) {
      handlePrev(); // Swipe right -> prev slide
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeSlideData = PROMO_SLIDES[currentSlide];

  return (
    <div className="relative w-full">
      {/* Main Slider Container (Tokopedia Hero Style) */}
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label="Promo Unggulan dan Informasi Dapur Pasundan"
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Slides Track */}
        <div className="relative h-[220px] sm:h-[260px] md:h-[290px] w-full">
          {PROMO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${totalSlides}`}
                className={`absolute inset-0 w-full h-full bg-gradient-to-r ${slide.gradientBg} transition-opacity duration-700 ease-in-out flex items-center justify-between px-5 sm:px-10 lg:px-14 select-none ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background decorative SVG circles */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden opacity-20">
                  <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white blur-3xl" />
                  <div className="absolute right-32 bottom-0 w-64 h-64 rounded-full bg-amber-300 blur-2xl" />
                </div>

                {/* Left Content Area (Headlines & CTA Button) */}
                <div className="relative z-10 max-w-xl text-white space-y-2 sm:space-y-3.5 pr-4">
                  {/* Promo Tag Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md border shadow-xs animate-in fade-in duration-300">
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                    <span>{slide.tag}</span>
                  </div>

                  {/* Headline (Tokopedia Font Weight) */}
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-xs">
                    {slide.headline}
                  </h2>

                  {/* Subheadline */}
                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed max-w-lg">
                    {slide.subheadline}
                  </p>

                  {/* CTA Button with Glow Effect */}
                  <div className="pt-1 sm:pt-2 flex items-center gap-2">
                    <Link
                      href={slide.ctaHref}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                    </Link>

                    {onOpenTour && (
                      <button
                        type="button"
                        onClick={onOpenTour}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-black/25 hover:bg-black/40 text-white rounded-xl text-xs font-bold backdrop-blur-xs border border-white/20 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Panduan Cara Belanja</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Visual Area (E-Commerce Illustration & Floating 3D Elements) */}
                <div className="relative hidden sm:flex items-center justify-center flex-shrink-0 w-56 md:w-72 h-full z-10">
                  <div className="relative flex items-center justify-center">
                    {/* Glowing circular backdrop */}
                    <div className="w-40 md:w-48 h-40 md:h-48 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl relative">
                      {/* Floating Main Emoji Badge */}
                      <span className="text-6xl md:text-7xl filter drop-shadow-lg transform hover:scale-110 transition-transform">
                        {slide.badgeEmoji}
                      </span>

                      {/* Floating secondary decorative elements */}
                      <div className="absolute -top-3 -right-2 bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 animate-bounce">
                        <Sparkles className="w-3 h-3" />
                        <span>Subuh 03.00</span>
                      </div>

                      <div className="absolute -bottom-2 -left-3 bg-white text-emerald-800 text-[10px] md:text-xs font-extrabold px-3 py-1 rounded-full shadow-lg border border-slate-100 flex items-center gap-1">
                        <span>✨ Segar Pasundan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular Left Chevron Button (Tokopedia Style) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Slide sebelumnya"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        {/* Circular Right Chevron Button (Tokopedia Style) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Slide berikutnya"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>

        {/* Bottom Left: Dots Indicators (Expanding Pill Style like Tokopedia) */}
        <div className="absolute left-5 sm:left-10 bottom-3 sm:bottom-4 flex items-center gap-1.5 z-20">
          {PROMO_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentSlide(dotIdx)}
              aria-label={`Buka slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                dotIdx === currentSlide
                  ? 'w-6 sm:w-7 bg-white shadow-sm'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Bottom Right: "Lihat Promo Lainnya" Pill Button (Tokopedia Signature) */}
        <button
          type="button"
          onClick={() => setIsPromoModalOpen(true)}
          className="absolute right-4 sm:right-8 bottom-3 sm:bottom-4 z-20 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white font-bold text-[10px] sm:text-xs backdrop-blur-md border border-white/20 transition-all shadow-sm flex items-center gap-1.5 hover:scale-102 cursor-pointer"
        >
          <Tag className="w-3.5 h-3.5 text-amber-300" />
          <span>Lihat Promo Lainnya</span>
        </button>
      </section>

      {/* Accessible Polite Live Announcement for Screen Readers */}
      <p className="sr-only" role="status" aria-live="polite">
        Menampilkan slide promosi {currentSlide + 1} dari {totalSlides}:{' '}
        {activeSlideData.headline}
      </p>

      {/* MODAL DIALOG: DAFTAR PROMO & VOUCHER KEBUTUHAN POKOK */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                  🎁
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black leading-tight">
                    Promo & Voucher Dapur Pasundan
                  </h3>
                  <p className="text-xs text-white/80">
                    Gunakan kode voucher saat checkout untuk hemat lebih banyak!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition cursor-pointer"
                aria-label="Tutup promo modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Voucher List Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 text-slate-800">
              {PROMO_VOUCHERS.map((voucher) => {
                const isCopied = copiedCode === voucher.code;
                const IconComponent = voucher.icon;

                return (
                  <div
                    key={voucher.code}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#4C9BD5] transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                            {voucher.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {voucher.validUntil}
                          </span>
                        </div>
                      </div>

                      {/* Copy code button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCode(voucher.code)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{voucher.code}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-10.5">
                      {voucher.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                *Otomatis terpotong langsung saat checkout
              </span>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup & Mulai Belanja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
