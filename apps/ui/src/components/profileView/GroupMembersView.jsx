import {
  Avatar,
  Badge,
  Box,
  Button,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/chatProvider";

const GroupMembersView = ({ user, handleFunction }) => {
  var LoginUser = JSON.parse(localStorage.getItem("UserInfo"));

  const { selectedChat } = ChatState();
  const User = JSON.parse(localStorage.getItem("UserInfo"));

  return (
    <Badge
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="2px 5px 2px 5px"
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      cursor="pointer"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        gap={5}
      >
        <Avatar
          src={user.pic}
          size="md"
          name={user.name}
          border="1px solid black"
          margin={1}
        />

        <Text>{user.name}</Text>
      </Box>

      <Box display="flex" alignItems="center" flexDir="right" gap="2px">
        {selectedChat.groupAdmin._id === user._id && (
          <>
            <Button color="#e14d2a" variant="solid" size="xs" border="1px">
              Admin
            </Button>
          </>
        )}
        {user._id === User.data._id && (
          <Button color="#e14d2a" variant="solid" size="xs" border="1px">
            You
          </Button>
        )}
        {selectedChat.groupAdmin._id === LoginUser.data._id && (
          <CloseButton
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={handleFunction}
          />
        )}
      </Box>
    </Badge>
  );
};

export default GroupMembersView;
