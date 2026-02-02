'use client';

import { useMemo, useState } from 'react';
import type { TemplateSpec } from '@/lib/spec';
import { defaultSpec } from '@/lib/spec';
import { presets } from '@/lib/presets';
import { renderPreviewSvg } from '@/lib/preview';

const occasions = [
  'wedding',
  'school',
  'fitness',
  'travel',
  'gratitude',
  'business',
  'content planning'
];

const topicsByOccasion: Record<string, string[]> = {
  wedding: ['budget', 'guest list', 'timeline'],
  school: ['class schedule', 'assignments', 'study tracker'],
  fitness: ['habit tracking', 'meal planning', 'workout logs'],
  travel: ['itinerary', 'packing list', 'trip goals'],
  gratitude: ['daily reflection', 'affirmations', 'highlights'],
  business: ['client tracker', 'meeting notes', 'KPIs'],
  'content planning': ['social calendar', 'video ideas', 'launch plan']
};

const palettes = [
  { name: 'Pastel Sky', primary: '#9bbcff', secondary: '#dbeafe', accent: '#fbbf24', background: '#ffffff' },
  { name: 'Cozy Rose', primary: '#f4a7b9', secondary: '#fdecef', accent: '#7c3aed', background: '#fff9fb' },
  { name: 'Mint Calm', primary: '#34d399', secondary: '#ecfdf5', accent: '#f97316', background: '#ffffff' },
  { name: 'Ocean Breeze', primary: '#0ea5e9', secondary: '#e0f2fe', accent: '#14b8a6', background: '#ffffff' }
];

const styles = ['minimal', 'modern', 'playful', 'elegant', 'cozy', 'luxe'];
const themes = ['seasonal', 'neutral', 'floral', 'geometric', 'celestial'];
const fonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'];

const steps = ['Category', 'Occasion', 'Customize', 'Preview & Export'];

