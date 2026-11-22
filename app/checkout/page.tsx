'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { initialProducts, initialCatalogPrices } from '@/lib/mock-data';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Wallet,
  ArrowRight,
  Lock,
  Building,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, selectedCluster, currentUser, isGroupBuyEligible, projectedCashback, addNewOrder } = useApp();

  // Fallback to sample items if cart is empty for immediate demonstration
  const effectiveCart = cart.length > 0 ? cart : [
    { product: initialProducts[0], price: initialCatalogPrices[0], qty: 1 },
    { product: initialProducts[1], price: initialCatalogPrices[1], qty: 3 },
  ];
  const effectiveCartTotal = effectiveCart.reduce((sum, item) => sum + item.price.sell_price_idr * item.qty, 0);

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone || '081234567894');
  const [houseAddress, setHouseAddress] = useState('Blok C No. 14, RT 03/RW 08');
  const [deliverySlot, setDeliverySlot] = useState('Pagi (05:00 - 08:00 WIB)');
  const [useWalletBalance, setUseWalletBalance] = useState(false);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'BCA_VA' | 'MANDIRI_VA' | 'COD'>('QRIS');

  // Modal Snap Midtrans Simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSnapModal, setShowSnapModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('ORD-2026-BNDG-001');

  // Wallet deduction calculation
  const walletDeduction = useWalletBalance ? Math.min(25000, effectiveCartTotal) : 0;
  const shippingCost = effectiveCartTotal >= 40000 ? 0 : 5000;
  const grandTotal = Math.max(0, effectiveCartTotal - walletDeduction + shippingCost);

  const handleTriggerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Generate random Order Number
    const generatedOrderNo = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderNumber(generatedOrderNo);

    // Simulate Midtrans Snap popup opening
    setTimeout(() => {
      setIsProcessing(false);
      setShowSnapModal(true);
    }, 600);
  };

  const handleConfirmMidtransPayment = () => {
    setPaymentSuccess(true);
    const newOrderObj = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      cycle_id: 'd1',
      cluster_id: selectedCluster.id,
      cluster_name: selectedCluster.name,
      customer_id: currentUser.id,
      customer_name: fullName,
      customer_phone: phone,
      customer_address: houseAddress,
      items: effectiveCart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        portion_label: item.product.unit,
        qty: item.qty,
        unit_price: item.price.sell_price_idr,
      })),
      total_amount_idr: grandTotal,
      payment_status: 'PAID' as const,
      delivery_status: 'SCHEDULED' as const,
      is_group_buy_qualified: isGroupBuyEligible,
      cashback_amount_idr: projectedCashback,
      delivery_slot: 'Besok 06.00 - 09.00 WIB',
      created_at: new Date().toISOString(),
    };
    addNewOrder(newOrderObj);

    setTimeout(() => {
      setShowSnapModal(false);
      clearCart();
      router.push(`/track?orderId=${orderNumber}`);
    }, 2000);
  };


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-[#78350F] uppercase tracking-wider">
          Payment Gateway Terintegrasi (Sandbox Midtrans)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] mt-1 tracking-tight">
          Penyelesaian Pesanan Dapur
        </h1>
        <p className="text-xs text-[#57534E] mt-1">
          Pengantaran terkoordinasi ke komplek <b className="text-[#15803D]">{selectedCluster.name}</b>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Customer Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Truck className="w-5 h-5 text-[#15803D]" />
            <h2 className="text-base font-bold text-stone-900">Informasi Pengantaran Komplek</h2>
          </div>

          <form id="checkout-form" onSubmit={handleTriggerPayment} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Komplek Drop Point Terkunci</label>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 flex items-center justify-between">
                <div>
                  <span className="font-bold block">{selectedCluster.name}</span>
                  <span className="text-[11px] text-stone-500">{selectedCluster.address_notes}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                  {selectedCluster.delivery_mode}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Detail Blok & Nomor Rumah</label>
              <input
                type="text"
                value={houseAddress}
                onChange={(e) => setHouseAddress(e.target.value)}
                placeholder="Contoh: Blok B No. 12, RT 04"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Pilihan Slot Pengantaran Subuh</label>
              <select
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Pagi (05:00 - 08:00 WIB)">Pagi Subuh (05:00 - 08:00 WIB) - Siap untuk Masak Pagi</option>
                <option value="Siang (10:00 - 12:00 WIB)">Siang (10:00 - 12:00 WIB) - Pengantaran Drop Point Siang</option>
              </select>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <label className="block font-bold text-stone-700">Pilih Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'QRIS', label: 'QRIS Instant (GoPay / ShopeePay / Dana)', icon: '📱' },
                  { id: 'BCA_VA', label: 'BCA Virtual Account', icon: '🏦' },
                  { id: 'MANDIRI_VA', label: 'Mandiri Virtual Account', icon: '💳' },
                  { id: 'COD', label: 'COD Titip Mitra IRT Terverifikasi', icon: '🤝' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-2.5 ${
                      paymentMethod === m.id
                        ? 'border-[#15803D] bg-emerald-50/50 font-bold'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-stone-900 leading-tight">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Midtrans Trigger */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] shadow-sm space-y-5">
          <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
            Ringkasan Tagihan Dapur
          </h2>

          {/* Cart items preview */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {effectiveCart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-xs py-1">
                <div>
                  <span className="font-bold text-stone-800">{item.product.name}</span>
                  <span className="text-stone-400 block text-[11px]">{item.qty} × {formatRupiah(item.price.sell_price_idr)}</span>
                </div>
                <span className="font-bold text-stone-900">
                  {formatRupiah(item.price.sell_price_idr * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Wallet deduction toggle */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#15803D]" />
              <div>
                <span className="font-bold text-emerald-950 block">Gunakan Saldo Dompet CRM</span>
                <span className="text-[11px] text-emerald-700">Tersedia: {formatRupiah(25000)}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={useWalletBalance}
              onChange={(e) => setUseWalletBalance(e.target.checked)}
              className="w-4 h-4 text-[#15803D] rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Price Breakdown */}
          <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
            <div className="flex justify-between">
              <span>Subtotal Belanja</span>
              <span className="font-semibold text-stone-900">{formatRupiah(effectiveCartTotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Ongkir Drop Point Komplek</span>
              <span className="font-semibold text-emerald-700">
                {isGroupBuyEligible ? 'GRATIS (Group-Buy)' : formatRupiah(5000)}
              </span>
            </div>

            {useWalletBalance && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Potongan Saldo Dompet</span>
                <span>-{formatRupiah(walletDeduction)}</span>
              </div>
            )}

            {isGroupBuyEligible && (
              <div className="flex justify-between text-amber-700 font-bold bg-amber-50 p-2 rounded-xl">
                <span>Bonus Cashback 10% (Setelah Jam 20:00)</span>
                <span>+{formatRupiah(projectedCashback)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Tagihan Akhir</span>
              <span className="text-xl text-[#24B05A]">{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#24B05A] hover:bg-[#1B8A44] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{isProcessing ? 'Menyiapkan Gateway...' : 'Bayar Sekarang (Midtrans Gateway)'}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#24B05A]" />
            <span>Enkripsi 256-bit Sandbox Midtrans & Garansi Kualitas ≤ Rp25.000</span>
          </div>
        </div>
      </div>

      {/* MIDTRANS SNAP SIMULATION MODAL */}
      {showSnapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="text-center pb-4 border-b border-slate-100 flex flex-col items-center">
              <img src="/brand-logo.png" alt="Logo" className="w-12 h-12 object-contain rounded-full border-2 border-[#4C9BD5] mb-2 p-0.5" />
              <span className="text-[10px] font-mono bg-sky-50 text-[#0284C7] border border-sky-200 px-2.5 py-0.5 rounded font-bold">
                Midtrans Snap Sandbox Gateway
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Konfirmasi Pembayaran
              </h3>
              <p className="text-xs text-slate-500 font-mono">No. Pesanan: {orderNumber}</p>
            </div>

            <div className="my-5 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1 border border-slate-100">
                <span className="text-xs text-slate-500">Total Nominal Pembayaran</span>
                <div className="text-2xl font-black text-[#24B05A]">
                  {formatRupiah(grandTotal)}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Metode: {paymentMethod}</span>
              </div>

              {paymentMethod === 'QRIS' && (
                <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center">
                  <div className="w-36 h-36 bg-[#0F172A] text-white mx-auto flex items-center justify-center rounded-xl mb-2 text-5xl">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                  <span className="text-[11px] text-slate-500">Scan QRIS menggunakan GoPay, OVO, atau Mobile Banking</span>
                </div>
              )}

              {paymentSuccess ? (
                <div className="p-4 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#24B05A]" />
                  <span>Pembayaran Terverifikasi! Mengalihkan ke pelacakan...</span>
                </div>
              ) : (
                <button
                  onClick={handleConfirmMidtransPayment}
                  className="w-full py-3 bg-[#24B05A] hover:bg-[#1B8A44] text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasi Bayar Berhasil (Sandbox)</span>
                </button>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowSnapModal(false)}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
