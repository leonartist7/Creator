'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTemplate } from '@/contexts/TemplateContext';
import { useProject } from '@/contexts/ProjectContext';
import { TextSelection } from '@/types';
import AIActionsMenu from './AIActionsMenu';
import RadialMenu from './RadialMenu';
import AdaptiveToolbar from './AdaptiveToolbar';
import AICompanionSidebar from './AICompanionSidebar';
import TemplateSidebar from './TemplateSidebar';

export default function Editor() {
  const { theme, textColor, bgColor } = useTheme();
  const { selectedTemplate, getTemplateConfig } = useTemplate();
  const { currentProject, updateProjectContent, zenMode, toggleZenMode } = useProject();

  const [content, setContent] = useState(currentProject?.content || '');
  const [textSelection, setTextSelection] = useState<TextSelection | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(true);
  const [showTemplateSidebar, setShowTemplateSidebar] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);

  // Get template config
  const templateConfig = selectedTemplate ? getTemplateConfig(selectedTemplate) : null;

  // Apply dynamic template theme
  const templateGradient = templateConfig?.bgGradient || 'from-gray-50 to-gray-100';

  // Handle text selection
  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setTextSelection(null);
      setShowContextMenu(false);
      setShowRadialMenu(false);
      return;
    }

    const selectedText = selection.toString();
    if (selectedText.trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setTextSelection({
        text: selectedText,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        },
      });

      // Show radial menu by default (can toggle with context menu)
      setShowRadialMenu(true);
    }
  }, []);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setShowContextMenu(true);
      setShowRadialMenu(false);
    }
  }, []);

  // Update content
  const handleContentChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    setContent(newContent);
    updateProjectContent(newContent);
  }, [updateProjectContent]);

  // Word count
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Zen mode styling
  const zenModeClasses = zenMode
    ? 'fixed inset-0 z-50 flex items-center justify-center'
    : '';

  const editorContainerClasses = zenMode
    ? `w-full max-w-4xl mx-auto ${bgColor} p-12 rounded-none`
    : 'flex-1';

  return (
    <div
      className={`
        ${zenMode ? zenModeClasses : 'flex h-screen'}
        ${theme === 'light' ? `bg-gradient-to-br ${templateGradient}` : bgColor}
        ${textColor}
        transition-all duration-300
      `}
    >
      {/* Template Sidebar - Hidden in Zen Mode */}
      {!zenMode && showTemplateSidebar && selectedTemplate && (
        <TemplateSidebar />
      )}

      {/* Main Editor Area */}
      <div className={editorContainerClasses}>
        {/* Adaptive Toolbar - Hidden in Zen Mode */}
        {!zenMode && (
          <AdaptiveToolbar
            onToggleZen={toggleZenMode}
            onToggleAISidebar={() => setShowAISidebar(!showAISidebar)}
            onToggleTemplateSidebar={() => setShowTemplateSidebar(!showTemplateSidebar)}
          />
        )}

        {/* Editor Content */}
        <div className={`${zenMode ? 'h-auto' : 'h-full'} flex flex-col`}>
          {/* Project Title */}
          {!zenMode && (
            <div className="mb-6 px-8 pt-6">
              <input
                type="text"
                placeholder="Untitled Project"
                defaultValue={currentProject?.title}
                className={`
                  text-4xl font-bold w-full bg-transparent border-none outline-none
                  ${textColor}
                  placeholder-gray-400
                `}
              />
            </div>
          )}

          {/* Writing Area */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onMouseUp={handleTextSelect}
            onContextMenu={handleContextMenu}
            className={`
              ${zenMode ? 'min-h-[60vh] text-2xl leading-relaxed' : 'flex-1 text-lg'}
              px-8 py-6 outline-none
              ${textColor}
              prose prose-lg max-w-none
              ${theme === 'light' ? 'prose-slate' : 'prose-invert'}
            `}
            suppressContentEditableWarning
          >
            {content || (
              <span className="text-gray-400 italic">
                Start writing your masterpiece...
              </span>
            )}
          </div>

          {/* Zen Mode Word Count - Floating */}
          {zenMode && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
              <div className={`
                px-6 py-3 rounded-full backdrop-blur-lg bg-white/10 border border-white/20
                ${textColor} text-sm font-medium
              `}>
                {wordCount} words
              </div>
            </div>
          )}

          {/* Exit Zen Button */}
          {zenMode && (
            <button
              onClick={toggleZenMode}
              className="fixed top-8 right-8 px-4 py-2 rounded-lg backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
            >
              Exit Zen Mode
            </button>
          )}
        </div>

        {/* AI Actions Context Menu */}
        {showContextMenu && textSelection && (
          <AIActionsMenu
            selection={textSelection}
            onClose={() => setShowContextMenu(false)}
          />
        )}

        {/* Radial Menu */}
        {showRadialMenu && textSelection && (
          <RadialMenu
            selection={textSelection}
            onClose={() => setShowRadialMenu(false)}
          />
        )}
      </div>

      {/* AI Companion Sidebar - Hidden in Zen Mode */}
      {!zenMode && showAISidebar && (
        <AICompanionSidebar />
      )}
    </div>
  );
}
