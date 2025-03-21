import { SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProfileSection = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          color="#e14d2a"
          display={{ base: "flex" }}
          icon={<SettingsIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display="flex"
          alignItems="center"
          justifyContent="center"
          margin="20px"
        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDir="column"
          >
            <Avatar
              size="xl"
              cursor="pointer"
              name={user.name}
              src={user.pic}
              marginTop="20px"
            />
            <ModalHeader fontWeight="bold">{user.name}</ModalHeader>
            <Text fontSize="20px">{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileSection;
