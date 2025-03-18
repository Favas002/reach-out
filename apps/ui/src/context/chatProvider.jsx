import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [fetchAgain, setfetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    var userinfo = JSON.parse(localStorage.getItem("UserInfo"));
    setUser(userinfo);

    if (!userinfo) navigate("/");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
        fetchAgain,
        setfetchAgain,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
