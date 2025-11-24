import { extractionService } from '../services/extraction.service';
import { styleAnalysisService } from '../services/style-analysis.service';
import Masterwork from '../models/Masterwork';
import StyleProfile from '../models/StyleProfile';
import { sequelize } from '../database/connection';
import { fileStorage } from '../utils/file-storage';
import fs from 'fs';

async function testAnalysis() {
    try {
        await sequelize.sync();

        // Create a dummy text file with some style
        const testContent = `
      The night was dark and stormy. The wind howled through the trees, creating a symphony of chaos. 
      "We must go back," she whispered, her voice trembling with fear.
      He shook his head. "No. We have come too far to turn back now."
      They continued walking into the abyss.
    `;
        const buffer = Buffer.from(testContent);
        const filename = await fileStorage.saveFile(buffer, 'style_test.txt');

        // Create masterwork record
        const masterwork = await Masterwork.create({
            user_id: 'test-user',
            title: 'Style Test Masterwork',
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

        // Run extraction (which triggers analysis in background, but we'll run manually to await it)
        console.log('Starting extraction...');
        await extractionService.extractAndChunk(masterwork.id);

        // Run analysis manually to await it
        console.log('Starting analysis...');
        await styleAnalysisService.analyzeMasterwork(masterwork.id);

        // Check results
        const profile = await StyleProfile.findOne({ where: { masterwork_id: masterwork.id } });

        if (profile) {
            console.log('SUCCESS: Style Profile created!');
            console.log('Avg Sentence Length:', profile.avg_sentence_length);
            console.log('Dialogue Ratio:', profile.dialogue_ratio);
            console.log('Sentiment Score:', profile.sentiment_score);
            console.log('Top Words:', profile.top_words);
        } else {
            console.log('FAILURE: No profile found.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
}

testAnalysis();
