import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/chatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p="2"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      bg={useColorModeValue("white", "#242526")}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
