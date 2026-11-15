'use client';

/**
 * RxWatermark — Dedicated Prescription Watermark Layer.
 * Supports:
 * - Placements: full_page, center, rx_side (medicines side only), clinical_side (C/C & O/E only).
 * - Types: custom_image, clinic logo, or custom diagonal text.
 * - Color modes: Full Color vs Grayscale.
 * - Opacity calibration (0.04 to 0.20).
 */
import { getPadTheme } from '@/lib/prescriptionTheme';
import type { Tenant, WatermarkPlacement } from '@/types/schema';

interface RxWatermarkProps {
  tenant: Tenant;
  theme?: ReturnType<typeof getPadTheme>;
  targetPlacement: WatermarkPlacement;
  isColumnScope?: boolean;
}

export function RxWatermark({
  tenant,
  theme,
  targetPlacement,
  isColumnScope = false,
}: RxWatermarkProps) {
  if (!tenant.watermark_enabled) return null;

  const activePlacement: WatermarkPlacement = tenant.watermark_placement || 'center';

  // Only render if the component target matches the active configured placement
  if (activePlacement !== targetPlacement) return null;

  const logoUrl = tenant.logo_url;
  const opacity = tenant.watermark_opacity ?? 0.07;
  const grayscaleClass = tenant.watermark_color_mode === 'grayscale' ? 'grayscale' : '';
  const resolvedTheme = theme || getPadTheme(tenant.pad_layout_style);

  // Sizing by placement scope
  let sizeClasses = 'max-w-[360px] max-h-[360px]';
  let textSizeClass = 'text-5xl';
  let wrapperClasses = 'absolute inset-x-0 top-32 bottom-12 flex items-center justify-center';

  if (targetPlacement === 'full_page') {
    sizeClasses = 'max-w-[460px] max-h-[460px]';
    textSizeClass = 'text-6xl';
    wrapperClasses = 'absolute inset-0 flex items-center justify-center';
  } else if (targetPlacement === 'rx_side') {
    sizeClasses = 'max-w-[280px] max-h-[280px]';
    textSizeClass = 'text-4xl';
    wrapperClasses = 'absolute inset-0 flex items-center justify-center';
  } else if (targetPlacement === 'clinical_side') {
    sizeClasses = 'max-w-[190px] max-h-[190px]';
    textSizeClass = 'text-2xl';
    wrapperClasses = 'absolute inset-0 flex items-center justify-center';
  }

  const isCustomImage = tenant.watermark_type === 'custom_image' && tenant.watermark_image_url;
  const isLogo = tenant.watermark_type === 'logo' && logoUrl;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden z-0 ${wrapperClasses}`}
    >
      {isCustomImage ? (
        <img
          src={tenant.watermark_image_url!}
          alt=""
          className={`${sizeClasses} object-contain transition-opacity duration-200 ${grayscaleClass}`}
          style={{ opacity }}
        />
      ) : isLogo ? (
        <img
          src={logoUrl!}
          alt=""
          className={`${sizeClasses} object-contain transition-opacity duration-200 ${grayscaleClass}`}
          style={{ opacity }}
        />
      ) : (
        <span
          className={`font-black uppercase tracking-widest rotate-[-25deg] whitespace-nowrap text-center select-none ${textSizeClass}`}
          style={{
            opacity,
            color: tenant.watermark_color || resolvedTheme.hex,
          }}
        >
          {tenant.watermark_text || tenant.clinic_name}
        </span>
      )}
    </div>
  );
}
