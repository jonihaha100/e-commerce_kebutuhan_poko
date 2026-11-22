'use client';

import './globals.css';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { CartSidebar } from '@/components/CartSidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="id">
      <head>
        <title>Berkah Tani Sejahtera | Agri-Commerce Bandung</title>
        <meta
          name="description"
          content="Platform hyperlocal kebutuhan pokok & sembako langsung dari petani hulu berbasis klaster perumahan di Bandung."
        />
      </head>
      <body className="min-h-screen bg-stone-50 flex flex-col">
        <AppProvider>
          {/* Tampilkan Navbar Toko Belanja HANYA untuk portal Pelanggan/Warga, BUKAN di modul Admin */}
          {!isAdminRoute && <Navbar onOpenCart={() => setIsCartOpen(true)} />}

          <main className="flex-1">{children}</main>

          {/* Keranjang Belanja Toko Warga HANYA aktif untuk rute Pelanggan */}
          {!isAdminRoute && <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}

          {/* Footer Toko Warga HANYA aktif di portal Pelanggan */}
          {!isAdminRoute && (
            <footer className="bg-white border-t border-stone-200 py-8 px-4 text-center text-xs text-stone-500">
              <div className="max-w-7xl mx-auto space-y-2">
                <p className="font-semibold text-stone-700">
                  Berkah Tani Sejahtera — Landasan E-Commerce Agrojaya Global Indo
                </p>
                <p>
                  Rantai Pasok Pangan Terintegrasi • Pilot Perumahan Bandung (Antapani • Arcamanik • Buah Batu)
                </p>
                <p className="text-[11px] text-stone-400">
                  Zona Waktu Operasional: Asia/Jakarta (WIB) • Proteksi Pagar Anti-ATM & Row Level Security
                </p>
              </div>
            </footer>
          )}
        </AppProvider>
      </body>
    </html>
  );
}
