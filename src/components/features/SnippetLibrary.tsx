'use client';

import React, { useState } from 'react';
import { Snippet } from '@/types/enhanced';
import {
  BookmarkPlus,
  Search,
  Hash,
  Copy,
  Trash2,
  Star,
  TrendingUp,
  Clock,
  Filter,
} from 'lucide-react';

interface SnippetLibraryProps {
  snippets: Snippet[];
  onInsert: (snippet: Snippet) => void;
  onCreate: (title: string, content: string, category: Snippet['category'], tags: string[]) => void;
  onDelete: (snippetId: string) => void;
}

export function SnippetLibrary({
  snippets,
  onInsert,
  onCreate,
  onDelete,
}: SnippetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Snippet['category'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newSnippet, setNewSnippet] = useState({
    title: '',
    content: '',
    category: 'paragraph' as Snippet['category'],
    tags: '',
  });

  const categories: { value: Snippet['category'] | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '📚' },
    { value: 'hook', label: 'Hooks', icon: '🎣' },
    { value: 'cta', label: 'CTAs', icon: '📢' },
    { value: 'paragraph', label: 'Paragraphs', icon: '📝' },
    { value: 'headline', label: 'Headlines', icon: '🎯' },
    { value: 'transition', label: 'Transitions', icon: '🔄' },
    { value: 'custom', label: 'Custom', icon: '⭐' },
  ];

  // Filter snippets
  const filteredSnippets = snippets
    .filter((snippet) => {
      // Category filter
      if (selectedCategory !== 'all' && snippet.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          snippet.title.toLowerCase().includes(query) ||
          snippet.content.toLowerCase().includes(query) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.useCount - a.useCount;
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const handleCreate = () => {
    if (newSnippet.title && newSnippet.content) {
      const tags = newSnippet.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);
      onCreate(newSnippet.title, newSnippet.content, newSnippet.category, tags);
      setNewSnippet({ title: '', content: '', category: 'paragraph', tags: '' });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Snippet Library</h3>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            + New
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
          <input
            type="text"
            placeholder="Snippet title"
            value={newSnippet.title}
            onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
            className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <textarea
            placeholder="Snippet content"
            value={newSnippet.content}
            onChange={(e) => setNewSnippet({ ...newSnippet, content: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white resize-none"
          />
          <select
            value={newSnippet.category}
            onChange={(e) => setNewSnippet({ ...newSnippet, category: e.target.value as Snippet['category'] })}
            className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            {categories.filter((c) => c.value !== 'all').map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={newSnippet.tags}
            onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
            className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Snippet
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredSnippets.length} {filteredSnippets.length === 1 ? 'snippet' : 'snippets'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              sortBy === 'recent'
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Clock className="w-3 h-3" />
            Recent
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              sortBy === 'popular'
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            Popular
          </button>
        </div>
      </div>

      {/* Snippets List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSnippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <BookmarkPlus className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              {searchQuery ? 'No snippets found' : 'No snippets yet'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Create your first snippet to get started'}
            </p>
          </div>
        ) : (
          filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {snippet.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {snippet.content}
                  </p>
                  {snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {snippet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          <Hash className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {snippet.useCount} uses
                    </span>
                    <span>{categories.find((c) => c.value === snippet.category)?.icon}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onInsert(snippet)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Insert
                </button>
                <button
                  onClick={() => onDelete(snippet.id)}
                  className="px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
