import { BubbleMenu, BubbleMenuProps, isNodeSelection } from "@tiptap/react";
import { FC, useState, useRef, useEffect } from "react";


import { AICommandPannel } from "./ai-command-pannel";

import { cn } from "../../../lib/utils";
import { hideAll } from "tippy.js";


type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

enum MenuStatus {
  Hide,
  NormalShow,
  AIShow,
  AIResponding
}

let menuStatus = MenuStatus.Hide;

export const EditorBubbleMenuAI: FC<EditorBubbleMenuProps> = (props) => {
  const myRef = useRef<HTMLElement>(null);
  // const buttonRef = useRef<HTMLButtonElement>(null);
  // const [menuStatus, setMenuStatus] = useState<MenuStatus>(MenuStatus.Hide);
  // console.log("menuStatus is: " + menuStatus)

  const openRef = useRef<MenuStatus>();
  
  openRef.current = menuStatus;

  const openMenuRef = useRef<boolean>();
  openMenuRef.current = props.isOpen
  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ state, editor }) => {
      const { selection } = state;
      const { empty } = selection;
      // console.log("EditorBubbleMenuAI shouldShow? : " + openMenuRef.current)
      if (menuStatus == MenuStatus.AIResponding) return true;

      if (editor.isActive("image") || empty || isNodeSelection(selection) || !openMenuRef.current) {
        return false;
      }
      return true;
    },
  };


  useEffect(() => {
    if (props.editor?.isActive("image") || props.editor?.state.selection.empty || isNodeSelection(props.editor?.state.selection)) {
      if(menuStatus != MenuStatus.AIResponding){
        // console.log("useEffect set hide: " + menuStatus)
        hideOpenAIPannel()
      } 
      // console.log("useEffect set: " + menuStatus)
    }
  }, [props.editor?.state]);

  const hideOpenAIPannel = () => {
    // console.log("hideOpenAIPannel: " + openRef.current)
    // setMenuStatus(MenuStatus.Hide)
    menuStatus = MenuStatus.Hide
    if(props.showAIMenu) {
      props.showAIMenu(false)
    }
  }
  const handleRespond = () => {
    menuStatus = MenuStatus.AIResponding
  }

  return (  
     <BubbleMenu 
      {...bubbleMenuProps}
      className="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
    >
      <div className="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl">
        <AICommandPannel editor={props.editor!} handleClose={hideOpenAIPannel} handleRespond={handleRespond}/>
      </div>
    </BubbleMenu>
  );
      
};
