import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../ui/button";
import { Bold, Italic, List } from "lucide-react";

interface TipTapProps {
  value: string;
  onChange: (value: string) => void;
}
const Tiptap = ({ value, onChange }: TipTapProps) => {
  const editor = useEditor({
    extensions: [StarterKit], // define your extension array
    content: value, // initial content
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;
  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <Button
          type="button"
          size={"sm"}
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size={"sm"}
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size={"sm"}
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size={"sm"}
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose border border-gray-500 p-2 focus:border-none focus:outline-none"
      />
    </div>
  );
};

export default Tiptap;
