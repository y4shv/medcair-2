import { PatientNav } from "@/components/patient/patient-nav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-lg text-gray-900">
      <PatientNav />
      {children}
    </div>
  );
}
