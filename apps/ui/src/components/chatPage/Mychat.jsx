import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import { useToast } from "@chakra-ui/toast";

import { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import SearchLoading from "../miscellaneous/SearchLoading";
import {
  bg,
  getSender,
  getSenderImage,
  timeconvert,
} from "../../config/ChatLogics";
import GroupChat from "../createGroup/GroupChat";
import axiosInstance from "../../utils/axiosInstance";

const Mychat = () => {
  const { colorMode } = useColorMode();
  const [loggedUser, setLoggedUser] = useState("");

  const { selectedChat, setSelectedChat, user, chats, setChats, fetchAgain } =
    ChatState();
  console.log(chats);
  const { token } = user.data;

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosInstance.get("/api/chat", config);
      setChats(data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("UserInfo"));
    const User = user.data;
    setLoggedUser(User);

    fetchChats();

    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "31%" }}
      gap={1}
    >
      <Box
        p={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        boxShadow={"  rgba(0, 0, 0, 0.18) 0px 2px 4px;"}
        bg={useColorModeValue("white", "#212124")}
        borderWidth="1px"
      >
        Chats
        <GroupChat>
          <Button
            color="#e14d2a"
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon color="#e14d2a" />}
          >
            Group
          </Button>
        </GroupChat>
      </Box>
      <Box
        bg={useColorModeValue("white", "#212124")}
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#e14d2a",
            borderRadius: "24px",
          },
        }}
        boxShadow={"  rgba(0, 0, 0, 0.18) 0px 2px 4px;"}
        borderWidth="1px"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box key={chat._id}>
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={bg(chat, selectedChat, colorMode)}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={3}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar
                      border="1px solid #e14d2a"
                      marginRight="15px"
                      src={
                        !chat.isGroupChat &&
                        getSenderImage(loggedUser, chat.users)
                      }
                      name={
                        !chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName
                      }
                    />
                    <Box>
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <>
                          <Text fontSize="xs">
                            <b>{chat.latestMessage.sender.name} : </b>
                            {chat.latestMessage.content[1]
                              ? "image"
                              : chat.latestMessage.content[0]?.length > 50
                                ? chat.latestMessage.content.substring(0, 51) +
                                  "..."
                                : chat.latestMessage.content}
                          </Text>
                        </>
                      )}
                    </Box>
                  </Box>

                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      {timeconvert(chat.latestMessage.createdAt)}
                    </Text>
                  )}
                </Box>
                <Divider borderColor={"lightgray"} />
              </Box>
            ))}
          </Stack>
        ) : (
          <SearchLoading />
        )}
      </Box>
    </Box>
  );
};

export default Mychat;
