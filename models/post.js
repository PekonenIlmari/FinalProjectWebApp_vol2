const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  username: String,
  postContent: String,
  time: String
});

module.exports = mongoose.model("Post", postSchema);
