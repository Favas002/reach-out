import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ChatState } from "../../context/chatProvider";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  getSender,
  getSenderFull,
  getSenderImage,
} from "../../config/ChatLogics";
import ProfileSection from "../profileView/ProfileSection";
import UpdatedGroupChatModel from "../updateGroup/UpdatedGroupChatModel";

import ScrollableChat from "../scrollableChats/ScrollableChat";
import io from "socket.io-client";
import EmojiePicker from "../miscellaneous/EmojiePicker";
import NoSelectedChat from "../miscellaneous/NoSelectedChat";
import PaperClip from "../miscellaneous/PaperClip";
import axiosInstance from "../../utils/axiosInstance";

// eslint-disable-next-line no-undef
const ENDPOINT = import.meta.env.VITE_PUBLIC_BASE_URL;
var socket, selectedChatCompare;

const SingleChat = () => {
  const [typing, settyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setsocketConnected] = useState(false);
  const { colorMode } = useColorMode();
  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newImage, setNewimage] = useState();

  const {
    user,
    selectedChat,
    setSelectedChat,
    setNotification,
    notification,
    setfetchAgain,
    fetchAgain,
  } = ChatState();
  const [newMessage, setnewMessage] = useState([]);

  const toast = useToast();

  // *dark theme component theme changer
  const color = useColorModeValue("black", "white");
  const bg = useColorModeValue("white", "#212124");

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.data);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      setloading(true);

      const { data } = await axiosInstance.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setloading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage || newImage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };
        setnewMessage("");
        const { data } = await axiosInstance.post(
          "/api/message",
          {
            image: newImage,
            text: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setNewimage("");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (event) => {
    setnewMessage(event.target.value);

    if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDir="row"
            >
              <Button
                w="50px"
                variant="ghost"
                onClick={() => setSelectedChat("")}
              >
                <ArrowBackIcon
                  display={{ base: "flex", md: "none" }}
                  color="#e14d2a"
                />
                <Avatar
                  border="1px solid #e14d2a"
                  color={color}
                  src={
                    !selectedChat.isGroupChat &&
                    getSenderImage(user.data, selectedChat.users)
                  }
                  name={
                    !selectedChat.isGroupChat
                      ? getSender(user.data, selectedChat.users)
                      : selectedChat.chatName
                  }
                />
              </Button>
            </Box>

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user.data, selectedChat.users)}
                <ProfileSection
                  user={getSenderFull(user.data, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdatedGroupChatModel fetchMessages={fetchMessages} />
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            width="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
            bg={bg}
            backgroundImage="url(https://www.transparenttextures.com/patterns/skulls.png)"
            boxShadow={
              colorMode === "light" &&
              "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;"
            }
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" />
            ) : (
              <Box display="flex" flexDir="column" overflow="inherit">
                <ScrollableChat messages={messages} isTyping={isTyping} />
              </Box>
            )}

            <FormControl
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              id="first-name"
              isRequired
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <EmojiePicker
                  setnewMessage={setnewMessage}
                  newMessage={newMessage}
                />
                <PaperClip
                  setnewMessage={setnewMessage}
                  setNewimage={setNewimage}
                  sendMessage={sendMessage}
                />

                <Input
                  variant="outlined"
                  outlineColor="#e14d2a"
                  placeholder="Enter a message.."
                  onChange={typingHandler}
                  size="lg"
                  borderRadius="10px"
                  errorBorderColor="#e14d2a"
                  value={newMessage}
                />
                <IconButton
                  varient="solid"
                  border="2px solid #e14d2a"
                  borderRadius="10px"
                  padding="10px"
                  onClick={sendMessage}
                  size="lg"
                  m={2}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    size="lg"
                    color="#e14d2a"
                  />
                </IconButton>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <NoSelectedChat />
      )}
    </>
  );
};

export default SingleChat;
