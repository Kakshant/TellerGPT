import "./Sidebar.css";
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {

    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {

        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            // console.log(res);
            const filterData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filterData);
            setAllThreads(filterData);
        } catch (err) {
            console.error(err);
        }

    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1);
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error(err);
        }

    }

    const deleteThread = async(threadId)=>{
        // setCurrThreadId(threadId);

        try{
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res=response.json();
            console.log(res);

            //Updates threads re-render
            setAllThreads(prev=>prev.filter(thread=>thread.threadId !==threadId));

            if(threadId===currThreadId){
                createNewChat();
            }


        }catch(err){
            console.error(err);
        }
    }

    return (
        <section className="sidebar">
            {/* new chat button  */}
            <button onClick={createNewChat}>
                {/* <img className='logo' src="src/assets/GPT_logo.png" alt="gpt logo" /> */}
                <p>New Chat</p>&nbsp;<i className="fa-solid fa-pen-to-square"></i>
            </button>

            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                                className={thread.threadId===currThreadId? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash-can"
                                onClick={(e)=>{
                                    e.stopPropagation();    //To stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            {/* sign */}
            <div className="sign">
                <p>v1.0.0 • July 2025</p>
            </div>
        </section>
    )
}