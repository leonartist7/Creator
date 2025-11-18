/**
 * Export Settings & Templates Configuration
 * Comprehensive export customization options
 */

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  formats: ('pdf' | 'epub' | 'docx')[];
}

export interface ExportSettings {
  // Document Metadata
  includeMetadata: boolean;
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  includePageNumbers: boolean;
  includeAuthorInfo: boolean;
  includeGeneratedDate: boolean;

  // Content Options
  includeImages: boolean;
  includeLinks: boolean;
  preserveFormatting: boolean;
  includeComments: boolean;
  includeFootnotes: boolean;

  // Styling
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  lineSpacing: 'single' | '1.5' | 'double';
  margins: 'narrow' | 'normal' | 'wide';

  // PDF Specific
  pdfQuality: 'standard' | 'high' | 'print';
  pdfProtection: boolean;
  pdfWatermark: boolean;

  // ePub Specific
  epubVersion: '2.0' | '3.0';
  epubReflowable: boolean;

  // DOCX Specific
  docxStyles: 'minimal' | 'standard' | 'professional';
  docxCompatibility: '2007' | '2013' | '2019';
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  // Metadata
  includeMetadata: true,
  includeCoverPage: true,
  includeTableOfContents: true,
  includePageNumbers: true,
  includeAuthorInfo: true,
  includeGeneratedDate: false,

  // Content
  includeImages: true,
  includeLinks: true,
  preserveFormatting: true,
  includeComments: false,
  includeFootnotes: true,

  // Styling
  fontSize: 'medium',
  fontFamily: 'serif',
  lineSpacing: '1.5',
  margins: 'normal',

  // PDF
  pdfQuality: 'high',
  pdfProtection: false,
  pdfWatermark: false,

  // ePub
  epubVersion: '3.0',
  epubReflowable: true,

  // DOCX
  docxStyles: 'professional',
  docxCompatibility: '2013',
};

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Export',
    description: 'Clean, professional export with basic features',
    icon: '📄',
    features: ['Table of Contents', 'Page Numbers', 'Metadata'],
    formats: ['pdf', 'epub', 'docx'],
  },
  {
    id: 'premium',
    name: 'Premium Book',
    description: 'Full-featured with cover page and professional styling',
    icon: '📚',
    features: ['Cover Page', 'TOC', 'Author Info', 'High Quality', 'Custom Styling'],
    formats: ['pdf', 'epub', 'docx'],
  },
  {
    id: 'ebook',
    name: 'eBook Optimized',
    description: 'Perfect for Kindle and e-readers',
    icon: '📖',
    features: ['Reflowable Layout', 'ePub 3.0', 'Chapter Navigation', 'Embedded Fonts'],
    formats: ['epub'],
  },
  {
    id: 'print',
    name: 'Print-Ready',
    description: 'High-quality PDF for professional printing',
    icon: '🖨️',
    features: ['Print Quality', 'CMYK Colors', 'Bleed Margins', 'Crop Marks'],
    formats: ['pdf'],
  },
  {
    id: 'manuscript',
    name: 'Manuscript Submission',
    description: 'Industry-standard manuscript formatting',
    icon: '📝',
    features: ['Double-spaced', 'Times New Roman', 'Page Headers', 'Word Count'],
    formats: ['docx'],
  },
  {
    id: 'minimal',
    name: 'Minimal Export',
    description: 'Plain text content without extras',
    icon: '⚡',
    features: ['No Cover', 'No TOC', 'Fast Export', 'Small File Size'],
    formats: ['pdf', 'epub', 'docx'],
  },
  {
    id: 'marketing',
    name: 'Marketing Material',
    description: 'Eye-catching design for promotional content',
    icon: '🎨',
    features: ['Brand Colors', 'Custom Headers', 'Social Links', 'Call-to-Actions'],
    formats: ['pdf', 'docx'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio Piece',
    description: 'Showcase your work professionally',
    icon: '💼',
    features: ['Visual Layout', 'Image Gallery', 'Bio Section', 'Contact Info'],
    formats: ['pdf'],
  },
];

export const FONT_SIZES = {
  small: { label: 'Small (10pt)', value: '10pt' },
  medium: { label: 'Medium (12pt)', value: '12pt' },
  large: { label: 'Large (14pt)', value: '14pt' },
};

export const FONT_FAMILIES = {
  serif: { label: 'Serif (Times, Garamond)', value: 'serif' },
  'sans-serif': { label: 'Sans-serif (Arial, Helvetica)', value: 'sans-serif' },
  monospace: { label: 'Monospace (Courier)', value: 'monospace' },
};

export const LINE_SPACINGS = {
  single: { label: 'Single (1.0)', value: '1.0' },
  '1.5': { label: '1.5 Lines', value: '1.5' },
  double: { label: 'Double (2.0)', value: '2.0' },
};

export const MARGINS = {
  narrow: { label: 'Narrow (0.5")', value: '0.5in' },
  normal: { label: 'Normal (1")', value: '1in' },
  wide: { label: 'Wide (1.5")', value: '1.5in' },
};

export const getTemplateById = (id: string) => {
  return EXPORT_TEMPLATES.find((t) => t.id === id);
};

export const getTemplatesForFormat = (format: 'pdf' | 'epub' | 'docx') => {
  return EXPORT_TEMPLATES.filter((t) => t.formats.includes(format));
};

export const applyTemplateSettings = (
  templateId: string
): Partial<ExportSettings> => {
  const baseSettings: Partial<ExportSettings> = {};

  switch (templateId) {
    case 'premium':
      return {
        ...DEFAULT_EXPORT_SETTINGS,
        includeCoverPage: true,
        includeTableOfContents: true,
        includeAuthorInfo: true,
        pdfQuality: 'high',
        docxStyles: 'professional',
      };

    case 'minimal':
      return {
        ...DEFAULT_EXPORT_SETTINGS,
        includeCoverPage: false,
        includeTableOfContents: false,
        includePageNumbers: false,
        includeAuthorInfo: false,
        pdfQuality: 'standard',
        docxStyles: 'minimal',
      };

    case 'manuscript':
      return {
        ...DEFAULT_EXPORT_SETTINGS,
        fontSize: 'medium',
        fontFamily: 'serif',
        lineSpacing: 'double',
        margins: 'normal',
        docxStyles: 'minimal',
      };

    case 'print':
      return {
        ...DEFAULT_EXPORT_SETTINGS,
        pdfQuality: 'print',
        margins: 'wide',
        includePageNumbers: true,
      };

    case 'ebook':
      return {
        ...DEFAULT_EXPORT_SETTINGS,
        epubVersion: '3.0',
        epubReflowable: true,
        includeTableOfContents: true,
        fontSize: 'medium',
      };

    default:
      return DEFAULT_EXPORT_SETTINGS;
  }
};
