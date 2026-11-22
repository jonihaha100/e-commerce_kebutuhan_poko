'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/lib/pricing-engine';
import { X, Plus, Minus, Trash2, Users, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
    isGroupBuyEligible,
    projectedCashback,
    groupBuySlotsFilled,
    groupBuyTargetSlots,
    selectedCluster,
  } = useApp();

  if (!isOpen) return null;

  const quotaProgressPct = Math.min(100, Math.round((cartTotal / 40000) * 100));
  const remainingForQuota = Math.max(0, 40000 - cartTotal);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Keranjang Dapur</h2>
              <p className="text-xs text-stone-500">
                Tujuan: <span className="font-semibold text-emerald-700">{selectedCluster.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group-Buy Community Banner */}
          <div className="p-4 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Slot Komunitas Komplek ({groupBuySlotsFilled}/{groupBuyTargetSlots})
              </span>
              <span>Target: 10 Slot</span>
            </div>

            {/* Quota Progress Bar */}
            <div className="w-full bg-emerald-200/60 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${quotaProgressPct}%` }}
              />
            </div>

            {isGroupBuyEligible ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-white/80 p-2 rounded-lg border border-emerald-200">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  Selamat! Anda memenuhi syarat Cashback 10% (+{formatRupiah(projectedCashback)}) ke Dompet CRM.
                </span>
              </div>
            ) : (
              <p className="text-xs text-emerald-800">
                Tambah <span className="font-bold">{formatRupiah(remainingForQuota)}</span> lagi untuk membuka <b>Cashback 10%</b> & gratis ongkir komplek!
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 py-12">
                <div className="text-4xl mb-3">🧺</div>
                <p className="font-semibold text-stone-700">Keranjang masih kosong</p>
                <p className="text-xs text-stone-500 mt-1">Pilih komoditas segar harian dari katalog</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start justify-between gap-3 p-3 bg-stone-50 border border-stone-200/70 rounded-xl"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-stone-500">{item.product.unit}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-bold text-emerald-700">
                        {formatRupiah(item.price.sell_price_idr)}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        (Petani: {formatRupiah(item.price.farmer_split_idr)})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg p-1">
                      <button
                        onClick={() => updateQty(item.product.id, item.qty - 1)}
                        className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-stone-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.product.id, item.qty + 1)}
                        className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Belanja</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkir Drop Point Komplek</span>
                  <span className="font-semibold text-[#24B05A]">
                    {isGroupBuyEligible ? 'GRATIS (Group-Buy)' : formatRupiah(5000)}
                  </span>
                </div>
                {isGroupBuyEligible && (
                  <div className="flex justify-between text-[#1B8A44] font-bold bg-[#EBF7EE] p-2 rounded-lg">
                    <span>Estimasi Cashback Dompet (10%)</span>
                    <span>+{formatRupiah(projectedCashback)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Tagihan</span>
                  <span className="text-[#24B05A] text-base">{formatRupiah(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lanjut ke Pembayaran (Midtrans)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
