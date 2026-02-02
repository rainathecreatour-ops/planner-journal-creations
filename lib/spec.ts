import { z } from 'zod';

export const templateSpecSchema = z.object({
  kind: z.enum(['planner', 'journal']),
  layout: z.enum([
    'monthly',
    'weekly',
    'daily',
    'lined',
    'dotted',
    'grid',
    'prompt'
  ]),
  occasion: z.string().min(1),
  topic: z.string().min(1),
  palette: z.object({
    name: z.string(),
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string()
  }),
  style: z.string(),
  font: z.string(),
  theme: z.string(),
  size: z.enum(['letter', 'a4', 'a5']),
  margins: z.number().min(0).max(72),
  orientation: z.enum(['portrait', 'landscape']),
  background: z.object({
    type: z.enum(['solid', 'gradient', 'pattern', 'texture']),
    value: z.string()
  }),
  grid: z.object({
    lineSpacing: z.number().min(12).max(48),
    dotSize: z.number().min(1).max(6),
    showHeader: z.boolean(),
    showFooter: z.boolean()
  }),
  pages: z.object({
    count: z.number().min(1).max(60),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

export type TemplateSpec = z.infer<typeof templateSpecSchema>;

export const defaultSpec: TemplateSpec = {
  kind: 'planner',
  layout: 'weekly',
  occasion: 'school',
  topic: 'study goals',
  palette: {
    name: 'Pastel Sky',
    primary: '#8ecae6',
    secondary: '#edf6f9',
    accent: '#ffb703',
    background: '#ffffff'
  },
  style: 'minimal',
  font: 'Arial',
  theme: 'neutral',
  size: 'letter',
  margins: 36,
  orientation: 'portrait',
  background: {
    type: 'solid',
    value: '#ffffff'
  },
  grid: {
    lineSpacing: 24,
    dotSize: 2,
    showHeader: true,
    showFooter: true
  },
  pages: {
    count: 8,
    startDate: '2024-09-01',
    endDate: '2024-10-31'
  }
};
