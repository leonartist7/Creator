import React from 'react';
import { FileText, Book, File, MoreVertical, Clock } from 'lucide-react';
import { Masterwork } from '../../types/masterwork';

interface MasterworkCardProps {
    work: Masterwork;
    onClick: (work: Masterwork) => void;
}

export const MasterworkCard: React.FC<MasterworkCardProps> = ({ work, onClick }) => {
    const getIcon = () => {
        switch (work.format) {
            case 'PDF': return <FileText className="w-6 h-6 text-pink-400" />;
            case 'EPUB': return <Book className="w-6 h-6 text-purple-400" />;
            default: return <File className="w-6 h-6 text-indigo-400" />;
        }
    };

    const getStatusColor = () => {
        switch (work.analysis_status) {
            case 'completed': return 'bg-green-400';
            case 'processing': return 'bg-yellow-400';
            case 'failed': return 'bg-red-400';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div
            onClick={() => onClick(work)}
            className="group relative bg-white/5 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-inner border border-white/5">
                    {getIcon()}
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor()} shadow-[0_0_8px_rgba(0,0,0,0.3)]`} />
            </div>

            <div className="space-y-1">
                <h3 className="font-medium text-white text-lg leading-tight line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {work.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-1">
                    {work.author || 'Unknown Author'}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-3">
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(work.upload_date).toLocaleDateString()}
                </span>
                <span className="uppercase tracking-wider font-medium opacity-60">
                    {work.format}
                </span>
            </div>
        </div>
    );
};
