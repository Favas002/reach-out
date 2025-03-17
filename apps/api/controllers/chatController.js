const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body; //the user id send by current login user

  // current user is user which login and userId is the id of user we want to create chat with
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  // check if the chat exist or create a new one
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //users here is the users array in chat
      { users: { $elemMatch: { $eq: userId } } }, //the two condition must be fullfilled
    ],
  })
    .populate("users", "-password") //the user array in chat is populated with user details
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender", //populate ischat wit huser details
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      //chat data created
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      //chat is uploaded to database and populate created chat user with all user data exept password
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// check which user is logged in query all the chats for that user
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) //find the chat which the login user present
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 }) //sorted the chat lates first
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(result);
      });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const creatGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json([fullGroupChat]);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(400);
    throw new Error("Chat not deleted");
  } else {
    res.json(remove);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  creatGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
