// Soft wave edges that echo the flow lines. Decorative: hidden from screen readers.
// Two gentle sine-like curves, never a zig-zag. preserveAspectRatio="none" stretches them to the width.

/** Bottom edge of the hero. Fill matches the top of the section below (#E3F2F7). */
export function HeroWave() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] block h-12 w-full min-[901px]:h-20"
    >
      <path
        d="M0 46C200 14 380 12 560 40S920 78 1120 46S1360 10 1440 30V80H0Z"
        fill="#E3F2F7"
        fillOpacity="0.45"
      />
      <path
        d="M0 58C160 30 340 30 520 54S900 80 1100 58S1340 30 1440 46V80H0Z"
        fill="#E3F2F7"
      />
    </svg>
  );
}

/** Top edge of the footer. Fill matches the page above it (#F4F8FA). */
export function FooterWave() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 block h-12 w-full min-[901px]:h-20"
    >
      <path
        d="M0 0H1440V34C1240 66 1060 68 880 42S520 6 340 34S80 64 0 44Z"
        fill="#F4F8FA"
        fillOpacity="0.45"
      />
      <path
        d="M0 0H1440V22C1260 52 1080 54 900 30S540 -2 360 22S90 50 0 32Z"
        fill="#F4F8FA"
      />
    </svg>
  );
}
