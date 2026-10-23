import Image from "next/image";

// The logo is always the SVG file as given (public/brand). Never redraw it in code.
// 441:120 is the aspect ratio of the lockup artwork.
export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Image
      src={onDark ? "/brand/logo-lockup-on-dark.svg" : "/brand/logo-lockup.svg"}
      alt="medcAIr"
      width={147}
      height={40}
      priority
      className={className}
      style={{ height: 40, width: "auto" }}
    />
  );
}
