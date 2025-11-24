import React from 'react';

interface StyleMetricsCardProps {
    label: string;
    value: number;
    max?: number;
    suffix?: string;
    description?: string;
    color?: string;
}

export const StyleMetricsCard: React.FC<StyleMetricsCardProps> = ({
    label,
    value,
    max = 100,
    suffix = '',
    description,
    color = 'bg-purple-500'
}) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-gray-400 font-medium">{label}</span>
                <span className="text-lg font-bold text-white font-mono">
                    {value.toFixed(1)}{suffix}
                </span>
            </div>

            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {description && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};
