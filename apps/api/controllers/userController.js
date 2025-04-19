const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/UserModel");

// Register user

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  try {
    const Newuser = new User({
      name,
      email,
      password,
      pic,
    });
    const user = await Newuser.save();

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Auth user

const AuthUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user.email !== email) {
      res.status(400).json("email dont match");
    }
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json("Cedentials not match!");
    }
  } catch (err) {
    res.status(500).json(`Error:${err.message}`);
  }
});

const allUser = asyncHandler(async (req, res) => {
  const { _start, _end, _sort, _order, search, ...filters } = req.query;

  const query = {
    ...filters,
  };

  // Apply search if provided
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Exclude the current user
  if (req.user?._id) {
    query._id = { $ne: req.user._id };
  }

  // Build Mongo sort object
  const sort = {};
  if (_sort && _order) {
    sort[_sort] = _order === "asc" ? 1 : -1;
  }

  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .sort(sort)
    .skip(Number(_start) || 0)
    .limit(Number(_end) - Number(_start) || 10);

  res.set("X-Total-Count", total);
  res.set("Access-Control-Expose-Headers", "X-Total-Count");

  res.status(200).json(users);
});

module.exports = { registerUser, AuthUser, allUser };
