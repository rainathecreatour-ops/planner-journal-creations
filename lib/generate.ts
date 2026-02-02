import PDFDocument from 'pdfkit';
import svgToPdf from 'svg-to-pdfkit';
import type { TemplateSpec } from './spec';

const pageDimensions = {
  letter: { width: 612, height: 792 },
  a4: { width: 595, height: 842 },
  a5: { width: 420, height: 595 }
} as const;

function getPageSize(spec: TemplateSpec) {
  const base = pageDimensions[spec.size];
  if (spec.orientation === 'landscape') {
    return { width: base.height, height: base.width };
  }
  return base;
}

function svgHeader(width: number, height: number) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
}

function svgFooter() {
  return '</svg>';
}

function drawHeader(width: number, margin: number, spec: TemplateSpec, label: string) {
  if (!spec.grid.showHeader) return '';
  return `
  <text x="${margin}" y="${margin}" font-family="${spec.font}" font-size="18" fill="${spec.palette.primary}">${label}</text>
  <line x1="${margin}" y1="${margin + 10}" x2="${width - margin}" y2="${margin + 10}" stroke="${spec.palette.secondary}" stroke-width="1" />`;
}

function drawFooter(width: number, height: number, margin: number, spec: TemplateSpec, page: number) {
  if (!spec.grid.showFooter) return '';
  return `
  <text x="${width - margin}" y="${height - margin}" font-family="${spec.font}" font-size="12" fill="${spec.palette.primary}" text-anchor="end">Page ${page}</text>`;
}

function drawLinedGrid(width: number, height: number, margin: number, spec: TemplateSpec) {
  const lines: string[] = [];
  for (let y = margin * 2; y < height - margin; y += spec.grid.lineSpacing) {
    lines.push(
      `<line x1="${margin}" y1="${y}" x2="${width - margin}" y2="${y}" stroke="${spec.palette.secondary}" stroke-width="1" />`
    );
  }
  return lines.join('\n');
}

function drawDottedGrid(width: number, height: number, margin: number, spec: TemplateSpec) {
  const dots: string[] = [];
  const spacing = spec.grid.lineSpacing;
  for (let y = margin * 2; y < height - margin; y += spacing) {
    for (let x = margin; x < width - margin; x += spacing) {
      dots.push(
        `<circle cx="${x}" cy="${y}" r="${spec.grid.dotSize}" fill="${spec.palette.secondary}" />`
      );
    }
  }
  return dots.join('\n');
}

function drawGrid(width: number, height: number, margin: number, spec: TemplateSpec) {
  const lines: string[] = [];
  const spacing = spec.grid.lineSpacing;
  for (let y = margin * 2; y < height - margin; y += spacing) {
    lines.push(
      `<line x1="${margin}" y1="${y}" x2="${width - margin}" y2="${y}" stroke="${spec.palette.secondary}" stroke-width="0.8" />`
    );
  }
  for (let x = margin; x < width - margin; x += spacing) {
    lines.push(
      `<line x1="${x}" y1="${margin * 2}" x2="${x}" y2="${height - margin}" stroke="${spec.palette.secondary}" stroke-width="0.8" />`
    );
  }
  return lines.join('\n');
}

function drawMonthlyLayout(width: number, height: number, margin: number, spec: TemplateSpec) {
  const cols = 7;
  const rows = 5;
  const gridTop = margin * 2 + 20;
  const gridHeight = height - gridTop - margin;
  const gridWidth = width - margin * 2;
  const cellWidth = gridWidth / cols;
  const cellHeight = gridHeight / rows;
  const shapes: string[] = [];
  shapes.push(`<rect x="${margin}" y="${gridTop}" width="${gridWidth}" height="${gridHeight}" fill="none" stroke="${spec.palette.primary}" stroke-width="1" />`);
  for (let i = 1; i < cols; i += 1) {
    shapes.push(
      `<line x1="${margin + cellWidth * i}" y1="${gridTop}" x2="${margin + cellWidth * i}" y2="${gridTop + gridHeight}" stroke="${spec.palette.secondary}" stroke-width="1" />`
    );
  }
  for (let i = 1; i < rows; i += 1) {
    shapes.push(
      `<line x1="${margin}" y1="${gridTop + cellHeight * i}" x2="${margin + gridWidth}" y2="${gridTop + cellHeight * i}" stroke="${spec.palette.secondary}" stroke-width="1" />`
    );
  }
  return shapes.join('\n');
}

