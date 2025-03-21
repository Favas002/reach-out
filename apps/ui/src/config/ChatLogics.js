export const getSender = (loggedUser, users) => {
  // console.log(users[0]._id);
  // console.log(loggedUser._id);
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// *chat logic
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const getSenderImage = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
};

// *message logic
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

// *color logic

export const bg = (chat, selectedChat, colorMode) => {
  if (chat !== selectedChat) {
    return "fff";
  }
  if (colorMode === "light" && chat === selectedChat) {
    return "#EDF2F7";
  } else {
    return "#353637";
  }
};

export const timeconvert = (date) => {
  const d = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[d.getDay()];
  let correctdate = d.getDate();
  let minutes = d.getMinutes();
  let hours = d.getHours();
  hours = hours % 12 || 12;

  return hours + ":" + minutes + "  , " + correctdate + " " + day;
};
