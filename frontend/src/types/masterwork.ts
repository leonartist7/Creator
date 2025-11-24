export interface StyleProfile {
    id: string;
    masterwork_id: string;
    avg_sentence_length: number;
    sentence_length_variance: number;
    vocab_complexity: number;
    unique_word_ratio: number;
    avg_paragraph_length: number;
    paragraph_variance: number;
    dialogue_ratio: number;
    flesch_reading_ease: number;
    flesch_kincaid_grade: number;
    tone_score: number;
    sentiment_score: number;
    top_words: string; // JSON string
    top_phrases: string; // JSON string
    common_sentence_patterns: string | null;
    confidence_score: number;
    analysis_date: string;
}

export interface Masterwork {
    id: string;
    title: string;
    author: string | null;
    format: string;
    upload_date: string;
    extraction_status: 'pending' | 'processing' | 'completed' | 'failed';
    analysis_status: 'not_started' | 'processing' | 'completed' | 'failed';
    word_count: number;
    style_profile?: StyleProfile;
}
