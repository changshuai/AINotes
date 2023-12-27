import { Editor } from "@tiptap/core";
import {
  BoldIcon,
  LanguagesIcon,
  Globe,
  Check,
  ChevronDown,
  SendIcon
} from "lucide-react";

import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { AICommandItem } from "./ai-command-item";

export interface AIMenuItem {
  name: string;
  prompt: string;
  systemPrompt: string;
  icon: typeof SendIcon;
}

interface AICommandProps {
  editor: Editor;
  handleClose: () => void
  handleRespond: () => void
}

export const AICommandPannel: FC<AICommandProps> = ({
  editor,
  handleClose,
  handleRespond,
}) => {
  const [canInsert, setCanInsert] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const items: AIMenuItem[] = [
    {
      name: "To English",
      prompt: "",
      systemPrompt: "You are an a universal translator. " +
        "Please translate the following text into English. " +
        "and make sure to construct complete sentences.",
      icon: LanguagesIcon,
    },
    {
      name: "To 中文",
      prompt: "",
      systemPrompt: "You are an a universal translator. " +
        "Please translate the following text into Chinese. " +
        "and make sure to construct complete sentences.",
      icon: LanguagesIcon,
    },
    {
      name: "Improve Writing",
      prompt: "",
      systemPrompt: "You are an a english teacher. " +
        "Please help me optimize the text so that it has correct grammar and complete sentence ",
      icon: LanguagesIcon,
    },
    {
      name: "Summarize",
      prompt: "",
      systemPrompt: "You are an a universal translator. " +
        "Please translate the following text into English. " +
        "and make sure to construct complete sentences.",
      icon: LanguagesIcon,
    },
  ]
  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  const [isResponding, setIsResponding] = useState(false)

  const responseCallBack = (response: Response) => {
    if (response.status === 429) {
      toast.error("You have reached your request limit for the day.");
      va.track("Rate Limit Reached");
      return;
    }
    // editor?.commands.insertContentAt(editor.state.selection.to + 1, completion);
    editor.commands.deleteRange({from: editor.state.selection.to-"thinking...".length, to: editor.state.selection.to})
    
    setIsResponding(true)
    handleRespond()
  }

  // logical for the Ai respond
  // 1. complete to request the openAI
  // 2. Add the "thinking" in the editor for a new line
  // 3. Remove the "thinking" when return from openAI stream
  // 4. Add the respond text into the new line of editor
  // 5. Popup to request user if insert or discard
  // 6. User decide whether keep the content or not.

  const {
    complete,
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/generate",
    onResponse: responseCallBack,
    onError: (e) => {
      toast.error(e.message);
    },
    onFinish: () => {
      setCanInsert(true)
      // editor?.commands.insertContentAt(editor.state.selection.to + 1, completion);
    }
  });

  const prev = useRef("");
  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    
    editor?.commands.insertContent(diff);
    // console.log("useEffect diff is: " + diff)
    // console.log("useEffect completion is: " + completion)
    // console.log("useEffect selection to is: " + editor.state.selection.to)
    // editor?.commands.deleteRange({from: editor.state.selection.to + 1 - prev.current.length, to: prev.current.length})
    // editor?.commands.insertContentAt(editor.state.selection.to + 1, completion);
    // console.log("useEffect diff is: " + diff)

    prev.current = completion;

  }, [isLoading, editor, completion]);

  const handleAICommand = (index: number, systemPrompt: string) => {
    // console.log("handleAICommand triggered : " + systemPrompt);
    setClickIndex(index)

    const text = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
    if (text == "") {
      return
    }

    const api_key = window.localStorage.getItem("API-Key");
    console.log("XXXXXX AI api key: " + api_key)
    complete(text, {
      headers: { "ai-system-command": systemPrompt ,
      "API-Key": window.localStorage.getItem("API-Key") || ""
      }
    })
    // thinking...
    editor?.commands.insertContentAt(editor.state.selection.to + 1, "thinking...");
    // editor?.commands.insertContentAt(editor.state.selection.to + 1, "AI: ");
  }

  const handleCloseEvent = () => {
    editor.commands.deleteRange({from: editor.state.selection.to-completion.length, to: editor.state.selection.to})
    
    setIsResponding(false)
    handleClose()
  }
  const handleInsertEvent = () => {

    setIsResponding(false)
    handleClose()
  }
  const [clickIndex, setClickIndex] = useState(-1);

  return (
    <div>
      <div style={{ display: !isResponding ? 'block' : 'none' }} className="w-80 flex flex-col divide-y">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit
          }}
          className="flex w-full overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          <input
            ref={inputRef}
            value={input}
            type="text"
            placeholder="input prompt"
            className="flex-1 bg-white p-1 text-sm outline-none"
            onChange={handleInputChange}
          />
          <div>
            <button
              type="submit"
              className="flex items-center rounded-sm p-1 text-blue-600 transition-all hover:bg-blue-100 dark:hover:bg-red-800"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        </form>

        <hr className="my-2 h-0.5" />
        {items.map((item, index) => (
          <div key={index} className="flex items-center flex-row my-2">
            <div className="rounded-sm border border-stone-200 p-1">
              <item.icon className="h-3 w-3" />
            </div>
            <AICommandItem name={item.name} onClick={() => handleAICommand(index,item.systemPrompt)} />
            { clickIndex == index &&
              <svg style={{ display: isLoading ? 'block' : 'none' }} aria-hidden="true" className="inline my-4 w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            }
          </div>

        ))}

      </div>
      <div style={{ display: isResponding ? 'block' : 'none' }} className="border-2">
        <p className="font-semibold">AI Response:</p>
        <article className="prose prose-stone border-2 m-4">
          {completion}
        </article>
        <div className="flex m-2">
          <button disabled={canInsert ? false : true} type="button" className="m-2 border-2 border-sky-500 px-2 py-1" onClick={handleInsertEvent}>
            Insert Blow
          </button>
          <button type="button" className="m-2 border-2 border-sky-500 px-2 py-1" onClick={handleCloseEvent}>
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};
