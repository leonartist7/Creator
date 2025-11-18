'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTemplate } from '@/contexts/TemplateContext';

export default function TemplateSidebar() {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const { selectedTemplate, getTemplateConfig } = useTemplate();

  if (!selectedTemplate) return null;

  const config = getTemplateConfig(selectedTemplate);

  const handleToolAction = (actionId: string) => {
    console.log(`Tool action: ${actionId}`);
    alert(`Template Tool: ${actionId}\n\nThis would trigger template-specific functionality.`);
  };

  return (
    <div className={`w-64 ${cardBg} ${borderColor} border-r ${textColor} flex flex-col h-screen`}>
      {/* Header */}
      <div className={`p-4 border-b ${borderColor}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <h2 className={`font-bold ${textColor}`}>{config.name}</h2>
            <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Template Tools */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>Template Tools</h3>
        <div className="space-y-2">
          {config.sidebarTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolAction(tool.action)}
              className={`
                w-full px-4 py-3 rounded-lg text-left
                ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}
                transition-all duration-200
                flex items-center gap-3
                ${borderColor} border
              `}
            >
              <span className="text-xl">{tool.icon}</span>
              <span className={`text-sm font-medium ${textColor}`}>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-4 border-t ${borderColor}`}>
        <button
          className={`
            w-full px-4 py-2 rounded-lg
            bg-blue-500 hover:bg-blue-600
            text-white font-medium text-sm
            transition-colors
          `}
        >
          + New Section
        </button>
      </div>
    </div>
  );
}
