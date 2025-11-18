import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote,
  Undo, Redo, AlignLeft, Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { InlineAI } from './InlineAIExtension';
import type { AITask } from '../../hooks/useAI';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onAIAssist?: () => void;
  onAITrigger?: (task: AITask, text: string) => void;
}

export const RichTextEditor = ({ content, onChange, onAIAssist, onAITrigger }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your content here... (Use ++, >>, ??, //, @@ for AI triggers)',
      }),
      CharacterCount,
      InlineAI.configure({
        onTrigger: (task, text) => {
          if (onAITrigger) {
            onAITrigger(task as AITask, text);
          }
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, children }: any) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-purple-500 text-white glow-sm'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="glass border-0 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white/5 border-b border-white/10 p-2 flex items-center gap-1 flex-wrap">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={18} />
        </MenuButton>

        {onAIAssist && (
          <>
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={onAIAssist}
              className="ml-auto"
            >
              <Sparkles size={16} className="mr-1" />
              AI Assist
            </Button>
          </>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="prose prose-invert max-w-none min-h-[400px] p-4 text-white" />

      {/* Footer */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-2 text-sm text-white/60">
        {editor.storage.characterCount.characters()} characters · {editor.storage.characterCount.words()} words
      </div>
    </div>
  );
};
