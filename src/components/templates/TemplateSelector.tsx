'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateConfig, TemplateId } from '@/types/templates';
import { getAllTemplates, getCategories, getTemplatesByCategory } from '@/config/templates';
import { useTheme } from '@/contexts/ThemeContext';
import DynamicForm from './DynamicForm';
import { useTemplateProject } from '@/hooks/useTemplateProject';

export default function TemplateSelector() {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();
  const { createProject } = useTemplateProject();

  const categories = ['all', ...getCategories()];
  const templates = selectedCategory === 'all'
    ? getAllTemplates()
    : getTemplatesByCategory(selectedCategory);

  const handleTemplateClick = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  const handleCreateProject = (inputs: Record<string, any>) => {
    if (!selectedTemplate) return;

    const project = createProject(
      selectedTemplate.id as TemplateId,
      inputs.title || `New ${selectedTemplate.name}`,
      inputs
    );

    // Navigate to template editor
    router.push(`/template-editor/${project.id}`);
  };

  return (
    <div className={`min-h-screen ${textColor}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <h1 className={`text-4xl font-bold mb-2 ${textColor}`}>
          Choose Your Template
        </h1>
        <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Select a template to start creating AI-powered content
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : theme === 'light'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }
              `}
            >
              {category === 'all' ? 'All Templates' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
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
              <div className="text-5xl mb-4">{template.icon}</div>
              <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>
                {template.name}
              </h3>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {template.description}
              </p>
              <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-medium
                ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}
              `}>
                {template.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            className={`
              ${cardBg} ${borderColor}
              border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
              p-6
            `}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedTemplate.icon}</span>
                <div>
                  <h2 className={`text-2xl font-bold ${textColor}`}>
                    {selectedTemplate.name}
                  </h2>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Dynamic Form */}
            <DynamicForm
              inputs={selectedTemplate.inputs}
              onSubmit={handleCreateProject}
              onCancel={() => {
                setShowCreateModal(false);
                setSelectedTemplate(null);
              }}
              submitLabel={`Create ${selectedTemplate.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
