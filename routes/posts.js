var express     = require("express"),
    router      = express.Router(),
    Post        = require("../models/post"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//INDEX ROUTE (show all posts)
router.get("/", function(req, res){
  Post.find({}, function(err, allPosts){
    if(err) {
      console.log(err);
    } else {
      res.render("posts/index", {allPosts: allPosts});
    }
  })
});

//CREATE ROUTE (add new post)
router.post("/", middleware.isLoggedIn, function(req, res){
  var submittedPost = req.body.post;
  submittedPost.author = {
    id: req.user._id,
    username: req.user.username
  };
  Post.create(submittedPost, function(err, newPost){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/posts");
    }
  });
});

//NEW ROUTE (form to add post)
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("posts/new");
});

//SHOW ROUTE (view a post)
router.get("/:id", function(req, res){
  Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
    if(err) {
      console.log(err);
    } else {
      res.render("posts/show", {post: foundPost});
    }
  });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
  Post.findById(req.params.id, function(err, foundPost){
    if(err) {
      console.log(err);
    } else {
      res.render("posts/edit", {post: foundPost});
    }
  });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
    if(err) {
      console.log(err);
      res.redirect("/posts");
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
  //Delete Post Comments
  Post.findById(req.params.id, function(err, foundPost){
    if(err) {
      console.log(err);
    } else {
      foundPost.comments.forEach(function(commentID){
        Comment.findByIdAndRemove(commentID, function(err){
          if(err) {
            console.log(err);
          }
        });
      });
    }
  });
  //Delete Post itself
  Post.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      console.log(err);
      res.redirect("/posts");
    } else {
      res.redirect("/posts");
    }
  });
});

module.exports = router;