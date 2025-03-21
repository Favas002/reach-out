import { Box, useColorModeValue } from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import Topbar from "../../components/chatPage/Topbar";
import Mychat from "../../components/chatPage/Mychat";
import ChatBox from "../../components/chatPage/ChatBox";
const Chat = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <Topbar />}
      <Box
        display="flex"
        justifyContent="space-around"
        w="100%"
        h="91.5vh"
        bg={useColorModeValue("#EFEFEF", "#3aq3b3c")}
      >
        {user && <Mychat />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
export default Chat;
