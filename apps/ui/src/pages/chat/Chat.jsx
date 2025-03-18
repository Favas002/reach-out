import { Button } from "@chakra-ui/react";

const Chat = () => {
  const handleExit = () => {
    localStorage.removeItem("UserInfo");
    window.location.href = "/";
  };
  return (
    <div style={{ width: "100%" }}>
      <Button onClick={handleExit}>Exit</Button>
    </div>
  );
};
export default Chat;
