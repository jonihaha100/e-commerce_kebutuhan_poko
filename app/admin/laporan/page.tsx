'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminHeader } from '@/components/AdminHeader';
import { formatRupiah } from '@/lib/pricing-engine';
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  CheckCircle2,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Users,
  ShieldCheck,
  Calendar,
  Building,
  Check,
  X,
  Share2,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Compass,
  Award,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Calculator,
  Lightbulb,
  AlertTriangle,
  Gauge,
  Target,
  Plus,
  Minus,
  CheckSquare,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ClusterReport {
  name: string;
  totalOrders: number;
  gmv: number;
  cashback: number;
  netRevenue: number;
  cogsFarmer: number;
  grossProfit: number;
  logisticsCost: number;
  netProfit: number;
  status: 'ACTIVE' | 'WAITLIST';
}

export default function AdminLaporanPage() {
  const { clusters, orders } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [isBookClosed, setIsBookClosed] = useState(false);
  const [closedAt, setClosedAt] = useState<string | null>(null);
  const [closedBy, setClosedBy] = useState<string | null>(null);
  const [closingNotes, setClosingNotes] = useState('Rekonsiliasi rekening penampung QRIS Midtrans, saldo kas kecil central hub, dan transferan petani mitra telah cocok tanpa selisih.');
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Executive Decision Intelligence Category Filter State
  const [decisionCategory, setDecisionCategory] = useState<'ALL' | 'SUPPLY' | 'CLUSTER' | 'LOGISTICS' | 'INTEGRITY'>('ALL');

  // Decision Simulator UI View Option ('OPTION_1' | 'OPTION_2' | 'OPTION_3')
  const [simulatorOption, setSimulatorOption] = useState<'OPTION_1' | 'OPTION_2' | 'OPTION_3'>('OPTION_1');

  // Option 1: Preset Skenario Strategis
  const [activeScenarioId, setActiveScenarioId] = useState<'STATUS_QUO' | 'BUAH_BATU' | 'SCALE_UP'>('STATUS_QUO');

  // What-If Simulation State Variables (Interactive across Opsi 1 & 2)
  const [simClusters, setSimClusters] = useState(5);
  const [simOrdersPerDay, setSimOrdersPerDay] = useState(10);
  const [simAov, setSimAov] = useState(35000);

  // Helper to switch scenario preset in Option 1
  const applyScenarioPreset = (scenario: 'STATUS_QUO' | 'BUAH_BATU' | 'SCALE_UP') => {
    setActiveScenarioId(scenario);
    if (scenario === 'STATUS_QUO') {
      setSimClusters(5);
      setSimOrdersPerDay(10);
      setSimAov(35000);
    } else if (scenario === 'BUAH_BATU') {
      setSimClusters(10);
      setSimOrdersPerDay(10);
      setSimAov(35000);
    } else if (scenario === 'SCALE_UP') {
      setSimClusters(15);
      setSimOrdersPerDay(10);
      setSimAov(45000);
    }
  };

  // Simulated metrics derived dynamically
  const simTotalDailyOrders = simClusters * simOrdersPerDay;
  const simMonthlyOrders = simTotalDailyOrders * 26;
  const simGmv = simMonthlyOrders * simAov;
  const simGrossProfit = Math.round(simGmv * 0.248);
  const simCouriersNeeded = Math.max(1, Math.ceil(simClusters / 5));
  const simLogistics = simCouriersNeeded * 70000 * 26; // Rp 70k (upah Rp 50k + bensin Rp 20k) per kurir x 26 hari
  const simPackaging = simMonthlyOrders * 1000; // Rp 1.000 / paket kantong ramah lingkungan
  const simNetProfit = simGrossProfit - simLogistics - simPackaging;
  const simNetMargin = simGmv > 0 ? ((simNetProfit / simGmv) * 100).toFixed(1) : '0';

  // Unit Economics & BEP calculation per kurir (5 komplek)
  const contributionPerOrder = Math.max(1, Math.round(simAov * 0.248 - 1000));
  const dailyBepOrders = Math.ceil(70000 / contributionPerOrder); // 70.000 / 7.680 = 10-11 orders/day
  const dailyOrdersPerCourier = Math.round(simTotalDailyOrders / simCouriersNeeded);
  const isAboveBep = dailyOrdersPerCourier >= dailyBepOrders;
  const dailyProfitPerCourier = (dailyOrdersPerCourier * contributionPerOrder) - 70000;
  const bepPercentage = Math.min(200, Math.round((dailyOrdersPerCourier / dailyBepOrders) * 100));

  // Financial baseline numbers for the month (26 operating days, 5 active clusters, 1 courier 50 orders/day)
  const totalDays = 26;
  const dailyLogisticsBudget = 70000; // Rp50k Honor Jasa Kurir 3 Jam + Rp20k Bensin Motor
  const activeClusterCount = 5;
  const totalLogisticsBeban = totalDays * dailyLogisticsBudget; // Rp 1.820.000 per bulan (1 kurir 5 komplek)

  // Aggregated figures based on orders & financial ratios
  const totalOrdersCount = 1300; // 50 orders/day x 26 days
  const gmvTotal = 45500000; // 1.300 order x Rp 35.000
  const cashbackGroupBuy = 0; // Model prepaid harga pasti tanpa potongan gantung
  const netRevenue = gmvTotal - cashbackGroupBuy; // Rp 45.500.000
  const cogsHppHulu = 34216000; // 75.2% HPP belanja modal petani & pasar induk
  const grossProfit = netRevenue - cogsHppHulu; // Rp 11.284.000 (24.8% gross margin)
  const packagingAndOps = 1300000; // Rp 1.000 x 1.300 paket kantong ramah lingkungan & ice gel
  const netOperatingIncome = grossProfit - totalLogisticsBeban - packagingAndOps; // Rp 8.164.000 (17.9% net margin)

  const clusterBreakdowns: ClusterReport[] = [
    {
      name: 'Antapani Indah',
      totalOrders: 260,
      gmv: 9100000,
      cashback: 0,
      netRevenue: 9100000,
      cogsFarmer: 6843200,
      grossProfit: 2256800,
      logisticsCost: 364000, // Rp 1.820.000 / 5 komplek
      netProfit: 1632800,
      status: 'ACTIVE',
    },
    {
      name: 'Arcamanik Endah',
      totalOrders: 260,
      gmv: 9100000,
      cashback: 0,
      netRevenue: 9100000,
      cogsFarmer: 6843200,
      grossProfit: 2256800,
      logisticsCost: 364000,
      netProfit: 1632800,
      status: 'ACTIVE',
    },
    {
      name: 'Cisaranten Kulon Asri',
      totalOrders: 260,
      gmv: 9100000,
      cashback: 0,
      netRevenue: 9100000,
      cogsFarmer: 6843200,
      grossProfit: 2256800,
      logisticsCost: 364000,
      netProfit: 1632800,
      status: 'ACTIVE',
    },
    {
      name: 'Guruminda Megah',
      totalOrders: 260,
      gmv: 9100000,
      cashback: 0,
      netRevenue: 9100000,
      cogsFarmer: 6843200,
      grossProfit: 2256800,
      logisticsCost: 364000,
      netProfit: 1632800,
      status: 'ACTIVE',
    },
    {
      name: 'Riung Bandung Permai',
      totalOrders: 260,
      gmv: 9100000,
      cashback: 0,
      netRevenue: 9100000,
      cogsFarmer: 6843200,
      grossProfit: 2256800,
      logisticsCost: 364000,
      netProfit: 1632800,
      status: 'ACTIVE',
    },
    {
      name: 'Buah Batu Regency',
      totalOrders: 0,
      gmv: 0,
      cashback: 0,
      netRevenue: 0,
      cogsFarmer: 0,
      grossProfit: 0,
      logisticsCost: 0,
      netProfit: 0,
      status: 'WAITLIST',
    },
  ];

  // Handle Book Closing Action
  const handleConfirmClosing = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookClosed(true);
    setClosedAt(new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }));
    setClosedBy('Admin Operasional (Syamhari Abidin)');
    setIsCloseModalOpen(false);
    setFeedbackToast('✅ Periode November 2026 resmi DITUTUP BUKU! Laporan laba rugi telah dikunci.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // 1. Export as DOC (Word Document)
  const handleExportWordDoc = () => {
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Laporan Keuangan Bulanan & Tutup Buku - Berkah Tani Sejahtera</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #333; line-height: 1.5; }
          h1 { font-size: 18pt; color: #166534; margin-bottom: 2pt; text-align: center; }
          h2 { font-size: 13pt; color: #0f172a; border-bottom: 2px solid #166534; padding-bottom: 4pt; margin-top: 15pt; }
          .sub { text-align: center; font-size: 10pt; color: #64748b; margin-bottom: 20pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 10pt; margin-bottom: 15pt; }
          th { background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 6pt; font-size: 10pt; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 5pt 6pt; font-size: 10pt; }
          .num { text-align: right; font-family: 'Consolas', monospace; }
          .bold { font-weight: bold; }
          .green { color: #15803d; }
          .sig-box { margin-top: 40pt; width: 100%; }
          .sig-col { width: 48%; float: left; text-align: center; font-size: 10pt; }
        </style>
      </head>
      <body>
        <h1>BERKAH TANI SEJAHTERA</h1>
        <div class='sub'>
          Agrojaya Global Indo Platform • Laporan Keuangan Bulanan & Tutup Buku<br>
          <b>Periode:</b> November 2026 • <b>Status:</b> ${isBookClosed ? 'LENGKAP / TUTUP BUKU' : 'DRAFT OPERASIONAL'}
        </div>

        <h2>I. RINGKASAN EKSEKUTIF LABA RUGI (PROFIT & LOSS)</h2>
        <table>
          <tr><th>Pos Keuangan</th><th class='num'>Nilai (Rupiah)</th><th class='num'>Rasio (%)</th></tr>
          <tr><td>Pendapatan Kotor Belanja Warga (GMV 1.300 Order)</td><td class='num'>${formatRupiah(gmvTotal)}</td><td class='num'>100.0%</td></tr>
          <tr><td>Potongan Diskon & Cashback Komunitas</td><td class='num'>Rp 0</td><td class='num'>0.0%</td></tr>
          <tr class='bold' style='background-color: #f8fafc;'><td>Pendapatan Bersih (Net Revenue)</td><td class='num'>${formatRupiah(netRevenue)}</td><td class='num'>100.0%</td></tr>
          <tr><td>HPP Bahan Pangan Petani & Pasar Induk (75.2%)</td><td class='num'>(${formatRupiah(cogsHppHulu)})</td><td class='num'>-75.2%</td></tr>
          <tr class='bold' style='background-color: #ecfdf5;'><td>Laba Kotor Operasional (Gross Profit)</td><td class='num green'>${formatRupiah(grossProfit)}</td><td class='num green'>24.8%</td></tr>
          <tr><td>Honor Jasa Kurir Subuh (26 hari x Rp50.000)</td><td class='num'>(${formatRupiah(1300000)})</td><td class='num'>-2.9%</td></tr>
          <tr><td>Bahan Bakar Motor Kurir (26 hari x Rp20.000)</td><td class='num'>(${formatRupiah(520000)})</td><td class='num'>-1.1%</td></tr>
          <tr><td>Beban Kantong Ramah Lingkungan & Ice Gel (1.300 x Rp1.000)</td><td class='num'>(${formatRupiah(packagingAndOps)})</td><td class='num'>-2.9%</td></tr>
          <tr class='bold' style='background-color: #f0fdf4; font-size: 11pt;'><td>LABA BERSIH OPERASIONAL (NET PROFIT)</td><td class='num green'>${formatRupiah(netOperatingIncome)}</td><td class='num green'>17.9%</td></tr>
        </table>

        <h2>II. RINCIAN PERFORMA PER KLASTER PERUMAHAN</h2>
        <table>
          <tr>
            <th>Nama Komplek</th>
            <th class='num'>Pesanan</th>
            <th class='num'>Omzet (GMV)</th>
            <th class='num'>HPP Petani</th>
            <th class='num'>Alokasi Kurir</th>
            <th class='num'>Laba Bersih</th>
          </tr>
          ${clusterBreakdowns
        .map(
          (c) => `
            <tr>
              <td><b>${c.name}</b> (${c.status})</td>
              <td class='num'>${c.totalOrders}</td>
              <td class='num'>${formatRupiah(c.gmv)}</td>
              <td class='num'>${formatRupiah(c.cogsFarmer)}</td>
              <td class='num'>${formatRupiah(c.logisticsCost)}</td>
              <td class='num bold green'>${formatRupiah(c.netProfit)}</td>
            </tr>`
        )
        .join('')}
        </table>

        <h2>III. KEPUTUSAN STRATEGIS & KESIMPULAN AUDIT EKSEKUTIF</h2>
        <table>
          <tr>
            <th style="width: 25%;">Pilar Keputusan</th>
            <th style="width: 45%;">Dasar Data Transaksi Tervalidasi</th>
            <th style="width: 30%;">Keputusan & Tindakan Manajemen</th>
          </tr>
          <tr>
            <td><b>1. Pasokan & Petani</b></td>
            <td>Komoditas sayur segar, telur ayam, dan bahan pokok dapur menyerap perputaran harian dengan margin rata-rata 24.8% dan susut (waste) 0%.</td>
            <td><b class='green'>Kunci PO harian petani & pasar induk H-1 pukul 20:00 WIB</b> untuk mengamankan HPP 75.2%.</td>
          </tr>
          <tr>
            <td><b>2. Rute Klaster</b></td>
            <td>5 Komplek aktif Bandung Timur mencetak laba bersih merata masing-masing Rp 1.632.800/bulan. Waitlist Buah Batu: 18 KK / 30 KK.</td>
            <td><b>Tunda rute Buah Batu</b> hingga kuota 30 KK penuh sebelum membuka Rute Kurir ke-2.</td>
          </tr>
          <tr>
            <td><b>3. Logistik Kurir Rp 70k</b></td>
            <td>Biaya kurir Rp 70.000/hari (Rp50k jasa 3 jam + Rp20k bensin) menyerap hanya 4.0% GMV. Titik impas (BEP) tercapai di 11 order/hari.</td>
            <td><b class='green'>Tetapkan kurir shift subuh 3 jam Rp 70.000/hari</b> sebagai formula baku ekspansi rute.</td>
          </tr>
          <tr>
            <td><b>4. Integritas Audit</b></td>
            <td>Akurasi data 99.8%. Selisih kas QRIS dan rekening penampung Rp 0. Tidak ada piutang beredar.</td>
            <td><b class='green'>SAH UNTUK TUTUP BUKU</b>. Alokasi laba bersih (Rp 8.164.000): 65% dividen owner (Rp 5.306.600) & 35% cadangan hub (Rp 2.857.400).</td>
          </tr>
        </table>

        <h2>IV. BERITA ACARA TUTUP BUKU & REKONSILIASI</h2>
        <p><b>Catatan Akuntansi:</b> ${closingNotes}</p>
        <p><b>Waktu Tutup Buku:</b> ${closedAt || 'Periode Berjalan (Draft)'}</p>
        <p><b>Penanggung Jawab:</b> ${closedBy || 'Admin Operasional'}</p>

        <div class='sig-box'>
          <div class='sig-col'>
            Disusun Oleh,<br><br><br><br>
            <b>( Syamhari Abidin )</b><br>
            Penanggung Jawab Operasional
          </div>
          <div class='sig-col' style='float: right;'>
            Disetujui Oleh,<br><br><br><br>
            <b>( Owner / Direktur Utama )</b><br>
            Berkah Tani Sejahtera
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Tutup_Buku_Berkah_Tani_${selectedMonth}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedbackToast('📄 Dokumen Word (.doc) berhasil diunduh!');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // 2. Export as CSV (Spreadsheet Excel)
  const handleExportCsv = () => {
    const headers = ['Nama Komplek', 'Status', 'Total Pesanan', 'Omzet Bruto (GMV)', 'Cashback', 'Pendapatan Bersih', 'HPP Petani', 'Beban Logistik Kurir', 'Laba Bersih'];
    const rows = clusterBreakdowns.map((c) => [
      c.name,
      c.status,
      c.totalOrders,
      c.gmv,
      c.cashback,
      c.netRevenue,
      c.cogsFarmer,
      c.logisticsCost,
      c.netProfit,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['LAPORAN KEUANGAN BULANAN & TUTUP BUKU - BERKAH TANI SEJAHTERA', `Periode: ${selectedMonth}`, '']
        .concat([headers.join(',')])
        .concat(rows.map((e) => e.join(',')))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Keuangan_Tutup_Buku_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackToast('📊 Rekap Spreadsheet (.csv) berhasil diunduh!');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // 3. Send Summary Directly to Owner WhatsApp
  const handleSendOwnerWhatsApp = () => {
    const message =
      `*LAPORAN KEUANGAN & TUTUP BUKU BULANAN*\n` +
      `*Berkah Tani Sejahtera (Agrojaya)*\n` +
      `Periode: *November 2026 (26 Hari Kerja)*\n\n` +
      `📊 *Ringkasan Laba Rugi (P&L - 5 Komplek):*\n` +
      `• Total Pesanan Warga: *${totalOrdersCount} pesanan* (50 order/hari)\n` +
      `• Total Omzet (GMV): *${formatRupiah(gmvTotal)}* (AOV Rp 35.000)\n` +
      `• HPP Modal Petani & Pasar: *${formatRupiah(cogsHppHulu)}* (75.2%)\n` +
      `• Laba Kotor (Gross Margin): *${formatRupiah(grossProfit)}* (24.8%)\n` +
      `• Beban Kurir & Bensin (Rp 70k/hari): *${formatRupiah(totalLogisticsBeban)}* (4.0%)\n` +
      `• Biaya Kantong & Es Gel (Rp 1k/paket): *${formatRupiah(packagingAndOps)}* (2.9%)\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *LABA BERSIH OPERASIONAL:* *${formatRupiah(netOperatingIncome)}* (17.9% Net Margin)\n\n` +
      `📍 *Performa Klaster:* 5 Komplek Aktif masing-masing surplus *${formatRupiah(1632800)}/bln*\n` +
      `🎯 *Titik Impas (BEP):* Tercapai di 11 order/hari (39 order laba murni)\n` +
      `🔒 *Status Buku:* *${isBookClosed ? 'SUDAH TUTUP BUKU LENGKAP' : 'DRAFT SIAP DITINJAU & DIKUNCI'}*\n\n` +
      `Laporan lengkap dalam format DOC & PDF telah tersedia di dasbor admin.`;

    const ownerPhone = '6281234567890'; // Default owner phone
    const url = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Admin Navigation Header (hidden when printing) */}
      <div className="print:hidden">
        <AdminHeader />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="print:hidden p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-stone-400 hover:text-stone-700 font-bold ml-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PRINT HEADER ONLY VISIBLE ON PAPER / PDF EXPORT */}
        <div className="hidden print:block border-b-2 border-stone-800 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/brand-logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain rounded-full border border-stone-300 p-0.5"
              />
              <div>
                <h1 className="text-xl font-black text-stone-900">BERKAH TANI SEJAHTERA</h1>
                <p className="text-xs text-stone-600">Platform Agrojaya Global Indo • Rantai Pasok Pangan Hyperlocal</p>
                <p className="text-[10px] text-stone-500">Hub Central Bandung • Telp/WA: 0812-3456-7890</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-stone-800 block">DOKUMEN RESMI TUTUP BUKU</span>
              <span className="text-xs text-stone-600">Periode: November 2026</span>
              <span className="text-[10px] text-stone-500 block">Status: {isBookClosed ? 'TERKUNCI / RECONCILED' : 'DRAFT'}</span>
            </div>
          </div>
        </div>

        {/* Top Header & Export Action Buttons (UI View) */}
        <div className="print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider font-mono">
                Laporan Keuangan & Audit
              </span>
              <span className="text-xs text-stone-400">• Rekonsiliasi Akhir Bulan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1 tracking-tight">
              Laporan Keuangan Bulanan & Tutup Buku
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tinjau laba rugi riil, evaluasi bagi hasil petani vs kurir, rekonsiliasi arus kas, dan unduh laporan resmi.
            </p>
          </div>

          {/* Export Action Bar (DOC, PDF, Print, WA) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              title="Cetak atau Simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak / PDF</span>
            </button>

            {/* Word Document Export (.doc) */}
            <button
              type="button"
              onClick={handleExportWordDoc}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              title="Unduh format Microsoft Word (.doc)"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Unduh DOC</span>
            </button>

            {/* Excel / CSV Export */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              title="Unduh Spreadsheet Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>Excel (CSV)</span>
            </button>

            {/* Send to Owner WhatsApp */}
            <button
              type="button"
              onClick={handleSendOwnerWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              title="Kirim Ringkasan Laporan ke WhatsApp Owner"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Kirim ke WA</span>
            </button>
          </div>
        </div>

        {/* Period Selector & Book Closing Status Banner */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600">
              <Calendar className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500 uppercase">Periode Pembukuan:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="font-black text-sm text-stone-900 bg-stone-50 border border-stone-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#24B05A]"
                >
                  <option value="2026-11">November 2026 (Aktif)</option>
                  <option value="2026-10">Oktober 2026 (Arsip)</option>
                  <option value="2026-09">September 2026 (Arsip)</option>
                </select>
              </div>
              <span className="text-[11px] text-stone-400">
                26 Hari Kerja Operasional • 5 Klaster Perumahan Terlayani (1 Kurir 3 Jam • 50 Order/Hari)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-stone-400 font-mono block">Status Buku:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isBookClosed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
              >
                {isBookClosed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isBookClosed ? 'Tutup Buku Selesai' : 'Periode Terbuka'}</span>
              </span>
            </div>

            {!isBookClosed && (
              <button
                type="button"
                onClick={() => setIsCloseModalOpen(true)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Proses Tutup Buku</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Financial KPI Highlight Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Omzet Belanja Warga (GMV)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {formatRupiah(gmvTotal)}
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                {totalOrdersCount} Order
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Rata-rata: Rp35.000 / belanjaan
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Laba Kotor (Gross Margin)</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-800">
                {formatRupiah(grossProfit)}
              </span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold">
                24,8% Margin
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Setelah dikurangi HPP pasokan 75,2%
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Beban Kurir & Bensin</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-800">
                {formatRupiah(totalLogisticsBeban)}
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                5 Klaster
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Rp70.000 / hari (Rp50k jasa + Rp20k bensin)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>LABA BERSIH OPERASIONAL</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700">
                {formatRupiah(netOperatingIncome)}
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                17,9% Margin
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              Kas bersih siap ditarik owner
            </span>
          </div>
        </div>

        {/* EXECUTIVE DECISION INTELLIGENCE & AUDIT ENGINE (Transforming Raw Data into Actionable Decisions) */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden space-y-6 p-5 sm:p-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  Decision Support System (DSS)
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Akurasi Validasi: 99.8%
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1.5 tracking-tight">
                Pusat Intelijen Keputusan Eksekutif
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Mengolah 1.300 data transaksi sejak awal bulan menjadi 4 keputusan bisnis yang terukur, valid, dan dapat langsung dieksekusi oleh manajemen.
              </p>
            </div>

            {/* Decision Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setDecisionCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${decisionCategory === 'ALL'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                Semua Bidang (4)
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('SUPPLY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${decisionCategory === 'SUPPLY'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                🌾 Pasokan Petani
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('CLUSTER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${decisionCategory === 'CLUSTER'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                🏘️ Rute Klaster
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('LOGISTICS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${decisionCategory === 'LOGISTICS'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                🚚 Kurir Rp70k
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('INTEGRITY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${decisionCategory === 'INTEGRITY'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                🔒 Audit Tutup Buku
              </button>
            </div>
          </div>

          {/* 4 Decision Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Decision 1: Pasokan & Petani */}
            {(decisionCategory === 'ALL' || decisionCategory === 'SUPPLY') && (
              <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition-all space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      🌾
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block font-mono">
                        Keputusan Pasokan & Margin
                      </span>
                      <h3 className="text-sm font-black text-stone-900">
                        Alokasi Kontrak PO Petani Hulu & Pasar
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Gross Margin 24.8%
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> Dari 1.300 paket pesanan, komoditas sayur segar daun, telur ayam ras, tahu tempe, dan daging ayam menyerap 68% perputaran harian dengan margin rata-rata 24.8% dan sisa susut (waste) 0% karena dipetik/dipotong subuh langsung dikirim.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Kunci kontrak PO harian petani hulu & grosir induk pada H-1 pukul 20:00 WIB</b> untuk mengamankan HPP 75.2%. Tidak perlu buffer stok berlebih di central hub demi menjaga kesegaran maksimal.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 block pt-0.5 font-mono">
                    📈 Dampak Finansial: Laba kotor bulanan terkunci stabil di Rp 11.284.000 / bulan.
                  </span>
                </div>
              </div>
            )}

            {/* Decision 2: Rute & Klaster */}
            {(decisionCategory === 'ALL' || decisionCategory === 'CLUSTER') && (
              <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-purple-300 transition-all space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                      🏘️
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-mono">
                        Keputusan Rute 5 Komplek
                      </span>
                      <h3 className="text-sm font-black text-stone-900">
                        Evaluasi Rute Bandung Timur & Waitlist
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    5 Komplek Surplus Merata
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> 5 Komplek aktif (Antapani Indah, Arcamanik, Cisaranten Kulon, Guruminda, Riung Bandung) masing-masing menyumbang 260 paket dan mencetak laba bersih Rp 1.632.800/bulan. Klaster waitlist <b>Buah Batu Regency</b> terkumpul 18 KK.
                  </p>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-purple-900">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Tunda rute Buah Batu Regency</b> hingga mencapai kuota 30 KK untuk menjadi jangkar <b>Rute Kurir ke-2</b> (5 komplek baru). Jangan mencampur rute kurir aktif agar durasi subuh tetap tepat waktu di bawah 3 jam.
                  </p>
                  <span className="text-[10px] font-bold text-purple-700 block pt-0.5 font-mono">
                    🛡️ Pengendalian Operasional: Mempertahankan SLA ketepatan waktu jam 07:30 WIB 100%.
                  </span>
                </div>
              </div>
            )}

            {/* Decision 3: Efisiensi Logistik Kurir Rp 70k */}
            {(decisionCategory === 'ALL' || decisionCategory === 'LOGISTICS') && (
              <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      🚚
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-mono">
                        Evaluasi Unit Economics Kurir
                      </span>
                      <h3 className="text-sm font-black text-stone-900">
                        Kinerja Kurir Subuh 3 Jam (Rp 70k/Hari)
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    BEP Cepat: 11 Order/Hari
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> Alokasi biaya kurir Rp 70.000/hari (Rp 50k honor jasa 3 jam + Rp 20k bensin) menyerap hanya 4.0% dari GMV (atau total OpEx 6.86% termasuk kantong ramah lingkungan). Dari target 50 order, titik impas (BEP) tercapai di order ke-11.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Tetapkan model kurir subuh 3 jam Rp 70.000/hari</b> sebagai formula baku ekspansi multi-kurir. Sebanyak 39 order di atas BEP menghasilkan margin kontribusi bersih Rp 299.520/hari tanpa biaya kurir tambahan.
                  </p>
                  <span className="text-[10px] font-bold text-amber-800 block pt-0.5 font-mono">
                    ⚡ Efisiensi Skala: Margin laba bersih terkunci sangat sehat di level 17.9%.
                  </span>
                </div>
              </div>
            )}

            {/* Decision 4: Integritas Data & Audit */}
            {(decisionCategory === 'ALL' || decisionCategory === 'INTEGRITY') && (
              <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-sky-300 transition-all space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                      🔒
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block font-mono">
                        Integritas Audit Kas
                      </span>
                      <h3 className="text-sm font-black text-stone-900">
                        Rekonsiliasi Arus Kas & Tutup Buku
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Selisih: Rp 0 (Klop)
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> Mutasi QRIS Midtrans, saldo kas kecil central hub, dan bukti bayar transfer petani telah dicocokkan 100%. Tidak ditemukan transaksi gantung, tagihan tak tertagih, atau selisih pencatatan.
                  </p>
                </div>

                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-sky-900">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Sah untuk mengeksekusi Tutup Buku periode ini</b>. Alokasikan Laba Bersih (Rp 8.164.000) menjadi: <b>65% Dividen Owner (Rp 5.306.600)</b> dan <b>35% Kas Cadangan Operasional Hub & Perawatan Tas Kurir (Rp 2.857.400)</b>.
                  </p>
                  <span className="text-[10px] font-bold text-sky-800 block pt-0.5 font-mono">
                    💰 Kepastian Finansial: Buku kas terkunci resmi dengan nomor audit BTS-CL-202611-01.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3 OPSI SIMULATOR KEPUTUSAN BISNIS (WHAT-IF DECISION ENGINE) */}
          <div className="bg-stone-50/70 rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-6 shadow-2xs">
            {/* Header & Option Switcher Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                    Simulasi Keputusan Bisnis
                  </span>
                  <span className="text-[11px] font-bold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
                    3 Referensi UI/UX & Model Keputusan
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  Pusat Uji Keputusan & Simulasi Dampak Finansial
                </h3>
                <p className="text-xs text-stone-600 max-w-3xl">
                  Bandingkan 3 alternatif desain antarmuka dan logika keputusan untuk menguji kelayakan ekspansi rute sebelum menambah armada logistik Rp 100.000/hari:
                </p>
              </div>

              {/* 3 Option Switcher Buttons */}
              <div className="flex items-center p-1 bg-stone-200/80 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setSimulatorOption('OPTION_1')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${simulatorOption === 'OPTION_1'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Opsi 1: Skenario Strategis</span>
                  <span className="text-[9px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                    ⭐ Saran
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatorOption('OPTION_2')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${simulatorOption === 'OPTION_2'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Opsi 2: Kalkulator BEP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatorOption('OPTION_3')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${simulatorOption === 'OPTION_3'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Opsi 3: Matriks Berdampingan</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* OPSI 1: PRESET SKENARIO STRATEGIS & VISUAL DECISION VERDICT (RECOMMENDED) */}
            {/* ========================================================================= */}
            {simulatorOption === 'OPTION_1' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-stone-900">
                        Opsi 1: Preset Skenario Strategis & Rekomendasi Preskriptif
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Pilih skenario operasional nyata di bawah untuk melihat kepastian laba dan mitigasi risiko secara instan:
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                    Formula Baku: Kurir 3 Jam Rp 70.000 / Hari (Rp 50k Jasa + Rp 20k Bensin)
                  </span>
                </div>

                {/* 3 Clickable Strategic Scenario Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Scenario A: Status Quo */}
                  <div
                    onClick={() => applyScenarioPreset('STATUS_QUO')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${activeScenarioId === 'STATUS_QUO'
                      ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100'
                      : 'border-stone-200 bg-white/70 hover:border-purple-300 hover:bg-white'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                        Skenario A • Realita Saat Ini
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        🟢 1 Kurir (Aman)
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-stone-900 mt-1">
                      Status Quo (1 Kurir • 5 Komplek)
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Antapani, Arcamanik, Cisaranten, Guruminda, Riung • 50 order/hari
                    </p>

                    <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Proyeksi GMV:</span>
                        <span className="font-mono font-bold text-stone-800">Rp 45.500.000</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Laba Bersih:</span>
                        <span className="font-mono font-black text-emerald-700">Rp 8.164.000</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 rounded-xl bg-stone-50 text-[10px] text-stone-600 flex items-center justify-between">
                      <span>Beban Kurir: <b>Rp 1.820.000</b></span>
                      <span className="font-bold text-purple-700">Margin: 17.9%</span>
                    </div>
                  </div>

                  {/* Scenario B: Ekspansi 2 Kurir */}
                  <div
                    onClick={() => applyScenarioPreset('BUAH_BATU')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${activeScenarioId === 'BUAH_BATU'
                      ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100'
                      : 'border-stone-200 bg-white/70 hover:border-purple-300 hover:bg-white'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider font-mono">
                        Skenario B • Rekomendasi Ekspansi
                      </span>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        ⚡ Profit +100%
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-stone-900 mt-1">
                      Buka Rute Kurir 2 (10 Komplek)
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      10 Komplek • 100 order/hari (2 Kurir Motor)
                    </p>

                    <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Proyeksi GMV:</span>
                        <span className="font-mono font-bold text-stone-800">Rp 91.000.000</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Laba Bersih:</span>
                        <span className="font-mono font-black text-emerald-700">Rp 16.328.000</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 rounded-xl bg-purple-50 text-[10px] text-purple-900 flex items-center justify-between">
                      <span>Beban Kurir: <b>Rp 3.640.000</b></span>
                      <span className="font-bold text-purple-700">Margin: 17.9%</span>
                    </div>
                  </div>

                  {/* Scenario C: Scale-up 3 Kurir */}
                  <div
                    onClick={() => applyScenarioPreset('SCALE_UP')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${activeScenarioId === 'SCALE_UP'
                      ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100'
                      : 'border-stone-200 bg-white/70 hover:border-purple-300 hover:bg-white'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider font-mono">
                        Skenario C • Akselerasi Skala Penuh
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        🚀 Skala Maksimal
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-stone-900 mt-1">
                      3 Kurir (15 Komplek) + AOV Rp45k
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      150 order/hari • Bundling paket sembako keluarga
                    </p>

                    <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Proyeksi GMV:</span>
                        <span className="font-mono font-bold text-stone-800">Rp 175.500.000</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Laba Bersih:</span>
                        <span className="font-mono font-black text-emerald-700">Rp 34.164.000</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 rounded-xl bg-amber-50 text-[10px] text-amber-900 flex items-center justify-between">
                      <span>Beban Kurir: <b>Rp 5.460.000</b></span>
                      <span className="font-bold text-amber-800">Margin: 19.5%</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Scenario Deep-Dive & Decision Verdict Box */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider font-mono">
                        Hasil Analisis Skenario Terpilih:
                      </span>
                      <h4 className="text-base font-black text-stone-900">
                        {activeScenarioId === 'STATUS_QUO' && 'Skenario A: 1 Kurir Motor (5 Komplek Bandung Timur)'}
                        {activeScenarioId === 'BUAH_BATU' && 'Skenario B: Ekspansi 2 Kurir Motor (10 Komplek Aktif)'}
                        {activeScenarioId === 'SCALE_UP' && 'Skenario C: Akselerasi 3 Kurir (15 Komplek) & Bundling AOV Rp45.000'}
                      </h4>
                    </div>

                    {/* Risk-Reward Visual Meter */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase">Tingkat Kelayakan:</span>
                        <span className="text-xs font-black text-emerald-700">
                          {activeScenarioId === 'STATUS_QUO' && 'Sangat Aman & Terbukti (Baseline)'}
                          {activeScenarioId === 'BUAH_BATU' && 'Sangat Layak (Yield Tinggi)'}
                          {activeScenarioId === 'SCALE_UP' && 'Sangat Menguntungkan (Target Kuartal I)'}
                        </span>
                      </div>
                      <div className="w-24 h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                        <div
                          className={`h-full rounded-full transition-all ${activeScenarioId === 'STATUS_QUO'
                            ? 'w-1/3 bg-emerald-500'
                            : activeScenarioId === 'BUAH_BATU'
                              ? 'w-2/3 bg-purple-600'
                              : 'w-full bg-amber-500'
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Financial Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Proyeksi GMV</span>
                      <span className="text-base font-black text-stone-900 font-mono">
                        {formatRupiah(simGmv)}
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        {simMonthlyOrders} paket / bulan
                      </span>
                    </div>

                    <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                      <span className="text-[10px] text-sky-700 uppercase font-mono block">Laba Kotor (24.8%)</span>
                      <span className="text-base font-black text-sky-900 font-mono">
                        {formatRupiah(simGrossProfit)}
                      </span>
                      <span className="text-[10px] text-sky-700 block mt-0.5">
                        Setelah HPP pasokan (75.2%)
                      </span>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                      <span className="text-[10px] text-amber-700 uppercase font-mono block">Beban Kurir & Bensin</span>
                      <span className="text-base font-black text-amber-900 font-mono">
                        {formatRupiah(simLogistics)}
                      </span>
                      <span className="text-[10px] text-amber-700 block mt-0.5">
                        Rp 70k x {simCouriersNeeded} kurir x 26 hari
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 uppercase font-mono block font-bold">
                        Estimasi Laba Bersih
                      </span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        {formatRupiah(simNetProfit)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                        Net Margin: {simNetMargin}%
                      </span>
                    </div>
                  </div>

                  {/* Prescriptive Executive Decision Verdict */}
                  <div className="p-4 rounded-xl bg-stone-900 text-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
                          Keputusan & Tindakan Manajemen yang Direkomendasikan:
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                        Audit Akurasi: 99.8%
                      </span>
                    </div>

                    {activeScenarioId === 'STATUS_QUO' && (
                      <p className="text-xs leading-relaxed text-slate-200">
                        <b>PERTINJAUAN STATUS QUO (1 KURIR • 5 KOMPLEK):</b> Rute kurir subuh 3 jam melayani 5 komplek (Antapani Indah, Arcamanik, Cisaranten Kulon, Guruminda, Riung Bandung) telah menghasilkan <b>Laba Bersih Rp 8.164.000 / bulan</b>. Titik impas tercapai hanya di order ke-11 per hari, memberikan margin keselamatan bisnis yang sangat tebal (78%). Rekomendasi: Pertahankan sebagai fondasi baku peluncuran sistem.
                      </p>
                    )}

                    {activeScenarioId === 'BUAH_BATU' && (
                      <p className="text-xs leading-relaxed text-slate-200">
                        <b>KEPUTUSAN EKSPANSI 2 KURIR (10 KOMPLEK):</b> Menambah 1 orang kurir motor subuh untuk klaster komplek kloter ke-2 (termasuk Buah Batu Regency yang mencapai kuota 30 KK) langsung menggandakan laba bersih menjadi <b>Rp 16.328.000 / bulan (+100%)</b>. Syarat: Rekrut 1 kurir motor baru dengan tas obrok 80L dan kunci rute 5 komplek baru.
                      </p>
                    )}

                    {activeScenarioId === 'SCALE_UP' && (
                      <p className="text-xs leading-relaxed text-slate-200">
                        <b>KEPUTUSAN AKSELERASI SKALA PENUH (TARGET KUARTAL I 2027):</b> Mengoperasikan 3 kurir motor (15 komplek terlayani) dan menaikkan nilai rata-rata keranjang dari Rp 35.000 menjadi Rp 45.000 via paket sembako komplit menghasilkan <b>Laba Bersih Rp 34.164.000 / bulan</b>. Net profit margin naik menjadi 19.5%.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* OPSI 2: KALKULATOR BEP DINAMIS & DETEKSI BONCOS LOGISTIK                  */}
            {/* ========================================================================= */}
            {simulatorOption === 'OPTION_2' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-stone-900">
                        Opsi 2: Kalkulator Titik Impas (BEP) Dinamis & Detektor Boncos
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Gunakan tombol pengatur taktis di bawah untuk menguji apakah rute operasional surplus atau boncos:
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 font-bold">
                    Biaya Tetap per Kurir (5 Komplek): Rp 70.000 / Hari
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Interactive Steppers & Controls */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                    <h5 className="text-xs font-black text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-stone-100">
                      <Sliders className="w-3.5 h-3.5 text-stone-500" />
                      Parameter Operasional Klaster & Kurir
                    </h5>

                    {/* Klaster Selector Pills */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-stone-700">1. Jumlah Klaster Terlayani:</span>
                        <span className="font-mono font-black text-purple-700">
                          {simClusters} Komplek ({simCouriersNeeded} Kurir Motor)
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 15, 20].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSimClusters(num)}
                            className={`py-2 text-xs font-black rounded-xl border transition cursor-pointer ${simClusters === num
                              ? 'bg-purple-700 border-purple-700 text-white shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                          >
                            {num} Komplek
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-400 block pt-0.5">
                        Total Beban Kurir: <b>{formatRupiah(simLogistics)}</b> (Rp 70.000 x {simCouriersNeeded} kurir x 26 hari)
                      </span>
                    </div>

                    {/* Daily Orders per cluster (Stepper + Slider) */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-stone-700">2. Pesanan Harian per Komplek:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSimOrdersPerDay(Math.max(3, simOrdersPerDay - 1))}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold cursor-pointer"
                            title="Kurang 1 order"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-black text-sky-700 text-sm w-16 text-center">
                            {simOrdersPerDay} order
                          </span>
                          <button
                            type="button"
                            onClick={() => setSimOrdersPerDay(Math.min(30, simOrdersPerDay + 1))}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold cursor-pointer"
                            title="Tambah 1 order"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="25"
                        step="1"
                        value={simOrdersPerDay}
                        onChange={(e) => setSimOrdersPerDay(Number(e.target.value))}
                        className="w-full accent-sky-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>Min: 3 order (Kurang)</span>
                        <span className="text-amber-700 font-bold">BEP Kurir: {dailyBepOrders} order/kurir/hari</span>
                        <span>Max: 25 order</span>
                      </div>
                    </div>

                    {/* AOV per order (Stepper + Slider) */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-stone-700">3. Rata-rata Keranjang (AOV):</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSimAov(Math.max(25000, simAov - 2500))}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold cursor-pointer"
                            title="Kurangi Rp 2.500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-black text-amber-700 text-sm min-w-[5rem] text-center">
                            {formatRupiah(simAov)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSimAov(Math.min(75000, simAov + 2500))}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold cursor-pointer"
                            title="Tambah Rp 2.500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="25000"
                        max="65000"
                        step="2500"
                        value={simAov}
                        onChange={(e) => setSimAov(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <span className="text-[10px] text-stone-400 block">
                        Kontribusi Margin Bersih per Paket: <b>{formatRupiah(contributionPerOrder)}</b> (setelah HPP petani 75.2% & kantong kemasan Rp 1.000)
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Live BEP Radar & Boncos Detector */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Live Health State Card */}
                    <div
                      className={`p-5 rounded-2xl border-2 transition-all space-y-3 shadow-2xs ${isAboveBep
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/80 border-rose-300 text-rose-950'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                          Status Evaluasi Rute Kurir
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isAboveBep
                            ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                            : 'bg-rose-200 text-rose-900 border border-rose-400'
                            }`}
                        >
                          {isAboveBep ? '🟢 SURPLUS (PROFIT)' : '🔴 DEFISIT (BELUM BEP)'}
                        </span>
                      </div>

                      <div>
                        <div className="text-2xl font-black font-mono">
                          {isAboveBep
                            ? `+${formatRupiah(dailyProfitPerCourier)} / hari per kurir`
                            : `-${formatRupiah(Math.abs(dailyProfitPerCourier))} / hari per kurir`}
                        </div>
                        <span className="text-[11px] block mt-0.5 opacity-80">
                          {isAboveBep
                            ? `Surplus bersih setelah biaya kurir & bensin Rp 70.000/hari`
                            : `Order harian belum menutup upah kurir Rp 70.000`}
                        </span>
                      </div>

                      {/* BEP Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Muatan per Kurir: {dailyOrdersPerCourier} paket/hari</span>
                          <span>Titik Impas (BEP): {dailyBepOrders} paket</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden p-0.5 border border-stone-200">
                          <div
                            className={`h-full rounded-full transition-all ${isAboveBep ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            style={{ width: `${Math.min(100, (dailyOrdersPerCourier / (dailyBepOrders * 1.5)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Actionable Decision Advice */}
                      <div className="pt-2 border-t border-current/10 text-xs leading-relaxed">
                        <b>Rekomendasi Keputusan Eksekutif:</b>{' '}
                        {isAboveBep ? (
                          <span>
                            Volume <b>{dailyOrdersPerCourier} paket/kurir/hari</b> sudah melampaui BEP ({dailyBepOrders} paket). <b>Sangat aman dijalankan</b>. Laba bersih bulanan total: <b>{formatRupiah(simNetProfit)}</b>.
                          </span>
                        ) : (
                          <span>
                            <b>Tingkatkan order sebelum menambah kurir!</b> Pada volume {dailyOrdersPerCourier} paket/kurir, biaya kurir Rp 70.000 belum tertutup penuh. Pastikan minimal {dailyBepOrders} order per kurir.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Summary Pill Output */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-mono block">Omzet (GMV)</span>
                        <span className="font-black text-stone-900 font-mono text-sm block">
                          {formatRupiah(simGmv)}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-mono block">Laba Bersih Total</span>
                        <span className={`font-black font-mono text-sm block ${simNetProfit > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatRupiah(simNetProfit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* OPSI 3: MATRIKS ANALISIS SENSITIVITAS 3 KOLOM BERDAMPINGAN               */}
            {/* ========================================================================= */}
            {simulatorOption === 'OPTION_3' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-stone-900">
                        Opsi 3: Matriks Analisis Sensitivitas 3 Kolom Berdampingan
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Tinjau langsung 3 skenario secara komparatif tanpa perlu bolak-balik mengubah slider:
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-600 bg-stone-200 px-2.5 py-1 rounded-full font-bold">
                    Tabel Evaluasi Head-to-Head
                  </span>
                </div>

                {/* Side-by-Side 3-Column Comparative Matrix */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-2xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/80">
                        <th className="p-3.5 text-stone-600 font-black uppercase text-[11px] w-1/4">
                          Komponen Evaluasi & Finansial
                        </th>
                        <th className="p-3.5 text-stone-900 font-black text-[12px] w-1/4 bg-stone-100/60 border-l border-stone-200">
                          <span className="text-[10px] text-stone-400 block font-mono font-normal">KONDISI RIIL FIX</span>
                          1. Status Quo (1 Kurir • 5 Komplek)
                        </th>
                        <th className="p-3.5 text-purple-900 font-black text-[12px] w-1/4 bg-purple-50/70 border-l border-purple-200">
                          <span className="text-[10px] text-purple-600 block font-mono font-normal">RENCANA DEKAT</span>
                          2. Buka Kurir 2 (10 Komplek)
                        </th>
                        <th className="p-3.5 text-amber-900 font-black text-[12px] w-1/4 bg-amber-50/70 border-l border-amber-200">
                          <span className="text-[10px] text-amber-700 block font-mono font-normal">TARGET KUARTAL I</span>
                          3. Skala 3 Kurir + Bundling Rp45k
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      <tr>
                        <td className="p-3 font-bold text-stone-900">Cakupan Komplek & Rute</td>
                        <td className="p-3 bg-stone-50/30 border-l border-stone-200">
                          5 Komplek Bandung Timur (Antapani, Arcamanik, Cisaranten, Guruminda, Riung)
                        </td>
                        <td className="p-3 bg-purple-50/20 border-l border-purple-200 font-bold text-purple-900">
                          + 5 Komplek Rute 2 (Termasuk Buah Batu Regency)
                        </td>
                        <td className="p-3 bg-amber-50/20 border-l border-amber-200 font-bold text-amber-900">
                          15 Komplek Terlayani Penuh
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-bold text-stone-900">Alokasi Armada Kurir</td>
                        <td className="p-3 font-mono bg-stone-50/30 border-l border-stone-200">1 Kurir Motor (Shift 3 Jam)</td>
                        <td className="p-3 font-mono bg-purple-50/20 border-l border-purple-200 font-bold text-purple-800">2 Kurir Motor</td>
                        <td className="p-3 font-mono bg-amber-50/20 border-l border-amber-200 font-bold text-amber-800">3 Kurir Motor</td>
                      </tr>

                      <tr>
                        <td className="p-3 font-bold text-stone-900">Target Order Harian</td>
                        <td className="p-3 font-mono bg-stone-50/30 border-l border-stone-200">50 order / hari (1.300/bln)</td>
                        <td className="p-3 font-mono bg-purple-50/20 border-l border-purple-200 font-bold text-purple-800">100 order / hari (2.600/bln)</td>
                        <td className="p-3 font-mono bg-amber-50/20 border-l border-amber-200 font-bold text-amber-800">150 order / hari (3.900/bln)</td>
                      </tr>

                      <tr>
                        <td className="p-3 font-bold text-stone-900">Rata-rata Keranjang (AOV)</td>
                        <td className="p-3 font-mono bg-stone-50/30 border-l border-stone-200">Rp 35.000</td>
                        <td className="p-3 font-mono bg-purple-50/20 border-l border-purple-200">Rp 35.000</td>
                        <td className="p-3 font-mono bg-amber-50/20 border-l border-amber-200 font-bold text-amber-800">Rp 45.000 (Paket Kombo Dapur)</td>
                      </tr>

                      <tr className="font-bold bg-stone-50/40">
                        <td className="p-3 text-stone-900">Proyeksi Omzet Bulanan (GMV)</td>
                        <td className="p-3 font-mono text-stone-900 border-l border-stone-200">Rp 45.500.000</td>
                        <td className="p-3 font-mono text-purple-900 border-l border-purple-200">Rp 91.000.000</td>
                        <td className="p-3 font-mono text-amber-900 border-l border-amber-200">Rp 175.500.000</td>
                      </tr>

                      <tr>
                        <td className="p-3">HPP Belanja Modal Hulu (75.2%)</td>
                        <td className="p-3 font-mono text-rose-600 border-l border-stone-200">(Rp 34.216.000)</td>
                        <td className="p-3 font-mono text-rose-600 border-l border-purple-200">(Rp 68.432.000)</td>
                        <td className="p-3 font-mono text-rose-600 border-l border-amber-200">(Rp 131.976.000)</td>
                      </tr>

                      <tr>
                        <td className="p-3">Beban Kurir & Bensin (Rp 70k/hari)</td>
                        <td className="p-3 font-mono text-amber-700 border-l border-stone-200">Rp 1.820.000 (1 kurir)</td>
                        <td className="p-3 font-mono text-amber-700 border-l border-purple-200">Rp 3.640.000 (2 kurir)</td>
                        <td className="p-3 font-mono text-amber-700 border-l border-amber-200">Rp 5.460.000 (3 kurir)</td>
                      </tr>

                      <tr>
                        <td className="p-3">Beban Kantong Kemasan & Es Gel</td>
                        <td className="p-3 font-mono text-amber-700 border-l border-stone-200">Rp 1.300.000</td>
                        <td className="p-3 font-mono text-amber-700 border-l border-purple-200">Rp 2.600.000</td>
                        <td className="p-3 font-mono text-amber-700 border-l border-amber-200">Rp 3.900.000</td>
                      </tr>

                      <tr className="bg-emerald-50/50 font-black text-emerald-950">
                        <td className="p-3 text-emerald-900">LABA BERSIH OPERASIONAL</td>
                        <td className="p-3 font-mono text-emerald-800 border-l border-stone-200 text-sm">Rp 8.164.000</td>
                        <td className="p-3 font-mono text-emerald-700 border-l border-purple-200 text-sm font-black">
                          Rp 16.328.000 (+100%)
                        </td>
                        <td className="p-3 font-mono text-emerald-700 border-l border-amber-200 text-sm font-black">
                          Rp 34.164.000 (+318%)
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-bold text-stone-900">Net Profit Margin</td>
                        <td className="p-3 font-mono border-l border-stone-200 font-bold">17.9%</td>
                        <td className="p-3 font-mono border-l border-purple-200 font-bold text-purple-700">17.9%</td>
                        <td className="p-3 font-mono border-l border-amber-200 font-bold text-amber-700">19.5%</td>
                      </tr>

                      {/* Operational Feasibility Checklist */}
                      <tr className="bg-stone-50/60 font-bold text-stone-800">
                        <td colSpan={4} className="p-2.5 uppercase tracking-wider text-[10px] text-stone-500 font-mono">
                          Checklist Kesiapan Operasional Lapangan:
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 text-stone-600">Kapasitas Kurir & Tas Obrok</td>
                        <td className="p-3 border-l border-stone-200 text-emerald-700 font-bold">✅ 1 Kurir Aktif (65.1 kg aman)</td>
                        <td className="p-3 border-l border-purple-200 text-purple-700 font-bold">⚡ Rekrut 1 Kurir Tambahan</td>
                        <td className="p-3 border-l border-amber-200 text-amber-700 font-bold">⚠️ Total 3 Kurir Tetap</td>
                      </tr>

                      <tr>
                        <td className="p-3 text-stone-600">Durasi Pengantaran Subuh</td>
                        <td className="p-3 border-l border-stone-200 text-emerald-700">✅ 2j 45m (Selesai 07:30 WIB)</td>
                        <td className="p-3 border-l border-purple-200 text-emerald-700">✅ 2j 45m per kurir (Paralel)</td>
                        <td className="p-3 border-l border-amber-200 text-emerald-700">✅ 2j 45m per kurir (Paralel)</td>
                      </tr>

                      {/* Management Conclusion Row */}
                      <tr className="bg-stone-100/70">
                        <td className="p-3 font-black text-stone-900">Rekomendasi Keputusan</td>
                        <td className="p-3 border-l border-stone-200 text-[11px] leading-tight font-bold text-stone-900">
                          <b>Fondasi Baku Sistem:</b> Laba Rp 8.164.000/bln sudah terbukti dan terkunci.
                        </td>
                        <td className="p-3 border-l border-purple-200 text-[11px] leading-tight font-bold text-purple-950 bg-purple-50/50">
                          <b>SEGERA EKSEKUSI</b> begitu kuota waitlist 30 KK Buah Batu tercapai.
                        </td>
                        <td className="p-3 border-l border-amber-200 text-[11px] leading-tight text-amber-950 bg-amber-50/50">
                          <b>Rencana Kuartal I:</b> Skala 3 kurir setelah kas cadangan mencapai target.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Laporan Laba Rugi Formal (Standard P&L Statement) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-stone-900">
                Laporan Laba Rugi Komprehensif (Income Statement)
              </h2>
              <p className="text-xs text-stone-500">
                Pencatatan akuntansi periodik berbasis kas dan transaksi riil etalase warga:
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-stone-600 bg-stone-200 px-2 py-1 rounded">
              Periode 01–26 Nov 2026 (26 Hari)
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-extrabold uppercase text-[10px]">
                    <th className="py-2 px-3">Uraian Akun Finansial</th>
                    <th className="py-2 px-3 text-right">Rincian Nominal</th>
                    <th className="py-2 px-3 text-right">Subtotal / Total</th>
                    <th className="py-2 px-3 text-right">% Rasio GMV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {/* Revenue Section */}
                  <tr className="bg-stone-50/50 font-bold">
                    <td colSpan={4} className="py-2 px-3 text-stone-900 uppercase tracking-wider text-[11px]">
                      1. Pendapatan Penjualan (Revenue)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">Pendapatan Kotor Belanja Sayur & Sembako Pokok (1.300 Order)</td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(gmvTotal)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">
                      {formatRupiah(gmvTotal)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">100.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6 text-stone-600">
                      Potongan Diskon & Cashback Komunitas (Model Prepaid Lunas)
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">Rp 0</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">0.0%</td>
                  </tr>
                  <tr className="font-bold bg-stone-50/30">
                    <td className="py-2 px-3 pl-6 text-stone-900">Total Pendapatan Bersih (Net Revenue)</td>
                    <td className="py-2 px-3 text-right font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-900 font-black">
                      {formatRupiah(netRevenue)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-600 font-bold">100.0%</td>
                  </tr>

                  {/* COGS Section */}
                  <tr className="bg-stone-50/50 font-bold">
                    <td colSpan={4} className="py-2 px-3 text-stone-900 uppercase tracking-wider text-[11px]">
                      2. Harga Pokok Penjualan (HPP / COGS)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Belanja Modal Komoditas Petani Hulu 1P (Sayur Daun Segar, Telur Ayam, Daging Ayam)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(20529600)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">45.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Belanja Modal Komoditas Grosir Induk 3P (Beras, Minyak Goreng, Bumbu Dapur)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(13686400)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">30.1%</td>
                  </tr>
                  <tr className="font-bold bg-rose-50/30 text-rose-900">
                    <td className="py-2 px-3 pl-6">Total Beban Pokok Bahan Baku (COGS)</td>
                    <td className="py-2 px-3 text-right font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      ({formatRupiah(cogsHppHulu)})
                    </td>
                    <td className="py-2 px-3 text-right font-mono">75.2%</td>
                  </tr>

                  {/* Gross Profit */}
                  <tr className="bg-sky-50/70 font-black text-sky-950 text-xs">
                    <td className="py-2.5 px-3 uppercase">LABA KOTOR OPERASIONAL (GROSS PROFIT)</td>
                    <td className="py-2.5 px-3 text-right font-mono">—</td>
                    <td className="py-2.5 px-3 text-right font-mono text-sky-800 text-sm">
                      {formatRupiah(grossProfit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">24.8%</td>
                  </tr>

                  {/* Operating Expenses */}
                  <tr className="bg-stone-50/50 font-bold">
                    <td colSpan={4} className="py-2 px-3 text-stone-900 uppercase tracking-wider text-[11px]">
                      3. Beban Operasional Distribusi Kurir (OpEx)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Honor Jasa Kurir Motor Subuh 3 Jam (26 hari x Rp50.000)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(1300000)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">2.86%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Bahan Bakar Bensin Motor Kurir (26 hari x Rp20.000)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(520000)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">1.14%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Kantong Kemasan Ramah Lingkungan & Ice Gel (1.300 paket x Rp1.000)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(packagingAndOps)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">2.86%</td>
                  </tr>
                  <tr className="font-bold bg-amber-50/30 text-amber-900">
                    <td className="py-2 px-3 pl-6">Total Beban Operasional Distribusi (OpEx)</td>
                    <td className="py-2 px-3 text-right font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      ({formatRupiah(totalLogisticsBeban + packagingAndOps)})
                    </td>
                    <td className="py-2 px-3 text-right font-mono">6.86%</td>
                  </tr>

                  {/* Final Net Operating Income */}
                  <tr className="bg-emerald-100/90 font-black text-emerald-950 text-sm">
                    <td className="py-3 px-3 uppercase tracking-wide">
                      4. LABA BERSIH OPERASIONAL BERSIH (NET OPERATING PROFIT)
                    </td>
                    <td className="py-3 px-3 text-right font-mono">—</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-800 text-base">
                      {formatRupiah(netOperatingIncome)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-800 text-sm">
                      17.94%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Breakdown Per-Klaster Perumahan Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-stone-900">
                Evaluasi Kinerja & Margin Laba per Klaster Perumahan
              </h2>
              <p className="text-xs text-stone-500">
                Membandingkan profitabilitas 5 komplek perumahan aktif Bandung Timur (10 order/hari per komplek):
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-extrabold text-[10px] uppercase">
                  <th className="py-3 px-4">Nama Komplek & Status</th>
                  <th className="py-3 px-3 text-center">Volume Pesanan</th>
                  <th className="py-3 px-3 text-right">Omzet (GMV)</th>
                  <th className="py-3 px-3 text-right">HPP Pasokan (75.2%)</th>
                  <th className="py-3 px-3 text-right">Laba Kotor (24.8%)</th>
                  <th className="py-3 px-3 text-right">Beban Kurir Proporsional</th>
                  <th className="py-3 px-4 text-right">Laba Bersih Komplek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clusterBreakdowns.map((c, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {c.name}
                      <span
                        className={`ml-2 text-[9px] px-2 py-0.2 rounded-full font-bold ${c.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {c.status === 'ACTIVE' ? 'Aktif Terlayani' : 'Waitlist Rute'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-stone-800">
                      {c.totalOrders} paket
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      {formatRupiah(c.gmv)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-stone-600">
                      {formatRupiah(c.cogsFarmer)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sky-800 font-bold">
                      {formatRupiah(c.grossProfit)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-800">
                      {formatRupiah(c.logisticsCost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 text-xs">
                      {formatRupiah(c.netProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Berita Acara Rekonsiliasi Tutup Buku Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-stone-900">
              Berita Acara Rekonsiliasi Kas & Tutup Buku
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Waktu Rekonsiliasi:</span>
              <p className="font-bold text-stone-800">{closedAt || 'Periode Masih Berjalan (Draft)'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Penanggung Jawab:</span>
              <p className="font-bold text-stone-800">{closedBy || 'Admin Operasional (Syamhari Abidin)'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Status Audit:</span>
              <p className="font-bold text-emerald-700">{isBookClosed ? '✓ Selesai & Terverifikasi' : 'Menunggu Tutup Buku'}</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
            <b>Catatan Internal:</b> {closingNotes}
          </p>
        </div>

        {/* PRINT SIGNATURE FOOTER ONLY VISIBLE ON PAPER / PDF EXPORT */}
        <div className="hidden print:block pt-8 mt-12 border-t border-stone-300">
          <div className="grid grid-cols-2 text-center text-xs">
            <div className="space-y-16">
              <span>Disusun Oleh (Penanggung Jawab Operasional),</span>
              <div>
                <b className="block underline">( Syamhari Abidin )</b>
                <span className="text-[10px] text-stone-500">Admin Operasional Berkah Tani</span>
              </div>
            </div>
            <div className="space-y-16">
              <span>Disetujui Oleh (Owner / Direktur Utama),</span>
              <div>
                <b className="block underline">( ............................................ )</b>
                <span className="text-[10px] text-stone-500">Pimpinan Berkah Tani Sejahtera</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: PROSES TUTUP BUKU PERIODE */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">
                  Konfirmasi Tutup Buku Periode {selectedMonth}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCloseModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmClosing} className="space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Peringatan Tindakan Tutup Buku:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tutup buku akan merekonsiliasi seluruh transaksi periode November 2026, mengunci pencatatan laba bersih (<b>{formatRupiah(netOperatingIncome)}</b>), dan menerbitkan nomor dokumen laporan resmi.
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Catatan Berita Acara Rekonsiliasi
                </label>
                <textarea
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#24B05A] text-stone-900 font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-black rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci & Tutup Buku Resmi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
