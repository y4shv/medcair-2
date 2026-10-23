// Tiny pulse line for section eyebrows. Decorative, mint (never used as text).
export function PulseIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" className={className}>
      <path
        d="M1 6h5l2-4 3 8 2.5-4H21"
        stroke="#3CCFB0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
