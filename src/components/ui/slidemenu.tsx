"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover";

import { FC, useState, useEffect,useRef } from "react";

import { Menu as MenuIcon, DeleteIcon, Moon, SunDim, DotIcon } from "lucide-react";


const appearances = [
  {
    theme: "Delete",
    icon: <DeleteIcon className="h-4 w-4" />,
  },
  {
    theme: "Rename",
    icon: <SunDim className="h-4 w-4" />,
  },
  {
    theme: "Favorate",
    icon: <Moon className="h-4 w-4" />,
  },
];

  export const SlideMenu: FC<{noteKey: string, onItemDeleted(noteKey: string): void, 
    onItemEdit(noteKey: string): void}> = ({
    noteKey,
    onItemDeleted,
    onItemEdit
  }) => {
  return (
    <Popover>
      <PopoverTrigger className="float-right z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-stone-100 active:bg-stone-200 sm:bottom-auto sm:top-5">
        <MenuIcon className="text-stone-600" width={16} />
      </PopoverTrigger>
      <PopoverContent className="w-52 divide-y divide-stone-200" align="end">

        <div className="p-2">
          <p className="p-2 text-xs font-medium text-stone-500">Options</p>
          {appearances.map(({ theme, icon }) => (
            <button
              key={theme}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                if(theme == 'Delete'){
                  onItemDeleted(noteKey)
                } else if(theme == 'Rename'){
                  onItemEdit(noteKey)
                }

              }}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  {icon}
                </div>
                <span>{theme}</span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}