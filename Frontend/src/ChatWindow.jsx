import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { BeatLoader } from 'react-spinners';
import { v1 as uuidv1 } from 'uuid'
import API_BASE from './api.js';

export default function ChatWindow() {

    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        // console.log("message", prompt, "threadId", currThreadId)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            // const response = await fetch("http://localhost:8080/api/chat", options);
            const response = await fetch(`${API_BASE}/api/chat`, options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    //append old chats in new
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1);
        setPrevChats([]);
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span className="logo2"> <i className="fa-solid fa-comment-dots"></i> TellerGPT</span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown" >
                    {/* New chat button */}
                    <div className="dropDownItem" onClick={createNewChat}>
                        <i className="fa-solid fa-share-nodes"></i> Create New Chat 
                    </div>
                    {/* Upgrade button */}
                    <a href="https://openai.com/chatgpt/pricing/" target="blank">
                        <div className="dropDownItem" onClick={handleProfileClick}>
                            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                        </div>
                    </a>
                    {/* Help button */}
                    <a href="https://help.openai.com/en/collections/3742473-chatgpt" target="blank">
                        <div className="dropDownItem" onClick={handleProfileClick}>
                            <i className="fa-solid fa-life-ring"></i> Help
                        </div>
                    </a>
                </div>
            }

            <Chat></Chat>

            <BeatLoader color="white" loading={loading}></BeatLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input type="text" placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-arrow-up" style={{ color: "black" }}></i></div>
                </div>
                <p className="info">
                    TellerGPT can make mistakes. Check important info.
                </p>
            </div>
        </div>
    )
}