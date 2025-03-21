import { EditIcon, Icon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import GroupMembersView from "../profileView/GroupMembersView";
import SearchList from "../profileView/SearchList";
import axiosInstance from "../../utils/axiosInstance";

const UpdatedGroupChatModel = ({ fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, setfetchAgain, fetchAgain } =
    ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [enableEdit, setenableEdit] = useState(false);
  const toast = useToast();
  //* Rename Group
  const HandleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axiosInstance.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  //*Search User to add
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
  //*Add the search user
  const AddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User alredy in the group!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user.data._id) {
      toast({
        title: "Only admin can add someOne!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axiosInstance.put(
        "api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setloading(false);
    } catch (err) {
      toast({
        title: "Cannot add user!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  //*remove user from group
  const handleRemove = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== user.data._id &&
      user1._id !== user.data._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axiosInstance.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user.data._id ? setSelectedChat() : setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      fetchMessages();
      setloading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton
        d={{ base: "flex" }}
        icon={<SettingsIcon color="#e14d2a" />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="25px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {selectedChat.chatName}

            <Icon
              as={EditIcon}
              margin={4}
              w={5}
              h={5}
              color="#e14d2a"
              cursor="pointer"
              onClick={() => setenableEdit(!enableEdit)}
            ></Icon>
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="18px">Members</Text>
            <Box
              overflowY="auto"
              h="200px"
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
            >
              {selectedChat.users.map((user) => {
                return (
                  <GroupMembersView
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemove(user)}
                  />
                );
              })}
            </Box>
            {enableEdit === true && (
              <>
                <Box display="flex" margin="5">
                  <FormControl display="flex">
                    <Input
                      outline="1px solid #e14d2a"
                      placeholder={selectedChat.chatName}
                      onChange={(event) => setGroupChatName(event.target.value)}
                    />
                    <Button
                      isLoading={renameloading}
                      variant="solid"
                      backgroundColor="#e14d2a"
                      marginLeft={2}
                      color="#fff"
                      onClick={HandleRename}
                    >
                      Update
                    </Button>
                  </FormControl>
                </Box>
                {selectedChat.groupAdmin._id === user.data._id && (
                  <FormControl margin="5">
                    <FormLabel>Add user</FormLabel>
                    <Input
                      outline="1px solid #e14d2a"
                      placeholder="Search by name or email"
                      onChange={(event) => handleSearch(event.target.value)}
                      w="xs"
                    />
                  </FormControl>
                )}

                <Box>
                  {loading ? (
                    <Spinner size="xl" />
                  ) : (
                    searchResult
                      ?.slice(0, 4)
                      .map((user) => (
                        <SearchList
                          key={user._id}
                          user={user}
                          handleFunction={() => AddUser(user)}
                        />
                      ))
                  )}
                </Box>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemove(user.data)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedGroupChatModel;
