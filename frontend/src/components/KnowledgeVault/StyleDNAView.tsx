import React from 'react';
import { X, Copy, Share2, Activity, Type, MessageSquare, BookOpen } from 'lucide-react';
import { Masterwork } from '../../types/masterwork';
import { StyleMetricsCard } from './StyleMetricsCard';

interface StyleDNAViewProps {
    work: Masterwork | null;
    isOpen: boolean;
    onClose: () => void;
}

export const StyleDNAView: React.FC<StyleDNAViewProps> = ({ work, isOpen, onClose }) => {
    if (!work || !work.style_profile) return null;

    const { style_profile: dna } = work;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Style DNA</h2>
                            <p className="text-sm text-gray-400">{work.title}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* DNA Summary */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-6 border border-purple-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="text-purple-400" size={20} />
                                <h3 className="font-semibold text-purple-100">Analysis Summary</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-black/20 rounded-xl">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {dna.flesch_kincaid_grade.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-purple-300">Grade Level</div>
                                </div>
                                <div className="text-center p-3 bg-black/20 rounded-xl">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {(dna.unique_word_ratio * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-purple-300">Vocabulary Richness</div>
                                </div>
                            </div>
                        </div>

                        {/* Readability Section */}
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                <BookOpen size={14} /> Readability
                            </h4>
                            <div className="space-y-3">
                                <StyleMetricsCard
                                    label="Reading Ease"
                                    value={dna.flesch_reading_ease}
                                    max={100}
                                    color="bg-green-500"
                                    description="Higher scores indicate easier to read text."
                                />
                                <StyleMetricsCard
                                    label="Avg Sentence Length"
                                    value={dna.avg_sentence_length}
                                    max={30}
                                    suffix=" words"
                                    color="bg-blue-500"
                                />
                            </div>
                        </div>

                        {/* Tone & Sentiment */}
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                <MessageSquare size={14} /> Tone & Sentiment
                            </h4>
                            <div className="space-y-3">
                                <StyleMetricsCard
                                    label="Sentiment"
                                    value={(dna.sentiment_score + 1) * 50} // Normalize -1..1 to 0..100
                                    max={100}
                                    color="bg-pink-500"
                                    description="0 = Negative, 100 = Positive"
                                />
                                <StyleMetricsCard
                                    label="Dialogue Ratio"
                                    value={dna.dialogue_ratio * 100}
                                    max={100}
                                    suffix="%"
                                    color="bg-orange-500"
                                />
                            </div>
                        </div>

                        {/* Vocabulary */}
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                <Type size={14} /> Vocabulary
                            </h4>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <p className="text-sm text-gray-400 mb-3">Top Words</p>
                                <div className="flex flex-wrap gap-2">
                                    {JSON.parse(dna.top_words).slice(0, 10).map((word: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300 font-mono">
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 bg-gray-900">
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                            <Copy size={18} />
                            Copy Style Profile
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
