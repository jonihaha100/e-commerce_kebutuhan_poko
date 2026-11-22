import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateCuringGuard, validateVendorSpikeGuard } from '@/lib/pricing-engine';
import { isPastVendorCutoff, getJakartaDateString } from '@/lib/time';
import { initialProducts, initialBenchmarks, initialVendorOffers, initialAiAlerts } from '@/lib/mock-data';

const VendorOfferSchema = z.object({
  cycle_id: z.string().min(1),
  vendor_id: z.string().min(1),
  product_id: z.string().min(1),
  net_price_idr: z.number().int().positive(),
  pack_cost_idr: z.number().int().nonnegative().default(0),
  stock_qty: z.number().int().nonnegative(),
  harvest_date: z.string().min(1),
  ready_to_consume_date: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VendorOfferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi input gagal', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      cycle_id,
      vendor_id,
      product_id,
      net_price_idr,
      pack_cost_idr,
      stock_qty,
      harvest_date,
      ready_to_consume_date,
    } = parsed.data;

    // Retrieve target product metadata
    const product = initialProducts.find((p) => p.id === product_id);
    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan di katalog master' },
        { status: 404 }
      );
    }

    const todayStr = getJakartaDateString();

    // 1. CURING GUARD (Ubi Cilembu Madu)
    if (product.category_type === 'TUBER_CURED_1P') {
      const curingCheck = validateCuringGuard(
        product.category_type,
        product.min_curing_days || 14,
        harvest_date,
        ready_to_consume_date,
        todayStr
      );

      if (!curingCheck.isValid) {
        return NextResponse.json(
          {
            error: curingCheck.error,
            guard: 'CURING_GUARD_VIOLATION',
            curing_days_recorded: curingCheck.curingDays,
            min_required: product.min_curing_days,
          },
          { status: 400 }
        );
      }
    }

    // 2. CUTOFF GUARD (15:00 WIB)
    const isLate = isPastVendorCutoff();

    // 3. VENDOR SPIKE GUARD (>25% vs Benchmark)
    // Find latest benchmark for this product
    const latestBenchmark = initialBenchmarks
      .filter((b) => b.product_id === product_id)
      .sort((a, b) => b.benchmark_date.localeCompare(a.benchmark_date))[0];

    const benchmarkPrice = latestBenchmark ? latestBenchmark.price_idr : net_price_idr;
    const spikeCheck = validateVendorSpikeGuard(net_price_idr, benchmarkPrice);

    let status: 'SUBMITTED' | 'PENDING_ADMIN_REVIEW' | 'APPROVED' = 'APPROVED';

    if (spikeCheck.hasSpike || isLate) {
      status = 'PENDING_ADMIN_REVIEW';

      // Record alert into ai_agent_alerts
      const alert = {
        id: `alt-${Date.now()}`,
        cycle_id,
        product_id,
        agent_name: 'HULU_AGENT' as const,
        severity: 'WARNING' as const,
        title: spikeCheck.hasSpike
          ? `Lonjakan Harga Modal ${product.name} (+${spikeCheck.spikePct}%)`
          : `Input Terlambat Pasca Cutoff 15:00 WIB: ${product.name}`,
        description: spikeCheck.hasSpike
          ? `Harga modal vendor Rp${net_price_idr.toLocaleString('id-ID')} melebihi batas toleransi 25% dari acuan Bapanas Bandung (Rp${benchmarkPrice.toLocaleString('id-ID')}).`
          : `Input diterima setelah batas waktu operasional harian 15:00 WIB. Wajib persetujuan Admin sebelum katalog terbit.`,
        is_resolved: false,
        created_at: new Date().toISOString(),
      };
      initialAiAlerts.unshift(alert);
    }

    // Upsert offer in state
    const newOffer = {
      id: `v-${Date.now()}`,
      cycle_id,
      vendor_id,
      product_id,
      net_price_idr,
      pack_cost_idr,
      stock_qty,
      harvest_date,
      ready_to_consume_date,
      status,
      is_late: isLate,
      created_at: new Date().toISOString(),
    };

    initialVendorOffers.push(newOffer);

    return NextResponse.json({
      success: true,
      offer: newOffer,
      spike_warning: spikeCheck.hasSpike,
      is_late: isLate,
      message:
        status === 'PENDING_ADMIN_REVIEW'
          ? 'Penawaran disimpan dengan status PENDING ADMIN REVIEW karena melewati ambang batas keamanan.'
          : 'Penawaran modal berhasil diterima dan disetujui.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server', message: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
