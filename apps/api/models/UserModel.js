const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    Phone: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBxkWPjMhg6KA1wPseVi539U7-kWiB3aRdaGKf1hw6hbTjk18&s",
    },
  },
  { timestamps: true }
);

// compair passwords
userSchema.methods.matchPassword = async function (enterdPass) {
  return await bcrypt.compare(enterdPass, this.password);
};

// hashing

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
