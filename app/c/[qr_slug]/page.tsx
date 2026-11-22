'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { initialClusters, Cluster } from '@/lib/mock-data';
import { MapPin, Users, Share2, Check, Copy, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function QRSlugClusterPage() {
  const params = useParams();
  const router = useRouter();
  const { setSelectedCluster } = useApp();

  const qrSlug = params.qr_slug as string;
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(2);

  useEffect(() => {
    const found = initialClusters.find((c) => c.qr_slug === qrSlug);
    if (found) {
      setCluster(found);
      setWaitlistCount(found.waitlist_count);
      if (found.status === 'ACTIVE') {
        // Automatically lock home_cluster_id to user session
        setSelectedCluster(found);
      }
    }
  }, [qrSlug, setSelectedCluster]);

  if (!cluster) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-xl font-bold text-stone-900">QR Code Komplek Tidak Ditemukan</h2>
        <p className="text-xs text-stone-500 mt-2">
          Slug <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">{qrSlug}</span> belum terdaftar di sistem Berkah Tani Sejahtera.
        </p>
        <Link
          href="/pilih-komplek"
          className="mt-6 inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          Lihat Daftar Komplek
        </Link>
      </div>
    );
  }

  const isWaitlist = cluster.status === 'WAITLIST';

  const handleShare = async () => {
    const shareData = {
      title: `Buka Rute Sayur & Sembako Murah di ${cluster.name}!`,
      text: `Hai tetangga ${cluster.name}! Yuk gabung kumpulkan 5 orang agar Berkah Tani Sejahtera membuka rute pengiriman sembako segar langsung dari petani tanpa ongkir ke komplek kita:`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard
        copyFallback();
      }
    } else {
      copyFallback();
    }
  };

  const copyFallback = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegisterWaitlist = () => {
    setRegistered(true);
    setWaitlistCount((prev) => prev + 1);
  };

  // ---------------------------------------------------------------------------
  // SCENARIO 1: ACTIVE CLUSTER (e.g. /c/antapani-indah)
  // ---------------------------------------------------------------------------
  if (!isWaitlist) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
          🏡
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Komplek Berhasil Terkunci
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Selamat Datang, Warga {cluster.name}!
        </h1>

        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
          Lokasi Anda otomatis dikunci ke titik kumpul{' '}
          <span className="font-semibold text-emerald-800">
            {cluster.delivery_mode === 'MOBILE_DROP_POINT' ? 'Mobil Drop Point Gerbang' : 'Mitra IRT Checkpoint'}
          </span>
          . Anda berhak mendapatkan harga panen petani langsung dan gratis ongkir komplek.
        </p>

        <div className="my-6 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs text-stone-600 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-stone-500">Titik Serah Terima:</span>
            <span className="font-bold text-stone-900 text-right">{cluster.address_notes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Jadwal Pengantaran:</span>
            <span className="font-bold text-emerald-700">Subuh 05:00 - 08:00 WIB</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Mulai Belanja Bahan Dapur Hari Ini</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCENARIO 2: WAITLIST CLUSTER (e.g. /c/buah-batu-regency)
  // ---------------------------------------------------------------------------
  const target = cluster.waitlist_target || 5;
  const progressPct = Math.min(100, Math.round((waitlistCount / target) * 100));

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
          ⏳
        </div>

        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
          Rute Segera Dibuka
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3 tracking-tight">
          Kumpulkan 5 Tetangga untuk Membuka Rute Gratis Ongkir
        </h1>

        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
          Warga <span className="font-bold text-stone-900">{cluster.name}</span> sedang menggalang antrean. Begitu kuota 5 rumah tangga terpenuhi, armada sayur subuh langsung meluncur ke gerbang komplek Anda!
        </p>

        {/* Progress Bar */}
        <div className="my-6 p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-left">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              Progres Antrean Warga
            </span>
            <span>
              {waitlistCount} dari {target} Tetangga
            </span>
          </div>

          <div className="w-full bg-amber-200/70 rounded-full h-3 overflow-hidden">
            <div
              className="bg-amber-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <p className="text-[11px] text-amber-800 mt-2 font-medium">
            Hanya butuh <b>{Math.max(0, target - waitlistCount)} tetangga lagi</b> untuk meluncurkan rute gratis ongkir!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!registered ? (
            <button
              onClick={handleRegisterWaitlist}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Daftarkan Rumah Saya ke Rute Ini</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Terima kasih! Rumah Anda telah terdaftar dalam antrean.
            </div>
          )}

          {/* Share Button (Native Web Share API + Fallback) */}
          <button
            onClick={handleShare}
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Berhasil Disalin! Bagikan ke Grup WA Komplek</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Ajak Tetangga Komplek via WhatsApp</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-200">
          <Link
            href="/pilih-komplek"
            className="text-xs text-stone-500 hover:text-stone-800 font-medium underline"
          >
            Bukan warga komplek ini? Pilih komplek lain
          </Link>
        </div>
      </div>
    </div>
  );
}
