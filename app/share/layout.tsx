import ShaderBackground from "@/components/ui/shader-background";

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen font-display text-white [color-scheme:dark]">
      <ShaderBackground />
      {children}
    </div>
  );
}