function drawWeeklyLayout(width: number, height: number, margin: number, spec: TemplateSpec) {
  const sections = 2;
  const gridTop = margin * 2 + 20;
  const gridHeight = height - gridTop - margin;
  const gridWidth = width - margin * 2;
  const sectionWidth = gridWidth / sections;
  const shapes: string[] = [];
  shapes.push(`<rect x="${margin}" y="${gridTop}" width="${gridWidth}" height="${gridHeight}" fill="none" stroke="${spec.palette.primary}" stroke-width="1" />`);
  shapes.push(
    `<line x1="${margin + sectionWidth}" y1="${gridTop}" x2="${margin + sectionWidth}" y2="${gridTop + gridHeight}" stroke="${spec.palette.secondary}" stroke-width="1" />`
  );
  return shapes.join('\n');
}

function drawDailyLayout(width: number, height: number, margin: number, spec: TemplateSpec) {
  const gridTop = margin * 2 + 20;
  const gridHeight = height - gridTop - margin;
  const gridWidth = width - margin * 2;
  const shapes: string[] = [];
  shapes.push(`<rect x="${margin}" y="${gridTop}" width="${gridWidth}" height="${gridHeight}" fill="none" stroke="${spec.palette.primary}" stroke-width="1" />`);
  const timeColumn = gridWidth * 0.3;
  shapes.push(
    `<line x1="${margin + timeColumn}" y1="${gridTop}" x2="${margin + timeColumn}" y2="${gridTop + gridHeight}" stroke="${spec.palette.secondary}" stroke-width="1" />`
  );
  return shapes.join('\n');
}

function drawPromptLayout(width: number, height: number, margin: number, spec: TemplateSpec) {
  const prompts = [
    'Today I am grateful for...',
    'One thing I learned...',
    'A small win was...',
    'Tomorrow I will...'
  ];
  const textBlocks = prompts
    .map((prompt, index) => {
      const y = margin * 2 + 40 + index * 80;
      return `
      <text x="${margin}" y="${y}" font-family="${spec.font}" font-size="14" fill="${spec.palette.primary}">${prompt}</text>
      <line x1="${margin}" y1="${y + 14}" x2="${width - margin}" y2="${y + 14}" stroke="${spec.palette.secondary}" stroke-width="1" />`;
    })
    .join('\n');
  return textBlocks;
}

export function generateSvgPages(spec: TemplateSpec) {
  const { width, height } = getPageSize(spec);
  const pages: string[] = [];
  for (let i = 1; i <= spec.pages.count; i += 1) {
    const label = `${spec.kind === 'planner' ? 'Planner' : 'Journal'} · ${spec.layout}`;
    const promptText = spec.layout === 'prompt' ? drawPromptLayout(width, height, spec.margins, spec) : '';
    const parts = [
      svgHeader(width, height),
      `<g id="background">`,
      `<rect width="100%" height="100%" fill="${spec.background.value}" />`,
      `</g>`,
      `<g id="text">`,
      drawHeader(width, spec.margins, spec, label),
      drawFooter(width, height, spec.margins, spec, i),
      promptText,
      `</g>`,
      `<g id="shapes">`
    ];

    if (spec.layout === 'monthly') {
      parts.push(drawMonthlyLayout(width, height, spec.margins, spec));
    } else if (spec.layout === 'weekly') {
      parts.push(drawWeeklyLayout(width, height, spec.margins, spec));
    } else if (spec.layout === 'daily') {
      parts.push(drawDailyLayout(width, height, spec.margins, spec));
    } else if (spec.layout === 'lined') {
      parts.push(drawLinedGrid(width, height, spec.margins, spec));
    } else if (spec.layout === 'dotted') {
      parts.push(drawDottedGrid(width, height, spec.margins, spec));
    } else if (spec.layout === 'grid') {
      parts.push(drawGrid(width, height, spec.margins, spec));
    }

    parts.push(`</g>`);
    parts.push(svgFooter());
    pages.push(parts.join('\n'));
  }
  return pages;
}

export async function generatePdfBuffer(spec: TemplateSpec, svgs: string[]) {
  const { width, height } = getPageSize(spec);
  const doc = new PDFDocument({ size: [width, height], margin: 0 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  svgs.forEach((svg, index) => {
    if (index > 0) {
      doc.addPage({ size: [width, height], margin: 0 });
    }
    svgToPdf(doc, svg, 0, 0, { width, height });
  });

  doc.end();

  return await new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));
  });
}

export function buildCanvaManifest(spec: TemplateSpec) {
  return {
    fonts: [spec.font],
    palette: spec.palette,
    layout: spec.layout,
    kind: spec.kind,
    note: 'SVG layers are grouped for Canva import. You may need to convert text to outlines if editing fonts.'
  };
}

export function buildPaletteManifest(spec: TemplateSpec) {
  return {
    name: spec.palette.name,
    colors: {
      primary: spec.palette.primary,
      secondary: spec.palette.secondary,
      accent: spec.palette.accent,
      background: spec.palette.background
    }
  };
}
