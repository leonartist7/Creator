'use client';

import React, { useState } from 'react';
import { Project, ProjectSection } from '@/types/templates';
import { useTheme } from '@/contexts/ThemeContext';
import { useTemplateProject } from '@/hooks/useTemplateProject';
import { getTemplate } from '@/config/templates';

interface TemplateEditorProps {
  project: Project;
}

export default function TemplateEditor({ project }: TemplateEditorProps) {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const {
    generateSection,
    regenerateSection,
    updateSectionContent,
    markSectionComplete,
    isGenerating,
  } = useTemplateProject();

  const [activeSection, setActiveSection] = useState<string | null>(
    project.sections[0]?.id || null
  );
  const [editMode, setEditMode] = useState(false);

  const template = getTemplate(project.templateId);

  const handleGenerate = async (sectionId: string) => {
    try {
      await generateSection(sectionId);
      setEditMode(false);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content. Please try again.');
    }
  };

  const handleRegenerate = async (
    sectionId: string,
    variation?: 'expand' | 'shorten' | 'change-tone'
  ) => {
    try {
      await regenerateSection(sectionId, variation);
    } catch (error) {
      console.error('Regeneration error:', error);
      alert('Failed to regenerate content. Please try again.');
    }
  };

  const renderSection = (section: ProjectSection, depth: number = 0) => {
    const isActive = activeSection === section.id;
    const hasContent = section.content.trim().length > 0;

    return (
      <div key={section.id} style={{ marginLeft: `${depth * 1.5}rem` }} className="mb-2">
        {/* Section Header */}
        <button
          onClick={() => setActiveSection(section.id)}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all
            flex items-center justify-between
            ${isActive
              ? 'bg-blue-500 text-white'
              : theme === 'light'
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
            }
          `}
        >
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            <span className="text-xl">
              {section.status === 'completed' && '✓'}
              {section.status === 'generated' && '📝'}
              {section.status === 'generating' && '⏳'}
              {section.status === 'pending' && '○'}
              {section.status === 'edited' && '✏️'}
            </span>
            <span className="font-medium">{section.title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {section.metadata?.wordCount ? (
              <span className="opacity-80">
                {section.metadata.wordCount} words
              </span>
            ) : null}
            <span>→</span>
          </div>
        </button>

        {/* Subsections */}
        {section.subSections?.map((subsection) => (
          <div key={subsection.id}>
            {renderSection(subsection, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  const activeSection Obj = findSection(project.sections, activeSection);

  return (
    <div className={`flex h-screen ${textColor}`}>
      {/* Sidebar - Sections List */}
      <div className={`w-80 ${cardBg} ${borderColor} border-r overflow-y-auto`}>
        {/* Project Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{template.icon}</span>
            <div>
              <h2 className={`text-xl font-bold ${textColor}`}>
                {project.title}
              </h2>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {template.name}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                Progress
              </span>
              <span className={`font-semibold ${textColor}`}>
                {project.metadata.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.metadata.completionPercentage}%` }}
              />
            </div>
            <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {project.metadata.totalWords.toLocaleString()} words total
            </div>
          </div>
        </div>

        {/* Sections Tree */}
        <div className="p-4">
          <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>
            SECTIONS
          </h3>
          {project.sections.map((section) => renderSection(section))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        {activeSectionObj && (
          <div className={`${cardBg} ${borderColor} border-b px-6 py-4 flex items-center justify-between`}>
            <h2 className={`text-xl font-bold ${textColor}`}>
              {activeSectionObj.title}
            </h2>

            <div className="flex items-center gap-2">
              {/* Generate/Regenerate Buttons */}
              {!activeSectionObj.content && (
                <button
                  onClick={() => handleGenerate(activeSectionObj.id)}
                  disabled={isGenerating}
                  className={`
                    px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isGenerating ? '⏳ Generating...' : '✨ Generate Content'}
                </button>
              )}

              {activeSectionObj.content && (
                <>
                  <button
                    onClick={() => handleRegenerate(activeSectionObj.id)}
                    disabled={isGenerating}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
                      disabled:opacity-50
                    `}
                  >
                    🔄 Regenerate
                  </button>

                  <button
                    onClick={() => handleRegenerate(activeSectionObj.id, 'expand')}
                    disabled={isGenerating}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
                      disabled:opacity-50
                    `}
                  >
                    📈 Expand
                  </button>

                  <button
                    onClick={() => handleRegenerate(activeSectionObj.id, 'shorten')}
                    disabled={isGenerating}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
                      disabled:opacity-50
                    `}
                  >
                    📉 Shorten
                  </button>

                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
                    `}
                  >
                    {editMode ? '👁️ Preview' : '✏️ Edit'}
                  </button>

                  <button
                    onClick={() => markSectionComplete(activeSectionObj.id)}
                    className={`
                      px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium
                      transition-colors
                    `}
                  >
                    ✓ Mark Complete
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content Editor/Viewer */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeSectionObj ? (
            <div className="max-w-4xl mx-auto">
              {!activeSectionObj.content ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>
                    No Content Yet
                  </h3>
                  <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Click "Generate Content" to create AI-powered content for this section
                  </p>
                </div>
              ) : editMode ? (
                <textarea
                  value={activeSectionObj.content}
                  onChange={(e) => updateSectionContent(activeSectionObj.id, e.target.value)}
                  className={`
                    w-full min-h-[500px] p-4 rounded-lg border ${borderColor}
                    ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
                    ${textColor}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    font-mono text-sm
                  `}
                />
              ) : (
                <div
                  className={`
                    prose prose-lg max-w-none
                    ${theme === 'light' ? 'prose-slate' : 'prose-invert'}
                  `}
                  dangerouslySetInnerHTML={{
                    __html: formatContent(activeSectionObj.content),
                  }}
                />
              )}

              {/* Section Metadata */}
              {activeSectionObj.content && (
                <div className={`mt-8 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        Word Count:
                      </span>
                      <span className={`ml-2 font-semibold ${textColor}`}>
                        {activeSectionObj.metadata?.wordCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        Status:
                      </span>
                      <span className={`ml-2 font-semibold ${textColor}`}>
                        {activeSectionObj.status}
                      </span>
                    </div>
                    {activeSectionObj.metadata?.generatedAt && (
                      <div>
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Generated:
                        </span>
                        <span className={`ml-2 font-semibold ${textColor}`}>
                          {new Date(activeSectionObj.metadata.generatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👈</div>
              <h3 className={`text-2xl font-bold ${textColor}`}>
                Select a Section
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                Choose a section from the sidebar to view or generate content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions

function findSection(sections: ProjectSection[], sectionId: string | null): ProjectSection | null {
  if (!sectionId) return null;

  for (const section of sections) {
    if (section.id === sectionId) return section;
    if (section.subSections) {
      const found = findSection(section.subSections, sectionId);
      if (found) return found;
    }
  }
  return null;
}

function formatContent(content: string): string {
  // Convert markdown-like syntax to HTML
  let html = content;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;

  // Line breaks
  html = html.replace(/\n/g, '<br/>');

  return html;
}
