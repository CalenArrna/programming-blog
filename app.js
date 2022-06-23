//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const homeStartingContent = "Hello there, my name is Csaba Nagy. Welcome to my programming blog. Here you can read my little stories from my long journey of programming. I hope you find it as interesting as me!";
const posts = [];

const app = express();
// **** APP CONFIGS ****
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// **** DB CONFIGS ****
const postSchema = new Schema({
  title: String,
  text: String
});

const Post = mongoose.model("Post", postSchema);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.a8w3bum.mongodb.net/CodeBlogDB`);

//**** ENDPOINTS ****
app.get("/", (req, res) => {
  Post.find((error, foundPosts) => {
    if (error) {
      console.log(error);
      res.render("blog", {
        homeStarterData: homeStartingContent,
        posts: posts
      });
    }else {
      res.render("blog", {
        homeStarterData: homeStartingContent,
        posts: foundPosts
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  let newPost = new Post({
    title: req.body.postTitle,
    text: req.body.postText
  });
  newPost.save((err) => {
    if(err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/posts/:postId", (req, res) => {
  let id = req.params.postId;
  Post.findOne({_id: id}, (err, postToShow) => {
    if(err) {
      console.log(err);
      res.redirect("/");
    }else {
      res.render("post", {tPost: postToShow});
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
