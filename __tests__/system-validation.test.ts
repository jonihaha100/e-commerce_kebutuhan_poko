import {
  calculateMinSafePrice,
  calculateOpenBookSplit,
  calculateFailoverSellPrice,
  determinePriceSignal,
  formatRupiah,
} from '../lib/pricing-engine';
import {
  getDailyCyclePhase,
  isCatalogPublishTime,
  isCycleLocked,
  getJakartaTimeString,
} from '../lib/time';
import {
  initialProducts,
  initialClusters,
  initialAccounts,
  initialOrders,
  initialCatalogPrices,
} from '../lib/mock-data';

describe('SISTEM VALIDASI MENYELURUH (E-COMMERCE KEBUTUHAN POKOK)', () => {
  describe('1. Integritas Data Master Produk & Zero Coffee Tolerance', () => {
    it('memastikan minimal terdapat 10 komoditas pangan pokok aktif', () => {
      expect(initialProducts.length).toBeGreaterThanOrEqual(10);
    });

    it('memenuhi Zero Coffee Tolerance: bebas dari produk olahan kopi non-primer', () => {
      const hasCoffee = initialProducts.some(
        (p) =>
          p.name.toLowerCase().includes('kopi') ||
          p.description.toLowerCase().includes('kopi') ||
          p.sku.toLowerCase().includes('kopi')
      );
      expect(hasCoffee).toBe(false);
    });

    it('memastikan semua kategori sesuai skema database yang valid', () => {
      const validCategories = [
        'VEGETABLE_1P',
        'TUBER_CURED_1P',
        'PROTEIN_1P',
        'SPICE_3P',
        'STAPLE_3P',
      ];
      initialProducts.forEach((p) => {
        expect(validCategories).toContain(p.category_type);
      });
    });

    it('memastikan setiap produk memiliki kode SKU dan takaran porsi unit yang baku', () => {
      initialProducts.forEach((p) => {
        expect(p.sku.length).toBeGreaterThanOrEqual(4);
        expect(p.name.length).toBeGreaterThanOrEqual(3);
        expect(p.unit.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('2. Pricing Engine & Circuit Breaker', () => {
    it('menghitung P_min_safe dengan formula ketat penjamin modal petani & mitra IRT', () => {
      const netPrice = 20000;
      const packCost = 1000;
      const minSafe = calculateMinSafePrice(netPrice, packCost);
      expect(minSafe).toBe(26000);
      expect(minSafe).toBeGreaterThan(netPrice + packCost);
    });

    it('menjamin Hukum Konservasi Nilai: Farmer Split + Ops Split = Harga Jual', () => {
      const split = calculateOpenBookSplit(5500, 8000);
      expect(split.displayFarmer + split.displayOps).toBe(8000);
      expect(split.displayFarmer).toBe(5500);
      expect(split.displayOps).toBe(2500);
    });

    it('menerapkan kompresi margin pada Failover 3P tanpa melanggar batas aman', () => {
      const failover = calculateFailoverSellPrice(8000, 600, 1500, 10000);
      expect(failover.sellPrice).toBeGreaterThanOrEqual(failover.minSafePrice);
    });

    it('mendeteksi sinyal harga Bapanas secara presisi', () => {
      const avg14d = 20000;
      expect(determinePriceSignal(20000, avg14d)).toBe('STABLE');
      expect(determinePriceSignal(22000, avg14d)).toBe('SUPPLY_TIGHT');
      expect(determinePriceSignal(18000, avg14d)).toBe('PRICE_DROP');
    });

    it('memformat mata uang rupiah secara akurat', () => {
      expect(formatRupiah(15000)).toMatch(/15\.000/);
      expect(formatRupiah(0)).toMatch(/0/);
    });
  });

  describe('3. Geofencing & Rute Klaster Hyperlocal', () => {
    it('memastikan klaster aktif memiliki QR slug dan titik drop point yang jelas', () => {
      expect(initialClusters.length).toBeGreaterThanOrEqual(3);
      initialClusters.forEach((c) => {
        expect(c.qr_slug.length).toBeGreaterThanOrEqual(3);
        expect(c.address_notes.length).toBeGreaterThanOrEqual(5);
      });
    });

    it('memvalidasi kuota minimum rute baru pada klaster berstatus WAITLIST', () => {
      const waitlistCluster = initialClusters.find((c) => c.status === 'WAITLIST');
      if (waitlistCluster) {
        expect(waitlistCluster.waitlist_target).toBe(5);
        expect(waitlistCluster.waitlist_count).toBeLessThan(waitlistCluster.waitlist_target);
      }
    });
  });

  describe('4. Rekap Pesanan & Perhitungan Laba Kotor', () => {
    it('memastikan pesanan valid memiliki rincian item dan status pembayaran', () => {
      expect(initialOrders.length).toBeGreaterThanOrEqual(3);
      initialOrders.forEach((o) => {
        expect(o.items && o.items.length).toBeGreaterThan(0);
        expect(o.total_amount_idr).toBeGreaterThan(0);
        expect(['PAID', 'PENDING', 'CANCELLED', 'REFUNDED']).toContain(o.payment_status);
        expect([
          'SCHEDULED',
          'DISPATCHED_TO_HUB',
          'READY_AT_CHECKPOINT',
          'DELIVERED',
        ]).toContain(o.delivery_status);
      });
    });

    it('memvalidasi kalkulasi GMV dan Laba Kotor', () => {
      const paidOrders = initialOrders.filter((o) => o.payment_status === 'PAID');
      const gmv = paidOrders.reduce((sum, o) => sum + o.total_amount_idr, 0);
      expect(gmv).toBeGreaterThan(0);
    });
  });

  describe('5. Separasi Akses Pengguna vs Admin', () => {
    it('memvalidasi ketersediaan akun role ADMIN dan CUSTOMER', () => {
      const admin = initialAccounts.find((a) => a.role === 'ADMIN');
      const customer = initialAccounts.find((a) => a.role === 'CUSTOMER');
      expect(admin).toBeDefined();
      expect(customer).toBeDefined();
      expect(admin?.role).not.toBe(customer?.role);
    });
  });
});
