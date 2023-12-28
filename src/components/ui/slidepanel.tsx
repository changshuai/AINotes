"use client";

import React from 'react';
import { FC, useState, useEffect,useRef } from "react";
import { Check, Menu as MenuIcon, Monitor, Moon, Text, PlusIcon,SendIcon } from "lucide-react";
import styled from 'styled-components';
import {SlideMenu }from './slidemenu';
import { books } from 'googleapis/build/src/apis/books';
import Link from 'next/link'

export interface NoteIndexItem {
  title: string
  key: string
  groupId: string
  type: number
}

export interface NoteIndexItemCommand {
  commandName: string
  commandType: number
}

const SidePanel: FC<{ noteItems: NoteIndexItem[], onItemClicked(noteKey: string): void,
   onItemCreated(item: NoteIndexItem): void 
   onItemDeleted(noteKey: string): void
   onItemEdited(item: NoteIndexItem): void
  }> =
 ({noteItems, onItemClicked, onItemCreated, onItemDeleted, onItemEdited}) => {
  const [curNoteId, setCurNoteId] = useState("")
  const [hoverId, setHoverId] = useState("")
  const [addingNew, setAddingNew] = useState(false)
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false)
  const [editNoteId, setEditNoteId] = useState("")

  const handleClick = (noteKey: string) => {
    setCurNoteId(noteKey)
    onItemClicked(noteKey)
  }

  const handleInputChange = event => {
    setMessage(event.target.value);
  };

  const createNewNote = () => {
    setMessage('')
    setAddingNew(true)
  }

  const onCreateNewSubmit = () => {
    // create the note item
    var item = {
      key: generateRandomFileName(),
      groupId:"1",
      title: message,
      type:0,
    }

    onItemCreated(item)
    setAddingNew(false)
  }

  const handleDeleteNote = (noteKey: string) => {
    setHoverId("-1")
    onItemDeleted(noteKey)
  }
  
  const eidtNoteFromMenu = (noteKey: string) => {
    const noteItem = noteItems.find((element) => element.key == noteKey);
    if (noteItem) {
      setMessage(noteItem?.title!)
      setEditNoteId(noteKey)
      setEditMode(true)
    }
  }

  const handleEditNote = (noteKey: string) => {
    var item = {
      key: noteKey,
      groupId:"1",
      title: message,
      type:0,
    }

    onItemEdited(item)
    setEditMode(false)
  }

  function generateRandomFileName(): string {
    const currentDate: Date = new Date();
    
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
    const day: number = currentDate.getDate();
    const hours: number = currentDate.getHours();
    const minutes: number = currentDate.getMinutes();
    const seconds: number = currentDate.getSeconds();
  
    const randomSuffix: string = Math.random().toString(36).substring(7); // 生成一个随机字符串
  
    const fileName: string = `${year}${month}${day}_${hours}${minutes}${seconds}_${randomSuffix}`;
    return fileName;
  }
  
  return (
    <div style={styles.sidebar}>
      <div style={styles.menuItem}>
        <span style={styles.text}>AI Notes</span>
        <div style={styles.addButton}> 
        <button
              className="flex w-full items-center justify-between rounded px-2 py-2 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                createNewNote()
              }}
            >
            <div className="rounded-sm border p-1 ">
              <PlusIcon className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>

      {noteItems.map(({ key, title }) => (
        <div key={key}>
        <div style={{display : !editMode || editNoteId != key? "block" : "none" }} className={curNoteId == key?'bg-neutral-50 rounded':'bg-inherit'}>
            <button
              key={title}
              className="flex w-full items-center justify-between rounded px-2 py-2 text-sm text-stone-600 hover:bg-stone-100"
              onMouseOver={() => {
                setHoverId(key)
              }}
              onMouseOut={() => {
                setHoverId("-1")
              }}
              onClick={() => {
                handleClick(key)
              }}
            >
            {/* normal mode */}
            <div className="flex items-center w-full">
              <div className="rounded-sm border p-1 ">
                <Text className="h-4 w-4"/>
              </div>
              <div className={curNoteId == key?'text-black':'text-inherit'}>
                <span className='px-2'>{title}</span>
              </div>
            </div>

            <div className='float-right'>
                {hoverId === key && !editMode && <SlideMenu noteKey={key} onItemDeleted={(noteKey) => {
                  handleDeleteNote(key) } } onItemEdit={ (noteKey) => {
                    eidtNoteFromMenu(key) } }/>}
            </div>

            </button>
          </div>
          
            {/* eidt mode */}
            <div style={{display : editMode && editNoteId == key? "block" : "none" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditNote(key)
              }}
              className="flex w-full overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
              >
              <input
                // ref={inputRef}
                value={message}
                type="text"
                placeholder="input prompt"
                className="flex-1 bg-white p-1 text-sm outline-none"
                onChange={handleInputChange}
                />
            </form>
            </div>

          </div>
      ))}
      <div style={{display : addingNew? "block" : "none" }}>
        <form
            onSubmit={(e) => {
              e.preventDefault();
              // handleSubmit
              onCreateNewSubmit()
            }}
            className="flex w-full overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
          >
            <input
              // ref={inputRef}
              value={message}
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
        </div>
        {/* <div style={{display : !addingNew? "block" : "none" }}>
          <button
              className="flex w-full items-center justify-between rounded px-2 py-2 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                createNewNote()
              }}
            >
              <div className="flex items-center rounded-sm border p-1 ">
                <div className="rounded-sm border p-1 ">
                  <PlusIcon className="h-4 w-4" />
                </div>
                  <span className='px-2 '>Add a note</span>
              </div>
          </button>
          </div> */}
          <div className="text-blue-500 hover:text-blue-800 mt-8"><Link href="/settings">OpenAPI Setting</Link></div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '300px',
    height: '100%',
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    position:'fixed',
  },
  menuItem: {
    alignItems: 'center',
    marginBottom: '15px',
    cursor: 'pointer',
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  text: {
    fontSize: '16px',
  },
  addButton: {
    float: 'right'
  }
};

export default SidePanel;
