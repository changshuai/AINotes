'use client';

import "../components/styles/index.css";
import "../components/styles/tailwind.css";
import "../components/styles/prosemirror.css";
import Menu from "../components/ui/menu";
import "./globals.css";
import Editor from "../components/ui/editor";
import SidePanel from "../components/ui/slidepanel";
import { Menu as MenuIcon, Text, } from "lucide-react";
import { NoteIndexItem } from "../components/ui/slidepanel";
import { Dispatch, FC, SetStateAction,useEffect, useState } from "react";
import { getItemData, setItemData } from "../components/lib/storageHelper"
import { Editor as EditorClass } from "@tiptap/core";
import Link from 'next/link'

// 如何设计这个Data的存储的问题？
// 初步设计，使用 google drive的接口存成文件，第次打开，
// 去读取相应目录下的文件列表？ 文件列表，不能保存相应的 笔记的属性。

// Data structure:
// NoteIndexItem[]-> CONTENTLISTKEY (Panel list): save into the local storage
// NoteIndexItem content -> note key: save the content into local storage.


// What have done:
// Open API fetch.
// 1. translate 2. optimize 3. summerize

// Create new Note
// Delete Note
// 

// TODO
// *. eidt the note title, edit input box should be closed if it lost focus.
// *. sync the content with clound server, 
// *. voice recognize/ response wiht open api
// *. setting the OPENAI key. and other keys...
// *.
// *. last update time
// *. String as prompt. 这个赞。



const CONTENTLISTKEY = "notes_content_list_key"
const DefaultContentList: NoteIndexItem[] = [
  {
    key:"1",
    groupId:"1",
    title: "empty note1",
    type:0,
  },
  {
    key:"2",
    groupId:"2",
    title: "empty note2",
    type:0,
  },
];

const emptyContent = {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":""}]}]};
export default function Page() {

  const [currentKey, setCurrentKey] = useState("1")
  const [defaultValue, setDefaultValue] = useState(emptyContent)
  const [contentList, setcontentList] = useState(DefaultContentList)

  useEffect(() => {
    getNoteList()
  }, []);

  // get panel list for cache first then from cloud.
  const getNoteList = async() => {
    // const localList = window.localStorage.getItem(CONTENTLISTKEY);
    const localList = await getItemData(CONTENTLISTKEY);
    if (!localList) {
      // console.log("getNOteList localList: null")
      return DefaultContentList;
    }
    const notelist = JSON.parse(localList!)
    setcontentList(notelist)
  }
  // getNoteList()

  const onSlideMenuItemSelect =(noteKey: string)=> {
    setCurrentKey(noteKey)
    setDefaultValue(emptyContent)
    getData(noteKey).then( content => {
      if (content == null) {
        // setDefaultValue(emptyContent)
      } else {
        setDefaultValue(content)
      }
    })
  }
  
  const onItemCreated =(item: NoteIndexItem)=> {
    setCurrentKey(item.key)
    setDefaultValue(emptyContent)
    contentList.push(item)
    setItemData(CONTENTLISTKEY, JSON.stringify(contentList))
    // window.localStorage.setItem(CONTENTLISTKEY, JSON.stringify(contentList));
  }

  const onItemEdited =(item: NoteIndexItem)=> {
    setCurrentKey(item.key)
  
    const index = contentList.findIndex((obj => obj.key == item.key));
    contentList[index] = item
    console.log(item)
    console.log(contentList)
    // contentList.push(item)
    setItemData(CONTENTLISTKEY, JSON.stringify(contentList))
    // window.localStorage.setItem(CONTENTLISTKEY, JSON.stringify(contentList));
  }

  const onItemDeleted =(noteKey: string)=> {
    //TO-DO Bug maybe here
    const list = contentList.filter((noteItem: NoteIndexItem) => noteItem.key !== noteKey);
    // console.log(contentList)
    setcontentList(list)

    setItemData(CONTENTLISTKEY, JSON.stringify(contentList))
    // window.localStorage.setItem(CONTENTLISTKEY, JSON.stringify(contentList));
    window.localStorage.removeItem(noteKey)
  }


  // Sync the content, get the latest content from cache first,
  // If empty in cache, then get it from cloud and local.
  const getData = async (noteKey: string) => {
    // const item = window.localStorage.getItem(noteKey)!;
    const item = await getItemData(noteKey)!;

    var noteContent = null
    if (item) {
      noteContent = JSON.parse(item) ;
    }
    // console.log("get content from storage")
    // console.log(noteContent)
    if (noteContent == null) {
      noteContent = emptyContent
    }

    return noteContent
  }

  const updateData = async (editor: EditorClass) => {
    const value = editor.getJSON();
    setItemData(currentKey,JSON.stringify(value))
  }

  return (
    <div >
      <div> 
        <Menu />
      </div>
      
      <div style={{width: '300px', float: 'left'}}> 
        <SidePanel noteItems={contentList} onItemClicked={(noteKey) => onSlideMenuItemSelect(noteKey)}
        onItemCreated={(item) => onItemCreated(item)} 
          onItemDeleted = {(noteKey) => onItemDeleted(noteKey)}
          onItemEdited={(item) => onItemEdited(item)}/>
      </div>
      <div style={styles.rightPanel}>
        <div style={styles.editor}>
          <Editor storageKey={currentKey} defaultValue={defaultValue} disableLocalStorage={true}
          onDebouncedUpdate={(editor)=>{updateData(editor!)}}/>
        </div>
        
      </div>

    </div>
  );
}
const styles = {
  rightPanel: {
    width: '80vw',
    transform: 'translateX(310px)',
  },

  SidePanel: {
    width: '300px',
    float: 'left'
  },

  editor: {
    margin: '0 100px',
  },
};