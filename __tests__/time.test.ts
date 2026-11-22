import {
  getJakartaParts,
  getJakartaTimeString,
  getJakartaDateString,
  isPastVendorCutoff,
  isCatalogPublishTime,
  isGroupBuyWarning,
  isPastGroupBuyCutoff,
  getDailyCyclePhase,
  createDateInWIB,
} from '../lib/time';

describe('Centralized Jakarta Timezone Utilities (lib/time.ts)', () => {
  test('Correctly extracts Asia/Jakarta parts regardless of server timezone', () => {
    // 2026-11-22 15:30:00 WIB is 2026-11-22 08:30:00 UTC
    const date = new Date('2026-11-22T08:30:00.000Z');
    const parts = getJakartaParts(date);

    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(11);
    expect(parts.day).toBe(22);
    expect(parts.hours).toBe(15);
    expect(parts.minutes).toBe(30);
  });

  test('Correctly formats date and time strings in WIB', () => {
    const date = createDateInWIB(2026, 11, 22, 14, 45, 10);
    expect(getJakartaDateString(date)).toBe('2026-11-22');
    expect(getJakartaTimeString(date, true)).toBe('14:45:10 WIB');
    expect(getJakartaTimeString(date, false)).toBe('14:45 WIB');
  });

  test('Validates 15:00 WIB Vendor Cutoff Guard', () => {
    const before15 = createDateInWIB(2026, 11, 22, 14, 59, 59);
    const exactly15 = createDateInWIB(2026, 11, 22, 15, 0, 0);
    const after15 = createDateInWIB(2026, 11, 22, 15, 1, 0);

    expect(isPastVendorCutoff(before15)).toBe(false);
    expect(isPastVendorCutoff(exactly15)).toBe(true);
    expect(isPastVendorCutoff(after15)).toBe(true);
  });

  test('Validates 16:00 WIB Catalog Publish Trigger', () => {
    const before16 = createDateInWIB(2026, 11, 22, 15, 59, 0);
    const at16 = createDateInWIB(2026, 11, 22, 16, 0, 0);

    expect(isCatalogPublishTime(before16)).toBe(false);
    expect(isCatalogPublishTime(at16)).toBe(true);
  });

  test('Validates 19:45 WIB Group-Buy Countdown Warning', () => {
    const beforeWarning = createDateInWIB(2026, 11, 22, 19, 44, 59);
    const inWarning = createDateInWIB(2026, 11, 22, 19, 45, 0);
    const endWarning = createDateInWIB(2026, 11, 22, 19, 59, 59);

    expect(isGroupBuyWarning(beforeWarning)).toBe(false);
    expect(isGroupBuyWarning(inWarning)).toBe(true);
    expect(isGroupBuyWarning(endWarning)).toBe(true);
  });

  test('Validates 20:00 WIB Group-Buy Cutoff Lock', () => {
    const before20 = createDateInWIB(2026, 11, 22, 19, 59, 59);
    const at20 = createDateInWIB(2026, 11, 22, 20, 0, 0);

    expect(isPastGroupBuyCutoff(before20)).toBe(false);
    expect(isPastGroupBuyCutoff(at20)).toBe(true);
  });

  test('Accurately determines daily cycle phases across the 24-hour timeline', () => {
    expect(getDailyCyclePhase(createDateInWIB(2026, 11, 22, 10, 0, 0))).toBe('BEFORE_INBOUND');
    expect(getDailyCyclePhase(createDateInWIB(2026, 11, 22, 14, 15, 0))).toBe('VENDOR_INPUT_ACTIVE');
    expect(getDailyCyclePhase(createDateInWIB(2026, 11, 22, 15, 30, 0))).toBe('ADMIN_PRICE_RADAR');
    expect(getDailyCyclePhase(createDateInWIB(2026, 11, 22, 17, 0, 0))).toBe('CATALOG_OPEN');
    expect(getDailyCyclePhase(createDateInWIB(2026, 11, 22, 19, 50, 0))).toBe('GROUPBUY_COUNTDOWN');
    expect(getDailyCyclePhase(createDateInWIB(2026, 11, 22, 20, 30, 0))).toBe('CYCLE_LOCKED');
  });
});
