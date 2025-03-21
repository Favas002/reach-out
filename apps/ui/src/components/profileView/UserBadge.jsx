import { Avatar, Badge, Box, CloseButton, Text } from "@chakra-ui/react";
import React from "react";

const UserBadge = ({ user, handleFunction }) => {
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
      colorScheme="purple"
      cursor="pointer"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
      >
        <Avatar
          src={user.pic}
          size="sm"
          name={user.name}
          border="1px solid black"
          margin={1}
        />

        <Text>{user.name}</Text>
      </Box>

      <Box display="flex" alignItems="center" flexDir="column" gap="2px">
        <CloseButton
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={handleFunction}
        />
      </Box>
    </Badge>
  );
};

export default UserBadge;
