import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface InlineAIOptions {
  onTrigger: (trigger: string, selectedText: string) => void;
}

export const InlineAI = Extension.create<InlineAIOptions>({
  name: 'inlineAI',

  addOptions() {
    return {
      onTrigger: () => {},
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;

    return [
      new Plugin({
        key: new PluginKey('inlineAI'),

        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldState) {
            return oldState.map(tr.mapping, tr.doc);
          },
        },

        props: {
          handleTextInput(view, from, to, text) {
            const { state } = view;
            const { selection } = state;
            const { $from } = selection;

            // Get the text before cursor
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
            const fullText = textBefore + text;

            // Check for triggers
            const triggers = {
              '++': 'expand',
              '>>': 'continue',
              '??': 'improve',
              '//': 'suggest',
              '@@': 'research',
            };

            for (const [trigger, action] of Object.entries(triggers)) {
              if (fullText.endsWith(trigger)) {
                // Get selected text or context
                const selectedText = state.doc.textBetween(
                  Math.max(0, $from.pos - 200),
                  $from.pos,
                  ' '
                );

                // Remove trigger from document
                const tr = state.tr.delete(
                  $from.pos - trigger.length,
                  $from.pos
                );
                view.dispatch(tr);

                // Call the trigger handler
                setTimeout(() => {
                  options.onTrigger(action, selectedText);
                }, 0);

                return true;
              }
            }

            return false;
          },

          decorations(state) {
            const { selection } = state;
            const { $from } = selection;
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);

            const triggers = ['++', '>>', '??', '//', '@@'];
            const decorations: Decoration[] = [];

            triggers.forEach((trigger) => {
              if (textBefore.endsWith(trigger.charAt(0))) {
                const pos = $from.pos - 1;
                const decoration = Decoration.inline(pos, pos + 1, {
                  class: 'ai-trigger-hint',
                  style: 'color: #a855f7; font-weight: 600;',
                });
                decorations.push(decoration);
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
