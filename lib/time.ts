/**
 * lib/time.ts
 * Centralized Timezone Utility forcing Asia/Jakarta (WIB, UTC+7)
 * Operational Cutoff Hours: 14:00, 15:00, 16:00, 17:00, 19:45, 20:00 WIB
 */

export const JAKARTA_TIMEZONE = 'Asia/Jakarta';

export const OPERATIONAL_HOURS = {
  INBOUND_READINESS: 14,      // 14:00 WIB
  VENDOR_CUTOFF: 15,          // 15:00 WIB (Batas input modal harian vendor)
  PRICE_REVIEW_PUBLISH: 16,   // 16:00 WIB (Publikasi katalog ke storefront)
  STORE_RUSH_HOUR: 17,        // 17:00 WIB (Jam sibuk pesanan dibuka)
  GROUPBUY_WARNING_HOUR: 19,  // 19:45 WIB (Peringatan 15 menit penutupan group-buy)
  GROUPBUY_WARNING_MINUTE: 45,
  GROUPBUY_CUTOFF_HOUR: 20,   // 20:00 WIB (Cutoff group-buy & penguncian pesanan)
} as const;

export type CyclePhase = 
  | 'BEFORE_INBOUND'          // < 14:00 WIB
  | 'VENDOR_INPUT_ACTIVE'     // 14:00 - 15:00 WIB
  | 'ADMIN_PRICE_RADAR'       // 15:00 - 16:00 WIB
  | 'CATALOG_OPEN'            // 16:00 - 19:45 WIB
  | 'GROUPBUY_COUNTDOWN'      // 19:45 - 20:00 WIB
  | 'CYCLE_LOCKED';           // >= 20:00 WIB

export interface JakartaTimeParts {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Extract exact year, month, day, hour, minute, second in Asia/Jakarta
 */
export function getJakartaParts(date: Date = new Date()): JakartaTimeParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, number> = {};

  for (const part of parts) {
    if (part.type !== 'literal') {
      partMap[part.type] = parseInt(part.value, 10);
    }
  }

  // Handle case where hour is 24 in some implementations
  const hours = partMap.hour === 24 ? 0 : (partMap.hour ?? 0);

  return {
    year: partMap.year ?? 2026,
    month: partMap.month ?? 1,
    day: partMap.day ?? 1,
    hours,
    minutes: partMap.minute ?? 0,
    seconds: partMap.second ?? 0,
  };
}

/**
 * Formats a Date to ISO Date string "YYYY-MM-DD" in Asia/Jakarta
 */
export function getJakartaDateString(date: Date = new Date()): string {
  const parts = getJakartaParts(date);
  const y = parts.year;
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns formatted time string in WIB (e.g. "15:00:00 WIB")
 */
export function getJakartaTimeString(date: Date = new Date(), withSeconds: boolean = true): string {
  const parts = getJakartaParts(date);
  const h = String(parts.hours).padStart(2, '0');
  const m = String(parts.minutes).padStart(2, '0');
  if (!withSeconds) {
    return `${h}:${m} WIB`;
  }
  const s = String(parts.seconds).padStart(2, '0');
  return `${h}:${m}:${s} WIB`;
}

/**
 * Returns true if current time in Jakarta is past 15:00:00 WIB
 */
export function isPastVendorCutoff(date: Date = new Date()): boolean {
  const parts = getJakartaParts(date);
  return parts.hours >= OPERATIONAL_HOURS.VENDOR_CUTOFF;
}

/**
 * Returns true if current time in Jakarta is >= 16:00:00 WIB (Catalog publish time)
 */
export function isCatalogPublishTime(date: Date = new Date()): boolean {
  const parts = getJakartaParts(date);
  return parts.hours >= OPERATIONAL_HOURS.PRICE_REVIEW_PUBLISH;
}

/**
 * Returns true if current time is in the Group-Buy warning window (19:45 - 19:59:59 WIB)
 */
export function isGroupBuyWarning(date: Date = new Date()): boolean {
  const parts = getJakartaParts(date);
  if (parts.hours === OPERATIONAL_HOURS.GROUPBUY_WARNING_HOUR) {
    return parts.minutes >= OPERATIONAL_HOURS.GROUPBUY_WARNING_MINUTE;
  }
  return false;
}

/**
 * Returns true if current time is >= 20:00:00 WIB (Group-buy locked)
 */
export function isPastGroupBuyCutoff(date: Date = new Date()): boolean {
  const parts = getJakartaParts(date);
  return parts.hours >= OPERATIONAL_HOURS.GROUPBUY_CUTOFF_HOUR;
}

/**
 * Computes the operational cycle phase for any given timestamp
 */
export function getDailyCyclePhase(date: Date = new Date()): CyclePhase {
  const parts = getJakartaParts(date);
  const totalMinutes = parts.hours * 60 + parts.minutes;

  const m14 = OPERATIONAL_HOURS.INBOUND_READINESS * 60; // 14:00 (840)
  const m15 = OPERATIONAL_HOURS.VENDOR_CUTOFF * 60;      // 15:00 (900)
  const m16 = OPERATIONAL_HOURS.PRICE_REVIEW_PUBLISH * 60;// 16:00 (960)
  const m1945 = OPERATIONAL_HOURS.GROUPBUY_WARNING_HOUR * 60 + OPERATIONAL_HOURS.GROUPBUY_WARNING_MINUTE; // 19:45 (1185)
  const m20 = OPERATIONAL_HOURS.GROUPBUY_CUTOFF_HOUR * 60; // 20:00 (1200)

  if (totalMinutes < m14) {
    return 'BEFORE_INBOUND';
  } else if (totalMinutes < m15) {
    return 'VENDOR_INPUT_ACTIVE';
  } else if (totalMinutes < m16) {
    return 'ADMIN_PRICE_RADAR';
  } else if (totalMinutes < m1945) {
    return 'CATALOG_OPEN';
  } else if (totalMinutes < m20) {
    return 'GROUPBUY_COUNTDOWN';
  } else {
    return 'CYCLE_LOCKED';
  }
}

/**
 * Create a UTC Date instance corresponding to a specific WIB (UTC+7) time
 */
export function createDateInWIB(
  year: number,
  month: number, // 1-12
  day: number,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): Date {
  // WIB is UTC+7, so UTC time is WIB hours - 7
  return new Date(Date.UTC(year, month - 1, day, hours - 7, minutes, seconds));
}
