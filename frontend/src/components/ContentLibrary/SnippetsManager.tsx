import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import {
  Save,
  Copy,
  Trash2,
  Edit2,
  Plus,
  Search,
  Filter,
  BookOpen,
  FileText,
  Zap,
  Tag,
} from 'lucide-react';

interface Snippet {
  id: string;
  title: string;
  content: string;
  category: 'introduction' | 'cta' | 'header' | 'footer' | 'transition' | 'conclusion' | 'custom';
  tags: string[];
  createdAt: string;
  usageCount: number;
}

const SNIPPET_CATEGORIES = [
  { value: 'introduction', label: 'Introduction', icon: '📖', color: 'blue' },
  { value: 'cta', label: 'Call-to-Action', icon: '🎯', color: 'red' },
  { value: 'header', label: 'Header', icon: '📌', color: 'purple' },
  { value: 'footer', label: 'Footer', icon: '📄', color: 'gray' },
  { value: 'transition', label: 'Transition', icon: '➡️', color: 'green' },
  { value: 'conclusion', label: 'Conclusion', icon: '✅', color: 'yellow' },
  { value: 'custom', label: 'Custom', icon: '✨', color: 'pink' },
];

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: '1',
    title: 'Welcome Introduction',
    content: 'Welcome! In this guide, you\'ll discover everything you need to know about [TOPIC]. Whether you\'re a beginner or looking to deepen your knowledge, this comprehensive resource has you covered.',
    category: 'introduction',
    tags: ['welcome', 'intro', 'guide'],
    createdAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: '2',
    title: 'Strong CTA',
    content: 'Ready to take action? Click the button below to get started today and unlock your full potential. Don\'t wait – your journey begins now!',
    category: 'cta',
    tags: ['cta', 'action', 'button'],
    createdAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: '3',
    title: 'Chapter Transition',
    content: 'Now that we\'ve covered [PREVIOUS TOPIC], let\'s dive into [NEXT TOPIC] and explore how these concepts work together.',
    category: 'transition',
    tags: ['transition', 'chapter', 'flow'],
    createdAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: '4',
    title: 'Key Takeaways Conclusion',
    content: 'Let\'s recap the key points:\n\n• [KEY POINT 1]\n• [KEY POINT 2]\n• [KEY POINT 3]\n\nBy applying these principles, you\'ll be well on your way to success.',
    category: 'conclusion',
    tags: ['conclusion', 'summary', 'recap'],
    createdAt: new Date().toISOString(),
    usageCount: 0,
  },
];

