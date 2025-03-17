const mongoose = require("mongoose");
const dotenv = require("dotenv").config;

const ConnectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDb connected to ${con.connection.host}`.blue.underline);
  } catch (err) {
    console.log(`Error:${err.message}`.red.bold);
    process.exit();
  }
};
module.exports = ConnectDB;
