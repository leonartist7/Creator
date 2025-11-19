// Test fixtures for Knowledge Vault Module

export const testMasterworks = {
  pdfBook: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    userId: 'user-123',
    title: 'The Shining',
    author: 'Stephen King',
    format: 'PDF' as const,
    fileSize: 2500000,
    filePath: '/uploads/user-123/the-shining.pdf',
    coverImageUrl: '/uploads/user-123/the-shining-cover.jpg',
    pageCount: 447,
    wordCount: 119000,
    language: 'en',
    publicationDate: new Date('1977-01-28'),
    isbn: '978-0-385-12167-5',
    customTags: ['horror', 'thriller', 'fiction'],
    userNotes: 'Classic horror novel, excellent for analyzing tension and atmosphere',
    rating: 5,
    extractionStatus: 'completed' as const,
    extractionError: null,
    analysisStatus: 'completed' as const,
    uploadDate: new Date('2024-01-15'),
    lastAccessed: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

  epubNovel: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    userId: 'user-123',
    title: '1984',
    author: 'George Orwell',
    format: 'EPUB' as const,
    fileSize: 1200000,
    filePath: '/uploads/user-123/1984.epub',
    coverImageUrl: null,
    pageCount: null,
    wordCount: 88942,
    language: 'en',
    publicationDate: new Date('1949-06-08'),
    isbn: '978-0-452-28423-4',
    customTags: ['dystopian', 'fiction', 'classic'],
    userNotes: null,
    rating: 5,
    extractionStatus: 'completed' as const,
    extractionError: null,
    analysisStatus: 'not_started' as const,
    uploadDate: new Date('2024-01-16'),
    lastAccessed: new Date('2024-01-16'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },

  docxScript: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    userId: 'user-456',
    title: 'Inception (Script)',
    author: 'Christopher Nolan',
    format: 'DOCX' as const,
    fileSize: 850000,
    filePath: '/uploads/user-456/inception-script.docx',
    coverImageUrl: null,
    pageCount: null,
    wordCount: 42000,
    language: 'en',
    publicationDate: null,
    isbn: null,
    customTags: ['screenplay', 'thriller', 'sci-fi'],
    userNotes: 'Study dialogue pacing and scene structure',
    rating: 5,
    extractionStatus: 'pending' as const,
    extractionError: null,
    analysisStatus: 'not_started' as const,
    uploadDate: new Date('2024-01-17'),
    lastAccessed: new Date('2024-01-17'),
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },

  txtShortStory: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    userId: 'user-123',
    title: 'The Lottery',
    author: 'Shirley Jackson',
    format: 'TXT' as const,
    fileSize: 35000,
    filePath: '/uploads/user-123/the-lottery.txt',
    coverImageUrl: null,
    pageCount: null,
    wordCount: 3383,
    language: 'en',
    publicationDate: new Date('1948-06-26'),
    isbn: null,
    customTags: ['short-story', 'horror', 'fiction'],
    userNotes: 'Short form, great for quick analysis',
    rating: 4,
    extractionStatus: 'completed' as const,
    extractionError: null,
    analysisStatus: 'completed' as const,
    uploadDate: new Date('2024-01-18'),
    lastAccessed: new Date('2024-01-19'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },

  failedExtraction: {
    id: '550e8400-e29b-41d4-a716-446655440005',
    userId: 'user-123',
    title: 'Corrupted PDF',
    author: 'Unknown',
    format: 'PDF' as const,
    fileSize: 5000000,
    filePath: '/uploads/user-123/corrupted.pdf',
    coverImageUrl: null,
    pageCount: null,
    wordCount: 0,
    language: 'en',
    publicationDate: null,
    isbn: null,
    customTags: [],
    userNotes: null,
    rating: null,
    extractionStatus: 'failed' as const,
    extractionError: 'PDF parsing error: File is corrupted or password-protected',
    analysisStatus: 'not_started' as const,
    uploadDate: new Date('2024-01-19'),
    lastAccessed: new Date('2024-01-19'),
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  }
}

