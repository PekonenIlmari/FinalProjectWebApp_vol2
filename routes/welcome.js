var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var posting = require("../models/post");

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

const mongoose = require("mongoose");
//mongoose.Promise = global.Promise;

var dbUrl =
  "mongodb+srv://dbAdmin:koira123@webapplications-r6ana.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .catch(err => console.log(err));

mongoose.connection
  .once("open", function() {
    console.log("Connected");
  })
  .on("error", function(error) {
    console.log("There's an error", error);
  });

/*var postSchema = new mongoose.Schema({
  username: String,
  postContent: String,
  time: String
});

var posting = mongoose.model("Posti", postSchema);*/

router.get("/", function(req, res, next) {
  posting.find({}, function(err, data) {
    if (err) throw err;

    res.render("welcome", {
      title: "Twitter 2.0",
      post_list: data
    });
  });
});

router.post("/getin", function(req, res, next) {
  res.redirect("/welcome");
});

module.exports = router;
