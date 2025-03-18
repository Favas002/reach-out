import { Icon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (req, res) => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    } else {
      try {
        const data = await axiosInstance.post("/api/user/login", {
          email,
          password,
        });

        toast({
          title: "Login Successfull!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        localStorage.setItem("UserInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chat");
      } catch (err) {
        toast({
          title: "Error occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  };

  return (
    <Container maxW="xxl" centerContent h="100vh" display="flex" gap={50}>
      <Container
        bg="#e14d2a"
        h="50px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="xxl"
        borderRadius="10px"
      >
        <Text
          padding="20px"
          fontFamily="'Pacifico', cursive;"
          fontSize="30px"
          cursor="default"
          color="white"
        >
          Reach-Out
        </Text>
      </Container>

      <Box
        w="350px"
        h="450px"
        mb="20px"
        maxH="600px"
        bgColor="white"
        d="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;"
        borderRadius="20px"
      >
        <Box display="flex" alignItems="center" flexDirection="column">
          <Text
            fontSize="3xl"
            fontWeight="600"
            textAlign="center"
            color="#182747"
            fontFamily="'Work Sans', sans-serif"
            margin="30px"
          >
            Login
          </Text>
          <Box>
            <FormControl>
              <Stack spacing={5}>
                <Input
                  isRequired
                  color="black"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fontFamily="'Work Sans', sans-serif"
                  h="50px"
                  type="text"
                  variant="outline"
                  placeholder="email"
                  borderRadius="20px"
                  boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset,
                              rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;"
                  _hover={{ borderLeft: "3px solid #eb1d36" }}
                  _focus={{
                    outline: "outline: 3px solid #eb1d36",
                    border: "none",
                  }}
                />
                <InputGroup>
                  <Input
                    isRequired
                    color="black"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    fontFamily="'Work Sans', sans-serif"
                    h="50px"
                    type={show ? "text" : "password"}
                    variant="outline"
                    placeholder="Password"
                    borderRadius="20px"
                    boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset,
                  rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;"
                    _hover={{ borderLeft: "3px solid #eb1d36" }}
                  />
                  <InputRightElement width="4.5rem">
                    {show ? (
                      <Icon
                        as={ViewIcon}
                        size="sm"
                        color="#e14d2a"
                        marginTop="10px"
                        marginLeft="20px"
                        onClick={() => setShow(!show)}
                        cursor="pointer"
                        _active={{ color: "black" }}
                      ></Icon>
                    ) : (
                      <Icon
                        as={ViewOffIcon}
                        size="sm"
                        color="#e14d2a"
                        marginTop="10px"
                        marginLeft="20px"
                        onClick={() => setShow(!show)}
                        cursor="pointer"
                        _active={{ color: "black" }}
                      ></Icon>
                    )}
                  </InputRightElement>
                </InputGroup>
              </Stack>
              <Button
                onClick={submitHandler}
                fontFamily="'Work Sans', sans-serif"
                isLoading={loading}
                loadingText="logging in"
                border="none"
                bgColor="#e14d2a"
                boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"
                borderRadius="20px"
                _hover={{ bgColor: "#FFAD60" }}
                marginTop="35px"
                w="300px"
              >
                Login
              </Button>
              <Divider orientation="horizontal" mt="30px" h="5px" />
              <Stack mt="10px">
                <Text textAlign="center" fontSize="12px">
                  Dont have an account?
                </Text>
                <Button
                  variant="solid"
                  bgColor="#3d8361"
                  borderRadius="20px"
                  color="#fff"
                  onClick={onOpen}
                >
                  Create account
                </Button>
              </Stack>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} backdropBlur>
        <ModalOverlay bg="auto" backdropFilter="auto" backdropBlur="10px" />
        <ModalContent
          borderRadius="20px"
          w="350px"
          h="450px"
          bottom={{ base: "none", xl: "50px" }}
        >
          <ModalCloseButton />
          <SignUp click={onClose} />
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Login;
