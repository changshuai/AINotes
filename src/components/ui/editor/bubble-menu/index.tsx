import { BubbleMenu, BubbleMenuProps, isNodeSelection } from "@tiptap/react";
import { FC, useState, useRef, useEffect } from "react";
import va from "@vercel/analytics";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";
import { NodeSelector } from "./node-selector";
import { ColorSelector } from "./color-selector";
import { LinkSelector } from "./link-selector";
import { AICommandPannel } from "../bubble-menu-ai/ai-command-pannel";

import { cn } from "../../../lib/utils";
import { hideAll } from "tippy.js";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const myRef = useRef<HTMLElement>(null);
  // const buttonRef = useRef<HTMLButtonElement>(null);

  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => props.editor!.isActive("bold"),
      command: () => props.editor!.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => props.editor!.isActive("italic"),
      command: () => props.editor!.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => props.editor!.isActive("underline"),
      command: () => props.editor!.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => props.editor!.isActive("strike"),
      command: () => props.editor!.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: () => props.editor!.isActive("code"),
      command: () => props.editor!.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];


  // const [menuStatus, setMenuStatus] = useState<MenuStatus>(MenuStatus.Hide);
  // console.log("menuStatus is: " + menuStatus)
  const openRef = useRef<boolean>();
  openRef.current = props.isOpen
  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ state, editor }) => {
      const { selection } = state;
      const { empty } = selection;
      // console.log("EditorBubbleMenu shouldShow? : " + openRef.current)
      if (editor.isActive("image") || empty || isNodeSelection(selection) || !openRef.current) {
        return false;
      }
      return true;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsNodeSelectorOpen(false);
        setIsColorSelectorOpen(false);
        setIsLinkSelectorOpen(false);
      },
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  

  const showOpenAIPannel = () => {
    if(props.showAIMenu) {
      props.showAIMenu(true)
    }
    // setMenuStatus(MenuStatus.AIShow)
  }

  return (  

     <BubbleMenu 
      {...bubbleMenuProps}
      className="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
    >
      <div className="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl">
        <button
          key="aiopen"
          onClick={
            showOpenAIPannel
          }
          className="p-2"
        >
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
            <span>AI</span>
          </div>
        </button>
        
        <NodeSelector
          editor={props.editor}
          isOpen={isNodeSelectorOpen}
          setIsOpen={() => {
            setIsNodeSelectorOpen(!isNodeSelectorOpen);
            setIsColorSelectorOpen(false);
            setIsLinkSelectorOpen(false);
          }}
        />
        <LinkSelector
          editor={props.editor}
          isOpen={isLinkSelectorOpen}
          setIsOpen={() => {
            setIsLinkSelectorOpen(!isLinkSelectorOpen);
            setIsColorSelectorOpen(false);
            setIsNodeSelectorOpen(false);

          }}
        />
        <div className="flex">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
              type="button"
            >
              <item.icon
                className={cn("h-4 w-4", {
                  "text-blue-500": item.isActive(),
                })}
              />
            </button>
          ))}
        </div>
        <ColorSelector
          editor={props.editor}
          isOpen={isColorSelectorOpen}
          setIsOpen={() => {
            setIsColorSelectorOpen(!isColorSelectorOpen);
            setIsNodeSelectorOpen(false);
            setIsLinkSelectorOpen(false);
          }}
        />
      </div>
    </BubbleMenu>
  );
      
};
