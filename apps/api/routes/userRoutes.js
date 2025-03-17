const express = require("express");
const {
  registerUser,
  AuthUser,
  allUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUser);
router.route("/login").post(AuthUser);

module.exports = router;
