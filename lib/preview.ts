import type { TemplateSpec } from './spec';

export function renderPreviewSvg(spec: TemplateSpec) {
  const width = 320;
  const height = 420;
  const margin = 20;
  const header = spec.grid.showHeader
    ? `<text x="${margin}" y="${margin}" font-size="14" font-family="${spec.font}" fill="${spec.palette.primary}">${spec.layout}</text>`
    : '';
  const footer = spec.grid.showFooter
    ? `<text x="${width - margin}" y="${height - margin}" font-size="10" font-family="${spec.font}" fill="${spec.palette.primary}" text-anchor="end">Preview</text>`
    : '';
  const grid = `<rect x="${margin}" y="${margin * 2}" width="${width - margin * 2}" height="${height - margin * 3}" fill="none" stroke="${spec.palette.secondary}" stroke-width="1" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${spec.background.value}" />
  ${header}
  ${grid}
  ${footer}
</svg>`;
}
