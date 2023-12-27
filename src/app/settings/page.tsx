'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'

export default function Page() {
  const [openAIKey, setOpenAIKey] = useState(''); 
  const [apiKey, setApiKey] = useState(''); // State to store the API key
  const [inputValue, setInputValue] = useState('');

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // alert("Your key is being uploaded!")
  }, [])

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOpenAIKeySave = () => {
    // Here, you can perform actions to save the API key, like storing it in local storage or sending it to a server
    console.log('API Key Saved:', apiKey);
    setOpenAIKey(inputValue);
    };

  const generateApiKey = () => {
    // 生成新的 API 密钥，可以使用任何适合你的方法
    const newApiKey = generateRandomApiKey();
    
    // 设置生成的 API 密钥
    setApiKey(newApiKey);
  };

  const generateRandomApiKey = () => {
    // 简单地生成一个随机字符串作为 API 密钥
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const apiKeyLength = 32;
    let apiKey = '';
    
    for (let i = 0; i < apiKeyLength; i++) {
      apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return apiKey;
  };

  const handleSave = () => {
    window.localStorage.setItem("API-Key", apiKey)
    sendOpenAIKey()
  }

  const sendOpenAIKey=()=> {
    setLoading(true)
    fetch('/api/savekeys', {
      method: "POST",
      headers: {
        "API-Key": apiKey,
        "OPENKEY": openAIKey
      },
    }).then((data) => {
        setLoading(false)
        setSaveSuccess(true)
        alert("Your key is saved!")
    })
  }
  
  if (isLoading) return <p>Loading...</p>
  // if (!data) return <p>No profile data</p>

  return (
    <div>
      <div class="md:w-2/3 w-full">
        <div class="py-8 px-16">
        {apiKey && (
            <div>
              <p>API Key:</p>
              <code>{apiKey}</code>
            </div>
          )}
          { !apiKey && 
          <button onClick={generateApiKey} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Generate API Key
          </button>
        }
        </div>
        <div class="py-8 px-16">
          <label for="name" class="text-sm text-gray-600">OpenAI KEY：</label>
          <input class="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-100 focus:outline-none focus:border-indigo-500" 
          type="text" name="openAIKey"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter your OpenAI API key"
          />
          {openAIKey && (
            <div>
              <p>Your OpenAI Key:</p>
              <code>{openAIKey}</code>
            </div>
          )}
          { !openAIKey && 
            <button onClick={handleOpenAIKeySave} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Confirm
            </button>
          }

          <div>
            
          { apiKey && openAIKey && !isLoading && !saveSuccess &&
            <button onClick={handleSave} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Save
            </button>
          }

          {/* <Link href="/" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Back</Link> */}
          </div>

        </div>
      </div>
    </div>
  );
}