export default function Builder() {
  const [spec, setSpec] = useState<TemplateSpec>(defaultSpec);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const preview = useMemo(() => renderPreviewSvg(spec), [spec]);

  const updateSpec = (patch: Partial<TemplateSpec>) => {
    setSpec((current) => ({ ...current, ...patch }));
  };

  const updateGrid = (patch: Partial<TemplateSpec['grid']>) => {
    setSpec((current) => ({ ...current, grid: { ...current.grid, ...patch } }));
  };

  const updatePalette = (value: TemplateSpec['palette']) => {
    setSpec((current) => ({ ...current, palette: value, background: { ...current.background, value: value.background } }));
  };

  const updatePaletteColor = (key: keyof TemplateSpec['palette'], value: string) => {
    setSpec((current) => ({
      ...current,
      palette: { ...current.palette, [key]: value },
      background: key === 'background' ? { ...current.background, value } : current.background
    }));
  };

  const updateBackground = (patch: Partial<TemplateSpec['background']>) => {
    setSpec((current) => ({ ...current, background: { ...current.background, ...patch } }));
  };

  const updateLayout = (layout: TemplateSpec['layout']) => {
    setSpec((current) => ({ ...current, layout }));
  };

  const onExport = async (format: 'pdf' | 'svg' | 'canva') => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...spec, format })
      });

      if (!response.ok) {
        const payload = await response.json();
        setMessage(payload.error ?? 'Generation failed.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = format === 'pdf' ? 'planner.pdf' : `planner-${format}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage('Unable to generate files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Planner & Journal Studio</p>
            <h1 className="text-2xl font-semibold">Build a printable planner in minutes</h1>
          </div>
          <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="/canva-guidance">
            Canva import guidance
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 lg:flex-row">
        <section className="flex-1 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Step {step + 1} of {steps.length}</p>
            <h2 className="mt-2 text-xl font-semibold">{steps[step]}</h2>
            <div className="mt-4 space-y-6">
              {step === 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Category</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {['planner', 'journal'].map((kind) => (
                        <button
                          key={kind}
                          className={`rounded-lg border px-4 py-3 text-sm font-medium ${spec.kind === kind ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700'}`}
                          onClick={() => updateSpec({ kind: kind as TemplateSpec['kind'], layout: kind === 'planner' ? 'weekly' : 'lined' })}
                          type="button"
                        >
                          {kind === 'planner' ? 'Planner' : 'Journal'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Layout</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(spec.kind === 'planner'
                        ? ['monthly', 'weekly', 'daily']
                        : ['lined', 'dotted', 'grid', 'prompt']
                      ).map((layout) => (
                        <button
                          key={layout}
                          className={`rounded-lg border px-3 py-2 text-xs font-medium ${spec.layout === layout ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600'}`}
                          onClick={() => updateLayout(layout as TemplateSpec['layout'])}
                          type="button"
                        >
                          {layout}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Starter presets</label>
                    <div className="mt-2 grid gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          className="rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:border-slate-400"
                          onClick={() => setSpec(preset.spec)}
                          type="button"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Occasion</label>
                    <select
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                      value={spec.occasion}
                      onChange={(event) => updateSpec({ occasion: event.target.value, topic: topicsByOccasion[event.target.value][0] })}
                    >
                      {occasions.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Topic</label>
                    <select
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                      value={spec.topic}
                      onChange={(event) => updateSpec({ topic: event.target.value })}
                    >
                      {topicsByOccasion[spec.occasion].map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Palette</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {palettes.map((palette) => (
                        <button
                          key={palette.name}
                          className={`rounded-lg border px-3 py-2 text-left text-xs font-medium ${spec.palette.name === palette.name ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600'}`}
                          onClick={() => updatePalette(palette)}
                          type="button"
                        >
                          <span className="block">{palette.name}</span>
                          <span className="mt-1 block text-[10px] text-slate-400">{palette.primary}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <label className="flex flex-col gap-1">
                        Primary
                        <input
                          type="text"
                          className="rounded-lg border border-slate-200 px-3 py-2"
                          value={spec.palette.primary}
                          onChange={(event) => updatePaletteColor('primary', event.target.value)}
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        Secondary
                        <input
                          type="text"
                          className="rounded-lg border border-slate-200 px-3 py-2"
                          value={spec.palette.secondary}
                          onChange={(event) => updatePaletteColor('secondary', event.target.value)}
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        Accent
                        <input
                          type="text"
                          className="rounded-lg border border-slate-200 px-3 py-2"
                          value={spec.palette.accent}
                          onChange={(event) => updatePaletteColor('accent', event.target.value)}
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        Background
                        <input
                          type="text"
                          className="rounded-lg border border-slate-200 px-3 py-2"
                          value={spec.palette.background}
                          onChange={(event) => updatePaletteColor('background', event.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Style</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.style}
                        onChange={(event) => updateSpec({ style: event.target.value })}
                      >
                        {styles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Theme</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.theme}
                        onChange={(event) => updateSpec({ theme: event.target.value })}
                      >
                        {themes.map((theme) => (
                          <option key={theme} value={theme}>
                            {theme}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Font</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.font}
                        onChange={(event) => updateSpec({ font: event.target.value })}
                      >
                        {fonts.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Paper size</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.size}
                        onChange={(event) => updateSpec({ size: event.target.value as TemplateSpec['size'] })}
                      >
                        <option value="letter">US Letter</option>
                        <option value="a4">A4</option>
                        <option value="a5">A5</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Background type</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.background.type}
                        onChange={(event) => updateBackground({ type: event.target.value as TemplateSpec['background']['type'] })}
                      >
                        <option value="solid">Solid</option>
                        <option value="gradient">Gradient</option>
                        <option value="pattern">Pattern</option>
                        <option value="texture">Texture</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Background value</label>
                      <input
                        type="text"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.background.value}
                        onChange={(event) => updateBackground({ value: event.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Orientation</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.orientation}
                        onChange={(event) => updateSpec({ orientation: event.target.value as TemplateSpec['orientation'] })}
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Margins (pt)</label>
                      <input
                        type="number"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.margins}
                        min={12}
                        max={72}
                        onChange={(event) => updateSpec({ margins: Number(event.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Pages</label>
                      <input
                        type="number"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.pages.count}
                        min={1}
                        max={60}
                        onChange={(event) => updateSpec({ pages: { ...spec.pages, count: Number(event.target.value) } })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Date range</label>
                      <input
                        type="text"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={`${spec.pages.startDate ?? ''}${spec.pages.endDate ? ` → ${spec.pages.endDate}` : ''}`}
                        onChange={(event) => {
                          const [start, end] = event.target.value.split('→').map((value) => value.trim());
                          updateSpec({ pages: { ...spec.pages, startDate: start || undefined, endDate: end || undefined } });
                        }}
                        placeholder="YYYY-MM-DD → YYYY-MM-DD"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Line spacing</label>
                      <input
                        type="number"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.grid.lineSpacing}
                        min={12}
                        max={48}
                        onChange={(event) => updateGrid({ lineSpacing: Number(event.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Dot size</label>
                      <input
                        type="number"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                        value={spec.grid.dotSize}
                        min={1}
                        max={6}
                        onChange={(event) => updateGrid({ dotSize: Number(event.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={spec.grid.showHeader}
                        onChange={(event) => updateGrid({ showHeader: event.target.checked })}
                      />
                      Header
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={spec.grid.showFooter}
                        onChange={(event) => updateGrid({ showFooter: event.target.checked })}
                      />
                      Footer
                    </label>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Preview</label>
                    <div
                      className="mt-2 flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4"
                      dangerouslySetInnerHTML={{ __html: preview }}
                    />
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">Export formats</p>
                    <p className="mt-1 text-xs text-slate-500">
                      PDFs are print-ready. SVG exports preserve layers for Canva edits.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                        onClick={() => onExport('pdf')}
                        disabled={loading}
                        type="button"
                      >
                        {loading ? 'Generating…' : 'Download PDF'}
                      </button>
                      <button
                        className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                        onClick={() => onExport('svg')}
                        disabled={loading}
                        type="button"
                      >
                        Export SVGs
                      </button>
                      <button
                        className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                        onClick={() => onExport('canva')}
                        disabled={loading}
                        type="button"
                      >
                        Canva Package
                      </button>
                    </div>
                    {message ? <p className="mt-3 text-xs text-rose-600">{message}</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-slate-500"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
              >
                Back
              </button>
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
                disabled={step === steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <aside className="w-full max-w-sm space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Current selection</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Type: {spec.kind}</li>
              <li>Layout: {spec.layout}</li>
              <li>Occasion: {spec.occasion}</li>
              <li>Topic: {spec.topic}</li>
              <li>Palette: {spec.palette.name}</li>
              <li>Style: {spec.style}</li>
              <li>Theme: {spec.theme}</li>
              <li>Font: {spec.font}</li>
              <li>Paper: {spec.size.toUpperCase()} ({spec.orientation})</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Generation notes</h3>
            <p className="mt-2 text-sm text-slate-600">
              PDF generation runs in Node serverless functions. SVG exports include separated layers for backgrounds and text.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Need a custom template? Add a new preset in <code>lib/presets.ts</code>.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
