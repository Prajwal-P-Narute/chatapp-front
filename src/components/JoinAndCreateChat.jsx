import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomAPI, joinChatAPI } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const JoinAndCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const {
    roomId,
    userName,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();

  const navigate = useNavigate();

  function handleInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }
  async function joinChat() {
    if (validForm()) {
      try {
        const room = await joinChatAPI(detail.roomId);
        toast.success("joined to the Room");

        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if(error.status == 400){
            toast.error(error.response.data)
        }else{
            toast.error("error in joining room")
        }
        
        console.log(error)
      }
    }
  }

  async function createRoom() {
    if (validForm()) {
      console.log(detail);
      // call api to create room on backend
      try {
        const response = await createRoomAPI(detail.roomId);
        console.log(response);
        toast.success("Room created successfully");
        // if user successfully created the room then join
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        // forwarding to chat page
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room Id already exists");
        } else {
          toast("error in creating Room");
        }
        console.log("error in your recently created room");
      }
    }
  }

  function validForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input");
      return false;
    }
    return true;
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* for name */}
      <div className=" p-10 dark:border-gray-600 border w-full flex flex-col gap-6 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src={chatIcon} className="w-24 mx-auto" />
        </div>
        <h1 className="text-2xl font-semibold text-center">
          Join Room/Create Room
        </h1>
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2 text-center">
            {" "}
            Your Name
          </label>
          <input
            onChange={handleInputChange}
            value={detail.userName}
            name="userName"
            type="text"
            id="name"
            placeholder="Enter the Name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-500 rounded-full focus:ring-2 focus:outline-none "
          />
        </div>

        <div className="">
          <label htmlFor="name" className="block font-medium mb-2 text-center">
            {" "}
            Your Room id
          </label>
          <input
            name="roomId"
            onChange={handleInputChange}
            value={detail.roomId}
            type="text"
            id="name"
            placeholder="Enter the Room Id"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-500 rounded-full focus:outline-none focus:ring-2"
          />
        </div>

        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={joinChat}
            className="px-3 py-2 dark:bg-blue-500 hover:dark-bg-blue-800 rounded-full"
          >
            Join Room
          </button>

          <button
            onClick={createRoom}
            className="px-3 py-2 dark:bg-orange-500 hover:dark-bg-orange-800 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinAndCreateChat;
