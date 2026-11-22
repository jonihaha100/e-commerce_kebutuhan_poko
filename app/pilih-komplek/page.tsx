'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MapPin, CheckCircle2, Users, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function PilihKomplekPage() {
  const router = useRouter();
  const { clusters, selectedCluster, setSelectedCluster } = useApp();

  const handleSelect = (cluster: typeof clusters[0]) => {
    if (cluster.status === 'WAITLIST') {
      router.push(`/c/${cluster.qr_slug}`);
      return;
    }
    setSelectedCluster(cluster);
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-3">
          <MapPin className="w-3.5 h-3.5" />
          Geofencing Hyperlocal Bandung
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Pilih Lokasi Komplek Perumahan Anda
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
          Pengiriman sembako panen subuh gratis ongkir melalui titik kumpul terkoordinasi (Mitra IRT atau Mobile Drop Point).
        </p>
      </div>

      <div className="space-y-4">
        {clusters.map((cluster) => {
          const isSelected = selectedCluster.id === cluster.id;
          const isWaitlist = cluster.status === 'WAITLIST';

          return (
            <div
              key={cluster.id}
              onClick={() => handleSelect(cluster)}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-md'
                  : 'border-stone-200 bg-white hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    isWaitlist
                      ? 'bg-amber-100 text-amber-800'
                      : isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {isWaitlist ? '⏳' : '🏡'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">{cluster.name}</h3>
                    {isWaitlist ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
                        Waitlist Rute
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Aktif
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-500 mt-1">{cluster.address_notes}</p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-stone-600">
                    <span className="font-semibold text-emerald-800">
                      Mode:{' '}
                      {cluster.delivery_mode === 'MOBILE_DROP_POINT'
                        ? 'Mobil Drop Point Gerbang'
                        : cluster.delivery_mode === 'MITRA_IRT_CHECKPOINT'
                        ? 'Mitra IRT Checkpoint'
                        : 'Menunggu Kuota Warga'}
                    </span>
                    <span className="text-stone-300">•</span>
                    <Link
                      href={`/c/${cluster.qr_slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-stone-400 hover:text-emerald-700 flex items-center gap-1 text-[11px]"
                    >
                      <QrCode className="w-3 h-3" />
                      /c/{cluster.qr_slug}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto flex justify-end">
                {isWaitlist ? (
                  <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 w-full sm:w-auto justify-center">
                    <Users className="w-3.5 h-3.5" />
                    Buka Rute Warga
                  </button>
                ) : isSelected ? (
                  <span className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Terpilih
                  </span>
                ) : (
                  <button className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 w-full sm:w-auto justify-center">
                    <span>Pilih Komplek</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
