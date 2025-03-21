import { AddIcon, CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";

import axiosInstance from "../../utils/axiosInstance";

const SignUp = ({ click }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [Profile, setProfile] = useState();
  const [pic, setpic] = useState("");
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [ConfirmPass, setConfirmPass] = useState("");

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please seleclt an Image!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setProfile(pics);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Reach-Out");
      data.append("cloud_name", "anoosh");
      fetch(import.meta.env.VITE_PUBLIC_CLOUDINARY, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please seleclt an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };

  const handleClick = async (req, res) => {
    setLoading(true);
    if (!name || !email || !password || !ConfirmPass) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password !== ConfirmPass) {
      toast({
        title: "Your password and confirmation password do not match! ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    } else {
      try {
        const data = await axiosInstance.post("/api/user", {
          name,
          email,
          password,
          pic,
        });
        toast({
          title: "Registration Successfull!",
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
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
    }
  };

  return (
    <Box
      bgColor="#ffffff"
      d="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;"
      borderRadius="20px"
    >
      <Box display="flex" alignItems="center" flexDirection="column" p="20px">
        <Text
          fontSize="3xl"
          fontWeight="600"
          textAlign="center"
          margin="30px"
          color="#182747"
          fontFamily="'Work Sans', sans-serif"
        >
          Sign-Up
        </Text>
        <Box w="300px">
          <FormControl>
            <Image
              src={
                Profile
                  ? URL.createObjectURL(Profile)
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBxkWPjMhg6KA1wPseVi539U7-kWiB3aRdaGKf1hw6hbTjk18&s"
              }
              alt="Dan Abramov"
              w="80px"
              h="80px"
              borderRadius="50px"
              objectFit="cover"
              marginLeft="105px"
              marginBottom="40px"
              border="2px solid #e14d2a"
            />
            <label htmlFor="file">
              <Icon
                position="absolute"
                as={AddIcon}
                border="2px solid black"
                w="20px"
                h="20px"
                padding="2px"
                borderRadius="50%"
                top="58px"
                right="118px"
                bgColor="#e14d2a"
                cursor="pointer"
                _active={{ w: "23px", h: "23px" }}
                _hover={{ border: "1px solid black" }}
              />
            </label>
            <Input
              id="file"
              type="file"
              display="none"
              onChange={(event) => postDetails(event.target.files[0])}
            />
            <Stack spacing={5}>
              <Input
                isRequired
                id="name"
                onChange={(event) => setname(event.target.value)}
                fontFamily="'Work Sans', sans-serif"
                h="50px"
                type="text"
                variant="outline"
                placeholder="Username"
                borderRadius="20px"
                boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset,
                              rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;"
                _hover={{ borderLeft: "3px solid #eb1d36" }}
                _focus={{
                  outline: "outline: 3px solid #eb1d36",
                  border: "none",
                }}
              />
              <Input
                isRequired
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                fontFamily="'Work Sans', sans-serif"
                h="50px"
                type="email"
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
                  id="password"
                  onChange={(event) => setpassword(event.target.value)}
                  fontFamily="'Work Sans', sans-serif"
                  h="50px"
                  type={show ? "text" : "password"}
                  variant="outline"
                  placeholder="password"
                  borderRadius="20px"
                  boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset,
                              rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;"
                  _hover={{ borderLeft: "3px solid #eb1d36" }}
                  _focus={{
                    outline: "outline: 3px solid #eb1d36",
                    border: "none",
                  }}
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
              <InputGroup>
                <Input
                  isRequired
                  id="confirm-pass"
                  onChange={(event) => setConfirmPass(event.target.value)}
                  fontFamily="'Work Sans', sans-serif"
                  h="50px"
                  type={show ? "text" : "password"}
                  variant="outline"
                  placeholder="Confirm Password"
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
              onClick={handleClick}
              isLoading={loading}
              fontFamily="'Work Sans', sans-serif"
              loadingText="logging in"
              colorScheme="teal"
              border="none"
              bgColor="#e14d2a"
              boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"
              borderRadius="20px"
              _hover={{ bgColor: "#FFAD60" }}
              marginTop="35px"
              w="300px"
            >
              SignUp
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
