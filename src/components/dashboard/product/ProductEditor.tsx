"use client";

import {
    useEditor,
    EditorContent,
    Editor,
    useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

import {
    BoldIcon,
    CodeIcon,
    HighlighterIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    Quote,
    RedoIcon,
    StrikethroughIcon,
    UnderlineIcon,
    UndoIcon,
    UnlinkIcon,
} from "lucide-react";

import { ReactNode, useState } from "react";
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react/menus";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";


// ================= MAIN EDITOR =================
const ProductEditor = ({
                           content,
                           onChange,
                       }: {
    content?: string;
    onChange?: (content: string) => void;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6], // ✅ FIXED
                },
            }),
            Highlight.configure({ multicolor: true }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none",
            },
        },
        immediatelyRender: false,
    });

    if (!editor) return null;

    return (
        <div className="border rounded-lg">
            <ToolBar editor={editor} />
            {/*<FloatingMenu editor={editor} />*/}

            <EditorContent
                editor={editor}
                className="min-h-[300px] px-4 py-3"
            />
        </div>
    );
};

export default ProductEditor;


// ================= LINK =================
function LinkComponent({editor, children,}: { editor: Editor; children: ReactNode; }) {
    const [linkUrl, setLinkUrl] = useState("");
    const [open, setOpen] = useState(false);

    const handleSetLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setOpen(false);
        setLinkUrl("");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className="w-80 p-4">
                <div className="flex flex-col gap-3">
                    <Input
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                    />
                    <Button onClick={handleSetLink}>Save</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}


// ================= TOOLBAR =================
const ToolBar = ({ editor }: { editor: Editor }) => {
    const state = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor.isActive("bold"),
            isItalic: ctx.editor.isActive("italic"),
            isUnderline: ctx.editor.isActive("underline"),
            isStrike: ctx.editor.isActive("strike"),
            isCode: ctx.editor.isActive("code"),
            isHighlight: ctx.editor.isActive("highlight"),
            isBullet: ctx.editor.isActive("bulletList"),
            isOrdered: ctx.editor.isActive("orderedList"),
            isQuote: ctx.editor.isActive("blockquote"),
            isLink: ctx.editor.isActive("link"),

            // FULL HEADING FIX
            isH1: ctx.editor.isActive("heading", { level: 1 }),
            isH2: ctx.editor.isActive("heading", { level: 2 }),
            isH3: ctx.editor.isActive("heading", { level: 3 }),
            isH4: ctx.editor.isActive("heading", { level: 4 }),
            isH5: ctx.editor.isActive("heading", { level: 5 }),
            isH6: ctx.editor.isActive("heading", { level: 6 }),

            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
        }),
    });

    const getHeading = () => {
        if (state.isH1) return "h1";
        if (state.isH2) return "h2";
        if (state.isH3) return "h3";
        if (state.isH4) return "h4";
        if (state.isH5) return "h5";
        if (state.isH6) return "h6";
        return "p";
    };

    const handleHeading = (val: string) => {
        if (val === "p") {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = Number(val.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6;
            editor.chain().focus().setHeading({ level }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 border-b p-2">

            {/* FIXED HEADING */}
            <Select value={getHeading()} onValueChange={handleHeading}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="h4">Heading 4</SelectItem>
                    <SelectItem value="h5">Heading 5</SelectItem>
                    <SelectItem value="h6">Heading 6</SelectItem>
                </SelectContent>
            </Select>

            <Toggle pressed={state.isBold} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                <BoldIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isItalic} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                <ItalicIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isUnderline} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isStrike} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                <StrikethroughIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isHighlight} onPressedChange={() => editor.chain().focus().toggleHighlight().run()}>
                <HighlighterIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isCode} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
                <CodeIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isBullet} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                <ListIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isOrdered} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrderedIcon className="h-4 w-4" />
            </Toggle>

            <Toggle pressed={state.isQuote} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
            </Toggle>

            {/* LINK */}
            {state.isLink ? (
                <Toggle pressed onPressedChange={() => editor.chain().focus().unsetLink().run()}>
                    <UnlinkIcon className="h-4 w-4" />
                </Toggle>
            ) : (
                <LinkComponent editor={editor}>
                    <Toggle>
                        <LinkIcon className="h-4 w-4" />
                    </Toggle>
                </LinkComponent>
            )}

            <Button onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo}>
                <UndoIcon className="h-4 w-4" />
            </Button>

            <Button onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo}>
                <RedoIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};


// // ================= FLOATING MENU =================
// function FloatingMenu({ editor }: { editor: Editor }) {
//     return (
//         <TiptapFloatingMenu editor={editor} className="bg-white border p-1 flex gap-1">
//             <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
//                 H1
//             </Button>
//             <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
//                 List
//             </Button>
//         </TiptapFloatingMenu>
//     );
// }