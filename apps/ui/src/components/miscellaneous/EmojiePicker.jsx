import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useColorMode,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaugh } from "@fortawesome/free-solid-svg-icons";

const EmojiePicker = ({ setnewMessage, newMessage }) => {
  const { colorMode } = useColorMode();
  const onEmojiSelect = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setnewMessage(newMessage + emoji);
  };

  return (
    <>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton variant="ghost" borderRadius="50%" size="lg">
            <FontAwesomeIcon icon={faFaceLaugh} size="lg" color="#e14d2a" />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />

          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            theme={colorMode === "dark" ? "dark" : "light"}
            categories="[people, nature, foods, activity, places, objects, symbols, flags	]"
            icons="solid"
            previewPosition="top"
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EmojiePicker;
