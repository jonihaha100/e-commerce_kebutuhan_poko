# Pricing Engine & AI Agent Guardrails Specification
**Platform:** Berkah Tani Sejahtera (Agrojaya Global Indo)  
**Standard Currency:** IDR (Rupiah, integer, no decimal cents)  
**Rounding Standard:** Round up to nearest Rp100 (`roundUp100`)

---

## 1. Mesin Kalkulasi Harga Deterministik (`lib/pricing-engine.ts`)

Semua kalkulasi harga bersifat murni (*pure deterministic functions*), menjamin *zero floating-point leaks* dan wajib mematuhi batasan database `sell_price_idr >= min_safe_price_idr`.

### A. Utilitas Pembulatan
```typescript
export function roundUp100(amount: number): number {
  return Math.ceil(amount / 100) * 100;
}
```

### B. Formula P_min_safe (`calculateMinSafePrice`)
Batas bawah absolut harga jual yang menjamin perusahaan dan mitra tidak pernah menanggung rugi.
Meliputi:
- $HPP = NetPrice + PackCost$
- Komisi Mitra IRT = $8\%$
- Flat fee antar pagar = $Rp2.500$
- Payment gateway & operational risk buffer = $1.5\%$

$$\text{P\_min\_safe} = \text{roundUp100}\left( \frac{\text{NetPrice} + \text{PackCost} + 2500}{1 - (0.08 + 0.015)} \right)$$

### C. Formula Harga Jual 1P Petani (`calculate1PSellPrice`)
Menjaga margin target sehat untuk produk panen langsung 1P:
$$\text{RawPrice} = \frac{\text{NetPrice} + \text{PackCost}}{1 - \text{targetMarginPct}}$$
Jika tersedia `benchmarkPrice` (Bapanas):
- Jika $\text{RawPrice} > \text{benchmarkPrice} \times 1.05$, harga dibatasi pada $\text{benchmarkPrice} \times 1.05$ (selama $\ge \text{P\_min\_safe}$).
$$\text{SellPrice} = \max(\text{roundUp100}(\text{RawPrice}), \text{P\_min\_safe})$$

### D. Formula Failover 3P Grosir Pasar Induk (`calculateFailoverSellPrice`)
Ketika pasokan 1P kosong, sistem mengaktifkan pasokan cadangan 3P dengan **kompresi margin otomatis**:
$$\text{RawPrice} = \text{NetPrice3P} + \text{PackCost} + \text{FlatOpsFee}$$
$$\text{SellPrice} = \max(\text{roundUp100}(\text{RawPrice}), \text{calculateMinSafePrice}(\text{NetPrice3P}, \text{PackCost}))$$
- **Warning Indicator:** Jika $\text{SellPrice} > \text{prev1PPrice} \times 1.15$, tandai `warning = true` (kenaikan harga > 15%).

### E. Transparansi Terbuka (`calculateOpenBookSplit`)
Wajib memenuhi postulat:
$$\text{displayFarmer} + \text{displayOps} \equiv \text{sellPrice}$$
- $\text{displayFarmer} = \text{netPrice}$
- $\text{displayOps} = \text{sellPrice} - \text{netPrice}$

### F. Sinyal Harga Radar (`determinePriceSignal`)
Membandingkan harga jual hari ini terhadap rata-rata 14 hari:
- Jika $\text{sellPrice} < \text{avg14dPrice} \times 0.95 \rightarrow \text{'PRICE\_DROP'}$ (Badge Hijau)
- Jika $\text{sellPrice} > \text{avg14dPrice} \times 1.05 \rightarrow \text{'SUPPLY\_TIGHT'}$ (Badge Oranye/Merah)
- Lainnya $\rightarrow \text{'STABLE'}$ (Badge Netral)

---

## 2. Pagar Pengaman Hulu (Guardrails)

### A. Curing Guard (Ubi Cilembu Madu)
- Berlaku untuk produk kategori `TUBER_CURED_1P`.
- Menolak penawaran (HTTP 400 Bad Request) jika:
  1. `ready_to_consume_date > cycle_date`, ATAU
  2. `ready_to_consume_date - harvest_date < min_curing_days` (14 hari).
- *Alasan:* Ubi Cilembu yang belum diperam minimal 14 hari belum mengeluarkan getah madu alami dan rasa masih hambar.

### B. Vendor Spike Guard
- Berlaku untuk semua komoditas saat input harga modal `net_price_idr`.
- Jika $\text{net\_price\_idr} > 1.25 \times \text{benchmarkPrice}$ (lonjakan >25%):
  1. Status penawaran otomatis diset ke `PENDING_ADMIN_REVIEW`.
  2. Sistem otomatis merekam ke tabel `ai_agent_alerts` dengan severity `WARNING` dan agent `HULU_AGENT`.

### C. Cutoff Guard
- Batas akhir pengisian vendor harian adalah pukul 15:00 WIB.
- Input setelah pukul 15:00 WIB otomatis ditandai `is_late = true` dan memerlukan persetujuan manual Admin sebelum dipublikasikan.
