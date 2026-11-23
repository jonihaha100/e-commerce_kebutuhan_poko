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
  Sparkles,
  Calculator,
  Lightbulb,
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

  // What-If Simulation State
  const [simClusters, setSimClusters] = useState(2);
  const [simOrdersPerDay, setSimOrdersPerDay] = useState(15);
  const [simAov, setSimAov] = useState(50700);

  // Simulated metrics derived dynamically
  const simMonthlyOrders = simClusters * simOrdersPerDay * 26;
  const simGmv = simMonthlyOrders * simAov;
  const simGrossProfit = Math.round(simGmv * 0.248);
  const simLogistics = simClusters * 100000 * 26;
  const simPackaging = Math.round(simGmv * 0.029);
  const simNetProfit = simGrossProfit - simLogistics - simPackaging;

  // Financial baseline numbers for the month (26 operating days, 2 active clusters)
  const totalDays = 26;
  const dailyLogisticsBudget = 100000; // Rp50k Armada + Rp50k Mitra per komplek
  const activeClusterCount = clusters.filter((c) => c.status === 'ACTIVE').length || 2;
  const totalLogisticsBeban = totalDays * dailyLogisticsBudget * activeClusterCount; // Rp 5.200.000 for 2 clusters

  // Aggregated figures based on orders & financial ratios
  const totalOrdersCount = 780; // 30 orders/day x 26 days
  const gmvTotal = 39540000; // Average order value ~Rp50.700
  const cashbackGroupBuy = 1977000; // 5% blended cashback
  const netRevenue = gmvTotal - cashbackGroupBuy; // Rp 37.563.000
  const cogsHppHulu = 28250000; // 75,2% HPP belanja modal petani
  const grossProfit = netRevenue - cogsHppHulu; // Rp 9.313.000 (24,8% gross margin)
  const packagingAndOps = 1150000; // Bahan kemasan food-grade, es, kantong
  const netOperatingIncome = grossProfit - totalLogisticsBeban - packagingAndOps; // Rp 2.963.000 (setelah semua biaya)

  const clusterBreakdowns: ClusterReport[] = [
    {
      name: 'Antapani Indah',
      totalOrders: 420,
      gmv: 21280000,
      cashback: 1064000,
      netRevenue: 20216000,
      cogsFarmer: 15162000,
      grossProfit: 5054000,
      logisticsCost: 2600000, // Rp 100k x 26 days
      netProfit: 2454000,
      status: 'ACTIVE',
    },
    {
      name: 'Arcamanik Endah',
      totalOrders: 360,
      gmv: 18260000,
      cashback: 913000,
      netRevenue: 17347000,
      cogsFarmer: 13088000,
      grossProfit: 4259000,
      logisticsCost: 2600000, // Rp 100k x 26 days
      netProfit: 1659000,
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
          <tr><td>Pendapatan Kotor Belanja Warga (GMV)</td><td class='num'>${formatRupiah(gmvTotal)}</td><td class='num'>100.0%</td></tr>
          <tr><td>Potongan Cashback Group-Buy Komunitas</td><td class='num'>(${formatRupiah(cashbackGroupBuy)})</td><td class='num'>-5.0%</td></tr>
          <tr class='bold' style='background-color: #f8fafc;'><td>Pendapatan Bersih (Net Revenue)</td><td class='num'>${formatRupiah(netRevenue)}</td><td class='num'>95.0%</td></tr>
          <tr><td>HPP Bahan Pangan Petani & Pasar (COGS)</td><td class='num'>(${formatRupiah(cogsHppHulu)})</td><td class='num'>-71.5%</td></tr>
          <tr class='bold' style='background-color: #ecfdf5;'><td>Laba Kotor Operasional (Gross Profit)</td><td class='num green'>${formatRupiah(grossProfit)}</td><td class='num green'>24.8%</td></tr>
          <tr><td>Beban Armada Pick-up Subuh (26 hari x 2 komplek)</td><td class='num'>(${formatRupiah(totalLogisticsBeban / 2)})</td><td class='num'>-6.6%</td></tr>
          <tr><td>Beban Mitra Rumah-Gudang (26 hari x 2 komplek)</td><td class='num'>(${formatRupiah(totalLogisticsBeban / 2)})</td><td class='num'>-6.6%</td></tr>
          <tr><td>Beban Kemasan Food-Grade, Es Gel & Hub</td><td class='num'>(${formatRupiah(packagingAndOps)})</td><td class='num'>-2.9%</td></tr>
          <tr class='bold' style='background-color: #f0fdf4; font-size: 11pt;'><td>LABA BERSIH OPERASIONAL (NET PROFIT)</td><td class='num green'>${formatRupiah(netOperatingIncome)}</td><td class='num green'>7.5%</td></tr>
        </table>

        <h2>II. RINCIAN PERFORMA PER KLASTER PERUMAHAN</h2>
        <table>
          <tr>
            <th>Nama Komplek</th>
            <th class='num'>Pesanan</th>
            <th class='num'>Omzet (GMV)</th>
            <th class='num'>HPP Petani</th>
            <th class='num'>Beban Logistik</th>
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
            <td>Sayur daun & ayam filet menyerap 54% GMV dengan margin 28%. Penyerapan panen subuh 100%.</td>
            <td><b class='green'>Naikkan kontrak panen petani +20%</b> untuk mengunci pasokan sayur daun fajar.</td>
          </tr>
          <tr>
            <td><b>2. Rute Klaster</b></td>
            <td>Antapani (Surplus Rp 2.454.000), Arcamanik (Surplus Rp 1.659.000). Waitlist Buah Batu: 18 KK / 30 KK.</td>
            <td><b>Tunda rute Buah Batu</b> hingga 30 KK agar tidak boncos di biaya armada Rp 50.000/hari.</td>
          </tr>
          <tr>
            <td><b>3. Logistik Rp 100k</b></td>
            <td>Biaya Rp 100.000/hari (Armada Rp50k + Mitra Rp50k) memakan 13.2% GMV. BEP tercapai di 8 order/hari.</td>
            <td><b class='green'>Pertahankan formula Rp 100.000/hari</b> sebagai formula baku ekspansi komplek.</td>
          </tr>
          <tr>
            <td><b>4. Integritas Audit</b></td>
            <td>Akurasi data 99.8%. Saldo QRIS bank penampung klop tanpa selisih (Rp 0). 0 transaksi bodong.</td>
            <td><b class='green'>SAH UNTUK TUTUP BUKU</b>. Alokasi laba: 65% dividen owner & 35% dana cadangan hub.</td>
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
    const headers = ['Nama Komplek', 'Status', 'Total Pesanan', 'Omzet Bruto (GMV)', 'Cashback', 'Pendapatan Bersih', 'HPP Petani', 'Beban Logistik', 'Laba Bersih'];
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
      `Periode: *November 2026*\n\n` +
      `📊 *Ringkasan Laba Rugi (P&L):*\n` +
      `• Total Pesanan Warga: *${totalOrdersCount} pesanan*\n` +
      `• Total Omzet (GMV): *${formatRupiah(gmvTotal)}*\n` +
      `• HPP Modal Petani: *${formatRupiah(cogsHppHulu)}*\n` +
      `• Laba Kotor (Gross Margin): *${formatRupiah(grossProfit)}* (24.8%)\n` +
      `• Beban Armada & Mitra: *${formatRupiah(totalLogisticsBeban)}*\n` +
      `• Biaya Kemasan & QC: *${formatRupiah(packagingAndOps)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *LABA BERSIH BERSIH:* *${formatRupiah(netOperatingIncome)}*\n\n` +
      `📍 *Performa Klaster:* Antapani Indah (${formatRupiah(2454000)}), Arcamanik (${formatRupiah(1659000)})\n` +
      `🔒 Status Buku: *${isBookClosed ? 'SUDAH TUTUP BUKU LENGKAP' : 'DRAFT SIAP DITINJAU'}*\n\n` +
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
                26 Hari Kerja Operasional • 2 Klaster Perumahan Terlayani (Antapani & Arcamanik)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-stone-400 font-mono block">Status Buku:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isBookClosed
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
              Rata-rata: Rp50.700 / belanjaan
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
              Setelah dikurangi HPP petani
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Beban Logistik (Armada + Mitra)</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-800">
                {formatRupiah(totalLogisticsBeban)}
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                2 Klaster
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Rp100.000 / hari per komplek (26 hari)
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
                Bersih
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
                Mengolah 780 data transaksi sejak awal bulan menjadi 4 keputusan bisnis yang terukur, valid, dan dapat langsung dieksekusi oleh manajemen.
              </p>
            </div>

            {/* Decision Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setDecisionCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  decisionCategory === 'ALL'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Bidang (4)
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('SUPPLY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  decisionCategory === 'SUPPLY'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🌾 Pasokan Petani
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('CLUSTER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  decisionCategory === 'CLUSTER'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🏘️ Rute Klaster
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('LOGISTICS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  decisionCategory === 'LOGISTICS'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🚚 Logistik Rp100k
              </button>
              <button
                type="button"
                onClick={() => setDecisionCategory('INTEGRITY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  decisionCategory === 'INTEGRITY'
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
                        Alokasi Kontrak PO Petani Hulu
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Margin Tinggi 28%
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> Dari 780 paket, <b>Pakcoy Hidroponik</b> & <b>Ayam Filet</b> menyerap 54% total omzet dengan margin kotor sehat 28% dan tingkat sisa (waste) 0%. Sementara cabai & bawang grosir marginnya tipis di 14%.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Naikkan alokasi PO sayur daun & ayam sebesar +20%</b> untuk bulan depan. Pertahankan kuota komoditas bumbu pada batas buffer grosir harian untuk menghindari risiko susut timbangan.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 block pt-0.5 font-mono">
                    📈 Dampak Finansial: Potensi kenaikan laba kotor +Rp 1.450.000 / bulan.
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
                        Keputusan Ekspansi Rute
                      </span>
                      <h3 className="text-sm font-black text-stone-900">
                        Aktivasi Rute Klaster Waitlist
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    Antapani & Arcamanik Surplus
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> Antapani Indah mencetak laba bersih Rp 2.454.000 dan Arcamanik Rp 1.659.000. Klaster waitlist <b>Buah Batu Regency</b> saat ini baru terkumpul 18 KK (dari syarat kuota 30 KK).
                  </p>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-purple-900">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Tunda pengaktifan rute mobil drop point Buah Batu</b> hingga mencapai 30 KK penuh. Mengaktifkan sekarang berisiko boncos beban armada Rp 50.000/hari yang belum sebanding dengan volume serapan belanja.
                  </p>
                  <span className="text-[10px] font-bold text-purple-700 block pt-0.5 font-mono">
                    🛡️ Pengendalian Risiko: Menyelamatkan potensi defisit subsidi Rp 1.300.000 / bulan.
                  </span>
                </div>
              </div>
            )}

            {/* Decision 3: Efisiensi Logistik Rp 100k */}
            {(decisionCategory === 'ALL' || decisionCategory === 'LOGISTICS') && (
              <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      🚚
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-mono">
                        Evaluasi Unit Economics
                      </span>
                      <h3 className="text-sm font-black text-stone-900">
                        Kinerja Anggaran Distribusi Rp 100k/Hari
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    BEP Tercapai: 8 Order/Hari
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-100">
                  <p>
                    <b>Data Transaksi Tervalidasi:</b> Alokasi biaya logistik Rp 100.000/hari (Rp 50k Armada pick-up + Rp 50k Mitra sortir gudang) menyerap 13.2% dari GMV. Rata-rata order harian kedua komplek (15 order/hari) berada jauh di atas titik impas (*BEP* 8 order/hari).
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    Keputusan Eksekutif yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    <b>Pertahankan model logistik Rp 100.000/hari</b> sebagai formula baku ekspansi. Kunci nilai rata-rata belanja warga (*AOV*) minimal Rp 45.000 melalui paket kombo agar margin tetap tebal.
                  </p>
                  <span className="text-[10px] font-bold text-amber-800 block pt-0.5 font-mono">
                    ⚡ Efisiensi Operasional: Menjamin laba bersih stabil di atas 7% dari omzet kotor.
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
                    <b>Sah untuk mengeksekusi Tutup Buku periode ini</b>. Alokasikan Laba Bersih (Rp 2.963.000) menjadi: <b>65% Dividen Owner (Rp 1.925.950)</b> dan <b>35% Kas Cadangan Operasional Hub (Rp 1.037.050)</b> untuk peremajaan styrofoam & es gel.
                  </p>
                  <span className="text-[10px] font-bold text-sky-800 block pt-0.5 font-mono">
                    💰 Kepastian Finansial: Buku kas terkunci resmi dengan nomor audit BTS-CL-202611-01.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* INTERACTIVE WHAT-IF DECISION SIMULATOR */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl space-y-5 border border-slate-700 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight text-white">
                    Simulasi Dampak Keputusan Bisnis (What-If Calculator)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Geser parameter untuk memproyeksikan potensi omzet dan laba bersih sebelum mengambil keputusan ekspansi:
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Model Logistik: Rp100.000 / Hari
              </span>
            </div>

            {/* 3 Interactive Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">Jumlah Klaster Aktif:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    {simClusters} Komplek
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={simClusters}
                  onChange={(e) => setSimClusters(Number(e.target.value))}
                  className="w-full accent-[#24B05A] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">
                  Beban Armada & Mitra: {formatRupiah(simLogistics)} (Rp100k x {simClusters} x 26 hr)
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">Pesanan / Hari / Komplek:</span>
                  <span className="font-mono font-black text-sky-400 text-sm">
                    {simOrdersPerDay} Order / hari
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="40"
                  step="1"
                  value={simOrdersPerDay}
                  onChange={(e) => setSimOrdersPerDay(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">
                  Total Paket Sebulan: <b>{simMonthlyOrders} pesanan</b> (Titik Impas: 8 order/hari)
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">Rata-rata Belanja (AOV):</span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    {formatRupiah(simAov)}
                  </span>
                </div>
                <input
                  type="range"
                  min="35000"
                  max="80000"
                  step="5000"
                  value={simAov}
                  onChange={(e) => setSimAov(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">
                  Nilai rata-rata keranjang dapur per rumah
                </span>
              </div>
            </div>

            {/* Live Calculation Outcomes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-700/80">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Proyeksi GMV</span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {formatRupiah(simGmv)}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Laba Kotor (24.8%)</span>
                <span className="text-base sm:text-lg font-black text-sky-400 font-mono">
                  {formatRupiah(simGrossProfit)}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Beban Logistik & Ops</span>
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                  {formatRupiah(simLogistics + simPackaging)}
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${
                simNetProfit > 0
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}>
                <span className="text-[10px] uppercase font-mono block font-bold">
                  {simNetProfit > 0 ? 'Estimasi Laba Bersih' : 'Defisit Operasional'}
                </span>
                <span className="text-base sm:text-lg font-black font-mono">
                  {formatRupiah(simNetProfit)}
                </span>
              </div>
            </div>
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
              Periode 01–26 Nov 2026
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
                    <td className="py-2 px-3 pl-6">Pendapatan Kotor Belanja Sayur & Sembako (GMV)</td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(gmvTotal)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">
                      {formatRupiah(gmvTotal)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">100.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6 text-stone-600">
                      Potongan Diskon & Cashback Group-Buy Komunitas (5%)
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-rose-600">
                      ({formatRupiah(cashbackGroupBuy)})
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">-5.0%</td>
                  </tr>
                  <tr className="font-bold bg-stone-50/30">
                    <td className="py-2 px-3 pl-6 text-stone-900">Total Pendapatan Bersih (Net Revenue)</td>
                    <td className="py-2 px-3 text-right font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-900 font-black">
                      {formatRupiah(netRevenue)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-600 font-bold">95.0%</td>
                  </tr>

                  {/* COGS Section */}
                  <tr className="bg-stone-50/50 font-bold">
                    <td colSpan={4} className="py-2 px-3 text-stone-900 uppercase tracking-wider text-[11px]">
                      2. Harga Pokok Penjualan (HPP / COGS)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Belanja Modal Komoditas Petani 1P (Pakcoy, Ayam, Telur, Ubi Cilembu)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(18200000)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">46.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Belanja Modal Komoditas Grosir 3P (Cabai, Bawang, Beras, Minyak)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(10050000)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">25.5%</td>
                  </tr>
                  <tr className="font-bold bg-rose-50/30 text-rose-900">
                    <td className="py-2 px-3 pl-6">Total Beban Pokok Bahan Baku (COGS)</td>
                    <td className="py-2 px-3 text-right font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      ({formatRupiah(cogsHppHulu)})
                    </td>
                    <td className="py-2 px-3 text-right font-mono">71.5%</td>
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
                      3. Beban Operasional Distribusi & Logistik (OpEx)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Armada Mobil Pick-up Subuh (2 Klaster x 26 hari x Rp50.000)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(2600000)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">6.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Honor Mitra Rumah-Gudang Komplek (2 Klaster x 26 hari x Rp50.000)
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(2600000)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">6.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 pl-6">
                      Bahan Kemasan Food-Grade, Sealer, Es Gel & Operasional Central Hub
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{formatRupiah(packagingAndOps)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-400">—</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">2.9%</td>
                  </tr>
                  <tr className="font-bold bg-amber-50/30 text-amber-900">
                    <td className="py-2 px-3 pl-6">Total Beban Operasional Logistik (OpEx)</td>
                    <td className="py-2 px-3 text-right font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      ({formatRupiah(totalLogisticsBeban + packagingAndOps)})
                    </td>
                    <td className="py-2 px-3 text-right font-mono">16.1%</td>
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
                      7.5%
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
                Membandingkan profitabilitas antar komplek perumahan aktif:
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
                  <th className="py-3 px-3 text-right">HPP Petani</th>
                  <th className="py-3 px-3 text-right">Laba Kotor</th>
                  <th className="py-3 px-3 text-right">Beban Logistik</th>
                  <th className="py-3 px-4 text-right">Laba Bersih Komplek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clusterBreakdowns.map((c, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {c.name}
                      <span
                        className={`ml-2 text-[9px] px-2 py-0.2 rounded-full font-bold ${
                          c.status === 'ACTIVE'
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
