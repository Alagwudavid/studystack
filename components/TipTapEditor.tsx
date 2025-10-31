"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Link2,
  Image,
  Video,
  List,
  ListOrdered,
  MoreHorizontal,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Body text (optional)",
  className,
  editable = true
}: TipTapEditorProps) {

  // Console log when props change
  useEffect(() => {
    console.log("=== TipTapEditor Props Update ===");
    console.log("Received content:", content);
    console.log("Placeholder:", placeholder);
    console.log("Editable:", editable);
    console.log("ClassName:", className);
    console.log("================================");
  }, [content, placeholder, editable, className]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();

      console.log("=== TipTapEditor Content Update ===");
      console.log("HTML content:", htmlContent);
      console.log("Text content:", textContent);
      console.log("Content length:", textContent.length);
      console.log("Is empty:", editor.isEmpty);
      console.log("==================================");

      onChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none',
          'min-h-[120px] p-4 text-sm',
          'placeholder:text-muted-foreground/60',
          className
        ),
      },
    },
  });

  // Console log when editor is created/updated
  useEffect(() => {
    if (editor) {
      console.log("=== TipTapEditor Instance Ready ===");
      console.log("Editor HTML:", editor.getHTML());
      console.log("Editor Text:", editor.getText());
      console.log("Editor isEmpty:", editor.isEmpty);
      console.log("Editor isEditable:", editor.isEditable);
      console.log("==================================");
    }
  }, [editor]);

  if (!editor) {
    console.log("TipTapEditor: Editor not ready yet");
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className={cn(
        "h-8 w-8 p-0 hover:bg-muted/50",
        isActive && "bg-muted text-foreground"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn(
      "w-full rounded-xl bg-transparent focus-within:ring-1 focus-within:ring-ring",
      className?.includes('border-0') ? '' : 'border border-input'
    )}>
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[120px]"
        />

        {/* <div className="flex items-center justify-between p-2 border-t bg-muted/30">
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading')}
              title="Heading"
            >
              <Type className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            <ToolbarButton
              onClick={() => {}}
              isActive={false}
              title="Link"
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {}}
              isActive={false}
              title="Image"
            >
              <Image className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {}}
              isActive={false}
              title="Video"
            >
              <Video className="h-4 w-4" />
            </ToolbarButton>


            <ToolbarButton
              onClick={() => {}}
              isActive={false}
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="text-xs text-muted-foreground">
            Switch to Markdown Editor
          </div>
        </div> */}
      </div>
    </div>
  );
}