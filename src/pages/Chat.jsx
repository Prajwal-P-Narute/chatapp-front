import React, { useEffect, useRef, useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { IoChatbox, IoDocumentAttach } from "react-icons/io5";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import {baseURL} from "../config/AxiosHelper"
import { Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/timeHelper";


const Chat = () => {

    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext()
    // console.log(roomId)
    // console.log(currentUser)
    // console.log(connected)

    const navigate = useNavigate();
    useEffect(()=>{     
        if(!connected){
            navigate('/')   
        }
        
    }, [connected, roomId, currentUser])
  const [messages, setMessages] = useState([
    
  ]);
  const [input, setInput] = useState("");
  const inpRef = useRef(null);
  const chatRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(()=>{
    async function loadMessages(){
        try {
            if(roomId){
                const messages = await getMessages(roomId)
                console.log(messages)
                setMessages(messages)
            }
            
            
        } catch (error) {
            
        }
    }
    if(connected){
        loadMessages(); 
    }
    
  }, [roomId])


  // Automatically scroll down when new message sends

  useEffect(()=>{

    if(chatRef.current){
        chatRef.current.scroll(
            {
                top: chatRef.current.scrollHeight,
                behaviour:"smooth"
            }
        )
    }
  }, [messages])

  useEffect(()=>{

    
    const connectWebSocket = (roomId, setStompClient, setMessages) => {
        // Create SockJS connection
        const socket = new SockJS(`${baseURL}/chat`);
    
        // Create Stomp Client
        const client = new Client({
            webSocketFactory: () => socket, // Use SockJS as WebSocket
            reconnectDelay: 5000, // Auto-reconnect after 5 seconds
            debug: (str) => console.log(str), // Debugging
        });
    
        client.onConnect = () => {
            setStompClient(client);
           
    
            // Subscribe to messages
            client.subscribe(`/topic/room/${roomId}`, (message) => {
                console.log("Received message:", JSON.parse(message.body));
                setMessages((prev) => [...prev, JSON.parse(message.body)]);
            });
        };
    
        client.onStompError = (frame) => {
            console.error("STOMP Error:", frame);
        };
    
        client.activate(); // Start WebSocket connection
    };
    if(roomId){
        connectWebSocket(roomId, setStompClient, setMessages)
    }
  }, [roomId])
  

  // to send message
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
        console.log("Sending message:", input);

        const message = {
            sender: currentUser,
            content: input,
            roomId: roomId,
        };

        stompClient.publish({
            destination: `/app/sendMessage/${roomId}`,
            body: JSON.stringify(message),
        });

        setInput(""); // Clear input after sending
    } else {
        console.log("Message not sent");
    }
};


function handleLogout(){
    if (stompClient) {
        stompClient.deactivate()
    }
    setConnected(false)
    setRoomId("")
    setCurrentUser("")
    localStorage.clear(); // ⬅️ Clear persisted state
    navigate("/")
    toast.success("Disconnected from the chat")
}
  return (
    <div>
      {/* This is a Header */}
      <header className="dark:border-gray-700 h-18 fixed w-full dark:bg-gray-900 border py-5 shadow flex justify-around items-center">
        <div>
          <h1 className="text-xl font-semibold">
            Room: <span>{roomId}</span>
          </h1>
        </div>

        <div>
          <h1 className="text-xl font-semibold">
            User: <span>{currentUser}</span>
          </h1>
        </div>

        <div>
          <button onClick={handleLogout} className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full">
            Leave Room
          </button>
        </div>
      </header>
       

       {/* This show Message box */}
       <main ref={chatRef} className="py-20 px-10 w-2/3 dark:bg-red-200 mx-auto h-screen overflow-auto">
  {messages.map((message, index) => (
    <div
      key={index}
      className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`my-2 p-3 border border-gray-500 rounded-3xl shadow-md max-w-[50%] break-words ${
          message.sender === currentUser ? "bg-orange-300" : "bg-slate-300"
        }`}
      >
        <div className="flex flex-row gap-2 items-start">
          <img
            className="h-10 w-10 rounded-full"
            src={"https://avatar.iran.liara.run/public/48"}
            alt="User Avatar"
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-purple-600">{message.sender}</p>
            <p className="text-zinc-950">{message.messageContent}</p>
            <p className="text-[10px] text-slate-500">{timeAgo(message.time)}</p>
          </div>
        </div>
      </div>
    </div>
  ))}
</main>

      <div className="fixed bottom-4 w-full h-16">
        <div className="h-full pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
          <input
            value={input}   
            onChange={(e)=>{setInput(e.target.value)}}
            onKeyDown={(e)=>{
                if(e.key === "Enter"){
                    sendMessage()
                }
            }}
            type="text"
            placeholder="Type a messsege here"
            className="dark:border-gray-700 dark:bg-gray-900 px-6 py-2 rounded-full h-full w-full focus:outline-none"
          />

          <div className="flex gap-1">
            <button className="dark:bg-blue-400 h-12 w-16 flex justify-center items-center rounded-full">
              <IoDocumentAttach size={24} />
            </button>

            <button onClick={sendMessage} className="dark:bg-green-400 h-12 w-16 flex justify-center items-center rounded-full">
              <LuSendHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
