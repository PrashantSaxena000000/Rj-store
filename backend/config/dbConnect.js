const mongoose = require("mongoose");
const color = require("colors");
const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URL);

    console.log("Data base is connected successfully".bgGreen);
  } catch (error) {
    console.log("Database Error".bgRed);
  }
};

module.exports = dbConnect;
