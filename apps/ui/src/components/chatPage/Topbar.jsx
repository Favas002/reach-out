import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon, BellIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ProfileSection from "../profileView/ProfileSection";
import { useNavigate } from "react-router-dom";

import SearchLoading from "../miscellaneous/SearchLoading";
import SearchList from "../profileView/SearchList";
import axiosInstance from "../../utils/axiosInstance";

const Topbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const { name, pic, token } = user.data;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setloadingChat] = useState("");

  const handleSearch = async () => {
    if (!search) {
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
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosInstance.get(
        `/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setsearchResult(data);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: "No user found",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosInstance.post(
        `/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const LogoutHandler = () => {
    localStorage.removeItem("UserInfo");
    navigate("/");
  };

  return (
    <>
      <Box
        height="50px"
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="5px 15px 5px 15px"
        boxShadow={
          "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;"
        }
        bg={useColorModeValue("#e14d2a", "#181818")}
        borderWidth="1px"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button
            variant="outline"
            onClick={onOpen}
            borderRadius="20px"
            bg={useColorModeValue("#EDF2F7", "#353637")}
          >
            <FontAwesomeIcon icon={faSearch} color="#e14d2a" />
            <Text
              padding="10px"
              color="#e14d2a"
              display={{ base: "none", md: "flex" }}
            >
              Search
            </Text>
          </Button>
        </Tooltip>
        <Text
          padding="15px"
          fontFamily="'Pacifico', cursive;"
          fontSize={{ sm: "25px", md: "30px", lg: "30px" }}
          cursor="default"
          color="white"
        >
          Reach-Out
        </Text>
        <Box display="Flex" alignItems="center" justifyContent="center">
          <Button onClick={toggleColorMode} gap={2} size="sm">
            {colorMode === "light" ? (
              <>
                <MoonIcon color="#e14d2a" /> Dark
              </>
            ) : (
              <>
                <SunIcon color="#e14d2a" /> Light
              </>
            )}
          </Button>
          <Menu>
            <MenuButton margin="20px 20px">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon
                fontSize="2xl"
                color={useColorModeValue("#fff", "#e14d2a")}
              />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new mesage"}
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New message in ${noti.chat.chatName}`
                    : `New message from ${getSender(
                        user.data,
                        noti.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              bg={useColorModeValue("#EDF2F7", "#353637")}
              as={Button}
              varifnotificatiot="outline"
              borderRadius="30px"
              rightIcon={<ChevronDownIcon color="#e14d2a" />}
            >
              <Avatar size="sm" cursor="pointer" name={name} src={pic} />
            </MenuButton>
            <MenuList>
              <ProfileSection user={user.data}>
                <MenuItem gap={2}>
                  <FontAwesomeIcon icon={faUser} color="#e14d2a" />
                  My Profile
                </MenuItem>
              </ProfileSection>

              <MenuDivider />
              <MenuItem onClick={LogoutHandler} gap={2}>
                <FontAwesomeIcon color="#e14d2a" icon={faRightFromBracket} />
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2} flexDirection="row">
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                />
                <Button color="#e14d2a" onClick={handleSearch}>
                  Go
                </Button>
              </Box>
              <Box>
                {loading ? (
                  <SearchLoading />
                ) : (
                  searchResult?.map((user) => (
                    <SearchList
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && <Spinner ml="auto" d="flex" />}
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default Topbar;
