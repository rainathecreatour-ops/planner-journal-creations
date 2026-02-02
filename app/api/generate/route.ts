import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { templateSpecSchema } from '@/lib/spec';
import { buildCanvaManifest, buildPaletteManifest, generatePdfBuffer, generateSvgPages } from '@/lib/generate';
import { readAccessCookie, verifyAccessToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const token = readAccessCookie();
  if (!verifyAccessToken(token)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = templateSpecSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid template specification.' }, { status: 400 });
  }

  const spec = parsed.data;
  const format = (body.format as 'pdf' | 'svg' | 'canva') ?? 'pdf';
  const svgPages = generateSvgPages(spec);

  if (format === 'pdf') {
    const pdfBuffer = await generatePdfBuffer(spec, svgPages);
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="planner.pdf"'
      }
    });
  }

  const zip = new JSZip();
  svgPages.forEach((svg, index) => {
    zip.file(`page-${index + 1}.svg`, svg);
  });

  if (format === 'canva') {
    zip.file('manifest.json', JSON.stringify(buildCanvaManifest(spec), null, 2));
    zip.file('palette.json', JSON.stringify(buildPaletteManifest(spec), null, 2));
    zip.file('fonts.txt', `Fonts used:\\n- ${spec.font}\\n`);
    zip.file(
      'CANVA_IMPORT_GUIDE.txt',
      'Upload the SVG files into Canva (Create a design > Upload). Canva will preserve layers grouped by element. If fonts are missing, replace with Canva equivalents using the manifest.'
    );
  }

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="planner-${format}.zip"`
    }
  });
}