export const testStyleProfiles = {
  stephenKingStyle: {
    id: '660e8400-e29b-41d4-a716-446655440001',
    masterworkId: '550e8400-e29b-41d4-a716-446655440001',
    avgSentenceLength: 15.3,
    sentenceLengthVariance: 8.2,
    vocabComplexity: 72.5,
    uniqueWordRatio: 0.42,
    avgParagraphLength: 4.8,
    paragraphVariance: 2.1,
    dialogueRatio: 35.7,
    fleschReadingEase: 78.5,
    fleschKincaidGrade: 6.8,
    toneScore: 0.6, // Conversational
    sentimentScore: -0.3, // Slightly negative (horror)
    topWords: {
      'the': 5432,
      'and': 3210,
      'was': 2987,
      'said': 1845,
      'room': 892
    },
    topPhrases: {
      'the overlook hotel': 145,
      'shining through': 89,
      'door opened': 67
    },
    commonSentencePatterns: [
      'DET NOUN VERB',
      'PRON VERB ADV',
      'DET ADJ NOUN VERB'
    ],
    confidenceScore: 95,
    analysisDate: new Date('2024-01-15'),
    analysisDurationMs: 45000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

  shortStoryStyle: {
    id: '660e8400-e29b-41d4-a716-446655440002',
    masterworkId: '550e8400-e29b-41d4-a716-446655440004',
    avgSentenceLength: 18.2,
    sentenceLengthVariance: 6.5,
    vocabComplexity: 68.0,
    uniqueWordRatio: 0.51,
    avgParagraphLength: 5.2,
    paragraphVariance: 1.8,
    dialogueRatio: 42.1,
    fleschReadingEase: 75.2,
    fleschKincaidGrade: 7.5,
    toneScore: 0.3, // Somewhat conversational
    sentimentScore: -0.1, // Neutral to slightly negative
    topWords: {
      'the': 234,
      'said': 178,
      'lottery': 67,
      'stones': 45
    },
    topPhrases: {
      'black box': 23,
      'mr summers': 18
    },
    commonSentencePatterns: [
      'DET NOUN VERB PREP',
      'PRON VERB DET NOUN'
    ],
    confidenceScore: 75, // Lower due to short length
    analysisDate: new Date('2024-01-18'),
    analysisDurationMs: 3000,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
}

export const testTextChunks = {
  shiningChunk1: {
    id: '770e8400-e29b-41d4-a716-446655440001',
    masterworkId: '550e8400-e29b-41d4-a716-446655440001',
    chunkIndex: 0,
    textContent: 'Jack Torrance thought: Officious little prick. But he held his smile and said, "Thanks very much for showing me around, Mr. Ullman." "Not at all," Ullman said. He stood behind his desk in his spotless office, his back to a large window that looked out on the Overlook Hotel\'s magnificent view of the Colorado Rockies...',
    wordCount: 987,
    pageNumber: 1,
    locationReference: 'Chapter 1: Part One - Prefatory Matters',
    createdAt: new Date('2024-01-15')
  },

  shiningChunk2: {
    id: '770e8400-e29b-41d4-a716-446655440002',
    masterworkId: '550e8400-e29b-41d4-a716-446655440001',
    chunkIndex: 1,
    textContent: 'The Overlook Hotel had been built in 1907 by a man named Robert Townley Watson, a Denver real estate mogul with grandiose dreams. Watson had wanted to create the most luxurious resort hotel in the American West...',
    wordCount: 1024,
    pageNumber: 5,
    locationReference: 'Chapter 2: Boulder',
    createdAt: new Date('2024-01-15')
  }
}

export const testUploadTracking = {
  activeUpload: {
    id: '880e8400-e29b-41d4-a716-446655440001',
    userId: 'user-123',
    fileName: 'great-gatsby.pdf',
    fileSize: 3200000,
    format: 'PDF' as const,
    status: 'processing' as const,
    progressPercentage: 75,
    errorMessage: null,
    tempFilePath: '/tmp/uploads/upload-12345.pdf',
    masterworkId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  failedUpload: {
    id: '880e8400-e29b-41d4-a716-446655440002',
    userId: 'user-456',
    fileName: 'huge-file.pdf',
    fileSize: 60000000, // 60MB - over limit
    format: 'PDF' as const,
    status: 'failed' as const,
    progressPercentage: 0,
    errorMessage: 'File size exceeds maximum allowed size of 50MB',
    tempFilePath: null,
    masterworkId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
