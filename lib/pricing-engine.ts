/**
 * lib/pricing-engine.ts
 * Pure deterministic pricing engine, open-book calculations, and upstream guardrails
 * Guaranteed integer Rupiah arithmetic and circuit-breaker compliance
 */

export interface OpenBookSplit {
  displayFarmer: number;
  displayOps: number;
}

export interface FailoverPricingResult {
  sellPrice: number;
  minSafePrice: number;
  warning15PctJump: boolean;
  priceJumpPct: number;
}

export type PriceSignalType = 'PRICE_DROP' | 'STABLE' | 'SUPPLY_TIGHT';

/**
 * Standard rounding: always round UP to nearest Rp100
 */
export function roundUp100(amount: number): number {
  if (amount <= 0) return 0;
  return Math.ceil(amount / 100) * 100;
}

/**
 * Format integer IDR to standard Indonesian Rupiah string (e.g. "Rp 17.500")
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate P_min_safe (Minimum Safe Selling Price)
 * Protects:
 * - Net purchase price + packaging cost
 * - Mitra IRT commission (8%)
 * - Flat delivery fee to gate (Rp2.500)
 * - Operational & payment gateway buffer (1.5%)
 */
export function calculateMinSafePrice(netPrice: number, packCost: number = 0): number {
  const baseCost = netPrice + packCost;
  const deliveryBuffer = 2500;
  const divisor = 1 - (0.08 + 0.015); // 0.905
  const rawMin = (baseCost + deliveryBuffer) / divisor;
  const minSafe = roundUp100(rawMin);

  // Hard safety invariant: selling price can never be below base cost + flat fee
  return Math.max(minSafe, roundUp100(baseCost + deliveryBuffer));
}

/**
 * Calculate standard 1P Direct Farm Selling Price
 * Applies target margin (default 20%) while anchoring against benchmark if available
 */
export function calculate1PSellPrice(
  netPrice: number,
  packCost: number = 0,
  targetMarginPct: number = 0.20,
  benchmarkPrice?: number
): number {
  const minSafe = calculateMinSafePrice(netPrice, packCost);
  const rawTarget = (netPrice + packCost) / (1 - targetMarginPct);
  let target = roundUp100(rawTarget);

  if (benchmarkPrice && benchmarkPrice > 0) {
    const maxAllowed = Math.floor(benchmarkPrice * 1.05);
    if (target > maxAllowed) {
      target = roundUp100(maxAllowed);
    }
  }

  // Circuit breaker: Sell price MUST be >= minSafePrice
  return Math.max(target, minSafe);
}

/**
 * Calculate 3P Wholesale Failover Selling Price
 * Compresses margin using flat ops fee (Rp1.500) and warns if price jumps > 15% vs 1P
 */
export function calculateFailoverSellPrice(
  netPrice3P: number,
  packCost: number = 0,
  flatFee: number = 1500,
  prev1PPrice?: number
): FailoverPricingResult {
  const minSafe = calculateMinSafePrice(netPrice3P, packCost);
  const rawPrice = netPrice3P + packCost + flatFee;
  const sellPrice = Math.max(roundUp100(rawPrice), minSafe);

  let warning15PctJump = false;
  let priceJumpPct = 0;

  if (prev1PPrice && prev1PPrice > 0) {
    priceJumpPct = Math.round(((sellPrice - prev1PPrice) / prev1PPrice) * 100);
    if (priceJumpPct > 15) {
      warning15PctJump = true;
    }
  }

  return {
    sellPrice,
    minSafePrice: minSafe,
    warning15PctJump,
    priceJumpPct,
  };
}

/**
 * Calculate Open Book Split (Transparent Cost Breakdown)
 * Strictly guarantees: displayFarmer + displayOps === sellPrice
 */
export function calculateOpenBookSplit(netPrice: number, sellPrice: number): OpenBookSplit {
  const displayFarmer = netPrice;
  const displayOps = Math.max(0, sellPrice - netPrice);
  return {
    displayFarmer,
    displayOps,
  };
}

/**
 * Determine radar signal indicator compared to 14-day average price
 * < 95% -> PRICE_DROP
 * > 105% -> SUPPLY_TIGHT
 * else -> STABLE
 */
export function determinePriceSignal(sellPrice: number, avg14dPrice: number): PriceSignalType {
  if (!avg14dPrice || avg14dPrice <= 0) {
    return 'STABLE';
  }
  if (sellPrice < avg14dPrice * 0.95) {
    return 'PRICE_DROP';
  }
  if (sellPrice > avg14dPrice * 1.05) {
    return 'SUPPLY_TIGHT';
  }
  return 'STABLE';
}

/**
 * Curing Guard Validation for TUBER_CURED_1P (Ubi Cilembu)
 * Rejects if:
 * 1. ready_to_consume_date > cycle_date
 * 2. curing period < min_curing_days (14 days)
 */
export function validateCuringGuard(
  categoryType: string,
  minCuringDays: number,
  harvestDateStr: string,
  readyToConsumeDateStr: string,
  cycleDateStr: string
): { isValid: boolean; error?: string; curingDays: number } {
  if (categoryType !== 'TUBER_CURED_1P') {
    return { isValid: true, curingDays: 0 };
  }

  const harvest = new Date(harvestDateStr);
  const ready = new Date(readyToConsumeDateStr);
  const cycle = new Date(cycleDateStr);

  // Check valid dates
  if (isNaN(harvest.getTime()) || isNaN(ready.getTime()) || isNaN(cycle.getTime())) {
    return { isValid: false, error: 'Format tanggal panen atau tanggal konsumsi tidak valid.', curingDays: 0 };
  }

  // 1. Ready date check vs cycle date
  if (ready.getTime() > cycle.getTime()) {
    return {
      isValid: false,
      error: `Ubi Cilembu belum siap dikonsumsi pada tanggal siklus (${cycleDateStr}). Tanggal siap: ${readyToConsumeDateStr}.`,
      curingDays: 0,
    };
  }

  // 2. Curing days duration check
  const diffMs = ready.getTime() - harvest.getTime();
  const curingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (curingDays < minCuringDays) {
    return {
      isValid: false,
      error: `Ubi Cilembu wajib diperam (curing) minimal ${minCuringDays} hari agar madu keluar alami (tercatat: ${curingDays} hari).`,
      curingDays,
    };
  }

  return { isValid: true, curingDays };
}

/**
 * Vendor Price Spike Guard
 * Triggers review if net_price_idr > 1.25 * benchmarkPrice (>25% spike)
 */
export function validateVendorSpikeGuard(
  netPriceIdr: number,
  latestBenchmarkPrice: number
): { hasSpike: boolean; spikeRatio: number; spikePct: number } {
  if (!latestBenchmarkPrice || latestBenchmarkPrice <= 0) {
    return { hasSpike: false, spikeRatio: 1.0, spikePct: 0 };
  }

  const spikeRatio = netPriceIdr / latestBenchmarkPrice;
  const spikePct = Math.round((spikeRatio - 1) * 100);

  return {
    hasSpike: spikeRatio > 1.25,
    spikeRatio,
    spikePct,
  };
}
