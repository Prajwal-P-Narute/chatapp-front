import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(() => localStorage.getItem("roomId") || "");
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("currentUser") || "");
  const [connected, setConnected] = useState(() => localStorage.getItem("connected") === "true");

  useEffect(() => {
    localStorage.setItem("roomId", roomId);
  }, [roomId]);

   useEffect(() => {
    localStorage.setItem("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("connected", connected);
  }, [connected]);

  return (
    <chatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setRoomId,
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

const useChatContext = () => {
  return useContext(chatContext);
};
export default useChatContext;
