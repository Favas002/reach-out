import { Avatar, Box, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const SearchList = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        gap="2"
        onClick={handleFunction}
        cursor="pointer"
        bg={useColorModeValue("lightgray", "#171923")}
        _hover={{
          background: "#38B2AC",

          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box
          display="flex"
          flexDirection="column"
          color={useColorModeValue("black", "white")}
        >
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default SearchList;
