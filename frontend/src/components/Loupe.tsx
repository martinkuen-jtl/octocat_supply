import { useEffect, useRef, useState } from 'react';
import { LOUPE_CONFIG } from '../config/loupeConfig';

interface LoupeProps {
  visible: boolean;
  /** Magnification factor. Defaults to VITE_LOUPE_ZOOM or 2.5. */
  zoom?: number;
  /** Lens diameter in pixels. Defaults to VITE_LOUPE_SIZE or 220. */
  size?: number;
  /**
   * Changing this value triggers a snapshot rebuild. Pass the current
   * route pathname (or `location.key`) so the snapshot refreshes on
   * every navigation.
   */
  refreshKey?: string;
}

/**
 * Circular magnifier (loupe) overlay.
 *
 * When `visible` is true, a round lens follows the mouse cursor and shows
 * the surrounding page content magnified by `zoom`. The magnified view is
 * built from a live DOM snapshot so it reflects the current page state.
 *
 * Toggle with Alt+L (see useLoupeHotkey).
 */
export default function Loupe({
  visible,
  zoom = LOUPE_CONFIG.zoomFactor,
  size = LOUPE_CONFIG.lensSize,
  refreshKey,
}: LoupeProps) {
  const lensRef = useRef<HTMLDivElement>(null);
  const lensContentRef = useRef<HTMLDivElement>(null);
  // Incremented (via RAF-throttled scroll listener) to trigger snapshot rebuild.
  const [snapshotVersion, setSnapshotVersion] = useState(0);

  // Move lens and reposition the zoomed-content div on every mousemove.
  // Direct DOM writes avoid a React re-render on every frame.
  useEffect(() => {
    if (!visible) {return;}

    const onMove = (e: MouseEvent) => {
      const lens = lensRef.current;
      const content = lensContentRef.current;
      if (!lens || !content) {return;}

      const x = e.clientX;
      const y = e.clientY;

      // Position the circular lens so its centre follows the cursor.
      lens.style.left = `${x - size / 2}px`;
      lens.style.top = `${y - size / 2}px`;

      // Offset the inner snapshot so the cursor maps to the lens centre,
      // then scale around that same point.
      //
      // Math: a page point P maps to lens-internal coords via
      //   lens_P = P + (size/2 - cursor)
      // After scale(zoom) with origin cursor:
      //   lens_P' = (P - cursor) * zoom + size/2
      // At P = cursor → lens_P' = size/2  (stays centred) ✓
      content.style.left = `${size / 2 - x}px`;
      content.style.top = `${size / 2 - y}px`;
      content.style.transformOrigin = `${x}px ${y}px`;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, [visible, size]);

  // Invalidate the snapshot on scroll so it is rebuilt at the new scroll
  // position. We throttle via requestAnimationFrame to avoid rebuilding on
  // every pixel change.
  useEffect(() => {
    if (!visible) {return;}

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setSnapshotVersion((v) => v + 1);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [visible]);

  // Build (or rebuild) a DOM snapshot whenever the loupe becomes visible,
  // the route changes (refreshKey), or the page was scrolled (snapshotVersion).
  // We clone the entire #root element so all current styles and images
  // are preserved without any extra dependencies.
  useEffect(() => {
    if (!visible) {
      if (lensContentRef.current) {
        lensContentRef.current.innerHTML = '';
      }
      return;
    }

    const root = document.getElementById('root');
    const lensContent = lensContentRef.current;
    if (!root || !lensContent) {return;}

    const clone = root.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      `width:${window.innerWidth}px`,
      `height:${window.innerHeight}px`,
      'pointer-events:none',
      'user-select:none',
      'overflow:hidden',
    ].join(';');

    // Remove the loupe element itself from the clone to prevent recursion.
    const loupeInClone = clone.querySelector('[data-loupe]');
    loupeInClone?.remove();

    lensContent.innerHTML = '';
    lensContent.appendChild(clone);
  }, [visible, refreshKey, snapshotVersion]);

  if (!visible) {return null;}

  return (
    <div
      data-loupe
      aria-hidden="true"
      style={{
        position: 'fixed',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 9998,
        // Brand-green ring + soft drop shadow
        boxShadow:
          '0 4px 32px rgba(0,0,0,0.45), 0 0 0 3px #76B852, 0 0 0 6px rgba(118,184,82,0.25)',
        // Initial position; updated in the mousemove handler above.
        left: -size,
        top: -size,
      }}
      ref={lensRef}
    >
      {/* Zoomed page snapshot */}
      <div
        ref={lensContentRef}
        style={{
          position: 'absolute',
          width: window.innerWidth,
          height: window.innerHeight,
          transform: `scale(${zoom})`,
          pointerEvents: 'none',
        }}
      />

      {/* Loupe icon badge in the bottom-right of the lens */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: 'rgba(118,184,82,0.92)',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
        }}
        aria-hidden="true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
    </div>
  );
}
