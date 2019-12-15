// Required libraries
var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var sessionstorage = require("sessionstorage");
var posting = require("../models/post");
var user = require("../models/user");

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

router.get("/", function(req, res, next) {
  posting.find({}, function(err, data) {
    if (err) throw err;

    res.render("posts", {
      title: "Twitter 2.0",
      post_list: data
    });
  });
});

// Sanitation middleware
// See https://express-validator.github.io/docs/sanitization-chain-api.html
// And https://express-validator.github.io/docs/filter-api.html
router.post(
  "/create",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    var local_content = req.body.content;
    var local_author = req.body.author;
    var checked = req.body.checkbox;

    if (checked === "YES") {
      //local_author = sessionStorage.getItem("loggedInAs");
      local_author = sessionstorage.getItem("loggedInAs");
    }

    var date = new Date();
    var hour = date.getHours() + 2;
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var tunti = String(hour);

    if (hour === "24") {
      hour = "00";
    }
    if (hour === "25") {
      hour = "01";
    }
    var minuutti = String(minute);

    if (minuutti.length === 1) {
      minute = "0" + minuutti;
    }

    var sekuntti = String(second);

    if (sekuntti.length === 1) {
      second = "0" + sekuntti;
    }

    var time = hour + ":" + minute + ":" + second;

    if (local_content && local_author !== "") {
      console.log("We got content: " + local_content);
      console.log("from author: " + local_author);
      var posting1 = posting({
        username: local_author,
        postContent: local_content,
        time: time
      }).save(function(err) {
        if (err) throw err;
        console.log("post added!");
      });
      res.redirect("/posts");
    } else {
      res.redirect("/posts");
    }
  }
);

router.post(
  "/login",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    var local_user = req.body.loginuser;
    var local_password = req.body.loginpassword;

    user.find({}, function(err, data) {
      if (err) throw err;
      var found = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].username === local_user) {
          if (data[i].password === local_password) {
            found++;
          }
        }
      }

      if (found === 0) {
        res.render("index", {
          title: "Twitter 2.0",
          message: "Please check your credentials."
        });
      } else {
        res.redirect("/posts");
        console.log(local_user + " logged in");
        sessionstorage.setItem("loggedInAs", local_user);
      }
    });
  }
);

router.post(
  "/signup",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    var local_user = req.body.signupuser;
    var local_password = req.body.signuppassword;

    if (local_user && local_password !== "") {
      console.log("New user: " + local_user + "signed up.");
      var user1 = user({
        username: local_user,
        password: local_password
      }).save(function(err) {
        if (err) throw err;
        console.log("New user added to database.");
      });
      res.render("index", {
        title: "Twitter 2.0",
        message: "You can now log in"
      });
    }
  }
);

router.post("/logout", function(req, res, next) {
  res.redirect("/");
});

module.exports = router;