export const SnippetsManager = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const { success, error: showError } = useToast();

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Snippet['category']>('custom');
  const [formTags, setFormTags] = useState('');

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    const saved = localStorage.getItem('contentSnippets');
    if (saved) {
      setSnippets(JSON.parse(saved));
    } else {
      setSnippets(DEFAULT_SNIPPETS);
      localStorage.setItem('contentSnippets', JSON.stringify(DEFAULT_SNIPPETS));
    }
  };

  const saveSnippets = (newSnippets: Snippet[]) => {
    setSnippets(newSnippets);
    localStorage.setItem('contentSnippets', JSON.stringify(newSnippets));
  };

  const handleCreateSnippet = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      showError('Missing Fields', 'Please provide both title and content');
      return;
    }

    const newSnippet: Snippet = {
      id: Date.now().toString(),
      title: formTitle,
      content: formContent,
      category: formCategory,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    const updated = [...snippets, newSnippet];
    saveSnippets(updated);
    success('Snippet Created!', 'Your snippet has been saved');
    resetForm();
    setShowCreateModal(false);
  };

  const handleUpdateSnippet = () => {
    if (!editingSnippet || !formTitle.trim() || !formContent.trim()) {
      showError('Missing Fields', 'Please provide both title and content');
      return;
    }

    const updated = snippets.map((s) =>
      s.id === editingSnippet.id
        ? {
            ...s,
            title: formTitle,
            content: formContent,
            category: formCategory,
            tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
          }
        : s
    );

    saveSnippets(updated);
    success('Snippet Updated!', 'Your changes have been saved');
    resetForm();
    setEditingSnippet(null);
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = snippets.filter((s) => s.id !== id);
    saveSnippets(updated);
    success('Snippet Deleted', 'Snippet removed from library');
  };

  const handleCopySnippet = async (snippet: Snippet) => {
    await navigator.clipboard.writeText(snippet.content);

    // Increment usage count
    const updated = snippets.map((s) =>
      s.id === snippet.id ? { ...s, usageCount: s.usageCount + 1 } : s
    );
    saveSnippets(updated);

    success('Copied!', 'Snippet copied to clipboard');
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setFormTitle(snippet.title);
    setFormContent(snippet.content);
    setFormCategory(snippet.category);
    setFormTags(snippet.tags.join(', '));
  };

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('custom');
    setFormTags('');
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || snippet.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const cat = SNIPPET_CATEGORIES.find((c) => c.value === category);
    return cat?.color || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 glass-strong border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Content Snippets Library
            </h2>
            <p className="text-sm text-secondary mt-1">
              Save and reuse your best content pieces
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={18} className="mr-2" />
            New Snippet
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded glass">
            <div className="text-2xl font-bold text-primary">{snippets.length}</div>
            <div className="text-xs text-muted">Total Snippets</div>
          </div>
          <div className="text-center p-3 rounded glass">
            <div className="text-2xl font-bold text-green-600">
              {snippets.reduce((sum, s) => sum + s.usageCount, 0)}
            </div>
            <div className="text-xs text-muted">Times Used</div>
          </div>
          <div className="text-center p-3 rounded glass">
            <div className="text-2xl font-bold text-purple-600">
              {SNIPPET_CATEGORIES.length}
            </div>
            <div className="text-xs text-muted">Categories</div>
          </div>
        </div>
      </Card>

      {/* Search & Filter */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by title, content, or tags..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'glass text-secondary hover:text-primary'
            }`}
          >
            All
          </button>
          {SNIPPET_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'glass text-secondary hover:text-primary'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSnippets.map((snippet) => {
          const category = SNIPPET_CATEGORIES.find((c) => c.value === snippet.category);

          return (
            <Card key={snippet.id} className="p-4 glass hover:glass-strong transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category?.icon}</span>
                  <div>
                    <h4 className="font-semibold text-primary text-sm">{snippet.title}</h4>
                    <Badge variant={getCategoryColor(snippet.category) as any} size="sm">
                      {category?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-xs text-secondary mb-3 line-clamp-3 min-h-[3rem]">
                {snippet.content}
              </div>

              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {snippet.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted mb-3">
                <span>Used {snippet.usageCount}×</span>
                <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopySnippet(snippet)}
                  className="flex-1"
                >
                  <Copy size={14} className="mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditSnippet(snippet)}
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteSnippet(snippet.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredSnippets.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-secondary">
              {searchQuery || selectedCategory !== 'all'
                ? 'No snippets found matching your filters'
                : 'No snippets yet. Create your first snippet!'}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || editingSnippet !== null}
        onClose={() => {
          setShowCreateModal(false);
          setEditingSnippet(null);
          resetForm();
        }}
        title={editingSnippet ? 'Edit Snippet' : 'Create Snippet'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Title</label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Welcome Introduction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as Snippet['category'])}
              className="input"
            >
              {SNIPPET_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Content</label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Enter your reusable content here..."
              className="input min-h-[200px] resize-y"
              rows={8}
            />
            <p className="text-xs text-muted mt-1">
              {formContent.length} characters, {formContent.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Tags (comma-separated)
            </label>
            <Input
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="e.g., intro, welcome, guide"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setEditingSnippet(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingSnippet ? handleUpdateSnippet : handleCreateSnippet}
            >
              <Save size={18} className="mr-2" />
              {editingSnippet ? 'Update' : 'Create'} Snippet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
