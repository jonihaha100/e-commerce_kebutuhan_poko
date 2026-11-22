# Product Requirements Document (PRD) — Agri-Commerce Bandung MVP v1.0
**Brand:** Berkah Tani Sejahtera (Agrojaya Global Indo Platform)  
**Timezone:** Asia/Jakarta (WIB)  
**Core Model:** Hyperlocal Group-Buy & Direct Farm-to-Table Community Grocery

---

## 1. Executive Summary & Problem Statement
Pasar komoditas segar dan sembako di Bandung seringkali mengalami fluktuasi harga akibat panjangnya rantai distribusi (tengkulak, pasar induk, pengecer lokal).
Platform **Berkah Tani Sejahtera** menerapkan model:
1. **Rantai Pasok Terintegrasi:** 70% komoditas berasal dari petani langsung (1P) dan 30% dari pasar induk/grosir cadangan (3P).
2. **Hyperlocal Cluster Delivery:** Berbasis klaster perumahan/komplek di Bandung dengan perwakilan Mitra IRT (Ibu Rumah Tangga) atau titik drop point mobile.
3. **Group-Buy & Smart Pantry:** Pelanggan di satu komplek dapat bergabung untuk mencapai kuota belanja (Rp40.000 / pesanan, target 10 slot) guna mendapatkan cashback 10% ke dompet CRM.
4. **Pagar Pengaman Hulu (Anti-ATM & Quality Guard):** Menghindari perantara membongkar data pelanggan, serta menjaga kesegaran komoditas (misal: Ubi Cilembu harus melewati masa curing minimal 14 hari).

---

## 2. Jam Operasional Harian (WIB Strict)
- **14:00 WIB:** Sinkronisasi awal pasokan hulu dan kesiapan katalog vendor.
- **15:00 WIB:** Cutoff batas akhir pengisian penawaran harga modal harian oleh vendor (`vendor_daily_offers`).
- **15:00 - 16:00 WIB:** Executive Command Center / Radar Harga Admin (Review anomali lonjakan >25%, aktivasi failover/substitusi jika stok 1P kosong, fiksasi harga jual).
- **16:00 WIB:** Pembukaan siklus katalog harian (`daily_cycles.status = 'OPEN'`) ke storefront konsumen.
- **17:00 WIB:** Jam puncak pesanan dibuka (*rush hour* pesanan dapur esok hari).
- **19:45 WIB:** Peringatan penutupan slot group-buy (*15-minute countdown*).
- **20:00 WIB:** Cutoff penguncian pesanan group-buy (`LOCKED`), kalkulasi cashback 10%, dan agregasi otomatis menjadi Surat Jalan Hulu (`purchase_orders_hulu`).
- **05:00 - 08:00 WIB (H+1):** Distribusi pagi ke Mitra IRT Checkpoint & Mobile Drop Point komplek.

---

## 3. Klaster Pilot Bandung
1. **Antapani Indah (`antapani-indah`):**
   - Tipe: `MOBILE_DROP_POINT` (Mobil pick-up/van mengantarkan pesanan ke gerbang utama komplek).
   - Status: `ACTIVE`.
2. **Arcamanik Endah (`arcamanik-endah`):**
   - Tipe: `MITRA_IRT_CHECKPOINT` (Pesanan dititipkan ke rumah Mitra IRT pengelola, customer mengambil atau diantar ke pagar rumah dengan komisi Mitra).
   - Status: `ACTIVE`.
3. **Buah Batu Regency (`buah-batu-regency`):**
   - Tipe: `WAITLIST` (Rute belum dibuka, membutuhkan akumulasi 5 tetangga terdaftar untuk mengaktifkan pengiriman gratis ongkir).
   - Status: `WAITLIST`.

---

## 4. Parameter Finansial & Aturan Bisnis MVP
- **Batas Minimum Group-Buy:** Rp40.000 per pesanan.
- **Target Slot Group-Buy per Komplek:** 10 slot.
- **Insentif Cashback Group-Buy:** 10% dikreditkan otomatis ke dompet CRM (`wallet_ledger`) saat target slot tercapai pada pukul 20:00 WIB.
- **Batas Klaim Kualitas Otomatis (*Quality Agent*):** $\le$ Rp25.000 diproses instan tanpa approval manual jika ada komplain foto/kerusakan barang.
- **Struktur Kompensasi Mitra IRT:** 8% dari nilai pesanan + Rp2.500 biaya antar ke pagar (terproteksi dalam kalkulasi `min_safe_price`).
- **Aturan Transparansi Terbuka (*Open Book Split*):**
  - Harga yang ditampilkan ke konsumen mencantumkan rincian jujur: *Porsi Petani / Modal Hulu* + *Porsi Biaya Operasional/Kemas/Mitra* = *Total Harga Jual*.

---

## 5. Matriks Peran Pengguna (User Roles) & Anti-ATM
- `CUSTOMER`: Membeli produk, melacak pesanan, mengatur profil dapur, mengelola saldo dompet CRM.
- `MITRA_IRT`: Melihat daftar pesanan khusus di komplek yang ditugaskan, memverifikasi barang datang, mencatat serah terima ke warga.
- `VENDOR_PETANI`, `VENDOR_PASAR_3P`, `VENDOR_PROTEIN`: Hanya melihat Surat Jalan Agregat (`purchase_orders_hulu`) dan mengisi `vendor_daily_offers`. Dilarang keras melihat data pesanan eceran dan identitas customer.
- `ADMIN`: Mengelola siklus harian, radar harga, anomali harga, persetujuan substitusi, dan publikasi katalog.
