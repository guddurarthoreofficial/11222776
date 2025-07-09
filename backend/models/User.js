const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  mobileNo: String,
  githubUsername: String,
  rollNo: { type: String, required: true },
  accessCode: { type: String, required: true },
  clientID: { type: String, required: true },
  clientSecret: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
