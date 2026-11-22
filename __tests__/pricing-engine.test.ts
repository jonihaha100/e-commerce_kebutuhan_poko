import {
  roundUp100,
  calculateMinSafePrice,
  calculate1PSellPrice,
  calculateFailoverSellPrice,
  calculateOpenBookSplit,
  determinePriceSignal,
  validateCuringGuard,
  validateVendorSpikeGuard,
  formatRupiah,
} from '../lib/pricing-engine';

describe('Pricing Engine & Upstream Guardrails (lib/pricing-engine.ts)', () => {
  describe('Rounding & Currency Formatting', () => {
    test('roundUp100 rounds up to exact multiples of Rp100', () => {
      expect(roundUp100(15001)).toBe(15100);
      expect(roundUp100(15000)).toBe(15000);
      expect(roundUp100(15099)).toBe(15100);
      expect(roundUp100(10)).toBe(100);
      expect(roundUp100(0)).toBe(0);
    });

    test('formatRupiah formats correctly with IDR style', () => {
      const formatted = formatRupiah(25000);
      expect(formatted).toMatch(/25\.000/);
    });
  });

  describe('Circuit Breaker: min_safe_price Invariant', () => {
    test('Selling price is NEVER below min_safe_price', () => {
      const netPrice = 10000;
      const packCost = 500;
      const minSafe = calculateMinSafePrice(netPrice, packCost);

      // Try with low target margin (5%) and benchmark lower than cost
      const sellPrice = calculate1PSellPrice(netPrice, packCost, 0.05, 8000);

      expect(sellPrice).toBeGreaterThanOrEqual(minSafe);
      expect(sellPrice % 100).toBe(0);
      expect(minSafe % 100).toBe(0);
    });

    test('calculateMinSafePrice covers HPP + Mitra commission + Gate fee + Risk buffer', () => {
      const netPrice = 20000;
      const packCost = 1000;
      const minSafe = calculateMinSafePrice(netPrice, packCost);

      // (21000 + 2500) / 0.905 = 25966.85 -> rounded up to 26000
      expect(minSafe).toBe(26000);
      expect(minSafe).toBeGreaterThan(netPrice + packCost);
    });
  });

  describe('Open Book Split Integrity', () => {
    test('displayFarmer + displayOps strictly equals sellPrice', () => {
      const testCases = [
        { net: 5000, sell: 8200 },
        { net: 12500, sell: 18000 },
        { net: 35000, sell: 46000 },
        { net: 17300, sell: 24500 },
      ];

      for (const tc of testCases) {
        const split = calculateOpenBookSplit(tc.net, tc.sell);
        expect(split.displayFarmer).toBe(tc.net);
        expect(split.displayOps).toBe(tc.sell - tc.net);
        expect(split.displayFarmer + split.displayOps).toBe(tc.sell);
      }
    });
  });

  describe('Failover 3P & Warning 15% Trigger', () => {
    test('Triggers warning if 3P failover sell price jumps > 15% vs previous 1P price', () => {
      const net3P = 20000;
      const packCost = 1000;
      const prev1P = 22000; // Previous 1P price

      const result = calculateFailoverSellPrice(net3P, packCost, 1500, prev1P);

      expect(result.sellPrice).toBeGreaterThanOrEqual(result.minSafePrice);
      expect(result.warning15PctJump).toBe(true);
      expect(result.priceJumpPct).toBeGreaterThan(15);
    });

    test('Does not trigger warning if price jump is within 15%', () => {
      const net3P = 10000;
      const packCost = 500;
      const prev1P = 15000;

      const result = calculateFailoverSellPrice(net3P, packCost, 1500, prev1P);
      expect(result.warning15PctJump).toBe(false);
    });
  });

  describe('Price Radar Signal Indicators', () => {
    test('Correctly tags PRICE_DROP, SUPPLY_TIGHT, and STABLE', () => {
      const avg14d = 20000;

      // 18000 is 10% lower than 20000 (< 0.95)
      expect(determinePriceSignal(18000, avg14d)).toBe('PRICE_DROP');

      // 22000 is 10% higher than 20000 (> 1.05)
      expect(determinePriceSignal(22000, avg14d)).toBe('SUPPLY_TIGHT');

      // 20200 is within +/- 5%
      expect(determinePriceSignal(20200, avg14d)).toBe('STABLE');
    });
  });

  describe('Guardrail: Curing Guard (Ubi Cilembu Madu)', () => {
    test('REJECTS Ubi Cilembu with only 10 days curing (< 14 days required)', () => {
      const harvestDate = '2026-11-10';
      const readyDate = '2026-11-20'; // 10 days difference
      const cycleDate = '2026-11-22';

      const validation = validateCuringGuard(
        'TUBER_CURED_1P',
        14,
        harvestDate,
        readyDate,
        cycleDate
      );

      expect(validation.isValid).toBe(false);
      expect(validation.curingDays).toBe(10);
      expect(validation.error).toMatch(/minimal 14 hari/);
    });

    test('REJECTS Ubi Cilembu if ready_to_consume_date is AFTER cycle_date', () => {
      const harvestDate = '2026-11-01';
      const readyDate = '2026-11-25'; // After cycle date
      const cycleDate = '2026-11-22';

      const validation = validateCuringGuard(
        'TUBER_CURED_1P',
        14,
        harvestDate,
        readyDate,
        cycleDate
      );

      expect(validation.isValid).toBe(false);
      expect(validation.error).toMatch(/belum siap dikonsumsi/);
    });

    test('ACCEPTS Ubi Cilembu with 15 days curing ready on or before cycle date', () => {
      const harvestDate = '2026-11-05';
      const readyDate = '2026-11-20'; // 15 days curing
      const cycleDate = '2026-11-22';

      const validation = validateCuringGuard(
        'TUBER_CURED_1P',
        14,
        harvestDate,
        readyDate,
        cycleDate
      );

      expect(validation.isValid).toBe(true);
      expect(validation.curingDays).toBe(15);
      expect(validation.error).toBeUndefined();
    });

    test('Bypasses curing guard for non-tuber products (e.g. VEGETABLE_1P)', () => {
      const validation = validateCuringGuard(
        'VEGETABLE_1P',
        0,
        '2026-11-22',
        '2026-11-22',
        '2026-11-22'
      );
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Guardrail: Vendor Spike Guard (>25% vs Benchmark)', () => {
    test('FLAGS spike if vendor net price > 1.25 * benchmark', () => {
      const benchmark = 20000;
      const netPrice = 26000; // 30% higher

      const spike = validateVendorSpikeGuard(netPrice, benchmark);

      expect(spike.hasSpike).toBe(true);
      expect(spike.spikePct).toBe(30);
    });

    test('PASSES without spike if vendor price is within 25%', () => {
      const benchmark = 20000;
      const netPrice = 24000; // 20% higher (< 25%)

      const spike = validateVendorSpikeGuard(netPrice, benchmark);

      expect(spike.hasSpike).toBe(false);
      expect(spike.spikePct).toBe(20);
    });
  });
});
