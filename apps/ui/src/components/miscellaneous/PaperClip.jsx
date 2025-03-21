import {
  Box,
  Button,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  faImage,
  faPaperclip,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const PaperClip = ({ setnewMessage, setNewimage, sendMessage }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      setImage(pics);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Reach-Out");
      data.append("cloud_name", "anoosh");
      data.append("folder", "chatImage");

      fetch(import.meta.env.VITE_PUBLIC_CLOUDINARY, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setNewimage(data.url.toString());
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

  const handleClick = async () => {
    sendMessage();
    setImage("");
    onClose();
  };

  return (
    <>
      <IconButton variant="ghost" borderRadius="50%" size="lg" onClick={onOpen}>
        <FontAwesomeIcon icon={faPaperclip} color="#e14d2a" size="lg" />
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
          >
            {image && (
              <Button variant="ghost" onClick={() => setImage("")}>
                Remove
              </Button>
            )}

            {image && (
              <>
                <Image src={image ? URL.createObjectURL(image) : "none"} />
              </>
            )}

            <label htmlFor="file" cursor="pointer">
              {!image && (
                <Box
                  border="1px solid black"
                  boxSize="xs"
                  alignItems="center"
                  display="flex"
                  justifyContent="center"
                  cursor="pointer"
                  _hover={{ color: "lightblue" }}
                >
                  <Tooltip label="Add image">
                    <FontAwesomeIcon icon={faImage} size="2xl" />
                  </Tooltip>
                </Box>
              )}
            </label>
            <Input
              id="file"
              type="file"
              display="none"
              onChange={(event) => postDetails(event.target.files[0])}
            />

            <ModalFooter>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
              >
                <Input
                  variant="outlined"
                  outlineColor="#e14d2a"
                  placeholder="Enter a message.."
                  onChange={(event) => setnewMessage(event.target.value)}
                  w="xs"
                  borderRadius="10px"
                  errorBorderColor="#e14d2a"
                />
                <IconButton
                  varient="solid"
                  border="2px solid #e14d2a"
                  borderRadius="10px"
                  padding="10px"
                  onClick={handleClick}
                  size="lg"
                  m={2}
                  isLoading={loading}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    size="lg"
                    color="#e14d2a"
                  />
                </IconButton>
              </Box>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaperClip;
