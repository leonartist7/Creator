import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
// import Underline from '@tiptap/extension-underline'; // Disabled due to module conflict
// import TextAlign from '@tiptap/extension-text-align'; // Disabled due to module conflict
import Code from '@tiptap/extension-code';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough as StrikethroughIcon,
  List, ListOrdered, Heading1, Heading2, Heading, Quote,
  Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Sparkles, Code as CodeIcon, RemoveFormatting
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
      // Underline, // Disabled due to module conflict
      Code,
      // TextAlign.configure({ // Disabled due to module conflict
      //   types: ['heading', 'paragraph'],
      // }),
      Placeholder.configure({
        placeholder: 'Start writing your masterpiece...',
      }),
      CharacterCount,
      // InlineAI.configure({ // Disabled due to module conflict
      //   onTrigger: (task, text) => {
      //     if (onAITrigger) {
      //       onAITrigger(task as AITask, text);
      //     }
      //   },
      // }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, children, title }: any) => (
    <button
      onClick={onClick}
      title={title}
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

  // Calculate reading time (average 200 words per minute)
  const wordsCount = editor.storage.characterCount.words();
  const readingTime = Math.ceil(wordsCount / 200);

  return (
    <div className="glass border-0 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white/5 border-b border-white/10 p-2 flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </MenuButton>

        {/* <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={18} />
        </MenuButton> */}

        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <StrikethroughIcon size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >
          <CodeIcon size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* Headings */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* Lists & Quote */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={18} />
        </MenuButton>

        {/* Text Alignment - Disabled due to module conflict
        <div className="w-px h-6 bg-white/20 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />
        */}

        {/* Clear Formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <RemoveFormatting size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* Undo/Redo */}
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        >
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
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-6 text-white"
      />

      {/* Enhanced Footer with Stats */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-white/60">
          <div className="flex items-center gap-4">
            <span>{editor.storage.characterCount.words().toLocaleString()} words</span>
            <span className="text-white/40">•</span>
            <span>{editor.storage.characterCount.characters().toLocaleString()} characters</span>
            <span className="text-white/40">•</span>
            <span>~{readingTime} min read</span>
          </div>
          <div className="text-xs text-white/40">
            Use Ctrl+B/I/U for formatting
          </div>
        </div>
      </div>
    </div>
  );
};
