import { extractionService } from '../services/extraction.service';
import Masterwork from '../models/Masterwork';
import { sequelize } from '../database/connection';
import { fileStorage } from '../utils/file-storage';
import fs from 'fs';
import path from 'path';

async function testExtraction() {
    try {
        await sequelize.sync();

        // Create a dummy text file
        const testContent = "This is a test masterwork. It has some words. We want to see if it extracts correctly.";
        const buffer = Buffer.from(testContent);
        const filename = await fileStorage.saveFile(buffer, 'test.txt');

        // Create masterwork record
        const masterwork = await Masterwork.create({
            user_id: 'test-user',
            title: 'Test Masterwork',
            format: 'TXT',
            file_size: buffer.length,
            file_path: filename,
            word_count: 0,
            extraction_status: 'pending',
            analysis_status: 'not_started',
            upload_date: new Date(),
            last_accessed: new Date()
        });

        console.log('Created masterwork:', masterwork.id);

        // Run extraction
        console.log('Starting extraction...');
        await extractionService.extractAndChunk(masterwork.id);

        // Reload
        await masterwork.reload();
        console.log('Extraction status:', masterwork.extraction_status);
        console.log('Word count:', masterwork.word_count);

        if (masterwork.extraction_status === 'completed' && masterwork.word_count > 0) {
            console.log('SUCCESS: Extraction worked!');
        } else {
            console.log('FAILURE: Extraction failed or empty.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
}

testExtraction();
