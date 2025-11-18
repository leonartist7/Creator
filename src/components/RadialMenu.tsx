'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TextSelection } from '@/types';

interface RadialMenuProps {
  selection: TextSelection;
  onClose: () => void;
}

interface RadialAction {
  id: string;
  label: string;
  icon: string;
  angle: number;
}

const radialActions: RadialAction[] = [
  { id: 'enhance', label: 'Enhance', icon: '✨', angle: 0 },
  { id: 'rewrite', label: 'Rewrite', icon: '🔄', angle: 60 },
  { id: 'translate', label: 'Translate', icon: '🌐', angle: 120 },
  { id: 'ideas', label: 'Ideas', icon: '💡', angle: 180 },
  { id: 'research', label: 'Research', icon: '🔍', angle: 240 },
  { id: 'tone', label: 'Tone', icon: '🎭', angle: 300 },
];

export default function RadialMenu({ selection, onClose }: RadialMenuProps) {
  const { theme, textColor } = useTheme();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (actionId: string) => {
    console.log(`Radial action: ${actionId} on: "${selection.text}"`);
    alert(`AI Action: ${actionId}\n\nSelected: "${selection.text.substring(0, 50)}..."`);
    onClose();
  };

  const radius = 80;
  const centerSize = 50;

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{
        top: `${selection.position.y}px`,
        left: `${selection.position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Radial Container */}
      <div className="relative" style={{ width: '240px', height: '240px' }}>
        {/* Center Circle */}
        <div
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            rounded-full backdrop-blur-xl bg-white/10 border-2 border-white/30
            flex items-center justify-center
            ${textColor} font-semibold text-sm
            shadow-2xl
          `}
          style={{
            width: `${centerSize}px`,
            height: `${centerSize}px`,
          }}
        >
          AI
        </div>

        {/* Radial Action Buttons */}
        {radialActions.map((action) => {
          const angleRad = (action.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <div
              key={action.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <button
                onClick={() => handleAction(action.id)}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                className={`
                  w-14 h-14 rounded-full
                  backdrop-blur-lg bg-white/20 border border-white/40
                  hover:bg-white/30 hover:scale-110
                  transition-all duration-200
                  flex items-center justify-center
                  text-2xl
                  shadow-lg hover:shadow-xl
                  ${hoveredAction === action.id ? 'ring-2 ring-blue-400' : ''}
                `}
                title={action.label}
              >
                {action.icon}
              </button>

              {/* Label on hover */}
              {hoveredAction === action.id && (
                <div
                  className={`
                    absolute top-full mt-2 left-1/2 transform -translate-x-1/2
                    px-3 py-1 rounded-lg
                    backdrop-blur-lg bg-white/20 border border-white/30
                    ${textColor} text-xs font-medium whitespace-nowrap
                    shadow-lg
                  `}
                >
                  {action.label}
                </div>
              )}
            </div>
          );
        })}

        {/* Connecting Lines (Optional Visual Enhancement) */}
        <svg
          className="absolute inset-0 pointer-events-none opacity-20"
          width="240"
          height="240"
        >
          {radialActions.map((action) => {
            const angleRad = (action.angle * Math.PI) / 180;
            const x1 = 120;
            const y1 = 120;
            const x2 = 120 + Math.cos(angleRad) * radius;
            const y2 = 120 + Math.sin(angleRad) * radius;

            return (
              <line
                key={action.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={theme === 'light' ? '#000' : '#fff'}
                strokeWidth="1"
                opacity="0.2"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
