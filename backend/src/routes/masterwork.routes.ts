import { Router } from 'express';
import multer from 'multer';
import { masterworkController } from '../controllers/masterwork.controller';

const router = Router();

// Configure multer for memory storage (we handle saving in service)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  }
});

// Routes
router.post('/upload', upload.single('file'), masterworkController.upload);
router.get('/', masterworkController.list);
router.get('/:id', masterworkController.get);

export default router;
