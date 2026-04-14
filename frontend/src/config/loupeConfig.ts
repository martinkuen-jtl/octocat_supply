/**
 * Loupe (magnifier) configuration.
 *
 * Defaults can be overridden with environment variables:
 *   VITE_LOUPE_ZOOM — magnification factor (default: 2.5)
 *   VITE_LOUPE_SIZE — lens diameter in pixels (default: 220)
 */
export const LOUPE_CONFIG = {
  zoomFactor: Number(import.meta.env.VITE_LOUPE_ZOOM ?? 2.5),
  lensSize: Number(import.meta.env.VITE_LOUPE_SIZE ?? 220),
} as const;
