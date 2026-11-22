'use client';

import './globals.css';
import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { CartSidebar } from '@/components/CartSidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

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
          <Navbar onOpenCart={() => setIsCartOpen(true)} />
          <main className="flex-1">{children}</main>
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
        </AppProvider>
      </body>
    </html>
  );
}
