import './App.css'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import Chat from './Chat'
import { MyContext } from './MyContext'
import { useState } from 'react'
import {v1 as uuidv1} from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply]=useState(null);   // prompt is an empty string as we know it will be a string always but not setting reply an empty string because reply might be an object
  const [currThreadId, setCurrThreadId]=useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);   //To store all chats of current thread
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads]=useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App
