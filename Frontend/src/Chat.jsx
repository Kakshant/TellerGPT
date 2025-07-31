import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from 'react-markdown';
import rehypeHighLight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";

//react-markdown
//rehype-highlight

export default function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {

        if (reply === null) {
            setLatestReply(null);       //When loading prev chat
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" ");    //individual word

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    return (
        <>
            {newChat && <h1>Ready when you are.</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user" ?
                                    <p className="userMessage">{chat.content}</p> :
                                    <ReactMarkdown rehypePlugins={[rehypeHighLight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }
                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    //When printing last reply of previous chat
                                    <div className="gptDiv" key={"non-typing"}>     
                                        <ReactMarkdown rehypePlugins={[rehypeHighLight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighLight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }
                {/* {
                    prevChats.length > 0 && latestReply !==null && 
                    <div className="gptDiv" key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighLight]}>{latestReply}</ReactMarkdown>
                    </div>
                } */}
            </div>
        </>
    )
}
