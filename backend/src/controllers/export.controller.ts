import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { Project } from '../models';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { convert as htmlToText } from 'html-to-text';

const Epub = require('epub-gen');

// Define ProjectContent interface locally
interface ProjectContent {
  html?: string;
  [key: string]: any;
}

// Helper function to strip HTML tags and convert to plain text
const stripHtml = (html: string): string => {
  return htmlToText(html, {
    wordwrap: false,
    preserveNewlines: true,
  });
};

// PDF Export
export const exportToPDF = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      throw createError('Project ID is required', 400);
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    // Create PDF document
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 72, right: 72 },
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add title
    doc
      .font('Helvetica-Bold')
      .fontSize(24)
      .text(project.title, { align: 'center' });

    doc.moveDown(0.5);

    // Add metadata
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#666666')
      .text(`Type: ${project.type}`, { align: 'center' });

    doc
      .text(`Created: ${new Date(project.createdAt).toLocaleDateString()}`, {
        align: 'center',
      });

    doc.moveDown(2);

    // Add content
    const content = (project.content as ProjectContent)?.html || '';
    const plainText = stripHtml(content);

    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor('#000000')
      .text(plainText || 'No content available.', {
        align: 'justify',
        lineGap: 2,
      });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    next(error);
  }
};

// EPUB Export
export const exportToEPUB = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      throw createError('Project ID is required', 400);
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    const content = (project.content as ProjectContent)?.html || '<p>No content available.</p>';

    // Configure EPUB
    const option = {
      title: project.title,
      author: 'Digital Product Creator',
      content: [
        {
          title: project.title,
          data: content,
        },
      ],
      output: null, // Will generate to buffer
    };

    // Generate EPUB
    const epub = new Epub(option, null);

    // Generate and send the file
    epub.promise.then((buffer: Buffer) => {
      res.setHeader('Content-Type', 'application/epub+zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.epub"`
      );
      res.send(buffer);
    }).catch((error: Error) => {
      next(createError('Failed to generate EPUB', 500));
    });
  } catch (error) {
    next(error);
  }
};

// DOCX Export
export const exportToDOCX = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      throw createError('Project ID is required', 400);
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    const content = (project.content as ProjectContent)?.html || '';
    const plainText = stripHtml(content);

    // Split content into paragraphs
    const paragraphs = plainText
      .split('\n')
      .filter((line) => line.trim().length > 0);

    // Create document sections
    const children: Paragraph[] = [
      // Title
      new Paragraph({
        text: project.title,
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
      }),

      // Metadata
      new Paragraph({
        children: [
          new TextRun({
            text: `Type: ${project.type}`,
            size: 20,
            color: '666666',
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: `Created: ${new Date(project.createdAt).toLocaleDateString()}`,
            size: 20,
            color: '666666',
          }),
        ],
        spacing: { after: 400 },
      }),

      // Content paragraphs
      ...paragraphs.map(
        (text) =>
          new Paragraph({
            text: text,
            spacing: { after: 200 },
          })
      ),
    ];

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc);

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx"`
    );

    // Send the buffer
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
