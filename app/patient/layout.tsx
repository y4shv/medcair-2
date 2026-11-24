import { AuthGate } from "@/components/patient/auth-gate";
import { PatientNav } from "@/components/patient/patient-nav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist font-display text-ink">
      <PatientNav />
      <AuthGate>{children}</AuthGate>
    </div>
  );
}
