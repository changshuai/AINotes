import { Editor } from "@tiptap/core";
import { Check, ChevronDown, SendIcon } from "lucide-react";
import { Dispatch, FC, SetStateAction,useEffect, useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";


interface AICommandProps {
  editor: Editor;
  onClickHandler: () => void
}

export const AICommandTranslate: FC<AICommandProps> = ({
  editor,
  onClickHandler
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  const responseCallBack = (response: Response) => {
    if (response.status === 429) {
      toast.error("You have reached your request limit for the day.");
      va.track("Rate Limit Reached");
      return;
    }
  }

  console.log("XXXXX OPEN AI request: " + window.localStorage.getItem("API-Key"))

  // const { complete, completion, isLoading, stop } = useCompletion({
  //     id: "novel",
  //     api: "/api/translate",
  //     onResponse: responseCallBack,
  //     onFinish: (_prompt, completion) => {
  //     },
  //     onError: (e) => {
  //       toast.error(e.message);
  //     },
  //     headers: {"x-ai-command":"translate"}
  //   });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "translate",
    api: "/api/translate",
    onResponse: responseCallBack,
    onError: (e) => {
      toast.error(e.message);
    },
    headers: {
      "ai-system-command":
    "You are an a universal translator. " +
    "Please translate the following text into English. " +
    "and make sure to construct complete sentences.",
    "API-Key": window.localStorage.getItem("API-Key") || "" }
  });

  const prev = useRef("");
    // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
    // editor?.commands.insertContentAt(editor.state.selection.to + 1, diff);
    va.track("translate is triggered2: " + diff);
  }, [isLoading, editor, completion]);

  return (

      <button
        key='translate'
        onClick={() => {
          // request the OpenAi api
          // get the selection.
          const text = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
          va.track("AICommandTranslate: " + text);
          complete(text);
          onClickHandler()
        }}
        className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
        type="button"
        >
        <div className="flex items-center space-x-2">
          <span>Translate</span>
        </div>
      </button>
  );
};
