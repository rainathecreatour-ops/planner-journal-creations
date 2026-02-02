export default function CanvaGuidancePage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-wide text-slate-400">Canva guidance</p>
        <h1 className="mt-2 text-3xl font-semibold">Import your planner into Canva</h1>
        <p className="mt-2 text-sm text-slate-600">
          The Canva package export includes layered SVGs, a font manifest, and a color palette manifest to help you
          recreate the design.
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>Open Canva and create a design sized to your paper format.</li>
          <li>Click <strong>Uploads</strong> and drag the SVG files from the exported ZIP.</li>
          <li>Use the manifest.json file to match colors and fonts inside Canva.</li>
          <li>If a font is missing, replace it with a Canva equivalent and adjust spacing.</li>
          <li>Group elements for each page to keep layouts aligned.</li>
        </ol>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Tips</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Keep margins consistent with the PDF for print accuracy.</li>
          <li>Duplicate pages in Canva to maintain monthly/weekly rhythm.</li>
          <li>Export from Canva as PDF Print for best results.</li>
        </ul>
      </section>
      <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="/">
        ← Back to builder
      </a>
    </main>
  );
}
