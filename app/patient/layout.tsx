import ShaderBackground from "@/components/ui/shader-background";
import { PatientNav } from "@/components/patient/patient-nav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen font-display text-lg text-white [color-scheme:dark]">
      <ShaderBackground />
      <PatientNav />
      {children}
    </div>
  );
}
