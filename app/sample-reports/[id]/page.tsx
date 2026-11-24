import Link from "next/link";
import { notFound } from "next/navigation";
import { buildDemoLabReports } from "@/lib/health/demo-data";
import { formatDate } from "@/lib/health/format";

export const dynamic = "force-dynamic";

// A fake "original report" page so the demo has a document to link to.
export default async function SampleReport({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = buildDemoLabReports().find((r) => r.id === id);
  if (!report) notFound();

  return (
    <main className="mx-auto max-w-2xl bg-surface p-6 text-lg text-ink sm:p-10">
      <Link href="/patient/dashboard#reports" className="mb-4 inline-flex min-h-11 items-center font-bold text-care underline">
        Back to my health
      </Link>
      <p className="mb-6 rounded-lg border-2 border-status-watch bg-status-watch-bg p-3 text-status-watch text-base font-semibold">
        SAMPLE DOCUMENT. This is a fake report made for a student demo. It is
        not real.
      </p>
      <h1 className="text-2xl font-bold">{report.source}</h1>
      <p className="mt-1 text-ink-muted">Laboratory report: {report.title}</p>
      <p className="text-ink-muted">Date: {formatDate(report.date)}</p>
      <p className="text-ink-muted">Patient: Ramesh Verma (demo), 58 years</p>
      <table className="mt-6 w-full border-collapse text-left text-base">
        <thead>
          <tr className="border-b-2 border-ink">
            <th className="py-2 pr-2">Test</th>
            <th className="py-2 pr-2">Result</th>
            <th className="py-2">Reference range</th>
          </tr>
        </thead>
        <tbody>
          {report.results.map((r) => (
            <tr key={r.name} className="border-b border-line-soft">
              <td className="py-2 pr-2">{r.name}</td>
              <td className="py-2 pr-2 font-semibold">
                {r.value} {r.unit}
              </td>
              <td className="py-2">{r.referenceRange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
