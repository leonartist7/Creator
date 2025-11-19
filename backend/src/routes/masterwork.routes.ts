// Masterwork Routes - API endpoints for Knowledge Vault
// US1 Implementation - T037

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { masterworkController } from '../controllers/masterwork.controller';

const router = Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store in temp directory during upload
    const uploadDir = process.env.UPLOAD_TEMP_DIR || './uploads/temp';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 52428800 // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Basic pre-filter (detailed validation in controller)
    const allowedExtensions = ['.pdf', '.epub', '.docx', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file format: ${ext}. Allowed formats: PDF, EPUB, DOCX, TXT, MD`));
    }
  }
});

// Upload Routes
router.post('/upload', upload.single('file'), masterworkController.uploadMasterwork);
router.get('/uploads/:uploadId', masterworkController.getUploadProgress);

// Masterwork CRUD Routes
router.get('/', masterworkController.listMasterworks);
router.get('/:id', masterworkController.getMasterwork);
router.patch('/:id', masterworkController.updateMasterwork);
router.delete('/:id', masterworkController.deleteMasterwork);

// Text Extraction & Analysis Routes
router.post('/:id/extract', masterworkController.triggerExtraction);
router.post('/:id/analyze', masterworkController.triggerAnalysis);

// Style Profile Routes
router.get('/:id/style', masterworkController.getStyleProfile);

// Text Chunks Routes
router.get('/:id/chunks', masterworkController.getTextChunks);

// Search Routes
router.post('/search', masterworkController.searchMasterworks);

export default router;
