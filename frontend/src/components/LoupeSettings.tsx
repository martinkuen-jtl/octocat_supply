import { Link } from 'react-router-dom';
import { useLoupeContext } from '../context/LoupeContext';
import { useTheme } from '../context/ThemeContext';
import { LOUPE_CONFIG } from '../config/loupeConfig';

const ZOOM_MIN = 1.5;
const ZOOM_MAX = 5.0;
const ZOOM_STEP = 0.1;

const SIZE_MIN = 100;
const SIZE_MAX = 400;
const SIZE_STEP = 10;

/**
 * Dedicated configuration page for the Loupe (magnifier) feature.
 * Accessible at /loupe.
 *
 * Lets users adjust zoom factor and lens size at runtime.
 * Values are persisted to localStorage and take immediate effect.
 */
export default function LoupeSettings() {
  const { darkMode } = useTheme();
  const { visible, zoomFactor, lensSize, toggleVisible, setZoomFactor, setLensSize } =
    useLoupeContext();

  const handleReset = () => {
    setZoomFactor(LOUPE_CONFIG.zoomFactor);
    setLensSize(LOUPE_CONFIG.lensSize);
  };

  const textBase = darkMode ? 'text-light' : 'text-gray-800';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const labelClass = `block text-sm font-medium mb-1 ${textBase}`;
  const valueClass = 'ml-3 w-14 text-right text-sm font-mono text-primary';

  return (
    <div className="pt-24 pb-12 px-4 max-w-xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className={`inline-flex items-center gap-1 text-sm ${textMuted} hover:text-primary mb-6 transition-colors`}
        aria-label="Back to home"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </Link>

      <h1 className={`text-2xl font-bold mb-2 ${textBase}`}>🔍 Loupe Settings</h1>
      <p className={`text-sm mb-6 ${textMuted}`}>
        The loupe is a circular magnifier that follows your cursor. Toggle it with the{' '}
        <kbd className="px-1 py-0.5 rounded border text-xs font-mono">Alt+L</kbd> shortcut or the
        button in the navigation bar.
      </p>

      <div className={`rounded-xl shadow-sm p-6 ${cardBg} space-y-6`}>
        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-sm font-medium ${textBase}`}>Loupe enabled</span>
            <p className={`text-xs mt-0.5 ${textMuted}`}>
              You can also press <kbd className="px-1 py-0.5 rounded border text-xs font-mono">Alt+L</kbd>
            </p>
          </div>
          <button
            onClick={toggleVisible}
            aria-pressed={visible}
            aria-label={visible ? 'Disable loupe' : 'Enable loupe'}
            data-loupe-toggle
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              visible ? 'bg-primary' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                visible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <hr className={darkMode ? 'border-gray-700' : 'border-gray-100'} />

        {/* Zoom factor slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="loupe-zoom" className={labelClass}>
              Zoom factor
            </label>
            <span className={valueClass} aria-live="polite">
              {zoomFactor.toFixed(1)}×
            </span>
          </div>
          <input
            id="loupe-zoom"
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={ZOOM_STEP}
            value={zoomFactor}
            onChange={(e) => setZoomFactor(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
            aria-valuemin={ZOOM_MIN}
            aria-valuemax={ZOOM_MAX}
            aria-valuenow={zoomFactor}
            aria-valuetext={`${zoomFactor.toFixed(1)} times`}
          />
          <div className={`flex justify-between text-xs mt-1 ${textMuted}`}>
            <span>{ZOOM_MIN}×</span>
            <span>{ZOOM_MAX}×</span>
          </div>
        </div>

        {/* Lens size slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="loupe-size" className={labelClass}>
              Lens size
            </label>
            <span className={valueClass} aria-live="polite">
              {lensSize} px
            </span>
          </div>
          <input
            id="loupe-size"
            type="range"
            min={SIZE_MIN}
            max={SIZE_MAX}
            step={SIZE_STEP}
            value={lensSize}
            onChange={(e) => setLensSize(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
            aria-valuemin={SIZE_MIN}
            aria-valuemax={SIZE_MAX}
            aria-valuenow={lensSize}
            aria-valuetext={`${lensSize} pixels`}
          />
          <div className={`flex justify-between text-xs mt-1 ${textMuted}`}>
            <span>{SIZE_MIN} px</span>
            <span>{SIZE_MAX} px</span>
          </div>
        </div>

        <hr className={darkMode ? 'border-gray-700' : 'border-gray-100'} />

        {/* Reset to defaults */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${textMuted}`}>
            Defaults: {LOUPE_CONFIG.zoomFactor}× zoom, {LOUPE_CONFIG.lensSize} px
          </span>
          <button
            onClick={handleReset}
            className={`text-sm px-3 py-1 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:border-primary hover:text-primary'
                : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            Reset to defaults
          </button>
        </div>
      </div>

      <p className={`mt-4 text-xs ${textMuted}`}>
        Settings are saved in your browser and persist across sessions.
        You can also set defaults via{' '}
        <code className="font-mono">VITE_LOUPE_ZOOM</code> /{' '}
        <code className="font-mono">VITE_LOUPE_SIZE</code> environment variables.
      </p>
    </div>
  );
}
