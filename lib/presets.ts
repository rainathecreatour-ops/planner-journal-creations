import type { TemplateSpec } from './spec';

export const presets: Array<{ id: string; label: string; spec: TemplateSpec }> = [
  {
    id: 'pastel-weekly-planner',
    label: 'Pastel Minimal Weekly Planner',
    spec: {
      kind: 'planner',
      layout: 'weekly',
      occasion: 'school',
      topic: 'weekly goals',
      palette: {
        name: 'Pastel Sky',
        primary: '#9bbcff',
        secondary: '#f5f7ff',
        accent: '#ffcf8b',
        background: '#ffffff'
      },
      style: 'minimal',
      font: 'Helvetica',
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
        count: 12,
        startDate: '2024-01-01',
        endDate: '2024-03-31'
      }
    }
  },
  {
    id: 'cozy-gratitude-journal',
    label: 'Cozy Gratitude Journal',
    spec: {
      kind: 'journal',
      layout: 'prompt',
      occasion: 'gratitude',
      topic: 'daily reflection',
      palette: {
        name: 'Cozy Rose',
        primary: '#f4a7b9',
        secondary: '#fdecef',
        accent: '#7c3aed',
        background: '#fff9fb'
      },
      style: 'cozy',
      font: 'Georgia',
      theme: 'floral',
      size: 'a5',
      margins: 32,
      orientation: 'portrait',
      background: {
        type: 'texture',
        value: '#fff9fb'
      },
      grid: {
        lineSpacing: 26,
        dotSize: 2,
        showHeader: true,
        showFooter: false
      },
      pages: {
        count: 20
      }
    }
  },
  {
    id: 'luxe-daily-planner',
    label: 'Luxe Daily Planner',
    spec: {
      kind: 'planner',
      layout: 'daily',
      occasion: 'business',
      topic: 'priority planning',
      palette: {
        name: 'Luxe Noir',
        primary: '#111827',
        secondary: '#f8fafc',
        accent: '#d97706',
        background: '#ffffff'
      },
      style: 'elegant',
      font: 'Times New Roman',
      theme: 'neutral',
      size: 'a4',
      margins: 40,
      orientation: 'portrait',
      background: {
        type: 'solid',
        value: '#ffffff'
      },
      grid: {
        lineSpacing: 22,
        dotSize: 2,
        showHeader: true,
        showFooter: true
      },
      pages: {
        count: 10
      }
    }
  }
];
