import { Box, Text } from "@chakra-ui/react";
import React from "react";

const NoSelectedChat = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="100%"
      textAlign="center"
      flexDir="column"
    >
      <Text
        padding="15px"
        fontFamily="'Pacifico', cursive;"
        fontSize="30px"
        cursor="default"
      >
        Reach-Out
      </Text>
      <Text fontSize="sm">A chat app created using MERN stack</Text>
    </Box>
  );
};

export default NoSelectedChat;
