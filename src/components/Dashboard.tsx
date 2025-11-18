'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTemplate } from '@/contexts/TemplateContext';
import { useProject } from '@/contexts/ProjectContext';
import { templateConfigs } from '@/config/templates';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { theme, textColor, bgColor, cardBg, borderColor } = useTheme();
  const { setSelectedTemplate } = useTemplate();
  const { projects, createProject } = useProject();
  const router = useRouter();

  const handleTemplateClick = (templateId: any) => {
    setSelectedTemplate(templateId);
    createProject(`New ${templateConfigs[templateId].name}`, templateId);
    router.push('/editor');
  };

  const totalWords = projects.reduce((sum, p) => sum + p.metadata.totalWords, 0);
  const avgProgress = projects.length > 0
    ? Math.floor(projects.reduce((sum, p) => sum + p.metadata.completionPercentage, 0) / projects.length)
    : 0;

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Hero Section - Clean and Inspiring */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className={`text-6xl font-bold mb-4 ${textColor}`}>
            Create Your Masterpiece
          </h1>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            AI-powered writing that adapts to your creative vision
          </p>
        </div>

        {/* Template Cards - Writing Focused */}
        <div className="mb-16">
          <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
            Choose Your Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.values(templateConfigs).map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
                className={`
                  ${cardBg} ${borderColor} ${textColor}
                  border rounded-2xl p-6 text-left
                  hover:scale-105 transform transition-all duration-300
                  hover:shadow-xl
                  ${theme === 'light'
                    ? 'hover:bg-gray-100'
                    : 'hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${textColor}`}>
                  {template.name}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
              Recent Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  className={`${cardBg} ${borderColor} border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all`}
                  onClick={() => router.push('/editor')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {templateConfigs[project.template]?.icon}
                    </span>
                    <h3 className={`font-semibold ${textColor}`}>
                      {project.title}
                    </h3>
                  </div>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                    {project.metadata.totalWords} words • {project.metadata.completionPercentage}% complete
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.metadata.completionPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats at Bottom - As Requested */}
        <div className="mt-20">
          <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
            Your Writing Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Words Card */}
            <div className={`${cardBg} ${borderColor} border rounded-2xl p-8`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                    Total Words Written
                  </p>
                  <p className={`text-5xl font-bold ${textColor}`}>
                    {totalWords.toLocaleString()}
                  </p>
                </div>
                <div className="text-6xl opacity-20">✍️</div>
              </div>
            </div>

            {/* Total Progress Card */}
            <div className={`${cardBg} ${borderColor} border rounded-2xl p-8`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                    Average Project Progress
                  </p>
                  <p className={`text-5xl font-bold ${textColor}`}>
                    {avgProgress}%
                  </p>
                </div>
                <div className="text-6xl opacity-20">📊</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
