import { Avatar, Box, Image, Text, Tooltip } from "@chakra-ui/react";
import Lottie from "react-lottie";
import animationData from "../../animation/typing.json";

import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../context/chatProvider";

const ScrollableChat = ({ messages, isTyping }) => {
  //*Lottie animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((message, index) => (
          <Box display="flex" key={message._id}>
            {(isSameSender(messages, message, index, user.data._id) ||
              isLastMessage(messages, index, user.data._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              </Tooltip>
            )}
            <Box
              bg={message.sender._id === user.data._id ? "#A3FEF8" : "#F2D388"}
              color="black"
              borderRadius="10px"
              padding="5px 10px"
              marginLeft={isSameSenderMargin(
                messages,
                message,
                index,
                user.data._id
              )}
              marginTop={
                isSameUser(messages, message, index, user.data._id) ? 2 : 5
              }
            >
              {message.content[1] && (
                <Image
                  src={message.content[1]}
                  width={{ base: "150px", xl: "200px" }}
                  borderRadius="10px"
                />
              )}
              <Text fontSize="20px">{message.content[0]}</Text>
            </Box>
          </Box>
        ))}
      {isTyping ? (
        <div>
          <Lottie
            options={defaultOptions}
            width={50}
            style={{ marginLeft: "20px" }}
          />
        </div>
      ) : (
        <></>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
