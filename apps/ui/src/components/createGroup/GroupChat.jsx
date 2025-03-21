import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { ChatState } from "../../context/chatProvider";

import SearchList from "../profileView/SearchList";
import SearchLoading from "../miscellaneous/SearchLoading";
import UserBadge from "../profileView/UserBadge";
import axiosInstance from "../../utils/axiosInstance";

const GroupChat = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats, fetchAgain, setfetchAgain } = ChatState();

  //* Handle Search

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      toast({
        title: "Nothing to search!",
        description: "Please provide some data to search",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axiosInstance.get(
        `/api/user?search=${search}`,
        config
      );
      setloading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: "No user found",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setloading(false);
    }
  };

  //*Handle groups
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setSelectedUser([...selectedUser, userToAdd]);
  };

  //* Submit for group creation

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axiosInstance.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setfetchAgain(!fetchAgain);
      setChats(data, ...chats);

      onClose();
      setSelectedUser([]);

      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // delete selected users

  const handleDelete = (delUser) => {
    console.log(delUser);
    setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id));
    console.log(delUser);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder=""
                onChange={(event) => setGroupChatName(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4} mb={4}>
              <FormLabel>Add user</FormLabel>
              <Input
                placeholder="eg: john"
                onChange={(event) => handleSearch(event.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUser.map((user) => {
                return (
                  <UserBadge
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                );
              })}
            </Box>

            {loading ? (
              <SearchLoading />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <SearchList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChat;
