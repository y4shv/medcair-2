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
    <main className="mx-auto max-w-2xl bg-white p-6 text-lg text-gray-900 sm:p-10">
      <p className="mb-6 rounded-lg border-2 border-amber-500 bg-amber-50 p-3 text-base font-semibold">
        SAMPLE DOCUMENT. This is a fake report made for a student demo. It is
        not real.
      </p>
      <h1 className="text-2xl font-bold">{report.source}</h1>
      <p className="mt-1 text-gray-700">Laboratory report: {report.title}</p>
      <p className="text-gray-700">Date: {formatDate(report.date)}</p>
      <p className="text-gray-700">Patient: Ramesh Verma (demo), 58 years</p>
      <table className="mt-6 w-full border-collapse text-left text-base">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="py-2 pr-2">Test</th>
            <th className="py-2 pr-2">Result</th>
            <th className="py-2">Reference range</th>
          </tr>
        </thead>
        <tbody>
          {report.results.map((r) => (
            <tr key={r.name} className="border-b border-gray-300">
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
